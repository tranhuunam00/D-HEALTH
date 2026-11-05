import React from 'react';
import { Clock, Check, X, RotateCcw } from 'lucide-react';
import type { DoseItem } from '../useMedsLogic';

interface TodayDoseListProps {
  selectedDay?: number;
  month?: number;
  year?: number;
  doses: DoseItem[];
  onTakeDose: (doseId: string) => void;
  onSkipDose: (doseId: string) => void;
  onSnoozeDose: (doseId: string) => void;
}

export const TodayDoseList: React.FC<TodayDoseListProps> = ({
  selectedDay,
  month,
  year,
  doses,
  onTakeDose,
  onSkipDose,
  onSnoozeDose,
}) => {
  const now = new Date();
  const currentMonth = month ?? (now.getMonth() + 1);
  const currentYear = year ?? now.getFullYear();
  const activeDay = selectedDay ?? now.getDate();

  const isCurrentMonthAndYear = currentMonth === (now.getMonth() + 1) && currentYear === now.getFullYear();
  const isToday = isCurrentMonthAndYear && activeDay === now.getDate();
  const isTomorrow = isCurrentMonthAndYear && activeDay === (now.getDate() + 1);
  const isFuture = isCurrentMonthAndYear
    ? activeDay > now.getDate()
    : currentYear > now.getFullYear() || currentMonth > (now.getMonth() + 1);

  const dayPadded = String(activeDay).padStart(2, '0');
  const monthPadded = String(currentMonth).padStart(2, '0');

  const headerTitle = isToday
    ? `Hôm nay · ${dayPadded}/${monthPadded}`
    : isTomorrow
    ? `Ngày mai · ${dayPadded}/${monthPadded}`
    : isFuture
    ? `Ngày ${dayPadded}/${monthPadded} (Đã lên lịch)`
    : `Ngày ${dayPadded}/${monthPadded} (Lịch sử dùng thuốc)`;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
          {headerTitle}
        </h3>
        <span className="text-xs font-bold text-slate-500">
          {doses.length} cữ thuốc
        </span>
      </div>

      <div className="space-y-3">
        {doses.length === 0 ? (
          <div className="bg-white rounded-[24px] p-6 text-center text-xs text-slate-400 border border-slate-100 font-medium shadow-xs">
            {isFuture
              ? `Chưa có đơn thuốc nào lên lịch cho ngày ${dayPadded}/${monthPadded}`
              : isToday
              ? 'Không có cữ thuốc nào cần uống hôm nay'
              : `Không có ghi nhận dùng thuốc trong ngày ${dayPadded}/${monthPadded}`}
          </div>
        ) : (
          doses.map((dose) => {
            const isTaken = dose.taken || dose.status === 'taken';
            const isSkipped = dose.status === 'skipped';
            const isSnoozed = dose.status === 'snoozed';
            const isPending = !isTaken && !isSkipped;

            return (
              <div
                key={dose.id}
                className={`bg-white rounded-[28px] p-4 shadow-xs border transition-all ${
                  isTaken
                    ? 'border-emerald-100 bg-emerald-50/20'
                    : isSkipped
                    ? 'border-rose-100 bg-rose-50/20 opacity-75'
                    : 'border-slate-100'
                }`}
              >
                {/* Header row: Time, Name, Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-center shrink-0">
                      <span className="text-lg font-black text-slate-900 block leading-tight">
                        {dose.time}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {dose.period}
                      </span>
                    </div>
                    <div>
                      <h4
                        className={`text-sm font-extrabold text-slate-900 leading-tight uppercase ${
                          isTaken ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {dose.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {dose.instruction}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {isTaken && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black border border-emerald-200 shrink-0">
                      Đã uống
                    </span>
                  )}
                  {isSkipped && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-black border border-rose-200 shrink-0">
                      Đã bỏ qua
                    </span>
                  )}
                  {isSnoozed && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-black border border-amber-200 shrink-0">
                      Nhắc lại sau 15p
                    </span>
                  )}
                  {isPending && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-black shrink-0">
                      {isFuture ? 'Sắp tới' : 'Chưa uống'}
                    </span>
                  )}
                </div>

                {/* Action Buttons for Today & Past */}
                {!isFuture && (
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={isSkipped}
                      onClick={() => onSkipDose(dose.id)}
                      className="py-2.5 rounded-2xl border border-rose-200 text-rose-600 text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition hover:bg-rose-50 disabled:opacity-40"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Bỏ liều</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSnoozeDose(dose.id)}
                      className="py-2.5 rounded-2xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition hover:bg-slate-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Nhắc lại 15p</span>
                    </button>
                    <button
                      type="button"
                      disabled={isTaken}
                      onClick={() => onTakeDose(dose.id)}
                      className="py-2.5 rounded-2xl bg-[#111827] text-white text-xs font-black flex items-center justify-center gap-1 active:scale-95 transition hover:bg-slate-800 disabled:opacity-40"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã uống</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
