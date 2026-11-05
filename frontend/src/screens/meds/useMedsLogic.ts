import { useState, useEffect, useCallback, useMemo } from 'react';
import type { EditMedicationInitialData } from './components/AddMedicationSheet';

export interface DoseItem {
  id: string;
  prescriptionItemId?: string;
  rawName?: string;
  dosage?: string;
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

export interface ActiveMedicationItem {
  id: string;
  prescriptionId: string;
  name: string;
  dosage: string;
  dosePerIntake?: string;
  timingInstructions?: string;
  startDate?: string;
  endDate?: string;
  diagnosis?: string;
  facilityName?: string;
  doctorName?: string;
  schedules?: { scheduledTime: string; mealRelation?: string }[];
  status?: string;
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
  const now = new Date();
  const [activeTab, setActiveTab] = useState<'schedule' | 'active' | 'history'>('schedule');
  const [currentYear, setCurrentYear] = useState<number>(() => now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => now.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number>(() => now.getDate());
  const [doses, setDoses] = useState<DoseItem[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [adherence, setAdherence] = useState<AdherenceData>(EMPTY_ADHERENCE);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EditMedicationInitialData | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. Tải danh sách cữ thuốc theo ngày được chọn
  const fetchDosesForDay = useCallback(async (day: number, month = currentMonth, year = currentYear) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const res = await fetch(`/api/prescriptions/${memberId}/today-doses?date=${dateStr}`, { headers });
      if (res.ok) {
        const dJson = await res.json();
        if (Array.isArray(dJson?.data)) {
          const nowDate = new Date();
          const isFuture =
            year > nowDate.getFullYear() ||
            month > (nowDate.getMonth() + 1) ||
            (month === (nowDate.getMonth() + 1) && day > nowDate.getDate());

          const mapped: DoseItem[] = dJson.data.map((d: any) => {
            const timeStr = (d.scheduled_time || '08:00').substring(0, 5);
            const hour = parseInt(timeStr.split(':')[0], 10);
            const period = hour >= 18 ? 'Tối' : hour >= 12 ? 'Trưa' : 'Sáng';
            return {
              id: d.id,
              prescriptionItemId: d.prescription_item_id,
              rawName: d.raw_medication_name || d.name,
              dosage: d.dosage || '500 mg',
              time: timeStr,
              period,
              name: `${d.name} ${d.dosage || ''}`.trim(),
              instruction:
                d.timing_instructions ||
                `${d.dose_per_intake || '1 viên'} · ${d.meal_relation === 'after_meal' ? 'sau ăn' : 'trước ăn'}`,
              status: d.status || (isFuture ? 'scheduled' : 'pending'),
              taken: !!d.taken,
            };
          });
          setDoses(mapped);
        }
      }
    } catch (err) {
      console.error('Lỗi tải cữ thuốc theo ngày:', err);
    }
  }, [memberId, currentMonth, currentYear]);

  // 2. Tải tổng quan tuân thủ thuốc
  const fetchAdherenceSummary = useCallback(async (month = currentMonth, year = currentYear) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      const adhRes = await fetch(`/api/prescriptions/${memberId}/adherence-summary?year=${year}&month=${month}`, { headers }).catch(() => null);
      if (adhRes?.ok) {
        const aJson = await adhRes.json();
        if (aJson?.data) {
          setAdherence(aJson.data);
        }
      }
    } catch (err) {
      console.error('Lỗi tải tổng quan tuân thủ:', err);
    }
  }, [memberId, currentMonth, currentYear]);

  // 3. Tải danh sách toàn bộ đơn thuốc của thành viên
  const fetchPrescriptions = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/prescriptions/${memberId}`, { headers });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json?.data)) {
          setPrescriptions(json.data);
        }
      }
    } catch (err) {
      console.error('Lỗi tải danh sách đơn thuốc:', err);
    }
  }, [memberId]);

  const fetchMedsData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchDosesForDay(selectedDay, currentMonth, currentYear),
      fetchAdherenceSummary(currentMonth, currentYear),
      fetchPrescriptions(),
    ]);
    setLoading(false);
  }, [fetchDosesForDay, fetchAdherenceSummary, fetchPrescriptions, selectedDay, currentMonth, currentYear]);

  useEffect(() => {
    fetchMedsData();
  }, [fetchMedsData]);

  // Khi người dùng bấm chuyển ngày trên lịch tháng
  useEffect(() => {
    fetchDosesForDay(selectedDay, currentMonth, currentYear);
  }, [selectedDay, currentMonth, currentYear, fetchDosesForDay]);

  const handlePrevMonth = () => {
    let newM = currentMonth - 1;
    let newY = currentYear;
    if (newM < 1) {
      newM = 12;
      newY -= 1;
    }
    setCurrentMonth(newM);
    setCurrentYear(newY);
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    let newM = currentMonth + 1;
    let newY = currentYear;
    if (newM > 12) {
      newM = 1;
      newY += 1;
    }
    setCurrentMonth(newM);
    setCurrentYear(newY);
    setSelectedDay(1);
  };

  // Trích xuất danh sách thuốc đang hoạt động từ các đơn đang dùng
  const activeMedications = useMemo<ActiveMedicationItem[]>(() => {
    const list: ActiveMedicationItem[] = [];
    for (const rx of prescriptions) {
      if (rx.status === 'active' || !rx.status) {
        for (const item of (rx.items || [])) {
          list.push({
            id: item.id,
            prescriptionId: rx.id,
            name: item.medicationName,
            dosage: item.dosage,
            dosePerIntake: item.dosePerIntake,
            timingInstructions: item.timingInstructions,
            startDate: item.startDate,
            endDate: item.endDate,
            diagnosis: rx.diagnosis,
            facilityName: rx.facility_name,
            doctorName: rx.doctor_name,
            schedules: item.schedules,
            status: rx.status,
          });
        }
      }
    }
    return list;
  }, [prescriptions]);

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

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsAddOpen(true);
  };

  const handleOpenEditDose = (dose: DoseItem) => {
    setEditingItem({
      id: dose.prescriptionItemId,
      scheduleId: dose.id,
      medicationName: dose.rawName || dose.name.split(' ')[0],
      dosage: dose.dosage || '500 mg',
      scheduledTime: dose.time,
      timingInstructions: dose.instruction,
      durationMode: 'daily',
    });
    setIsAddOpen(true);
  };

  const handleOpenEditMed = (med: ActiveMedicationItem) => {
    const firstSched = med.schedules?.[0]?.scheduledTime?.substring(0, 5) || '08:00';
    setEditingItem({
      id: med.id,
      medicationName: med.name,
      dosage: med.dosage || '500 mg',
      scheduledTime: firstSched,
      timingInstructions: med.timingInstructions || '1 viên · sau ăn',
      durationMode: med.endDate ? 'custom' : 'daily',
      endDate: med.endDate,
    });
    setIsAddOpen(true);
  };

  const handleAddMedication = async (data: any, editId?: string) => {
    try {
      let res: Response;
      if (editId) {
        // Chỉnh sửa thuốc: tính từ lúc sửa
        res = await fetch(`/api/prescriptions/doses/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        res = await fetch(`/api/prescriptions/${memberId}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }

      if (res.ok) {
        setIsAddOpen(false);
        setEditingItem(null);
        setSuccessMsg(
          editId
            ? `Đã cập nhật thuốc ${data.medicationName} thành công (tính từ hôm nay)!`
            : `Đã thêm thuốc ${data.medicationName} vào lịch nhắc thành công!`
        );
        setTimeout(() => setSuccessMsg(null), 3500);
        await fetchMedsData();
      }
    } catch (err) {
      console.error('Lỗi lưu thuốc:', err);
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
    currentMonth,
    currentYear,
    selectedDay,
    setSelectedDay,
    handlePrevMonth,
    handleNextMonth,
    doses,
    prescriptions,
    activeMedications,
    adherence,
    loading,
    isAddOpen,
    setIsAddOpen,
    editingItem,
    handleOpenAdd,
    handleOpenEditDose,
    handleOpenEditMed,
    successMsg,
    fetchMedsData,
    handleTakeDose,
    handleSkipDose,
    handleSnoozeDose,
    handleAddMedication,
    handleSendHistory,
  };
}
