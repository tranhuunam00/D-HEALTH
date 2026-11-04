import { Router, Response } from 'express';
import { Pool } from 'pg';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth-middleware';
import { isValidBloodType } from '../../application/services/user-management.service';

export function createUserProfileRouter(pool: Pool): Router {
  const router = Router();
  router.use(authenticate);

  // 1. LẤY HỒ SƠ CÁ NHÂN VÀ CÁC THÀNH VIÊN GIA ĐÌNH (GET /)
  router.get('/', async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;
    try {
      const userRes = await pool.query(
        `SELECT id, phone_number, email, is_ekyc_verified, created_at FROM users WHERE id = $1`,
        [userId]
      );
      const membersRes = await pool.query(
        `SELECT * FROM family_members WHERE user_id = $1 ORDER BY created_at ASC`,
        [userId]
      );

      return res.json({
        success: true,
        data: {
          user: userRes.rows[0],
          members: membersRes.rows,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 2. CHỈNH SỬA THÔNG TIN TÀI KHOẢN CHÍNH (PUT /)
  router.put('/', async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;
    const { email } = req.body;
    try {
      await pool.query(
        `UPDATE users SET email = COALESCE($1, email), updated_at = NOW() WHERE id = $2`,
        [email, userId]
      );
      return res.json({ success: true, message: 'Cập nhật tài khoản thành công.' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 3. CHỈNH SỬA HỒ SƠ SỨC KHỎE THÀNH VIÊN (PUT /members/:memberId)
  router.put('/members/:memberId', async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;
    const { memberId } = req.params;
    const { fullName, gender, birthDate, bloodType, heightCm, weightKg, avatarUrl } = req.body;

    if (bloodType && !isValidBloodType(bloodType)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_BLOOD_TYPE', message: 'Nhóm máu không hợp lệ (hỗ trợ: A+, A-, B+, B-, AB+, AB-, O+, O-).' },
      });
    }

    try {
      // Xác minh thành viên thuộc về user đang đăng nhập
      const updateRes = await pool.query(
        `UPDATE family_members
         SET full_name = COALESCE($1, full_name),
             gender = COALESCE($2, gender),
             birth_date = COALESCE($3, birth_date),
             blood_type = COALESCE($4, blood_type),
             height_cm = COALESCE($5, height_cm),
             weight_kg = COALESCE($6, weight_kg),
             avatar_url = COALESCE($7, avatar_url),
             updated_at = NOW()
         WHERE id = $8 AND user_id = $9
         RETURNING *`,
        [fullName, gender, birthDate, bloodType, heightCm, weightKg, avatarUrl, memberId, userId]
      );

      if (updateRes.rowCount === 0) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy hồ sơ thành viên.' } });
      }

      return res.json({
        success: true,
        data: updateRes.rows[0],
        message: 'Cập nhật hồ sơ sức khỏe thành công.',
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  return router;
}
