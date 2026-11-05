-- Migration 017: Rollback đồng bộ hóa danh mục Chuyên khoa Y tế (Master Departments)
-- Down Migration

DELETE FROM share_grants WHERE id IN ('sg_mem_04', 'sg_mem_05');
DELETE FROM master_departments WHERE id IN ('ho_hap', 'tieu_hoa', 'than_kinh', 'co_xuong_khop');
ALTER TABLE master_departments DROP COLUMN IF EXISTS short_name;
ALTER TABLE master_departments DROP COLUMN IF EXISTS color;
