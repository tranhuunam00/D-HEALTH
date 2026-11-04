-- Rollback Migration 006
DELETE FROM clinical_reports WHERE id LIKE 'rep_lab_seed_%' OR id IN ('rep_gpb_01', 'rep_gpb_02');
DELETE FROM prescription_items WHERE id = '55555555-0000-0000-0000-000000000003';
DELETE FROM master_doctors WHERE id IN ('bs_nguyen_van_an', 'bs_hoang_thi_dung', 'bs_pham_minh_duc');
