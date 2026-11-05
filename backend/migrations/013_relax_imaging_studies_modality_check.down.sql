-- Migration 013 (DOWN): Đảo ngược ràng buộc modality trong imaging_studies

ALTER TABLE imaging_studies DROP CONSTRAINT IF EXISTS imaging_studies_modality_check;
ALTER TABLE imaging_studies ADD CONSTRAINT imaging_studies_modality_check 
  CHECK (modality IN ('MRI', 'CT', 'US', 'XR', 'PET'));
