-- Migration 018: Khôi phục dữ liệu lịch hẹn mẫu nếu rollback
-- Down Migration

INSERT INTO appointments (id, member_id, doctor_id, doctor_name, facility_name, department_name, appointment_date, purpose, status)
VALUES
  ('app_mem_cardio_01', 'mem_145deb71', 'bs_tran_van_b', 'BS Trần Văn B', 'Bệnh viện Bạch Mai', 'Tim mạch', '2026-11-12 09:00:00+07', 'Tái khám tim mạch', 'scheduled')
ON CONFLICT (id) DO NOTHING;

