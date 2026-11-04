-- Migration 008 Down: Hoàn tác seed lịch hẹn và quyền chia sẻ dữ liệu SCR-14

DELETE FROM share_grants WHERE id IN ('sg_01', 'sg_02', 'sg_03');
DELETE FROM appointments WHERE id = 'app_nam_cardio_01';
DELETE FROM master_doctors WHERE id = 'bs_tran_van_b';
