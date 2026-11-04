import React, { useState } from 'react';
import { Calendar, CheckSquare, Square, HeartPulse, ChevronRight, Activity } from 'lucide-react';
import { HealthCategoryTabs, HealthTabId } from '../../components/molecules/HealthCategoryTabs';
import { HomeBottomNav } from '../home/HomeBottomNav';

interface SCR09Props {
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberName?: string;
}

interface ChecklistItem {
  readonly id: string;
  readonly text: string;
  readonly done: boolean;
}

export const SCR09_ChronicScreen: React.FC<SCR09Props> = ({
  onNavigate,
  activeMemberName = 'Trần Hữu Nam',
}) => {
  const [tasks, setTasks] = useState<readonly ChecklistItem[]>([
    { id: '1', text: 'Đo huyết áp 2 lần/ngày (sáng và tối)', done: true },
    { id: '2', text: 'Uống thuốc Amlodipine 5mg sau ăn sáng', done: true },
    { id: '3', text: 'Xét nghiệm HbA1c và lipid máu trước tái khám', done: false },
    { id: '4', text: 'Đi bộ tối thiểu 30 phút mỗi ngày', done: false },
  ]);

  const handleSelectHealthTab = (tab: HealthTabId) => {
    if (tab === 'biometrics') onNavigate('biometrics');
    else if (tab === 'labs') onNavigate('labs');
    else if (tab === 'imaging') onNavigate('imaging');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div className="w-[390px] h-[844px] relative overflow-hidden bg-[#EEF2F6] text-[#111827] flex flex-col font-sans select-none">
      <div className="flex-1 overflow-y-auto px-4 pt-12 pb-24 flex flex-col gap-3.5">
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

        {/* 2. Tiêu đề */}
        <span className="text-[28px] font-extrabold tracking-tight">Sức khoẻ</span>

        {/* 3. Category Tabs */}
        <HealthCategoryTabs activeTab="chronic" onSelectTab={handleSelectHealthTab} />

        {/* 4. Disease Cockpit Card 1: Tăng huyết áp */}
        <div className="bg-white rounded-3xl p-4 flex flex-col gap-3 shadow-xs border border-slate-200/60">
          <div className="flex justify-between items-start gap-2">
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                Tăng huyết áp vô căn (nguyên phát)
              </div>
              <span className="text-xs text-slate-400 font-mono">ICD-10: I10 · Bác sĩ theo dõi: TS.BS Nguyễn Văn An</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
              Ổn định
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">MỤC TIÊU ĐIỀU TRỊ</span>
              <span className="font-extrabold text-slate-900">&lt; 130/80 mmHg</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 font-semibold block">TRUNG BÌNH 7 NGÀY</span>
              <span className="font-extrabold text-emerald-700">128/82 mmHg</span>
            </div>
          </div>

          {/* Checklist việc cần làm tiếp theo */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-900">Việc cần làm tiếp theo</span>
            <div className="space-y-1.5 text-xs">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition"
                >
                  {task.done ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className={`text-xs ${task.done ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('care')}
            className="h-10 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>Đặt lịch tái khám định kỳ (15/11)</span>
          </button>
        </div>

        {/* 5. Disease Cockpit Card 2: Đái tháo đường */}
        <div className="bg-white rounded-3xl p-4 flex flex-col gap-2 shadow-xs border border-slate-200/60">
          <div className="flex justify-between items-start gap-2">
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-amber-500" />
                Đái tháo đường type 2
              </div>
              <span className="text-xs text-slate-400 font-mono">ICD-10: E11 · Mục tiêu: HbA1c &lt; 7.0%</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
              Cần theo dõi
            </span>
          </div>
        </div>
      </div>

      {/* 6. Bottom Navigation */}
      <HomeBottomNav
        activeTab="health"
        onTabChange={(tab) => onNavigate(tab)}
      />
    </div>
  );
};
