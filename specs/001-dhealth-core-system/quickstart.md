# Quickstart & Verification Guide: D-Health Core Platform

**Feature Branch**: `001-dhealth-core-system`  
**Purpose**: Hướng dẫn kiểm chứng nhanh các kịch bản cốt lõi (Validation Scenarios) của hệ sinh thái D-Health sau khi thực thi xong các tác vụ trong `tasks.md`.

---

## 1. Thiết lập môi trường & Chạy kiểm thử tự động (TDD Suite)

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy toàn bộ ma trận kiểm thử 4 chiều (TDD Mandate)
npm test

# 3. Xem báo cáo độ bao phủ mã nguồn (Bắt buộc >= 95% cho Domain Entities & Services)
npm run test:coverage
```

---

## 2. Kịch bản kiểm chứng lâm sàng & nghiệp vụ cốt lõi

### Kịch bản 1: Thẩm định Huyết áp & Deduplication Thiết bị
1. **Mục tiêu**: Xác nhận Value Object `BloodPressure` tự thẩm định và cơ chế lọc trùng thiết bị.
2. **Thao tác**:
   - Gửi yêu cầu lưu chỉ số $140/90\text{ mmHg}$ từ máy đo Omron lúc $07:15$.
   - Gửi yêu cầu lưu chỉ số $138/88\text{ mmHg}$ từ Apple Watch cùng thời điểm $07:15$.
3. **Kết quả mong đợi**:
   - CSDL lưu cả 2 nhưng bản ghi Omron có `priority_tier = 100`, Apple Watch có `priority_tier = 80`.
   - API trả về bản ghi hiển thị chính là Omron, cờ `is_primary = true`.

### Kịch bản 2: Đánh giá Ung bướu RECIST 1.1
1. **Mục tiêu**: Xác nhận thuật toán RECIST 1.1 tính toán chính xác trên dữ liệu thực tế của bệnh nhân Khang.
2. **Dữ liệu vào**:
   - Baseline (15/03/2026): 3 khối đặc gan (15, 20, 25 mm) $\rightarrow \text{SoD} = 60\text{ mm}$.
   - Lần 2 (20/06/2026): 3 khối đặc gan (12, 15, 18 mm) $\rightarrow \text{SoD} = 45\text{ mm}$.
   - Lần 3 (20/08/2026): 3 khối đặc gan (10, 12, 16 mm) $\rightarrow \text{SoD} = 38\text{ mm}$.
3. **Kết quả mong đợi**:
   - $\Delta \% = (38 - 60) / 60 \times 100\% = -36.7\%$.
   - Hệ thống trả về `category = 'PR'` (Đáp ứng một phần) kèm huy hiệu màu xanh lá trên màn SCR-07.

### Kịch bản 3: Cổng đồng thuận Nghị định 13/2023/NĐ-CP
1. **Mục tiêu**: Đảm bảo quyền riêng tư dữ liệu y tế của thành viên trên 18 tuổi.
2. **Thao tác**:
   - Đăng nhập tài khoản chủ hộ "Trần Minh Khang".
   - Chuyển ngữ cảnh hồ sơ sang "Trần Minh An" (19 tuổi, `consent_approved = false`).
3. **Kết quả mong đợi**:
   - Màn hình hiển thị trạng thái Consent Gate: *"Thành viên trên 18 tuổi cần đồng ý chia sẻ trước khi bạn xem dữ liệu"*.
   - Toàn bộ kết quả xét nghiệm và CĐHA bị ẩn, có nút *"Gửi yêu cầu chia sẻ qua SMS/App"*.

### Kịch bản 4: Quét QR Cấp cứu Ngoại tuyến (Offline SOS)
1. **Mục tiêu**: Kiểm tra khả năng cấp cứu khi mất kết nối mạng hoàn toàn.
2. **Thao tác**:
   - Bật Airplane Mode trên thiết bị di động.
   - Mở màn hình SCR-15 (hoặc Widget màn hình khóa).
   - Quét mã QR bằng ứng dụng camera ngoài.
3. **Kết quả mong đợi**:
   - Chuỗi dữ liệu giải nén thành công hiển thị:
     `{"name": "Trần Minh Khang", "blood": "O+", "allergies": ["Penicillin (sốc phản vệ)"], "emergency_phone": "0987654321"}`.

