import React from 'react';
import { Plus, X } from 'lucide-react';
import { ImagingLesion, ORGAN_OPTIONS } from '../camera-input.types';

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
  return (
    <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex flex-col gap-3">
      {/* 1. Phương tiện & Bộ phận */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="text-slate-500 text-xs font-bold block mb-1">Phương tiện</label>
          <select
            value={modality}
            onChange={(e) => onModalityChange(e.target.value)}
            className="w-full h-10 px-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none"
          >
            <option value="SA">Siêu âm (SA)</option>
            <option value="XQ">X-quang (XQ)</option>
            <option value="MM">Nhũ ảnh (MM)</option>
            <option value="CT">Cắt lớp vi tính (CT)</option>
            <option value="MRI">Cộng hưởng từ (MRI)</option>
          </select>
        </div>

        <div>
          <label className="text-slate-500 text-xs font-bold block mb-1">Bộ phận</label>
          <select
            value={organ}
            onChange={(e) => onOrganChange(e.target.value)}
            className="w-full h-10 px-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none"
          >
            {ORGAN_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o === 'other' ? 'Khác (tự nhập)…' : o}
              </option>
            ))}
          </select>
        </div>
      </div>

      {organ === 'other' && (
        <div>
          <label className="text-slate-500 text-xs font-bold block mb-1">Bộ phận khác</label>
          <input
            value={organOther}
            onChange={(e) => onOrganOtherChange(e.target.value)}
            placeholder="Nhập tên bộ phận / cấu trúc giải phẫu"
            className="w-full h-10 px-3 rounded-xl border border-slate-900 text-xs font-bold text-slate-900 focus:outline-none"
          />
        </div>
      )}

      {/* 2. Kết luận */}
      <div>
        <label className="text-slate-500 text-xs font-bold block mb-1">Kết luận</label>
        <textarea
          rows={2}
          value={conclusion}
          onChange={(e) => onConclusionChange(e.target.value)}
          placeholder="Nhập kết luận của bác sĩ CĐHA"
          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 resize-none focus:outline-none"
        />
      </div>

      {/* 3. Tổn thương dạng khối */}
      <div className="flex justify-between items-baseline pt-1">
        <span className="text-xs font-extrabold text-slate-900">Tổn thương dạng khối</span>
        <span className="text-xs text-slate-500 font-semibold">{lesions.length} tổn thương</span>
      </div>

      {lesions.map((lesion, index) => (
        <div key={index} className="border border-slate-200 rounded-xl p-2.5 flex flex-col gap-2 bg-slate-50/50">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-800">Tổn thương {index + 1}</span>
            <button
              type="button"
              onClick={() => onRemoveLesion(index)}
              className="text-xs font-bold text-slate-500 hover:text-rose-600 px-2 py-0.5 rounded-lg bg-slate-100"
            >
              Xoá
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <select
              value={lesion.type}
              onChange={(e) => onUpdateLesion(index, { type: e.target.value })}
              className="h-9 px-1.5 rounded-lg border border-slate-200 text-[11px] font-bold bg-white"
            >
              <option value="Khối u đặc">Khối u đặc</option>
              <option value="Khối u nang">Khối u nang</option>
              <option value="Tổn thương khác">Tổn thương khác</option>
            </select>

            <select
              value={lesion.side}
              onChange={(e) => onUpdateLesion(index, { side: e.target.value })}
              className="h-9 px-1.5 rounded-lg border border-slate-200 text-[11px] font-bold bg-white"
            >
              <option value="Bên phải">Bên phải</option>
              <option value="Bên trái">Bên trái</option>
              <option value="Lan toả">Lan toả</option>
            </select>

            <input
              placeholder="mm"
              value={lesion.size}
              onChange={(e) => onUpdateLesion(index, { size: e.target.value })}
              className="h-9 px-2 rounded-lg border border-slate-200 text-xs font-bold bg-white"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-0.5">
            <input
              type="checkbox"
              checked={lesion.target}
              onChange={() => onUpdateLesion(index, { target: !lesion.target })}
              className="w-4 h-4 rounded text-[#1F7A8C] accent-[#1F7A8C]"
            />
            <span>Tổn thương đích (RECIST 1.1)</span>
          </label>
        </div>
      ))}

      <button
        type="button"
        onClick={onAddLesion}
        className="h-10 rounded-xl border-1.5 border-dashed border-slate-300 text-[#1F5F6C] text-xs font-bold flex items-center justify-center gap-1 transition"
      >
        <Plus className="w-4 h-4" /> Thêm tổn thương
      </button>
    </div>
  );
};
