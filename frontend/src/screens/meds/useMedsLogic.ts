import { useState, useEffect, useCallback } from 'react';

export interface DoseItem {
  readonly id: string;
  readonly time: string;
  readonly period: string;
  readonly name: string;
  readonly instruction: string;
  readonly status: 'taken' | 'pending' | 'skipped';
  readonly taken: boolean;
}

export interface AdherenceData {
  readonly adherencePercent: number;
  readonly takenCount: number;
  readonly missedCount: number;
  readonly skippedCount: number;
  readonly todayTaken: number;
  readonly todayTotal: number;
  readonly calendarDays: Array<{
    readonly day: number;
    readonly status: 'full' | 'missed' | 'skipped' | 'scheduled' | 'today';
  }>;
}

const DEFAULT_CALENDAR_DAYS = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  const missed = [3, 9, 14, 22].includes(day);
  const skipped = [6, 11, 19].includes(day);
  let status: 'full' | 'missed' | 'skipped' | 'scheduled' | 'today' = 'full';
  if (day === 26) status = 'today';
  else if (day > 26) status = 'scheduled';
  else if (missed) status = 'missed';
  else if (skipped) status = 'skipped';
  return { day, status };
});

const DEFAULT_ADHERENCE: AdherenceData = {
  adherencePercent: 91,
  takenCount: 109,
  missedCount: 7,
  skippedCount: 4,
  todayTaken: 2,
  todayTotal: 4,
  calendarDays: DEFAULT_CALENDAR_DAYS,
};

const DEFAULT_DOSES: DoseItem[] = [
  {
    id: '66666666-0000-0000-0000-000000000001',
    time: '07:00',
    period: 'Sáng',
    name: 'Losartan 50 mg',
    instruction: '1 viên · sau ăn sáng',
    status: 'taken',
    taken: true,
  },
  {
    id: '66666666-0000-0000-0000-000000000002',
    time: '07:00',
    period: 'Sáng',
    name: 'Metformin 500 mg',
    instruction: '1 viên · sau ăn sáng',
    status: 'taken',
    taken: true,
  },
  {
    id: '66666666-0000-0000-0000-000000000003',
    time: '20:00',
    period: 'Tối',
    name: 'Metformin 500 mg',
    instruction: '1 viên · sau ăn tối',
    status: 'pending',
    taken: false,
  },
  {
    id: '66666666-0000-0000-0000-000000000004',
    time: '21:00',
    period: 'Tối',
    name: 'Atorvastatin 20 mg',
    instruction: '1 viên · trước khi ngủ',
    status: 'pending',
    taken: false,
  },
];

export function useMedsLogic(memberId = 'nam') {
  const [activeTab, setActiveTab] = useState<'schedule' | 'active' | 'history'>('schedule');
  const [doses, setDoses] = useState<DoseItem[]>(DEFAULT_DOSES);
  const [adherence, setAdherence] = useState<AdherenceData>(DEFAULT_ADHERENCE);
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
        if (Array.isArray(dJson?.data) && dJson.data.length > 0) {
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
      setSuccessMsg('Đã ghi nhận bỏ liều thuốc.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {}
  };

  const handleSnoozeDose = async (doseId: string) => {
    try {
      await fetch(`/api/prescriptions/doses/${doseId}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'snoozed' }),
      });
      setSuccessMsg('Đã đặt nhắc lại sau 15 phút.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {}
  };

  const handleAddMedication = async (payload: {
    medicationName: string;
    dosage: string;
    timingInstructions: string;
    scheduledTime: string;
  }) => {
    try {
      const res = await fetch(`/api/prescriptions/${memberId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsAddOpen(false);
        setSuccessMsg(`Đã thêm thuốc ${payload.medicationName} vào lịch nhắc.`);
        setTimeout(() => setSuccessMsg(null), 3000);
        await fetchMedsData();
      }
    } catch {}
  };

  const handleSendHistory = async () => {
    try {
      const res = await fetch(`/api/prescriptions/${memberId}/send-history`, {
        method: 'POST',
      });
      if (res.ok) {
        setSuccessMsg('Đã gửi tiền sử dùng thuốc thành công cho Bác sĩ điều trị.');
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch {}
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
    handleSendHistory,
  };
}
