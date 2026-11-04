# Feature Specification: D-Health Core Healthcare Platform

**Feature Branch**: `001-dhealth-core-system`  
**Created**: 2026-11-04  
**Status**: Approved (Ratified under Constitution 1.0.0)  
**Input**: BA Specification (`5_6291670095529781835.md`), Mobile UI Canvas (17 main screens + 11 empty state artboards), BRD Gap Challenge (`dhealth_brd_and_gap_challenge.md`).

---

## 1. User Scenarios & Prioritized User Stories *(Mandatory)*

### User Story 1 - Authentication, Profile Switcher & Home Cockpit (Priority: P1 - MVP Core)
Là một người dùng (bệnh nhân hoặc chủ hộ gia đình), tôi muốn đăng nhập an toàn (hỗ trợ sinh trắc học FaceID/VNeID), chuyển đổi linh hoạt giữa hồ sơ các thành viên gia đình và xem tổng quan điểm sức khỏe (Health Score) cùng các chỉ số trọng yếu trên màn hình chính, để nắm bắt nhanh tình trạng sức khỏe hàng ngày của bản thân và người thân.

- **Why this priority**: Đây là cửa ngõ duy nhất vào ứng dụng. Không có xác thực, định danh thành viên và màn hình chính thì không thể truy cập bất kỳ tính năng y tế nào khác.
- **Independent Test**: Người dùng có thể đăng nhập bằng tài khoản/sinh trắc học, đổi qua lại giữa các thành viên (Khang, Hà, An, Huy, Lan), và thấy Trang chủ hiển thị đúng Health Score 3 trụ cột (Sinh trắc, Dùng thuốc, Cận lâm sàng).
- **Acceptance Scenarios**:
  1. **Given** người dùng đã đăng ký tài khoản, **When** nhập đúng tên đăng nhập/mật khẩu hoặc xác thực sinh trắc học thành công, **Then** chuyển vào màn hình Trang chủ (SCR-02), lưu JWT Token an toàn vào SecureStore.
  2. **Given** đang xem hồ sơ của "Trần Minh Khang", **When** bấm vào thanh Switcher và chọn "Lê Thu Hà", **Then** toàn bộ dữ liệu trên màn hình (Health Score, thuốc cần uống, chỉ số gần nhất) lập tức đổi sang dữ liệu của bà Hà mà không reload lại toàn bộ ứng dụng.
  3. **Given** chủ tài khoản chọn xem hồ sơ con trai "Trần Minh An" (19 tuổi), **When** An chưa bấm đồng thuận chia sẻ dữ liệu, **Then** hiển thị màn hình khóa Consent Gate theo Nghị định 13/2023/NĐ-CP, che mờ dữ liệu bệnh án chi tiết cho đến khi được chấp thuận.

---

### User Story 2 - Biometrics Vitals Tracking & Connected Devices (Priority: P1 - MVP Core)
Là một người bệnh mạn tính, tôi muốn theo dõi 8 chỉ số sinh trắc học (Huyết áp, Nhịp tim, SpO₂, Thân nhiệt, Nhịp thở, BMI, Bước chân, Giấc ngủ) thông qua đồng bộ tự động từ thiết bị y tế (máy đo Omron, Apple Watch qua Bluetooth LE) hoặc nhập tay nhanh qua Bottom Sheet, để bác sĩ và bản thân thấy được diễn tiến sức khỏe 7 ngày/6 tháng.

- **Why this priority**: Sinh trắc học là chỉ số sống còn cần theo dõi hàng ngày đối với bệnh nhân tim mạch, đái tháo đường và huyết áp.
- **Independent Test**: Kết nối thành công máy đo huyết áp qua Bluetooth LE hoặc nhập tay số đo 131/82 mmHg, biểu đồ cột phạm vi 7 ngày cập nhật tức thì, hiển thị đúng dot phân loại nguồn (xanh: thiết bị, cam: nhập tay).
- **Acceptance Scenarios**:
  1. **Given** người dùng mở màn hình Sinh trắc (SCR-03), **When** bấm "Nhập số đo huyết áp thủ công", **Then** hiển thị Bottom Sheet với các trường: Tâm thu, Tâm trương, Nhịp tim (tùy chọn), thời điểm đo và hoàn cảnh đo.
  2. **Given** người dùng nhập thời điểm đo lớn hơn thời gian hiện tại (`f.date + 'T' + f.time > NOW()`), **When** bấm "Lưu số đo", **Then** hệ thống chặn lại và báo lỗi: *"Không thể nhập số đo cho thời điểm trong tương lai"*.
  3. **Given** người dùng nhập Tâm trương $\ge$ Tâm thu (ví dụ: 120/120 hoặc 80/120), **When** bấm "Lưu số đo", **Then** hệ thống ném ngoại lệ `InvalidBloodPressureException`: *"Tâm trương phải nhỏ hơn tâm thu"*.
  4. **Given** thiết bị đo Omron và Apple Watch cùng gửi nhịp tim lúc 07:15, **When** đồng bộ vào CSDL, **Then** hệ thống kích hoạt Deduplication Hierarchy, ưu tiên hiển thị số đo từ thiết bị y tế chuyên dụng (Class IIa), ẩn số đo trùng lặp từ smartwatch.

---

### User Story 3 - Clinical Reports & Specialized Lab Tracking (Priority: P2 - Clinical)
Là một người bệnh đang điều trị, tôi muốn số hóa các phiếu xét nghiệm (Sinh hóa, Huyết học, Vi sinh, Sinh học phân tử, Di truyền) thông qua chụp ảnh AI Camera OCR hoặc nhập tay, theo dõi biểu đồ diễn tiến của từng chỉ số (HbA1c, LDL-C, Glucose đói) qua 5 lần xét nghiệm liên tiếp so với ngưỡng mục tiêu, để đánh giá hiệu quả dùng thuốc.

- **Why this priority**: Cận lâm sàng là cơ sở khách quan để bác sĩ điều chỉnh phác đồ điều trị và AI đưa ra cảnh báo sớm.
- **Independent Test**: Chụp hoặc nhập phiếu xét nghiệm máu ngày 20/10 có HbA1c 6,6% và LDL-C 3,8 mmol/L, hệ thống tự động phân loại vào nhóm Sinh hóa (SH), hiển thị cờ cảnh báo `↑` cho LDL-C và vẽ biểu đồ 5 mốc thời gian kèm đường mục tiêu nét đứt.
- **Acceptance Scenarios**:
  1. **Given** người dùng tải ảnh phiếu xét nghiệm lên SCR-12, **When** AI OCR đọc được các chỉ số HbA1c, Glucose đói, Creatinin, LDL-C, **Then** Voting Engine tự động đề xuất phân loại vào nhóm `SH · Sinh hoá` kèm lý do giải trình.
  2. **Given** người dùng xem báo cáo chi tiết SCR-06, **When** giá trị Cholesterol TP là 6,1 mmol/L (ngưỡng tham chiếu $< 5,2$), **Then** dòng chỉ số được bôi nền vàng cảnh báo `#FFFBEB` kèm biểu tượng cờ `↑`.
  3. **Given** phiếu xét nghiệm ngày 20/10 được lưu thành công, **When** quay lại Trang chủ (SCR-02), **Then** ô chỉ số HbA1c trên Grid 4 ô cập nhật giá trị `6,6 %` (Tốt), và Health Timeline xuất hiện sự kiện `"Xét nghiệm máu · 20/10"`.

---

### User Story 4 - Imaging Study Management & RECIST 1.1 Oncology Evaluator (Priority: P2 - Oncology)
Là một bệnh nhân u bướu hoặc có tổn thương khu trú, tôi muốn quản lý các ca chụp CĐHA (CT, MRI, X-quang, Siêu âm, Nhũ ảnh), theo dõi ma trận tổng đường kính tổn thương (Sum of Diameters - SoD) qua thời gian và tự động đánh giá đáp ứng điều trị theo tiêu chuẩn quốc tế RECIST 1.1.

- **Why this priority**: Theo dõi u bướu đòi hỏi độ chính xác toán học và tiêu chuẩn ung thư học quốc tế nghiêm ngặt, sai sót kích thước có thể dẫn đến đánh giá sai hiệu quả hóa trị/xạ trị.
- **Independent Test**: Nhập dữ liệu 3 khối u đặc ở gan qua 3 lần chụp (Baseline: 60 mm $\rightarrow$ Lần 2: 45 mm $\rightarrow$ Lần 3: 38 mm), hệ thống tính toán độ giảm $-36.7\%$ và tự động kết luận: `PR · Đáp ứng một phần`.
- **Acceptance Scenarios**:
  1. **Given** tổn thương đặc ở gan có kích thước baseline lần lượt là 15, 20, 25 mm (tất cả đều $\ge 10\text{ mm}$), **When** bật switch "Đánh giá theo RECIST 1.1", **Then** hệ thống kích hoạt bộ tính toán RECIST và hiển thị huy hiệu kết luận.
  2. **Given** bệnh nhân chỉ có các nốt nhỏ $< 10\text{ mm}$ (ví dụ nốt phổi 7 mm), **When** bật RECIST 1.1, **Then** hệ thống hiển thị cảnh báo `recistIneligible`: *"Tổn thương ban đầu nhỏ hơn 10 mm không đủ điều kiện đánh giá theo RECIST 1.1"*.
  3. **Given** người dùng mở báo cáo chi tiết MRI gan (SCR-08), **When** xem xét các chuỗi xung, **Then** hiển thị đầy đủ 3 thumbnail DICOM then chốt (T1+thuốc, T2, DWI) và 4 khối cấu trúc chuẩn Bộ Y tế: Kỹ thuật, Mô tả, Kết luận, Đề nghị.

---

### User Story 5 - Chronic Care Cockpit, Medication Adherence & Offline Emergency SOS (Priority: P3 - Comprehensive Care)
Là một bệnh nhân hoặc người chăm sóc, tôi muốn quản lý kế hoạch dùng thuốc hàng ngày (lịch nhắc, ghi nhận đã uống, đo lường tỷ lệ tuân thủ 30 ngày), thực hiện các việc cần làm trong Kế hoạch chăm sóc bệnh mạn tính (SCR-09), và có sẵn Thẻ sức khỏe khẩn cấp (SCR-15) với mã QR Offline hiển thị trên màn hình khóa.

- **Why this priority**: Đảm bảo an toàn tính mạng trong tình huống khẩn cấp ngoại viện và duy trì kỷ luật điều trị tại nhà.
- **Independent Test**: Bấm "Đã uống" liều thuốc sáng, tỷ lệ tuân thủ tháng nhảy lên 89%; tạo mã QR cấp cứu, quét mã ở chế độ máy bay (Airplane Mode) vẫn giải mã được Nhóm máu O+ và Dị ứng Penicillin sốc phản vệ.
- **Acceptance Scenarios**:
  1. **Given** đến 20:00 giờ uống thuốc Metformin 500 mg, **When** người dùng bấm "Đã uống", **Then** cập nhật `dose_schedules.status = 'taken'` và hiển thị toast undo trong vòng 5 giây.
  2. **Given** người dùng nhấn "Bỏ qua", **When** xem lại lịch tháng, **Then** ngày đó hiển thị chấm tròn màu đỏ (`#EF4444`) biểu thị có liều bị bỏ qua.
  3. **Given** người dùng mở màn hình Thẻ khẩn cấp SCR-15, **When** thiết bị ngắt hoàn toàn kết nối mạng, **Then** mã QR Offline vẫn hiển thị đầy đủ, quét bằng máy quét ngoài ra chuỗi JSON ký số ECDSA chứa thông tin cấp cứu thiết yếu.

---

## 2. Yêu cầu Phi Chức năng & Ràng buộc Kỹ thuật (Non-Functional Requirements)

- **NFR-001 (Bảo mật Nghị định 13/2023/NĐ-CP)**: Dữ liệu y tế phải được mã hóa ở trạng thái nghỉ (AES-256) và trạng thái truyền tải (TLS 1.3).
- **NFR-002 (Offline-First Capability)**: Bộ đệm cục bộ (SQLite / WatermelonDB) cho phép xem toàn bộ hồ sơ, đo đạc sinh trắc và tạo QR cấp cứu khi không có kết nối Internet. Hàng đợi đồng bộ `offline_sync_records` tự động đẩy lên server khi có mạng trở lại.
- **NFR-003 (Thời gian phản hồi)**: Chuyển đổi giữa các thành viên gia đình (Member Switcher) hoàn tất trong $< 100\text{ ms}$ nhờ bộ nhớ đệm TanStack Query.
- **NFR-004 (Độ tin cậy OCR)**: Tỷ lệ nhận diện đúng ký tự số y khoa trên phiếu xét nghiệm $\ge 98\%$. Bắt buộc có bước người dùng xác nhận trước khi ghi vào hồ sơ chính thức.
- **NFR-005 (Chuẩn UX Công thái học)**: Touch target của mọi nút bấm $\ge 44 \times 44\text{ pt}$. Các danh sách dài áp dụng cuộn nội bộ In-Frame $\le 5$ mục.

