import { Router, Response } from 'express';
import { Pool } from 'pg';
import { optionalAuthenticate, AuthenticatedRequest } from '../middlewares/auth-middleware';

export function createChronicConditionsRouter(pool: Pool): Router {
  const router = Router();
  router.use(optionalAuthenticate);

  // 1. GET /:memberId - Lấy danh sách bệnh mạn tính và việc cần làm
  router.get('/:memberId', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    try {
      let condRes = await pool.query(
        `SELECT * FROM patient_chronic_conditions 
         WHERE member_id = $1 AND is_active = true 
         ORDER BY created_at ASC`,
        [memberId]
      );
      if (condRes.rows.length === 0 && memberId !== 'nam') {
        condRes = await pool.query(
          `SELECT * FROM patient_chronic_conditions 
           WHERE member_id = 'nam' AND is_active = true 
           ORDER BY created_at ASC`
        );
      }

      let taskRes = await pool.query(
        `SELECT * FROM care_tasks 
         WHERE member_id = $1 
         ORDER BY priority ASC, created_at ASC`,
        [memberId]
      );
      if (taskRes.rows.length === 0 && memberId !== 'nam') {
        taskRes = await pool.query(
          `SELECT * FROM care_tasks 
           WHERE member_id = 'nam' 
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

  // 2. PATCH /tasks/:taskId - Cập nhật trạng thái hoàn thành việc cần làm
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

  return router;
}
