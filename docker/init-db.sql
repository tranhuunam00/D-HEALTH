-- ====================================================================
-- D-HEALTH CORE DATABASE INITIALIZATION SCRIPT (POSTGRESQL 16)
-- MASTER ARCHITECTURE & FULL DATA MODEL (SUPER ADMIN PERSPECTIVE)
-- Based on: Tactical DDD, Clean Architecture & Decree 13/2023/ND-CP
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- PHÂN HỆ 1: QUẢN TRỊ HỆ THỐNG & PHÂN QUYỀN RBAC (ADMIN PERSPECTIVE)
-- ====================================================================

-- 1. BẢNG VAI TRÒ (ROLES)
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY,              -- 'super_admin', 'clinical_admin', 'hospital_manager', 'doctor', 'patient'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. BẢNG QUYỀN HẠN HẠT NHÂN (PERMISSIONS)
CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(100) PRIMARY KEY,             -- 'users.view', 'biometrics.override', 'prescriptions.approve', 'facilities.manage'
    module VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG PHÂN QUYỀN VAI TRÒ (ROLE_PERMISSIONS)
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id VARCHAR(50) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(100) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 4. BẢNG TÀI KHOẢN QUẢN TRỊ VIÊN & BÁC SĨ (ADMIN_USERS)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role_id VARCHAR(50) NOT NULL REFERENCES roles(id),
    facility_id VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- PHÂN HỆ 2: DANH MỤC MASTER DATA ADMIN CẤU HÌNH (DYNAMIC CATALOGS)
-- ====================================================================

-- 5. DANH MỤC CƠ SỞ Y TẾ & BỆNH VIỆN ĐỐI TÁC (MASTER_FACILITIES)
CREATE TABLE IF NOT EXISTS master_facilities (
    id VARCHAR(50) PRIMARY KEY,              -- 'bv_bach_mai', 'bv_k_tan_trieu', 'bv_dhyd_tphcm'
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    short_name VARCHAR(50),
    facility_type VARCHAR(30) NOT NULL,      -- 'hospital_tw', 'hospital_provincial', 'clinic', 'lab_center'
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    hotline VARCHAR(20) NOT NULL,
    emergency_phone VARCHAR(20),
    logo_url TEXT,
    integration_type VARCHAR(30) DEFAULT 'manual',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. DANH MỤC CHUYÊN KHOA Y TẾ (MASTER_DEPARTMENTS)
CREATE TABLE IF NOT EXISTS master_departments (
    id VARCHAR(50) PRIMARY KEY,              -- 'tim_mach', 'noi_tiet', 'ung_buou', 'cdha', 'gpb'
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. DANH BẠ BÁC SĨ CHUYÊN KHOA (MASTER_DOCTORS)
CREATE TABLE IF NOT EXISTS master_doctors (
    id VARCHAR(50) PRIMARY KEY,              -- 'bs_le_van_c', 'pgs_tran_minh_h'
    facility_id VARCHAR(50) REFERENCES master_facilities(id) ON DELETE SET NULL,
    department_id VARCHAR(50) REFERENCES master_departments(id) ON DELETE SET NULL,
    full_name VARCHAR(100) NOT NULL,
    academic_title VARCHAR(50),              -- 'BS.CKII', 'ThS.BS', 'PGS.TS'
    license_number VARCHAR(50) UNIQUE,
    phone_number VARCHAR(20),
    email VARCHAR(100),
    avatar_url TEXT,
    is_teleconsult_enabled BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. TỪ ĐIỂN THUỐC & DƯỢC THƯ QUỐC GIA (MASTER_MEDICATIONS)
CREATE TABLE IF NOT EXISTS master_medications (
    id VARCHAR(50) PRIMARY KEY,              -- 'med_metformin_500', 'med_amlodipine_5'
    national_drug_code VARCHAR(50) UNIQUE,
    brand_name VARCHAR(150) NOT NULL,
    generic_name VARCHAR(150) NOT NULL,
    dosage_form VARCHAR(50) NOT NULL,        -- 'viên nén', 'viên nang', 'hỗn dịch'
    strength VARCHAR(50) NOT NULL,           -- '500 mg', '5 mg'
    route_of_administration VARCHAR(30) NOT NULL DEFAULT 'oral',
    manufacturer VARCHAR(150),
    instructions_default TEXT,
    is_prescription_required BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. TỪ ĐIỂN XÉT NGHIỆM CHUẨN LOINC (MASTER_LAB_TESTS)
CREATE TABLE IF NOT EXISTS master_lab_tests (
    id VARCHAR(50) PRIMARY KEY,              -- 'test_glucose_fasting', 'test_hba1c', 'test_ldl_c'
    loinc_code VARCHAR(20),
    test_code VARCHAR(30) UNIQUE NOT NULL,
    test_name VARCHAR(150) NOT NULL,
    test_group VARCHAR(20) NOT NULL,         -- 'SH', 'HH', 'VS', 'MD'
    unit VARCHAR(30) NOT NULL,               -- 'mmol/L', '%', 'mg/dL'
    ref_min NUMERIC(8, 2),
    ref_max NUMERIC(8, 2),
    ref_text_male VARCHAR(50),
    ref_text_female VARCHAR(50),
    critical_low NUMERIC(8, 2),
    critical_high NUMERIC(8, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. DANH MỤC BỆNH MẠN TÍNH & MÃ ICD-10 (MASTER_CHRONIC_CONDITIONS)
CREATE TABLE IF NOT EXISTS master_chronic_conditions (
    id VARCHAR(50) PRIMARY KEY,              -- 'tim_mach', 'dai_thao_duong', 'ung_thu_gan'
    icd10_code VARCHAR(20) NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    badge_color VARCHAR(20) DEFAULT '#1F7A8C',
    required_metrics JSONB NOT NULL,
    default_revisit_months INT DEFAULT 3,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. DANH MỤC THIẾT BỊ ĐO BLE Y TẾ ĐƯỢC CHỨNG NHẬN (CONFIG_DEVICE_CATALOG)
CREATE TABLE IF NOT EXISTS config_device_catalog (
    id VARCHAR(50) PRIMARY KEY,              -- 'omron_hem_7156t', 'beurer_bm_85'
    brand VARCHAR(50) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    device_type VARCHAR(30) NOT NULL,        -- 'blood_pressure', 'glucometer', 'pulse_oximeter', 'smart_scale'
    connectivity VARCHAR(20) DEFAULT 'ble',
    ble_service_uuid VARCHAR(50) NOT NULL,
    ble_char_uuid VARCHAR(50) NOT NULL,
    parser_strategy VARCHAR(50) NOT NULL,
    image_url TEXT,
    pairing_guide TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. CẤU HÌNH NGƯỠNG CẢNH BÁO SINH HIỆU ĐỘNG (CONFIG_BIOMETRIC_THRESHOLDS)
CREATE TABLE IF NOT EXISTS config_biometric_thresholds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    biometric_type VARCHAR(20) NOT NULL,     -- 'bp', 'hr', 'spo2', 'glucose', 'bmi'
    condition_id VARCHAR(50) REFERENCES master_chronic_conditions(id),
    gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nữ', 'All')) DEFAULT 'All',
    min_age INT DEFAULT 0,
    max_age INT DEFAULT 120,
    normal_min NUMERIC(8, 2),
    normal_max NUMERIC(8, 2),
    warning_low NUMERIC(8, 2),
    warning_high NUMERIC(8, 2),
    danger_low NUMERIC(8, 2),
    danger_high NUMERIC(8, 2),
    alert_message_warning TEXT,
    alert_message_danger TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- PHÂN HỆ 3: NGƯỜI DÙNG, GIA ĐÌNH & PHÂN QUYỀN ĐỒNG THUẬN (Nghị định 13)
-- ====================================================================

-- 13. TÀI KHOẢN NGƯỜI DÙNG & ĐỊNH DANH CÔNG DÂN (USERS)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    national_id VARCHAR(20) UNIQUE,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_ekyc_verified BOOLEAN DEFAULT FALSE,
    biometric_public_key TEXT,
    refresh_token_hash VARCHAR(255),
    failed_attempts INT DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. HỒ SƠ THÀNH VIÊN GIA ĐÌNH (FAMILY_MEMBERS)
CREATE TABLE IF NOT EXISTS family_members (
    id VARCHAR(50) PRIMARY KEY,              -- 'me', 'ha', 'an', 'huy', 'lan' hoặc UUID
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(30) NOT NULL,       -- 'owner', 'spouse', 'child', 'parent', 'other'
    gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nữ', 'Khác')) NOT NULL,
    birth_date DATE NOT NULL,
    blood_type VARCHAR(5) CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    height_cm NUMERIC(5, 1),
    weight_kg NUMERIC(5, 1),
    insurance_number VARCHAR(20),
    avatar_url TEXT,
    is_above_18 BOOLEAN DEFAULT TRUE,
    consent_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. BIÊN BẢN ĐỒNG THUẬN CHIA SẺ DỮ LIỆU Y TẾ THEO NGHỊ ĐỊNH 13 (FAMILY_MEMBER_CONSENTS)
CREATE TABLE IF NOT EXISTS family_member_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    granted_to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    consent_scope VARCHAR(30) NOT NULL DEFAULT 'read_all',
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'revoked', 'expired')) NOT NULL DEFAULT 'pending',
    approved_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    consent_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. NHẬT KÝ CẢM XÚC & TRIỆU CHỨNG HẰNG NGÀY (DAILY_CHECKINS - SCR-02)
CREATE TABLE IF NOT EXISTS daily_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    mood_status VARCHAR(20) CHECK (mood_status IN ('great', 'good', 'neutral', 'tired', 'bad')) NOT NULL,
    symptoms JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_member_checkin_per_day UNIQUE (member_id, checkin_date)
);

-- ====================================================================
-- PHÂN HỆ 4: SINH HIỆU & THIẾT BỊ ĐO IOT (BIOMETRICS & BLE ECOSYSTEM)
-- ====================================================================

-- 17. THIẾT BỊ ĐO BLUETOOTH ĐÃ GHÉP NỐI (CONNECTED_DEVICES)
CREATE TABLE IF NOT EXISTS connected_devices (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    catalog_device_id VARCHAR(50) REFERENCES config_device_catalog(id),
    custom_name VARCHAR(100) NOT NULL,
    mac_address VARCHAR(50),
    data_types JSONB NOT NULL,
    battery_level INT CHECK (battery_level BETWEEN 0 AND 100),
    is_connected BOOLEAN DEFAULT FALSE,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    priority_tier INT DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. CHỈ SỐ SINH TRẮC HỌC (BIOMETRIC_RECORDS - SCR-03)
CREATE TABLE IF NOT EXISTS biometric_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    group_id UUID,
    biometric_type VARCHAR(20) NOT NULL,
    systolic NUMERIC(5, 1),
    diastolic NUMERIC(5, 1),
    value_numeric NUMERIC(8, 2),
    unit VARCHAR(20) NOT NULL,
    measured_at TIMESTAMP WITH TIME ZONE NOT NULL,
    context VARCHAR(20) CHECK (context IN ('rest', 'wake', 'exercise', 'meal_before', 'meal_after', 'bed')),
    source VARCHAR(20) CHECK (source IN ('device_ble', 'apple_health', 'health_connect', 'manual')) NOT NULL,
    device_id VARCHAR(50) REFERENCES connected_devices(id) ON DELETE SET NULL,
    severity_level INT DEFAULT 1,            -- 1: Tốt (Xanh), 2: Chú ý (Vàng), 3: Nguy cơ (Đỏ)
    notes TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_biometrics_query ON biometric_records (member_id, biometric_type, measured_at DESC);

-- ====================================================================
-- PHÂN HỆ 5: HỘ CHIẾU Y TẾ, BỆNH ÁN & MINIO S3 OBJECT STORAGE
-- ====================================================================

-- 19. BÁO CÁO CẬN LÂM SÀNG TỔNG QUÁT (CLINICAL_REPORTS - SCR-05)
CREATE TABLE IF NOT EXISTS clinical_reports (
    id VARCHAR(50) PRIMARY KEY,              -- 'rep_20261020_mri', 'rep_20261008_blood'
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    kind VARCHAR(20) CHECK (kind IN ('lab', 'imaging', 'pathology', 'doc')) NOT NULL,
    category VARCHAR(20) NOT NULL,           -- 'SH', 'HH', 'CDHA', 'GPB'
    title VARCHAR(200) NOT NULL,
    performed_at DATE NOT NULL,
    facility_id VARCHAR(50) REFERENCES master_facilities(id) ON DELETE SET NULL,
    facility_name VARCHAR(150),
    ordering_doctor_id VARCHAR(50) REFERENCES master_doctors(id) ON DELETE SET NULL,
    ordering_doctor_name VARCHAR(100),
    interpreting_doctor_id VARCHAR(50) REFERENCES master_doctors(id) ON DELETE SET NULL,
    interpreting_doctor_name VARCHAR(100),
    technique_description TEXT,
    clinical_findings TEXT,
    conclusion TEXT NOT NULL,
    recommendations TEXT,
    attachment_s3_key TEXT,
    s3_bucket VARCHAR(50) DEFAULT 'dhealth-reports',
    file_sha256 VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_clinical_timeline ON clinical_reports (member_id, performed_at DESC);

-- 20. KẾT QUẢ XÉT NGHIỆM CHI TIẾT THEO DÒNG (LAB_RESULTS - SCR-05)
CREATE TABLE IF NOT EXISTS lab_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id VARCHAR(50) NOT NULL REFERENCES clinical_reports(id) ON DELETE CASCADE,
    master_test_id VARCHAR(50) REFERENCES master_lab_tests(id) ON DELETE SET NULL,
    test_code VARCHAR(30) NOT NULL,
    test_name VARCHAR(150) NOT NULL,
    value_numeric NUMERIC(8, 2),
    value_text VARCHAR(50),
    unit VARCHAR(30) NOT NULL,
    ref_min NUMERIC(8, 2),
    ref_max NUMERIC(8, 2),
    flag VARCHAR(10) CHECK (flag IN ('NORMAL', 'HIGH', 'LOW', 'CRITICAL')) NOT NULL DEFAULT 'NORMAL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_lab_results_report ON lab_results (report_id);

-- 21. CA CHỤP CHẨN ĐOÁN HÌNH ẢNH (IMAGING_STUDIES - SCR-06)
CREATE TABLE IF NOT EXISTS imaging_studies (
    id VARCHAR(50) PRIMARY KEY,
    report_id VARCHAR(50) NOT NULL REFERENCES clinical_reports(id) ON DELETE CASCADE,
    modality VARCHAR(10) CHECK (modality IN ('MRI', 'CT', 'US', 'XR', 'PET')) NOT NULL,
    body_part VARCHAR(50) NOT NULL,
    magnetic_field_strength VARCHAR(20),
    contrast_agent VARCHAR(100),
    comparison_study_id VARCHAR(50),
    dicom_study_instance_uid VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 22. CHUỖI LÁT CẮT & TỆP DICOM TRÊN MINIO S3 (IMAGING_SERIES - SCR-06)
CREATE TABLE IF NOT EXISTS imaging_series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_id VARCHAR(50) NOT NULL REFERENCES imaging_studies(id) ON DELETE CASCADE,
    series_name VARCHAR(50) NOT NULL,        -- 'T1 + thuốc', 'T2', 'DWI'
    series_number INT DEFAULT 1,
    instance_count INT DEFAULT 1,
    thumbnail_s3_key TEXT,
    dicom_s3_prefix TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 23. ĐÁNH GIÁ KHỐI U THEO CHUẨN RECIST 1.1 (TUMOR_TRACKING_EVALUATIONS - SCR-06)
CREATE TABLE IF NOT EXISTS tumor_tracking_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_id VARCHAR(50) NOT NULL REFERENCES imaging_studies(id) ON DELETE CASCADE,
    organ VARCHAR(50) NOT NULL DEFAULT 'Gan',
    lesion_location VARCHAR(100) NOT NULL,
    lesion_count INT DEFAULT 1,
    baseline_sum_diameters_mm NUMERIC(5, 1), -- 45.0 mm
    current_sum_diameters_mm NUMERIC(5, 1),  -- 38.0 mm
    nadir_sum_diameters_mm NUMERIC(5, 1),
    benign_lesions_note TEXT,
    recist_response VARCHAR(10) CHECK (recist_response IN ('CR', 'PR', 'SD', 'PD')) NOT NULL DEFAULT 'PR',
    treatment_response_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 24. THẺ CẤP CỨU OFFLINE MÃ HÓA (EMERGENCY_CARDS - SCR-16)
CREATE TABLE IF NOT EXISTS emergency_cards (
    member_id VARCHAR(50) PRIMARY KEY REFERENCES family_members(id) ON DELETE CASCADE,
    blood_group_snapshot VARCHAR(10) NOT NULL,
    allergies JSONB NOT NULL DEFAULT '[]',
    chronic_conditions JSONB DEFAULT '[]',
    current_critical_meds JSONB DEFAULT '[]',
    emergency_notes TEXT,
    offline_qr_payload TEXT NOT NULL,
    qr_signature TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 25. DANH BẠ LIÊN HỆ KHẨN CẤP (EMERGENCY_CONTACTS - SCR-16)
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    contact_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    priority_order INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- PHÂN HỆ 6: KẾ HOẠCH DÙNG THUỐC & BỆNH MẠN TÍNH (MEDICATIONS & CARE)
-- ====================================================================

-- 26. ĐƠN THUỐC ĐIỆN TỬ (PRESCRIPTIONS - SCR-11)
CREATE TABLE IF NOT EXISTS prescriptions (
    id VARCHAR(50) PRIMARY KEY,
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    facility_id VARCHAR(50) REFERENCES master_facilities(id) ON DELETE SET NULL,
    doctor_id VARCHAR(50) REFERENCES master_doctors(id) ON DELETE SET NULL,
    prescribed_date DATE NOT NULL,
    diagnosis VARCHAR(255) NOT NULL,
    icd10_code VARCHAR(50),
    status VARCHAR(20) CHECK (status IN ('active', 'completed', 'discontinued')) DEFAULT 'active',
    prescription_image_s3_key TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 27. CHI TIẾT THUỐC TRONG ĐƠN (PRESCRIPTION_ITEMS - SCR-11)
CREATE TABLE IF NOT EXISTS prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id VARCHAR(50) NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    medication_id VARCHAR(50) REFERENCES master_medications(id) ON DELETE SET NULL,
    medication_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    quantity_prescribed INT NOT NULL,
    quantity_unit VARCHAR(20) DEFAULT 'viên',
    frequency_per_day INT DEFAULT 1,
    timing_instructions VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 28. LỊCH NHẮC UỐNG THUỐC THEO KHUNG GIỜ (DOSE_SCHEDULES - SCR-02, SCR-11)
CREATE TABLE IF NOT EXISTS dose_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_item_id UUID NOT NULL REFERENCES prescription_items(id) ON DELETE CASCADE,
    scheduled_time TIME NOT NULL,
    meal_relation VARCHAR(20) CHECK (meal_relation IN ('before_meal', 'after_meal', 'with_meal', 'independent')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 29. NHẬT KÝ UỐNG THUỐC & ĐO TUÂN THỦ ADHERENCE (DOSE_LOGS - SCR-02, SCR-11)
CREATE TABLE IF NOT EXISTS dose_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID NOT NULL REFERENCES dose_schedules(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'taken', 'skipped', 'missed')) DEFAULT 'pending',
    taken_at TIMESTAMP WITH TIME ZONE,
    reason_skipped TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 30. VIỆC CẦN LÀM TIẾP THEO CỦA BỆNH NHÂN (CARE_TASKS - SCR-08)
CREATE TABLE IF NOT EXISTS care_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    condition_id VARCHAR(50) REFERENCES master_chronic_conditions(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    task_type VARCHAR(30) NOT NULL,          -- 'measure', 'lab', 'revisit', 'medication'
    due_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    priority INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- PHÂN HỆ 7: NHẬT KÝ KIỂM TOÁN TỐI CAO & AN TOÀN Y TẾ (AUDIT LOGS)
-- ====================================================================

-- 31. NHẬT KÝ KIỂM TOÁN NGHỊ ĐỊNH 13 (AUDIT_LOGS)
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id VARCHAR(50) NOT NULL,
    actor_type VARCHAR(20) NOT NULL,
    action VARCHAR(50) NOT NULL,
    target_entity VARCHAR(50) NOT NULL,
    target_id VARCHAR(50) NOT NULL,
    patient_member_id VARCHAR(50),
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_member ON audit_logs(patient_member_id, created_at DESC);

-- ====================================================================
-- SEED DỮ LIỆU MẪU CHUẨN DOANH NGHIỆP (COMPREHENSIVE SEED DATA)
-- ====================================================================

-- 1. Vai trò & Quyền hạn
INSERT INTO roles (id, name, description, is_system_role) VALUES
('super_admin', 'Quản trị viên tối cao', 'Toàn quyền kiểm soát hệ thống và danh mục Master', TRUE),
('clinical_admin', 'Quản trị lâm sàng', 'Quản lý danh mục y tế, ngưỡng sinh trắc và phác đồ', TRUE),
('doctor', 'Bác sĩ chuyên khoa', 'Xem hồ sơ được chia sẻ và phê duyệt đơn thuốc', TRUE),
('patient', 'Người dùng / Bệnh nhân', 'Chủ tài khoản và người quản lý hồ sơ gia đình', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 2. Cơ sở y tế đối tác
INSERT INTO master_facilities (id, code, name, short_name, facility_type, address, city, hotline, emergency_phone) VALUES
('bv_bach_mai', '01001', 'Bệnh viện Bạch Mai', 'BV Bạch Mai', 'hospital_tw', '78 Giải Phóng, Phương Mai, Đống Đa', 'Hà Nội', '024 3869 3731', '115'),
('bv_k_tan_trieu', '01015', 'Bệnh viện K (Cơ sở Tân Triều)', 'BV K Tân Triều', 'hospital_tw', '30 Cầu Bươu, Thanh Trì', 'Hà Nội', '0904 748 808', '024 3828 5588'),
('bv_dhyd_tphcm', '79011', 'Bệnh viện Đại học Y Dược TP.HCM', 'BV ĐHYD TP.HCM', 'hospital_tw', '215 Hồng Bàng, Phường 11, Quận 5', 'TP. Hồ Chí Minh', '028 3855 4269', '028 3952 5353'),
('vien_tim_tphcm', '79025', 'Viện Tim TP. Hồ Chí Minh', 'Viện Tim TP.HCM', 'hospital_provincial', '04 Dương Quang Trung, Phường 12, Quận 10', 'TP. Hồ Chí Minh', '028 3865 1586', '028 3865 4026'),
('bv_cho_ray', '79001', 'Bệnh viện Chợ Rẫy', 'BV Chợ Rẫy', 'hospital_tw', '201B Nguyễn Chí Thanh, Phường 12, Quận 5', 'TP. Hồ Chí Minh', '028 3855 4137', '028 3855 4138')
ON CONFLICT (id) DO NOTHING;

-- 3. Chuyên khoa y tế
INSERT INTO master_departments (id, code, name, icon_name, description) VALUES
('tim_mach', 'TM', 'Khoa Tim Mạch', 'heart', 'Khám, chẩn đoán và điều trị bệnh lý tăng huyết áp, suy tim, mạch vành'),
('noi_tiet', 'NT', 'Khoa Nội Tiết - Đái Tháo Đường', 'activity', 'Quản lý rối loạn chuyển hóa, đái tháo đường, rối loạn lipid máu'),
('ung_buou', 'UB', 'Khoa Ung Bướu & Gan Mật', 'shield', 'Chẩn đoán, hóa xạ trị và theo dõi khối u đặc theo chuẩn RECIST 1.1'),
('cdha', 'CDHA', 'Khoa Chẩn Đoán Hình Ảnh', 'camera', 'Chụp MRI 1.5T/3.0T, CT Scanner đa lát cắt, siêu âm Doppler màu'),
('gpb', 'GPB', 'Khoa Giải Phẫu Bệnh', 'microscope', 'Sinh thiết mô bệnh học, nhuộm hóa mô miễn dịch, giải phẫu tế bào')
ON CONFLICT (id) DO NOTHING;

-- 4. Bác sĩ chuyên khoa
INSERT INTO master_doctors (id, facility_id, department_id, full_name, academic_title, license_number, phone_number, email) VALUES
('bs_le_van_c', 'bv_k_tan_trieu', 'cdha', 'Lê Văn C', 'BS.CKII', 'CCHN-0012458/HN', '0912345678', 'levanc.cdha@dhealth.vn'),
('pgs_tran_minh_h', 'bv_bach_mai', 'tim_mach', 'Trần Minh H', 'PGS.TS', 'CCHN-0008921/HN', '0913456789', 'minhh.cardio@dhealth.vn'),
('ths_nguyen_thi_mai', 'bv_dhyd_tphcm', 'noi_tiet', 'Nguyễn Thị Mai', 'ThS.BS', 'CCHN-0023412/HCM', '0914567890', 'mai.endocrine@dhealth.vn')
ON CONFLICT (id) DO NOTHING;

-- 5. Từ điển thuốc quốc gia
INSERT INTO master_medications (id, national_drug_code, brand_name, generic_name, dosage_form, strength, instructions_default) VALUES
('med_metformin_500', 'VD-25412-16', 'Glucophage 500mg', 'Metformin Hydrochloride', 'Viên nén bao phim', '500 mg', 'Uống 1 viên sau ăn tối'),
('med_amlodipine_5', 'VN-18234-14', 'Amlor 5mg', 'Amlodipine Besylate', 'Viên nang', '5 mg', 'Uống 1 viên vào buổi sáng'),
('med_losartan_50', 'VD-30122-18', 'Cozaar 50mg', 'Losartan Potassium', 'Viên nén', '50 mg', 'Uống 1 viên vào buổi sáng sau ăn'),
('med_atorvastatin_20', 'VN-21980-16', 'Lipitor 20mg', 'Atorvastatin Calcium', 'Viên nén', '20 mg', 'Uống 1 viên trước khi đi ngủ'),
('med_aspirin_81', 'VD-19230-13', 'Aspirin 81mg', 'Acetylsalicylic acid', 'Viên bao tan trong ruột', '81 mg', 'Uống sau bữa ăn chính')
ON CONFLICT (id) DO NOTHING;

-- 6. Từ điển xét nghiệm chuẩn LOINC
INSERT INTO master_lab_tests (id, loinc_code, test_code, test_name, test_group, unit, ref_min, ref_max) VALUES
('test_glucose', '1558-6', 'GLU', 'Glucose (Đường huyết lúc đói)', 'SH', 'mmol/L', 4.10, 5.90),
('test_hba1c', '4548-4', 'HBA1C', 'HbA1c (Glycated Hemoglobin)', 'SH', '%', 4.00, 6.00),
('test_cholesterol', '2093-3', 'CHOL', 'Cholesterol toàn phần', 'SH', 'mmol/L', 3.90, 5.20),
('test_triglyceride', '2571-8', 'TRIG', 'Triglyceride', 'SH', 'mmol/L', 0.46, 1.88),
('test_hdl_c', '2085-9', 'HDL', 'HDL-Cholesterol (Tốt)', 'SH', 'mmol/L', 1.03, 1.55),
('test_ldl_c', '13457-7', 'LDL', 'LDL-Cholesterol (Xấu)', 'SH', 'mmol/L', 0.00, 3.40),
('test_ast', '1920-8', 'AST', 'AST (SGOT - Men gan)', 'SH', 'U/L', 0.00, 37.00),
('test_alt', '1742-6', 'ALT', 'ALT (SGPT - Men gan)', 'SH', 'U/L', 0.00, 41.00),
('test_afp', '1834-1', 'AFP', 'Alpha-Fetoprotein (Dấu ấn u gan)', 'MD', 'ng/mL', 0.00, 7.00)
ON CONFLICT (id) DO NOTHING;

-- 7. Danh mục bệnh mạn tính & Mã ICD-10
INSERT INTO master_chronic_conditions (id, icd10_code, name, category, badge_color, required_metrics, default_revisit_months) VALUES
('tim_mach', 'I10', 'Tăng Huyết Áp Nguyên Phát', 'Tim mạch', '#E11D48', '["bp", "hr", "weight"]', 3),
('dai_thao_duong', 'E11', 'Đái Tháo Đường Type 2', 'Nội tiết - Chuyển hóa', '#2563EB', '["glucose", "hba1c", "weight"]', 3),
('ung_thu_gan', 'C22.0', 'Ung Thư Biểu Mô Tế Bào Gan (HCC)', 'Ung bướu', '#7C3AED', '["afp", "ast", "alt", "weight"]', 3),
('roi_loan_lipid', 'E78.5', 'Rối Loạn Lipid Máu Hỗn Hợp', 'Tim mạch', '#D97706', '["ldl_c", "cholesterol", "triglyceride"]', 6)
ON CONFLICT (id) DO NOTHING;

-- 8. Danh mục model thiết bị IoT BLE
INSERT INTO config_device_catalog (id, brand, model_name, device_type, ble_service_uuid, ble_char_uuid, parser_strategy, pairing_guide) VALUES
('omron_hem_7156t', 'Omron', 'HEM-7156T', 'blood_pressure', '0x1810', '0x2A35', 'OmronBleParser', 'Nhấn giữ nút Bluetooth 3 giây cho đến khi biểu tượng chữ P nhấp nháy trên màn hình máy đo.'),
('beurer_bm_85', 'Beurer', 'BM 85', 'blood_pressure', '0x1810', '0x2A35', 'BeurerBleParser', 'Bật máy đo, bấm nút START/STOP và giữ nút kết nối dữ liệu.'),
('accuchek_guide', 'Roche Accu-Chek', 'Guide', 'glucometer', '0x1808', '0x2A18', 'AccuChekParser', 'Vào Cài đặt trên máy đo -> Không dây -> Ghép nối thiết bị mới.')
ON CONFLICT (id) DO NOTHING;

-- 9. Cấu hình ngưỡng sinh trắc động chuẩn y khoa
INSERT INTO config_biometric_thresholds (biometric_type, condition_id, normal_min, normal_max, warning_low, warning_high, danger_low, danger_high, alert_message_warning, alert_message_danger) VALUES
('bp', NULL, 90, 129, 85, 139, 80, 160, 'Huyết áp đang ở mức Tiền Tăng Huyết Áp (130-139 mmHg). Chú ý giảm ăn mặn và vận động nhẹ.', 'NGUY CƠ KHẨN CẤP: Huyết áp vượt ngưỡng 160 mmHg! Nghỉ ngơi 15 phút đo lại, liên hệ bác sĩ nếu kèm đau đầu.'),
('glucose', 'dai_thao_duong', 4.4, 7.2, 3.9, 10.0, 3.0, 13.9, 'Đường huyết sau ăn cao hơn mục tiêu điều trị (trên 10 mmol/L). Kiểm tra lại khẩu phần ăn.', 'BÁO ĐỘNG ĐỎ: Đường huyết quá cao (> 13.9 mmol/L) hoặc quá thấp (< 3.0 mmol/L). Nguy cơ hôn mê hạ đường huyết!'),
('spo2', NULL, 96, 100, 94, 95, 90, 93, 'Nồng độ oxy máu SpO2 đang ở ngưỡng cần theo dõi (94-95%).', 'BÁO ĐỘNG: SpO2 dưới 93%! Thở sâu và liên hệ ngay cơ sở y tế gần nhất!')
ON CONFLICT DO NOTHING;

-- 10. Người dùng mẫu & Thành viên gia đình Khang (User mobile view)
INSERT INTO users (id, phone_number, national_id, email, password_hash, is_ekyc_verified)
VALUES ('11111111-1111-1111-1111-111111111111', '0909123456', '001086012345', 'khang.tran@dhealth.vn', crypt('Khang@2026', gen_salt('bf')), TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO family_members (id, user_id, full_name, relationship, gender, birth_date, blood_type, height_cm, weight_kg, insurance_number, is_above_18, consent_approved)
VALUES 
('me', '11111111-1111-1111-1111-111111111111', 'Trần Minh Khang', 'owner', 'Nam', '1980-05-14', 'O+', 174.0, 72.5, 'DN4010123456789', TRUE, TRUE),
('ha', '11111111-1111-1111-1111-111111111111', 'Trần Thu Hà', 'spouse', 'Nữ', '1983-09-20', 'A+', 162.0, 54.0, 'DN4010123456790', TRUE, TRUE),
('an', '11111111-1111-1111-1111-111111111111', 'Trần Bảo An', 'child', 'Nữ', '2012-11-05', 'O+', 148.0, 39.0, 'TE1010123456791', FALSE, TRUE),
('huy', '11111111-1111-1111-1111-111111111111', 'Trần Gia Huy', 'child', 'Nam', '2016-03-18', 'O+', 125.0, 26.0, 'TE1010123456792', FALSE, TRUE),
('lan', '11111111-1111-1111-1111-111111111111', 'Nguyễn Thị Lan', 'parent', 'Nữ', '1952-08-10', 'B+', 155.0, 58.0, 'GD4010123456793', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 11. Chỉ số sinh trắc học của anh Khang (SCR-02, SCR-03)
INSERT INTO biometric_records (member_id, biometric_type, systolic, diastolic, value_numeric, unit, measured_at, context, source, severity_level)
VALUES 
('me', 'bp', 131.0, 82.0, 131.0, 'mmHg', '2026-10-26 07:15:00+07', 'wake', 'device_ble', 2),
('me', 'hr', NULL, NULL, 71.0, 'bpm', '2026-10-26 07:15:00+07', 'wake', 'device_ble', 1),
('me', 'weight', NULL, NULL, 72.5, 'kg', '2026-10-26 07:20:00+07', 'wake', 'manual', 2),
('me', 'glucose', NULL, NULL, 6.6, 'mmol/L', '2026-10-26 07:30:00+07', 'meal_before', 'manual', 1),
('me', 'spo2', NULL, NULL, 98.0, '%', '2026-10-26 07:16:00+07', 'rest', 'device_ble', 1),
('me', 'bmi', NULL, NULL, 23.9, 'kg/m²', '2026-10-26 07:20:00+07', 'wake', 'manual', 1)
ON CONFLICT DO NOTHING;

-- 12. Báo cáo cận lâm sàng & Xét nghiệm chi tiết (SCR-05)
INSERT INTO clinical_reports (id, member_id, kind, category, title, performed_at, facility_id, facility_name, ordering_doctor_name, interpreting_doctor_name, conclusion)
VALUES 
('rep_20261020_blood', 'me', 'lab', 'SH', 'Sinh hoá máu & Đánh giá đường huyết, lipid', '2026-10-20', 'bv_bach_mai', 'Bệnh viện Bạch Mai', 'PGS.TS Trần Minh H', 'BS Lê Văn C', 'Đường huyết và lipid máu kiểm soát ổn định. Tiếp tục duy trì phác đồ.'),
('rep_20260820_mri', 'me', 'imaging', 'CDHA', 'MRI gan có tiêm thuốc đối quang từ', '2026-08-20', 'bv_k_tan_trieu', 'Bệnh viện K Tân Triều', 'BS Ung Bướu', 'BS.CKII Lê Văn C', 'Ba khối đặc gan giảm kích thước so với phim 20/06/2026 (tổng 45 → 38 mm). Nang gan đơn thuần hạ phân thùy II ổn định.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO lab_results (report_id, master_test_id, test_code, test_name, value_numeric, unit, ref_min, ref_max, flag)
VALUES 
('rep_20261020_blood', 'test_glucose', 'GLU', 'Glucose (Đường huyết đói)', 5.4, 'mmol/L', 4.10, 5.90, 'NORMAL'),
('rep_20261020_blood', 'test_hba1c', 'HBA1C', 'HbA1c', 6.6, '%', 4.00, 6.00, 'HIGH'),
('rep_20261020_blood', 'test_cholesterol', 'CHOL', 'Cholesterol toàn phần', 4.8, 'mmol/L', 3.90, 5.20, 'NORMAL'),
('rep_20261020_blood', 'test_ldl_c', 'LDL', 'LDL-Cholesterol', 3.1, 'mmol/L', 0.00, 3.40, 'NORMAL'),
('rep_20261020_blood', 'test_hdl_c', 'HDL', 'HDL-Cholesterol', 1.2, 'mmol/L', 1.03, 1.55, 'NORMAL')
ON CONFLICT DO NOTHING;

-- 13. Ca chụp MRI gan & Đánh giá đáp ứng RECIST 1.1 (SCR-06)
INSERT INTO imaging_studies (id, report_id, modality, body_part, magnetic_field_strength, contrast_agent, comparison_study_id)
VALUES ('study_mri_gan_khang', 'rep_20260820_mri', 'MRI', 'Gan · Ổ bụng trên', '1.5T', 'Primovist', 'CT 20/06/2026')
ON CONFLICT (id) DO NOTHING;

INSERT INTO imaging_series (study_id, series_name, series_number, instance_count, dicom_s3_prefix)
VALUES 
('study_mri_gan_khang', 'T1 + thuốc', 1, 120, 'dhealth-dicom/studies/khang_mri/t1/'),
('study_mri_gan_khang', 'T2', 2, 90, 'dhealth-dicom/studies/khang_mri/t2/'),
('study_mri_gan_khang', 'DWI', 3, 60, 'dhealth-dicom/studies/khang_mri/dwi/')
ON CONFLICT DO NOTHING;

INSERT INTO tumor_tracking_evaluations (study_id, organ, lesion_location, lesion_count, baseline_sum_diameters_mm, current_sum_diameters_mm, benign_lesions_note, recist_response, treatment_response_note)
VALUES ('study_mri_gan_khang', 'Gan', 'Hạ phân thùy VI, VII, VIII', 3, 45.0, 38.0, 'Nang gan đơn thuần hạ phân thùy II, 12 mm, không đổi', 'PR', 'Đáp ứng điều trị một phần (Partial Response - PR)')
ON CONFLICT DO NOTHING;

-- 14. Đơn thuốc & Lịch uống (SCR-11, SCR-02)
INSERT INTO prescriptions (id, member_id, facility_id, doctor_id, prescribed_date, diagnosis, icd10_code, status)
VALUES ('rx_khang_2026', 'me', 'bv_bach_mai', 'pgs_tran_minh_h', '2026-10-12', 'Tăng huyết áp nguyên phát + Đái tháo đường Type 2', 'I10, E11', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO prescription_items (id, prescription_id, medication_id, medication_name, dosage, quantity_prescribed, frequency_per_day, timing_instructions, start_date, end_date)
VALUES 
('33333333-0000-0000-0000-000000000001', 'rx_khang_2026', 'med_metformin_500', 'Metformin 500 mg', '1 viên sau ăn tối', 60, 1, 'Sau ăn tối 30 phút', '2026-10-12', '2026-12-12'),
('33333333-0000-0000-0000-000000000002', 'rx_khang_2026', 'med_losartan_50', 'Losartan 50 mg', '1 viên sau ăn sáng', 60, 1, 'Sau ăn sáng', '2026-10-12', '2026-12-12')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dose_schedules (id, prescription_item_id, scheduled_time, meal_relation)
VALUES 
('44444444-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000001', '20:00:00', 'after_meal'),
('44444444-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000002', '07:30:00', 'after_meal')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dose_logs (schedule_id, scheduled_at, status, taken_at)
VALUES 
('44444444-0000-0000-0000-000000000002', '2026-10-26 07:30:00+07', 'taken', '2026-10-26 07:35:00+07'),
('44444444-0000-0000-0000-000000000001', '2026-10-26 20:00:00+07', 'pending', NULL)
ON CONFLICT DO NOTHING;

-- 15. Việc cần làm tiếp theo & Thẻ cấp cứu (SCR-08, SCR-16)
INSERT INTO care_tasks (member_id, condition_id, title, task_type, due_date, is_completed, priority)
VALUES 
('me', 'tim_mach', 'Theo dõi huyết áp sáng và tối', 'measure', '2026-11-05', FALSE, 1),
('me', 'roi_loan_lipid', 'Xét nghiệm lipid máu trước tái khám', 'lab', '2026-11-10', FALSE, 2),
('me', 'tim_mach', 'Đặt lịch tái khám 12/11', 'revisit', '2026-11-12', FALSE, 3)
ON CONFLICT DO NOTHING;

INSERT INTO emergency_cards (member_id, blood_group_snapshot, allergies, chronic_conditions, current_critical_meds, emergency_notes, offline_qr_payload, qr_signature)
VALUES ('me', 'O+', 
'[{"allergen": "Penicillin", "reaction": "Mày đay, khó thở nhẹ"}]',
'["Tăng huyết áp", "Đái tháo đường Type 2", "Sau phẫu thuật hạ phân thùy gan"]',
'["Metformin 500mg", "Losartan 50mg"]',
'Bệnh nhân có tiền sử u gan đang theo dõi đáp ứng điều trị.',
'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtZSIsIm5hbWUiOiJUcuG6p24gTWluaCBLaGFuZyIsImJsb29kIjoiTysiLCJwaG9uZSI6IjA5MDEyMzQ1NjcifQ',
'MEQCIE7xK8vZ1L5m9Xy4W2qP0rT3sV6uB8nD1fG3hJ5kL7mNAiAwQ8vX4mK1tY7pL3sD9fG2hJ5kL8mP0rT4uV7wB9n')
ON CONFLICT (member_id) DO NOTHING;

INSERT INTO emergency_contacts (member_id, contact_name, relationship, phone_number, is_primary, priority_order)
VALUES 
('me', 'Trần Thu Hà', 'Vợ', '0901234567', TRUE, 1),
('me', 'BS Lê Văn C', 'Bác sĩ điều trị', '0912345678', FALSE, 2)
ON CONFLICT DO NOTHING;


-- ====================================================================
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
