import React from 'react';
import { Droplet, TriangleAlert } from 'lucide-react';
import { ChronicConditionItem } from '../useChronicLogic';

interface DiabetesConditionCardProps {
  readonly condition?: ChronicConditionItem;
}

export const DiabetesConditionCard: React.FC<DiabetesConditionCardProps> = ({ condition }) => {
  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-200/60 shadow-xs flex flex-col gap-3">
      {/* 1. Header with Icon, Title & Badge */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Droplet className="w-5 h-5 fill-indigo-600" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 leading-tight">
            {condition?.condition_name || 'Đái tháo đường'}
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-600">
          {condition?.status_summary || '1 cần khám'}
        </span>
      </div>

      {/* 2. Three Columns of Sub-metrics */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-bold text-slate-800">
        {/* Col 1 */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>HbA1c</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>Huyết áp</span>
          </div>
        </div>

        {/* Col 2 */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span>Glucose</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>Thận</span>
          </div>
        </div>

        {/* Col 3 */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span>Cân nặng</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-600 font-extrabold">
            <TriangleAlert className="w-3.5 h-3.5 fill-rose-600 text-white shrink-0" />
            <span>Mắt</span>
          </div>
        </div>
      </div>
    </div>
  );
};
