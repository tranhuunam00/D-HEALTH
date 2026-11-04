-- ====================================================================
-- MIGRATION 002 (UP): FORENSIC SCREEN GAP AUDIT & DB SUPPLEMENTATION
-- D-Health Enterprise Master Architecture - 100% UI Text Matching
-- ====================================================================

-- 1. BẢNG LỊCH HẸN KHÁM & TÁI KHÁM (SCR-09, SCR-14, SCR-17)
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(50) PRIMARY KEY,
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    doctor_id VARCHAR(50) REFERENCES master_doctors(id) ON DELETE SET NULL,
    doctor_name VARCHAR(100),
    facility_id VARCHAR(50) REFERENCES master_facilities(id) ON DELETE SET NULL,
    facility_name VARCHAR(150),
    department_name VARCHAR(100),
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    purpose TEXT,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
    remind_before_hours INT DEFAULT 24,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appointments_member ON appointments(member_id, appointment_date ASC);

-- 2. BẢNG PHÂN QUYỀN CHIA SẺ HỒ SƠ Y TẾ & BÁC SĨ (SCR-14, SCR-06, SCR-08, SCR-11)
CREATE TABLE IF NOT EXISTS share_grants (
    id VARCHAR(50) PRIMARY KEY,
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    grantee_type VARCHAR(20) NOT NULL CHECK (grantee_type IN ('doctor', 'family_member', 'caregiver', 'hospital')),
    grantee_id VARCHAR(50),
    grantee_name VARCHAR(100) NOT NULL,
    grantee_role VARCHAR(100),
    grantee_org VARCHAR(150),
    grantee_phone VARCHAR(20),
    grantee_email VARCHAR(100),
    grantee_avatar_url TEXT,
    scope VARCHAR(50) DEFAULT 'full' CHECK (scope IN ('full', 'biometrics_only', 'labs_only', 'imaging_only', 'meds_only', 'emergency_only')),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_share_grants_member ON share_grants(member_id, status);

-- 3. BẢNG QUẢN LÝ BỆNH MẠN TÍNH CÁ NHÂN (SCR-09 DISEASE COCKPIT)
CREATE TABLE IF NOT EXISTS patient_chronic_conditions (
    id VARCHAR(50) PRIMARY KEY,
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    condition_id VARCHAR(50) REFERENCES master_chronic_conditions(id) ON DELETE SET NULL,
    condition_name VARCHAR(100) NOT NULL,
    icd10_code VARCHAR(20),
    diagnosed_date DATE,
    risk_level VARCHAR(20) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    trend_status VARCHAR(50) DEFAULT 'stable',
    status_summary VARCHAR(100),
    next_checkup_date DATE,
    action_items JSONB DEFAULT '[]'::jsonb,
    target_metrics JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_patient_chronic_member ON patient_chronic_conditions(member_id, is_active);

-- 4. BẢNG TIÊM CHỦNG & LỊCH SỬ VACCINE (SCR-10 MEDICAL PASSPORT)
CREATE TABLE IF NOT EXISTS vaccination_records (
    id VARCHAR(50) PRIMARY KEY,
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    vaccine_name VARCHAR(150) NOT NULL,
    dose_number INT DEFAULT 1,
    administered_date DATE NOT NULL,
    facility_name VARCHAR(150),
    lot_number VARCHAR(50),
    next_due_date DATE,
    reactions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vaccination_member ON vaccination_records(member_id, administered_date DESC);

-- 5. BẢNG HỘI THOẠI VÀ TIN NHẮN TRỢ LÝ AI (SCR-13 AI ASSISTANT)
CREATE TABLE IF NOT EXISTS ai_conversations (
    id VARCHAR(50) PRIMARY KEY,
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    title VARCHAR(150),
    context_type VARCHAR(50) DEFAULT 'general',
    context_reference_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_chat_messages (
    id VARCHAR(50) PRIMARY KEY,
    conversation_id VARCHAR(50) NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    citations JSONB DEFAULT '[]'::jsonb,
    disclaimer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conv ON ai_chat_messages(conversation_id, created_at ASC);

-- 6. BỔ SUNG CỘT BẢNG connected_devices (SCR-04)
ALTER TABLE connected_devices
    ADD COLUMN IF NOT EXISTS sync_frequency VARCHAR(20) DEFAULT 'auto',
    ADD COLUMN IF NOT EXISTS last_rssi INT;

-- 7. BỔ SUNG CỘT BẢNG clinical_reports (SCR-06 & SCR-12)
ALTER TABLE clinical_reports
    ADD COLUMN IF NOT EXISTS specimen_type VARCHAR(100),
    ADD COLUMN IF NOT EXISTS accession_number VARCHAR(50),
    ADD COLUMN IF NOT EXISTS pathology_specimen_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS specimen_site VARCHAR(100),
    ADD COLUMN IF NOT EXISTS histological_grade VARCHAR(20),
    ADD COLUMN IF NOT EXISTS ptnm_staging VARCHAR(50),
    ADD COLUMN IF NOT EXISTS surgical_margin VARCHAR(30),
    ADD COLUMN IF NOT EXISTS ihc_markers JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS csyt_portal_url VARCHAR(255),
    ADD COLUMN IF NOT EXISTS csyt_username VARCHAR(100),
    ADD COLUMN IF NOT EXISTS csyt_sync_status VARCHAR(50) DEFAULT 'unlinked';

-- 8. BỔ SUNG CỘT BẢNG tumor_tracking_evaluations (SCR-07 & SCR-08)
ALTER TABLE tumor_tracking_evaluations
    ADD COLUMN IF NOT EXISTS custom_anatomical_site VARCHAR(100),
    ADD COLUMN IF NOT EXISTS lesion_type VARCHAR(50) DEFAULT 'solid_tumor',
    ADD COLUMN IF NOT EXISTS laterality VARCHAR(20);

-- 9. BỔ SUNG CỘT BẢNG prescriptions & prescription_items (SCR-11)
ALTER TABLE prescriptions
    ADD COLUMN IF NOT EXISTS is_long_term BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS discontinued_reason TEXT,
    ADD COLUMN IF NOT EXISTS side_effects TEXT;

ALTER TABLE prescription_items
    ADD COLUMN IF NOT EXISTS dose_per_intake VARCHAR(50),
    ALTER COLUMN end_date DROP NOT NULL,
    ADD COLUMN IF NOT EXISTS ocr_confidence_score NUMERIC(5, 2),
    ADD COLUMN IF NOT EXISTS ocr_needs_review BOOLEAN DEFAULT FALSE;

-- 10. BỔ SUNG CỘT BẢNG dose_logs (SCR-11 SNOOZE)
ALTER TABLE dose_logs
    ADD COLUMN IF NOT EXISTS snoozed_until TIMESTAMP WITH TIME ZONE;

-- 11. BỔ SUNG CỘT BẢNG emergency_cards (SCR-15 / SCR-17)
ALTER TABLE emergency_cards
    ADD COLUMN IF NOT EXISTS primary_doctor_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS primary_doctor_phone VARCHAR(20),
    ADD COLUMN IF NOT EXISTS recent_medical_event TEXT,
    ADD COLUMN IF NOT EXISTS show_on_lock_screen BOOLEAN DEFAULT TRUE;

-- 12. BỔ SUNG CỘT BẢNG biometric_records (SCR-03)
ALTER TABLE biometric_records
    ADD COLUMN IF NOT EXISTS body_site VARCHAR(50);

-- 13. BỔ SUNG CỘT BẢNG users (SCR-01 & SCR-16)
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS address TEXT,
    ADD COLUMN IF NOT EXISTS is_biometric_login_enabled BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_mfa_enabled BOOLEAN DEFAULT FALSE;

-- 14. BỔ SUNG CỘT BẢNG master_facilities (SCR-12 LINK CSYT)
ALTER TABLE master_facilities
    ADD COLUMN IF NOT EXISTS portal_url VARCHAR(255);

-- 15. BỔ SUNG CỘT BẢNG config_device_catalog (SCR-04)
ALTER TABLE config_device_catalog
    ADD COLUMN IF NOT EXISTS abbr VARCHAR(10),
    ADD COLUMN IF NOT EXISTS supported_data_types TEXT[],
    ADD COLUMN IF NOT EXISTS default_sync_frequency VARCHAR(20) DEFAULT 'auto';
