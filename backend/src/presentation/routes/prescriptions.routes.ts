import { Router, Response } from 'express';
import { Pool } from 'pg';
import { optionalAuthenticate, AuthenticatedRequest } from '../middlewares/auth-middleware';

export function createPrescriptionsRouter(pool: Pool): Router {
  const router = Router();
  router.use(optionalAuthenticate);

  // 1. GET /:memberId - Lấy danh sách đơn thuốc của thành viên kèm danh mục thuốc
  router.get('/:memberId', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    try {
      const result = await pool.query(
        `SELECT p.*, f.name AS facility_name, d.full_name AS doctor_name,
          COALESCE(
            (SELECT json_agg(json_build_object(
              'id', pi.id,
              'medicationName', pi.medication_name,
              'dosage', pi.dosage,
              'dosePerIntake', pi.dose_per_intake,
              'frequencyPerDay', pi.frequency_per_day,
              'timingInstructions', pi.timing_instructions,
              'startDate', pi.start_date,
              'endDate', pi.end_date,
              'schedules', (SELECT json_agg(json_build_object(
                'id', ds.id,
                'scheduledTime', ds.scheduled_time,
                'mealRelation', ds.meal_relation,
                'isActive', ds.is_active
              )) FROM dose_schedules ds WHERE ds.prescription_item_id = pi.id)
            )) FROM prescription_items pi WHERE pi.prescription_id = p.id),
            '[]'::json
          ) AS items
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

  // 2. GET /:memberId/today-doses - Lấy các cữ thuốc trong ngày hôm nay (SCR-02 & SCR-11)
  router.get('/:memberId/today-doses', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    try {
      const result = await pool.query(
        `SELECT ds.id, pi.medication_name as name, pi.dosage, pi.dose_per_intake, 
                ds.scheduled_time, ds.meal_relation,
                p.id as prescription_id,
                COALESCE(dl.status, 'pending') as status,
                CASE WHEN dl.status = 'taken' THEN true ELSE false END as taken
         FROM dose_schedules ds
         JOIN prescription_items pi ON ds.prescription_item_id = pi.id
         JOIN prescriptions p ON pi.prescription_id = p.id
         LEFT JOIN dose_logs dl ON dl.schedule_id = ds.id AND DATE(dl.scheduled_at) = CURRENT_DATE
         WHERE p.member_id = $1 AND p.status = 'active'
         ORDER BY ds.scheduled_time ASC`,
        [memberId]
      );
      return res.json({ success: true, data: result.rows });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 3. POST /doses/:doseId/log - Ghi nhận trạng thái uống thuốc
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
