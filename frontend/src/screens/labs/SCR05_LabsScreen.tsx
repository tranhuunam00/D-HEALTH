import React from 'react';
import { ChevronRight, Plus, Check } from 'lucide-react';
import { useLabsLogic, LabSpecialtyCode, TRACKED_METRICS_CONFIG } from './useLabsLogic';
import { HomeBottomNav } from '../home/HomeBottomNav';
import { ScreenHeaderPills } from '../../components/molecules/ScreenHeaderPills';
import { HealthCategoryTabs, HealthTabId } from '../../components/molecules/HealthCategoryTabs';

interface SCR05Props {
  readonly onNavigate: (screen: string, reportId?: string) => void;
  readonly activeMemberName?: string;
  readonly activeMemberId?: string;
}

const SPECIALTY_PILLS: readonly { id: LabSpecialtyCode; label: string }[] = Object.freeze([
  { id: 'all', label: 'Tất cả' },
  { id: 'HH', label: 'HH' },
  { id: 'SH', label: 'SH' },
  { id: 'VS', label: 'VS' },
  { id: 'PT', label: 'PT' },
  { id: 'DT', label: 'DT' },
]);

export const SCR05_LabsScreen: React.FC<SCR05Props> = ({
  onNavigate,
  activeMemberName = 'Trần Hữu Nam',
  activeMemberId = 'nam',
}) => {
  const {
    selectedCategory,
    setSelectedCategory,
    trackedMetricIds,
    toggleTrackedMetric,
    filteredReports,
    activeTrackedMetrics,
  } = useLabsLogic(activeMemberId);

  const getBadgeStyle = (code: 'SH' | 'HH' | 'VS' | 'PT' | 'DT') => {
    switch (code) {
      case 'SH': return 'bg-sky-100 text-sky-700';
      case 'HH': return 'bg-rose-100 text-rose-700';
      case 'VS': return 'bg-emerald-100 text-emerald-700';
      case 'PT': return 'bg-purple-100 text-purple-700';
      case 'DT': return 'bg-amber-100 text-amber-700';
      default: return 'bg-sky-100 text-sky-700';
    }
  };

  const renderTrendChart = (points: readonly number[], isAmber: boolean) => {
    const min = Math.min(...points) * 0.9;
    const max = Math.max(...points) * 1.1;
    const range = max - min || 1;
    const strokeColor = isAmber ? '#D97706' : '#0D9488';
    const fillColor = isAmber ? 'url(#amberGrad)' : 'url(#tealGrad)';

    const coords = points.map((val, idx) => {
      const x = 20 + idx * 60;
      const y = 70 - ((val - min) / range) * 50;
      return { x, y };
    });

    const pathD = coords.reduce((acc, c, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`, '');
    const areaD = `${pathD} L ${coords[coords.length - 1].x} 80 L ${coords[0].x} 80 Z`;

    return (
      <svg className="w-full h-20 overflow-visible" viewBox="0 0 280 85">
        <defs>
          <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0D9488" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D97706" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Reference Dashed Line */}
        <line x1="10" y1="42" x2="270" y2="42" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="1" />
        {/* Area fill */}
        <path d={areaD} fill={fillColor} />
        {/* Line */}
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Points */}
        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r="3.5" fill="#FFFFFF" stroke={strokeColor} strokeWidth="2" />
        ))}
      </svg>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans select-none pb-24">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32 flex flex-col gap-3.5">
        {/* 1. Header Badges */}
        <ScreenHeaderPills
          activeMemberName={activeMemberName}
          onSelectMember={() => onNavigate('family')}
        />

        {/* 2. Tiêu đề Sức khoẻ */}
        <h1 className="text-[28px] font-black tracking-tight text-slate-900 leading-tight pt-1">
          Sức khoẻ
        </h1>

        {/* 3. Category Tabs 1 dòng */}
        <HealthCategoryTabs
          activeTab="labs"
          onSelectTab={(tab: HealthTabId) => {
            if (tab === 'biometrics') onNavigate('biometrics');
            else if (tab === 'imaging') onNavigate('imaging');
            else if (tab === 'chronic') onNavigate('chronic');
          }}
        />

        {/* 4. Section: Kết quả xét nghiệm */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-black text-slate-900 px-1">Kết quả xét nghiệm</h2>

          {/* Horizontal Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {SPECIALTY_PILLS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedCategory(p.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition ${
                  selectedCategory === p.id
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-600 font-semibold border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-400 font-medium px-1 -mt-0.5">
            HH Huyết học · SH Sinh hoá · VS Vi sinh · PT Sinh học phân tử · DT Di truyền
          </span>

          {/* List Card with internal scroll */}
          <div className="bg-white rounded-[24px] shadow-xs border border-slate-100 overflow-hidden flex flex-col">
            <div className="max-h-[290px] overflow-y-auto divide-y divide-slate-100">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => onNavigate('lab-detail', report.id)}
                  className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${getBadgeStyle(report.categoryBadge)}`}>
                      {report.categoryBadge}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-slate-900 truncate">{report.title}</span>
                      <span className="text-xs text-slate-400 font-medium truncate">{report.summary}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs text-slate-400 font-medium">{report.testDate}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 text-center text-[11px] text-slate-400 font-medium bg-slate-50/50 border-t border-slate-100">
              {filteredReports.length} kết quả · hiển thị 5 mới nhất, kéo trong khung để xem thêm
            </div>
          </div>
        </div>

        {/* 5. Section: Chỉ số cần theo dõi */}
        <div className="flex flex-col gap-2.5 pt-1">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-slate-900">Chỉ số cần theo dõi</h2>
            <span className="text-xs text-slate-500 font-semibold">
              Đã chọn {activeTrackedMetrics.length}/{TRACKED_METRICS_CONFIG.length}
            </span>
          </div>

          {/* Tracked chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {TRACKED_METRICS_CONFIG.map((metric) => {
              const isTracked = trackedMetricIds.includes(metric.id);
              return (
                <button
                  key={metric.id}
                  onClick={() => toggleTrackedMetric(metric.id)}
                  className={`px-3 py-1.5 rounded-full text-xs transition flex items-center gap-1 shrink-0 ${
                    isTracked
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'bg-white text-slate-700 font-semibold border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isTracked ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{metric.label}</span>
                </button>
              );
            })}
          </div>

          {/* Trend Line Cards for Active Tracked Metrics */}
          {activeTrackedMetrics.map((m) => {
            const isWarning = m.levelType === 'warning';
            return (
              <div
                key={m.id}
                className="bg-white rounded-[26px] p-5 shadow-xs border border-slate-100 flex flex-col gap-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-slate-900">{m.label}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isWarning
                        ? 'bg-[#FEF3C7] text-[#D97706]'
                        : 'bg-[#EAF8F0] text-[#166534]'
                    }`}
                  >
                    {m.level}
                  </span>
                </div>

                <div className="flex items-baseline">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">{m.value}</span>
                  <span className="text-xs font-medium text-slate-500 ml-1.5">{m.unit}</span>
                </div>

                {/* Trend Chart */}
                {renderTrendChart(m.points, isWarning)}

                {/* Callout Insight */}
                <div className="bg-[#EAF8F0] border border-teal-100/70 rounded-2xl p-3 flex items-start gap-2">
                  <span className="text-teal-700 text-xs font-black mt-0.5">✦</span>
                  <span className="text-xs font-bold text-slate-800 leading-relaxed">{m.insight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <HomeBottomNav
        activeTab="health"
        onTabChange={(tab) => onNavigate(tab)}
      />
    </div>
  );
};
