import React from 'react';
import { ChevronRight, Plus, Check, FileText } from 'lucide-react';
import { useLabsLogic, LabSpecialtyCode, TRACKED_METRICS_CONFIG } from './useLabsLogic';
import { HomeBottomNav } from '../home/HomeBottomNav';
import { ScreenHeaderPills } from '../../components/molecules/ScreenHeaderPills';
import { HealthCategoryTabs, HealthTabId } from '../../components/molecules/HealthCategoryTabs';
import { LabTrackedMetricCard } from './components/LabTrackedMetricCard';

export interface SCR05Props {
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
  activeMemberName = '',
  activeMemberId = 'nam',
}) => {
  const {
    selectedCategory,
    setSelectedCategory,
    trackedMetricIds,
    toggleTrackedMetric,
    filteredReports,
    activeTrackedMetrics,
    loading,
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

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans select-none pb-24">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32 flex flex-col gap-3.5">
        <ScreenHeaderPills
          activeMemberName={activeMemberName}
          onSelectMember={() => onNavigate('family')}
        />

        <h1 className="text-[28px] font-black tracking-tight text-slate-900 leading-tight pt-1">
          Sức khoẻ
        </h1>

        <HealthCategoryTabs
          activeTab="labs"
          onSelectTab={(tab: HealthTabId) => {
            if (tab === 'biometrics') onNavigate('biometrics');
            else if (tab === 'imaging') onNavigate('imaging');
            else if (tab === 'chronic') onNavigate('chronic');
          }}
        />

        {/* Section: Kết quả xét nghiệm */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-slate-900">Kết quả xét nghiệm</h2>
            <button
              type="button"
              onClick={() => onNavigate('camera-ocr')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1F7A8C] text-white text-xs font-bold shadow-xs hover:bg-[#186372] active:scale-95 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Nhập phiếu mới</span>
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {SPECIALTY_PILLS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedCategory(p.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition ${
                  selectedCategory === p.id
                    ? 'bg-[#1F7A8C] text-white font-bold shadow-xs'
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

          <div className="bg-white rounded-[24px] shadow-xs border border-slate-100 overflow-hidden flex flex-col">
            <div className="max-h-[290px] overflow-y-auto divide-y divide-slate-100">
              {loading ? (
                <div className="py-8 text-center text-xs text-slate-400">Đang tải phiếu xét nghiệm...</div>
              ) : filteredReports.length === 0 ? (
                <div className="py-8 px-4 flex flex-col items-center justify-center gap-2.5 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#1F7A8C] flex items-center justify-center">
                    <FileText className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-slate-800">Chưa có phiếu xét nghiệm nào trong hồ sơ</span>
                    <span className="text-xs text-slate-400 max-w-[280px]">
                      Bạn có thể chụp ảnh phiếu khám hoặc nhập tay các chỉ số xét nghiệm để theo dõi
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('camera-ocr')}
                    className="mt-1 px-4 py-2 rounded-xl bg-[#1F7A8C] text-white text-xs font-bold shadow-xs hover:bg-[#186372] active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Nhập / Tải lên phiếu xét nghiệm</span>
                  </button>
                </div>
              ) : (
                filteredReports.map((report) => (
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
                ))
              )}
            </div>

            <div className="p-2.5 text-center text-[11px] text-slate-400 font-medium bg-slate-50/50 border-t border-slate-100">
              {filteredReports.length} kết quả · hiển thị 5 mới nhất, kéo trong khung để xem thêm
            </div>
          </div>
        </div>

        {/* Section: Chỉ số cần theo dõi */}
        <div className="flex flex-col gap-2.5 pt-1">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-slate-900">Chỉ số cần theo dõi</h2>
            <span className="text-xs text-slate-500 font-semibold">
              Đã chọn {activeTrackedMetrics.length}/{TRACKED_METRICS_CONFIG.length}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {TRACKED_METRICS_CONFIG.map((metric) => {
              const isTracked = trackedMetricIds.includes(metric.id);
              return (
                <button
                  key={metric.id}
                  type="button"
                  onClick={() => toggleTrackedMetric(metric.id)}
                  className={`px-3 py-1.5 rounded-full text-xs transition flex items-center gap-1 shrink-0 ${
                    isTracked
                      ? 'bg-[#1F7A8C] text-white font-bold shadow-xs'
                      : 'bg-white text-slate-700 font-semibold border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isTracked ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{metric.label}</span>
                </button>
              );
            })}
          </div>

          {activeTrackedMetrics.map((m) => (
            <LabTrackedMetricCard key={m.id} metric={m} />
          ))}
        </div>
      </div>

      <HomeBottomNav
        activeTab="health"
        onTabChange={(tab) => onNavigate(tab)}
      />
    </div>
  );
};
