import React from 'react';
import { Camera, ChevronRight, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useLabsLogic, LabCategory } from './useLabsLogic';
import { HealthCategoryTabs, HealthTabId } from '../../components/molecules/HealthCategoryTabs';
import { HomeBottomNav } from '../home/HomeBottomNav';

interface SCR05Props {
  readonly onNavigate: (screen: string, reportId?: string) => void;
  readonly activeMemberName?: string;
}

const CATEGORY_CHIPS: readonly { id: LabCategory; label: string }[] = Object.freeze([
  { id: 'all', label: 'Tất cả' },
  { id: 'biochemistry', label: 'Sinh hoá' },
  { id: 'hematology', label: 'Huyết học' },
  { id: 'urinalysis', label: 'Nước tiểu' },
]);

export const SCR05_LabsScreen: React.FC<SCR05Props> = ({
  onNavigate,
  activeMemberName = 'Trần Hữu Nam',
}) => {
  const { selectedCategory, setSelectedCategory, filteredReports } = useLabsLogic();

  const handleSelectHealthTab = (tab: HealthTabId) => {
    if (tab === 'biometrics') onNavigate('biometrics');
    else if (tab === 'imaging') onNavigate('imaging');
    else if (tab === 'chronic') onNavigate('chronic');
  };

  return (
    <div className="w-[390px] h-[844px] relative overflow-hidden bg-[#EEF2F6] text-[#111827] flex flex-col font-sans select-none">
      <div className="flex-1 overflow-y-auto px-4 pt-12 pb-24 flex flex-col gap-3.5">
        {/* 1. Header Pills */}
        <div className="flex gap-1.5 items-center flex-wrap shrink-0">
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-white text-slate-700 text-xs font-semibold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Hôm nay: 26/10/2026
          </span>
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-[#111827] text-white text-xs font-semibold shadow-xs">
            Hồ sơ: <b>{activeMemberName}</b>
          </span>
        </div>

        {/* 2. Tiêu đề */}
        <span className="text-[28px] font-extrabold tracking-tight">Sức khoẻ</span>

        {/* 3. Category Tabs */}
        <HealthCategoryTabs activeTab="labs" onSelectTab={handleSelectHealthTab} />

        {/* 4. Sub-category Horizontal Carousel Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0 no-scrollbar">
          {CATEGORY_CHIPS.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSelectedCategory(chip.id)}
              className={`h-7 px-3 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === chip.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* 5. Nút Nhập kết quả XN nhanh (Camera OCR) */}
        <button
          onClick={() => onNavigate('camera-ocr')}
          className="h-12 rounded-2xl bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition"
        >
          <Camera className="w-4 h-4" />
          <span>Nhập kết quả xét nghiệm (Chụp ảnh / File)</span>
        </button>

        {/* 6. Danh sách phiếu xét nghiệm */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-xs font-bold text-slate-900 px-1">
            <span>Danh sách phiếu xét nghiệm ({filteredReports.length})</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => onNavigate('lab-detail', report.id)}
                className="bg-white rounded-3xl p-4 flex flex-col gap-2.5 shadow-xs border border-slate-200/60 cursor-pointer hover:border-[#1F7A8C]/50 transition"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#1F7A8C] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{report.title}</div>
                      <div className="text-xs text-slate-500 font-medium">
                        {report.facility} · {report.testDate}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium truncate flex-1 pr-2">
                    {report.summary}
                  </span>
                  {report.abnormalCount > 0 ? (
                    <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      {report.abnormalCount} vượt ngưỡng
                    </span>
                  ) : (
                    <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Bình thường
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Bottom Navigation */}
      <HomeBottomNav
        activeTab="health"
        onTabChange={(tab) => onNavigate(tab)}
      />
    </div>
  );
};
