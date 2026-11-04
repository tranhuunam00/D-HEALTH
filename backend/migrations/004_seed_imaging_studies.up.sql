-- Migration 004: Seed 7 ca Chẩn đoán hình ảnh (CĐHA) và Đánh giá đáp ứng RECIST 1.1 cho Trần Hữu Nam (SCR-07 & SCR-08)

INSERT INTO clinical_reports 
  (id, member_id, kind, category, title, performed_at, facility_name, ordering_doctor_name, interpreting_doctor_name, technique_description, clinical_findings, conclusion, recommendations, specimen_site)
VALUES
  ('rep_img_01', 'nam', 'imaging', 'CT', 'CT ngực liều thấp', '2026-10-08', 'Bệnh viện K', 'BS Trần Văn B', 'BS Lê Văn C', 
   'Chụp cắt lớp vi tính lồng ngực liều thấp không tiêm thuốc tương phản', 
   'Nốt đặc đơn độc 7 mm ở thùy dưới phổi phải, bờ tương đối đều. Không thấy hạch trung thất hay tràn dịch màng phổi.', 
   'Nốt đặc phổi phải 7 mm', 
   'Chụp CT kiểm tra lại sau 6 tháng theo khuyến cáo Fleischner.', 'Lồng ngực / Phổi phải'),

  ('rep_img_02', 'nam', 'imaging', 'SA', 'Siêu âm thận – ổ bụng', '2026-08-22', 'Bệnh viện Bạch Mai', 'BS Nguyễn Văn A', 'BS Hoàng Thị D',
   'Siêu âm 2D và Doppler màu ổ bụng tổng quát',
   'Gan bờ đều, nhu mô đồng nhất. Thận phải có 3 nang đơn thuần, kích thước lớn nhất 16 mm. Không thấy sỏi, không ứ nước. Thận trái bình thường.',
   '3 nang thận phải, lớn nhất 16 mm',
   'Theo dõi định kỳ hàng năm.', 'Ổ bụng / Thận phải'),

  ('rep_img_03', 'nam', 'imaging', 'MRI', 'MRI gan có tiêm thuốc', '2026-08-20', '[Bệnh viện đối tác]', '[Bác sĩ ung bướu]', 'BS Lê Văn C',
   'MRI 1.5T ổ bụng trên, chuỗi T1, T2, DWI; tiêm thuốc tương phản từ, chụp động học các thì.',
   'Gan kích thước bình thường, bờ đều. Ba khối đặc ở hạ phân thuỳ VI, VII, VIII, ngấm thuốc dạng viền, kích thước giảm so với phim trước. Nang gan đơn thuần hạ phân thuỳ II, 12 mm, không thay đổi. Không thấy huyết khối tĩnh mạch cửa. Không có dịch ổ bụng.',
   'Ba khối đặc gan giảm kích thước so với phim 20/06/2026 (tổng 45 → 38 mm). Nang gan đơn thuần ổn định.',
   'Theo dõi đáp ứng điều trị, chụp lại sau 3 tháng.', 'Gan · ổ bụng trên'),

  ('rep_img_04', 'nam', 'imaging', 'SA', 'Siêu âm tuyến giáp', '2026-07-15', 'Bệnh viện Đại học Y Hà Nội', 'BS Trần Văn B', 'BS Phạm Minh E',
   'Siêu âm tuyến giáp độ phân giải cao',
   'Thùy phải có 2 nang keo nhỏ kích thước lớn nhất 7 mm và 5 mm (TIRADS 2). Thùy trái kích thước bình thường, nhu mô đều.',
   '2 nang tuyến giáp, lớn nhất 7 mm',
   'Kiểm tra định kỳ 12 tháng.', 'Tuyến giáp'),

  ('rep_img_05', 'nam', 'imaging', 'CT', 'CT bụng có cản quang', '2026-06-20', 'Bệnh viện K', 'BS ung bướu', 'BS Lê Văn C',
   'Chụp CT đa dãy ổ bụng có tiêm thuốc cản quang tĩnh mạch',
   'Ba khối đặc gan ở hạ phân thùy VI (12 mm), VII (15 mm), VIII (18 mm), tổng đường kính 45 mm.',
   'Khối đặc gan (tổng 45 mm)',
   'Tiếp tục phác đồ điều trị và chụp lại sau 2 tháng.', 'Gan · ổ bụng trên'),

  ('rep_img_06', 'nam', 'imaging', 'MRI', 'MRI gan đối quang từ', '2026-03-15', 'Bệnh viện K', 'BS ung bướu', 'BS Lê Văn C',
   'Chụp cộng hưởng từ gan mật ban đầu có tiêm thuốc đối quang từ',
   'Ba khối u đặc gan ở hạ phân thùy VI (15 mm), VII (20 mm), VIII (25 mm), tổng đường kính ban đầu 60 mm.',
   'Khối u đặc gan (tổng 60 mm)',
   'Đánh giá ban đầu trước điều trị.', 'Gan · ổ bụng trên'),

  ('rep_img_07', 'nam', 'imaging', 'XQ', 'X-quang ngực thẳng', '2026-01-10', 'Bệnh viện Bạch Mai', 'BS Nguyễn Văn A', 'BS Lê Văn C',
   'Chụp X-quang tim phổi thẳng kỹ thuật số',
   'Trường phổi hai bên sáng đều, không thấy tổn thương thâm nhiễm hay nốt mờ bất thường. Tim không to.',
   'Bình thường',
   'Khám sức khỏe định kỳ.', 'Lồng ngực')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  performed_at = EXCLUDED.performed_at,
  conclusion = EXCLUDED.conclusion,
  technique_description = EXCLUDED.technique_description,
  clinical_findings = EXCLUDED.clinical_findings,
  recommendations = EXCLUDED.recommendations;

-- Chèn dữ liệu ca chụp imaging_studies
INSERT INTO imaging_studies (id, report_id, modality, body_part, magnetic_field_strength, contrast_agent, comparison_study_id)
VALUES
  ('std_img_01', 'rep_img_01', 'CT', 'Lồng ngực / Phổi', NULL, NULL, NULL),
  ('std_img_02', 'rep_img_02', 'US', 'Ổ bụng / Thận', NULL, NULL, NULL),
  ('std_img_03', 'rep_img_03', 'MRI', 'Gan · ổ bụng trên', '1.5T', 'Gadoterate meglumine (Dotarem)', 'std_img_05'),
  ('std_img_04', 'rep_img_04', 'US', 'Tuyến giáp', NULL, NULL, NULL),
  ('std_img_05', 'rep_img_05', 'CT', 'Gan · ổ bụng trên', NULL, 'Iopromide (Ultravist)', 'std_img_06'),
  ('std_img_06', 'rep_img_06', 'MRI', 'Gan · ổ bụng trên', '1.5T', 'Gadoterate meglumine (Dotarem)', NULL),
  ('std_img_07', 'rep_img_07', 'XR', 'Lồng ngực', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  report_id = EXCLUDED.report_id,
  modality = EXCLUDED.modality,
  body_part = EXCLUDED.body_part;

-- Chèn 3 chuỗi xung DICOM then chốt cho std_img_03
INSERT INTO imaging_series (id, study_id, series_name, series_number, instance_count, dicom_s3_prefix)
VALUES
  ('33333333-0001-0000-0000-000000000001', 'std_img_03', 'T1 + thuốc', 1, 48, 'dhealth-dicom/studies/std_img_03/series_1'),
  ('33333333-0002-0000-0000-000000000002', 'std_img_03', 'T2', 2, 36, 'dhealth-dicom/studies/std_img_03/series_2'),
  ('33333333-0003-0000-0000-000000000003', 'std_img_03', 'DWI', 3, 24, 'dhealth-dicom/studies/std_img_03/series_3')
ON CONFLICT (id) DO NOTHING;

-- Chèn dữ liệu Đánh giá đáp ứng RECIST 1.1 cho std_img_03
INSERT INTO tumor_tracking_evaluations 
  (id, study_id, organ, lesion_location, lesion_count, baseline_sum_diameters_mm, nadir_sum_diameters_mm, current_sum_diameters_mm, recist_response, treatment_response_note)
VALUES
  ('44444444-0001-0000-0000-000000000001', 'std_img_03', 'Gan', 'Khối u đặc · Gan', 3, 60.0, 38.0, 38.0, 'PR', '–36,7% so với ban đầu · 20/08/26')
ON CONFLICT (id) DO UPDATE SET
  baseline_sum_diameters_mm = EXCLUDED.baseline_sum_diameters_mm,
  current_sum_diameters_mm = EXCLUDED.current_sum_diameters_mm,
  nadir_sum_diameters_mm = EXCLUDED.nadir_sum_diameters_mm,
  recist_response = EXCLUDED.recist_response,
  treatment_response_note = EXCLUDED.treatment_response_note;
