-- Migration 012 (DOWN): Khả nghịch an toàn
-- Trong mô hình Expand-and-Contract, các cột mở rộng có thể giữ nguyên hoặc drop an toàn khi rollback.

ALTER TABLE clinical_reports
    DROP COLUMN IF EXISTS ordering_doctor;

