import React, { useState, useEffect } from 'react';
import { ArrowLeft, Pill, Check, Clock, Plus, AlertCircle, FileText } from 'lucide-react';
import { HomeBottomNav } from '../home/HomeBottomNav';

interface SCR11Props {
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberName?: string;
  readonly activeMemberId?: string;
}

interface DoseItem {
  readonly id: string;
  readonly name: string;
  readonly dosage: string;
  readonly scheduledTime: string;
  readonly instruction: string;
  readonly taken: boolean;
}

const INITIAL_DOSES: readonly DoseItem[] = Object.freeze([
  {
    id: 'd1',
    name: 'Amlodipine 5mg',
    dosage: '1 viên',
    scheduledTime: '08:00 (Sáng)',
    instruction: 'Uống sau ăn sáng',
    taken: true,
  },
  {
    id: 'd2',
    name: 'Metformin 500mg',
    dosage: '1 viên',
    scheduledTime: '13:00 (Trưa)',
    instruction: 'Uống ngay sau ăn trưa',
    taken: false,
  },
  {
    id: 'd3',
    name: 'Atorvastatin 20mg',
    dosage: '1 viên',
    scheduledTime: '20:00 (Tối)',
    instruction: 'Uống trước khi đi ngủ',
    taken: false,
  },
]);

export const SCR11_MedsScreen: React.FC<SCR11Props> = ({
  onNavigate,
  activeMemberName = 'Trần Hữu Nam',
  activeMemberId = 'nam',
}) => {
  const [doses, setDoses] = useState<readonly DoseItem[]>(INITIAL_DOSES);

  useEffect(() => {
    let isMounted = true;
    const fetchDoses = async () => {
      try {
        const res = await fetch(`/api/prescriptions/${activeMemberId}/today-doses`);
        if (!res.ok) return;
        const json = await res.json();
        if (Array.isArray(json?.data) && json.data.length > 0 && isMounted) {
          const mapped: DoseItem[] = json.data.map((d: any) => ({
            id: d.id,
            name: `${d.name} ${d.dosage}`,
            dosage: d.dose_per_intake || '1 viên',
            scheduledTime: `${(d.scheduled_time || '08:00').substring(0, 5)} (${d.meal_relation === 'after_meal' ? 'Sau ăn' : 'Trước ăn'})`,
            instruction: d.meal_relation === 'after_meal' ? 'Uống sau bữa ăn' : 'Uống trước bữa ăn',
            taken: !!d.taken,
          }));
          setDoses(mapped);
        }
      } catch {
        // Fallback
      }
    };
    fetchDoses();
    return () => { isMounted = false; };
  }, [activeMemberId]);

  const toggleTake = async (id: string) => {
    const target = doses.find((d) => d.id === id);
    const newTaken = !target?.taken;
    setDoses((prev) =>
      prev.map((d) => (d.id === id ? { ...d, taken: newTaken } : d))
    );
    try {
      await fetch(`/api/prescriptions/doses/${id}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newTaken ? 'taken' : 'pending' }),
      });
    } catch {}
  };

  return (
    <div className="w-full min-h-screen relative bg-[#EEF2F6] text-[#111827] flex flex-col font-sans select-none pb-20">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 flex flex-col gap-3.5">
        {/* 1. Header Pills */}
        <div className="flex gap-1.5 items-center flex-wrap shrink-0">
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-white text-slate-700 text-xs font-semibold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Hôm nay: 26/10/2026
          </span>
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-[#111827] text-white text-xs font-semibold shadow-xs">
            Hồ sơ: <b>{activeMemberName}</b>
          </span>
        </div>

        {/* 2. Topbar với nút Back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            aria-label="Quay lại"
            className="w-11 h-11 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-xs active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-base font-extrabold text-slate-900 leading-tight block">
              Quản lý dùng thuốc
            </span>
            <span className="text-xs text-slate-500 font-medium">Lịch uống thuốc &amp; Đơn điều trị</span>
          </div>
        </div>

        {/* 3. Tỷ lệ tuân thủ điều trị (Adherence Card) */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-sm font-extrabold block">Tuân thủ uống thuốc</span>
              <span className="text-xs text-white/90">30 ngày lăn: Đạt mục tiêu y khoa</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black">88%</span>
            <span className="text-[10px] block opacity-80">Rất tốt</span>
          </div>
        </div>

        {/* 4. Lịch uống thuốc hôm nay */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-900 px-1">Lịch uống thuốc hôm nay</span>
          <div className="space-y-2.5">
            {doses.map((dose) => (
              <div
                key={dose.id}
                className="bg-white rounded-2xl p-3.5 flex items-center justify-between shadow-xs border border-slate-200/60"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900">{dose.name}</div>
                  <div className="text-xs text-slate-500 font-medium">
                    {dose.dosage} · {dose.instruction}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-semibold">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {dose.scheduledTime}
                  </div>
                </div>

                <button
                  onClick={() => toggleTake(dose.id)}
                  className={`h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                    dose.taken
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  {dose.taken ? 'Đã uống' : 'Uống ngay'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Nút Thêm liều thuốc / Đơn thuốc */}
        <button
          onClick={() => onNavigate('camera-ocr')}
          className="h-12 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-95 transition"
        >
          <Plus className="w-4 h-4 text-[#1F7A8C]" />
          <span>Thêm liều thuốc / Quét mã đơn thuốc</span>
        </button>
      </div>

      {/* 6. Bottom Navigation */}
      <HomeBottomNav
        activeTab="records"
        onTabChange={(tab) => onNavigate(tab)}
      />
    </div>
  );
};
