import React from 'react';
import { Camera, ChevronRight, User } from 'lucide-react';
import { useImagingLogic, ModalityCode, ImagingStudyItem } from './useImagingLogic';
import { HealthCategoryTabs, HealthTabId } from '../../components/molecules/HealthCategoryTabs';
import { HomeBottomNav } from '../home/HomeBottomNav';
import { LesionTrackingSection } from './components/LesionTrackingSection';
import { RecistEvaluationSection } from './components/RecistEvaluationSection';

interface SCR07Props {
  readonly onNavigate: (screen: string, studyId?: string) => void;
  readonly activeMemberName?: string;
  readonly activeMemberId?: string;
}

const MODALITY_CHIPS: readonly { id: ModalityCode; label: string }[] = Object.freeze([
  { id: 'ALL', label: 'Tất cả' },
  { id: 'SA', label: 'SA' },
  { id: 'XQ', label: 'XQ' },
  { id: 'MM', label: 'MM' },
  { id: 'CT', label: 'CT' },
  { id: 'MRI', label: 'MRI' },
]);

const getModalityBadgeStyle = (modality: string) => {
  switch (modality) {
    case 'CT':
      return 'bg-[#EDE9FE] text-[#7C3AED]';
    case 'SA':
      return 'bg-[#E0F2FE] text-[#0284C7]';
    case 'MRI':
      return 'bg-[#CCFBF1] text-[#0F766E]';
    case 'MM':
      return 'bg-[#FFE4E6] text-[#E11D48]';
    case 'XQ':
    default:
      return 'bg-[#F1F5F9] text-[#475569]';
  }
};

export const SCR07_ImagingScreen: React.FC<SCR07Props> = ({
  onNavigate,
  activeMemberName = 'Trần Hữu Nam',
  activeMemberId = 'nam',
}) => {
  const {
    selectedModality,
    setSelectedModality,
    filteredStudies,
    loading,
    trackLesionsEnabled,
    setTrackLesionsEnabled,
    recistEnabled,
    setRecistEnabled,
    tumorTracking,
    recistEvaluation,
  } = useImagingLogic(activeMemberId);

  const handleSelectHealthTab = (tab: HealthTabId) => {
    if (tab === 'biometrics') onNavigate('biometrics');
    else if (tab === 'labs') onNavigate('labs');
    else if (tab === 'chronic') onNavigate('chronic');
  };

  return (
    <div className="w-full min-h-screen relative bg-[#EEF2F6] text-[#111827] flex flex-col font-sans select-none pb-24">
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 flex flex-col gap-3">
        {/* 1. Header Pills */}
        <div className="flex gap-2 items-center flex-wrap shrink-0">
          <span className="inline-flex items-center gap-1.5 h-6.5 px-3 rounded-full bg-white text-slate-700 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Hôm nay: 26/10/2026
          </span>
          <span className="inline-flex items-center gap-1.5 h-6.5 px-3 rounded-full bg-[#111827] text-white text-xs font-semibold shadow-2xs">
            <User className="w-3.5 h-3.5 text-slate-300" />
            Hồ sơ sức khoẻ: <b>{activeMemberName}</b>
          </span>
        </div>

        {/* 2. Tiêu đề Sức khoẻ */}
        <h1 className="text-[26px] font-black tracking-tight text-slate-900 leading-none mt-0.5">
          Sức khoẻ
        </h1>

        {/* 3. Category Tabs */}
        <HealthCategoryTabs activeTab="imaging" onSelectTab={handleSelectHealthTab} />

        {/* 4. Section: Kết quả chẩn đoán hình ảnh */}
        <div className="flex justify-between items-baseline pt-1">
          <span className="text-base font-extrabold text-slate-900">
            Kết quả chẩn đoán hình ảnh
          </span>
        </div>

        {/* 5. Modality Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 shrink-0 no-scrollbar">
          {MODALITY_CHIPS.map((chip) => {
            const isSelected = selectedModality.toUpperCase() === chip.id.toUpperCase();
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedModality(chip.id)}
                className={`h-7.5 px-3 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-[#111827] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* 6. Danh sách kết quả CĐHA với In-frame Scroll */}
        <div className="bg-white rounded-3xl border border-slate-200/60 p-3 flex flex-col shadow-xs">
          <div className="max-h-[290px] overflow-y-auto divide-y divide-slate-100 pr-1">
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Đang tải kết quả...</div>
            ) : filteredStudies.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Chưa có kết quả chẩn đoán hình ảnh
              </div>
            ) : (
              filteredStudies.map((study) => (
                <div
                  key={study.id}
                  onClick={() => onNavigate('imaging-detail', study.id)}
                  className="py-2.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/60 transition rounded-xl px-1.5"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span
                      className={`w-9 h-7 rounded-xl text-xs font-black flex items-center justify-center shrink-0 ${getModalityBadgeStyle(
                        study.modality
                      )}`}
                    >
                      {study.modality}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {study.title}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 shrink-0">
                          <span>{study.studyDate}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium truncate block mt-0.5">
                        {study.conclusion}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 text-center text-[10.5px] text-slate-400 font-medium border-t border-slate-100 mt-1">
            {filteredStudies.length} kết quả · hiển thị 5 mới nhất, kéo trong khung để xem thêm
          </div>
        </div>

        {/* 7. Nút Nhập kết quả CĐHA / File DICOM */}
        <button
          onClick={() => onNavigate('camera-ocr')}
          className="h-11 rounded-2xl bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-95 transition"
        >
          <Camera className="w-4 h-4" />
          <span>Nhập kết quả CĐHA / File DICOM</span>
        </button>

        {/* 8. Section: Theo dõi kích thước tổn thương */}
        <LesionTrackingSection
          enabled={trackLesionsEnabled}
          onToggle={setTrackLesionsEnabled}
          trackingData={tumorTracking}
        />

        {/* 9. Section: Đánh giá đáp ứng RECIST 1.1 */}
        <RecistEvaluationSection
          enabled={recistEnabled}
          onToggle={setRecistEnabled}
          evaluationData={recistEvaluation}
        />
      </div>

      {/* 10. Bottom Navigation Bar */}
      <HomeBottomNav activeTab="health" onNavigate={onNavigate} />
    </div>
  );
};
