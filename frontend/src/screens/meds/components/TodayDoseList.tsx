import React from 'react';
import type { DoseItem } from '../useMedsLogic';

interface TodayDoseListProps {
  selectedDay?: number;
  doses: DoseItem[];
  onTakeDose: (doseId: string) => void;
  onSkipDose: (doseId: string) => void;
  onSnoozeDose: (doseId: string) => void;
}

export const TodayDoseList: React.FC<TodayDoseListProps> = ({
  selectedDay = 26,
  doses,
  onTakeDose,
  onSkipDose,
  onSnoozeDose,
}) => {
  const isToday = selectedDay === 26;
  const isTomorrow = selectedDay === 27;
  const isFuture = selectedDay > 26;
  const isPast = selectedDay < 26;

  const headerTitle = isToday
    ? 'Hôm nay · 26/10'
    : isTomorrow
    ? 'Ngày mai · 27/10'
    : isFuture
    ? `Ngày ${selectedDay}/10 (Đã lên lịch)`
    : `Ngày ${selectedDay}/10 (Lịch sử dùng thuốc)`;

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
              ? `Chưa có đơn thuốc nào lên lịch cho ngày ${selectedDay}/10`
              : isToday
              ? 'Không có cữ thuốc nào cần uống hôm nay'
              : `Không có ghi nhận dùng thuốc trong ngày ${selectedDay}/10`}
          </div>
        ) : (
          doses.map((dose) => {
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
                        : isFuture
                        ? 'bg-[#E0F2FE] text-[#0369A1]'
                        : 'bg-[#FEF3C7] text-[#B45309]'
                    }`}
                  >
                    {dose.taken
                      ? 'Đã uống'
                      : dose.status === 'skipped'
                      ? 'Bỏ liều'
                      : isFuture
                      ? 'Đã lên lịch'
                      : 'Sắp tới'}
                  </span>
                </div>

                {/* Các nút hành động */}
                {isToday && isPending && (
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

                {/* Dành cho ngày tương lai */}
                {isFuture && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-[11px] font-semibold text-slate-500">
                    <span>Hệ thống sẽ tự động nhắc uống vào lúc {dose.time}</span>
                    <button
                      type="button"
                      onClick={() => onTakeDose(dose.id)}
                      className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 active:scale-95 transition"
                    >
                      Uống sớm
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
