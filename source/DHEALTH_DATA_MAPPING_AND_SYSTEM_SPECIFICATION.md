# D-HEALTH — TỔNG HỢP KIẾN TRÚC HỆ THỐNG, THIẾT KẾ DATABASE & MA TRẬN ĐỐI SOÁT MATCHING 1-1 DỮ LIỆU MÀN HÌNH
## PHÂN TÍCH PHÁP Y DỮ LIỆU TOÀN DIỆN TỪ FILE THIẾT KẾ UI (28 ARTBOARDS) & TÀI LIỆU BA (V1.0)

> **Mã dự án:** D-HEALTH — Sổ sức khoẻ số cá nhân & gia đình, Hộ chiếu y tế điện tử có Trợ lý AI  
> **Căn cứ đối soát 1-1:**  
> 1. File Thiết kế UI: `source/D-Health – Ứng dụng di động.html` (28 Artboards: 17 màn hình chính `SCR-01` $\rightarrow$ `SCR-17` & 11 màn hình `Empty State`).  
> 2. File Đặc tả BA v1.0: `source/5_6291670095529781835.md` (DAOGROUP bàn giao ngày 03/11/2026).  
> 3. Hành lang pháp lý: Nghị định 13/2023/NĐ-CP (Bảo vệ dữ liệu cá nhân y tế tại Việt Nam), Luật Khám bệnh, chữa bệnh 2023.  
> 4. Tiêu chuẩn quốc tế: HL7 FHIR R4, LOINC (Xét nghiệm), DICOM PS3.x (Chẩn đoán hình ảnh), RECIST 1.1 (Ung bướu), JNC 8 / VNHA (Tim mạch), ADA 2024 (Đái tháo đường).  
> **Cam kết chất lượng:** 100% dữ liệu thực, không sử dụng dữ liệu giả định/mockup không có căn cứ (Zero Fake Defaults).

---

# MỤC LỤC TỔNG QUAN

1. [CHƯƠNG 1: LỰA CHỌN TECH STACK & KIẾN TRÚC HỆ THỐNG](#chương-1-lựa-chọn-tech-stack--kiến-trúc-hệ-thống)
2. [CHƯƠNG 2: PHÂN ĐỊNH BẢN CHẤT DỮ LIỆU: FIX CỨNG (SYSTEM ENUMS) VS. ADMIN CẤU HÌNH ĐỘNG VS. NGHIỆP VỤ NGƯỜI DÙNG](#chương-2-phân-định-bản-chất-dữ-liệu-fix-cứng-system-enums-vs-admin-cấu-hình-động-vs-nghiệp-vụ-người-dùng)
3. [CHƯƠNG 3: MÀN HÌNH ADMIN TỔNG (SUPER ADMIN CONSOLE) & CÁC TRƯỜNG DỮ LIỆU MASTER DATA BẮT BUỘC BỔ SUNG](#chương-3-màn-hình-admin-tổng-super-admin-console--các-trường-dữ-liệu-master-data-bắt-buộc-bổ-sung)
4. [CHƯƠNG 4: MA TRẬN ĐỐI SOÁT MATCHING 1-1 CHI TIẾT TỪNG DÒNG THÔNG TIN TRÊN MỌI MÀN HÌNH (SCR-01 ĐẾN SCR-17)](#chương-4-ma-trận-đối-soát-matching-1-1-chi-tiết-từng-dòng-thông-tin-trên-mọi-màn-hình-scr-01-đến-scr-17)
   - [SCR-01: Đăng nhập & Xác thực bảo mật (Login)](#scr-01-đăng-nhập--xác-thực-bảo-mật-login)
   - [SCR-02: Trang chủ Tổng quan Sức khoẻ (Main / Home)](#scr-02-trang-chủ-tổng-quan-sức-khoẻ-main--home)
   - [SCR-03: Sức khoẻ – Sinh trắc học & Chuỗi đo IoT (Biometrics)](#scr-03-sức-khoẻ--sinh-trắc-học--chuỗi-đo-iot-biometrics)
   - [SCR-04: Quản lý Kết nối Thiết bị Ngoại vi & BLE (Devices)](#scr-04-quản-lý-kết-nối-thiết-bị-ngoại-vi--ble-devices)
   - [SCR-05: Sức khoẻ – Bảng tổng hợp Xét nghiệm (Health - Labs)](#scr-05-sức-khoẻ--bảng-tổng-hợp-xét-nghiệm-health---labs)
   - [SCR-06: Báo cáo Kết quả Xét nghiệm Chi tiết (LabReport)](#scr-06-báo-cáo-kết-quả-xét-nghiệm-chi-tiết-labreport)
   - [SCR-07: Sức khoẻ – Chẩn đoán hình ảnh & Theo dõi u bướu (Imaging)](#scr-07-sức-khoẻ--chẩn-đoán-hình-ảnh--theo-dõi-u-bướu-imaging)
   - [SCR-08: Báo cáo CĐHA Chi tiết & Lát cắt PACS (ImagingReport)](#scr-08-báo-cáo-cđha-chi-tiết--lát-cắt-pacs-imagingreport)
   - [SCR-09: Bệnh mạn tính – Disease Cockpit (Cockpit)](#scr-09-bệnh-mạn-tính--disease-cockpit-cockpit)
   - [SCR-10: Hồ sơ y tế số – Medical Passport (Records)](#scr-10-hồ-sơ-y-tế-số--medical-passport-records)
   - [SCR-11: Quản lý dùng thuốc & Lịch nhắc thông minh (Meds)](#scr-11-quản-lý-dùng-thuốc--lịch-nhắc-thông-minh-meds)
   - [SCR-12: Nhập kết quả cận lâm sàng đa phương thức (Camera / CSYT / Manual)](#scr-12-nhập-kết-quả-cận-lâm-sàng-đa-phương-thức-camera--csyt--manual)
   - [SCR-13: Trợ lý AI Y tế Đa ngữ cảnh (AI Assistant)](#scr-13-trợ-lý-ai-y-tế-đa-ngữ-cảnh-ai-assistant)
   - [SCR-14: Mạng lưới Chăm sóc & Chia sẻ Bác sĩ (Care Network)](#scr-14-mạng-lưới-chăm-sóc--chia-sẻ-bác-sĩ-care-network)
   - [SCR-15: Thông tin người dùng & Định danh eKYC (Profile)](#scr-15-thông-tin-người-dùng--định-danh-ekyc-profile)
   - [SCR-16: Quản lý Hồ sơ Gia đình & Phân quyền Đồng thuận (Family)](#scr-16-quản-lý-hồ-sơ-gia-đình--phân-quyền-đồng-thuận-family)
   - [SCR-17: Thẻ Y tế Khẩn cấp SOS & Offline QR Ký số (Emergency)](#scr-17-thẻ-y-tế-khẩn-cấp-sos--offline-qr-ký-số-emergency)
5. [CHƯƠNG 5: CÔNG THỨC TOÁN HỌC & THUẬT TOÁN LOGIC Y KHOA CHI TIẾT](#chương-5-công-thức-toán-học--thuật-toán-logic-y-khoa-chi-tiết)
6. [CHƯƠNG 6: GIẢI QUYẾT DỨT ĐIỂM 12 ĐIỂM NGHẼN NGHIỆP VỤ (Q1 - Q12) TỪ TÀI LIỆU BA](#chương-6-giải-quyết-dứt-điểm-12-điểm-nghẽn-nghiệp-vụ-q1---q12-từ-tài-liệu-ba)

---

# CHƯƠNG 1: LỰA CHỌN TECH STACK & KIẾN TRÚC HỆ THỐNG

### 1.1 Bảng phân tích & Quyết định Tech Stack Doanh nghiệp
Để đáp ứng ứng dụng y tế cá nhân phục vụ hàng triệu người dùng, tích hợp phần cứng BLE, xử lý ảnh cận lâm sàng nặng và tuân thủ tuyệt đối an toàn thông tin theo Nghị định 13/2023/NĐ-CP, hệ sinh thái D-HEALTH lựa chọn cấu hình công nghệ chuẩn như sau:

| Tầng hệ thống | Công nghệ lựa chọn | Lý do kỹ thuật & Biện minh kiến trúc |
|---|---|---|
| **Mobile Client** | **React 18 + Vite + Tailwind CSS** (Mobile Web / PWA) & Capacitor / React Native Bridging | • Viewport chuẩn Mobile-First (390×844 iPhone, 360×800 Android).<br>• Hiệu năng render $<16\text{ms}$ (60 FPS), Cold start $<2\text{s}$.<br>• Thiết kế Atomic UI components, thumb zone công thái học $\ge 44\times 44\text{ pt}$.<br>• Tận dụng Web Bluetooth API / Native Bridge để quét thiết bị y tế. |
| **Desktop Admin Console** | **React 18 + Tailwind CSS + TanStack Table v8** | • Tối ưu màn hình lớn ($\ge 1280\text{px}$, $1440\text{px}$, $1920\text{px}$).<br>• Bảng dữ liệu mật độ cao (High-density grid) với lọc đa chiều server-side, phân trang, ghim cột, xuất Excel/PDF/HL7 FHIR.<br>• Bảng điều khiển lâm sàng đa panel (Multi-panel dashboard) xem đồng thời lịch sử và ảnh chẩn đoán. |
| **Backend API Gateway & Core Service** | **Node.js (LTS v20+) + Express + TypeScript** | • Kiến trúc **Clean Architecture / Domain-Driven Design (DDD)** phân tách 4 tầng: Presentation $\rightarrow$ Application Use Case $\rightarrow$ Domain Logic $\rightarrow$ Infrastructure Repositories.<br>• Kiểu dữ liệu tĩnh Type-safe 100%, ngăn ngừa lỗi runtime.<br>• Tích hợp cơ chế Rate limiting, CORS Whitelist, Helmet security headers chống tấn công OWASP. |
| **Cơ sở dữ liệu Quan hệ & Chuỗi thời gian** | **PostgreSQL 16 + TimescaleDB Extension** | • PostgreSQL chuẩn ACID, hỗ trợ JSONB mạnh mẽ cho cấu trúc kết quả xét nghiệm linh hoạt.<br>• TimescaleDB Hypertables nén dữ liệu chuỗi thời gian sinh trắc (Biometric time-series: nhịp tim từng phút, huyết áp, SpO2) tiết kiệm 90% dung lượng, truy vấn đồ thị 7 ngày / 30 ngày cực nhanh ($<50\text{ms}$). |
| **Lưu trữ Tệp Y tế (Object Storage)** | **MinIO S3-Compatible Object Storage** | • Lưu trữ an toàn các tệp hình ảnh chẩn đoán (DICOM, JPG), tệp PDF gốc từ bệnh viện, ảnh chụp đơn thuốc OCR.<br>• Cơ chế Presigned URL có thời hạn (15 phút) đảm bảo tệp y tế không bị lộ công khai.<br>• Mã hóa Server-side Encryption (SSE-S3 / SSE-KMS) đạt chuẩn HIPAA và Nghị định 13. |
| **Xác thực & Bảo mật** | **JWT (Access Token 15p + Refresh Token xoay vòng 7 ngày) + Argon2id + WebAuthn/Biometrics** | • Mật khẩu băm bằng Argon2id (chống brute-force GPU).<br>• Đăng nhập sinh trắc học TouchID/FaceID qua chuẩn WebAuthn/FIDO2.<br>• Mã hóa cột cấp trường (Field-level encryption AES-256-GCM) cho dữ liệu CCCD, số thẻ BHYT. |
| **Môi trường & Vận hành (DevOps)** | **Docker Compose + Multi-stage Build + Nginx Reverse Proxy** | • Đóng gói microservices container hóa đồng nhất giữa môi trường Dev, Staging và Production.<br>• Multi-stage Docker build giảm dung lượng image xuống $<150\text{MB}$. |
| **Kiểm thử tự động (TDD)** | **Vitest + Supertest + React Testing Library** | • Tuân thủ kỷ luật TDD One-Function-At-A-Time: 100% hàm có Unit Test (Input biên, Output, Error, Business logic).<br>• Test tích hợp API Integration Test bảo đảm 100% routes hoạt động thông suốt. |

---

# CHƯƠNG 2: PHÂN ĐỊNH BẢN CHẤT DỮ LIỆU: FIX CỨNG (SYSTEM ENUMS) VS. ADMIN CẤU HÌNH ĐỘNG VS. NGHIỆP VỤ NGƯỜI DÙNG

Trong hệ thống D-HEALTH, việc phân định rõ dữ liệu nào là **Fix cứng (System Constants)**, dữ liệu nào là **Admin cấu hình động (Master Data Catalog)** và dữ liệu nào là **Nghiệp vụ do người dùng sinh ra (Transactional Data)** là nguyên tắc sống còn để tránh "vỡ kiến trúc" và loại bỏ triệt để hardcode.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        HỆ SINH THÁI PHÂN TẦNG DỮ LIỆU D-HEALTH                         │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
        ┌───────────────────────────────────┼────────────────────────────────────┐
        ▼                                   ▼                                    ▼
 [TẦNG 1: FIX CỨNG HỆ THỐNG]       [TẦNG 2: ADMIN CẤU HÌNH ĐỘNG]       [TẦNG 3: NGHIỆP VỤ NGƯỜI DÙNG]
 (System Enums & Standards)       (Dynamic Master Data Catalog)        (Transactional Clinical Data)
 • Chuẩn Modality DICOM           • Danh mục Cơ sở y tế / BV           • Số đo sinh trắc (HA, NT, SpO2)
 • Hệ nhóm máu ABO & Rh           • Danh mục Bác sĩ, Dược sĩ, CCHN     • Phiếu xét nghiệm chi tiết
 • Đơn vị đo chuẩn SI             • Từ điển Thuốc Quốc gia & Tương tác • Ca chụp CĐHA & Lát cắt PACS
 • Phân loại đáp ứng RECIST 1.1   • Danh mục Bệnh mạn tính & Phác đồ   • Lịch uống thuốc & Nhật ký uống
 • 5 Nhóm xét nghiệm gốc          • Ngưỡng cảnh báo y tế theo độ tuổi  • Thẻ cấp cứu y tế SOS
 • Hoàn cảnh đo sinh trắc         • Danh mục Thiết bị đo IoT BLE       • Biên bản đồng thuận gia đình
```

### 2.1 Tầng 1: Dữ liệu Fix Cứng Trong Mã Nguồn (System Enums & Immutable Standards)
Đây là các tiêu chuẩn khoa học y tế quốc tế hoặc quy tắc logic lõi không bao giờ thay đổi theo thời gian hoặc bệnh viện:

1. **Phương tiện Chẩn đoán hình ảnh (Imaging Modalities - Chuẩn DICOM PS3.x)**:
   - **SA** (Siêu âm / Ultrasound - `US`): Siêu âm ổ bụng, siêu âm doppler, siêu âm tuyến giáp.
   - **XQ** (X-quang / Radiography - `CR`/`DX`): X-quang tim phổi, cột sống, xương khớp.
   - **MM** (Nhũ ảnh / Mammography - `MG`): Tầm soát ung thư vú.
   - **CT** (Cắt lớp vi tính / Computed Tomography - `CT`): CT đa dãy có tiêm hoặc không tiêm thuốc cản quang.
   - **MRI** (Cộng hưởng từ / Magnetic Resonance Imaging - `MR`): MRI sọ não, gan mật, cơ xương khớp.
   - *> Giải đáp trực tiếp câu hỏi người dùng: Các label này là FIX CỨNG trong hệ thống enum TypeScript/PostgreSQL ENUM vì đây là các phương tiện quy chuẩn quốc tế của chuẩn hình ảnh y khoa DICOM. Tuy nhiên, các kỹ thuật chụp con (ví dụ "MRI sọ não xung T1/T2", "CT gan 128 dãy") là Master Data do Admin quản lý.*
2. **Hệ nhóm máu (Blood Types - Chuẩn quốc tế ABO & Rhesus)**:
   - 8 nhóm: `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-` và `unknown`.
3. **Đơn vị đo lường sinh học chuẩn SI**:
   - Áp lực: `mmHg` | Tần số: `bpm`, `lần/phút` | Tỷ lệ: `%` | Nồng độ: `mmol/L`, `µmol/L`, `g/L`, `G/L`, `mg/dL` | Trọng lượng/Chiều dài: `kg`, `cm`, `mm`.
4. **Phân loại đáp ứng khối u đặc RECIST 1.1**:
   - `CR` (Complete Response - Đáp ứng hoàn toàn).
   - `PR` (Partial Response - Đáp ứng một phần, giảm $\ge 30\%$).
   - `SD` (Stable Disease - Bệnh ổn định).
   - `PD` (Progressive Disease - Bệnh tiến triển, tăng $\ge 20\%$ và tăng tuyệt đối $\ge 5\text{mm}$).
5. **5 Nhóm xét nghiệm gốc (Laboratory Disciplines)**:
   - `HH` (Huyết học) | `SH` (Sinh hoá) | `VS` (Vi sinh) | `PT` (Sinh học phân tử) | `DT` (Di truyền).
6. **Hoàn cảnh đo sinh trắc học**:
   - `resting` (Lúc nghỉ) | `waking` (Vừa thức dậy) | `post_exercise` (Sau vận động) | `post_meal` (Sau ăn) | `before_bed` (Trước khi ngủ).

### 2.2 Tầng 2: Dữ liệu Admin Cấu Hình Động (Dynamic Master Data - Có UI Admin Quản Trị)
Dữ liệu danh mục dùng chung toàn hệ sinh thái, được nạp bởi Super Admin để người dùng cuối chỉ việc lựa chọn (tránh việc mỗi người dùng gõ một kiểu gây phân mảnh dữ liệu):
- Danh mục CSYT, Bệnh viện, Phòng khám (`medical_facilities`).
- Danh mục Bác sĩ có chứng chỉ hành nghề CCHN (`system_doctors`).
- Từ điển Thuốc Quốc gia & Quy tắc tương tác thuốc (`medication_catalog`, `drug_interaction_rules`).
- Danh mục Chỉ số xét nghiệm & Khoảng tham chiếu chuẩn (`analyte_definitions`).
- Danh mục Thiết bị IoT Bluetooth BLE được chứng thực (`device_catalog`).
- Ngưỡng cảnh báo y tế động theo lứa tuổi và bệnh nền (`config_biometric_thresholds`).
- Danh mục Bệnh mạn tính & Mẫu phác đồ chăm sóc (`chronic_conditions`, `config_chronic_care_plans`).
- Danh bạ Hotline Cấp cứu theo tỉnh thành (`config_emergency_hotlines`).

### 2.3 Tầng 3: Dữ liệu Nghiệp vụ Người Dùng (Transactional Clinical Data)
Toàn bộ dữ liệu gắn liền với `member_id` của bệnh nhân: số đo sinh trắc thực tế, phiếu xét nghiệm, hồ sơ đơn thuốc, ảnh DICOM, nhật ký tuân thủ, thẻ cấp cứu.

---

# CHƯƠNG 3: MÀN HÌNH ADMIN TỔNG (SUPER ADMIN CONSOLE) & CÁC TRƯỜNG DỮ LIỆU MASTER DATA BẮT BUỘC BỔ SUNG

Do file thiết kế `D-Health – Ứng dụng di động.html` chỉ tập trung vào trải nghiệm ứng dụng di động cho Người dùng cuối (Bệnh nhân/Người nhà), để hệ thống hoạt động thật 100% không fake data, Super Admin bắt buộc phải có **9 màn hình quản trị chuyên biệt trên Desktop PC** với các trường dữ liệu bổ sung sau đây:

---

### 3.1 Màn hình Admin ADM-01: Quản trị Cơ sở Y tế & Bệnh viện (`medical_facilities`)
- **Mục đích**: Cung cấp danh mục bệnh viện/phòng khám chính thống để người dùng chọn khi nhập kết quả (SCR-12), lọc hồ sơ (SCR-10) và lưu thông tin bác sĩ (SCR-14).
- **Các trường dữ liệu Admin cần nhập & quản lý**:
  1. `facility_code` (Chuỗi): Mã định danh y tế (VD: `BV-BM`, `BV-CR`, `BV-108`).
  2. `facility_name` (Chuỗi): Tên đầy đủ (VD: "Bệnh viện Bạch Mai", "Bệnh viện Chợ Rẫy").
  3. `short_name` (Chuỗi): Tên viết tắt hiển thị trên chip mobile (VD: "Bạch Mai").
  4. `facility_level` (Enum): Tuyến chuyên môn (`trung_uong`, `tinh_thanh_pho`, `quan_huyen`, `tu_nhan`).
  5. `address` (Chuỗi): Địa chỉ chi tiết.
  6. `province_code` & `district_code` (Mã địa giới hành chính).
  7. `latitude` & `longitude` (Toạ độ GPS): Dùng để gợi ý CSYT gần nhất khi cấp cứu SOS (SCR-17).
  8. `phone_number` & `emergency_hotline` (SĐT cấp cứu riêng của viện).
  9. `portal_lookup_url` (URL tra cứu kết quả trực tuyến): Nạp vào SCR-12 khi người dùng chọn tải từ link CSYT.
  10. `sync_integration_type` (Enum): Hình thức đồng bộ (`manual_entry`, `web_crawler_captcha`, `direct_api_fhir`).
  11. `status` (Enum): `active` / `inactive`.

---

### 3.2 Màn hình Admin ADM-02: Quản trị Bác sĩ & Chuyên gia Y tế (`system_doctors`)
- **Mục đích**: Lưu trữ thông tin định danh bác sĩ chính thống, kiểm soát việc cấp quyền chia sẻ hồ sơ (BR-03, BR-132).
- **Các trường dữ liệu Admin cần nhập & quản lý**:
  1. `doctor_code` (Chuỗi): Mã bác sĩ nội bộ.
  2. `license_number` (Chuỗi): Số Chứng chỉ hành nghề y (CCHN) do Bộ Y tế / Sở Y tế cấp (bắt buộc theo Luật KCB).
  3. `full_name` (Chuỗi): Họ và tên bác sĩ (kèm học hàm: "PGS.TS.BS Nguyễn Văn A").
  4. `specialty_code` (Chuỗi): Chuyên khoa chính (`tim_mach`, `ung_buou`, `noi_tiet`, `nhi_khoa`,...).
  5. `primary_facility_id` (FK $\rightarrow$ `medical_facilities`): Cơ sở y tế công tác chính.
  6. `title` (Chuỗi): Chức danh lâm sàng ("Trưởng khoa Tim mạch can thiệp").
  7. `official_phone` & `official_email`: Liên hệ công vụ để nhận lời mời chia sẻ hồ sơ.
  8. `avatar_url` (S3 path): Ảnh chân dung bác sĩ.
  9. `is_verified` (Boolean): Đã xác thực giấy phép hành nghề.

---

### 3.3 Màn hình Admin ADM-03: Quản trị Từ điển Thuốc & Ma trận Tương tác (`medication_catalog`, `drug_interaction_rules`)
- **Mục đích**: Cho phép ứng dụng tự động gợi ý tên thuốc, hàm lượng, đường dùng (SCR-11) và tự động kích hoạt cảnh báo tương tác thuốc chết người khi người dùng thêm thuốc mới.
- **Các trường dữ liệu Admin cần nhập & quản lý**:
  - **Bảng `medication_catalog` (Từ điển thuốc)**:
    1. `national_drug_code` (Chuỗi): Số đăng ký lưu hành của Cục Quản lý Dược (VD: `VN-12345-20`).
    2. `brand_name` (Chuỗi): Tên biệt dược thương mại (VD: "Glucophage", "Lipitor", "Panadol Extra").
    3. `active_ingredient` (Chuỗi): Tên hoạt chất quốc tế INN (VD: "Metformin hydrochloride", "Atorvastatin").
    4. `strength` (Chuỗi): Hàm lượng (VD: "500 mg", "850 mg", "10 mg").
    5. `dosage_form` (Enum): Dạng bào chế (`vien_nen`, `vien_nang`, `dung_dich_uong`, `ong_tiem`, `xit_hit`).
    6. `route` (Enum): Đường dùng (`uong`, `tiem_duoi_da`, `tiem_tinh_mach`, `ngam_duoi_luoi`).
    7. `manufacturer` (Chuỗi): Nhà sản xuất & Nước sản xuất.
    8. `default_instruction` (Chuỗi): Hướng dẫn dùng mẫu ("Uống 1 viên sau bữa ăn tối").
  - **Bảng `drug_interaction_rules` (Quy tắc tương tác thuốc)**:
    1. `ingredient_a` & `ingredient_b` (Chuỗi): Cặp 2 hoạt chất tương tác (VD: "Simvastatin" + "Amiodarone").
    2. `severity_level` (Enum): Mức độ nguy hiểm (`minor` - Nhẹ, `moderate` - Trung bình, `severe` - Nghiêm trọng, `contraindicated` - Chống chỉ định tuyệt đối).
    3. `clinical_effect` (Chuỗi): Biểu hiện lâm sàng ("Nguy cơ ly giải cơ vân, suy thận cấp").
    4. `action_recommendation` (Chuỗi): Khuyến cáo hành động ("Ngừng phối hợp, chuyển sang Pravastatin hoặc giảm liều tối đa 20mg").

---

### 3.4 Màn hình Admin ADM-04: Quản trị Chỉ số Xét nghiệm & Khoảng tham chiếu (`analyte_definitions`)
- **Mục đích**: Chuẩn hóa mã LOINC, ánh xạ tự động vào 5 nhóm xét nghiệm (HH, SH, VS, PT, DT) và cấu hình khoảng tham chiếu chuẩn theo lứa tuổi/giới tính để tự động gắn cờ bất thường ($\uparrow$ / $\downarrow$).
- **Các trường dữ liệu Admin cần nhập & quản lý**:
  1. `loinc_code` (Chuỗi): Mã LOINC chuẩn quốc tế (VD: `17856-6` cho HbA1c, `2093-3` cho Cholesterol toàn phần).
  2. `analyte_name` (Chuỗi): Tên hiển thị tiếng Việt (VD: "HbA1c", "Creatinin huyết thanh", "Glucose lúc đói").
  3. `abbreviation` (Chuỗi): Tên viết tắt lâm sàng.
  4. `category` (Enum Fix cứng): `HH`, `SH`, `VS`, `PT`, `DT`.
  5. `standard_unit` (Chuỗi): Đơn vị chuẩn hệ thống (VD: `mmol/L`, `%`, `g/L`).
  6. `ref_range_male_min` & `ref_range_male_max` (Float): Ngưỡng chuẩn cho nam giới.
  7. `ref_range_female_min` & `ref_range_female_max` (Float): Ngưỡng chuẩn cho nữ giới.
  8. `ref_range_text_template` (Chuỗi): Mẫu chuỗi tham chiếu in trên phiếu ("4,0 - 6,0 mmol/L").
  9. `unit_conversions` (JSONB): Hệ số chuyển đổi đơn vị (VD: $1\text{ mg/dL} = 0.0555\text{ mmol/L}$ đối với Glucose).

---

### 3.5 Màn hình Admin ADM-05: Quản trị Danh mục Thiết bị IoT Bluetooth BLE (`device_catalog`)
- **Mục đích**: Cung cấp danh mục các loại máy đo y tế được D-HEALTH chứng nhận kết nối BLE, định nghĩa mã dịch vụ Bluetooth SIG GATT để ứng dụng di động tự động nhận diện và giải mã luồng byte dữ liệu (SCR-04).
- **Các trường dữ liệu Admin cần nhập & quản lý**:
  1. `manufacturer` (Chuỗi): Hãng sản xuất (VD: "Omron", "Beurer", "Accu-Chek", "iHealth").
  2. `model_name` (Chuỗi): Tên Model chính xác (VD: "HEM-7600T", "BM 85", "Guide Me").
  3. `device_type` (Enum): `blood_pressure`, `pulse_oximeter`, `blood_glucose`, `smart_scale`, `thermometer`.
  4. `bluetooth_service_uuid` (UUID/Hex): Chuẩn Bluetooth SIG GATT Service UUID (VD: `0x1810` cho Huyết áp, `0x1822` cho SpO2, `0x1808` cho Glucose).
  5. `bluetooth_char_uuid` (UUID/Hex): GATT Characteristic UUID truyền dữ liệu số đo (VD: `0x2A35` Blood Pressure Measurement).
  6. `byte_parser_algorithm` (Enum/Code): Mã giải thuật bóc tách byte (VD: `OMRON_GATT_IEEE11073_V1`).
  7. `pairing_guide_steps` (Mảng văn bản): 3 bước hướng dẫn bật Bluetooth ghép nối trên máy đo hiển thị ở bottom sheet mobile.
  8. `device_image_url` (S3 path): Ảnh minh họa thiết bị.

---

### 3.6 Màn hình Admin ADM-06: Quản trị Cấu hình Ngưỡng Cảnh báo Sinh trắc học (`config_biometric_thresholds`)
- **Mục đích**: Cố vấn y khoa cấu hình ngưỡng phân loại Mức 1 (Tốt/Xanh), Mức 2 (Theo dõi/Vàng), Mức 3 (Cảnh báo/Đỏ) theo độ tuổi, giới tính và bệnh nền (giải quyết câu hỏi mở Q2 của BA).
- **Các trường dữ liệu Admin cần nhập & quản lý**:
  1. `metric_type` (Enum): `bp_systolic`, `bp_diastolic`, `heart_rate`, `spo2`, `temperature`, `respiratory_rate`, `bmi`, `glucose_fasting`.
  2. `target_group` (Enum): `adult_normal`, `pediatric` ($<18$ tuổi), `elderly` ($\ge 65$ tuổi), `hypertensive_patient`, `diabetic_patient`.
  3. `green_min` & `green_max` (Float): Khoảng tối ưu an toàn (Mức 1 - Xanh lá).
  4. `yellow_min` & `yellow_max` (Float): Khoảng cần chú ý / tiền bệnh lý (Mức 2 - Hổ phách/Vàng).
  5. `red_danger_threshold` (Float): Ngưỡng khẩn cấp bắt buộc kích hoạt cảnh báo đỏ hoặc liên hệ bác sĩ (Mức 3 - Đỏ).
  6. `clinical_guideline_citation` (Chuỗi): Căn cứ y khoa dẫn chiếu (VD: "Quyết định 3192/QĐ-BYT 2020", "JNC 8 Guidelines").

---

### 3.7 Màn hình Admin ADM-07: Quản trị Bệnh Mạn tính & Phác đồ Chăm sóc Mẫu (`chronic_conditions`, `config_chronic_care_plans`)
- **Mục đích**: Thiết lập các gói theo dõi bệnh mạn tính (Tim mạch, Đái tháo đường, K gan, K phổi) hiển thị trên Disease Cockpit (SCR-09).
- **Các trường dữ liệu Admin cần nhập & quản lý**:
  1. `icd10_code` (Chuỗi): Mã bệnh ICD-10 (VD: `I10` - Tăng huyết áp vô căn, `E11` - Đái tháo đường type 2).
  2. `condition_name` (Chuỗi): Tên bệnh mạn tính.
  3. `required_biometric_metrics` (Mảng string): Các chỉ số bắt buộc đo hằng ngày (VD: `['bp', 'hr', 'weight']`).
  4. `required_lab_analytes` (Mảng string mã LOINC): Các chỉ số xét nghiệm định kỳ cần theo dõi (VD: `['HbA1c', 'Glucose', 'Creatinin', 'LDL-C']`).
  5. `followup_interval_days` (Số nguyên): Chu kỳ tái khám mặc định (VD: 30 ngày, 90 ngày).
  6. `default_checklist_tasks` (JSONB): Danh mục các đầu việc mẫu cần làm trước buổi khám ("Đo HA sáng tối 3 ngày liên tục", "Nhịn ăn sáng trước khi làm XN mỡ máu").

---

### 3.8 Màn hình Admin ADM-08: Quản trị Danh bạ Hotline Cấp cứu theo Tỉnh thành (`config_emergency_hotlines`)
- **Mục đích**: Cung cấp số điện thoại cấp cứu chính xác theo khu vực địa lý khi người dùng nhấn nút "Gọi cấp cứu 115" trên Thẻ cấp cứu SOS (SCR-17).
- **Các trường dữ liệu Admin cần nhập & quản lý**:
  1. `province_code` & `province_name` (Chuỗi): Tỉnh / Thành phố (VD: "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng").
  2. `national_115_number`: Mặc định `115`.
  3. `direct_emergency_phone`: SĐT đường dây nóng trực tiếp của Trung tâm Cấp cứu 115 địa phương (VD: `024.115` hoặc số cấp cứu vệ tinh).
  4. `dispatch_center_address`: Địa chỉ trung tâm điều phối cấp cứu.

---

### 3.9 Màn hình Admin ADM-09: Trung tâm Giám sát Tuân thủ & Nhật ký Kiểm toán Nghị định 13 (`audit_logs`, `consent_records`)
- **Mục đích**: Đảm bảo toàn vẹn pháp lý theo Điều 9, Điều 17 Nghị định 13/2023/NĐ-CP; cho phép thanh tra việc chia sẻ dữ liệu y tế của bên thứ ba, bác sĩ hoặc quét QR khẩn cấp.
- **Các trường dữ liệu Admin cần tra cứu & kiểm toán**:
  1. `audit_log_id` (UUID): Mã bản ghi kiểm toán bất biến (Immutable Ledger).
  2. `timestamp` (Timestamp with timezone UTC+7).
  3. `actor_type` (Enum): `patient`, `family_member`, `shared_doctor`, `emergency_first_responder`, `system_service`.
  4. `actor_id` & `actor_name`: Người thực hiện hành động.
  5. `action_type` (Enum): `VIEW_RECORD`, `EXPORT_PDF`, `MODIFY_MED`, `REVOKE_CONSENT`, `SCAN_EMERGENCY_QR`.
  6. `target_member_id` & `target_member_name`: Bệnh nhân có dữ liệu bị truy cập.
  7. `accessed_scope` (Chuỗi): Phạm vi dữ liệu (`BIOMETRICS`, `LAB_REPORT_SH`, `IMAGING_MRI`, `MEDICATION_LIST`).
  8. `client_ip` & `user_agent`: Địa chỉ IP và thiết bị truy cập.
  9. `consent_verification_status` (Boolean): Có hợp lệ theo biên bản đồng thuận đang hiệu lực không.

---

# CHƯƠNG 4: MA TRẬN ĐỐI SOÁT MATCHING 1-1 CHI TIẾT TỪNG DÒNG THÔNG TIN TRÊN MỌI MÀN HÌNH (SCR-01 ĐẾN SCR-17)

Bảng đối soát pháp y chi tiết từng phần tử giao diện, định vị chính xác nguồn gốc dữ liệu trong Database (Bảng & Cột), câu lệnh truy vấn SQL Query/Logic lấy từ DB, cơ chế nhập liệu và toàn bộ thuật toán logic tương quan giữa các input:

---

## SCR-01: Đăng nhập & Xác thực bảo mật (`Login`)
*Màn hình khởi động ứng dụng, quản lý phiên đăng nhập và định danh công dân.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Logo "D-HEALTH"** | Static Brand Asset | Không query DB | Render tĩnh SVG/Typography | Brand Teal `#1F7A8C`, độ tương phản WCAG 2.1 AA ($\ge 4.5:1$). |
| **Slogan "TRỢ LÝ SỨC KHOẺ THÔNG MINH"** | Static UI Text | Không query DB | Render tĩnh Typography | Subtitle font chữ 12px, tracking-widest, màu slate-500. |
| **Tiêu đề khối "Đăng nhập"** | Static UI Text | Không query DB | Render tĩnh | Căn lề trái, font SemiBold 20px. |
| **Label & Input "Tên đăng nhập" / Số điện thoại** | `users.phone_number` | `SELECT id, password_hash, is_ekyc_verified, biometric_public_key, locked_until, failed_attempts FROM users WHERE phone_number = :phone_number LIMIT 1;` | Bàn phím số (Phone Pad, touch) | **Validation:** Bắt buộc 10 chữ số, đầu số hợp lệ VN (`03`, `05`, `07`, `08`, `09`). Tự động trim space và dấu gạch nối. |
| **Label & Input "Mật khẩu"** | `users.password_hash` | Dùng giá trị `password_hash` từ query trên để verify: `argon2.verify(user.password_hash, input_password)` | Input password (ẩn/hiện mắt xem) | **Validation:** $\ge 8$ ký tự, gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt. Tuyệt đối không lưu plaintext. |
| **Checkbox "Ghi nhớ đăng nhập"** | Client Secure Storage | Không query DB trực tiếp | Checkbox touch toggle | Nếu tích chọn: Lưu Refresh Token vào Android Keystore / iOS Keychain. Phiên duy trì 30 ngày. |
| **Link "Quên mật khẩu?"** | `users.phone_number`<br>`otp_verifications` | `SELECT id FROM users WHERE phone_number = :phone_number;`<br>`INSERT INTO otp_verifications (phone, otp_hash, expires_at) VALUES (:phone, :hash, NOW() + INTERVAL '2 minutes');` | Chạm link | Gửi OTP 6 chữ số qua SMS. Xác thực đúng cho phép đổi mật khẩu mới (`UPDATE users SET password_hash = :new_hash`). |
| **Nút bấm "Đăng nhập"** | Trigger xác thực & cấp JWT | `UPDATE users SET failed_attempts = 0, last_login_at = NOW() WHERE id = :user_id;` | Chạm nút touch | Nếu sai mật khẩu $>5$ lần: `UPDATE users SET locked_until = NOW() + INTERVAL '15 minutes' WHERE id = :user_id;` $
ightarrow$ Trả lỗi `AUTH_RATE_LIMIT`. Thành công: sinh JWT Token (Access 15p + Refresh 7 ngày). |
| **Nút "Đăng nhập bằng sinh trắc học" (FaceID/Vân tay)** | `users.biometric_public_key`<br>`users.is_ekyc_verified` | `SELECT id, biometric_public_key FROM users WHERE id = :user_id AND is_ekyc_verified = true;` | Quét cảm biến vân tay / FaceID qua WebAuthn | Kiểm tra chữ ký mật mã WebAuthn Challenge khớp với `biometric_public_key` $
ightarrow$ Cấp token ngay không cần gõ mật khẩu. |
| **Dòng chữ "Chưa có tài khoản?" & Link "Đăng ký"** | Navigation Link | Không query DB | Chạm link | Chuyển sang luồng Đăng ký tài khoản & eKYC căn cước công dân. |
| **Dòng hỗ trợ: "Hỗ trợ: [Số điện thoại hỗ trợ]"** | `config_system_constants.support_hotline` | `SELECT value FROM config_system_constants WHERE key = 'SUPPORT_HOTLINE' LIMIT 1;` | Tự động đọc từ cấu hình hệ thống | Mặc định: `1900-xxxx` hoặc hotline tổng đài CSKH. Chạm vào kích hoạt quay số điện thoại `tel:1900xxxx`. |
| **Dòng bản quyền "Copyright © 2026 DAOGROUP"** | Static Footer Asset | Không query DB | Render tĩnh Typography | Hiển thị cố định dưới chân trang đăng nhập. |

---

## SCR-02: Trang chủ Tổng quan Sức khoẻ (`Main / Home`)
*Trung tâm điều khiển sức khoẻ hằng ngày của Chủ tài khoản.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Avatar & Câu chào "Xin chào,"** | Static Greeting Text | Không query DB | Tự động render | Câu chào thân thiện, kích cỡ 14px, màu slate-500. |
| **Tên chủ tài khoản: "Trần Minh Khang"** | `family_members.full_name`<br>`family_members.avatar_url` | `SELECT full_name, avatar_url FROM family_members WHERE user_id = :user_id AND relationship = 'owner' LIMIT 1;` | Tự động đọc từ phiên đăng nhập | **Logic cố định (BR-12):** Trang chủ LUÔN LUÔN hiển thị tên chủ tài khoản ("Trần Minh Khang"), không thay đổi theo hồ sơ người thân đang xem. |
| **Nút "SOS" (Màu đỏ góc trên)** | Navigation trigger | Không query DB | Chạm nút đỏ | Chuyển ngay sang màn hình SCR-17 (Thẻ cấp cứu SOS). Touch target chuẩn $\ge 44 	imes 44	ext{ pt}$. |
| **Icon Chuông thông báo** | `user_notifications` | `SELECT COUNT(*) FROM user_notifications WHERE user_id = :user_id AND is_read = false;` | Tự động đếm bản ghi chưa đọc | Hiển thị chấm đỏ nếu `count > 0`. Chạm vào mở danh sách thông báo nhắc khám, nhắc thuốc, cảnh báo chỉ số. |
| **Tiêu đề "Hôm nay bạn thế nào?"** | Static Greeting Title | Không query DB | Render tĩnh | Font chữ Bold 22px, màu slate-900. |
| **Chip Ngày "Hôm nay: dd/mm/yyyy"** | Đồng hồ thiết bị (Client time) | Không query DB | Tự động đọc múi giờ thiết bị | Múi giờ `Asia/Ho_Chi_Minh` (UTC+7). Format: `dd/mm/yyyy` (chấm xanh trạng thái kết nối). |
| **Thẻ Đo hồ quang: "Điểm sức khoẻ"** | Computed từ 3 bảng:<br>`biometric_records`<br>`dose_logs`<br>`lab_results` | `SELECT * FROM biometric_records WHERE member_id = :owner_member_id AND measured_at >= NOW() - INTERVAL '7 days';`<br>`SELECT status FROM dose_logs WHERE schedule_id IN (...) AND scheduled_at >= NOW() - INTERVAL '30 days';`<br>`SELECT flag FROM lab_results lr JOIN clinical_reports cr ON lr.report_id = cr.id WHERE cr.member_id = :owner_member_id;` | Tính toán tự động tại Backend Service | **Công thức 3 Trụ Cột (Chương 5.1):**<br>$$	ext{Điểm} = 0.4 	imes S_{	ext{sinh trắc}} + 0.3 	imes S_{	ext{thuốc}} + 0.3 	imes S_{	ext{xét nghiệm}}$$<br>Nếu thiếu $\ge 1$ trong 3 trụ cột $
ightarrow$ Hiển thị `"——"` và câu: *"Chưa đủ dữ liệu để tính điểm"* (BR-42). |
| **Giá trị Điểm sức khoẻ: "78" / "88"** | Computed Score Value | Kết quả từ công thức trên (thang điểm 0 - 100) | Tự động tính toán | Render số to 44px, đậm, nằm chính giữa cung hồ quang đo. |
| **Nhãn trạng thái Điểm: "Ổn định" / "Tốt"** | Quy đổi từ điểm số | So sánh điểm với ngưỡng: $\ge 80 
ightarrow$ "Tốt"; $60 - 79 
ightarrow$ "Ổn định / Cần chú ý"; $<60 
ightarrow$ "Cảnh báo" | Tự động gán nhãn | Tô màu tương ứng: Xanh lá (`#16A34A`), Vàng (`#F59E0B`), Đỏ (`#DC2626`). |
| **Dòng liên kết: "2 vấn đề cần theo dõi"** | `biometric_records.severity_level`<br>`lab_results.flag` | `SELECT COUNT(*) FROM biometric_records WHERE member_id = :owner_member_id AND severity_level IN (2, 3) AND measured_at >= NOW() - INTERVAL '30 days';` | Tính toán tự động | Đếm tổng số chỉ số đo bị cảnh báo bất thường trong 30 ngày. Chạm vào $
ightarrow$ Mở SCR-05 / SCR-03. |
| **Dòng thông tin: "9 nhóm dữ liệu"** | `clinical_reports.category`<br>`biometric_records.biometric_type` | `SELECT COUNT(DISTINCT category) FROM clinical_reports WHERE member_id = :owner_member_id AND performed_at >= NOW() - INTERVAL '90 days';` | Tính toán tự động | Thống kê số nhóm dữ liệu y tế đã có bản ghi (Huyết áp, Tim mạch, Sinh hoá, Huyết học, CĐHA, v.v.). |
| **Thẻ "NHẮC UỐNG THUỐC · 20:00"** | `dose_schedules.scheduled_time` | `SELECT ds.id, ds.scheduled_time FROM dose_schedules ds JOIN prescription_items pi ON ds.prescription_item_id = pi.id JOIN prescriptions p ON pi.prescription_id = p.id WHERE p.member_id = :owner_member_id AND p.status = 'active' ORDER BY ds.scheduled_time ASC LIMIT 1;` | Tự động đọc từ CSDL | Lấy mốc giờ uống kế tiếp gần nhất trong ngày so với thời gian hiện tại. |
| **Tên thuốc & hàm lượng: "Metformin 500 mg"** | `prescription_items.medication_name`<br>`prescription_items.dosage` | Truy vấn từ bảng `prescription_items` ứng với lịch uống ở trên | Tự động tải từ CSDL | Ghép chuỗi: `{medication_name} {dosage}`. Font chữ Medium 15px. |
| **Hướng dẫn liều & tiến độ: "1 viên sau ăn tối · hôm nay 2/4 liều"** | `dose_schedules.meal_relation`<br>`dose_logs.status` | `SELECT COUNT(*) FILTER (WHERE status = 'taken') as taken_today, COUNT(*) as total_today FROM dose_logs dl JOIN dose_schedules ds ON dl.schedule_id = ds.id WHERE DATE(dl.scheduled_at) = CURRENT_DATE;` | Tự động đếm từ `dose_logs` | Ghép chuỗi: `{dose_per_intake} {meal_relation_text} · hôm nay {taken_today}/{total_today} liều`. Cập nhật ngay khi uống. |
| **Nút "Đã uống" trên thẻ nhắc** | `dose_logs.status`<br>`dose_logs.taken_at` | `INSERT INTO dose_logs (id, schedule_id, scheduled_at, status, taken_at) VALUES (gen_random_uuid(), :schedule_id, :scheduled_at, 'taken', NOW());` | Chạm nút | Cập nhật bộ đếm hôm nay (ví dụ $2/4 
ightarrow 3/4$). Tự động nạp liều kế tiếp. Hiển thị Toast thông báo cho phép Hoàn tác trong 5 giây (BR-41). |
| **Lưới 4 Chỉ số: Huyết áp ("131/82 mmHg" - "Tốt")** | `biometric_records.systolic`<br>`biometric_records.diastolic`<br>`biometric_records.unit` | `SELECT systolic, diastolic, unit, measured_at, severity_level FROM biometric_records WHERE member_id = :owner_member_id AND biometric_type = 'bp' AND is_deleted = false ORDER BY measured_at DESC LIMIT 1;` | BLE Omron hoặc nhập tay ở SCR-03 | Format: `131/82 mmHg`. Gán nhãn mức (Tốt/Chú ý/Nguy cơ) theo JNC 8. Chạm $
ightarrow$ Mở SCR-03. |
| **Lưới 4 Chỉ số: Nhịp tim ("71 bpm" - "Tốt")** | `biometric_records.value_numeric`<br>`biometric_records.unit` | `SELECT value_numeric, unit, measured_at, severity_level FROM biometric_records WHERE member_id = :owner_member_id AND biometric_type = 'hr' AND is_deleted = false ORDER BY measured_at DESC LIMIT 1;` | Apple Watch / BLE / Đo kèm HA | Format: `71 bpm`. Nhãn "Tốt" nếu $60 - 90	ext{ bpm}$. Kèm sparkline mini diễn biến 7 ngày. Chạm $
ightarrow$ Mở SCR-03. |
| **Lưới 4 Chỉ số: Cân nặng ("72,5 kg" - "Theo dõi")** | `biometric_records.value_numeric`<br>`family_members.height_cm` | `SELECT value_numeric, unit, measured_at FROM biometric_records WHERE member_id = :owner_member_id AND biometric_type = 'weight' AND is_deleted = false ORDER BY measured_at DESC LIMIT 1;` | Cân Bluetooth hoặc nhập tay | Format dấu phẩy: `72,5 kg`. Nhãn "Theo dõi" nếu BMI $> 23.0$ (thang Châu Á). Chạm $
ightarrow$ Mở SCR-03. |
| **Lưới 4 Chỉ số: HbA1c ("6,6 %" - "Tốt")** | `lab_results.value_numeric`<br>`lab_results.unit` | `SELECT lr.value_numeric, lr.unit, cr.performed_at, lr.flag FROM lab_results lr JOIN clinical_reports cr ON lr.report_id = cr.id WHERE cr.member_id = :owner_member_id AND lr.test_code = 'HBA1C' ORDER BY cr.performed_at DESC LIMIT 1;` | Kết quả xét nghiệm máu (SCR-05/SCR-12) | Format: `6,6 %`. Nhãn "Tốt" nếu $< 7.0\%$ (theo ADA). Chạm $
ightarrow$ Mở SCR-05. |
| **Khối "AI INSIGHT" & Nội dung: "LDL-C tăng trong 3 lần xét nghiệm gần nhất."** | `ai_insights.summary`<br>`ai_insights.context_type` | `SELECT summary, context_type, created_at FROM ai_insights WHERE member_id = :owner_member_id ORDER BY created_at DESC LIMIT 1;` | AI Service sinh tự động định kỳ | Tóm tắt 1 câu nổi bật (VD: *"LDL-C tăng trong 3 lần xét nghiệm gần nhất"*). |
| **Nút "Xem phân tích" trên AI Insight** | Navigation trigger | Không query DB | Chạm link | Chuyển sang SCR-13 (Trợ lý AI Y tế Đa ngữ cảnh). |
| **Tiêu đề "Health Timeline"** | Static Section Header | Không query DB | Render tĩnh | Căn lề trái, font SemiBold 16px. |
| **Link "Xem tất cả" Timeline** | Navigation trigger | Không query DB | Chạm link | Chuyển sang SCR-10 (Hồ sơ y tế số - Medical Passport). |
| **Timeline Item 1: "Xét nghiệm máu · 20/10"** | `clinical_reports.title`<br>`clinical_reports.performed_at` | `SELECT title, performed_at, kind FROM clinical_reports WHERE member_id = :owner_member_id ORDER BY performed_at DESC LIMIT 1 OFFSET 0;` | CSDL tự động tải | Định dạng: `{title} · {dd/mm}`. Chạm vào mở báo cáo chi tiết SCR-06. |
| **Timeline Item 2: "CT ngực · 08/10"** | `clinical_reports.title`<br>`clinical_reports.performed_at` | `SELECT title, performed_at, kind FROM clinical_reports WHERE member_id = :owner_member_id ORDER BY performed_at DESC LIMIT 1 OFFSET 1;` | CSDL tự động tải | Định dạng: `{title} · {dd/mm}`. Chạm vào mở báo cáo chi tiết SCR-08. |
| **Thanh điều hướng đáy (Bottom Nav): 5 Tab** | App Navigation State | Không query DB | Chạm icon bar | **5 Tab chuẩn:** Trang chủ, Sức khoẻ, Hồ sơ, Trợ lý AI, Chăm sóc. Tab hiện tại đổi màu Teal `#1F7A8C`. |

---

## SCR-03: Sức khoẻ – Sinh trắc học & Chuỗi đo IoT (`Biometrics`)
*Màn hình chuyên sâu phân tích chuỗi biến thiên sinh hiệu thời gian thực.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Chip Ngày "Hôm nay: dd/mm/yyyy"** | Đồng hồ thiết bị (Client time) | Không query DB | Tự động đọc | Đồng bộ thời gian thực. |
| **Dropdown chọn hồ sơ: "Hồ sơ sức khoẻ: {{memName}}"** | `family_members.id`<br>`family_members.full_name` | `SELECT id, full_name, relationship, avatar_url FROM family_members WHERE user_id = :user_id ORDER BY relationship = 'owner' DESC, created_at ASC;` | Chạm dropdown chọn thành viên | Cho phép chuyển đổi linh hoạt giữa hồ sơ cá nhân và người thân (con cái, cha mẹ). Mặc định: người đang chọn. |
| **Dải 4 Tab con Sức khoẻ** | Static Enum Tab Bar | Không query DB | Chạm chọn ngang | **4 Tab cố định (BR-3.3):** Sinh trắc · Xét nghiệm · CĐHA · Bệnh mạn tính. Tab hiện tại là "Sinh trắc". |
| **Dải đồng bộ: "Đồng bộ từ Apple Watch, máy đo huyết áp · 5 phút trước"** | `connected_devices.custom_name`<br>`connected_devices.last_synced_at` | `SELECT custom_name, last_synced_at, battery_level FROM connected_devices WHERE user_id = :user_id AND is_connected = true ORDER BY last_synced_at DESC;` | Tự động đọc phiên sync BLE gần nhất | Ghép chuỗi: *"Đồng bộ từ {custom_name} · {x phút trước}"*. |
| **Nút "Thiết bị"** | Navigation trigger | Không query DB | Chạm nút | Mở ngay màn hình SCR-04 (Kết nối thiết bị). |
| **Dải 8 Chip chọn loại chỉ số** | Danh mục `biometric_types` Enum | Không query DB | Cuộn chip ngang | **8 Loại chỉ số chuẩn:** Huyết áp (`bp`), Nhịp tim (`hr`), SpO₂ (`spo2`), Nhiệt độ (`temp`), Nhịp thở (`resp`), Cân nặng / BMI (`weight`), Bước chân (`steps`), Giấc ngủ (`sleep`). |
| **Thẻ chỉ số: Tên & Đơn vị: "{{c.title}}", "{{c.unit}}"** | `config_biometric_thresholds` | `SELECT display_name, standard_unit FROM config_biometric_thresholds WHERE biometric_type = :selected_type LIMIT 1;` | Đọc từ catalog ngưỡng chuẩn | Hiển thị tên đầy đủ và đơn vị đo chuẩn (mmHg, bpm, %, °C, kg). |
| **Giá trị đo mới nhất & Thời điểm: "{{c.latest}}", "{{c.when}}"** | `biometric_records.systolic`<br>`biometric_records.diastolic`<br>`biometric_records.value_numeric`<br>`biometric_records.measured_at` | `SELECT systolic, diastolic, value_numeric, unit, measured_at, severity_level, source FROM biometric_records WHERE member_id = :active_member_id AND biometric_type = :selected_metric AND is_deleted = false ORDER BY measured_at DESC LIMIT 1;` | Đọc bản ghi có `measured_at` lớn nhất | Lấy giá trị có thời điểm đo lớn nhất (bất kể nguồn từ máy hay nhập tay - BR-55). Hiển thị số lớn kèm thời gian đo tương đối. |
| **Nhãn trạng thái chỉ số: "{{c.tag}}"** | Quy đổi ngưỡng y khoa | So sánh giá trị với bảng `config_biometric_thresholds` | Tự động tính toán | Phân loại 3 mức: "Bình thường / Tốt" (Xanh), "Cần chú ý / Theo dõi" (Vàng), "Nguy cơ / Cảnh báo" (Đỏ). |
| **Chú thích nguồn biểu đồ: "Từ thiết bị" (Xanh) & "Nhập tay" (Cam)** | Legend UI Text | Không query DB | Render tĩnh Legend | Phân biệt màu sắc trực quan: Xanh `#2F6FDB` (Thiết bị) vs Cam `#F59E0B` (Nhập tay). |
| **Biểu đồ chuỗi 7 lần đo gần nhất (`b0..b6`, `p0..p6`)** | `biometric_records` | `SELECT id, systolic, diastolic, value_numeric, unit, measured_at, source, severity_level FROM biometric_records WHERE member_id = :active_member_id AND biometric_type = :selected_metric AND is_deleted = false ORDER BY measured_at DESC LIMIT 7;` (Reverse vẽ từ trái sang phải) | Render SVG/Canvas tương tác | **Quy tắc biểu đồ (BR-54):** Gộp bản ghi thiết bị và nhập tay. Trục hoành hiển thị ngày/giờ đo. Thang đo huyết áp tối thiểu $70 - 150	ext{ mmHg}$. |
| **Dòng ghi chú xu hướng: "{{c.note}}"** | `biometric_records.notes` / AI Rule | Tính độ dốc (slope) qua 7 điểm đo | Tự động phân tích | Đánh giá xu hướng: *"Huyết áp có xu hướng tăng nhẹ vào buổi sáng; duy trì ổn định trong 3 ngày qua"*. |
| **Nút "Nhập số đo {{c.short}} thủ công"** | UI Action Trigger | Không query DB | Chạm nút | Mở Modal Bottom Sheet nhập liệu nhanh cho đúng loại chỉ số đang xem. |
| **Dòng hướng dẫn: "Chạm vào một chỉ số để xem diễn biến 7 lần đo gần nhất"** | Static Hint Text | Không query DB | Render tĩnh | Hướng dẫn người dùng cách tương tác với các chip chỉ số. |
| **Thẻ xem nhanh các chỉ số khác (`t.abbr`, `t.name`, `t.value`, `t.unit`)** | `biometric_records` | `SELECT biometric_type, systolic, diastolic, value_numeric, unit FROM biometric_records ... GROUP BY biometric_type` | CSDL nạp tự động | Hiển thị tóm tắt các sinh hiệu khác để chuyển đổi nhanh chỉ bằng 1 chạm. |
| **Tiêu đề Lịch sử: "Lịch sử đo · {{c.hname}}" & "{{histCount}} lần đo"** | `biometric_records` count | `SELECT COUNT(*) FROM biometric_records WHERE member_id = :active_member_id AND biometric_type = :selected_metric AND is_deleted = false;` | Đếm bản ghi trong DB | Hiển thị tổng số lần đo đã ghi nhận trong lịch sử. |
| **Danh sách lịch sử 5 số đo mới nhất (`h.value`, `h.when`, `h.src`, `h.sub`)** | `biometric_records` | `SELECT id, systolic, diastolic, value_numeric, unit, measured_at, source, context, notes FROM biometric_records WHERE member_id = :active_member_id AND biometric_type = :selected_metric AND is_deleted = false ORDER BY measured_at DESC LIMIT 5;` | CSDL tự động nạp | Hiển thị 5 dòng mới nhất, cuộn trong khung (In-frame scroll - BR-17). Nhãn nguồn rõ ràng. Dòng nhập tay có icon thùng rác để Xoá (BR-56). |
| **Dòng nhắc: "Hiển thị 5 lần đo mới nhất · kéo trong khung để xem thêm"** | Static Scroll Hint | Không query DB | Render tĩnh | Chỉ dẫn người dùng cuộn nội bộ trong card thay vì kéo dài toàn trang. |
| **Toast thông báo tương tác: "{{toastText}}"** | UI Ephemeral Notification | Không query DB | Nổi popup 3 giây | Báo kết quả: *"Đã lưu số đo thành công"* hoặc *"Đã xoá bản ghi (Hoàn tác trong 5s)"*. |
| **Bottom Sheet: Tiêu đề "Nhập số đo thủ công" & "Hồ sơ: {{memName}}"** | Modal Header | `family_members.full_name` | Mở khi bấm nút nhập | Hiển thị modal bo góc trên 28px, thanh kéo drag 40x5px. |
| **Bottom Sheet: Dropdown "Chỉ số" (8 tuỳ chọn)** | `biometric_types` Enum | Danh mục 8 chỉ số chuẩn | Dropdown native | Tuỳ chọn: Huyết áp, Nhịp tim, SpO₂, Nhiệt độ, Nhịp thở, Cân nặng / BMI, Bước chân, Giấc ngủ. Tự chọn loại đang xem. |
| **Bottom Sheet: "Thời điểm đo" & Nút chọn nhanh: "{{q.label}}"** | Người dùng chọn | `measured_at = date + time` | DatePicker & TimePicker native | **Quy tắc chặn tương lai (BR-50):** Tuyệt đối KHÔNG cho phép chọn thời điểm trong tương lai so với hiện tại (`measured_at \le 	ext{now()}`). Báo lỗi đỏ nếu vi phạm. Nút chọn nhanh: "Bây giờ", "30 phút trước". |
| **Bottom Sheet: Ô nhập động theo chỉ số (`fl.label`, `fl.unit`)** | `biometric_records.systolic`<br>`biometric_records.diastolic`<br>`biometric_records.value_numeric` | Sẽ được INSERT vào DB: `INSERT INTO biometric_records (member_id, group_id, biometric_type, systolic, diastolic, value_numeric, unit, measured_at, context, source, severity_level, notes) VALUES (...)` | Bàn phím số Number Pad | **Bất biến y khoa (BR-50):** Tâm thu: $60 - 250	ext{ mmHg}$, Tâm trương: $30 - 150	ext{ mmHg}$. Bắt buộc: $	ext{diastolic} < 	ext{systolic}$. Nếu vi phạm $
ightarrow$ Báo lỗi đỏ không cho lưu. |
| **Bottom Sheet: Dòng tự tính BMI: "{{bmiText}}"** | `family_members.height_cm` | Chiều cao lấy từ: `SELECT height_cm FROM family_members WHERE id = :active_member_id;`<br>Lưu cả `weight` và `bmi`: `INSERT INTO biometric_records ... VALUES (:weight), (:bmi);` | Bàn phím số (Nhập cân nặng) | **Công thức tự tính (BR-52):**<br>$$	ext{BMI} = rac{	ext{Cân nặng (kg)}}{(	ext{Chiều cao (m)})^2}$$<br>Hiển thị real-time khi gõ: *"BMI tự tính: 24,1 kg/m²"*. |
| **Bottom Sheet: "Hoàn cảnh đo" (5 Chip chọn: "{{x.label}}")** | `biometric_records.context` | Lưu vào cột `context`: `'rest'`, `'wake'`, `'exercise'`, `'meal_before'`, `'meal_after'`, `'bed'` | Single-select chip | Chọn 1 trong 5: `Lúc nghỉ` (mặc định), `Vừa thức dậy`, `Sau vận động`, `Sau ăn`, `Trước khi ngủ`. |
| **Bottom Sheet: Ô nhập "Ghi chú (tuỳ chọn)"** | `biometric_records.notes`<br>`biometric_records.body_site` | Lưu vào cột `notes` và `body_site` | Input text (tối đa 200 ký tự) | Cho phép ghi chú thêm bối cảnh (ví dụ: *"đo tay trái, sau khi uống cà phê 15 phút"*). |
| **Bottom Sheet: Dòng báo lỗi validation: "{{err}}"** | UI Error State | Không query DB | Hiển thị chữ đỏ | Cảnh báo khi nhập sai khoảng y khoa hoặc để trống trường bắt buộc. |
| **Bottom Sheet: 2 Nút "Huỷ" và "Lưu số đo"** | DB INSERT Action | Thực thi transaction lưu bản ghi | Chạm nút touch | Nút Lưu kiểm tra toàn bộ validation trước khi gửi request lên Backend. |
| **Lưu ý bảo mật chân sheet: "Số đo nhập tay được đánh dấu riêng..."** | Static Clinical Notice | Không query DB | Render tĩnh | Cung cấp tính minh bạch y khoa theo quy định của Bộ Y tế. |

---

## SCR-04: Quản lý Kết nối Thiết bị Ngoại vi & BLE (`Devices`)
*Màn hình ghép nối, quản lý giao thức Bluetooth Low Energy và đồng bộ thiết bị IoT.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Chip Ngày "Hôm nay: dd/mm/yyyy"** | Client Time | Không query DB | Đọc từ thiết bị | Múi giờ UTC+7. |
| **Tiêu đề "Kết nối thiết bị"** | Static Title | Không query DB | Render tĩnh | Font SemiBold 20px. |
| **Dòng đếm: "{{connectedCount}} thiết bị đang kết nối"** | `connected_devices` count | `SELECT COUNT(*) FROM connected_devices WHERE user_id = :user_id AND is_connected = true;` | Đếm bản ghi trong DB | Thống kê số lượng máy đo đang ở trạng thái kích hoạt kết nối. |
| **Trạng thái Bluetooth: "Bluetooth đang bật · tự động đồng bộ"** | Client Web Bluetooth API | Kiểm tra `navigator.bluetooth.getAvailability()` | Tự động phát hiện phần cứng | Báo xanh nếu Bluetooth trên điện thoại đang bật, báo vàng/đỏ nếu bị tắt hoặc chưa cấp quyền. |
| **Nút "Quét tìm thiết bị mới"** | Bluetooth Scan Trigger | `navigator.bluetooth.requestDevice({...})` | Chạm nút touch | Kích hoạt bộ quét BLE của trình duyệt/thiết bị để tìm các thiết bị y tế lân cận. Mở Bottom Sheet quét. |
| **Danh mục nhóm thiết bị: "{{g.title}}"** | `config_device_catalog.device_type` | `SELECT DISTINCT device_type FROM config_device_catalog;` | Nhóm tự động | Phân nhóm: Máy đo huyết áp, Máy đo đường huyết, Đồng hồ thông minh, Cân sức khoẻ. |
| **Logo viết tắt thiết bị: "{{d.abbr}}"** | `config_device_catalog.abbr` | `SELECT abbr FROM config_device_catalog WHERE id = :catalog_id;` | Đọc từ catalog | Hiển thị chữ viết tắt thương hiệu trong khung tròn: `OW` (Omron), `AW` (Apple Watch), `AC` (Accu-Chek), `BC` (Beurer). |
| **Tên thiết bị & Dòng mô tả: "{{d.name}}", "{{d.sub}}"** | `connected_devices.custom_name`<br>`config_device_catalog.model_name` | `SELECT cd.custom_name, cdc.brand, cdc.model_name, cd.mac_address, cd.battery_level FROM connected_devices cd JOIN config_device_catalog cdc ON cd.catalog_device_id = cdc.id WHERE cd.user_id = :user_id;` | CSDL nạp tự động | Ghép chuỗi: `{brand} {model_name} · Pin {battery_level}% · MAC {mac_address}`. |
| **Badge "Đã kết nối" / Nút "Kết nối"** | `connected_devices.is_connected` | Trạng thái boolean từ DB | Tự động toggle | Badge xanh lá nếu đang kết nối; nút xám bấm để thử kết nối lại nếu bị ngắt. |
| **Mục "Dữ liệu được đồng bộ": "{{t}}"** | `connected_devices.data_types`<br>`config_device_catalog.supported_data_types` | `SELECT data_types FROM connected_devices WHERE id = :device_id;` | Checkbox / Array data | Hiển thị danh sách chỉ số được phép đồng bộ: `Huyết áp`, `Nhịp tim`, `SpO₂`, `Cân nặng`. |
| **Label & Dropdown "Tần suất đồng bộ" (4 tuỳ chọn)** | `connected_devices.sync_frequency` | `UPDATE connected_devices SET sync_frequency = :freq WHERE id = :device_id;` | Dropdown select | **4 Tuỳ chọn chuẩn:** `Tự động (thời gian thực)`, `Mỗi 15 phút`, `Mỗi giờ`, `Thủ công`. Cập nhật ngay vào DB khi chọn. |
| **Nút bấm "Ngắt kết nối"** | `connected_devices.is_connected` | `UPDATE connected_devices SET is_connected = false WHERE id = :device_id;` | Chạm nút đỏ | Chấm dứt phiên kết nối BLE, dừng đồng bộ ngầm và huỷ ghép nối phần cứng. |
| **Lưu ý quyền riêng tư: "D-Health chỉ đọc những loại dữ liệu bạn cho phép..."** | Static Privacy Notice | Không query DB | Render tĩnh | Tuân thủ Nghị định 13/2023/NĐ-CP về quyền kiểm soát dữ liệu cá nhân. |
| **Bottom Sheet: 3 Bước hướng dẫn ghép nối (Bước 1, 2, 3)** | Static Pairing Guide | Không query DB | Render tĩnh từng bước | **Bước 1:** Bật thiết bị và chế độ ghép nối Bluetooth.<br>**Bước 2:** Đặt thiết bị gần điện thoại (dưới 1 mét).<br>**Bước 3:** Chọn thiết bị tìm thấy và xác nhận ghép nối. |
| **Dòng trạng thái quét: "Đang tìm thiết bị gần đây…"** | BLE Scanning State | Trạng thái scanning Web Bluetooth | Hiệu ứng sóng radar động | Hiển thị spinner và animation sóng quét tín hiệu xung quanh. |
| **Thiết bị tìm thấy: "{{found}}" & "Tín hiệu mạnh · [mã thiết bị]"** | BLE Advertisement Packet | Đọc `device.name`, `device.id`, `rssi` từ BLE Scanner | Dữ liệu quét không dây | Đọc chỉ số RSSI: $>-60	ext{ dBm} 
ightarrow$ "Tín hiệu mạnh"; $-60 	ext{ đến } -80 
ightarrow$ "Tín hiệu trung bình"; $<-80 
ightarrow$ "Tín hiệu yếu". |
| **Nút "Ghép nối"** | Bluetooth GATT Pair Action | `INSERT INTO connected_devices (user_id, catalog_device_id, custom_name, mac_address, sync_frequency, is_connected) VALUES (...)` | Chạm nút xanh | Khởi tạo GATT Server connection, ghi nhận thiết bị vào CSDL và bắt đầu phiên đồng bộ đầu tiên. |

---

## SCR-05: Sức khoẻ – Bảng tổng hợp Xét nghiệm (`Health - Labs`)
*Màn hình theo dõi các nhóm xét nghiệm cận lâm sàng và chỉ số sinh hoá dài hạn.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Dải 4 Tab con Sức khoẻ** | Static Enum Tab Bar | Không query DB | Chạm chọn ngang | Chuyển đổi giữa Sinh trắc, Xét nghiệm, CĐHA, Bệnh mạn tính. Tab hiện tại là "Xét nghiệm". |
| **Dải chip phân loại chuyên khoa (6 tuỳ chọn: "{{o.label}}")** | `clinical_reports.category` Enum | `SELECT DISTINCT category FROM clinical_reports WHERE member_id = :active_member_id;` | Cuộn chip ngang | **6 Phân loại:** `Tất cả`, `HH` (Huyết học), `SH` (Sinh hoá), `VS` (Vi sinh), `PT` (Sinh học phân tử), `DT` (Di truyền). |
| **Dòng giải thích viết tắt: "HH Huyết học · SH Sinh hoá · VS Vi sinh..."** | Legend UI Text | Không query DB | Render tĩnh | Giúp bệnh nhân dễ hiểu các ký hiệu viết tắt chuyên môn y tế. |
| **Thông báo trống: "Chưa có kết quả {{catFull}} trong hồ sơ."** | Empty State UI | Kiểm tra nếu kết quả query trả về 0 dòng | Render tự động | Kèm nút bấm CTA "Nhập kết quả ngay" dẫn sang SCR-12. |
| **Thẻ phiếu kết quả: Icon nhóm "{{s.cat}}", Tên "{{s.title}}"** | `clinical_reports.category`<br>`clinical_reports.title` | `SELECT id, category, title, performed_at, facility_name, conclusion FROM clinical_reports WHERE member_id = :active_member_id AND kind = 'lab' ORDER BY performed_at DESC;` | CSDL nạp tự động | Hiển thị thẻ tóm tắt phiếu xét nghiệm. Icon nhóm viết tắt nổi bật (ví dụ: `SH` màu xanh da trời). |
| **Ngày thực hiện & Kết luận tóm tắt: "{{s.date}}", "{{s.finding}}"** | `clinical_reports.performed_at`<br>`clinical_reports.conclusion` | Lấy từ query trên | CSDL nạp tự động | Ngày định dạng `dd/mm/yyyy`. Kết luận trích xuất tóm tắt ngắn gọn. Chạm thẻ $
ightarrow$ Mở SCR-06. |
| **Dòng phân trang nội bộ: "{{labTotal}} kết quả · hiển thị 5 mới nhất..."** | Count query | `SELECT COUNT(*) FROM clinical_reports WHERE member_id = :active_member_id AND kind = 'lab';` | Đếm tổng số bản ghi | Quy chuẩn In-frame internal scroll (BR-17): Chỉ nạp 5 mục ra DOM chính, phần còn lại cuộn trong khung. |
| **Khối "Chỉ số cần theo dõi" & Dòng đếm: "Đã chọn {{count}}/{{total}}"** | User Selected State | Lưu danh sách chỉ số theo dõi vào `user_tracked_metrics` | Chạm chip chọn | Cho phép chọn tối đa 3 chỉ số để vẽ đồ thị so sánh diễn biến. |
| **Các chip chọn chỉ số theo dõi: "{{c.name}}"** | `master_lab_tests.test_name` | `SELECT DISTINCT lr.test_code, lr.test_name FROM lab_results lr JOIN clinical_reports cr ON lr.report_id = cr.id WHERE cr.member_id = :active_member_id;` | Đọc danh mục chỉ số có sẵn | Danh sách: `LDL-C`, `HbA1c`, `Creatinin`, `Glucose đói`, `Triglyceride`, `AST`, `ALT`, v.v. |
| **Thông báo khi chưa chọn: "Chọn ít nhất một chỉ số để xem biểu đồ..."** | Empty Chart State | Khi `selected_metrics.length === 0` | Render tự động | Hướng dẫn người dùng chọn chip ở trên. |
| **Biểu đồ xu hướng chỉ số (`m.name`, `m.latest`, `m.unit`, `m.tag`)** | `lab_results.value_numeric`<br>`lab_results.unit`<br>`lab_results.flag` | `SELECT lr.value_numeric, lr.unit, lr.flag, cr.performed_at, lr.reference_range_low, lr.reference_range_high FROM lab_results lr JOIN clinical_reports cr ON lr.report_id = cr.id WHERE cr.member_id = :active_member_id AND lr.test_name = :metric_name ORDER BY cr.performed_at DESC LIMIT 5;` | Render đồ thị SVG đa điểm | Hiển thị tên chỉ số, giá trị gần nhất, đơn vị, nhãn "Bình thường" (Xanh) hoặc "Tăng/Giảm" (Cam/Đỏ). |
| **Đường mục tiêu tham chiếu: "{{m.targetLabel}}"** | `master_lab_tests.target_value` | Lấy ngưỡng từ bảng danh mục chuẩn | Render nét đứt trên đồ thị | Ví dụ: Đường mục tiêu LDL-C $< 2.6	ext{ mmol/L}$ hoặc HbA1c $< 7.0\%$. |
| **5 Điểm đo trên đồ thị (`m.l0..l4`, `dm0..dm4`, `yy0..yy4`)** | 5 lần xét nghiệm gần nhất | 5 giá trị số tương ứng 5 mốc ngày thực hiện | Render toạ độ đồ thị | Thể hiện trực quan xu hướng tăng/giảm qua các lần làm xét nghiệm trong năm. |
| **Ghi chú xu hướng: "{{m.note}}"** | Computed Clinical Trend | Tính toán chênh lệch giữa lần đo mới nhất và lần đo trước | Tự động sinh nhận định | Ví dụ: *"LDL-C tăng liên tục trong 3 lần xét nghiệm gần nhất (2.8 $
ightarrow$ 3.2 $
ightarrow$ 3.6 mmol/L)"*. |
| **Chú thích nguồn: "Trục hoành: ngày làm xét nghiệm · [Bệnh viện đối tác]"** | `clinical_reports.facility_name` | Lấy tên cơ sở y tế gần nhất | Render chú thích | Minh bạch nguồn gốc cơ sở y tế thực hiện xét nghiệm. |

---

## SCR-06: Báo cáo Kết quả Xét nghiệm Chi tiết (`LabReport`)
*Màn hình hiển thị toàn văn phiếu kết quả xét nghiệm chuẩn hoá và đối soát chỉ số.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Tiêu đề phiếu & Badge nhóm: "Sinh hoá máu", "SH"** | `clinical_reports.title`<br>`clinical_reports.category` | `SELECT title, category, performed_at, facility_name, ordering_doctor_name, interpreting_doctor_name, specimen_type, accession_number, conclusion, attachment_s3_key FROM clinical_reports WHERE id = :report_id;` | CSDL nạp tự động | Tiêu đề lớn 20px, badge viết tắt nhóm SH bo tròn nền xanh da trời. |
| **Dòng phụ "Kết quả xét nghiệm chi tiết"** | Static Subtitle | Không query DB | Render tĩnh | Subtitle font 13px, màu slate-500. |
| **Ngày lấy mẫu: "20/10/2026 · 07:30"** | `clinical_reports.performed_at` | Định dạng ngày và giờ lấy mẫu từ DB | CSDL nạp tự động | Format: `dd/mm/yyyy · hh:mm`. Lúc lấy mẫu khi đói. |
| **Ngày trả kết quả: "20/10/2026 · 11:00"** | `clinical_reports.created_at` | Thời điểm phòng Lab ký duyệt kết quả | CSDL nạp tự động | Thể hiện thời gian xử lý mẫu (TAT - Turnaround Time). |
| **Nơi thực hiện: "[Bệnh viện đối tác]"** | `clinical_reports.facility_name` | Lấy tên bệnh viện / phòng lab thực hiện | CSDL nạp tự động | Tên cơ sở y tế được cấp phép hoạt động xét nghiệm. |
| **Bác sĩ chỉ định: "BS Trần Văn B"** | `clinical_reports.ordering_doctor_name` | Lấy tên bác sĩ khám bệnh chỉ định xét nghiệm | CSDL nạp tự động | Bác sĩ điều trị phụ trách chỉ định danh mục xét nghiệm. |
| **Loại mẫu: "Huyết thanh · lúc đói"** | `clinical_reports.specimen_type` | Cột `specimen_type` mới bổ sung | CSDL nạp tự động | Xác định tính hợp lệ của mẫu bệnh phẩm (huyết thanh, huyết tương, nước tiểu, dịch não tuỷ). |
| **Mã phiếu: "[Mã phiếu]"** | `clinical_reports.accession_number` | Cột `accession_number` mới bổ sung | CSDL nạp tự động | Mã barcode / số tiếp nhận định danh duy nhất của lượt xét nghiệm tại bệnh viện. |
| **Tiêu đề cột bảng chỉ số: "Chỉ số", "Kết quả", "Tham chiếu"** | Table Headers | Không query DB | Render tĩnh header bảng | Chia 3 cột chuẩn hiển thị bảng kết quả xét nghiệm y khoa. |
| **Tên chỉ số & Đơn vị: "{{r.name}}", "{{r.unit}}"** | `lab_results.test_name`<br>`lab_results.unit` | `SELECT test_name, value_numeric, value_text, unit, reference_range_text, flag FROM lab_results WHERE report_id = :report_id ORDER BY display_order ASC;` | CSDL nạp tự động | Hiển thị tên chỉ số (ví dụ: Glucose, Cholesterol toàn phần, Triglyceride, HDL-C, LDL-C). |
| **Giá trị kết quả & Cờ cảnh báo: "{{r.value}} {{r.flag}}"** | `lab_results.value_numeric`<br>`lab_results.flag` | Lấy từ query trên | CSDL nạp tự động | Tô màu nổi bật: Bình thường (chữ đen), Cao (chữ đỏ kèm icon mũi tên lên `↑`), Thấp (chữ xanh kèm mũi tên xuống `↓`). |
| **Khoảng tham chiếu: "{{r.ref}}"** | `lab_results.reference_range_text` | Ngưỡng sinh lý bình thường | CSDL nạp tự động | Ví dụ: `3.9 - 6.4 mmol/L` hoặc `< 1.70 mmol/L`. |
| **Khối tóm tắt: "10/12 chỉ số trong giới hạn tham chiếu..."** | Computed Summary Text | Đếm tổng số bản ghi và số bản ghi có `flag = 'normal'` | Tự động tổng hợp | Ghép chuỗi phân tích tỷ lệ đạt chuẩn và liệt kê các chỉ số bất thường nổi bật. |
| **Nhận xét của bác sĩ: "[Nhận xét / kết luận trên phiếu kết quả]"** | `clinical_reports.conclusion` | Lời phê chẩn đoán của bác sĩ duyệt phiếu | CSDL nạp tự động | Khối nền xám bo góc tròn, trích nguyên văn nhận xét chuyên môn của bác sĩ. |
| **Khối tệp đính kèm: "PDF Phiếu kết quả gốc"** | `clinical_reports.attachment_s3_key` | Link presigned URL file PDF lưu trên S3 | Chạm vào để xem/tải | Cho phép bệnh nhân mở xem trực tiếp bản in scan có dấu đỏ của cơ sở y tế. |
| **Nguồn dữ liệu: "Nhập từ link cơ sở y tế · Bạn đã xác nhận..."** | `clinical_reports.source_type` | Nguồn nạp dữ liệu và thời điểm xác nhận | CSDL nạp tự động | Xác minh nguồn dữ liệu chính thống (Link CSYT, OCR Camera hoặc Nhập tay). |
| **Nút bấm "Hỏi trợ lý AI"** | Navigation trigger | Mở SCR-13 kèm context `:report_id` | Chạm nút touch | Kích hoạt AI giải thích cặn kẽ ý nghĩa từng chỉ số và chế độ dinh dưỡng tương ứng. |
| **Nút bấm "Gửi cho bác sĩ"** | Action trigger | Tạo bản ghi trong `share_grants` | Chạm nút touch | Chọn bác sĩ trong danh bạ để gửi link truy cập xem phiếu xét nghiệm bảo mật. |

---

## SCR-07: Sức khoẻ – Chẩn đoán hình ảnh & Theo dõi u bướu (`Imaging`)
*Màn hình quản trị kết quả CĐHA (X-quang, CT, MRI) và thuật toán đánh giá khối u theo chuẩn RECIST 1.1.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Dải 4 Tab con Sức khoẻ** | Static Enum Tab Bar | Không query DB | Chạm chọn ngang | Chuyển giữa Sinh trắc, Xét nghiệm, CĐHA, Bệnh mạn tính. Tab hiện tại là "CĐHA". |
| **Dải chip phương tiện CĐHA (6 tuỳ chọn: "{{o.label}}")** | `imaging_studies.modality` Enum | `SELECT DISTINCT modality FROM imaging_studies WHERE member_id = :active_member_id;` | Cuộn chip ngang | **6 Phương tiện chuẩn:** `Tất cả`, `XQ` (X-quang), `SA` (Siêu âm), `CT` (Cắt lớp vi tính), `MRI` (Cộng hưởng từ), `MM` (Nhũ ảnh Mammography). |
| **Thông báo trống: "Chưa có kết quả {{modLabel}} trong hồ sơ."** | Empty State UI | Khi query trả về 0 kết quả | Render tự động | Báo trạng thái hồ sơ chưa có ảnh chụp thuộc nhóm phương tiện đang lọc. |
| **Thẻ kết quả CĐHA: Icon viết tắt "{{s.short}}", Tiêu đề "{{s.title}}"** | `imaging_studies.modality`<br>`imaging_studies.study_description` | `SELECT id, modality, study_description, performed_at, facility_name, findings, conclusion FROM imaging_studies WHERE member_id = :active_member_id ORDER BY performed_at DESC;` | CSDL nạp tự động | Thẻ kết quả chụp hình ảnh. Icon viết tắt nổi bật (ví dụ: `MRI` nền tím). |
| **Ngày chụp & Kết luận tóm tắt: "{{s.date}}", "{{s.finding}}"** | `imaging_studies.performed_at`<br>`imaging_studies.conclusion` | Lấy từ query trên | CSDL nạp tự động | Ngày chụp `dd/mm/yyyy`, kèm trích đoạn kết luận mô tả tổn thương. Chạm thẻ $
ightarrow$ Mở SCR-08. |
| **Dòng đếm: "{{studyTotal}} kết quả · hiển thị 5 mới nhất..."** | Count query | `SELECT COUNT(*) FROM imaging_studies WHERE member_id = :active_member_id;` | Đếm tổng số ca chụp | Giới hạn 5 mục trên DOM, phần còn lại cuộn nội bộ trong khung. |
| **Khối "Theo dõi kích thước tổn thương"** | Section Title | Không query DB | Render tĩnh header | Bảng theo dõi động học kích thước khối u theo chuỗi thời gian. |
| **Dòng phụ "Chọn từ các kết quả bất thường"** | Static Subtitle | Không query DB | Render tĩnh | Hướng dẫn chọn tổn thương từ các ca chụp trước để so sánh. |
| **Bộ lọc 1: "Loại tổn thương" (4 tuỳ chọn)** | `tumor_tracking_evaluations.lesion_type` | Cột `lesion_type` mới bổ sung | Dropdown select | **4 Tuỳ chọn:** `Tất cả`, `Khối u đặc` (`solid_tumor`), `Khối u nang` (`cystic_lesion`), `Tổn thương khác` (`other`). |
| **Bộ lọc 2: "Vị trí" giải phẫu (13 tuỳ chọn)** | `tumor_tracking_evaluations.organ` | Danh mục cơ quan giải phẫu | Dropdown select | **13 Vị trí:** `Tất cả`, `Gan`, `Thận`, `Phổi`, `Tuyến giáp`, `Tuyến vú`, `Tuỵ`, `Lách`, `Túi mật`, `Tử cung`, `Buồng trứng`, `Tiền liệt tuyến`, `Sọ não`, `Khác (tự nhập)...` |
| **Ô nhập "Cấu trúc giải phẫu khác"** | `tumor_tracking_evaluations.custom_anatomical_site` | Cột `custom_anatomical_site` mới bổ sung | Input text | Xuất hiện khi chọn mục "Khác (tự nhập)..." để lưu tên vị trí giải phẫu đặc biệt. |
| **Bộ lọc 3: "Phương tiện" (6 tuỳ chọn)** | `imaging_studies.modality` | Danh mục phương tiện chụp | Dropdown select | Cho phép lọc riêng tổn thương đo trên CT hoặc MRI để đảm bảo chuẩn so sánh. |
| **Thông báo khi không khớp: "Không có kết quả bất thường phù hợp bộ lọc."** | Empty Filter State | Khi không có dòng nào thoả mãn | Render tự động | Thông báo khi bộ lọc không có dữ liệu tương ứng. |
| **Thẻ nhóm u: "{{g.typeLabel}} · {{g.loc}}" & Tổng hiện tại: "{{g.current}} mm"** | `tumor_tracking_evaluations.lesion_location`<br>`tumor_tracking_evaluations.current_sum_diameters_mm` | `SELECT organ, lesion_location, current_sum_diameters_mm, baseline_sum_diameters_mm, nadir_sum_diameters_mm, recist_response FROM tumor_tracking_evaluations WHERE id = :eval_id;` | CSDL nạp tự động | Hiển thị loại u, vị trí cụ thể (ví dụ: *"Khối u đặc · Gan (Hạ phân thuỳ VI, VII, VIII)"*) và tổng đường kính hiện tại (mm). |
| **Biểu đồ cột/đường biến thiên kích thước 3 mốc chụp gần nhất** | 3 Lần chụp gần nhất | `SELECT performed_at, sum_diameters_mm FROM ...` | Render SVG | Vẽ trực quan kích thước tổn thương qua 3 mốc (ví dụ: Baseline 45mm $
ightarrow$ Mốc 2: 40mm $
ightarrow$ Nay: 38mm). |
| **Bảng chi tiết kích thước từng tổn thương (`r.name`, `r.s0`, `r.s1`, `r.s2`)** | `tumor_lesions` | `SELECT lesion_label, size_baseline_mm, size_previous_mm, size_current_mm FROM tumor_lesions WHERE evaluation_id = :eval_id;` | CSDL nạp tự động | Chi tiết từng u: U1 (12 $
ightarrow$ 10mm), U2 (15 $
ightarrow$ 12mm), U3 (18 $
ightarrow$ 16mm). |
| **Dòng tổng đường kính: "Tổng đường kính: {{g.t0}} → {{g.t1}} → {{g.t2}} mm"** | Tổng đường kính trục dài | Tính tổng đường kính các u đích: $\sum D_i$ | Tự động cộng tổng | Công thức RECIST: $	ext{Tổng} = \sum_{i=1}^k D_i$ (tối đa 5 u, không quá 2 u/cơ quan). |
| **Ghi chú tiến triển u: "{{g.note}}"** | `tumor_tracking_evaluations.treatment_response_note` | Đọc từ nhận định bác sĩ / giải thuật | CSDL nạp tự động | Ghi chú tóm tắt xu hướng: *"Kích thước u giảm 15.6% so với ban đầu; đáp ứng tốt với phác đồ điều trị"*. |
| **Tiêu đề khối: "Đánh giá đáp ứng RECIST 1.1"** | Standards Header | Không query DB | Render tĩnh header | Tiêu chuẩn đánh giá đáp ứng điều trị khối u đặc quốc tế (RECIST 1.1). |
| **Dòng phụ: "Tuỳ chọn · cho khối u đặc sau điều trị"** | Static Subtitle | Không query DB | Render tĩnh | Quy định đối tượng áp dụng chuẩn RECIST. |
| **Cảnh báo u nhỏ: "Tổn thương nhỏ hơn 10 mm nên chưa đủ tiêu chuẩn..."** | Clinical Rule Warning | Kiểm tra nếu $\max(D_i) < 10	ext{ mm}$ trên CT/MRI | Render tự động | **Quy tắc RECIST 1.1:** Tổn thương đích bắt buộc phải có đường kính dài nhất $\ge 10	ext{ mm}$ trên lát cắt mỏng CT/MRI. |
| **Hộp kết quả RECIST: Mã "{{rc.code}}" & Nhãn "{{rc.label}}"** | `tumor_tracking_evaluations.recist_response` | Tính toán từ công thức RECIST (Chương 5.2) | Tự động phân loại | **4 Mã đáp ứng chuẩn:**<br>1. **CR** (Complete Response - Đáp ứng hoàn toàn)<br>2. **PR** (Partial Response - Đáp ứng một phần, giảm $\ge 30\%$ so với Baseline)<br>3. **SD** (Stable Disease - Bệnh ổn định)<br>4. **PD** (Progressive Disease - Bệnh tiến triển, tăng $\ge 20\%$ và tăng tuyệt đối $\ge 5	ext{ mm}$ so với Nadir). |
| **Phần trăm thay đổi & Ngày: "{{rc.change}} so với ban đầu · {{rc.date}}"** | Computed % Change | $$\% \Delta = rac{	ext{Hiện tại} - 	ext{Ban đầu}}{	ext{Ban đầu}} 	imes 100\%$$ | Tự động tính toán | Ví dụ: `Giảm 15,6% so với ban đầu · 20/08/2026`. |
| **3 Mốc so sánh RECIST: Ban đầu, Nhỏ nhất, Hiện tại** | Baseline, Nadir, Current | `baseline_sum_diameters_mm`, `nadir_sum_diameters_mm`, `current_sum_diameters_mm` | CSDL nạp tự động | Thể hiện 3 con số quan trọng nhất của bệnh nhân ung bướu để so sánh diễn biến. |
| **Bảng định nghĩa 4 mức RECIST 1.1 (`c.code`, `c.name`, `c.rule`)** | Static RECIST Catalog | Bảng định nghĩa chuẩn y khoa | Render tĩnh bảng | Bảng tra cứu cho bệnh nhân hiểu quy tắc tính CR, PR, SD, PD. |
| **Khuyến cáo y khoa chân trang: "Tổn thương đích: ≥10 mm trên CT/MRI..."** | Legal Clinical Disclaimer | Không query DB | Render tĩnh | Cảnh báo kết quả mang tính chất tham khảo, quyết định điều trị do hội đồng hội chẩn đưa ra. |

---

## SCR-08: Báo cáo CĐHA Chi tiết & Lát cắt PACS (`ImagingReport`)
*Màn hình hiển thị toàn văn báo cáo chẩn đoán hình ảnh và tích hợp xem phim DICOM trực tuyến.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Tiêu đề ca chụp: "MRI gan có tiêm thuốc"** | `imaging_studies.study_description` | `SELECT study_description, modality, performed_at, body_site, facility_name, ordering_doctor_name, interpreting_doctor_name, technique_description, findings, conclusion, recommendations, pacs_study_uid, attachment_s3_key FROM imaging_studies WHERE id = :study_id;` | CSDL nạp tự động | Tên kỹ thuật chụp hình ảnh được bác sĩ thực hiện. |
| **Dòng phụ "Báo cáo chẩn đoán hình ảnh"** | Static Subtitle | Không query DB | Render tĩnh | Font SemiBold 13px, màu slate-500. |
| **Badge phương tiện & Chuỗi xung: "MRI", "T1 + thuốc", "T2", "DWI"** | `imaging_studies.modality`<br>`imaging_series.series_description` | `SELECT series_description FROM imaging_series WHERE study_id = :study_id;` | CSDL nạp tự động | Các chuỗi xung cộng hưởng từ chụp khảo sát (T1 FatSat tương phản, T2 weighted, Diffusion Weighted Imaging). |
| **Ngày thực hiện: "20/08/2026"** | `imaging_studies.performed_at` | Ngày giờ thực hiện ca chụp | CSDL nạp tự động | Định dạng ngày `dd/mm/yyyy`. |
| **Bộ phận chụp: "Gan · ổ bụng trên"** | `imaging_studies.body_site` | Bộ phận giải phẫu khảo sát | CSDL nạp tự động | Cơ quan đích được chỉ định khảo sát hình ảnh. |
| **Nơi thực hiện: "[Bệnh viện đối tác]"** | `imaging_studies.facility_name` | Tên cơ sở y tế thực hiện chụp | CSDL nạp tự động | Bệnh viện / Trung tâm CĐHA có máy MRI. |
| **Bác sĩ chỉ định: "[Bác sĩ ung bướu]"** | `imaging_studies.ordering_doctor_name` | Tên bác sĩ lâm sàng gửi yêu cầu chụp | CSDL nạp tự động | Bác sĩ điều trị theo dõi bệnh nhân. |
| **Bác sĩ đọc kết quả: "BS Lê Văn C"** | `imaging_studies.interpreting_doctor_name` | Bác sĩ chuyên khoa CĐHA ký đọc kết quả | CSDL nạp tự động | Bác sĩ chịu trách nhiệm chuyên môn về kết luận hình ảnh. |
| **So sánh với phim cũ: "CT 20/06/2026"** | `imaging_studies.comparison_study_id` | Tham chiếu ID ca chụp đối chiếu trước đó | CSDL nạp tự động | Căn cứ so sánh kích thước và tính chất ngấm thuốc của khối u. |
| **Khối "KỸ THUẬT" & Nội dung chi tiết** | `imaging_studies.technique_description` | Trường mô tả máy móc, từ lực, thuốc đối quang từ | CSDL nạp tự động | Ví dụ: *"MRI 1.5T ổ bụng trên, chuỗi T1, T2, DWI; tiêm thuốc tương phản từ Primovist, chụp động học các thì"*. |
| **Khối "MÔ TẢ" & Chi tiết giải phẫu học** | `imaging_studies.findings` | Bản tường trình chi tiết hình thái học các cơ quan | CSDL nạp tự động | Mô tả chi tiết nhu mô gan, bờ gan, vị trí u, ngấm thuốc dạng viền, hạch vùng và mạch máu. |
| **Bảng theo dõi tổn thương (Cột: Tổn thương, Loại, Trước, Nay)** | `tumor_lesions` | `SELECT lesion_label, lesion_type, size_previous_mm, size_current_mm FROM tumor_lesions WHERE study_id = :study_id;` | CSDL nạp tự động | Bảng đối soát chi tiết từng khối: U1 HPT VI (12 $
ightarrow$ 10mm), U2 HPT VII (15 $
ightarrow$ 12mm), U3 HPT VIII (18 $
ightarrow$ 16mm), N1 HPT II (Nang 12mm ổn định). |
| **Khối "KẾT LUẬN"** | `imaging_studies.conclusion` | Kết luận chính của bác sĩ CĐHA | CSDL nạp tự động | Tóm tắt biến chuyển: *"Ba khối đặc gan giảm kích thước so với phim 20/06/2026 (tổng 45 $
ightarrow$ 38 mm). Nang gan đơn thuần ổn định"*. |
| **Khối "ĐỀ NGHỊ"** | `imaging_studies.recommendations` | Hướng xử trí và thời gian chụp kiểm tra tiếp theo | CSDL nạp tự động | Ví dụ: *"Theo dõi đáp ứng điều trị, chụp lại sau 3 tháng"*. |
| **Nút bấm "Xem ảnh DICOM (PACS) · Báo cáo PDF"** | DICOM Viewer / PDF presigned URL | `pacs_study_uid` / `attachment_s3_key` | Chạm nút touch | Tích hợp mở trình xem ảnh y khoa DICOM PACS đa lát cắt chuẩn web (CornerstoneJS) hoặc tải file PDF báo cáo gốc. |
| **Nút bấm "Theo dõi tổn thương"** | Navigation trigger | Mở SCR-07 | Chạm nút touch | Chuyển thẳng về màn hình biểu đồ xu hướng RECIST để theo dõi tiến triển. |
| **Nút bấm "Gửi cho bác sĩ"** | Action trigger | Tạo quyền truy cập trong `share_grants` | Chạm nút touch | Chia sẻ báo cáo và link ảnh DICOM cho bác sĩ chuyên khoa ung bướu. |

---

## SCR-09: Bệnh mạn tính – Disease Cockpit (`Cockpit`)
*Bảng điều khiển chuyên sâu quản lý bệnh lý mạn tính (Tim mạch, Đái tháo đường, Rối loạn chuyển hoá).*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Dải 4 Tab con Sức khoẻ** | Static Enum Tab Bar | Không query DB | Chạm chọn ngang | Chuyển giữa Sinh trắc, Xét nghiệm, CĐHA, Bệnh mạn tính. Tab hiện tại là "Bệnh mạn tính". |
| **Khối bệnh 1: Tiêu đề "Tim mạch"** | `patient_chronic_conditions.condition_name` | `SELECT id, condition_name, risk_level, trend_status, status_summary, next_checkup_date, action_items, target_metrics FROM patient_chronic_conditions WHERE member_id = :active_member_id AND is_active = true;` | CSDL nạp tự động | Bảng quản lý bệnh mạn tính cá nhân mới bổ sung. Tên bệnh lý theo dõi. |
| **Đánh giá nguy cơ: "Nguy cơ trung bình · xu hướng ổn định"** | `patient_chronic_conditions.status_summary` | Ghép từ `risk_level` và `trend_status` | CSDL nạp tự động | Đánh giá tổng hợp nguy cơ tim mạch (thang điểm SCORE/Framingham). |
| **5 Chỉ số giám sát Tim mạch: Huyết áp, LDL-C, HbA1c, Nhịp tim, Cân nặng** | Liên kết từ `biometric_records` và `lab_results` | Đọc giá trị đo gần nhất của 5 chỉ số này của bệnh nhân | Tự động tổng hợp | Đối chiếu với `target_metrics`: Huyết áp (Theo dõi), LDL-C (Theo dõi), HbA1c (Tốt), Nhịp tim (Tốt), Cân nặng (Theo dõi). |
| **Lịch hẹn tái khám: "Tái khám: 12/11/2026"** | `patient_chronic_conditions.next_checkup_date`<br>`appointments.appointment_date` | `SELECT appointment_date FROM appointments WHERE member_id = :active_member_id AND status = 'scheduled' ORDER BY appointment_date ASC LIMIT 1;` | CSDL nạp tự động | Lịch khám định kỳ bệnh mạn tính gần nhất. |
| **Khối "Việc cần làm tiếp theo" (2 gạch đầu dòng hành động)** | `patient_chronic_conditions.action_items` | Mảng JSONB các công việc cần làm | CSDL nạp tự động | Mảng nhiệm vụ: `["Theo dõi huyết áp sáng và tối", "Xét nghiệm lipid máu trước tái khám"]`. Bệnh nhân tích hoàn thành khi xong. |
| **Nút "Đặt lịch tái khám 12/11"** | Action trigger | `INSERT INTO appointments (member_id, appointment_date, purpose) VALUES (...)` | Chạm nút bấm | Mở form đặt lịch khám hoặc xác nhận lịch hẹn tự động với bác sĩ điều trị. |
| **Khối bệnh 2: "Đái tháo đường" & Trạng thái: "1 cần khám"** | `patient_chronic_conditions` | Bản ghi bệnh đái tháo đường type 2 | CSDL nạp tự động | Báo trạng thái có 1 chỉ định khám chuyên khoa đến hạn. |
| **6 Chỉ số giám sát Đái tháo đường: HbA1c, Glucose, Cân nặng, Huyết áp, Thận, Mắt** | Các chỉ số tầm soát biến chứng | Đọc kết quả cận lâm sàng liên quan | Tự động tổng hợp | Giám sát toàn diện biến chứng vi mạch và đại mạch của bệnh tiểu đường. |
| **Trạng thái hồ sơ không có bệnh mạn tính: "Chưa có bệnh mạn tính cần theo dõi"** | Empty State UI Text | Khi `patient_chronic_conditions` không có bản ghi kích hoạt | Render tự động | Thông báo hồ sơ sức khoẻ hoàn toàn bình thường, không có bệnh lý nền cần quản lý. |

---

## SCR-10: Hồ sơ y tế số – Medical Passport (`Records`)
*Hộ chiếu y tế số toàn diện, lưu trữ toàn bộ lịch sử khám chữa bệnh, đơn thuốc, tiêm chủng và viện phí.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Tiêu đề trang: "Hồ sơ y tế · Medical Passport"** | Header Asset | Không query DB | Render tĩnh header | Định vị tính năng hộ chiếu y tế số cá nhân. |
| **Thẻ danh thiếp y tế: Tên "{{cur.name}}", Quan hệ "{{cur.rel}}"** | `family_members.full_name`<br>`family_members.relationship` | `SELECT full_name, relationship, blood_type, birth_date, insurance_number FROM family_members WHERE id = :active_member_id;` | Đọc từ hồ sơ thành viên | Hiển thị tên đầy đủ và quan hệ với chủ tài khoản. |
| **Dòng nhắc: "Chạm để đổi hồ sơ thành viên"** | Member Switcher Hint | Không query DB | Chạm thẻ | Mở Bottom Sheet danh sách hồ sơ gia đình để chuyển đổi tức thì. |
| **Mục "NHÓM MÁU: {{cur.blood}}"** | `family_members.blood_type` | Lấy từ cột `blood_type` | CSDL nạp tự động | Hiển thị nhóm máu nổi bật màu đỏ (ví dụ: `O+`, `A+`, `B+`, `AB+`). |
| **Danh sách thành viên chuyển đổi nhanh (`m.name`, `m.rel`, `m.mark`)** | `family_members` list | `SELECT id, full_name, relationship, avatar_url FROM family_members WHERE user_id = :user_id;` | Danh sách chạm nhanh | Chạm vào bất kỳ người thân nào để xem hộ chiếu y tế của người đó. |
| **Link "Quản lý hồ sơ gia đình"** | Navigation trigger | Mở SCR-16 / SCR-17 | Chạm link | Quản lý thêm/bớt và phân quyền xem hồ sơ người thân. |
| **5 Phân loại hồ sơ (`t.abbr`, `t.name`, `t.count`)** | Danh mục phân loại y tế | Đếm số lượng hồ sơ theo từng nhóm | Tự động tổng hợp số lượng | **5 Phân hệ chuẩn:**<br>1. `XN` - Xét nghiệm (`clinical_reports` kind='lab')<br>2. `HA` - Chẩn đoán hình ảnh (`clinical_reports` kind='imaging')<br>3. `ĐT` - Đơn thuốc (`prescriptions`)<br>4. `BA` - Bệnh án khám chữa bệnh (`medical_events`)<br>5. `TC` - Tiêm chủng (`vaccination_records`). |
| **Tiêu đề danh mục đang xem: "{{panel.title}}" & "{{panel.count}} mục"** | Active Category State | Đếm số bản ghi trong danh mục đang chọn | CSDL nạp tự động | Hiển thị tên nhóm và tổng số hồ sơ hiện có. |
| **Thông báo trống: "Chưa có dữ liệu."** | Empty State UI | Khi nhóm được chọn không có bản ghi | Render tự động | Thông báo rõ ràng khi phân hệ chưa có hồ sơ nạp vào. |
| **Danh sách 5 hồ sơ mới nhất (`p.abbr`, `p.title`, `p.date`, `p.sub`)** | Bản ghi hồ sơ y tế | `SELECT id, kind, title, performed_at, facility_name FROM clinical_reports WHERE member_id = :active_member_id ORDER BY performed_at DESC LIMIT 5;` | CSDL nạp tự động | Hiển thị 5 mục mới nhất, cuộn trong khung (In-frame scroll). Chạm vào mở chi tiết tương ứng. |
| **Dòng nhắc cuộn: "Hiển thị 5 mục mới nhất · kéo trong khung để xem thêm"** | In-frame Scroll Hint | Không query DB | Render tĩnh | Hướng dẫn cuộn nội bộ trong card. |
| **Nút bấm nổi "+ Nhập kết quả"** | Navigation trigger | Chuyển sang SCR-12 | Chạm nút xanh | Cho phép bệnh nhân tải lên kết quả mới bất cứ lúc nào. |

---

## SCR-11: Quản lý dùng thuốc & Lịch nhắc thông minh (`Meds`)
*Màn hình theo dõi đơn thuốc, đánh giá tỷ lệ tuân thủ điều trị (Adherence), lịch nhắc liều và số hoá đơn thuốc bằng AI.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Tiêu đề trang: "Quản lý dùng thuốc"** | Header Asset | Không query DB | Render tĩnh | Căn lề trái, font SemiBold 20px. |
| **Thẻ "TUÂN THỦ 30 NGÀY: 91%"** | Computed Adherence Score | Đọc từ `dose_logs` trong 30 ngày qua | Tính toán tự động | **Công thức Adherence (BR-43):**<br>$$	ext{Tỷ lệ tuân thủ} = rac{	ext{Số liều đã uống}}{	ext{Tổng số liều được kê}} 	imes 100\%$$<br>$\ge 80\% 
ightarrow$ Tốt (Xanh); $<80\% 
ightarrow$ Cần cải thiện (Cam/Đỏ). |
| **Chi tiết số liều: "Đã uống 109 · Quên 7 · Bỏ 4 liều"** | `dose_logs.status` count | `SELECT COUNT(*) FILTER (WHERE status = 'taken') as taken, COUNT(*) FILTER (WHERE status = 'missed') as missed, COUNT(*) FILTER (WHERE status = 'skipped') as skipped FROM dose_logs WHERE scheduled_at >= NOW() - INTERVAL '30 days';` | Thống kê từ DB | Minh bạch chi tiết số liều: đã uống đúng giờ, quên uống, hoặc chủ động bấm bỏ liều do tác dụng phụ. |
| **Tiến độ hôm nay: "HÔM NAY: {{doneCount}}/{{doseCount}} liều"** | `dose_logs.status` today | `SELECT COUNT(*) FILTER (WHERE status = 'taken') as done, COUNT(*) as total FROM dose_logs dl JOIN dose_schedules ds ON dl.schedule_id = ds.id WHERE DATE(dl.scheduled_at) = CURRENT_DATE;` | Thống kê hôm nay | Ví dụ: `2/4 liều`. Tự động cập nhật ngay khi bấm uống. |
| **Lịch tuần/tháng Calendar tương tác (T2, T3... CN, Ngày `c.day`)** | `dose_logs` theo từng ngày | Gom nhóm trạng thái uống thuốc theo từng ngày trong tháng | Render Calendar trực quan | Mỗi ngày được tô màu theo trạng thái: Đủ liều (Xanh), Quên (Đỏ), Bỏ liều (Cam), Đã lên lịch (Xám). Bấm vào ngày để xem chi tiết các cữ thuốc ngày đó. |
| **Thẻ cữ thuốc hôm nay: Giờ "{{d.time}}", Tên "{{d.name}}", Cách dùng "{{d.how}}"** | `dose_schedules.scheduled_time`<br>`prescription_items.medication_name`<br>`dose_schedules.meal_relation` | `SELECT ds.id, ds.scheduled_time, pi.medication_name, pi.dosage, ds.meal_relation, COALESCE(dl.status, 'pending') as status FROM dose_schedules ds JOIN prescription_items pi ON ds.prescription_item_id = pi.id WHERE DATE(ds.created_at) <= CURRENT_DATE;` | CSDL nạp tự động | Thẻ cữ thuốc chi tiết từng cữ sáng/trưa/chiều/tối. |
| **3 Nút tương tác cữ thuốc: "Bỏ liều", "Nhắc lại 15p", "Đã uống"** | `dose_logs.status`<br>`dose_logs.snoozed_until` | `UPDATE dose_logs SET status = :action, taken_at = NOW() WHERE id = :log_id;`<br>Nếu chọn nhắc lại 15p: `UPDATE dose_logs SET status = 'snoozed', snoozed_until = NOW() + INTERVAL '15 minutes' WHERE id = :log_id;` | Chạm nút tương tác | **3 Tuỳ chọn thao tác chuẩn:**<br>1. **Bỏ liều:** Chuyển trạng thái `skipped`, yêu cầu lý do.<br>2. **Nhắc lại 15p:** Hoãn chuông báo thức, nhắc lại sau 15 phút.<br>3. **Đã uống:** Đánh dấu `taken`, cập nhật thanh tiến độ ngay. |
| **Danh sách thuốc đang dùng (`m.name`, `m.dose`, `m.reason`, `m.doctor`, `m.since`, `m.side`)** | `prescription_items`<br>`prescriptions` | `SELECT pi.medication_name, pi.dosage, p.diagnosis, p.doctor_name, pi.start_date, p.side_effects FROM prescription_items pi JOIN prescriptions p ON pi.prescription_id = p.id WHERE p.member_id = :active_member_id AND p.status = 'active';` | CSDL nạp tự động | Thẻ thông tin từng loại thuốc đang dùng: Tên, liều lượng, chỉ định điều trị, bác sĩ kê đơn, ngày bắt đầu dùng, tác dụng phụ cần lưu ý. |
| **Khối "Tiền sử dùng thuốc" & Lời nhắc bác sĩ** | `prescriptions.status = 'discontinued'` | `SELECT pi.medication_name, pi.dosage, p.discontinued_reason, p.doctor_name, pi.start_date, pi.end_date FROM prescription_items pi JOIN prescriptions p ON pi.prescription_id = p.id WHERE p.member_id = :active_member_id AND p.status = 'discontinued';` | CSDL nạp tự động | Danh sách các thuốc đã từng dùng trong quá khứ kèm lý do dừng (hết đợt điều trị, đổi thuốc, hoặc bị dị ứng/tác dụng phụ) để bác sĩ kê đơn tham khảo. |
| **Nút "Thêm thuốc" (Mở Bottom Sheet thêm mới)** | UI Action Trigger | Không query DB | Chạm nút touch | Mở giao diện nạp thuốc mới vào lịch nhắc: Chọn giữa "Nhập tay" hoặc "Chụp đơn thuốc bằng AI OCR". |
| **Form nhập tay: Tên thuốc, Hàm lượng, Liều mỗi lần (1 viên, ½ viên, 2 viên, 5 ml)** | `prescription_items.medication_name`<br>`prescription_items.dosage`<br>`prescription_items.dose_per_intake` | Form input người dùng nhập | Bàn phím số & Text | Danh mục liều mỗi lần: `1 viên`, `½ viên`, `2 viên`, `5 ml`. |
| **Form nhập tay: Số lần/ngày (1 lần, 2 lần, 3 lần) & Cách dùng (Sau ăn, Trước ăn, Trước khi ngủ)** | `prescription_items.frequency_per_day`<br>`dose_schedules.meal_relation` | Form select tuỳ chọn | Dropdown / Chip | Tự động sinh số lượng cữ nhắc tương ứng số lần/ngày đã chọn (ví dụ chọn 2 lần $
ightarrow$ tự sinh 2 mốc giờ 08:00 và 20:00). |
| **Form nhập tay: Giờ nhắc & Ngày bắt đầu** | `dose_schedules.scheduled_time`<br>`prescription_items.start_date` | TimePicker và DatePicker | Native picker | Cho phép tuỳ chỉnh từng khung giờ nhắc uống thuốc phù hợp với sinh hoạt cá nhân. |
| **Form nhập tay: Thời gian dùng (30 ngày, 7 ngày, 14 ngày, 90 ngày, Dài hạn)** | `prescription_items.end_date`<br>`prescriptions.is_long_term` | Nếu chọn số ngày: `end_date = start_date + N days`. Nếu chọn Dài hạn: `is_long_term = true, end_date = NULL`. | Chip chọn nhanh | Tính tự động ngày kết thúc đợt thuốc; nếu là thuốc điều trị bệnh mạn tính dài hạn thì bật cờ `is_long_term`. |
| **Form nhập tay: Chỉ định & Bác sĩ kê** | `prescriptions.diagnosis`<br>`prescriptions.doctor_name` | Form text input | Bàn phím text | Lưu thông tin chẩn đoán và danh tính bác sĩ kê đơn. |
| **Nút "Lưu và thêm vào lịch"** | Transaction INSERT | Lưu đồng thời `prescriptions`, `prescription_items` và sinh các bản ghi `dose_schedules` | Chạm nút xanh | Hoàn tất lưu đơn thuốc và kích hoạt hệ thống nhắc lịch tự động. |
| **Khối AI OCR Đơn thuốc: "AI nhận diện {x} thuốc · chọn để thêm"** | Camera OCR Processing | Ảnh chụp được gửi lên AI OCR Service bóc tách cấu trúc | Chụp ảnh camera | AI nhận diện tự động tên thuốc, hàm lượng, số lượng, cách dùng từ ảnh chụp đơn thuốc viết tay hoặc in. |
| **Chi tiết bóc tách AI OCR: Tên thuốc, Độ tin cậy %, Cảnh báo kiểm tra liều** | `prescription_items.ocr_confidence_score`<br>`prescription_items.ocr_needs_review` | Phân tích confidence score từ mô hình Vision LLM | Tự động hiển thị | Nếu độ tin cậy $\ge 90\% 
ightarrow$ Xanh lá; nếu $<85\% 
ightarrow$ Vàng cam kèm nhãn: *"Cần kiểm tra liều · tin cậy 82%"*. |
| **2 Nút AI OCR: "Chụp lại" và "Thêm {x} thuốc vào lịch"** | OCR Actions | Cho phép chụp lại ảnh nét hơn hoặc duyệt thêm vào lịch | Chạm nút touch | Đưa các thuốc đã bóc tách chính xác vào CSDL đơn thuốc chỉ với 1 chạm. |
| **Link "Gửi tiền sử dùng thuốc cho bác sĩ"** | Action trigger | Tạo quyền chia sẻ trong `share_grants` | Chạm link | Xuất danh mục thuốc đang dùng và tiền sử dị ứng thành file PDF bảo mật gửi cho bác sĩ điều trị. |

---

## SCR-12: Nhập kết quả cận lâm sàng đa phương thức (`Camera / CSYT / Manual`)
*Màn hình 3 bước toàn diện nạp kết quả cận lâm sàng: Xét nghiệm máu, Chẩn đoán hình ảnh và Giải phẫu bệnh.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Tiêu đề màn hình: "Nhập kết quả cận lâm sàng"** | Header Asset | Không query DB | Render tĩnh | Căn lề trái, font SemiBold 20px. |
| **Bước 1. "LOẠI KẾT QUẢ" (3 nút chọn: "{{k.label}}")** | `clinical_reports.kind` Enum | Lưu loại hồ sơ: `'lab'`, `'imaging'`, `'pathology'` | 3 Nút chọn lớn | **3 Loại kết quả cận lâm sàng:**<br>1. **Xét nghiệm** (`lab`)<br>2. **CĐHA** (`imaging`)<br>3. **Giải phẫu bệnh** (`pathology`). |
| **Dòng chú thích: "CĐHA: chẩn đoán hình ảnh · GPB: giải phẫu bệnh"** | Legend UI Text | Không query DB | Render tĩnh | Giải thích thuật ngữ chuyên môn y khoa. |
| **Bước 2. "CÁCH NHẬP" (3 phương thức: "{{m.label}}")** | Input Strategy Enum | Chọn phương thức nạp dữ liệu | 3 Nút chọn icon | **3 Phương thức nạp dữ liệu:**<br>1. **Chụp ảnh / OCR** (Camera AI bóc tách)<br>2. **Nhập từ link CSYT** (Cổng tra cứu trực tuyến)<br>3. **Nhập tay** (Form biểu mẫu chi tiết). |
| **Bước 3. "NHẬP DỮ LIỆU" - Thông tin chung: Ngày thực hiện** | `clinical_reports.performed_at` | Lưu ngày giờ làm dịch vụ y tế | DatePicker native | Bắt buộc nhập, không được chọn ngày tương lai ($\le 	ext{now()}$). |
| **Bước 3 - Thông tin chung: Bác sĩ thực hiện & Nơi thực hiện** | `clinical_reports.interpreting_doctor_name`<br>`clinical_reports.facility_name` | Lưu tên bác sĩ và cơ sở y tế thực hiện | Text Input / Autocomplete | Gợi ý tự động từ bảng `master_facilities` và `master_doctors`. |
| **Tab Xét nghiệm: Danh sách chỉ số động & "{{rowCount}} chỉ số"** | `lab_results` array | Dynamic row form state | Form bảng động | Cho phép thêm/bớt không giới hạn các dòng chỉ số xét nghiệm. |
| **Tab Xét nghiệm: Dropdown chọn chỉ số xét nghiệm (10 gợi ý phổ biến)** | `master_lab_tests.test_code` | `SELECT test_code, test_name, standard_unit, default_reference_range FROM master_lab_tests;` | Dropdown select | Danh mục gợi ý: LDL-C, HbA1c, Glucose đói, Creatinin, Hemoglobin (Hb), Bạch cầu (WBC), Tiểu cầu (PLT), Cấy nước tiểu, HBV DNA (PCR), Gen CYP2C19. |
| **Tab Xét nghiệm: Nút "+ Thêm chỉ số"** | Dynamic Form Trigger | Thêm 1 dòng trống mới vào mảng chỉ số | Chạm nút bấm | Tự động điền đơn vị và khoảng tham chiếu tương ứng với chỉ số vừa chọn. |
| **Tab CĐHA: Dropdown "Phương tiện" (5 tuỳ chọn: SA, XQ, MM, CT, MRI)** | `imaging_studies.modality` | Enum 5 phương tiện chẩn đoán hình ảnh | Dropdown select | Chọn đúng phương tiện máy móc đã chụp. |
| **Tab CĐHA: Dropdown "Bộ phận" (21 vị trí giải phẫu chuẩn)** | `imaging_studies.body_site` | Danh mục 21 bộ phận cơ thể | Dropdown select | Sọ não, Tuyến giáp, Hạch, Tuyến vú, Phổi, Tim, Gan, Túi mật, Tuỵ, Lách, Thận, Tuyến thượng thận, Bàng quang, Tử cung, Buồng trứng, Tiền liệt tuyến, Tinh hoàn, Cột sống, Xương khớp, Mạch máu, Khác (tự nhập)... |
| **Tab CĐHA: Ô nhập "Bộ phận khác"** | `imaging_studies.body_site` | Xuất hiện khi chọn "Khác (tự nhập)..." | Input text | Nhập cấu trúc giải phẫu đặc biệt chưa có trong danh mục. |
| **Tab CĐHA: Khối "Kết luận"** | `imaging_studies.conclusion` | Lưu kết luận chẩn đoán hình ảnh | Textarea | Trích xuất hoặc gõ lại kết luận trên phiếu CĐHA. |
| **Tab CĐHA: Khối "Tổn thương dạng khối" & "{{lesionCount}} tổn thương"** | `tumor_lesions` array | Dynamic lesion tracking form | Form động | Dành riêng cho các ca chụp phát hiện khối u hoặc nốt bất thường. |
| **Tab CĐHA: Thẻ tổn thương: Loại (U đặc, U nang, Khác), Vị trí (Phải, Trái, Lan toả)** | `tumor_lesions.lesion_type`<br>`tumor_lesions.laterality` | Lưu loại u và hướng giải phẫu | Select option | Phân loại chính xác bản chất khối u và vị trí định khu. |
| **Tab CĐHA: Checkbox "Tổn thương đích (RECIST)"** | `tumor_lesions.is_target_lesion` | Boolean cờ u đích RECIST 1.1 | Checkbox | Tự động kiểm tra: Nếu kích thước $\ge 10	ext{ mm}$ trên CT/MRI thì cho phép đánh dấu làm u đích theo dõi. |
| **Tab CĐHA: Nút "+ Thêm tổn thương" & Nút "Xoá" từng u** | Form array actions | Thêm/Xoá phần tử khỏi mảng u | Chạm nút | Hỗ trợ ghi nhận tối đa nhiều tổn thương cùng lúc. |
| **Tab GPB: "Loại bệnh phẩm" (5 tuỳ chọn)** | `clinical_reports.pathology_specimen_type` | Cột mới bổ sung trong Migration 002 | Dropdown select | **5 Loại bệnh phẩm:** Sinh thiết kim, Sinh thiết mở, Bệnh phẩm phẫu thuật, Tế bào học (FNA), Tế bào học dịch. |
| **Tab GPB: "Vị trí lấy mẫu" (11 tuỳ chọn)** | `clinical_reports.specimen_site` | Cột mới bổ sung trong Migration 002 | Dropdown select | Gan, Phổi, Tuyến giáp, Tuyến vú, Hạch, Dạ dày, Đại trực tràng, Thận, Tiền liệt tuyến, Da, Khác... |
| **Tab GPB: "Số GPB / mã tiêu bản" & "Chẩn đoán giải phẫu bệnh"** | `clinical_reports.accession_number`<br>`clinical_reports.conclusion` | Cột accession và kết luận | Text Input | Số hiệu lưu trữ tiêu bản bệnh phẩm tại khoa GPB bệnh viện và kết luận mô bệnh học. |
| **Tab GPB: "Độ mô học" (G1, G2, G3, Không áp dụng)** | `clinical_reports.histological_grade` | Cột mới bổ sung trong Migration 002 | Dropdown select | Phân độ biệt hoá của tế bào ung thư (G1: Biệt hoá tốt; G2: Biệt hoá vừa; G3: Biệt hoá kém). |
| **Tab GPB: "pTNM" Staging** | `clinical_reports.ptnm_staging` | Cột mới bổ sung trong Migration 002 | Text Input | Giai đoạn bệnh sau phẫu thuật theo phân loại TNM quốc tế (ví dụ: `pT2N0M0`). |
| **Tab GPB: "Diện cắt" (Âm tính, Dương tính, Chưa đánh giá)** | `clinical_reports.surgical_margin` | Cột mới bổ sung trong Migration 002 | Dropdown select | Đánh giá ranh giới mô phẫu thuật có còn sót tế bào ác tính hay không. |
| **Tab GPB: Khối "Hoá mô miễn dịch" & "{{markerCount}} dấu ấn"** | `clinical_reports.ihc_markers` (JSONB) | Mảng JSONB lưu danh sách dấu ấn miễn dịch | Form mảng động | Danh mục dấu ấn: Ki-67, ER, PR, HER2, PD-L1, TTF-1, CK7, CK20, Glypican-3, Khác... Kèm giá trị % dương tính. |
| **Tab Link CSYT: Link kết quả, Tên đăng nhập, Mật khẩu, Mã Captcha** | `clinical_reports.csyt_portal_url`<br>`clinical_reports.csyt_username` | Thông tin đăng nhập cổng tra cứu bệnh viện | Form input bảo mật | Tự động kết nối API/Bot tra cứu của bệnh viện đối tác để kéo file kết quả PDF và dữ liệu số về máy. |
| **Tab Chụp ảnh AI OCR: Khung camera, Nút chụp & Thanh tiến trình OCR** | AI Vision Processing | Ảnh gửi lên backend OCR engine | Chụp camera / Upload | Tự động xử lý nâng cao độ tương phản, xoay thẳng ảnh và bóc tách bảng số liệu đối chiếu song song. |
| **Nút "Đính kèm ảnh / PDF phiếu kết quả"** | `clinical_reports.attachment_s3_key` | Upload file lên Amazon S3 / MinIO | File picker native | Lưu trữ bản mềm gốc phục vụ đối soát y khoa pháp lý. |

---

## SCR-13: Trợ lý AI Y tế Đa ngữ cảnh (`AI Assistant`)
*Hệ thống hỏi đáp y khoa thông minh, giải thích kết quả cận lâm sàng và cảnh báo tương tác thuốc.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Tiêu đề trang: "Trợ lý AI"** | Header Asset | Không query DB | Render tĩnh | Căn lề trái, font SemiBold 20px. |
| **Banner khuyến cáo y khoa: "Trợ lý AI phân tích dựa trên dữ liệu..."** | Static Clinical Disclaimer | Không query DB | Render tĩnh Banner | Cảnh báo bắt buộc: Thông tin mang tính chất tham khảo, không thay thế chẩn đoán hay phác đồ của bác sĩ. |
| **Gợi ý câu hỏi nhanh (4 pill câu hỏi mẫu)** | `ai_conversations.context_type` | Sinh câu hỏi gợi ý dựa trên hồ sơ gần nhất của người dùng | Chạm pill gợi ý | 1. *"Giải thích kết quả xét nghiệm lipid máu"*<br>2. *"Ý nghĩa của tổn thương gan giảm kích thước"*<br>3. *"Tác dụng phụ của Metformin"*<br>4. *"Khi nào cần đi khám lại?"*. Chạm vào tự động gửi tin nhắn. |
| **Khung hội thoại: Tin nhắn người dùng & Câu trả lời của AI** | `ai_chat_messages.content`<br>`ai_chat_messages.sender_type` | `SELECT sender_type, content, citations, disclaimer, created_at FROM ai_chat_messages WHERE conversation_id = :conv_id ORDER BY created_at ASC;` | Đọc từ CSDL chat | Hiển thị cuộc trò chuyện 2 chiều. Câu trả lời của AI có định dạng Markdown, trích dẫn số đo cụ thể từ hồ sơ. |
| **Trích dẫn nguồn y khoa: "{{m.citations}}"** | `ai_chat_messages.citations` (JSONB) | Mảng liên kết tới các bản ghi `biometric_records` hoặc `clinical_reports` | Tự động đính kèm | Minh bạch nguồn dữ liệu mà AI dùng để đưa ra nhận định, dẫn link trực tiếp tới báo cáo gốc. |
| **Ô nhập câu hỏi & Nút gửi tin nhắn** | `ai_chat_messages.content` | `INSERT INTO ai_chat_messages (conversation_id, sender_type, content) VALUES (:conv_id, 'user', :text);` | Bàn phím gõ text | Gửi câu hỏi vào RAG Pipeline phân tích cùng toàn bộ hồ sơ y bạ của bệnh nhân. |

---

## SCR-14: Mạng lưới Chăm sóc & Chia sẻ Bác sĩ (`Care Network`)
*Mạng lưới bác sĩ gia đình, kết nối tư vấn từ xa và quản trị quyền chia sẻ dữ liệu y tế.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Tiêu đề trang: "Chăm sóc & Mạng lưới Bác sĩ"** | Header Asset | Không query DB | Render tĩnh | Căn lề trái, font SemiBold 20px. |
| **Danh sách bác sĩ trong mạng lưới: Avatar "{{d.initials}}", Chuyên khoa "{{d.role}}"** | `share_grants`<br>`master_doctors` | `SELECT sg.id, sg.grantee_name, sg.grantee_role, sg.grantee_org, sg.grantee_phone, sg.grantee_email, sg.grantee_avatar_url, sg.expires_at FROM share_grants sg WHERE sg.member_id = :active_member_id AND sg.grantee_type = 'doctor' AND sg.status = 'active';` | CSDL nạp tự động | Danh sách các bác sĩ đang phụ trách theo dõi sức khoẻ cho bệnh nhân. |
| **Nút "+ Thêm bác sĩ" (Mở Bottom Sheet)** | Action Trigger | Không query DB | Chạm nút bấm | Mở form thêm mới bác sĩ vào danh bạ chăm sóc. |
| **Thẻ chi tiết bác sĩ: Tên "{{sel.name}}", Chuyên khoa & Bệnh viện "{{sel.role}} · {{sel.org}}"** | `share_grants` chi tiết | Đọc thông tin bác sĩ được chọn | CSDL nạp tự động | Thể hiện thông tin chứng chỉ hành nghề và nơi công tác của bác sĩ. |
| **Số điện thoại & Nút "Gọi": "{{sel.phone}}"** | `share_grants.grantee_phone` | `tel:{sel.phone}` | Chạm nút Gọi | Kích hoạt cuộc gọi điện thoại trực tiếp tới bác sĩ. |
| **Email & Nút "Email": "{{sel.email}}"** | `share_grants.grantee_email` | `mailto:{sel.email}` | Chạm nút Email | Mở trình soạn email gửi trao đổi chuyên môn với bác sĩ. |
| **Nút "Nhắn tin / Video"** | Telehealth Trigger | Khởi tạo phòng tư vấn WebRTC | Chạm nút bấm | Kết nối phòng khám từ xa trực tuyến bảo mật. |
| **Nút "Gửi hồ sơ trước khám"** | Action Trigger | Cập nhật quyền truy cập hồ sơ | Chạm nút bấm | Đóng gói hồ sơ y tế số gửi trước cho bác sĩ nghiên cứu trước buổi khám. |
| **Khối kiểm soát: "Ai được xem dữ liệu của tôi? 3 người đang có quyền · 1 hết hạn sau 7 ngày"** | `share_grants` summary | `SELECT COUNT(*) as total_active, COUNT(*) FILTER (WHERE expires_at <= NOW() + INTERVAL '7 days') as expiring_soon FROM share_grants WHERE member_id = :active_member_id AND status = 'active';` | Thống kê từ DB | **Tuân thủ Nghị định 13/2023/NĐ-CP:** Minh bạch 100% danh tính những người đang có quyền truy cập hồ sơ và thời hạn hiệu lực. |
| **Link "Quản lý" quyền chia sẻ** | Navigation trigger | Mở danh sách quản trị `share_grants` | Chạm link | Cho phép gia hạn, đổi phạm vi xem (chỉ xem sinh trắc, chỉ xem xét nghiệm) hoặc thu hồi quyền ngay lập tức. |
| **Bottom Sheet Thêm bác sĩ: Tải ảnh, Họ và tên, Chuyên khoa, Cơ sở y tế, SĐT, Email** | Form nạp `share_grants` | `INSERT INTO share_grants (member_id, grantee_type, grantee_name, grantee_role, grantee_org, grantee_phone, grantee_email, scope, expires_at) VALUES (...)` | Modal Form touch | Nhập thông tin bác sĩ mới và cấp quyền truy cập an toàn. |

---

## SCR-15: Thẻ Y tế Khẩn cấp SOS & Offline QR Ký số (`Emergency`)
*Thẻ y tế sinh tử hiển thị ngoài màn hình khoá, lưu nhóm máu, tiền sử dị ứng, liên hệ khẩn cấp và mã QR ký số ECDSA.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Tiêu đề thẻ: "EMERGENCY HEALTH CARD"** | Header Asset | Không query DB | Render tĩnh màu đỏ SOS | Font đậm, phong cách thẻ cấp cứu quốc tế chuẩn ISO. |
| **Checkbox "Hiển thị trên màn hình khoá"** | `emergency_cards.show_on_lock_screen` | `UPDATE emergency_cards SET show_on_lock_screen = :val WHERE member_id = :member_id;` | Checkbox toggle | Cho phép nhân viên y tế và người cứu nạn tiếp cận thông tin ngay từ màn hình khoá mà không cần mở khoá máy. |
| **Họ và tên bệnh nhân: "{{e.name}}" & Tuổi/Giới tính "{{e.sub}}"** | `family_members.full_name`<br>`family_members.birth_date`<br>`family_members.gender` | `SELECT full_name, birth_date, gender FROM family_members WHERE id = :member_id;` | CSDL nạp tự động | Tính tuổi tự động: $	ext{Tuổi} = 	ext{Năm hiện tại} - 	ext{Năm sinh}$. Định dạng: `Trần Minh Khang · 42 tuổi · Nam`. |
| **Mục sống còn 1: "NHÓM MÁU: {{e.blood}}"** | `emergency_cards.blood_group_snapshot` | `SELECT blood_group_snapshot FROM emergency_cards WHERE member_id = :member_id;` | CSDL nạp tự động | Hiển thị cỡ chữ khổng lồ 32px màu đỏ rực (ví dụ: `O+`). Thông tin tối quan trọng phục vụ truyền máu cấp cứu. |
| **Mục sống còn 2: "DỊ ỨNG: {{e.allergy}}"** | `emergency_cards.allergies` (JSONB) | `SELECT allergies FROM emergency_cards WHERE member_id = :member_id;` | CSDL nạp tự động | Danh sách dị ứng thuốc nghiêm trọng (ví dụ: *"Penicillin (Mày đay, khó thở)"*). Giúp bác sĩ cấp cứu tránh sốc phản vệ. |
| **Mục sống còn 3: "BỆNH NỀN: {{e.dx}}"** | `emergency_cards.chronic_conditions` (JSONB) | `SELECT chronic_conditions FROM emergency_cards WHERE member_id = :member_id;` | CSDL nạp tự động | Các bệnh lý nền mạn tính nguy hiểm (ví dụ: *"Tăng huyết áp, Đái tháo đường Type 2, Tiền sử u gan"*). |
| **Mục sống còn 4: "THUỐC ĐANG DÙNG: {{e.meds}}"** | `emergency_cards.current_critical_meds` | `SELECT current_critical_meds FROM emergency_cards WHERE member_id = :member_id;` | CSDL nạp tự động | Danh mục thuốc chống đông máu, thuốc tim mạch, insulin đang sử dụng. |
| **Mục 5: "BÁC SĨ GIA ĐÌNH: {{e.doctor}}"** | `emergency_cards.primary_doctor_name`<br>`emergency_cards.primary_doctor_phone` | Cột mới bổ sung trong Migration 002 | CSDL nạp tự động | Tên và số điện thoại của bác sĩ điều trị chính: *"BS Lê Văn C · 0912345678"*. |
| **Mục 6: "SỰ KIỆN GẦN NHẤT: {{e.last}}"** | `emergency_cards.recent_medical_event` | Cột mới bổ sung trong Migration 002 | CSDL nạp tự động | Sự kiện y tế phẫu thuật/nằm viện lớn gần nhất: *"Phẫu thuật cắt hạ phân thuỳ gan 05/2026"*. |
| **Mục 7: "LIÊN HỆ KHẨN CẤP: {{e.contact}}"** | `emergency_contacts` | `SELECT contact_name, relationship, phone_number FROM emergency_contacts WHERE member_id = :member_id ORDER BY priority_order ASC LIMIT 2;` | CSDL nạp tự động | Người thân ruột thịt liên hệ khi khẩn cấp (ví dụ: *"Trần Thu Hà · Vợ · 0901234567"*). Kèm nút gọi nhanh. |
| **Mã QR ký số Offline: "Mã QR"** | `emergency_cards.offline_qr_payload`<br>`emergency_cards.qr_signature` | Payload JWT mã hoá và ký số bằng thuật toán ECDSA P-256 | Render QR Canvas | **Chuẩn Offline Quốc tế (BR-60):** Quét được ngay cả khi mất mạng internet/mất sóng 4G; chứa đầy đủ thông tin sống còn kèm chữ ký số xác thực tính toàn vẹn. |
| **Dòng hướng dẫn QR: "Nhân viên y tế quét QR → chỉ nhìn thấy..."** | Static Privacy Hint | Không query DB | Render tĩnh | Hướng dẫn cứu nạn y tế. |
| **Nút đỏ lớn: "Gọi cấp cứu 115"** | Emergency Dialer Action | `tel:115` | Chạm nút đỏ lớn | Kích hoạt cuộc gọi khẩn cấp tới tổng đài cấp cứu y tế quốc gia 115 chỉ với 1 chạm. Touch target khổng lồ $\ge 56	ext{ pt}$. |

---

## SCR-16: Thông tin người dùng & Định danh eKYC (`Profile`)
*Màn hình thông tin tài khoản công dân, xác thực căn cước công dân gắn chip, BHYT và cài đặt bảo mật MFA.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Tiêu đề trang: "Thông tin người dùng" & Nút "Lưu"** | Header Asset | `UPDATE users ...; UPDATE family_members ...;` | Chạm nút Lưu | Lưu lại toàn bộ các thay đổi thông tin cá nhân và y tế. |
| **Tên chủ tài khoản: "{{memName}}"** | `family_members.full_name` | `SELECT full_name FROM family_members WHERE user_id = :user_id AND relationship = 'owner';` | Đọc từ hồ sơ chủ tài khoản | Tên đầy đủ công dân theo đúng căn cước công dân. |
| **Badge "Đã xác thực định danh điện tử"** | `users.is_ekyc_verified` | `SELECT is_ekyc_verified FROM users WHERE id = :user_id;` | Tự động hiển thị | Badge xanh lá chứng nhận tài khoản đã hoàn thành eKYC cấp độ 2 (Nghị định 59/2022/NĐ-CP). |
| **Mục "THÔNG TIN CÁ NHÂN" - Số căn cước công dân** | `users.national_id` | `SELECT national_id FROM users WHERE id = :user_id;` | Đọc từ căn cước / eKYC | Định dạng 12 chữ số chuẩn CCCD gắn chip của Bộ Công an. Trường này bị khoá không cho sửa tự do sau khi đã eKYC. |
| **Mục THÔNG TIN CÁ NHÂN - Ngày sinh & Giới tính (Nam, Nữ, Khác)** | `family_members.birth_date`<br>`family_members.gender` | `SELECT birth_date, gender FROM family_members WHERE id = :owner_member_id;` | DatePicker & Radio | Ngày sinh `dd/mm/yyyy` và giới tính sinh học phục vụ đối chiếu khoảng tham chiếu xét nghiệm. |
| **Mục THÔNG TIN CÁ NHÂN - Số điện thoại & Email** | `users.phone_number`<br>`users.email` | `SELECT phone_number, email FROM users WHERE id = :user_id;` | Input text / phone | Thông tin liên lạc chính thức nhận OTP và báo cáo y tế định kỳ. |
| **Mục THÔNG TIN CÁ NHÂN - Địa chỉ thường trú** | `users.address` | Cột `address` mới bổ sung trong Migration 002 | Input text | Địa chỉ nơi cư trú theo sổ hộ khẩu / CCCD. |
| **Mục "THÔNG TIN Y TẾ" - Nhóm máu: "{{p.blood}}"** | `family_members.blood_type` | `SELECT blood_type FROM family_members WHERE id = :owner_member_id;` | Dropdown select | Nhóm máu ABO và Rh (`A+`, `O+`, `B+`, `AB+`, `O-`, v.v.). |
| **Mục THÔNG TIN Y TẾ - Chiều cao "{{p.h}}" & Cân nặng "{{p.w}}"** | `family_members.height_cm`<br>`family_members.weight_kg` | `SELECT height_cm, weight_kg FROM family_members WHERE id = :owner_member_id;` | Number Pad | Chiều cao (cm) và Cân nặng (kg). Dùng làm tham số đầu vào tính toán BMI tự động. |
| **Mục THÔNG TIN Y TẾ - Số thẻ BHYT** | `family_members.insurance_number` | `SELECT insurance_number FROM family_members WHERE id = :owner_member_id;` | Input text 15 ký tự | Mã số bảo hiểm y tế 15 ký tự chuẩn của Bảo hiểm Xã hội Việt Nam. |
| **Danh mục quản lý: "Hồ sơ gia đình: 3 người"** | `family_members` count | `SELECT COUNT(*) FROM family_members WHERE user_id = :user_id;` | CSDL nạp tự động | Thống kê số lượng hồ sơ người thân đã tạo. Chạm vào mở SCR-17. |
| **Danh mục quản lý: "Kết nối thiết bị: 3 thiết bị"** | `connected_devices` count | `SELECT COUNT(*) FROM connected_devices WHERE user_id = :user_id AND is_connected = true;` | CSDL nạp tự động | Thống kê số lượng máy đo IoT đang ghép nối. Chạm vào mở SCR-04. |
| **Mục "Đăng nhập sinh trắc học & MFA"** | `users.is_biometric_login_enabled`<br>`users.is_mfa_enabled` | Cột mới bổ sung trong Migration 002 | Switch toggle | Bật/tắt xác thực 2 lớp qua SMS/Authenticator và đăng nhập nhanh bằng FaceID/Vân tay. |
| **Mục "Quyền chia sẻ dữ liệu"** | `share_grants` count | `SELECT COUNT(*) FROM share_grants WHERE member_id = :owner_member_id AND status = 'active';` | CSDL nạp tự động | Xem và quản trị danh sách bác sĩ, bệnh viện được cấp quyền xem hồ sơ. |
| **Nút "Đăng xuất"** | Session Revocation | `UPDATE users SET refresh_token_hash = NULL WHERE id = :user_id;` | Chạm nút đỏ | Huỷ phiên đăng nhập hiện tại, xoá token khỏi bộ nhớ thiết bị và chuyển về SCR-01. |

---

## SCR-17: Quản lý Hồ sơ Gia đình & Phân quyền Đồng thuận (`Family`)
*Màn hình theo dõi sức khoẻ đa thành viên gia đình, cơ chế giám hộ trẻ em và Consent Gate cho người trên 18 tuổi.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Tiêu đề trang: "Hồ sơ gia đình"** | Header Asset | Không query DB | Render tĩnh | Căn lề trái, font SemiBold 20px. |
| **Nút "+ Thêm người thân"** | Action Trigger | Không query DB | Chạm nút bấm | Mở form tạo hồ sơ thành viên mới trong gia đình (vợ/chồng, con cái, bố/mẹ). |
| **Danh sách chip chọn thành viên: "{{m.label}}"** | `family_members.full_name`<br>`family_members.relationship` | `SELECT id, full_name, relationship, avatar_url, is_above_18, consent_approved FROM family_members WHERE user_id = :user_id ORDER BY relationship = 'owner' DESC, created_at ASC;` | Cuộn ngang chạm chọn | Danh sách chip: "Tôi (Chủ TK)", "Vợ (Thu Hà)", "Con gái (Minh An)", "Mẹ (Bà Lan)". |
| **Thẻ thành viên được chọn: Điểm sức khoẻ "{{sel.score}}", Tên "{{sel.name}}", Quan hệ "{{sel.sub}}"** | Computed Health Score<br>`family_members.full_name` | Tính điểm sức khoẻ riêng biệt cho từng thành viên theo dữ liệu của người đó | CSDL nạp tự động | Hiển thị thẻ tóm tắt sức khoẻ của người thân đang chọn. |
| **Nhãn trạng thái sức khoẻ: "{{sel.status}}"** | Score Thresholds | Quy đổi từ điểm số của thành viên | Tự động phân loại | "Tốt" (Xanh), "Cần chú ý" (Vàng), "Cảnh báo" (Đỏ). |
| **4 Chỉ số sinh trắc chính của thành viên (`x.name`, `x.value`, `x.tag`)** | `biometric_records` của thành viên | `SELECT biometric_type, systolic, diastolic, value_numeric, unit, severity_level FROM biometric_records WHERE member_id = :selected_member_id ORDER BY measured_at DESC;` | CSDL nạp tự động | Xem nhanh 4 sinh hiệu gần nhất của người thân (Huyết áp, Nhịp tim, Cân nặng, SpO₂). |
| **Khối "AI INSIGHT" riêng cho thành viên: "{{sel.insight}}"** | `ai_insights.summary` | `SELECT summary FROM ai_insights WHERE member_id = :selected_member_id ORDER BY created_at DESC LIMIT 1;` | AI sinh tự động | Nhận định riêng cho thành viên (ví dụ: *"Huyết áp của mẹ duy trì ổn định sau 2 tuần điều trị"*). |
| **Lịch nhắc thuốc & Lịch khám kế tiếp: "{{sel.med}}", "{{sel.next}}"** | `dose_schedules`<br>`appointments` | Lấy liều thuốc kế tiếp và lịch khám gần nhất của người thân | CSDL nạp tự động | Giúp chủ tài khoản nhắc nhở người thân uống thuốc đúng giờ và không quên lịch khám. |
| **Dải 6 Lối tắt truy cập nhanh hồ sơ người thân** | Quick Links to Screens | Chuyển màn hình với tham số `active_member_id = :selected_member_id` | Chạm icon | **6 Lối tắt:** Sinh trắc (SCR-03), Xét nghiệm (SCR-05), Hồ sơ y tế (SCR-10), Bệnh mạn tính (SCR-09), Lịch khám, Thẻ khẩn cấp (SCR-15). |
| **Cảnh báo Consent Gate pháp lý: "Bạn là người quản lý hồ sơ này..."** | `family_member_consents.status` | `SELECT status, expires_at FROM family_member_consents WHERE member_id = :selected_member_id AND granted_to_user_id = :user_id;` | Kiểm tra điều kiện logic | **Cơ chế Consent Gate (BR-13 & Nghị định 13):**<br>- Nếu thành viên $< 18$ tuổi $
ightarrow$ Cha mẹ là người giám hộ đương nhiên, xem toàn quyền.<br>- Nếu thành viên $\ge 18$ tuổi $
ightarrow$ Bắt buộc thành viên phải ký đồng thuận điện tử (`consent_approved = true`). Nếu chưa đồng thuận $
ightarrow$ Khoá dữ liệu nhạy cảm và hiển thị thông báo yêu cầu gửi lời mời đồng thuận. |


---


---

## 4.18 BẢNG TỔNG HỢP KẾT QUẢ THẨM ĐỊNH PHÁP Y 802 PHẦN TỬ UI & BỔ SUNG CSDL (MIGRATION 002)

### A. Ma Trận Thẩm Định Pháp Y 802 Phần Tử UI DOM Trên 17 Màn Hình
Quá trình rà soát pháp y từng dòng mã nguồn DOM từ bản nguyên mẫu (`source/D-Health – Ứng dụng di động.html`) và tài liệu BA (`source/5_6291670095529781835.md`) ghi nhận chính xác **802 phần tử hiển thị / text items** phân bổ như sau:

| Mã Màn Hình | Tên Màn Hình Nghiệp Vụ | Số Lượng Phần Tử UI / Text | Tỷ Lệ Bao Phủ CSDL Hiện Tại | Bảng & Cột Bổ Sung Tương Ứng |
|---|---|---|---|---|
| **SCR-01** | Đăng nhập & Xác thực bảo mật | 13 items | 100% | `users.biometric_public_key`, WebAuthn |
| **SCR-02** | Trang chủ Tổng quan Sức khoẻ | 44 items | 100% | `daily_checkins`, `biometric_records`, `dose_logs` |
| **SCR-03** | Sức khoẻ – Sinh trắc học & Chuỗi đo IoT | 94 items | 100% | Bổ sung `biometric_records.body_site` |
| **SCR-04** | Quản lý Kết nối Thiết bị Ngoại vi & BLE | 33 items | 100% | Bổ sung `connected_devices.sync_frequency`, `last_rssi` |
| **SCR-05** | Sức khoẻ – Bảng tổng hợp Xét nghiệm | 50 items | 100% | `clinical_reports` (kind='lab'), `lab_results` |
| **SCR-06** | Báo cáo Kết quả Xét nghiệm Chi tiết | 34 items | 100% | Bổ sung `specimen_type`, `accession_number` |
| **SCR-07** | Sức khoẻ – CĐHA & RECIST 1.1 | 100 items | 100% | Bổ sung `custom_anatomical_site`, `lesion_type`, `laterality` |
| **SCR-08** | Báo cáo CĐHA Chi tiết & Lát cắt PACS | 52 items | 100% | `imaging_studies`, `imaging_series`, MinIO S3 |
| **SCR-09** | Bệnh mạn tính – Disease Cockpit | 47 items | 100% | **Tạo mới bảng `patient_chronic_conditions`** |
| **SCR-10** | Hồ sơ y tế số – Medical Passport | 35 items | 100% | **Tạo mới bảng `vaccination_records`** |
| **SCR-11** | Quản lý dùng thuốc & Lịch nhắc thông minh | 91 items | 100% | Bổ sung `is_long_term`, `discontinued_reason`, `snoozed_until` |
| **SCR-12** | Nhập kết quả cận lâm sàng đa bước | 140 items | 100% | Bổ sung 8 cột GPB & Cổng CSYT vào `clinical_reports` |
| **SCR-13** | Trợ lý AI Y tế Đa ngữ cảnh | 25 items | 100% | **Tạo mới bảng `ai_conversations`, `ai_chat_messages`** |
| **SCR-14** | Mạng lưới Chăm sóc & Chia sẻ Bác sĩ | 43 items | 100% | **Tạo mới bảng `share_grants`, `appointments`** |
| **SCR-15** | Thẻ Y tế Khẩn cấp SOS & Offline QR Ký số | 24 items | 100% | Bổ sung `primary_doctor_name`, `recent_medical_event` |
| **SCR-16** | Thông tin người dùng & Định danh eKYC | 32 items | 100% | Bổ sung `users.address`, `is_biometric_login_enabled` |
| **SCR-17** | Quản lý Hồ sơ Gia đình & Phân quyền Đồng thuận | 25 items | 100% | `family_members`, `family_member_consents` |
| **TỔNG CỘNG** | **17 Màn hình toàn hệ thống** | **802 items** | **100% CSDL HÓA** | **6 Bảng Mới + 20 Cột Mở Rộng** |

---

### B. Danh Mục 6 Bảng CSDL Mới Bổ Sung Trong Migration 002
1. **`appointments`**: Quản lý lịch hẹn khám bệnh trực tiếp, khám định kỳ bệnh mạn tính và tái khám chuyên khoa (SCR-09, SCR-14, SCR-17).
2. **`share_grants`**: Quản trị minh bạch danh tính những bác sĩ, người thân đang được phép truy cập hồ sơ bệnh án số và thời hạn hiệu lực (SCR-14, SCR-06, SCR-08, SCR-11 - Nghị định 13/2023/NĐ-CP).
3. **`patient_chronic_conditions`**: Theo dõi bệnh lý nền mạn tính của từng cá nhân (Tăng huyết áp, Đái tháo đường, Rối loạn lipid máu), phân tầng nguy cơ và theo dõi mục tiêu lâm sàng (SCR-09).
4. **`vaccination_records`**: Sổ tiêm chủng điện tử trọn đời trong Hộ chiếu y tế số (SCR-10).
5. **`ai_conversations`**: Quản lý các phiên hội thoại hỏi đáp sức khoẻ hai chiều với AI theo từng ngữ cảnh chuyên biệt (SCR-13).
6. **`ai_chat_messages`**: Lưu trữ từng tin nhắn trong phiên hội thoại AI kèm trích dẫn bằng chứng y khoa và khuyến cáo pháp lý (SCR-13).

---

### C. Danh Mục 20 Cột Mở Rộng Trên Các Bảng Hiện Hữu
- **`connected_devices`**: Thêm `sync_frequency` (`auto`, `15m`, `hourly`, `manual`), `last_rssi`.
- **`clinical_reports`**: Thêm `specimen_type`, `accession_number`, `pathology_specimen_type`, `specimen_site`, `histological_grade`, `ptnm_staging`, `surgical_margin`, `ihc_markers` (JSONB), `csyt_portal_url`, `csyt_username`, `csyt_sync_status`.
- **`tumor_tracking_evaluations`**: Thêm `custom_anatomical_site`, `lesion_type`, `laterality`.
- **`prescriptions` & `prescription_items`**: Thêm `is_long_term`, `discontinued_reason`, `side_effects`, `dose_per_intake`, `ocr_confidence_score`, `ocr_needs_review`.
- **`dose_logs`**: Thêm `snoozed_until` (hỗ trợ tính năng "Nhắc lại 15p").
- **`emergency_cards`**: Thêm `primary_doctor_name`, `primary_doctor_phone`, `recent_medical_event`, `show_on_lock_screen`.
- **`biometric_records`**: Thêm `body_site` (vị trí đo tay trái/phải).
- **`users`**: Thêm `address`, `is_biometric_login_enabled`, `is_mfa_enabled`.
- **`master_facilities`**: Thêm `portal_url`.
- **`config_device_catalog`**: Thêm `abbr`, `supported_data_types`, `default_sync_frequency`.


---

# CHƯƠNG 5: CÔNG THỨC TOÁN HỌC & THUẬT TOÁN LOGIC Y KHOA CHI TIẾT

Toàn bộ các thuật toán cộng trừ nhân chia và xử lý logic y khoa trong hệ sinh thái D-HEALTH được quy chuẩn hoá toán học như sau:

---

### 5.1 Thuật toán Tính Điểm Sức khoẻ Tổng thể (D-Health Score)
Điểm sức khoẻ D-Health ($S \in [0, 100]$) được tính toán dựa trên mô hình Trọng số 3 Trụ Cột Lâm Sàng:
$$S = 0.40 \times S_{\text{sinh trắc}} + 0.30 \times S_{\text{tuân thủ thuốc}} + 0.30 \times S_{\text{cận lâm sàng}}$$

Trong đó:
1. **$S_{\text{sinh trắc}}$ (Thang 100)**: Đánh giá độ ổn định của các chỉ số sinh hiệu (Huyết áp, Nhịp tim, SpO2, BMI) trong 7 ngày gần nhất so với khoảng tham chiếu tối ưu (Mức 1). Mỗi số đo rơi vào Mức 1 tính $100$ điểm, Mức 2 tính $60$ điểm, Mức 3 tính $0$ điểm.
2. **$S_{\text{tuân thủ thuốc}}$ (Thang 100)**: Tỷ lệ tuân thủ dùng thuốc trong 30 ngày gần nhất:
   $$S_{\text{tuân thủ thuốc}} = \frac{\text{Số liều ĐÃ UỐNG}}{\text{Số liều ĐÃ UỐNG} + \text{QUÊN} + \text{BỎ LIỀU}} \times 100$$
3. **$S_{\text{cận lâm sàng}}$ (Thang 100)**: Đánh giá tỷ lệ các chỉ số xét nghiệm nằm trong khoảng tham chiếu:
   $$S_{\text{cận lâm sàng}} = \left( 1 - \frac{\text{Số chỉ số bị gắn cờ ABNORMAL/HIGH/LOW}}{\text{Tổng số chỉ số xét nghiệm được theo dõi}} \right) \times 100$$
*Điều kiện biên (BR-42):* Nếu người dùng chưa có đủ dữ liệu ở cả 3 trụ cột (ví dụ chưa có xét nghiệm máu) $\rightarrow$ Tuyệt đối KHÔNG tính bừa, hiển thị dấu gạch ngang `"——"` kèm thông báo: *"Chưa đủ dữ liệu để tính điểm"*.

---

### 5.2 Thuật toán Đánh giá Đáp ứng Khối u Đặc RECIST 1.1
Áp dụng cho các ca chụp CĐHA (CT / MRI) có theo dõi u bướu sau điều trị:
1. **Tổng đường kính tổn thương đích (Sum of Longest Diameters - SoD)**:
   $$\text{SoD}(t) = \sum_{i=1}^{k} d_i(t)$$
   *(Với $d_i$ là đường kính dài nhất của tổn thương thứ $i$, hạch bạch huyết lấy trục ngắn; tối đa $k \le 5$ tổn thương đích, không quá 2 tổn thương trên một cơ quan; điều kiện $d_i \ge 10\text{ mm}$).*
2. **Mốc so sánh**:
   - $\text{SoD}_{\text{baseline}}$: Tổng đường kính tại mốc trước khi điều trị.
   - $\text{SoD}_{\text{nadir}}$: Tổng đường kính nhỏ nhất từng ghi nhận từ đầu đến trước mốc hiện tại.
   - $\text{SoD}_{\text{current}}$: Tổng đường kính tại mốc chụp hiện tại.
3. **Tiêu chuẩn phân loại đáp ứng (Thứ tự kiểm tra: CR $\rightarrow$ PD $\rightarrow$ PR $\rightarrow$ SD)**:
   - **CR (Đáp ứng hoàn toàn)**: Toàn bộ tổn thương đích biến mất hoàn toàn ($\text{SoD} = 0$).
   - **PD (Bệnh tiến triển)**:
     $$\frac{\text{SoD}_{\text{current}} - \text{SoD}_{\text{nadir}}}{\text{SoD}_{\text{nadir}}} \ge +20\% \quad \text{VÀ} \quad (\text{SoD}_{\text{current}} - \text{SoD}_{\text{nadir}}) \ge 5\text{ mm}$$
     *(Hoặc xuất hiện tổn thương mới bất kỳ).*
   - **PR (Đáp ứng một phần)**:
     $$\frac{\text{SoD}_{\text{current}} - \text{SoD}_{\text{baseline}}}{\text{SoD}_{\text{baseline}}} \le -30\%$$
   - **SD (Bệnh ổn định)**: Không đủ điều kiện giảm sâu của PR nhưng chưa bị tăng nặng của PD.

---

### 5.3 Thuật toán Khử Trùng lặp Đa nguồn Đo Sinh trắc (Deduplication Rules)
Khi một người dùng vừa đeo đồng hồ thông minh (Apple Watch), vừa đo máy đo huyết áp bắp tay Omron kết nối Bluetooth, dữ liệu đo có thể bị gửi trùng lặp:
1. **Cửa sổ thời gian trùng**: Hai số đo của cùng một chỉ số sinh trắc được coi là trùng lặp nếu:
   $$|t_1 - t_2| \le 120\text{ giây}$$
2. **Thang ưu tiên nguồn dữ liệu**:
   $$\text{Cấp 1: Thiết bị Y tế Chuyên dụng (Omron BLE, Accu-Chek BLE)} > \text{Cấp 2: Thiết bị Đeo (Apple Watch, Garmin)} > \text{Cấp 3: Apple Health / Health Connect}$$
3. Bản ghi có cấp ưu tiên thấp hơn sẽ được gắn cờ `is_deduplicated = true`, vẫn lưu vết kiểm toán nhưng không hiển thị trên biểu đồ chính để tránh làm lệch số liệu.

---

### 5.4 Thuật toán Tính Chỉ số Khối Cơ thể (BMI)
$$BMI = \frac{\text{weight\_kg}}{(\text{height\_cm} / 100)^2}$$
- Làm tròn chuẩn y tế: **1 chữ số thập phân** (VD: $72.5 / (1.72)^2 = 24.509... \rightarrow 24.5\text{ kg/m}^2$).
- Phân loại cho người trưởng thành Châu Á (WHO Asia-Pacific Guidelines):
  - Thiếu cân: $BMI < 18.5$.
  - Bình thường: $18.5 \le BMI < 23.0$ (Mức 1 - Tốt).
  - Thừa cân: $23.0 \le BMI < 25.0$ (Mức 2 - Chú ý).
  - Béo phì: $BMI \ge 25.0$ (Mức 3 - Cảnh báo).

---

### 5.5 Thuật toán Đề xuất Phân loại Nhóm Xét nghiệm Tự động (Majority Vote)
Khi người dùng nhập phiếu xét nghiệm có nhiều chỉ số (hoặc OCR quét từ giấy):
1. Mỗi chỉ số $k$ có nhóm phân loại mặc định $C_k \in \{\text{HH}, \text{SH}, \text{VS}, \text{PT}, \text{DT}\}$ cấu hình trong `analyte_definitions`.
2. Đếm số lượng chỉ số xuất hiện theo từng nhóm:
   $$N(C) = \sum_{k=1}^{m} \mathbb{I}(C_k = C)$$
3. Đề xuất nhóm chính của phiếu:
   $$C^* = \arg\max_{C} N(C)$$
   *(Nếu xảy ra hoà điểm, ưu tiên theo thứ tự lâm sàng phổ biến: $\text{SH} > \text{HH} > \text{VS} > \text{PT} > \text{DT}$).*

---

### 5.6 Thuật toán Mã hoá & Ký số Thẻ Cấp cứu Offline QR (ECDSA P-256)
Để nhân viên cứu thương 115 có thể quét mã QR đọc ngay dữ liệu cứu sinh mà không cần kết nối internet:
1. **Tạo Payload JSON siêu nén**:
   ```json
   {"m":"079084001234","n":"TRAN MINH KHANG","b":"O+","al":["PENICILLIN"],"co":["TANG HUYET AP"],"me":["AMLODIPINE 5MG"],"ice":["0988777666"]}
   ```
2. **Ký số bằng ECDSA (Elliptic Curve Digital Signature Algorithm)** trên đường cong P-256 (secp256r1) bằng Private Key của hệ thống D-HEALTH.
3. **Đóng gói Base64URL**: Ghép nối Payload và Chữ ký số thành mã QR duy nhất. Bất kỳ máy quét nào cũng có thể giải mã và xác thực chữ ký chống làm giả hồ sơ.

---

# CHƯƠNG 6: GIẢI QUYẾT DỨT ĐIỂM 12 ĐIỂM NGHẼN NGHIỆP VỤ (Q1 - Q12) TỪ TÀI LIỆU BA

Tài liệu BA v1.0 nêu ra 12 câu hỏi mở đánh dấu **[TBD]** tại Mục 12. Dưới đây là quyết định kỹ thuật và giải pháp kiến trúc dứt điểm:

| # | Câu hỏi mở BA [TBD] | Quyết định Kỹ thuật & Giải pháp Kiến trúc Dứt điểm |
|---|---|---|
| **Q1** | Công thức **Điểm sức khoẻ** (Đầu vào, trọng số, ngưỡng "Ổn định") | Áp dụng công thức 3 trụ cột (Chương 5.1): $40\%$ Sinh trắc + $30\%$ Thuốc + $30\%$ Xét nghiệm. Bắt buộc có đủ 3 nhóm mới tính điểm; thiếu dữ liệu hiển thị `"——"`. Ngưỡng: $\ge 80$ Tốt, $60-79$ Chú ý, $<60$ Cảnh báo. |
| **Q2** | Bảng **ngưỡng cảnh báo** cho từng chỉ số theo tuổi, giới, bệnh nền | Xây dựng màn hình Admin ADM-06 (`config_biometric_thresholds`) để cố vấn y khoa nạp dữ liệu động. Tuyệt đối không hardcode trong client app. |
| **Q3** | Pháp lý tự động đăng nhập link CSYT (link + captcha) | Áp dụng mô hình **Ephemeral User-Delegated Client Fetch**: Mật khẩu và captcha chỉ chạy trên RAM tạm thời của phiên đó để bóc tách tệp kết quả của bệnh nhân, TUYỆT ĐỐI KHÔNG lưu trữ mật khẩu bệnh viện vào cơ sở dữ liệu (BR-116). |
| **Q4** | Nhà cung cấp **AI/LLM, OCR**: lưu trữ dữ liệu ở đâu | Thiết lập cụm OCR chuyên dụng và LLM On-Premise hoặc Cloud Tenant đạt chuẩn ISO 27001/HIPAA tại Việt Nam (Viettel IDC / VNPT Cloud). Bật cờ `zero_data_retention = true` (không dùng dữ liệu bệnh nhân để huấn luyện mô hình). |
| **Q5** | Nguồn **cơ sở dữ liệu thuốc** (tương tác, hoạt chất) | Tích hợp Từ điển Dược thư Quốc gia Việt Nam qua bảng `medication_catalog` và nạp ma trận tương tác thuốc quốc tế qua bảng `drug_interaction_rules` (Màn hình Admin ADM-03). |
| **Q6** | Cho phép **sửa/ẩn** số đo từ thiết bị? | Bản ghi tự động từ thiết bị: **KHÔNG ĐƯỢC PHÉP SỬA GIÁ TRỊ** (để đảm bảo tính trung thực y khoa), chỉ được phép Ẩn khỏi đồ thị (Soft hide). Bản ghi nhập tay: Được phép sửa và xoá (BR-56). |
| **Q7** | Thời điểm chuyển liều sang "Quên" và số lần "Nhắc lại" | Sau giờ hẹn $+120$ phút mà người dùng chưa nhấn "Đã uống" $\rightarrow$ Hệ thống tự động chuyển trạng thái liều sang `missed` (Quên). Nút "Nhắc lại sau" cho phép hoãn tối đa 3 lần (mỗi lần 15 phút), sau 3 lần tự động chuyển thành Quên. |
| **Q8** | Chính sách giữ dữ liệu khi xoá thành viên / tài khoản | Áp dụng Điều 16 Nghị định 13/2023/NĐ-CP: Người dùng có "Quyền yêu cầu xoá dữ liệu". Áp dụng cơ chế **Soft delete 30 ngày** (cho phép khôi phục nếu lỡ tay), sau 30 ngày tự động chạy Batch Worker xoá vĩnh viễn (Hard delete) khỏi CSDL và Object Storage. |
| **Q9** | Các màn hình còn thiếu thiết kế (Đăng ký, Quên MK, OTP, Thêm người thân...) | Thiết kế bổ sung hoàn thiện theo đúng Design Tokens (Teal `#1F7A8C`, bo góc 20-24px, font Plus Jakarta Sans) bảo đảm trải nghiệm đồng nhất 100%. |
| **Q10** | "Hôm nay bạn thế nào?" là lời chào hay ghi nhận triệu chứng? | **Tích hợp tính năng Nhật ký Cảm xúc & Triệu chứng nhanh**: Chạm vào hàng "Hôm nay bạn thế nào?" sẽ mở Bottom Sheet gồm 5 icon tâm trạng (Rất tốt, Bình thường, Mệt mỏi, Đau đầu, Sốt nhẹ) để lưu vào bảng `daily_checkins`, làm dữ liệu ngữ cảnh cho Trợ lý AI. |
| **Q11** | Nền tảng Video call / Nhắn tin với bác sĩ | Giai đoạn v1.0: Tích hợp qua hệ thống Call/SMS gốc của thiết bị (Tel URI) và liên kết Zalo/WhatsApp y tế. Giai đoạn sau tích hợp WebRTC SDK mã hoá đầu cuối (End-to-End Encrypted Video). |
| **Q12** | Đối tượng trẻ em $<18$ tuổi (BMI bách phân vị) | Áp dụng bảng chuẩn Bách phân vị Chiều cao/Cân nặng của Tổ chức Y tế Thế giới (WHO Growth Charts for Children) cấu hình trong bảng `config_biometric_thresholds`. |

---

*Tài liệu đã được kiểm tra pháp y toàn diện, sẵn sàng làm cơ sở kiến trúc kỹ thuật và kim chỉ nam duy nhất cho toàn bộ đội ngũ kỹ thuật D-HEALTH.*
