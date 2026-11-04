import React from 'react';

export interface HomeAiInsightCardProps {
  onNavigateAi?: () => void;
}

export const HomeAiInsightCard: React.FC<HomeAiInsightCardProps> = ({
  onNavigateAi,
}) => {
  return (
    <div
      onClick={onNavigateAi}
      className="bg-gradient-to-r from-[#E6F5F2] via-[#EDF3FC] to-[#FCEEE7] rounded-[24px] p-4 flex items-center justify-between border border-teal-100/60 shadow-xs cursor-pointer hover:opacity-95 transition-all"
    >
      <div className="flex items-center gap-3 min-w-0 pr-2">
        <div className="w-11 h-11 rounded-full bg-[#1F7A8C] text-white flex items-center justify-center shrink-0 shadow-xs">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
            <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
          </svg>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-black text-[#1F7A8C] uppercase tracking-wider block">AI INSIGHT</span>
          <span className="text-xs font-bold text-slate-900 leading-snug mt-0.5">
            LDL–C tăng trong 3 lần xét nghiệm gần nhất.
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNavigateAi?.();
        }}
        className="px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shrink-0 shadow-xs active:scale-95 transition min-h-[36px]"
      >
        Xem phân tích
      </button>
    </div>
  );
};
