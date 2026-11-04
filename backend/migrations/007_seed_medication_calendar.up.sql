-- Migration 007: Cấu hình dữ liệu chi tiết quản lý dùng thuốc SCR-11 (Lịch uống thuốc & Calendar)

-- 1. Đảm bảo đơn thuốc hoạt động cho thành viên nam
INSERT INTO prescriptions (id, member_id, doctor_id, facility_id, diagnosis, prescribed_date, status)
VALUES ('rx_nam_01', 'nam', 'bs_le_van_c', 'bv_k_tan_trieu', 'Tăng huyết áp & Đái tháo đường Type 2', '2026-06-20', 'active')
ON CONFLICT (id) DO UPDATE SET status = 'active';

-- 2. Cập nhật / chèn 3 loại thuốc chính (Losartan 50mg, Metformin 500mg, Atorvastatin 20mg)
INSERT INTO prescription_items 
  (id, prescription_id, medication_name, dosage, quantity_prescribed, quantity_unit, frequency_per_day, timing_instructions, start_date, dose_per_intake)
VALUES
  ('55555555-0000-0000-0000-000000000001', 'rx_nam_01', 'Losartan', '50 mg', 30, 'viên', 1, '1 viên · sau ăn sáng', '2026-06-20', '1 viên'),
  ('55555555-0000-0000-0000-000000000002', 'rx_nam_01', 'Metformin', '500 mg', 60, 'viên', 2, '1 viên · sau ăn sáng & tối', '2026-06-20', '1 viên'),
  ('55555555-0000-0000-0000-000000000003', 'rx_nam_01', 'Atorvastatin', '20 mg', 30, 'viên', 1, '1 viên · trước khi ngủ', '2026-06-20', '1 viên')
ON CONFLICT (id) DO UPDATE SET
  medication_name = EXCLUDED.medication_name,
  dosage = EXCLUDED.dosage,
  timing_instructions = EXCLUDED.timing_instructions,
  dose_per_intake = EXCLUDED.dose_per_intake;

-- 3. Cấu hình 4 cữ uống thuốc hàng ngày
-- Cữ 1: 07:00 Sáng - Losartan 50 mg
INSERT INTO dose_schedules (id, prescription_item_id, scheduled_time, meal_relation, is_active)
VALUES ('66666666-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000001', '07:00:00', 'after_meal', true)
ON CONFLICT (id) DO UPDATE SET scheduled_time = '07:00:00', meal_relation = 'after_meal', is_active = true;

-- Cữ 2: 07:00 Sáng - Metformin 500 mg
INSERT INTO dose_schedules (id, prescription_item_id, scheduled_time, meal_relation, is_active)
VALUES ('66666666-0000-0000-0000-000000000002', '55555555-0000-0000-0000-000000000002', '07:00:00', 'after_meal', true)
ON CONFLICT (id) DO UPDATE SET scheduled_time = '07:00:00', meal_relation = 'after_meal', is_active = true;

-- Cữ 3: 20:00 Tối - Metformin 500 mg
INSERT INTO dose_schedules (id, prescription_item_id, scheduled_time, meal_relation, is_active)
VALUES ('66666666-0000-0000-0000-000000000003', '55555555-0000-0000-0000-000000000002', '20:00:00', 'after_meal', true)
ON CONFLICT (id) DO UPDATE SET scheduled_time = '20:00:00', meal_relation = 'after_meal', is_active = true;

-- Cữ 4: 21:00 Tối - Atorvastatin 20 mg
INSERT INTO dose_schedules (id, prescription_item_id, scheduled_time, meal_relation, is_active)
VALUES ('66666666-0000-0000-0000-000000000004', '55555555-0000-0000-0000-000000000003', '21:00:00', 'after_meal', true)
ON CONFLICT (id) DO UPDATE SET scheduled_time = '21:00:00', meal_relation = 'after_meal', is_active = true;

-- 4. Ghi nhận nhật ký uống thuốc cho ngày hôm nay (2 cữ sáng Đã uống, 2 cữ tối Chưa uống)
DELETE FROM dose_logs 
WHERE schedule_id IN (
  '66666666-0000-0000-0000-000000000001',
  '66666666-0000-0000-0000-000000000002',
  '66666666-0000-0000-0000-000000000003',
  '66666666-0000-0000-0000-000000000004'
) AND DATE(scheduled_at) IN (CURRENT_DATE, DATE '2026-10-26');

-- Ghi nhận 2 liều sáng đã uống cho CURRENT_DATE
INSERT INTO dose_logs (id, schedule_id, scheduled_at, taken_at, status)
VALUES
  (gen_random_uuid(), '66666666-0000-0000-0000-000000000001', CURRENT_DATE + TIME '07:00:00', CURRENT_DATE + TIME '07:15:00', 'taken'),
  (gen_random_uuid(), '66666666-0000-0000-0000-000000000002', CURRENT_DATE + TIME '07:00:00', CURRENT_DATE + TIME '07:15:00', 'taken');

-- Ghi nhận bổ sung nếu ngày demo 2026-10-26 khác ngày hệ thống
DO $$
BEGIN
  IF CURRENT_DATE != DATE '2026-10-26' THEN
    INSERT INTO dose_logs (id, schedule_id, scheduled_at, taken_at, status)
    VALUES
      (gen_random_uuid(), '66666666-0000-0000-0000-000000000001', DATE '2026-10-26 07:00:00', DATE '2026-10-26 07:15:00', 'taken'),
      (gen_random_uuid(), '66666666-0000-0000-0000-000000000002', DATE '2026-10-26 07:00:00', DATE '2026-10-26 07:15:00', 'taken')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
