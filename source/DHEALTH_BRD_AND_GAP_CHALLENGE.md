# 📑 D-HEALTH — BUSINESS REQUIREMENTS DOCUMENT (BRD) & DATA FEASIBILITY AUDIT
## TÀI LIỆU YÊU CẦU NGHIỆP VỤ & BÁO CÁO THẨM ĐỊNH TÍNH KHẢ THI DỮ LIỆU TOÀN DIỆN

> **Dự án:** Trợ lý sức khoẻ thông minh D-HEALTH (Mobile App iOS & Android)  
> **Cơ sở đối chiếu:** BA Specification v1.0 (`5_6291670095529781835.md`) & UI Canvas 28 Artboards (`D-Health - Ứng dụng di động.html`).  
> **Mục tiêu:** Thẩm định pháp y (Forensic Challenge) từng dòng dữ liệu trên giao diện; xác định điểm nghẽn không thể lấy dữ liệu nếu không có cơ chế bổ sung; chuẩn hóa 100% nguồn gốc dữ liệu (Zero Fake Defaults).

---

## 🧭 PHẦN 1: PHƯƠNG PHÁP LUẬN THẨM ĐỊNH DỮ LIỆU (DATA FEASIBILITY AUDIT METHODOLOGY)

Để đảm bảo hệ thống khi triển khai thực tế không gặp lỗi "thiếu dữ liệu để render" hoặc "phải dùng dữ liệu giả lập", toàn bộ các phần tử trên 17 màn hình được kiểm tra qua **Ma trận thẩm định 5 chiều (5D Data Matrix)**:

```
                      ┌─────────────────────────────────┐
                      │    MA TRẬN KIỂM TRA 5 CHIỀU     │
                      └────────────────┬────────────────┘
                                       │
        ┌──────────────┬───────────────┼───────────────┬──────────────┐
        ▼              ▼               ▼               ▼              ▼
 ┌─────────────┐┌─────────────┐ ┌─────────────┐ ┌─────────────┐┌─────────────┐
 │ 1. NGUỒN    ││ 2. KHẢ THI  │ │ 3. CƠ SỞ    │ │ 4. TÁC ĐỘNG ││ 5. RỦI RO   │
 │ THU THẬP    ││ KỸ THUẬT    │ │ DỮ LIỆU     │ │ LAN TRUYỀN  ││ PHÁP LÝ     │
 ├─────────────┤├─────────────┤ ├─────────────┤ ├─────────────┤├─────────────┤
 │• Nhập tay   ││• Parsing OK?│ │• Đủ bảng?   │ │• Side effect││• NĐ 13/2023 │
 │• Thiết bị   ││• OCR chuẩn? │ │• Đủ cột?    │ │• Cascades   ││• Y khoa     │
 │• Crawl CSYT ││• API sẵn có?│ │• Kiểu chuẩn?│ │• Global sync││• Trách nhiệm│
 │• Tự tính    ││• Chống chặn?│ │• Indexing?  │ │• Cache stale││  chẩn đoán  │
 └─────────────┘└─────────────┘ └─────────────┘ └─────────────┘└─────────────┘
```

1. **Nguồn thu thập thực tế (Real-world Source)**: Trường dữ liệu sinh ra từ đâu? (Người dùng gõ, cảm biến thiết bị đo, file PDF từ CSYT, thuật toán AI hay tính toán nội bộ).
2. **Tính khả thi kỹ thuật (Technical Feasibility)**: Dữ liệu đó có thực sự trích xuất được bằng công nghệ hiện có không? (Ví dụ: Crawler có vượt được Captcha/Cloudflare của viện không? OCR có đọc được chữ bác sĩ viết tay không?).
3. **Tính toàn vẹn Schema (Schema Completeness)**: CSDL có bảng, cột và quan hệ để lưu trữ bền vững không? Có bị mất mát thông tin khi khởi động lại app không?
4. **Tác động lan truyền (Cascading Effects)**: Thay đổi dữ liệu ở trường này có làm sai lệch biểu đồ, chỉ số cảnh báo hoặc trạng thái ở các màn hình khác không?
5. **Rủi ro Y khoa & Pháp lý (Clinical & Legal Risks)**: Có vi phạm Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân y tế hay vượt quá thẩm quyền trợ lý ảo (hành vi chẩn đoán/kê đơn trái phép) không?

---

## 🔬 PHẦN 2: THẨM ĐỊNH CHI TIẾT TỪNG DÒNG DỮ LIỆU QUA 17 MÀN HÌNH

Dưới đây là kết quả kiểm tra từng dòng, bóc tách các điểm nghẽn dữ liệu và đưa ra giải pháp kỹ thuật bắt buộc:

---

### MÀN HÌNH 1: SCR-01 · ĐĂNG NHẬP (`Login`)

#### 1. Bảng đối soát chi tiết từng dòng:
| Trường / Phần tử UI | Nguồn dữ liệu | Khả thi? | Lỗ hổng & Điểm nghẽn thực tế | Giải pháp chuẩn hoá |
|---|---|---|---|---|
| **Logo & Tagline** | Bundle Client | Khả thi | Tagline bản cũ bị lặp chữ D-Health | Cố định: `D-HEALTH` và `TRỢ LÝ SỨC KHOẺ THÔNG MINH` |
| **Tên đăng nhập** | Input bàn phím | Khả thi | Nhập lẫn lộn số điện thoại có `+84` hoặc email | Viết Utility chuẩn hoá số điện thoại về chuẩn 10 số `0xxxxxxxxx` |
| **Mật khẩu** | Input bàn phím | Khả thi | Nguy cơ lộ plain-text trong memory | Hash Bcrypt 10 rounds ngay tại backend, transport qua TLS 1.3 |
| **Đăng nhập sinh trắc** | Biometric Sensor | **CÓ ĐIỀU KIỆN** | Nếu máy chưa đăng ký FaceID/Vân tay thì nút này làm gì? | Ẩn nút nếu `LocalAuthentication.hasHardwareAsync()` = false hoặc user chưa bật ở SCR-15 |
| **Khung đếm ngược khoá 15p** | Backend state | **THIẾU** | BA không đặc tả lưu số lần sai ở client hay server | Lưu `failed_login_attempts` và `locked_until` ở server DB; trả về header `Retry-After: 900` |
| **MFA OTP (nếu bật)** | SMS Gateway | **THIẾU UI** | Có quy tắc BR-33 nhưng thiếu màn hình nhập OTP | Bổ sung màn hình popup Bottom Sheet nhập OTP 6 số |

---

### MÀN HÌNH 2: SCR-02 · TRANG CHỦ (`Main`)

#### 1. Bảng đối soát chi tiết từng dòng:
| Trường / Phần tử UI | Nguồn dữ liệu | Khả thi? | Lỗ hổng & Điểm nghẽn thực tế | Giải pháp chuẩn hoá |
|---|---|---|---|---|
| **Avatar & Tên người dùng** | `Member (relation='self')` | Khả thi | Nếu app đang xem hồ sơ con nhỏ, header có bị đổi tên không? | BR-12: Header Trang chủ **luôn là chủ tài khoản**, không bao giờ bị đổi theo active member context |
| **Nút SOS đỏ** | Navigation | Khả thi | Nhấn nhầm khi cuộn màn hình | Đặt vùng chạm an toàn, cách xa avatar |
| **"Hôm nay bạn thế nào?"** | User check-in | **ĐIỂM NGHẼN** | BA đánh dấu [TBD - Q10]: Chỉ là lời chào hay có bấm chọn? Chưa có bảng lưu | **Bổ sung bảng `daily_checkins`**: Cho phép chạm mở sheet chọn 5 trạng thái tâm trạng + triệu chứng nhanh |
| **Thẻ Điểm sức khoẻ (Ví dụ: 78 · Ổn định)** | Thuật toán tính | **ĐIỂM NGHẼN** | BA chưa chốt công thức [TBD - Q1]. Nếu không có công thức thì lấy đâu ra số 78? | **Ban hành công thức chuẩn (Mục 3.1)**: Tối thiểu 3 nhóm dữ liệu (Sinh hiệu 40% + Thuốc 30% + Xét nghiệm 30%). Nếu thiếu hiện "—" |
| **Thẻ nhắc liều thuốc kế tiếp** | `DoseSchedule` | Khả thi | Nếu hôm nay người dùng uống hết thuốc hoặc không có đơn? | Render Empty State Loại C: "Hôm nay không còn liều nào · Trạng thái tốt" |
| **Nút "Đã uống" trên thẻ Home** | User action | Khả thi | Nhỡ bấm nhầm thì sao? Uống xong có đồng bộ sang SCR-11 không? | Tạo `DoseLog(status='taken')`, phát event qua Local Event Bus, hiển thị Toast "Hoàn tác trong 5 giây" |
| **Lưới 4 chỉ số nhanh (HA, NT, Cân nặng, HbA1c)** | Latest readings | Khả thi | Nếu người dùng chưa từng đo huyết áp thì hiện số 0? | Tuyệt đối không hiện số 0. Hiện dấu gạch ngang "—" kèm viền đứt và nút "Nhập số đo" |
| **AI Insight nổi bật** | `AIInsightEngine` | **THIẾU CƠ CHẾ** | Lấy từ đâu ra câu "LDL-C tăng 3 lần gần nhất"? | Xây dựng Background Rule Engine: Quét các chỉ số có ≥ 3 điểm đo để phát hiện xu hướng tăng/giảm |
| **Checklist hoàn thiện hồ sơ** | User profile state | Khả thi | Khi nào thì checklist biến mất? | Tự động ẩn khi hoàn thành 4/4 bước hoặc bấm "Để sau" 2 lần (lưu cờ `dismiss_count` trong local storage) |

---

### MÀN HÌNH 3: SCR-03 · SINH TRẮC HỌC (`Biometrics`)

#### 1. Bảng đối soát chi tiết từng dòng:
| Trường / Phần tử UI | Nguồn dữ liệu | Khả thi? | Lỗ hổng & Điểm nghẽn thực tế | Giải pháp chuẩn hoá |
|---|---|---|---|---|
| **Dải đồng bộ thiết bị** | `Device.last_sync_at` | Khả thi | Nếu kết nối 2 thiết bị thì hiển thị tên thiết bị nào? | Ghép chuỗi: "Đồng bộ từ Apple Watch, Omron · 10 phút trước" |
| **Biểu đồ Huyết áp (Cột khoảng)** | `BiometricReading` | Khả thi | Trục hoành nếu đo 3 lần trong cùng 1 ngày thì vẽ thế nào? | Không dùng T2-CN cố định. Trục hoành là mốc thời gian thực `HH:mm dd/mm`. Điểm nhập tay tô màu cam |
| **Nút xoá dòng đo** | User action | **RỦI RO** | Bản ghi từ Apple Health có cho xoá không? | BR-56: Chỉ cho phép xoá bản ghi `source='manual'`. Bản ghi từ thiết bị chỉ cho phép bật cờ `is_hidden = true` |
| **Bottom sheet: Nhập HA kèm NT** | User input | Khả thi | Người dùng nhập 1 form nhưng sinh ra 2 loại chỉ số khác nhau | Tạo 2 bản ghi `BiometricReading` (1 `bp`, 1 `hr`) cùng lúc, gán chung một `group_id` UUID |
| **Cân nặng tự tính BMI** | User input + Profile | Khả thi | Nếu hồ sơ chưa có chiều cao thì tính BMI thế nào? | Nếu hồ sơ thiếu chiều cao, mở ô bắt buộc nhập chiều cao và hỏi: "Lưu chiều cao này vào hồ sơ cá nhân?" |

---

### MÀN HÌNH 4: SCR-04 · KẾT NỐI THIẾT BỊ (`Devices`)

#### 1. Bảng đối soát chi tiết từng dòng:
| Trường / Phần tử UI | Nguồn dữ liệu | Khả thi? | Lỗ hổng & Điểm nghẽn thực tế | Giải pháp chuẩn hoá |
|---|---|---|---|---|
| **Apple Health / Health Connect** | Native OS Health SDK | Khả thi | Khác biệt cấu trúc dữ liệu giữa iOS và Android | Xây dựng lớp Adapter: `HealthKitAdapter` và `HealthConnectAdapter` chuẩn hoá về domain `BiometricReading` |
| **Thiết bị Bluetooth y tế (Omron, Beurer...)** | Bluetooth GATT | **ĐIỂM NGHẼN** | Mỗi hãng máy đo dùng Bluetooth Service UUID khác nhau | Sử dụng chuẩn **Bluetooth SIG GATT Standard Profiles**: `0x1810` (Blood Pressure Service), `0x180D` (Heart Rate), `0x1822` (Pulse Oximeter) |
| **Khử trùng lặp đa nguồn (BR-64)** | Incoming stream | **ĐIỂM NGHẼN** | Cùng 1 lần đo huyết áp đẩy vào cả Apple Health và D-Health qua BLE | **Quy tắc Deduplication (Mục 3.6)**: Cùng `metric` + cùng thời điểm (sai số ≤ 2 phút) -> Ưu tiên BLE y tế > Đồng hồ > Apple Health |

---

### MÀN HÌNH 5: SCR-05 · SỨC KHOẺ – XÉT NGHIỆM (`Health`)

#### 1. Bảng đối soát chi tiết từng dòng:
| Trường / Phần tử UI | Nguồn dữ liệu | Khả thi? | Lỗ hổng & Điểm nghẽn thực tế | Giải pháp chuẩn hoá |
|---|---|---|---|---|
| **Chip 5 nhóm (HH, SH, VS, PT, DT)** | Static Enum | Khả thi | Có chỉ số thuộc về cả 2 nhóm thì hiển thị ở đâu? | Phân loại theo `default_category` của bảng danh mục `analyte_definitions` |
| **Tóm tắt phiếu xét nghiệm** | `LabResult` query | Khả thi | Làm sao sinh ra được câu "12 chỉ số · LDL-C, Triglycerid tăng"? | Viết câu query đếm: `count(*)` và lọc các bản ghi có `flag IN ('HIGH', 'ABNORMAL')` để ghép chuỗi |
| **Biểu đồ xu hướng chỉ số** | Multi-records query | Khả thi | Chỉ có 1 lần xét nghiệm thì vẽ biểu đồ ra sao? | BR-71: Cần ≥ 2 lần đo. Nếu có 1 lần: Ẩn đồ thị, hiện thẻ text: "Cần thêm 1 lần đo để vẽ xu hướng · Giá trị hiện có: 6,6%" |
| **Đường mục tiêu (Mục tiêu < 7%)** | Target rules | **THIẾU BẢNG** | Ngưỡng mục tiêu lấy từ đâu? Bác sĩ đặt hay mặc định? | **Thêm bảng `member_target_goals`**: Mặc định lấy từ guideline y khoa, cho phép bác sĩ điều chỉnh theo cá nhân |

---

### MÀN HÌNH 6: SCR-06 · CHI TIẾT XÉT NGHIỆM (`LabReport`)

#### 1. Bảng đối soát chi tiết từng dòng:
| Trường / Phần tử UI | Nguồn dữ liệu | Khả thi? | Lỗ hổng & Điểm nghẽn thực tế | Giải pháp chuẩn hoá |
|---|---|---|---|---|
| **Thông tin hành chính (Nơi làm, Bác sĩ chỉ định, Loại mẫu)** | OCR / CSYT / Nhập tay | Khả thi | Nếu OCR không quét được tên bác sĩ thì trường này hiển thị gì? | Hiển thị "Đang cập nhật" hoặc ẩn dòng nếu null, không được sinh dữ liệu giả |
| **Khoảng tham chiếu in trên phiếu** | `LabResult.ref_text` | **ĐIỂM NGHẼN** | Mỗi bệnh viện in 1 kiểu: "4.0 - 6.0", "< 5.2", "Âm tính", "Nam 130-170, Nữ 120-150" | Lưu 3 trường: `ref_low (float)`, `ref_high (float)`, và `ref_text (string)`. Ưu tiên hiển thị nguyên văn `ref_text` in trên phiếu |
| **Cờ bất thường (↑ / ↓)** | So sánh tự động | Khả thi | So sánh với `ref_low` / `ref_high` theo giới tính của hồ sơ | Đánh dấu flag: `HIGH` (tô đỏ kèm mũi tên lên), `LOW` (tô vàng kèm mũi tên xuống), `NORMAL` |
| **Tệp gốc PDF / Ảnh** | `Attachment.file_url` | Khả thi | Tải file y tế có nguy cơ bị lộ qua URL công khai | Dùng **AWS S3 / GCS Presigned URL** có thời hạn tối đa 15 phút, chặn download công khai |

---

### MÀN HÌNH 7: SCR-07 · CHẨN ĐOÁN HÌNH ẢNH (`Imaging`)

#### 1. Bảng đối soát chi tiết từng dòng:
| Trường / Phần tử UI | Nguồn dữ liệu | Khả thi? | Lỗ hổng & Điểm nghẽn thực tế | Giải pháp chuẩn hoá |
|---|---|---|---|---|
| **Chip 5 phương tiện (SA, XQ, MM, CT, MRI)** | Static Enum | Khả thi | Không có dữ liệu ở phương tiện đang chọn thì sao? | Hiển thị Empty State Loại B: "Chưa có kết quả {tên phương tiện} trong hồ sơ" kèm nút "Xem tất cả loại" |
| **3 Dropdown lọc tổn thương (Loại, Vị trí, Phương tiện)** | Query `LesionGroup` | Khả thi | Người dùng chọn vị trí "Khác" thì lọc thế nào? | Bật ô input "Cấu trúc giải phẫu khác" -> search full-text trong trường `location_other` |
| **Bảng kích thước tổn thương (U1, U2...)** | `LesionMeasurement` | Khả thi | Một lần chụp phát hiện thêm u mới thì bảng ma trận hiển thị sao? | Cột mốc cũ để trống "—", cột mốc mới ghi nhận kích thước, đánh dấu cờ "Tổn thương mới xuất hiện" |
| **Đánh giá RECIST 1.1 (CR, PR, SD, PD)** | Domain Algorithm | **RỦI RO Y KHOA** | Bệnh nhân tự nhìn RECIST có thể bị hoang mang | Bắt buộc hiển thị nhãn Disclaimer: *"Kết quả mang tính tham khảo dựa trên thuật toán RECIST 1.1 · Cần bác sĩ CĐHA/ung bướu xác nhận"* |
| **Điều kiện tổn thương đích** | Kiểm tra kích thước | Khả thi | U < 10 mm có được tính vào RECIST không? | Không tính. Ẩn kết quả RECIST, hiện câu: *"Các tổn thương hiện tại < 10 mm, chưa đủ tiêu chuẩn làm tổn thương đích RECIST. Tiếp tục theo dõi kích thước."* |

---

### MÀN HÌNH 8: SCR-08 · BÁO CÁO CĐHA CHI TIẾT (`ImagingReport`)

#### 1. Bảng đối soát chi tiết từng dòng:
| Trường / Phần tử UI | Nguồn dữ liệu | Khả thi? | Lỗ hổng & Điểm nghẽn thực tế | Giải pháp chuẩn hoá |
|---|---|---|---|---|
| **Chuỗi xung / Kỹ thuật (T1, T2, DWI)** | `ImagingStudy.sequences` | Khả thi | Nếu chụp X-quang hoặc Siêu âm không có chuỗi xung? | Kiểm tra `if (sequences.length > 0)` mới render khối này |
| **So sánh với lần chụp trước** | `compare_report_id` | Khả thi | Lần chụp đầu tiên thì so sánh với cái gì? | Ẩn dòng so sánh nếu `compare_report_id` là null |
| **Bảng so sánh tổn thương (Trước - Nay)** | `LesionMeasurement` | Khả thi | So khớp mã tổn thương giữa 2 lần chụp | Dựa vào `lesion_id` liên kết giữa 2 báo cáo để tính độ tăng giảm kích thước |
| **Link xem ảnh DICOM (PACS)** | `ImagingStudy.pacs_url` | **ĐIỂM NGHẼN** | Không phải viện nào cũng cung cấp link PACS mở | Nếu viện không có link PACS, chỉ hiện nút "Xem báo cáo PDF" |

---

### MÀN HÌNH 9: SCR-09 · BỆNH MẠN TÍNH (`Cockpit`)

#### 1. Bảng đối soát chi tiết từng dòng:
| Trường / Phần tử UI | Nguồn dữ liệu | Khả thi? | Lỗ hổng & Điểm nghẽn thực tế | Giải pháp chuẩn hoá |
|---|---|---|---|---|
| **Danh sách bệnh (Tim mạch, Đái tháo đường)** | `Condition` | Khả thi | Làm sao biết bệnh nhân mắc bệnh gì để hiện Cockpit? | Khai báo thủ công khi tạo hồ sơ HOẶC AI trích xuất chẩn đoán từ phiếu khám/đơn thuốc sau khi người dùng xác nhận |
| **Bộ chỉ số theo từng bệnh** | `condition_templates` | **THIẾU BẢNG** | Bộ chỉ số nào gắn với bệnh nào? | **Tạo bảng `condition_templates`**: Định nghĩa sẵn danh sách analyte/metric cho từng mã ICD-10 |
| **Việc cần làm tiếp theo (Checklist)** | `CarePlanTask` | Khả thi | Bấm tick xong có lưu lại không? | Lưu vào bảng `CarePlanTask`, trạng thái `is_done = true`, lưu thời điểm `done_at` |
| **Nút "Đặt lịch tái khám"** | Tạo `Appointment` | Khả thi | Nhấn đặt lịch thì hệ thống làm gì? | Tạo bản ghi `Appointment` ở trạng thái `REQUESTED`, tự động điền chuyên khoa và bác sĩ tương ứng |

---

### MÀN HÌNH 10: SCR-10 · HỒ SƠ Y TẾ (`Records - Medical Passport`)

#### 1. Bảng đối soát chi tiết từng dòng:
| Trường / Phần tử UI | Nguồn dữ liệu | Khả thi? | Lỗ hổng & Điểm nghẽn thực tế | Giải pháp chuẩn hoá |
|---|---|---|---|---|
| **Lưới 9 ô danh mục (kèm số lượng)** | Aggregated Counts | Khả thi | Query count từ 9 bảng khác nhau có gây chậm app? | Viết 1 query gộp duy nhất hoặc cache counter trong Redis/SQLite, cập nhật khi có bản ghi mới |
| **Mục Dị ứng (DƯ)** | `AllergyItem` | **THIẾU MÀN HÌNH** | Bấm vào chuyển sang SCR-17 nhưng SCR-17 không có chỗ sửa | **Bổ sung SCR-ADD-04 (Màn hình quản lý dị ứng)** để thêm/sửa/xoá dị ứng |
| **Panel GPB / Bác sĩ / CSYT** | Query 5 bản ghi mới | Khả thi | Danh sách bác sĩ và cơ sở y tế sinh ra từ đâu? | Tự động quét từ các phiếu XN, CĐHA, đơn thuốc đã lưu; cho phép thêm mới thủ công |

---

### MÀN HÌNH 11: SCR-11 · QUẢN LÝ DÙNG THUỐC (`Meds`)

#### 1. Bảng đối soát chi tiết từng dòng:
| Trường / Phần tử UI | Nguồn dữ liệu | Khả thi? | Lỗ hổng & Điểm nghẽn thực tế | Giải pháp chuẩn hoá |
|---|---|---|---|---|
| **Tỷ lệ tuân thủ 30 ngày (%)** | `DoseLog` computation | Khả thi | `taken / (taken + missed + skipped) * 100` | Chỉ tính các liều đã đến giờ trong 30 ngày qua, không tính liều tương lai |
| **Calendar tháng dùng thuốc** | `DoseSchedule` | Khả thi | Mỗi ngày cần tô màu chấm: Xanh, Vàng, Đỏ, Xám | Group by ngày, kiểm tra trạng thái các liều trong ngày để quyết định màu chấm |
| **3 nút xử lý liều (Bỏ liều / Nhắc lại / Đã uống)** | User action | Khả thi | Bấm "Nhắc lại 15p" thì hệ thống làm gì? | Đặt lại Local Notification sau 15 phút, tăng `snooze_count` (tối đa 3 lần) |
| **Sinh lịch liều tương lai** | Background generator | **ĐIỂM NGHẼN** | Thuốc dùng "Dài hạn" sinh ra hàng triệu bản ghi? | **Cơ chế Rolling Window 30 ngày**: Chỉ sinh liều cho 30 ngày tới. Cronjob chạy hàng đêm sinh cuốn chiếu |
| **AI Camera nhận diện đơn thuốc** | AI OCR Engine | **RỦI RO Y KHOA** | Đơn thuốc viết tay bác sĩ dịch sai liều lượng | Bắt buộc cờ `ai_confidence`. Nếu < 90% mặc định KHÔNG tick chọn, hiện cảnh báo màu hổ phách |

---

### MÀN HÌNH 12: SCR-12 · NHẬP KẾT QUẢ CẬN LÂM SÀNG (`Camera / Input`)

#### 1. Bảng đối soát chi tiết từng dòng:
| Trường / Phần tử UI | Nguồn dữ liệu | Khả thi? | Lỗ hổng & Điểm nghẽn thực tế | Giải pháp chuẩn hoá |
|---|---|---|---|---|
| **Đề xuất phân loại nhóm XN** | Analyte default mapping | Khả thi | Khi nào thì khối đề xuất xuất hiện? | BR-110: Chỉ xuất hiện khi form có ≥ 1 dòng có giá trị. Đếm nhóm chiếm đa số để đề xuất |
| **Cảnh báo phiếu đa nhóm** | Cross-category check | Khả thi | Nhập vừa công thức máu (HH) vừa men gan (SH) | Hiển thị cảnh báo: "Phiếu có chỉ số thuộc nhiều nhóm (HH, SH). Nên tách thành phiếu riêng cho từng nhóm" |
| **Nhập từ link CSYT** | Web Scraper Backend | **ĐIỂM NGHẼN LỚN** | Viện có Cloudflare, SMS OTP hoặc cổng app riêng | **Đặc tả cơ chế fallback**: Nếu crawler không cào được tự động, chuyển sang luồng: "Tải file PDF kết quả lên hoặc Chụp ảnh phiếu" |
| **Bảo mật mật khẩu link CSYT** | Memory only | **QUY CHUẨN** | Tránh lưu mật khẩu cổng viện của bệnh nhân | Mật khẩu chỉ giữ trong bộ nhớ tạm thời của tiến trình crawl, huỷ ngay sau khi tải xong file (BR-116) |

---

### MÀN HÌNH 13: SCR-13 · TRỢ LÝ AI (`AI`)

#### 1. Bảng đối soát chi tiết từng dòng:
| Trường / Phần tử UI | Nguồn dữ liệu | Khả thi? | Lỗ hổng & Điểm nghẽn thực tế | Giải pháp chuẩn hoá |
|---|---|---|---|---|
| **Hỏi đáp theo hồ sơ đang xem** | RAG / Context Injection | Khả thi | AI có đọc nhầm dữ liệu của người thân khác không? | Bắt buộc filter database query theo `active_member_id` trước khi đưa vào LLM Context Window |
| **Chip dẫn nguồn dữ liệu** | Citation metadata | Khả thi | Câu trả lời nhắc đến số đo phải có nguồn | Cấu trúc response của AI trả về mảng `cited_resources: [{ report_id, type, date }]` để render chip bấm được |
| **Cảnh báo dấu hiệu khẩn cấp** | Emergency Detection | Khả thi | Người dùng kêu đau thắt ngực, khó thở | Kích hoạt ngay Banner đỏ gọi 115, không trả lời lan man |

---

### MÀN HÌNH 14: SCR-14 · CHĂM SÓC (`Care - Care Network`)

#### 1. Bảng đối soát chi tiết từng dòng:
| Trường / Phần tử UI | Nguồn dữ liệu | Khả thi? | Lỗ hổng & Điểm nghẽn thực tế | Giải pháp chuẩn hoá |
|---|---|---|---|---|
| **Lịch hẹn sắp tới** | `Appointment` | Khả thi | Sắp xếp lịch hẹn thế nào? | Lọc `start_at >= now()`, sắp xếp tăng dần, lấy lịch hẹn gần nhất |
| **My Care Team** | `Doctor` | Khả thi | Phải có ít nhất thông tin gì để lưu bác sĩ? | BR-130: Bắt buộc có Họ tên và ít nhất 1 trong 2: Số điện thoại hoặc Email |
| **Gửi hồ sơ trước khám** | `ShareGrant` generator | Khả thi | Tạo link chia sẻ bảo mật có thời hạn | Tạo token truy cập webview tạm thời, gắn thời hạn hết hạn (`expires_at`), ghi audit log |

---

### MÀN HÌNH 15: SCR-15 · THÔNG TIN NGƯỜI DÙNG (`Profile`)

#### 1. Bảng đối soát chi tiết từng dòng:
| Trường / Phần tử UI | Nguồn dữ liệu | Khả thi? | Lỗ hổng & Điểm nghẽn thực tế | Giải pháp chuẩn hoá |
|---|---|---|---|---|
| **Số CCCD & Thẻ BHYT** | `Member` (Encrypted) | Khả thi | Che thông tin nhạy cảm trên màn hình | Hiển thị dạng mask: `0790******12`. Chạm xác thực sinh trắc/mật khẩu mới mở xem đầy đủ |
| **Ẩn mục tài khoản khi xem người thân** | Role check | Khả thi | Đang xem hồ sơ con nhỏ thì có nút Đăng xuất không? | BR-142: Ẩn các mục cài đặt tài khoản (Đổi mật khẩu, MFA, Đăng xuất) khi `relation != 'self'` |

---

### MÀN HÌNH 16: SCR-16 · HỒ SƠ GIA ĐÌNH (`Family`)

#### 1. Bảng đối soát chi tiết từng dòng:
| Trường / Phần tử UI | Nguồn dữ liệu | Khả thi? | Lỗ hổng & Điểm nghẽn thực tế | Giải pháp chuẩn hoá |
|---|---|---|---|---|
| **Thành viên ≥ 18 tuổi cần đồng ý** | `Member.consent_status` | **ĐIỂM NGHẼN** | Người thân chưa đồng ý thì màn hình hiện gì? | Hiện trạng thái "Đang chờ đồng ý", ẩn toàn bộ dữ liệu y tế cho tới khi người thân ký consent |
| **Chuyển đổi hồ sơ toàn cục** | `ActiveMemberContext` | Khả thi | Chuyển member ở đây có đổi các màn hình khác không? | Bắn event toàn ứng dụng, toàn bộ màn hình (trừ Home) refetch lại dữ liệu theo member mới |

---

### MÀN HÌNH 17: SCR-17 · THẺ KHẨN CẤP (`Emergency / SOS`)

#### 1. Bảng đối soát chi tiết từng dòng:
| Trường / Phần tử UI | Nguồn dữ liệu | Khả thi? | Lỗ hổng & Điểm nghẽn thực tế | Giải pháp chuẩn hoá |
|---|---|---|---|---|
| **Nhóm máu, Dị ứng, Bệnh nền** | Aggregated profile | Khả thi | Dữ liệu nào được phép hiển thị ra ngoài? | Người dùng có switch bật/tắt từng trường muốn công khai trên thẻ khẩn cấp |
| **Mã QR cấp cứu** | `EmergencyCard.qr_token` | **RỦI RO KHI MẤT MẠNG** | Quét QR khi điện thoại không có sóng 4G | **Cơ chế QR kép**: Mã QR chứa URL tĩnh online, đồng thời hỗ trợ xuất file ảnh Medical ID lưu vào màn hình khoá OS |
| **Nút Gọi 115** | Native Dialer | Khả thi | Bấm vào gọi ngay lập tức | Tích hợp thư viện mở trình quay số điện thoại gọi khẩn cấp |

---

## ⚖️ PHẦN 3: GIẢI QUYẾT TRIỆT ĐỂ 12 ĐIỂM NGHẼN Y KHOA & CÂU HỎI MỞ (Q1 — Q12)

| Mã | Vấn đề trong BA | Thực trạng kỹ thuật | Giải pháp chuẩn hoá nghiệp vụ đưa vào BRD |
|---|---|---|---|
| **Q1** | Công thức **Điểm sức khoẻ** (Health Score 0-100) | BA chưa có công thức, chỉ bảo TBD | **Chuẩn hoá thuật toán 3 trụ cột:**<br>1. Sinh hiệu (40đ): HA chuẩn (15đ), NT chuẩn (10đ), BMI chuẩn (15đ). Trừ điểm nếu lệch ngưỡng.<br>2. Tuân thủ thuốc (30đ): Lấy trực tiếp từ `% tuân thủ 30 ngày`.<br>3. Xét nghiệm (30đ): Tỷ lệ các chỉ số trong khoảng tham chiếu.<br>*Nếu có ít hơn 3 nhóm dữ liệu -> hiển thị dấu gạch ngang "—".* |
| **Q2** | Bảng **ngưỡng cảnh báo** sinh trắc & xét nghiệm | Chưa có bảng cấu hình chính thức | Thiết lập bảng `analyte_threshold_rules` do Hội đồng Y khoa duyệt, phân mức theo độ tuổi và giới tính: Mức 1 (Bình thường), Mức 2 (Chú ý), Mức 3 (Nguy hiểm). |
| **Q3** | Pháp lý & Kỹ thuật **đăng nhập link CSYT** | CSYT có thể chặn crawler, nguy cơ rủi ro bảo mật | **Phân tầng:**<br>1. Bổ sung Điều khoản sử dụng: Người dùng ủy quyền cho D-Health thay mặt tải dữ liệu.<br>2. Xây dựng cơ chế Fallback thân thiện: Nếu link CSYT không tự tải được, app hướng dẫn người dùng "Chụp ảnh phiếu kết quả" hoặc "Tải file PDF từ máy". |
| **Q4** | Nhà cung cấp **AI / OCR** & Lưu trữ dữ liệu y tế | Rủi ro rò rỉ dữ liệu y tế cá nhân | **Chính sách Zero-Data-Retention:**<br>1. Chỉ sử dụng Enterprise API có cam kết KHÔNG dùng dữ liệu người dùng để huấn luyện mô hình (Zero Data Retention).<br>2. Che thông tin danh tính (CCCD, Họ tên, SĐT) trước khi gửi ảnh sang OCR pipeline. |
| **Q5** | Nguồn **Cơ sở dữ liệu Thuốc** | Không có CSDL thuốc thì không kiểm tra được tương tác | Tích hợp danh mục **Dược thư Quốc gia Việt Nam** (Cục Quản lý Dược): Lưu bảng mã hoạt chất, biệt dược, chống chỉ định và tương tác thuốc mức độ nặng. |
| **Q6** | Sửa/ẩn số đo từ thiết bị & Ưu tiên nguồn trùng | Thiết bị đo cùng 1 lúc đẩy 2 kết quả | 1. Bản ghi thiết bị: Chỉ cho phép ẩn (`is_hidden = true`), không cho sửa/xoá để đảm bảo tính nguyên vẹn y khoa.<br>2. Thứ tự ưu tiên khi trùng nguồn: Thiết bị BLE y tế chuyên dụng > Đồng hồ thông minh > Apple Health / Health Connect. |
| **Q7** | Thời điểm chuyển liều sang "Quên" & Số lần nhắc lại | Chưa rõ thời gian chờ tối đa | 1. Quá giờ hẹn **+ 120 phút** mà không bấm gì -> Tự động đánh dấu `MISSED`.<br>2. Nút "Nhắc lại 15p" cho phép bấm tối đa **3 lần** (tổng 45 phút). |
| **Q8** | Chính sách giữ dữ liệu khi xoá tài khoản / thành viên | Quy định Nghị định 13/2023/NĐ-CP | Áp dụng **Soft Delete 30 ngày**: Dữ liệu chuyển vào thùng rác, sau 30 ngày hệ thống tự động băm/ẩn danh hoá (Anonymize) dữ liệu để phục vụ nghiên cứu thống kê, xoá hoàn toàn thông tin định danh. |
| **Q9** | Các màn hình còn thiếu thiết kế | Thiếu 7 luồng giao diện quan trọng | Bổ sung đầy đủ đặc tả cho: Đăng ký OTP, Quên mật khẩu, Màn hình duyệt Consent, Quản lý dị ứng, Xem audit log, Báo cáo GPB chi tiết, và Cài đặt thông báo. |
| **Q10** | "Hôm nay bạn thế nào?" ở Trang chủ | Chỉ là lời chào hay có tương tác? | Thiết kế thành **Widget Check-in nhanh**: Chạm vào cho chọn 5 biểu tượng cảm xúc (Rất tốt, Bình thường, Mệt mỏi, Đau đớn, Khó chịu) + Ghi chú triệu chứng ngắn. |
| **Q11** | Nền tảng Video Call với Bác sĩ | Ngoài phạm vi v1.0 | Nút "Nhắn tin / Video" ở SCR-14 trong v1.0 mở ra liên kết Zalo OA / Số điện thoại hotline phòng khám của bác sĩ. |
| **Q12** | Đối tượng trẻ em < 18 tuổi | Trẻ em dùng ngưỡng người lớn sẽ bị sai | Áp dụng bảng tính **BMI bách phân vị theo tuổi và giới tính của WHO (Z-score)** cho người < 18 tuổi; không áp dụng ngưỡng huyết áp cố định của người lớn. |

---

## 🗄️ PHẦN 4: THIẾT KẾ CSDL HOÀN THIỆN ĐẢM BẢO KHÔNG THIẾU DỮ LIỆU

Để đảm bảo đáp ứng đầy đủ các yêu cầu trên, CSDL bổ sung các bảng nghiệp vụ sau:

```sql
-- 1. BẢNG CHECK-IN TÂM TRẠNG & TRIỆU CHỨNG HÀNG NGÀY (SCR-02 / Q10)
CREATE TABLE daily_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    mood_level VARCHAR(20) NOT NULL, -- excellent, good, neutral, tired, painful
    symptoms TEXT[], -- headache, fever, cough, chest_pain...
    note VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (member_id, checkin_date)
);

-- 2. BẢNG CẤU HÌNH NGƯỠNG CẢNH BÁO CHỈ SỐ Y KHOA (BR-18 / Q2)
CREATE TABLE analyte_threshold_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analyte_code VARCHAR(50) NOT NULL,
    gender VARCHAR(10), -- male, female, all
    age_min INT DEFAULT 0,
    age_max INT DEFAULT 150,
    normal_low NUMERIC,
    normal_high NUMERIC,
    warning_low NUMERIC,
    warning_high NUMERIC,
    danger_low NUMERIC,
    danger_high NUMERIC,
    unit VARCHAR(30) NOT NULL,
    version INT DEFAULT 1,
    approved_by VARCHAR(100) NOT NULL
);

-- 3. BẢNG TEMPLATE BỆNH MẠN TÍNH (SCR-09 / BR-91)
CREATE TABLE condition_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    icd10_code VARCHAR(20) NOT NULL UNIQUE,
    condition_name VARCHAR(150) NOT NULL,
    tracked_metrics VARCHAR(50)[], -- bp, hr, ldl, hba1c...
    default_tasks TEXT[], -- Do huyet ap sang/toi, XN lipid mau...
    screening_interval_days INT DEFAULT 90
);

-- 4. BẢNG QUẢN LÝ DỊ ỨNG CHI TIẾT (SCR-10 / SCR-17 / SCR-ADD-04)
CREATE TABLE allergy_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    substance VARCHAR(150) NOT NULL, -- Ten thuoc / thuc pham / di nguyen
    reaction VARCHAR(255), -- Noi me day, kho tho, soc phan ve
    severity VARCHAR(20) NOT NULL, -- mild, moderate, severe, anaphylaxis
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG NHẬT KÝ KIỂM TOÁN TRUY CẬP Y TẾ (BR-04 / NĐ 13/2023)
CREATE TABLE access_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES members(id),
    actor_type VARCHAR(30) NOT NULL, -- owner, doctor, emergency_qr, system
    actor_id VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL, -- view_lab, view_imaging, view_emergency, export_pdf
    resource_id VARCHAR(100),
    ip_address VARCHAR(45) NOT NULL,
    user_agent VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_audit_member_time ON access_audit_logs(member_id, created_at DESC);

-- 6. HÀNG ĐỢI ĐỒNG BỘ NGOẠI TUYẾN (OFFLINE SYNC QUEUE)
CREATE TABLE offline_sync_records (
    local_id UUID PRIMARY KEY,
    member_id UUID NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- biometric, dose_action, report
    payload JSONB NOT NULL,
    client_created_at TIMESTAMPTZ NOT NULL,
    sync_status VARCHAR(20) DEFAULT 'pending', -- pending, synced, conflict
    retry_count INT DEFAULT 0
);
```

---

## 🎯 PHẦN 5: KẾT LUẬN & ĐỀ NGHỊ HÀNH ĐỘNG

1. **Về dữ liệu:** Đã xóa bỏ hoàn toàn nguy cơ dùng dữ liệu giả định (`Zero Fake Defaults`). 100% các thành phần trên 17 màn hình đã có nguồn dữ liệu xác định (Input, Cảm biến BLE, OCR, hoặc Thuật toán).
2. **Về kỹ thuật:** Giải quyết triệt để 12 điểm nghẽn y khoa, ban hành công thức tính Điểm sức khoẻ, quy tắc khử trùng lặp dữ liệu đo, và cơ chế rolling window cho lịch thuốc.
3. **Về kiến trúc:** CSDL đã được bổ sung 6 bảng nghiệp vụ ngầm để hỗ trợ đầy đủ tính năng, sẵn sàng để bắt đầu hiện thực hóa mã nguồn theo mô hình DDD và TDD.

---

# PHẦN II: KIỂM THỬ TỪNG DÒNG TOÀN DIỆN TỪNG MÀN HÌNH (SCREENS AUDIT SCR-03 ĐẾN SCR-17)

---

## 3. SCR-03 · SỨC KHOẺ – SINH TRẮC HỌC (Biometrics)

### 3.1. Bảng phân tích từng dòng giao diện (Line-by-Line Inventory)
| STT | Mã UI / Nhãn hiển thị | Phân loại Label | Dữ liệu hiển thị (Sample) | Nguồn dữ liệu (Origin) | Nơi nhập / Phát sinh | Bảng CSDL & Cột lưu trữ |
|:---:|:---|:---:|:---|:---|:---|:---|
| 1 | `Hôm nay: 26/10/2026` | Fix cứng tiền tố, Động ngày | `26/10/2026` | Client System Date (UTC+7) | Đồng hồ thiết bị | Không lưu (Client dynamic) |
| 2 | `Hồ sơ sức khoẻ:` | Fix cứng i18n | Label tĩnh | Client i18n translation | Client static | Không lưu |
| 3 | `{{memName}}` (Trần Minh Khang) | Động (Config/Profile) | "Trần Minh Khang" | `family_members.full_name` | SCR-16 / SCR-17 | `family_members.full_name` |
| 4 | `Sức khoẻ` (Page Title) | Fix cứng i18n | Label tiêu đề màn | Client static | Header Screen | Không lưu |
| 5-8 | Subtabs: `Sinh trắc`, `Xét nghiệm`, `CĐHA`, `Bệnh mạn tính` | Fix cứng i18n | 4 Tab chuyển đổi | Client routing navigation | Navigation Bar | Không lưu |
| 9 | `Đồng bộ từ Apple Watch, máy đo huyết áp · 5 phút trước` | Động (Device Metadata) | "Apple Watch, máy đo huyết áp · 5 phút trước" | Aggregate từ `connected_devices` | Sync background service | `connected_devices.last_synced_at`, `connected_devices.device_name` |
| 10 | Nút `Thiết bị` | Fix cứng i18n | Icon + Text link | Routing sang SCR-04 | Button click | Không lưu |
| 11 | `{{c.title}}` (Tiêu đề biểu đồ) | Động theo tab chỉ số | "Huyết áp · 7 ngày", "BMI · 6 tháng" | Biometric Engine Title Generator | State selector | Không lưu |
| 12 | `{{c.latest}}` (Chỉ số đo gần nhất) | Động | "131/82" (HA), "71" (NT), "23,9" (BMI) | Latest record in series | BLE Sync / Manual Sheet | `biometric_records.value_numeric`, `biometric_records.systolic`, `diastolic` |
| 13 | `{{c.unit}}` (Đơn vị tính) | Fix cứng theo chỉ số | "mmHg", "bpm", "%", "°C", "l/p", "kg/m²" | Medical Unit Dictionary | Config hằng số y khoa | `biometric_records.unit` |
| 14 | `{{c.when}}` (Thời điểm đo gần nhất) | Động | "Lần đo mới nhất: 07:15 · 26/10/2026" | MAX(`measured_at`) của chỉ số | BLE Device / Manual Sheet | `biometric_records.measured_at` |
| 15 | `{{c.tag}}` (Huy hiệu trạng thái) | Động (Medical Rule) | "Mức 1 · Tốt", "Theo dõi", "Chú ý" | Domain Rule Classifier | Rule Engine tính tự động | `biometric_records.severity_level` |
| 16 | Chú giải `Từ thiết bị` (Dot xanh) | Fix cứng i18n | Dot tròn xanh dương | Legend biểu đồ | Client UI template | Không lưu |
| 17 | Chú giải `Nhập tay` (Dot cam) | Fix cứng i18n | Dot tròn màu cam | Legend biểu đồ | Client UI template | Không lưu |
| 18-38 | Biểu đồ Huyết áp: `b0` đến `b6` (7 cột biên độ Sys-Dia) | Động (7 ngày) | Sys 130-138, Dia 81-87 mmHg | 7 bản ghi `biometric_records` | BLE đo HA / Nhập tay | `biometric_records` (type='bp') |
| 39-52 | Biểu đồ Đường: `p0` đến `p6` (7 điểm dữ liệu) | Động (7 mốc) | NT (70-75), SpO2 (97-98), BMI (24.6-23.9) | 7 bản ghi gần nhất của chỉ số | Thiết bị / Cân thông minh | `biometric_records` (type in hr, spo2, temp, ...) |
| 53 | `{{c.note}}` (Bình luận y khoa) | Động (Clinical Insight) | "Huyết áp tâm thu giảm từ 138 xuống 131 mmHg trong 7 ngày, trong mục tiêu." | Clinical Logic Evaluator Service | Computed Rule Domain | Không lưu / `ai_insights.summary` |
| 54 | Nút `Nhập số đo {{c.short}} thủ công` | Fix cứng + Động tên | "Nhập số đo huyết áp thủ công" | CTA Button mở Bottom Sheet | User tap CTA | Không lưu |
| 55 | Hướng dẫn: `Chạm vào một chỉ số để xem diễn biến...` | Fix cứng i18n | Text mô tả | Micro-copy hướng dẫn | Client UI | Không lưu |
| 56-59 | Grid 8 thẻ chỉ số (HA, NT, SpO2, TĐ, NTh, BMI, BC, GN) | Fix cứng tên/abbr + Động giá trị | Tên, Viết tắt, Giá trị gần nhất, Đơn vị | Query latest per biometric_type | Device BLE / Manual | `biometric_records` partition by type |
| 60 | `Lịch sử đo · {{c.hname}}` | Động tên chỉ số | "Lịch sử đo · Huyết áp" | Header danh sách lịch sử | Client UI template | Không lưu |
| 61 | `{{histCount}} lần đo` | Động | "7 lần đo" / "15 lần đo" | `COUNT(*)` from `biometric_records` | Database Aggregation | Computed |
| 62-64 | Dòng lịch sử: Giá trị, Thời gian, Hoàn cảnh đo, Nguồn | Động | "131/82 mmHg", "07:15 · 26/10/2026", "Lúc nghỉ", "Thiết bị" / "Nhập tay" | Chi tiết từng bản ghi | Device Sync / Manual Form | `biometric_records.source`, `context`, `notes` |
| 65 | Nhãn In-Frame: `Hiển thị 5 lần đo mới nhất · kéo trong khung...` | Fix cứng i18n | In-Frame Scroll hint | Micro-copy UX chuẩn | Client UI template | Không lưu |
| 66-70 | Bottom Navigation Bar (5 tabs) | Fix cứng i18n | Trang chủ, Sức khoẻ, Hồ sơ, Trợ lý AI, Chăm sóc | Global Navigation | Bottom Tab Bar | Không lưu |
| 71 | Toast Notification: `{{toastText}}` | Động | "Đã lưu số đo lúc 07:15 · 26/10/2026 (kèm nhịp tim)" | Feedback sau khi lưu manual | Action Handler | Flash UI state |
| 72 | Bottom Sheet: `Nhập số đo thủ công` | Fix cứng i18n | Tiêu đề Bottom Sheet Modal | Modal Header | Action Trigger | Không lưu |
| 73 | `Hồ sơ: {{memName}}` | Động | "Hồ sơ: Trần Minh Khang" | Current Active Member | Active Member Context | `family_members.full_name` |
| 74-82 | Dropdown chọn loại chỉ số (8 loại) | Config danh mục Master | Huyết áp, Nhịp tim, SpO2, Nhiệt độ, Nhịp thở, BMI, Bước chân, Giấc ngủ | Master Data `biometric_types` | Admin Master / Local Enum | Client Master Enum |
| 83-84 | Thời điểm đo: Chips chọn nhanh | Fix cứng | "Bây giờ", "Sáng nay 07:00", "Tối qua 21:00" | Quick fill timestamp chips | User tap chip | Populates `f.date`, `f.time` |
| 85-86 | Input Fields động theo chỉ số đã chọn | Động theo metric | Tâm thu (mmHg), Tâm trương (mmHg), Nhịp tim (bpm) / Cân nặng (kg), Chiều cao (cm) | Input Form | User Typing | `biometric_records.systolic`, `diastolic`, `value_numeric` |
| 87 | Gợi ý BMI: `{{bmiText}}` | Động tự tính | "BMI tự tính: 23,9 kg/m²" | Formula: $w / (h/100)^2$ | Frontend Reactive Watcher | `biometric_records.value_numeric` |
| 88-89 | Hoàn cảnh đo (5 chips) | Config Enum | "Lúc nghỉ", "Vừa thức dậy", "Sau vận động", "Sau ăn", "Trước khi ngủ" | Measurement Context Code | User tap chip | `biometric_records.context` (`rest`, `wake`, `exercise`, `meal`, `bed`) |
| 90 | Input: `Ghi chú (tuỳ chọn)` | Fix cứng i18n | Placeholder text | Text input | User typing | `biometric_records.notes` |
| 91 | Error Message: `{{err}}` | Động | "Tâm trương phải nhỏ hơn tâm thu." | Client Form Validation | Validation Engine | Local Form State |
| 92-93 | Nút `Huỷ` & `Lưu số đo` | Fix cứng i18n | Action Buttons | Modal Actions | User tap | Không lưu / Database Commit |
| 94 | Dòng cảnh báo pháp lý y khoa | Fix cứng i18n | "Số đo nhập tay được đánh dấu riêng để bác sĩ phân biệt với số từ thiết bị." | Disclaimer theo quy chuẩn y tế | Client UI static | Không lưu |

### 3.2. Dữ liệu ngầm & Cấu trúc kỹ thuật (Implicit Data)
- `group_id` (UUID): Khi người dùng nhập Huyết áp có điền thêm ô Nhịp tim tùy chọn (ô `f.c`), hệ thống tự động sinh ra **2 bản ghi riêng biệt** (`type='bp'` và `type='hr'`) nhưng gán chung một `group_id`. Điều này đảm bảo tính toàn vẹn y khoa: bác sĩ xem nhịp tim có thể truy xuất ngay được huyết áp tương ứng tại cùng khoảnh khắc đó.
- `source`: Giá trị phân định bắt buộc: `'device'` (đồng bộ tự động từ BLE/Apple Health) vs `'manual'` (nhập tay trên form). UI hiển thị dot màu cam và nhãn "Nhập tay".
- `device_id` / `device_name`: Lưu tên thiết bị cụ thể (ví dụ: `Omron HEM-7600T`, `Apple Watch Series 9`) để phục vụ thẩm định nguồn gốc thiết bị y tế.
- `is_deleted` & `deleted_at`: Số đo nhập tay cho phép người dùng xóa (`canDel = true`), nhưng áp dụng **Soft Delete** để không làm mất vết kiểm toán (Audit Trail) phục vụ bảo hiểm y tế. Số đo từ thiết bị **tuyệt đối không có nút Xóa** trên UI.

### 3.3. Quy tắc nghiệp vụ & Bẫy phát triển (Rules & Traps)
- **BR-50 (Ngăn chặn thời gian tương lai)**: `f.date + 'T' + f.time <= CurrentTime`. Bắt buộc chặn ở cả Frontend lẫn Domain Entity Constructor (`BiometricRecord`).
- **BR-51 (Huyết áp hợp lệ)**: Tâm thu $60 - 250	ext{ mmHg}$, Tâm trương $30 - 150	ext{ mmHg}$. Bắt buộc `Tâm trương < Tâm thu` (nếu bằng hoặc lớn hơn lập tức ném lỗi nghiệp vụ `InvalidBloodPressureException`).
- **BR-52 (Ràng buộc giới hạn sinh tồn)**:
  - Nhịp tim: $30 - 220	ext{ bpm}$
  - SpO₂: $70 - 100\%$
  - Thân nhiệt: $34.0 - 42.0^\circ	ext{C}$
  - Nhịp thở: $6 - 60	ext{ lần/phút}$
  - Cân nặng: $2 - 300	ext{ kg}$; Chiều cao: $50 - 230	ext{ cm}$.
- **Cascading Side Effects**:
  - Khi lưu bản ghi Huyết áp mới $ightarrow$ Trigger Domain Event `BiometricRecordedEvent` $ightarrow$ Tự động kích hoạt `AdherenceCalculator` và cập nhật chỉ số Huyết áp trên màn **SCR-02 (Trang chủ)** và **SCR-09 (Disease Cockpit Tim mạch)**.
  - Đồng thời cập nhật trạng thái chấm màu của Card Tim mạch (Xanh: Tốt nếu $< 130/80$, Vàng: Theo dõi nếu $130-139/80-89$, Đỏ: Nguy cơ nếu $\ge 140/90	ext{ mmHg}$).

---

## 4. SCR-04 · KẾT NỐI THIẾT BỊ (Connected Devices)

### 4.1. Bảng phân tích từng dòng giao diện (Line-by-Line Inventory)
| STT | Mã UI / Nhãn hiển thị | Phân loại Label | Dữ liệu hiển thị (Sample) | Nguồn dữ liệu (Origin) | Nơi nhập / Phát sinh | Bảng CSDL & Cột lưu trữ |
|:---:|:---|:---:|:---|:---|:---|:---|
| 1 | `Hôm nay: 26/10/2026` | Fix cứng tiền tố, Động ngày | `26/10/2026` | Client Date | Đồng hồ thiết bị | Không lưu |
| 2-3 | `Hồ sơ sức khoẻ:` `{{memName}}` | Fix cứng + Động | "Trần Minh Khang" | `family_members` | Active Context | `family_members.full_name` |
| 4 | `Kết nối thiết bị` (Header) | Fix cứng i18n | Tên màn hình | Client i18n | Screen Header | Không lưu |
| 5 | `{{connectedCount}} thiết bị đang kết nối` | Động | "3 thiết bị đang kết nối" | `COUNT(*)` thiết bị active | Database Query | Computed từ `connected_devices` |
| 6 | Trạng thái BLE: `Bluetooth đang bật · tự động đồng bộ` | Động theo Native OS | Chuỗi trạng thái Bluetooth | Native OS BleManager | Mobile Device OS API | Không lưu (OS State) |
| 7 | Nút `Quét tìm thiết bị mới` | Fix cứng i18n | CTA Button | Kích hoạt BLE Scan Bottom Sheet | User tap | Không lưu |
| 8 | Tiêu đề nhóm: `{{g.title}}` | Config danh mục Master | "Nền tảng sức khoẻ", "Đồng hồ thông minh", "Thiết bị y tế" | Master Category Enum | System Master Data | Client Master Data |
| 9-11 | Thông tin thiết bị: Icon, Tên, Mô tả kết nối | Config + Động | "Apple Health" / "Apple Watch" / "Máy đo huyết áp", "Dành cho iPhone" / "Pin 64% · đồng bộ 5 phút trước" | Danh mục thiết bị hỗ trợ + Metadata đồng bộ | Database / BLE Peripheral Read | `connected_devices.device_name`, `battery_level`, `last_synced_at` |
| 12-13 | Huy hiệu trạng thái: `Đã kết nối` / `Kết nối` | Fix cứng theo trạng thái | Tag xanh lá hoặc nút xám | Trạng thái `is_connected` | Bluetooth Pairing state | `connected_devices.is_connected` |
| 14-15 | Dòng chi tiết mở rộng: `Dữ liệu được đồng bộ` + Danh sách loại dữ liệu | Config theo thiết bị | "Nhịp tim, SpO₂, Nhịp thở, Bước chân, Giấc ngủ, Nhiệt độ" | Cấu hình quyền dữ liệu cấp phép | Device Capability & User Consent | `connected_devices.data_types` (JSON array) |
| 16 | Nhãn `Tần suất đồng bộ` | Fix cứng i18n | Label cài đặt | Client i18n | Device Settings Card | Không lưu |
| 17-20 | Dropdown tần suất: `Tự động (thời gian thực)`, `Mỗi 15 phút`, `Mỗi giờ`, `Thủ công` | Config Master Enum | 4 tùy chọn tần suất | Tùy chọn cấu hình background sync | User selection | `connected_devices.sync_interval` (`realtime`, `15m`, `1h`, `manual`) |
| 21 | Nút `Ngắt kết nối` | Fix cứng i18n | Nút cảnh báo màu đỏ | Hủy ghép nối BLE / Revoke token | User confirmation tap | Soft delete `connected_devices` |
| 22 | Tuyên ngôn bảo mật & Quyền riêng tư | Fix cứng i18n | "D-Health chỉ đọc những loại dữ liệu bạn cho phép. Bạn có thể ngắt kết nối bất cứ lúc nào." | Cam kết tuân thủ Nghị định 13/2023 | Client UI static | Không lưu |
| 23 | Bottom Sheet Modal: `{{sheetTitle}}` | Động theo thiết bị quét | "Kết nối Máy đo SpO₂" / "Quét thiết bị mới" | Sheet Header | BLE Scan Action | Local Modal State |
| 24 | Danh sách thiết bị BLE tìm thấy trong vùng phủ | Động | Tên thiết bị + RSSI sóng + Địa chỉ MAC | Quét qua `react-native-ble-plx` | BLE Peripheral Advertisement | Memory Scan Buffer |
| 25-26 | Nút `Huỷ` & `Ghép nối` | Fix cứng i18n | Action buttons | Hoàn tất pair GATT service | User tap | Ghi nhận vào `connected_devices` |

### 4.2. Dữ liệu ngầm & Cấu trúc kỹ thuật (Implicit Data)
- `device_uuid` & `mac_address`: Mã định danh duy nhất của phần cứng BLE để tái kết nối tự động ở các phiên sau.
- `battery_level`: Phần trăm pin đọc từ chuẩn BLE Standard Battery Service (GATT UUID `0x180F`).
- `firmware_version`: Phiên bản phần mềm của thiết bị đo để đối chiếu tiêu chuẩn an toàn thiết bị y tế.
- `auth_token_hash`: Token OAuth2 mã hóa khi kết nối Nền tảng bên thứ ba (Garmin Connect API, Fitbit Web API, Samsung Health SDK).
- `priority_tier`: Cấp độ ưu tiên nguồn dữ liệu:
  - Cấp 1 (Priority = 100): Thiết bị y tế chuyên dụng (Class IIa Medical Device - ví dụ Omron HEM, Beurer).
  - Cấp 2 (Priority = 80): Smartwatch chuyên dụng (Apple Watch ECG, Garmin Elevate).
  - Cấp 3 (Priority = 60): Nền tảng sức khỏe tổng hợp (Apple Health, Health Connect).
  - Cấp 4 (Priority = 40): Số đo nhập tay thủ công.

### 4.3. Quy tắc nghiệp vụ & Bẫy phát triển (Rules & Traps)
- **BR-64 (Deduplication Hierarchy - Chống trùng lặp dữ liệu đo)**: Khi Apple Watch và Máy đo Huyết áp Omron cùng đẩy chỉ số Nhịp tim tại mốc $07:15$, hệ thống kích hoạt **Domain Deduplication Rule**: Bản ghi từ máy đo huyết áp (Cấp 1) được ưu tiên chọn làm giá trị hiển thị chính, bản ghi Apple Watch được gắn flag `duplicate_suppressed = true` để không làm sai lệch biểu đồ trung bình 7 ngày.
- **Bẫy Background Execution trên iOS/Android**: Việc quét BLE liên tục sẽ bị hệ điều hành tắt sau 30 giây chạy ngầm nếu không đăng ký `UIBackgroundModes: [bluetooth-central, fetch]`. Bắt buộc phải triển khai cơ chế kết nối theo sự kiện (GATT Indication/Notification) thay vì Polling.

---

## 5. SCR-05 · XÉT NGHIỆM (Health Labs) & SCR-06 · BÁO CÁO XÉT NGHIỆM CHI TIẾT

### 5.1. Bảng phân tích từng dòng giao diện SCR-05 (Line-by-Line Inventory)
| STT | Mã UI / Nhãn hiển thị | Phân loại Label | Dữ liệu hiển thị (Sample) | Nguồn dữ liệu (Origin) | Nơi nhập / Phát sinh | Bảng CSDL & Cột lưu trữ |
|:---:|:---|:---:|:---|:---|:---|:---|
| 1-4 | Header: Ngày, Hồ sơ thành viên, Tiêu đề | Fix cứng + Động | "Hôm nay: 26/10/2026", "Trần Minh Khang", "Sức khoẻ" | Active Context | Header Navigation | Client State / Profile |
| 5-8 | Subtabs: Sinh trắc, Xét nghiệm, CĐHA, Bệnh mạn tính | Fix cứng i18n | Active tab: `Xét nghiệm` | Navigation Bar | Routing | Không lưu |
| 9-14 | Bộ lọc chuyên khoa xét nghiệm (6 Chips) | Config Master Bộ Y tế | `Tất cả`, `HH` (Huyết học), `SH` (Sinh hoá), `VS` (Vi sinh), `PT` (SH phân tử), `DT` (Di truyền) | Master Danh mục Xét nghiệm BYT | Filter Selector | `clinical_reports.category` |
| 15-20 | Chips đa chọn chỉ số theo dõi (Multi-select) | Config theo bệnh nhân | `HbA1c`, `LDL-C`, `Glucose đói`, `Cholesterol TP`, `Triglycerid`, `Creatinin` | Danh sách Analyte được Pinned | User toggle chips | `tracked_analytes.analyte_code` |
| 21 | Tiêu đề biểu đồ Analyte | Động tên chỉ số | "HbA1c qua 5 lần xét nghiệm" | Analyte Chart Engine | Dynamic Generator | Không lưu |
| 22 | Giá trị gần nhất + Đơn vị | Động | "6,6 %", "3,8 mmol/L" | Latest Analyte Result | Parsed từ Phiếu XN | `lab_results.result_value`, `unit` |
| 23 | Huy hiệu cảnh báo chỉ số | Động theo ngưỡng | "Mức 1 · Thông tin" (Xanh), "Mức 2 · Chú ý" (Vàng) | Reference Range Comparator | Rule Evaluator | `lab_results.abnormal_flag` |
| 24 | Đường mục tiêu nét đứt + Nhãn tham chiếu | Động theo luật y khoa | "Mục tiêu < 7%", "Mục tiêu < 3,0 mmol/L" | Clinical Practice Guidelines (ADA/ESC) | Rule Engine | `analyte_threshold_rules.target_max` |
| 25-29 | 5 Mốc ngày trên trục hoành biểu đồ | Động theo ngày lấy mẫu | "12/02", "18/04", "20/06", "22/08", "20/10" | `performed_at` của 5 phiếu XN | Sampling Date từ Phiếu | `clinical_reports.performed_at` |
| 30 | Nhận định xu hướng y khoa | Động | "Giảm từ 7,8% xuống 6,6% qua 5 lần xét nghiệm — xu hướng tích cực." | Medical Trend Interpreter Service | AI/Rule Analysis | `ai_insights.summary` |
| 31 | Tiêu đề danh sách phiếu XN | Fix cứng i18n | "Danh sách phiếu xét nghiệm" | Danh mục báo cáo cận lâm sàng | Client UI template | Không lưu |
| 32-37 | Thẻ phiếu XN trong danh sách | Động | Badge chuyên khoa ("SH", "HH"), Tiêu đề ("Sinh hoá máu"), Ngày lấy mẫu ("20/10/2026"), Tóm tắt ("12 chỉ số · LDL-C, Cholesterol TP tăng") | Bảng tổng hợp phiếu xét nghiệm | Nhập OCR / Nhập tay SCR-12 | `clinical_reports.title`, `performed_at`, `summary` |
| 38 | Nút CTA `Xem báo cáo chi tiết` | Fix cứng i18n | Arrow link | Chuyển tiếp sang màn SCR-06 | Tap on Card | Navigation Parameter `report_id` |

### 5.2. Bảng phân tích từng dòng giao diện SCR-06 (Chi tiết 12 chỉ số)
| STT | Tên chỉ số xét nghiệm | Phân loại | Giá trị đo | Đơn vị | Khoảng tham chiếu | Cờ cảnh báo | Highlight UI | Bảng CSDL & Cột |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| 1 | `Glucose (đói)` | Master BYT | `6,1` | mmol/L | `3,9 – 6,4` | Bình thường | Nền trắng | `lab_results.result_value` (6.1) |
| 2 | `Urê` | Master BYT | `5,2` | mmol/L | `2,5 – 7,5` | Bình thường | Nền trắng | `lab_results.result_value` (5.2) |
| 3 | `Creatinin` | Master BYT | `92` | µmol/L | `62 – 106` | Bình thường | Nền trắng | `lab_results.result_value` (92) |
| 4 | `eGFR` (Độ lọc cầu thận) | Master BYT | `82` | mL/ph/1,73m² | `≥ 60` | Bình thường | Nền trắng | `lab_results.result_value` (82) |
| 5 | `AST (GOT)` | Master BYT | `28` | U/L | `< 40` | Bình thường | Nền trắng | `lab_results.result_value` (28) |
| 6 | `ALT (GPT)` | Master BYT | `32` | U/L | `< 41` | Bình thường | Nền trắng | `lab_results.result_value` (32) |
| 7 | `GGT` | Master BYT | `35` | U/L | `< 60` | Bình thường | Nền trắng | `lab_results.result_value` (35) |
| 8 | `Acid uric` | Master BYT | `380` | µmol/L | `202 – 416` | Bình thường | Nền trắng | `lab_results.result_value` (380) |
| 9 | `Cholesterol TP` | Master BYT | `6,1` | mmol/L | `< 5,2` | `↑` (Vượt ngưỡng) | Nền vàng `#FFFBEB` | `lab_results.abnormal_flag` = 'H' |
| 10 | `Triglycerid` | Master BYT | `1,6` | mmol/L | `< 1,7` | Bình thường | Nền trắng | `lab_results.result_value` (1.6) |
| 11 | `HDL-C` | Master BYT | `1,1` | mmol/L | `> 1,0` | Bình thường | Nền trắng | `lab_results.result_value` (1.1) |
| 12 | `LDL-C` | Master BYT | `3,8` | mmol/L | `< 3,0` | `↑` (Vượt ngưỡng) | Nền vàng `#FFFBEB` | `lab_results.abnormal_flag` = 'H' |

### 5.3. Dữ liệu ngầm & Quy tắc nghiệp vụ (SCR-05 & SCR-06)
- **Khóa liên kết LOINC chuẩn quốc tế**: Bắt buộc mọi chỉ số lưu trong `lab_results` phải có mã LOINC chuẩn hóa (ví dụ: `4548-4` cho HbA1c, `13457-7` cho LDL-C, `1558-6` cho Glucose đói). Không dùng chuỗi tiếng Việt thô làm khóa tìm kiếm vì các bệnh viện viết khác nhau ("HbA1c", "HBA1C", "A1C Glycated Hemoglobin").
- **Tự động trích xuất khoảng tham chiếu theo độ tuổi và giới tính**: Khoảng tham chiếu của Creatinin và Acid Uric thay đổi giữa Nam và Nữ. Hệ thống không hardcode chuỗi tham chiếu mà truy vấn từ bảng `analyte_threshold_rules` dựa trên `gender` và `birth_date` của thành viên đang xem.
- **Cascading Side Effects**:
  - Khi lưu phiếu XN ngày 20/10 có `HbA1c = 6.6%` và `LDL-C = 3.8 mmol/L`:
    1. Màn **SCR-02 (Trang chủ)**: Grid 4 ô chỉ số cập nhật ngay ô HbA1c = 6,6% (Huy hiệu "Tốt") và mục Health Timeline xuất hiện dòng "Xét nghiệm máu · 20/10". Đồng thời banner AI Insight hiển thị: "LDL-C tăng trong 3 lần xét nghiệm gần nhất".
    2. Màn **SCR-09 (Disease Cockpit - Bệnh mạn tính)**: Thẻ Đái tháo đường cập nhật chấm tròn xanh cho HbA1c; Thẻ Tim mạch cập nhật chấm tròn vàng cho LDL-C (kèm task: "Xét nghiệm lipid máu trước tái khám").
    3. Màn **SCR-10 (Hồ sơ y tế)**: Số đếm thẻ `XN (Xét nghiệm)` tự động tăng thêm +1.

---

## 6. SCR-07 · CHẨN ĐOÁN HÌNH ẢNH (Imaging) & SCR-08 · BÁO CÁO CĐHA CHI TIẾT

### 6.1. Bảng phân tích từng dòng giao diện SCR-07 (Line-by-Line Inventory)
| STT | Mã UI / Nhãn hiển thị | Phân loại Label | Dữ liệu hiển thị (Sample) | Nguồn dữ liệu (Origin) | Nơi nhập / Phát sinh | Bảng CSDL & Cột lưu trữ |
|:---:|:---|:---:|:---|:---|:---|:---|
| 1-4 | Header: Ngày, Hồ sơ thành viên, Tiêu đề | Fix cứng + Động | "Hôm nay: 26/10/2026", "Trần Minh Khang", "Sức khoẻ" | Active Context | Header Navigation | Client State / Profile |
| 5-8 | Subtabs: Sinh trắc, Xét nghiệm, CĐHA, Bệnh mạn tính | Fix cứng i18n | Active tab: `CĐHA` | Navigation Bar | Routing | Không lưu |
| 9-14 | Bộ lọc phương tiện chẩn đoán (6 Modalities) | Config chuẩn DICOM | `Tất cả`, `SA` (Siêu âm), `XQ` (X-quang), `MM` (Nhũ ảnh), `CT` (Cắt lớp), `MRI` (Cộng hưởng từ) | DICOM Modality Standard | Modality Filter Chips | `imaging_studies.modality` |
| 15 | Toggle `Theo dõi tổn thương qua thời gian` | Fix cứng i18n | Switch bật/tắt (Default: On) | Local UI State | User toggle switch | Local View Preference |
| 16-18 | Bộ 3 Dropdown lọc tổn thương: Loại, Vị trí, Phương tiện | Config Master Y khoa | Loại: `Khối u đặc` / `Khối u nang` / `Khối khác`<br>Vị trí: `Gan` / `Phổi` / `Thận` / `Khác (nhập text)`<br>Phương tiện: `CT` / `MRI` / `SA` | Phân loại giải phẫu bệnh & chẩn đoán hình ảnh | Dropdown selectors | `imaging_lesions.lesion_type`, `body_part`, `modality` |
| 19 | Tiêu đề nhóm tổn thương | Động | "Khối u đặc · Gan", "Nốt đặc · Phổi phải" | Lesion Group Aggregator | Computed Group Name | `imaging_lesions.target_organ` |
| 20 | Tóm tắt phương tiện & số tổn thương | Động | "CT/MRI · 3 tổn thương" | Count lesions in group | Database Aggregation | Computed |
| 21 | Số đo tổng đường kính gần nhất | Động | "38 mm" (Tổng 3 khối đặc gan ngày 20/08/2026) | SUM(`max_diameter_mm`) lần chụp mới nhất | Imaging Report Parser | Computed SoD |
| 22 | Nhận xét tiến triển kích thước | Động | "Tổng đường kính giảm từ 60 mm xuống 38 mm sau điều trị." | Oncology Evaluation Service | Clinical Domain Logic | `imaging_studies.clinical_impression` |
| 23-26 | Biểu đồ đường SoD qua 3 mốc thời gian | Động (3 mốc chụp) | Ngày: 15/03/26 (60 mm), 20/06/26 (45 mm), 20/08/26 (38 mm) | 3 lần chụp đối chiếu liên tiếp | Báo cáo CĐHA 3 kỳ | `imaging_studies.performed_at`, `imaging_lesions.max_diameter_mm` |
| 27-31 | Bảng ma trận SoD chi tiết từng tổn thương | Động | Tổn thương 1 (HPT VI): 15 $ightarrow$ 12 $ightarrow$ 10 mm<br>Tổn thương 2 (HPT VII): 20 $ightarrow$ 15 $ightarrow$ 12 mm<br>Tổn thương 3 (HPT VIII): 25 $ightarrow$ 18 $ightarrow$ 16 mm | Đo đạc chi tiết từng Target Lesion | Bác sĩ CĐHA đo trên PACS / Nhập SCR-12 | `imaging_lesions.lesion_name`, `baseline_size_mm`, `current_size_mm` |
| 32 | Toggle `Đánh giá theo RECIST 1.1` | Fix cứng i18n | Switch bật/tắt (Chỉ hiện khi là U đặc) | Local UI State | User toggle switch | View Setting |
| 33 | Huy hiệu kết luận RECIST 1.1 | Động chuẩn ung bướu | `PR · Đáp ứng một phần` (Giảm −36,7% so với ban đầu) | RECIST 1.1 Evaluator Engine | Domain Service | `imaging_studies.recist_code` (`CR`, `PR`, `SD`, `PD`) |
| 34-37 | Chú giải 4 mức RECIST 1.1 | Fix cứng y khoa | CR: Đáp ứng hoàn toàn (Tất cả biến mất)<br>PR: Đáp ứng một phần ($\le -30\%$ so với ban đầu)<br>SD: Bệnh ổn định (Không đạt PR hay PD)<br>PD: Bệnh tiến triển ($\ge +20\%$ và $\ge +5	ext{ mm}$ so với đáy) | Chuẩn quốc tế RECIST 1.1 | Master Knowledge Base | Client UI Static Table |
| 38 | Danh sách ca chụp CĐHA (In-Frame Scroll) | Động (Tối đa 5 ca gần nhất) | CT ngực liều thấp (08/10), Siêu âm thận (22/08), MRI gan (20/08), Siêu âm tuyến giáp (15/07), CT bụng (20/06) | Query `imaging_studies` order by date desc | PACS Sync / Camera OCR | `imaging_studies` rows |

### 6.2. Bảng phân tích từng dòng giao diện SCR-08 (Chi tiết Báo cáo MRI Gan)
| STT | Mã UI / Nhãn hiển thị | Phân loại Label | Dữ liệu hiển thị (Sample) | Nguồn dữ liệu (Origin) | Nơi nhập / Phát sinh | Bảng CSDL & Cột lưu trữ |
|:---:|:---|:---:|:---|:---|:---|:---|
| 1 | Nút Back `<` | Fix cứng i18n | Icon quay lại | Trở về SCR-07 | Tap back button | Navigation |
| 2 | Tiêu đề báo cáo + Badge | Fix cứng + Động | "MRI gan có tiêm thuốc" + Badge `MRI` | Tên kỹ thuật chụp | Nhập SCR-12 / PACS | `imaging_studies.title`, `modality` |
| 3 | Phụ đề loại văn bản | Fix cứng i18n | "Báo cáo chẩn đoán hình ảnh" | Phân loại chứng từ y tế | System Document Type | `clinical_reports.kind` ('imaging') |
| 4-6 | Thumbnail 3 chuỗi xung DICOM then chốt | Động ảnh DICOM | 3 khung hình: `T1 + thuốc`, `T2`, `DWI` | PACS Key Frames Store | PACS Server / Camera Upload | `imaging_studies.dicom_series_urls` (JSON array) |
| 7-12 | Grid 6 thông tin hành chính ca chụp | Động Metadata | Ngày: `20/08/2026`<br>Bộ phận: `Gan · ổ bụng trên`<br>Nơi thực hiện: `[Bệnh viện đối tác]`<br>BS chỉ định: `[Bác sĩ ung bướu]`<br>BS đọc kết quả: `BS Lê Văn C`<br>So sánh với: `CT 20/06/2026` | Metadata phiếu chụp CĐHA | Nhập OCR SCR-12 / HIS-PACS HL7 ORU | `imaging_studies.performed_at`, `body_part`, `facility_name`, `ordering_doctor`, `interpreting_doctor`, `compared_study_id` |
| 13 | Mục `KỸ THUẬT` | Fix cứng i18n | Tiêu đề khối kỹ thuật | Khung chuẩn báo cáo CĐHA | Template chuẩn BYT | Không lưu |
| 14 | Nội dung kỹ thuật | Động | "MRI 1.5T ổ bụng trên, chuỗi T1, T2, DWI; tiêm thuốc tương phản từ, chụp động học các thì." | Bác sĩ CĐHA ghi nhận | Trích xuất OCR / Nhập tay | `imaging_studies.technique_description` |
| 15 | Mục `MÔ TẢ` | Fix cứng i18n | Tiêu đề khối mô tả | Khung chuẩn báo cáo CĐHA | Template chuẩn BYT | Không lưu |
| 16 | Nội dung mô tả chi tiết | Động | "Gan kích thước bình thường, bờ đều. Ba khối đặc ở hạ phân thuỳ VI, VII, VIII, ngấm thuốc dạng viền, kích thước giảm so với phim trước. Nang gan đơn thuần hạ phân thuỳ II, 12 mm, không thay đổi. Không thấy huyết khối tĩnh mạch cửa. Không có dịch ổ bụng." | Bác sĩ CĐHA phân tích hình ảnh | Trích xuất OCR / Nhập tay | `imaging_studies.findings_text` |
| 17 | Mục `KẾT LUẬN` | Fix cứng i18n | Tiêu đề khối kết luận | Khung chuẩn báo cáo CĐHA | Template chuẩn BYT | Không lưu |
| 18 | Nội dung kết luận | Động | "Ba khối đặc gan giảm kích thước so với phim 20/06/2026 (tổng 45 → 38 mm). Nang gan đơn thuần ổn định." | Chẩn đoán hình ảnh xác định | Trích xuất OCR / Nhập tay | `imaging_studies.conclusion_text` |
| 19 | Mục `ĐỀ NGHỊ` | Fix cứng i18n | Tiêu đề khối đề nghị | Khung chuẩn báo cáo CĐHA | Template chuẩn BYT | Không lưu |
| 20 | Nội dung khuyến nghị | Động | "Theo dõi đáp ứng điều trị, chụp lại sau 3 tháng." | Lời dặn theo dõi chuyên khoa | Trích xuất OCR / Nhập tay | `imaging_studies.recommendations_text` |

### 6.3. Dữ liệu ngầm & Quy tắc nghiệp vụ (SCR-07 & SCR-08)
- **Thuật toán kiểm tra điều kiện RECIST 1.1**:
  - Không phải khối u đặc nào cũng được áp dụng RECIST 1.1.
  - Điều kiện tiên quyết: Tổn thương phải đo được trên mặt phẳng cắt ngang với đường kính lớn nhất $\ge 10	ext{ mm}$ (trên phim CT lát cắt mỏng $\le 5	ext{ mm}$) hoặc hạch bạch huyết có trục ngắn $\ge 15	ext{ mm}$.
  - Nếu bệnh nhân chỉ có các nốt nhỏ $< 10	ext{ mm}$, hệ thống hiển thị cảnh báo `recistIneligible = true`: *"Tổn thương ban đầu nhỏ hơn 10 mm không đủ điều kiện đánh giá theo RECIST 1.1"* để bảo đảm tính chuẩn xác y khoa.
- **Công thức RECIST 1.1 PR (Đáp ứng một phần)**:
  $$\Delta \% = rac{	ext{SoD}_{	ext{hiện tại}} - 	ext{SoD}_{	ext{ban đầu}}}{	ext{SoD}_{	ext{ban đầu}}} 	imes 100\%$$
  Ví dụ thực tế của bệnh nhân Khang: $	ext{SoD}_{	ext{baseline}} = 60	ext{ mm}$, $	ext{SoD}_{	ext{current}} = 38	ext{ mm}$.
  $$\Delta \% = rac{38 - 60}{60} 	imes 100\% = -36.7\% \le -30\% \implies 	ext{Kết luận PR (Đáp ứng một phần)}.$$
- **Dữ liệu DICOM Web Viewer**:
  - `dicom_study_instance_uid` & `dicom_series_instance_uid`: Cần lưu định danh duy nhất theo chuẩn ISO 12052 để khi người dùng chạm vào ảnh có thể khởi chạy bộ xem ảnh chuyên dụng (CornerstoneJS DICOM Viewer) với các công cụ phóng to, đo đạc khoảng cách, điều chỉnh Window/Level (W/L) theo tiêu chuẩn chẩn đoán y khoa.

---

## 7. SCR-09 · DISEASE COCKPIT (Bệnh mạn tính) & SCR-10 · HỒ SƠ Y TẾ (Medical Passport)

### 7.1. Bảng phân tích từng dòng giao diện SCR-09 (Disease Cockpit)
| STT | Mã UI / Nhãn hiển thị | Phân loại Label | Dữ liệu hiển thị (Sample) | Nguồn dữ liệu (Origin) | Nơi nhập / Phát sinh | Bảng CSDL & Cột lưu trữ |
|:---:|:---|:---:|:---|:---|:---|:---|
| 1-4 | Header: Ngày, Hồ sơ thành viên, Tiêu đề | Fix cứng + Động | "Hôm nay: 26/10/2026", "Trần Minh Khang", "Sức khoẻ" | Active Context | Header Navigation | Client State / Profile |
| 5-8 | Subtabs: Sinh trắc, Xét nghiệm, CĐHA, Bệnh mạn tính | Fix cứng i18n | Active tab: `Bệnh mạn tính` | Navigation Bar | Routing | Không lưu |
| 9 | Thẻ Cockpit 1: `Tim mạch` | Động tên bệnh | "Tim mạch" | Tên bệnh mạn tính đang theo dõi | Khai báo bệnh án SCR-10 / AI trích xuất | `conditions.condition_name` |
| 10 | Tóm tắt phân tầng nguy cơ & xu hướng | Động (Clinical Score) | "Nguy cơ trung bình · xu hướng ổn định" | Cardiovascular Risk Evaluation Model | Rule Service (SCORE2 / Framingham) | `conditions.risk_level`, `trend` |
| 11 | Mini Sparkline biểu đồ xu hướng | Động vector SVG | Đường biểu diễn biến thiên huyết áp/lipid | Aggregation 30 ngày gần nhất | Biometrics & Labs query | Computed SVG Path |
| 12-17 | Grid 6 chỉ số then chốt của bệnh Tim mạch | Config theo mẫu bệnh | Huyết áp: `Theo dõi` (Dot vàng)<br>LDL-C: `Theo dõi` (Dot vàng)<br>HbA1c: `Tốt` (Dot xanh)<br>Nhịp tim: `Tốt` (Dot xanh)<br>Cân nặng: `Theo dõi` (Dot vàng)<br>Tái khám: `12/11/2026` | Query latest record của từng metric | Bảng `condition_templates` map sang Biometrics & Labs | Dynamic Multi-table Query |
| 18 | Tiêu đề khối việc cần làm: `Việc cần làm tiếp theo` | Fix cứng i18n | Header Care Plan Tasks | Kế hoạch chăm sóc bệnh mạn tính | Care Plan Template | Không lưu |
| 19-20 | Checkbox nhiệm vụ bệnh nhân (Interactive Tasks) | Động theo phác đồ | [ ] "Theo dõi huyết áp sáng và tối"<br>[ ] "Xét nghiệm lipid máu trước tái khám" | Danh sách nhiệm vụ điều trị do bác sĩ / phác đồ giao | Care Plan Generator / Bác sĩ kê đơn | `care_plan_tasks.task_title`, `is_completed` |
| 21 | Nút Primary CTA: `Đặt lịch tái khám 12/11 >` | Động ngày hẹn | "Đặt lịch tái khám 12/11 >" | Kích hoạt luồng đặt lịch khám hoặc chuyển sang SCR-14 | User tap CTA | Liên kết module `care_appointments` |
| 22 | Thẻ Cockpit 2: `Đái tháo đường` | Động tên bệnh | "Đái tháo đường" | Tên bệnh mạn tính thứ 2 | Hồ sơ bệnh án | `conditions.condition_name` |
| 23 | Huy hiệu cảnh báo: `1 cần khám` | Động theo chỉ số | Huy hiệu màu cam: "1 cần khám" | Glucose hoặc thời hạn khám vượt ngưỡng | Rule Engine | Computed Alert |
| 24-29 | Grid 6 chỉ số giám sát Đái tháo đường | Config theo mẫu bệnh | `HbA1c` (Dot xanh), `Glucose` (Dot vàng), `Cân nặng` (Dot vàng), `Huyết áp`, `Thận`, `Mắt` | Danh mục chỉ số biến chứng ĐTĐ | Mapping từ `condition_templates` | Dynamic Multi-table Query |
| 30 | Empty State khi hồ sơ không có bệnh mạn tính | Động theo thành viên | "Sức khoẻ tốt. Khám sức khoẻ định kỳ tiếp theo 03/2027." | Khi thành viên không có bệnh mạn tính | Hồ sơ sức khỏe định kỳ | `conditions` empty fallback |

### 7.2. Bảng phân tích từng dòng giao diện SCR-10 (Medical Passport)
| STT | Mã UI / Nhãn hiển thị | Phân loại Label | Dữ liệu hiển thị (Sample) | Nguồn dữ liệu (Origin) | Nơi nhập / Phát sinh | Bảng CSDL & Cột lưu trữ |
|:---:|:---|:---:|:---|:---|:---|:---|
| 1-3 | Header: Ngày, Hồ sơ thành viên, Tiêu đề | Fix cứng + Động | "Hôm nay: 26/10/2026", "Hồ sơ y tế / Medical Passport" | Active Context | Global Navigation | Client State |
| 4 | Thẻ thành viên chính: Avatar + Họ tên + Vai trò | Động | "Trần Minh Khang" + Badge "Chủ tài khoản" | Profile thành viên gia đình | SCR-16 / SCR-17 | `family_members.full_name`, `relationship` |
| 5 | Dòng chỉ số nhân khẩu học | Động | "Nam · 46 tuổi · 174 cm · 72,5 kg · BMI 23,9" | Tính từ Ngày sinh, Chiều cao, Cân nặng | Profile & Biometric latest | `gender`, `birth_date`, `height_cm`, `weight_kg` |
| 6 | Huy hiệu Nhóm máu nổi bật | Động | "NHÓM MÁU O+" (Badge đỏ viền bo) | Nhóm máu khai báo hoặc xét nghiệm | Profile y tế | `family_members.blood_type` |
| 7 | Hướng dẫn: `Chạm để đổi hồ sơ thành viên` | Fix cứng i18n | Micro-copy mở Switcher Sheet | Tap vào thẻ thành viên | Modal Picker Trigger | Không lưu |
| 8-16 | Lưới 9 thẻ danh mục y tế (3x3 Grid):<br>1. `DƯ · Dị ứng` (Count 1)<br>2. `BL · Bệnh đã mắc` (Count 2)<br>3. `TH · Thuốc` (Count 3)<br>4. `XN · Xét nghiệm` (Count 24)<br>5. `CĐ · CĐHA` (Count 7)<br>6. `GPB · Giải phẫu bệnh` (Count 2)<br>7. `TL · Tài liệu` (Count 31)<br>8. `BS · Bác sĩ` (Count 6)<br>9. `CS · Cơ sở y tế` (Count 4) | Config Master Grid (9 nhóm cố định) | Số lượng bản ghi của từng nhóm dữ liệu tương ứng của thành viên | Bảng đếm tổng hợp từ các Aggregate Roots | Tự động tính từ các bảng cơ sở dữ liệu con | Computed Count: `allergy_items`, `conditions`, `prescriptions`, `clinical_reports` (by kind), `care_doctors`, `medical_facilities` |
| 17 | Nút hành động chính: `+ Nhập kết quả` | Fix cứng i18n | Nút nổi Primary CTA đen chữ trắng | Chuyển thẳng sang trình nhập wizard SCR-12 | Floating Action Button | Navigation sang SCR-12 |
| 18 | In-Frame Scroll Panel: Giải phẫu bệnh (GPB) | Động (khi chạm thẻ GPB) | Danh sách kết quả sinh thiết (ví dụ: Sinh thiết kim gan UTBM tế bào gan G2, Sinh thiết dạ dày HP+) | Bảng `pathology_reports` | Nhập OCR SCR-12 / HIS | `clinical_reports` (kind='pathology') |
| 19 | In-Frame Scroll Panel: Danh bạ Bác sĩ (BS) | Động (khi chạm thẻ BS) | Danh sách bác sĩ từng điều trị (BS Trần Văn B - Tim mạch, BS Hoàng Thị D - Bác sĩ GĐ, BS Lê Văn C - CĐHA) | Bảng `care_doctors` | Khai báo khi khám / OCR phiếu khám | `care_doctors` rows |
| 20 | In-Frame Scroll Panel: Cơ sở y tế (CS) | Động (khi chạm thẻ CS) | Danh sách bệnh viện/phòng khám (Bệnh viện đối tác - 18 lần, Phòng khám GĐ - 9 lần) | Bảng `medical_facilities` | Trích xuất từ hóa đơn/phiếu khám | `medical_facilities` rows |

### 7.3. Dữ liệu ngầm & Quy tắc nghiệp vụ (SCR-09 & SCR-10)
- **Cơ chế lưu trữ và kích hoạt Bệnh mạn tính (Condition Aggregate)**:
  - Một bệnh mạn tính phát sinh từ 2 nguồn: (1) Bệnh nhân tự khai báo hoặc (2) AI phát hiện từ kết luận phiếu khám/chẩn đoán hình ảnh.
  - Mỗi bản ghi `conditions` liên kết với một `condition_template_id`. Bảng template này quy định sẵn:
    - Bệnh Tim mạch bắt buộc liên kết theo dõi 5 chỉ số: Huyết áp, Nhịp tim, Cân nặng, LDL-C, HbA1c.
    - Bệnh Đái tháo đường bắt buộc theo dõi: Glucose đói, HbA1c, Cân nặng, Creatinin/eGFR (biến chứng thận), Khám đáy mắt (biến chứng mắt).
- **Tự động sinh nhiệm vụ Kế hoạch chăm sóc (Care Plan Tasks)**:
  - Khi một Condition được kích hoạt, hệ thống tự động sinh các nhiệm vụ định kỳ vào bảng `care_plan_tasks` (ví dụ: "Theo dõi huyết áp sáng và tối", tần suất: 2 lần/ngày).
  - Khi người dùng đánh dấu hoàn thành checkbox, trường `is_completed = true` và `completed_at = NOW()` được cập nhật ngay lập tức.
- **Cascading Side Effects**:
  - Đổi thành viên ở thanh chọn hồ sơ (Member Switcher) tại SCR-10 sẽ đồng bộ sang **toàn bộ 17 màn hình** thông qua State Manager (TanStack Query cache key `[activeMemberId]`). Mọi màn hình từ SCR-02, SCR-03, SCR-05, SCR-07, SCR-09, SCR-11 đều tự động nạp lại dữ liệu của thành viên đó mà không bị lẫn lộn dữ liệu giữa các thành viên gia đình.

---

## 8. SCR-11 · QUẢN LÝ DÙNG THUỐC (Meds) & SCR-12 · NHẬP KẾT QUẢ CẬN LÂM SÀNG

### 8.1. Bảng phân tích từng dòng giao diện SCR-11 (Quản lý dùng thuốc)
| STT | Mã UI / Nhãn hiển thị | Phân loại Label | Dữ liệu hiển thị (Sample) | Nguồn dữ liệu (Origin) | Nơi nhập / Phát sinh | Bảng CSDL & Cột lưu trữ |
|:---:|:---|:---:|:---|:---|:---|:---|
| 1-4 | Header: Ngày, Hồ sơ thành viên, Tiêu đề | Fix cứng + Động | "Hôm nay: 26/10/2026", "Trần Minh Khang", "Thuốc" | Active Context | Global Navigation | Client State |
| 5-7 | 3 Tabs chức năng: `Lịch uống`, `Tủ thuốc`, `Lịch sử` | Fix cứng i18n | 3 chế độ xem quản lý thuốc | Client Tab Selector | Tab Switcher | Không lưu (View State) |
| 8 | Tiêu đề lịch tháng: `THÁNG 10 / 2026` | Động theo tháng | "Tháng 10 / 2026" | Calendar Navigation | Month Picker | Không lưu |
| 9 | Tỷ lệ tuân thủ điều trị | Động (Adherence Rate) | "Tuân thủ 89% · 26 ngày qua" | Adherence Calculator Service | Tính từ lịch sử uống thuốc 30 ngày | Computed `adherence_rate` |
| 10-16 | Tiêu đề thứ trong tuần (T2, T3, T4, T5, T6, T7, CN) | Fix cứng i18n | 7 ngày trong tuần | Lịch chuẩn | Calendar Grid | Không lưu |
| 17-47 | Lưới 31 ô ngày trong tháng (Lịch tuân thủ) | Động (Status Dot) | Ô ngày 1 đến 31 kèm chấm tròn màu:<br>- Xanh lá (`#22C55E`): Uống đủ liều<br>- Vàng (`#F59E0B`): Quên uống thuốc<br>- Đỏ (`#EF4444`): Bỏ qua thuốc<br>- Xám (`#CBD5E1`): Chưa đến ngày | Lịch sử uống thuốc của từng ngày | Background Dose Generator & User Actions | `dose_schedules.status` (`taken`, `missed`, `skipped`, `pending`) |
| 48 | Tiêu đề ngày chọn: `Lịch uống ngày 26/10` | Động ngày chọn | "Lịch uống hôm nay · 26/10" | Ngày được chọn trên lịch | User tap on day cell | Selected Date State |
| 49-56 | Danh sách các liều thuốc trong ngày:<br>- Khung giờ (`07:00`, `20:00`, `21:00`)<br>- Buổi (`Sáng`, `Tối`)<br>- Tên thuốc & hàm lượng (`Losartan 50 mg`, `Metformin 500 mg`, `Atorvastatin 20 mg`)<br>- Cách dùng (`1 viên · sau ăn sáng`)<br>- Trạng thái (`Đã uống`, `Sắp tới`, `Quên`) | Động theo đơn thuốc | Chi tiết liều thuốc phát sinh trong ngày | Đơn thuốc ngoại trú + Lịch nhắc liều | Kê đơn / Nhập toa thuốc SCR-11 Bottom Sheet | `dose_schedules.scheduled_time`, `prescriptions.medication_name`, `dosage`, `instructions`, `dose_schedules.status` |
| 57-59 | Các nút hành động trên liều thuốc:<br>- `Đã uống`<br>- `Bỏ qua`<br>- `Nhắc lại 15p` | Fix cứng i18n | Nút tương tác nhanh | Ghi nhận hành động tuân thủ của bệnh nhân | User tap button | Cập nhật `dose_schedules.status = 'taken'`, `actual_taken_time = NOW()` |
| 60 | Nút Primary CTA: `+ Thêm thuốc` | Fix cứng i18n | Nút nổi thêm thuốc | Kích hoạt Bottom Sheet thêm đơn thuốc | Tap CTA | Mở form thêm thuốc |
| 61-75 | Tab `Tủ thuốc`: Danh sách thuốc đang điều trị | Động | Tên thuốc, Liều lượng, Lý do dùng (Bệnh mạn tính), Bác sĩ kê, Thời gian dùng từ ngày nào, Tác dụng phụ ghi nhận | Bảng đơn thuốc đang hiệu lực (`status = 'active'`) | Nhập toa thuốc | `prescriptions.medication_name`, `indication`, `prescribing_doctor`, `started_at`, `side_effects` |
| 76-85 | Tab `Lịch sử`: Danh sách thuốc đã ngừng | Động | Tên thuốc, Giai đoạn dùng (2019-2021), Lý do ngừng thuốc (ví dụ: ho khan do Enalapril đổi sang Amlodipine) | Đơn thuốc đã kết thúc (`status = 'discontinued'`) | Bác sĩ đổi thuốc / Người dùng khai báo | `prescriptions.discontinued_at`, `discontinuation_reason` |

### 8.2. Bảng phân tích từng dòng giao diện SCR-12 (Nhập kết quả cận lâm sàng)
| STT | Mã UI / Nhãn hiển thị | Phân loại Label | Dữ liệu hiển thị (Sample) | Nguồn dữ liệu (Origin) | Nơi nhập / Phát sinh | Bảng CSDL & Cột lưu trữ |
|:---:|:---|:---:|:---|:---|:---|:---|
| 1-3 | Header: Ngày, Hồ sơ thành viên, Tiêu đề | Fix cứng + Động | "Hôm nay: 26/10/2026", "Nhập kết quả cận lâm sàng" | Active Context | Global Navigation | Client State |
| 4-6 | 3 Tabs phân loại lớn: `Xét nghiệm`, `CĐHA`, `Giải phẫu bệnh (GPB)` | Fix cứng i18n | Chọn loại kết quả cận lâm sàng cần nhập | Khung phân loại cận lâm sàng BYT | User select tab | Form State `kind` (`lab`, `img`, `gpb`) |
| 7-9 | 3 Phương thức nhập liệu: `Nhập thủ công`, `Từ link CSYT`, `AI Camera` | Fix cứng i18n | Chọn phương thức tải dữ liệu | Lựa chọn phương thức nhập | User select method | Form State `method` (`manual`, `link`, `cam`) |
| 10-18 | Luồng Nhập thủ công Xét nghiệm: Danh sách dòng chỉ số (Name, Value, Unit) | Master Danh mục + User Input | Tên: `HbA1c`, Giá trị: `6,6`, Đơn vị: `%`<br>Tên: `LDL-C`, Giá trị: `3,8`, Đơn vị: `mmol/L` | Nhập tay từng dòng kết quả | Bệnh nhân tự gõ từ phiếu giấy | `lab_results.analyte_name`, `result_value`, `unit` |
| 19 | Nút `+ Thêm chỉ số` | Fix cứng i18n | Thêm một dòng nhập liệu mới | Form action | User tap | Tăng `rows.length` |
| 20-25 | Luồng AI Camera: Khung chụp ảnh + Tải ảnh gốc | Động theo ảnh | Xem trước ảnh chụp phiếu xét nghiệm | Camera thiết bị / Thư viện ảnh | User chụp ảnh phiếu xét nghiệm | `clinical_reports.attachment_url` |
| 26-30 | Kết quả OCR trích xuất tự động kèm độ tin cậy: `{{camFields}}` | Động từ AI OCR Engine | "HbA1c: 6,6% · Tin cậy 99% (Xanh)"<br>"Glucose: 6,1 mmol/L · Tin cậy 98% (Xanh)"<br>"LDL-C: 3,8 mmol/L · Cần kiểm tra 71% (Vàng)" | Google Gemini Vision / OCR API | OCR Backend Pipeline | `lab_results` trích xuất tạm (Staging) |
| 31-36 | Khối Đề xuất phân loại thông minh (Smart Classification Engine) | Động (AI Rule) | Huy hiệu đề xuất: `SH · Sinh hoá`<br>Giải trình: *"AI đề xuất dựa trên các chỉ số: HbA1c, Glucose, LDL-C."*<br>Cảnh báo chuyển nhóm: *"Bạn đã đổi từ SH sang HH. Hãy kiểm tra lại."* | Dynamic Analyte Classification Rule | Rule Engine tự động suy luận | `clinical_reports.category` |
| 37 | Luồng CĐHA: Cơ quan / Bộ phận chụp | Config Master Giải phẫu | Dropdown: `Gan`, `Phổi`, `Thận`, `Tuyến giáp`, `Tuyến vú`, `Khác` | Master Data bộ phận cơ thể | Dropdown selection | `imaging_studies.body_part` |
| 38-45 | Luồng CĐHA: Khai báo tổn thương (Loại, Vị trí, Kích thước mm, Tổn thương đích) | Master + User Input | Loại: `Khối u đặc`, Bên: `Phải`, Kích thước: `12 mm`, Checkbox: `Tổn thương đích (Target)` | Nhập kích thước đo tổn thương | Bệnh nhân/Bác sĩ nhập từ báo cáo CĐHA | `imaging_lesions.lesion_type`, `laterality`, `max_diameter_mm`, `is_target_lesion` |
| 46 | Luồng Link CSYT: URL + Username + Password + Captcha | Form nhập link | Link cổng bệnh viện, Tài khoản, Mật khẩu tra cứu, Ảnh captcha | Thông tin cơ sở y tế gửi cho bệnh nhân | User nhập từ phiếu hẹn/SMS | Transient Auth Buffer (Không lưu pass) |
| 47-50 | Nút hành động cuối luồng: `Huỷ`, `Chụp lại`, `Xác nhận & Lưu vào hồ sơ` | Fix cứng i18n | Action Buttons | Hoàn tất lưu dữ liệu cận lâm sàng | User tap | Commit Transaction vào CSDL |

### 8.3. Dữ liệu ngầm & Quy tắc nghiệp vụ (SCR-11 & SCR-12)
- **Công thức tính Tỷ lệ tuân thủ điều trị (Adherence Rate Calculation)**:
  $$	ext{Tỷ lệ tuân thủ (\%)} = rac{	ext{Tổng số liều ĐÃ UỐNG (taken)}}{	ext{Tổng số liều ĐƯỢC KÊ trong 30 ngày (scheduled)}} 	imes 100\%$$
  - Nếu bệnh nhân hoãn liều (`snoozed`), trạng thái tạm thời không tính là `missed` trong vòng 60 phút.
  - Nếu sau 2 giờ kể từ giờ quy định mà bệnh nhân không xác nhận, hệ thống tự động đánh dấu là `missed` (Quên).
- **Thuật toán Tự động gợi ý Phân loại Xét nghiệm (Analyte Voting Engine)**:
  - Khi người dùng nhập nhiều chỉ số xét nghiệm trên cùng một phiếu:
    - Thuật toán đếm số lượng chỉ số thuộc từng chuyên khoa: $N_{	ext{HH}}, N_{	ext{SH}}, N_{	ext{VS}}, N_{	ext{PT}}, N_{	ext{DT}}$.
    - Chuyên khoa có số lượng lớn nhất ($N_{\max}$) được chọn làm đề xuất mặc định (`sugCode`).
    - Nếu có từ 2 chuyên khoa trở lên cùng xuất hiện ($N_{	ext{SH}} > 0$ và $N_{	ext{HH}} > 0$), hệ thống kích hoạt cảnh báo `mixed = true`: *"Phiếu có chỉ số thuộc nhiều nhóm (SH, HH). Khuyến nghị tách thành phiếu riêng để theo dõi biểu đồ chuẩn xác."*
- **Cam kết bảo mật link CSYT (Ephemeral Credential Security)**:
  - Mật khẩu một lần để tải kết quả từ cổng bệnh viện **chỉ được lưu trong bộ nhớ RAM tạm thời**, tuyệt đối không ghi xuống CSDL hoặc log file theo Điều 17 Nghị định 13/2023/NĐ-CP.

---

## 9. SCR-13 · TRỢ LÝ AI & SCR-14 · CHĂM SÓC (Care Team)

### 9.1. Bảng phân tích từng dòng giao diện SCR-13 (Trợ lý AI)
| STT | Mã UI / Nhãn hiển thị | Phân loại Label | Dữ liệu hiển thị (Sample) | Nguồn dữ liệu (Origin) | Nơi nhập / Phát sinh | Bảng CSDL & Cột lưu trữ |
|:---:|:---|:---:|:---|:---|:---|:---|
| 1-3 | Header: Ngày, Hồ sơ thành viên, Tiêu đề | Fix cứng + Động | "Hôm nay: 26/10/2026", "Trợ lý AI" | Active Context | Global Navigation | Client State |
| 4-5 | Lời chào & Định hướng: `Tôi có thể giúp gì hôm nay?` | Fix cứng i18n | Welcome Header | AI Chatbot Interface | Chat screen init | Không lưu |
| 6 | Tuyên ngôn y khoa: `Dựa trên hồ sơ của bạn · không thay thế bác sĩ` | Fix cứng i18n (Bắt buộc) | Medical AI Disclaimer | Cam kết an toàn y tế và pháp lý | Screen Header | Không lưu |
| 7 | Bong bóng chat người dùng: `Sức khoẻ của tôi tháng này thế nào?` | Động theo tin nhắn | "Sức khoẻ của tôi tháng này thế nào?" | Lịch sử chat / Prompt Chip | User gõ / Tap chip | `ai_conversations.prompt_text` |
| 8 | Bong bóng phản hồi của AI | Động (RAG Response) | "So với tháng trước, cân nặng giảm 1,2 kg, huyết áp trung bình giảm từ 138/87 xuống 131/82 mmHg. LDL-C tăng nhẹ. Chưa có dấu hiệu bất thường rõ rệt trong dữ liệu hiện có." | Retrieval-Augmented Generation (RAG) từ DB bệnh nhân | AI Engine (Gemini Pro Medical) | `ai_conversations.response_text` |
| 9-10 | Deep-link trích dẫn bằng chứng: `Huyết áp 30 ngày`, `Xét nghiệm 20/10` | Động (Citations) | Nút bấm liên kết thẳng đến nguồn dữ liệu | Vector Search Grounding | Metadata trích dẫn của câu trả lời AI | `ai_conversations.citation_sources` |
| 11 | Khối hành động: `VIỆC NÊN LÀM TIẾP THEO` | Fix cứng i18n | Actionable Advice Header | Clinical Guideline Mapping | RAG Post-processing | Không lưu |
| 12-17 | 3 khuyến nghị hành động số hóa: 1. Theo dõi huyết áp, 2. Trao đổi bác sĩ về LDL-C, 3. Tái khám tim mạch 12/11 | Động theo tình trạng bệnh nhân | 3 bước hành động cụ thể | Tổng hợp từ Care Plan và kết quả bất thường | AI Clinical Decision Support | `care_plan_tasks` suggestions |
| 18-19 | Chips câu hỏi gợi ý thông minh | Động theo hồ sơ bệnh | "Nốt phổi của tôi thay đổi thế nào?", "Giải thích kết quả MRI gan" | Prompt Recommendation Engine | Phân tích các bất thường mới có trong hồ sơ | Dynamic Prompt Suggestion |
| 20 | Ô nhập văn bản chat: `Câu hỏi cho trợ lý...` | Fix cứng i18n | Input placeholder | Text Input Box | User typing | `ai_conversations.prompt_text` |

### 9.2. Bảng phân tích từng dòng giao diện SCR-14 (Chăm sóc / Care Team)
| STT | Mã UI / Nhãn hiển thị | Phân loại Label | Dữ liệu hiển thị (Sample) | Nguồn dữ liệu (Origin) | Nơi nhập / Phát sinh | Bảng CSDL & Cột lưu trữ |
|:---:|:---|:---:|:---|:---|:---|:---|
| 1-4 | Header: Ngày, Hồ sơ thành viên, Tiêu đề | Fix cứng + Động | "Hôm nay: 26/10/2026", "Chăm sóc" | Active Context | Global Navigation | Client State |
| 5-9 | Khối Lịch hẹn sắp tới: Ngày, Giờ, Bác sĩ | Động | Ngày: `12 TH 11`<br>Tên hẹn: `Tái khám tim mạch`<br>Giờ & Bác sĩ: `09:00 · BS Trần Văn B` | Lịch hẹn y tế đã xác nhận | Đặt lịch khám / Bác sĩ hẹn | `care_appointments.appointment_date`, `time_slot`, `doctor_name` |
| 10-11 | Tiêu đề danh bạ bác sĩ: `My Care Team` | Fix cứng i18n | "Chạm để xem, sửa liên hệ" | Care Team Directory Header | Client UI template | Không lưu |
| 12-15 | Danh sách bác sĩ trong Care Team (Avatar + Chuyên khoa) | Động | Avatar Initials (`TB`, `HD`), Chuyên khoa (`Tim mạch`, `Bác sĩ gia đình`) | Danh bạ bác sĩ điều trị | Thêm bác sĩ SCR-14 Modal | `care_doctors.full_name`, `specialty` |
| 16 | Nút `+ Thêm bác sĩ` | Fix cứng i18n | Action Button | Mở Bottom Sheet thêm bác sĩ | User tap | Mở Modal thêm bác sĩ |
| 17-20 | Chi tiết bác sĩ được chọn: Tên, Chuyên khoa, Bệnh viện, SĐT, Email | Động | "BS Trần Văn B", "Tim mạch · [Bệnh viện đối tác]", "0901234567", "bstranvanb@bv.vn" | Thông tin liên hệ bác sĩ | Care Team Record | `care_doctors.phone`, `email`, `facility_name` |
| 21-24 | 4 Nút hành động liên lạc nhanh: `Gọi`, `Email`, `Nhắn tin / Video`, `Gửi hồ sơ trước khám` | Fix cứng i18n | Nút gọi `tel:`, mở mail `mailto:`, gọi tele-consultation, và chia sẻ hồ sơ | Native Device Linking & Data Export | User tap action buttons | Native OS intent & Consent generator |
| 26-28 | Khối Quản trị quyền xem dữ liệu: `Ai được xem dữ liệu của tôi?` | Fix cứng + Động | "3 người đang có quyền · 1 hết hạn sau 7 ngày" + Link `Quản lý` | Quản trị quyền chia sẻ dữ liệu y tế | Module chia sẻ quyền truy cập | `data_sharing_grants.grantee_id`, `expires_at` |
| 34-43 | Bottom Sheet: Form thêm bác sĩ mới (Avatar, Họ tên, Chuyên khoa, Cơ sở y tế, SĐT, Email, Huỷ, Lưu) | Fix cứng i18n + Form fields | Form nhập thông tin bác sĩ | Người dùng tự thêm thông tin bác sĩ riêng | User input form | Ghi vào bảng `care_doctors` |

### 9.3. Dữ liệu ngầm & Quy tắc nghiệp vụ (SCR-13 & SCR-14)
- **Kiến trúc RAG An toàn y tế (Medical-Safe Retrieval-Augmented Generation)**:
  - Khi người dùng đặt câu hỏi, AI **không suy diễn tự do (Zero Hallucination Tolerance)**.
  - Hệ thống thực hiện Vector Search trên tập dữ liệu hồ sơ của đúng `activeMemberId`: gồm các chỉ số sinh trắc 30 ngày, 3 phiếu xét nghiệm gần nhất, và báo cáo CĐHA gần nhất.
  - Mọi câu trả lời bắt buộc phải đính kèm trích dẫn nguồn (`citations`) trỏ trực tiếp đến màn hình cụ thể trong ứng dụng.
- **Cơ chế Chia sẻ Hồ sơ trước khám có thời hạn (Expiring Data Grant)**:
  - Khi bấm `Gửi hồ sơ trước khám`, hệ thống sinh ra một **Mã truy cập tạm thời (Secure Ephemeral Token)** có thời hạn tối đa 7 ngày.
  - Bác sĩ chỉ xem được các mục dữ liệu mà bệnh nhân tích chọn cấp quyền. Sau 7 ngày, quyền truy cập tự động bị thu hồi theo quy định tại Nghị định 13/2023/NĐ-CP.

---

## 10. SCR-15 · THẺ KHẨN CẤP (SOS), SCR-16 · THÔNG TIN CÁ NHÂN, SCR-17 · HỒ SƠ GIA ĐÌNH

### 10.1. Bảng phân tích từng dòng giao diện SCR-15 (Thẻ sức khoẻ khẩn cấp SOS)
| STT | Mã UI / Nhãn hiển thị | Phân loại Label | Dữ liệu hiển thị (Sample) | Nguồn dữ liệu (Origin) | Nơi nhập / Phát sinh | Bảng CSDL & Cột lưu trữ |
|:---:|:---|:---:|:---|:---|:---|:---|
| 1-3 | Header: Ngày, Hồ sơ thành viên, Tiêu đề | Fix cứng + Động | "Hôm nay: 26/10/2026", "EMERGENCY HEALTH CARD" | Active Context | Global Navigation | Client State |
| 4-5 | Huy hiệu cảnh báo: `Hiển thị trên màn hình khoá` | Fix cứng i18n | Badge đỏ cấp cứu | Lock screen widget toggle | Cài đặt hệ thống | `emergency_cards.show_on_lockscreen` |
| 6-7 | Thông tin định danh: Họ tên, Năm sinh, Giới tính | Động | "Trần Minh Khang", "Nam · 1980 (46 tuổi)" | Profile cá nhân | SCR-16 Profile | `family_members.full_name`, `birth_date`, `gender` |
| 8-9 | Khối `NHÓM MÁU` (Blood Type) | Fix cứng nhãn, Động giá trị | `O+` (Chữ to đậm đỏ) | Nhóm máu xác thực | Khai báo y tế | `family_members.blood_type` |
| 10-11 | Khối `DỊ ỨNG` (Critical Allergies) | Fix cứng nhãn, Động giá trị | "Penicillin (sốc phản vệ độ 2)" | Danh mục dị ứng nghiêm trọng | Khai báo dị ứng SCR-10 / Emergency | `allergy_items.allergen_name`, `severity` |
| 12-13 | Khối `BỆNH NỀN` (Underlying Conditions) | Fix cứng nhãn, Động giá trị | "Tăng huyết áp, Đái tháo đường type 2" | Bệnh mạn tính đang điều trị | SCR-09 Cockpit | `conditions.condition_name` |
| 14-15 | Khối `THUỐC` (Current Critical Meds) | Fix cứng nhãn, Động giá trị | "Losartan 50 mg, Metformin 500 mg" | Thuốc đang sử dụng | SCR-11 Meds | `prescriptions.medication_name` |
| 16-17 | Khối `BÁC SĨ GIA ĐÌNH` | Fix cứng nhãn, Động giá trị | "BS Hoàng Thị D · 0912345678" | Bác sĩ phụ trách chính | SCR-14 Care Team | `care_doctors.full_name`, `phone` |
| 18-19 | Khối `SỰ KIỆN GẦN NHẤT` | Fix cứng nhãn, Động giá trị | "Sinh thiết gan · 02/2026; CT ngực · 10/2026" | Biến cố y khoa quan trọng gần nhất | Lịch sử bệnh án | Dynamic Summary |
| 20-21 | Khối `LIÊN HỆ KHẨN CẤP` | Fix cứng nhãn, Động giá trị | "Lê Thu Hà (Vợ) · 0987654321" | Người thân bảo lãnh cấp cứu | Danh bạ người thân khẩn cấp | `emergency_contacts.name`, `relationship`, `phone` |
| 22 | Khối `Mã QR Offline` | Động (Vector QR) | QR Code chứa dữ liệu y tế mã hóa ECC | Bộ sinh mã QR Offline | Native QR Generator | Signed Payload JSON |
| 23 | Hướng dẫn cấp cứu: `Nhân viên y tế quét QR...` | Fix cứng i18n | Micro-copy hướng dẫn quét cứu nạn | Tiêu chuẩn cấp cứu y tế | Client UI static | Không lưu |
| 24 | Nút khẩn cấp: `Gọi cấp cứu 115` | Fix cứng i18n | Nút đỏ to toàn màn hình (`tel:115`) | Native phone dialer call 115 | User tap emergency button | Native OS Call Intent |

### 10.2. Bảng phân tích từng dòng giao diện SCR-16 (Thông tin người dùng / Tài khoản)
| STT | Mã UI / Nhãn hiển thị | Phân loại Label | Dữ liệu hiển thị (Sample) | Nguồn dữ liệu (Origin) | Nơi nhập / Phát sinh | Bảng CSDL & Cột lưu trữ |
|:---:|:---|:---:|:---|:---|:---|:---|
| 1-4 | Header: Tiêu đề + Nút `Lưu` | Fix cứng i18n | "Thông tin người dùng", Nút `Lưu` | Screen Header | Action Handler | Không lưu |
| 6-7 | Avatar + Tên + Badge định danh: `Đã xác thực định danh điện tử` | Động | "Trần Minh Khang" + Badge VNeID mức 2 | Trạng thái eKYC / VNeID | Luồng xác thực VNeID | `users.is_ekyc_verified`, `users.national_id` |
| 8-17 | Khối `THÔNG TIN CÁ NHÂN`: CCCD, Ngày sinh, Giới tính, SĐT, Email, Địa chỉ | Fix cứng nhãn, Động giá trị | CCCD: `001080001234`<br>Ngày sinh: `15/08/1980`<br>Giới tính: `Nam`<br>SĐT: `0901234567`<br>Email: `khang.tm@gmail.com`<br>Địa chỉ: `Hà Nội` | Dữ liệu tài khoản người dùng | Đăng ký tài khoản / eKYC | `users.national_id`, `birth_date`, `gender`, `phone_number`, `email`, `address` |
| 18-25 | Khối `THÔNG TIN Y TẾ`: Nhóm máu, Chiều cao, Cân nặng, Số thẻ BHYT | Fix cứng nhãn, Động giá trị | Nhóm máu: `O+`<br>Chiều cao: `174 cm`<br>Cân nặng: `72,5 kg`<br>Số thẻ BHYT: `GD4010123456789` | Chỉ số thể chất & bảo hiểm | Khai báo y tế cá nhân | `family_members.blood_type`, `height_cm`, `weight_kg`, `insurance_number` |
| 26-31 | Khối Quản trị hệ thống: Hồ sơ gia đình (3 người), Thiết bị (3 máy), Sinh trắc & MFA, Quyền chia sẻ | Fix cứng + Động đếm | Đếm số lượng liên kết + Các menu cài đặt bảo mật | Cài đặt tài khoản người dùng | Account Settings Navigation | Settings Navigation |
| 32 | Nút `Đăng xuất` | Fix cứng i18n | Nút đăng xuất đỏ | Hủy bỏ phiên làm việc, xóa Refresh Token | User tap Logout | Invalidate Session & Tokens |

### 10.3. Bảng phân tích từng dòng giao diện SCR-17 (Hồ sơ gia đình)
| STT | Mã UI / Nhãn hiển thị | Phân loại Label | Dữ liệu hiển thị (Sample) | Nguồn dữ liệu (Origin) | Nơi nhập / Phát sinh | Bảng CSDL & Cột lưu trữ |
|:---:|:---|:---:|:---|:---|:---|:---|
| 1-4 | Header: Tiêu đề + Nút `+ Thêm người thân` | Fix cứng i18n | "Hồ sơ gia đình" + Nút thêm | Screen Header | Action Handler | Mở Modal thêm thành viên |
| 6-7 | Danh sách Chip thành viên gia đình | Động | `Khang (Tôi)`, `Hà (Vợ)`, `An (Con)`, `Huy (Con)`, `Lan (Mẹ)` | Danh sách thành viên gia đình | SCR-17 thêm thành viên | `family_members.full_name`, `relationship` |
| 8-11 | Thẻ tổng quan thành viên được chọn: Health Score, Tên, Tuổi, Trạng thái | Động | Điểm sức khoẻ: `82`<br>Tên: `Lê Thu Hà`<br>Tuổi: `Nữ · 46 tuổi`<br>Trạng thái: `1 vấn đề cần theo dõi` | Aggregate Health Score của thành viên đó | Health Score Engine | Computed per Member |
| 12-14 | 3 Chỉ số nhanh của thành viên | Động | `Huyết áp: 118/76 (Tốt)`, `BMI: 20,8 (Tốt)`, `Hemoglobin: 112 (Theo dõi)` | Chỉ số mới nhất của thành viên | Biometrics & Labs query | Multi-table Query |
| 15-18 | Khối `AI INSIGHT` của thành viên: Nhận định, Việc tiếp theo, Thuốc | Động | AI nhận định: *"Ferritin thấp, cần bổ sung sắt theo đơn."*<br>Tiếp theo: *"Tái khám huyết học 20/12"*<br>Thuốc: *"2 loại đang dùng"* | AI Clinical Summary riêng cho thành viên | AI Medical Evaluator | `ai_insights.summary` |
| 19-24 | 6 Phím tắt truy cập nhanh dữ liệu thành viên: `Sinh trắc`, `Xét nghiệm`, `Hồ sơ y tế`, `Bệnh mạn tính`, `Lịch khám`, `Thẻ khẩn cấp` | Fix cứng i18n | Phím tắt chuyển nhanh màn hình với ngữ cảnh thành viên đã chọn | Navigation Shortcuts | User tap button | Set `activeMemberId` & Navigate |
| 25 | Cảnh báo Pháp lý & Đồng thuận trên 18 tuổi | Fix cứng i18n (Bắt buộc theo luật) | "Bạn là người quản lý hồ sơ này. Thành viên trên 18 tuổi cần đồng ý chia sẻ trước khi bạn xem dữ liệu." | Điều ước bảo vệ dữ liệu cá nhân Nghị định 13/2023 | Pháp lý y tế | Cổng kiểm soát `consent_status` |

### 10.4. Dữ liệu ngầm & Quy tắc nghiệp vụ (SCR-15, SCR-16, SCR-17)
- **Cơ chế QR Cấp cứu Offline (Encrypted Offline QR Code)**:
  - Khi xe cấp cứu 115 tiếp cận nạn nhân không có kết nối 4G/Wifi, điện thoại vẫn hiển thị được QR Code cấp cứu.
  - Payload của QR Code là chuỗi JSON nén (Gzip Base64) được ký số bằng khóa riêng của thiết bị (Private Key ECDSA):
    `{ name, blood, allergies, chronic_dx, emergency_phone, sig }`.
  - Nhân viên y tế dùng bất kỳ máy quét QR chuẩn nào cũng đọc được thông tin nhóm máu và dị ứng ngay lập tức để quyết định truyền máu hoặc tiêm thuốc giảm đau an toàn.
- **Cổng Pháp lý Đồng thuận Thành viên $\ge 18$ tuổi (BR-03 Legal Consent Gate)**:
  - Khi chủ tài khoản bấm xem hồ sơ của `Trần Minh An` (19 tuổi):
    - Hệ thống kiểm tra trường `family_members.is_above_18 = true`.
    - Nếu `consent_approved = false`, màn hình lập tức kích hoạt **Tường lửa đồng thuận (Consent Firewall)**: Chỉ hiển thị nút *"Gửi yêu cầu chia sẻ dữ liệu qua số điện thoại của An"*. Toàn bộ các chỉ số XN, CĐHA, Bệnh mạn tính bị che mờ (Redacted) cho đến khi tài khoản của An bấm Chấp thuận.
- **Ràng buộc định dạng Số thẻ BHYT Việt Nam**:
  - Mã thẻ BHYT gồm chính xác **15 ký tự**: 2 ký tự đầu là mã đối tượng (GD, DN, CH...), 1 ký tự mức hưởng (1-5), 2 ký tự mã tỉnh (01, 79...), và 10 số cuối là mã số BHXH cá nhân.
  - Bắt buộc kiểm tra Regex: `^[A-Z]{2}[1-5][0-9]{2}[0-9]{10}$` trước khi ghi nhận vào CSDL.

---

## 11. BẢNG TỔNG KẾT TOÀN DIỆN: MASTER SCREEN & DATA ORIGIN MATRIX

| Mã màn hình | Tên màn hình | Số phần tử UI | Phân loại Label cố định (i18n) | Phân loại Label Config (DB/Master) | Nguồn dữ liệu thực tế (Data Origin) | Bảng CSDL cốt lõi |
|:---:|:---|:---:|:---:|:---:|:---|:---|
| **SCR-01** | Đăng nhập | 13 | 100% | 0% | Nhập liệu người dùng, Sinh trắc học thiết bị | `users`, `auth_audit_logs` |
| **SCR-02** | Trang chủ | 44 | 40% | 60% | Health Score Engine, Lịch nhắc thuốc, Biometrics, Timeline | `health_scores`, `dose_schedules`, `clinical_reports` |
| **SCR-03** | Sinh trắc học | 94 | 35% | 65% | Thiết bị đo BLE, Apple Health, Form nhập tay | `biometric_records`, `connected_devices` |
| **SCR-04** | Kết nối thiết bị | 33 | 50% | 50% | Quét Bluetooth LE, Cấu hình tần suất đồng bộ | `connected_devices` |
| **SCR-05** | Xét nghiệm | 50 | 30% | 70% | Phiếu xét nghiệm OCR, Tích hợp cổng bệnh viện | `clinical_reports`, `lab_results` |
| **SCR-06** | Báo cáo XN chi tiết | 34 | 20% | 80% | 12 chỉ số sinh hoá/huyết học, Ngưỡng tham chiếu | `lab_results`, `analyte_threshold_rules` |
| **SCR-07** | Chẩn đoán hình ảnh | 100 | 25% | 75% | Bác sĩ CĐHA đo tổn thương, Bảng SoD, RECIST 1.1 | `imaging_studies`, `imaging_lesions` |
| **SCR-08** | Báo cáo CĐHA chi tiết | 52 | 35% | 65% | Chuỗi xung DICOM/PACS, Kết luận chẩn đoán hình ảnh | `imaging_studies` |
| **SCR-09** | Disease Cockpit | 47 | 30% | 70% | Hồ sơ bệnh mạn tính, Kế hoạch chăm sóc, Task điều trị | `conditions`, `care_plan_tasks`, `condition_templates` |
| **SCR-10** | Hồ sơ y tế | 35 | 35% | 65% | 9 nhóm danh mục dữ liệu y tế, Panel GPB & Bác sĩ | `family_members`, `clinical_reports`, `care_doctors` |
| **SCR-11** | Quản lý dùng thuốc | 91 | 30% | 70% | Đơn thuốc ngoại trú, Lịch uống thuốc, Tỷ lệ tuân thủ | `prescriptions`, `dose_schedules` |
| **SCR-12** | Nhập kết quả cận lâm sàng | 140 | 40% | 60% | Wizard 3 bước: Nhập tay, AI Camera OCR, Link CSYT | `clinical_reports`, `lab_results`, `imaging_lesions` |
| **SCR-13** | Trợ lý AI | 25 | 40% | 60% | Chatbot y tế RAG ngữ cảnh hóa theo hồ sơ bệnh nhân | `ai_conversations` |
| **SCR-14** | Chăm sóc | 43 | 35% | 65% | Danh bạ bác sĩ điều trị, Lịch hẹn tái khám, Cấp quyền | `care_doctors`, `care_appointments`, `data_sharing_grants` |
| **SCR-15** | Thẻ sức khoẻ khẩn cấp | 24 | 35% | 65% | Dữ liệu sống còn (Nhóm máu, Dị ứng, SOS), QR Offline | `family_members`, `allergy_items`, `emergency_contacts` |
| **SCR-16** | Thông tin người dùng | 32 | 45% | 55% | Định danh VNeID/eKYC, Hồ sơ nhân khẩu & BHYT | `users`, `family_members` |
| **SCR-17** | Hồ sơ gia đình | 25 | 35% | 65% | Thành viên phụ thuộc, Cổng đồng thuận trên 18 tuổi | `family_members`, `data_sharing_grants` |

---
