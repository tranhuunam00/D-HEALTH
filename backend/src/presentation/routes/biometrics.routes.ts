import { Router, Response } from 'express';
import { Pool } from 'pg';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth-middleware';
import { classifyBloodPressure, classifySpO2, classifyHeartRate } from '../../application/services/biometric-evaluator.service';

export function createBiometricsRouter(pool: Pool): Router {
  const router = Router();
  router.use(authenticate);

  // 1. GET /:memberId - Lấy danh sách số đo sinh trắc
  router.get('/:memberId', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    try {
      const result = await pool.query(
        `SELECT * FROM biometric_records WHERE member_id = $1 ORDER BY measured_at DESC LIMIT 50`,
        [memberId]
      );
      return res.json({ success: true, data: result.rows });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 2. POST / - Nhập mới số đo sinh trắc học
  router.post('/', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId, biometricType, systolic, diastolic, valueNumeric, unit, deviceId } = req.body;

    if (!memberId || !biometricType) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Vui lòng cung cấp đầy đủ memberId và biometricType.' },
      });
    }

    let classification: string | null = null;
    try {
      if (biometricType === 'blood_pressure' && systolic && diastolic) {
        classification = classifyBloodPressure(Number(systolic), Number(diastolic)).category;
      } else if (biometricType === 'spo2' && valueNumeric) {
        classification = classifySpO2(Number(valueNumeric)).category;
      } else if (biometricType === 'heart_rate' && valueNumeric) {
        classification = classifyHeartRate(Number(valueNumeric)).category;
      }

      const insertRes = await pool.query(
        `INSERT INTO biometric_records 
          (member_id, biometric_type, value_numeric, value_systolic, value_diastolic, unit, classification, device_id, measured_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
         RETURNING *`,
        [memberId, biometricType, valueNumeric || null, systolic || null, diastolic || null, unit || '', classification, deviceId || null]
      );

      return res.status(201).json({ success: true, data: insertRes.rows[0] });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  return router;
}
