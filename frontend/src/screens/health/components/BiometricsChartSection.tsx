import React from 'react';
import { Plus } from 'lucide-react';
import { MetricType } from '../useBiometricsLogic';

export interface BiometricsChartSectionProps {
  activeMetricObj: {
    id: MetricType;
    name: string;
    unit: string;
    value: string;
  };
  isNoData: boolean;
  latestRecordedAt: string | null;
  chartBars: Array<{
    day: string;
    height: string;
    value: string;
    isLatest: boolean;
  }>;
  filteredHistory: Array<{ value: string; recordedAt: string }>;
  onOpenEntrySheet: () => void;
}

export const BiometricsChartSection: React.FC<BiometricsChartSectionProps> = ({
  activeMetricObj,
  isNoData,
  latestRecordedAt,
  chartBars,
  filteredHistory,
  onOpenEntrySheet,
}) => {
  return (
    <div className="bg-white rounded-[28px] p-5 shadow-xs border border-slate-100 flex flex-col gap-3 relative">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold text-slate-800">{activeMetricObj.name} · 7 ngày</span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-extrabold ${
            isNoData ? 'bg-slate-100 text-slate-600' : 'bg-[#EAF8F0] text-[#166534]'
          }`}
        >
          {isNoData ? 'Chưa có số đo' : 'Mức 1 · Tốt'}
        </span>
      </div>

      {/* Value row */}
      <div className="flex items-baseline">
        <span className="text-4xl font-black text-slate-900 tracking-tight">{activeMetricObj.value}</span>
        <span className="text-xs font-medium text-slate-500 ml-1.5">{activeMetricObj.unit}</span>
      </div>

      {/* Subtitle */}
      <span className="text-xs text-slate-400 font-medium -mt-1">
        {latestRecordedAt ? `Lần đo mới nhất: ${latestRecordedAt}` : 'Chưa có lần đo nào'}
      </span>

      {/* Legend */}
      <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 pt-0.5">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
          Từ thiết bị
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          Nhập tay
        </span>
      </div>

      {/* 7-Day Bar Chart */}
      <div className="h-28 flex items-end justify-between px-3 pt-2 pb-1 border-b border-slate-100/60">
        {chartBars.map((bar, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end flex-1 max-w-[36px]">
            <div
              style={{ height: bar.height }}
              className={`w-5 rounded-full transition-all ${
                bar.isLatest ? 'bg-[#2563EB]' : 'bg-[#BFDBFE]'
              }`}
            />
            <span
              className={`text-[10px] font-bold ${
                bar.isLatest ? 'text-slate-900 font-extrabold' : 'text-slate-400'
              }`}
            >
              {bar.day}
            </span>
          </div>
        ))}
      </div>

      {/* Callout box */}
      <div className="bg-[#F0FDF4] border border-emerald-100/70 rounded-2xl p-3 flex items-start gap-2 text-xs">
        <span className="text-teal-600 font-bold shrink-0 mt-0.5">✦</span>
        <span className="text-slate-800 font-medium leading-relaxed">
          {filteredHistory.length >= 2
            ? `Diễn biến ${activeMetricObj.name}: từ ${filteredHistory[filteredHistory.length - 1].value} sang ${filteredHistory[0].value} ${activeMetricObj.unit} — xu hướng ổn định.`
            : filteredHistory.length === 1
            ? `Đã ghi nhận 1 lần đo ${activeMetricObj.name}: ${filteredHistory[0].value} ${activeMetricObj.unit}. Hãy tiếp tục theo dõi đều đặn.`
            : 'Chưa có đủ số đo để phân tích xu hướng. Nhấn nút bên dưới để nhập số đo mới.'}
        </span>
      </div>

      {/* Large Manual Input Button */}
      <button
        type="button"
        onClick={onOpenEntrySheet}
        className="w-full h-12 rounded-full bg-white border-2 border-[#1F7A8C] hover:bg-teal-50/40 text-[#1F7A8C] text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition shadow-2xs mt-1 min-h-[44px]"
      >
        <Plus className="w-4 h-4" />
        <span>+ Nhập số đo {activeMetricObj.name.toLowerCase()} thủ công</span>
      </button>
    </div>
  );
};
