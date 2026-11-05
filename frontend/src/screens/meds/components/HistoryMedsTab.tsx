import React from 'react';
import { FileText, Calendar, Building2, User, CheckCircle2, ChevronRight, Share2, Pill, Clock } from 'lucide-react';

export interface PrescriptionItemSummary {
  id: string;
  medicationName: string;
  dosage?: string;
  dosePerIntake?: string;
  frequencyPerDay?: number;
  timingInstructions?: string;
  startDate?: string;
  endDate?: string;
}

export interface PrescriptionRecord {
  id: string;
  code?: string;
  prescribed_date?: string;
  valid_until?: string;
  diagnosis?: string;
  status?: string;
  facility_name?: string;
  doctor_name?: string;
  items?: PrescriptionItemSummary[];
}

interface HistoryMedsTabProps {
  prescriptions: PrescriptionRecord[];
  adherencePercent: number;
  takenCount: number;
  missedCount: number;
  skippedCount: number;
  onSendHistory: () => void;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'Không rõ';
  try {
    const d = dateStr.split('T')[0].split('-');
    if (d.length === 3) return `${d[2]}/${d[1]}/${d[0]}`;
    return dateStr;
  } catch {
    return dateStr;
  }
}

export const HistoryMedsTab: React.FC<HistoryMedsTabProps> = ({
  prescriptions,
  adherencePercent,
  takenCount,
  missedCount,
  skippedCount,
  onSendHistory,
}) => {
  return (
    <div className="flex flex-col gap-3.5">
      {/* 1. Tổng quan tuân thủ tiền sử 30 ngày */}
      <div className="bg-gradient-to-r from-[#1E56A0] to-[#1F7A8C] rounded-[24px] p-4 text-white shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span className="text-xs font-bold tracking-wider uppercase opacity-90">
              Tổng kết tuân thủ thuốc (30 ngày)
            </span>
          </div>
          <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
            {adherencePercent >= 80 ? 'Tuân thủ tốt' : 'Cần chú ý'}
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black">{adherencePercent}%</span>
          <span className="text-xs font-medium opacity-85">tỷ lệ uống thuốc đúng giờ</span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/15 text-center">
          <div className="bg-white/10 rounded-xl py-2 px-1">
            <span className="block text-base font-black text-emerald-300">{takenCount}</span>
            <span className="text-[10px] font-semibold opacity-85">Đã uống</span>
          </div>
          <div className="bg-white/10 rounded-xl py-2 px-1">
            <span className="block text-base font-black text-amber-300">{missedCount}</span>
            <span className="text-[10px] font-semibold opacity-85">Quên liều</span>
          </div>
          <div className="bg-white/10 rounded-xl py-2 px-1">
            <span className="block text-base font-black text-rose-300">{skippedCount}</span>
            <span className="text-[10px] font-semibold opacity-85">Bỏ qua</span>
          </div>
        </div>
      </div>

      {/* 2. Tiêu đề danh sách đơn thuốc */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
            Lịch sử đơn thuốc đã kê
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Hồ sơ thuốc từ các lần khám và tự thêm ({prescriptions.length} đơn)
          </span>
        </div>
      </div>

      {/* 3. Empty state hoặc Danh sách đơn thuốc */}
      {prescriptions.length === 0 ? (
        <div className="bg-white rounded-[24px] p-8 text-center border border-slate-100 shadow-xs flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-slate-800">
            Chưa có lịch sử đơn thuốc
          </span>
          <p className="text-xs text-slate-400 max-w-[260px] leading-relaxed">
            Các đơn thuốc được kê hoặc chụp qua AI Camera sẽ được lưu lại toàn bộ tại đây.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {prescriptions.map((rx) => {
            const isFinished = rx.status === 'completed' || rx.status === 'expired';
            const items = rx.items || [];

            return (
              <div
                key={rx.id}
                className="bg-white rounded-[24px] p-4 shadow-xs border border-slate-100 flex flex-col gap-3"
              >
                {/* Header đơn thuốc */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                        {rx.diagnosis || 'Đơn thuốc điều trị'}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formatDate(rx.prescribed_date)}
                        </span>
                        {rx.code && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-slate-400">{rx.code}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      isFinished
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isFinished ? 'Đã hoàn thành' : 'Đang hiệu lực'}
                  </span>
                </div>

                {/* Thông tin bác sĩ & Bệnh viện */}
                {(rx.facility_name || rx.doctor_name) && (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium bg-slate-50/70 p-2 rounded-xl">
                    {rx.facility_name && (
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {rx.facility_name}
                      </span>
                    )}
                    {rx.doctor_name && (
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        BS. {rx.doctor_name}
                      </span>
                    )}
                  </div>
                )}

                {/* Danh mục thuốc trong đơn */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Danh mục thuốc ({items.length})
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {items.map((it) => (
                      <div
                        key={it.id}
                        className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-50/50 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Pill className="w-3.5 h-3.5 text-[#1F7A8C]" />
                          <span className="font-bold text-slate-800">
                            {it.medicationName} {it.dosage || ''}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {it.timingInstructions || it.dosePerIntake || 'Theo chỉ định'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Action button: Gửi tiền sử cho bác sĩ */}
      <button
        type="button"
        onClick={onSendHistory}
        className="w-full py-3.5 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition flex items-center justify-center gap-2 mt-1"
      >
        <Share2 className="w-4 h-4" />
        <span>Gửi toàn bộ tiền sử dùng thuốc cho bác sĩ</span>
      </button>
    </div>
  );
};

