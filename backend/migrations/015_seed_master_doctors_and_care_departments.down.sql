-- Migration 015: Down Migration
DELETE FROM appointments WHERE id = 'app_mem_cardio_01';
DELETE FROM share_grants WHERE id IN ('sg_mem_01', 'sg_mem_02', 'sg_mem_03');
DELETE FROM master_departments WHERE id = 'y_hoc_gia_dinh';

