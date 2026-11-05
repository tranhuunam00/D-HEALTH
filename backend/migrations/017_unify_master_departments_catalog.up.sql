-- Migration 017: Đồng bộ hóa chuẩn danh mục Chuyên khoa Y tế (Master Departments) giữa Backend & Frontend
-- Up Migration

-- 1. Bổ sung các cột định dạng chuẩn cho hiển thị UI (short_name, color)
ALTER TABLE master_departments
  ADD COLUMN IF NOT EXISTS short_name VARCHAR(50),
  ADD COLUMN IF NOT EXISTS color VARCHAR(20) DEFAULT 'pink';

-- 2. Cập nhật dữ liệu chuẩn cho 6 chuyên khoa đã có
UPDATE master_departments
SET code = 'TM', short_name = 'Tim mạch', color = 'pink', icon_name = 'heart',
    description = 'Khám, theo dõi và điều trị tăng huyết áp, suy tim, bệnh mạch vành'
WHERE id = 'tim_mach';

UPDATE master_departments
SET code = 'NT', short_name = 'Nội tiết', color = 'mint', icon_name = 'activity',
    description = 'Quản lý đái tháo đường Type 1/Type 2, rối loạn chuyển hóa lipid máu'
WHERE id = 'noi_tiet';

UPDATE master_departments
SET code = 'CD', short_name = 'CĐHA', color = 'purple', icon_name = 'camera',
    description = 'Chụp MRI 1.5T/3.0T, CT Scanner, X-Quang, siêu âm Doppler màu'
WHERE id = 'cdha';

UPDATE master_departments
SET code = 'UB', short_name = 'Ung bướu', color = 'rose', icon_name = 'shield',
    description = 'Chẩn đoán u bướu, theo dõi khối u đặc theo chuẩn RECIST 1.1'
WHERE id = 'ung_buou';

UPDATE master_departments
SET code = 'GD', short_name = 'Gia đình', color = 'blue', icon_name = 'user-check',
    description = 'Bác sĩ gia đình chăm sóc sức khỏe chủ động và theo dõi hồ sơ y tế'
WHERE id = 'y_hoc_gia_dinh';

UPDATE master_departments
SET code = 'GP', short_name = 'Giải phẫu bệnh', color = 'amber', icon_name = 'microscope',
    description = 'Sinh thiết mô bệnh học, nhuộm hóa mô miễn dịch IHC, giải phẫu tế bào'
WHERE id = 'gpb';

-- 3. Bổ sung 4 chuyên khoa còn thiếu để đủ 10 khoa chuẩn như Frontend và Y khoa quốc gia
INSERT INTO master_departments (id, code, name, short_name, icon_name, color, description, is_active)
VALUES
  ('ho_hap', 'HH', 'Khoa Hô Hấp & Phổi', 'Hô hấp', 'wind', 'blue', 'Bệnh lý hô hấp, hen phế quản, COPD, viêm phổi', true),
  ('tieu_hoa', 'TH', 'Khoa Tiêu Hóa', 'Tiêu hóa', 'utensils', 'amber', 'Bệnh lý dạ dày, đại tràng, gan mật tụy', true),
  ('than_kinh', 'TK', 'Khoa Thần Kinh', 'Thần kinh', 'brain', 'purple', 'Bệnh lý thần kinh, đột quỵ, đau đầu, rối loạn giấc ngủ', true),
  ('co_xuong_khop', 'CK', 'Khoa Cơ Xương Khớp', 'Cơ xương khớp', 'bone', 'slate', 'Thoái hóa khớp, loãng xương, viêm khớp dạng thấp, gout', true)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  icon_name = EXCLUDED.icon_name,
  color = EXCLUDED.color,
  description = EXCLUDED.description,
  is_active = true;

-- 4. Đảm bảo đầy đủ cả Bác sĩ Nội tiết (ThS Nguyễn Thị Mai) và Ung bướu (BS Hoàng Thị Dung) cho mem_145deb71
INSERT INTO share_grants (id, member_id, grantee_type, grantee_id, grantee_name, grantee_role, grantee_org, grantee_phone, grantee_email, expires_at, status)
VALUES
  ('sg_mem_04', 'mem_145deb71', 'doctor', 'ths_nguyen_thi_mai', 'ThS.BS Nguyễn Thị Mai', 'Nội tiết', 'Bệnh viện ĐHYD TP.HCM', '0914 567 890', 'mai.endocrine@dhealth.vn', CURRENT_TIMESTAMP + INTERVAL '90 days', 'active'),
  ('sg_mem_05', 'mem_145deb71', 'doctor', 'bs_hoang_thi_dung', 'BS Hoàng Thị Dung', 'Ung bướu', 'Bệnh viện K (Tân Triều)', '0903 891 234', 'dung.oncology@dhealth.vn', CURRENT_TIMESTAMP + INTERVAL '90 days', 'active')
ON CONFLICT (id) DO UPDATE SET
  grantee_id = EXCLUDED.grantee_id,
  grantee_name = EXCLUDED.grantee_name,
  grantee_role = EXCLUDED.grantee_role,
  grantee_org = EXCLUDED.grantee_org,
  grantee_phone = EXCLUDED.grantee_phone,
  grantee_email = EXCLUDED.grantee_email,
  status = 'active';
