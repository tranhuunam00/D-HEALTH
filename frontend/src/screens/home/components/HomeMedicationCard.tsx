import React from 'react';
import { Pill, Check } from 'lucide-react';

export interface HomeMedicationCardProps {
  todayDose: any;
  todayDosesSummary: { taken: number; total: number };
  isDoseTaken: boolean;
  onTakeDose: () => void;
  onNavigateMeds?: () => void;
}

export const HomeMedicationCard: React.FC<HomeMedicationCardProps> = ({
  todayDose,
  todayDosesSummary,
  isDoseTaken,
  onTakeDose,
  onNavigateMeds,
}) => {
  return (
    <div
      onClick={onNavigateMeds}
      className={`bg-white rounded-[24px] p-4 flex items-center justify-between shadow-xs cursor-pointer hover:shadow-sm transition-all border-2 ${
        todayDose ? 'border-amber-300' : 'border-slate-200'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            todayDose ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <Pill className="w-5 h-5 rotate-45" />
        </div>
        <div className="flex flex-col min-w-0">
          <span
            className={`text-[11px] font-black uppercase tracking-wide ${
              todayDose ? 'text-amber-800' : 'text-slate-400'
            }`}
          >
            {todayDose
              ? `NHẮC UỐNG THUỐC · ${todayDose?.scheduled_time ? todayDose.scheduled_time.substring(0, 5) : '20:00'}`
              : 'ĐƠN THUỐC & NHẮC THUỐC'}
          </span>
          <span className="text-sm font-black text-slate-900 truncate">
            {todayDose
              ? `${todayDose.name} ${todayDose.dosage || ''}`.trim()
              : 'Không có lịch uống thuốc hôm nay'}
          </span>
          <span className="text-xs text-slate-500 font-medium truncate">
            {todayDose
              ? `${todayDose.instructions || '1 viên sau ăn'} · hôm nay ${todayDosesSummary.taken}/${todayDosesSummary.total} liều`
              : 'Nhấn để xem hoặc thêm đơn thuốc mới'}
          </span>
        </div>
      </div>

      {todayDose ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTakeDose();
          }}
          className={`h-10 min-h-[40px] px-4 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-xs ${
            isDoseTaken
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
          }`}
          aria-label={isDoseTaken ? 'Đã uống thuốc' : 'Xác nhận đã uống'}
        >
          {isDoseTaken ? (
            <>
              <Check className="w-3.5 h-3.5" /> Đã uống
            </>
          ) : (
            'Đã uống'
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigateMeds?.();
          }}
          className="h-10 min-h-[40px] px-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs active:scale-95 transition shrink-0"
        >
          + Thêm
        </button>
      )}
    </div>
  );
};
