import React from 'react';
import { Bell } from 'lucide-react';

export interface HomeHeaderProps {
  fullName: string;
  avatarUrl?: string;
  onOpenProfile?: () => void;
  onOpenEmergency: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  fullName,
  avatarUrl,
  onOpenProfile,
  onOpenEmergency,
}) => {
  const initial = (fullName || 'N').charAt(0);
  const formattedToday = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="flex flex-col gap-3">
      {/* Top row: Avatar, Xin chào, SOS, Bell */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenProfile}
          className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] text-white flex items-center justify-center font-black text-base shadow-sm hover:opacity-90 active:scale-95 transition-all shrink-0 overflow-hidden border border-slate-200"
          aria-label="Xem thông tin cá nhân"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            initial
          )}
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
          onClick={() => alert('Thông báo hệ thống: Chưa có thông báo mới.')}
          className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95 transition-all shrink-0"
          aria-label="Thông báo"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>

      {/* Date Pill + Status */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className="text-slate-500 font-semibold">{formattedToday}</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-600 font-medium text-[11px]">D-Health Đồng bộ Live</span>
        </div>
      </div>
    </div>
  );
};
