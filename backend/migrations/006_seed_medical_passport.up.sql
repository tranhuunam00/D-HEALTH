-- Migration 006: Seed dữ liệu Sổ sức khoẻ điện tử / Medical Passport cho Trần Hữu Nam (SCR-10)

-- 1. Cập nhật thể trạng nền và năm sinh cho Trần Hữu Nam (Nam, 46 tuổi, 174 cm, 72.5 kg, BMI 23.9, Nhóm máu O+)
UPDATE family_members
SET 
  birth_date = '1980-04-12',
  height_cm = 174.0,
  weight_kg = 72.5,
  blood_type = 'O+',
  gender = 'Nam'
WHERE id = 'nam';

-- 2. Đảm bảo nhóm máu O+ trong emergency_cards
UPDATE emergency_cards
SET blood_group_snapshot = 'O+'
WHERE member_id = 'nam';

-- 3. Bổ sung bác sĩ vào master_doctors để đạt 6 bác sĩ
INSERT INTO master_doctors (id, facility_id, full_name, academic_title, license_number, is_active)
VALUES
  ('bs_nguyen_van_an', 'bv_bach_mai', 'Nguyễn Văn An', 'TS.BS', '000101/HNO-CCHN', true),
  ('bs_hoang_thi_dung', 'bv_k_tan_trieu', 'Hoàng Thị Dung', 'BS.CKI', '000102/HNO-CCHN', true),
  ('bs_pham_minh_duc', 'bv_dhyd_tphcm', 'Phạm Minh Đức', 'ThS.BS', '000103/HCM-CCHN', true)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  academic_title = EXCLUDED.academic_title,
  is_active = true;

-- 4. Bổ sung đơn thuốc thứ 3 (Atorvastatin 10mg) cho nam
INSERT INTO prescription_items (id, prescription_id, medication_name, dosage, quantity_prescribed, quantity_unit, frequency_per_day, timing_instructions, start_date)
VALUES
  ('55555555-0000-0000-0000-000000000003', 'rx_nam_01', 'Atorvastatin', '10mg', 30, 'viên', 1, 'Uống sau ăn tối 30 phút', '2026-06-20')
ON CONFLICT (id) DO NOTHING;

-- 5. Bổ sung 2 báo cáo Giải phẫu bệnh (GPB)
INSERT INTO clinical_reports 
  (id, member_id, kind, category, title, performed_at, facility_name, ordering_doctor_name, interpreting_doctor_name, conclusion, specimen_site)
VALUES
  ('rep_gpb_01', 'nam', 'pathology', 'GPB', 'Giải phẫu bệnh sinh thiết gan', '2026-03-18', 'Bệnh viện K', 'BS ung bướu', 'BS Lê Văn C', 'Ung thư biểu mô tế bào gan (HCC) độ 2', 'Nhu mô gan HPT VI'),
  ('rep_gpb_02', 'nam', 'pathology', 'GPB', 'Giải phẫu bệnh hạch vùng', '2026-03-18', 'Bệnh viện K', 'BS ung bướu', 'BS Lê Văn C', 'Hạch tăng sinh phản ứng, không thấy tế bào ác tính', 'Hạch rốn gan')
ON CONFLICT (id) DO NOTHING;

-- 6. Bổ sung phiếu xét nghiệm để đạt 24 phiếu xét nghiệm
DO $$
DECLARE
  i INT;
  d DATE;
  rep_id VARCHAR(50);
BEGIN
  FOR i IN 1..23 LOOP
    rep_id := 'rep_lab_seed_' || LPAD(i::text, 2, '0');
    d := DATE '2026-10-25' - (i * 12);
    INSERT INTO clinical_reports (id, member_id, kind, category, title, performed_at, facility_name, conclusion)
    VALUES (rep_id, 'nam', 'lab', 'SH', 'Xét nghiệm máu định kỳ lần ' || i, d, 'Bệnh viện Bạch Mai', 'Các chỉ số ổn định')
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
END $$;
