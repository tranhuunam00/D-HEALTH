import React from 'react';
import type { DoseItem } from '../useMedsLogic';

interface TodayDoseListProps {
  doses: DoseItem[];
  onTakeDose: (doseId: string) => void;
  onSkipDose: (doseId: string) => void;
  onSnoozeDose: (doseId: string) => void;
}

export const TodayDoseList: React.FC<TodayDoseListProps> = ({
  doses,
  onTakeDose,
  onSkipDose,
  onSnoozeDose,
}) => {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="text-sm font-extrabold text-slate-900 px-1">
        Hôm nay · 26/10
      </h3>

      <div className="space-y-3">
        {doses.map((dose) => {
          const isPending = !dose.taken && dose.status !== 'skipped';

          return (
            <div
              key={dose.id}
              className="bg-white rounded-[24px] p-4 shadow-xs border border-slate-100 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center justify-center w-12 text-center">
                    <span className="text-sm font-black text-slate-900 leading-none">
                      {dose.time}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
                      {dose.period}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900">
                      {dose.name}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {dose.instruction}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold leading-none ${
                    dose.taken
                      ? 'bg-[#DCFCE7] text-[#15803D]'
                      : dose.status === 'skipped'
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-[#FEF3C7] text-[#B45309]'
                  }`}
                >
                  {dose.taken ? 'Đã uống' : dose.status === 'skipped' ? 'Bỏ liều' : 'Sắp tới'}
                </span>
              </div>

              {isPending && (
                <div className="flex items-center gap-2 pt-1 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={() => onSkipDose(dose.id)}
                    className="flex-1 py-2 rounded-full border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 active:scale-95 transition"
                  >
                    Bỏ liều
                  </button>
                  <button
                    type="button"
                    onClick={() => onSnoozeDose(dose.id)}
                    className="flex-1 py-2 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 active:scale-95 transition"
                  >
                    Nhắc lại 15p
                  </button>
                  <button
                    type="button"
                    onClick={() => onTakeDose(dose.id)}
                    className="flex-1 py-2 rounded-full bg-[#111827] text-white text-xs font-bold hover:bg-slate-800 active:scale-95 transition"
                  >
                    Đã uống
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
