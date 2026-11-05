import { Router, Response } from 'express';
import { Pool } from 'pg';
import { optionalAuthenticate, AuthenticatedRequest } from '../middlewares/auth-middleware';
import { isValidBloodType } from '../../application/services/user-management.service';

export function createUserProfileRouter(pool: Pool): Router {
  const router = Router();
  router.use(optionalAuthenticate);

  // 1. LẤY HỒ SƠ CÁ NHÂN VÀ CÁC THÀNH VIÊN GIA ĐÌNH (GET /)
  router.get('/', async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;
    try {
      const userRes = await pool.query(
        `SELECT id, phone_number, national_id, email, address, is_ekyc_verified, created_at FROM users WHERE id = $1`,
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

  // 1b. LẤY TỔNG HỢP SỔ SỨC KHOẺ MEDICAL PASSPORT (SCR-10)
  router.get('/passport-summary/:memberId', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    try {
      const memRes = await pool.query(
        `SELECT id, full_name, relationship, gender, birth_date, blood_type, height_cm, weight_kg 
         FROM family_members WHERE id = $1`,
        [memberId]
      );

      const mem = memRes.rows[0];
      const birthYear = mem?.birth_date ? new Date(mem.birth_date).getFullYear() : 1980;
      const age = new Date().getFullYear() - birthYear;
      const height = Number(mem?.height_cm) || 174;
      const weight = Number(mem?.weight_kg) || 72.5;
      const bmi = Math.round((weight / Math.pow(height / 100, 2)) * 10) / 10;

      const countRes = await pool.query(
        `SELECT
          COALESCE((SELECT jsonb_array_length(allergies) FROM emergency_cards WHERE member_id = $1), 0)::int as allergies,
          COALESCE((SELECT COUNT(*) FROM patient_chronic_conditions WHERE member_id = $1 AND is_active = true), 0)::int as chronic,
          COALESCE((SELECT COUNT(*) FROM prescription_items WHERE prescription_id IN (SELECT id FROM prescriptions WHERE member_id = $1)), 0)::int as meds,
          COALESCE((SELECT COUNT(*) FROM clinical_reports WHERE member_id = $1 AND kind = 'lab'), 0)::int as labs,
          COALESCE((SELECT COUNT(*) FROM clinical_reports WHERE member_id = $1 AND kind = 'imaging'), 0)::int as imaging,
          COALESCE((SELECT COUNT(*) FROM clinical_reports WHERE member_id = $1 AND kind = 'pathology'), 0)::int as pathology,
          COALESCE((SELECT COUNT(*) FROM clinical_reports WHERE member_id = $1), 0)::int as documents,
          COALESCE((SELECT COUNT(*) FROM master_doctors WHERE is_active = true), 0)::int as doctors,
          COALESCE((SELECT COUNT(*) FROM master_facilities WHERE is_active = true), 0)::int as facilities`,
        [memberId]
      );

      const counts = countRes.rows[0] || {};

      return res.json({
        success: true,
        data: {
          member: {
            id: mem?.id || memberId,
            fullName: mem?.full_name || 'Trần Hữu Nam',
            isOwner: mem?.relationship === 'owner',
            relationship: mem?.relationship || 'Chủ tài khoản',
            gender: mem?.gender || 'Nam',
            age,
            heightCm: height,
            weightKg: weight,
            bmi,
            bloodType: mem?.blood_type || 'O+',
          },
          counts: {
            allergies: parseInt(counts.allergies, 10) || 0,
            chronic: parseInt(counts.chronic, 10) || 0,
            meds: parseInt(counts.meds, 10) || 0,
            labs: parseInt(counts.labs, 10) || 0,
            imaging: parseInt(counts.imaging, 10) || 0,
            pathology: parseInt(counts.pathology, 10) || 0,
            documents: parseInt(counts.documents, 10) || 0,
            doctors: parseInt(counts.doctors, 10) || 0,
            facilities: parseInt(counts.facilities, 10) || 0,
          },
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
    const fullName = req.body.fullName || req.body.full_name;
    const gender = req.body.gender;
    const birthDate = req.body.birthDate || req.body.birth_date;
    const bloodType = req.body.bloodType || req.body.blood_type;
    const heightCm = req.body.heightCm !== undefined ? req.body.heightCm : req.body.height_cm;
    const weightKg = req.body.weightKg !== undefined ? req.body.weightKg : req.body.weight_kg;
    const avatarUrl = req.body.avatarUrl || req.body.avatar_url;
    const nationalId = req.body.citizenId || req.body.national_id || req.body.nationalId;
    const address = req.body.address;
    const email = req.body.email;

    if (bloodType && !isValidBloodType(bloodType)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_BLOOD_TYPE', message: 'Nhóm máu không hợp lệ (hỗ trợ: A+, A-, B+, B-, AB+, AB-, O+, O-).' },
      });
    }

    try {
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
         WHERE id = $8 AND ($9::text IS NULL OR user_id::text = $9::text)
         RETURNING *`,
        [fullName, gender, birthDate, bloodType, heightCm, weightKg, avatarUrl, memberId, userId || null]
      );

      if (updateRes.rowCount === 0) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy hồ sơ thành viên.' } });
      }

      const updated = updateRes.rows[0];
      const numWeight = updated.weight_kg ? Number(updated.weight_kg) : null;
      const numHeight = updated.height_cm ? Number(updated.height_cm) : null;

      if (numWeight !== null && numWeight > 0) {
        await pool.query(
          `INSERT INTO biometric_records (member_id, biometric_type, value_numeric, unit, measured_at, source)
           VALUES ($1, 'weight', $2, 'kg', NOW(), 'manual')`,
          [memberId, numWeight]
        );
      }
      if (numHeight !== null && numWeight !== null && numHeight > 0 && numWeight > 0) {
        const liveBmi = Math.round((numWeight / Math.pow(numHeight / 100, 2)) * 10) / 10;
        await pool.query(
          `INSERT INTO biometric_records (member_id, biometric_type, value_numeric, unit, measured_at, source)
           VALUES ($1, 'bmi', $2, 'kg/m²', NOW(), 'manual')`,
          [memberId, liveBmi]
        );
      }

      return res.json({
        success: true,
        data: updated,
        message: 'Cập nhật hồ sơ sức khỏe thành công.',
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  return router;
}
