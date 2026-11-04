import { Router, Response } from 'express';
import { Pool } from 'pg';
import { optionalAuthenticate, AuthenticatedRequest } from '../middlewares/auth-middleware';

export function createPrescriptionsRouter(pool: Pool): Router {
  const router = Router();
  router.use(optionalAuthenticate);

  // 1. GET /:memberId - Lấy danh sách đơn thuốc của thành viên
  router.get('/:memberId', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    try {
      const result = await pool.query(
        `SELECT p.*, f.name AS facility_name, d.full_name AS doctor_name
         FROM prescriptions p
         LEFT JOIN master_facilities f ON p.facility_id = f.id
         LEFT JOIN master_doctors d ON p.doctor_id = d.id
         WHERE p.member_id = $1
         ORDER BY p.prescribed_date DESC`,
        [memberId]
      );
      return res.json({ success: true, data: result.rows });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 2. POST /doses/:doseId/log - Ghi nhận trạng thái uống thuốc
  router.post('/doses/:doseId/log', async (req: AuthenticatedRequest, res: Response) => {
    const { doseId } = req.params;
    const { status = 'taken', note } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO dose_logs (schedule_id, scheduled_at, taken_at, status, reason_skipped)
         VALUES ($1, NOW(), NOW(), $2, $3)
         RETURNING *`,
        [doseId, status, note || null]
      );
      return res.json({ success: true, data: result.rows[0], message: 'Ghi nhận tuân thủ thuốc thành công.' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  return router;
}
