import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { HealthScore } from '../../../types/member.types';

export interface HomeHealthScoreCardProps {
  healthScore: HealthScore;
  onNavigateBiometrics?: () => void;
}

export const HomeHealthScoreCard: React.FC<HomeHealthScoreCardProps> = ({
  healthScore,
  onNavigateBiometrics,
}) => {
  const displayScore = healthScore.total > 0 ? healthScore.total : '--';
  const scoreNum = typeof displayScore === 'number' ? displayScore : parseFloat(String(displayScore));
  const hasScore = !isNaN(scoreNum) && scoreNum > 0;
  const clampedScore = hasScore ? Math.min(100, Math.max(0, scoreNum)) : 50;
  const angleRad = Math.PI * (1 - clampedScore / 100);
  const indicatorX = Math.round(150 + 116 * Math.cos(angleRad));
  const indicatorY = Math.round(150 - 116 * Math.sin(angleRad));

  return (
    <div
      onClick={onNavigateBiometrics}
      className="bg-white rounded-[28px] p-5 shadow-xs border border-slate-100 relative flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Top-Right Status Badge (Black pill) */}
      <span className="absolute right-4 top-4 bg-slate-900 text-white rounded-full px-3 py-1 text-xs font-bold shadow-2xs">
        {healthScore.status || 'Chưa có số đo'}
      </span>

      <div className="relative w-[260px] h-[142px] flex items-center justify-center mt-1">
        <svg width="260" height="142" viewBox="0 0 300 168" className="overflow-visible">
          <defs>
            <linearGradient id="gauge" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#EF4444" />
              <stop offset="0.45" stopColor="#F59E0B" />
              <stop offset="0.75" stopColor="#EAB308" />
              <stop offset="1" stopColor="#22C55E" />
            </linearGradient>
          </defs>
          <path d="M 34 150 A 116 116 0 0 1 266 150" fill="none" stroke="#F1F5F9" strokeWidth="20" strokeLinecap="round" />
          <path d="M 34 150 A 116 116 0 0 1 266 150" fill="none" stroke="url(#gauge)" strokeWidth="20" strokeLinecap="round" />
          {hasScore && (
            <circle cx={indicatorX} cy={indicatorY} r="8.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" className="drop-shadow-xs" />
          )}
        </svg>

        <div className="absolute bottom-2 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            Điểm sức khoẻ
          </span>
          <div className="flex items-baseline leading-none">
            <span className="text-4xl font-black text-slate-900 tracking-tight">
              {displayScore}
            </span>
            {hasScore && (
              <span className="text-emerald-500 text-xs font-black ml-1">▲</span>
            )}
          </div>
        </div>
      </div>

      {/* Two Pills below Arc (1:1 with Design) */}
      <div className="flex items-center gap-2 mt-3 w-full justify-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/70 text-amber-900 text-xs font-bold">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          2 vấn đề cần theo dõi
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/70 text-slate-700 text-xs font-bold">
          9 nhóm dữ liệu
        </span>
      </div>
    </div>
  );
};
