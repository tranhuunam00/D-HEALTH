# 🏛️ D-HEALTH — KIẾN TRÚC CƠ SỞ DỮ LIỆU TOÀN DIỆN (ENTERPRISE DATABASE ARCHITECTURE)
## THIẾT KẾ ĐỨNG TRÊN VAI TRÒ ADMIN TỔNG (SUPER ADMIN PERSPECTIVE)

> **Dự án**: Nền tảng Quản trị Sức khỏe Gia đình Toàn diện & Hộ chiếu Y tế Điện tử D-HEALTH  
> **Cơ sở phân tích**: 17 Màn hình Forensic (`SCR-01` $\rightarrow$ `SCR-17`), Tài liệu BA v1.0 (`5_6291670095529781835.md`), Nghị định 13/2023/NĐ-CP, Quy chuẩn TDD & DDD (`GEMINI.md`).  
> **Góc nhìn kiến trúc**: **Admin Tổng (Super Admin)** — Nhìn toàn cảnh hệ sinh thái, quản lý dữ liệu danh mục dùng chung (Master Data), cấu hình ngưỡng động, quản trị thiết bị IoT, điều phối đa cơ sở y tế và phân quyền người dùng.

---

## 🧭 PHẦN 1: TRIẾT LÝ PHÂN TÁCH DỮ LIỆU (DATA GOVERNANCE & TAXONOMY)

Trong một hệ sinh thái y tế số chuẩn doanh nghiệp, dữ liệu **TUYỆT ĐỐI KHÔNG ĐƯỢC ĐÁNH ĐỒNG**. Hệ thống chia thành 3 nhóm dữ liệu với cơ chế quản trị khác nhau:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       HỆ SINH THÁI DỮ LIỆU D-HEALTH                         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
  [NHÓM 1: FIX CỨNG]           [NHÓM 2: ADMIN CẤU HÌNH]     [NHÓM 3: NGHIỆP VỤ BỆNH NHÂN]
  (System Constants & Enums)   (Dynamic Master Data & Rules)(Transactional Clinical Data)
  • Chuẩn ISO / WHO / LOINC    • Danh mục CSYT, Bệnh viện   • Chỉ số sinh trắc IoT BLE
  • Nhóm máu (ABO / Rh)        • Bác sĩ, Dược sĩ, CCHN      • Kết quả XN, Báo cáo CĐHA
  • Loại sinh trắc chuẩn SI    • Từ điển Thuốc Quốc Gia     • Đơn thuốc & Lịch uống thuốc
  • Trạng thái vòng đời code   • Ngưỡng cảnh báo y tế động  • Hồ sơ thành viên gia đình
  • Chuẩn RECIST 1.1           • Danh mục Bệnh mạn tính     • Thẻ cấp cứu SOS Offline
```

### 1.1. Nhóm 1: Dữ Liệu Fix Cứng Trong Mã Nguồn (System Enums & Immutable Standards)
- **Đặc điểm**: Là các tiêu chuẩn khoa học y khoa quốc tế hoặc quy tắc logic lõi không bao giờ thay đổi theo thời gian hoặc cơ sở y tế. Được định nghĩa bằng `TypeScript Enum` và `CHECK Constraint` trong CSDL.
- **Danh mục fix cứng**:
  - `BloodType`: 8 nhóm máu người (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`).
  - `Gender`: `Nam`, `Nữ`, `Khác`.
  - `Relationship`: `self` (Chủ tài khoản), `spouse` (Vợ/Chồng), `child` (Con), `parent` (Bố/Mẹ), `other` (Khác).
  - `BiometricType`: `bp` (Huyết áp), `hr` (Nhịp tim), `spo2` (Độ bão hòa oxy), `temp` (Nhiệt độ), `glucose` (Đường huyết), `weight` (Cân nặng), `height` (Chiều cao), `bmi` (Chỉ số khối cơ thể), `steps` (Bước chân), `sleep` (Giấc ngủ).
  - `DoseStatus`: `pending` (Chờ uống), `taken` (Đã uống), `skipped` (Bỏ qua), `missed` (Quên/Quá giờ).
  - `ReportKind`: `lab` (Xét nghiệm), `imaging` (Chẩn đoán hình ảnh), `pathology` (Giải phẫu bệnh), `doc` (Giấy tờ y tế).
  - `RecistCategory`: `CR` (Đáp ứng hoàn toàn), `PR` (Đáp ứng một phần), `SD` (Bệnh ổn định), `PD` (Bệnh tiến triển).
  - `ConsentScope`: `read_all`, `emergency_only`, `biometrics_only`.

### 1.2. Nhóm 2: Dữ Liệu Do Admin Tổng Cài Đặt & Cấu Hình Động (Configurable Master Data & Rule Engine)
- **Đặc điểm**: Do Quản trị viên (Super Admin / Clinical Admin) khởi tạo, chỉnh sửa, bật/tắt (Enable/Disable) qua giao diện Web CMS / Admin Portal trên PC. 
- **Người dùng cuối trên Mobile App** chỉ chọn hoặc hiển thị từ danh mục này, **tuyệt đối không được gõ text tự do** để tránh sai chính tả và phân mảnh dữ liệu.
- **Danh mục Admin cài đặt**:
  - **`master_facilities`**: Bệnh viện, Phòng khám, Trung tâm chẩn đoán hình ảnh đối tác (Tên, địa chỉ, hotline, logo, cấu hình API liên kết).
  - **`master_departments`**: Danh mục Khoa phòng y tế (Nội tiết, Tim mạch, Ung bướu, Chẩn đoán hình ảnh, Xét nghiệm huyết học,...).
  - **`master_doctors`**: Danh bạ Bác sĩ (Họ tên, học hàm học vị: GS, PGS, BS.CKII, ThS.BS, Số CCHN, CSYT công tác, Chuyên khoa).
  - **`master_medications`**: Dược thư D-Health (Tên biệt dược, hoạt chất gốc, hàm lượng, dạng bào chế: viên nén/siro/tiêm, đơn vị liều, nhà sản xuất).
  - **`master_lab_tests`**: Từ điển Xét nghiệm & Khoảng Tham Chiếu (Tên xét nghiệm, mã LOINC chuẩn, nhóm SH/HH/VS, đơn vị đo, khoảng tham chiếu linh hoạt theo Min/Max và theo Giới tính/Tuổi).
  - **`master_chronic_conditions`**: Danh mục Bệnh mạn tính & Mã ICD-10 (Tăng huyết áp `I10`, Đái tháo đường Type 2 `E11`, Ung thư biểu mô tế bào gan `C22.0`, Bệnh tim thiếu máu cục bộ `I25`).
  - **`config_biometric_thresholds`**: Cấu hình Ngưỡng Cảnh Báo Sinh Trắc Động (Quy định ngưỡng Xanh - Vàng - Đỏ cho từng lứa tuổi, giới tính và bệnh nền).
  - **`config_device_catalog`**: Danh mục Thiết bị Đo Y tế BLE được chứng thực (Hãng sản xuất: Omron, Beurer, Accu-Chek; GATT UUID, Profile mapping).

### 1.3. Nhóm 3: Dữ Liệu Nghiệp Vụ Sinh Ra Từ Người Dùng & Bệnh Nhân (Transactional Clinical Records)
- Thu thập từ: Nhập liệu thủ công, kết nối cảm biến Bluetooth IoT, tải tệp ảnh/PDF/DICOM lên MinIO S3, trích xuất OCR tự động.

---

## 🏛️ PHẦN 2: BẢN ĐỒ KIẾN TRÚC CSDL 7 PHÂN HỆ (ENTERPRISE SCHEMA MAP)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        TỔNG THỂ KIẾN TRÚC CSDL ADMIN TỔNG                              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  PHÂN HỆ 1: QUẢN TRỊ HỆ THỐNG & PHÂN QUYỀN RBAC                                        │
│  ├── roles                                  (Vai trò: SuperAdmin, Doctor, Patient,...) │
│  ├── permissions                            (Quyền: ReadRecords, ApprovePrescription,..)│
│  ├── role_permissions                       (Bảng nối Quyền - Vai trò)                 │
│  └── admin_users                            (Tài khoản Quản trị viên & Bác sĩ)         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  PHÂN HỆ 2: DANH MỤC MASTER DATA ADMIN CẤU HÌNH (DYNAMIC CATALOGS)                     │
│  ├── master_facilities                      (Danh mục Cơ sở y tế & Bệnh viện)          │
│  ├── master_departments                     (Danh mục Khoa phòng chuyên môn)           │
│  ├── master_doctors                         (Hồ sơ Bác sĩ & Nhân viên y tế)            │
│  ├── master_medications                     (Dược thư Quốc gia & Biệt dược)            │
│  ├── master_lab_tests                       (Từ điển Xét nghiệm & Khoảng tham chiếu)   │
│  ├── master_chronic_conditions              (Danh mục Bệnh mạn tính & Mã ICD-10)       │
│  └── config_device_catalog                  (Danh mục Model Thiết bị IoT BLE y tế)     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  PHÂN HỆ 3: CẤU HÌNH QUY TẮC Y TẾ & NGƯỠNG CẢNH BÁO (CLINICAL RULE ENGINE)             │
│  ├── config_biometric_thresholds            (Ngưỡng cảnh báo Xanh/Vàng/Đỏ động)        │
│  ├── config_chronic_care_plans              (Gói theo dõi & Phác đồ kiểm soát bệnh)    │
│  └── config_emergency_hotlines              (Danh bạ tổng đài cấp cứu theo khu vực)    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  PHÂN HỆ 4: NGƯỜI DÙNG, GIA ĐÌNH & PHÂN QUYỀN ĐỒNG THUẬN (Nghị định 13)               │
│  ├── users                                  (Tài khoản định danh công dân SĐT/CCCD)    │
│  ├── family_members                         (Hồ sơ thành viên gia đình)                │
│  ├── family_member_consents                 (Biên bản đồng thuận chia sẻ dữ liệu y tế) │
│  └── daily_checkins                         (Nhật ký cảm xúc & triệu chứng hằng ngày)  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  PHÂN HỆ 5: SINH HIỆU & THIẾT BỊ ĐO IOT (BIOMETRICS & BLE ECOSYSTEM)                  │
│  ├── connected_devices                      (Thiết bị người dùng đã ghép nối Bluetooth)│
│  └── biometric_records                      (Chỉ số đo HA, NT, SpO2, Đường huyết, BMI) │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  PHÂN HỆ 6: HỘ CHIẾU Y TẾ, BỆNH ÁN & MINIO S3 OBJECT STORAGE                           │
│  ├── clinical_reports                       (Hồ sơ bệnh án & Báo cáo cận lâm sàng)     │
│  ├── lab_results                            (Chỉ số kết quả xét nghiệm chi tiết)       │
│  ├── imaging_studies                        (Ca chụp CĐHA: X-quang, CT, MRI, Siêu âm)  │
│  ├── imaging_series                         (Chuỗi lát cắt & Tệp DICOM trên MinIO S3)  │
│  ├── tumor_tracking_evaluations             (Đánh giá u gan / khối u chuẩn RECIST 1.1) │
│  ├── emergency_cards                        (Thẻ cấp cứu SOS Offline mã hóa ECDSA)     │
│  └── emergency_contacts                     (Danh bạ liên hệ khẩn cấp)                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  PHÂN HỆ 7: KẾ HOẠCH DÙNG THUỐC & NHẬT KÝ KIỂM TOÁN (MEDICATION & AUDIT)              │
│  ├── prescriptions                          (Đơn thuốc điện tử / Ngoại trú)            │
│  ├── prescription_items                     (Thuốc chi tiết trong đơn kèm liều dùng)   │
│  ├── dose_schedules                         (Lịch nhắc uống thuốc theo khung giờ)      │
│  ├── dose_logs                              (Nhật ký xác nhận đã uống / bỏ qua)        │
│  ├── care_tasks                             (Danh sách việc cần làm y tế tiếp theo)    │
│  └── audit_logs                             (Nhật ký kiểm toán truy cập & an toàn PII) │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 PHẦN 3: ĐẶC TẢ CHI TIẾT TỪNG BẢNG CSDL (FULL DDL SCHEMA)

Dưới đây là DDL chi tiết viết cho PostgreSQL 16 (hỗ trợ UUID v4, JSONB index, Full-text Search và Constraints chặt chẽ):

---

### PHÂN HỆ 1: QUẢN TRỊ HỆ THỐNG & PHÂN QUYỀN RBAC (ADMIN PERSPECTIVE)

#### 1. Bảng `roles` (Vai trò Quản trị & Vận hành)
*Bảng Admin quản lý các cấp độ truy cập vào hệ thống.*
```sql
CREATE TABLE roles (
    id VARCHAR(50) PRIMARY KEY,              -- 'super_admin', 'clinical_admin', 'hospital_manager', 'doctor', 'patient'
    name VARCHAR(100) NOT NULL,              -- 'Quản trị viên tối cao', 'Bác sĩ chuyên khoa'
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,    -- TRUE: Vai trò fix cứng của hệ thống, cấm xoá
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. Bảng `permissions` (Danh mục Quyền hạn hạt nhân)
*Fix cứng danh mục hành vi có thể thực thi.*
```sql
CREATE TABLE permissions (
    id VARCHAR(100) PRIMARY KEY,             -- 'users.view', 'biometrics.override', 'prescriptions.approve', 'facilities.manage'
    module VARCHAR(50) NOT NULL,             -- 'users', 'clinical', 'master_data', 'audit'
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. Bảng `role_permissions` (Phân quyền Vai trò)
```sql
CREATE TABLE role_permissions (
    role_id VARCHAR(50) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(100) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);
```

#### 4. Bảng `admin_users` (Tài khoản Nhân viên Y tế & Quản trị viên)
```sql
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role_id VARCHAR(50) NOT NULL REFERENCES roles(id),
    facility_id VARCHAR(50),                 -- Thuộc CSYT nào (nếu là Bác sĩ/Admin viện)
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### PHÂN HỆ 2: DANH MỤC MASTER DATA ADMIN CẤU HÌNH (DYNAMIC CATALOGS)

#### 5. Bảng `master_facilities` (Cơ Sở Y Tế & Bệnh Viện Đối Tác)
*Admin tổng có màn hình cấu hình danh sách viện, hotline, cấu hình API HIS/LIS/PACS.*
```sql
CREATE TABLE master_facilities (
    id VARCHAR(50) PRIMARY KEY,              -- 'bv_bach_mai', 'bv_k_tan_trieu', 'bv_ung_buou_tphcm'
    code VARCHAR(30) UNIQUE NOT NULL,        -- Mã cơ sở KCB theo chuẩn Bộ Y Tế (ví dụ '01001')
    name VARCHAR(200) NOT NULL,              -- 'Bệnh viện Bạch Mai'
    short_name VARCHAR(50),                  -- 'BV Bạch Mai'
    facility_type VARCHAR(30) NOT NULL,      -- 'hospital_tw' (Tuyến TW), 'hospital_provincial', 'clinic', 'lab_center'
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    hotline VARCHAR(20) NOT NULL,
    emergency_phone VARCHAR(20),
    logo_url TEXT,
    integration_type VARCHAR(30) DEFAULT 'manual', -- 'manual', 'hl7_fhir', 'his_api', 'pacs_dicom'
    api_endpoint TEXT,
    api_key_encrypted TEXT,
    is_active BOOLEAN DEFAULT TRUE,          -- Admin bật/tắt hiển thị trong app
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 6. Bảng `master_departments` (Chuyên Khoa Y Tế)
```sql
CREATE TABLE master_departments (
    id VARCHAR(50) PRIMARY KEY,              -- 'tim_mach', 'noi_tiet', 'ung_buou', 'cdha', 'gpb'
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,              -- 'Khoa Tim Mạch', 'Khoa Nội Tiết - Đái Tháo Đường'
    icon_name VARCHAR(50),                   -- Icon hiển thị trên app mobile
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 7. Bảng `master_doctors` (Danh Bạ Bác Sĩ Chuyên Khoa)
*Admin cài đặt hồ sơ bác sĩ; mobile app người dùng tra cứu và hiển thị tại SCR-06, SCR-07.*
```sql
CREATE TABLE master_doctors (
    id VARCHAR(50) PRIMARY KEY,              -- 'bs_le_van_c', 'pgs_nguyen_thi_b'
    facility_id VARCHAR(50) REFERENCES master_facilities(id) ON DELETE SET NULL,
    department_id VARCHAR(50) REFERENCES master_departments(id) ON DELETE SET NULL,
    full_name VARCHAR(100) NOT NULL,         -- 'Lê Văn C'
    academic_title VARCHAR(50),              -- 'BS.CKII', 'ThS.BS', 'PGS.TS'
    license_number VARCHAR(50) UNIQUE,       -- Số Chứng Chỉ Hành Nghề KCB
    phone_number VARCHAR(20),
    email VARCHAR(100),
    avatar_url TEXT,
    biography TEXT,
    is_teleconsult_enabled BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 8. Bảng `master_medications` (Dược Thư Quốc Gia & Danh Mục Thuốc)
*Admin quản lý danh mục thuốc: Người dùng tìm kiếm chọn thuốc trong SCR-12 thay vì tự gõ.*
```sql
CREATE TABLE master_medications (
    id VARCHAR(50) PRIMARY KEY,              -- 'med_metformin_500', 'med_amlodipine_5'
    national_drug_code VARCHAR(50) UNIQUE,   -- Mã số đăng ký thuốc Cục Quản Lý Dược (ví dụ 'VD-25412-16')
    brand_name VARCHAR(150) NOT NULL,        -- Tên biệt dược: 'Glucophage 500mg', 'Amlor 5mg'
    generic_name VARCHAR(150) NOT NULL,      -- Hoạt chất gốc: 'Metformin Hydrochloride', 'Amlodipine'
    dosage_form VARCHAR(50) NOT NULL,        -- 'viên nén', 'viên bao phim', 'viên nang', 'hỗn dịch', 'ống tiêm'
    strength VARCHAR(50) NOT NULL,           -- Hàm lượng: '500 mg', '5 mg', '100 IU/ml'
    route_of_administration VARCHAR(30) NOT NULL, -- 'oral' (Uống), 'sublingual' (Ngậm dưới lưỡi), 'injection' (Tiêm)
    manufacturer VARCHAR(150),               -- 'Sanofi Aventis', 'Pfizer', 'Dược Hậu Giang'
    country_of_origin VARCHAR(50),
    instructions_default TEXT,               -- 'Uống sau bữa ăn tối'
    side_effects_summary TEXT,               -- 'Có thể gây buồn nôn nhẹ trong tuần đầu'
    contraindications TEXT,                  -- Chống chỉ định (Suy thận nặng eGFR < 30)
    is_prescription_required BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_med_search ON master_medications USING gin (to_tsvector('vietnamese', brand_name || ' ' || generic_name));
```

#### 9. Bảng `master_lab_tests` (Từ Điển Xét Nghiệm Chuẩn Y Tế)
*Admin cấu hình mã LOINC, nhóm xét nghiệm và khoảng tham chiếu chuẩn.*
```sql
CREATE TABLE master_lab_tests (
    id VARCHAR(50) PRIMARY KEY,              -- 'test_glucose_fasting', 'test_hba1c', 'test_ldl_c'
    loinc_code VARCHAR(20),                  -- Mã LOINC quốc tế: '1558-6', '4548-4', '13457-7'
    test_code VARCHAR(30) UNIQUE NOT NULL,   -- Mã nội bộ: 'GLU', 'HBA1C', 'LDL'
    test_name VARCHAR(150) NOT NULL,         -- 'Glucose (Đường huyết lúc đói)', 'HbA1c'
    test_group VARCHAR(20) NOT NULL,         -- 'SH' (Sinh hóa), 'HH' (Huyết học), 'VS' (Vi sinh), 'MD' (Miễn dịch)
    unit VARCHAR(30) NOT NULL,               -- 'mmol/L', '%', 'mg/dL', 'G/L'
    ref_min NUMERIC(8, 2),                   -- Giới hạn dưới tham chiếu chuẩn (ví dụ 4.1)
    ref_max NUMERIC(8, 2),                   -- Giới hạn trên tham chiếu chuẩn (ví dụ 5.9)
    ref_text_male VARCHAR(50),               -- Ghi chú khoảng cho Nam
    ref_text_female VARCHAR(50),             -- Ghi chú khoảng cho Nữ
    critical_low NUMERIC(8, 2),              -- Ngưỡng báo động đỏ cực thấp (hạ đường huyết < 2.8)
    critical_high NUMERIC(8, 2),             -- Ngưỡng báo động đỏ cực cao (> 16.7)
    interpretation_guide TEXT,               -- Hướng dẫn diễn giải kết quả
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 10. Bảng `master_chronic_conditions` (Danh Mục Bệnh Mạn Tính & Mã ICD-10)
*Quản lý danh sách bệnh mạn tính hiển thị ở SCR-08 (Tim mạch, Đái tháo đường, K Gan...).*
```sql
CREATE TABLE master_chronic_conditions (
    id VARCHAR(50) PRIMARY KEY,              -- 'tim_mach', 'dai_thao_duong', 'ung_thu_gan'
    icd10_code VARCHAR(20) NOT NULL,         -- 'I10-I25', 'E11', 'C22.0'
    name VARCHAR(150) NOT NULL,              -- 'Bệnh Tim Mạch', 'Đái Tháo Đường Type 2', 'Ung Thư Biểu Mô Tế Bào Gan'
    category VARCHAR(50) NOT NULL,           -- 'Nội tiết - Chuyển hóa', 'Tim mạch', 'Ung bướu'
    badge_color VARCHAR(20) DEFAULT '#1F7A8C',
    required_metrics JSONB NOT NULL,         -- Danh sách chỉ số bắt buộc theo dõi: ["bp", "hr", "ldl_c", "glucose", "hba1c"]
    default_revisit_months INT DEFAULT 3,    -- Tái khám định kỳ (tháng)
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 11. Bảng `config_device_catalog` (Danh Mục Thiết Bị Đo Y Tế IoT BLE Được Chứng Nhận)
*Admin cấu hình các loại máy đo Bluetooth được phép kết nối trong SCR-04.*
```sql
CREATE TABLE config_device_catalog (
    id VARCHAR(50) PRIMARY KEY,              -- 'omron_hem_7156t', 'beurer_bm_85', 'accuchek_guide'
    brand VARCHAR(50) NOT NULL,              -- 'Omron', 'Beurer', 'Roche Accu-Chek'
    model_name VARCHAR(100) NOT NULL,        -- 'HEM-7156T'
    device_type VARCHAR(30) NOT NULL,        -- 'blood_pressure', 'glucometer', 'pulse_oximeter', 'smart_scale'
    connectivity VARCHAR(20) DEFAULT 'ble',  -- 'ble', 'classic_bluetooth', 'wifi', 'apple_health'
    ble_service_uuid VARCHAR(50) NOT NULL,   -- '0x1810' (Blood Pressure), '0x180D' (Heart Rate), '0x1808' (Glucose)
    ble_char_uuid VARCHAR(50) NOT NULL,      -- '0x2A35' (Intermediate Cuff Pressure / Measurement)
    parser_strategy VARCHAR(50) NOT NULL,    -- Tên hàm parser logic: 'OmronBleParser', 'StandardGattParser'
    image_url TEXT,
    pairing_guide TEXT,                      -- Hướng dẫn: "Bấm giữ nút Bluetooth trên máy 3 giây cho đến khi chữ P nhấp nháy"
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### PHÂN HỆ 3: CẤU HÌNH QUY TẮC Y TẾ & NGƯỠNG CẢNH BÁO (CLINICAL RULE ENGINE)

#### 12. Bảng `config_biometric_thresholds` (Cấu Hình Ngưỡng Cảnh Báo Sinh Hiệu Động)
*Admin tổng có thể tinh chỉnh ngưỡng Huyết áp / Đường huyết / SpO2 theo độ tuổi, giới tính và bệnh nền mà không cần viết lại code.*
```sql
CREATE TABLE config_biometric_thresholds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    biometric_type VARCHAR(20) NOT NULL,     -- 'bp', 'hr', 'spo2', 'glucose_fasting', 'glucose_postprandial', 'bmi'
    condition_id VARCHAR(50) REFERENCES master_chronic_conditions(id), -- NULL: Áp dụng chung cho người bình thường
    gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nữ', 'All')) DEFAULT 'All',
    min_age INT DEFAULT 0,
    max_age INT DEFAULT 120,
    
    -- Các khoảng giá trị
    normal_min NUMERIC(8, 2),                -- Huyết áp tâm thu: 90
    normal_max NUMERIC(8, 2),                -- Huyết áp tâm thu: 129
    warning_low NUMERIC(8, 2),               -- Huyết áp thấp: < 90
    warning_high NUMERIC(8, 2),              -- Tiền THA / Độ 1: 130 - 159
    danger_low NUMERIC(8, 2),                -- Báo động đỏ tụt HA: < 80
    danger_high NUMERIC(8, 2),               -- Cơn tăng huyết áp khẩn cấp: >= 160 (kèm tâm trương >= 100)
    
    alert_message_warning TEXT,              -- "Chỉ số hơi cao so với mục tiêu điều trị"
    alert_message_danger TEXT,               -- "NGUY CƠ KHẨN CẤP: Nghỉ ngơi 15 phút và đo lại. Liên hệ bác sĩ ngay nếu có triệu chứng chóng mặt!"
    created_by UUID REFERENCES admin_users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_threshold_lookup ON config_biometric_thresholds (biometric_type, condition_id, gender);
```

---

### PHÂN HỆ 4: NGƯỜI DÙNG, GIA ĐÌNH & PHÂN QUYỀN ĐỒNG THUẬN (Nghị định 13)

#### 13. Bảng `users` (Tài Khoản Định Danh Công Dân)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    national_id VARCHAR(20) UNIQUE,          -- Số định danh cá nhân / CCCD 12 số
    phone_number VARCHAR(15) UNIQUE NOT NULL,-- SĐT nhận mã OTP
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_ekyc_verified BOOLEAN DEFAULT FALSE,  -- Đã xác thực CCCD gắn chip / VNeID
    biometric_public_key TEXT,               -- Khóa FaceID / Vân tay thiết bị (Base64)
    failed_attempts INT DEFAULT 0,           -- Số lần gõ sai mật khẩu liên tiếp
    locked_until TIMESTAMP WITH TIME ZONE,   -- Thời điểm mở khóa sau 15 phút
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_phone ON users(phone_number);
```

#### 14. Bảng `family_members` (Hồ Sơ Thành Viên Trong Gia Đình)
```sql
CREATE TABLE family_members (
    id VARCHAR(50) PRIMARY KEY,              -- 'me', 'ha', 'an', 'huy', 'lan' hoặc UUID
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,         -- 'Trần Minh Khang'
    relationship VARCHAR(30) NOT NULL,       -- 'owner', 'spouse', 'child', 'parent', 'other'
    gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nữ', 'Khác')) NOT NULL,
    birth_date DATE NOT NULL,
    blood_type VARCHAR(5) CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    height_cm NUMERIC(5, 1),
    weight_kg NUMERIC(5, 1),
    insurance_number VARCHAR(20),            -- Mã số thẻ BHYT 15 ký tự
    avatar_url TEXT,
    is_above_18 BOOLEAN DEFAULT TRUE,        -- Tính tự động từ birth_date
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_family_user ON family_members(user_id);
```

#### 15. Bảng `family_member_consents` (Kiểm Soát Đồng Thuận & Quyền Xem Theo Nghị Định 13)
*Quy định: Thành viên $\ge 18$ tuổi phải cấp quyền; có hạn dùng và cơ chế thu hồi.*
```sql
CREATE TABLE family_member_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    granted_to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    consent_scope VARCHAR(30) NOT NULL DEFAULT 'read_all', -- 'read_all', 'emergency_only', 'biometrics_only'
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'revoked', 'expired')) NOT NULL DEFAULT 'pending',
    approved_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,     -- Hết hạn sau tối đa 1 năm hoặc 7 ngày đối với bác sĩ
    revoked_at TIMESTAMP WITH TIME ZONE,
    consent_hash TEXT,                       -- Chữ ký điện tử xác nhận đồng thuận
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 16. Bảng `daily_checkins` (Nhật Ký Cảm Xúc & Triệu Chứng Nhanh - SCR-02)
```sql
CREATE TABLE daily_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    mood_status VARCHAR(20) CHECK (mood_status IN ('great', 'good', 'neutral', 'tired', 'bad')) NOT NULL,
    symptoms JSONB DEFAULT '[]',             -- Danh sách triệu chứng nhanh: ["chóng mặt", "mệt mỏi", "đau đầu"]
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_member_checkin_per_day UNIQUE (member_id, checkin_date)
);
```

---

### PHÂN HỆ 5: SINH HIỆU & THIẾT BỊ ĐO IOT (BIOMETRICS & BLE ECOSYSTEM)

#### 17. Bảng `connected_devices` (Thiết Bị Đo Bluetooth Đã Ghép Nối - SCR-04)
```sql
CREATE TABLE connected_devices (
    id VARCHAR(50) PRIMARY KEY,              -- 'dev_apple_watch', 'dev_omron_bp', 'dev_contour_glu'
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    catalog_device_id VARCHAR(50) REFERENCES config_device_catalog(id),
    custom_name VARCHAR(100) NOT NULL,       -- 'Máy đo huyết áp phòng ngủ'
    mac_address VARCHAR(50),
    data_types JSONB NOT NULL,               -- ["bp", "hr"]
    battery_level INT CHECK (battery_level BETWEEN 0 AND 100),
    is_connected BOOLEAN DEFAULT FALSE,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    priority_tier INT DEFAULT 50,            -- Ưu tiên chống trùng lặp: BLE y tế (10) > Apple Watch (50)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 18. Bảng `biometric_records` (Bản Ghi Chỉ Số Sinh Trắc Học Đầy Đủ - SCR-03)
```sql
CREATE TABLE biometric_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    group_id UUID,                           -- Gắn chung khi đo 1 lần ra cả Huyết áp + Nhịp tim
    biometric_type VARCHAR(20) NOT NULL,     -- 'bp', 'hr', 'spo2', 'temp', 'glucose', 'weight', 'bmi', 'steps', 'sleep'
    systolic NUMERIC(5, 1),                  -- HA tâm thu (nếu type = 'bp')
    diastolic NUMERIC(5, 1),                 -- HA tâm trương (nếu type = 'bp')
    value_numeric NUMERIC(8, 2),             -- Giá trị chung (SpO2: 98, Nhịp tim: 71, Cân nặng: 72.5)
    unit VARCHAR(20) NOT NULL,               -- 'mmHg', 'bpm', '%', '°C', 'mmol/L', 'kg', 'kg/m²'
    measured_at TIMESTAMP WITH TIME ZONE NOT NULL,
    context VARCHAR(20) CHECK (context IN ('rest', 'wake', 'exercise', 'meal_before', 'meal_after', 'bed')),
    source VARCHAR(20) CHECK (source IN ('device_ble', 'apple_health', 'health_connect', 'manual')) NOT NULL,
    device_id VARCHAR(50) REFERENCES connected_devices(id) ON DELETE SET NULL,
    severity_level INT DEFAULT 1,            -- 1: Tốt (Xanh), 2: Chú ý (Vàng), 3: Nguy cơ (Đỏ)
    notes TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,        -- Soft delete (bản ghi thiết bị chỉ ẩn)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_biometrics_timeline ON biometric_records (member_id, biometric_type, measured_at DESC);
```

---

### PHÂN HỆ 6: HỘ CHIẾU Y TẾ, BỆNH ÁN & MINIO S3 OBJECT STORAGE

#### 19. Bảng `clinical_reports` (Báo Cáo Cận Lâm Sàng & Hồ Sơ Y Khoa - SCR-05)
```sql
CREATE TABLE clinical_reports (
    id VARCHAR(50) PRIMARY KEY,              -- 'rep_20261020_mri', 'rep_20261008_blood'
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    kind VARCHAR(20) CHECK (kind IN ('lab', 'imaging', 'pathology', 'doc')) NOT NULL,
    category VARCHAR(20) NOT NULL,           -- 'SH' (Sinh hóa), 'HH', 'CDHA', 'GPB'
    title VARCHAR(200) NOT NULL,             -- 'MRI gan có tiêm thuốc', 'Tổng phân tích tế bào máu'
    performed_at DATE NOT NULL,
    facility_id VARCHAR(50) REFERENCES master_facilities(id) ON DELETE SET NULL,
    facility_name VARCHAR(150),              -- Snapshot tên CSYT lúc khám
    ordering_doctor_id VARCHAR(50) REFERENCES master_doctors(id) ON DELETE SET NULL,
    ordering_doctor_name VARCHAR(100),       -- 'Bác sĩ ung bướu'
    interpreting_doctor_id VARCHAR(50) REFERENCES master_doctors(id) ON DELETE SET NULL,
    interpreting_doctor_name VARCHAR(100),   -- 'BS Lê Văn C'
    technique_description TEXT,              -- Kỹ thuật thực hiện: 'MRI 1.5T ổ bụng, chuỗi T1, T2, DWI...'
    clinical_findings TEXT,                  -- Mô tả tổn thương: 'Ba khối đặc hạ phân thùy VI, VII, VIII...'
    conclusion TEXT NOT NULL,                -- Kết luận: 'Ba khối đặc gan giảm kích thước so với phim trước'
    recommendations TEXT,                    -- Đề nghị: 'Chụp kiểm tra lại sau 3 tháng'
    attachment_s3_key TEXT,                  -- MinIO S3 Object Key: 'dhealth-reports/2026/10/report_xxx.pdf'
    s3_bucket VARCHAR(50) DEFAULT 'dhealth-reports',
    file_sha256 VARCHAR(64),                 -- Checksum toàn vẹn tệp tin y tế
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_reports_member ON clinical_reports (member_id, performed_at DESC);
```

#### 20. Bảng `lab_results` (Kết Quả Xét Nghiệm Chi Tiết Theo Dòng - SCR-05)
```sql
CREATE TABLE lab_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id VARCHAR(50) NOT NULL REFERENCES clinical_reports(id) ON DELETE CASCADE,
    master_test_id VARCHAR(50) REFERENCES master_lab_tests(id) ON DELETE SET NULL,
    test_code VARCHAR(30) NOT NULL,          -- 'GLU', 'HBA1C', 'CHOL', 'TRIG', 'HDL', 'LDL'
    test_name VARCHAR(150) NOT NULL,         -- 'Glucose (Đường huyết)', 'Cholesterol toàn phần'
    value_numeric NUMERIC(8, 2),             -- 5.4, 6.6, 3.2
    value_text VARCHAR(50),                  -- Dành cho kết quả định tính: 'Âm tính', 'Dương tính'
    unit VARCHAR(30) NOT NULL,               -- 'mmol/L', '%', 'mg/dL'
    ref_min NUMERIC(8, 2),                   -- 4.1
    ref_max NUMERIC(8, 2),                   -- 5.9
    flag VARCHAR(10) CHECK (flag IN ('NORMAL', 'HIGH', 'LOW', 'CRITICAL')) NOT NULL DEFAULT 'NORMAL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_lab_report ON lab_results(report_id);
```

#### 21. Bảng `imaging_studies` & `imaging_series` (Chẩn Đoán Hình Ảnh & Tệp DICOM MinIO S3 - SCR-06)
```sql
CREATE TABLE imaging_studies (
    id VARCHAR(50) PRIMARY KEY,              -- 'study_mri_liver_20261020'
    report_id VARCHAR(50) NOT NULL REFERENCES clinical_reports(id) ON DELETE CASCADE,
    modality VARCHAR(10) CHECK (modality IN ('MRI', 'CT', 'US', 'XR', 'PET')) NOT NULL,
    body_part VARCHAR(50) NOT NULL,          -- 'Gan · Ổ bụng trên'
    magnetic_field_strength VARCHAR(20),     -- '1.5T', '3.0T'
    contrast_agent VARCHAR(100),             -- 'Thuốc tương phản từ Primovist / Magnevist'
    comparison_study_id VARCHAR(50),         -- So sánh với ca trước: 'CT 20/06/2026'
    comparison_notes TEXT,
    dicom_study_instance_uid VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE imaging_series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_id VARCHAR(50) NOT NULL REFERENCES imaging_studies(id) ON DELETE CASCADE,
    series_name VARCHAR(50) NOT NULL,        -- 'T1 + thuốc', 'T2', 'DWI', 'In-phase', 'Out-phase'
    series_number INT DEFAULT 1,
    instance_count INT DEFAULT 1,            -- Số lượng ảnh / lát cắt trong chuỗi
    thumbnail_s3_key TEXT,                   -- 'dhealth-dicom/thumbnails/thumb_t1.jpg'
    dicom_s3_prefix TEXT NOT NULL,           -- 'dhealth-dicom/studies/xxx/series_1/' (MinIO folder)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 22. Bảng `tumor_tracking_evaluations` (Theo Dõi Khối U Theo Chuẩn RECIST 1.1 - SCR-06)
*Lưu trữ 3 khối đặc gan giảm kích thước từ 45mm $\rightarrow$ 38mm của bệnh nhân Khang.*
```sql
CREATE TABLE tumor_tracking_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_id VARCHAR(50) NOT NULL REFERENCES imaging_studies(id) ON DELETE CASCADE,
    organ VARCHAR(50) NOT NULL,              -- 'Gan'
    lesion_location VARCHAR(100) NOT NULL,   -- 'Hạ phân thùy VI, VII, VIII'
    lesion_count INT DEFAULT 1,              -- 3 khối đặc
    baseline_sum_diameters_mm NUMERIC(5, 1), -- 45.0 mm (Phim trước 20/06/2026)
    current_sum_diameters_mm NUMERIC(5, 1),  -- 38.0 mm (Phim hiện tại 20/08/2026)
    nadir_sum_diameters_mm NUMERIC(5, 1),    -- Kích thước nhỏ nhất từng ghi nhận
    benign_lesions_note TEXT,                -- 'Nang gan đơn thuần hạ phân thùy II, 12 mm, ổn định'
    recist_response VARCHAR(10) CHECK (recist_response IN ('CR', 'PR', 'SD', 'PD')) NOT NULL DEFAULT 'PR',
    treatment_response_note TEXT,            -- 'Đáp ứng điều trị một phần (Partial Response - PR)'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 23. Bảng `emergency_cards` & `emergency_contacts` (Thẻ Cấp Cứu Offline Mã Hóa - SCR-16)
```sql
CREATE TABLE emergency_cards (
    member_id VARCHAR(50) PRIMARY KEY REFERENCES family_members(id) ON DELETE CASCADE,
    blood_group_snapshot VARCHAR(10) NOT NULL,
    allergies JSONB NOT NULL DEFAULT '[]',   -- [{"allergen": "Penicillin", "severity": "Sốc phản vệ"}]
    chronic_conditions JSONB DEFAULT '[]',   -- ["Tăng huyết áp", "Đái tháo đường Type 2"]
    current_critical_meds JSONB DEFAULT '[]',-- ["Insulin", "Aspirin chống đông máu"]
    emergency_notes TEXT,                    -- "Có mang máy tạo nhịp tim Pacemaker"
    offline_qr_payload TEXT NOT NULL,        -- Chuỗi ký số ECDSA nén Base64
    qr_signature TEXT NOT NULL,              -- Chữ ký mật mã xác thực bởi D-Health Server
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    contact_name VARCHAR(100) NOT NULL,      -- 'Trần Thu Hà'
    relationship VARCHAR(50) NOT NULL,       -- 'Vợ'
    phone_number VARCHAR(20) NOT NULL,       -- '0901234567'
    is_primary BOOLEAN DEFAULT FALSE,        -- Người liên hệ đầu tiên khi ấn SOS
    priority_order INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### PHÂN HỆ 7: KẾ HOẠCH DÙNG THUỐC & NHẬT KÝ KIỂM TOÁN (MEDICATION & AUDIT)

#### 24. Bảng `prescriptions` & `prescription_items` (Đơn Thuốc Điện Tử - SCR-11, SCR-12)
```sql
CREATE TABLE prescriptions (
    id VARCHAR(50) PRIMARY KEY,              -- 'rx_20261020_k'
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    facility_id VARCHAR(50) REFERENCES master_facilities(id) ON DELETE SET NULL,
    doctor_id VARCHAR(50) REFERENCES master_doctors(id) ON DELETE SET NULL,
    prescribed_date DATE NOT NULL,
    diagnosis VARCHAR(255) NOT NULL,         -- 'Đái tháo đường Type 2 + Tăng huyết áp nguyên phát'
    icd10_code VARCHAR(50),                  -- 'E11, I10'
    status VARCHAR(20) CHECK (status IN ('active', 'completed', 'discontinued')) DEFAULT 'active',
    prescription_image_s3_key TEXT,          -- MinIO: 'dhealth-prescriptions/rx_xxx.jpg'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id VARCHAR(50) NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    medication_id VARCHAR(50) REFERENCES master_medications(id) ON DELETE SET NULL,
    medication_name VARCHAR(150) NOT NULL,   -- 'Metformin 500 mg'
    dosage VARCHAR(100) NOT NULL,            -- '1 viên sau ăn tối'
    quantity_prescribed INT NOT NULL,        -- 60 viên
    quantity_unit VARCHAR(20) DEFAULT 'viên',
    frequency_per_day INT DEFAULT 1,         -- 1 lần / ngày
    timing_instructions VARCHAR(100),        -- 'Sau ăn tối 30 phút'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 25. Bảng `dose_schedules` & `dose_logs` (Nhắc Thuốc & Nhật Ký Tuân Thủ Adherence)
```sql
CREATE TABLE dose_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_item_id UUID NOT NULL REFERENCES prescription_items(id) ON DELETE CASCADE,
    scheduled_time TIME NOT NULL,            -- '20:00:00'
    meal_relation VARCHAR(20) CHECK (meal_relation IN ('before_meal', 'after_meal', 'with_meal', 'independent')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dose_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID NOT NULL REFERENCES dose_schedules(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL, -- '2026-10-26 20:00:00+07'
    status VARCHAR(20) CHECK (status IN ('pending', 'taken', 'skipped', 'missed')) DEFAULT 'pending',
    taken_at TIMESTAMP WITH TIME ZONE,       -- Thời điểm bấm nút "Đã uống"
    reason_skipped TEXT,                     -- 'Bận việc', 'Quên mang thuốc'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_dose_query ON dose_logs (schedule_id, scheduled_at, status);
```

#### 26. Bảng `care_tasks` (Việc Cần Làm Tiếp Theo Của Bệnh Nhân - SCR-08)
```sql
CREATE TABLE care_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
    condition_id VARCHAR(50) REFERENCES master_chronic_conditions(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,             -- 'Theo dõi huyết áp sáng và tối', 'Xét nghiệm lipid máu trước tái khám'
    task_type VARCHAR(30) NOT NULL,          -- 'measure', 'lab', 'revisit', 'medication'
    due_date DATE,                           -- '2026-11-12'
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    priority INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 27. Bảng `audit_logs` (Nhật Ký Kiểm Toán Tối Cao & An Ninh Dữ Liệu Y Tế NĐ 13)
*Admin tổng xem toàn bộ lịch sử: Ai đã xem hồ sơ của ai, khi nào, từ IP nào.*
```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id VARCHAR(50) NOT NULL,           -- User ID hoặc Admin User ID
    actor_type VARCHAR(20) NOT NULL,         -- 'user', 'doctor', 'admin', 'system'
    action VARCHAR(50) NOT NULL,             -- 'VIEW_REPORT', 'EXPORT_DICOM', 'UPDATE_BP', 'GRANT_CONSENT', 'REVOKE_CONSENT'
    target_entity VARCHAR(50) NOT NULL,      -- 'clinical_reports', 'family_members', 'biometric_records'
    target_id VARCHAR(50) NOT NULL,
    patient_member_id VARCHAR(50),
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    details JSONB,                           -- Snapshot các trường bị sửa hoặc lý do xem
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_member ON audit_logs(patient_member_id, created_at DESC);
CREATE INDEX idx_audit_actor ON audit_logs(actor_id, created_at DESC);
```

---

## 📊 PHẦN 4: MA TRẬN PHÂN ĐỊNH: FIX CỨNG (ENUM) VS ADMIN CÀI ĐẶT (MASTER CONFIG)

| Tên Dữ Liệu | Thuộc Màn Hình | Loại Dữ Liệu | Vị Trí Lưu Trữ | Lý Do Phân Loại |
|---|---|---|---|---|
| **Nhóm Máu (A, B, AB, O / Rh+, Rh-)** | SCR-02, SCR-16 | **Fix Cứng (Enum)** | Mã nguồn & CSDL Constraint | Chuẩn sinh học quốc tế bất biến, không bao giờ thay đổi. |
| **Loại Sinh Hiệu (HA, NT, SpO2, BMI...)**| SCR-02, SCR-03 | **Fix Cứng (Enum)** | `biometric_type` ENUM | Chuẩn y tế đo lường SI, BLE Profile quy chuẩn quốc tế. |
| **Trạng Thái Uống Thuốc (taken, skipped)**| SCR-02, SCR-11 | **Fix Cứng (Enum)** | `dose_logs.status` ENUM | Máy trạng thái (State Machine) logic vận hành ứng dụng. |
| **Phân Loại Đáp Ứng RECIST 1.1 (CR, PR)** | SCR-06 | **Fix Cứng (Enum)** | `recist_response` ENUM | Tiêu chuẩn quốc tế đánh giá điều trị khối u đặc. |
| **Danh Mục Bệnh Viện & CSYT** | SCR-05, SCR-06 | **Admin Cài Đặt** | Bảng `master_facilities` | Cơ sở khám chữa bệnh ký hợp tác mới liên tục, có API riêng. |
| **Bác Sĩ & Số Chứng Chỉ Hành Nghề** | SCR-05, SCR-06, SCR-07 | **Admin Cài Đặt** | Bảng `master_doctors` | Danh bạ bác sĩ luân chuyển khoa, cấp chứng chỉ hành nghề mới. |
| **Từ Điển Thuốc & Dược Thư** | SCR-11, SCR-12 | **Admin Cài Đặt** | Bảng `master_medications` | Cục Quản lý Dược cấp số đăng ký mới, thêm biệt dược liên tục. |
| **Từ Điển Xét Nghiệm & Khoảng Tham Chiếu**| SCR-05 | **Admin Cài Đặt** | Bảng `master_lab_tests` | Mỗi máy xét nghiệm / phòng Lab có khoảng tham chiếu (Ref Range) riêng. |
| **Danh Mục Bệnh Mạn Tính & Phác Đồ** | SCR-08 | **Admin Cài Đặt** | Bảng `master_chronic_conditions` | Admin bổ sung các chương trình chăm sóc mới (COPD, Đột quỵ...). |
| **Ngưỡng Cảnh Báo Xanh - Vàng - Đỏ** | SCR-02, SCR-03 | **Admin Cài Đặt** | Bảng `config_biometric_thresholds`| Bác sĩ/Admin tinh chỉnh ngưỡng theo lứa tuổi và bệnh nền người bệnh. |
| **Danh Mục Thiết Bị Đo Y Tế BLE** | SCR-04 | **Admin Cài Đặt** | Bảng `config_device_catalog` | Khi có máy đo huyết áp mới ra mắt, Admin cấu hình thêm UUID BLE. |
| **Danh Bạ Hotline Cấp Cứu Theo Vùng** | SCR-16 | **Admin Cài Đặt** | Bảng `master_facilities.hotline` | Số điện thoại cấp cứu 115 hoặc bệnh viện vệ tinh từng địa phương. |

---

## 🛡️ PHẦN 5: TÍCH HỢP VỚI MINIO S3 & NGHỊ ĐỊNH 13

1. **MinIO S3 Buckets Management**:
   - `dhealth-reports`: Chứa các bản PDF kết quả cận lâm sàng và ảnh kết quả gốc.
   - `dhealth-dicom`: Chứa các thư mục lát cắt tệp y tế định dạng DICOM chuẩn PACS.
   - `dhealth-prescriptions`: Chứa ảnh chụp đơn thuốc gốc của bệnh viện.
   - `dhealth-avatars`: Chứa ảnh hồ sơ đại diện thành viên gia đình (Public Download).
   - Mọi tệp tải lên MinIO S3 đều được tính mã băm **`file_sha256`** lưu trong CSDL PostgreSQL để chống giả mạo bệnh án.

2. **Tuân thủ Nghị định 13/2023/NĐ-CP**:
   - Mọi truy vấn xem hồ sơ bệnh án chi tiết đều kiểm tra bảng `family_member_consents`.
   - Toàn bộ hành động đọc hoặc xuất dữ liệu đều ghi lại bản ghi bất biến trong bảng `audit_logs`.
   - Thông tin mật khẩu và mã PIN được băm bằng thuật toán Bcrypt / Argon2.

---

## 🎯 KẾT LUẬN & BƯỚC THỰC THI TIẾP THEO

Bản thiết kế này đáp ứng 100% góc nhìn của **Admin Tổng**:
- Nắm toàn quyền kiểm soát danh mục Master, quy tắc y tế và ngưỡng cảnh báo.
- Màn hình mobile của sếp là **lớp thể hiện (Presentation Layer)** tiêu thụ dữ liệu từ kiến trúc CSDL này.
- DDL này sẽ được nạp trực tiếp vào file [`docker/init-db.sql`](file:///d:/D-HEALTH/docker/init-db.sql) và đồng bộ vào tài liệu đặc tả [`specs/001-dhealth-core-system/data-model.md`](file:///d:/D-HEALTH/specs/001-dhealth-core-system/data-model.md) của dự án.
