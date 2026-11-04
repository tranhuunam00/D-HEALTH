import React from 'react';

interface MedAdherenceCardProps {
  adherencePercent: number;
  takenCount: number;
  missedCount: number;
  skippedCount: number;
  todayTaken: number;
  todayTotal: number;
}

export const MedAdherenceCard: React.FC<MedAdherenceCardProps> = ({
  adherencePercent,
  takenCount,
  missedCount,
  skippedCount,
  todayTaken,
  todayTotal,
}) => {
  return (
    <div className="bg-gradient-to-r from-[#0284C7] to-[#2563EB] text-white rounded-[24px] p-4.5 flex items-center justify-between shadow-md">
      <div>
        <span className="text-[10px] font-black uppercase tracking-wider text-white/80 block">
          TUÂN THỦ 30 NGÀY
        </span>
        <div className="text-4xl font-black text-white leading-tight mt-0.5">
          {adherencePercent}%
        </div>
        <div className="text-xs text-white/95 font-medium mt-0.5">
          Đã uống {takenCount} · Quên {missedCount} · Bỏ {skippedCount} liều
        </div>
      </div>

      <div className="text-right">
        <span className="text-[10px] font-black uppercase tracking-wider text-white/80 block">
          HÔM NAY
        </span>
        <div className="text-2xl font-black text-white leading-tight mt-0.5">
          {todayTaken}/{todayTotal} liều
        </div>
      </div>
    </div>
  );
};
