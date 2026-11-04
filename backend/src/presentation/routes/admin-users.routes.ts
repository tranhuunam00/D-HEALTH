import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { hashPassword } from '../../infrastructure/security/password-hasher';
import { buildPagination, calculatePaginationMeta } from '../../application/services/user-management.service';

export function createAdminUsersRouter(pool: Pool): Router {
  const router = Router();

  // 1. DANH SÁCH NGƯỜI DÙNG KÈM PHÂN TRANG & TÌM KIẾM (GET /)
  router.get('/', async (req: Request, res: Response) => {
    const { page, limit, search, role } = req.query;
    const pagination = buildPagination(page as string, limit as string);

    try {
      let query = `
        SELECT u.id, u.phone_number, u.email, u.created_at, u.failed_attempts,
               COALESCE(m.full_name, 'Chưa cập nhật') AS full_name,
               'PATIENT' AS role,
               CASE WHEN u.locked_until > NOW() THEN false ELSE true END AS is_active
        FROM users u
        LEFT JOIN family_members m ON u.id = m.user_id AND m.relationship = 'owner'
        WHERE 1=1
      `;
      const params: any[] = [];

      if (search) {
        params.push(`%${search}%`);
        query += ` AND (u.phone_number ILIKE $${params.length} OR u.email ILIKE $${params.length} OR m.full_name ILIKE $${params.length})`;
      }

      // Đếm tổng số bản ghi phục vụ phân trang
      const countRes = await pool.query(`SELECT COUNT(*) FROM (${query}) AS total_query`, params);
      const total = parseInt(countRes.rows[0].count, 10);

      // Thêm ORDER BY & LIMIT OFFSET
      params.push(pagination.limit);
      params.push(pagination.offset);
      query += ` ORDER BY u.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

      const result = await pool.query(query, params);
      const meta = calculatePaginationMeta(total, pagination.page, pagination.limit);

      return res.json({ success: true, data: result.rows, meta });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 2. THÊM NGƯỜI DÙNG HOẶC ADMIN MỚI (POST /)
  router.post('/', async (req: Request, res: Response) => {
    const { phoneNumber, email, password, fullName, role = 'PATIENT' } = req.body;
    if (!phoneNumber || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Vui lòng cung cấp đủ Họ tên, Số điện thoại và Mật khẩu.' },
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

      // Tạo hồ sơ thành viên chính chủ
      const memberId = `mem_${newUser.id.toString().substring(0, 8)}`;
      await pool.query(
        `INSERT INTO family_members (id, user_id, full_name, relationship, gender, birth_date, is_above_18, consent_approved)
         VALUES ($1, $2, $3, 'owner', 'Khác', '1990-01-01', true, true)`,
        [memberId, newUser.id, fullName]
      );

      return res.status(201).json({
        success: true,
        data: { id: newUser.id, fullName, phoneNumber: newUser.phone_number, email: newUser.email, role },
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
      // Cập nhật bảng users
      await pool.query(
        `UPDATE users
         SET email = COALESCE($1, email),
             phone_number = COALESCE($2, phone_number),
             locked_until = CASE WHEN $3 = false THEN NOW() + INTERVAL '100 years' ELSE NULL END,
             updated_at = NOW()
         WHERE id = $4`,
        [email, phoneNumber, isActive, id]
      );

      // Cập nhật họ tên thành viên chính chủ
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

  // 4. XÓA NGƯỜI DÙNG BỆNH NHÂN (DELETE /:id)
  router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const deleteRes = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING id`, [id]);
      if (deleteRes.rowCount === 0) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy người dùng.' } });
      }
      return res.json({ success: true, message: 'Đã xóa người dùng thành công.' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 5. XÓA TÀI KHOẢN ADMIN (DELETE /admin-users/:id) KÈM CƠ CHẾ BẢO VỆ
  router.delete('/admin-users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentAdminId = (req as any).user?.userId;

    if (currentAdminId && currentAdminId === id) {
      return res.status(400).json({
        success: false,
        error: { code: 'FORBIDDEN_SELF_DELETE', message: 'Bạn không thể tự xóa tài khoản Admin đang đăng nhập.' },
      });
    }

    try {
      const deleteRes = await pool.query(`DELETE FROM admin_users WHERE id = $1 RETURNING id`, [id]);
      if (deleteRes.rowCount === 0) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy tài khoản admin.' } });
      }
      return res.json({ success: true, message: 'Đã xóa tài khoản Admin thành công.' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  return router;
}
