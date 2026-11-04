import { Router, Response } from 'express';
import { Pool } from 'pg';
import { optionalAuthenticate, AuthenticatedRequest } from '../middlewares/auth-middleware';

export function createClinicalReportsRouter(pool: Pool): Router {
  const router = Router();
  router.use(optionalAuthenticate);

  // 1. GET /:memberId - Lấy danh sách phiếu xét nghiệm / chẩn đoán hình ảnh
  router.get('/:memberId', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    try {
      const result = await pool.query(
        `SELECT r.*, f.name AS facility_name
         FROM clinical_reports r
         LEFT JOIN master_facilities f ON r.facility_id = f.id
         WHERE r.member_id = $1
         ORDER BY r.performed_at DESC`,
        [memberId]
      );
      return res.json({ success: true, data: result.rows });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 2. GET /results/:reportId - Lấy chi tiết các chỉ số của phiếu
  router.get('/results/:reportId', async (req: AuthenticatedRequest, res: Response) => {
    const { reportId } = req.params;
    try {
      const result = await pool.query(
        `SELECT * FROM lab_results WHERE report_id = $1 ORDER BY test_name ASC`,
        [reportId]
      );
      return res.json({ success: true, data: result.rows });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 3. POST / - Nhập mới phiếu kết quả cận lâm sàng (SCR-12)
  router.post('/', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId, kind, category = 'SH', title, performedAt, facilityName, doctorName, conclusion } = req.body;
    if (!memberId || !kind || !title) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Vui lòng cung cấp đủ memberId, kind và title.' },
      });
    }

    try {
      const reportId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const result = await pool.query(
        `INSERT INTO clinical_reports 
          (id, member_id, kind, category, title, performed_at, facility_name, ordering_doctor_name, conclusion)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [reportId, memberId, kind, category, title, performedAt || new Date().toISOString().split('T')[0], facilityName || null, doctorName || null, conclusion || null]
      );
      return res.status(201).json({ success: true, data: result.rows[0], message: 'Tạo phiếu kết quả cận lâm sàng thành công.' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  return router;
}
