import React from 'react';
import { Droplet, TriangleAlert } from 'lucide-react';
import { ChronicConditionItem } from '../useChronicLogic';

interface DiabetesConditionCardProps {
  readonly condition?: ChronicConditionItem;
}

export const DiabetesConditionCard: React.FC<DiabetesConditionCardProps> = ({ condition }) => {
  if (!condition) {
    return null;
  }

  const metrics = condition.target_metrics || [];

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-200/60 shadow-xs flex flex-col gap-3">
      {/* 1. Header with Icon, Title & Badge */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Droplet className="w-5 h-5 fill-indigo-600" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 leading-tight">
            {condition.condition_name}
          </h3>
        </div>
        {condition.status_summary && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-600">
            {condition.status_summary}
          </span>
        )}
      </div>

      {/* 2. Dynamic Grid of Sub-metrics from Database */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-bold text-slate-800">
        {metrics.map((m, idx) => {
          const isDanger = m.type === 'danger' || m.icon === 'triangle';
          const isWarning = m.type === 'warning';
          const dotBg = isDanger ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500';

          return (
            <div key={`${m.name}-${idx}`} className="flex items-center gap-1.5">
              {isDanger ? (
                <TriangleAlert className="w-3.5 h-3.5 fill-rose-600 text-white shrink-0" />
              ) : (
                <span className={`w-2 h-2 rounded-full ${dotBg} shrink-0`} />
              )}
              <span className={isDanger ? 'text-rose-600 font-extrabold' : ''}>{m.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
