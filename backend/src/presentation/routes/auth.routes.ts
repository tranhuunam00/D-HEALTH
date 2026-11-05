import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { hashPassword, verifyPassword } from '../../infrastructure/security/password-hasher';
import { generateToken } from '../../infrastructure/security/token-provider';
import { authLimiter, registerLimiter } from '../../infrastructure/security/rate-limiters';
import { parseGooglePayload, generateRandomOAuthSecret } from '../../application/services/google-auth.service';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth-middleware';

export function createAuthRouter(pool: Pool): Router {
  const router = Router();

  // Áp dụng Rate Limiting chống Brute-Force (Tối đa 5 lần / 15 phút)
  // 1. ĐĂNG KÝ TÀI KHOẢN (REGISTER)
  router.post('/register', registerLimiter, async (req: Request, res: Response) => {
    const { phoneNumber, email, password, fullName } = req.body;
    if (!phoneNumber || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Vui lòng điền đủ họ tên, số điện thoại và mật khẩu.' },
      });
    }

    try {
      const hash = await hashPassword(password);
      const userRes = await pool.query(
        `INSERT INTO users (phone_number, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, phone_number, email, created_at`,
        [phoneNumber, email || null, hash]
      );
      const newUser = userRes.rows[0];

      // Tự động tạo hồ sơ thành viên chính chủ (Relationship: owner)
      const memberId = `mem_${newUser.id.toString().substring(0, 8)}`;
      await pool.query(
        `INSERT INTO family_members (id, user_id, full_name, relationship, gender, birth_date, is_above_18, consent_approved)
         VALUES ($1, $2, $3, 'owner', 'Khác', '1990-01-01', true, true)`,
        [memberId, newUser.id, fullName]
      );

      const token = generateToken({ userId: newUser.id, role: 'PATIENT', email: newUser.email });
      setAuthCookie(res, token);

      return res.status(201).json({
        success: true,
        data: {
          user: {
            ...newUser,
            phone_number: newUser.phone_number,
            phoneNumber: newUser.phone_number,
            fullName,
            activeMemberId: memberId,
            role: 'patient',
          },
          token,
          activeMemberId: memberId,
        },
      });
    } catch (err: any) {
      if (err.code === '23505') {
        return res.status(409).json({
          success: false,
          error: { code: 'CONFLICT', message: 'Số điện thoại hoặc Email đã được đăng ký.' },
        });
      }
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 2. ĐĂNG NHẬP MẬT KHẨU (LOGIN)
  router.post('/login', authLimiter, async (req: Request, res: Response) => {
    const { identifier, password } = req.body; // identifier: phone hoặc email
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Vui lòng nhập tài khoản và mật khẩu.' },
      });
    }

    try {
      const result = await pool.query(
        `SELECT u.*, fm.id as member_id, fm.full_name, fm.blood_type, fm.height_cm, fm.weight_kg, fm.avatar_url
         FROM users u
         LEFT JOIN family_members fm ON u.id = fm.user_id AND fm.relationship = 'owner'
         WHERE u.phone_number = $1 OR u.email = $1 
         LIMIT 1`,
        [identifier]
      );
      const user = result.rows[0];

      if (!user) {
        return res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Số điện thoại/Email hoặc mật khẩu không đúng.' },
        });
      }

      // Kiểm tra tài khoản có đang bị tạm khóa do nhập sai nhiều lần
      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        return res.status(403).json({
          success: false,
          error: { code: 'ACCOUNT_LOCKED', message: 'Tài khoản đang tạm khóa do nhập sai quá nhiều lần.' },
        });
      }

      const isMatch = await verifyPassword(password, user.password_hash);
      if (!isMatch) {
        await pool.query(`UPDATE users SET failed_attempts = failed_attempts + 1 WHERE id = $1`, [user.id]);
        return res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Số điện thoại/Email hoặc mật khẩu không đúng.' },
        });
      }

      // Reset số lần thử sai
      await pool.query(`UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = $1`, [user.id]);

      // Kiểm tra vai trò từ admin_users nếu có
      let userRole = 'patient';
      try {
        const adminCheck = await pool.query(
          `SELECT role_id FROM admin_users WHERE (username = $1 OR email = $2) AND is_active = true LIMIT 1`,
          [user.phone_number, user.email]
        );
        if (adminCheck.rows.length > 0) {
          userRole = adminCheck.rows[0].role_id === 'super_admin' ? 'super_admin' : 'admin';
        }
      } catch {}

      const token = generateToken({ userId: user.id, role: userRole === 'patient' ? 'PATIENT' : 'ADMIN', email: user.email });
      setAuthCookie(res, token);

      const realPhone = (user.phone_number && !user.phone_number.startsWith('gg_')) ? user.phone_number : null;

      return res.json({
        success: true,
        data: {
          user: {
            ...user,
            id: user.id,
            phone_number: realPhone,
            phoneNumber: realPhone,
            email: user.email,
            fullName: user.full_name || user.email?.split('@')[0] || '',
            avatarUrl: user.avatar_url || null,
            activeMemberId: user.member_id || user.id,
            bloodType: user.blood_type || null,
            heightCm: user.height_cm ? Number(user.height_cm) : null,
            weightKg: user.weight_kg ? Number(user.weight_kg) : null,
            role: userRole,
          },
          token,
          activeMemberId: user.member_id || user.id,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
    }
  });

  // 3. ĐĂNG NHẬP GOOGLE OAUTH (GOOGLE AUTH)
  router.post('/google', async (req: Request, res: Response) => {
    try {
      const profile = parseGooglePayload(req.body);
      let userRes = await pool.query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [profile.email]);
      let user = userRes.rows[0];

      if (!user) {
        // Tự động tạo tài khoản bệnh nhân từ Google profile
        const fakePass = generateRandomOAuthSecret();
        const hash = await hashPassword(fakePass);
        const autoPhone = `gg_${profile.googleId.substring(0, 10)}`;

        const insertRes = await pool.query(
          `INSERT INTO users (phone_number, email, password_hash)
           VALUES ($1, $2, $3)
           RETURNING id, phone_number, email`,
          [autoPhone, profile.email, hash]
        );
        user = insertRes.rows[0];

        // Tạo hồ sơ thành viên chính chủ kèm avatar từ Google
        const memberId = `mem_${user.id.toString().substring(0, 8)}`;
        await pool.query(
          `INSERT INTO family_members (id, user_id, full_name, relationship, gender, birth_date, avatar_url, is_above_18, consent_approved)
           VALUES ($1, $2, $3, 'owner', 'Khác', '1995-01-01', $4, true, true)`,
          [memberId, user.id, profile.fullName, profile.avatarUrl || null]
        );
      }

      const token = generateToken({ userId: user.id, role: 'PATIENT', email: user.email });
      setAuthCookie(res, token);

      const memberRes = await pool.query(
        `SELECT id, full_name, avatar_url, blood_type, height_cm, weight_kg 
         FROM family_members 
         WHERE user_id = $1 AND relationship = 'owner' 
         LIMIT 1`,
        [user.id]
      );
      const owner = memberRes.rows[0];

      if (owner && profile.avatarUrl && profile.avatarUrl.trim()) {
        await pool.query(`UPDATE family_members SET avatar_url = $1 WHERE id = $2`, [profile.avatarUrl.trim(), owner.id]);
        owner.avatar_url = profile.avatarUrl.trim();
      }
      if (owner && profile.fullName && profile.fullName.trim() && profile.fullName !== 'Người dùng Google' && profile.fullName !== 'Bệnh Nhân Google') {
        await pool.query(`UPDATE family_members SET full_name = $1 WHERE id = $2`, [profile.fullName.trim(), owner.id]);
        owner.full_name = profile.fullName.trim();
      }

      const realPhone = (user.phone_number && !user.phone_number.startsWith('gg_')) ? user.phone_number : null;

      return res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            phoneNumber: realPhone,
            fullName: owner?.full_name || profile.fullName,
            avatarUrl: owner?.avatar_url || profile.avatarUrl || null,
            activeMemberId: owner?.id || `mem_${user.id.toString().substring(0, 8)}`,
            bloodType: owner?.blood_type || null,
            heightCm: owner?.height_cm ? Number(owner.height_cm) : null,
            weightKg: owner?.weight_kg ? Number(owner.weight_kg) : null,
            role: 'patient',
          },
          token,
          activeMemberId: owner?.id || `mem_${user.id.toString().substring(0, 8)}`,
        },
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: { code: 'GOOGLE_AUTH_FAILED', message: err.message } });
    }
  });

  // 4. LẤY THÔNG TIN NGƯỜI DÙNG ĐANG ĐĂNG NHẬP (ME)
  router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = await pool.query(
        `SELECT u.id, u.phone_number, u.email, u.is_ekyc_verified, u.created_at,
                fm.id as member_id, fm.full_name, fm.blood_type, fm.height_cm, fm.weight_kg, fm.avatar_url 
         FROM users u
         LEFT JOIN family_members fm ON u.id = fm.user_id AND fm.relationship = 'owner'
         WHERE u.id = $1`,
        [req.user?.userId]
      );
      if (!result.rows[0]) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy tài khoản.' } });
      }
      const row = result.rows[0];
      const realPhone = (row.phone_number && !row.phone_number.startsWith('gg_')) ? row.phone_number : null;
      let userRole = 'patient';
      try {
        const adminCheck = await pool.query(
          `SELECT role_id FROM admin_users WHERE (username = $1 OR email = $2) AND is_active = true LIMIT 1`,
          [row.phone_number, row.email]
        );
        if (adminCheck.rows.length > 0) {
          userRole = adminCheck.rows[0].role_id === 'super_admin' ? 'super_admin' : 'admin';
        }
      } catch {}

      return res.json({
        success: true,
        data: {
          ...row,
          id: row.id,
          phone_number: realPhone,
          phoneNumber: realPhone,
          email: row.email,
          fullName: row.full_name || row.email?.split('@')[0] || '',
          avatarUrl: row.avatar_url || null,
          activeMemberId: row.member_id || row.id,
          bloodType: row.blood_type || null,
          heightCm: row.height_cm ? Number(row.height_cm) : null,
          weightKg: row.weight_kg ? Number(row.weight_kg) : null,
          isEkycVerified: row.is_ekyc_verified,
          role: userRole,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 5. ĐĂNG XUẤT (LOGOUT)
  router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('dhealth_token');
    return res.json({ success: true, message: 'Đăng xuất thành công.' });
  });

  return router;
}

/**
 * Gắn cookie JWT bảo mật theo chuẩn Web Security Auditor
 */
function setAuthCookie(res: Response, token: string): void {
  res.cookie('dhealth_token', token, {
    httpOnly: true, // Chống XSS đọc trộm
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Chống CSRF
    maxAge: 12 * 60 * 60 * 1000, // 12 tiếng
  });
}
