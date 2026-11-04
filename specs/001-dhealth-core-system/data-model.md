# Data Model & Schema Specification: D-Health Core Platform

**Feature Branch**: `001-dhealth-core-system`  
**Standard**: Tactical Domain-Driven Design (DDD) & Clean Architecture Schema  
**Target DBMS**: SQLite (Mobile Client Offline-First) / PostgreSQL (Cloud Backend Server)

---

## 1. Domain Entities & Value Objects (DDD Modeling)

### 1.1. Value Objects (Immutable & Self-Validating)
1. **`BloodPressure`**:
   - Thuộc tính: `systolic: number` (60–250 mmHg), `diastolic: number` (30–150 mmHg).
   - Invariant: Bắt buộc `diastolic < systolic`.
   - Classification: Bình thường ($< 120/80$), Tiền THA ($120-139/80-89$), THA Độ 1 ($140-159/90-99$), THA Độ 2 ($\ge 160/100$).
2. **`HeartRate`**:
   - Thuộc tính: `bpm: number` (30–220).
   - Invariant: Không chấp nhận số âm, NaN, hoặc ngoài giới hạn sinh tồn.
3. **`BodyMassIndex`**:
   - Thuộc tính: `weightKg: number`, `heightCm: number`, `bmiValue: number`.
   - Invariant: $w \in [2, 300]$, $h \in [50, 230]$.
   - Formula: $\text{BMI} = w / (h/100)^2$ (làm tròn 1 chữ số thập phân).
4. **`LoincCode`**:
   - Thuộc tính: `code: string` (theo chuẩn Regenstrief LOINC, ví dụ `4548-4`, `13457-7`).
   - Invariant: Kiểm tra định dạng `^\d{3,5}-\d$`.
5. **`BloodType`**:
   - Thuộc tính: `abo: 'A' | 'B' | 'AB' | 'O'`, `rh: '+' | '-'`.
   - Invariant: Chỉ chấp nhận 8 nhóm máu người hợp lệ (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`).
6. **`RecistResponse`**:
   - Thuộc tính: `baselineSoD: number`, `currentSoD: number`, `nadirSoD: number`, `percentageChange: number`, `category: 'CR' | 'PR' | 'SD' | 'PD'`.
   - Invariant: Baseline SoD phải được đo từ các tổn thương đặc $\ge 10\text{ mm}$.

---

## 2. Relational Database Schema (DDL)

```sql
-- 1. TÀI KHOẢN NGƯỜI DÙNG & ĐỊNH DANH CÔNG DÂN
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    national_id TEXT UNIQUE,               -- Số CCCD / Định danh VNeID
    phone_number TEXT UNIQUE NOT NULL,     -- SĐT định danh
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    is_ekyc_verified BOOLEAN DEFAULT FALSE,
    biometric_public_key TEXT,            -- Khóa công khai FaceID/Fingerprint
    refresh_token_hash TEXT,
    failed_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. HỒ SƠ THÀNH VIÊN GIA ĐÌNH & PHÂN QUYỀN ĐỒNG THUẬN (Nghị định 13)
CREATE TABLE family_members (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    relationship TEXT NOT NULL,            -- 'owner', 'spouse', 'child', 'parent', 'other'
    gender TEXT CHECK (gender IN ('Nam', 'Nữ', 'Khác')),
    birth_date DATE NOT NULL,
    blood_type TEXT CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    height_cm REAL,
    weight_kg REAL,
    insurance_number TEXT,                 -- Mã thẻ BHYT 15 ký tự
    avatar_url TEXT,
    is_above_18 BOOLEAN GENERATED ALWAYS AS (
        (strftime('%Y', 'now') - strftime('%Y', birth_date)) - 
        (strftime('%m-%d', 'now') < strftime('%m-%d', birth_date)) >= 18
    ) STORED,
    consent_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CHỈ SỐ SINH TRẮC HỌC (8 loại chỉ số)
CREATE TABLE biometric_records (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    group_id TEXT,                         -- Nhóm liên kết (ví dụ: Huyết áp đo kèm Nhịp tim)
    biometric_type TEXT NOT NULL,          -- 'bp', 'hr', 'spo2', 'temp', 'rr', 'bmi', 'steps', 'sleep'
    systolic REAL,                         -- HA tâm thu (mmHg)
    diastolic REAL,                        -- HA tâm trương (mmHg)
    value_numeric REAL,                    -- Giá trị đo tổng quát
    unit TEXT NOT NULL,                    -- 'mmHg', 'bpm', '%', '°C', 'l/p', 'kg/m²', 'bước', 'giờ'
    measured_at TIMESTAMP NOT NULL,        -- Thời điểm đo (cấm tương lai)
    context TEXT CHECK (context IN ('rest', 'wake', 'exercise', 'meal', 'bed')),
    source TEXT CHECK (source IN ('device', 'manual')) NOT NULL,
    device_id TEXT,
    device_name TEXT,
    severity_level INTEGER DEFAULT 1,      -- 1: Tốt, 2: Chú ý, 3: Nguy cơ
    notes TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,      -- Soft delete
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_biometrics_query ON biometric_records (member_id, biometric_type, measured_at DESC);

-- 4. THIẾT BỊ KẾT NỐI (BLE, HealthKit, Health Connect)
CREATE TABLE connected_devices (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_group TEXT NOT NULL,            -- 'Nền tảng sức khoẻ', 'Đồng hồ thông minh', 'Thiết bị y tế'
    device_id TEXT NOT NULL,               -- 'applehealth', 'applewatch', 'omron_bp', ...
    device_name TEXT NOT NULL,
    mac_address TEXT,
    battery_level INTEGER,                 -- Phần trăm pin
    data_types TEXT NOT NULL,              -- JSON array: ["Huyết áp", "Nhịp tim"]
    sync_interval TEXT DEFAULT 'realtime', -- 'realtime', '15m', '1h', 'manual'
    priority_tier INTEGER DEFAULT 50,      -- Thứ bậc ưu tiên deduplication (100: Medical Class IIa, 80: Watch, 60: Platform)
    is_connected BOOLEAN DEFAULT TRUE,
    last_synced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. BÁO CÁO CẬN LÂM SÀNG TỔNG QUÁT (Master Report Header)
CREATE TABLE clinical_reports (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    kind TEXT CHECK (kind IN ('lab', 'imaging', 'pathology', 'doc')) NOT NULL,
    category TEXT NOT NULL,                -- 'SH' (Sinh hoá), 'HH' (Huyết học), 'VS', 'PT', 'DT'
    title TEXT NOT NULL,                   -- Tiêu đề phiếu
    performed_at DATE NOT NULL,            -- NGÀY LẤY MẪU / CHỤP (không lấy ngày tải lên)
    facility_name TEXT,
    ordering_doctor TEXT,
    interpreting_doctor TEXT,
    summary TEXT,                          -- Tóm tắt kết luận
    attachment_url TEXT,                   -- File ảnh gốc hoặc PDF đối chiếu
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_clinical_timeline ON clinical_reports (member_id, performed_at DESC);

-- 6. KẾT QUẢ XÉT NGHIỆM CHI TIẾT (12 chỉ số sinh hóa/huyết học)
CREATE TABLE lab_results (
    id TEXT PRIMARY KEY,
    report_id TEXT NOT NULL REFERENCES clinical_reports(id) ON DELETE CASCADE,
    analyte_code TEXT,                     -- Mã LOINC chuẩn hóa (4548-4, 13457-7)
    analyte_name TEXT NOT NULL,            -- 'HbA1c', 'LDL-C', 'Glucose', 'Creatinin'
    result_value REAL NOT NULL,
    unit TEXT NOT NULL,
    ref_low REAL,
    ref_high REAL,
    ref_text TEXT,                         -- '3,9 – 6,4', '< 3,0', '≥ 60'
    abnormal_flag TEXT CHECK (abnormal_flag IN ('N', 'L', 'H', 'LL', 'HH')), -- N: Bình thường, H: Tăng, L: Giảm
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. CHẨN ĐOÁN HÌNH ẢNH & ĐÁNH GIÁ RECIST 1.1
CREATE TABLE imaging_studies (
    id TEXT PRIMARY KEY,
    report_id TEXT NOT NULL REFERENCES clinical_reports(id) ON DELETE CASCADE,
    modality TEXT CHECK (modality IN ('SA', 'XQ', 'MM', 'CT', 'MRI')) NOT NULL,
    body_part TEXT NOT NULL,               -- 'Gan · ổ bụng trên', 'Phổi', 'Thận'
    technique_description TEXT,            -- Kỹ thuật chụp
    findings_text TEXT,                    -- Mô tả hình ảnh
    conclusion_text TEXT,                  -- Kết luận chẩn đoán
    recommendations_text TEXT,             -- Lời dặn / Đề nghị
    compared_study_id TEXT REFERENCES imaging_studies(id),
    recist_code TEXT CHECK (recist_code IN ('CR', 'PR', 'SD', 'PD', 'NE')),
    dicom_series_urls TEXT,                -- JSON array chứa key frames DICOM
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. THEO DÕI TỔN THƯƠNG ĐÍCH (Target Lesions / SoD Matrix)
CREATE TABLE imaging_lesions (
    id TEXT PRIMARY KEY,
    study_id TEXT NOT NULL REFERENCES imaging_studies(id) ON DELETE CASCADE,
    lesion_group_id TEXT NOT NULL,         -- Khóa nhóm liên kết (đối chiếu qua các lần chụp)
    lesion_name TEXT NOT NULL,             -- 'U1 · HPT VI', 'U2 · HPT VII'
    lesion_type TEXT CHECK (lesion_type IN ('solid', 'cyst', 'other')) NOT NULL,
    target_organ TEXT NOT NULL,            -- 'Gan', 'Phổi', 'Thận'
    laterality TEXT,                       -- 'Bên phải', 'Bên trái'
    max_diameter_mm REAL NOT NULL,         -- Đường kính lớn nhất (mm)
    is_target_lesion BOOLEAN DEFAULT FALSE,-- Tổn thương đích theo RECIST (phải >= 10 mm)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. QUẢN LÝ BỆNH MẠN TÍNH & MẪU PHÁC ĐỒ (Cockpit)
CREATE TABLE condition_templates (
    id TEXT PRIMARY KEY,
    disease_code TEXT UNIQUE NOT NULL,     -- 'CVD' (Tim mạch), 'T2D' (Tiểu đường), 'IDA' (Thiếu máu)
    disease_name TEXT NOT NULL,
    tracked_metrics TEXT NOT NULL,         -- JSON array: ["bp", "hr", "bmi", "ldl", "hba1c"]
    default_tasks TEXT NOT NULL,           -- JSON array: ["Theo dõi HA sáng/tối", "Xét nghiệm lipid"]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conditions (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    template_id TEXT REFERENCES condition_templates(id),
    condition_name TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'monitored', 'resolved')) DEFAULT 'active',
    risk_level TEXT,                       -- 'Thấp', 'Trung bình', 'Cao'
    trend TEXT,                            -- 'Ổn định', 'Cải thiện', 'Xấu đi'
    diagnosed_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE care_plan_tasks (
    id TEXT PRIMARY KEY,
    condition_id TEXT NOT NULL REFERENCES conditions(id) ON DELETE CASCADE,
    task_title TEXT NOT NULL,
    frequency TEXT NOT NULL,               -- 'daily_morning_evening', 'before_appointment'
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. ĐƠN THUỐC & LỊCH UỐNG THUỐC 30 NGÀY
CREATE TABLE prescriptions (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    medication_name TEXT NOT NULL,
    dosage TEXT NOT NULL,                  -- '500 mg', '50 mg'
    form TEXT NOT NULL,                    -- 'Viên nén', 'Gói'
    instructions TEXT NOT NULL,            -- '1 viên sau ăn tối'
    indication TEXT,                       -- 'Đái tháo đường type 2'
    prescribing_doctor TEXT,
    started_at DATE NOT NULL,
    ended_at DATE,
    side_effects TEXT,
    status TEXT CHECK (status IN ('active', 'discontinued')) DEFAULT 'active',
    discontinued_at DATE,
    discontinuation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dose_schedules (
    id TEXT PRIMARY KEY,
    prescription_id TEXT NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,          -- '07:00', '20:00'
    slot TEXT CHECK (slot IN ('Sáng', 'Trưa', 'Chiều', 'Tối')) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'taken', 'missed', 'skipped', 'snoozed')) DEFAULT 'pending',
    actual_taken_time TIMESTAMP,
    snooze_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_dose_calendar ON dose_schedules (prescription_id, scheduled_date);

-- 11. THẺ KHẨN CẤP, DỊ ỨNG & LIÊN HỆ CẤP CỨU
CREATE TABLE allergy_items (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    allergen_name TEXT NOT NULL,           -- 'Penicillin', 'Hải sản', 'Phấn hoa'
    allergy_type TEXT CHECK (allergy_type IN ('drug', 'food', 'environmental')) NOT NULL,
    severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe', 'anaphylaxis')) NOT NULL,
    reaction_description TEXT,
    diagnosed_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE emergency_contacts (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    relationship TEXT NOT NULL,            -- 'Vợ', 'Chồng', 'Bố', 'Mẹ', 'Con'
    phone TEXT NOT NULL,
    priority_order INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. BÁC SĨ ĐIỀU TRỊ & PHÂN QUYỀN CHIA SẺ DỮ LIỆU (Nghị định 13)
CREATE TABLE care_doctors (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    specialty TEXT NOT NULL,               -- 'Tim mạch', 'Ung bướu', 'Nội tiết'
    facility_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE care_appointments (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    doctor_id TEXT REFERENCES care_doctors(id),
    appointment_title TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot TIME NOT NULL,
    status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE data_sharing_grants (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    grantee_type TEXT CHECK (grantee_type IN ('doctor', 'relative', 'emergency_qr')) NOT NULL,
    grantee_id TEXT,
    granted_scopes TEXT NOT NULL,          -- JSON array: ["biometrics", "labs", "imaging"]
    token_hash TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,         -- Tối đa 7 ngày theo Nghị định 13
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. HÀNG ĐỢI ĐỒNG BỘ OFFLINE & AUDIT TRAIL
CREATE TABLE offline_sync_records (
    id TEXT PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    operation TEXT CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')) NOT NULL,
    payload_json TEXT NOT NULL,
    sync_status TEXT CHECK (sync_status IN ('pending', 'synced', 'conflict_failed')) DEFAULT 'pending',
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE access_audit_logs (
    id TEXT PRIMARY KEY,
    accessor_id TEXT NOT NULL,
    accessor_role TEXT NOT NULL,
    target_member_id TEXT NOT NULL,
    accessed_resource TEXT NOT NULL,
    action_type TEXT NOT NULL,             -- 'READ', 'EXPORT_PDF', 'EMERGENCY_QR_SCAN'
    ip_address TEXT,
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

