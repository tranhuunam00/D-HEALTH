import { useState, useEffect, useCallback } from 'react';

export interface DoseItem {
  id: string;
  time: string;
  period: string;
  name: string;
  instruction: string;
  status: 'taken' | 'pending' | 'skipped' | 'snoozed' | 'scheduled';
  taken: boolean;
}

export interface AdherenceDay {
  day: number;
  status: 'full' | 'partial' | 'missed' | 'empty' | 'skipped' | 'scheduled' | 'today';
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
  const [selectedDay, setSelectedDay] = useState<number>(26);
  const [doses, setDoses] = useState<DoseItem[]>([]);
  const [adherence, setAdherence] = useState<AdherenceData>(EMPTY_ADHERENCE);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. Tải danh sách cữ thuốc theo ngày được chọn trong tháng 10/2026
  const fetchDosesForDay = useCallback(async (day: number) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      const dateStr = `2026-10-${String(day).padStart(2, '0')}`;
      const res = await fetch(`/api/prescriptions/${memberId}/today-doses?date=${dateStr}`, { headers });
      if (res.ok) {
        const dJson = await res.json();
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
              status: d.status || (day > 26 ? 'scheduled' : 'pending'),
              taken: !!d.taken,
            };
          });
          setDoses(mapped);
        }
      }
    } catch (err) {
      console.error('Lỗi tải cữ thuốc theo ngày:', err);
    }
  }, [memberId]);

  // 2. Tải tổng quan tuân thủ thuốc
  const fetchAdherenceSummary = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      const adhRes = await fetch(`/api/prescriptions/${memberId}/adherence-summary`, { headers }).catch(() => null);
      if (adhRes?.ok) {
        const aJson = await adhRes.json();
        if (aJson?.data) {
          setAdherence(aJson.data);
        }
      }
    } catch (err) {
      console.error('Lỗi tải tổng quan tuân thủ:', err);
    }
  }, [memberId]);

  const fetchMedsData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchDosesForDay(selectedDay), fetchAdherenceSummary()]);
    setLoading(false);
  }, [fetchDosesForDay, fetchAdherenceSummary, selectedDay]);

  useEffect(() => {
    fetchMedsData();
  }, [fetchMedsData]);

  // Khi người dùng bấm chuyển ngày trên lịch tháng
  useEffect(() => {
    fetchDosesForDay(selectedDay);
  }, [selectedDay, fetchDosesForDay]);

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
      setTimeout(() => setSuccessMsg(null), 3500);
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
        setSuccessMsg('Đã thêm thuốc vào lịch nhắc thành công!');
        setTimeout(() => setSuccessMsg(null), 3500);
        await fetchMedsData();
      }
    } catch (err) {
      console.error('Lỗi thêm thuốc:', err);
    }
  };

  const handleSendHistory = async () => {
    try {
      const res = await fetch(`/api/prescriptions/${memberId}/send-history`, {
        method: 'POST',
      });
      if (res.ok) {
        alert('Đã gửi tiền sử dùng thuốc thành công cho Bác sĩ điều trị!');
      }
    } catch (err) {
      console.error('Lỗi gửi tiền sử:', err);
    }
  };

  return {
    activeTab,
    setActiveTab,
    selectedDay,
    setSelectedDay,
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
    handleSendHistory,
  };
}
