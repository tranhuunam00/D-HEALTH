import React, { useMemo } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { HomeBottomNav } from '../home/HomeBottomNav';
import { PassportIdentityCard } from './components/PassportIdentityCard';
import { PassportTilesGrid } from './components/PassportTilesGrid';
import { useRecordsLogic, type PassportCounts } from './useRecordsLogic';
import { ScreenHeaderPills } from '../../components/molecules/ScreenHeaderPills';

interface SCR10Props {
  readonly onNavigate: (screen: string) => void;
  readonly onSelectMember?: (memberId: string) => void;
  readonly activeMemberName?: string;
  readonly activeMemberId?: string;
}

const TILE_SCREEN_MAP: Record<keyof PassportCounts, string> = {
  allergies: 'emergency',
  chronic: 'chronic',
  meds: 'meds',
  labs: 'labs',
  imaging: 'imaging',
  pathology: 'camera-ocr',
  documents: 'records',
  doctors: 'care',
  facilities: 'care',
};

export const SCR10_RecordsScreen: React.FC<SCR10Props> = ({
  onNavigate,
  onSelectMember,
  activeMemberName = '',
  activeMemberId = 'nam',
}) => {
  const { member, counts } = useRecordsLogic(activeMemberId);

  const effectiveMember = useMemo(
    () =>
      member || {
        id: activeMemberId,
        fullName: activeMemberName,
        isOwner: true,
        relationship: 'Chủ tài khoản',
        gender: 'Nam',
        age: 46,
        heightCm: 174,
        weightKg: 72.5,
        bmi: 23.9,
        bloodType: 'O+',
      },
    [member, activeMemberId, activeMemberName]
  );

  const handleTileSelect = (tileKey: keyof PassportCounts) => {
    const screen = TILE_SCREEN_MAP[tileKey] || 'records';
    onNavigate(screen);
  };

  return (
    <div className="w-full min-h-screen bg-[#F3F6F9] text-slate-800 flex flex-col font-sans select-none relative pb-20">
      <div className="px-4 pt-3 pb-32 flex flex-col gap-3 flex-1 overflow-y-auto">
        {/* Header Badges */}
        <ScreenHeaderPills
          activeMemberName={effectiveMember.fullName}
          onSelectMember={() => onSelectMember?.('family')}
        />

        {/* Title */}
        <div>
          <h1 className="text-[26px] font-black tracking-tight text-slate-900 leading-tight">
            Hồ sơ y tế
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Medical Passport
          </p>
        </div>

        {/* Identity Card */}
        <PassportIdentityCard
          member={effectiveMember}
          onSwitchMember={() => onSelectMember?.('family')}
        />

        {/* 3x3 Passport Grid */}
        <PassportTilesGrid
          counts={counts}
          onSelectTile={handleTileSelect}
        />
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-20">
        <button
          type="button"
          onClick={() => onNavigate('camera-ocr')}
          className="bg-[#111827] text-white font-extrabold text-xs px-4 py-3 rounded-full shadow-lg flex items-center gap-1.5 active:scale-95 transition hover:bg-slate-850"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nhập kết quả</span>
        </button>
      </div>

      {/* Bottom Nav */}
      <HomeBottomNav
        activeTab="records"
        onTabChange={(tab) => onNavigate(tab)}
      />
    </div>
  );
};
