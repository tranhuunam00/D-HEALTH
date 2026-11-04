# Technical Implementation Plan: D-Health Core Healthcare Platform

**Feature Branch**: `001-dhealth-core-system`  
**Date**: 2026-11-04  
**Spec Link**: [spec.md](file:///d:/D-HEALTH/specs/001-dhealth-core-system/spec.md)  
**Data Model Link**: [data-model.md](file:///d:/D-HEALTH/specs/001-dhealth-core-system/data-model.md)

---

## 1. Summary
Triển khai toàn diện nền tảng số y tế D-Health theo phương pháp **Specification-Driven Development (Spec-Kit)**, bao quát trọn vẹn 17 màn hình giao diện từ Đăng nhập, Sinh trắc học, Kết nối thiết bị BLE, Xét nghiệm cận lâm sàng, Chẩn đoán hình ảnh RECIST 1.1, Quản lý bệnh mạn tính, Dùng thuốc đến Thẻ cấp cứu QR Offline. Kiến trúc áp dụng Clean Architecture kết hợp Tactical DDD, bảo đảm 100% kiểm thử TDD đa chiều và tuân thủ tuyệt đối Nghị định 13/2023/NĐ-CP.

---

## 2. Technical Context
- **Ngôn ngữ & Runtime**: TypeScript 5.3+, Node.js 20 LTS, React Native / Expo SDK 51 hoặc SPA Web Component Framework.
- **Tầng CSDL (Storage)**:
  - Client Offline: SQLite (`expo-sqlite` / `better-sqlite3`) với WAL mode (Write-Ahead Logging).
  - Server Cloud: PostgreSQL 16 với pgvector (hỗ trợ RAG Semantic Search cho Trợ lý AI SCR-13).
- **Quản lý State & Caching**:
  - Server State: TanStack Query (React Query) v5 (quản lý 5 trạng thái: Loading Skeleton, Empty CTA, Error Retry, Data, Syncing).
  - Client Global Context: Zustand (quản lý phiên đăng nhập `activeMemberId`, mạng offline `NetInfo`).
- **Thư viện BLE & Thiết bị**: `react-native-ble-plx` hoặc Web Bluetooth API, Apple HealthKit API, Google Health Connect SDK.
- **Thư viện UI & Đồ họa**: DesignTokens (Plus Jakarta Sans, Primary Teal `#1F7A8C`, Radius 20–24px), `react-native-svg` (vẽ biểu đồ cột phạm vi Huyết áp, Area-line, Sparklines).
- **Kiểm thử (Testing Stack)**: Vitest / Jest kết hợp `@testing-library/react-native`, Fast-Check (Property-based testing cho các thuật toán y tế).

---

## 3. Constitution Check (Cổng kiểm soát Hiến pháp)

| Hiến pháp Kỹ thuật | Trạng thái | Minh chứng thẩm định |
|:---|:---:|:---|
| **Gate 1: Spec Alignment** | **PASSED** | Đã hoàn thành `spec.md` với 5 User Stories được xếp thứ tự P1 $\rightarrow$ P5 và đầy đủ kịch bản Given-When-Then. |
| **Gate 2: Data Feasibility** | **PASSED** | 100% trường dữ liệu trên 17 màn hình đã được định vị chính xác trong `data-model.md`, xóa bỏ hoàn toàn dữ liệu default vô căn cứ. |
| **Gate 3: TDD Matrix Prepared** | **PASSED** | Ma trận 4 chiều (Input biên, Output bất biến, Error class/code, Invariants công thức y tế) được tích hợp trong từng task của `tasks.md`. |
| **Gate 4: Tactical DDD** | **PASSED** | Khởi tạo 6 Value Objects bất biến (`BloodPressure`, `HeartRate`, `BodyMassIndex`, `LoincCode`, `BloodType`, `RecistResponse`) và 4 Aggregate Roots (`MemberHealthRecord`, `BiometricRecord`, `ClinicalReport`, `MedicationPlan`). |
| **Gate 5: Ergonomic UX & Tokens** | **PASSED** | Tuân thủ 100% Design Tokens, In-frame scroll $\le 5$ mục, Touch target $\ge 44\text{ pt}$, Modal bottom sheets. |
| **Gate 6: Decree 13 Compliance** | **PASSED** | Thiết lập bảng `access_audit_logs`, cổng đồng thuận `consent_approved` cho thành viên $\ge 18$ tuổi, mã hóa QR Offline và token chia sẻ 7 ngày. |

---

## 4. Kiến trúc phân tầng (Clean Architecture & DDD Layout)

```text
src/
├── domain/                               # TẦNG NGHIỆP VỤ THUẦN TÚY (ZERO DEPENDENCIES)
│   ├── value-objects/                    # Value Objects bất biến & tự thẩm định
│   │   ├── BloodPressure.ts
│   │   ├── HeartRate.ts
│   │   ├── BodyMassIndex.ts
│   │   ├── LoincCode.ts
│   │   ├── BloodType.ts
│   │   └── RecistResponse.ts
│   ├── entities/                         # Aggregate Roots & Entities
│   │   ├── User.ts
│   │   ├── FamilyMember.ts
│   │   ├── BiometricRecord.ts
│   │   ├── ClinicalReport.ts
│   │   ├── ImagingStudy.ts
│   │   ├── Condition.ts
│   │   └── Prescription.ts
│   ├── services/                         # Domain Services tính toán
│   │   ├── HealthScoreCalculator.ts      # Tính điểm 3 trụ cột (BR-01)
│   │   ├── AdherenceCalculator.ts        # Tính % tuân thủ dùng thuốc 30 ngày (BR-10)
│   │   ├── RecistEvaluator.ts            # Đánh giá ung bướu RECIST 1.1 (BR-15)
│   │   └── AnalyteClassifierService.ts   # Tự động gợi ý nhóm XN (BR-20)
│   └── repositories/                     # Interfaces định nghĩa cổng truy xuất
│       ├── IBiometricRepository.ts
│       ├── IClinicalReportRepository.ts
│       ├── IPrescriptionRepository.ts
│       └── IFamilyMemberRepository.ts
│
├── application/                          # TẦNG USE CASES & DTOs
│   ├── use-cases/
│   │   ├── RecordBiometricUseCase.ts
│   │   ├── IngestClinicalReportUseCase.ts
│   │   ├── SwitchActiveMemberUseCase.ts
│   │   ├── TakeMedicationDoseUseCase.ts
│   │   └── GenerateEmergencyQrUseCase.ts
│   └── dtos/
│       ├── BiometricInputDto.ts
│       └── ClinicalReportInputDto.ts
│
├── infrastructure/                       # TẦNG CÀI ĐẶT CÔNG NGHỆ CỤ THỂ
│   ├── database/
│   │   ├── sqlite/
│   │   │   ├── migrations/               # SQL Migrations
│   │   │   ├── SQLiteConnection.ts
│   │   │   └── repositories/             # Cài đặt thực tế các repository interfaces
│   │   └── postgres/
│   ├── ble/
│   │   ├── BleDeviceManager.ts           # GATT Service connection & Deduplication
│   │   └── BleProtocols/                 # Standard BLE Blood Pressure / SpO2
│   ├── ocr/
│   │   └── GeminiOcrAdapter.ts           # Trích xuất dữ liệu phiếu xét nghiệm
│   └── security/
│       ├── EcdsaQrSigner.ts              # Ký số Offline QR cấp cứu
│       └── EncryptionService.ts          # Mã hóa AES-256
│
└── presentation/                         # TẦNG GIAO DIỆN & ATOMIC DESIGN
    ├── tokens/                           # Design Tokens (Màu sắc, Typography, Spacing)
    │   └── DesignTokens.ts
    ├── components/
    │   ├── atoms/                        # Button, Badge, Pill, Avatar, Input, TouchZone
    │   ├── molecules/                    # MetricRow, AnalyteRow, InFrameList, ChipFilterBar
    │   └── organisms/                    # BiometricChartCard, DiseaseCockpitCard, DoseSchedulePanel
    └── screens/                          # 17 Screens theo mã định danh SCR-01 đến SCR-17
        ├── auth/SCR01_LoginScreen.tsx
        ├── home/SCR02_HomeScreen.tsx
        ├── biometrics/SCR03_BiometricsScreen.tsx
        ├── devices/SCR04_DevicesScreen.tsx
        ├── labs/SCR05_LabsScreen.tsx
        ├── labs/SCR06_LabDetailScreen.tsx
        ├── imaging/SCR07_ImagingScreen.tsx
        ├── imaging/SCR08_ImagingDetailScreen.tsx
        ├── cockpit/SCR09_CockpitScreen.tsx
        ├── records/SCR10_MedicalPassportScreen.tsx
        ├── meds/SCR11_MedsScreen.tsx
        ├── camera/SCR12_InputClinicalScreen.tsx
        ├── ai/SCR13_AiAssistantScreen.tsx
        ├── care/SCR14_CareScreen.tsx
        ├── emergency/SCR15_EmergencyCardScreen.tsx
        ├── profile/SCR16_UserProfileScreen.tsx
        └── family/SCR17_FamilyProfilesScreen.tsx
```

