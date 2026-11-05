import React from 'react';
import { Pill, Clock, Plus, AlertCircle, ShieldCheck } from 'lucide-react';

export interface ActiveMedicationItem {
  id: string;
  prescriptionId: string;
  name: string;
  dosage: string;
  dosePerIntake?: string;
  timingInstructions?: string;
  startDate?: string;
  endDate?: string;
  diagnosis?: string;
  facilityName?: string;
  doctorName?: string;
  schedules?: { scheduledTime: string; mealRelation?: string }[];
  status?: string;
}

interface ActiveMedsTabProps {
  medications: ActiveMedicationItem[];
  onAddMedication: () => void;
}

function formatDateDisplay(dateStr?: string): string {
  if (!dateStr) return 'Dài hạn';
  try {
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  } catch {
    return dateStr;
  }
}

export const ActiveMedsTab: React.FC<ActiveMedsTabProps> = ({
  medications,
  onAddMedication,
}) => {
  return (
    <div className="flex flex-col gap-3.5">
      {/* Header bar */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
            Thuốc đang sử dụng
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Tất cả các thuốc có lịch nhắc đang hoạt động
          </span>
        </div>
        <button
          type="button"
          onClick={onAddMedication}
          className="h-9 px-3 rounded-full bg-[#1F7A8C] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm thuốc</span>
        </button>
      </div>

      {/* Medication list */}
      {medications.length === 0 ? (
        <div className="bg-white rounded-[28px] p-8 text-center border border-slate-100 shadow-xs flex flex-col items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#1F7A8C] flex items-center justify-center">
            <Pill className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-slate-800">
            Chưa có thuốc nào trong danh sách đang dùng
          </span>
          <p className="text-xs text-slate-400 max-w-[260px] leading-relaxed">
            Thêm thuốc bạn đang uống hàng ngày hoặc quét đơn thuốc bằng AI Camera để hệ thống tự động nhắc lịch.
          </p>
          <button
            type="button"
            onClick={onAddMedication}
            className="mt-2 py-2.5 px-5 rounded-2xl bg-[#1F7A8C] text-white text-xs font-bold shadow-xs active:scale-95 transition"
          >
            Thêm thuốc đầu tiên
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {medications.map((med) => {
            const schedulesList = med.schedules || [];
            const times = schedulesList.map((s) => (s.scheduledTime || '').substring(0, 5)).filter(Boolean);

            return (
              <div
                key={med.id}
                className="bg-white rounded-[24px] p-4 shadow-xs border border-slate-100 flex flex-col gap-3 transition"
              >
                {/* Title & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#1F7A8C] flex items-center justify-center shrink-0 mt-0.5">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 leading-tight">
                        {med.name} {med.dosage}
                      </h4>
                      <span className="text-xs text-slate-500 font-medium block mt-0.5">
                        {med.timingInstructions || `${med.dosePerIntake || '1 viên'} · Sau ăn`}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black shrink-0 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Đang dùng</span>
                  </span>
                </div>

                {/* Schedules & Duration */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold">
                      {times.length > 0 ? times.join(', ') : '08:00'} hàng ngày
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500 justify-end">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate">
                      {med.endDate ? `Đến ${formatDateDisplay(med.endDate)}` : 'Dài hạn'}
                    </span>
                  </div>
                </div>

                {/* Diagnosis / Facility info if available */}
                {med.diagnosis && (
                  <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                    <span className="font-medium truncate max-w-[200px]">
                      {med.diagnosis}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {med.facilityName || 'Đơn thuốc cá nhân'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

