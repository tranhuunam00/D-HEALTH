-- Migration 015: Chuẩn hóa Master Doctors theo Chuyên khoa (Category) & đồng bộ Care Team
-- Up Migration

-- 1. Thêm Chuyên khoa Bác sĩ Gia đình vào master_departments
INSERT INTO master_departments (id, code, name, icon_name, description, is_active)
VALUES ('y_hoc_gia_dinh', 'GD', 'Bác sĩ Gia đình & CSSKBĐ', 'user-check', 'Bác sĩ gia đình chăm sóc sức khỏe chủ động và theo dõi hồ sơ y tế', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  is_active = true;

-- 2. Chuẩn hóa thông tin chi tiết các bác sĩ trong master_doctors
UPDATE master_doctors
SET department_id = 'tim_mach', facility_id = 'bv_bach_mai', phone_number = '0908123456', email = 'tranvanb.cardio@dhealth.vn'
WHERE id = 'bs_tran_van_b';

UPDATE master_doctors
SET department_id = 'ung_buou', facility_id = 'bv_k_tan_trieu', phone_number = '0903891234', email = 'dung.oncology@dhealth.vn'
WHERE id = 'bs_hoang_thi_dung';

UPDATE master_doctors
SET department_id = 'noi_tiet', facility_id = 'bv_dhyd_tphcm', phone_number = '0918234567', email = 'duc.endocrine@dhealth.vn'
WHERE id = 'bs_pham_minh_duc';

UPDATE master_doctors
SET department_id = 'y_hoc_gia_dinh', facility_id = 'bv_bach_mai', phone_number = '0904567891', email = 'an.familydoc@dhealth.vn'
WHERE id = 'bs_nguyen_van_an';

-- 3. Cập nhật share_grants cho member 'nam' với thông tin liên hệ chuẩn
UPDATE share_grants
SET grantee_phone = '0908 123 456', grantee_email = 'tranvanb.cardio@dhealth.vn', grantee_org = 'Bệnh viện Bạch Mai'
WHERE grantee_id = 'bs_tran_van_b' AND member_id = 'nam';

UPDATE share_grants
SET grantee_phone = '0912 345 678', grantee_email = 'levanc.cdha@dhealth.vn', grantee_org = 'Bệnh viện K (Tân Triều)'
WHERE grantee_id = 'bs_le_van_c' AND member_id = 'nam';

-- 4. Tạo share_grants cho member 'mem_145deb71'
INSERT INTO share_grants (id, member_id, grantee_type, grantee_id, grantee_name, grantee_role, grantee_org, grantee_phone, grantee_email, expires_at, status)
VALUES
  ('sg_mem_01', 'mem_145deb71', 'doctor', 'bs_tran_van_b', 'BS Trần Văn B', 'Tim mạch', 'Bệnh viện Bạch Mai', '0908 123 456', 'tranvanb.cardio@dhealth.vn', CURRENT_TIMESTAMP + INTERVAL '7 days', 'active'),
  ('sg_mem_02', 'mem_145deb71', 'doctor', 'bs_le_van_c', 'BS Lê Văn C', 'CĐHA', 'Bệnh viện K (Tân Triều)', '0912 345 678', 'levanc.cdha@dhealth.vn', CURRENT_TIMESTAMP + INTERVAL '30 days', 'active'),
  ('sg_mem_03', 'mem_145deb71', 'family_member', 'mem_huong', 'Trần Minh Hương', 'Gia đình', 'Gia đình', '0988 776 655', 'huong.tran@gmail.com', CURRENT_TIMESTAMP + INTERVAL '365 days', 'active')
ON CONFLICT (id) DO UPDATE SET
  grantee_name = EXCLUDED.grantee_name,
  grantee_role = EXCLUDED.grantee_role,
  grantee_org = EXCLUDED.grantee_org,
  grantee_phone = EXCLUDED.grantee_phone,
  grantee_email = EXCLUDED.grantee_email,
  expires_at = EXCLUDED.expires_at,
  status = EXCLUDED.status;

-- 5. Tạo lịch hẹn tái khám cho 'mem_145deb71'
INSERT INTO appointments (id, member_id, doctor_id, doctor_name, facility_name, department_name, appointment_date, purpose, status)
VALUES ('app_mem_cardio_01', 'mem_145deb71', 'bs_tran_van_b', 'BS Trần Văn B', 'Bệnh viện Bạch Mai', 'Tim mạch', '2026-11-12 09:00:00+07', 'Tái khám tim mạch', 'scheduled')
ON CONFLICT (id) DO UPDATE SET
  doctor_name = EXCLUDED.doctor_name,
  facility_name = EXCLUDED.facility_name,
  appointment_date = EXCLUDED.appointment_date,
  purpose = EXCLUDED.purpose,
  status = EXCLUDED.status;

