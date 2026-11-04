-- Rollback Migration 004: Xóa dữ liệu seed CĐHA
DELETE FROM tumor_tracking_evaluations WHERE study_id IN ('std_img_01', 'std_img_02', 'std_img_03', 'std_img_04', 'std_img_05', 'std_img_06', 'std_img_07');
DELETE FROM imaging_series WHERE study_id IN ('std_img_01', 'std_img_02', 'std_img_03', 'std_img_04', 'std_img_05', 'std_img_06', 'std_img_07');
DELETE FROM imaging_studies WHERE id IN ('std_img_01', 'std_img_02', 'std_img_03', 'std_img_04', 'std_img_05', 'std_img_06', 'std_img_07');
DELETE FROM clinical_reports WHERE id IN ('rep_img_01', 'rep_img_02', 'rep_img_03', 'rep_img_04', 'rep_img_05', 'rep_img_06', 'rep_img_07');
