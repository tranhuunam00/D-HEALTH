import React from 'react';
import { FlaskConical, Scan } from 'lucide-react';

export interface HomeTimelineCardProps {
  onNavigateRecords?: () => void;
  onNavigateLabs?: () => void;
  onNavigateImaging?: () => void;
}

export const HomeTimelineCard: React.FC<HomeTimelineCardProps> = ({
  onNavigateRecords,
  onNavigateLabs,
  onNavigateImaging,
}) => {
  return (
    <div className="bg-white rounded-[24px] p-4.5 border border-slate-100 shadow-xs flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold text-slate-900">Health Timeline</span>
        <button
          type="button"
          onClick={onNavigateRecords}
          className="text-xs font-bold text-[#1F7A8C] hover:underline"
        >
          Xem tất cả
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {/* Timeline Item 1: Xét nghiệm máu */}
        <div
          onClick={onNavigateLabs}
          className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <FlaskConical className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-bold text-slate-900">Xét nghiệm máu</span>
          </div>
          <span className="text-xs font-semibold text-slate-400">20/10</span>
        </div>

        {/* Timeline Item 2: CT ngực */}
        <div
          onClick={onNavigateImaging}
          className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Scan className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-bold text-slate-900">CT ngực</span>
          </div>
          <span className="text-xs font-semibold text-slate-400">08/10</span>
        </div>
      </div>
    </div>
  );
};
