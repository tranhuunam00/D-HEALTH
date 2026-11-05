-- 016_add_soft_delete_and_is_deleted_columns.down.sql
DROP INDEX IF EXISTS idx_master_doctors_is_deleted;
DROP INDEX IF EXISTS idx_master_facilities_is_deleted;
DROP INDEX IF EXISTS idx_care_tasks_is_deleted;
DROP INDEX IF EXISTS idx_patient_chronic_conditions_is_deleted;
DROP INDEX IF EXISTS idx_admin_users_is_deleted;
DROP INDEX IF EXISTS idx_users_is_deleted;

ALTER TABLE master_doctors DROP COLUMN IF EXISTS is_deleted;
ALTER TABLE master_facilities DROP COLUMN IF EXISTS is_deleted;
ALTER TABLE care_tasks DROP COLUMN IF EXISTS is_deleted;
ALTER TABLE patient_chronic_conditions DROP COLUMN IF EXISTS is_deleted;
ALTER TABLE admin_users DROP COLUMN IF EXISTS is_deleted;
ALTER TABLE users DROP COLUMN IF EXISTS is_deleted;

