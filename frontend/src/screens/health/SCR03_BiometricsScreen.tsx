import React from 'react';
import { Plus, ChevronRight, Activity } from 'lucide-react';
import { useBiometricsLogic } from './useBiometricsLogic';
import { HealthCategoryTabs, HealthTabId } from '../../components/molecules/HealthCategoryTabs';
import { BiometricRangeChart } from '../../components/organisms/BiometricRangeChart';
import { HomeBottomNav, NavTabId } from '../home/HomeBottomNav';
import { BiometricEntrySheet } from '../../components/organisms/BiometricEntrySheet';

interface SCR03Props {
  readonly onNavigate: (screen: string) => void;
  readonly onSelectMember?: (memberId: string) => void;
  readonly activeMemberName?: string;
}

export const SCR03_BiometricsScreen: React.FC<SCR03Props> = ({
  onNavigate,
  onSelectMember,
  activeMemberName = 'Trần Hữu Nam',
}) => {
  const {
    history,
    isEntrySheetOpen,
    openEntrySheet,
    closeEntrySheet,
  } = useBiometricsLogic();

  const handleSelectTab = (tab: HealthTabId) => {
    if (tab === 'labs') onNavigate('labs');
    else if (tab === 'imaging') onNavigate('imaging');
    else if (tab === 'chronic') onNavigate('chronic');
  };

  return (
    <div className="w-full min-h-screen relative bg-[#EEF2F6] text-[#111827] flex flex-col font-sans select-none pb-20">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 flex flex-col gap-3.5">
        {/* 1. Header Pills */}
        <div className="flex gap-1.5 items-center flex-wrap shrink-0">
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-white text-slate-700 text-xs font-semibold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Hôm nay: 26/10/2026
          </span>
          <button
            onClick={() => onSelectMember?.('family')}
            className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-[#111827] text-white text-xs font-semibold shadow-xs hover:bg-slate-800"
          >
            <span className="w-4 h-4 rounded-full bg-white text-[#111827] text-[10px] font-black flex items-center justify-center">
              N
            </span>
            Hồ sơ: <b>{activeMemberName}</b>
          </button>
        </div>

        {/* 2. Tiêu đề màn hình */}
        <div className="flex items-center justify-between">
          <span className="text-[28px] font-extrabold tracking-tight">Sức khoẻ</span>
          <button
            onClick={openEntrySheet}
            className="w-9 h-9 rounded-full bg-[#1F7A8C] text-white flex items-center justify-center shadow-md active:scale-95"
            title="Nhập số đo mới"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* 3. Category Tabs */}
        <HealthCategoryTabs activeTab="biometrics" onSelectTab={handleSelectTab} />

        {/* 4. Device Sync Banner */}
        <div
          onClick={() => onNavigate('devices')}
          className="flex items-center gap-2.5 bg-white rounded-2xl p-3 shadow-xs cursor-pointer hover:bg-slate-50 transition"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="flex-1 text-xs text-slate-700 font-semibold truncate">
            Đồng bộ từ thiết bị: Apple Watch, Omron (5p trước)
          </span>
          <span className="text-xs font-bold text-[#1F7A8C] shrink-0 flex items-center">
            Thiết bị <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* 5. Biometric Range Chart Organism */}
        <BiometricRangeChart
          metricType="bp"
          title="Huyết áp"
          latestValue="131/82"
          unit="mmHg"
          recordedWhen="Hôm nay 07:15"
          statusTag="Tốt"
          statusBg="#DCFCE7"
          statusFg="#166534"
        />

        {/* 6. In-Frame Scroll History (Max 5 Recent Entries) */}
        <div className="bg-white rounded-3xl p-4 flex flex-col gap-2 shadow-xs border border-slate-200/60">
          <div className="flex justify-between items-center text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
            <span>Lịch sử đo gần đây</span>
            <span className="text-[11px] text-slate-400 font-semibold">Tối đa 5 lần</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {history.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.source === 'device' ? 'bg-[#1F7A8C]' : 'bg-[#F59E0B]'
                    }`}
                  />
                  <div>
                    <div className="font-bold text-slate-900">{item.value} {item.unit}</div>
                    <div className="text-[11px] text-slate-400">{item.recordedAt}</div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === 'normal'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {item.status === 'normal' ? 'Ổn định' : 'Chú ý'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Bottom Navigation */}
      <HomeBottomNav
        activeTab="health"
        onTabChange={(tab: NavTabId) => {
          if (tab === 'home') onNavigate('home');
          else if (tab === 'records') onNavigate('records');
          else if (tab === 'ai') onNavigate('ai');
          else if (tab === 'care') onNavigate('care');
        }}
      />

      {/* 8. Manual Entry Bottom Sheet */}
      <BiometricEntrySheet
        isOpen={isEntrySheetOpen}
        onClose={closeEntrySheet}
        onSubmit={closeEntrySheet}
      />
    </div>
  );
};
