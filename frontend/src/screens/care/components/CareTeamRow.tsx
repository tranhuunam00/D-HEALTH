import React from 'react';
import { Plus } from 'lucide-react';
import type { CareTeamMember } from '../useCareLogic';

interface CareTeamRowProps {
  team: CareTeamMember[];
  selectedId: string;
  onSelectMember: (id: string) => void;
  onAddDoctor: () => void;
}

export const CareTeamRow: React.FC<CareTeamRowProps> = ({
  team,
  selectedId,
  onSelectMember,
  onAddDoctor,
}) => {
  const getBadgeStyle = (color: string) => {
    switch (color) {
      case 'mint':
        return 'bg-[#CCFBF1] text-[#0F766E]';
      case 'purple':
        return 'bg-[#EDE9FE] text-[#6D28D9]';
      case 'pink':
      default:
        return 'bg-[#FCE7F3] text-[#BE185D]';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-extrabold text-slate-900">
          My Care Team
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          Chạm để xem, sửa liên hệ
        </span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none px-0.5">
        {team.map((member) => {
          const isSelected = member.id === selectedId;
          const badgeClass = getBadgeStyle(member.color);

          return (
            <button
              key={member.id}
              type="button"
              onClick={() => onSelectMember(member.id)}
              className={`min-w-[84px] w-[84px] shrink-0 rounded-[22px] p-2 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 text-center min-h-[88px] ${
                isSelected
                  ? 'bg-white border-2 border-slate-900 shadow-sm ring-1 ring-slate-900/10'
                  : 'bg-white border border-slate-100 shadow-2xs hover:border-slate-300'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-full ${badgeClass} font-black text-xs flex items-center justify-center shadow-2xs`}
              >
                {member.code}
              </div>
              <span className="text-[11px] font-bold text-slate-800 leading-tight truncate w-full px-1">
                {member.role}
              </span>
            </button>
          );
        })}

        {/* Nút Thêm bác sĩ dạng viền nét đứt */}
        <button
          type="button"
          onClick={onAddDoctor}
          className="min-w-[84px] w-[84px] shrink-0 rounded-[22px] p-2 border-2 border-dashed border-slate-300 bg-white/50 hover:bg-white text-center flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 min-h-[88px]"
        >
          <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-200 text-slate-600 font-bold text-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-slate-600" />
          </div>
          <span className="text-[11px] font-bold text-slate-700 leading-tight">
            Thêm bác sĩ
          </span>
        </button>
      </div>
    </div>
  );
};
