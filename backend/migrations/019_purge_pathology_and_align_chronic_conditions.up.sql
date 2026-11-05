-- 019_purge_pathology_and_align_chronic_conditions.up.sql
-- Purge test and obsolete pathology records from clinical_reports table
DELETE FROM clinical_reports 
WHERE kind = 'pathology' 
   OR category = 'GPB' 
   OR title ILIKE '%Giải phẫu bệnh%' 
   OR id = 'rep_1793860748624_54mcq';
