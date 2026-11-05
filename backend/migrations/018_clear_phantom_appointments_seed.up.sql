-- Migration 018: Xóa dữ liệu lịch hẹn gán cứng (phantom seed appointments) để đảm bảo tính trung thực theo dữ liệu người dùng thực tế
-- Up Migration

DELETE FROM appointments WHERE id IN ('app_mem_cardio_01', 'app_cardio_01');
