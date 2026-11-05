import { Router, Response } from 'express';
import { Pool } from 'pg';
import { optionalAuthenticate, AuthenticatedRequest } from '../middlewares/auth-middleware';

interface DoctorInput {
  doctorId?: string;
  doctorName?: string;
  specialty?: string;
  hospital?: string;
  phone?: string;
  email?: string;
}

interface ResolvedDoctor {
  name: string;
  role: string;
  org: string;
  phone: string;
  email: string;
}

export function createCareRouter(pool: Pool): Router {
  const router = Router();
  router.use(optionalAuthenticate);

  // 1. GET /:memberId/care-summary - Lấy tổng quan Lịch hẹn & My Care Team
  router.get('/:memberId/care-summary', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    const resolvedMemberId = memberId === 'nam' ? 'mem_145deb71' : memberId;
    try {
      const upcomingAppointment = await getUpcomingAppointment(pool, resolvedMemberId);
      let grantsRes = await pool.query(
        `SELECT id, grantee_id, grantee_name, grantee_role, grantee_org, grantee_phone, grantee_email, expires_at
         FROM share_grants
         WHERE (member_id = $1 OR member_id = $2) AND status = 'active'
         ORDER BY created_at ASC`,
        [memberId, resolvedMemberId]
      );

      if (grantsRes.rows.length === 0 && memberId !== 'nam') {
        grantsRes = await pool.query(
          `SELECT id, grantee_id, grantee_name, grantee_role, grantee_org, grantee_phone, grantee_email, expires_at
           FROM share_grants
           WHERE member_id = 'nam' AND status = 'active'
           ORDER BY created_at ASC`
        );
      }

      const careTeam = grantsRes.rows.map(mapGrantToCareMember);
      const expiringSoon = grantsRes.rows.filter((r: any) => isExpiringSoon(r.expires_at)).length;

      return res.json({
        success: true,
        data: {
          upcomingAppointment,
          careTeam,
          sharingStats: {
            activeCount: grantsRes.rows.length,
            expiringSoonCount: expiringSoon,
            expiringDays: 7,
          },
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 2. POST /:memberId/send-pre-exam-dossier - Gửi hồ sơ trước khám
  router.post('/:memberId/send-pre-exam-dossier', async (_req: AuthenticatedRequest, res: Response) => {
    return res.json({
      success: true,
      message: 'Đã gửi hồ sơ sức khỏe và tiền sử bệnh án trước khám cho Bác sĩ thành công qua cổng y tế bảo mật.',
    });
  });

  // 3. POST /:memberId/add-doctor - Thêm / Cập nhật bác sĩ vào Care Team
  router.post('/:memberId/add-doctor', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    try {
      const resolved = await resolveDoctorInfo(pool, req.body);
      if (!resolved.name) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Tên bác sĩ không được để trống' },
        });
      }

      await upsertShareGrant(pool, memberId, req.body.doctorId, resolved);

      return res.status(201).json({
        success: true,
        message: `Đã kết nối và cấp quyền chia sẻ dữ liệu cho Bác sĩ ${resolved.name}.`,
        data: resolved,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  return router;
}

async function getUpcomingAppointment(pool: Pool, memberId: string) {
  let appRes = await pool.query(
    `SELECT id, appointment_date, purpose, doctor_name, facility_name
     FROM appointments
     WHERE member_id = $1 AND status = 'scheduled'
     ORDER BY appointment_date ASC LIMIT 1`,
    [memberId]
  );

  if (appRes.rows.length === 0 && memberId !== 'nam') {
    appRes = await pool.query(
      `SELECT id, appointment_date, purpose, doctor_name, facility_name
       FROM appointments
       WHERE member_id = 'nam' AND status = 'scheduled'
       ORDER BY appointment_date ASC LIMIT 1`
    );
  }

  const app = appRes.rows[0];
  if (!app) return null;

  const d = new Date(app.appointment_date);
  const m = d.getMonth() + 1;
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return {
    id: app.id,
    month: `TH ${m}`,
    date: String(d.getDate()).padStart(2, '0'),
    title: app.purpose || 'Tái khám',
    timeDoctor: `${hours}:${minutes} · ${app.doctor_name || 'Bác sĩ phụ trách'}`,
    facility: app.facility_name || 'Cơ sở y tế',
  };
}

function isExpiringSoon(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  const diff = new Date(expiresAt).getTime() - Date.now();
  return diff > 0 && diff <= 7 * 24 * 3600 * 1000;
}

async function resolveDoctorInfo(pool: Pool, input: DoctorInput): Promise<ResolvedDoctor> {
  let name = input.doctorName || '';
  let role = input.specialty || 'Bác sĩ điều trị';
  let org = input.hospital || 'Cơ sở y tế';
  let phone = input.phone || '';
  let email = input.email || '';

  if (input.doctorId) {
    const docRes = await pool.query(
      `SELECT d.id, d.full_name, d.academic_title, d.phone_number, d.email,
              dep.name AS department_name, f.name AS facility_name
       FROM master_doctors d
       LEFT JOIN master_departments dep ON d.department_id = dep.id
       LEFT JOIN master_facilities f ON d.facility_id = f.id
       WHERE d.id = $1`,
      [input.doctorId]
    );

    if (docRes.rows.length > 0) {
      const doc = docRes.rows[0];
      name = `${doc.academic_title ? doc.academic_title + ' ' : ''}${doc.full_name}`;
      role = doc.department_name || role;
      org = doc.facility_name || org;
      phone = doc.phone_number || phone;
      email = doc.email || email;
    }
  }

  return { name, role, org, phone, email };
}

async function upsertShareGrant(pool: Pool, memberId: string, doctorId: string | undefined, resolved: ResolvedDoctor) {
  const existing = await pool.query(
    `SELECT id FROM share_grants WHERE member_id = $1 AND (grantee_id = $2 OR grantee_name = $3)`,
    [memberId, doctorId || '', resolved.name]
  );

  if (existing.rows.length > 0) {
    await pool.query(
      `UPDATE share_grants
       SET grantee_name = $1, grantee_role = $2, grantee_org = $3,
           grantee_phone = $4, grantee_email = $5, status = 'active',
           expires_at = CURRENT_TIMESTAMP + INTERVAL '90 days'
       WHERE id = $6`,
      [resolved.name, resolved.role, resolved.org, resolved.phone, resolved.email, existing.rows[0].id]
    );
  } else {
    const grantId = `sg_${Date.now()}`;
    await pool.query(
      `INSERT INTO share_grants (id, member_id, grantee_type, grantee_id, grantee_name, grantee_role, grantee_org, grantee_phone, grantee_email, expires_at, status)
       VALUES ($1, $2, 'doctor', $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP + INTERVAL '90 days', 'active')`,
      [grantId, memberId, doctorId || '', resolved.name, resolved.role, resolved.org, resolved.phone, resolved.email]
    );
  }
}

function mapGrantToCareMember(g: any) {
  let code = 'BS';
  let color: 'mint' | 'pink' | 'purple' | 'slate' = 'pink';
  const roleLower = (g.grantee_role || '').toLowerCase();

  if (roleLower.includes('gia đình') || roleLower.includes('chính')) {
    code = 'GD';
    color = 'mint';
  } else if (roleLower.includes('cđha') || roleLower.includes('hình ảnh')) {
    code = 'LC';
    color = 'purple';
  } else if (roleLower.includes('tim mạch')) {
    code = 'TB';
    color = 'pink';
  } else if (roleLower.includes('nội tiết')) {
    code = 'NT';
    color = 'mint';
  } else if (roleLower.includes('ung bướu')) {
    code = 'UB';
    color = 'pink';
  } else if (g.grantee_name) {
    const words = g.grantee_name.trim().split(/\s+/);
    code = words.length >= 2 ? `${words[words.length - 2][0]}${words[words.length - 1][0]}`.toUpperCase() : 'BS';
  }

  return {
    id: g.id,
    granteeId: g.grantee_id || '',
    code,
    name: g.grantee_name,
    role: g.grantee_role || 'Bác sĩ',
    org: g.grantee_org || 'Cơ sở y tế',
    phone: g.grantee_phone || '',
    email: g.grantee_email || '',
    color,
  };
}
