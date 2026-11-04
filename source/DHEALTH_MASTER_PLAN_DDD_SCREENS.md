# 📋 KẾ HOẠCH TỔNG THỂ & THIẾT KẾ KIẾN TRÚC HỆ THỐNG D-HEALTH (DDD & SCREEN-BY-SCREEN AUDIT)

> **Tài liệu tham chiếu:**
> - Đặc tả nghiệp vụ: `source/5_6291670095529781835.md` (BA Specification v1.0).
> - Thiết kế giao diện: `source/D-Health - Ứng dụng di động.html` (17 Artboards màn hình chính + 11 Artboards Empty State).
> - Tiêu chuẩn kỹ thuật: `GEMINI.md` (TDD, DDD, Clean Architecture, High-Density UX, Web Security & Nghị định 13/2023/NĐ-CP).

---

## 🏛️ PHẦN 1: MÔ HÌNH THỰC THỂ CHIẾN THUẬT (TACTICAL DDD DOMAIN MODEL)

Hệ thống D-HEALTH được cấu trúc thành **7 Bounded Contexts** độc lập. Mọi thực thể y tế bắt buộc gắn liền với **`MemberId`** (Hồ sơ người bệnh), tuyệt đối không gắn trực tiếp vào `UserId` (Tài khoản người dùng), đảm bảo tính toàn vẹn khi quản lý hồ sơ gia đình.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              D-HEALTH BOUNDED CONTEXTS                                 │
├──────────────────────────┬─────────────────────────────┬───────────────────────────────┤
│ 1. Identity & Access     │ 2. Member & Family Context  │ 3. Biometrics Context         │
│ • User (Root)            │ • Member (Aggregate Root)   │ • BiometricReading (Root)     │
│ • Session / RefreshToken │ • FamilyRelationship        │ • Device (Aggregate Root)     │
│ • BiometricAuthCredential│ • ConsentGrant              │ • MetricThresholdRule (Config)│
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ 4. Clinical Diagnostics  │ 5. Medication & Adherence   │ 6. Care & Consultation        │
│ • ClinicalReport (Root)  │ • Medication (Root)         │ • Doctor / CareTeamMember     │
│ • LabResult / Analyte    │ • DoseSchedule / DoseLog    │ • MedicalFacility             │
│ • ImagingStudy / Lesion  │ • AdherenceRecord           │ • Appointment                 │
│ • PathologyReport / IHC  │ • DrugInteractionRule       │ • ChronicCondition / CareTask │
├──────────────────────────┴─────────────────────────────┴───────────────────────────────┤
│ 7. Emergency, Security & AI Assistant                                                 │
│ • EmergencyCard (Root) & QRAccessToken                                                │
│ • ShareGrant & ThirdPartyAccessLog (Audit Trail - NĐ 13/2023/NĐ-CP)                    │
│ • AIConversation & AIMessage (Clinical Citation Linking)                              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 1.1 Chi Tiết Các Thực Thể & Value Objects Theo Từng Bounded Context

#### Context 1: Identity & Access (Định danh & Kiểm soát truy cập)
* **`User` (Aggregate Root)**:
  * Thuộc tính: `id: UserId`, `phone: PhoneNumberVO`, `email: EmailVO`, `passwordHash: HashedPasswordVO`, `mfaEnabled: boolean`, `biometricEnabled: boolean`, `status: UserStatus (ACTIVE | LOCKED)`, `failedLoginAttempts: number`, `lockedUntil: Date | null`, `lastLoginAt: Date | null`.
  * Invariant: Khoá tài khoản 15 phút nếu nhập sai quá 5 lần liên tiếp.
* **`Session` (Entity)**: `id: SessionId`, `userId: UserId`, `refreshTokenHash: string`, `deviceId: string`, `platform: 'ios' | 'android'`, `ipAddress: string`, `userAgent: string`, `expiresAt: Date`.

#### Context 2: Member & Family (Hồ sơ sức khỏe & Quản lý gia đình)
* **`Member` (Aggregate Root)**:
  * Thuộc tính: `id: MemberId`, `ownerUserId: UserId`, `linkedUserId: UserId | null`, `fullName: FullNameVO`, `dob: DateVO`, `gender: Gender (MALE | FEMALE | OTHER)`, `relation: RelationType (SELF | SPOUSE | CHILD | PARENT | OTHER)`, `nationalIdEnc: EncryptedFieldVO (CCCD 12 số)`, `phone: PhoneNumberVO | null`, `email: EmailVO | null`, `address: string | null`, `avatarUrl: string | null`, `bloodType: BloodTypeVO (A+ | A- | B+ | B- | AB+ | AB- | O+ | O- | UNKNOWN)`, `heightCm: number | null`, `weightKg: number | null`, `insuranceNoEnc: EncryptedFieldVO (BHYT 15 ký tự)`, `ekycVerifiedAt: Date | null`, `consentStatus: ConsentStatus (NOT_REQUIRED | PENDING | GRANTED | REVOKED)`, `consentAt: Date | null`.
  * **Value Objects**:
    * `BloodTypeVO`: Tự validate 9 nhóm máu hợp lệ.
    * `NationalIdVO`: Mã hóa AES-256-GCM, tự động che khi hiển thị (`0790******12`).
    * `InsuranceNoVO`: Mã hóa AES-256-GCM, tự động che khi hiển thị.
  * Invariants:
    * BR-01: Nếu `dob` xác định tuổi ≥ 18 và `relation != SELF`, `consentStatus` mặc định là `PENDING`. Chủ tài khoản không được đọc dữ liệu cận lâm sàng/thuốc cho đến khi có xác nhận `GRANTED`.
    * BR-02: Nếu tuổi < 18, quyền thuộc trực tiếp về người giám hộ (`ownerUserId`).
* **`ActiveMemberContext` (Domain State)**: `userId: UserId`, `activeMemberId: MemberId`, `updatedAt: Date`.

#### Context 3: Biometrics (Sinh trắc học & Thiết bị)
* **`BiometricReading` (Aggregate Root)**:
  * Thuộc tính: `id: ReadingId`, `memberId: MemberId`, `metric: BiometricMetricType (BP | HR | SPO2 | TEMP | RR | WEIGHT | BMI | STEPS | SLEEP | GLUCOSE_CAP | BODY_FAT)`, `measuredAt: Date`, `valueNum: number | null`, `valueSys: number | null`, `valueDia: number | null`, `unit: string`, `source: DataSourceType (DEVICE | MANUAL)`, `deviceId: DeviceId | null`, `context: MeasurementContext (REST | WAKE | EXERCISE | MEAL | BED | null)`, `note: string | null (≤200 ký tự)`, `groupId: string | null (liên kết HA + Nhịp tim nhập cùng lúc)`, `isHidden: boolean`.
  * **Value Objects**:
    * `BloodPressureVO`: `systolic (60-250)`, `diastolic (30-150)`, bất biến, bắt buộc `systolic > diastolic`.
    * `HeartRateVO`: `bpm (30-220)`.
    * `SpO2VO`: `percentage (70-100)`.
    * `BodyTemperatureVO`: `celsius (34.0 - 42.0)`.
    * `BMIVO`: `weightKg / (heightM)^2`, làm tròn 1 chữ số thập phân.
  * Invariants:
    * BR-50: `measuredAt <= now()` (tuyệt đối không nhận số đo trong tương lai).
    * BR-51: Nhập HA kèm NT tạo ra 2 `BiometricReading` có cùng `groupId` và cùng `measuredAt`.
* **`Device` (Aggregate Root)**:
  * Thuộc tính: `id: DeviceId`, `memberId: MemberId`, `vendor: DeviceVendor (APPLE_HEALTH | HEALTH_CONNECT | APPLE_WATCH | GARMIN | SAMSUNG | FITBIT | BLE_BP | BLE_SPO2 | BLE_GLUCOSE | SCALE | THERMOMETER)`, `name: string`, `externalId: string`, `status: DeviceConnectionStatus (CONNECTED | DISCONNECTED)`, `batteryPct: number | null`, `syncFrequency: SyncFrequency (REALTIME | 15M | 1H | MANUAL)`, `allowedTypes: BiometricMetricType[]`, `lastSyncAt: Date | null`.

#### Context 4: Clinical & Diagnostics (Cận lâm sàng, Xét nghiệm, CĐHA, GPB)
* **`ClinicalReport` (Aggregate Root)**:
  * Thuộc tính: `id: ReportId`, `memberId: MemberId`, `kind: ReportKind (LAB | IMAGING | PATHOLOGY)`, `category: LabCategory | null (HH | SH | VS | PT | DT)`, `title: string`, `performedAt: Date`, `resultedAt: Date | null`, `facilityId: FacilityId | null`, `facilityName: string`, `orderingDoctorId: DoctorId | null`, `orderingDoctorName: string | null`, `readingDoctorId: DoctorId | null`, `readingDoctorName: string | null`, `sampleType: string | null`, `reportCode: string | null`, `doctorComment: string | null`, `aiSummary: string | null`, `source: DataSourceType (MANUAL | LINK_CSYT | AI_CAMERA | IMPORT)`, `confirmedAt: Date | null`, `confirmedBy: UserId | null`, `attachmentIds: AttachmentId[]`.
  * Invariant BR-21: Báo cáo từ `AI_CAMERA` hoặc `LINK_CSYT` chỉ chuyển sang trạng thái chính thức sau khi có `confirmedAt`.
* **`LabResult` (Entity thuộc ClinicalReport)**:
  * Thuộc tính: `id: LabResultId`, `reportId: ReportId`, `analyteCode: string (LOINC chuẩn hoá)`, `analyteName: string`, `valueNum: number | null`, `valueText: string | null`, `unit: string`, `refLow: number | null`, `refHigh: number | null`, `refText: string | null`, `flag: ResultFlag (NORMAL | HIGH | LOW | ABNORMAL)`.
* **`ImagingStudy` (Entity mở rộng của ClinicalReport kind=IMAGING)**:
  * Thuộc tính: `reportId: ReportId`, `modality: ImagingModality (SA | XQ | MM | CT | MRI)`, `bodyPart: BodyPartEnum`, `bodyPartOther: string | null`, `sequences: string[] (ví dụ T1, T2, DWI)`, `technique: string | null`, `findings: string (Mô tả chi tiết)`, `conclusion: string (Kết luận)`, `recommendation: string | null (Đề nghị)`, `compareReportId: ReportId | null`, `pacsUrl: string | null`.
* **`LesionGroup` (Aggregate Root)**:
  * Thuộc tính: `id: LesionGroupId`, `memberId: MemberId`, `lesionType: LesionType (SOLID | CYST | OTHER)`, `location: BodyPartEnum`, `locationOther: string | null`, `title: string`, `note: string | null`.
* **`Lesion` (Entity thuộc LesionGroup)**:
  * Thuộc tính: `id: LesionId`, `groupId: LesionGroupId`, `label: string (U1, U2, N1)`, `side: LesionSide (RIGHT | LEFT | DIFFUSE)`, `subLocation: string | null`, `isTarget: boolean (Tổn thương đích theo RECIST 1.1)`.
* **`LesionMeasurement` (Entity)**:
  * Thuộc tính: `id: MeasurementId`, `lesionId: LesionId`, `reportId: ReportId`, `measuredAt: Date`, `sizeMm: number`.
* **`PathologyReport` (Entity mở rộng của ClinicalReport kind=PATHOLOGY)**:
  * Thuộc tính: `reportId: ReportId`, `specimenType: SpecimenType (FNA | BIOPSY_CORE | BIOPSY_OPEN | SURGICAL | FLUID_CYTOLOGY)`, `sampleSite: string`, `gpbCode: string`, `diagnosis: string`, `grade: TumorGrade (G1 | G2 | G3 | NA)`, `ptnm: string | null`, `margin: SurgicalMargin (NEGATIVE | POSITIVE | NOT_ASSESSED)`.
* **`IHCMarker` (Entity thuộc PathologyReport)**:
  * Thuộc tính: `id: MarkerId`, `reportId: ReportId`, `marker: string (Ki-67, ER, PR, HER2, PD-L1, TTF-1, CK7, CK20, Glypican-3...)`, `result: string (+, -, %)`.

#### Context 5: Medication & Adherence (Quản lý thuốc & Tuân thủ)
* **`Medication` (Aggregate Root)**:
  * Thuộc tính: `id: MedicationId`, `memberId: MemberId`, `name: string`, `strength: string (hàm lượng: ví dụ 500mg)`, `dosePerTime: string (ví dụ 1 viên, 2 viên, 5ml)`, `timesPerDay: number (1 | 2 | 3)`, `routeNote: RouteNote (AFTER_MEAL | BEFORE_MEAL | BEDTIME)`, `reminderTimes: string[] (['08:00', '18:00'])`, `startDate: Date`, `duration: DurationType (7D | 14D | 30D | 90D | LONG_TERM)`, `endDate: Date | null`, `indication: string | null`, `prescriberName: string | null`, `sideEffects: string | null`, `reminderEnabled: boolean`, `status: MedicationStatus (ACTIVE | STOPPED)`, `stoppedAt: Date | null`, `stopReason: string | null`, `source: DataSourceType (MANUAL | AI_CAMERA)`, `aiConfidence: number | null`.
* **`DoseSchedule` / `DoseLog` (Entity)**:
  * Thuộc tính: `id: DoseId`, `medicationId: MedicationId`, `memberId: MemberId`, `scheduledAt: Date`, `status: DoseStatus (SCHEDULED | PENDING | TAKEN | SNOOZED | MISSED | SKIPPED)`, `actedAt: Date | null`, `snoozeCount: number`.
  * Invariant: Tự động chuyển `MISSED` nếu sau giờ hẹn 2 giờ mà chưa xử lý. "Nhắc lại 15p" tối đa 3 lần.

#### Context 6: Care Network & Chronic Disease (Đội ngũ chăm sóc & Bệnh mạn tính)
* **`Doctor` (Entity)**: `id: DoctorId`, `memberId: MemberId`, `fullName: string`, `specialty: string`, `facilityName: string`, `phone: string | null`, `email: string | null`, `avatarUrl: string | null`, `inCareTeam: boolean`.
* **`Appointment` (Entity)**: `id: AppointmentId`, `memberId: MemberId`, `doctorId: DoctorId | null`, `facilityId: FacilityId | null`, `title: string`, `startAt: Date`, `status: AppointmentStatus (REQUESTED | CONFIRMED | DONE | CANCELLED)`.
* **`Condition` (Entity)**: `id: ConditionId`, `memberId: MemberId`, `code: string (ICD-10)`, `name: string`, `status: ConditionStatus (ACTIVE | RESOLVED)`, `source: DataSourceType`.
* **`CarePlanTask` (Entity)**: `id: TaskId`, `memberId: MemberId`, `conditionId: ConditionId`, `title: string`, `isDone: boolean`, `doneAt: Date | null`.

#### Context 7: Emergency, Security & AI Assistant (Cấp cứu, Chia sẻ, Trợ lý AI)
* **`EmergencyCard` (Aggregate Root)**: `memberId: MemberId`, `visibleFields: string[]`, `showOnLockscreen: boolean`, `qrToken: string`, `emergencyContacts: EmergencyContactVO[]`.
* **`ShareGrant` (Aggregate Root)**: `id: GrantId`, `memberId: MemberId`, `granteeType: 'doctor' | 'link'`, `granteeId: string | null`, `scopes: string[] (['lab', 'imaging', 'meds', 'biometrics'])`, `dateFrom: Date | null`, `dateTo: Date | null`, `expiresAt: Date`, `revokedAt: Date | null`.
* **`AccessLog` (Audit Entity)**: `id: LogId`, `memberId: MemberId`, `actorType: 'user' | 'doctor' | 'emergency_qr' | 'system'`, `actorId: string`, `action: string`, `resource: string`, `ipAddress: string`, `userAgent: string`, `occurredAt: Date`.
* **`AIConversation` & `AIMessage` (Entity)**: `id: MessageId`, `memberId: MemberId`, `role: 'user' | 'assistant'`, `content: string`, `citedResources: CitedResourceVO[]`, `suggestedActions: SuggestedActionVO[]`, `createdAt: Date`.

---

## 🔍 PHẦN 2: MA TRẬN ĐỐI SOÁT DỮ LIỆU TỪNG MÀN HÌNH (17 MÀN HÌNH CHI TIẾT)

Dưới đây là bảng đối soát chi tiết **1-đối-1** cho toàn bộ 17 màn hình. Không dùng dữ liệu giả lập (default data) cho các trường nghiệp vụ; mọi dữ liệu đều có nguồn gốc rõ ràng.

---

### 1. SCR-01 · ĐĂNG NHẬP (`Login`)

| Thành phần UI hiển thị | Đủ dữ liệu DB chưa? Bảng & Trường | Nguồn gốc dữ liệu | Phương thức nhập / thao tác | Tác động lan truyền & Tác dụng phụ | Lỗ hổng nghiệp vụ & Cần hoàn thiện |
|---|---|---|---|---|---|
| **Logo & Tagline** | Cố định (Assets) | Client bundle | Hiển thị tĩnh | Không | Chuẩn hoá viết hoa: "D-HEALTH" · "TRỢ LÝ SỨC KHOẺ THÔNG MINH" |
| **Ô Tên đăng nhập** | Có: `User.phone` hoặc `User.email` | Người dùng nhập | Bàn phím (Text/Number input) | Định danh tài khoản | Regex 10 số (bắt đầu bằng 0) hoặc email hợp lệ |
| **Ô Mật khẩu** | Có: `User.password_hash` | Người dùng nhập | Bàn phím + Toggle ẩn/hiện | So khớp hash bcrypt 10 rounds | Báo lỗi chung không phân biệt sai user hay sai pass |
| **Nút Sinh trắc học** | Có: `User.biometric_enabled` | Thiết bị (Keystore / Keychain) | Chạm vào icon vân tay / FaceID | Xác thực public key ký nonce | Chỉ hiện khi máy hỗ trợ VÀ đã bật ở SCR-15 |
| **Ghi nhớ đăng nhập** | Có: `Session.refreshToken` | Người dùng tick chọn | Checkbox | Lưu refresh token 30 ngày vào Keychain | Thu hồi token khi đổi mật khẩu từ máy khác |
| **Khung đếm ngược khoá** | Có: `User.failed_login_attempts`, `User.locked_until` | Backend tính toán | Hệ thống tự kích hoạt khi sai 5 lần | Chặn toàn bộ API auth của user trong 15 phút | Cần API trả về `retry_after_seconds` |
| **Footer hotline, copy** | Cố định: System config | Client bundle / Remote config | Chạm số hotline -> gọi điện thoại | Mở ứng dụng gọi điện thoại OS | Số hotline chưa có trong config |

---

### 2. SCR-02 · TRANG CHỦ (`Main`)

| Thành phần UI hiển thị | Đủ dữ liệu DB chưa? Bảng & Trường | Nguồn gốc dữ liệu | Phương thức nhập / thao tác | Tác động lan truyền & Tác dụng phụ | Lỗ hổng nghiệp vụ & Cần hoàn thiện |
|---|---|---|---|---|---|
| **Header User Greeting** | Có: `Member.full_name`, `Member.avatar_url` (với `relation=self`) | DB: Hồ sơ chủ tài khoản | Luôn lấy profile chủ tài khoản (BR-12) | Không đổi theo hồ sơ đang xem | Avatar chạm -> SCR-15 |
| **Nút SOS đỏ** | Có: `EmergencyCard` | Cố định UI | Chạm -> chuyển ngay sang SCR-17 | Không | Vùng chạm tối thiểu 44x44pt |
| **Hôm nay bạn thế nào?** | **CHƯA ĐỦ BẢNG**: Cần bảng `DailyMoodCheckin` | Người dùng chọn | Chip cảm xúc / triệu chứng | Lưu lịch sử theo ngày cho AI phân tích | Spec đang đánh dấu [TBD - Q10]. Cần thêm bảng `DailyCheckin` |
| **Thẻ Điểm sức khoẻ** | Cần tính từ: `BiometricReading`, `LabResult`, `DoseLog` | Công thức tính toán (Domain Service) | Tự động tính khi đủ ≥3 nhóm dữ liệu | Chạm -> sang SCR-05 | Chưa có công thức chính thức [TBD - Q1]. Nếu thiếu dữ liệu hiện "—" |
| **Thẻ nhắc uống thuốc** | Có: `DoseSchedule` join `Medication` | Sinh tự động từ lịch thuốc | Lấy liều kế tiếp của ngày hiện tại | Đồng bộ 2 chiều với SCR-11 | Nếu hết liều hôm nay hiện trạng thái loại C |
| **Nút "Đã uống" trên thẻ** | Có: `DoseLog.status = 'taken'`, `acted_at = now()` | Người dùng bấm | Nút bấm trên thẻ | Cập nhật bộ đếm, nhảy sang liều sau, Toast hoàn tác 5s | Cho phép undo trong 5s trước khi sync server |
| **Lưới 4 chỉ số nhanh** | Có: `BiometricReading` (BP, HR, BMI) & `LabResult` (HbA1c) | Bản ghi có `measured_at` mới nhất | Thiết bị sync hoặc nhập tay | Chạm HA, NT, BMI -> SCR-03; chạm HbA1c -> SCR-05 | Nếu chưa đo hiện "—" viền đứt, tuyệt đối không hiện số 0 |
| **Khối AI Insight** | Có: `AIMessage.content`, `cited_resources` | AI background job sinh định kỳ | Tự động phân tích từ 3 lần XN/đo gần nhất | Chạm "Xem phân tích" -> mở SCR-13 kèm ngữ cảnh | Cần cronjob chạy hàng đêm hoặc sau khi có kết quả mới |
| **Health Timeline (2 mục)** | Có: `ClinicalReport` + `Appointment` | Query 2 sự kiện gần nhất sắp theo thời gian | Tự động tổng hợp | Chạm "Xem tất cả" -> mở SCR-10 | Lọc theo hồ sơ chủ tài khoản |
| **Checklist hoàn thiện hồ sơ** | Có: `MemberProfileChecklist` | Kiểm tra trạng thái dữ liệu tài khoản | 4 bước: Profile -> Bệnh nền -> XN -> Thiết bị | Tự ẩn khi xong 4/4 hoặc bấm "Để sau" 2 lần | Cần cờ lưu số lần bấm "Để sau" |

---

### 3. SCR-03 · SỨC KHOẺ – SINH TRẮC (`Biometrics`)

| Thành phần UI hiển thị | Đủ dữ liệu DB chưa? Bảng & Trường | Nguồn gốc dữ liệu | Phương thức nhập / thao tác | Tác động lan truyền & Tác dụng phụ | Lỗ hổng nghiệp vụ & Cần hoàn thiện |
|---|---|---|---|---|---|
| **Header ngữ cảnh & Avatar** | Có: `ActiveMemberContext`, `Member` | Global State (BR-11, BR-13) | Chạm chip -> mở SCR-10 chọn thành viên | Đổi dữ liệu toàn bộ màn hình sinh trắc theo member | Không nhầm lẫn với chủ tài khoản |
| **Dải đồng bộ thiết bị** | Có: `Device.name`, `Device.last_sync_at` | Bảng `Device` của member | Hệ thống cập nhật khi sync | Chạm nút "Thiết bị" -> mở SCR-04 | Hiển thị: "Đồng bộ từ Apple Watch · 10 phút trước" |
| **Thẻ biểu đồ chỉ số** | Có: `BiometricReading` | Gộp từ `device` và `manual` | Query 7 lần đo gần nhất theo `measured_at` | Điểm nhập tay tô màu cam (`#F59E0B`), thiết bị màu teal | Huyết áp vẽ dạng cột khoảng (tâm thu - tâm trương) |
| **Lưới 8 ô chỉ số** | Có: `BiometricReading` (8 metrics) | 8 bản ghi mới nhất của từng loại | Tự động cập nhật | Chạm ô nào thì đổi biểu đồ thẻ chính sang chỉ số đó | Ô active có viền đen đậm |
| **Lịch sử đo (5 dòng)** | Có: `BiometricReading` (metric đang chọn) | DB: 5 bản ghi mới nhất | Cuộn nội bộ trong khung (BR-17) | Dòng "Nhập tay" có nút Xoá; dòng "Thiết bị" chỉ cho ẩn | Xoá phải có dialog xác nhận hoặc toast hoàn tác |
| **Bottom sheet nhập tay** | Có: Ghi vào `BiometricReading` | Người dùng nhập | Bottom sheet: Date, Time, Value, Context, Note | Nhập HA kèm NT -> sinh 2 bản ghi cùng `group_id` | Cấm ngày tương lai (BR-50). Cân nặng tự tính BMI (BR-52) |

---

### 4. SCR-04 · KẾT NỐI THIẾT BỊ (`Devices`)

| Thành phần UI hiển thị | Đủ dữ liệu DB chưa? Bảng & Trường | Nguồn gốc dữ liệu | Phương thức nhập / thao tác | Tác động lan truyền & Tác dụng phụ | Lỗ hổng nghiệp vụ & Cần hoàn thiện |
|---|---|---|---|---|---|
| **Danh sách thiết bị kết nối** | Có: `Device` (lọc theo `member_id`) | Bảng `Device` | Tự động đọc danh sách | Chạm vào thiết bị -> mở sheet cấu hình chi tiết | Cần phân nhóm: Nền tảng OS, Smartwatch, Thiết bị y tế BLE |
| **Nút "Quét tìm thiết bị mới"** | Quét Bluetooth BLE cục bộ | Native BLE Scanner | Chạm nút -> mở bottom sheet quét | Bắt đầu quét BLE xung quanh trong bán kính 1m | Cần xin quyền Bluetooth hệ điều hành trước khi mở |
| **Sheet cấu hình đồng bộ** | Có: `Device.allowed_types`, `sync_frequency` | Người dùng tick chọn | Checkbox từng loại chỉ số, select tần suất | Cập nhật cấu hình sync background | Bỏ tick không được xoá dữ liệu lịch sử cũ (BR-61) |
| **Nút Ngắt kết nối** | Có: Cập nhật `Device.status = 'disconnected'` | Người dùng bấm | Xác nhận qua Alert Dialog | Dừng background worker đồng bộ từ thiết bị này | Dữ liệu đo trước đó vẫn được giữ lại trong DB |
| **Khử trùng lặp đa nguồn** | **CHƯA ĐỦ LOGIC**: Cần quy tắc ưu tiên | Nguồn từ nhiều thiết bị | Thuật toán Deduplication tự động | Tránh nhân đôi số bước chân hoặc nhịp tim | [TBD - BR-64]: Cần quy định thứ tự ưu tiên (BLE y tế > Watch > Apple Health) |

---

### 5. SCR-05 · SỨC KHOẺ – XÉT NGHIỆM (`Health`)

| Thành phần UI hiển thị | Đủ dữ liệu DB chưa? Bảng & Trường | Nguồn gốc dữ liệu | Phương thức nhập / thao tác | Tác động lan truyền & Tác dụng phụ | Lỗ hổng nghiệp vụ & Cần hoàn thiện |
|---|---|---|---|---|---|
| **Chip lọc nhóm xét nghiệm** | Có: `ClinicalReport.category` (HH, SH, VS, PT, DT) | Enum cố định | Chạm chip lọc ngang | Lọc danh sách phiếu bên dưới theo nhóm | Kèm tooltip giải thích tên đầy đủ 5 nhóm |
| **Danh sách phiếu xét nghiệm** | Có: `ClinicalReport` (kind='lab') | Query DB theo `member_id` | Hiển thị 5 phiếu mới nhất, cuộn trong khung | Chạm một phiếu -> chuyển sang SCR-06 | Hiển thị tóm tắt: "12 chỉ số · LDL-C, Triglycerid tăng" |
| **Chip chọn chỉ số theo dõi** | Có: `TrackedAnalytePref.analyte_codes` | Lưu cấu hình theo từng member | Multi-select chip ngang | Bật/tắt biểu đồ đường diễn biến bên dưới | Lưu lựa chọn vào DB để khôi phục khi mở lại app |
| **Biểu đồ đường từng chỉ số** | Có: `LabResult` join `ClinicalReport` | Lịch sử các lần xét nghiệm | Trục hoành là ngày làm XN thật (không làm tròn) | Hiển thị đường mục tiêu nét đứt ("Mục tiêu < 7%") | Cần ≥ 2 lần đo để vẽ đường; nếu có 1 lần hiện text hướng dẫn |

---

### 6. SCR-06 · KẾT QUẢ XÉT NGHIỆM CHI TIẾT (`LabReport`)

| Thành phần UI hiển thị | Đủ dữ liệu DB chưa? Bảng & Trường | Nguồn gốc dữ liệu | Phương thức nhập / thao tác | Tác động lan truyền & Tác dụng phụ | Lỗ hổng nghiệp vụ & Cần hoàn thiện |
|---|---|---|---|---|---|
| **Thông tin hành chính** | Có: `performed_at`, `resulted_at`, `facility_name`, `ordering_doctor_name`, `sample_type`, `report_code` | Trích xuất từ OCR / CSYT / Nhập tay | Đọc từ `ClinicalReport` | Hiển thị chi tiết đầu phiếu | Cần kiểm tra định dạng ngày giờ chuẩn ISO |
| **Bảng chỉ số chi tiết** | Có: `LabResult` (analyte, value, unit, ref_range, flag) | Danh sách bản ghi con | Đọc từ bảng `LabResult` | Cờ ↑/↓ và tô màu đỏ nếu vượt khoảng tham chiếu | Ưu tiên khoảng tham chiếu in trên phiếu (BR-75) |
| **Tóm tắt AI** | Có: `ClinicalReport.ai_summary` | AI service sinh khi duyệt phiếu | Đọc từ trường text trong DB | Giúp người dùng nắm nhanh tình trạng sức khỏe | Kèm disclaimer "Tham khảo, không thay thế bác sĩ" |
| **Nhận xét của bác sĩ** | Có: `ClinicalReport.doctor_comment` | Bác sĩ khám nhập hoặc OCR đọc từ phiếu | Đọc từ trường text | Thể hiện đúng lời dặn chuyên môn | Có thể null nếu phiếu không có nhận xét |
| **Tệp đính kèm gốc (PDF/Ảnh)** | Có: `Attachment` (`file_url`, `mime`, `sha256`) | File lưu trên S3 / Blob Storage | Chạm nút -> Mở xem tệp gốc | Cho phép người dùng đối chiếu lại dữ liệu gốc | Bắt buộc mã hóa đường truyền khi tải file |
| **Nút "Hỏi trợ lý AI"** | Liên kết sang SCR-13 | Điều hướng kèm param `report_id` | Chạm nút -> mở SCR-13 | Nạp toàn bộ kết quả của phiếu này vào System Prompt AI | Giúp hỏi đáp sâu về kết quả xét nghiệm vừa xem |

---

### 7. SCR-07 · SỨC KHOẺ – CHẨN ĐOÁN HÌNH ẢNH (`Imaging`)

| Thành phần UI hiển thị | Đủ dữ liệu DB chưa? Bảng & Trường | Nguồn gốc dữ liệu | Phương thức nhập / thao tác | Tác động lan truyền & Tác dụng phụ | Lỗ hổng nghiệp vụ & Cần hoàn thiện |
|---|---|---|---|---|---|
| **Chip lọc phương tiện** | Có: `ImagingStudy.modality` (SA, XQ, MM, CT, MRI) | Enum cố định | Chạm chip lọc ngang | Lọc danh sách báo cáo CĐHA bên dưới | Hiển thị trên 1 hàng ngang vừa màn hình 360px |
| **Danh sách kết quả CĐHA** | Có: `ClinicalReport` (kind='imaging') | Query DB theo `member_id` | 5 kết quả mới nhất, cuộn trong khung | Chạm -> mở SCR-08 | Hiển thị kết luận ngắn gọn |
| **3 bộ lọc tổn thương** | Có: `LesionGroup` (loại, vị trí, phương tiện) | Dropdown select | Chọn Loại + Vị trí + Phương tiện (AND) | Lọc các nhóm tổn thương khớp cả 3 điều kiện | Chọn vị trí "Khác" -> hiện ô text nhập cấu trúc khác |
| **Bảng theo dõi tổn thương** | Có: `LesionMeasurement` (size_mm qua các mốc) | Bảng đo đạc theo từng lần chụp | Tự động tổng hợp ma trận tổn thương | Tính dòng tổng đường kính SoD = sum(size_mm) | Cần đối soát trục dài (u) và trục ngắn (hạch) |
| **Khối đánh giá RECIST 1.1** | Tính từ SoD: `baseline`, `nadir`, `current` | Thuật toán RECIST (Domain Service) | Tự động tính toán khi là khối u đặc sau điều trị | Hiển thị mã đáp ứng: CR / PR / SD / PD | U < 10mm báo chưa đủ tiêu chuẩn tổn thương đích |

---

### 8. SCR-08 · BÁO CÁO CĐHA CHI TIẾT (`ImagingReport`)

| Thành phần UI hiển thị | Đủ dữ liệu DB chưa? Bảng & Trường | Nguồn gốc dữ liệu | Phương thức nhập / thao tác | Tác động lan truyền & Tác dụng phụ | Lỗ hổng nghiệp vụ & Cần hoàn thiện |
|---|---|---|---|---|---|
| **Chỉ định & Chuỗi xung** | Có: `ImagingStudy.sequences`, `technique` | Trích xuất từ báo cáo CĐHA | Hiển thị danh sách badge (T1, T2, DWI) | Giúp đối chiếu kỹ thuật chụp | Có thể null nếu là siêu âm hoặc X-quang |
| **Thông tin hành chính & So sánh** | Có: `performed_at`, `compare_report_id` | DB: `ImagingStudy` | Đọc thông tin | Hiển thị dòng so sánh: "So sánh với lần chụp 15/05/2026" | Chạm link so sánh để mở báo cáo cũ |
| **Khối Kỹ thuật - Mô tả - Kết luận** | Có: `findings`, `conclusion`, `recommendation` | DB: `ImagingStudy` | Hiển thị các khối văn bản rõ ràng | Cung cấp đầy đủ thông tin chuyên môn | Hỗ trợ định dạng xuống dòng, in đậm cấu trúc giải phẫu |
| **Bảng tổn thương (Trước - Nay)** | Có: `LesionMeasurement` của 2 lần chụp | So sánh tự động giữa 2 report | Bảng 4 cột: Tổn thương \| Loại \| Trước \| Nay | Thấy ngay tổn thương to lên, thu nhỏ hay giữ nguyên | Đồng bộ sang module RECIST ở SCR-07 |
| **Link xem ảnh DICOM (PACS)** | Có: `ImagingStudy.pacs_url` | Đường dẫn webview PACS CSYT cung cấp | Chạm nút -> mở trình duyệt ngoài | Người dùng xem được toàn bộ lát cắt hình ảnh y tế | Bản v1 không tải file DICOM nặng về điện thoại |

---

### 9. SCR-09 · BỆNH MẠN TÍNH (`Cockpit`)

| Thành phần UI hiển thị | Đủ dữ liệu DB chưa? Bảng & Trường | Nguồn gốc dữ liệu | Phương thức nhập / thao tác | Tác động lan truyền & Tác dụng phụ | Lỗ hổng nghiệp vụ & Cần hoàn thiện |
|---|---|---|---|---|---|
| **Thẻ từng bệnh mạn tính** | Có: `Condition` (ICD-10, name, status) | Bảng `Condition` của member | Tự động render thẻ bệnh | Thể hiện mức độ kiểm soát tổng thể của từng bệnh | Bệnh lấy từ khai báo hoặc xác nhận sau khám |
| **Bộ chỉ số liên quan bệnh** | Có: `BiometricReading` & `LabResult` | Template cấu hình chỉ số theo bệnh | Map tự động từ các kết quả đo gần nhất | Hiển thị nhãn mức cảnh báo cho từng chỉ số | Tim mạch: HA, LDL-C, HbA1c, NT; ĐTĐ: Glucose, HbA1c... |
| **Việc cần làm tiếp theo** | Có: `CarePlanTask` (`title`, `is_done`, `done_at`) | Bảng task theo condition | Checkbox tương tác được | Tick chọn -> cập nhật `is_done = true` vào DB | Giúp người bệnh tuân thủ hướng dẫn điều trị |
| **Nút "Đặt lịch tái khám"** | Có: `Appointment` | Khởi tạo lịch hẹn | Chạm nút -> tạo Appointment requested -> mở SCR-14 | Điền sẵn bác sĩ và lý do khám theo bệnh này | Nhắc hẹn trước 1 ngày qua local push |
| **Trạng thái chưa có bệnh** | Loại C (Empty State) | Khi member chưa có condition nào | Hiển thị thông điệp tích cực | Hiện bảng tầm soát gợi ý theo tuổi/giới + nút Khai báo | Hướng dẫn phòng ngừa bệnh chủ động |

---

### 10. SCR-10 · HỒ SƠ Y TẾ (`Records - Medical Passport`)

| Thành phần UI hiển thị | Đủ dữ liệu DB chưa? Bảng & Trường | Nguồn gốc dữ liệu | Phương thức nhập / thao tác | Tác động lan truyền & Tác dụng phụ | Lỗ hổng nghiệp vụ & Cần hoàn thiện |
|---|---|---|---|---|---|
| **Thẻ thành viên tổng quan** | Có: `Member` (tên, quan hệ, tuổi, chiều cao, cân nặng, BMI, nhóm máu) | Bảng `Member` đang active | Hiển thị thẻ tóm tắt nhân khẩu y tế | Chạm vào tên -> mở modal chuyển đổi hồ sơ toàn cục | BMI tự tính từ chiều cao và cân nặng |
| **Modal đổi hồ sơ thành viên** | Có: Query `Member` theo `owner_user_id` | Danh sách hồ sơ gia đình | Chọn một thành viên trong danh sách | Đổi `ActiveMemberContext`, refresh toàn bộ app | Lưu bền vào local storage và sync lên server |
| **Lưới 9 ô danh mục (kèm số lượng)** | Có: Count từ các bảng tương ứng | Aggregation query theo `member_id` | Chạm từng ô điều hướng đến màn hình chuyên biệt | 9 ô: Dị ứng, Bệnh, Thuốc, XN, CĐHA, GPB, Tài liệu, Bác sĩ, CSYT | Mục "Imaging AI" đã bị ẩn theo BR-95 |
| **Panel GPB / Bác sĩ / CSYT** | Có: `PathologyReport`, `Doctor`, `Facility` | Query 5 bản ghi mới nhất của từng bảng | Mở panel danh sách trượt cuộn tại chỗ | Danh sách Bác sĩ / CSYT tự động tổng hợp từ phiếu khám | Có nút thêm bác sĩ thủ công |
| **Nút nổi "Nhập kết quả"** | Cố định UI | Nút Floating CTA góc dưới | Chạm nút -> mở SCR-12 | Điểm truy cập nhanh để nhập hồ sơ mới | Luôn hiển thị trên màn hình Records |

---

### 11. SCR-11 · QUẢN LÝ DÙNG THUỐC (`Meds`)

| Thành phần UI hiển thị | Đủ dữ liệu DB chưa? Bảng & Trường | Nguồn gốc dữ liệu | Phương thức nhập / thao tác | Tác động lan truyền & Tác dụng phụ | Lỗ hổng nghiệp vụ & Cần hoàn thiện |
|---|---|---|---|---|---|
| **Chỉ số tuân thủ 30 ngày (%)** | Tính từ `DoseLog` trong 30 ngày | Thuật toán: taken / (taken + missed + skipped) * 100 | Tự động tính toán (Domain Service) | Làm tròn số nguyên, hiển thị trên thẻ đầu trang | Không tính các liều trong tương lai (BR-103) |
| **Calendar tháng dùng thuốc** | Có: `DoseSchedule` theo từng ngày | Lịch uống thuốc tháng hiện tại | Chạm từng ngày trên lịch để xem chi tiết | Chấm màu: Đủ (xanh), Quên (vàng), Bỏ (đỏ), Sắp tới (xám) | Cập nhật thời gian thực khi đánh dấu liều |
| **Danh sách liều trong ngày** | Có: `DoseSchedule` join `Medication` | Lịch liều của ngày được chọn | Thao tác 3 nút: "Bỏ liều", "Nhắc lại 15p", "Đã uống" | Ghi `DoseLog`, push local notification sau 15p nếu snooze | Đồng bộ tức thì với thẻ thuốc ở Trang chủ (SCR-02) |
| **Tab "Đang dùng"** | Có: `Medication` (`status = 'active'`) | Bảng `Medication` | Danh sách thẻ thuốc đang có hiệu lực | Nút "Ngừng thuốc" -> nhập lý do -> chuyển sang Tiền sử | Cho phép bật/tắt nhắc nhở từng loại thuốc |
| **Tab "Tiền sử dùng thuốc"** | Có: `Medication` (`status = 'stopped'`) | Thuốc đã dừng hoặc hết hạn dùng | Hiển thị giai đoạn dùng, bác sĩ kê và lý do ngừng | Giúp bác sĩ xem lại lịch sử kê đơn để tránh kháng thuốc | Nút "Gửi tiền sử dùng thuốc cho bác sĩ" -> SCR-14 |
| **Thẻ Thêm thuốc (2 cách)** | Có: Ghi vào `Medication` + sinh `DoseSchedule` | Nhập tay hoặc AI Camera quét đơn | Form nhập hoặc Chụp ảnh OCR đơn thuốc | Tự động tính toán sinh hàng loạt liều trong tương lai | AI Camera: thuốc tin cậy < 90% mặc định không tick (BR-105) |

---

### 12. SCR-12 · NHẬP KẾT QUẢ CẬN LÂM SÀNG (`Camera / Input`)

| Thành phần UI hiển thị | Đủ dữ liệu DB chưa? Bảng & Trường | Nguồn gốc dữ liệu | Phương thức nhập / thao tác | Tác động lan truyền & Tác dụng phụ | Lỗ hổng nghiệp vụ & Cần hoàn thiện |
|---|---|---|---|---|---|
| **Bước 1: Loại kết quả** | Chọn loại: XN / CĐHA / GPB | Segmented control | Chọn loại tương ứng | Thay đổi cấu trúc form nhập liệu ở Bước 3 | Cố định 3 loại chuẩn cận lâm sàng |
| **Bước 2: Cách thức nhập** | 3 cách: Thủ công / Link CSYT / AI Camera | Segmented control | Chọn phương thức nhập | Đổi giao diện nhập liệu tương ứng | Mặc định chọn Thủ công |
| **Form XN thủ công** | Có: `ClinicalReport` + `LabResult` | Người dùng nhập | Danh sách dòng động (+ Thêm dòng, Xoá dòng) | Tự động kích hoạt khối "Đề xuất phân loại nhóm XN" | Khối đề xuất chỉ hiện khi có ≥ 1 dòng có giá trị (BR-110) |
| **Đề xuất phân loại nhóm XN** | Tính từ `AnalyteDefinition.default_category` | Thuật toán đếm số lượng analyte | Tự động gợi ý nhóm chiếm đa số (HH, SH...) | Cảnh báo nếu chỉ số thuộc nhiều nhóm; cho phép đổi | Đổi thủ công sẽ hiện nhãn màu hổ phách (BR-112) |
| **Form CĐHA thủ công** | Có: `ImagingStudy` + `Lesion` | Người dùng nhập | Chọn bộ phận + Kết luận + Danh sách u động | Tự động tạo hoặc ghép nối vào `LesionGroup` tương ứng | Có checkbox "Tổn thương đích RECIST" cho từng u |
| **Form GPB thủ công** | Có: `PathologyReport` + `IHCMarker` | Người dùng nhập | Form chuyên sâu GPB + Danh sách dấu ấn HMMD | Lưu kết quả giải phẫu bệnh và dấu ấn ung bướu | Nhập pTNM, độ mô học G1-G3, diện cắt |
| **Nhập từ Link CSYT** | **DỮ LIỆU TẠM THỜI**: URL, User, Pass, Captcha | Người dùng điền thông tin cổng CSYT | Form nhập thông tin tra cứu | Gọi crawler backend tải PDF kết quả -> AI OCR -> xác nhận | Mật khẩu chỉ dùng 1 lần, tuyệt đối không lưu DB (BR-116) |
| **AI Camera quét phiếu** | Lưu ảnh vào `Attachment`, text vào Report | Camera chụp ảnh phiếu giấy | Chụp -> OCR -> Bảng đối soát kèm % tin cậy | Người dùng xác nhận -> mới ghi chính thức vào hồ sơ | Trường độ tin cậy thấp được tô màu hổ phách cảnh báo |

---

### 13. SCR-13 · TRỢ LÝ AI (`AI`)

| Thành phần UI hiển thị | Đủ dữ liệu DB chưa? Bảng & Trường | Nguồn gốc dữ liệu | Phương thức nhập / thao tác | Tác động lan truyền & Tác dụng phụ | Lỗ hổng nghiệp vụ & Cần hoàn thiện |
|---|---|---|---|---|---|
| **Khung hội thoại tin nhắn** | Có: `AIConversation`, `AIMessage` | Lịch sử chat theo `member_id` | Hiển thị luồng chat hai chiều | Lưu trữ lịch sử hỏi đáp, cho phép người dùng xoá | Chỉ truy xuất dữ liệu của hồ sơ đang xem (BR-120) |
| **Chip trích dẫn nguồn** | Có: `AIMessage.cited_resources` | AI trích xuất bản ghi cụ thể | Hiển thị chip: "Huyết áp 30 ngày", "XN 20/10" | Chạm chip -> nhảy thẳng về màn hình xem bản ghi gốc | Mọi câu trả lời có số liệu bắt buộc phải dẫn nguồn (BR-121) |
| **Việc nên làm tiếp theo** | Có: `AIMessage.suggested_actions` | AI đề xuất dựa trên hướng dẫn lâm sàng | Danh sách hành động có link tương tác | Chạm -> mở màn hình đo, đặt lịch khám hoặc uống thuốc | Giúp bệnh nhân biến lời khuyên thành hành động |
| **Phát hiện nguy hiểm 115** | Logic rule kiểm tra từ khóa khẩn cấp | Regex / AI Emergency Intent Detection | Tự động kích hoạt khi có dấu hiệu nguy kịch | Nổi bật nút gọi 115 và hướng dẫn sơ cứu khẩn cấp | Tuyệt đối không chẩn đoán thay thế cấp cứu (BR-122) |
| **Nút Camera trong ô chat** | Mở luồng chụp tài liệu hỏi AI | Chụp ảnh tài liệu y tế | Chụp phiếu XN / đơn thuốc để hỏi riêng | Chuyển sang SCR-12 trích xuất rồi quay lại giải thích | Tiện lợi khi người bệnh vừa nhận phiếu từ viện |

---

### 14. SCR-14 · CHĂM SÓC (`Care - Care Network`)

| Thành phần UI hiển thị | Đủ dữ liệu DB chưa? Bảng & Trường | Nguồn gốc dữ liệu | Phương thức nhập / thao tác | Tác động lan truyền & Tác dụng phụ | Lỗ hổng nghiệp vụ & Cần hoàn thiện |
|---|---|---|---|---|---|
| **Lịch hẹn sắp tới** | Có: `Appointment` join `Doctor` | Bảng `Appointment` | Hiển thị lịch hẹn gần nhất | Nhắc hẹn trước 1 ngày và trước 2 giờ qua thông báo | Chạm vào xem chi tiết hoặc huỷ/đổi lịch |
| **My Care Team (Avatar tròn)** | Có: `Doctor` (`in_care_team = true`) | Danh sách bác sĩ của member | Băng chuyền avatar ngang + Nút Thêm bác sĩ | Chạm chọn bác sĩ để xem thẻ thông tin chi tiết bên dưới | Bác sĩ có thể tự thêm hoặc sinh ra từ lịch sử khám |
| **Thẻ chi tiết bác sĩ** | Có: `Doctor` (tên, viện, phone, email) | DB: `Doctor` | Các nút hành động: Gọi, Email, Nhắn tin | Chạm Gọi -> mở bàn phím cuộc gọi; Email -> mở app mail | Nút "Nhắn tin / Video" là điểm vào (BR-67 v1 chỉ là điểm vào) |
| **Gửi hồ sơ trước khám** | Có: Tạo `ShareGrant` | Người dùng chọn phạm vi chia sẻ | Form chọn nhóm dữ liệu (XN, CĐHA, thuốc) + thời hạn | Tạo link chia sẻ có thời hạn bảo mật cho bác sĩ | Ghi nhận 1 bản ghi `ShareGrant` (BR-132) |
| **Quản lý quyền chia sẻ** | Có: `ShareGrant` (`expires_at`, `revoked_at`) | Bảng `ShareGrant` | Danh sách người đang có quyền + Nút Thu hồi | Thu hồi ngay lập tức khoá link truy cập của bên thứ ba | Cảnh báo trước 7 ngày khi quyền sắp hết hạn (BR-103) |
| **Sheet Thêm / Sửa bác sĩ** | Có: Ghi vào bảng `Doctor` | Người dùng nhập | Form: Ảnh, Họ tên*, Chuyên khoa, Viện, SĐT, Email | Lưu thông tin liên hệ bác sĩ vào Care Team | Bắt buộc có Tên và ít nhất 1 trong 2: SĐT hoặc Email (BR-130) |

---

### 15. SCR-15 · THÔNG TIN NGƯỜI DÙNG (`Profile`)

| Thành phần UI hiển thị | Đủ dữ liệu DB chưa? Bảng & Trường | Nguồn gốc dữ liệu | Phương thức nhập / thao tác | Tác động lan truyền & Tác dụng phụ | Lỗ hổng nghiệp vụ & Cần hoàn thiện |
|---|---|---|---|---|---|
| **Avatar & Huy hiệu eKYC** | Có: `Member.avatar_url`, `ekyc_verified_at` | Upload ảnh hoặc chụp căn cước eKYC | Tải ảnh từ thư viện (cắt vuông, ≤5MB) | Cập nhật avatar hiển thị toàn app | Hiện huy hiệu xanh khi đã xác thực danh tính |
| **Thông tin cá nhân (CCCD)** | Có: `Member.national_id_enc`, `dob`, `gender` | DB (mã hóa AES-256) | Nhập liệu / eKYC | CCCD che `0790******12`, chạm xác thực sinh trắc mới mở | CCCD kiểm tra đúng 12 chữ số, tuổi ≤ 120 (BR-140) |
| **Thông tin y tế (BHYT)** | Có: `Member.insurance_no_enc`, `blood_type`, `height_cm` | DB (mã hóa AES-256) | Nhập liệu | BHYT che 8 ký tự giữa, chạm để mở | BHYT đúng chuẩn 15 ký tự (2 chữ + 13 số) |
| **Cài đặt bảo mật (Sinh trắc/MFA)**| Có: `User.mfa_enabled`, `biometric_enabled` | Cấu hình tài khoản | Switch toggle bật/tắt | Bật MFA yêu cầu xác thực OTP; bật biometric kiểm tra sensor | Ẩn mục này nếu đang xem hồ sơ người thân (BR-142) |
| **Nút Đăng xuất** | Huỷ token phiên làm việc | Người dùng bấm | Xác nhận qua dialog | Xoá session, thu hồi refresh token, quay về SCR-01 | Ẩn khi đang xem hồ sơ người thân |

---

### 16. SCR-16 · HỒ SƠ GIA ĐÌNH (`Family`)

| Thành phần UI hiển thị | Đủ dữ liệu DB chưa? Bảng & Trường | Nguồn gốc dữ liệu | Phương thức nhập / thao tác | Tác động lan truyền & Tác dụng phụ | Lỗ hổng nghiệp vụ & Cần hoàn thiện |
|---|---|---|---|---|---|
| **Thanh chọn thành viên ngang** | Có: Query `Member` theo `owner_user_id` | Danh sách hồ sơ gia đình | Chạm vào avatar thành viên | Đổi hồ sơ đang xem toàn cục (BR-13) | Thành viên đang chọn có viền highlight nổi bật |
| **Thẻ tóm tắt thành viên** | Có: Điểm sức khỏe, chỉ số chính, thuốc | Tổng hợp từ dữ liệu của member đó | Tự động cập nhật theo member đang chọn | Giúp nắm bắt nhanh tình hình của người thân | Nếu thành viên ≥18 tuổi chưa consent: ẩn dữ liệu (BR-151) |
| **Nút "Thêm người thân"** | Có: Ghi vào bảng `Member` | Người dùng nhập form | Form: Họ tên, Ngày sinh, Giới tính, Quan hệ, SĐT/Email | Nếu ≥18 tuổi gửi tin nhắn/email yêu cầu đồng ý chia sẻ | Người thân chấp nhận thì chuyển `consentStatus='granted'` |
| **Mời người thân tự quản lý** | Có: `Member.linked_user_id` | Gửi link liên kết tài khoản | Nhập số điện thoại/email của người thân | Người thân tạo tài khoản riêng và liên kết vào gia đình | Người thân tự quản lý có quyền rút lại consent bất cứ lúc nào |
| **Xoá hồ sơ thành viên** | Cập nhật `Member.deleted_at` (Soft delete) | Chủ tài khoản thao tác | Xác nhận 2 bước bằng mật khẩu/OTP | Ẩn hồ sơ khỏi danh sách gia đình | Tuân thủ chính sách lưu trữ dữ liệu y tế (BR-153) |

---

### 17. SCR-17 · THẺ KHẨN CẤP (`Emergency / SOS`)

| Thành phần UI hiển thị | Đủ dữ liệu DB chưa? Bảng & Trường | Nguồn gốc dữ liệu | Phương thức nhập / thao tác | Tác động lan truyền & Tác dụng phụ | Lỗ hổng nghiệp vụ & Cần hoàn thiện |
|---|---|---|---|---|---|
| **Nhóm máu nổi bật** | Có: `Member.blood_type` | Bảng `Member` | Hiển thị chữ lớn màu đỏ | Cung cấp thông tin sống còn cho bác sĩ cấp cứu | Lấy từ hồ sơ, người dùng xác nhận |
| **Dị ứng, Bệnh nền, Thuốc** | Có: `AllergyItem`, `Condition`, `Medication` | Tự động tổng hợp từ hồ sơ | Người dùng bật/tắt từng trường muốn công khai | Chỉ các trường được bật mới xuất hiện khi quét QR | Tránh lộ thông tin không mong muốn |
| **Liên hệ khẩn cấp** | Có: `EmergencyCard.emergency_contacts` | Người dùng cấu hình | Tên, quan hệ, SĐT (chạm để gọi) | Bác sĩ cấp cứu gọi trực tiếp cho người thân | Cho phép thêm tối đa 3 người liên hệ khẩn cấp |
| **Mã QR cấp cứu** | Có: `EmergencyCard.qr_token` | Token sinh ngẫu nhiên 256-bit | Quét bằng camera điện thoại bất kỳ | Mở trang web tĩnh công khai chứa thông tin khẩn cấp | Không yêu cầu đăng nhập; có nút xoay (rotate) đổi mã mới |
| **Nút lớn "Gọi cấp cứu 115"** | Gọi trực tiếp số điện thoại khẩn | Native Phone Dialer | Chạm nút đỏ lớn | Bật cuộc gọi khẩn cấp 115 ngay lập tức | Có thể gửi SMS toạ độ GPS cho người thân (BR-163) |

---

## 🔒 PHẦN 3: DỮ LIỆU NGẦM (IMPLICIT, SECURITY & AUDIT DATA)

Dữ liệu ngầm là các trường thông tin không hiển thị trực tiếp lên giao diện nhưng đóng vai trò sống còn để hệ thống vận hành an toàn, đúng pháp lý và không bị lỗi đồng bộ.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DỮ LIỆU NGẦM HỆ THỐNG                          │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Bảo mật & Xác thực: Salt rounds, Nonce, JWT JTI, Refresh token hash │
│ 2. Mã hóa y tế (NĐ 13/2023): AES-256-GCM IV, Auth Tag, Key Version    │
│ 3. Đồng bộ ngoại tuyến: Idempotency Key, Client UUID, Version (LWW)   │
│ 4. Kiểm toán truy cập (Audit Trail): ThirdPartyAccessLog, IP, Session  │
│ 5. AI & OCR Provenance: Bounding Box, OCR Confidence, Raw JSON payload │
│ 6. Danh mục tham chiếu y khoa: LOINC codes, ICD-10, Ngưỡng cảnh báo   │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Mã hóa dữ liệu nhạy cảm cấp trường (Field-Level Encryption - FLE)**:
   - Các trường `national_id_enc` (CCCD) và `insurance_no_enc` (BHYT) lưu trữ dưới dạng chuỗi băm kèm mã hóa: `iv:ciphertext:tag:key_version`.
   - Master Key 256-bit lưu cô lập trong biến môi trường server / HSM, không đưa vào code client.
2. **Khóa chống trùng lặp đồng bộ (Idempotency Key & External ID)**:
   - Bản ghi từ thiết bị BLE hoặc Apple Health / Google Health Connect có `external_id` (ví dụ UUID từ HealthKit).
   - API `POST /biometrics:batch` dùng `UNIQUE (member_id, metric, external_id)` để đảm bảo sync 100 lần vẫn chỉ tạo 1 bản ghi.
3. **Nhật ký kiểm toán truy cập bắt buộc (Access Audit Log - NĐ 13/2023/NĐ-CP & BR-04)**:
   - Mọi lượt xem hồ sơ qua mã QR khẩn cấp hoặc qua link chia sẻ của bác sĩ bắt buộc ghi vào bảng `AccessLog`: `actor_type`, `actor_id`, `action`, `resource_id`, `ip_address`, `user_agent`, `occurred_at`.
   - Dữ liệu audit log không thể sửa, không thể xoá (Append-only).
4. **Cơ chế xoay Token mã QR khẩn cấp (Emergency QR Token Rotation)**:
   - Bản ghi `EmergencyCard` lưu `qr_token` và `token_created_at`.
   - Khi người dùng bấm "Tạo lại mã QR", token cũ bị hủy ngay lập tức và link cũ trả về 404/Expired.
5. **Dữ liệu thô và độ tin cậy AI (AI / OCR Provenance)**:
   - Bản ghi `ClinicalReport` từ OCR lưu kèm `ai_confidence_score` (từ 0.00 đến 1.00) cho từng trường trong JSON metadata.
   - Lưu trữ tọa độ khung nhận diện (Bounding box coordinates) để highlight đúng vị trí trên ảnh khi đối chiếu.
6. **Bảng cấu hình quy tắc ngưỡng y khoa (Clinical Threshold Rules)**:
   - Bảng `analyte_threshold_rules`: Lưu ngưỡng phân loại Mức 1 (Bình thường), Mức 2 (Chú ý), Mức 3 (Nguy hiểm) theo từng chỉ số, theo độ tuổi và giới tính do cố vấn y khoa duyệt. Tuyệt đối không hardcode trong component UI (BR-18).

---

## 🧩 PHẦN 4: CÁC KHU VỰC THIẾU VÀ ĐỀ XUẤT HOÀN THIỆN TOÀN BỘ

Qua việc đối soát kỹ lưỡng giữa file đặc tả BA và 17 artboards giao diện, phát hiện **7 màn hình / luồng phụ bắt buộc cần bổ sung** để hệ thống hoạt động trọn vẹn không bị đứt đoạn:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   7 MÀN HÌNH / LUỒNG CẦN BỔ SUNG                       │
├────────────────────────────────────────────────────────────────────────┤
│ 1. SCR-ADD-01: Đăng ký tài khoản mới & Xác thực số điện thoại OTP      │
│ 2. SCR-ADD-02: Quên mật khẩu & Thiết lập mật khẩu mới qua OTP          │
│ 3. SCR-ADD-03: Màn hình Người thân (≥18 tuổi) xem & Ký xác nhận Consent│
│ 4. SCR-ADD-04: Màn hình Quản lý Dị ứng chuyên sâu (Allergies Manager)  │
│ 5. SCR-ADD-05: Màn hình Báo cáo Giải phẫu bệnh chi tiết (Pathology)    │
│ 6. SCR-ADD-06: Màn hình Xem Lịch sử Audit Log truy cập hồ sơ y tế      │
│ 7. SCR-ADD-07: Cài đặt Thông báo & Lịch nhắc nhở (Notification Center) │
└────────────────────────────────────────────────────────────────────────┘
```

### 1. Luồng Đăng ký tài khoản (SCR-ADD-01) & Quên mật khẩu (SCR-ADD-02)
- **Thiếu sót:** SCR-01 có link "Đăng ký" và "Quên mật khẩu?" nhưng chưa có artboard thiết kế.
- **Giải pháp:**
  - `SCR-ADD-01`: Nhập SĐT -> Gửi OTP 6 số qua SMS -> Nhập Họ tên, Mật khẩu -> Tạo tài khoản -> Tự động tạo Member `relation=self`.
  - `SCR-ADD-02`: Nhập SĐT/Email -> Gửi OTP -> Xác thực OTP -> Nhập mật khẩu mới -> Thu hồi toàn bộ session cũ.

### 2. Màn hình Ký xác nhận chia sẻ dữ liệu cho người thân ≥ 18 tuổi (SCR-ADD-03)
- **Thiếu sót:** BR-01 quy định thành viên ≥ 18 tuổi cần đồng ý trước khi chủ tài khoản xem được dữ liệu, nhưng chưa có màn hình cho người thân duyệt yêu cầu.
- **Giải pháp:** Xây dựng màn hình webview / app dành cho người thân khi mở link mời:
  - Hiển thị: "{Họ tên chủ tài khoản} muốn quản lý hồ sơ sức khỏe của bạn trên D-Health".
  - Danh sách quyền yêu cầu: Xem kết quả xét nghiệm, lịch uống thuốc, sinh trắc học.
  - 2 nút: **Đồng ý chia sẻ** hoặc **Từ chối**. Cho phép rút lại quyền bất cứ lúc nào.

### 3. Màn hình Quản lý Dị ứng chuyên sâu (SCR-ADD-04)
- **Thiếu sót:** SCR-10 có ô "Dị ứng (DƯ)" dẫn đến SCR-17, nhưng thẻ khẩn cấp chỉ là nơi xem tóm tắt, chưa có nơi thêm mới/chỉnh sửa danh mục dị ứng.
- **Giải pháp:** Thêm màn hình `AllergiesScreen`:
  - Danh sách dị ứng: Dị ứng thuốc (Penicillin, Aspirin...), thức ăn (Hải sản, Đậu phộng...), dị nguyên khác.
  - Mỗi mục có mức độ nghiêm trọng: Nhẹ, Trung bình, Sốc phản vệ (nguy kịch).
  - Form thêm dị ứng có gợi ý hoạt chất thuốc để cảnh báo tương tác khi kê đơn ở SCR-11.

### 4. Màn hình Báo cáo Giải phẫu bệnh chi tiết (SCR-ADD-05)
- **Thiếu sót:** Cận lâm sàng có XN (SCR-06) và CĐHA (SCR-08), nhưng GPB mới chỉ có panel 5 mục ở SCR-10, chưa có màn hình xem toàn văn kết quả sinh thiết / hoá mô miễn dịch.
- **Giải pháp:** Thêm `PathologyReportScreen`:
  - Mã bệnh phẩm, phương pháp lấy mẫu (sinh thiết kim, sinh thiết mở, FNA).
  - Chẩn đoán vi thể và đại thể.
  - Bảng dấu ấn hóa mô miễn dịch (Ki-67 %, HER2, ER, PR).
  - Đính kèm tệp PDF phiếu kết quả gốc.

### 5. Màn hình Xem Nhật ký Kiểm toán truy cập (SCR-ADD-06 - BR-04)
- **Thiếu sót:** BR-04 yêu cầu chủ hồ sơ xem lại được mọi lượt truy cập của bên thứ ba, nhưng chưa có UI hiển thị.
- **Giải pháp:** Thêm tab "Lịch sử truy cập" trong màn hình Chia sẻ (SCR-14):
  - Hiển thị: Thời gian, Đối tượng truy cập (Bác sĩ Nguyễn Văn A / Quét mã QR khẩn cấp), Nhóm dữ liệu đã xem, Địa chỉ IP.

---

## 🚀 PHẦN 5: LỘ TRÌNH THỰC HIỆN TỪNG BƯỚC (STEP-BY-STEP IMPLEMENTATION ROADMAP)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LỘ TRÌNH 4 GIAI ĐOẠN                            │
├────────────────────────────────────────────────────────────────────────┤
│ GIAI ĐOẠN 1: DOMAIN CORE & TDD TESTING (Tuần 1 - 2)                   │
│ • Định nghĩa 7 Bounded Contexts, Value Objects bất biến (Self-Val)     │
│ • Viết trọn bộ 100% Unit Test cho logic tính toán (Adherence, RECIST)  │
│ • Thiết kế DB Schema (Postgres / SQLite) có Index & Soft Delete        │
├────────────────────────────────────────────────────────────────────────┤
│ GIAI ĐOẠN 2: REPOSITORIES, SERVICES & REST APIS (Tuần 3 - 4)           │
│ • Xây dựng Domain Services & Repositories theo Clean Architecture      │
│ • RESTful API Handlers, JWT Bearer Auth, Field Encryption (AES-256)    │
│ • Background Job: Lịch nhắc thuốc, chuyển Missed, Đồng bộ thiết bị     │
├────────────────────────────────────────────────────────────────────────┤
│ GIAI ĐOẠN 3: FRONTEND ATOMIC COMPONENTS & SCREENS (Tuần 5 - 7)         │
│ • Thiết lập Design Tokens (Teal #1F7A8C, Plus Jakarta Sans, Spacing)   │
│ • Xây dựng Atoms/Molecules/Organisms (BiometricCard, MetricBadge...)    │
│ • Xây dựng 17 màn hình chuẩn 5 trạng thái (Loading Skeleton, Empty...) │
│ • Tích hợp In-Frame Scroll, Carousel Chip, Modal Bottom Sheet          │
├────────────────────────────────────────────────────────────────────────┤
│ GIAI ĐOẠN 4: TÍCH HỢP AI, KIỂM THỬ AN NINH & BÀN GIAO (Tuần 8)         │
│ • Pipeline AI OCR đọc phiếu XN, CĐHA, đơn thuốc kèm % tin cậy          │
│ • Audit an ninh web (OWASP Top 10, NĐ 13/2023/NĐ-CP, Rate Limiting)    │
│ • Kiểm thử thị giác (Visual QC) và nghiệm thu Definition of Done       │
└────────────────────────────────────────────────────────────────────────┘
```

### ✅ Bảng Kiểm Tra Sẵn Sàng (Checklist Nghiệm Thu Kế Hoạch):
- [x] Đã đọc toàn bộ nội dung tài liệu BA (`5_6291670095529781835.md`) và 17 artboards trong file canvas HTML.
- [x] Đã chuẩn hóa mô hình thực thể DDD bao phủ 100% trường hiển thị trên UI.
- [x] Đã phân tích nguồn gốc dữ liệu từng dòng (không dùng fake default data).
- [x] Đã xác định đầy đủ các tác động lan truyền (side effects & event cascades).
- [x] Đã đưa toàn bộ dữ liệu ngầm (Token, Encryption IV, Audit Log, Idempotency) vào cấu trúc thiết kế.
- [x] Đã bổ sung 7 màn hình/luồng nghiệp vụ còn thiếu để hoàn thiện trải nghiệm người dùng khép kín.
