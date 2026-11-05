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
      ? 'SELECT * FROM family_members WHERE user_id = $1 ORDER BY created_at ASC'
      : 'SELECT * FROM family_members ORDER BY created_at ASC';
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
    const cardRes = await pool.query('SELECT * FROM emergency_cards WHERE (member_id = $1 OR member_id = $2)', [memberId, resolvedMemberId]);
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

app.listen(port, () => {
  console.log(`D-Health Backend API running on port ${port}`);
});
