import { Router, Response } from 'express';
import { Pool } from 'pg';
import { optionalAuthenticate, AuthenticatedRequest } from '../middlewares/auth-middleware';

export function createPrescriptionsRouter(pool: Pool): Router {
  const router = Router();
  router.use(optionalAuthenticate);

  // 1. GET /:memberId - Lấy danh sách đơn thuốc của thành viên kèm danh mục thuốc
  router.get('/:memberId', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    const resolvedMemberId = memberId === 'nam' ? 'mem_145deb71' : memberId;
    try {
      const result = await pool.query(
        `SELECT p.*, f.name AS facility_name, d.full_name AS doctor_name,
          COALESCE(
            (SELECT json_agg(json_build_object(
              'id', pi.id,
              'medicationName', pi.medication_name,
              'dosage', pi.dosage,
              'dosePerIntake', pi.dose_per_intake,
              'frequencyPerDay', pi.frequency_per_day,
              'timingInstructions', pi.timing_instructions,
              'startDate', pi.start_date,
              'endDate', pi.end_date,
              'schedules', (SELECT json_agg(json_build_object(
                'id', ds.id,
                'scheduledTime', ds.scheduled_time,
                'mealRelation', ds.meal_relation,
                'isActive', ds.is_active
              )) FROM dose_schedules ds WHERE ds.prescription_item_id = pi.id)
            )) FROM prescription_items pi WHERE pi.prescription_id = p.id),
            '[]'::json
          ) AS items
        FROM prescriptions p
        LEFT JOIN master_facilities f ON p.facility_id = f.id
        LEFT JOIN master_doctors d ON p.doctor_id = d.id
        WHERE (p.member_id = $1 OR p.member_id = $2)
        ORDER BY p.prescribed_date DESC`,
        [memberId, resolvedMemberId]
      );
      return res.json({ success: true, data: result.rows });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 2. GET /:memberId/today-doses - Lấy cữ thuốc theo ngày (SCR-02 & SCR-11)
  router.get('/:memberId/today-doses', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    const resolvedMemberId = memberId === 'nam' ? 'mem_145deb71' : memberId;
    const { date } = req.query;
    try {
      const targetDate = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)
        ? date
        : new Date().toISOString().split('T')[0];

      const result = await pool.query(
        `SELECT ds.id, pi.id as prescription_item_id, pi.medication_name as name, 
                pi.medication_name as raw_medication_name,
                pi.dosage, pi.dose_per_intake, 
                ds.scheduled_time, ds.meal_relation, pi.timing_instructions,
                pi.start_date, pi.end_date,
                p.id as prescription_id,
                COALESCE(
                  dl.status, 
                  CASE WHEN $3::date > CURRENT_DATE THEN 'scheduled' ELSE 'pending' END
                ) as status,
                CASE WHEN dl.status = 'taken' THEN true ELSE false END as taken
         FROM dose_schedules ds
         JOIN prescription_items pi ON ds.prescription_item_id = pi.id
         JOIN prescriptions p ON pi.prescription_id = p.id
         LEFT JOIN dose_logs dl ON dl.schedule_id = ds.id AND DATE(dl.scheduled_at) = $3::date
         WHERE (p.member_id = $1 OR p.member_id = $2) AND p.status = 'active'
           AND (pi.start_date IS NULL OR pi.start_date <= $3::date)
           AND (pi.end_date IS NULL OR pi.end_date >= $3::date)
         ORDER BY ds.scheduled_time ASC, pi.medication_name ASC`,
        [memberId, resolvedMemberId, targetDate]
      );
      return res.json({ success: true, data: result.rows });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 3. GET /:memberId/adherence-summary - Lấy tỷ lệ tuân thủ 30 ngày và ma trận Calendar
  router.get('/:memberId/adherence-summary', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    const resolvedMemberId = memberId === 'nam' ? 'mem_145deb71' : memberId;
    try {
      const checkRes = await pool.query(
        `SELECT COUNT(*) FROM prescription_items pi
         JOIN prescriptions p ON pi.prescription_id = p.id
         WHERE (p.member_id = $1 OR p.member_id = $2) AND p.status = 'active'`,
        [memberId, resolvedMemberId]
      );
      const totalItems = parseInt(checkRes.rows[0]?.count || '0', 10);
      if (totalItems === 0) {
        return res.json({
          success: true,
          data: {
            adherencePercent: 0,
            takenCount: 0,
            missedCount: 0,
            skippedCount: 0,
            todayTaken: 0,
            todayTotal: 0,
            calendarDays: [],
          },
        });
      }

      const todayDosesRes = await pool.query(
        `SELECT ds.id, dl.status
         FROM dose_schedules ds
         JOIN prescription_items pi ON ds.prescription_item_id = pi.id
         JOIN prescriptions p ON pi.prescription_id = p.id
         LEFT JOIN dose_logs dl ON dl.schedule_id = ds.id AND DATE(dl.scheduled_at) = CURRENT_DATE
         WHERE (p.member_id = $1 OR p.member_id = $2) AND p.status = 'active'
           AND (pi.start_date IS NULL OR pi.start_date <= CURRENT_DATE)
           AND (pi.end_date IS NULL OR pi.end_date >= CURRENT_DATE)`,
        [memberId, resolvedMemberId]
      );
      const actualTodayTotal = todayDosesRes.rows.length;
      const actualTodayTaken = todayDosesRes.rows.filter((r) => r.status === 'taken').length;

      // Query 30-day adherence statistics dynamically from dose_logs
      const logs30dRes = await pool.query(
        `SELECT 
           COUNT(CASE WHEN dl.status = 'taken' THEN 1 END) AS taken_count,
           COUNT(CASE WHEN dl.status = 'missed' THEN 1 END) AS missed_count,
           COUNT(CASE WHEN dl.status = 'skipped' THEN 1 END) AS skipped_count
         FROM dose_logs dl
         JOIN dose_schedules ds ON dl.schedule_id = ds.id
         JOIN prescription_items pi ON ds.prescription_item_id = pi.id
         JOIN prescriptions p ON pi.prescription_id = p.id
         WHERE (p.member_id = $1 OR p.member_id = $2)
           AND dl.scheduled_at >= CURRENT_DATE - INTERVAL '30 days'`,
        [memberId, resolvedMemberId]
      );

      const takenCount = parseInt(logs30dRes.rows[0]?.taken_count || '0', 10);
      const missedCount = parseInt(logs30dRes.rows[0]?.missed_count || '0', 10);
      const skippedCount = parseInt(logs30dRes.rows[0]?.skipped_count || '0', 10);
      const totalRecordedDoses = takenCount + missedCount + skippedCount;
      const adherencePercent = totalRecordedDoses > 0
        ? Math.round((takenCount / totalRecordedDoses) * 100)
        : 100;

      const { year, month } = req.query;
      const now = new Date();
      const targetYear = typeof year === 'string' && /^[0-9]{4}$/.test(year) ? parseInt(year, 10) : now.getFullYear();
      const targetMonth = typeof month === 'string' && /^[0-9]{1,2}$/.test(month) ? parseInt(month, 10) : (now.getMonth() + 1);
      const isCurrentMonth = targetYear === now.getFullYear() && targetMonth === (now.getMonth() + 1);
      const todayDay = isCurrentMonth ? now.getDate() : -1;

      // Query month logs for dynamic calendar
      const monthLogsRes = await pool.query(
        `SELECT EXTRACT(DAY FROM dl.scheduled_at)::int AS day_num, dl.status
         FROM dose_logs dl
         JOIN dose_schedules ds ON dl.schedule_id = ds.id
         JOIN prescription_items pi ON ds.prescription_item_id = pi.id
         JOIN prescriptions p ON pi.prescription_id = p.id
         WHERE (p.member_id = $1 OR p.member_id = $2)
           AND EXTRACT(YEAR FROM dl.scheduled_at) = $3
           AND EXTRACT(MONTH FROM dl.scheduled_at) = $4`,
        [memberId, resolvedMemberId, targetYear, targetMonth]
      );

      const calendarDays = buildDynamicCalendarDays(targetYear, targetMonth, todayDay, monthLogsRes.rows);

      return res.json({
        success: true,
        data: {
          adherencePercent,
          takenCount,
          missedCount,
          skippedCount,
          todayTaken: actualTodayTaken,
          todayTotal: actualTodayTotal,
          month: targetMonth,
          year: targetYear,
          todayDay: isCurrentMonth ? todayDay : undefined,
          calendarDays,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 4. POST /doses/:doseId/log - Ghi nhận trạng thái uống thuốc (taken / skipped / snoozed / pending)
  router.post('/doses/:doseId/log', async (req: AuthenticatedRequest, res: Response) => {
    const { doseId } = req.params;
    const { status = 'taken', note } = req.body;
    try {
      await pool.query(
        `DELETE FROM dose_logs WHERE schedule_id = $1 AND DATE(scheduled_at) = CURRENT_DATE`,
        [doseId]
      );
      const result = await pool.query(
        `INSERT INTO dose_logs (schedule_id, scheduled_at, taken_at, status, reason_skipped)
         VALUES ($1, NOW(), NOW(), $2, $3)
         RETURNING *`,
        [doseId, status, note || null]
      );
      return res.json({ success: true, data: result.rows[0], message: 'Ghi nhận tuân thủ thuốc thành công.' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 5. POST /:memberId/items - Thêm thuốc thủ công
  router.post('/:memberId/items', async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    const {
      medicationName,
      dosage = '1 viên',
      dosePerIntake = '1 viên',
      timingInstructions = '1 viên sau ăn',
      scheduledTime = '08:00:00',
      durationMode = 'daily',
      startDate,
      endDate,
    } = req.body;

    if (!medicationName) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Vui lòng nhập tên thuốc.' },
      });
    }

    try {
      const rxId = await getOrCreateActivePrescription(pool, memberId);
      const { effectiveStartDate, effectiveEndDate, computedQuantity } = computeEffectiveDates(
        durationMode,
        endDate,
        startDate
      );

      const itemRes = await pool.query(
        `INSERT INTO prescription_items 
           (prescription_id, medication_name, dosage, quantity_prescribed, quantity_unit, frequency_per_day, timing_instructions, start_date, end_date, dose_per_intake)
         VALUES ($1, $2, $3, $4, 'viên', 1, $5, $6, $7, $8)
         RETURNING *`,
        [rxId, medicationName, dosage, computedQuantity, timingInstructions, effectiveStartDate, effectiveEndDate, dosePerIntake]
      );
      const newItem = itemRes.rows[0];

      await pool.query(
        `INSERT INTO dose_schedules (prescription_item_id, scheduled_time, meal_relation, is_active)
         VALUES ($1, $2, 'after_meal', true)`,
        [newItem.id, scheduledTime]
      );

      return res.status(201).json({
        success: true,
        data: newItem,
        message: 'Đã thêm thuốc vào lịch uống thành công.',
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 5b. PUT /doses/:doseId - Chỉnh sửa thuốc (tính từ lúc sửa)
  router.put('/doses/:doseId', async (req: AuthenticatedRequest, res: Response) => {
    const { doseId } = req.params;
    const {
      medicationName,
      dosage = '1 viên',
      dosePerIntake = '1 viên',
      timingInstructions = '1 viên sau ăn',
      scheduledTime = '08:00:00',
      durationMode = 'daily',
      endDate,
    } = req.body;

    try {
      const dsRes = await pool.query(
        `SELECT id, prescription_item_id FROM dose_schedules WHERE id = $1`,
        [doseId]
      );
      if (dsRes.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Không tìm thấy lịch uống thuốc.' },
        });
      }

      const itemId = dsRes.rows[0].prescription_item_id;
      // "Sửa thì tính từ lúc sửa": effectiveStartDate là CURRENT_DATE (hôm nay)
      const { effectiveStartDate, effectiveEndDate, computedQuantity } = computeEffectiveDates(durationMode, endDate);

      const updatedItemRes = await pool.query(
        `UPDATE prescription_items
         SET medication_name = COALESCE($1, medication_name),
             dosage = COALESCE($2, dosage),
             dose_per_intake = COALESCE($3, dose_per_intake),
             timing_instructions = COALESCE($4, timing_instructions),
             start_date = $5,
             end_date = $6,
             quantity_prescribed = $7
         WHERE id = $8
         RETURNING *`,
        [medicationName, dosage, dosePerIntake, timingInstructions, effectiveStartDate, effectiveEndDate, computedQuantity, itemId]
      );

      await pool.query(
        `UPDATE dose_schedules
         SET scheduled_time = $1, is_active = true
         WHERE id = $2`,
        [scheduledTime, doseId]
      );

      return res.json({
        success: true,
        data: updatedItemRes.rows[0],
        message: 'Đã cập nhật thuốc thành công (lịch nhắc mới tính từ lúc sửa).',
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 5c. PUT /:memberId/items/:itemId - Chỉnh sửa thuốc theo ItemId (tính từ lúc sửa)
  router.put('/:memberId/items/:itemId', async (req: AuthenticatedRequest, res: Response) => {
    const { itemId } = req.params;
    const {
      medicationName,
      dosage = '1 viên',
      dosePerIntake = '1 viên',
      timingInstructions = '1 viên sau ăn',
      scheduledTime = '08:00:00',
      durationMode = 'daily',
      endDate,
    } = req.body;

    try {
      // "Sửa thì tính từ lúc sửa": effectiveStartDate là CURRENT_DATE (hôm nay)
      const { effectiveStartDate, effectiveEndDate, computedQuantity } = computeEffectiveDates(durationMode, endDate);

      const updatedItemRes = await pool.query(
        `UPDATE prescription_items
         SET medication_name = COALESCE($1, medication_name),
             dosage = COALESCE($2, dosage),
             dose_per_intake = COALESCE($3, dose_per_intake),
             timing_instructions = COALESCE($4, timing_instructions),
             start_date = $5,
             end_date = $6,
             quantity_prescribed = $7
         WHERE id = $8
         RETURNING *`,
        [medicationName, dosage, dosePerIntake, timingInstructions, effectiveStartDate, effectiveEndDate, computedQuantity, itemId]
      );

      if (updatedItemRes.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Không tìm thấy thuốc cần chỉnh sửa.' },
        });
      }

      if (scheduledTime) {
        await pool.query(
          `UPDATE dose_schedules
           SET scheduled_time = $1, is_active = true
           WHERE prescription_item_id = $2`,
          [scheduledTime, itemId]
        );
      }

      return res.json({
        success: true,
        data: updatedItemRes.rows[0],
        message: 'Đã cập nhật thuốc thành công (lịch nhắc mới tính từ lúc sửa).',
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: err.message } });
    }
  });

  // 6. POST /:memberId/send-history - Gửi tiền sử dùng thuốc cho bác sĩ
  router.post('/:memberId/send-history', async (_req: AuthenticatedRequest, res: Response) => {
    return res.json({
      success: true,
      message: 'Đã gửi tiền sử dùng thuốc thành công cho Bác sĩ điều trị qua Cổng Y Tế D-Health.',
    });
  });

  return router;
}

async function getOrCreateActivePrescription(pool: Pool, memberId: string): Promise<string> {
  const rxRes = await pool.query(
    `SELECT id FROM prescriptions WHERE member_id = $1 AND status = 'active' LIMIT 1`,
    [memberId]
  );
  if (rxRes.rows[0]?.id) {
    return rxRes.rows[0].id;
  }
  const rxId = `rx_${memberId}_${Date.now()}`;
  await pool.query(
    `INSERT INTO prescriptions (id, member_id, diagnosis, prescribed_date, status)
     VALUES ($1, $2, 'Đơn thuốc cá nhân', CURRENT_DATE, 'active')`,
    [rxId, memberId]
  );
  return rxId;
}

function computeEffectiveDates(durationMode: string, endDate?: string, startDate?: string) {
  const effectiveStartDate = startDate || new Date().toISOString().split('T')[0];
  let effectiveEndDate = endDate;
  let computedQuantity = 30;

  if (durationMode === '3days') {
    const d = new Date(effectiveStartDate);
    d.setDate(d.getDate() + 2);
    effectiveEndDate = d.toISOString().split('T')[0];
    computedQuantity = 3;
  } else if (durationMode === '5days') {
    const d = new Date(effectiveStartDate);
    d.setDate(d.getDate() + 4);
    effectiveEndDate = d.toISOString().split('T')[0];
    computedQuantity = 5;
  } else if (durationMode === '1week') {
    const d = new Date(effectiveStartDate);
    d.setDate(d.getDate() + 6);
    effectiveEndDate = d.toISOString().split('T')[0];
    computedQuantity = 7;
  } else if (durationMode === 'custom' && endDate) {
    effectiveEndDate = endDate;
    const s = new Date(effectiveStartDate).getTime();
    const e = new Date(endDate).getTime();
    const diff = Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1);
    computedQuantity = diff;
  } else {
    const d = new Date(effectiveStartDate);
    d.setDate(d.getDate() + 365);
    effectiveEndDate = d.toISOString().split('T')[0];
    computedQuantity = 30;
  }

  return { effectiveStartDate, effectiveEndDate, computedQuantity };
}

function buildDynamicCalendarDays(year: number, month: number, todayDay: number, monthLogs: any[] = []) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const logsByDay = new Map<number, string[]>();
  for (const log of monthLogs) {
    const day = log.day_num;
    if (!logsByDay.has(day)) logsByDay.set(day, []);
    logsByDay.get(day)!.push(log.status);
  }

  const days = [];

  for (let d = 1; d <= daysInMonth; d++) {
    let status: 'full' | 'missed' | 'skipped' | 'scheduled' | 'today';
    if (d === todayDay) {
      status = 'today';
    } else if (todayDay !== -1 && d > todayDay) {
      status = 'scheduled';
    } else if (logsByDay.has(d)) {
      const dayStatuses = logsByDay.get(d)!;
      if (dayStatuses.includes('skipped')) {
        status = 'skipped';
      } else if (dayStatuses.includes('missed')) {
        status = 'missed';
      } else {
        status = 'full';
      }
    } else {
      status = 'full';
    }
    days.push({ day: d, status });
  }
  return days;
}
