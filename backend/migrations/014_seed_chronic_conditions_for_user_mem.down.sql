-- Migration 014 Down: Xoá seed bệnh mạn tính mem_145deb71
DELETE FROM care_tasks WHERE member_id = 'mem_145deb71';
DELETE FROM patient_chronic_conditions WHERE member_id = 'mem_145deb71';
