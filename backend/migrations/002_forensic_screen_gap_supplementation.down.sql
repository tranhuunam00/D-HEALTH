-- ====================================================================
-- MIGRATION 002 (DOWN): REVERT FORENSIC GAP SUPPLEMENTATION
-- ====================================================================

-- 1. DROP NEW TABLES
DROP TABLE IF EXISTS ai_chat_messages CASCADE;
DROP TABLE IF EXISTS ai_conversations CASCADE;
DROP TABLE IF EXISTS vaccination_records CASCADE;
DROP TABLE IF EXISTS patient_chronic_conditions CASCADE;
DROP TABLE IF EXISTS share_grants CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;

-- 2. DROP SUPPLEMENTED COLUMNS
ALTER TABLE config_device_catalog
    DROP COLUMN IF EXISTS abbr,
    DROP COLUMN IF EXISTS supported_data_types,
    DROP COLUMN IF EXISTS default_sync_frequency;

ALTER TABLE master_facilities
    DROP COLUMN IF EXISTS portal_url;

ALTER TABLE users
    DROP COLUMN IF EXISTS address,
    DROP COLUMN IF EXISTS is_biometric_login_enabled,
    DROP COLUMN IF EXISTS is_mfa_enabled;

ALTER TABLE biometric_records
    DROP COLUMN IF EXISTS body_site;

ALTER TABLE emergency_cards
    DROP COLUMN IF EXISTS primary_doctor_name,
    DROP COLUMN IF EXISTS primary_doctor_phone,
    DROP COLUMN IF EXISTS recent_medical_event,
    DROP COLUMN IF EXISTS show_on_lock_screen;

ALTER TABLE dose_logs
    DROP COLUMN IF EXISTS snoozed_until;

ALTER TABLE prescription_items
    DROP COLUMN IF EXISTS dose_per_intake,
    DROP COLUMN IF EXISTS ocr_confidence_score,
    DROP COLUMN IF EXISTS ocr_needs_review;

ALTER TABLE prescriptions
    DROP COLUMN IF EXISTS is_long_term,
    DROP COLUMN IF EXISTS discontinued_reason,
    DROP COLUMN IF EXISTS side_effects;

ALTER TABLE tumor_tracking_evaluations
    DROP COLUMN IF EXISTS custom_anatomical_site,
    DROP COLUMN IF EXISTS lesion_type,
    DROP COLUMN IF EXISTS laterality;

ALTER TABLE clinical_reports
    DROP COLUMN IF EXISTS specimen_type,
    DROP COLUMN IF EXISTS accession_number,
    DROP COLUMN IF EXISTS pathology_specimen_type,
    DROP COLUMN IF EXISTS specimen_site,
    DROP COLUMN IF EXISTS histological_grade,
    DROP COLUMN IF EXISTS ptnm_staging,
    DROP COLUMN IF EXISTS surgical_margin,
    DROP COLUMN IF EXISTS ihc_markers,
    DROP COLUMN IF EXISTS csyt_portal_url,
    DROP COLUMN IF EXISTS csyt_username,
    DROP COLUMN IF EXISTS csyt_sync_status;

ALTER TABLE connected_devices
    DROP COLUMN IF EXISTS sync_frequency,
    DROP COLUMN IF EXISTS last_rssi;
