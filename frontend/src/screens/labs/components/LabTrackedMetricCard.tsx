import React from 'react';
import { LabTrendChart } from './LabTrendChart';

export interface TrackedMetricCardData {
  readonly id: string;
  readonly label: string;
  readonly level: string;
  readonly levelType: 'warning' | 'normal';
  readonly value: string;
  readonly unit: string;
  readonly insight: string;
  readonly points: readonly number[];
}

interface LabTrackedMetricCardProps {
  readonly metric: TrackedMetricCardData;
}

export const LabTrackedMetricCard: React.FC<LabTrackedMetricCardProps> = ({ metric }) => {
  const isWarning = metric.levelType === 'warning';

  return (
    <div className="bg-white rounded-[26px] p-5 shadow-xs border border-slate-100 flex flex-col gap-3 relative">
      <div className="flex items-center justify-between">
        <span className="text-base font-black text-slate-900">{metric.label}</span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            isWarning ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#EAF8F0] text-[#166534]'
          }`}
        >
          {metric.level}
        </span>
      </div>

      <div className="flex items-baseline">
        <span className="text-4xl font-black text-slate-900 tracking-tight">{metric.value}</span>
        <span className="text-xs font-medium text-slate-500 ml-1.5">{metric.unit}</span>
      </div>

      {/* Trend Chart */}
      <LabTrendChart points={metric.points} isAmber={isWarning} />

      {/* Callout Insight */}
      <div className="bg-[#EAF8F0] border border-teal-100/70 rounded-2xl p-3 flex items-start gap-2">
        <span className="text-teal-700 text-xs font-black mt-0.5">✦</span>
        <span className="text-xs font-bold text-slate-800 leading-relaxed">{metric.insight}</span>
      </div>
    </div>
  );
};

