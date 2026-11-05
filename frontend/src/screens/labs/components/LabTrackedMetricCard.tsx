import React from 'react';
import { LabTrendChart } from './LabTrendChart';

export interface TrackedMetricCardData {
  readonly id: string;
  readonly label: string;
  readonly level: string;
  readonly levelType: 'warning' | 'normal' | 'info';
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
  const hasData = metric.value !== '--' && Array.isArray(metric.points) && metric.points.length > 0;

  return (
    <div className="bg-white rounded-[26px] p-5 shadow-xs border border-slate-100 flex flex-col gap-3 relative">
      <div className="flex items-center justify-between">
        <span className="text-base font-black text-slate-900">{metric.label}</span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            !hasData
              ? 'bg-slate-100 text-slate-500'
              : isWarning
              ? 'bg-[#FEF3C7] text-[#D97706]'
              : metric.levelType === 'info'
              ? 'bg-sky-100 text-sky-800'
              : 'bg-[#EAF8F0] text-[#166534]'
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
      <div
        className={`rounded-2xl p-3 flex items-start gap-2 border ${
          !hasData
            ? 'bg-slate-50/80 border-slate-200/80'
            : isWarning
            ? 'bg-amber-50/80 border-amber-200/70'
            : 'bg-[#EAF8F0] border-teal-100/70'
        }`}
      >
        <span className={`text-xs font-black mt-0.5 ${!hasData ? 'text-slate-400' : isWarning ? 'text-amber-700' : 'text-teal-700'}`}>✦</span>
        <span className={`text-xs ${!hasData ? 'text-slate-500 font-medium' : 'text-slate-800 font-bold'} leading-relaxed`}>
          {metric.insight}
        </span>
      </div>
    </div>
  );
};
