-- Migration 014: Seed bệnh mạn tính cho tài khoản người dùng hiện tại (mem_145deb71)
INSERT INTO patient_chronic_conditions 
  (id, member_id, condition_id, condition_name, icd10_code, risk_level, trend_status, status_summary, next_checkup_date, action_items, target_metrics)
VALUES
  (
    'pcc_tim_mach_mem_145deb71',
    'mem_145deb71',
    'tim_mach',
    'Tim mạch',
    'I10',
    'medium',
    'stable',
    'Nguy cơ trung bình · xu hướng ổn định',
    '2026-11-12',
    '[
      {"id": "task_1", "text": "Theo dõi huyết áp sáng và tối", "done": false},
      {"id": "task_2", "text": "Xét nghiệm lipid máu trước tái khám", "done": false}
    ]'::jsonb,
    '[
      {"name": "Huyết áp", "status": "Theo dõi", "type": "warning"},
      {"name": "LDL-C", "status": "Theo dõi", "type": "warning"},
      {"name": "HbA1c", "status": "Tốt", "type": "good"},
      {"name": "Nhịp tim", "status": "Tốt", "type": "good"},
      {"name": "Cân nặng", "status": "Theo dõi", "type": "warning"}
    ]'::jsonb
  ),
  (
    'pcc_dai_thao_duong_mem_145deb71',
    'mem_145deb71',
    'dai_thao_duong',
    'Đái tháo đường',
    'E11',
    'medium',
    'stable',
    '1 cần khám',
    '2026-12-05',
    '[]'::jsonb,
    '[
      {"name": "HbA1c", "type": "good"},
      {"name": "Glucose", "type": "warning"},
      {"name": "Cân nặng", "type": "warning"},
      {"name": "Huyết áp", "type": "good"},
      {"name": "Thận", "type": "good"},
      {"name": "Mắt", "type": "danger", "icon": "triangle"}
    ]'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  condition_name = EXCLUDED.condition_name,
  risk_level = EXCLUDED.risk_level,
  status_summary = EXCLUDED.status_summary,
  next_checkup_date = EXCLUDED.next_checkup_date,
  action_items = EXCLUDED.action_items,
  target_metrics = EXCLUDED.target_metrics;

-- Chèn việc cần làm tiếp theo vào bảng care_tasks
INSERT INTO care_tasks (id, member_id, condition_id, title, task_type, due_date, is_completed, priority)
VALUES
  ('55555555-0001-0000-0000-000000000011', 'mem_145deb71', 'tim_mach', 'Theo dõi huyết áp sáng và tối', 'measure', '2026-11-12', false, 1),
  ('55555555-0002-0000-0000-000000000012', 'mem_145deb71', 'tim_mach', 'Xét nghiệm lipid máu trước tái khám', 'lab', '2026-11-12', false, 2)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  due_date = EXCLUDED.due_date,
  is_completed = EXCLUDED.is_completed;

