-- Migration 010 (UP): Seed dữ liệu xét nghiệm lâm sàng chuẩn xác (SCR-05 & SCR-06)
-- Đảm bảo 100% dữ liệu đến từ Database thực tế, triệt tiêu dữ liệu hardcoded/default.

-- 1. Bổ sung các phiếu xét nghiệm chính thức cho Trần Hữu Nam ('nam')
INSERT INTO clinical_reports 
  (id, member_id, kind, category, title, performed_at, facility_name, ordering_doctor_name, interpreting_doctor_name, conclusion, attachment_s3_key)
VALUES
  ('rep_nam_01', 'nam', 'lab', 'SH', 'Sinh hoá máu', '2026-10-20', 'Bệnh viện Bạch Mai', 'BS Trần Văn B', 'BS Lê Văn C', 
   '10/12 chỉ số trong giới hạn tham chiếu. LDL-C và Cholesterol toàn phần cao hơn mục tiêu, LDL-C tăng 3 lần liên tiếp — nên trao đổi với bác sĩ tim mạch khi tái khám 12/11.', 
   'dhealth-reports/nam/labs/rep_nam_01.pdf'),

  ('rep_nam_02', 'nam', 'lab', 'HH', 'Tổng phân tích tế bào máu ngoại vi', '2026-10-20', 'Bệnh viện Bạch Mai', 'BS Trần Văn B', 'BS Lê Văn C', 
   '24 chỉ số trong giới hạn bình thường. Dòng hồng cầu, bạch cầu và tiểu cầu ổn định.', 
   'dhealth-reports/nam/labs/rep_nam_02.pdf'),

  ('rep_nam_03', 'nam', 'lab', 'SH', 'HbA1c', '2026-10-20', 'Bệnh viện Bạch Mai', 'BS Nguyễn Văn A', 'BS Lê Văn C', 
   '6,6% · đạt mục tiêu kiểm soát đái tháo đường type 2.', 
   NULL),

  ('rep_nam_04', 'nam', 'lab', 'VS', 'Cấy nước tiểu', '2026-08-22', 'Phòng khám Đa khoa Medlatec', 'BS Hoàng Thị D', 'BS Lê Văn C', 
   'Không mọc vi khuẩn sau 48h nuôi cấy.', 
   NULL),

  ('rep_nam_05', 'nam', 'lab', 'PT', 'HBV DNA định lượng (PCR)', '2026-06-20', 'Bệnh viện Bệnh Nhiệt đới TW', 'BS Trần Văn B', 'BS Lê Văn C', 
   'Dưới ngưỡng phát hiện (< 20 IU/mL). Tải lượng virus kiểm soát rất tốt.', 
   'dhealth-reports/nam/labs/rep_nam_05.pdf'),

  ('rep_nam_06', 'nam', 'lab', 'DT', 'Đột biến gen EGFR', '2026-05-15', 'Bệnh viện K Tân Triều', 'BS ung bướu', 'BS Lê Văn C', 
   'Âm tính đột biến exon 19, 21.', 
   'dhealth-reports/nam/labs/rep_nam_06.pdf')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  performed_at = EXCLUDED.performed_at,
  facility_name = EXCLUDED.facility_name,
  ordering_doctor_name = EXCLUDED.ordering_doctor_name,
  interpreting_doctor_name = EXCLUDED.interpreting_doctor_name,
  conclusion = EXCLUDED.conclusion,
  attachment_s3_key = EXCLUDED.attachment_s3_key;

-- 2. Xóa dữ liệu cũ nếu có trong lab_results của các phiếu này để tránh trùng lặp
DELETE FROM lab_results WHERE report_id IN ('rep_nam_01', 'rep_nam_02', 'rep_nam_03');

-- 3. Chèn 12 chỉ số xét nghiệm chi tiết cho rep_nam_01 (Sinh hoá máu - SCR-06)
INSERT INTO lab_results (report_id, test_code, test_name, value_numeric, unit, ref_min, ref_max, flag)
VALUES
  ('rep_nam_01', 'GLU', 'Glucose (đói)', 6.1, 'mmol/L', 3.9, 6.4, 'NORMAL'),
  ('rep_nam_01', 'CHOL', 'Cholesterol toàn phần', 4.8, 'mmol/L', 3.9, 5.2, 'NORMAL'),
  ('rep_nam_01', 'TRIG', 'Triglyceride', 1.4, 'mmol/L', 0.4, 1.7, 'NORMAL'),
  ('rep_nam_01', 'LDL', 'LDL-C', 3.8, 'mmol/L', 0.0, 2.6, 'HIGH'),
  ('rep_nam_01', 'HDL', 'HDL-C', 1.25, 'mmol/L', 1.0, 1.6, 'NORMAL'),
  ('rep_nam_01', 'UREA', 'Ure máu', 5.2, 'mmol/L', 2.5, 7.5, 'NORMAL'),
  ('rep_nam_01', 'CREAT', 'Creatinine', 82.0, 'µmol/L', 62.0, 106.0, 'NORMAL'),
  ('rep_nam_01', 'EGFR', 'eGFR (Độ lọc cầu thận)', 95.0, 'mL/min/1.73m²', 90.0, 120.0, 'NORMAL'),
  ('rep_nam_01', 'AST', 'AST (SGOT)', 26.0, 'U/L', 0.0, 37.0, 'NORMAL'),
  ('rep_nam_01', 'ALT', 'ALT (SGPT)', 29.0, 'U/L', 0.0, 41.0, 'NORMAL'),
  ('rep_nam_01', 'GGT', 'GGT', 32.0, 'U/L', 8.0, 61.0, 'NORMAL'),
  ('rep_nam_01', 'URIC', 'Acid Uric', 340.0, 'µmol/L', 200.0, 420.0, 'NORMAL');

-- 4. Chèn 5 chỉ số mẫu cho rep_nam_02 (Tổng phân tích máu)
INSERT INTO lab_results (report_id, test_code, test_name, value_numeric, unit, ref_min, ref_max, flag)
VALUES
  ('rep_nam_02', 'RBC', 'RBC (Hồng cầu)', 4.82, 'T/L', 4.0, 5.5, 'NORMAL'),
  ('rep_nam_02', 'HGB', 'HGB (Huyết sắc tố)', 148.0, 'g/L', 130.0, 175.0, 'NORMAL'),
  ('rep_nam_02', 'HCT', 'HCT (Hematocrit)', 0.44, 'L/L', 0.38, 0.50, 'NORMAL'),
  ('rep_nam_02', 'WBC', 'WBC (Bạch cầu)', 6.5, 'G/L', 4.0, 10.0, 'NORMAL'),
  ('rep_nam_02', 'PLT', 'PLT (Tiểu cầu)', 245.0, 'G/L', 150.0, 400.0, 'NORMAL');

-- 5. Chèn chỉ số cho rep_nam_03 (HbA1c)
INSERT INTO lab_results (report_id, test_code, test_name, value_numeric, unit, ref_min, ref_max, flag)
VALUES
  ('rep_nam_03', 'HBA1C', 'HbA1c', 6.6, '%', 4.0, 6.0, 'HIGH');

