---
description: "Danh sách tác vụ triển khai Spec-Kit chuẩn TDD cho D-Health Core Platform"
---

# Tasks: D-Health Core Healthcare Platform

**Feature Branch**: `001-dhealth-core-system`  
**Prerequisites**: [spec.md](file:///d:/D-HEALTH/specs/001-dhealth-core-system/spec.md), [plan.md](file:///d:/D-HEALTH/specs/001-dhealth-core-system/plan.md), [data-model.md](file:///d:/D-HEALTH/specs/001-dhealth-core-system/data-model.md)  
**TDD Mandate**: 100% mọi hàm mới phải có file test đi kèm với ma trận kiểm thử 4 chiều (Input / Output / Error / Logic Invariants).

---

## Phase 1: Setup (Cơ sở hạ tầng & Cấu hình môi trường)

- [ ] **T001**: Khởi tạo cấu trúc thư mục Clean Architecture theo đúng `plan.md` (`src/domain`, `src/application`, `src/infrastructure`, `src/presentation`, `tests/`).
- [ ] **T002**: [P] Cấu hình môi trường TypeScript và Vitest/Jest với script chạy test nhanh `npm test` và độ bao phủ code `npm run test:coverage`.
- [ ] **T003**: [P] Xây dựng file `src/presentation/tokens/DesignTokens.ts` chứa 100% tokens màu sắc (Primary Teal `#1F7A8C`, Gradient `#1F7A8C` $\rightarrow$ `#2F6FDB`, Status Colors), typography (Plus Jakarta Sans), spacing (lưới 4px) và radius (20–24px, 28px).
- [ ] **T004**: [P] Viết test kiểm tra tính toàn vẹn của Design Tokens `tests/presentation/tokens/DesignTokens.spec.ts`.

---

## Phase 2: Foundational (Cơ sở dữ liệu & DDD Value Objects)

> **⚠️ BẮT BUỘC HOÀN THÀNH TRƯỚC KHI THỰC HIỆN CÁC USER STORIES**

- [ ] **T005**: Viết file Migration DDL `src/infrastructure/database/sqlite/migrations/001_initial_schema.sql` khởi tạo 13 bảng theo đúng `data-model.md`.
- [ ] **T006**: Xây dựng lớp kết nối SQLite `src/infrastructure/database/sqlite/SQLiteConnection.ts` hỗ trợ chế độ WAL (Write-Ahead Logging) và foreign keys.
- [ ] **T007**: Viết unit test cho lớp SQLiteConnection `tests/infrastructure/database/SQLiteConnection.spec.ts` kiểm tra transaction rollback khi gặp lỗi.
- [ ] **T008**: [P] Viết bộ test TDD 4 chiều cho Value Object `BloodPressure` `tests/domain/value-objects/BloodPressure.spec.ts` (Test biên 60/30, 250/150; Test lỗi `diastolic >= systolic`; Test phân loại THA; Test bất biến `Object.freeze`).
- [ ] **T009**: [P] Cài đặt Value Object `BloodPressure` tại `src/domain/value-objects/BloodPressure.ts` để pass toàn bộ test T008.
- [ ] **T010**: [P] Viết test TDD 4 chiều cho Value Object `HeartRate` `tests/domain/value-objects/HeartRate.spec.ts` (Test biên 30–220 bpm; Test lỗi số âm, NaN).
- [ ] **T011**: [P] Cài đặt Value Object `HeartRate` tại `src/domain/value-objects/HeartRate.ts`.
- [ ] **T012**: [P] Viết test TDD 4 chiều cho Value Object `BodyMassIndex` `tests/domain/value-objects/BodyMassIndex.spec.ts` (Công thức $w / (h/100)^2$, làm tròn 1 thập phân).
- [ ] **T013**: [P] Cài đặt Value Object `BodyMassIndex` tại `src/domain/value-objects/BodyMassIndex.ts`.
- [ ] **T014**: [P] Viết test TDD cho Value Object `BloodType` và `LoincCode` `tests/domain/value-objects/MedicalCodes.spec.ts`.
- [ ] **T015**: [P] Cài đặt Value Object `BloodType` và `LoincCode` tại `src/domain/value-objects/`.
- [ ] **T016**: Xây dựng hệ thống phân lớp ngoại lệ chuẩn `src/domain/exceptions/DomainExceptions.ts` (`ValidationError`, `NotFoundError`, `ConflictError`, `ConsentRequiredException`).

---

## Phase 3: User Story 1 - Authentication, Profile Switcher & Home (Priority: P1 - MVP)

- [ ] **T017**: [US1] Viết test TDD cho Domain Entity `User` và `FamilyMember` `tests/domain/entities/User.spec.ts` (Bao gồm logic tự động tính `is_above_18` từ `birth_date`).
- [ ] **T018**: [US1] Cài đặt Entity `User` và `FamilyMember` tại `src/domain/entities/`.
- [ ] **T019**: [US1] Viết test TDD cho Domain Service `HealthScoreCalculator` `tests/domain/services/HealthScoreCalculator.spec.ts` (Công thức 3 trụ cột: 40% Sinh trắc + 35% Tuân thủ thuốc + 25% Cận lâm sàng).
- [ ] **T020**: [US1] Cài đặt Domain Service `HealthScoreCalculator` tại `src/domain/services/HealthScoreCalculator.ts`.
- [ ] **T021**: [US1] Viết test TDD cho Use Case `SwitchActiveMemberUseCase` `tests/application/use-cases/SwitchActiveMemberUseCase.spec.ts` (Kiểm tra rào chắn Consent Gate khi thành viên $\ge 18$ tuổi chưa đồng thuận).
- [ ] **T022**: [US1] Cài đặt `SwitchActiveMemberUseCase` tại `src/application/use-cases/SwitchActiveMemberUseCase.ts`.
- [ ] **T023**: [US1] Cài đặt Presentation Atoms & Molecules: `HealthScoreCircle`, `MetricCard`, `TimelineRow`, `MemberAvatar` tại `src/presentation/components/`.
- [ ] **T024**: [US1] Cài đặt Màn hình Đăng nhập `src/presentation/screens/auth/SCR01_LoginScreen.tsx` hỗ trợ mật khẩu và sinh trắc FaceID/Fingerprint.
- [ ] **T025**: [US1] Cài đặt Màn hình Trang chủ `src/presentation/screens/home/SCR02_HomeScreen.tsx` xử lý đủ 5 trạng thái State và điều hướng đúng đến SCR-03, SCR-05, SCR-10, SCR-11.
- [ ] **T026**: [US1] Cài đặt Màn hình Hồ sơ cá nhân `SCR16_UserProfileScreen.tsx` và Hồ sơ gia đình `SCR17_FamilyProfilesScreen.tsx` kèm Cổng đồng thuận trên 18 tuổi (Nghị định 13/2023).

---

## Phase 4: User Story 2 - Biometrics Vitals Tracking & Devices (Priority: P1 - MVP)

- [ ] **T027**: [US2] Viết test TDD cho Aggregate Root `BiometricRecord` `tests/domain/entities/BiometricRecord.spec.ts` (Quy tắc BR-50 cấm ngày tương lai, quy tắc nhóm `group_id` khi nhập HA kèm NT, phân định nguồn `device` vs `manual`).
- [ ] **T028**: [US2] Cài đặt Aggregate Root `BiometricRecord` tại `src/domain/entities/BiometricRecord.ts`.
- [ ] **T029**: [US2] Viết test TDD cho Use Case `RecordBiometricUseCase` `tests/application/use-cases/RecordBiometricUseCase.spec.ts` (Xử lý lưu số đo và soft delete cho số đo nhập tay).
- [ ] **T030**: [US2] Cài đặt `RecordBiometricUseCase` tại `src/application/use-cases/RecordBiometricUseCase.ts`.
- [ ] **T031**: [US2] Viết test TDD cho Domain Service `DeviceDeduplicationService` `tests/domain/services/DeviceDeduplicationService.spec.ts` (Ưu tiên Class IIa > Watch > Platform theo BR-64).
- [ ] **T032**: [US2] Cài đặt `DeviceDeduplicationService` tại `src/domain/services/DeviceDeduplicationService.ts`.
- [ ] **T033**: [US2] Cài đặt Component Biểu đồ Cột Phạm vi (Range-column SVG) cho Huyết áp và Area-line cho 7 chỉ số còn lại tại `src/presentation/components/organisms/BiometricChart.tsx`.
- [ ] **T034**: [US2] Cài đặt Component Bottom Sheet nhập tay sinh trắc `ManualBiometricBottomSheet.tsx` tự động tính BMI và kiểm tra giới hạn y khoa.
- [ ] **T035**: [US2] Cài đặt Màn hình Sinh trắc học `src/presentation/screens/biometrics/SCR03_BiometricsScreen.tsx` với lịch sử đo In-frame scroll 5 mục gần nhất.
- [ ] **T036**: [US2] Cài đặt Màn hình Kết nối thiết bị `src/presentation/screens/devices/SCR04_DevicesScreen.tsx` hỗ trợ quét BLE, xem pin và cấu hình tần suất đồng bộ.

---

## Phase 5: User Story 3 - Clinical Reports & Specialized Labs (Priority: P2 - Clinical)

- [ ] **T037**: [US3] Viết test TDD cho Domain Entity `ClinicalReport` và `LabResult` `tests/domain/entities/ClinicalReport.spec.ts` (Mapping mã LOINC, khoảng tham chiếu theo tuổi/giới tính).
- [ ] **T038**: [US3] Cài đặt Entity `ClinicalReport` và `LabResult` tại `src/domain/entities/`.
- [ ] **T039**: [US3] Viết test TDD cho Domain Service `AnalyteClassifierService` `tests/domain/services/AnalyteClassifierService.spec.ts` (Thuật toán bỏ phiếu phân loại SH, HH, VS, PT, DT và cảnh báo khi có chỉ số hỗn hợp).
- [ ] **T040**: [US3] Cài đặt `AnalyteClassifierService` tại `src/domain/services/AnalyteClassifierService.ts`.
- [ ] **T041**: [US3] Viết test TDD cho Use Case `IngestClinicalReportUseCase` `tests/application/use-cases/IngestClinicalReportUseCase.spec.ts` (Hỗ trợ 3 kênh: Manual, OCR, Link CSYT).
- [ ] **T042**: [US3] Cài đặt `IngestClinicalReportUseCase` tại `src/application/use-cases/IngestClinicalReportUseCase.ts`.
- [ ] **T043**: [US3] Cài đặt Màn hình Xét nghiệm `src/presentation/screens/labs/SCR05_LabsScreen.tsx` với 6 chip lọc chuyên khoa, multi-select chỉ số và biểu đồ xu hướng 5 lần xét nghiệm.
- [ ] **T044**: [US3] Cài đặt Màn hình Báo cáo XN chi tiết `src/presentation/screens/labs/SCR06_LabDetailScreen.tsx` hiển thị bảng 12 chỉ số với highlight màu vàng `#FFFBEB` cho các chỉ số vượt ngưỡng.
- [ ] **T045**: [US3] Cài đặt Màn hình Nhập kết quả cận lâm sàng `src/presentation/screens/camera/SCR12_InputClinicalScreen.tsx` (Wizard 3 bước: Phân loại, Nhập chỉ số / OCR ảnh gốc, Xác nhận).

---

## Phase 6: User Story 4 - Imaging Study Management & RECIST 1.1 (Priority: P2 - Oncology)

- [ ] **T046**: [US4] Viết test TDD cho Value Object `RecistResponse` và Domain Service `RecistEvaluator` `tests/domain/services/RecistEvaluator.spec.ts` (Kiểm tra điều kiện baseline $\ge 10\text{ mm}$; Test các mốc kết luận: CR, PR khi giảm $\ge 30\%$, SD, PD khi tăng $\ge 20\%$ và $\ge 5\text{ mm}$).
- [ ] **T047**: [US4] Cài đặt Value Object `RecistResponse` và Service `RecistEvaluator` tại `src/domain/services/RecistEvaluator.ts`.
- [ ] **T048**: [US4] Cài đặt Entity `ImagingStudy` và `ImagingLesion` tại `src/domain/entities/`.
- [ ] **T049**: [US4] Cài đặt Component Bảng ma trận SoD (Sum of Diameters) `src/presentation/components/organisms/LesionSodMatrix.tsx`.
- [ ] **T050**: [US4] Cài đặt Màn hình Chẩn đoán hình ảnh `src/presentation/screens/imaging/SCR07_ImagingScreen.tsx` với bộ 3 lọc tổn thương (Loại, Vị trí, Phương tiện) và switch đánh giá RECIST 1.1.
- [ ] **T051**: [US4] Cài đặt Màn hình Báo cáo CĐHA chi tiết `src/presentation/screens/imaging/SCR08_ImagingDetailScreen.tsx` với 3 thumbnail DICOM then chốt (T1+thuốc, T2, DWI) và 4 khối cấu trúc chuẩn BYT.

---

## Phase 7: User Story 5 - Chronic Care, Meds & Emergency SOS (Priority: P3 - Care)

- [ ] **T052**: [US5] Viết test TDD cho Domain Service `AdherenceCalculator` `tests/domain/services/AdherenceCalculator.spec.ts` (Tính % tuân thủ uống thuốc 30 ngày lăn, xử lý liều hoãn snoozed).
- [ ] **T053**: [US5] Cài đặt `AdherenceCalculator` tại `src/domain/services/AdherenceCalculator.ts`.
- [ ] **T054**: [US5] Viết test TDD cho Use Case `TakeMedicationDoseUseCase` `tests/application/use-cases/TakeMedicationDoseUseCase.spec.ts` (Đổi trạng thái `taken`, cập nhật `actual_taken_time`).
- [ ] **T055**: [US5] Cài đặt `TakeMedicationDoseUseCase` tại `src/application/use-cases/TakeMedicationDoseUseCase.ts`.
- [ ] **T056**: [US5] Viết test TDD cho Service ký số QR Offline `EcdsaQrSigner` `tests/infrastructure/security/EcdsaQrSigner.spec.ts` (Mã hóa payload JSON nén, ký số và xác thực chữ ký offline).
- [ ] **T057**: [US5] Cài đặt `EcdsaQrSigner` tại `src/infrastructure/security/EcdsaQrSigner.ts`.
- [ ] **T058**: [US5] Cài đặt Màn hình Disease Cockpit `src/presentation/screens/cockpit/SCR09_CockpitScreen.tsx` với các thẻ bệnh lý tim mạch/tiểu đường và danh sách việc cần làm tương tác.
- [ ] **T059**: [US5] Cài đặt Màn hình Hồ sơ y tế (Medical Passport) `src/presentation/screens/records/SCR10_MedicalPassportScreen.tsx` với lưới 9 nhóm dữ liệu và panel GPB, Bác sĩ, CSYT.
- [ ] **T060**: [US5] Cài đặt Màn hình Quản lý dùng thuốc `src/presentation/screens/meds/SCR11_MedsScreen.tsx` với 3 tab Lịch uống 31 ngày, Tủ thuốc và Lịch sử.
- [ ] **T061**: [US5] Cài đặt Màn hình Trợ lý AI `src/presentation/screens/ai/SCR13_AiAssistantScreen.tsx` với cơ chế RAG có trích dẫn nguồn bằng chứng.
- [ ] **T062**: [US5] Cài đặt Màn hình Chăm sóc `src/presentation/screens/care/SCR14_CareScreen.tsx` hỗ trợ My Care Team, Lịch hẹn và Quản trị quyền chia sẻ dữ liệu 7 ngày.
- [ ] **T063**: [US5] Cài đặt Màn hình Thẻ sức khỏe khẩn cấp `src/presentation/screens/emergency/SCR15_EmergencyCardScreen.tsx` với mã QR Offline hiển thị ngoài màn hình khóa và nút gọi 115.

---

## Phase 8: Integration & Quality Verification (Nghiệm thu toàn diện)

- [ ] **T064**: Chạy toàn bộ test suite `npm test` xác nhận 100% test cases pass (`green`).
- [ ] **T065**: Audit bảo mật web/mobile theo chuẩn OWASP Top 10 và Nghị định 13/2023/NĐ-CP (Xác nhận không rò rỉ PII, không lưu mật khẩu portal CSYT vào database).
- [ ] **T066**: Kiểm thử trải nghiệm công thái học (Touch Target $\ge 44\text{ pt}$, In-Frame Scroll $\le 5$ items trên toàn bộ các danh sách).
- [ ] **T067**: Hoàn tất tài liệu hướng dẫn vận hành và nghiệm thu `quickstart.md`.

