-- Migration 003: Xóa bỏ hoàn toàn tài khoản và dữ liệu demo của Trần Minh Khang
-- Yêu cầu: Loại bỏ triệt để tài khoản Trần Minh Khang, chỉ giữ Trần Hữu Nam và các tài khoản thật.

DELETE FROM family_member_consents WHERE member_id IN ('me', 'ha', 'an', 'huy', 'lan');
DELETE FROM daily_checkins WHERE member_id IN ('me', 'ha', 'an', 'huy', 'lan');
DELETE FROM biometric_records WHERE member_id IN ('me', 'ha', 'an', 'huy', 'lan');
DELETE FROM clinical_reports WHERE member_id IN ('me', 'ha', 'an', 'huy', 'lan');
DELETE FROM emergency_cards WHERE member_id IN ('me', 'ha', 'an', 'huy', 'lan');
DELETE FROM emergency_contacts WHERE member_id IN ('me', 'ha', 'an', 'huy', 'lan');
DELETE FROM prescriptions WHERE member_id IN ('me', 'ha', 'an', 'huy', 'lan');
DELETE FROM care_tasks WHERE member_id IN ('me', 'ha', 'an', 'huy', 'lan');
DELETE FROM appointments WHERE member_id IN ('me', 'ha', 'an', 'huy', 'lan');
DELETE FROM share_grants WHERE member_id IN ('me', 'ha', 'an', 'huy', 'lan');
DELETE FROM patient_chronic_conditions WHERE member_id IN ('me', 'ha', 'an', 'huy', 'lan');
DELETE FROM vaccination_records WHERE member_id IN ('me', 'ha', 'an', 'huy', 'lan');
DELETE FROM ai_conversations WHERE member_id IN ('me', 'ha', 'an', 'huy', 'lan');
DELETE FROM connected_devices WHERE user_id = '11111111-1111-1111-1111-111111111111';
DELETE FROM family_members WHERE user_id = '11111111-1111-1111-1111-111111111111';
DELETE FROM users WHERE id = '11111111-1111-1111-1111-111111111111' OR phone_number = '0909123456';
