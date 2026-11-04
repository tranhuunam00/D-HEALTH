import React from 'react';
import { Heart } from 'lucide-react';
import { ChronicConditionItem } from '../useChronicLogic';

interface CardioConditionCardProps {
  readonly condition?: ChronicConditionItem;
}

function formatDateDisplay(dateStr?: string): string {
  if (!dateStr) return '--/--/----';
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
  if (!condition) {
    return null;
  }

  const metrics = condition.target_metrics || [];

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
              {condition.condition_name}
            </h2>
            <span className="text-xs text-white/90 font-medium block mt-0.5">
              {condition.status_summary || 'Theo dõi định kỳ'}
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

      {/* 2. Grid of metrics from Database */}
      <div className="grid grid-cols-3 gap-2">
        {metrics.map((m, idx) => {
          const isGood = m.type === 'good';
          const colorClass = isGood ? 'text-emerald-600' : 'text-amber-600';
          const bgDotClass = isGood ? 'bg-emerald-500' : 'bg-amber-500';

          return (
            <div
              key={`${m.name}-${idx}`}
              className="bg-white rounded-2xl p-2.5 shadow-2xs flex flex-col justify-between h-14"
            >
              <span className="text-[11px] font-semibold text-slate-600 block truncate">
                {m.name}
              </span>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${colorClass}`}>
                <span className={`w-2 h-2 rounded-full ${bgDotClass}`} />
                <span>{m.status || (isGood ? 'Tốt' : 'Theo dõi')}</span>
              </div>
            </div>
          );
        })}

        {/* Tái khám box */}
        <div className="bg-black/20 rounded-2xl p-2.5 flex flex-col justify-between h-14">
          <span className="text-[11px] font-semibold text-white/80 block">Tái khám</span>
          <span className="text-xs font-black text-white block">
            {formatDateDisplay(condition.next_checkup_date)}
          </span>
        </div>
      </div>
    </div>
  );
};
