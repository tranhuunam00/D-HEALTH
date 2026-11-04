# QUY CHUẨN PHÁT TRIỂN DỰ ÁN D-HEALTH (ENGINEERING RULES)

> [!IMPORTANT]
> Toàn bộ quá trình sinh mã nguồn (code generation), tái cấu trúc (refactoring) và thêm mới tính năng trong dự án này **BẮT BUỘC TUÂN THỦ 100% CÁC NGUYÊN TẮC SAU ĐÂY**.

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

## 3. NGUYÊN TẮC FRONTEND & MOBILE UI (EXPERIENCE & COMPONENT DESIGN)
- **Tách Component Nhỏ & Tái Sử Dụng (Atomic Decomposition)**:
  - Chia nhỏ component theo 4 cấp: **Atoms** (Button, Badge, Pill), **Molecules** (MetricRow, SearchBar), **Organisms** (BiometricCard, MedicationPanel), **Screens**.
  - Tách bạch rõ ràng giữa **Presentational Component (Dumb UI)** nhận props thuần túy và **Container Component / Custom Hook (Smart Logic)**.
  - Không viết file màn hình dài vượt quá 200 dòng UI.
- **Quản Lý State Màn Hình Chặt Chẽ (Strict State Lifecycle)**:
  - Phân tách rõ ràng 3 tầng: **Server State** (TanStack Query/SWR - không tự đẩy vào global store), **Global App State** (Auth, Active Member, NetInfo) và **Local UI State** (Modal, Tab).
  - Bắt buộc xử lý đủ **5 trạng thái**: `Loading` (dùng Skeleton, không dùng full spinner), `Empty` (icon, mô tả, nút Primary CTA), `Error` (thông điệp thân thiện, nút Retry), `Data`, và `Offline/Syncing` (Optimistic updates).
- **Đồng Bộ Màu Sắc & Cấu Trúc (Design Tokens & Uniform Layout)**:
  - 100% màu sắc, typography (Plus Jakarta Sans), spacing (lưới 4px), bán kính bo góc (Card bo 20–24px) phải lấy từ `DesignTokens`, không hardcode style.
  - Màu thương hiệu chính: Primary Teal `#1F7A8C`, Gradient `#1F7A8C` ➔ `#2F6FDB`. Trạng thái: Tốt `#DCFCE7`/`#166534`, Chú ý `#FEF3C7`/`#92400E`, Nguy hiểm `#DC2626`/`#FEE2E2`.
  - Cấu trúc Card đồng nhất: Header (Icon + Title + Badge) ➔ Body (Chỉ số to + Biểu đồ mini) ➔ Footer (Thời gian + Link chi tiết).
- **Thiết Kế Tiết Kiệm Không Gian & Trải Nghiệm Chuẩn (High-Density & Ergonomic UX)**:
  - **Cuộn nội bộ trong khung (In-Frame Scroll)**: Danh sách dài (kết quả xét nghiệm, bác sĩ, GPB) hiển thị tối đa **5 mục mới nhất**, phần còn lại cuộn bên trong khung `max-height` kèm nhãn dẫn hướng.
  - **Carousel Chip Ngang**: Dùng chip pill cuộn ngang để lọc danh mục, không dùng dropdown chiếm diện tích.
  - **Modal Bottom Sheet**: Dùng Bottom Sheet (bo góc trên 28px, overlay tối, tay nắm 40×5px) cho nhập liệu nhanh hoặc chi tiết thay vì chuyển trang.
  - **Công thái học & Khả năng tiếp cận**: Vùng chạm Touch Target ≥ **44 × 44 pt**, ưu tiên thao tác trong vùng ngón tay cái (**Thumb Zone**), độ tương phản chữ ≥ **4.5:1** (WCAG 2.1 AA), có `accessibilityLabel` cho mọi icon/nút bấm.

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
