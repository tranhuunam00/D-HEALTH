import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CalendarDayItem {
  readonly day: number;
  readonly status: 'full' | 'missed' | 'skipped' | 'scheduled' | 'today';
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
      case 'missed':
        return <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5 inline-block" />;
      case 'skipped':
        return <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-0.5 inline-block" />;
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
        <h2 className="text-sm font-extrabold text-slate-900">
          Tháng 10/2026
        </h2>
        <button
          type="button"
          aria-label="Tháng sau"
          className="w-8 h-8 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center">
        {WEEKDAYS.map((wd) => (
          <span key={wd} className="text-xs font-semibold text-slate-500">
            {wd}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-1 text-center items-center">
        {Array.from({ length: prefixBlanks }).map((_, idx) => (
          <div key={`blank-${idx}`} className="h-10" />
        ))}

        {days.map((item) => {
          const isSelected = item.day === selectedDay;
          return (
            <button
              key={item.day}
              type="button"
              onClick={() => onSelectDay?.(item.day)}
              className={`h-11 rounded-2xl flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? 'bg-[#111827] text-white font-black shadow-sm'
                  : 'text-slate-800 font-semibold hover:bg-slate-50'
              }`}
            >
              <span className="text-xs leading-none">{item.day}</span>
              {renderDot(isSelected ? 'today' : item.status)}
            </button>
          );
        })}
      </div>

      {/* Bottom Legend */}
      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-50 px-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Đủ liều
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Quên
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          Bỏ liều
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-300" />
          Đã lên lịch
        </span>
      </div>
    </div>
  );
};
