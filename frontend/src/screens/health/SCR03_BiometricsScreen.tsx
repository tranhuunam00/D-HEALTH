import React from 'react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { useBiometricsLogic } from './useBiometricsLogic';
import { HomeBottomNav } from '../home/HomeBottomNav';
import { BiometricEntrySheet } from '../../components/organisms/BiometricEntrySheet';
import { ScreenHeaderPills } from '../../components/molecules/ScreenHeaderPills';
import { HealthCategoryTabs, HealthTabId } from '../../components/molecules/HealthCategoryTabs';
import { BiometricsChartSection } from './components/BiometricsChartSection';
import { BiometricsMetricTilesGrid } from './components/BiometricsMetricTilesGrid';
import { BiometricsHistorySection } from './components/BiometricsHistorySection';

export interface SCR03Props {
  readonly onNavigate: (screen: string) => void;
  readonly onSelectMember?: (memberId: string) => void;
  readonly activeMemberName?: string;
  readonly activeMemberId?: string;
}

export const SCR03_BiometricsScreen: React.FC<SCR03Props> = ({
  onNavigate,
  onSelectMember,
  activeMemberName = '',
  activeMemberId = 'nam',
}) => {
  const {
    activeMetric,
    setActiveMetric,
    filteredHistory,
    metricsSummaries,
    activeMetricObj,
    isEntrySheetOpen,
    openEntrySheet,
    closeEntrySheet,
    handleSaveBiometrics,
    successMsg,
  } = useBiometricsLogic(activeMemberId);

  const isNoData = activeMetricObj.value === '--' || activeMetricObj.value === '--/--';
  const latestRecordedAt = filteredHistory[0]?.recordedAt || null;

  const connectedDevicesCount = (() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('dhealth_connected_devices');
        if (stored) {
          const ids = JSON.parse(stored);
          return Array.isArray(ids) ? ids.length : 0;
        }
      } catch {}
    }
    return 0;
  })();

  const handleSelectHealthTab = (tab: HealthTabId) => {
    if (tab === 'labs') onNavigate('labs');
    else if (tab === 'imaging') onNavigate('imaging');
    else if (tab === 'chronic') onNavigate('chronic');
  };

  // Tạo danh sách 7 ngày gần nhất kết thúc vào hôm nay
  const now = new Date();
  const daySlots = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${day}`;
    return { day, dateKey };
  });

  const calculateHeightPercent = (valStr: string, metric: string): number => {
    if (metric === 'bp') {
      const parts = valStr.split('/');
      const sys = parseFloat(parts[0]) || 120;
      return Math.min(95, Math.max(25, Math.round(((Math.min(180, Math.max(90, sys)) - 80) / 100) * 70 + 25)));
    }
    if (metric === 'hr') {
      const hr = parseFloat(valStr) || 75;
      return Math.min(95, Math.max(25, Math.round(((Math.min(160, Math.max(40, hr)) - 40) / 120) * 70 + 25)));
    }
    if (metric === 'spo2') {
      const sp = parseFloat(valStr) || 98;
      return Math.min(95, Math.max(25, Math.round(((Math.min(100, Math.max(80, sp)) - 80) / 20) * 70 + 25)));
    }
    if (metric === 'temp') {
      const t = parseFloat(valStr.replace(',', '.')) || 36.5;
      return Math.min(95, Math.max(25, Math.round(((Math.min(41, Math.max(35, t)) - 35) / 6) * 70 + 25)));
    }
    if (metric === 'bmi') {
      const b = parseFloat(valStr.replace(',', '.')) || 22;
      return Math.min(95, Math.max(25, Math.round(((Math.min(35, Math.max(15, b)) - 15) / 20) * 70 + 25)));
    }
    const num = parseFloat(valStr) || 50;
    return Math.min(95, Math.max(25, Math.round((num % 60) + 30)));
  };

  const hasAnyCalendarMatch = daySlots.some((slot) =>
    filteredHistory.some((r) => r.measuredAt && r.measuredAt.slice(0, 10) === slot.dateKey)
  );

  const chartBars = daySlots.map((slot, idx) => {
    let readingForSlot: typeof filteredHistory[0] | undefined;

    if (hasAnyCalendarMatch) {
      readingForSlot = filteredHistory.find(
        (r) => r.measuredAt && r.measuredAt.slice(0, 10) === slot.dateKey
      );
    } else if (filteredHistory.length > 0) {
      const offset = daySlots.length - filteredHistory.length;
      if (idx >= offset) {
        const histIdx = filteredHistory.length - 1 - (idx - offset);
        readingForSlot = filteredHistory[histIdx];
      }
    }

    if (!readingForSlot || isNoData) {
      return {
        day: slot.day,
        height: '6px',
        value: '',
        isLatest: false,
        hasData: false,
        source: undefined,
      };
    }

    const isLatest = readingForSlot.id === filteredHistory[0]?.id;
    const heightPercent = calculateHeightPercent(readingForSlot.value, activeMetric);

    return {
      day: slot.day,
      height: `${heightPercent}%`,
      value: readingForSlot.value,
      isLatest,
      hasData: true,
      source: readingForSlot.source,
    };
  });

  return (
    <div className="w-full min-h-screen relative bg-[#EEF2F6] text-[#111827] flex flex-col font-sans select-none pb-24">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32 flex flex-col gap-3">
        {/* 1. Header Pills */}
        <ScreenHeaderPills
          activeMemberName={activeMemberName}
          onSelectMember={() => onSelectMember ? onSelectMember('family') : onNavigate('family')}
        />

        {/* 2. Tiêu đề màn hình */}
        <div className="flex items-center justify-between pt-1">
          <h1 className="text-[28px] font-black tracking-tight text-slate-900 leading-tight">Sức khoẻ</h1>
        </div>

        {/* 3. Category Tabs 1 dòng */}
        <HealthCategoryTabs activeTab="biometrics" onSelectTab={handleSelectHealthTab} />

        {/* 4. Device Sync Banner */}
        <div
          onClick={() => onNavigate('devices')}
          className="flex items-center justify-between bg-white rounded-2xl p-3 shadow-xs border border-slate-100 cursor-pointer hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                connectedDevicesCount > 0 ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            <span className="text-xs text-slate-700 font-semibold truncate">
              {connectedDevicesCount > 0
                ? `Đồng bộ từ thiết bị đo (${connectedDevicesCount}) · 5 phút trước`
                : 'Chưa có thiết bị nào kết nối. Chạm để ghép nối thiết bị đo'}
            </span>
          </div>
          <span className="text-xs font-bold text-[#1F7A8C] shrink-0 flex items-center gap-0.5">
            Thiết bị <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Success toast notification */}
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 5. Detail & 7-Day Bar Chart Card */}
        <BiometricsChartSection
          activeMetricObj={activeMetricObj}
          isNoData={isNoData}
          latestRecordedAt={latestRecordedAt}
          chartBars={chartBars}
          filteredHistory={filteredHistory}
          onOpenEntrySheet={openEntrySheet}
        />

        {/* 6. Lưới 8 chỉ số đo */}
        <BiometricsMetricTilesGrid
          metricsSummaries={metricsSummaries}
          activeMetric={activeMetric}
          onSelectMetric={setActiveMetric}
        />

        {/* 7. Lịch sử đo gần đây với In-Frame Internal Scroll */}
        <BiometricsHistorySection
          activeMetricName={activeMetricObj.name}
          history={filteredHistory}
        />
      </div>

      {/* 8. Bottom Navigation */}
      <HomeBottomNav
        activeTab="health"
        onTabChange={(tab) => {
          if (tab === 'home') onNavigate('home');
          else if (tab === 'records') onNavigate('records');
          else if (tab === 'ai') onNavigate('ai');
          else if (tab === 'care') onNavigate('care');
          else if (tab === 'health') onNavigate('biometrics');
        }}
      />

      {/* 9. Manual Entry Bottom Sheet */}
      <BiometricEntrySheet
        isOpen={isEntrySheetOpen}
        onClose={closeEntrySheet}
        onSubmit={handleSaveBiometrics}
      />
    </div>
  );
};
