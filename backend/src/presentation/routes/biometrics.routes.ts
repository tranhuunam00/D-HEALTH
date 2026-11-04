import { Router, Response } from 'express';
import { Pool } from 'pg';
import { optionalAuthenticate, AuthenticatedRequest } from '../middlewares/auth-middleware';
import { classifyBloodPressure, classifySpO2, classifyHeartRate } from '../../application/services/biometric-evaluator.service';

export function createBiometricsRouter(pool: Pool): Router {
  const router = Router();
  router.use(optionalAuthenticate);

  // 1. GET /:memberId - Lấy danh sách số đo sinh trắc
  router.get('/:memberId', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    try {
      const result = await pool.query(
        `SELECT * FROM biometric_records WHERE member_id = $1 AND is_deleted = false ORDER BY measured_at DESC LIMIT 50`,
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

    try {
      const bType = (biometricType === 'blood_pressure' || biometricType === 'bp') ? 'bp'
        : (biometricType === 'heart_rate' || biometricType === 'hr') ? 'hr'
        : (biometricType === 'temperature' || biometricType === 'temp') ? 'temp'
        : (biometricType === 'respiration' || biometricType === 'resp') ? 'resp'
        : biometricType;
      const numSys = systolic ? Number(systolic) : null;
      const numDia = diastolic ? Number(diastolic) : null;
      const numVal = valueNumeric ? Number(valueNumeric) : (numSys || null);

      const insertRes = await pool.query(
        `INSERT INTO biometric_records 
          (member_id, biometric_type, value_numeric, systolic, diastolic, unit, device_id, source, severity_level, measured_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'manual', 1, NOW())
         RETURNING *`,
        [memberId, bType, numVal, numSys, numDia, unit || '', deviceId || null]
      );

      return res.status(201).json({ success: true, data: insertRes.rows[0] });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  return router;
}
