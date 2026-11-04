-- Migration 009: Đồng bộ 100% các chỉ số sinh trắc học chuẩn thiết kế SCR-02 Trang chủ cho thành viên nam
-- Chỉ số: HA 131/82 mmHg, NT 71 bpm, Cân nặng 72.5 kg, HbA1c 6.6 %, SpO2 98 %, BMI 23.9 kg/m2

DELETE FROM biometric_records 
WHERE member_id = 'nam';

INSERT INTO biometric_records (member_id, biometric_type, systolic, diastolic, value_numeric, unit, measured_at, context, source, severity_level)
VALUES 
  ('nam', 'bp', 131.0, 82.0, 131.0, 'mmHg', CURRENT_TIMESTAMP, 'wake', 'device_ble', 1),
  ('nam', 'hr', NULL, NULL, 71.0, 'bpm', CURRENT_TIMESTAMP, 'wake', 'device_ble', 1),
  ('nam', 'weight', NULL, NULL, 72.5, 'kg', CURRENT_TIMESTAMP, 'wake', 'manual', 2),
  ('nam', 'glucose', NULL, NULL, 6.6, '%', CURRENT_TIMESTAMP, 'meal_before', 'manual', 1),
  ('nam', 'hba1c', NULL, NULL, 6.6, '%', CURRENT_TIMESTAMP, 'meal_before', 'manual', 1),
  ('nam', 'spo2', NULL, NULL, 98.0, '%', CURRENT_TIMESTAMP, 'rest', 'device_ble', 1),
  ('nam', 'bmi', NULL, NULL, 23.9, 'kg/m²', CURRENT_TIMESTAMP, 'wake', 'manual', 1);

UPDATE family_members 
SET 
  height_cm = 174,
  weight_kg = 72.5,
  blood_type = 'O+'
WHERE id = 'nam';
