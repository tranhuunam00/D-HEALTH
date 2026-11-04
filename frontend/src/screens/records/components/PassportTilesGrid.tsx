import React from 'react';
import type { PassportCounts } from '../useRecordsLogic';

export interface TileConfig {
  key: keyof PassportCounts;
  code: string;
  label: string;
  badgeBg: string;
  badgeText: string;
  cardBg: string;
  countColor?: string;
  labelColor?: string;
}

const TILES: TileConfig[] = [
  {
    key: 'allergies',
    code: 'DƯ',
    label: 'Dị ứng',
    badgeBg: 'bg-[#FFE4E6]',
    badgeText: 'text-[#E11D48]',
    cardBg: 'bg-white',
  },
  {
    key: 'chronic',
    code: 'BL',
    label: 'Bệnh đã mắc',
    badgeBg: 'bg-[#E0E7FF]',
    badgeText: 'text-[#4338CA]',
    cardBg: 'bg-white',
  },
  {
    key: 'meds',
    code: 'TH',
    label: 'Thuốc',
    badgeBg: 'bg-[#D1FAE5]',
    badgeText: 'text-[#059669]',
    cardBg: 'bg-white',
  },
  {
    key: 'labs',
    code: 'XN',
    label: 'Xét nghiệm',
    badgeBg: 'bg-white/25',
    badgeText: 'text-white',
    cardBg: 'bg-[#2563EB] shadow-md shadow-blue-500/20',
    countColor: 'text-white',
    labelColor: 'text-white/95',
  },
  {
    key: 'imaging',
    code: 'CĐ',
    label: 'CĐHA',
    badgeBg: 'bg-white/25',
    badgeText: 'text-white',
    cardBg: 'bg-[#7C3AED] shadow-md shadow-purple-500/20',
    countColor: 'text-white',
    labelColor: 'text-white/95',
  },
  {
    key: 'pathology',
    code: 'GPB',
    label: 'Giải phẫu bệnh',
    badgeBg: 'bg-white/25',
    badgeText: 'text-white',
    cardBg: 'bg-[#BE123C] shadow-md shadow-rose-500/20',
    countColor: 'text-white',
    labelColor: 'text-white/95',
  },
  {
    key: 'documents',
    code: 'TL',
    label: 'Tài liệu',
    badgeBg: 'bg-[#FFEDD5]',
    badgeText: 'text-[#C2410C]',
    cardBg: 'bg-white',
  },
  {
    key: 'doctors',
    code: 'BS',
    label: 'Bác sĩ',
    badgeBg: 'bg-[#E0F2FE]',
    badgeText: 'text-[#0284C7]',
    cardBg: 'bg-white',
  },
  {
    key: 'facilities',
    code: 'CS',
    label: 'Cơ sở y tế',
    badgeBg: 'bg-[#DCFCE7]',
    badgeText: 'text-[#15803D]',
    cardBg: 'bg-white',
  },
];

interface PassportTilesGridProps {
  counts: PassportCounts;
  onSelectTile: (tileKey: keyof PassportCounts) => void;
}

export const PassportTilesGrid: React.FC<PassportTilesGridProps> = ({
  counts,
  onSelectTile,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {TILES.map((t) => {
        const count = counts[t.key] ?? 0;
        const countColor = t.countColor || 'text-slate-900';
        const labelColor = t.labelColor || 'text-slate-700';

        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onSelectTile(t.key)}
            className={`${t.cardBg} rounded-[20px] p-3 border border-slate-100/80 flex flex-col items-start justify-between min-h-[96px] text-left transition-all active:scale-95`}
          >
            <span
              className={`${t.badgeBg} ${t.badgeText} text-[10px] font-black px-2 py-0.5 rounded-full inline-block leading-tight`}
            >
              {t.code}
            </span>
            <div className="mt-1">
              <span className={`text-[11px] font-bold ${labelColor} block leading-tight line-clamp-1`}>
                {t.label}
              </span>
              <span className={`text-xl font-black ${countColor} mt-0.5 block leading-none`}>
                {count}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
