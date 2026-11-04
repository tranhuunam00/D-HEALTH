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

Bảng đối soát pháp y chi tiết từng phần tử giao diện, định vị chính xác nguồn gốc dữ liệu, cơ chế nạp và toàn bộ thuật toán logic tương quan giữa các input:

---

## SCR-01: Đăng nhập & Xác thực bảo mật (`Login`)
*Màn hình khởi động ứng dụng, quản lý phiên đăng nhập và định danh công dân.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu (Nguồn dữ liệu) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|
| **Logo & Khẩu hiệu D-Health** | Static Assets trong frontend | Render tĩnh | Token màu thương hiệu Teal `#1F7A8C`, SVG Vector sắc nét. |
| **Ô nhập Số điện thoại** | Người dùng nhập | Input bàn phím số (Phone Pad, touch) | **Validation logic:** Bắt buộc 10 chữ số, bắt đầu bằng đầu số viễn thông Việt Nam (`03`, `05`, `07`, `08`, `09`). Không được chứa ký tự chữ cái hoặc khoảng trắng. Chuẩn hóa: Tự động loại bỏ dấu cách và gạch nối. |
| **Ô nhập Mật khẩu** | Người dùng nhập | Input dạng Password (ẩn/hiện mắt xem) | **Validation logic:** Tối thiểu 8 ký tự, phải bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt. Hash bằng Argon2id ở backend, không lưu plaintext. |
| **Nút "Đăng nhập"** | Trigger gọi API | Button touch | **Logic:** Gọi `POST /api/auth/login`. Nếu sai mật khẩu $>5$ lần liên tiếp: Khóa tài khoản tạm thời 15 phút, trả mã lỗi `AUTH_RATE_LIMIT`. Thành công: Lưu JWT token an toàn vào Keychain/Keystore. |
| **Nút "Đăng nhập sinh trắc" (FaceID/Vân tay)** | Hardware WebAuthn / Native Biometrics | Chạm cảm biến vân tay hoặc quét khuôn mặt | **Logic:** Kiểm tra cờ `biometric_enabled == true` trong `users`. Kích hoạt WebAuthn Assertion. Thành công $\rightarrow$ Lấy Access Token mà không cần gõ mật khẩu. |
| **Link "Quên mật khẩu"** | Luồng khôi phục OTP | Chạm link | **Logic:** Mở modal nhập SĐT $\rightarrow$ Gửi mã OTP 6 số qua SMS Gateway (hiệu lực 120 giây) $\rightarrow$ Đặt lại mật khẩu mới. |

---

## SCR-02: Trang chủ Tổng quan Sức khoẻ (`Main / Home`)
*Trung tâm điều khiển sức khoẻ hằng ngày của Chủ tài khoản.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu (Nguồn dữ liệu) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|
| **Avatar & Câu chào "Xin chào, {tên}"** | Bảng `users` & `members` (Chủ tài khoản: `relation = 'self'`) | Tự động tải từ phiên đăng nhập | **Logic cố định (BR-12):** Trang chủ LUÔN LUÔN hiển thị tên chủ tài khoản ("Xin chào, Trần Minh Khang"), không thay đổi theo hồ sơ người thân đang xem. |
| **Nút SOS (Màu đỏ góc trên)** | Kích hoạt màn hình khẩn cấp | Chạm nút đỏ | **Logic:** Điều hướng ngay lập tức đến SCR-17 (Thẻ y tế cấp cứu khẩn cấp). |
| **Chip Ngày "Hôm nay: dd/mm/yyyy"** | Đồng hồ thiết bị (Client local time) | Tự động đọc múi giờ thiết bị | **Logic (BR-10):** Lấy theo múi giờ `Asia/Ho_Chi_Minh` (UTC+7). Format: `dd/mm/yyyy` (chấm tròn xanh trạng thái đồng bộ). |
| **Thẻ Đo hồ quang: Điểm sức khoẻ (0-100)** | Tính toán động từ Backend Domain Service `HealthScoreCalculator` | Tự động tính từ 3 nguồn dữ liệu | **Thuật toán Trọng số 3 Trụ Cột (Chương 5.1):**<br>$$\text{Điểm} = 0.4 \times S_{\text{sinh trắc}} + 0.3 \times S_{\text{thuốc}} + 0.3 \times S_{\text{xét nghiệm}}$$<br>• Nếu chưa đủ ít nhất 3 nhóm dữ liệu $\rightarrow$ Hiển thị dấu gạch ngang `"——"` kèm câu "Chưa đủ dữ liệu để tính điểm" (BR-42). |
| **Nhãn trạng thái Điểm sức khoẻ** | Quy đổi từ điểm số | Tự động gán nhãn | **Logic:** $\ge 80$: "Tốt" / "Ổn định" (Màu xanh); $60 - 79$: "Cần chú ý" (Màu vàng); $<60$: "Cảnh báo" (Màu đỏ). |
| **Dòng đếm "{n} vấn đề cần theo dõi · {m} nhóm dữ liệu"** | Query đếm từ `biometric_records` và `lab_test_results` | Tính toán từ CSDL | **Logic:** $\{n\} = \text{Count}(\text{chỉ số có flag IN ('HIGH', 'ABNORMAL')})$; $\{m\} = \text{Count}(\text{nhóm dữ liệu có ít nhất 1 bản ghi trong 90 ngày})$. Chạm vào $\rightarrow$ Mở SCR-05. |
| **Thẻ Nhắc uống thuốc kế tiếp** | Bảng `dose_schedules` & `dose_logs` của chủ tài khoản hôm nay | Tự động truy vấn liều kế tiếp | **Logic (BR-40):** Tìm bản ghi có `status = 'pending'` và `scheduled_time \ge \text{now()}` sớm nhất trong ngày. Hiển thị: Giờ uống, Tên thuốc + hàm lượng, Cách dùng ("1 viên sau ăn tối"), và tiến độ: "hôm nay $\{taken\}/\{total\}$ liều". |
| **Nút "Đã uống" trên thẻ nhắc** | Người dùng bấm xác nhận uống | Chạm nút | **Logic (BR-41):** Tạo bản ghi `DoseLog(status='taken', taken_at=now())`. Cập nhật tiến độ đếm (ví dụ $2/4 \rightarrow 3/4$). Tự động ẩn liều này và nạp liều kế tiếp. Hiển thị Toast thông báo có nút "Hoàn tác" trong 5 giây. |
| **Lưới 4 Chỉ số nhanh: Huyết áp** | Bản ghi mới nhất trong `biometric_records` loại `bp` | Nạp từ BLE Omron hoặc nhập tay ở SCR-03 | **Logic:** Lấy giá trị đo gần nhất theo thời gian thực tế `measured_at`. Format: `120/80 mmHg`. Gán nhãn mức theo JNC 8 (Tốt/Chú ý/Nguy cơ). Chạm $\rightarrow$ Mở SCR-03. |
| **Lưới 4 Chỉ số nhanh: Nhịp tim** | Bản ghi mới nhất loại `hr` | Nạp từ Apple Watch / BLE / Đo kèm HA | **Logic:** Hiển thị số nguyên kèm mini sparkline xu hướng 7 lần đo gần nhất. Nhãn: "Tốt" nếu $60 - 90\text{ bpm}$. Chạm $\rightarrow$ Mở SCR-03. |
| **Lưới 4 Chỉ số nhanh: Cân nặng** | Bản ghi mới nhất loại `weight` | Cân Bluetooth hoặc nhập tay | **Logic:** Format dấu phẩy chuẩn Việt Nam: `72,5 kg`. Nhãn "Theo dõi" nếu BMI $>23$ (thang Châu Á). Chạm $\rightarrow$ Mở SCR-03. |
| **Lưới 4 Chỉ số nhanh: HbA1c** | Bản ghi xét nghiệm mới nhất của mã `HbA1c` | Nạp từ kết quả xét nghiệm máu (SCR-05/SCR-12) | **Logic:** Format `6,6 %`. Nhãn "Tốt" nếu $<7.0\%$ (theo ADA cho bệnh nhân đái tháo đường). Chạm $\rightarrow$ Mở SCR-05. |
| **Khối AI Insight** | Bảng `ai_insights` sinh bởi LLM Service | Phân tích tự động định kỳ từ biến thiên chỉ số | **Logic:** Tóm tắt 1 câu nổi bật (VD: "LDL-C tăng trong 3 lần xét nghiệm gần nhất"). Nút "Xem phân tích" $\rightarrow$ Mở SCR-13 với ngữ cảnh được gán sẵn. |
| **Khối Health Timeline (Dòng thời gian)** | Query `UNION` từ `lab_results`, `imaging_studies`, `prescriptions` | Hệ thống tự sắp xếp thời gian | **Logic:** Lấy 2 sự kiện y tế mới nhất của chủ tài khoản. Link "Xem tất cả" $\rightarrow$ Mở SCR-10 (Hồ sơ y tế số). |

---

## SCR-03: Sức khoẻ – Sinh trắc học & Chuỗi đo IoT (`Biometrics`)
*Màn hình chuyên sâu phân tích chuỗi biến thiên sinh hiệu thời gian thực.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu (Nguồn dữ liệu) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|
| **Dải chip 4 Tab con Sức khoẻ** | Static Enum Navigation | Chạm chọn ngang | **Logic (BR-3.3):** Cố định trên đầu: **Sinh trắc · Xét nghiệm · CĐHA · Bệnh mạn tính**. Màn hình hiện tại là "Sinh trắc" (Active: nền đen, chữ trắng). |
| **Dải trạng thái đồng bộ thiết bị** | Bảng `connected_devices` | Tự động đọc phiên sync BLE gần nhất | **Logic:** Ghép chuỗi: *"Đồng bộ từ {danh sách tên thiết bị} · {x phút trước}"*. Nút "Thiết bị" $\rightarrow$ Mở SCR-04. |
| **Dải chọn loại chỉ số (8 loại)** | Danh mục `biometric_types` | Cuộn chip ngang | **Logic:** Chọn giữa 8 loại: `Huyết áp`, `Nhịp tim`, `SpO2`, `Nhiệt độ`, `Nhịp thở`, `Cân nặng / BMI`, `Bước chân`, `Giấc ngủ`. Đổi chip $\rightarrow$ Tải lại biểu đồ và danh sách lịch sử tương ứng. |
| **Giá trị đo mới nhất & Nhãn mức** | CSDL `biometric_records` | Giá trị có `measured_at` lớn nhất | **Logic (BR-55):** Lấy bản ghi có thời điểm đo lớn nhất (không phân biệt nguồn từ máy hay nhập tay). Hiển thị chữ lớn kèm đơn vị, dòng thời gian và nhãn phân mức (Màu xanh/Vàng/Đỏ). |
| **Biểu đồ chuỗi 7 lần đo gần nhất** | Query 7 bản ghi gần nhất theo `measured_at` | Render SVG/Canvas | **Thuật toán biểu đồ (BR-54):** Gộp bản ghi thiết bị và nhập tay. Sắp xếp tăng dần theo thời gian. Điểm/cột đo từ thiết bị tô màu xanh (`#2F6FDB`), điểm nhập tay tô màu cam (`#F59E0B`). Thang đo huyết áp tối thiểu từ 70 đến 150 mmHg. |
| **Nút nổi tròn "+ Nhập số đo"** | Kích hoạt Bottom Sheet | Chạm nút | **Logic:** Mở Modal Bottom Sheet nhập liệu nhanh. Form tự động điền sẵn loại chỉ số đang xem trên màn hình. |
| **Bottom Sheet: Ô chọn Ngày & Giờ đo** | Người dùng chọn | DatePicker & TimePicker native | **Quy tắc chặn tương lai (BR-50):** Tuyệt đối KHÔNG cho phép chọn thời điểm trong tương lai so với đồng hồ hiện tại (`measured_at \le \text{now()}`). Báo lỗi đỏ nếu vi phạm. |
| **Bottom Sheet: Chip chọn nhanh giờ** | Hệ thống tính sẵn | Chạm chip | **Logic:** 3 nút: "Bây giờ" (Gán `now()`), "Sáng nay 07:00", "Tối qua 21:00". |
| **Bottom Sheet: Ô nhập Huyết áp (Tâm thu/Tâm trương)** | Người dùng gõ | Number Pad (Bàn phím số) | **Quy tắc biên y khoa bắt buộc (BR-50):**<br>• Tâm thu: $60 - 250\text{ mmHg}$ (Số nguyên).<br>• Tâm trương: $30 - 150\text{ mmHg}$ (Số nguyên).<br>• **Bất biến:** Tâm trương BẮT BUỘC phải nhỏ hơn Tâm thu ($\text{diastolic} < \text{systolic}$). Nếu sai $\rightarrow$ Chặn lưu và báo lỗi đỏ. |
| **Bottom Sheet: Ô nhập Nhịp tim (kèm theo)** | Người dùng gõ | Number Pad (Không bắt buộc) | **Logic tách bản ghi (BR-51):** Nếu nhập HA có điền nhịp tim $\rightarrow$ Hệ thống tự sinh ra **2 bản ghi riêng biệt** (`bp` và `hr`), gắn cùng `group_id` và chung thời điểm đo. |
| **Bottom Sheet: Ô nhập Cân nặng & Tự tính BMI** | Người dùng gõ cân nặng | Number Pad (Cho phép dấu phẩy thập phân) | **Công thức tự tính thời gian thực (BR-52):**<br>$$\text{BMI} = \frac{\text{Cân nặng (kg)}}{(\text{Chiều cao (m)})^2}$$<br>Chiều cao tự lấy từ hồ sơ cá nhân (`members.height_cm`). Hiển thị ngay dòng chữ: "BMI tự tính: 24,1 kg/m²" khi người dùng vừa gõ xong. |
| **Bottom Sheet: Hoàn cảnh đo** | Người dùng chọn | Single-select chip | **Logic:** Chọn 1 trong 5 trạng thái: `Lúc nghỉ` (mặc định), `Vừa thức dậy`, `Sau vận động`, `Sau ăn`, `Trước khi ngủ`. Nạp vào cột `context`. |
| **Danh sách lịch sử 5 số đo mới nhất** | Query CSDL theo chỉ số | Tự động tải | **Logic (BR-17):** Hiển thị 5 dòng mới nhất, cuộn trong khung. Có nhãn rõ ràng: "Thiết bị" (Màu xanh) hoặc "Nhập tay" (Màu cam). Dòng nhập tay có icon thùng rác để Xoá (BR-56). |

---

## SCR-04: Quản lý Kết nối Thiết bị Ngoại vi & BLE (`Devices`)
*Trung tâm ghép nối thiết bị đo y tế Bluetooth SIG GATT và đồng bộ nền tảng OS Health.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu (Nguồn dữ liệu) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|
| **Dòng trạng thái Bluetooth** | Hardware Bluetooth Adapter | Native API kiểm tra state | **Logic:** Hiển thị: "Bluetooth đang bật · tự động đồng bộ" hoặc cảnh báo vàng "Bluetooth đang tắt · chạm để bật". |
| **Nút "Quét tìm thiết bị mới"** | Kích hoạt trình quét Bluetooth | Chạm nút | **Logic:** Mở Bottom Sheet ghép nối, kích hoạt hàm `navigator.bluetooth.requestDevice` với bộ lọc Service UUID y tế. |
| **Khối Nền tảng Apple Health / Google Health Connect** | Native OS Health Service | Nút gạt Toggle bật/tắt | **Logic:** Yêu cầu quyền hệ điều hành (Permission Request). Khi bật: Tự động chạy Background Worker đồng bộ định kỳ các chỉ số Nhịp tim, Bước chân, Giấc ngủ. |
| **Danh sách Thiết bị Y tế Bluetooth (Omron, Beurer...)** | Bảng `connected_devices` kết hợp `device_catalog` | Ghép nối BLE GATT | **Logic phân tách hồ sơ (BR-60):** Thiết bị được gắn cố định với `member_id` của hồ sơ đang xem (VD: Máy đo huyết áp Omron gắn vào hồ sơ của Bố). |
| **Thông tin pin & Trạng thái đồng bộ** | Bluetooth Battery Service (`0x180F`) | Đọc GATT Characteristic | **Logic:** Đọc byte phần trăm pin $\rightarrow$ Hiển thị icon pin và con số $85\%$. Trạng thái: "Đã đồng bộ 5 phút trước". |
| **Cấu hình chọn dữ liệu đồng bộ** | Bảng `connected_devices.sync_data_types` | Checkbox đa chọn | **Logic (BR-61):** Người dùng tick chọn những chỉ số cho phép đọc. Nếu bỏ tick chỉ số nào $\rightarrow$ Ngừng đồng bộ chỉ số đó nhưng KHÔNG xoá dữ liệu lịch sử đã lưu trước đây. |
| **Khử trùng lặp đa nguồn (Deduplication)** | Thuật toán Deduplication ở Backend | Chạy tự động khi nhận stream dữ liệu | **Thuật toán Khử trùng lặp (BR-64, Chương 5.3):** Nếu cùng 1 chỉ số đo trong cùng cửa sổ thời gian sai số $\le 2$ phút:<br>$$\text{Ưu tiên BLE Y tế} > \text{Đồng hồ thông minh} > \text{Apple Health/Health Connect}$$<br>Bản ghi có độ ưu tiên thấp hơn sẽ bị đánh dấu `is_deduplicated = true` và không hiển thị trên biểu đồ chính. |

---

## SCR-05: Sức khoẻ – Bảng tổng hợp Xét nghiệm (`Health - Labs`)
*Trang quản lý hồ sơ xét nghiệm lâm sàng, phân loại 5 nhóm và vẽ xu hướng chỉ số.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu (Nguồn dữ liệu) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|
| **Thanh 5 Chip lọc nhóm Xét nghiệm** | Fix Cứng Enum (`HH`, `SH`, `VS`, `PT`, `DT`) | Chạm chip ngang | **Logic:** Mặc định chọn nhóm có kết quả mới nhất hoặc toàn bộ. Bấm chip nào thì lọc danh sách phiếu xét nghiệm và danh sách chỉ số theo nhóm đó. |
| **Danh sách 5 Phiếu xét nghiệm gần nhất** | Bảng `clinical_reports` loại `kind = 'lab'` | Nạp từ OCR, Cổng CSYT hoặc Nhập tay | **Logic (BR-17):** Hiển thị tối đa 5 phiếu mới nhất, cuộn trong khung. Mỗi phiếu hiển thị: Mã nhóm (VD: `SH`), Tên phiếu ("Sinh hoá máu"), Ngày làm, và **Dòng tóm tắt tự động**: ghép chuỗi `"{n} chỉ số · {Tên các chỉ số có cờ bất thường} tăng/giảm"` (VD: "12 chỉ số · LDL-C, Triglycerid tăng"). Chạm $\rightarrow$ Mở SCR-06. |
| **Thanh đa chọn chỉ số cần theo dõi** | Danh mục chỉ số đã có trong hồ sơ của bệnh nhân | Multi-select chips | **Logic (BR-70):** Hiển thị "Đã chọn $\{n\}/\{tổng\}$" (VD: chọn HbA1c, LDL-C, Glucose). Danh sách chỉ số được tick lưu bền vững theo `member_id`. Nếu bỏ chọn hết $\rightarrow$ Hiển thị khung nhắc: "Chọn ít nhất một chỉ số để xem biểu đồ diễn biến". |
| **Biểu đồ xu hướng từng chỉ số được chọn** | Bảng `lab_test_results` gom theo mã `loinc_code` | Render đồ thị đường (Line Chart) | **Quy tắc vẽ đồ thị (BR-71, BR-72):**<br>• Phải có $\ge 2$ lần xét nghiệm cùng chỉ số mới vẽ được đường. Nếu chỉ có 1 lần $\rightarrow$ Ẩn đường, hiện thẻ thông báo: *"Cần thêm 1 lần đo để vẽ xu hướng · Giá trị hiện có: 6,6%"*.<br>• **Trục hoành X là ngày làm xét nghiệm thực tế** (`dd/mm`), kèm dòng năm `yyyy`. TUYỆT ĐỐI KHÔNG gộp trung bình theo tháng. |
| **Đường mục tiêu tham chiếu nét đứt** | Bảng `member_target_goals` hoặc `analyte_definitions` | Admin cấu hình hoặc Bác sĩ chỉ định | **Logic (BR-73):** Vẽ đường ngang nét đứt màu đỏ hoặc xanh kèm nhãn: "Mục tiêu $<7.0\%$". Nếu giá trị đo vượt ngưỡng $\rightarrow$ Điểm trên biểu đồ đổi sang màu vàng/đỏ và gắn nhãn "Chú ý". |

---

## SCR-06: Báo cáo Kết quả Xét nghiệm Chi tiết (`LabReport`)
*Phiếu kết quả xét nghiệm pháp y chi tiết, hiển thị từng analyte kèm cờ bất thường và tệp gốc.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu (Nguồn dữ liệu) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|
| **Nút "Quay lại"** | Điều hướng | Chạm nút | Trở về SCR-05. |
| **Khối Thông tin Hành chính** | Bảng `clinical_reports` | Trích xuất từ OCR phiếu hoặc crawl link CSYT | **Các trường:** Ngày lấy mẫu + giờ, Ngày trả kết quả + giờ, Nơi thực hiện (`facility_name`), Bác sĩ chỉ định, Loại mẫu ("Huyết thanh · lúc đói"), Mã số phiếu. Nếu OCR thiếu trường nào $\rightarrow$ Ẩn dòng đó, tuyệt đối cấm sinh dữ liệu giả. |
| **Bảng dữ liệu kết quả chi tiết** | Bảng `lab_test_results` | Đọc danh sách các dòng chỉ số | **Cấu trúc 3 cột:**<br>1. Tên chỉ số kèm đơn vị (VD: "Glucose [Máu] - mmol/L").<br>2. Kết quả đo được.<br>3. Khoảng tham chiếu in trên phiếu. |
| **Cờ bất thường ($\uparrow$ / $\downarrow$) & Tô màu** | So sánh giá trị với khoảng tham chiếu | Tự động tính toán khi nạp kết quả | **Thuật toán so sánh (BR-75):**<br>• Ưu tiên 1: So sánh với `ref_low` và `ref_high` in trên phiếu.<br>• Ưu tiên 2: So sánh với cấu hình bảng `analyte_definitions` theo giới tính bệnh nhân.<br>• Nếu $\text{value} > \text{ref\_high} \rightarrow$ Gắn cờ `HIGH`, mũi tên đỏ hướng lên ($\uparrow$).<br>• Nếu $\text{value} < \text{ref\_low} \rightarrow$ Gắn cờ `LOW`, mũi tên vàng hướng xuống ($\downarrow$). |
| **Khối Tóm tắt của AI** | Trường `ai_summary` | AI Service sinh tự động sau khi nhập | **Logic:** Phân tích ngôn ngữ tự nhiên: *"10/12 chỉ số trong giới hạn bình thường. LDL-C và Cholesterol toàn phần tăng nhẹ. Khuyến nghị trao đổi với bác sĩ tim mạch khi tái khám ngày 12/11"*. |
| **Nhận xét của Bác sĩ điều trị** | Trường `doctor_notes` | Đọc từ phiếu hoặc bác sĩ nạp | Lời dặn lâm sàng ghi trên phiếu khám gốc. |
| **Tệp đính kèm gốc (Báo cáo PDF / Ảnh chụp)** | Object Storage MinIO S3 | Nạp từ quá trình chụp camera hoặc tải link | **Logic bảo mật:** Tạo MinIO Presigned URL có thời hạn 15 phút. Người dùng chạm vào $\rightarrow$ Mở trình xem PDF/ảnh trực tiếp để đối chiếu số liệu. |
| **Nút "Hỏi trợ lý AI" & "Gửi cho bác sĩ"** | Trigger chức năng | Chạm nút | • "Hỏi AI": Mở SCR-13 kèm đính kèm ID của phiếu xét nghiệm này vào ngữ cảnh hội thoại.<br>• "Gửi cho bác sĩ": Mở danh sách bác sĩ ở SCR-14 để cấp quyền xem có thời hạn. |

---

## SCR-07: Sức khoẻ – Chẩn đoán hình ảnh & Theo dõi u bướu (`Imaging`)
*Màn hình theo dõi các ca chụp SA, XQ, CT, MRI và module theo dõi kích thước u đặc RECIST 1.1.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu (Nguồn dữ liệu) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|
| **Dải Chip Lọc Phương tiện CĐHA** | Fix Cứng Enum quốc tế (`Tất cả`, `SA`, `XQ`, `MM`, `CT`, `MRI`) | Chạm chip ngang | **Logic (BR-83):** Lọc danh sách ca chụp theo phương tiện chuẩn DICOM. Chạm vào 1 ca chụp $\rightarrow$ Chuyển sang xem báo cáo chi tiết SCR-08. |
| **3 Bộ lọc Dropdown: Theo dõi tổn thương** | Danh mục Master Data & User input | Chọn từ Dropdown list | **3 điều kiện kết hợp AND (BR-83):**<br>1. **Loại tổn thương:** `Tất cả` / `Khối u đặc` / `Khối u nang` / `Tổn thương khác`.<br>2. **Vị trí giải phẫu:** `Gan`, `Thận`, `Phổi`, `Tuyến giáp`, `Tuyến vú`, `Tuỵ`, `Não`, hoặc `Khác (tự nhập)` $\rightarrow$ Mở ô gõ tự do.<br>3. **Phương tiện:** `Tất cả` / `CT` / `MRI` / `SA` / `XQ`. |
| **Thẻ Nhóm tổn thương đang chọn** | Bảng `lesion_groups` | Người dùng chọn từ danh sách tổn thương bất thường | Hiển thị: Loại tổn thương · Vị trí giải phẫu (VD: "Khối u đặc · Gan (Hạ phân thuỳ VI và VII)"). |
| **Tổng đường kính hiện tại (mm)** | Bảng `lesion_measurements` | Tính toán tự động tại mốc chụp mới nhất | **Công thức cộng (BR-81, Chương 5.2):**<br>$$\text{SoD}(t_{\text{current}}) = \sum_{i=1}^{k} \text{Đường kính dài nhất}(U_i)$$<br>(Đối với hạch bạch huyết: đo theo trục ngắn). Hiển thị: `38 mm`. |
| **Bảng theo dõi tổn thương qua 3 mốc thời gian** | Bảng `lesion_measurements` liên kết qua các ca chụp | Ma trận dữ liệu | **Cấu trúc bảng:**<br>• Cột: 3 mốc chụp gần nhất (VD: `15/01/2026`, `15/05/2026`, `20/10/2026`).<br>• Hàng: Từng tổn thương ($U_1$, $U_2$,...).<br>• Hàng cuối: **Tổng đường kính (SoD)** tương ứng từng mốc. Kèm biểu đồ mini thể hiện đường kính co lại hay phình to. |
| **Khối Đánh giá Đáp ứng RECIST 1.1** | Thuật toán `RecistEvaluator` chạy tự động | Tính toán từ chuỗi đo tổn thương đích | **Thuật toán RECIST 1.1 (BR-82, Chương 5.2):**<br>• So sánh SoD hiện tại với Mốc ban đầu (Baseline) và Mốc nhỏ nhất từng ghi nhận (Nadir).<br>• Hiển thị mã và nhãn: **PR (Partial Response - Đáp ứng một phần)**, dòng ghi chú: `"-36,7% so với ban đầu"`.<br>• 3 ô thông số: **Ban đầu (60 mm) / Nhỏ nhất (38 mm) / Hiện tại (38 mm)**.<br>• **Cảnh báo miễn trừ bắt buộc:** *"Kết quả mang tính tham khảo theo chuẩn RECIST 1.1 — cần bác sĩ CĐHA/ung bướu xác nhận lâm sàng"*. |
| **Điều kiện Biên tổn thương $<10\text{ mm}$** | Kiểm tra kích thước tổn thương | Thuật toán kiểm tra điều kiện | **Logic y khoa:** Nếu toàn bộ tổn thương đều $<10\text{ mm}$ (không đủ chuẩn làm tổn thương đích theo RECIST) $\rightarrow$ Ẩn kết quả phân loại CR/PR/SD/PD, hiển thị thông báo: *"Chưa đủ tiêu chuẩn làm tổn thương đích RECIST (≥10mm). Tiếp tục theo dõi kích thước"*. |

---

## SCR-08: Báo cáo CĐHA Chi tiết & Lát cắt PACS (`ImagingReport`)
*Trình xem báo cáo chẩn đoán hình ảnh chuyên sâu, đối chiếu đa mốc và tích hợp link PACS.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu (Nguồn dữ liệu) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|
| **Tên chỉ định & Phương tiện** | Bảng `imaging_studies` | Trích xuất từ phiếu chỉ định | VD: "MRI gan có tiêm thuốc đối quang từ · Phương tiện: MRI". |
| **Dải Chip Chuỗi xung / Chuỗi ảnh** | Trường `series_tags` trong CSDL | Đọc từ metadata ca chụp | Danh sách các chuỗi xung chụp: `T1 + thuốc`, `T2`, `DWI`, `In-phase`, `Out-phase`. |
| **Khối Thông tin Hành chính** | Bảng `imaging_studies` | Trích xuất từ phiếu | Ngày thực hiện, Bộ phận, Nơi thực hiện, Bác sĩ chỉ định, Bác sĩ đọc kết quả, Dòng so sánh: *"So sánh với lần chụp trước ngày 15/05/2026"*. |
| **4 Khối Báo cáo Lâm sàng Chuẩn** | Trường text trong `imaging_studies` | Nạp từ OCR hoặc bác sĩ nhập | 1. **KỸ THUẬT:** Mô tả chuỗi xung và thuốc cản quang sử dụng.<br>2. **MÔ TẢ:** Chi tiết hình thái giải phẫu.<br>3. **KẾT LUẬN:** Nhận định tổn thương chính.<br>4. **ĐỀ NGHỊ:** Lời khuyên tái khám hoặc sinh thiết. |
| **Bảng Tổn thương: Trước vs. Nay** | Bảng `lesion_measurements` gom 2 ca chụp liên tiếp | Tính toán chênh lệch tự động | Liệt kê từng tổn thương ($U_1$, $U_2$), đường kính lần chụp trước, đường kính lần chụp này, và độ chênh lệch tuyệt đối/tương đối (VD: $35\text{ mm} \rightarrow 22\text{ mm}$, giảm $-13\text{ mm}$). |
| **Nút "Xem ảnh DICOM (PACS)"** | Trường `pacs_web_viewer_url` | Chạm link | Mở đường dẫn trình xem ảnh PACS chuẩn y tế (hoặc WebView) để bác sĩ soi từng lát cắt DICOM độ phân giải cao. |
| **Nút "Báo cáo PDF"** | MinIO S3 Object Storage | Chạm link | Mở tệp scan PDF có chữ ký điện tử hoặc dấu mộc của bệnh viện. |

---

## SCR-09: Bệnh mạn tính – Disease Cockpit (`Cockpit`)
*Buồng lái theo dõi bệnh mạn tính liên hoàn, tích hợp checklist việc cần làm trước buổi khám.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu (Nguồn dữ liệu) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|
| **Dải Thẻ Bệnh mạn tính (Tim mạch, Đái tháo đường...)** | Bảng `conditions` (ICD-10) của bệnh nhân | Khai báo ở hồ sơ hoặc bác sĩ chẩn đoán | Hiển thị các bệnh nhân đang theo dõi. Mỗi thẻ hiển thị: Mã/Icon bệnh, Tên bệnh, Trạng thái tổng quát: "Nguy cơ trung bình · xu hướng ổn định" hoặc "1 cảnh báo cần khám". |
| **Bộ chỉ số liên kết theo từng bệnh** | Bảng `config_chronic_care_plans` kết hợp dữ liệu mới nhất | Tự động gom chỉ số | **Logic liên kết bệnh học (BR-91):**<br>• Gói **Tim mạch**: Tự động gom 5 chỉ số: *Huyết áp, LDL-C, HbA1c, Nhịp tim, Cân nặng*.<br>• Gói **Đái tháo đường**: Tự động gom 6 chỉ số: *HbA1c, Glucose đói, Cân nặng, Huyết áp, Chức năng thận (Creatinin), Khám mắt*.<br>Mỗi chỉ số đều có nhãn trạng thái Xanh/Vàng/Đỏ tương ứng. |
| **Checklist "Việc cần làm tiếp theo"** | Bảng `care_plan_tasks` | Hệ thống sinh theo phác đồ hoặc người dùng tick | **Logic:** Các việc cần làm (VD: "Đo huyết áp sáng và tối liên tục 3 ngày", "Xét nghiệm lipid máu trước buổi khám"). Người dùng chạm vào checkbox để đánh dấu hoàn thành. |
| **Nút "Đặt lịch tái khám {ngày}"** | Kích hoạt luồng đặt lịch | Chạm nút | **Logic:** Ngày tái khám lấy từ lời dặn bác sĩ (`clinical_reports.followup_date`). Bấm nút $\rightarrow$ Chuyển sang SCR-14 tạo bản ghi cuộc hẹn trạng thái `requested`. |
| **Trạng thái Trống (Khi không có bệnh mạn tính)** | Trạng thái Empty State Loại C | Tự động render | Hiển thị thông điệp tích cực: *"Hồ sơ hiện tại không ghi nhận bệnh mạn tính"*, kèm **Lịch tầm soát sức khoẻ gợi ý theo độ tuổi và giới tính**, và nút "Khai báo bệnh đã có". |

---

## SCR-10: Hồ sơ y tế số – Medical Passport (`Records`)
*Hộ chiếu y tế điện tử tổng hợp, quản lý ngữ cảnh chuyển đổi thành viên gia đình.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu (Nguồn dữ liệu) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|
| **Thẻ Thành viên Đang xem (Active Member)** | Bảng `members` | Tự động đọc từ Global Context Store | Hiển thị: Avatar, Họ và tên, Mối quan hệ ("Bản thân", "Bố", "Mẹ", "Con gái"), Dòng tóm tắt: "Nam · 42 tuổi · 172 cm · 72,5 kg · BMI 24,5 · Nhóm máu O+". |
| **Dòng gợi ý "Chạm để đổi hồ sơ thành viên"** | Tương tác chuyển đổi ngữ cảnh | Chạm vào thẻ | **Cơ chế Toàn cục (BR-13, BR-14):** Chạm mở danh sách các thành viên gia đình. Chọn 1 thành viên $\rightarrow$ **Cập nhật ngay lập tức toàn bộ ứng dụng** (Header, số liệu đo, biểu đồ, đơn thuốc) theo người đó. Lưu vết vào `localStorage` và đồng bộ server qua `PUT /api/me/active-member`. |
| **Lưới 9 Ô Danh mục Y tế Toàn diện** | Query đếm số lượng từ 9 bảng tương ứng | Lưới 3x3 chạm mở | **Bảng điều hướng 9 ô (BR-95):**<br>1. **Dị ứng (DỨ)** $\rightarrow$ Mở danh sách dị ứng thuốc/thức ăn.<br>2. **Bệnh đã mắc (BL)** $\rightarrow$ Điều hướng SCR-09.<br>3. **Thuốc (TH)** $\rightarrow$ Điều hướng SCR-11.<br>4. **Xét nghiệm (XN)** $\rightarrow$ Điều hướng SCR-05.<br>5. **CĐHA (CĐ)** $\rightarrow$ Điều hướng SCR-07.<br>6. **Giải phẫu bệnh (GPB)** $\rightarrow$ Mở Panel trượt danh sách phiếu GPB.<br>7. **Tài liệu y tế (TL)** $\rightarrow$ Mở kho tệp đính kèm.<br>8. **Bác sĩ từng khám (BS)** $\rightarrow$ Mở Panel danh sách bác sĩ.<br>9. **Cơ sở y tế đã khám (CS)** $\rightarrow$ Mở Panel danh sách bệnh viện. |
| **Panel trượt: Bác sĩ & CSYT từng khám** | Tổng hợp tự động từ các phiếu XN, CĐHA, đơn thuốc | Hệ thống tự gom nhóm (Aggregation) | **Logic (BR-96):** Không cần nhập riêng lẻ; hệ thống tự động quét toàn bộ đơn thuốc và phiếu kết quả để tổng hợp danh sách bác sĩ đã khám và bệnh viện đã đến, kèm số lần khám và ngày gần nhất. |
| **Nút nổi "+ Nhập kết quả"** | Kích hoạt luồng nạp cận lâm sàng | Chạm nút nổi | Điều hướng trực tiếp sang SCR-12 (Luồng nhập đa bước). |

---

## SCR-11: Quản lý dùng thuốc & Lịch nhắc thông minh (`Meds`)
*Trợ lý tuân thủ dùng thuốc, lịch calendar chấm trạng thái và kho đơn thuốc điện tử.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu (Nguồn dữ liệu) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|
| **3 Tab Quản trị Thuốc** | Navigation nội bộ | Chạm chọn tab | **3 Tab:** `Lịch thuốc` (hằng ngày) · `Đang dùng` (danh mục hoạt chất) · `Tiền sử` (thuốc đã dừng). |
| **Chỉ số Tuân thủ 30 ngày (%)** | Bảng `dose_logs` trong 30 ngày qua | Tính toán tự động theo công thức | **Công thức tuân thủ (BR-100, Chương 5.4):**<br>$$\text{Adherence}_{30d} = \frac{\text{Số liều Đã uống}}{\text{Đã uống} + \text{Quên} + \text{Bỏ liều}} \times 100\%$$<br>Làm tròn số nguyên (VD: `88%`). Chi tiết: "Đã uống 52 · Quên 5 · Bỏ 2 liều". |
| **Thẻ Tiến độ hôm nay** | Đếm số liều trong ngày của `dose_logs` | Tự động tính | Format: `"hôm nay 2/4 liều"`. Thanh tiến trình trực quan đạt 50%. |
| **Calendar Tháng (Chấm màu trạng thái)** | Ma trận lịch tháng (T2 $\rightarrow$ CN) | Render lịch tự động | **Quy tắc màu chấm tròn từng ngày:**<br>• Xanh lá (`#16A34A`): Đã uống đủ 100% liều trong ngày.<br>• Vàng hổ phách (`#F59E0B`): Có liều bị Quên (quá 2 giờ chưa uống).<br>• Đỏ (`#DC2626`): Người dùng chủ động bấm "Bỏ liều".<br>• Xám nhạt: Ngày chưa đến (đã lên lịch sẵn).<br>Chạm vào 1 ngày bất kỳ $\rightarrow$ Xem chi tiết các liều thuốc của ngày đó. |
| **Danh sách các liều thuốc trong ngày** | Bảng `dose_schedules` | Sắp xếp theo giờ tăng dần | Mỗi liều hiển thị: Giờ uống (08:00, 12:00, 20:00), Tên thuốc, Hàm lượng, Số lượng uống ("1 viên sau ăn"), và 3 nút hành động: **[Đã uống]** · **[Nhắc lại sau 15p]** · **[Bỏ liều]**. |
| **Nút "+ Thêm đơn thuốc / Thêm thuốc"** | Kích hoạt thêm thuốc mới | Chạm nút | Mở Bottom Sheet lựa chọn: Nhập thủ công hoặc Chụp ảnh đơn thuốc qua AI Camera. |
| **Cảnh báo Tương tác Thuốc tự động** | Bảng `drug_interaction_rules` | Đối chiếu tự động khi thêm thuốc | **Logic an toàn lâm sàng (BR-106):** Ngay khi người dùng chọn hoạt chất thuốc mới, hệ thống tự động kiểm tra chéo với toàn bộ các thuốc đang uống trong tab `Đang dùng`. Nếu có tương tác nguy hiểm $\rightarrow$ Bật cảnh báo đỏ toàn màn hình kèm cơ chế bệnh sinh trước khi cho phép lưu. |

---

## SCR-12: Nhập kết quả cận lâm sàng đa phương thức (`Camera / CSYT / Manual`)
*Quy trình nạp dữ liệu cận lâm sàng 3 bước chuẩn y tế: Xét nghiệm, CĐHA, GPB.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu (Nguồn dữ liệu) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|
| **BƯỚC 1: Chọn Loại kết quả** | 3 Thẻ lớn: `Xét nghiệm` · `Chẩn đoán hình ảnh` · `Giải phẫu bệnh` | Chạm chọn thẻ (Radio Card) | **Logic:** Chọn loại kết quả sẽ quyết định cấu trúc form nhập liệu chi tiết ở Bước 3. |
| **BƯỚC 2: Chọn Cách thức nạp** | 3 Phương thức: `Nhập thủ công` · `Từ link CSYT` · `AI Camera` | Chạm chọn phương thức | **Logic phân nhánh:**<br>• Thủ công $\rightarrow$ Mở form nhập trường.<br>• Link CSYT $\rightarrow$ Mở form nạp link và captcha.<br>• Camera $\rightarrow$ Kích hoạt camera chụp ảnh tài liệu. |
| **BƯỚC 3a: Thông tin chung bắt buộc** | Người dùng nhập | Text input & DatePicker | Ngày thực hiện (bắt buộc $\le \text{now()}$), Nơi thực hiện (`facility_name`), Bác sĩ thực hiện/chỉ định. |
| **BƯỚC 3b (Xét nghiệm - Thủ công): Danh sách dòng chỉ số động** | Người dùng bấm "+ Thêm chỉ số" | Thêm dòng động (Dynamic Form Array) | Mỗi dòng gồm: Tên chỉ số (Combobox có tìm kiếm theo danh mục `analyte_definitions`), Giá trị đo được (Bàn phím số), Đơn vị (Tự động điền theo chỉ số), Nút xoá dòng. |
| **Khối "Đề xuất phân loại nhóm XN"** | Thuật toán `ClassifyLabCategory` (Chương 5.5) | Tự động tính toán khi có dữ liệu | **Logic (BR-110, BR-111):** Chỉ xuất hiện khi có $\ge 1$ dòng chỉ số có giá trị. Đếm số lượng chỉ số thuộc từng nhóm (`HH`, `SH`, `VS`, `PT`, `DT`). Nhóm nào chiếm đa số sẽ được hệ thống tự động chọn làm phân loại chính của phiếu. Nếu có $>1$ nhóm ngang nhau $\rightarrow$ Cảnh báo "Phiếu đa nhóm". |
| **BƯỚC 3c (CĐHA - Thủ công): Danh sách tổn thương dạng khối** | Người dùng bấm "+ Thêm tổn thương" | Thêm tổn thương động | Mỗi tổn thương gồm: Loại (`Khối u đặc`, `Khối u nang`, `Khác`), Vị trí giải phẫu (`Bên phải`, `Bên trái`, `Lan toả`), Kích thước ($\text{mm}$), Checkbox: **Tổn thương đích (RECIST)**. |
| **BƯỚC 3d (GPB - Thủ công): Hoá mô miễn dịch (IHC)** | Người dùng bấm "+ Thêm dấu ấn" | Thêm dấu ấn động | Danh sách dấu ấn: `Ki-67`, `ER`, `PR`, `HER2`, `PD-L1`, `TTF-1`, `CK7`, `CK20`,... Kết quả: `Dương tính (+)` / `Âm tính (-)` / Tỷ lệ phần trăm ($\%$). |
| **BƯỚC 3f (Từ link CSYT): Ô Link, User, Pass, Captcha** | Người dùng điền thông tin bệnh viện cung cấp | Form input có tải ảnh captcha động | **Quy tắc an toàn (BR-116):** Mật khẩu và thông tin đăng nhập CHỈ SỬ DỤNG MỘT LẦN duy nhất trên RAM để tải kết quả, tuyệt đối KHÔNG lưu trữ mật khẩu bệnh viện vào cơ sở dữ liệu. |
| **BƯỚC 3g (AI Camera): OCR Trích xuất & Độ tin cậy** | Cloud Vision / LLM OCR Service | Chụp ảnh phiếu $\rightarrow$ Xử lý nhận dạng | **Quy tắc minh bạch dữ liệu:** Trả về từng trường bóc tách được kèm thanh điểm tin cậy (Confidence score). Trường nào có độ tin cậy $<80\%$ sẽ được tô màu hổ phách cảnh báo "Cần người dùng kiểm tra lại". Dữ liệu chỉ được lưu khi người dùng bấm xác nhận. Ảnh gốc được lưu vào MinIO S3 để làm căn cứ pháp y đối chiếu. |

---

## SCR-13: Trợ lý AI Y tế Đa ngữ cảnh (`AI Assistant`)
*Hội thoại y tế thông minh, trích dẫn minh bạch nguồn hồ sơ bệnh án cá nhân.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu (Nguồn dữ liệu) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|
| **Lịch sử hội thoại (Chat stream)** | Bảng `ai_conversations` & `ai_messages` | Tự động tải theo phiên | Phân tách tin nhắn của `user` và câu trả lời của `assistant`. Hỗ trợ streaming text mượt mà. |
| **Gợi ý câu hỏi nhanh (Prompt Chips)** | Hệ thống sinh theo ngữ cảnh bệnh án mới nhất | Chạm chip | **Logic:** Tự động sinh dựa trên dữ liệu mới nạp: "Giải thích kết quả HbA1c 6,6% của tôi", "Chỉ số men gan tăng có nguy hiểm không?", "Thuốc Metformin uống lúc nào tốt nhất?". |
| **Khối Trích dẫn nguồn (Citations)** | Bảng `ai_messages.cited_resources` | AI đính kèm metadata | **Quy tắc minh bạch y khoa:** Mỗi nhận định đều kèm chip dẫn chứng cụ thể: `[Phiếu XN Sinh hoá ngày 20/10/2026]` hoặc `[Đơn thuốc Bệnh viện Bạch Mai]`. Chạm chip $\rightarrow$ Mở thẳng tài liệu gốc để kiểm chứng. |
| **Cảnh báo Miễn trừ Y tế bắt buộc** | Cố định chân màn hình chat | Text cố định | *"Trợ lý AI D-Health chỉ cung cấp thông tin giải thích tham khảo, không thay thế chẩn đoán và chỉ định điều trị của bác sĩ chuyên khoa"*. |

---

## SCR-14: Mạng lưới Chăm sóc & Chia sẻ Bác sĩ (`Care Network`)
*Quản lý danh bạ bác sĩ điều trị, đặt lịch khám và kiểm soát quyền chia sẻ hồ sơ có thời hạn.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu (Nguồn dữ liệu) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|
| **Lịch hẹn khám sắp tới** | Bảng `appointments` | Bác sĩ xếp lịch hoặc người dùng đặt | Hiển thị: Thứ, Ngày/Tháng, Giờ khám, Tên bác sĩ, Chuyên khoa, Bệnh viện. Tự động gửi thông báo nhắc trước 1 ngày và trước 2 giờ khám. |
| **My Care Team (Đội ngũ bác sĩ của tôi)** | Bảng `doctors` gắn cờ `in_care_team = true` | Người dùng thêm hoặc hệ thống tổng hợp | Danh sách avatar tròn. Chạm vào 1 bác sĩ $\rightarrow$ Hiển thị chi tiết: Họ tên, Chuyên khoa, CSYT, SĐT (Nút **Gọi**), Email (Nút **Email**), Nút **Nhắn tin / Video**, và Nút **"Gửi hồ sơ trước khám"**. |
| **Nút "+ Thêm bác sĩ"** | Kích hoạt Bottom Sheet | Chạm nút | Mở form nhập: Họ tên (bắt buộc), Chuyên khoa, Cơ sở y tế, Số điện thoại hoặc Email (bắt buộc có ít nhất 1 trong 2 để liên lạc). |
| **Khối "Ai được xem dữ liệu của tôi?"** | Bảng `share_grants` | Query các quyền chia sẻ đang hiệu lực | Hiển thị: `"{n} người đang có quyền · {m} hết hạn sau {x} ngày"`. Nút "Quản lý" $\rightarrow$ Mở danh sách quyền truy cập (BR-03). |
| **Cơ chế Thu hồi quyền chia sẻ tức thì** | Bảng `share_grants` | Chạm nút "Thu hồi" | **Logic bảo mật (BR-133):** Người dùng có quyền huỷ quyền xem của bất kỳ bác sĩ nào bất kỳ lúc nào. Khi bấm thu hồi $\rightarrow$ Link chia sẻ bị vô hiệu hoá ngay lập tức, token bị thu hồi. |

---

## SCR-15: Thông tin người dùng & Định danh eKYC (`Profile`)
*Quản lý định danh công dân, bảo mật tài khoản và thông tin hành chính y tế nhạy cảm.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu (Nguồn dữ liệu) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|
| **Huy hiệu "Đã xác thực định danh điện tử"** | Bảng `members.ekyc_verified_at` | Kết quả từ luồng quét CCCD gắn chip eKYC | Đã xác thực: Hiện tích xanh chính chủ. Chưa xác thực: Hiện nút "Xác thực ngay". |
| **Số CCCD (Căn cước công dân)** | Bảng `members.national_id_enc` | Bàn phím số (12 chữ số) | **Quy tắc bảo vệ dữ liệu cá nhân (BR-140, BR-143):** Bắt buộc mã hoá AES-256 trong CSDL. Trên giao diện bắt buộc che mờ bảo mật: `0790******12`. Chạm vào ô $\rightarrow$ Yêu cầu xác thực sinh trắc FaceID/Vân tay mới hiển thị đầy đủ. |
| **Số thẻ BHYT** | Bảng `members.insurance_no_enc` | Bàn phím chữ và số | **Format chuẩn Việt Nam (BR-140):** 15 ký tự (2 chữ cái đầu là mã đối tượng + 13 chữ số mã thẻ). Mã hoá cấp trường trong CSDL. |
| **Thông tin thể chất: Nhóm máu, Chiều cao, Cân nặng** | Bảng `members` | Select dropdown & Number input | Nhóm máu chọn từ enum (A, B, AB, O, Rh). Chiều cao ($50 - 230\text{ cm}$), Cân nặng ($2 - 300\text{ kg}$). Thay đổi chiều cao/cân nặng tại đây sẽ cập nhật vào chỉ số tính toán BMI toàn ứng dụng. |
| **Toggle "MFA & Đăng nhập sinh trắc học"** | Bảng `users.mfa_enabled` | Nút gạt Switch | Bật/Tắt bảo mật 2 lớp qua SMS OTP hoặc Authenticator App. |

---

## SCR-16: Quản lý Hồ sơ Gia đình & Phân quyền Đồng thuận (`Family`)
*Quản lý đa hồ sơ người thân, thực thi nghiêm ngặt Cổng đồng thuận (Consent Gate) Nghị định 13/2023/NĐ-CP.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu (Nguồn dữ liệu) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|
| **Thanh ngang chuyển đổi hồ sơ thành viên** | Bảng `members` theo `owner_user_id` | Chạm avatar ngang | Liệt kê toàn bộ các thành viên trong gia đình (VD: Khang, Hà, An, Huy, Lan). Chạm vào thành viên nào thì đổi ngay lập tức hồ sơ đang xem toàn cục. |
| **Nút "+ Thêm người thân"** | Kích hoạt luồng tạo hồ sơ mới | Chạm nút | Mở form nhập: Họ tên, Ngày sinh, Giới tính, Quan hệ (`spouse`, `child`, `parent`, `other`), Nhóm máu, SĐT/Email. |
| **Rào cản Đồng thuận Người lớn $\ge 18$ tuổi (Consent Gate)** | Bảng `family_member_consents` | Tự động tính tuổi từ `dob` | **Quy chuẩn Pháp lý Tối cao Nghị định 13 (BR-01, BR-151):**<br>• Nếu thành viên **$\ge 18$ tuổi**: Chủ tài khoản KHÔNG ĐƯỢC XEM bất kỳ dữ liệu y tế nào khi người đó chưa đồng ý.<br>• Màn hình hiển thị trạng thái: *"Đang chờ đồng thuận · Lời mời đã gửi qua SĐT 0912***456"*. Toàn bộ chỉ số, bệnh án đều bị khoá và che mờ.<br>• Khi người thân đăng nhập và bấm "Đồng ý chia sẻ" $\rightarrow$ CSDL cập nhật `consent_status = 'granted'` $\rightarrow$ Dữ liệu mới được giải mã hiển thị. |
| **Cơ chế Giám hộ Trẻ em $<18$ tuổi** | Bảng `members` | Tự động kiểm tra tuổi | **Quy chuẩn giám hộ (BR-02):** Thành viên dưới 18 tuổi thuộc quyền quản lý trực tiếp của người giám hộ (Chủ tài khoản), không cần bước phê duyệt Consent Gate. |
| **Nút "Mời người thân tự quản lý"** | Bảng `family_members.linked_user_id` | Chạm nút gửi lời mời | Gửi SMS/Email chứa liên kết định danh. Khi người thân tạo tài khoản riêng $\rightarrow$ Hồ sơ được chuyển sang cơ chế liên kết tài khoản độc lập (Self-managed). |

---

## SCR-17: Thẻ Y tế Khẩn cấp SOS & Offline QR Ký số (`Emergency`)
*Hộ chiếu cấp cứu khẩn cấp, quét QR truy cập không cần internet, bảo vệ tính mạng trong giờ vàng.*

| Dòng thông tin / Phần tử UI | Lấy từ đâu (Nguồn dữ liệu) | Cách thức nhập / Nạp dữ liệu | Logic xử lý, công thức cộng trừ nhân chia & Tương quan input |
|---|---|---|---|
| **Toggle "Hiển thị trên màn hình khoá"** | Setting thiết bị / Bảng `emergency_cards` | Nút gạt Switch | Cho phép hiển thị widget tóm tắt thông tin y tế khẩn cấp ngoài màn hình khoá điện thoại (iOS Medical ID / Android Lockscreen Widget). |
| **Ô Nhóm Máu (Màu đỏ nổi bật cực lớn)** | Bảng `members.blood_type` | Tự động lấy từ hồ sơ | Hiển thị chữ to đậm (VD: **O+** hoặc **AB-**). Thông tin quan trọng số 1 cho bác sĩ cấp cứu khi cần truyền máu khẩn cấp. |
| **Khối Thông tin Sống còn: Dị ứng, Bệnh nền, Thuốc** | Query tự động từ `AllergyItem`, `conditions`, `medications` | Tự động tổng hợp | Liệt kê nhanh các thông tin tử huyệt: Dị ứng Penicillin, Bệnh Đái tháo đường Type 2, Thuốc chống đông máu Warfarin đang uống. Người dùng có quyền bật/tắt từng mục hiển thị trên thẻ. |
| **Khối Danh bạ Liên hệ Khẩn cấp (ICE Contacts)** | Bảng `emergency_contacts` | Chạm vào số điện thoại | Tên người thân, mối quan hệ ("Vợ", "Con trai"), Số điện thoại. Chạm vào $\rightarrow$ Hệ thống tự động kích hoạt cuộc gọi điện thoại thoại ngay lập tức mà không cần mở khoá máy. |
| **Nút lớn đỏ "GỌI CẤP CỨU 115"** | Hệ thống viễn thông thiết bị | Chạm nút lớn | **Logic an toàn (BR-163):** Kích hoạt cuộc gọi trực tiếp đến tổng đài cấp cứu y tế 115. Tự động gửi tin nhắn SMS chứa toạ độ GPS vị trí hiện tại cho danh bạ khẩn cấp ICE. |
| **Mã QR Khẩn cấp Cứu sinh Offline Ký số ECDSA** | Thuật toán Ký số mật mã học `OfflineQrSigner` | Hiển thị mã QR tĩnh/động | **Thuật toán Offline QR Chống giả mạo (Chương 5.6):**<br>• Dữ liệu thẻ được nén thành chuỗi JSON siêu gọn (Nhóm máu, Dị ứng nặng, Thuốc nguy hiểm, 2 SĐT khẩn cấp).<br>• Được ký số bằng thuật toán **ECDSA P-256** với private key của hệ thống.<br>• Nhân viên y tế dùng bất kỳ máy quét QR nào quét mã $\rightarrow$ Đọc được ngay lập tức thông tin cứu mạng trên trình duyệt di động mà **KHÔNG CẦN KẾT NỐI MẠNG INTERNET (Offline Access)**.<br>• Mỗi lượt quét online đều ghi vết Audit log vào hệ thống. |

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
