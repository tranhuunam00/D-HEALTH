import React from 'react';
import { ArrowLeft, Edit3, Link2, Camera, Paperclip } from 'lucide-react';
import { useCameraInputLogic } from './useCameraInputLogic';
import { LabManualSection } from './components/LabManualSection';
import { ImagingManualSection } from './components/ImagingManualSection';
import { PathologyManualSection } from './components/PathologyManualSection';
import { LinkCSYTSection } from './components/LinkCSYTSection';
import { AICameraSection } from './components/AICameraSection';

interface SCR12Props {
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberName?: string;
  readonly activeMemberId?: string;
}

export const SCR12_CameraInputScreen: React.FC<SCR12Props> = ({
  onNavigate,
  activeMemberName = 'Trần Minh Khang',
  activeMemberId = 'me',
}) => {
  const logic = useCameraInputLogic(activeMemberId);

  const handleSaveAndReturn = () => {
    logic.handleSave(() => {
      alert('Đã lưu kết quả thành công vào Hồ sơ y tế số!');
      onNavigate(logic.kind === 'lab' ? 'labs' : logic.kind === 'img' ? 'imaging' : 'records');
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#EEF2F6] text-[#111827] flex flex-col font-sans select-none pb-28">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 flex flex-col gap-3.5">
        {/* 1. Header Badges */}
        <div className="flex gap-1.5 items-center flex-wrap shrink-0">
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-white text-slate-700 text-xs font-semibold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Hôm nay: 26/10/2026
          </span>
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-[#111827] text-white text-xs font-semibold shadow-xs">
            Hồ sơ: <b>{activeMemberName}</b>
          </span>
        </div>

        {/* 2. Topbar với nút Back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('records')}
            aria-label="Quay lại"
            className="w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-xs active:scale-95 transition shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-base font-extrabold text-slate-900 leading-tight">
            Nhập kết quả cận lâm sàng
          </span>
        </div>

        {/* 3. Bước 1: LOẠI KẾT QUẢ */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">1. LOẠI KẾT QUẢ</span>
          <div className="grid grid-cols-3 gap-1 bg-slate-200/80 p-1 rounded-2xl" role="tablist">
            {[
              { id: 'lab', label: 'Xét nghiệm' },
              { id: 'img', label: 'CĐHA' },
              { id: 'gpb', label: 'GPB' },
            ].map((k) => (
              <button
                key={k.id}
                role="tab"
                aria-selected={logic.kind === k.id}
                onClick={() => logic.setKind(k.id as any)}
                className={`h-10 rounded-xl text-xs font-extrabold transition ${
                  logic.kind === k.id ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-500 px-1">CĐHA: chẩn đoán hình ảnh · GPB: giải phẫu bệnh</span>
        </div>

        {/* 4. Bước 2: CÁCH NHẬP */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">2. CÁCH NHẬP</span>
          <div className="grid grid-cols-3 gap-2" role="tablist">
            {[
              { id: 'manual', label: 'Nhập thủ công', icon: Edit3 },
              { id: 'link', label: 'Từ link CSYT', icon: Link2 },
              { id: 'cam', label: 'AI Camera', icon: Camera },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = logic.method === m.id;
              return (
                <button
                  key={m.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => logic.setMethod(m.id as any)}
                  className={`h-18 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 text-xs font-extrabold transition p-1 ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-transparent bg-white text-slate-700 hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Bước 3: NHẬP DỮ LIỆU */}
        <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">3. NHẬP DỮ LIỆU</span>

        {/* Form chung (ngày, bác sĩ, cơ sở y tế) khi nhập thủ công */}
        {logic.method === 'manual' && (
          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-500 text-xs font-bold block mb-1">Ngày thực hiện *</label>
                <input
                  type="date"
                  value={logic.testDate}
                  onChange={(e) => logic.setTestDate(e.target.value)}
                  className="w-full h-10 px-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-500 text-xs font-bold block mb-1">Bác sĩ thực hiện</label>
                <input
                  value={logic.doctorName}
                  onChange={(e) => logic.setDoctorName(e.target.value)}
                  placeholder="Họ tên bác sĩ"
                  className="w-full h-10 px-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-slate-500 text-xs font-bold block mb-1">Nơi thực hiện</label>
              <input
                value={logic.facilityName}
                onChange={(e) => logic.setFacilityName(e.target.value)}
                placeholder="Tên bệnh viện / phòng khám"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>
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
            className="h-11 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
          >
            <Paperclip className="w-4 h-4 text-slate-500" />
            <span>Đính kèm ảnh / PDF phiếu kết quả</span>
          </button>
        )}

        {logic.method === 'link' && (
          <LinkCSYTSection
            linkUrl={logic.linkUrl}
            onLinkUrlChange={logic.setLinkUrl}
            linkUsername={logic.linkUsername}
            onLinkUsernameChange={logic.setLinkUsername}
            linkPassword={logic.linkPassword}
            onLinkPasswordChange={logic.setLinkPassword}
            captchaCode={logic.captchaCode}
            onCaptchaCodeChange={logic.setCaptchaCode}
          />
        )}

        {logic.method === 'cam' && <AICameraSection kind={logic.kind} />}
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto p-3.5 bg-white/95 backdrop-blur-md border-t border-slate-100 flex gap-2.5 z-30">
        {logic.method === 'cam' && (
          <>
            <button
              type="button"
              onClick={() => alert('Chụp lại tài liệu')}
              className="w-28 h-12 rounded-full border border-slate-300 text-slate-800 text-xs font-bold flex items-center justify-center active:scale-95 transition"
            >
              Chụp lại
            </button>
            <button
              type="button"
              onClick={handleSaveAndReturn}
              className="flex-1 h-12 rounded-full bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] text-white text-xs font-extrabold flex items-center justify-center shadow-lg active:scale-95 transition"
            >
              Có, thêm vào hồ sơ
            </button>
          </>
        )}

        {logic.method === 'manual' && (
          <button
            type="button"
            onClick={handleSaveAndReturn}
            disabled={logic.isSaving}
            className="w-full h-12 rounded-full bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] text-white text-xs font-extrabold flex items-center justify-center shadow-lg active:scale-95 transition"
          >
            {logic.isSaving ? 'Đang lưu...' : 'Lưu vào hồ sơ'}
          </button>
        )}

        {logic.method === 'link' && (
          <button
            type="button"
            onClick={handleSaveAndReturn}
            className="w-full h-12 rounded-full bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] text-white text-xs font-extrabold flex items-center justify-center shadow-lg active:scale-95 transition"
          >
            Tải kết quả từ cơ sở y tế
          </button>
        )}
      </div>
    </div>
  );
};
