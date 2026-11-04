-- Rollback Migration 003: Phục hồi tài khoản demo Trần Minh Khang (khi cần)
INSERT INTO users (id, phone_number, national_id, email, password_hash, is_ekyc_verified)
VALUES ('11111111-1111-1111-1111-111111111111', '0909123456', '001086012345', 'khang.tran@dhealth.vn', crypt('Khang@2026', gen_salt('bf')), TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO family_members (id, user_id, full_name, relationship, gender, birth_date, blood_type, height_cm, weight_kg, insurance_number, is_above_18, consent_approved)
VALUES
('me', '11111111-1111-1111-1111-111111111111', 'Trần Minh Khang', 'owner', 'Nam', '1980-05-14', 'O+', 174.0, 72.5, 'DN4010123456789', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;
