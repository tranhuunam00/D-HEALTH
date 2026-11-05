import { useState, useEffect, useCallback } from 'react';
import type { ChronicConditionPayload } from './components/AddChronicConditionSheet';

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
  readonly risk_level?: string;
  readonly trend_status?: string;
  readonly next_checkup_date?: string;
  readonly target_metrics: readonly MetricItem[];
}

export interface CareTaskItem {
  readonly id: string;
  readonly title: string;
  readonly is_completed: boolean;
}

export function useChronicLogic(memberId = 'mem_145deb71') {
  const [conditions, setConditions] = useState<readonly ChronicConditionItem[]>([]);
  const [tasks, setTasks] = useState<readonly CareTaskItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddConditionOpen, setIsAddConditionOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState<(ChronicConditionPayload & { id?: string }) | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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

  const handleOpenAddCondition = () => {
    setEditingCondition(null);
    setIsAddConditionOpen(true);
  };

  const handleOpenEditCondition = (item: ChronicConditionItem) => {
    setEditingCondition({
      id: item.id,
      conditionName: item.condition_name,
      statusSummary: item.status_summary,
      nextCheckupDate: item.next_checkup_date || '',
      targetMetrics: item.target_metrics ? [...item.target_metrics] : [],
    });
    setIsAddConditionOpen(true);
  };

  const handleSaveCondition = async (payload: ChronicConditionPayload, id?: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      let res: Response;
      if (id) {
        res = await fetch(`/api/chronic-conditions/${memberId}/conditions/${id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/chronic-conditions/${memberId}/conditions`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setIsAddConditionOpen(false);
        setEditingCondition(null);
        setSuccessMsg(
          id
            ? `Đã cập nhật bệnh ${payload.conditionName} thành công!`
            : `Đã thêm bệnh ${payload.conditionName} vào hồ sơ!`
        );
        setTimeout(() => setSuccessMsg(null), 3500);
        await fetchChronicData();
      }
    } catch (err) {
      console.error('Lỗi lưu bệnh mạn tính:', err);
    }
  };

  const handleDeleteCondition = async (conditionId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá bệnh mạn tính này khỏi hồ sơ theo dõi?')) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const res = await fetch(`/api/chronic-conditions/${memberId}/conditions/${conditionId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setSuccessMsg('Đã xoá bệnh mạn tính thành công!');
        setTimeout(() => setSuccessMsg(null), 3500);
        await fetchChronicData();
      }
    } catch (err) {
      console.error('Lỗi xoá bệnh mạn tính:', err);
    }
  };

  const handleAddTask = async (title: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const res = await fetch(`/api/chronic-conditions/${memberId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ title }),
      });
      if (res.ok) {
        setIsAddTaskOpen(false);
        setSuccessMsg('Đã thêm việc cần làm thành công!');
        setTimeout(() => setSuccessMsg(null), 3500);
        await fetchChronicData();
      }
    } catch (err) {
      console.error('Lỗi thêm việc:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      await fetch(`/api/chronic-conditions/tasks/${taskId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error('Lỗi xoá việc:', err);
    }
  };

  return {
    conditions,
    tasks,
    loading,
    isAddConditionOpen,
    setIsAddConditionOpen,
    editingCondition,
    isAddTaskOpen,
    setIsAddTaskOpen,
    successMsg,
    refetch: fetchChronicData,
    toggleTask,
    handleOpenAddCondition,
    handleOpenEditCondition,
    handleSaveCondition,
    handleDeleteCondition,
    handleAddTask,
    handleDeleteTask,
  };
}
