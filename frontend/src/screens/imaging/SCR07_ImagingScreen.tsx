import React from 'react';
import { Camera, ChevronRight, Layers, Film, ArrowUpRight } from 'lucide-react';
import { useImagingLogic, ModalityType } from './useImagingLogic';
import { HealthCategoryTabs, HealthTabId } from '../../components/molecules/HealthCategoryTabs';
import { HomeBottomNav } from '../home/HomeBottomNav';

interface SCR07Props {
  readonly onNavigate: (screen: string, studyId?: string) => void;
  readonly activeMemberName?: string;
}

const MODALITY_CHIPS: readonly { id: ModalityType; label: string }[] = Object.freeze([
  { id: 'all', label: 'Tất cả' },
  { id: 'mri', label: 'MRI' },
  { id: 'ct', label: 'CT Scan' },
  { id: 'xray', label: 'X-quang' },
  { id: 'ultrasound', label: 'Siêu âm' },
]);

export const SCR07_ImagingScreen: React.FC<SCR07Props> = ({
  onNavigate,
  activeMemberName = 'Trần Hữu Nam',
}) => {
  const { selectedModality, setSelectedModality, filteredStudies } = useImagingLogic();

  const handleSelectHealthTab = (tab: HealthTabId) => {
    if (tab === 'biometrics') onNavigate('biometrics');
    else if (tab === 'labs') onNavigate('labs');
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
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-[#111827] text-white text-xs font-semibold shadow-xs">
            Hồ sơ: <b>{activeMemberName}</b>
          </span>
        </div>

        {/* 2. Tiêu đề */}
        <span className="text-[28px] font-extrabold tracking-tight">Sức khoẻ</span>

        {/* 3. Category Tabs */}
        <HealthCategoryTabs activeTab="imaging" onSelectTab={handleSelectHealthTab} />

        {/* 4. Modality Horizontal Carousel Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0 no-scrollbar">
          {MODALITY_CHIPS.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSelectedModality(chip.id)}
              className={`h-7 px-3 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedModality === chip.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* 5. Nút Nhập kết quả CĐHA */}
        <button
          onClick={() => onNavigate('camera-ocr')}
          className="h-12 rounded-2xl bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition"
        >
          <Camera className="w-4 h-4" />
          <span>Nhập kết quả CĐHA / File DICOM</span>
        </button>

        {/* 6. Danh sách ca chẩn đoán hình ảnh */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-xs font-bold text-slate-900 px-1">
            <span>Danh sách ca chụp CĐHA ({filteredStudies.length})</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {filteredStudies.map((study) => (
              <div
                key={study.id}
                onClick={() => onNavigate('imaging-detail', study.id)}
                className="bg-white rounded-3xl p-4 flex flex-col gap-2.5 shadow-xs border border-slate-200/60 cursor-pointer hover:border-[#1F7A8C]/50 transition"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Film className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{study.title}</div>
                      <div className="text-xs text-slate-500 font-medium">
                        {study.facility} · {study.studyDate}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium truncate flex-1 pr-2">
                    {study.conclusion}
                  </span>
                  <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                    <Layers className="w-3 h-3 text-purple-600" />
                    {study.modalityName}
                  </span>
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
