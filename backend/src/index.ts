import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import * as Minio from 'minio';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://dhealth_user:dhealth_secret_2026@postgres:5432/dhealth_db',
});

// 2. MinIO S3 Client
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'minio',
  port: parseInt(process.env.MINIO_PORT || '9000', 10),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'dhealth_minio_admin',
  secretKey: process.env.MINIO_SECRET_KEY || 'dhealth_minio_secret_2026',
});

// Auto-initialize required S3 buckets on startup
const REQUIRED_BUCKETS = ['dhealth-reports', 'dhealth-dicom', 'dhealth-avatars', 'dhealth-prescriptions'];

async function initMinioBuckets(retries = 15, delayMs = 2000): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      for (const bucket of REQUIRED_BUCKETS) {
        const exists = await minioClient.bucketExists(bucket);
        if (!exists) {
          await minioClient.makeBucket(bucket);
          console.log(`[MinIO] Bucket created: ${bucket}`);

          // Set public read policy for avatars and reports
          if (bucket === 'dhealth-avatars' || bucket === 'dhealth-reports') {
            const policy = JSON.stringify({
              Version: '2012-10-17',
              Statement: [
                {
                  Effect: 'Allow',
                  Principal: { AWS: ['*'] },
                  Action: ['s3:GetObject'],
                  Resource: [`arn:aws:s3:::${bucket}/*`],
                },
              ],
            });
            try {
              await minioClient.setBucketPolicy(bucket, policy);
            } catch {
              // Ignore policy error if unsupported in local mode
            }
          }
        }
      }
      console.log('✓ [MinIO] All S3 Buckets initialized successfully!');
      return;
    } catch (err: any) {
      console.log(`[MinIO] Waiting for S3 storage (attempt ${attempt}/${retries}): ${err.message}`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  console.warn('⚠️ [MinIO] Could not initialize buckets after maximum attempts. Continuing...');
}

// Health check endpoint
app.get('/api/health', async (req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  let minioStatus = 'disconnected';
  let memberCount = 0;

  try {
    const dbRes = await pool.query('SELECT count(*) FROM family_members');
    dbStatus = 'connected';
    memberCount = parseInt(dbRes.rows[0].count, 10);
  } catch (err: any) {
    dbStatus = `error: ${err.message}`;
  }

  try {
    const buckets = await minioClient.listBuckets();
    minioStatus = `connected (${buckets.length} buckets)`;
  } catch (err: any) {
    minioStatus = `error: ${err.message}`;
  }

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
  try {
    const result = await pool.query('SELECT * FROM family_members ORDER BY created_at ASC');
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
  try {
    const result = await pool.query(
      `SELECT r.*, json_agg(l.*) AS lab_results 
       FROM clinical_reports r 
       LEFT JOIN lab_results l ON r.id = l.report_id 
       WHERE r.member_id = $1 
       GROUP BY r.id 
       ORDER BY r.performed_at DESC`,
      [memberId]
    );
    res.json({ data: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`D-Health Backend API running on port ${port}`);
  initMinioBuckets().catch((err) => console.error('[MinIO] Bucket init error:', err));
});
