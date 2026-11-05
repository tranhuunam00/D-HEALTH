import { Router, Response } from 'express';
import { Pool } from 'pg';
import { optionalAuthenticate, AuthenticatedRequest } from '../middlewares/auth-middleware';

export async function ensureClinicalReportsSchema(pool: Pool): Promise<void> {
  try {
    await pool.query(`
      ALTER TABLE clinical_reports
        ADD COLUMN IF NOT EXISTS performed_at DATE DEFAULT CURRENT_DATE,
        ADD COLUMN IF NOT EXISTS facility_id VARCHAR(50),
        ADD COLUMN IF NOT EXISTS facility_name VARCHAR(150),
        ADD COLUMN IF NOT EXISTS ordering_doctor_id VARCHAR(50),
        ADD COLUMN IF NOT EXISTS ordering_doctor_name VARCHAR(100),
        ADD COLUMN IF NOT EXISTS ordering_doctor VARCHAR(100),
        ADD COLUMN IF NOT EXISTS interpreting_doctor_id VARCHAR(50),
        ADD COLUMN IF NOT EXISTS interpreting_doctor_name VARCHAR(100),
        ADD COLUMN IF NOT EXISTS interpreting_doctor VARCHAR(100),
        ADD COLUMN IF NOT EXISTS technique_description TEXT,
        ADD COLUMN IF NOT EXISTS clinical_findings TEXT,
        ADD COLUMN IF NOT EXISTS conclusion TEXT,
        ADD COLUMN IF NOT EXISTS summary TEXT,
        ADD COLUMN IF NOT EXISTS recommendations TEXT,
        ADD COLUMN IF NOT EXISTS accession_number VARCHAR(50),
        ADD COLUMN IF NOT EXISTS specimen_type VARCHAR(100),
        ADD COLUMN IF NOT EXISTS specimen_site VARCHAR(100),
        ADD COLUMN IF NOT EXISTS histological_grade VARCHAR(20),
        ADD COLUMN IF NOT EXISTS ptnm_staging VARCHAR(50),
        ADD COLUMN IF NOT EXISTS surgical_margin VARCHAR(30),
        ADD COLUMN IF NOT EXISTS ihc_markers JSONB DEFAULT '[]'::jsonb,
        ADD COLUMN IF NOT EXISTS attachment_s3_key TEXT,
        ADD COLUMN IF NOT EXISTS s3_bucket VARCHAR(50) DEFAULT 'dhealth-reports',
        ADD COLUMN IF NOT EXISTS file_sha256 VARCHAR(64);
    `);
  } catch {
    // Non-blocking in case table doesn't exist yet or connection is mocked
  }
}

interface InsertReportParams {
  body: any;
  reportId: string;
}

function buildReportInsertPayload(params: InsertReportParams): Record<string, any> {
  const { body, reportId } = params;
  const insertData: Record<string, any> = {
    id: reportId,
    member_id: body.memberId,
    kind: body.kind,
    category: body.category || 'SH',
    title: body.title,
    performed_at: body.performedAt || new Date().toISOString().split('T')[0],
  };

  if (body.facilityName) insertData.facility_name = body.facilityName;
  if (body.doctorName) {
    insertData.ordering_doctor_name = body.doctorName;
    insertData.ordering_doctor = body.doctorName;
  }
  const interpDoc = body.interpretingDoctorName || body.doctorName;
  if (interpDoc) {
    insertData.interpreting_doctor_name = interpDoc;
    insertData.interpreting_doctor = interpDoc;
  }
  if (body.techniqueDescription) insertData.technique_description = body.techniqueDescription;
  if (body.clinicalFindings) insertData.clinical_findings = body.clinicalFindings;
  if (body.conclusion) {
    insertData.conclusion = body.conclusion;
    insertData.summary = body.conclusion;
  }
  if (body.recommendations) insertData.recommendations = body.recommendations;
  if (body.specimenCode) insertData.accession_number = body.specimenCode;
  if (body.histologicGrade) insertData.histological_grade = body.histologicGrade;
  if (body.pTNM) insertData.ptnm_staging = body.pTNM;
  if (body.resectionMargin) insertData.surgical_margin = body.resectionMargin;
  if (Array.isArray(body.markers) && body.markers.length > 0) {
    insertData.ihc_markers = JSON.stringify(body.markers);
  }
  if (body.organ) insertData.specimen_site = body.organ;

  return insertData;
}

async function insertLabMetricRows(pool: Pool, reportId: string, rows: any[]): Promise<void> {
  if (!Array.isArray(rows) || rows.length === 0) return;
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

async function insertImagingStudyAndLesions(pool: Pool, reportId: string, body: any): Promise<void> {
  const studyId = `std_${reportId}`;
  await pool.query(
    `INSERT INTO imaging_studies (id, report_id, modality, body_part)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO NOTHING`,
    [studyId, reportId, body.category || 'CT', body.organ || 'Gan · ổ bụng']
  ).catch(() => null);

  if (Array.isArray(body.lesions) && body.lesions.length > 0) {
    const sumDiameters = body.lesions.reduce((sum: number, l: any) => {
      const s = parseFloat(String(l.size).replace(',', '.'));
      return isNaN(s) ? sum : sum + s;
    }, 0);

    await pool.query(
      `INSERT INTO tumor_tracking_evaluations 
        (study_id, organ, lesion_location, lesion_count, baseline_sum_diameters_mm, nadir_sum_diameters_mm, current_sum_diameters_mm, recist_response, treatment_response_note)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        studyId,
        body.organ || 'Gan',
        `Khối u đặc · ${body.organ || 'Gan'}`,
        body.lesions.length,
        sumDiameters,
        sumDiameters,
        sumDiameters,
        'SD',
        `Theo dõi ${body.lesions.length} tổn thương (tổng ${sumDiameters} mm)`,
      ]
    ).catch(() => null);
  }
}

async function getTableColumns(pool: Pool, tableName: string): Promise<Set<string>> {
  try {
    const res = await pool.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = $1`,
      [tableName]
    );
    return new Set(res.rows.map((r: any) => r.column_name));
  } catch {
    return new Set();
  }
}

export function createClinicalReportsRouter(pool: Pool): Router {
  const router = Router();
  router.use(optionalAuthenticate);

  // Trigger non-blocking schema check
  ensureClinicalReportsSchema(pool).catch(() => null);

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
            SELECT json_agg(lr.*) FROM lab_results lr 
            WHERE lr.report_id = r.id
          ), '[]'::json) AS lab_results,
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

  // 3. GET /detail/:reportId - Lấy chi tiết toàn bộ thông tin của 1 báo cáo
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

  // 4. GET /evaluations/:memberId - Lấy đánh giá đáp ứng khối u theo RECIST 1.1 từ CSDL
  router.get('/evaluations/:memberId', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    try {
      const result = await pool.query(
        `SELECT tte.*, r.title, r.performed_at, ist.modality, ist.body_part
         FROM tumor_tracking_evaluations tte
         JOIN imaging_studies ist ON tte.study_id = ist.id
         JOIN clinical_reports r ON ist.report_id = r.id
         WHERE r.member_id = $1
         ORDER BY r.performed_at DESC LIMIT 1`,
        [memberId]
      );
      return res.json({ success: true, data: result.rows[0] || null });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 5. POST / - Nhập mới phiếu kết quả cận lâm sàng (SCR-12)
  router.post('/', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId, kind, title } = req.body;
    if (!memberId || !kind || !title) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Vui lòng cung cấp đủ memberId, kind và title.' },
      });
    }

    try {
      const reportId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const availableCols = await getTableColumns(pool, 'clinical_reports');
      const insertData = buildReportInsertPayload({ body: req.body, reportId });

      const fieldsToInsert = Object.keys(insertData).filter(
        (k) => availableCols.size === 0 || availableCols.has(k)
      );
      const values = fieldsToInsert.map((k) => insertData[k]);
      const placeholders = fieldsToInsert.map((_, i) => `$${i + 1}`).join(', ');

      const result = await pool.query(
        `INSERT INTO clinical_reports (${fieldsToInsert.join(', ')})
         VALUES (${placeholders})
         RETURNING *`,
        values
      );

      if (kind === 'lab') {
        await insertLabMetricRows(pool, reportId, req.body.rows);
      } else if (kind === 'imaging') {
        await insertImagingStudyAndLesions(pool, reportId, req.body);
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
