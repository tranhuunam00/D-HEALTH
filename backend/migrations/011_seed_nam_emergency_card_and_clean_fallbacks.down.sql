-- Rollback Migration 011

DELETE FROM emergency_contacts WHERE member_id = 'nam';
DELETE FROM emergency_cards WHERE member_id = 'nam';
DELETE FROM family_members WHERE id IN ('mai', 'duc_anh', 'hoa');
