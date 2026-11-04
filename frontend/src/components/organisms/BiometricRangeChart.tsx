import React from 'react';

export interface BiometricChartProps {
  readonly metricType: string;
  readonly title: string;
  readonly latestValue: string;
  readonly unit: string;
  readonly recordedWhen: string;
  readonly statusTag: string;
  readonly statusBg: string;
  readonly statusFg: string;
}

export const BiometricRangeChart: React.FC<BiometricChartProps> = ({
  title,
  latestValue,
  unit,
  recordedWhen,
  statusTag,
  statusBg,
  statusFg,
}) => {
  return (
    <div className="bg-white rounded-[24px] p-4 flex flex-col gap-2.5 shrink-0 shadow-sm border border-slate-200/60">
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-slate-700">{title}</span>
          <span className="text-[32px] font-extrabold tracking-tight leading-none text-slate-900 font-tabular-nums">
            {latestValue} <span className="text-xs font-semibold text-slate-500">{unit}</span>
          </span>
          <span className="text-xs text-slate-500 font-semibold">{recordedWhen}</span>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold"
          style={{ backgroundColor: statusBg, color: statusFg }}
        >
          {statusTag}
        </span>
      </div>

      <div className="flex gap-3 text-[11px] font-semibold text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1F7A8C]" />
          Từ thiết bị
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          Nhập tay
        </span>
      </div>

      {/* Range-Column SVG */}
      <div className="w-full h-36 mt-1 flex items-center justify-center">
        <svg viewBox="0 0 326 120" className="w-full h-full" role="img" aria-label="Biểu đồ sinh trắc">
          <line x1="0" y1="30" x2="326" y2="30" stroke="#F1F4F8" strokeWidth="1" />
          <line x1="0" y1="65" x2="326" y2="65" stroke="#F1F4F8" strokeWidth="1" />
          <line x1="0" y1="100" x2="326" y2="100" stroke="#F1F4F8" strokeWidth="1" />

          {/* Range Columns */}
          <rect x="25" y="42" width="14" height="50" rx="7" fill="#1F7A8C" />
          <rect x="85" y="38" width="14" height="55" rx="7" fill="#1F7A8C" />
          <rect x="145" y="48" width="14" height="46" rx="7" fill="#F59E0B" />
          <rect x="205" y="45" width="14" height="50" rx="7" fill="#1F7A8C" />
          <rect x="265" y="35" width="14" height="60" rx="7" fill="#F59E0B" />
        </svg>
      </div>
    </div>
  );
};
