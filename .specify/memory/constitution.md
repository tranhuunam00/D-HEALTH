# D-HEALTH PROJECT CONSTITUTION

> [!IMPORTANT]
> Đây là **Hiến pháp Kỹ thuật Tối cao** của hệ sinh thái D-Health. Mọi Đặc tả tính năng (`spec.md`), Kế hoạch kiến trúc (`plan.md`), Danh sách tác vụ (`tasks.md`) và toàn bộ mã nguồn sinh ra bắt buộc phải tuân thủ 100% các điều khoản dưới đây mà không có bất kỳ ngoại lệ nào.

---

## 1. CÁC NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)

### 0. KỶ LUẬT TÁI THẨM ĐỊNH KỸ NĂNG & QUY CHUẨN ĐỊNH KỲ (PERIODIC 30-MINUTE REVIEW MANDATE)
1. **Chu kỳ bắt buộc**: Cứ sau **mỗi 30 phút** làm việc liên tục hoặc trước khi bắt đầu bất kỳ một Task/Phase/Màn hình mới nào, AI Agent **BẮT BUỘC PHẢI ĐỌC LẠI TOÀN BỘ 100% CÁC SKILLS VÀ RULES**:
   - Đọc lại `GEMINI.md` và `.specify/memory/constitution.md`.
   - Đọc lại toàn bộ danh mục skills (`code-convention`, `fe-development`, `spec-kit`, `web-security-auditor`, `db-migration`).
2. **Mục đích bất biến**: Triệt tiêu hoàn toàn hiện tượng quên ngữ cảnh (Context Drift), ngăn ngừa sinh mã tuỳ tiện ("vibe coding"), duy trì tính nghiêm ngặt tuyệt đối của TDD 4 chiều, kiến trúc DDD, chuẩn thiết bị và an toàn dữ liệu y tế.
3. **Cam kết hành động**: Tuyệt đối không sinh code khi chưa kiểm chứng lại sự phù hợp với toàn bộ rule và skill.

### I. NGUYÊN TẮC ĐẢO CHIỀU ĐẶC TẢ (SPEC-DRIVEN DEVELOPMENT - SDD)
1. **Code phục vụ Đặc tả (Code Serves Specifications)**: Mọi dòng code, schema database, API endpoint đều là hệ quả trực tiếp từ Đặc tả (`spec.md`) và Kế hoạch (`plan.md`). Tuyệt đối cấm "vibe coding" hoặc viết code trước khi có spec được phê duyệt.
2. **Không có dữ liệu giả định tùy tiện (Zero Unverified Defaults)**: Mọi trường thông tin hiển thị trên giao diện phải có nguồn gốc rõ ràng trong CSDL, phương thức nhập liệu, hoặc thuật toán tính toán cụ thể.
3. **Sửa lỗi từ gốc (Spec-First Debugging)**: Khi phát hiện sai lệch hành vi, trước hết phải cập nhật Spec và Plan, sau đó mới tiến hành sửa code và test.

### II. NGUYÊN TẮC BẮT BUỘC VỀ TDD (TEST-DRIVEN DEVELOPMENT - NON-NEGOTIABLE)
1. **Quy tắc viết TDD từng hàm một (One-Function-At-A-Time TDD Workflow)**:
   - Bắt buộc phải thực hiện theo chu trình nguyên tử cho **TỪNG HÀM RIÊNG BIỆT (ONE FUNCTION AT A TIME)**:
     - Viết Unit Test cho hàm đó trước (Red phase).
     - Viết cài đặt tối thiểu cho riêng hàm đó (Green phase).
     - Xác nhận ma trận kiểm thử 4 chiều (Input, Output, Error, Logic) và refactor ($\le 30$ dòng, $\le 3$ tham số).
     - **Chỉ khi hàm này hoàn thành 100% test mới chuyển sang viết hàm tiếp theo**. Tuyệt đối cấm viết ồ ạt nhiều hàm rồi mới quay lại viết test đối phó.
2. **Quy tắc 100% mọi hàm mới bắt buộc có test (100% Function Testing Mandate)**:
   - Bất kỳ hàm mới nào (Utility, Helper, Domain Service, Entity Method, Value Object Method, Use Case, API Handler) khi được tạo ra **BẮT BUỘC 100% PHẢI CÓ FILE TEST ĐI KÈM** (`*.spec.ts` hoặc `*.test.ts`).
   - **Không có test = Không nghiệm thu (Definition of Done = Failed)**. Tuyệt đối không chấp nhận bất kỳ mã nguồn chức năng nào được viết mà thiếu file kiểm thử tương ứng.
3. **Kỷ luật chạy lại toàn bộ test trước mỗi lần commit (100% Full-Suite Test Pass Mandate Before Commit)**:
   - Trước mỗi lần thực hiện lệnh `git commit`, **BẮT BUỘC PHẢI CHẠY LẠI TOÀN BỘ TEST SUITE CỦA CẢ HỆ THỐNG** (Cả Backend và Frontend):
     ```bash
     npm --prefix backend test && npm --prefix frontend test
     ```
   - **100% tất cả các test suites phải PASSED (Exit code = 0)**. Dù chỉ có **1 test bị FAIL**, **TUYỆT ĐỐI CẤM COMMIT**.
4. **Ma trận kiểm thử 4 chiều bắt buộc**:
   - **INPUT**: Happy path, Giá trị biên (Boundary: 0, số âm, chuỗi rỗng `""`, min, max, mảng rỗng `[]`), Dữ liệu thiếu/rác (`null`, `undefined`, NaN, sai định dạng).
   - **OUTPUT**: Khớp tuyệt đối kiểu dữ liệu, bảo toàn tính bất biến (Immutability).
   - **ERROR**: Khẳng định đúng class lỗi (`instanceof`), mã lỗi (`code`), thông điệp (`message`) và trường vi phạm (`details`).
   - **LOGIC NGHIỆP VỤ & INVARIANTS**: Đúng công thức y khoa (WHO, AHA, ESC, RECIST 1.1, ADA, LOINC), tính độc lập giữa các test case.
5. **Cú pháp Arrange - Act - Assert (AAA)**: Trình bày mạch lạc, không gộp nhiều assert mơ hồ trong một test case.

### III. NGUYÊN TẮC THIẾT KẾ HƯỚNG MIỀN (TACTICAL DDD)
1. **Ubiquitous Language (Ngôn ngữ phổ biến)**: Đồng bộ 100% thuật ngữ giữa BA (`5_6291670095529781835.md`), Mã nguồn và CSDL: `BiometricRecord`, `AdherenceCalculator`, `MedicationPlan`, `DoseSchedule`, `EmergencyCard`, `Condition`, `ImagingStudy`, `ClinicalReport`.
2. **Value Objects**:
   - Các thuộc tính có logic thẩm định (`BloodPressure`, `HeartRate`, `BloodType`, `Dosage`, `LoincCode`) phải là Value Object.
   - **Bất biến (Immutable)** (`Object.freeze()`) và **Tự thẩm định hợp lệ (Self-Validating)** ngay tại Constructor.
3. **Aggregate Roots & Encapsulation**:
   - Mọi thay đổi trạng thái của các thực thể con phải thông qua Aggregate Root tương ứng. Không chọc trực tiếp vào thực thể con từ bên ngoài.
4. **Kiến trúc phân tầng Clean Architecture**:
   `Controller / Screen` (Chỉ nhận/trả dữ liệu) $\rightarrow$ `Use Case / Service` (Nghiệp vụ thuần túy) $\rightarrow$ `Repository Interface` (Tầng Domain khai báo) $\rightarrow$ `Infrastructure` (Cài đặt SQLite / Postgres / BLE).

### IV. NGUYÊN TẮC PHÂN TÁCH THIẾT BỊ TRẢI NGHIỆM (DEVICE EXPERIENCE SEPARATION)
1. **Người dùng cuối: Ưu tiên Mobile tuyệt đối (User / Patient / Family Mobile-First)**:
   - 100% màn hình bệnh nhân, người nhà theo dõi sức khỏe chủ động, đo chỉ số sinh trắc IoT BLE, quản lý đơn thuốc, xem hồ sơ sức khỏe và Thẻ cấp cứu SOS thiết kế chuẩn Mobile (390 × 844 iPhone, 360 × 800 Android).
   - **Atomic Design**: Atoms, Molecules, Organisms, Screens (không quá 200 dòng UI). Tách Dumb UI và Custom Hook.
   - **State 5 trạng thái**: `Loading` (Skeleton), `Empty` (CTA), `Error` (Retry), `Data`, `Offline/Syncing`.
   - **Thumb Zone**: Touch Target $\ge 44 \times 44\text{ pt}$, tập trung vùng ngón tay cái, tương phản chữ $\ge 4.5:1$.
   - **Modal Bottom Sheet**: Dùng Bottom Sheet (bo góc 28px, overlay tối) cho mọi thao tác nhập liệu nhanh thay vì chuyển trang.
   - **In-Frame Scroll**: Danh sách dài chỉ hiện tối đa **5 mục mới nhất**, phần còn lại cuộn nội bộ trong khung.
   - **Carousel Chip Ngang**: Dùng chip pill cuộn ngang lọc danh mục, không dùng dropdown.
2. **Quản trị & Y tế chuyên sâu: Ưu tiên PC / Desktop tuyệt đối (Admin & Clinical PC-First)**:
   - Toàn bộ giao diện Quản trị hệ thống (Admin Console), Trạm điều dưỡng (Nurse Station), Bảng theo dõi lâm sàng Bác sĩ (Doctor Clinical Dashboard) thiết kế chuẩn PC ($\ge 1280\text{px}$, $1440\text{px}$, $1920\text{px}$).
   - **Desktop Tri-Layout**: Sidebar trái cố định, Topbar toàn cục, Content Area rộng rãi đa cột.
   - **High-Density Data Grids**: Bảng dữ liệu mật độ cao có lọc đa cột, sorting, phân trang server-side, ghim cột, xuất Excel/PDF/FHIR.
   - **Multi-Panel Clinical Dashboard**: Hiển thị đồng thời biểu đồ xu hướng sinh trắc học dài hạn, kết quả xét nghiệm liên hoàn và trình xem phim chụp X-quang/CT/MRI (DICOM Viewer) trên cùng một màn hình lớn.
   - **Tối ưu thao tác phím tắt (Keyboard Shortcuts)**: Nhập liệu, duyệt đơn thuốc và gắn nhãn ICD-10 tốc độ cao.

### V. AN TOÀN Y TẾ & BẢO VỆ DỮ LIỆU CÁ NHÂN (SECURITY & COMPLIANCE)
1. **Tuân thủ Nghị định 13/2023/NĐ-CP**:
   - Thành viên gia đình từ đủ 18 tuổi trở lên bắt buộc phải có bước gửi yêu cầu và nhận được sự Đồng thuận (Consent Gate) trước khi người quản lý hồ sơ có thể xem dữ liệu bệnh án chi tiết.
   - Quyền chia sẻ dữ liệu cho bên thứ ba / Bác sĩ bắt buộc phải có thời hạn hiệu lực (tối đa 7 ngày) và cơ chế thu hồi tức thì.
2. **Bảo mật Dữ liệu Đăng nhập CSYT (Ephemeral Credential Security)**:
   - Thông tin đăng nhập tra cứu kết quả từ cổng bệnh viện (mật khẩu 1 lần, captcha) chỉ được lưu tạm trên RAM, tuyệt đối không ghi xuống CSDL hoặc log file.
3. **Thẻ Cấp cứu Offline (Encrypted Offline SOS)**:
   - Dữ liệu cấp cứu (Nhóm máu, Dị ứng nguy hiểm, Liên hệ khẩn cấp) được mã hoá ký số ECDSA tạo thành mã QR Offline, đọc được ngay cả khi không có kết nối Internet.
4. **Zero PII Logging**:
   - Tuyệt đối không log thông tin nhạy cảm của bệnh nhân (CCCD, Họ tên, Bệnh nền, Token xác thực) ra console hoặc monitoring logs.

### VI. NGUYÊN TẮC BẤT BIẾN VỀ MIGRATION CƠ SỞ DỮ LIỆU & RÀ SOÁT TÁC ĐỘNG (DATABASE MIGRATION & IMPACT AUDIT MANDATE)
1. **Zero-Direct-Schema-Edit (Cấm sửa trực tiếp DB & Cấm sửa Migration cũ)**:
   - Bất kỳ thay đổi cấu trúc dữ liệu nào **BẮT BUỘC PHẢI TẠO 1 FILE MIGRATION MỚI** (`XXX_name.up.sql` và `XXX_name.down.sql`).
   - Cấm sửa đổi file migration đã merge hoặc đã apply. Migration là nhật ký bất biến (Immutable History).
2. **Pre-Migration Codebase Impact Analysis (Giao thức thẩm tra 5 lớp)**:
   - Trước khi apply migration, bắt buộc phải rà soát mã nguồn: Domain (Entities, Value Objects), Infrastructure (Repositories, SQL, Mappers), Application (DTOs, Validation Zod), Frontend (TypeScript types, TanStack queries, Screens, Forms), Spec-Kit (`data-model.md`, `spec.md`).
3. **Mô hình Expand-and-Contract & Zero-Downtime**:
   - Thêm cột `NOT NULL` phải theo 3 pha hoặc có `DEFAULT` để không làm sập dữ liệu hiện có.
   - Đổi tên cột phải qua giai đoạn đồng bộ dữ liệu (dual-write/trigger), không rename đột ngột.
   - Tạo Index trên PostgreSQL production bắt buộc dùng `CREATE INDEX CONCURRENTLY`.
4. **Khả nghịch 2 chiều (Reversibility) & Sổ cái Migration (`_migrations`)**:
   - Bắt buộc kiểm thử thành công chu kỳ: `UP` $\rightarrow$ `DOWN` (Rollback sạch) $\rightarrow$ `UP` lại trên dev database.
   - Quản lý trạng thái và mã băm SHA-256 qua bảng `_migrations`.

### VII. NGUYÊN TẮC QUY CHUẨN ĐỘ DÀI HÀM, ĐỘ DÀI FILE & PHÂN TÁCH MÃ NGUỒN (CODE CONVENTION & DECOMPOSITION)
1. **Quy chuẩn Định lượng về Độ Dài Hàm & Tham Số**:
   - Hàm thông thường: Tối đa **$\le 30$ dòng code**; hàm nghiệp vụ/thuật toán phức tạp: tối đa **$50$ dòng code**. Vượt quá $\rightarrow$ Bắt buộc tách helper function hoặc sub-service.
   - Số lượng tham số: Tối đa **$\le 3$ tham số**. Từ 4 tham số trở lên $\rightarrow$ Bắt buộc đóng gói thành Parameter Object / Interface DTO.
   - Độ dài dòng: Tối đa **100 – 120 ký tự**.
   - Mức độ lồng ghép: Tối đa **$\le 2$ cấp** lồng nhau (`if`, `for`, `while`). Áp dụng Guard Clauses & Early Return để làm phẳng code.
2. **Quy chuẩn Định lượng về Độ Dài File & Trách Nhiệm Duy Nhất (SRP)**:
   - File nghiệp vụ (Domain, Service, Repo, Controller): Tối đa **$\le 200 - 300$ dòng code**. Cấm tuyệt đối các file "God Object" vượt quá $400 - 500$ dòng.
   - File màn hình UI: Tối đa **$\le 200$ dòng code UI**. Bắt buộc tách logic sang Custom Hook riêng (`useDailyCheckin.ts`) và các Presentational Components con.
   - File Unit Test: Tối đa **$\le 300 - 400$ dòng code**. Tách nhiều file spec theo kịch bản nếu cần.
   - **Nguyên tắc "1 File / 1 Trách nhiệm chính (1 Primary Export)"**: 1 Entity/file, 1 Value Object/file, 1 Service/file, 1 Hook/file.
   - **Triệt tiêu file "thùng rác"**: Cấm tạo `utils.ts`, `helpers.ts` gom nhét hỗn tạp. Tách theo module: `date-formatter.ts`, `crypto-helper.ts`.
   - **Tách riêng Types & Hằng số**: Types đặt trong `types/` hoặc `*.types.ts`; Hằng số đặt trong `constants/` hoặc `*.constants.ts`.

---

## 2. CỔNG KIỂM SOÁT HIẾN PHÁP (CONSTITUTION CHECK GATES)

Mọi Kế hoạch triển khai (`plan.md`) trước khi được chuyển thành danh sách công việc (`tasks.md`) bắt buộc phải vượt qua bảng kiểm soát sau:

- [ ] **Gate 0 (30-Minute Review Verified)**: Đã đọc lại toàn bộ skills và hiến pháp kỹ thuật trong vòng 30 phút gần nhất?
- [ ] **Gate 1 (Spec Alignment)**: Đã có file `spec.md` với đầy đủ User Stories được phân cấp ưu tiên (P1, P2, P3) và Acceptance Criteria (Given-When-Then)?
- [ ] **Gate 2 (Data Feasibility)**: Mọi trường dữ liệu hiển thị đã được định vị chính xác nguồn gốc (Bảng nào, Cột nào, Cách nhập liệu nào) và không có trường default vô căn cứ?
- [ ] **Gate 3 (TDD Matrix & One-By-One Execution)**: Đã chuẩn bị ma trận 4 chiều (Input / Output / Error / Logic) cho 100% các hàm mới, cam kết viết test từng hàm một và chạy lại toàn bộ test trước mỗi commit?
- [ ] **Gate 4 (DDD Architecture)**: Đã đóng gói các thuộc tính nhạy cảm thành Value Objects bất biến và xác định đúng Aggregate Root?
- [ ] **Gate 5 (Device Experience Validation)**: Màn hình người dùng cuối đã ưu tiên Mobile-First (Thumb Zone, Bottom Sheet, In-frame $\le 5$ mục) và màn Admin đã chuẩn PC-First (High-density grid, Multi-panel dashboard)?
- [ ] **Gate 6 (Decree 13 Compliance)**: Đã thiết lập cơ chế Consent Gate cho thành viên $\ge 18$ tuổi và che chắn PII?
- [ ] **Gate 7 (DB Migration & Codebase Impact Audit)**: Mọi thay đổi schema đều có migration mới (UP/DOWN), tuân thủ Expand-and-Contract, đã hoàn tất rà soát tác động 5 lớp (Domain, Repo, DTO, Frontend, Spec) và kiểm thử rollback sạch sẽ?
- [ ] **Gate 8 (Code Convention & Size Limits)**: Hàm $\le 30$ dòng, tham số $\le 3$, file $\le 200-300$ dòng (màn hình $\le 200$ dòng), 1 file 1 trách nhiệm chính, không có file rác `utils.ts`?

---

## 3. QUẢN TRỊ & PHIÊN BẢN (GOVERNANCE)
- **Hiến pháp này có giá trị pháp lý cao nhất trong dự án**.
- Mọi Pull Request, mã nguồn sinh ra bởi AI hoặc lập trình viên nếu vi phạm bất kỳ điều khoản nào của Hiến pháp sẽ bị từ chối sáp nhập (Rejected).

**Phiên bản**: `1.3.0` | **Ngày cập nhật**: `2026-11-04` | **Tổ chức**: `D-HEALTH Engineering Team`
