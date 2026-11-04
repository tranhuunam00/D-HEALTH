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

  return router;
}
