import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CalendarDayItem {
  readonly day: number;
  readonly status: 'full' | 'missed' | 'skipped' | 'scheduled' | 'today' | 'partial' | 'empty';
}

interface MedMonthCalendarProps {
  days: CalendarDayItem[];
  selectedDay?: number;
  onSelectDay?: (day: number) => void;
}

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export const MedMonthCalendar: React.FC<MedMonthCalendarProps> = ({
  days,
  selectedDay = 26,
  onSelectDay,
}) => {
  // Tháng 10/2026: ngày 1/10/2026 là Thứ 5 (T5) -> 3 ô trống đầu tiên (T2, T3, T4)
  const prefixBlanks = 3;

  const renderDot = (status: string) => {
    switch (status) {
      case 'today':
        return <span className="w-1.5 h-1.5 rounded-full bg-white mt-0.5 inline-block" />;
      case 'full':
        return <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5 inline-block" />;
      case 'partial':
        return <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5 inline-block" />;
      case 'missed':
        return <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5 inline-block" />;
      case 'skipped':
        return <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-0.5 inline-block" />;
      case 'empty':
        return null;
      case 'scheduled':
      default:
        return <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-0.5 inline-block" />;
    }
  };

  return (
    <div className="bg-white rounded-[28px] p-4.5 shadow-xs border border-slate-100 flex flex-col gap-3">
      {/* Month Navigator */}
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          aria-label="Tháng trước"
          className="w-8 h-8 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-black text-slate-900 tracking-tight">Tháng 10/2026</span>
        <button
          type="button"
          aria-label="Tháng sau"
          className="w-8 h-8 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((wd) => (
          <span key={wd} className="text-[11px] font-bold text-slate-400 py-0.5">
            {wd}
          </span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: prefixBlanks }).map((_, i) => (
          <div key={`blank-${i}`} className="h-10" />
        ))}
        {days.map((item) => {
          const isSelected = item.day === selectedDay;
          return (
            <button
              key={`day-${item.day}`}
              type="button"
              onClick={() => onSelectDay?.(item.day)}
              className={`h-10 rounded-2xl flex flex-col items-center justify-center text-xs font-bold transition-all relative ${
                isSelected
                  ? 'bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] text-white shadow-xs font-black'
                  : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>{item.day}</span>
              {renderDot(item.status)}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 pt-1 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Đủ liều
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Quên
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500" /> Bỏ liều
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-300" /> Đã lên lịch
        </span>
      </div>
    </div>
  );
};
