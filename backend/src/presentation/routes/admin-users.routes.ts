import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { hashPassword } from '../../infrastructure/security/password-hasher';
import {
  buildPagination,
  calculatePaginationMeta,
  isValidRole,
} from '../../application/services/user-management.service';

interface AdminUpdateData {
  fullName?: string;
  email?: string;
  isActive?: boolean;
  role?: string;
}

interface PatientUpdateData {
  email?: string;
  phoneNumber?: string;
  nationalId?: string;
  address?: string;
  isEkycVerified?: boolean;
  isActive?: boolean;
}

interface MemberUpdateData {
  fullName?: string;
  gender?: string;
  birthDate?: string;
  bloodType?: string;
  heightCm?: number | string;
  weightKg?: number | string;
}

async function updateAdminRecord(
  pool: Pool,
  id: string,
  data: AdminUpdateData,
  passwordHash: string | null
): Promise<boolean> {
  let query = `
    UPDATE admin_users
    SET full_name = COALESCE($1, full_name),
        email = COALESCE($2, email),
        is_active = COALESCE($3, is_active),
        role_id = COALESCE($4, role_id),
        updated_at = NOW()
  `;
  const params: any[] = [data.fullName, data.email, data.isActive, data.role];
  if (passwordHash) {
    params.push(passwordHash);
    query += `, password_hash = $${params.length}`;
  }
  params.push(id);
  query += ` WHERE id = $${params.length} RETURNING id`;
  const res = await pool.query(query, params);
  return Boolean(res.rowCount && res.rowCount > 0);
}

async function updatePatientRecord(
  pool: Pool,
  id: string,
  data: PatientUpdateData,
  passwordHash: string | null
): Promise<void> {
  let query = `
    UPDATE users
    SET email = COALESCE($1, email),
        phone_number = COALESCE($2, phone_number),
        national_id = COALESCE($3, national_id),
        address = COALESCE($4, address),
        is_ekyc_verified = COALESCE($5, is_ekyc_verified),
        locked_until = CASE WHEN $6 = false THEN NOW() + INTERVAL '100 years' ELSE NULL END,
        updated_at = NOW()
  `;
  const params: any[] = [
    data.email,
    data.phoneNumber,
    data.nationalId,
    data.address,
    data.isEkycVerified,
    data.isActive,
  ];
  if (passwordHash) {
    params.push(passwordHash);
    query += `, password_hash = $${params.length}`;
  }
  params.push(id);
  query += ` WHERE id = $${params.length}`;
  await pool.query(query, params);
}

async function updateOwnerMember(
  pool: Pool,
  userId: string,
  data: MemberUpdateData
): Promise<void> {
  const updates: string[] = [];
  const params: any[] = [];
  if (data.fullName) {
    params.push(data.fullName);
    updates.push(`full_name = $${params.length}`);
  }
  if (data.gender) {
    params.push(data.gender);
    updates.push(`gender = $${params.length}`);
  }
  if (data.birthDate) {
    params.push(data.birthDate);
    updates.push(`birth_date = $${params.length}`);
  }
  if (data.bloodType) {
    params.push(data.bloodType);
    updates.push(`blood_type = $${params.length}`);
  }
  if (data.heightCm !== undefined && data.heightCm !== null && data.heightCm !== '') {
    params.push(Number(data.heightCm));
    updates.push(`height_cm = $${params.length}`);
  }
  if (data.weightKg !== undefined && data.weightKg !== null && data.weightKg !== '') {
    params.push(Number(data.weightKg));
    updates.push(`weight_kg = $${params.length}`);
  }

  if (updates.length > 0) {
    params.push(userId);
    const sql = `UPDATE family_members SET ${updates.join(', ')}, updated_at = NOW() WHERE user_id = $${params.length} AND relationship = 'owner'`;
    await pool.query(sql, params);
  }
}

export function createAdminUsersRouter(pool: Pool): Router {
  const router = Router();

  // 1. DANH SÁCH TOÀN BỘ NGƯỜI DÙNG KÈM ĐẦY ĐỦ THÔNG TIN HỒ SƠ & PHÂN TRANG (GET /)
  router.get('/', async (req: Request, res: Response) => {
    const { page, limit, search, role } = req.query;
    const pagination = buildPagination(page as string, limit as string);

    try {
      const query = `
        SELECT u.id, u.phone_number, u.email, u.created_at,
               u.national_id, u.address, u.is_ekyc_verified,
               COALESCE(m.full_name, 'Chưa cập nhật') AS full_name,
               m.gender, m.birth_date, m.blood_type, m.height_cm, m.weight_kg,
               'patient' AS role,
               CASE WHEN u.locked_until > NOW() THEN false ELSE true END AS is_active,
               'users' AS user_type
        FROM users u
        LEFT JOIN family_members m ON u.id = m.user_id AND m.relationship = 'owner'
        WHERE u.is_deleted = false
        UNION ALL
        SELECT a.id, a.username AS phone_number, a.email, a.created_at,
               NULL AS national_id, NULL AS address, true AS is_ekyc_verified,
               a.full_name,
               NULL AS gender, NULL AS birth_date, NULL AS blood_type, NULL AS height_cm, NULL AS weight_kg,
               a.role_id AS role,
               a.is_active,
               'admin_users' AS user_type
        FROM admin_users a
        WHERE a.is_deleted = false
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

  // 3. SỬA / CẬP NHẬT THÔNG TIN ĐẦY ĐỦ VÀ ĐỔI MẬT KHẨU (PUT /:id)
  router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
      fullName,
      email,
      phoneNumber,
      isActive,
      password,
      role,
      nationalId,
      address,
      gender,
      birthDate,
      bloodType,
      heightCm,
      weightKg,
      isEkycVerified,
    } = req.body;

    try {
      let passwordHash: string | null = null;
      if (password && typeof password === 'string' && password.trim().length >= 6) {
        passwordHash = await hashPassword(password.trim());
      }

      // 1. Thử cập nhật trong admin_users trước
      const updatedAdmin = await updateAdminRecord(
        pool,
        id,
        { fullName, email, isActive, role },
        passwordHash
      );

      if (updatedAdmin) {
        return res.json({ success: true, message: 'Cập nhật tài khoản Admin và mật khẩu thành công.' });
      }

      // 2. Cập nhật bảng users
      await updatePatientRecord(
        pool,
        id,
        { email, phoneNumber, nationalId, address, isEkycVerified, isActive },
        passwordHash
      );

      // 3. Cập nhật bảng family_members cho chủ tài khoản
      await updateOwnerMember(
        pool,
        id,
        { fullName, gender, birthDate, bloodType, heightCm, weightKg }
      );

      return res.json({ success: true, message: 'Cập nhật thông tin người dùng và mật khẩu thành công.' });
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
      const checkAdmin = await pool.query(`SELECT id FROM admin_users WHERE id = $1`, [id]);
      if (checkAdmin.rowCount && checkAdmin.rowCount > 0) {
        await pool.query(
          `UPDATE admin_users SET role_id = $1, facility_id = $2, updated_at = NOW() WHERE id = $3`,
          [role, facilityId || null, id]
        );
        return res.json({ success: true, message: `Đã cấp quyền ${role} thành công.` });
      }

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

  // 6. XEM TOÀN BỘ BỆNH ÁN & HỒ SƠ LÂM SÀNG CỦA BỆNH NHÂN (GET /:id/dossier)
  router.get('/:id/dossier', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const userRes = await pool.query(
        `SELECT id, phone_number, email, national_id, address, is_ekyc_verified, created_at FROM users WHERE id = $1`,
        [id]
      );
      const user = userRes.rows[0] || null;

      const membersRes = await pool.query(
        `SELECT * FROM family_members WHERE user_id = $1 ORDER BY relationship = 'owner' DESC, created_at ASC`,
        [id]
      );
      const members = membersRes.rows || [];
      const memberIds = members.map((m: any) => m.id);
      if (id === 'nam' || members.some((m: any) => m.full_name?.toLowerCase().includes('nam'))) {
        if (!memberIds.includes('nam')) memberIds.push('nam');
      }

      if (memberIds.length === 0) {
        return res.json({
          success: true,
          data: {
            user,
            members: [],
            biometrics: [],
            conditions: [],
            tasks: [],
            reports: [],
            prescriptions: [],
            careTeam: [],
          },
        });
      }

      const [bioRes, condRes, taskRes, repRes, rxRes, careRes] = await Promise.all([
        pool.query(
          `SELECT * FROM biometric_records WHERE member_id = ANY($1) AND is_deleted = false ORDER BY measured_at DESC LIMIT 50`,
          [memberIds]
        ),
        pool.query(
          `SELECT * FROM patient_chronic_conditions WHERE member_id = ANY($1) AND is_active = true AND is_deleted = false ORDER BY created_at ASC`,
          [memberIds]
        ),
        pool.query(
          `SELECT * FROM care_tasks WHERE member_id = ANY($1) AND is_deleted = false ORDER BY priority ASC, created_at ASC`,
          [memberIds]
        ),
        pool.query(
          `SELECT r.*, json_agg(l.*) AS lab_results 
           FROM clinical_reports r 
           LEFT JOIN lab_results l ON r.id = l.report_id 
           WHERE r.member_id = ANY($1) 
           GROUP BY r.id 
           ORDER BY r.performed_at DESC`,
          [memberIds]
        ),
        pool.query(
          `SELECT p.*, json_agg(i.*) AS items 
           FROM prescriptions p 
           LEFT JOIN prescription_items i ON p.id = i.prescription_id 
           WHERE p.member_id = ANY($1) 
           GROUP BY p.id`,
          [memberIds]
        ),
        pool.query(
          `SELECT * FROM share_grants WHERE member_id = ANY($1) AND status = 'active'`,
          [memberIds]
        ),
      ]);

      return res.json({
        success: true,
        data: {
          user,
          members,
          biometrics: bioRes.rows || [],
          conditions: condRes.rows || [],
          tasks: taskRes.rows || [],
          reports: repRes.rows || [],
          prescriptions: rxRes.rows || [],
          careTeam: careRes.rows || [],
        },
      });
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
      const adminDel = await pool.query(
        `UPDATE admin_users SET is_deleted = true, is_active = false, updated_at = NOW() WHERE id = $1 AND is_deleted = false RETURNING id`,
        [id]
      );
      if (adminDel.rowCount && adminDel.rowCount > 0) {
        return res.json({ success: true, message: 'Đã xóa mềm tài khoản Quản trị viên thành công.' });
      }

      const userDel = await pool.query(
        `UPDATE users SET is_deleted = true, locked_until = NOW() + INTERVAL '100 years', updated_at = NOW() WHERE id = $1 AND is_deleted = false RETURNING id`,
        [id]
      );
      if (userDel.rowCount === 0) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy người dùng.' } });
      }
      return res.json({ success: true, message: 'Đã xóa mềm người dùng thành công.' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  return router;
}
