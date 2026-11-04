import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { hashPassword } from '../../infrastructure/security/password-hasher';
import {
  buildPagination,
  calculatePaginationMeta,
  isValidRole,
} from '../../application/services/user-management.service';

export function createAdminUsersRouter(pool: Pool): Router {
  const router = Router();

  // 1. DANH SÁCH TOÀN BỘ NGƯỜI DÙNG & QUẢN TRỊ VIÊN KÈM PHÂN TRANG (GET /)
  router.get('/', async (req: Request, res: Response) => {
    const { page, limit, search, role } = req.query;
    const pagination = buildPagination(page as string, limit as string);

    try {
      let query = `
        SELECT u.id, u.phone_number, u.email, u.created_at,
               COALESCE(m.full_name, 'Chưa cập nhật') AS full_name,
               'patient' AS role,
               CASE WHEN u.locked_until > NOW() THEN false ELSE true END AS is_active,
               'users' AS user_type
        FROM users u
        LEFT JOIN family_members m ON u.id = m.user_id AND m.relationship = 'owner'
        UNION ALL
        SELECT a.id, a.username AS phone_number, a.email, a.created_at,
               a.full_name,
               a.role_id AS role,
               a.is_active,
               'admin_users' AS user_type
        FROM admin_users a
      `;

      let filterSql = `SELECT * FROM (${query}) AS combined WHERE 1=1`;
      const params: any[] = [];

      if (search) {
        params.push(`%${search}%`);
        filterSql += ` AND (phone_number ILIKE $${params.length} OR email ILIKE $${params.length} OR full_name ILIKE $${params.length})`;
      }

      if (role && typeof role === 'string' && role !== 'all') {
        params.push(role);
        filterSql += ` AND role = $${params.length}`;
      }

      const countRes = await pool.query(`SELECT COUNT(*) FROM (${filterSql}) AS count_query`, params);
      const total = parseInt(countRes.rows[0].count, 10);

      params.push(pagination.limit);
      params.push(pagination.offset);
      filterSql += ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

      const result = await pool.query(filterSql, params);
      const meta = calculatePaginationMeta(total, pagination.page, pagination.limit);

      return res.json({ success: true, data: result.rows, meta });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 2. THÊM NGƯỜI DÙNG HOẶC QUẢN TRỊ VIÊN MỚI (POST /)
  router.post('/', async (req: Request, res: Response) => {
    const { phoneNumber, email, password, fullName, role = 'patient', facilityId } = req.body;
    if (!phoneNumber || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Vui lòng cung cấp đủ Họ tên, Số điện thoại và Mật khẩu.' },
      });
    }

    try {
      const hash = await hashPassword(password);

      if (role === 'super_admin' || role === 'clinical_admin' || role === 'doctor') {
        const adminRes = await pool.query(
          `INSERT INTO admin_users (username, email, password_hash, full_name, role_id, facility_id, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, true)
           RETURNING id, username, email, full_name, role_id AS role, created_at`,
          [phoneNumber, email || `${phoneNumber}@dhealth.local`, hash, fullName, role, facilityId || null]
        );
        return res.status(201).json({ success: true, data: adminRes.rows[0] });
      }

      // Tạo người dùng bệnh nhân thông thường
      const userRes = await pool.query(
        `INSERT INTO users (phone_number, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, phone_number, email, created_at`,
        [phoneNumber, email || null, hash]
      );
      const newUser = userRes.rows[0];

      const memberId = `mem_${newUser.id.toString().substring(0, 8)}`;
      await pool.query(
        `INSERT INTO family_members (id, user_id, full_name, relationship, gender, birth_date, is_above_18, consent_approved)
         VALUES ($1, $2, $3, 'owner', 'Khác', '1990-01-01', true, true)`,
        [memberId, newUser.id, fullName]
      );

      return res.status(201).json({
        success: true,
        data: { id: newUser.id, fullName, phoneNumber: newUser.phone_number, email: newUser.email, role: 'patient' },
      });
    } catch (err: any) {
      if (err.code === '23505') {
        return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Số điện thoại hoặc Email đã tồn tại.' } });
      }
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 3. SỬA / CẬP NHẬT THÔNG TIN NGƯỜI DÙNG (PUT /:id)
  router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { fullName, email, phoneNumber, isActive } = req.body;

    try {
      // Thử cập nhật trong admin_users trước
      const adminUpdate = await pool.query(
        `UPDATE admin_users
         SET full_name = COALESCE($1, full_name),
             email = COALESCE($2, email),
             is_active = COALESCE($3, is_active),
             updated_at = NOW()
         WHERE id = $4 RETURNING id`,
        [fullName, email, isActive, id]
      );

      if (adminUpdate.rowCount && adminUpdate.rowCount > 0) {
        return res.json({ success: true, message: 'Cập nhật tài khoản Admin thành công.' });
      }

      // Cập nhật người dùng bệnh nhân
      await pool.query(
        `UPDATE users
         SET email = COALESCE($1, email),
             phone_number = COALESCE($2, phone_number),
             locked_until = CASE WHEN $3 = false THEN NOW() + INTERVAL '100 years' ELSE NULL END,
             updated_at = NOW()
         WHERE id = $4`,
        [email, phoneNumber, isActive, id]
      );

      if (fullName) {
        await pool.query(
          `UPDATE family_members
           SET full_name = $1, updated_at = NOW()
           WHERE user_id = $2 AND relationship = 'owner'`,
          [fullName, id]
        );
      }

      return res.json({ success: true, message: 'Cập nhật người dùng thành công.' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 4. CẤP QUYỀN / ĐỔI VAI TRÒ NGƯỜI DÙNG (POST /:id/grant-role)
  router.post('/:id/grant-role', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role, facilityId } = req.body;

    if (!role || !isValidRole(role)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ROLE', message: 'Vai trò chỉ định không hợp lệ.' },
      });
    }

    try {
      // 1. Kiểm tra nếu đã có trong admin_users
      const checkAdmin = await pool.query(`SELECT id FROM admin_users WHERE id = $1`, [id]);
      if (checkAdmin.rowCount && checkAdmin.rowCount > 0) {
        await pool.query(
          `UPDATE admin_users SET role_id = $1, facility_id = $2, updated_at = NOW() WHERE id = $3`,
          [role, facilityId || null, id]
        );
        return res.json({ success: true, message: `Đã cấp quyền ${role} thành công.` });
      }

      // 2. Nếu đang là bệnh nhân trong bảng users -> Thăng cấp lên Admin/Doctor
      const checkUser = await pool.query(
        `SELECT u.id, u.phone_number, u.email, u.password_hash, COALESCE(m.full_name, 'Người dùng') AS full_name
         FROM users u
         LEFT JOIN family_members m ON u.id = m.user_id AND m.relationship = 'owner'
         WHERE u.id = $1`,
        [id]
      );

      if (checkUser.rowCount && checkUser.rowCount > 0) {
        const u = checkUser.rows[0];
        await pool.query(
          `INSERT INTO admin_users (id, username, email, password_hash, full_name, role_id, facility_id, is_active)
           VALUES ($1, $2, COALESCE($3, $2 || '@dhealth.local'), $4, $5, $6, $7, true)
           ON CONFLICT (id) DO UPDATE SET role_id = EXCLUDED.role_id, facility_id = EXCLUDED.facility_id`,
          [u.id, u.phone_number, u.email, u.password_hash, u.full_name, role, facilityId || null]
        );
        return res.json({ success: true, message: `Đã thăng cấp người dùng lên vai trò ${role} thành công.` });
      }

      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy người dùng.' } });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 5. XÓA NGƯỜI DÙNG HOẶC QUẢN TRỊ VIÊN (DELETE /:id) KÈM BẢO VỆ TỰ XÓA
  router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentAdminId = (req as any).user?.userId;

    if (currentAdminId && currentAdminId === id) {
      return res.status(400).json({
        success: false,
        error: { code: 'FORBIDDEN_SELF_DELETE', message: 'Bạn không thể tự xóa tài khoản Admin đang đăng nhập.' },
      });
    }

    try {
      // Kiểm tra và xóa trong admin_users nếu có
      const adminDel = await pool.query(`DELETE FROM admin_users WHERE id = $1 RETURNING id`, [id]);
      if (adminDel.rowCount && adminDel.rowCount > 0) {
        return res.json({ success: true, message: 'Đã xóa tài khoản Quản trị viên thành công.' });
      }

      // Xóa trong users nếu là bệnh nhân
      const userDel = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING id`, [id]);
      if (userDel.rowCount === 0) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy người dùng.' } });
      }
      return res.json({ success: true, message: 'Đã xóa người dùng thành công.' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  return router;
}
