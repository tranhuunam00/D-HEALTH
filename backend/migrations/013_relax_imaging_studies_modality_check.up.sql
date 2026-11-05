-- Migration 013 (UP): Mở rộng check constraint cho modality trong imaging_studies và dọn dẹp báo cáo GPB thử nghiệm
-- Tuân thủ Rule 5 (Database Migration Mandate & Expand-and-Contract)

-- 1. Nâng cấp ràng buộc modality trong bảng imaging_studies để chấp nhận XQ, MM, SA chuẩn hóa
ALTER TABLE imaging_studies DROP CONSTRAINT IF EXISTS imaging_studies_modality_check;
ALTER TABLE imaging_studies ADD CONSTRAINT imaging_studies_modality_check 
  CHECK (modality IN ('MRI', 'CT', 'US', 'XR', 'PET', 'XQ', 'MM', 'SA'));

-- 2. Đảm bảo bảng clinical_reports có đầy đủ các cột lâm sàng
ALTER TABLE clinical_reports
  ADD COLUMN IF NOT EXISTS recommendations TEXT,
  ADD COLUMN IF NOT EXISTS clinical_findings TEXT,
  ADD COLUMN IF NOT EXISTS technique_description TEXT;

-- 3. Xóa các báo cáo thử nghiệm GPB (Giải phẫu bệnh) không thuộc 4 phân hệ chính cho tài khoản nam
DELETE FROM clinical_reports 
WHERE member_id = 'nam' 
  AND (kind = 'pathology' OR category = 'GPB' OR title ILIKE 'Giải phẫu bệnh%');
