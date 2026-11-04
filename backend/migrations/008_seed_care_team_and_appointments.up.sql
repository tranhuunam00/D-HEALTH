-- Migration 008: Seed dữ liệu Lịch hẹn, Đội ngũ chăm sóc (My Care Team) và Chia sẻ dữ liệu SCR-14

-- 1. Bổ sung Bác sĩ Trần Văn B vào master_doctors
INSERT INTO master_doctors (id, full_name, academic_title, license_number, phone_number, email, is_active)
VALUES ('bs_tran_van_b', 'Trần Văn B', 'BS', '000104/HNO-CCHN', '[Số điện thoại]', '[email bác sĩ]', true)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  academic_title = EXCLUDED.academic_title,
  phone_number = EXCLUDED.phone_number,
  email = EXCLUDED.email,
  is_active = true;

-- 2. Thêm lịch hẹn sắp tới (Tái khám tim mạch 12/11/2026 lúc 09:00 với BS Trần Văn B)
INSERT INTO appointments (id, member_id, doctor_id, doctor_name, facility_name, department_name, appointment_date, purpose, status)
VALUES ('app_nam_cardio_01', 'nam', 'bs_tran_van_b', 'BS Trần Văn B', '[Bệnh viện đối tác]', 'Tim mạch', '2026-11-12 09:00:00+07', 'Tái khám tim mạch', 'scheduled')
ON CONFLICT (id) DO UPDATE SET
  doctor_name = EXCLUDED.doctor_name,
  facility_name = EXCLUDED.facility_name,
  appointment_date = EXCLUDED.appointment_date,
  purpose = EXCLUDED.purpose,
  status = EXCLUDED.status;

-- 3. Thêm 3 quyền chia sẻ dữ liệu y tế (3 người đang có quyền, 1 hết hạn sau 7 ngày)
INSERT INTO share_grants (id, member_id, grantee_type, grantee_id, grantee_name, grantee_role, grantee_org, grantee_phone, grantee_email, expires_at, status)
VALUES
  ('sg_01', 'nam', 'doctor', 'bs_tran_van_b', 'BS Trần Văn B', 'Tim mạch', '[Bệnh viện đối tác]', '[Số điện thoại]', '[email bác sĩ]', CURRENT_TIMESTAMP + INTERVAL '7 days', 'active'),
  ('sg_02', 'nam', 'doctor', 'bs_le_van_c', 'BS Lê Văn C', 'CĐHA', 'Bệnh viện K', '0912345678', 'levanc.cdha@dhealth.vn', CURRENT_TIMESTAMP + INTERVAL '30 days', 'active'),
  ('sg_03', 'nam', 'family_member', 'mem_huong', 'Trần Minh Hương', 'Gia đình', 'Gia đình', '0988776655', 'huong.tran@gmail.com', CURRENT_TIMESTAMP + INTERVAL '365 days', 'active')
ON CONFLICT (id) DO UPDATE SET
  grantee_name = EXCLUDED.grantee_name,
  grantee_role = EXCLUDED.grantee_role,
  grantee_org = EXCLUDED.grantee_org,
  grantee_phone = EXCLUDED.grantee_phone,
  grantee_email = EXCLUDED.grantee_email,
  expires_at = EXCLUDED.expires_at,
  status = EXCLUDED.status;
