-- Migration 010 (DOWN): Revert dữ liệu xét nghiệm lâm sàng

DELETE FROM lab_results WHERE report_id IN ('rep_nam_01', 'rep_nam_02', 'rep_nam_03');

DELETE FROM clinical_reports 
WHERE id IN ('rep_nam_01', 'rep_nam_02', 'rep_nam_03', 'rep_nam_04', 'rep_nam_05', 'rep_nam_06');

