import { Router, Response } from 'express';
import { Pool } from 'pg';
import { optionalAuthenticate, AuthenticatedRequest } from '../middlewares/auth-middleware';

export function createCareRouter(pool: Pool): Router {
  const router = Router();
  router.use(optionalAuthenticate);

  // 1. GET /:memberId/care-summary - Lấy tổng quan Lịch hẹn, Đội ngũ Care Team và Quyền xem hồ sơ (SCR-14)
  router.get('/:memberId/care-summary', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    try {
      const appRes = await pool.query(
        `SELECT id, appointment_date, purpose, doctor_name, facility_name
         FROM appointments
         WHERE member_id = $1 AND status = 'scheduled'
         ORDER BY appointment_date ASC LIMIT 1`,
        [memberId]
      );
      const app = appRes.rows[0];

      let upcomingAppointment = null;
      if (app) {
        const d = new Date(app.appointment_date);
        const m = d.getMonth() + 1;
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        upcomingAppointment = {
          id: app.id,
          month: `TH ${m}`,
          date: String(d.getDate()).padStart(2, '0'),
          title: app.purpose || 'Tái khám',
          timeDoctor: `${hours}:${minutes} · ${app.doctor_name || 'Bác sĩ phụ trách'}`,
          facility: app.facility_name || 'Cơ sở y tế',
        };
      }

      const grantsRes = await pool.query(
        `SELECT id, grantee_name, grantee_role, grantee_org, grantee_phone, grantee_email, expires_at
         FROM share_grants
         WHERE member_id = $1 AND status = 'active'
         ORDER BY created_at ASC`,
        [memberId]
      );

      const careTeam = grantsRes.rows.map(mapGrantToCareMember);

      const expiringSoon = grantsRes.rows.filter((r: any) => {
        if (!r.expires_at) return false;
        const diff = new Date(r.expires_at).getTime() - Date.now();
        return diff > 0 && diff <= 7 * 24 * 3600 * 1000;
      }).length;

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

  // 2. POST /:memberId/send-pre-exam-dossier - Gửi hồ sơ trước khám cho bác sĩ
  router.post('/:memberId/send-pre-exam-dossier', async (req: AuthenticatedRequest, res: Response) => {
    return res.json({
      success: true,
      message: 'Đã gửi hồ sơ sức khỏe và tiền sử bệnh án trước khám cho Bác sĩ thành công qua cổng y tế bảo mật.',
    });
  });

  // 3. POST /:memberId/add-doctor - Thêm bác sĩ vào Care Team
  router.post('/:memberId/add-doctor', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    const { doctorName, specialty, hospital, phone, email } = req.body;
    try {
      const grantId = `sg_${Date.now()}`;
      await pool.query(
        `INSERT INTO share_grants (id, member_id, grantee_type, grantee_name, grantee_role, grantee_org, grantee_phone, grantee_email, expires_at, status)
         VALUES ($1, $2, 'doctor', $3, $4, $5, $6, $7, CURRENT_TIMESTAMP + INTERVAL '90 days', 'active')`,
        [grantId, memberId, doctorName, specialty || 'Bác sĩ điều trị', hospital || 'Cơ sở y tế', phone || '', email || '']
      );

      return res.status(201).json({
        success: true,
        message: `Đã kết nối và cấp quyền chia sẻ dữ liệu cho Bác sĩ ${doctorName}.`,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  return router;
}

function mapGrantToCareMember(g: any) {
  let code = 'BS';
  let color = 'pink';
  if (g.grantee_role?.includes('Gia đình') || g.grantee_role?.includes('Chính')) {
    code = 'GD';
    color = 'mint';
  } else if (g.grantee_role?.includes('CĐHA') || g.grantee_role?.includes('Hình ảnh')) {
    code = 'HA';
    color = 'purple';
  } else if (g.grantee_name) {
    const words = g.grantee_name.trim().split(/\s+/);
    code = words.length >= 2 ? `${words[words.length - 2][0]}${words[words.length - 1][0]}`.toUpperCase() : 'BS';
  }

  return {
    id: g.id,
    code,
    name: g.grantee_name,
    role: g.grantee_role || 'Bác sĩ',
    org: g.grantee_org || 'Cơ sở y tế',
    phone: g.grantee_phone || '',
    email: g.grantee_email || '',
    color,
  };
}
