-- ====================================================================
-- D-HEALTH CORE DATABASE INITIALIZATION SCRIPT (POSTGRESQL 16)
-- Based on: Tactical DDD Architecture & Decree 13/2023/ND-CP Compliance
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. BẢNG TÀI KHOẢN NGƯỜI DÙNG & ĐỊNH DANH (USERS)
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

-- 2. HỒ SƠ THÀNH VIÊN GIA ĐÌNH & PHÂN QUYỀN ĐỒNG THUẬN (FAMILY_MEMBERS)
CREATE TABLE IF NOT EXISTS family_members (
    id VARCHAR(50) PRIMARY KEY, -- 'me', 'ha', 'an', 'huy', 'lan' hoặc UUID
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(30) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nữ', 'Khác')),
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

-- 3. CHỈ SỐ SINH TRẮC HỌC (BIOMETRIC_RECORDS)
CREATE TABLE IF NOT EXISTS biometric_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    group_id UUID,
    biometric_type VARCHAR(20) NOT NULL, -- 'bp', 'hr', 'spo2', 'temp', 'rr', 'bmi', 'steps', 'sleep'
    systolic NUMERIC(5, 1),
    diastolic NUMERIC(5, 1),
    value_numeric NUMERIC(8, 2),
    unit VARCHAR(20) NOT NULL,
    measured_at TIMESTAMP WITH TIME ZONE NOT NULL,
    context VARCHAR(20) CHECK (context IN ('rest', 'wake', 'exercise', 'meal', 'bed')),
    source VARCHAR(20) CHECK (source IN ('device', 'manual')) NOT NULL,
    device_id VARCHAR(50),
    device_name VARCHAR(100),
    severity_level INT DEFAULT 1,
    notes TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_biometrics_query ON biometric_records (member_id, biometric_type, measured_at DESC);

-- 4. THIẾT BỊ KẾT NỐI (CONNECTED_DEVICES)
CREATE TABLE IF NOT EXISTS connected_devices (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_group VARCHAR(50) NOT NULL,
    device_id VARCHAR(50) NOT NULL,
    device_name VARCHAR(100) NOT NULL,
    mac_address VARCHAR(50),
    battery_level INT,
    data_types JSONB NOT NULL,
    sync_interval VARCHAR(20) DEFAULT 'realtime',
    priority_tier INT DEFAULT 50,
    is_connected BOOLEAN DEFAULT TRUE,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. BÁO CÁO CẬN LÂM SÀNG TỔNG QUÁT (CLINICAL_REPORTS)
CREATE TABLE IF NOT EXISTS clinical_reports (
    id VARCHAR(50) PRIMARY KEY,
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    kind VARCHAR(20) CHECK (kind IN ('lab', 'imaging', 'pathology', 'doc')) NOT NULL,
    category VARCHAR(20) NOT NULL, -- 'SH', 'HH', 'VS', 'PT', 'DT'
    title VARCHAR(150) NOT NULL,
    performed_at DATE NOT NULL,
    facility_name VARCHAR(150),
    ordering_doctor VARCHAR(100),
    interpreting_doctor VARCHAR(100),
    summary TEXT,
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_clinical_timeline ON clinical_reports (member_id, performed_at DESC);

-- 6. KẾT QUẢ XÉT NGHIỆM CHI TIẾT (LAB_RESULTS)
CREATE TABLE IF NOT EXISTS lab_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id VARCHAR(50) NOT NULL REFERENCES clinical_reports(id) ON DELETE CASCADE,
    analyte_code VARCHAR(20), -- LOINC Code
    analyte_name VARCHAR(100) NOT NULL,
    result_value NUMERIC(8, 2) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    ref_low NUMERIC(8, 2),
    ref_high NUMERIC(8, 2),
    ref_text VARCHAR(100),
    abnormal_flag VARCHAR(5) CHECK (abnormal_flag IN ('N', 'L', 'H', 'LL', 'HH')),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. CHẨN ĐOÁN HÌNH ẢNH & RECIST 1.1 (IMAGING_STUDIES)
CREATE TABLE IF NOT EXISTS imaging_studies (
    id VARCHAR(50) PRIMARY KEY,
    report_id VARCHAR(50) NOT NULL REFERENCES clinical_reports(id) ON DELETE CASCADE,
    modality VARCHAR(10) CHECK (modality IN ('SA', 'XQ', 'MM', 'CT', 'MRI')) NOT NULL,
    body_part VARCHAR(100) NOT NULL,
    technique_description TEXT,
    findings_text TEXT,
    conclusion_text TEXT,
    recommendations_text TEXT,
    compared_study_id VARCHAR(50) REFERENCES imaging_studies(id),
    recist_code VARCHAR(10) CHECK (recist_code IN ('CR', 'PR', 'SD', 'PD', 'NE')),
    dicom_series_urls JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. THEO DÕI TỔN THƯƠNG ĐÍCH (IMAGING_LESIONS)
CREATE TABLE IF NOT EXISTS imaging_lesions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_id VARCHAR(50) NOT NULL REFERENCES imaging_studies(id) ON DELETE CASCADE,
    lesion_group_id VARCHAR(50) NOT NULL,
    lesion_name VARCHAR(100) NOT NULL,
    lesion_type VARCHAR(20) CHECK (lesion_type IN ('solid', 'cyst', 'other')) NOT NULL,
    target_organ VARCHAR(50) NOT NULL,
    laterality VARCHAR(30),
    max_diameter_mm NUMERIC(6, 1) NOT NULL,
    is_target_lesion BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. MẪU PHÁC ĐỒ & BỆNH MẠN TÍNH (CONDITIONS)
CREATE TABLE IF NOT EXISTS condition_templates (
    id VARCHAR(50) PRIMARY KEY,
    disease_code VARCHAR(20) UNIQUE NOT NULL,
    disease_name VARCHAR(100) NOT NULL,
    tracked_metrics JSONB NOT NULL,
    default_tasks JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    template_id VARCHAR(50) REFERENCES condition_templates(id),
    condition_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'monitored', 'resolved')) DEFAULT 'active',
    risk_level VARCHAR(30),
    trend VARCHAR(30),
    diagnosed_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS care_plan_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    condition_id UUID NOT NULL REFERENCES conditions(id) ON DELETE CASCADE,
    task_title VARCHAR(200) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. ĐƠN THUỐC & LỊCH UỐNG THUỐC (PRESCRIPTIONS & DOSE_SCHEDULES)
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    medication_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    form VARCHAR(30) NOT NULL,
    instructions VARCHAR(200) NOT NULL,
    indication VARCHAR(100),
    prescribing_doctor VARCHAR(100),
    started_at DATE NOT NULL,
    ended_at DATE,
    side_effects TEXT,
    status VARCHAR(20) CHECK (status IN ('active', 'discontinued')) DEFAULT 'active',
    discontinued_at DATE,
    discontinuation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dose_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    slot VARCHAR(10) CHECK (slot IN ('Sáng', 'Trưa', 'Chiều', 'Tối')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'taken', 'missed', 'skipped', 'snoozed')) DEFAULT 'pending',
    actual_taken_time TIMESTAMP WITH TIME ZONE,
    snooze_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_dose_calendar ON dose_schedules (prescription_id, scheduled_date);

-- 11. DỊ ỨNG & LIÊN HỆ CẤP CỨU (ALLERGIES & EMERGENCY)
CREATE TABLE IF NOT EXISTS allergy_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    allergen_name VARCHAR(100) NOT NULL,
    allergy_type VARCHAR(20) CHECK (allergy_type IN ('drug', 'food', 'environmental')) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe', 'anaphylaxis')) NOT NULL,
    reaction_description TEXT,
    diagnosed_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(30) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    priority_order INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. BÁC SĨ & LỊCH HẸN (CARE_DOCTORS & APPOINTMENTS)
CREATE TABLE IF NOT EXISTS care_doctors (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    facility_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS care_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    doctor_id VARCHAR(50) REFERENCES care_doctors(id),
    appointment_title VARCHAR(150) NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot TIME NOT NULL,
    status VARCHAR(20) CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. AUDIT VÀ NGHỊ ĐỊNH 13/2023/NĐ-CP (ACCESS_AUDIT_LOGS)
CREATE TABLE IF NOT EXISTS access_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accessor_id VARCHAR(50) NOT NULL,
    accessor_role VARCHAR(50) NOT NULL,
    target_member_id VARCHAR(50) NOT NULL,
    accessed_resource VARCHAR(100) NOT NULL,
    action_type VARCHAR(30) NOT NULL,
    ip_address VARCHAR(50),
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- SEED DỮ LIỆU BAN ĐẦU CHUẨN 100% GIAO DIỆN KHANG & GIA ĐÌNH
-- ====================================================================

-- 1. User & Family Members
INSERT INTO users (id, national_id, phone_number, email, password_hash, is_ekyc_verified)
VALUES ('00000000-0000-0000-0000-000000000001', '001080001234', '0901234567', 'khang.tm@gmail.com', crypt('123456', gen_salt('bf')), TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO family_members (id, user_id, full_name, relationship, gender, birth_date, blood_type, height_cm, weight_kg, insurance_number, is_above_18, consent_approved)
VALUES 
('me', '00000000-0000-0000-0000-000000000001', 'Trần Minh Khang', 'owner', 'Nam', '1980-08-15', 'O+', 174.0, 72.5, 'GD4010123456789', TRUE, TRUE),
('ha', '00000000-0000-0000-0000-000000000001', 'Lê Thu Hà', 'spouse', 'Nữ', '1980-10-20', 'A+', 158.0, 52.0, 'GD4010123456790', TRUE, TRUE),
('an', '00000000-0000-0000-0000-000000000001', 'Trần Minh An', 'child', 'Nam', '2007-03-12', 'O+', 175.0, 66.0, 'GD4010123456791', TRUE, FALSE), -- 19 tuổi, chưa consent
('huy', '00000000-0000-0000-0000-000000000001', 'Trần Minh Huy', 'child', 'Nam', '2010-09-05', 'O+', 170.0, 58.0, 'TE4010123456792', FALSE, TRUE), -- 16 tuổi (vị thành niên)
('lan', '00000000-0000-0000-0000-000000000001', 'Nguyễn Thị Lan', 'parent', 'Nữ', '1960-05-18', 'A+', 155.0, 58.0, 'HT4010123456793', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 2. Dị ứng & Người liên hệ khẩn cấp
INSERT INTO allergy_items (member_id, allergen_name, allergy_type, severity, reaction_description)
VALUES ('me', 'Penicillin', 'drug', 'anaphylaxis', 'Sốc phản vệ độ 2 khi tiêm kháng sinh nhóm beta-lactam')
ON CONFLICT DO NOTHING;

INSERT INTO emergency_contacts (member_id, name, relationship, phone, priority_order)
VALUES ('me', 'Lê Thu Hà', 'Vợ', '0987654321', 1)
ON CONFLICT DO NOTHING;

-- 3. Bác sĩ điều trị
INSERT INTO care_doctors (id, user_id, full_name, specialty, facility_name, phone, email)
VALUES 
('doc-cardio', '00000000-0000-0000-0000-000000000001', 'BS Trần Văn B', 'Tim mạch', 'Bệnh viện đối tác', '0901112233', 'bstranvanb@bv.vn'),
('doc-gp', '00000000-0000-0000-0000-000000000001', 'BS Hoàng Thị D', 'Bác sĩ gia đình', 'Phòng khám gia đình', '0912345678', 'bshoangthid@pk.vn'),
('doc-rad', '00000000-0000-0000-0000-000000000001', 'BS Lê Văn C', 'Chẩn đoán hình ảnh', 'Bệnh viện đối tác', '0903334455', 'bslevanc@bv.vn')
ON CONFLICT (id) DO NOTHING;

-- 4. Bệnh mạn tính & Care Tasks
INSERT INTO condition_templates (id, disease_code, disease_name, tracked_metrics, default_tasks)
VALUES 
('tmpl-cvd', 'CVD', 'Tim mạch', '["bp", "hr", "bmi", "ldl", "hba1c"]', '["Theo dõi huyết áp sáng và tối", "Xét nghiệm lipid máu trước tái khám"]'),
('tmpl-t2d', 'T2D', 'Đái tháo đường type 2', '["hba1c", "glu", "bmi", "bp", "creatinine"]', '["Đo đường huyết đói", "Kiểm tra bàn chân"]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO conditions (id, member_id, template_id, condition_name, status, risk_level, trend)
VALUES 
('11111111-0000-0000-0000-000000000001', 'me', 'tmpl-cvd', 'Tim mạch', 'active', 'Trung bình', 'Ổn định'),
('11111111-0000-0000-0000-000000000002', 'me', 'tmpl-t2d', 'Đái tháo đường', 'active', 'Theo dõi', 'Ổn định')
ON CONFLICT (id) DO NOTHING;

INSERT INTO care_plan_tasks (condition_id, task_title, frequency, is_completed)
VALUES 
('11111111-0000-0000-0000-000000000001', 'Theo dõi huyết áp sáng và tối', 'daily', FALSE),
('11111111-0000-0000-0000-000000000001', 'Xét nghiệm lipid máu trước tái khám', 'before_appointment', FALSE)
ON CONFLICT DO NOTHING;

-- 5. Phiếu xét nghiệm 20/10/2026 & 12 chỉ số
INSERT INTO clinical_reports (id, member_id, kind, category, title, performed_at, facility_name, ordering_doctor, interpreting_doctor, summary)
VALUES ('rep-lab-20261020', 'me', 'lab', 'SH', 'Sinh hoá máu', '2026-10-20', 'Bệnh viện đối tác', 'BS Trần Văn B', 'BS Lê Văn C', '12 chỉ số · LDL-C, Cholesterol TP tăng')
ON CONFLICT (id) DO NOTHING;

INSERT INTO lab_results (report_id, analyte_code, analyte_name, result_value, unit, ref_low, ref_high, ref_text, abnormal_flag, display_order)
VALUES 
('rep-lab-20261020', '1558-6', 'Glucose (đói)', 6.1, 'mmol/L', 3.9, 6.4, '3,9 – 6,4', 'N', 1),
('rep-lab-20261020', '3094-0', 'Urê', 5.2, 'mmol/L', 2.5, 7.5, '2,5 – 7,5', 'N', 2),
('rep-lab-20261020', '2160-0', 'Creatinin', 92, 'µmol/L', 62, 106, '62 – 106', 'N', 3),
('rep-lab-20261020', '33914-3', 'eGFR', 82, 'mL/ph/1,73m²', 60, NULL, '≥ 60', 'N', 4),
('rep-lab-20261020', '1920-8', 'AST (GOT)', 28, 'U/L', NULL, 40, '< 40', 'N', 5),
('rep-lab-20261020', '1742-6', 'ALT (GPT)', 32, 'U/L', NULL, 41, '< 41', 'N', 6),
('rep-lab-20261020', '2324-2', 'GGT', 35, 'U/L', NULL, 60, '< 60', 'N', 7),
('rep-lab-20261020', '3086-6', 'Acid uric', 380, 'µmol/L', 202, 416, '202 – 416', 'N', 8),
('rep-lab-20261020', '2093-3', 'Cholesterol TP', 6.1, 'mmol/L', NULL, 5.2, '< 5,2', 'H', 9),
('rep-lab-20261020', '2571-8', 'Triglycerid', 1.6, 'mmol/L', NULL, 1.7, '< 1,7', 'N', 10),
('rep-lab-20261020', '2085-9', 'HDL-C', 1.1, 'mmol/L', 1.0, NULL, '> 1,0', 'N', 11),
('rep-lab-20261020', '13457-7', 'LDL-C', 3.8, 'mmol/L', NULL, 3.0, '< 3,0', 'H', 12)
ON CONFLICT DO NOTHING;

-- Phiếu HbA1c ngày 20/10
INSERT INTO clinical_reports (id, member_id, kind, category, title, performed_at, facility_name, summary)
VALUES ('rep-hba1c-20261020', 'me', 'lab', 'SH', 'HbA1c', '2026-10-20', 'Bệnh viện đối tác', '6,6% · đạt mục tiêu')
ON CONFLICT (id) DO NOTHING;

INSERT INTO lab_results (report_id, analyte_code, analyte_name, result_value, unit, ref_low, ref_high, ref_text, abnormal_flag, display_order)
VALUES ('rep-hba1c-20261020', '4548-4', 'HbA1c', 6.6, '%', 4.0, 7.0, '< 7,0%', 'N', 1)
ON CONFLICT DO NOTHING;

-- 6. Sinh trắc học 7 ngày Huyết áp & Nhịp tim
INSERT INTO biometric_records (member_id, biometric_type, systolic, diastolic, unit, measured_at, context, source, severity_level, notes)
VALUES 
('me', 'bp', 138, 87, 'mmHg', '2026-10-20 07:15:00+07', 'rest', 'device', 1, 'Đo sáng lúc nghỉ'),
('me', 'bp', 135, 85, 'mmHg', '2026-10-21 07:15:00+07', 'rest', 'device', 1, 'Đo sáng lúc nghỉ'),
('me', 'bp', 134, 84, 'mmHg', '2026-10-22 07:15:00+07', 'rest', 'device', 1, 'Đo sáng lúc nghỉ'),
('me', 'bp', 132, 83, 'mmHg', '2026-10-23 07:15:00+07', 'rest', 'device', 1, 'Đo sáng lúc nghỉ'),
('me', 'bp', 133, 84, 'mmHg', '2026-10-24 07:15:00+07', 'rest', 'device', 1, 'Đo sáng lúc nghỉ'),
('me', 'bp', 130, 81, 'mmHg', '2026-10-25 07:15:00+07', 'rest', 'device', 1, 'Đo sáng lúc nghỉ'),
('me', 'bp', 131, 82, 'mmHg', '2026-10-26 07:15:00+07', 'rest', 'device', 1, 'Đo sáng lúc nghỉ')
ON CONFLICT DO NOTHING;

INSERT INTO biometric_records (member_id, biometric_type, value_numeric, unit, measured_at, context, source, severity_level)
VALUES 
('me', 'hr', 71, 'bpm', '2026-10-26 07:15:00+07', 'rest', 'device', 1),
('me', 'spo2', 98, '%', '2026-10-26 06:50:00+07', 'rest', 'device', 1),
('me', 'temp', 36.7, '°C', '2026-10-26 06:50:00+07', 'rest', 'device', 1),
('me', 'rr', 16, 'l/p', '2026-10-26 06:50:00+07', 'rest', 'device', 1),
('me', 'bmi', 23.9, 'kg/m²', '2026-10-26 07:00:00+07', 'rest', 'manual', 2),
('me', 'steps', 8610, 'bước', '2026-10-26 23:59:00+07', 'wake', 'device', 1),
('me', 'sleep', 6.4, 'giờ', '2026-10-26 06:30:00+07', 'wake', 'device', 2)
ON CONFLICT DO NOTHING;

-- 7. CĐHA & RECIST 1.1
INSERT INTO clinical_reports (id, member_id, kind, category, title, performed_at, facility_name, summary)
VALUES ('rep-img-20260820', 'me', 'imaging', 'CĐHA', 'MRI gan có tiêm thuốc', '2026-08-20', 'Bệnh viện đối tác', '3 khối đặc gan (tổng 38 mm); 1 nang gan 12 mm')
ON CONFLICT (id) DO NOTHING;

INSERT INTO imaging_studies (id, report_id, modality, body_part, technique_description, findings_text, conclusion_text, recommendations_text, recist_code)
VALUES ('study-mri-gan', 'rep-img-20260820', 'MRI', 'Gan · ổ bụng trên', 
'MRI 1.5T ổ bụng trên, chuỗi T1, T2, DWI; tiêm thuốc tương phản từ, chụp động học các thì.',
'Gan kích thước bình thường, bờ đều. Ba khối đặc ở hạ phân thuỳ VI, VII, VIII, ngấm thuốc dạng viền, kích thước giảm so với phim trước. Nang gan đơn thuần hạ phân thuỳ II, 12 mm, không thay đổi. Không thấy huyết khối tĩnh mạch cửa. Không có dịch ổ bụng.',
'Ba khối đặc gan giảm kích thước so với phim 20/06/2026 (tổng 45 → 38 mm). Nang gan đơn thuần ổn định.',
'Theo dõi đáp ứng điều trị, chụp lại sau 3 tháng.', 'PR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO imaging_lesions (study_id, lesion_group_id, lesion_name, lesion_type, target_organ, laterality, max_diameter_mm, is_target_lesion)
VALUES 
('study-mri-gan', 'liver-solid', 'U1 · HPT VI', 'solid', 'Gan', 'Bên phải', 10.0, TRUE),
('study-mri-gan', 'liver-solid', 'U2 · HPT VII', 'solid', 'Gan', 'Bên phải', 12.0, TRUE),
('study-mri-gan', 'liver-solid', 'U3 · HPT VIII', 'solid', 'Gan', 'Bên phải', 16.0, TRUE)
ON CONFLICT DO NOTHING;

-- 8. Đơn thuốc & Lịch uống
INSERT INTO prescriptions (id, member_id, medication_name, dosage, form, instructions, indication, prescribing_doctor, started_at, status)
VALUES 
('22222222-0000-0000-0000-000000000001', 'me', 'Losartan 50 mg', '50 mg', 'Viên nén', '1 viên sau ăn sáng', 'Tăng huyết áp', 'BS Trần Văn B', '2026-01-10', 'active'),
('22222222-0000-0000-0000-000000000002', 'me', 'Metformin 500 mg', '500 mg', 'Viên nén', '1 viên sau ăn tối', 'Đái tháo đường type 2', 'BS Hoàng Thị D', '2026-01-10', 'active'),
('22222222-0000-0000-0000-000000000003', 'me', 'Atorvastatin 20 mg', '20 mg', 'Viên nén', '1 viên trước khi ngủ', 'Rối loạn lipid máu', 'BS Trần Văn B', '2026-01-10', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dose_schedules (prescription_id, scheduled_date, scheduled_time, slot, status)
VALUES 
('22222222-0000-0000-0000-000000000001', '2026-10-26', '07:00:00', 'Sáng', 'taken'),
('22222222-0000-0000-0000-000000000002', '2026-10-26', '20:00:00', 'Tối', 'pending'),
('22222222-0000-0000-0000-000000000003', '2026-10-26', '21:00:00', 'Tối', 'pending')
ON CONFLICT DO NOTHING;
