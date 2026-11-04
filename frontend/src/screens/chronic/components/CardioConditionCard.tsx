import React from 'react';
import { Heart } from 'lucide-react';
import { ChronicConditionItem } from '../useChronicLogic';

interface CardioConditionCardProps {
  readonly condition?: ChronicConditionItem;
}

function formatDateDisplay(dateStr?: string): string {
  if (!dateStr) return '12/11/2026';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export const CardioConditionCard: React.FC<CardioConditionCardProps> = ({ condition }) => {
  const metrics = condition?.target_metrics || [
    { name: 'Huyết áp', status: 'Theo dõi', type: 'warning' },
    { name: 'LDL-C', status: 'Theo dõi', type: 'warning' },
    { name: 'HbA1c', status: 'Tốt', type: 'good' },
    { name: 'Nhịp tim', status: 'Tốt', type: 'good' },
    { name: 'Cân nặng', status: 'Theo dõi', type: 'warning' },
  ];

  return (
    <div className="bg-[#BE123C] text-white rounded-3xl p-4 flex flex-col gap-3.5 shadow-sm">
      {/* 1. Header with Icon, Title & ECG Sparkline */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white leading-tight">
              {condition?.condition_name || 'Tim mạch'}
            </h2>
            <span className="text-xs text-white/90 font-medium block mt-0.5">
              {condition?.status_summary || 'Nguy cơ trung bình · xu hướng ổn định'}
            </span>
          </div>
        </div>

        {/* ECG Sparkline */}
        <div className="w-16 h-7 pt-1 opacity-90">
          <svg viewBox="0 0 70 20" className="w-full h-full overflow-visible">
            <path
              d="M 0 10 L 15 10 L 22 2 L 28 18 L 35 7 L 42 12 L 50 10 L 70 10"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* 2. 6 White/Translucent Boxes (2 rows x 3 columns) */}
      <div className="grid grid-cols-3 gap-2">
        {/* Row 1, Col 1: Huyết áp */}
        <div className="bg-white rounded-2xl p-2.5 shadow-2xs flex flex-col justify-between h-14">
          <span className="text-[11px] font-semibold text-slate-600 block">
            {metrics[0]?.name || 'Huyết áp'}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>{metrics[0]?.status || 'Theo dõi'}</span>
          </div>
        </div>

        {/* Row 1, Col 2: LDL-C */}
        <div className="bg-white rounded-2xl p-2.5 shadow-2xs flex flex-col justify-between h-14">
          <span className="text-[11px] font-semibold text-slate-600 block">
            {metrics[1]?.name || 'LDL-C'}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>{metrics[1]?.status || 'Theo dõi'}</span>
          </div>
        </div>

        {/* Row 1, Col 3: HbA1c */}
        <div className="bg-white rounded-2xl p-2.5 shadow-2xs flex flex-col justify-between h-14">
          <span className="text-[11px] font-semibold text-slate-600 block">
            {metrics[2]?.name || 'HbA1c'}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{metrics[2]?.status || 'Tốt'}</span>
          </div>
        </div>

        {/* Row 2, Col 1: Nhịp tim */}
        <div className="bg-white rounded-2xl p-2.5 shadow-2xs flex flex-col justify-between h-14">
          <span className="text-[11px] font-semibold text-slate-600 block">
            {metrics[3]?.name || 'Nhịp tim'}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{metrics[3]?.status || 'Tốt'}</span>
          </div>
        </div>

        {/* Row 2, Col 2: Cân nặng */}
        <div className="bg-white rounded-2xl p-2.5 shadow-2xs flex flex-col justify-between h-14">
          <span className="text-[11px] font-semibold text-slate-600 block">
            {metrics[4]?.name || 'Cân nặng'}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>{metrics[4]?.status || 'Theo dõi'}</span>
          </div>
        </div>

        {/* Row 2, Col 3: Tái khám */}
        <div className="bg-black/20 rounded-2xl p-2.5 flex flex-col justify-between h-14">
          <span className="text-[11px] font-semibold text-white/80 block">Tái khám</span>
          <span className="text-xs font-black text-white block">
            {formatDateDisplay(condition?.next_checkup_date)}
          </span>
        </div>
      </div>
    </div>
  );
};
