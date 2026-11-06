import React from 'react';
import { Heart, Droplet, Activity, Edit3, Trash2, TriangleAlert, Calendar } from 'lucide-react';
import type { ChronicConditionItem } from '../useChronicLogic';
import { CHRONIC_RISK_KEYWORDS, CHRONIC_STATUS_KEYWORDS, CHRONIC_TYPE_KEYWORDS } from '../chronic.constants';

interface DynamicConditionCardProps {
  readonly condition: ChronicConditionItem;
  readonly onEdit?: (condition: ChronicConditionItem) => void;
  readonly onDelete?: (conditionId: string) => void;
}

function formatDateDisplay(dateStr?: string): string {
  if (!dateStr) return '--/--/----';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

interface ConditionTheme {
  readonly riskLevel: 'low' | 'medium' | 'high';
  readonly badgeText: string;
  readonly badgeBg: string;
  readonly badgeTextCol: string;
  readonly badgeBorder: string;
  readonly dotBg: string;
  readonly iconBg: string;
  readonly iconColor: string;
  readonly iconBorder: string;
  readonly cardBorder: string;
  readonly sparklineColor: string;
}

function getConditionTheme(condition: ChronicConditionItem): ConditionTheme {
  const summaryLower = (condition.status_summary || '').toLowerCase();
  const risk = (condition.risk_level || '').toLowerCase();

  const isHighRisk =
    risk === 'high' ||
    CHRONIC_RISK_KEYWORDS.high.some((kw) => summaryLower.includes(kw));

  const isLowRisk =
    risk === 'low' ||
    CHRONIC_RISK_KEYWORDS.low.some((kw) => summaryLower.includes(kw));

  if (isHighRisk) {
    return {
      riskLevel: 'high',
      badgeText: condition.status_summary || 'Nguy cơ cao · Cần khám',
      badgeBg: 'bg-rose-50',
      badgeTextCol: 'text-rose-800',
      badgeBorder: 'border-rose-200',
      dotBg: 'bg-rose-500',
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      iconBorder: 'border-rose-200',
      cardBorder: 'border-rose-200/90 shadow-rose-100/30',
      sparklineColor: '#E11D48',
    };
  }

  if (isLowRisk) {
    return {
      riskLevel: 'low',
      badgeText: condition.status_summary || 'Nguy cơ thấp · Ổn định',
      badgeBg: 'bg-emerald-50',
      badgeTextCol: 'text-emerald-800',
      badgeBorder: 'border-emerald-200',
      dotBg: 'bg-emerald-500',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      iconBorder: 'border-emerald-200',
      cardBorder: 'border-emerald-200/90 shadow-emerald-100/30',
      sparklineColor: '#059669',
    };
  }

  // Medium risk / Ổn định / Theo dõi (Mặc định)
  return {
    riskLevel: 'medium',
    badgeText: condition.status_summary || 'Nguy cơ trung bình · Ổn định',
    badgeBg: 'bg-amber-50',
    badgeTextCol: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    dotBg: 'bg-amber-500',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    iconBorder: 'border-amber-200',
    cardBorder: 'border-amber-200/90 shadow-amber-100/30',
    sparklineColor: '#D97706',
  };
}

export const DynamicConditionCard: React.FC<DynamicConditionCardProps> = ({
  condition,
  onEdit,
  onDelete,
}) => {
  const nameLower = condition.condition_name.toLowerCase();
  const isCardio = CHRONIC_TYPE_KEYWORDS.cardio.some((kw) => nameLower.includes(kw));
  const isDiabetes = CHRONIC_TYPE_KEYWORDS.diabetes.some((kw) => nameLower.includes(kw));

  const theme = getConditionTheme(condition);
  const metrics = condition.target_metrics || [];

  return (
    <div className={`bg-white rounded-3xl p-4 border ${theme.cardBorder} shadow-xs flex flex-col gap-3 transition-all`}>
      {/* 1. Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${theme.iconBg} ${theme.iconColor} ${theme.iconBorder}`}
          >
            {isCardio ? (
              <Heart className="w-5 h-5 fill-current" />
            ) : isDiabetes ? (
              <Droplet className="w-5 h-5 fill-current" />
            ) : (
              <Activity className="w-5 h-5" />
            )}
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 leading-tight">
              {condition.condition_name}
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${theme.badgeBg} ${theme.badgeTextCol} ${theme.badgeBorder}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${theme.dotBg}`} />
                <span>{theme.badgeText}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* ECG Sparkline nếu là bệnh tim mạch */}
          {isCardio && (
            <div className="w-14 h-7 pt-1 opacity-80 hidden sm:block">
              <svg viewBox="0 0 70 20" className="w-full h-full overflow-visible">
                <path
                  d="M 0 10 L 15 10 L 22 2 L 28 18 L 35 7 L 42 12 L 50 10 L 70 10"
                  fill="none"
                  stroke={theme.sparklineColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}

          {/* Action Buttons */}
          <button
            type="button"
            onClick={() => onEdit?.(condition)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition active:scale-95 cursor-pointer"
            title="Sửa bệnh này"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(condition.id)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center transition active:scale-95 cursor-pointer"
            title="Xóa bệnh này"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-bold text-slate-800">
        {metrics.map((m, idx) => {
          const statusLower = (m.status || '').toLowerCase();
          const isDanger = m.type === 'danger' || CHRONIC_STATUS_KEYWORDS.danger.some((kw) => statusLower.includes(kw));
          const isWarning = m.type === 'warning' || CHRONIC_STATUS_KEYWORDS.warning.some((kw) => statusLower.includes(kw));
          const isGood = m.type === 'good' || CHRONIC_STATUS_KEYWORDS.good.some((kw) => statusLower.includes(kw));

          const dotBg = isDanger ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500';
          const textColor = isDanger ? 'text-rose-700' : isWarning ? 'text-amber-700' : 'text-emerald-700';

          return (
            <div
              key={`${m.name}-${idx}`}
              className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-2.5 flex flex-col justify-between h-14"
            >
              <span className="text-[11px] font-semibold text-slate-600 block truncate">
                {m.name}
              </span>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${textColor}`}>
                {isDanger ? (
                  <TriangleAlert className="w-3 h-3 fill-rose-600 text-white shrink-0" />
                ) : (
                  <span className={`w-2 h-2 rounded-full ${dotBg} shrink-0`} />
                )}
                <span className="truncate">{m.status || (isGood ? 'Tốt' : 'Theo dõi')}</span>
              </div>
            </div>
          );
        })}

        {/* 3. Tái khám Card */}
        {condition.next_checkup_date && (
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-2.5 flex flex-col justify-between h-14">
            <span className="text-[11px] font-semibold text-slate-500 block truncate">Tái khám</span>
            <div className="flex items-center gap-1 text-xs font-black text-slate-800 truncate">
              <Calendar className="w-3 h-3 text-[#1F7A8C] shrink-0" />
              <span>{formatDateDisplay(condition.next_checkup_date)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
