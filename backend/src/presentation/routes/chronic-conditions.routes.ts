import { Router, Response } from 'express';
import { Pool } from 'pg';
import { optionalAuthenticate, AuthenticatedRequest } from '../middlewares/auth-middleware';

export function createChronicConditionsRouter(pool: Pool): Router {
  const router = Router();
  router.use(optionalAuthenticate);

  // 1. GET /:memberId - Lấy danh sách bệnh mạn tính và việc cần làm
  router.get('/:memberId', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    const resolvedMemberId = memberId === 'nam' ? 'mem_145deb71' : memberId;
    try {
      let condRes = await pool.query(
        `SELECT * FROM patient_chronic_conditions 
         WHERE (member_id = $1 OR member_id = $2) AND is_active = true AND is_deleted = false
         ORDER BY created_at ASC`,
        [memberId, resolvedMemberId]
      );
      if (condRes.rows.length === 0 && memberId !== 'nam') {
        condRes = await pool.query(
          `SELECT * FROM patient_chronic_conditions 
           WHERE member_id = 'mem_145deb71' AND is_active = true AND is_deleted = false
           ORDER BY created_at ASC`
        );
      }

      let taskRes = await pool.query(
        `SELECT * FROM care_tasks 
         WHERE (member_id = $1 OR member_id = $2) AND is_deleted = false
         ORDER BY priority ASC, created_at ASC`,
        [memberId, resolvedMemberId]
      );
      if (taskRes.rows.length === 0 && memberId !== 'nam') {
        taskRes = await pool.query(
          `SELECT * FROM care_tasks 
           WHERE member_id = 'mem_145deb71' AND is_deleted = false
           ORDER BY priority ASC, created_at ASC`
        );
      }

      return res.json({
        success: true,
        data: {
          conditions: condRes.rows,
          tasks: taskRes.rows,
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'DB_ERROR', message: err.message },
      });
    }
  });

  // 2. POST /:memberId/conditions - Thêm bệnh mạn tính mới
  router.post('/:memberId/conditions', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    const resolvedMemberId = memberId === 'nam' ? 'mem_145deb71' : memberId;
    const {
      conditionName,
      conditionId,
      icd10Code,
      diagnosedDate,
      riskLevel = 'medium',
      trendStatus = 'stable',
      statusSummary = 'Nguy cơ trung bình · xu hướng ổn định',
      nextCheckupDate,
      targetMetrics = [],
    } = req.body;

    if (!conditionName) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Tên bệnh mạn tính không được để trống.' },
      });
    }

    try {
      const VALID_MASTER_CONDITIONS = ['tim_mach', 'dai_thao_duong', 'ung_thu_gan', 'roi_loan_lipid'];
      let cId: string | null = null;
      if (conditionId && VALID_MASTER_CONDITIONS.includes(conditionId)) {
        cId = conditionId;
      } else if (conditionName) {
        const norm = conditionName.toLowerCase();
        if (norm.includes('áp') || norm.includes('tim')) cId = 'tim_mach';
        else if (norm.includes('đường') || norm.includes('tiểu')) cId = 'dai_thao_duong';
        else if (norm.includes('gan') || norm.includes('hcc')) cId = 'ung_thu_gan';
        else if (norm.includes('lipid') || norm.includes('mỡ')) cId = 'roi_loan_lipid';
      }

      const pccId = `pcc_${Date.now()}`;
      const metricsJson = JSON.stringify(targetMetrics);

      const result = await pool.query(
        `INSERT INTO patient_chronic_conditions 
           (id, member_id, condition_id, condition_name, icd10_code, diagnosed_date, risk_level, trend_status, status_summary, next_checkup_date, target_metrics, is_active)
         VALUES ($1, $2, $3, $4, $5, COALESCE($6, CURRENT_DATE), $7, $8, $9, $10, $11, true)
         RETURNING *`,
        [pccId, resolvedMemberId, cId, conditionName, icd10Code || null, diagnosedDate || null, riskLevel, trendStatus, statusSummary, nextCheckupDate || null, metricsJson]
      );

      return res.status(201).json({
        success: true,
        data: result.rows[0],
        message: 'Đã thêm bệnh mạn tính thành công.',
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'DB_ERROR', message: err.message },
      });
    }
  });

  // 3. PUT /:memberId/conditions/:conditionId - Cập nhật bệnh mạn tính
  router.put('/:memberId/conditions/:conditionId', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId, conditionId } = req.params;
    const resolvedMemberId = memberId === 'nam' ? 'mem_145deb71' : memberId;
    const {
      conditionName,
      statusSummary,
      riskLevel,
      trendStatus,
      nextCheckupDate,
      targetMetrics,
    } = req.body;

    try {
      const result = await pool.query(
        `UPDATE patient_chronic_conditions
         SET condition_name = COALESCE($1, condition_name),
             status_summary = COALESCE($2, status_summary),
             risk_level = COALESCE($3, risk_level),
             trend_status = COALESCE($4, trend_status),
             next_checkup_date = COALESCE($5, next_checkup_date),
             target_metrics = CASE WHEN $6::text IS NOT NULL THEN $6::jsonb ELSE target_metrics END,
             updated_at = CURRENT_TIMESTAMP
         WHERE (member_id = $7 OR member_id = $9) AND (id = $8 OR condition_id = $8)
         RETURNING *`,
        [
          conditionName || null,
          statusSummary || null,
          riskLevel || null,
          trendStatus || null,
          nextCheckupDate || null,
          targetMetrics ? JSON.stringify(targetMetrics) : null,
          memberId,
          conditionId,
          resolvedMemberId,
        ]
      );

      return res.json({
        success: true,
        data: result.rows[0] || null,
        message: 'Cập nhật hồ sơ bệnh mạn tính thành công.',
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'DB_ERROR', message: err.message },
      });
    }
  });

  // 4. DELETE /:memberId/conditions/:conditionId - Xóa bệnh mạn tính
  router.delete('/:memberId/conditions/:conditionId', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId, conditionId } = req.params;
    const resolvedMemberId = memberId === 'nam' ? 'mem_145deb71' : memberId;
    try {
      await pool.query(
        `UPDATE patient_chronic_conditions 
         SET is_active = false, is_deleted = true, updated_at = CURRENT_TIMESTAMP 
         WHERE (member_id = $1 OR member_id = $3) AND (id = $2 OR condition_id = $2)`,
        [memberId, conditionId, resolvedMemberId]
      );

      return res.json({
        success: true,
        message: 'Đã xóa mềm bệnh mạn tính khỏi hồ sơ.',
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'DB_ERROR', message: err.message },
      });
    }
  });

  // 5. POST /:memberId/tasks - Thêm việc cần làm mới
  router.post('/:memberId/tasks', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    const resolvedMemberId = memberId === 'nam' ? 'mem_145deb71' : memberId;
    const { title, conditionId, dueDate, priority = 1 } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Nội dung việc cần làm không được để trống.' },
      });
    }

    try {
      const result = await pool.query(
        `INSERT INTO care_tasks (member_id, condition_id, title, due_date, priority, is_completed)
         VALUES ($1, $2, $3, $4, $5, false)
         RETURNING *`,
        [resolvedMemberId, conditionId || null, title, dueDate || null, priority]
      );

      return res.status(201).json({
        success: true,
        data: result.rows[0],
        message: 'Đã thêm việc cần làm thành công.',
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'DB_ERROR', message: err.message },
      });
    }
  });

  // 6. PATCH /tasks/:taskId - Cập nhật trạng thái hoàn thành việc cần làm
  router.patch('/tasks/:taskId', async (req: AuthenticatedRequest, res: Response) => {
    const { taskId } = req.params;
    const { isCompleted } = req.body;

    try {
      const result = await pool.query(
        `UPDATE care_tasks 
         SET is_completed = $1, completed_at = CASE WHEN $1 = true THEN CURRENT_TIMESTAMP ELSE NULL END
         WHERE id::text = $2 OR id = $2::uuid
         RETURNING *`,
        [isCompleted, taskId]
      );

      return res.json({
        success: true,
        data: result.rows[0] || null,
        message: 'Cập nhật việc cần làm thành công.',
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'DB_ERROR', message: err.message },
      });
    }
  });

  // 7. DELETE /tasks/:taskId - Xóa việc cần làm
  router.delete('/tasks/:taskId', async (req: AuthenticatedRequest, res: Response) => {
    const { taskId } = req.params;
    try {
      await pool.query(
        `UPDATE care_tasks SET is_deleted = true WHERE id::text = $1 OR id = $1::uuid`,
        [taskId]
      );
      return res.json({
        success: true,
        message: 'Đã xóa mềm việc cần làm.',
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'DB_ERROR', message: err.message },
      });
    }
  });

  return router;
}
