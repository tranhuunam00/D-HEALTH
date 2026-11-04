import React from 'react';
import { RecistEvaluationData } from '../useImagingLogic';

interface RecistEvaluationSectionProps {
  readonly enabled: boolean;
  readonly onToggle: (nextState: boolean) => void;
  readonly evaluationData: RecistEvaluationData | null;
}

export const RecistEvaluationSection: React.FC<RecistEvaluationSectionProps> = ({
  enabled,
  onToggle,
  evaluationData,
}) => {
  return (
    <div className="flex flex-col gap-2.5">
      {/* 1. Header with Toggle Switch */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-base font-extrabold text-slate-900 block leading-tight">
            Đánh giá đáp ứng RECIST 1.1
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Tuỳ chọn · cho khối u đặc sau điều trị
          </span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onToggle(!enabled)}
          className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none ${
            enabled ? 'bg-[#1F7A8C]' : 'bg-slate-300'
          }`}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="flex flex-col gap-2.5">
          {evaluationData ? (
            <>
              {/* 2. Hero Card with Gradient */}
              <div className="bg-gradient-to-r from-[#1F7A8C] to-[#2563EB] text-white rounded-2xl p-3.5 flex items-center gap-3.5 shadow-xs">
                <div className="w-13 h-13 rounded-2xl bg-white text-[#1F7A8C] flex items-center justify-center text-xl font-black shrink-0 shadow-xs">
                  {evaluationData.responseCode}
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-extrabold text-white leading-tight">
                    {evaluationData.responseLabel}
                  </span>
                  <span className="text-xs text-white/90 font-medium mt-0.5">
                    {evaluationData.note}
                  </span>
                </div>
              </div>

              {/* 3. Three Stat Boxes */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white rounded-2xl p-2.5 border border-slate-200/60 text-center shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 block">Ban đầu</span>
                  <span className="text-base font-black text-slate-900 block mt-0.5">
                    {evaluationData.baselineMm} mm
                  </span>
                </div>
                <div className="bg-white rounded-2xl p-2.5 border border-slate-200/60 text-center shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 block">Nhỏ nhất</span>
                  <span className="text-base font-black text-slate-900 block mt-0.5">
                    {evaluationData.nadirMm} mm
                  </span>
                </div>
                <div className="bg-white rounded-2xl p-2.5 border border-slate-200/60 text-center shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 block">Hiện tại</span>
                  <span className="text-base font-black text-slate-900 block mt-0.5">
                    {evaluationData.currentMm} mm
                  </span>
                </div>
              </div>

              {/* 4. Four Criteria Cards (2x2 Grid) */}
              <div className="grid grid-cols-2 gap-2">
                {/* CR */}
                <div className="bg-white rounded-2xl p-3 border border-slate-200/60 shadow-xs flex flex-col justify-between">
                  <span className="text-xs font-bold text-slate-800 block">
                    CR · Đáp ứng hoàn toàn
                  </span>
                  <span className="text-[10px] text-slate-500 leading-tight mt-1 font-medium">
                    Tất cả tổn thương đích biến mất
                  </span>
                </div>

                {/* PR (Active) */}
                <div className="bg-white rounded-2xl p-3 border-2 border-[#1F7A8C] shadow-xs flex flex-col justify-between relative">
                  <span className="text-xs font-bold text-[#0F766E] block">
                    PR · Đáp ứng một phần
                  </span>
                  <span className="text-[10px] text-slate-600 leading-tight mt-1 font-medium">
                    Tổng đường kính giảm ≥ 30% so với ban đầu
                  </span>
                </div>

                {/* SD */}
                <div className="bg-white rounded-2xl p-3 border border-slate-200/60 shadow-xs flex flex-col justify-between">
                  <span className="text-xs font-bold text-slate-800 block">
                    SD · Bệnh ổn định
                  </span>
                  <span className="text-[10px] text-slate-500 leading-tight mt-1 font-medium">
                    Không đủ tiêu chuẩn PR hay PD
                  </span>
                </div>

                {/* PD */}
                <div className="bg-white rounded-2xl p-3 border border-slate-200/60 shadow-xs flex flex-col justify-between">
                  <span className="text-xs font-bold text-slate-800 block">
                    PD · Bệnh tiến triển
                  </span>
                  <span className="text-[10px] text-slate-500 leading-tight mt-1 font-medium">
                    Tăng ≥ 20% và ≥ 5 mm so với nhỏ nhất
                  </span>
                </div>
              </div>

              {/* 5. Disclaimer */}
              <p className="text-[11px] text-slate-500 leading-relaxed font-normal px-0.5">
                Tổn thương đích: ≥ 10 mm trên CT/MRI, tối đa 5, không quá 2 mỗi cơ quan. Kết quả mang tính tham khảo — cần bác sĩ CĐHA/ung bướu xác nhận.
              </p>
            </>
          ) : (
            <div className="bg-white rounded-2xl p-4 text-center text-xs text-slate-400">
              Chưa có dữ liệu đánh giá đáp ứng RECIST 1.1
            </div>
          )}
        </div>
      )}
    </div>
  );
};
