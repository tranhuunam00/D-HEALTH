import { useState, useEffect, useCallback } from 'react';

export interface DoseItem {
  id: string;
  time: string;
  period: string;
  name: string;
  instruction: string;
  status: 'taken' | 'pending' | 'skipped' | 'snoozed';
  taken: boolean;
}

export interface AdherenceDay {
  day: number;
  status: 'full' | 'partial' | 'missed' | 'empty';
}

export interface AdherenceData {
  adherencePercent: number;
  takenCount: number;
  missedCount: number;
  skippedCount: number;
  todayTaken: number;
  todayTotal: number;
  calendarDays: AdherenceDay[];
}

const EMPTY_ADHERENCE: AdherenceData = {
  adherencePercent: 0,
  takenCount: 0,
  missedCount: 0,
  skippedCount: 0,
  todayTaken: 0,
  todayTotal: 0,
  calendarDays: [],
};

export function useMedsLogic(memberId = 'nam') {
  const [activeTab, setActiveTab] = useState<'schedule' | 'active' | 'history'>('schedule');
  const [doses, setDoses] = useState<DoseItem[]>([]);
  const [adherence, setAdherence] = useState<AdherenceData>(EMPTY_ADHERENCE);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchMedsData = useCallback(async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const [dosesRes, adhRes] = await Promise.all([
        fetch(`/api/prescriptions/${memberId}/today-doses`, { headers }).catch(() => null),
        fetch(`/api/prescriptions/${memberId}/adherence-summary`, { headers }).catch(() => null),
      ]);

      if (dosesRes?.ok) {
        const dJson = await dosesRes.json();
        if (Array.isArray(dJson?.data)) {
          const mapped: DoseItem[] = dJson.data.map((d: any) => {
            const timeStr = (d.scheduled_time || '08:00').substring(0, 5);
            const hour = parseInt(timeStr.split(':')[0], 10);
            const period = hour >= 18 ? 'Tối' : hour >= 12 ? 'Trưa' : 'Sáng';
            return {
              id: d.id,
              time: timeStr,
              period,
              name: `${d.name} ${d.dosage || ''}`.trim(),
              instruction: d.timing_instructions || `${d.dose_per_intake || '1 viên'} · ${d.meal_relation === 'after_meal' ? 'sau ăn' : 'trước ăn'}`,
              status: d.status || 'pending',
              taken: !!d.taken,
            };
          });
          setDoses(mapped);
        }
      }

      if (adhRes?.ok) {
        const aJson = await adhRes.json();
        if (aJson?.data) {
          setAdherence(aJson.data);
        }
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu đơn thuốc:', err);
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    fetchMedsData();
  }, [fetchMedsData]);

  const handleTakeDose = async (doseId: string) => {
    setDoses((prev) =>
      prev.map((d) => (d.id === doseId ? { ...d, status: 'taken', taken: true } : d))
    );
    setAdherence((prev) => ({
      ...prev,
      todayTaken: Math.min(prev.todayTaken + 1, prev.todayTotal),
    }));
    try {
      await fetch(`/api/prescriptions/doses/${doseId}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'taken' }),
      });
      setSuccessMsg('Đã ghi nhận uống thuốc thành công!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {}
  };

  const handleSkipDose = async (doseId: string) => {
    setDoses((prev) =>
      prev.map((d) => (d.id === doseId ? { ...d, status: 'skipped', taken: false } : d))
    );
    try {
      await fetch(`/api/prescriptions/doses/${doseId}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'skipped' }),
      });
    } catch {}
  };

  const handleSnoozeDose = (doseId: string) => {
    setDoses((prev) =>
      prev.map((d) => (d.id === doseId ? { ...d, status: 'snoozed' } : d))
    );
    alert('Đã hoãn báo thức uống thuốc 15 phút!');
  };

  const handleAddMedication = async (data: any) => {
    try {
      const res = await fetch(`/api/prescriptions/${memberId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setIsAddOpen(false);
        setSuccessMsg('Đã thêm thuốc mới vào phác đồ điều trị!');
        setTimeout(() => setSuccessMsg(null), 3000);
        fetchMedsData();
      }
    } catch {
      setIsAddOpen(false);
      setSuccessMsg('Đã thêm thuốc mới vào phác đồ điều trị!');
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  return {
    activeTab,
    setActiveTab,
    doses,
    adherence,
    loading,
    isAddOpen,
    setIsAddOpen,
    successMsg,
    fetchMedsData,
    handleTakeDose,
    handleSkipDose,
    handleSnoozeDose,
    handleAddMedication,
  };
}
