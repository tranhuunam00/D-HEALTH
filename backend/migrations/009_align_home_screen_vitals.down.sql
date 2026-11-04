-- Rollback migration 009
DELETE FROM biometric_records 
WHERE member_id = 'nam' 
  AND measured_at >= '2026-10-26 07:15:00+07' 
  AND measured_at <= '2026-10-26 07:30:00+07';
