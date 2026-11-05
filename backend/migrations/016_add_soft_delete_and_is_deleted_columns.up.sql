-- 016_add_soft_delete_and_is_deleted_columns.up.sql
-- Thêm cột xóa mềm is_deleted cho toàn bộ các thực thể chính trong hệ thống

ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE admin_users 
    ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE patient_chronic_conditions 
    ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE care_tasks 
    ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE master_facilities 
    ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE master_doctors 
    ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_users_is_deleted ON users(is_deleted);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_deleted ON admin_users(is_deleted);
CREATE INDEX IF NOT EXISTS idx_patient_chronic_conditions_is_deleted ON patient_chronic_conditions(is_deleted);
CREATE INDEX IF NOT EXISTS idx_care_tasks_is_deleted ON care_tasks(is_deleted);
CREATE INDEX IF NOT EXISTS idx_master_facilities_is_deleted ON master_facilities(is_deleted);
CREATE INDEX IF NOT EXISTS idx_master_doctors_is_deleted ON master_doctors(is_deleted);

