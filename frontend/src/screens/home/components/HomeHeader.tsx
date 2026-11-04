import React from 'react';
import { Bell } from 'lucide-react';

export interface HomeHeaderProps {
  fullName: string;
  onOpenProfile?: () => void;
  onOpenEmergency: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  fullName,
  onOpenProfile,
  onOpenEmergency,
}) => {
  const initial = (fullName || 'N').charAt(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Top row: Avatar, Xin chào, SOS, Bell */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenProfile}
          className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] text-white flex items-center justify-center font-black text-base shadow-sm hover:opacity-90 active:scale-95 transition-all shrink-0"
          aria-label="Xem thông tin cá nhân"
        >
          {initial}
        </button>
        <div
          onClick={onOpenProfile}
          className="flex-1 flex flex-col cursor-pointer min-w-0"
        >
          <span className="text-xs text-slate-500 font-medium">Xin chào,</span>
          <span className="text-base font-extrabold text-slate-900 truncate">{fullName}</span>
        </div>
        <button
          type="button"
          onClick={onOpenEmergency}
          className="h-10 min-w-[44px] px-3.5 rounded-full bg-[#FEE2E2] text-[#DC2626] text-xs font-black tracking-wider shadow-2xs active:scale-95 transition-all shrink-0 flex items-center justify-center"
          aria-label="Thẻ cấp cứu SOS"
        >
          SOS
        </button>
        <button
          type="button"
          onClick={() => alert('Chưa có thông báo khẩn cấp mới.')}
          className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-white text-slate-700 flex items-center justify-center shadow-2xs border border-slate-100 shrink-0 hover:bg-slate-50 transition"
          aria-label="Thông báo"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>

      {/* Greeting Title & Date Pill */}
      <div className="flex flex-col gap-1 pt-1">
        <h1 className="text-2xl font-black text-slate-900 leading-tight">Hôm nay bạn thế nào?</h1>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/70 text-slate-700 text-xs font-semibold shadow-2xs w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Hôm nay: 26/10/2026
        </span>
      </div>
    </div>
  );
};
