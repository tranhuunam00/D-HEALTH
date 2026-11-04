import { Router, Response } from 'express';
import { Pool } from 'pg';
import { optionalAuthenticate, AuthenticatedRequest } from '../middlewares/auth-middleware';

export function createClinicalReportsRouter(pool: Pool): Router {
  const router = Router();
  router.use(optionalAuthenticate);

  // 1. GET /:memberId - Lấy danh sách phiếu xét nghiệm / chẩn đoán hình ảnh
  router.get('/:memberId', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    const { kind } = req.query;

    try {
      let query = `
        SELECT r.*, f.name AS facility_name,
          COALESCE((
            SELECT COUNT(*) FROM lab_results lr 
            WHERE lr.report_id = r.id AND UPPER(lr.flag) IN ('HIGH', 'LOW', 'CRITICAL', 'ABNORMAL')
          ), 0)::int AS abnormal_count
        FROM clinical_reports r
        LEFT JOIN master_facilities f ON r.facility_id = f.id
        WHERE r.member_id = $1
      `;
      const params: any[] = [memberId];

      if (kind) {
        query += ` AND r.kind = $2`;
        params.push(kind);
      }

      query += ` ORDER BY r.performed_at DESC, r.created_at DESC`;

      const result = await pool.query(query, params);
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
    const {
      memberId,
      kind,
      category = 'SH',
      title,
      performedAt,
      facilityName,
      doctorName,
      conclusion,
      rows = [],
      lesions = [],
      markers = [],
      specimenCode,
      histologicGrade,
      pTNM,
      resectionMargin,
    } = req.body;

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
          (id, member_id, kind, category, title, performed_at, facility_name, ordering_doctor_name, conclusion, accession_number, histological_grade, ptnm_staging, surgical_margin, ihc_markers)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         RETURNING *`,
        [
          reportId,
          memberId,
          kind,
          category,
          title,
          performedAt || new Date().toISOString().split('T')[0],
          facilityName || null,
          doctorName || null,
          conclusion || null,
          specimenCode || null,
          histologicGrade || null,
          pTNM || null,
          resectionMargin || null,
          JSON.stringify(markers),
        ]
      );

      // Nếu có danh sách chỉ số xét nghiệm (Lab Metric Rows)
      if (Array.isArray(rows) && rows.length > 0) {
        for (const row of rows) {
          if (row.name && row.value !== '' && row.value !== undefined) {
            const numVal = parseFloat(String(row.value).replace(',', '.'));
            await pool.query(
              `INSERT INTO lab_results (report_id, test_code, test_name, value_numeric, value_text, unit, flag)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [
                reportId,
                row.name.toUpperCase().substring(0, 30),
                row.name,
                isNaN(numVal) ? null : numVal,
                String(row.value),
                row.unit || '',
                'NORMAL',
              ]
            ).catch(() => null);
          }
        }
      }

      // Nếu có danh sách khối u CĐHA
      if (Array.isArray(lesions) && lesions.length > 0) {
        for (const l of lesions) {
          const sizeVal = parseFloat(String(l.size).replace(',', '.'));
          await pool.query(
            `INSERT INTO tumor_tracking_evaluations 
              (study_id, organ, lesion_location, current_sum_diameters_mm, lesion_type, laterality)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              reportId,
              req.body.organ || 'Khác',
              l.side || 'Bên phải',
              isNaN(sizeVal) ? 0 : sizeVal,
              l.type || 'solid_tumor',
              l.side || 'Bên phải',
            ]
          ).catch(() => null);
        }
      }

      return res.status(201).json({
        success: true,
        data: result.rows[0],
        message: 'Tạo phiếu kết quả cận lâm sàng thành công.',
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  return router;
}
