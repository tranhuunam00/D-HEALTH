import { useState, useEffect, useCallback } from 'react';

export interface MetricItem {
  readonly name: string;
  readonly status?: string;
  readonly type: 'good' | 'warning' | 'danger';
  readonly icon?: 'circle' | 'triangle';
}

export interface ChronicConditionItem {
  readonly id: string;
  readonly condition_name: string;
  readonly status_summary: string;
  readonly next_checkup_date?: string;
  readonly target_metrics: readonly MetricItem[];
}

export interface CareTaskItem {
  readonly id: string;
  readonly title: string;
  readonly is_completed: boolean;
}

export function useChronicLogic(memberId = 'nam') {
  const [conditions, setConditions] = useState<readonly ChronicConditionItem[]>([]);
  const [tasks, setTasks] = useState<readonly CareTaskItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchChronicData = useCallback(async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const res = await fetch(`/api/chronic-conditions/${memberId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          setConditions(json.data.conditions || []);
          setTasks(json.data.tasks || []);
          return;
        }
      }
      setConditions([]);
      setTasks([]);
    } catch {
      setConditions([]);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    fetchChronicData();
  }, [fetchChronicData]);

  const toggleTask = useCallback(
    async (taskId: string) => {
      let nextState = false;
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            nextState = !t.is_completed;
            return { ...t, is_completed: nextState };
          }
          return t;
        })
      );

      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
        await fetch(`/api/chronic-conditions/tasks/${taskId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ isCompleted: nextState }),
        });
      } catch (err) {
        console.error('Lỗi cập nhật việc cần làm:', err);
      }
    },
    []
  );

  return {
    conditions,
    tasks,
    loading,
    refetch: fetchChronicData,
    toggleTask,
  };
}
