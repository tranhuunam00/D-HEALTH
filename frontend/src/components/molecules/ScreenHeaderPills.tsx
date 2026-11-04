import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface ScreenHeaderPillsProps {
  readonly activeMemberName?: string;
  readonly dateText?: string;
  readonly onSelectMember?: () => void;
  readonly className?: string;
}

export const ScreenHeaderPills: React.FC<ScreenHeaderPillsProps> = ({
  activeMemberName = 'Trần Hữu Nam',
  dateText = '26/10/2026',
  onSelectMember,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 flex-wrap shrink-0 ${className}`}>
      {/* 1. Date Pill */}
      <div className="inline-flex items-center gap-1.5 h-6.5 px-3 rounded-full bg-white text-slate-700 text-xs font-semibold shadow-2xs border border-slate-100">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        <span>Hôm nay: {dateText}</span>
      </div>

      {/* 2. Global Synchronized Health Profile Pill */}
      <button
        type="button"
        onClick={onSelectMember}
        className="inline-flex items-center gap-1.5 h-6.5 px-3 rounded-full bg-[#111827] text-white text-xs font-semibold shadow-2xs hover:bg-slate-800 active:scale-95 transition cursor-pointer"
        aria-label="Đổi hồ sơ thành viên"
      >
        <span className="w-4 h-4 rounded-full bg-indigo-900/80 text-indigo-300 text-[10px] font-bold flex items-center justify-center shrink-0">
          👤
        </span>
        <span>Hồ sơ sức khoẻ:</span>
        <span className="font-bold">{activeMemberName}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>
    </div>
  );
};
