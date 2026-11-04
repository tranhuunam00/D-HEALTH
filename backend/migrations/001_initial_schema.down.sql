-- ====================================================================
-- MIGRATION 001 (DOWN): REVERSE INITIAL CORE SCHEMA & MASTER CATALOGS
-- Rollback all 31 tables and migration ledger in reverse foreign key order
-- ====================================================================

-- 1. Phân hệ Bệnh nhân & Nhật ký
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS care_tasks CASCADE;
DROP TABLE IF EXISTS dose_logs CASCADE;
DROP TABLE IF EXISTS dose_schedules CASCADE;
DROP TABLE IF EXISTS prescription_items CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS emergency_contacts CASCADE;
DROP TABLE IF EXISTS emergency_cards CASCADE;
DROP TABLE IF EXISTS tumor_tracking_evaluations CASCADE;
DROP TABLE IF EXISTS imaging_series CASCADE;
DROP TABLE IF EXISTS imaging_studies CASCADE;
DROP TABLE IF EXISTS lab_results CASCADE;
DROP TABLE IF EXISTS clinical_reports CASCADE;
DROP TABLE IF EXISTS biometric_records CASCADE;
DROP TABLE IF EXISTS connected_devices CASCADE;
DROP TABLE IF EXISTS daily_checkins CASCADE;
DROP TABLE IF EXISTS family_member_consents CASCADE;
DROP TABLE IF EXISTS family_members CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Phân hệ Cấu hình & Master Catalogs
DROP TABLE IF EXISTS config_biometric_thresholds CASCADE;
DROP TABLE IF EXISTS config_device_catalog CASCADE;
DROP TABLE IF EXISTS master_chronic_conditions CASCADE;
DROP TABLE IF EXISTS master_lab_tests CASCADE;
DROP TABLE IF EXISTS master_medications CASCADE;
DROP TABLE IF EXISTS master_doctors CASCADE;
DROP TABLE IF EXISTS master_departments CASCADE;
DROP TABLE IF EXISTS master_facilities CASCADE;

-- 3. Phân hệ Quản trị & RBAC
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- 4. Bảng sổ cái Migration
DROP TABLE IF EXISTS _migrations CASCADE;

