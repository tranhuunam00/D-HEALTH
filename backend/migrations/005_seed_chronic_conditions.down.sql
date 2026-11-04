-- Rollback Migration 005
DELETE FROM care_tasks WHERE id IN ('55555555-0001-0000-0000-000000000001', '55555555-0002-0000-0000-000000000002');
DELETE FROM patient_chronic_conditions WHERE id IN ('pcc_tim_mach', 'pcc_dai_thao_duong');
