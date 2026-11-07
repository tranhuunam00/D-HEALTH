import React from 'react';
import { ArrowLeft, Paperclip } from 'lucide-react';
import { useCameraInputLogic } from './useCameraInputLogic';
import { LabManualSection } from './components/LabManualSection';
import { ImagingManualSection } from './components/ImagingManualSection';
import { PathologyManualSection } from './components/PathologyManualSection';
import { LinkCSYTSection } from './components/LinkCSYTSection';
import { AICameraSection } from './components/AICameraSection';
import { CameraTypeAndMethodTabs } from './components/CameraTypeAndMethodTabs';
import { CameraCommonManualForm } from './components/CameraCommonManualForm';
import { CameraFloatingBottomBar } from './components/CameraFloatingBottomBar';

import { ClinicalDocKind } from './camera-input.types';

interface SCR12Props {
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberName?: string;
  readonly activeMemberId?: string;
  readonly initialKind?: ClinicalDocKind;
}

export const SCR12_CameraInputScreen: React.FC<SCR12Props> = ({
  onNavigate,
  activeMemberId = 'mem_145deb71',
  initialKind = 'lab',
}) => {
  const logic = useCameraInputLogic(activeMemberId, initialKind);

  const handleSaveAndReturn = () => {
    logic.handleSave(() => {
      alert('Đã lưu kết quả thành công vào Hồ sơ y tế số!');
      onNavigate(logic.kind === 'lab' ? 'labs' : logic.kind === 'img' ? 'imaging' : 'records');
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#EEF2F6] text-[#111827] flex flex-col font-sans select-none pb-28">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 flex flex-col gap-3.5">
        {/* Topbar với nút Back */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => onNavigate(logic.kind === 'lab' ? 'labs' : logic.kind === 'img' ? 'imaging' : 'records')}
            aria-label="Quay lại"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white text-slate-800 flex items-center justify-center shadow-xs active:scale-95 transition shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-black text-slate-900 leading-tight">
            Nhập kết quả cận lâm sàng
          </h1>
        </div>

        {/* LOẠI KẾT QUẢ & CÁCH NHẬP */}
        <CameraTypeAndMethodTabs
          kind={logic.kind}
          method={logic.method}
          onSetKind={logic.setKind}
          onSetMethod={logic.setMethod}
        />

        {/* NHẬP DỮ LIỆU HOẶC THÔNG TIN TÍNH NĂNG */}
        <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
          {logic.method === 'manual' ? 'NHẬP DỮ LIỆU THỦ CÔNG' : 'THÔNG TIN TÍNH NĂNG'}
        </span>

        {/* Form chung khi nhập thủ công */}
        {logic.method === 'manual' && (
          <CameraCommonManualForm
            testDate={logic.testDate}
            doctorName={logic.doctorName}
            facilityName={logic.facilityName}
            onTestDateChange={logic.setTestDate}
            onDoctorNameChange={logic.setDoctorName}
            onFacilityNameChange={logic.setFacilityName}
          />
        )}

        {/* Sections chi tiết theo loại kết quả và cách nhập */}
        {logic.method === 'manual' && logic.kind === 'lab' && (
          <LabManualSection
            rows={logic.rows}
            onAddRow={logic.addRow}
            onRemoveRow={logic.removeRow}
            onUpdateRow={logic.updateRow}
            showCls={logic.showCls}
            sugCode={logic.sugCode}
            mixed={logic.mixed}
            mixList={logic.mixList}
            curCode={logic.curCode}
            overridden={logic.overridden}
            onSelectCls={logic.setSelectedCls}
            onResetCls={logic.resetCls}
          />
        )}

        {logic.method === 'manual' && logic.kind === 'img' && (
          <ImagingManualSection
            modality={logic.modality}
            onModalityChange={logic.setModality}
            organ={logic.organ}
            onOrganChange={logic.setOrgan}
            organOther={logic.organOther}
            onOrganOtherChange={logic.setOrganOther}
            conclusion={logic.conclusion}
            onConclusionChange={logic.setConclusion}
            isNormal={logic.isNormal}
            onIsNormalChange={logic.setIsNormal}
            lesions={logic.lesions}
            onAddLesion={logic.addLesion}
            onRemoveLesion={logic.removeLesion}
            onUpdateLesion={logic.updateLesion}
          />
        )}

        {logic.method === 'manual' && logic.kind === 'gpb' && (
          <PathologyManualSection
            biopsyType={logic.biopsyType}
            onBiopsyTypeChange={logic.setBiopsyType}
            sampleSite={logic.sampleSite}
            onSampleSiteChange={logic.setSampleSite}
            specimenCode={logic.specimenCode}
            onSpecimenCodeChange={logic.setSpecimenCode}
            diagnosis={logic.diagnosis}
            onDiagnosisChange={logic.setDiagnosis}
            histologicGrade={logic.histologicGrade}
            onHistologicGradeChange={logic.setHistologicGrade}
            pTNM={logic.pTNM}
            onPTNMChange={logic.setPTNM}
            resectionMargin={logic.resectionMargin}
            onResectionMarginChange={logic.setResectionMargin}
            markers={logic.markers}
            onAddMarker={logic.addMarker}
            onRemoveMarker={logic.removeMarker}
            onUpdateMarker={logic.updateMarker}
          />
        )}

        {logic.method === 'manual' && (
          <button
            type="button"
            onClick={() => alert('Mở trình tải file ảnh / PDF')}
            className="h-11 min-h-[44px] rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
          >
            <Paperclip className="w-4 h-4 text-slate-500" />
            <span>Đính kèm ảnh / PDF phiếu kết quả</span>
          </button>
        )}

        {logic.method === 'link' && (
          <LinkCSYTSection
            onSwitchToManual={() => logic.setMethod('manual')}
          />
        )}

        {logic.method === 'cam' && (
          <AICameraSection
            kind={logic.kind}
            onSwitchToManual={() => logic.setMethod('manual')}
          />
        )}
      </div>

      {/* Floating Bottom Action Bar */}
      <CameraFloatingBottomBar
        method={logic.method}
        isSaving={logic.isSaving}
        onSaveAndReturn={handleSaveAndReturn}
        onSwitchToManual={() => logic.setMethod('manual')}
      />
    </div>
  );
};
