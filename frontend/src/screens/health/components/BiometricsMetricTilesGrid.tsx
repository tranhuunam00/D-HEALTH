import React from 'react';
import { MetricType } from '../useBiometricsLogic';

export interface MetricSummaryItem {
  id: MetricType;
  name: string;
  code: string;
  codeBg: string;
  codeColor: string;
  value: string;
  unit: string;
}

export interface BiometricsMetricTilesGridProps {
  metricsSummaries: MetricSummaryItem[];
  activeMetric: MetricType;
  onSelectMetric: (metric: MetricType) => void;
}

export const BiometricsMetricTilesGrid: React.FC<BiometricsMetricTilesGridProps> = ({
  metricsSummaries,
  activeMetric,
  onSelectMetric,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-slate-500 font-semibold px-1">
        Chạm vào một chỉ số để xem diễn biến 7 lần đo gần nhất
      </span>

      <div className="grid grid-cols-2 gap-3">
        {metricsSummaries.map((m) => {
          const isSelected = activeMetric === m.id;
          return (
            <div
              key={m.id}
              onClick={() => onSelectMetric(m.id)}
              className={`rounded-[22px] p-3.5 flex flex-col justify-between h-20 transition-all cursor-pointer min-h-[44px] ${
                isSelected
                  ? 'bg-white border-2 border-slate-900 shadow-sm ring-1 ring-slate-900/10'
                  : 'bg-white border border-slate-100 shadow-2xs hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-lg ${m.codeBg} ${m.codeColor} text-[11px] font-black flex items-center justify-center shrink-0`}
                >
                  {m.code}
                </span>
                <span className="text-xs font-bold text-slate-700 truncate">{m.name}</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-base font-black text-slate-900">{m.value}</span>
                <span className="text-[11px] text-slate-400 font-medium ml-1 truncate">{m.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
