import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { Pool } from 'pg';
import * as Minio from 'minio';
import dotenv from 'dotenv';
import path from 'path';
import { apiLimiter } from './infrastructure/security/rate-limiters';
import { createAuthRouter } from './presentation/routes/auth.routes';
import { createAdminUsersRouter } from './presentation/routes/admin-users.routes';
import { createUserProfileRouter } from './presentation/routes/user-profile.routes';
import { createBiometricsRouter } from './presentation/routes/biometrics.routes';
import { createPrescriptionsRouter } from './presentation/routes/prescriptions.routes';
import { createClinicalReportsRouter, ensureClinicalReportsSchema } from './presentation/routes/clinical-reports.routes';
import { createChronicConditionsRouter } from './presentation/routes/chronic-conditions.routes';
import { createCareRouter } from './presentation/routes/care.routes';
import { createMasterCatalogsRouter } from './presentation/routes/master-catalogs.routes';
import { MinioStorageService } from './infrastructure/storage/minio-storage.service';
import { createStorageRouter } from './presentation/routes/storage.routes';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Security Middlewares (Web Security Auditor)
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/api/', apiLimiter);

// 1. PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://dhealth_user:dhealth_secret_2026@postgres:5432/dhealth_db',
});

// Gắn Module Xác thực & Đăng nhập (Auth & Security Routes)
app.use('/api/auth', createAuthRouter(pool));
app.use('/api/admin/users', createAdminUsersRouter(pool));
app.use('/api/user/profile', createUserProfileRouter(pool));
app.use('/api/biometrics', createBiometricsRouter(pool));
app.use('/api/prescriptions', createPrescriptionsRouter(pool));
app.use('/api/clinical-reports', createClinicalReportsRouter(pool));
ensureClinicalReportsSchema(pool)
  .then(() => console.log('\u2713 [Database] Clinical reports schema verified.'))
  .catch((err) => console.warn(`\u26a0\ufe0f [Database] Clinical reports schema notice: ${err.message}`));
app.use('/api/chronic-conditions', createChronicConditionsRouter(pool));
app.use('/api/care', createCareRouter(pool));
app.use('/api', createMasterCatalogsRouter(pool));

// 2. MinIO S3 Client & Storage Service
const isDockerEnv = process.env.IS_DOCKER === 'true' || process.env.NODE_ENV === 'production';
const minioEndpoint = process.env.MINIO_ENDPOINT || (isDockerEnv ? 'minio' : '127.0.0.1');
const minioPort = parseInt(process.env.MINIO_PORT || (isDockerEnv ? '9000' : '7104'), 10);

const minioClient = new Minio.Client({
  endPoint: minioEndpoint,
  port: minioPort,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'dhealth_minio_admin',
  secretKey: process.env.MINIO_SECRET_KEY || 'dhealth_minio_secret_2026',
});

const storageService = new MinioStorageService(minioClient, minioEndpoint, minioPort);
app.use('/api/storage', createStorageRouter(storageService));

// Proxy & Stream trực tiếp tệp tin MinIO S3 (Avatars, DICOM, Reports)
app.get('/s3/:bucket/*', async (req: Request, res: Response) => {
  const { bucket } = req.params;
  const objectKey = req.params[0];
  try {
    const stream = await minioClient.getObject(bucket, objectKey);
    const ext = objectKey.split('.').pop()?.toLowerCase();
    const contentType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : ext === 'pdf' ? 'application/pdf' : 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    stream.pipe(res);
  } catch (err: any) {
    res.status(404).json({ success: false, error: 'S3 Object not found' });
  }
});


// Auto-initialize required S3 buckets on startup
storageService.ensureBuckets()
  .then(() => console.log('✓ [MinIO] All S3 Buckets initialized successfully!'))
  .catch((err) => console.warn(`⚠️ [MinIO] Bucket init notice: ${err.message}`));

// Health check endpoint
app.get('/api/health', async (req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  let memberCount = 0;

  try {
    const dbRes = await pool.query('SELECT count(*) FROM family_members');
    dbStatus = 'connected';
    memberCount = parseInt(dbRes.rows[0].count, 10);
  } catch (err: any) {
    dbStatus = `error: ${err.message}`;
  }

  const storageHealth = await storageService.checkHealth();
  const minioStatus = storageHealth.status === 'connected'
    ? `connected (${storageHealth.buckets.length} buckets)`
    : `error: ${storageHealth.error || 'unreachable'}`;

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      minio: minioStatus,
    },
    metrics: {
      seededMembers: memberCount,
    },
  });
});

// Lấy danh sách thành viên gia đình (SCR-10 / SCR-17)
app.get('/api/members', async (req: Request, res: Response) => {
  const { userId } = req.query;
  try {
    const query = userId
      ? `SELECT fm.*, 
                COALESCE((
                  SELECT string_agg(condition_name, ' · ') 
                  FROM patient_chronic_conditions 
                  WHERE member_id = fm.id AND is_active = true AND is_deleted = false
                ), '') AS chronic_conditions
         FROM family_members fm 
         WHERE fm.user_id = $1 
         ORDER BY fm.created_at ASC`
      : `SELECT fm.*, 
                COALESCE((
                  SELECT string_agg(condition_name, ' · ') 
                  FROM patient_chronic_conditions 
                  WHERE member_id = fm.id AND is_active = true AND is_deleted = false
                ), '') AS chronic_conditions
         FROM family_members fm 
         WHERE fm.id != 'mem_admin' AND fm.full_name NOT ILIKE '%quản trị%' AND fm.full_name NOT ILIKE '%admin%' 
         ORDER BY fm.created_at ASC`;
    const params = userId ? [userId] : [];
    const result = await pool.query(query, params);
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy danh sách sinh trắc học theo thành viên (SCR-03)
app.get('/api/biometrics/:memberId', async (req: Request, res: Response) => {
  const { memberId } = req.params;
  const { type } = req.query;

  try {
    let query = 'SELECT * FROM biometric_records WHERE member_id = $1 AND is_deleted = false';
    const params: any[] = [memberId];

    if (type) {
      query += ' AND biometric_type = $2';
      params.push(type);
    }

    query += ' ORDER BY measured_at DESC LIMIT 50';

    const result = await pool.query(query, params);
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy kết quả xét nghiệm (SCR-05 / SCR-06)
app.get('/api/reports/:memberId', async (req: Request, res: Response) => {
  const { memberId } = req.params;
  const resolvedMemberId = memberId === 'nam' ? 'mem_145deb71' : memberId;
  try {
    const result = await pool.query(
      `SELECT r.*, json_agg(l.*) AS lab_results 
       FROM clinical_reports r 
       LEFT JOIN lab_results l ON r.id = l.report_id 
       WHERE (r.member_id = $1 OR r.member_id = $2) 
       GROUP BY r.id 
       ORDER BY r.performed_at DESC`,
      [memberId, resolvedMemberId]
    );
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================================================================
// ADMIN TỔNG MASTER DATA ENDPOINTS (DYNAMIC CATALOGS)
// ====================================================================

// Master catalogs (facilities, doctors, departments) handled by createMasterCatalogsRouter

// 3. Từ điển thuốc quốc gia (Master Medications)
app.get('/api/medications', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM master_medications WHERE is_active = true ORDER BY brand_name ASC');
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Danh mục bệnh mạn tính (Master Chronic Conditions - SCR-08)
app.get('/api/conditions', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM master_chronic_conditions WHERE is_active = true ORDER BY name ASC');
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Thẻ cấp cứu & Liên hệ khẩn cấp (SCR-16)
app.get('/api/emergency/:memberId', async (req: Request, res: Response) => {
  const { memberId } = req.params;
  const resolvedMemberId = memberId === 'nam' ? 'mem_145deb71' : memberId;
  try {
    const cardRes = await pool.query(
      `SELECT c.*, 
              fm.full_name AS member_name, 
              fm.birth_date AS member_birth_date, 
              fm.gender AS member_gender, 
              fm.blood_type AS member_blood_type
       FROM family_members fm
       LEFT JOIN emergency_cards c ON c.member_id = fm.id
       WHERE (fm.id = $1 OR fm.id = $2)
       LIMIT 1`,
      [memberId, resolvedMemberId]
    );
    const contactsRes = await pool.query('SELECT * FROM emergency_contacts WHERE (member_id = $1 OR member_id = $2) ORDER BY priority_order ASC', [memberId, resolvedMemberId]);
    res.json({ 
      data: {
        card: cardRes.rows[0] || null,
        contacts: contactsRes.rows
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// 5b. Cập nhật Thẻ cấp cứu & Liên hệ khẩn cấp (POST & PUT)
const handleUpdateEmergency = async (req: Request, res: Response) => {
  const { memberId } = req.params;
  const resolvedMemberId = (memberId === 'nam' || !memberId) ? 'mem_145deb71' : memberId;
  const { allergies, chronicConditions, criticalMeds, emergencyNotes, contacts } = req.body;
  const bloodGroup = req.body.bloodGroup || req.body.bloodType;

  try {
    const allergiesJson = allergies ? JSON.stringify(allergies) : '[]';
    const chronicJson = chronicConditions ? JSON.stringify(chronicConditions) : '[]';
    const medsJson = criticalMeds ? JSON.stringify(criticalMeds) : '[]';
    const offlineQr = 'DHEALTH:EMERGENCY:' + (bloodGroup || 'O+') + ':CONTACTS=' + (contacts?.length || 0);

    await pool.query(
      'INSERT INTO emergency_cards (member_id, blood_group_snapshot, allergies, chronic_conditions, current_critical_meds, emergency_notes, offline_qr_payload) VALUES ($1, $2, $3::jsonb, $4::jsonb, $5::jsonb, $6, $7) ON CONFLICT (member_id) DO UPDATE SET blood_group_snapshot = COALESCE(EXCLUDED.blood_group_snapshot, emergency_cards.blood_group_snapshot), allergies = EXCLUDED.allergies, chronic_conditions = EXCLUDED.chronic_conditions, current_critical_meds = EXCLUDED.current_critical_meds, emergency_notes = EXCLUDED.emergency_notes, offline_qr_payload = EXCLUDED.offline_qr_payload, updated_at = NOW()',
      [resolvedMemberId, bloodGroup || null, allergiesJson, chronicJson, medsJson, emergencyNotes || null, offlineQr]
    );

    if (bloodGroup) {
      await pool.query(
        'UPDATE family_members SET blood_type = $1, updated_at = NOW() WHERE id = $2',
        [bloodGroup, resolvedMemberId]
      );
    }

    if (Array.isArray(contacts)) {
      await pool.query('DELETE FROM emergency_contacts WHERE member_id = $1', [resolvedMemberId]);
      for (let i = 0; i < contacts.length; i++) {
        const cnt = contacts[i];
        if (cnt.name && cnt.phone) {
          const contactId = 'ec_' + Date.now() + '_' + i;
          await pool.query(
            'INSERT INTO emergency_contacts (id, member_id, contact_name, relationship, phone_number, priority_order) VALUES ($1, $2, $3, $4, $5, $6)',
            [contactId, resolvedMemberId, cnt.name, cnt.relationship || 'Người thân', cnt.phone, i + 1]
          );
        }
      }
    }

    const cardRes = await pool.query(
      'SELECT c.*, fm.full_name AS member_name, fm.birth_date AS member_birth_date, fm.gender AS member_gender, fm.blood_type AS member_blood_type FROM family_members fm LEFT JOIN emergency_cards c ON c.member_id = fm.id WHERE fm.id = $1 LIMIT 1',
      [resolvedMemberId]
    );
    const contactsRes = await pool.query(
      'SELECT * FROM emergency_contacts WHERE member_id = $1 ORDER BY priority_order ASC',
      [resolvedMemberId]
    );

    return res.json({
      success: true,
      message: 'Cập nhật thẻ cấp cứu thành công.',
      data: {
        card: cardRes.rows[0] || null,
        contacts: contactsRes.rows,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

app.post('/api/emergency/:memberId', handleUpdateEmergency);
app.put('/api/emergency/:memberId', handleUpdateEmergency);

// 6. Thống kê toàn cảnh cho Admin Tổng (Super Admin Dashboard Stats)
app.get('/api/admin/overview', async (req: Request, res: Response) => {
  try {
    const [usersCount, membersCount, facilitiesCount, doctorsCount, medsCount, reportsCount] = await Promise.all([
      pool.query('SELECT count(*) FROM users'),
      pool.query('SELECT count(*) FROM family_members'),
      pool.query('SELECT count(*) FROM master_facilities'),
      pool.query('SELECT count(*) FROM master_doctors'),
      pool.query('SELECT count(*) FROM master_medications'),
      pool.query('SELECT count(*) FROM clinical_reports'),
    ]);

    res.json({
      data: {
        totalUsers: parseInt(usersCount.rows[0].count, 10),
        totalMembers: parseInt(membersCount.rows[0].count, 10),
        totalFacilities: parseInt(facilitiesCount.rows[0].count, 10),
        totalDoctors: parseInt(doctorsCount.rows[0].count, 10),
        totalMedications: parseInt(medsCount.rows[0].count, 10),
        totalClinicalReports: parseInt(reportsCount.rows[0].count, 10),
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Danh sách Lịch hẹn khám toàn hệ thống cho Admin Tổng (GET /api/admin/appointments)
app.get('/api/admin/appointments', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.id, a.member_id, a.appointment_date, a.purpose, a.status, a.notes, a.created_at,
        COALESCE(a.doctor_name, d.full_name, 'Bác sĩ phụ trách') AS doctor_name,
        COALESCE(a.facility_name, f.name, 'Bệnh viện đối tác') AS facility_name,
        COALESCE(a.department_name, dep.name, 'Khám chuyên khoa') AS department_name,
        COALESCE(fm.full_name, u.phone_number, a.member_id) AS patient_name,
        COALESCE(u.phone_number, '--') AS patient_phone,
        COALESCE(u.email, '--') AS patient_email
      FROM appointments a
      LEFT JOIN family_members fm ON a.member_id = fm.id
      LEFT JOIN users u ON fm.user_id = u.id
      LEFT JOIN master_doctors d ON a.doctor_id = d.id
      LEFT JOIN master_departments dep ON d.department_id = dep.id
      LEFT JOIN master_facilities f ON a.facility_id = f.id
      ORDER BY a.appointment_date DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
  }
});

app.listen(port, () => {
  console.log(`D-Health Backend API running on port ${port}`);
});
