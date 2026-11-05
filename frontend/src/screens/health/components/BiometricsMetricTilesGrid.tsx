import React from 'react';
import { MetricType } from '../useBiometricsLogic';

export interface MetricSummaryItem {
  readonly id: MetricType;
  readonly name: string;
  readonly code: string;
  readonly codeBg: string;
  readonly codeColor: string;
  readonly value: string;
  readonly unit: string;
}

export interface BiometricsMetricTilesGridProps {
  readonly metricsSummaries: readonly MetricSummaryItem[];
  readonly activeMetric: MetricType;
  readonly onSelectMetric: (metric: MetricType) => void;
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

      <div className="grid grid-cols-4 gap-2">
        {metricsSummaries.map((m) => {
          const isSelected = m.id === activeMetric;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMetric(m.id)}
              className={`p-2.5 rounded-2xl flex flex-col items-center justify-between text-center transition-all cursor-pointer min-h-[96px] ${
                isSelected
                  ? 'bg-[#1F7A8C] text-white shadow-md ring-2 ring-[#1F7A8C]/50 ring-offset-2'
                  : 'bg-white text-slate-900 shadow-2xs border border-slate-100 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 ${
                  isSelected ? 'bg-white/20 text-white' : `${m.codeBg} ${m.codeColor}`
                }`}
              >
                {m.code}
              </div>

              <div className="flex flex-col items-center w-full my-1">
                <span className="text-base font-black leading-none">{m.value}</span>
                <span
                  className={`text-[10px] mt-0.5 font-medium truncate w-full ${
                    isSelected ? 'text-teal-100' : 'text-slate-400'
                  }`}
                >
                  {m.unit}
                </span>
              </div>

              <span
                className={`text-[11px] font-bold truncate w-full ${
                  isSelected ? 'text-white font-black' : 'text-slate-600'
                }`}
              >
                {m.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
