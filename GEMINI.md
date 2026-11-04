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
- **Quy tắc mọi hàm mới (Function Testing Mandate)**: Bất cứ hàm mới nào (Utility function, Service method, Domain Entity method, Use Case, API Handler) khi được tạo ra **BẮT BUỘC PHẢI CÓ FILE TEST ĐI KÈM** (`*.spec.ts` hoặc `*.test.ts`). Tuyệt đối không bàn giao hàm mà thiếu unit test.
- **Ma trận kiểm thử 4 chiều bắt buộc cho mỗi hàm**:
  1. **INPUT**:
     - Kiểm thử dữ liệu hợp lệ (Happy path).
     - Kiểm thử giá trị biên (Boundary): số 0, số âm, chuỗi rỗng `""`, min, max, mảng rỗng `[]`.
     - Kiểm thử dữ liệu rác/thiếu: `null`, `undefined`, sai định dạng, NaN.
  2. **OUTPUT**:
     - Kết quả trả về phải khớp tuyệt đối contract và kiểu dữ liệu.
     - Đảm bảo hàm **không làm thay đổi (mutate)** tham số truyền vào (Immutability).
  3. **ERROR (DẠNG LỖI & NGOẠI LỆ)**:
     - Kiểm thử đầy đủ các nhánh ném ngoại lệ (`throw new ValidationError`, `throw new NotFoundError`, v.v.).
     - Xác nhận chính xác **lớp lỗi**, **mã lỗi (`code`)**, **thông báo lỗi (`message`)** và **chi tiết trường lỗi (`details`)**.
  4. **LOGIC NGHIỆP VỤ & INVARIANTS**:
     - Kiểm thử đúng công thức tính toán, ngưỡng phân loại, logic rẽ nhánh nghiệp vụ.
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
- **Clean Code**:
  - Áp dụng **Guard Clauses & Early Return** để giảm độ lồng `if/else` (không lồng quá 2 cấp).
  - Không sử dụng **Magic Numbers** và **Hardcoded Strings**; mọi ngưỡng và hằng số phải đặt trong file `constants` hoặc `config`.
  - Hàm phải ngắn gọn, tuân thủ nguyên tắc Single Responsibility Principle (SRP).
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

