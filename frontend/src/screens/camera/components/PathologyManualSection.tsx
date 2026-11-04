import React from 'react';
import { Plus, X } from 'lucide-react';
import { PathologyMarker } from '../camera-input.types';

interface PathologyManualSectionProps {
  biopsyType: string;
  onBiopsyTypeChange: (val: string) => void;
  sampleSite: string;
  onSampleSiteChange: (val: string) => void;
  specimenCode: string;
  onSpecimenCodeChange: (val: string) => void;
  diagnosis: string;
  onDiagnosisChange: (val: string) => void;
  histologicGrade: string;
  onHistologicGradeChange: (val: string) => void;
  pTNM: string;
  onPTNMChange: (val: string) => void;
  resectionMargin: string;
  onResectionMarginChange: (val: string) => void;
  markers: PathologyMarker[];
  onAddMarker: () => void;
  onRemoveMarker: (index: number) => void;
  onUpdateMarker: (index: number, patch: Partial<PathologyMarker>) => void;
}

export const PathologyManualSection: React.FC<PathologyManualSectionProps> = ({
  biopsyType,
  onBiopsyTypeChange,
  sampleSite,
  onSampleSiteChange,
  specimenCode,
  onSpecimenCodeChange,
  diagnosis,
  onDiagnosisChange,
  histologicGrade,
  onHistologicGradeChange,
  pTNM,
  onPTNMChange,
  resectionMargin,
  onResectionMarginChange,
  markers,
  onAddMarker,
  onRemoveMarker,
  onUpdateMarker,
}) => {
  return (
    <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex flex-col gap-3">
      {/* 1. Loại bệnh phẩm & Vị trí lấy mẫu */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="text-slate-500 text-xs font-bold block mb-1">Loại bệnh phẩm</label>
          <select
            value={biopsyType}
            onChange={(e) => onBiopsyTypeChange(e.target.value)}
            className="w-full h-10 px-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none"
          >
            <option>Sinh thiết kim</option>
            <option>Sinh thiết mở</option>
            <option>Bệnh phẩm phẫu thuật</option>
            <option>Tế bào học (FNA)</option>
            <option>Tế bào học dịch</option>
          </select>
        </div>

        <div>
          <label className="text-slate-500 text-xs font-bold block mb-1">Vị trí lấy mẫu</label>
          <select
            value={sampleSite}
            onChange={(e) => onSampleSiteChange(e.target.value)}
            className="w-full h-10 px-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none"
          >
            <option>Gan</option>
            <option>Phổi</option>
            <option>Tuyến giáp</option>
            <option>Tuyến vú</option>
            <option>Hạch</option>
            <option>Dạ dày</option>
            <option>Đại trực tràng</option>
            <option>Thận</option>
            <option>Tiền liệt tuyến</option>
            <option>Da</option>
            <option>Khác…</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-slate-500 text-xs font-bold block mb-1">Số GPB / mã tiêu bản</label>
        <input
          value={specimenCode}
          onChange={(e) => onSpecimenCodeChange(e.target.value)}
          placeholder="Ví dụ: GPB-2026-0891"
          className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
        />
      </div>

      <div>
        <label className="text-slate-500 text-xs font-bold block mb-1">Chẩn đoán giải phẫu bệnh</label>
        <textarea
          rows={2}
          value={diagnosis}
          onChange={(e) => onDiagnosisChange(e.target.value)}
          placeholder="Nhập chẩn đoán GPB"
          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 resize-none focus:outline-none"
        />
      </div>

      {/* 2. Độ mô học, pTNM, Diện cắt */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-slate-500 text-[11px] font-bold block mb-1">Độ mô học</label>
          <select
            value={histologicGrade}
            onChange={(e) => onHistologicGradeChange(e.target.value)}
            className="w-full h-9 px-1 rounded-lg border border-slate-200 text-xs font-bold bg-slate-50"
          >
            <option>G1</option>
            <option>G2</option>
            <option>G3</option>
            <option>Không áp dụng</option>
          </select>
        </div>

        <div>
          <label className="text-slate-500 text-[11px] font-bold block mb-1">pTNM</label>
          <input
            value={pTNM}
            onChange={(e) => onPTNMChange(e.target.value)}
            placeholder="pT2N0"
            className="w-full h-9 px-2 rounded-lg border border-slate-200 text-xs font-bold"
          />
        </div>

        <div>
          <label className="text-slate-500 text-[11px] font-bold block mb-1">Diện cắt</label>
          <select
            value={resectionMargin}
            onChange={(e) => onResectionMarginChange(e.target.value)}
            className="w-full h-9 px-1 rounded-lg border border-slate-200 text-xs font-bold bg-slate-50"
          >
            <option>Âm tính</option>
            <option>Dương tính</option>
            <option>Chưa đánh giá</option>
          </select>
        </div>
      </div>

      {/* 3. Hoá mô miễn dịch */}
      <div className="flex justify-between items-baseline pt-1">
        <span className="text-xs font-extrabold text-slate-900">Hoá mô miễn dịch</span>
        <span className="text-xs text-slate-500 font-semibold">{markers.length} dấu ấn</span>
      </div>

      {markers.map((marker, index) => (
        <div key={index} className="grid grid-cols-[1.2fr_1fr_34px] gap-1.5 items-center">
          <select
            aria-label="Dấu ấn"
            value={marker.marker}
            onChange={(e) => onUpdateMarker(index, { marker: e.target.value })}
            className="h-10 px-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none"
          >
            <option value="Ki-67">Ki-67</option>
            <option value="ER">ER</option>
            <option value="PR">PR</option>
            <option value="HER2">HER2</option>
            <option value="PD-L1">PD-L1</option>
            <option value="TTF-1">TTF-1</option>
            <option value="CK7">CK7</option>
            <option value="CK20">CK20</option>
            <option value="Glypican-3">Glypican-3</option>
            <option value="Khác">Khác</option>
          </select>

          <input
            aria-label="Kết quả"
            placeholder="Kết quả (+/−, %)"
            value={marker.result}
            onChange={(e) => onUpdateMarker(index, { result: e.target.value })}
            className="h-10 px-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
          />

          <button
            type="button"
            aria-label="Xoá dấu ấn"
            onClick={() => onRemoveMarker(index)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={onAddMarker}
        className="h-10 rounded-xl border-1.5 border-dashed border-slate-300 text-[#1F5F6C] text-xs font-bold flex items-center justify-center gap-1 transition"
      >
        <Plus className="w-4 h-4" /> Thêm dấu ấn
      </button>
    </div>
  );
};
