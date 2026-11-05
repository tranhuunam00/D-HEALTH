import React from 'react';
import { Heart, Droplet, Activity, Edit3, Trash2, TriangleAlert } from 'lucide-react';
import type { ChronicConditionItem } from '../useChronicLogic';

interface DynamicConditionCardProps {
  condition: ChronicConditionItem;
  onEdit?: (condition: ChronicConditionItem) => void;
  onDelete?: (conditionId: string) => void;
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

export const DynamicConditionCard: React.FC<DynamicConditionCardProps> = ({
  condition,
  onEdit,
  onDelete,
}) => {
  const nameLower = condition.condition_name.toLowerCase();
  const isCardio = nameLower.includes('tim') || nameLower.includes('huyết áp');
  const isDiabetes = nameLower.includes('đái') || nameLower.includes('đường') || nameLower.includes('tiểu');

  const metrics = condition.target_metrics || [];

  if (isCardio) {
    return (
      <div className="bg-[#BE123C] text-white rounded-3xl p-4 flex flex-col gap-3.5 shadow-sm">
        {/* Header */}
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

          <div className="flex items-center gap-1.5 shrink-0">
            {/* ECG Sparkline */}
            <div className="w-14 h-7 pt-1 opacity-90 hidden sm:block">
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

            {/* Action buttons */}
            <button
              type="button"
              onClick={() => onEdit?.(condition)}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition active:scale-95"
              title="Sửa bệnh này"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(condition.id)}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-rose-700 text-white flex items-center justify-center transition active:scale-95"
              title="Xóa bệnh này"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
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

          {/* Tái khám */}
          <div className="bg-black/20 rounded-2xl p-2.5 flex flex-col justify-between h-14">
            <span className="text-[11px] font-semibold text-white/80 block">Tái khám</span>
            <span className="text-xs font-black text-white block">
              {formatDateDisplay(condition.next_checkup_date)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // General or Diabetes card
  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-200/60 shadow-xs flex flex-col gap-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
              isDiabetes ? 'bg-indigo-50 text-indigo-600' : 'bg-teal-50 text-[#1F7A8C]'
            }`}
          >
            {isDiabetes ? (
              <Droplet className="w-5 h-5 fill-indigo-600" />
            ) : (
              <Activity className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 leading-tight">
              {condition.condition_name}
            </h3>
            {condition.status_summary && (
              <span className="text-xs text-slate-400 font-medium">
                {condition.status_summary}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onEdit?.(condition)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition active:scale-95"
            title="Sửa bệnh này"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(condition.id)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center transition active:scale-95"
            title="Xóa bệnh này"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-bold text-slate-800">
        {metrics.map((m, idx) => {
          const isDanger = m.type === 'danger' || m.icon === 'triangle';
          const isWarning = m.type === 'warning';
          const dotBg = isDanger ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500';

          return (
            <div key={`${m.name}-${idx}`} className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
              {isDanger ? (
                <TriangleAlert className="w-3.5 h-3.5 fill-rose-600 text-white shrink-0" />
              ) : (
                <span className={`w-2 h-2 rounded-full ${dotBg} shrink-0`} />
              )}
              <span className={`truncate ${isDanger ? 'text-rose-600 font-extrabold' : ''}`}>
                {m.name}
              </span>
            </div>
          );
        })}

        {condition.next_checkup_date && (
          <div className="flex items-center gap-1 bg-slate-100 p-2 rounded-xl text-[11px] text-slate-600">
            <span className="font-bold truncate">Tái khám: {formatDateDisplay(condition.next_checkup_date)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
