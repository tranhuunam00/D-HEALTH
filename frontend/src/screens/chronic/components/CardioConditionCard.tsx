import React from 'react';
import { Heart, Calendar } from 'lucide-react';
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

  const summaryLower = (condition.status_summary || '').toLowerCase();
  const isHighRisk = summaryLower.includes('nguy cơ cao') || summaryLower.includes('cần khám');
  const isLowRisk = summaryLower.includes('nguy cơ thấp') || summaryLower.includes('tốt');

  const theme = isHighRisk
    ? {
        badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
        dotBg: 'bg-rose-500',
        iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
        cardBorder: 'border-rose-200/90 shadow-rose-100/30',
        sparkline: '#E11D48',
      }
    : isLowRisk
    ? {
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dotBg: 'bg-emerald-500',
        iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        cardBorder: 'border-emerald-200/90 shadow-emerald-100/30',
        sparkline: '#059669',
      }
    : {
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        dotBg: 'bg-amber-500',
        iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
        cardBorder: 'border-amber-200/90 shadow-amber-100/30',
        sparkline: '#D97706',
      };

  const metrics = condition.target_metrics || [];

  return (
    <div className={`bg-white rounded-3xl p-4 border ${theme.cardBorder} shadow-xs flex flex-col gap-3.5 transition-all`}>
      {/* 1. Header with Icon, Title & ECG Sparkline */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-2xl border ${theme.iconBg} flex items-center justify-center shrink-0`}>
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 leading-tight">
              {condition.condition_name}
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${theme.badgeBg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${theme.dotBg}`} />
                <span>{condition.status_summary || 'Theo dõi định kỳ'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* ECG Sparkline */}
        <div className="w-16 h-7 pt-1 opacity-90">
          <svg viewBox="0 0 70 20" className="w-full h-full overflow-visible">
            <path
              d="M 0 10 L 15 10 L 22 2 L 28 18 L 35 7 L 42 12 L 50 10 L 70 10"
              fill="none"
              stroke={theme.sparkline}
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
          const statusLower = (m.status || '').toLowerCase();
          const isDanger = m.type === 'danger' || statusLower.includes('khám');
          const isWarning = m.type === 'warning' || statusLower.includes('dõi');
          const isGood = m.type === 'good' || statusLower.includes('tốt');

          const colorClass = isDanger ? 'text-rose-700' : isWarning ? 'text-amber-700' : 'text-emerald-700';
          const bgDotClass = isDanger ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500';

          return (
            <div
              key={`${m.name}-${idx}`}
              className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-2.5 flex flex-col justify-between h-14"
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
        {condition.next_checkup_date && (
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-2.5 flex flex-col justify-between h-14">
            <span className="text-[11px] font-semibold text-slate-500 block truncate">Tái khám</span>
            <div className="flex items-center gap-1 text-xs font-black text-slate-800 truncate">
              <Calendar className="w-3 h-3 text-[#1F7A8C] shrink-0" />
              <span>{formatDateDisplay(condition.next_checkup_date)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
