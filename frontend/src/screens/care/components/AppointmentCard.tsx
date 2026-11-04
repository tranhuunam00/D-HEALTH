import React from 'react';

interface AppointmentCardProps {
  month: string;
  date: string;
  title: string;
  timeDoctor: string;
  onClick?: () => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  month,
  date,
  title,
  timeDoctor,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-r from-[#0E7490] via-[#0284C7] to-[#2563EB] text-white rounded-[24px] p-4 flex items-center gap-3.5 shadow-md cursor-pointer active:scale-[0.99] transition-all"
    >
      <div className="w-14 h-14 rounded-2xl bg-white text-slate-900 flex flex-col items-center justify-center shrink-0 shadow-xs">
        <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-500 leading-none">
          {month}
        </span>
        <span className="text-2xl font-black text-slate-900 leading-none mt-1">
          {date}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-black uppercase tracking-wider text-white/80 block leading-tight">
          LỊCH HẸN SẮP TỚI
        </span>
        <h3 className="text-base font-extrabold text-white leading-tight mt-0.5 truncate">
          {title}
        </h3>
        <p className="text-xs text-white/90 font-medium mt-0.5 truncate">
          {timeDoctor}
        </p>
      </div>
    </div>
  );
};
