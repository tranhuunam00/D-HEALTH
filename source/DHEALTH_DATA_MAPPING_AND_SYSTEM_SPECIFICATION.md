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
| **Logo & Khẩu hiệu D-Health** | Static Asset | Không query DB | Render tĩnh SVG/CSS | Màu thương hiệu Teal `#1F7A8C`, độ tương phản chuẩn WCAG 2.1 AA. |
| **Ô nhập Số điện thoại** | `users.phone_number` | `SELECT id, password_hash, is_ekyc_verified, biometric_public_key, locked_until, failed_attempts FROM users WHERE phone_number = :phone_number LIMIT 1;` | Bàn phím số (Phone Pad, touch) | **Validation:** Bắt buộc 10 chữ số, đầu số hợp lệ VN (`03`, `05`, `07`, `08`, `09`). Chuẩn hoá: tự động xoá khoảng trắng và dấu gạch nối. |
| **Ô nhập Mật khẩu** | `users.password_hash` | Dùng giá trị `password_hash` từ query trên để verify: `argon2.verify(user.password_hash, input_password)` | Input password (ẩn/hiện mắt xem) | **Validation:** $\ge 8$ ký tự, gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt. Không lưu plaintext. |
| **Nút "Đăng nhập"** | Trigger xác thực & cấp JWT | `UPDATE users SET failed_attempts = 0, last_login_at = NOW() WHERE id = :user_id;` | Chạm nút touch | Nếu sai mật khẩu $>5$ lần: `UPDATE users SET locked_until = NOW() + INTERVAL '15 minutes' WHERE id = :user_id;` $\rightarrow$ Trả lỗi `AUTH_RATE_LIMIT`. Thành công: sinh JWT Token (Access 15p + Refresh 7 ngày). |
| **Nút "Đăng nhập sinh trắc" (FaceID/Vân tay)** | `users.biometric_public_key`<br>`users.is_ekyc_verified` | `SELECT id, biometric_public_key FROM users WHERE id = :user_id AND is_ekyc_verified = true;` | Quét cảm biến vân tay / FaceID qua WebAuthn | Kiểm tra chữ ký mật mã WebAuthn Challenge khớp với `biometric_public_key` $\rightarrow$ Cấp token ngay không cần gõ mật khẩu. |
| **Link "Quên mật khẩu"** | `users.phone_number`<br>`otp_verifications` | `SELECT id FROM users WHERE phone_number = :phone_number;`<br>`INSERT INTO otp_verifications (phone, otp_hash, expires_at) VALUES (:phone, :hash, NOW() + INTERVAL '2 minutes');` | Chạm link | Gửi OTP 6 chữ số qua SMS. Xác thực đúng cho phép đổi mật khẩu mới (`UPDATE users SET password_hash = :new_hash`). |

---

## SCR-02: Trang chủ Tổng quan Sức khoẻ (`Main / Home`)
*Trung tâm điều khiển sức khoẻ hằng ngày của Chủ tài khoản.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Avatar & Câu chào "Xin chào, {tên}"** | `family_members.full_name`<br>`family_members.avatar_url` | `SELECT full_name, avatar_url FROM family_members WHERE user_id = :user_id AND relationship = 'owner' LIMIT 1;` | Tự động đọc từ phiên đăng nhập | **Logic cố định (BR-12):** Trang chủ LUÔN LUÔN hiển thị tên chủ tài khoản ("Xin chào, Trần Minh Khang"), không thay đổi theo hồ sơ người thân đang xem. |
| **Nút SOS (Màu đỏ góc trên)** | Navigation trigger | Không query DB | Chạm nút đỏ | Chuyển ngay sang màn hình SCR-17 (Thẻ cấp cứu SOS). |
| **Chip Ngày "Hôm nay: dd/mm/yyyy"** | Đồng hồ thiết bị (Client time) | Không query DB | Tự động đọc múi giờ thiết bị | Múi giờ `Asia/Ho_Chi_Minh` (UTC+7). Format: `dd/mm/yyyy` (chấm xanh trạng thái kết nối). |
| **Thẻ Đo hồ quang: Điểm sức khoẻ (0-100)** | Computed từ 3 bảng:<br>`biometric_records`<br>`dose_logs`<br>`lab_results` | `SELECT * FROM biometric_records WHERE member_id = :owner_member_id AND measured_at >= NOW() - INTERVAL '7 days';`<br>`SELECT status FROM dose_logs WHERE schedule_id IN (...) AND scheduled_at >= NOW() - INTERVAL '30 days';`<br>`SELECT flag FROM lab_results lr JOIN clinical_reports cr ON lr.report_id = cr.id WHERE cr.member_id = :owner_member_id;` | Tính toán tự động tại Backend Service | **Công thức 3 Trụ Cột (Chương 5.1):**<br>$$\text{Điểm} = 0.4 \times S_{\text{sinh trắc}} + 0.3 \times S_{\text{thuốc}} + 0.3 \times S_{\text{xét nghiệm}}$$<br>Nếu thiếu $\ge 1$ trong 3 trụ cột $\rightarrow$ Hiển thị `"——"` và câu: *"Chưa đủ dữ liệu để tính điểm"* (BR-42). |
| **Nhãn trạng thái Điểm sức khoẻ** | Quy đổi từ điểm số | So sánh điểm với ngưỡng: $\ge 80 \rightarrow$ "Tốt"; $60 - 79 \rightarrow$ "Cần chú ý"; $<60 \rightarrow$ "Cảnh báo" | Tự động gán nhãn | Tô màu tương ứng: Xanh lá (`#16A34A`), Vàng (`#F59E0B`), Đỏ (`#DC2626`). |
| **Dòng đếm "{n} vấn đề cần theo dõi · {m} nhóm dữ liệu"** | `biometric_records.severity_level`<br>`lab_results.flag`<br>`clinical_reports.category` | `SELECT COUNT(*) FROM biometric_records WHERE member_id = :owner_member_id AND severity_level IN (2, 3) AND measured_at >= NOW() - INTERVAL '30 days';`<br>`SELECT COUNT(DISTINCT category) FROM clinical_reports WHERE member_id = :owner_member_id AND performed_at >= NOW() - INTERVAL '90 days';` | Tính toán tự động | $\{n\} = \text{tổng số chỉ số bị cảnh báo}$; $\{m\} = \text{số nhóm cận lâm sàng có dữ liệu}$. Chạm vào $\rightarrow$ Mở SCR-05. |
| **Thẻ Nhắc uống thuốc kế tiếp** | `dose_schedules.scheduled_time`<br>`prescription_items.medication_name`<br>`prescription_items.dosage`<br>`dose_logs.status` | `SELECT ds.id, pi.medication_name, pi.dosage, ds.scheduled_time, COALESCE(dl.status, 'pending') as status FROM dose_schedules ds JOIN prescription_items pi ON ds.prescription_item_id = pi.id JOIN prescriptions p ON pi.prescription_id = p.id LEFT JOIN dose_logs dl ON dl.schedule_id = ds.id AND DATE(dl.scheduled_at) = CURRENT_DATE WHERE p.member_id = :owner_member_id AND p.status = 'active' AND (dl.status IS NULL OR dl.status = 'pending') ORDER BY ds.scheduled_time ASC LIMIT 1;` | Tự động đọc từ CSDL | **Logic (BR-40):** Hiển thị liều kế tiếp gần nhất chưa uống trong ngày: Giờ uống, Tên thuốc + hàm lượng, Cách dùng, Tiến độ: "hôm nay {đã uống}/{tổng} liều". |
| **Nút "Đã uống" trên thẻ nhắc** | `dose_logs.status`<br>`dose_logs.taken_at` | `INSERT INTO dose_logs (id, schedule_id, scheduled_at, status, taken_at) VALUES (gen_random_uuid(), :schedule_id, :scheduled_at, 'taken', NOW());` | Chạm nút | Cập nhật bộ đếm hôm nay (ví dụ $2/4 \rightarrow 3/4$). Tự động nạp liều kế tiếp. Hiển thị Toast thông báo cho phép Hoàn tác trong 5 giây (BR-41). |
| **Lưới 4 Chỉ số: Huyết áp** | `biometric_records.systolic`<br>`biometric_records.diastolic`<br>`biometric_records.unit` | `SELECT systolic, diastolic, unit, measured_at, severity_level FROM biometric_records WHERE member_id = :owner_member_id AND biometric_type = 'bp' AND is_deleted = false ORDER BY measured_at DESC LIMIT 1;` | BLE Omron hoặc nhập tay ở SCR-03 | Format: `120/80 mmHg`. Gán nhãn mức (Tốt/Chú ý/Nguy cơ) theo JNC 8. Chạm $\rightarrow$ Mở SCR-03. |
| **Lưới 4 Chỉ số: Nhịp tim** | `biometric_records.value_numeric`<br>`biometric_records.unit` | `SELECT value_numeric, unit, measured_at, severity_level FROM biometric_records WHERE member_id = :owner_member_id AND biometric_type = 'hr' AND is_deleted = false ORDER BY measured_at DESC LIMIT 1;` | Apple Watch / BLE / Đo kèm HA | Format: `71 bpm`. Kèm mini sparkline 7 lần đo gần nhất. Nhãn: "Tốt" nếu $60 - 90\text{ bpm}$. Chạm $\rightarrow$ Mở SCR-03. |
| **Lưới 4 Chỉ số: Cân nặng** | `biometric_records.value_numeric`<br>`biometric_records.unit` | `SELECT value_numeric, unit, measured_at, severity_level FROM biometric_records WHERE member_id = :owner_member_id AND biometric_type = 'weight' AND is_deleted = false ORDER BY measured_at DESC LIMIT 1;` | Cân Bluetooth hoặc nhập tay | Format dấu phẩy: `72,5 kg`. Nhãn "Theo dõi" nếu BMI $> 23.0$ (thang Châu Á). Chạm $\rightarrow$ Mở SCR-03. |
| **Lưới 4 Chỉ số: HbA1c** | `lab_results.value_numeric`<br>`lab_results.unit` | `SELECT lr.value_numeric, lr.unit, cr.performed_at, lr.flag FROM lab_results lr JOIN clinical_reports cr ON lr.report_id = cr.id WHERE cr.member_id = :owner_member_id AND lr.test_code = 'HBA1C' ORDER BY cr.performed_at DESC LIMIT 1;` | Kết quả xét nghiệm máu (SCR-05/SCR-12) | Format: `6,6 %`. Nhãn "Tốt" nếu $< 7.0\%$ (theo ADA). Chạm $\rightarrow$ Mở SCR-05. |
| **Khối AI Insight** | `ai_insights.summary`<br>`ai_insights.context_type` | `SELECT summary, context_type, created_at FROM ai_insights WHERE member_id = :owner_member_id ORDER BY created_at DESC LIMIT 1;` | AI Service sinh tự động định kỳ | Tóm tắt 1 câu nổi bật (VD: *"LDL-C tăng trong 3 lần xét nghiệm gần nhất"*). Nút "Xem phân tích" $\rightarrow$ Mở SCR-13. |
| **Khối Health Timeline** | `clinical_reports.id`<br>`clinical_reports.title`<br>`clinical_reports.performed_at` | `SELECT id, kind, category, title, performed_at, facility_name FROM clinical_reports WHERE member_id = :owner_member_id ORDER BY performed_at DESC LIMIT 2;` | CSDL tự động sắp xếp | Lấy 2 sự kiện y tế mới nhất của chủ tài khoản. Link "Xem tất cả" $\rightarrow$ Mở SCR-10. |

---

## SCR-03: Sức khoẻ – Sinh trắc học & Chuỗi đo IoT (`Biometrics`)
*Màn hình chuyên sâu phân tích chuỗi biến thiên sinh hiệu thời gian thực.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Dải chip 4 Tab con Sức khoẻ** | Static Enum | Không query DB | Chạm chọn ngang | Cố định trên đầu: **Sinh trắc · Xét nghiệm · CĐHA · Bệnh mạn tính** (BR-3.3). Tab hiện tại là "Sinh trắc". |
| **Dải trạng thái đồng bộ thiết bị** | `connected_devices.custom_name`<br>`connected_devices.last_synced_at` | `SELECT custom_name, last_synced_at, battery_level FROM connected_devices WHERE user_id = :user_id AND is_connected = true ORDER BY last_synced_at DESC;` | Tự động đọc phiên sync BLE gần nhất | Ghép chuỗi: *"Đồng bộ từ {custom_name} · {x phút trước}"*. Nút "Thiết bị" $\rightarrow$ Mở SCR-04. |
| **Dải 8 Chip chọn loại chỉ số** | Danh mục `biometric_types` Enum | Không query DB | Cuộn chip ngang | Chọn giữa 8 loại: `Huyết áp`, `Nhịp tim`, `SpO2`, `Nhiệt độ`, `Nhịp thở`, `Cân nặng / BMI`, `Bước chân`, `Giấc ngủ`. |
| **Giá trị đo mới nhất & Nhãn mức** | `biometric_records.systolic`<br>`biometric_records.diastolic`<br>`biometric_records.value_numeric`<br>`biometric_records.measured_at` | `SELECT systolic, diastolic, value_numeric, unit, measured_at, severity_level, source FROM biometric_records WHERE member_id = :active_member_id AND biometric_type = :selected_metric AND is_deleted = false ORDER BY measured_at DESC LIMIT 1;` | Đọc bản ghi có `measured_at` lớn nhất | Lấy giá trị có thời điểm đo lớn nhất (bất kể nguồn từ máy hay nhập tay - BR-55). Hiển thị số lớn kèm nhãn mức Xanh/Vàng/Đỏ. |
| **Biểu đồ chuỗi 7 lần đo gần nhất** | `biometric_records` | `SELECT id, systolic, diastolic, value_numeric, unit, measured_at, source, severity_level FROM biometric_records WHERE member_id = :active_member_id AND biometric_type = :selected_metric AND is_deleted = false ORDER BY measured_at DESC LIMIT 7;` (Reverse mảng vẽ theo thời gian tăng dần) | Render SVG/Canvas | **Quy tắc biểu đồ (BR-54):** Gộp bản ghi thiết bị và nhập tay. Số từ thiết bị tô màu xanh (`#2F6FDB`), số nhập tay tô màu cam (`#F59E0B`). Thang đo huyết áp tối thiểu $70 - 150\text{ mmHg}$. |
| **Nút nổi tròn "+ Nhập số đo"** | UI Action Trigger | Không query DB | Chạm nút FAB | Mở Modal Bottom Sheet nhập liệu nhanh. Tự động điền loại chỉ số đang xem trên màn hình. |
| **Bottom Sheet: Ngày & Giờ đo** | Người dùng chọn | `measured_at = date + time` | DatePicker & TimePicker native | **Quy tắc chặn tương lai (BR-50):** Tuyệt đối KHÔNG cho phép chọn thời điểm trong tương lai so với hiện tại (`measured_at \le \text{now()}`). Báo lỗi đỏ nếu vi phạm. |
| **Bottom Sheet: Huyết áp (Tâm thu/Tâm trương)** | `biometric_records.systolic`<br>`biometric_records.diastolic` | Sẽ được INSERT vào DB: `INSERT INTO biometric_records (member_id, group_id, biometric_type, systolic, diastolic, unit, measured_at, context, source, severity_level, notes) VALUES (...)` | Bàn phím số Number Pad | **Bất biến y khoa (BR-50):** Tâm thu: $60 - 250\text{ mmHg}$, Tâm trương: $30 - 150\text{ mmHg}$. Bắt buộc: $\text{diastolic} < \text{systolic}$. Nếu vi phạm $\rightarrow$ Chặn lưu và báo lỗi đỏ. |
| **Bottom Sheet: Nhịp tim kèm theo** | `biometric_records.value_numeric` | Nếu có nhập nhịp tim: `INSERT INTO biometric_records (member_id, group_id, biometric_type, value_numeric, unit, measured_at, context, source) VALUES (:member_id, :group_id, 'hr', :hr, 'bpm', ...)` | Bàn phím số (Không bắt buộc) | **Logic tách bản ghi (BR-51):** Nhập HA kèm nhịp tim sẽ tự sinh **2 bản ghi riêng biệt** (`bp` và `hr`), gắn cùng `group_id` và chung thời điểm đo. |
| **Bottom Sheet: Cân nặng & Tự tính BMI** | `biometric_records.value_numeric`<br>`family_members.height_cm` | Chiều cao lấy từ: `SELECT height_cm FROM family_members WHERE id = :active_member_id;`<br>Lưu cả `weight` và `bmi`: `INSERT INTO biometric_records ... VALUES (:weight), (:bmi);` | Bàn phím số (Cho phép dấu phẩy) | **Công thức tự tính (BR-52):**<br>$$\text{BMI} = \frac{\text{Cân nặng (kg)}}{(\text{Chiều cao (m)})^2}$$<br>Hiển thị ngay khi gõ: `"BMI tự tính: 24,1 kg/m²"`. |
| **Bottom Sheet: Hoàn cảnh đo** | `biometric_records.context` | Lưu vào cột `context`: `'rest'`, `'wake'`, `'exercise'`, `'meal_before'`, `'meal_after'`, `'bed'` | Single-select chip | Chọn 1 trong 5: `Lúc nghỉ` (mặc định), `Vừa thức dậy`, `Sau vận động`, `Sau ăn`, `Trước khi ngủ`. |
| **Danh sách lịch sử 5 số đo mới nhất** | `biometric_records` | `SELECT id, systolic, diastolic, value_numeric, unit, measured_at, source, context, notes FROM biometric_records WHERE member_id = :active_member_id AND biometric_type = :selected_metric AND is_deleted = false ORDER BY measured_at DESC LIMIT 5;` | CSDL tự động tải | Hiển thị 5 dòng mới nhất, cuộn trong khung (BR-17). Nhãn: "Thiết bị" (Xanh) hoặc "Nhập tay" (Cam). Dòng nhập tay có icon thùng rác để Xoá (BR-56). |

---

## SCR-04: Quản lý Kết nối Thiết bị Ngoại vi & BLE (`Devices`)
*Trung tâm ghép nối thiết bị đo y tế Bluetooth SIG GATT và đồng bộ nền tảng OS Health.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Dòng trạng thái Bluetooth** | Hardware Adapter | Không query DB | Web Bluetooth / Native API | "Bluetooth đang bật · tự động đồng bộ" hoặc "Bluetooth đang tắt". |
| **Nút "Quét tìm thiết bị mới"** | `config_device_catalog.ble_service_uuid` | `SELECT DISTINCT ble_service_uuid FROM config_device_catalog WHERE is_active = true;` | Chạm nút | Kích hoạt quét Bluetooth với danh sách Service UUID y tế chuẩn (`0x1810` HA, `0x1822` SpO2, `0x1808` Glucose). |
| **Khối Apple Health / Google Health Connect** | `connected_devices.id`<br>`connected_devices.is_connected` | `SELECT id, is_connected, last_synced_at FROM connected_devices WHERE user_id = :user_id AND catalog_device_id IN ('apple_health', 'health_connect');` | Nút gạt Switch Toggle | Yêu cầu quyền hệ điều hành. Khi bật $\rightarrow$ Chạy Background Worker đồng bộ định kỳ các chỉ số Nhịp tim, Bước chân, Giấc ngủ. |
| **Danh sách Thiết bị Y tế Bluetooth (Omron...)** | `connected_devices` JOIN `config_device_catalog` | `SELECT cd.id, cd.custom_name, cd.battery_level, cd.is_connected, cd.last_synced_at, cdc.brand, cdc.model_name, cdc.device_type, cdc.image_url FROM connected_devices cd JOIN config_device_catalog cdc ON cd.catalog_device_id = cdc.id WHERE cd.user_id = :user_id;` | Đọc từ CSDL | **Gắn hồ sơ (BR-60):** Thiết bị được gắn cố định với `member_id` của hồ sơ đang xem (VD: Máy Omron của Bố). |
| **Cấu hình chọn dữ liệu đồng bộ** | `connected_devices.data_types` | `UPDATE connected_devices SET data_types = :selected_types_json WHERE id = :device_id;` | Checkbox đa chọn | Bỏ tick chỉ số nào $\rightarrow$ Ngừng đồng bộ chỉ số đó nhưng KHÔNG xoá dữ liệu lịch sử đã lưu trước đây (BR-61). |
| **Khử trùng lặp đa nguồn (Deduplication)** | `biometric_records.source`<br>`biometric_records.is_deleted` | `SELECT id, source, measured_at FROM biometric_records WHERE member_id = :member_id AND biometric_type = :type AND measured_at BETWEEN :t - INTERVAL '2 minutes' AND :t + INTERVAL '2 minutes';` | Thuật toán Deduplication tự động | **Thang ưu tiên (BR-64, Chương 5.3):**<br>$$\text{BLE Y tế (Omron)} > \text{Đồng hồ thông minh} > \text{Apple Health}$$$$\rightarrow$$ Đánh dấu bản ghi ưu tiên thấp hơn là `is_deduplicated = true`. |

---

## SCR-05: Sức khoẻ – Bảng tổng hợp Xét nghiệm (`Health - Labs`)
*Trang quản lý hồ sơ xét nghiệm lâm sàng, phân loại 5 nhóm và vẽ xu hướng chỉ số.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Thanh 5 Chip lọc nhóm Xét nghiệm** | `clinical_reports.category` (Enum `HH`, `SH`, `VS`, `PT`, `DT`) | `SELECT DISTINCT category FROM clinical_reports WHERE member_id = :active_member_id AND kind = 'lab';` | Chạm chip ngang | Lọc danh sách phiếu và danh sách chỉ số theo nhóm được chọn. |
| **Danh sách 5 Phiếu xét nghiệm gần nhất** | `clinical_reports`<br>`lab_results` | `SELECT cr.id, cr.category, cr.title, cr.performed_at, cr.facility_name, COUNT(lr.id) as total_analytes, COUNT(CASE WHEN lr.flag IN ('HIGH', 'LOW', 'CRITICAL') THEN 1 END) as abnormal_count, STRING_AGG(CASE WHEN lr.flag IN ('HIGH', 'LOW', 'CRITICAL') THEN lr.test_name END, ', ') as abnormal_names FROM clinical_reports cr LEFT JOIN lab_results lr ON cr.id = lr.report_id WHERE cr.member_id = :active_member_id AND cr.kind = 'lab' AND (:category_filter = 'ALL' OR cr.category = :category_filter) GROUP BY cr.id, cr.category, cr.title, cr.performed_at, cr.facility_name ORDER BY cr.performed_at DESC LIMIT 5;` | OCR, Cổng CSYT hoặc Nhập tay | Hiển thị 5 phiếu mới nhất, cuộn trong khung (BR-17). Sinh câu tóm tắt tự động: *"{total_analytes} chỉ số · {abnormal_names} tăng/giảm"*. Chạm $\rightarrow$ Mở SCR-06. |
| **Thanh đa chọn chỉ số cần theo dõi** | `lab_results.test_code`<br>`tracked_analyte_prefs` | `SELECT DISTINCT lr.test_code, lr.test_name FROM lab_results lr JOIN clinical_reports cr ON lr.report_id = cr.id WHERE cr.member_id = :active_member_id;`<br>`SELECT analyte_codes FROM tracked_analyte_prefs WHERE member_id = :active_member_id;` | Multi-select chips | Hiển thị "Đã chọn {n}/{tổng}". Danh sách tick lưu bền vững theo `member_id` (BR-70). Bỏ chọn hết $\rightarrow$ Nhắc: "Chọn ít nhất một chỉ số để xem biểu đồ". |
| **Biểu đồ xu hướng từng chỉ số được chọn** | `lab_results.value_numeric`<br>`clinical_reports.performed_at` | `SELECT lr.value_numeric, lr.unit, cr.performed_at, lr.flag FROM lab_results lr JOIN clinical_reports cr ON lr.report_id = cr.id WHERE cr.member_id = :active_member_id AND lr.test_code = :selected_test_code ORDER BY cr.performed_at ASC;` | Render đồ thị đường Line Chart | **Quy tắc vẽ (BR-71, BR-72):** Cần $\ge 2$ lần đo mới vẽ đường. Nếu chỉ có 1 lần: hiện thông báo *"Cần thêm 1 lần đo để vẽ xu hướng · Giá trị hiện có: 6,6%"*. **Trục hoành X là ngày làm xét nghiệm thực tế** (`dd/mm`), không gộp theo tháng. |
| **Đường mục tiêu tham chiếu nét đứt** | `analyte_definitions.ref_max`<br>`member_target_goals.target_value` | `SELECT COALESCE(mtg.target_value, ad.ref_max) as target_value FROM analyte_definitions ad LEFT JOIN member_target_goals mtg ON ad.test_code = mtg.test_code AND mtg.member_id = :active_member_id WHERE ad.test_code = :selected_test_code LIMIT 1;` | Admin cấu hình hoặc Bác sĩ chỉ định | Vẽ đường ngang nét đứt màu đỏ hoặc xanh kèm nhãn: "Mục tiêu $< 7.0\%$". Vượt ngưỡng $\rightarrow$ Điểm đổi sang màu vàng/đỏ và gắn nhãn "Chú ý" (BR-73). |

---

## SCR-06: Báo cáo Kết quả Xét nghiệm Chi tiết (`LabReport`)
*Phiếu kết quả xét nghiệm pháp y chi tiết, hiển thị từng analyte kèm cờ bất thường và tệp gốc.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Nút "Quay lại"** | Navigation | Không query DB | Chạm nút | Trở về SCR-05. |
| **Khối Thông tin Hành chính** | `clinical_reports.performed_at`<br>`clinical_reports.facility_name`<br>`clinical_reports.ordering_doctor_name` | `SELECT performed_at, facility_name, ordering_doctor_name, technique_description, conclusion FROM clinical_reports WHERE id = :report_id;` | Trích xuất OCR hoặc crawl CSYT | Ngày lấy mẫu + giờ, Ngày trả KQ + giờ, Nơi thực hiện, Bác sĩ chỉ định, Loại mẫu ("Huyết thanh · lúc đói"), Mã phiếu. Thiếu trường nào $\rightarrow$ Ẩn dòng đó, cấm sinh số giả. |
| **Bảng dữ liệu kết quả chi tiết** | `lab_results` | `SELECT id, test_code, test_name, value_numeric, value_text, unit, ref_min, ref_max, flag FROM lab_results WHERE report_id = :report_id ORDER BY id ASC;` | Đọc danh sách các dòng chỉ số | **Cấu trúc 3 cột:** Tên chỉ số kèm đơn vị · Kết quả đo · Khoảng tham chiếu in trên phiếu. |
| **Cờ bất thường ($\uparrow$ / $\downarrow$) & Tô màu** | `lab_results.flag` | So sánh giá trị với `ref_min`, `ref_max`: `IF value_numeric > ref_max THEN 'HIGH' ELSIF value_numeric < ref_min THEN 'LOW' ELSE 'NORMAL'` | Tự động tính toán khi nạp kết quả | So sánh với `ref_min` và `ref_max` in trên phiếu (BR-75). `HIGH` $\rightarrow$ Mũi tên đỏ hướng lên ($\uparrow$). `LOW` $\rightarrow$ Mũi tên vàng hướng xuống ($\downarrow$). |
| **Khối Tóm tắt của AI** | `clinical_reports.conclusion`<br>`ai_summaries.summary_text` | `SELECT summary_text FROM ai_summaries WHERE report_id = :report_id;` | AI Service sinh sau khi nhập | Phân tích ngôn ngữ tự nhiên: *"10/12 chỉ số trong giới hạn. LDL-C và Cholesterol tăng nhẹ. Khuyến nghị trao đổi với bác sĩ tim mạch khi tái khám ngày 12/11"*. |
| **Nhận xét của Bác sĩ điều trị** | `clinical_reports.clinical_findings` | `SELECT clinical_findings, recommendations FROM clinical_reports WHERE id = :report_id;` | Đọc từ phiếu hoặc bác sĩ nạp | Lời dặn lâm sàng ghi trên phiếu khám gốc. |
| **Tệp đính kèm gốc (Báo cáo PDF / Ảnh chụp)** | `clinical_reports.attachment_s3_key`<br>`clinical_reports.s3_bucket` | `SELECT attachment_s3_key, s3_bucket, file_sha256 FROM clinical_reports WHERE id = :report_id;` | MinIO Presigned URL | Tạo URL MinIO S3 có hiệu lực 15 phút. Người dùng chạm vào $\rightarrow$ Mở trình xem PDF/ảnh trực tiếp để đối chiếu số liệu. |
| **Nút "Hỏi trợ lý AI" & "Gửi cho bác sĩ"** | Action triggers | Không query DB | Chạm nút | "Hỏi AI": Mở SCR-13 kèm đính kèm `report_id` vào ngữ cảnh. "Gửi bác sĩ": Mở danh sách bác sĩ ở SCR-14 để cấp quyền xem có thời hạn. |

---

## SCR-07: Sức khoẻ – Chẩn đoán hình ảnh & Theo dõi u bướu (`Imaging`)
*Màn hình theo dõi các ca chụp SA, XQ, CT, MRI và module theo dõi kích thước u đặc RECIST 1.1.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Dải Chip Lọc Phương tiện CĐHA** | `imaging_studies.modality` (Enum `SA`, `XQ`, `MM`, `CT`, `MRI`) | `SELECT DISTINCT modality FROM imaging_studies ist JOIN clinical_reports cr ON ist.report_id = cr.id WHERE cr.member_id = :active_member_id;` | Chạm chip ngang | Lọc danh sách ca chụp theo phương tiện chuẩn DICOM (BR-83). Chạm 1 ca chụp $\rightarrow$ Mở SCR-08. |
| **3 Bộ lọc Dropdown: Theo dõi tổn thương** | `tumor_tracking_evaluations`<br>`imaging_studies` | Dropdown 1: `SELECT DISTINCT lesion_type FROM tumor_tracking_evaluations;`<br>Dropdown 2: `SELECT DISTINCT organ FROM tumor_tracking_evaluations;`<br>Dropdown 3: `SELECT DISTINCT modality FROM imaging_studies;` | Dropdown lists | **3 điều kiện kết hợp AND (BR-83):** Loại tổn thương (`Khối u đặc`, `U nang`, `Khác`) · Vị trí giải phẫu (`Gan`, `Phổi`, `Thận`... kèm ô `Khác (tự nhập)`) · Phương tiện (`CT`, `MRI`, `SA`, `XQ`). |
| **Thẻ Nhóm tổn thương đang chọn** | `tumor_tracking_evaluations.organ`<br>`tumor_tracking_evaluations.lesion_location` | `SELECT organ, lesion_location, lesion_count FROM tumor_tracking_evaluations WHERE id = :selected_lesion_group_id;` | Người dùng chọn từ danh sách | Hiển thị: Loại tổn thương · Vị trí giải phẫu (VD: *"Khối u đặc · Gan (Hạ phân thuỳ VI, VII, VIII)"*). |
| **Tổng đường kính hiện tại (mm)** | `tumor_tracking_evaluations.current_sum_diameters_mm` | `SELECT current_sum_diameters_mm FROM tumor_tracking_evaluations WHERE id = :selected_lesion_group_id;` | Tính toán tự động tại mốc chụp mới nhất | **Công thức cộng (BR-81, Chương 5.2):**<br>$$\text{SoD}(t_{\text{current}}) = \sum_{i=1}^{k} \text{Đường kính dài nhất}(U_i)$$<br>(Hạch bạch huyết đo trục ngắn). Hiển thị: `38 mm`. |
| **Bảng tổn thương qua 3 mốc thời gian** | `tumor_tracking_evaluations`<br>`imaging_studies` | `SELECT tte.baseline_sum_diameters_mm, tte.nadir_sum_diameters_mm, tte.current_sum_diameters_mm, cr.performed_at FROM tumor_tracking_evaluations tte JOIN imaging_studies ist ON tte.study_id = ist.id JOIN clinical_reports cr ON ist.report_id = cr.id WHERE tte.organ = :organ ORDER BY cr.performed_at ASC LIMIT 3;` | Ma trận dữ liệu CSDL | Cột: 3 mốc chụp gần nhất (VD: `15/01/2026`, `15/05/2026`, `20/10/2026`). Hàng: Từng tổn thương ($U_1$, $U_2$). Hàng cuối: **Tổng đường kính (SoD)**. |
| **Khối Đánh giá RECIST 1.1** | `tumor_tracking_evaluations.recist_response`<br>`tumor_tracking_evaluations.treatment_response_note` | `SELECT recist_response, baseline_sum_diameters_mm, nadir_sum_diameters_mm, current_sum_diameters_mm, treatment_response_note FROM tumor_tracking_evaluations WHERE id = :selected_lesion_group_id;` | Thuật toán `RecistEvaluator` tính tự động | **Thuật toán RECIST 1.1 (BR-82, Chương 5.2):** So sánh SoD hiện tại với Baseline và Nadir $\rightarrow$ Mã **PR (Đáp ứng một phần)**, dòng ghi chú: `"-36,7% so với ban đầu"`. 3 ô: **Ban đầu (60mm) / Nhỏ nhất (38mm) / Hiện tại (38mm)**. Miễn trừ y tế bắt buộc. |
| **Biên tổn thương $<10\text{ mm}$** | `tumor_tracking_evaluations` | Kiểm tra kích thước u: `IF max(lesion_diameters) < 10 THEN 'NOT_QUALIFIED'` | Tự động kiểm tra | Nếu toàn bộ u $<10\text{ mm}$ $\rightarrow$ Ẩn kết quả CR/PR/SD/PD, hiển thị: *"Chưa đủ tiêu chuẩn làm tổn thương đích RECIST (≥10mm). Tiếp tục theo dõi kích thước"*. |

---

## SCR-08: Báo cáo CĐHA Chi tiết & Lát cắt PACS (`ImagingReport`)
*Trình xem báo cáo chẩn đoán hình ảnh chuyên sâu, đối chiếu đa mốc và tích hợp link PACS.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Tên chỉ định & Phương tiện** | `clinical_reports.title`<br>`imaging_studies.modality` | `SELECT cr.title, ist.modality FROM clinical_reports cr JOIN imaging_studies ist ON cr.id = ist.report_id WHERE ist.id = :study_id;` | Trích xuất từ phiếu chỉ định | VD: *"MRI gan có tiêm thuốc đối quang từ · Phương tiện: MRI"*. |
| **Dải Chip Chuỗi xung / Chuỗi ảnh** | `imaging_series.series_name` | `SELECT series_name, series_number, instance_count, thumbnail_s3_key FROM imaging_series WHERE study_id = :study_id ORDER BY series_number ASC;` | Đọc từ metadata ca chụp | Danh sách chuỗi xung: `T1 + thuốc`, `T2`, `DWI`, `In-phase`, `Out-phase`. |
| **Khối Thông tin Hành chính** | `clinical_reports`<br>`imaging_studies` | `SELECT cr.performed_at, ist.body_part, cr.facility_name, cr.ordering_doctor_name, cr.interpreting_doctor_name, ist.comparison_notes FROM clinical_reports cr JOIN imaging_studies ist ON cr.id = ist.report_id WHERE ist.id = :study_id;` | Trích xuất từ phiếu | Ngày thực hiện, Bộ phận, Nơi thực hiện, Bác sĩ chỉ định, Bác sĩ đọc kết quả, Dòng so sánh: *"So sánh với lần chụp trước ngày 15/05/2026"*. |
| **4 Khối Báo cáo Lâm sàng Chuẩn** | `clinical_reports.technique_description`<br>`clinical_reports.clinical_findings`<br>`clinical_reports.conclusion`<br>`clinical_reports.recommendations` | `SELECT technique_description, clinical_findings, conclusion, recommendations FROM clinical_reports WHERE id = (SELECT report_id FROM imaging_studies WHERE id = :study_id);` | Nạp từ OCR hoặc bác sĩ nhập | 1. **KỸ THUẬT:** Chuỗi xung và thuốc tương phản.<br>2. **MÔ TẢ:** Chi tiết hình thái tổn thương.<br>3. **KẾT LUẬN:** Nhận định tổn thương chính.<br>4. **ĐỀ NGHỊ:** Lời khuyên tái khám/sinh thiết. |
| **Bảng Tổn thương: Trước vs. Nay** | `tumor_tracking_evaluations` | `SELECT lesion_location, baseline_sum_diameters_mm, current_sum_diameters_mm, (current_sum_diameters_mm - baseline_sum_diameters_mm) as diff_mm FROM tumor_tracking_evaluations WHERE study_id = :study_id;` | Tính toán chênh lệch tự động | Liệt kê từng tổn thương ($U_1$, $U_2$), đường kính lần trước, đường kính lần này, độ chênh lệch (VD: $45\text{ mm} \rightarrow 38\text{ mm}$, giảm $-7\text{ mm}$). |
| **Nút "Xem ảnh DICOM (PACS)"** | `imaging_studies.dicom_study_instance_uid`<br>`master_facilities.api_endpoint` | `SELECT ist.dicom_study_instance_uid, mf.api_endpoint FROM imaging_studies ist JOIN clinical_reports cr ON ist.report_id = cr.id LEFT JOIN master_facilities mf ON cr.facility_id = mf.id WHERE ist.id = :study_id;` | Chạm link | Mở đường dẫn Web Viewer PACS chuẩn y tế để bác sĩ soi từng lát cắt DICOM độ phân giải cao. |
| **Nút "Báo cáo PDF"** | `clinical_reports.attachment_s3_key` | `SELECT attachment_s3_key, s3_bucket FROM clinical_reports WHERE id = (SELECT report_id FROM imaging_studies WHERE id = :study_id);` | MinIO Presigned URL | Mở tệp scan PDF có chữ ký điện tử hoặc dấu mộc của bệnh viện. |

---

## SCR-09: Bệnh mạn tính – Disease Cockpit (`Cockpit`)
*Buồng lái theo dõi bệnh mạn tính liên hoàn, tích hợp checklist việc cần làm trước buổi khám.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Dải Thẻ Bệnh mạn tính** | `conditions` JOIN `master_chronic_conditions` | `SELECT c.id, mcc.name, mcc.icd10_code, mcc.category, mcc.badge_color, mcc.required_metrics, c.status FROM conditions c JOIN master_chronic_conditions mcc ON c.code = mcc.icd10_code WHERE c.member_id = :active_member_id AND c.status = 'active';` | Khai báo ở hồ sơ hoặc bác sĩ chẩn đoán | Hiển thị các bệnh đang theo dõi: Mã/Icon bệnh, Tên bệnh, Trạng thái tổng quát: *"Nguy cơ trung bình · xu hướng ổn định"* hoặc *"1 cảnh báo cần khám"*. |
| **Bộ chỉ số liên kết theo từng bệnh** | `master_chronic_conditions.required_metrics`<br>`biometric_records`<br>`lab_results` | `SELECT br.biometric_type, br.systolic, br.diastolic, br.value_numeric, br.unit, br.severity_level FROM biometric_records br WHERE br.member_id = :active_member_id AND br.biometric_type = ANY(:required_metrics) AND br.is_deleted = false ORDER BY br.measured_at DESC;` | Tự động gom chỉ số theo phác đồ | **Logic bệnh học (BR-91):** Gói Tim mạch gom 5 chỉ số: *HA, LDL-C, HbA1c, Nhịp tim, Cân nặng*. Gói Đái tháo đường gom 6 chỉ số: *HbA1c, Glucose, Cân nặng, HA, Thận (Creatinin), Mắt*. Kèm nhãn trạng thái Xanh/Vàng/Đỏ. |
| **Checklist "Việc cần làm tiếp theo"** | `care_tasks` | `SELECT id, title, task_type, due_date, is_completed FROM care_tasks WHERE member_id = :active_member_id AND (condition_id = :condition_id OR condition_id IS NULL) AND is_completed = false ORDER BY due_date ASC;` | Hệ thống sinh theo phác đồ hoặc người dùng tick | Danh mục các đầu việc (VD: *"Đo huyết áp sáng và tối liên tục 3 ngày"*, *"Xét nghiệm lipid máu trước buổi khám"*). Chạm vào checkbox để đánh dấu hoàn thành (`UPDATE care_tasks SET is_completed = true`). |
| **Nút "Đặt lịch tái khám {ngày}"** | `clinical_reports.recommendations`<br>`appointments` | Lấy ngày từ: `SELECT performed_at + INTERVAL '3 months' FROM clinical_reports WHERE member_id = :active_member_id ORDER BY performed_at DESC LIMIT 1;` | Chạm nút | Chuyển sang SCR-14 tạo bản ghi cuộc hẹn: `INSERT INTO appointments (member_id, title, start_at, status) VALUES (:active_member_id, 'Khám định kỳ', :followup_date, 'requested');` |
| **Trạng thái Trống (Khi không có bệnh mạn tính)** | Empty State Loại C | `SELECT COUNT(*) FROM conditions WHERE member_id = :active_member_id AND status = 'active';` | Tự động render khi `count == 0` | Hiển thị thông điệp tích cực: *"Hồ sơ hiện tại không ghi nhận bệnh mạn tính"*, kèm **Lịch tầm soát sức khoẻ gợi ý theo độ tuổi và giới tính**, và nút "Khai báo bệnh đã có". |

---

## SCR-10: Hồ sơ y tế số – Medical Passport (`Records`)
*Hộ chiếu y tế điện tử tổng hợp, quản lý ngữ cảnh chuyển đổi thành viên gia đình.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Thẻ Thành viên Đang xem** | `family_members` | `SELECT id, full_name, relationship, gender, birth_date, blood_type, height_cm, weight_kg, insurance_number, avatar_url FROM family_members WHERE id = :active_member_id;` | Đọc từ Global Context Store | Avatar, Họ tên, Quan hệ ("Bản thân", "Bố", "Mẹ", "Con gái"), Dòng tóm tắt: *"Nam · 42 tuổi · 172 cm · 72,5 kg · BMI 24,5 · Nhóm máu O+"*. |
| **Dòng gợi ý "Chạm để đổi hồ sơ thành viên"** | `family_members` | `SELECT id, full_name, relationship, avatar_url FROM family_members WHERE user_id = :user_id;` | Chạm vào thẻ | **Cơ chế Toàn cục (BR-13, BR-14):** Mở danh sách thành viên gia đình. Chọn 1 người $\rightarrow$ **Cập nhật ngay lập tức toàn bộ app** theo người đó. Lưu vào `localStorage` và đồng bộ server qua `PUT /api/me/active-member`. |
| **Lưới 9 Ô Danh mục Y tế** | Query `COUNT(*)` từ 9 bảng tương ứng | `SELECT (SELECT COUNT(*) FROM allergies WHERE member_id = :active_member_id) as allergy_count, (SELECT COUNT(*) FROM conditions WHERE member_id = :active_member_id) as condition_count, (SELECT COUNT(*) FROM prescriptions WHERE member_id = :active_member_id AND status = 'active') as med_count, (SELECT COUNT(*) FROM clinical_reports WHERE member_id = :active_member_id AND kind = 'lab') as lab_count, (SELECT COUNT(*) FROM clinical_reports WHERE member_id = :active_member_id AND kind = 'imaging') as imaging_count, (SELECT COUNT(*) FROM clinical_reports WHERE member_id = :active_member_id AND kind = 'pathology') as path_count;` | Lưới 3x3 chạm mở | **Điều hướng 9 ô (BR-95):** Dị ứng (DỨ) $\rightarrow$ SCR-17 · Bệnh đã mắc (BL) $\rightarrow$ SCR-09 · Thuốc (TH) $\rightarrow$ SCR-11 · Xét nghiệm (XN) $\rightarrow$ SCR-05 · CĐHA (CĐ) $\rightarrow$ SCR-07 · Giải phẫu bệnh (GPB) $\rightarrow$ Panel trượt · Tài liệu (TL) $\rightarrow$ Kho tệp · Bác sĩ (BS) $\rightarrow$ Panel bác sĩ · CSYT (CS) $\rightarrow$ Panel bệnh viện. |
| **Panel trượt: Bác sĩ đã khám** | `clinical_reports`<br>`master_doctors` | `SELECT DISTINCT md.id, md.full_name, md.academic_title, mf.name as facility_name, MAX(cr.performed_at) as last_visit FROM clinical_reports cr JOIN master_doctors md ON cr.ordering_doctor_id = md.id LEFT JOIN master_facilities mf ON md.facility_id = mf.id WHERE cr.member_id = :active_member_id GROUP BY md.id, md.full_name, md.academic_title, mf.name ORDER BY last_visit DESC LIMIT 5;` | Hệ thống tự gom nhóm (Aggregation) | **Logic (BR-96):** Tự động quét toàn bộ đơn thuốc và phiếu kết quả để tổng hợp danh sách bác sĩ đã khám, kèm số lần khám và ngày gần nhất (không cần nhập thủ công). |
| **Nút nổi "+ Nhập kết quả"** | Navigation trigger | Không query DB | Chạm nút nổi FAB | Điều hướng trực tiếp sang SCR-12 (Luồng nhập đa bước). |

---

## SCR-11: Quản lý dùng thuốc & Lịch nhắc thông minh (`Meds`)
*Trợ lý tuân thủ dùng thuốc, lịch calendar chấm trạng thái và kho đơn thuốc điện tử.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **3 Tab Quản trị Thuốc** | Navigation nội bộ | Không query DB | Chạm chọn tab | 3 Tab: `Lịch thuốc` (hằng ngày) · `Đang dùng` (danh mục hoạt chất) · `Tiền sử` (thuốc đã dừng). |
| **Chỉ số Tuân thủ 30 ngày (%)** | `dose_logs.status` | `SELECT COUNT(CASE WHEN dl.status = 'taken' THEN 1 END) as taken_count, COUNT(CASE WHEN dl.status = 'missed' THEN 1 END) as missed_count, COUNT(CASE WHEN dl.status = 'skipped' THEN 1 END) as skipped_count FROM dose_logs dl JOIN dose_schedules ds ON dl.schedule_id = ds.id JOIN prescription_items pi ON ds.prescription_item_id = pi.id JOIN prescriptions p ON pi.prescription_id = p.id WHERE p.member_id = :active_member_id AND dl.scheduled_at >= NOW() - INTERVAL '30 days';` | Tính toán tự động theo công thức | **Công thức tuân thủ (BR-100, Chương 5.4):**<br>$$\text{Adherence}_{30d} = \frac{\text{Đã uống}}{\text{Đã uống} + \text{Quên} + \text{Bỏ liều}} \times 100\%$$<br>Làm tròn số nguyên: `88%`. Chi tiết: *"Đã uống 52 · Quên 5 · Bỏ 2 liều"*. |
| **Thẻ Tiến độ hôm nay** | `dose_logs.status` | `SELECT COUNT(CASE WHEN dl.status = 'taken' THEN 1 END) as taken_today, COUNT(*) as total_today FROM dose_logs dl JOIN dose_schedules ds ON dl.schedule_id = ds.id JOIN prescription_items pi ON ds.prescription_item_id = pi.id JOIN prescriptions p ON pi.prescription_id = p.id WHERE p.member_id = :active_member_id AND DATE(dl.scheduled_at) = CURRENT_DATE;` | Tự động tính | Format: `"hôm nay 2/4 liều"`. Thanh tiến trình trực quan đạt 50%. |
| **Calendar Tháng (Chấm màu trạng thái)** | `dose_logs.status`<br>`dose_logs.scheduled_at` | `SELECT DATE(dl.scheduled_at) as log_date, COUNT(CASE WHEN dl.status = 'taken' THEN 1 END) as taken_count, COUNT(CASE WHEN dl.status = 'missed' THEN 1 END) as missed_count, COUNT(CASE WHEN dl.status = 'skipped' THEN 1 END) as skipped_count, COUNT(*) as total_count FROM dose_logs dl JOIN dose_schedules ds ON dl.schedule_id = ds.id JOIN prescription_items pi ON ds.prescription_item_id = pi.id JOIN prescriptions p ON pi.prescription_id = p.id WHERE p.member_id = :active_member_id AND DATE(dl.scheduled_at) BETWEEN :month_start AND :month_end GROUP BY DATE(dl.scheduled_at);` | Render ma trận lịch | **Màu chấm từng ngày:** Xanh lá (`#16A34A`): Đã uống đủ 100% liều · Vàng (`#F59E0B`): Có liều Quên (quá 2 giờ) · Đỏ (`#DC2626`): Bỏ liều · Xám: Ngày chưa đến. Chạm 1 ngày $\rightarrow$ Xem liều ngày đó. |
| **Danh sách liều trong ngày** | `dose_schedules`<br>`prescription_items`<br>`dose_logs` | `SELECT ds.id as schedule_id, ds.scheduled_time, ds.meal_relation, pi.medication_name, pi.dosage, COALESCE(dl.status, 'pending') as status FROM dose_schedules ds JOIN prescription_items pi ON ds.prescription_item_id = pi.id JOIN prescriptions p ON pi.prescription_id = p.id LEFT JOIN dose_logs dl ON dl.schedule_id = ds.id AND DATE(dl.scheduled_at) = :selected_date WHERE p.member_id = :active_member_id AND p.status = 'active' ORDER BY ds.scheduled_time ASC;` | Đọc CSDL | Hiển thị: Giờ uống (08:00, 12:00, 20:00), Tên thuốc, Hàm lượng, Số lượng uống ("1 viên sau ăn"), và 3 nút hành động: **[Đã uống]** · **[Nhắc lại sau 15p]** · **[Bỏ liều]**. |
| **Cảnh báo Tương tác Thuốc tự động** | `drug_interaction_rules`<br>`master_medications` | `SELECT dir.ingredient_a, dir.ingredient_b, dir.severity_level, dir.clinical_effect, dir.action_recommendation FROM drug_interaction_rules dir WHERE (dir.ingredient_a = :new_ingredient AND dir.ingredient_b IN (:current_active_ingredients)) OR (dir.ingredient_b = :new_ingredient AND dir.ingredient_a IN (:current_active_ingredients));` | Đối chiếu tự động khi thêm thuốc | **Logic an toàn lâm sàng (BR-106):** Ngay khi người dùng chọn hoạt chất thuốc mới $\rightarrow$ Kiểm tra chéo với toàn bộ thuốc đang uống. Nếu có tương tác nguy hiểm $\rightarrow$ Bật cảnh báo đỏ toàn màn hình kèm cơ chế lâm sàng trước khi cho phép lưu. |

---

## SCR-12: Nhập kết quả cận lâm sàng đa phương thức (`Camera / CSYT / Manual`)
*Quy trình nạp dữ liệu cận lâm sàng 3 bước chuẩn y tế: Xét nghiệm, CĐHA, GPB.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **BƯỚC 1: Chọn Loại kết quả** | `clinical_reports.kind` (`lab`, `imaging`, `pathology`) | Không query DB | Chạm chọn thẻ lớn (Radio Card) | Chọn loại kết quả quyết định cấu trúc form nhập liệu chi tiết ở Bước 3. |
| **BƯỚC 2: Chọn Cách thức nạp** | `clinical_reports.source` (`manual`, `link_csyt`, `ai_camera`) | Không query DB | Chạm chọn phương thức | Thủ công $\rightarrow$ Mở form nhập trường. Link CSYT $\rightarrow$ Mở form link + captcha. Camera $\rightarrow$ Kích hoạt camera OCR. |
| **BƯỚC 3a: Thông tin chung bắt buộc** | `clinical_reports.performed_at`<br>`clinical_reports.facility_name`<br>`clinical_reports.ordering_doctor_name` | Sẽ được INSERT vào `clinical_reports`: `INSERT INTO clinical_reports (id, member_id, kind, category, title, performed_at, facility_name, ordering_doctor_name) VALUES (...)` | Text input & DatePicker native | Ngày thực hiện (bắt buộc $\le \text{now()}$), Nơi thực hiện (`facility_name`), Bác sĩ thực hiện/chỉ định. |
| **BƯỚC 3b (XN Thủ công): Danh sách chỉ số** | `master_lab_tests`<br>`lab_results` | Tìm kiếm gợi ý: `SELECT id, test_code, test_name, test_group, unit, ref_min, ref_max FROM master_lab_tests WHERE is_active = true AND (test_name ILIKE :q OR test_code ILIKE :q) LIMIT 10;` | Thêm dòng động (Dynamic Form Array) | Mỗi dòng gồm: Tên chỉ số (Combobox tìm kiếm theo `master_lab_tests`), Giá trị (Bàn phím số), Đơn vị (Tự điền), Nút xoá dòng. |
| **Khối "Đề xuất phân loại nhóm XN"** | `master_lab_tests.test_group` | Đếm số lượng chỉ số theo từng nhóm: `SELECT test_group, COUNT(*) FROM master_lab_tests WHERE test_code IN (:entered_codes) GROUP BY test_group ORDER BY count DESC LIMIT 1;` | Tự động tính toán khi có dữ liệu | **Thuật toán Majority Vote (BR-110, BR-111, Chương 5.5):** Chỉ xuất hiện khi có $\ge 1$ dòng chỉ số có giá trị. Nhóm nào chiếm đa số sẽ tự động được chọn làm nhóm chính của phiếu (`HH`, `SH`, `VS`, `PT`, `DT`). |
| **BƯỚC 3c (CĐHA Thủ công): Danh sách tổn thương** | `tumor_tracking_evaluations`<br>`lesion_measurements` | Lưu vào `tumor_tracking_evaluations`: `INSERT INTO tumor_tracking_evaluations (study_id, organ, lesion_location, lesion_count, current_sum_diameters_mm) VALUES (...)` | Thêm tổn thương động | Mỗi tổn thương gồm: Loại (`Khối u đặc`, `U nang`, `Khác`), Vị trí (`Bên phải`, `Bên trái`, `Lan toả`), Kích thước ($\text{mm}$), Checkbox: **Tổn thương đích (RECIST)**. |
| **BƯỚC 3d (GPB Thủ công): Dấu ấn HMMD** | `pathology_reports.ihc_markers` | Lưu JSONB: `UPDATE clinical_reports SET ihc_markers = :markers_json WHERE id = :report_id;` | Thêm dấu ấn động | Dấu ấn: `Ki-67`, `ER`, `PR`, `HER2`, `PD-L1`, `TTF-1`... Kết quả: `Dương tính (+)` / `Âm tính (-)` / Tỷ lệ phần trăm ($\%$). |
| **BƯỚC 3f (Từ link CSYT): Ô Link, User, Pass, Captcha** | Cổng Portal CSYT | Phiên cào dữ liệu Ephemeral: `POST /api/reports/import/link` (Dữ liệu truyền qua RAM, không ghi mật khẩu vào CSDL) | Form input có tải ảnh captcha động | **Quy tắc an toàn (BR-116):** Mật khẩu và tài khoản CHỈ DÙNG MỘT LẦN duy nhất trên RAM để tải kết quả, tuyệt đối KHÔNG lưu trữ mật khẩu bệnh viện vào CSDL. |
| **BƯỚC 3g (AI Camera): OCR Trích xuất & Độ tin cậy** | Cloud Vision / LLM OCR Service | Lưu ảnh vào MinIO S3: `attachment_s3_key = 'dhealth-reports/ocr_xxx.jpg'` | Chụp ảnh phiếu $\rightarrow$ Nhận dạng | Trả về từng trường kèm thanh điểm tin cậy. Điểm $<80\%$ tô màu hổ phách cảnh báo "Cần kiểm tra lại". Dữ liệu chỉ lưu khi người dùng bấm xác nhận. Ảnh gốc lưu vào MinIO S3 đối chiếu pháp y. |

---

## SCR-13: Trợ lý AI Y tế Đa ngữ cảnh (`AI Assistant`)
*Hội thoại y tế thông minh, trích dẫn minh bạch nguồn hồ sơ bệnh án cá nhân.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Lịch sử hội thoại (Chat stream)** | `ai_conversations`<br>`ai_messages` | `SELECT id, role, content, cited_resources, created_at FROM ai_messages WHERE conversation_id = (SELECT id FROM ai_conversations WHERE member_id = :active_member_id ORDER BY updated_at DESC LIMIT 1) ORDER BY created_at ASC;` | Tự động tải theo phiên | Phân tách tin nhắn của `user` và câu trả lời của `assistant`. Hỗ trợ streaming text mượt mà. |
| **Gợi ý câu hỏi nhanh (Prompt Chips)** | Hệ thống sinh theo ngữ cảnh bệnh án mới nhất | `SELECT lr.test_name, lr.value_numeric, lr.unit FROM lab_results lr JOIN clinical_reports cr ON lr.report_id = cr.id WHERE cr.member_id = :active_member_id AND lr.flag IN ('HIGH', 'LOW') ORDER BY cr.performed_at DESC LIMIT 3;` | Chạm chip | Gợi ý dựa trên dữ liệu bất thường mới nhất: *"Giải thích kết quả HbA1c 6,6% của tôi"*, *"Chỉ số men gan tăng có nguy hiểm không?"*, *"Thuốc Metformin uống lúc nào tốt nhất?"*. |
| **Khối Trích dẫn nguồn (Citations)** | `ai_messages.cited_resources` (JSONB) | Đọc mảng JSONB: `cited_resources ->> 'report_id'` | AI đính kèm metadata | Mỗi nhận định đều kèm chip dẫn chứng cụ thể: `[Phiếu XN Sinh hoá ngày 20/10/2026]`. Chạm chip $\rightarrow$ Mở thẳng tài liệu gốc để kiểm chứng. |
| **Cảnh báo Miễn trừ Y tế bắt buộc** | Static Text | Không query DB | Text cố định chân màn hình | *"Trợ lý AI D-Health chỉ cung cấp thông tin giải thích tham khảo, không thay thế chẩn đoán và chỉ định điều trị của bác sĩ chuyên khoa"*. |

---

## SCR-14: Mạng lưới Chăm sóc & Chia sẻ Bác sĩ (`Care Network`)
*Quản lý danh bạ bác sĩ điều trị, đặt lịch khám và kiểm soát quyền chia sẻ hồ sơ có thời hạn.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Lịch hẹn khám sắp tới** | `appointments`<br>`master_doctors`<br>`master_facilities` | `SELECT a.id, a.title, a.start_at, md.full_name as doctor_name, md.academic_title, mf.name as facility_name FROM appointments a LEFT JOIN master_doctors md ON a.doctor_id = md.id LEFT JOIN master_facilities mf ON a.facility_id = mf.id WHERE a.member_id = :active_member_id AND a.start_at >= NOW() ORDER BY a.start_at ASC LIMIT 1;` | Bác sĩ xếp lịch hoặc người dùng đặt | Hiển thị: Thứ, Ngày/Tháng, Giờ khám, Tên bác sĩ, Bệnh viện. Tự động gửi thông báo nhắc trước 1 ngày và trước 2 giờ khám. |
| **My Care Team (Đội ngũ bác sĩ của tôi)** | `master_doctors`<br>`master_facilities` | `SELECT md.id, md.full_name, md.academic_title, md.license_number, md.phone_number, md.email, md.avatar_url, mf.name as facility_name FROM master_doctors md LEFT JOIN master_facilities mf ON md.facility_id = mf.id WHERE md.id IN (SELECT doctor_id FROM care_team_members WHERE member_id = :active_member_id);` | Người dùng thêm hoặc hệ thống tổng hợp | Danh sách avatar tròn. Chạm vào 1 bác sĩ $\rightarrow$ Hiển thị: Họ tên, CCHN, CSYT, SĐT (Nút **Gọi**), Email (Nút **Email**), Nút **Nhắn tin / Video**, Nút **"Gửi hồ sơ trước khám"**. |
| **Nút "+ Thêm bác sĩ"** | `master_doctors` | `INSERT INTO master_doctors (id, full_name, academic_title, phone_number, email) VALUES (...)` | Bottom Sheet form | Họ và tên (bắt buộc), Chuyên khoa, CSYT, SĐT hoặc Email (bắt buộc có ít nhất 1 trong 2 để liên lạc - BR-130). |
| **Khối "Ai được xem dữ liệu của tôi?"** | `share_grants` | `SELECT COUNT(*) as active_grants, COUNT(CASE WHEN expires_at <= NOW() + INTERVAL '7 days' THEN 1 END) as expiring_soon FROM share_grants WHERE member_id = :active_member_id AND revoked_at IS NULL AND expires_at > NOW();` | Query quyền chia sẻ đang hiệu lực | Hiển thị: `"{n} người đang có quyền · {m} hết hạn sau {x} ngày"`. Nút "Quản lý" $\rightarrow$ Mở danh sách quyền truy cập (BR-03). |
| **Thu hồi quyền chia sẻ tức thì** | `share_grants.revoked_at` | `UPDATE share_grants SET revoked_at = NOW() WHERE id = :grant_id AND member_id = :active_member_id;` | Chạm nút "Thu hồi" | Người dùng có quyền huỷ quyền xem của bất kỳ ai bất kỳ lúc nào. Khi bấm thu hồi $\rightarrow$ Link chia sẻ bị vô hiệu hoá ngay lập tức, token bị thu hồi (BR-133). |

---

## SCR-15: Thông tin người dùng & Định danh eKYC (`Profile`)
*Quản lý định danh công dân, bảo mật tài khoản và thông tin hành chính y tế nhạy cảm.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Huy hiệu "Đã xác thực định danh điện tử"** | `users.is_ekyc_verified` | `SELECT is_ekyc_verified FROM users WHERE id = :user_id;` | Kết quả từ luồng quét CCCD eKYC | Đã xác thực: Hiện tích xanh chính chủ. Chưa xác thực: Hiện nút "Xác thực ngay". |
| **Số CCCD (Căn cước công dân)** | `family_members.national_id` (AES-256 Encrypted) | `SELECT pgp_sym_decrypt(national_id_enc, :key) as national_id FROM family_members WHERE id = :active_member_id;` | Bàn phím số (12 chữ số) | **Quy tắc bảo vệ dữ liệu (BR-140, BR-143):** Bắt buộc mã hoá AES-256 trong CSDL. Trên giao diện bắt buộc che mờ bảo mật: `0790******12`. Chạm vào ô $\rightarrow$ Yêu cầu FaceID/Vân tay mới hiển thị đầy đủ. |
| **Số thẻ BHYT** | `family_members.insurance_number` (Encrypted) | `SELECT pgp_sym_decrypt(insurance_no_enc, :key) as insurance_no FROM family_members WHERE id = :active_member_id;` | Bàn phím chữ và số | **Format chuẩn VN (BR-140):** 15 ký tự (2 chữ cái đầu là mã đối tượng + 13 chữ số mã thẻ). Mã hoá cấp trường trong CSDL. |
| **Thông tin thể chất: Nhóm máu, Cao, Nặng** | `family_members.blood_type`<br>`family_members.height_cm`<br>`family_members.weight_kg` | `SELECT blood_type, height_cm, weight_kg FROM family_members WHERE id = :active_member_id;` | Select dropdown & Number input | Nhóm máu chọn từ enum (A, B, AB, O, Rh). Chiều cao ($50 - 230\text{ cm}$), Cân nặng ($2 - 300\text{ kg}$). Thay đổi chiều cao/cân nặng tại đây sẽ tự động cập nhật lại BMI toàn ứng dụng. |
| **Toggle "MFA & Đăng nhập sinh trắc"** | `users.mfa_enabled` | `SELECT mfa_enabled FROM users WHERE id = :user_id;`<br>`UPDATE users SET mfa_enabled = :enabled WHERE id = :user_id;` | Nút gạt Switch Toggle | Bật/Tắt bảo mật 2 lớp qua SMS OTP hoặc Authenticator App. |

---

## SCR-16: Quản lý Hồ sơ Gia đình & Phân quyền Đồng thuận (`Family`)
*Quản lý đa hồ sơ người thân, thực thi nghiêm ngặt Cổng đồng thuận (Consent Gate) Nghị định 13/2023/NĐ-CP.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Thanh ngang chọn hồ sơ thành viên** | `family_members` | `SELECT id, full_name, relationship, avatar_url, is_above_18 FROM family_members WHERE user_id = :user_id ORDER BY CASE WHEN relationship = 'owner' THEN 0 ELSE 1 END, created_at ASC;` | Chạm avatar ngang | Liệt kê toàn bộ thành viên trong gia đình (Khang, Hà, An, Huy, Lan). Chạm vào thành viên nào thì đổi ngay lập tức hồ sơ đang xem toàn cục (BR-13). |
| **Nút "+ Thêm người thân"** | `family_members` | `INSERT INTO family_members (id, user_id, full_name, relationship, gender, birth_date, blood_type, is_above_18) VALUES (...)` | Chạm nút mở form | Form nhập: Họ tên, Ngày sinh, Giới tính, Quan hệ (`spouse`, `child`, `parent`, `other`), Nhóm máu, SĐT/Email. |
| **Cổng Đồng thuận Người lớn $\ge 18$ tuổi (Consent Gate)** | `family_member_consents.status`<br>`family_members.is_above_18` | `SELECT status, approved_at, expires_at FROM family_member_consents WHERE member_id = :member_id AND granted_to_user_id = :user_id AND (revoked_at IS NULL) ORDER BY created_at DESC LIMIT 1;` | Tự động tính tuổi từ `birth_date` | **Quy chuẩn Pháp lý Nghị định 13 (BR-01, BR-151):**<br>• Thành viên **$\ge 18$ tuổi**: Chủ tài khoản KHÔNG ĐƯỢC XEM dữ liệu khi chưa có đồng thuận.<br>• Hiển thị: *"Đang chờ đồng thuận · Lời mời đã gửi qua SĐT 0912***456"*. Toàn bộ chỉ số, bệnh án bị khoá.<br>• Khi người thân đăng nhập và bấm "Đồng ý" $\rightarrow$ CSDL cập nhật `status = 'approved'` $\rightarrow$ Dữ liệu mới được giải mã hiển thị. |
| **Cơ chế Giám hộ Trẻ em $<18$ tuổi** | `family_members.is_above_18` | Kiểm tra: `birth_date > NOW() - INTERVAL '18 years'` | Tự động kiểm tra tuổi | Thành viên dưới 18 tuổi thuộc quyền quản lý trực tiếp của người giám hộ (Chủ tài khoản), không cần bước phê duyệt Consent Gate (BR-02). |
| **Nút "Mời người thân tự quản lý"** | `family_members.linked_user_id` | `UPDATE family_members SET linked_user_id = :invite_token WHERE id = :member_id;` | Chạm nút gửi lời mời | Gửi SMS/Email chứa link định danh. Khi người thân tạo tài khoản riêng $\rightarrow$ Hồ sơ chuyển sang cơ chế liên kết tài khoản độc lập (Self-managed). |

---

## SCR-17: Thẻ Y tế Khẩn cấp SOS & Offline QR Ký số (`Emergency`)
*Hộ chiếu cấp cứu khẩn cấp, quét QR truy cập không cần internet, bảo vệ tính mạng trong giờ vàng.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu trong DB (Bảng & Cột cụ thể) | Logic lấy từ DB như thế nào (SQL Query & Filter Logic) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|---|
| **Toggle "Hiển thị trên màn hình khoá"** | `emergency_cards.show_on_lockscreen` | `SELECT show_on_lockscreen FROM emergency_cards WHERE member_id = :active_member_id;`<br>`UPDATE emergency_cards SET show_on_lockscreen = :val WHERE member_id = :active_member_id;` | Nút gạt Switch Toggle | Cho phép hiển thị widget tóm tắt thông tin y tế khẩn cấp ngoài màn hình khoá điện thoại (iOS Medical ID / Android Lockscreen Widget). |
| **Ô Nhóm Máu (Màu đỏ nổi bật cực lớn)** | `family_members.blood_type`<br>`emergency_cards.blood_group_snapshot` | `SELECT blood_group_snapshot FROM emergency_cards WHERE member_id = :active_member_id;` | Tự động lấy từ hồ sơ | Hiển thị chữ to đậm (VD: **O+** hoặc **AB-**). Thông tin quan trọng số 1 cho bác sĩ cấp cứu khi cần truyền máu khẩn cấp. |
| **Khối Thông tin Sống còn: Dị ứng, Bệnh nền, Thuốc** | `emergency_cards.allergies`<br>`emergency_cards.chronic_conditions`<br>`emergency_cards.current_critical_meds` | `SELECT allergies, chronic_conditions, current_critical_meds, emergency_notes FROM emergency_cards WHERE member_id = :active_member_id;` | Tự động tổng hợp từ CSDL | Liệt kê nhanh thông tin tử huyệt: Dị ứng Penicillin, Bệnh Đái tháo đường Type 2, Thuốc chống đông Warfarin đang uống. Người dùng có quyền bật/tắt từng mục hiển thị trên thẻ. |
| **Danh bạ Liên hệ Khẩn cấp (ICE Contacts)** | `emergency_contacts` | `SELECT contact_name, relationship, phone_number, is_primary FROM emergency_contacts WHERE member_id = :active_member_id ORDER BY priority_order ASC;` | Chạm vào số điện thoại | Tên người thân, quan hệ ("Vợ", "Con trai"), Số điện thoại. Chạm vào $\rightarrow$ Hệ thống tự động kích hoạt cuộc gọi điện thoại ngay lập tức mà không cần mở khoá máy. |
| **Nút lớn đỏ "GỌI CẤP CỨU 115"** | `config_emergency_hotlines` | `SELECT direct_emergency_phone FROM config_emergency_hotlines WHERE province_code = :current_province_code LIMIT 1;` | Chạm nút lớn | Kích hoạt cuộc gọi trực tiếp đến tổng đài cấp cứu y tế 115. Tự động gửi tin nhắn SMS chứa toạ độ GPS vị trí hiện tại cho danh bạ khẩn cấp ICE (BR-163). |
| **Mã QR Khẩn cấp Cứu sinh Offline Ký số ECDSA** | `emergency_cards.offline_qr_payload`<br>`emergency_cards.qr_signature` | `SELECT offline_qr_payload, qr_signature FROM emergency_cards WHERE member_id = :active_member_id;` | Hiển thị mã QR tĩnh/động | **Thuật toán Offline QR Chống giả mạo (Chương 5.6):** Dữ liệu thẻ được nén thành chuỗi JSON siêu gọn, ký số bằng **ECDSA P-256** với private key của hệ thống. Nhân viên y tế dùng bất kỳ máy quét QR nào quét mã $\rightarrow$ Đọc được ngay lập tức thông tin cứu mạng mà **KHÔNG CẦN KẾT NỐI MẠNG INTERNET (Offline Access)**. |

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
