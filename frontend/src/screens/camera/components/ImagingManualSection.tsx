import React from 'react';
import { Plus } from 'lucide-react';
import { ImagingLesion } from '../camera-input.types';
import {
  getBodyPartsForModality,
  getLateralityOptionsForBodyPart,
} from '../../../constants/imaging-taxonomy';

interface ImagingManualSectionProps {
  modality: string;
  onModalityChange: (m: string) => void;
  organ: string;
  onOrganChange: (o: string) => void;
  organOther: string;
  onOrganOtherChange: (val: string) => void;
  conclusion: string;
  onConclusionChange: (c: string) => void;
  lesions: ImagingLesion[];
  onAddLesion: () => void;
  onRemoveLesion: (index: number) => void;
  onUpdateLesion: (index: number, patch: Partial<ImagingLesion>) => void;
}

export const ImagingManualSection: React.FC<ImagingManualSectionProps> = ({
  modality,
  onModalityChange,
  organ,
  onOrganChange,
  organOther,
  onOrganOtherChange,
  conclusion,
  onConclusionChange,
  lesions,
  onAddLesion,
  onRemoveLesion,
  onUpdateLesion,
}) => {
  const availableBodyParts = getBodyPartsForModality(modality);
  const selectedPart = availableBodyParts.find((p) => p.name === organ || p.id === organ) || availableBodyParts[0];
  const availableLesionTypes = selectedPart ? selectedPart.lesionTypes : [];
  const lateralityOpts = getLateralityOptionsForBodyPart(modality, organ);

  const handleModalitySelect = (newMod: string) => {
    onModalityChange(newMod);
    const parts = getBodyPartsForModality(newMod);
    if (parts.length > 0 && !parts.some((p) => p.name === organ)) {
      onOrganChange(parts[0].name);
      if (parts[0].lesionTypes.length > 0 && lesions.length > 0) {
        onUpdateLesion(0, { type: parts[0].lesionTypes[0].name });
      }
    }
  };

  const handleOrganSelect = (newOrgan: string) => {
    onOrganChange(newOrgan);
    const part = availableBodyParts.find((p) => p.name === newOrgan || p.id === newOrgan);
    if (part && part.lesionTypes.length > 0 && lesions.length > 0) {
      onUpdateLesion(0, { type: part.lesionTypes[0].name });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-100 flex flex-col gap-2.5">
      {/* 1. Phương tiện & Bộ phận tương ứng */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-slate-500 text-[11px] font-bold block mb-1">Phương tiện</label>
          <select
            value={modality}
            onChange={(e) => handleModalitySelect(e.target.value)}
            className="w-full h-10 px-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none"
          >
            <option value="CT">Cắt lớp vi tính (CT)</option>
            <option value="MRI">Cộng hưởng từ (MRI)</option>
            <option value="MM">Nhũ ảnh (MM)</option>
            <option value="SA">Siêu âm (SA)</option>
            <option value="XQ">X-quang (XQ)</option>
          </select>
        </div>

        <div>
          <label className="text-slate-500 text-[11px] font-bold block mb-1">Vị trí / Bộ phận</label>
          <select
            value={organ}
            onChange={(e) => handleOrganSelect(e.target.value)}
            className="w-full h-10 px-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none"
          >
            {availableBodyParts.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
            <option value="other">Khác (tự nhập)…</option>
          </select>
        </div>
      </div>

      {organ === 'other' && (
        <div>
          <label className="text-slate-500 text-[11px] font-bold block mb-1">Vị trí / Bộ phận khác</label>
          <input
            value={organOther}
            onChange={(e) => onOrganOtherChange(e.target.value)}
            placeholder="Nhập tên vị trí / cấu trúc giải phẫu"
            className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none"
          />
        </div>
      )}

      {/* 2. Kết luận CĐHA */}
      <div>
        <label className="text-slate-500 text-[11px] font-bold block mb-1">Kết luận chẩn đoán hình ảnh</label>
        <input
          value={conclusion}
          onChange={(e) => onConclusionChange(e.target.value)}
          placeholder="VD: Nốt mờ thùy trên phổi phải / Nang gan đơn thuần..."
          className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none"
        />
      </div>

      {/* 3. Danh sách tổn thương dạng khối */}
      <div className="flex justify-between items-center pt-1 border-t border-slate-100">
        <span className="text-xs font-extrabold text-slate-900">Chi tiết tổn thương ({selectedPart?.name || organ})</span>
        <span className="text-[11px] text-slate-500 font-semibold">{lesions.length} tổn thương</span>
      </div>

      {lesions.map((lesion, index) => {
        const typeDef = availableLesionTypes.find((t) => t.name === lesion.type);
        const canRecist = typeDef ? typeDef.isRecistApplicable : (modality === 'CT' || modality === 'MRI');
        const isBiRads = typeDef?.classificationSystem === 'BI-RADS' || modality === 'MM';
        const isTiRads = typeDef?.classificationSystem === 'TI-RADS';

        return (
          <div key={index} className="border border-slate-200/80 rounded-2xl p-2.5 flex flex-col gap-2 bg-slate-50/50">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800">Tổn thương {index + 1}</span>
              {lesions.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveLesion(index)}
                  className="text-[11px] font-bold text-slate-500 hover:text-rose-600 px-2 py-0.5 rounded-lg bg-slate-100 active:scale-95 transition"
                >
                  Xoá
                </button>
              )}
            </div>

            {/* Bố cục hàng nhập liệu: Có bên (3 cột) hoặc Không có bên (2 cột rộng rãi) */}
            {lateralityOpts ? (
              <div className="grid grid-cols-12 gap-1.5">
                <div className="col-span-5">
                  <select
                    value={lesion.type}
                    onChange={(e) => onUpdateLesion(index, { type: e.target.value })}
                    className="h-10 w-full px-2 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none truncate"
                  >
                    {availableLesionTypes.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                    <option value="Khác">Tổn thương khác…</option>
                  </select>
                </div>

                <div className="col-span-4">
                  <select
                    value={lesion.side || lateralityOpts[0]}
                    onChange={(e) => onUpdateLesion(index, { side: e.target.value })}
                    className="h-10 w-full px-2 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none truncate"
                  >
                    {lateralityOpts.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-3 relative">
                  <input
                    placeholder="Kích thước"
                    value={lesion.size}
                    onChange={(e) => onUpdateLesion(index, { size: e.target.value })}
                    className="h-10 w-full px-2 pr-6 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 font-bold absolute right-1.5 top-3 pointer-events-none">mm</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-1.5">
                <div className="col-span-8">
                  <select
                    value={lesion.type}
                    onChange={(e) => onUpdateLesion(index, { type: e.target.value })}
                    className="h-10 w-full px-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none truncate"
                  >
                    {availableLesionTypes.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                    <option value="Khác">Tổn thương khác…</option>
                  </select>
                </div>

                <div className="col-span-4 relative">
                  <input
                    placeholder="Kích thước"
                    value={lesion.size}
                    onChange={(e) => onUpdateLesion(index, { size: e.target.value })}
                    className="h-10 w-full px-2.5 pr-6 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 font-bold absolute right-2 top-3 pointer-events-none">mm</span>
                </div>
              </div>
            )}

            {/* Phân loại bổ trợ theo chuyên khoa */}
            {canRecist && (
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-0.5">
                <input
                  type="checkbox"
                  checked={lesion.target}
                  onChange={() => onUpdateLesion(index, { target: !lesion.target })}
                  className="w-4 h-4 rounded text-[#1F7A8C] accent-[#1F7A8C]"
                />
                <span>Tổn thương đích (RECIST 1.1)</span>
              </label>
            )}

            {isBiRads && (
              <div className="flex items-center gap-2 text-xs text-slate-700 pt-0.5">
                <span className="text-[11px] font-bold text-slate-500 shrink-0">Phân loại BI-RADS:</span>
                <select
                  value={lesion.birads || 'BI-RADS 3'}
                  onChange={(e) => onUpdateLesion(index, { birads: e.target.value })}
                  className="h-8 px-2 rounded-lg border border-slate-200 text-[11px] font-bold bg-white"
                >
                  <option value="BI-RADS 1">BI-RADS 1 (Bình thường)</option>
                  <option value="BI-RADS 2">BI-RADS 2 (Lành tính)</option>
                  <option value="BI-RADS 3">BI-RADS 3 (Khả năng lành tính)</option>
                  <option value="BI-RADS 4A">BI-RADS 4A (Nghi ngờ thấp)</option>
                  <option value="BI-RADS 4B">BI-RADS 4B (Nghi ngờ vừa)</option>
                  <option value="BI-RADS 4C">BI-RADS 4C (Nghi ngờ cao)</option>
                  <option value="BI-RADS 5">BI-RADS 5 (Rất nghi ngờ ác tính)</option>
                  <option value="BI-RADS 6">BI-RADS 6 (Đã xác định ác tính)</option>
                </select>
              </div>
            )}

            {isTiRads && (
              <div className="flex items-center gap-2 text-xs text-slate-700 pt-0.5">
                <span className="text-[11px] font-bold text-slate-500 shrink-0">Phân loại TI-RADS:</span>
                <select
                  value={lesion.tirads || 'TI-RADS 3'}
                  onChange={(e) => onUpdateLesion(index, { tirads: e.target.value })}
                  className="h-8 px-2 rounded-lg border border-slate-200 text-[11px] font-bold bg-white"
                >
                  <option value="TI-RADS 1">TI-RADS 1 (Lành tính)</option>
                  <option value="TI-RADS 2">TI-RADS 2 (Không nghi ngờ)</option>
                  <option value="TI-RADS 3">TI-RADS 3 (Nghi ngờ nhẹ)</option>
                  <option value="TI-RADS 4">TI-RADS 4 (Nghi ngờ vừa)</option>
                  <option value="TI-RADS 5">TI-RADS 5 (Nghi ngờ cao)</option>
                </select>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={onAddLesion}
        className="h-9 min-h-[36px] rounded-xl border border-dashed border-[#1F7A8C]/50 text-[#1F7A8C] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-teal-50/50 transition active:scale-95"
      >
        <Plus className="w-4 h-4" />
        <span>Thêm tổn thương</span>
      </button>
    </div>
  );
};
