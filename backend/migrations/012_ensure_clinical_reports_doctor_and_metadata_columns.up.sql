-- Migration 012 (UP): Bổ sung và đồng bộ các cột bác sĩ chỉ định và siêu dữ liệu cho clinical_reports (SCR-05, SCR-06, SCR-07, SCR-12)
-- Đảm bảo triệt để mô hình Expand-and-Contract & Zero-Downtime Migration.

ALTER TABLE clinical_reports
    ADD COLUMN IF NOT EXISTS performed_at DATE DEFAULT CURRENT_DATE,
    ADD COLUMN IF NOT EXISTS facility_id VARCHAR(50),
    ADD COLUMN IF NOT EXISTS facility_name VARCHAR(150),
    ADD COLUMN IF NOT EXISTS ordering_doctor_id VARCHAR(50),
    ADD COLUMN IF NOT EXISTS ordering_doctor_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS ordering_doctor VARCHAR(100),
    ADD COLUMN IF NOT EXISTS interpreting_doctor_id VARCHAR(50),
    ADD COLUMN IF NOT EXISTS interpreting_doctor_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS interpreting_doctor VARCHAR(100),
    ADD COLUMN IF NOT EXISTS technique_description TEXT,
    ADD COLUMN IF NOT EXISTS clinical_findings TEXT,
    ADD COLUMN IF NOT EXISTS conclusion TEXT,
    ADD COLUMN IF NOT EXISTS summary TEXT,
    ADD COLUMN IF NOT EXISTS recommendations TEXT,
    ADD COLUMN IF NOT EXISTS accession_number VARCHAR(50),
    ADD COLUMN IF NOT EXISTS specimen_type VARCHAR(100),
    ADD COLUMN IF NOT EXISTS specimen_site VARCHAR(100),
    ADD COLUMN IF NOT EXISTS histological_grade VARCHAR(20),
    ADD COLUMN IF NOT EXISTS ptnm_staging VARCHAR(50),
    ADD COLUMN IF NOT EXISTS surgical_margin VARCHAR(30),
    ADD COLUMN IF NOT EXISTS ihc_markers JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS attachment_s3_key TEXT,
    ADD COLUMN IF NOT EXISTS s3_bucket VARCHAR(50) DEFAULT 'dhealth-reports',
    ADD COLUMN IF NOT EXISTS file_sha256 VARCHAR(64);

-- Đồng bộ dữ liệu 2 chiều cho các trường tương đương
UPDATE clinical_reports SET ordering_doctor_name = ordering_doctor WHERE ordering_doctor_name IS NULL AND ordering_doctor IS NOT NULL;
UPDATE clinical_reports SET ordering_doctor = ordering_doctor_name WHERE ordering_doctor IS NULL AND ordering_doctor_name IS NOT NULL;
UPDATE clinical_reports SET interpreting_doctor_name = interpreting_doctor WHERE interpreting_doctor_name IS NULL AND interpreting_doctor IS NOT NULL;
UPDATE clinical_reports SET interpreting_doctor = interpreting_doctor_name WHERE interpreting_doctor IS NULL AND interpreting_doctor_name IS NOT NULL;
UPDATE clinical_reports SET conclusion = summary WHERE conclusion IS NULL AND summary IS NOT NULL;
UPDATE clinical_reports SET summary = conclusion WHERE summary IS NULL AND conclusion IS NOT NULL;

