import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CalendarDayItem {
  readonly day: number;
  readonly status: 'full' | 'missed' | 'skipped' | 'scheduled' | 'today' | 'partial' | 'empty';
}

interface MedMonthCalendarProps {
  days: CalendarDayItem[];
  month?: number;
  year?: number;
  selectedDay?: number;
  onSelectDay?: (day: number) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
}

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export const MedMonthCalendar: React.FC<MedMonthCalendarProps> = ({
  days,
  month,
  year,
  selectedDay,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
}) => {
  const now = new Date();
  const currentMonth = month ?? (now.getMonth() + 1);
  const currentYear = year ?? now.getFullYear();
  const activeDay = selectedDay ?? now.getDate();

  // Tính số ô trống trước ngày 1 của tháng: T2=0, T3=1, ..., CN=6
  const prefixBlanks = (new Date(currentYear, currentMonth - 1, 1).getDay() + 6) % 7;

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
          onClick={onPrevMonth}
          aria-label="Tháng trước"
          className="w-8 h-8 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-black text-slate-900 tracking-tight">
          Tháng {currentMonth}/{currentYear}
        </span>
        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Tháng sau"
          className="w-8 h-8 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95 cursor-pointer"
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
          const isSelected = item.day === activeDay;
          return (
            <button
              key={`day-${item.day}`}
              type="button"
              onClick={() => onSelectDay?.(item.day)}
              className={`h-10 rounded-2xl flex flex-col items-center justify-center text-xs font-bold transition-all relative cursor-pointer ${
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
