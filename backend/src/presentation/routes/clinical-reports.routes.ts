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
        SELECT r.*, 
          COALESCE(f.name, r.facility_name) AS facility_name,
          COALESCE(d_ord.full_name, r.ordering_doctor_name) AS ordering_doctor_name,
          COALESCE(d_int.full_name, r.interpreting_doctor_name) AS interpreting_doctor_name,
          ist.id AS study_id, ist.modality AS study_modality, ist.body_part,
          COALESCE((
            SELECT COUNT(*) FROM lab_results lr 
            WHERE lr.report_id = r.id AND UPPER(lr.flag) IN ('HIGH', 'LOW', 'CRITICAL', 'ABNORMAL')
          ), 0)::int AS abnormal_count
        FROM clinical_reports r
        LEFT JOIN master_facilities f ON r.facility_id = f.id
        LEFT JOIN master_doctors d_ord ON r.ordering_doctor_id = d_ord.id
        LEFT JOIN master_doctors d_int ON r.interpreting_doctor_id = d_int.id
        LEFT JOIN imaging_studies ist ON ist.report_id = r.id
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

  // 3. GET /detail/:reportId - Lấy chi tiết toàn bộ thông tin của 1 báo cáo (Kèm chuỗi xung DICOM & Đánh giá tổn thương nếu có)
  router.get('/detail/:reportId', async (req: AuthenticatedRequest, res: Response) => {
    const { reportId } = req.params;
    try {
      const repRes = await pool.query(
        `SELECT r.*, 
                COALESCE(f.name, r.facility_name) AS facility_name,
                COALESCE(d_ord.full_name, r.ordering_doctor_name) AS ordering_doctor_name,
                COALESCE(d_int.full_name, r.interpreting_doctor_name) AS interpreting_doctor_name,
                ist.id as study_id, ist.modality, ist.body_part, ist.contrast_agent,
                ist.comparison_study_id,
                comp_rep.title AS comparison_study_title,
                comp_rep.performed_at AS comparison_study_date,
                comp_ist.modality AS comparison_study_modality,
                tte.id as evaluation_id, tte.organ, tte.lesion_location, tte.lesion_count,
                tte.baseline_sum_diameters_mm, tte.nadir_sum_diameters_mm, tte.current_sum_diameters_mm,
                tte.recist_response, tte.treatment_response_note
         FROM clinical_reports r
         LEFT JOIN master_facilities f ON r.facility_id = f.id
         LEFT JOIN master_doctors d_ord ON r.ordering_doctor_id = d_ord.id
         LEFT JOIN master_doctors d_int ON r.interpreting_doctor_id = d_int.id
         LEFT JOIN imaging_studies ist ON ist.report_id = r.id
         LEFT JOIN imaging_studies comp_ist ON comp_ist.id = ist.comparison_study_id
         LEFT JOIN clinical_reports comp_rep ON comp_rep.id = comp_ist.report_id
         LEFT JOIN tumor_tracking_evaluations tte ON tte.study_id = ist.id
         WHERE r.id = $1
         LIMIT 1`,
        [reportId]
      );
      if (repRes.rows.length === 0) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy phiếu kết quả.' } });
      }

      const report = repRes.rows[0];
      let series: any[] = [];
      if (report.study_id) {
        const serRes = await pool.query(
          `SELECT * FROM imaging_series WHERE study_id = $1 ORDER BY series_number ASC`,
          [report.study_id]
        );
        series = serRes.rows;
      }

      return res.json({
        success: true,
        data: {
          ...report,
          series,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 4. POST / - Nhập mới phiếu kết quả cận lâm sàng (SCR-12)
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
          (id, member_id, kind, category, title, performed_at, facility_name, ordering_doctor_name, interpreting_doctor_name, technique_description, clinical_findings, conclusion, recommendations, accession_number, histological_grade, ptnm_staging, surgical_margin, ihc_markers, specimen_site)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
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
          req.body.interpretingDoctorName || doctorName || null,
          req.body.techniqueDescription || null,
          req.body.clinicalFindings || null,
          conclusion || null,
          req.body.recommendations || null,
          specimenCode || null,
          histologicGrade || null,
          pTNM || null,
          resectionMargin || null,
          JSON.stringify(markers),
          req.body.organ || null,
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

      // Nếu là ca CĐHA, tạo bản ghi imaging_studies và tumor_tracking_evaluations
      if (kind === 'imaging') {
        const studyId = `std_${reportId}`;
        await pool.query(
          `INSERT INTO imaging_studies (id, report_id, modality, body_part)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (id) DO NOTHING`,
          [studyId, reportId, category || 'CT', req.body.organ || 'Gan · ổ bụng']
        ).catch(() => null);

        if (Array.isArray(lesions) && lesions.length > 0) {
          const sumDiameters = lesions.reduce((sum: number, l: any) => {
            const s = parseFloat(String(l.size).replace(',', '.'));
            return isNaN(s) ? sum : sum + s;
          }, 0);

          await pool.query(
            `INSERT INTO tumor_tracking_evaluations 
              (study_id, organ, lesion_location, lesion_count, baseline_sum_diameters_mm, nadir_sum_diameters_mm, current_sum_diameters_mm, recist_response, treatment_response_note)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              studyId,
              req.body.organ || 'Gan',
              `Khối u đặc · ${req.body.organ || 'Gan'}`,
              lesions.length,
              sumDiameters,
              sumDiameters,
              sumDiameters,
              'SD',
              `Theo dõi ${lesions.length} tổn thương (tổng ${sumDiameters} mm)`,
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
