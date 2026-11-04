# QUY CHUẨN PHÁT TRIỂN DỰ ÁN D-HEALTH (ENGINEERING RULES)

> [!IMPORTANT]
> Toàn bộ quá trình sinh mã nguồn (code generation), tái cấu trúc (refactoring) và thêm mới tính năng trong dự án này **BẮT BUỘC TUÂN THỦ 100% CÁC NGUYÊN TẮC SAU ĐÂY**.

---

## 0. KỶ LUẬT TÁI THẨM ĐỊNH KỸ NĂNG & QUY CHUẨN ĐỊNH KỲ (PERIODIC 30-MINUTE REVIEW MANDATE)
- **Chu kỳ bắt buộc**: Cứ sau **mỗi 30 phút** làm việc liên tục hoặc trước khi bắt đầu bất kỳ một Task/Phase/Màn hình mới nào, AI Agent **BẮT BUỘC PHẢI ĐỌC LẠI TOÀN BỘ 100% CÁC SKILLS VÀ RULES**:
  - Đọc lại toàn bộ `GEMINI.md` và `.specify/memory/constitution.md`.
  - Đọc lại toàn bộ danh mục skills trong hệ thống (`code-convention`, `fe-development`, `spec-kit`, `web-security-auditor`, `db-migration`).
- **Mục đích bất biến**: Triệt tiêu hoàn toàn hiện tượng quên ngữ cảnh (Context Drift), ngăn ngừa sinh mã tuỳ tiện ("vibe coding"), duy trì tính nghiêm ngặt tuyệt đối của TDD 4 chiều, kiến trúc DDD, chuẩn thiết bị và an toàn dữ liệu y tế.
- **Cam kết hành động**: Tuyệt đối không sinh code khi chưa kiểm chứng lại sự phù hợp với toàn bộ rule và skill.

---

## 1. NGUYÊN TẮC BẮT BUỘC VỀ TDD (TEST-DRIVEN DEVELOPMENT)
- **Quy tắc viết TDD từng hàm một (One-Function-At-A-Time TDD Workflow)**:
  - Bắt buộc phải thực hiện theo chu trình nguyên tử cho **TỪNG HÀM RIÊNG BIỆT (ONE FUNCTION AT A TIME)**:
    1. **Bước 1 (Test First)**: Viết file kiểm thử unit test cho hàm đó trước khi viết code thực thi (Red phase).
    2. **Bước 2 (Implementation)**: Viết mã nguồn cài đặt tối thiểu cho riêng hàm đó để test chuyển sang màu xanh (Green phase).
    3. **Bước 3 (Verify & Refactor)**: Chạy test ngay cho hàm đó, kiểm chứng độ dài $\le 30$ dòng, tham số $\le 3$.
    4. **Chỉ khi hàm này hoàn thành 100% và test pass tuyệt đối mới chuyển sang viết hàm tiếp theo**. Tuyệt đối cấm viết ồ ạt nhiều hàm rồi mới quay lại viết test đối phó.
- **Quy tắc 100% mọi hàm mới bắt buộc có test (100% Function Testing Mandate)**: 
  - Bất cứ hàm mới nào (Utility function, Helper, Service method, Domain Entity method, Value Object method, Use Case, API Handler) khi được tạo ra **BẮT BUỘC 100% PHẢI CÓ FILE TEST ĐI KÈM** (`*.spec.ts` hoặc `*.test.ts`).
  - **Không có test = Không nghiệm thu (Definition of Done = Failed)**. Tuyệt đối không bàn giao bất kỳ hàm nào mà thiếu unit test.
- **Kỷ luật chạy lại toàn bộ test trước mỗi lần commit (100% Full-Suite Test Pass Mandate Before Commit)**:
  - Trước mỗi lần thực hiện lệnh `git commit`, **BẮT BUỘC PHẢI CHẠY LẠI TOÀN BỘ TEST SUITE CỦA CẢ HỆ THỐNG** (Cả Backend và Frontend):
    ```bash
    npm test   # (Chạy cả npm --prefix backend test && npm --prefix frontend test)
    ```
  - **100% tất cả các test suites phải PASSED (Exit code = 0)**. Dù chỉ có **1 test bị FAIL**, **TUYỆT ĐỐI CẤM COMMIT**.
- **Kiểm thử tích hợp bắt buộc (Integration Testing Mandate)**:
  - Bên cạnh Unit Test cho từng hàm riêng lẻ, dự án **BẮT BUỘC PHẢI CÓ CÁC BỘ TEST TÍCH HỢP (`*.integration.spec.ts`)**:
    - **Backend API Integration Tests**: Kiểm thử toàn vẹn luồng tương tác thực giữa các tầng (Route -> Middleware -> Service -> Database -> Response Contract) thông qua HTTP server (sử dụng `supertest`), bao gồm kịch bản Auth, CRUD, Role Guard và xử lý lỗi đồng bộ.
    - **Frontend Flow Integration Tests**: Kiểm thử tương tác hoàn chỉnh của người dùng (nhập form -> validate -> gọi API -> cập nhật State 5 pha: `Loading`, `Empty`, `Error`, `Data`, `Offline`).
- **Ma trận kiểm thử 4 chiều bắt buộc cho mỗi hàm (Đặc biệt chú trọng Biên & Ngoại lệ)**:
  1. **INPUT & BIÊN (BOUNDARY CASES)**:
     - Kiểm thử dữ liệu hợp lệ (Happy path).
     - **Kiểm thử giá trị biên bắt buộc**: Số 0, số âm, ngưỡng min, ngưỡng max, chuỗi rỗng `""`, khoảng trắng `"   "`, mảng rỗng `[]`, số thập phân, NaN.
     - Kiểm thử dữ liệu rác/thiếu: `null`, `undefined`, sai định dạng, dữ liệu vượt quá giới hạn độ dài.
  2. **OUTPUT & BẤT BIẾN**:
     - Kết quả trả về phải khớp tuyệt đối contract và kiểu dữ liệu.
     - Đảm bảo hàm **không làm thay đổi (mutate)** tham số truyền vào (Immutability).
  3. **ERROR (DẠNG LỖI & NGOẠI LỆ BẮT BUỘC)**:
     - Kiểm thử đầy đủ các nhánh ném ngoại lệ (`throw new ValidationError`, `throw new NotFoundError`, `throw new ConflictError`, v.v.).
     - Xác nhận chính xác **lớp lỗi (`instanceof`)**, **mã lỗi (`code`)**, **mã HTTP Status (400, 401, 403, 404, 409, 429, 500)**, **thông báo lỗi (`message`)** và **chi tiết trường lỗi (`details`)**.
  4. **LOGIC NGHIỆP VỤ & INVARIANTS**:
     - Kiểm thử đúng công thức tính toán y khoa, ngưỡng phân loại, logic rẽ nhánh nghiệp vụ.
     - Kiểm thử tính độc lập của test (không phụ thuộc thứ tự thực thi).
- **Cấu trúc viết test**: Sử dụng cú pháp **AAA (Arrange - Act - Assert)** rõ ràng cho từng test case.

---

## 2. NGUYÊN TẮC THIẾT KẾ HƯỚNG MIỀN (DOMAIN-DRIVEN DESIGN - DDD)
- **Ubiquitous Language (Ngôn ngữ phổ biến)**:
  - Tên class, hàm, biến, event phải phản ánh chính xác 100% thuật ngữ trong tài liệu BA (`5_6291670095529781835.md`): `BiometricRecord`, `AdherenceCalculator`, `MedicationPlan`, `DoseSchedule`, `EmergencyCard`, v.v.
- **Value Objects**:
  - Các thuộc tính có logic xác thực (như `BloodPressure`, `HeartRate`, `Email`, `Dosage`) phải được đóng gói thành Value Object.
  - Value Object **phải bất biến (Immutable)** (`Object.freeze()`) và **tự thẩm định hợp lệ (Self-Validating)** ngay tại Constructor (ném lỗi nếu dữ liệu không hợp lệ).
- **Aggregate Roots & Entities**:
  - Các thao tác thay đổi dữ liệu hoặc trạng thái nghiệp vụ liên quan đến nhiều đối tượng con phải được thực thi thông qua **Aggregate Root**.
  - Không sửa trực tiếp thực thể con từ bên ngoài.
- **Domain Services & Repositories**:
  - Nghiệp vụ phức tạp bao trùm nhiều đối tượng được tách thành **Domain Service** thuần túy.
  - Tầng Domain chỉ khai báo **Interface Repository**; việc kết nối cơ sở dữ liệu cụ thể (SQLite, Postgres, API) nằm ở tầng Infrastructure.

---

## 3. NGUYÊN TẮC FRONTEND & PHÂN TÁCH THIẾT BỊ TRẢI NGHIỆM (DEVICE EXPERIENCE SEPARATION)

### A. Người Dùng Cuối: Ưu Tiên Màn Mobile Tuyệt Đối (User / Patient / Family Mobile-First)
- **Phạm vi áp dụng**: 100% màn hình dành cho Bệnh nhân, Người nhà, Thành viên gia đình theo dõi sức khỏe chủ động, đo chỉ số sinh trắc IoT BLE, quản lý đơn thuốc & nhắc thuốc, xem hồ sơ sức khỏe và Thẻ cấp cứu.
- **Viewport chuẩn**: Mobile-First (390 × 844 iPhone, 360 × 800 Android).
- **Quy chuẩn UX/UI di động**:
  - **Tách Component Nhỏ (Atomic Decomposition)**: Chia 4 cấp: **Atoms** (Button, Badge, Pill), **Molecules** (MetricRow, SearchBar), **Organisms** (BiometricCard, MedicationPanel), **Screens** (không vượt quá 200 dòng UI). Tách bạch Dumb UI và Custom Hook.
  - **Vòng đời State 5 trạng thái**: Bắt buộc xử lý đủ `Loading` (Skeleton), `Empty` (CTA), `Error` (Retry), `Data`, `Offline/Syncing`.
  - **Công thái học & Vùng chạm (Thumb Zone)**: Touch Target $\ge \mathbf{44 \times 44\text{ pt}}$, tập trung thao tác chính trong tầm với của ngón tay cái, độ tương phản $\ge 4.5:1$ (WCAG 2.1 AA).
  - **Modal Bottom Sheet**: Dùng Bottom Sheet (bo góc trên 28px, overlay tối, thanh kéo 40×5px) cho toàn bộ thao tác nhập liệu nhanh (nhập huyết áp, SPO2, thêm liều thuốc, quét Bluetooth) thay vì mở trang mới.
  - **In-Frame Internal Scroll**: Danh sách dài (kết quả xét nghiệm, lịch sử đo, danh sách bác sĩ) chỉ hiển thị tối đa **5 mục mới nhất**, phần còn lại cuộn nội bộ trong khung `max-height` kèm nhãn dẫn hướng.
  - **Carousel Chip Ngang**: Dùng chip pill cuộn ngang để lọc danh mục, tuyệt đối không dùng dropdown chiếm diện tích màn hình điện thoại.
  - **Design Tokens đồng nhất**: Primary Teal `#1F7A8C`, Gradient `#1F7A8C` $\rightarrow$ `#2F6FDB`. Card bo tròn 20–24px.

### B. Quản Trị & Y Tế Chuyên Sâu: Ưu Tiên Màn PC / Desktop Tuyệt Đối (Admin & Clinical PC-First)
- **Phạm vi áp dụng**: Toàn bộ màn hình dành cho Quản trị viên hệ thống (System Admin), Trạm điều dưỡng (Nurse Station), Bảng theo dõi lâm sàng Bác sĩ (Doctor Clinical Dashboard), Phân tích số liệu vĩ mô.
- **Viewport chuẩn**: PC / Desktop ($\ge 1280\text{px}$, $1440\text{px}$, $1920\text{px}$).
- **Quy chuẩn UX/UI máy tính**:
  - **Bố cục 3 khối chuẩn (Desktop Tri-Layout)**: Sidebar trái cố định (Navigation phân cấp), Topbar (Tìm kiếm bệnh nhân toàn cục, Bộ chọn cơ sở y tế, Thông báo, Profile), Content Area rộng rãi đa cột.
  - **Bảng dữ liệu mật độ cao (High-Density Data Grids)**: Danh sách bệnh nhân, ca bệnh, lịch hẹn với lọc đa cột nâng cao, sắp xếp (sorting), phân trang server-side, ghim cột (sticky column) và xuất dữ liệu (Excel, PDF, HL7 FHIR).
  - **Bảng điều khiển lâm sàng đa chiều (Multi-Panel Dashboard)**: Hiển thị đồng thời biểu đồ xu hướng sinh trắc học dài hạn, kết quả xét nghiệm liên hoàn và trình xem phim chụp X-quang/CT/MRI (DICOM Viewer) trên cùng một màn hình lớn.
  - **Tối ưu hóa thao tác phím tắt (Keyboard Shortcuts)**: Phục vụ nhập liệu, duyệt đơn thuốc và gắn nhãn chẩn đoán ICD-10 tốc độ cao.

---

## 4. KIẾN TRÚC HỆ THỐNG & CODE CONVENTION CHUNG
- **Kiến trúc phân tầng (Clean Architecture)**:
  - `Controller / Screen` (Chỉ nhận input & trả output) ➔ `Service / Use Case` (Nghiệp vụ) ➔ `Repository` (Đọc/ghi DB).
  - Không viết business logic hoặc query DB trong Controller / Screen.
- **Quy chuẩn Định lượng về Độ Dài Hàm & Số Tham Số (Function Constraints)**:
  - **Độ dài hàm**: Tối đa **$\le 30$ dòng code** (hàm nghiệp vụ/thuật toán phức tạp tối đa **$50$ dòng**). Vượt quá ngưỡng $\rightarrow$ **Bắt buộc phân tách** thành helper functions hoặc sub-services.
  - **Số lượng tham số**: Tối đa **$\le 3$ tham số**. Nếu nhận từ 4 tham số trở lên $\rightarrow$ **Bắt buộc đóng gói** thành Parameter Object / Interface DTO.
  - **Độ dài dòng (Line Length)**: Tối đa **100 – 120 ký tự**.
  - **Độ sâu lồng khối**: Tối đa **$\le 2$ cấp** lồng nhau (`if`, `for`, `while`). Áp dụng **Guard Clauses & Early Return** để làm phẳng logic.
- **Quy chuẩn Định lượng về Độ Dài File & Phân Tách File (File Constraints & Separation)**:
  - **File nghiệp vụ (Service, Entity, Controller, Repo)**: Tối đa **$\le 200 - 300$ dòng code**. Tuyệt đối cấm "God Object" file vượt quá **400 - 500 dòng**.
  - **File màn hình UI**: Tối đa **$\le 200$ dòng UI**. Tách riêng Custom Hook (`useScreenLogic.ts`) và các Presentational Components.
  - **File Unit Test**: Tối đa **$\le 300 - 400$ dòng**. Tách nhiều file spec theo kịch bản nếu cần.
  - **Nguyên tắc "1 File / 1 Trách nhiệm chính (1 Primary Export)"**: Mỗi file chỉ chịu trách nhiệm duy nhất cho 1 Entity, 1 Value Object, 1 Service, 1 Hook hoặc 1 Component.
  - **Cấm file "thùng rác" (No Junk-Drawer Files)**: Tuyệt đối cấm các file `utils.ts`, `helpers.ts` gom nhét hỗn tạp; chia theo module: `date-formatter.ts`, `crypto-helper.ts`.
  - **Tách riêng Types & Constants**: Types đặt trong `types/` hoặc `*.types.ts`; Hằng số/Enums đặt trong `constants/` hoặc `*.constants.ts`.
- **Clean Code & Invariants**:
  - Không sử dụng **Magic Numbers** và **Hardcoded Strings**; mọi ngưỡng và hằng số phải đặt trong file `constants` hoặc `config`.
  - Tuân thủ nghiêm ngặt nguyên tắc Single Responsibility Principle (SRP).
- **Bảo mật & Logging**:
  - Tuyệt đối không log thông tin nhạy cảm (PII, Token, Dữ liệu y tế, Mật khẩu).
  - Tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân y tế.
- **Git Commit**:
  - Tuân thủ chuẩn Conventional Commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`.

---

## 5. NGUYÊN TẮC BẮT BUỘC VỀ DATABASE MIGRATION & RÀ SOÁT TÁC ĐỘNG (DATABASE MIGRATION MANDATE)
- **Zero-Direct-Schema-Edit (Cấm sửa trực tiếp DB & Cấm sửa Migration cũ)**:
  - Mọi thay đổi schema (thêm/sửa/xóa bảng, cột, kiểu dữ liệu, index, trigger, enum, seed) **BẮT BUỘC PHẢI TẠO 1 FILE MIGRATION MỚI** theo thứ tự tăng dần (`XXX_descriptive_name.up.sql` và `XXX_descriptive_name.down.sql`).
  - Tuyệt đối cấm chạy lệnh DDL bằng tay trực tiếp trên CSDL.
  - Tuyệt đối cấm sửa đổi các file migration đã committed hoặc đã apply (Lịch sử bất biến - Immutable History).
- **Rà soát tác động toàn diện mã nguồn trước khi Apply (Pre-Migration Codebase Impact Analysis Protocol)**:
  - Trước khi apply hoặc tạo migration, AI Coding Agent và Lập trình viên **BẮT BUỘC PHẢI RÀ SOÁT TOÀN DIỆN MÃ NGUỒN THEO MA TRẬN 5 LỚP**:
    1. **Domain Layer**: Entity properties, Value Objects (self-validating), Domain Events, Invariants.
    2. **Infrastructure Layer**: SQL queries (`SELECT`, `INSERT`, `UPDATE`), Repositories, Entity-Row Mappers.
    3. **Application & API Layer**: DTOs (Request/Response), Controller validation schemas (Zod/Joi), API Contracts.
    4. **Frontend Client Layer**: TypeScript interfaces, API services, TanStack Queries, UI Components, Form inputs, State 5 trạng thái (`Loading`, `Empty`, `Error`, `Data`, `Offline`).
    5. **Spec-Kit & Documentation**: Cập nhật `specs/.../data-model.md` và `specs/.../spec.md`.
- **Mô hình Expand-and-Contract (Zero-Downtime Migration)**:
  - Thêm cột `NOT NULL`: Bắt buộc tạo nullable trước hoặc có `DEFAULT`, chạy script backfill dữ liệu cũ rồi mới áp đặt `NOT NULL`.
  - Đổi tên cột (Rename): Không đổi tên trực tiếp; áp dụng mô hình 3 pha (Expand -> Migrate code -> Contract).
  - Tạo Index trên bảng lớn: Luôn sử dụng `CREATE INDEX CONCURRENTLY` trong PostgreSQL.
- **Tính khả nghịch 2 chiều (Two-Way Reversibility & Ledger)**:
  - Bắt buộc có cặp file UP và DOWN. Phải kiểm thử thành công chu kỳ `UP` $\rightarrow$ `DOWN` $\rightarrow$ `UP` trên môi trường dev trước khi merge.
  - Quản lý trạng thái và mã băm SHA-256 qua bảng `_migrations`.

