-- Migration 011: Seed Người dùng, Thành viên gia đình, Thẻ cấp cứu & Người liên hệ khẩn cấp cho Trần Hữu Nam (SCR-16 & SCR-17)

-- 1. Đảm bảo user và các thành viên gia đình của Trần Hữu Nam tồn tại trong CSDL
INSERT INTO users (id, phone_number, national_id, email, password_hash, is_ekyc_verified)
VALUES ('22222222-2222-2222-2222-222222222222', '0988777666', '001085012345', 'nam.tran@dhealth.vn', crypt('Nam@2026', gen_salt('bf')), TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO family_members (id, user_id, full_name, relationship, gender, birth_date, blood_type, height_cm, weight_kg, insurance_number, is_above_18, consent_approved)
VALUES 
  ('nam', '22222222-2222-2222-2222-222222222222', 'Trần Hữu Nam', 'owner', 'Nam', '1980-04-12', 'O+', 174.0, 72.5, 'DN4010850123456', TRUE, TRUE),
  ('mai', '22222222-2222-2222-2222-222222222222', 'Nguyễn Thị Mai', 'spouse', 'Nữ', '1983-09-20', 'A+', 162.0, 52.0, 'DN4010850123457', TRUE, TRUE),
  ('duc_anh', '22222222-2222-2222-2222-222222222222', 'Trần Đức Anh', 'child', 'Nam', '2012-11-05', 'O+', 148.0, 39.0, 'TE1010850123458', FALSE, TRUE),
  ('hoa', '22222222-2222-2222-2222-222222222222', 'Bà Lê Thị Hoa', 'parent', 'Nữ', '1955-06-15', 'B+', 155.0, 56.0, 'GD4010850123459', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  relationship = EXCLUDED.relationship,
  gender = EXCLUDED.gender,
  birth_date = EXCLUDED.birth_date,
  blood_type = EXCLUDED.blood_type,
  height_cm = EXCLUDED.height_cm,
  weight_kg = EXCLUDED.weight_kg,
  insurance_number = EXCLUDED.insurance_number,
  is_above_18 = EXCLUDED.is_above_18,
  consent_approved = EXCLUDED.consent_approved;

-- 2. Thẻ cấp cứu offline mã hóa cho Trần Hữu Nam (SCR-17)
INSERT INTO emergency_cards 
  (member_id, blood_group_snapshot, allergies, chronic_conditions, current_critical_meds, emergency_notes, offline_qr_payload, qr_signature)
VALUES 
  (
    'nam', 
    'O+', 
    '[{"allergen": "Penicillin", "reaction": "Sốc phản vệ độ 2"}]'::jsonb,
    '["Tăng huyết áp", "Đái tháo đường Type 2"]'::jsonb,
    '["Metformin 500mg", "Losartan 50mg", "Atorvastatin 10mg"]'::jsonb,
    'Bệnh nhân có tiền sử tăng huyết áp và đái tháo đường, tiền sử dị ứng Penicillin.',
    'DHEALTH:EMERGENCY:O+:ALLERGIES=Penicillin:CONTACT=0988777666',
    'MEQCIE7xK8vZ1L5m9Xy4W2qP0rT3sV6uB8nD1fG3hJ5kL7mNAiAwQ8vX4mK1tY7pL3sD9fG2hJ5kL8mP0rT4uV7wB9n'
  )
ON CONFLICT (member_id) DO UPDATE SET
  blood_group_snapshot = EXCLUDED.blood_group_snapshot,
  allergies = EXCLUDED.allergies,
  chronic_conditions = EXCLUDED.chronic_conditions,
  current_critical_meds = EXCLUDED.current_critical_meds,
  emergency_notes = EXCLUDED.emergency_notes,
  offline_qr_payload = EXCLUDED.offline_qr_payload,
  qr_signature = EXCLUDED.qr_signature;

-- 3. Người liên hệ khẩn cấp cho Trần Hữu Nam
INSERT INTO emergency_contacts 
  (id, member_id, contact_name, relationship, phone_number, is_primary, priority_order)
VALUES 
  ('66666666-0001-0000-0000-000000000001', 'nam', 'Trần Thu Hà', 'Vợ', '0988 777 666', true, 1),
  ('66666666-0002-0000-0000-000000000002', 'nam', 'BS Lê Văn C', 'Bác sĩ điều trị', '0912 345 678', false, 2)
ON CONFLICT (id) DO UPDATE SET
  contact_name = EXCLUDED.contact_name,
  relationship = EXCLUDED.relationship,
  phone_number = EXCLUDED.phone_number,
  is_primary = EXCLUDED.is_primary;
