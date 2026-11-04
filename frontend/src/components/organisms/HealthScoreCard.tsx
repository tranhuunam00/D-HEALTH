import React from 'react';
import { HealthScore } from '../../types/member.types';
import { ShieldCheck, HeartPulse, Pill, FileText } from 'lucide-react';

export const HealthScoreCard: React.FC<{ score: HealthScore }> = ({ score }) => {
  return (
    <div className="p-4 rounded-3xl bg-gradient-to-br from-[#1F7A8C]/25 via-slate-900/90 to-slate-900 border border-[#1F7A8C]/30 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HeartPulse className="w-4 h-4 text-[#1F7A8C]" />
          Chỉ Số Sức Khỏe Tổng Thể
        </span>
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          {score.status}
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* Vòng tròn điểm số SVG */}
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#1F7A8C]"
              strokeDasharray={`${score.total}, 100`}
              strokeLinecap="round"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-black text-white">{score.total}</span>
            <span className="text-[9px] text-slate-400 -mt-1">/100</span>
          </div>
        </div>

        {/* 3 Trụ cột chấm điểm chuẩn y khoa */}
        <div className="flex-1 space-y-2 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-0.5 text-[11px]">
              <span className="flex items-center gap-1"><HeartPulse className="w-3 h-3 text-rose-400" /> Sinh trắc học (40%)</span>
              <span className="font-bold">{score.biometrics}/40</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(score.biometrics / 40) * 100}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-0.5 text-[11px]">
              <span className="flex items-center gap-1"><Pill className="w-3 h-3 text-amber-400" /> Tuân thủ thuốc (35%)</span>
              <span className="font-bold">{score.medications}/35</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(score.medications / 35) * 100}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-0.5 text-[11px]">
              <span className="flex items-center gap-1"><FileText className="w-3 h-3 text-blue-400" /> Cận lâm sàng (25%)</span>
              <span className="font-bold">{score.clinical}/25</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(score.clinical / 25) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
