import React from 'react';
import { ClinicalDocKind, CAM_READINGS, CamField } from '../camera-input.types';

interface AICameraSectionProps {
  kind: ClinicalDocKind;
}

export const AICameraSection: React.FC<AICameraSectionProps> = ({ kind }) => {
  const currentDoc = CAM_READINGS[kind];

  return (
    <div className="flex flex-col gap-2.5">
      {/* 1. Header tệp tài liệu đã quét */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex items-center gap-3">
        <div className="w-11 h-14 rounded-lg bg-slate-100 border border-slate-200 flex flex-col justify-center gap-1 p-1.5 shrink-0">
          <span className="w-3/4 h-1 bg-slate-400 rounded-full" />
          <span className="w-full h-1 bg-slate-300 rounded-full" />
          <span className="w-full h-1 bg-slate-300 rounded-full" />
          <span className="w-1/2 h-1 bg-slate-300 rounded-full" />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <span className="text-xs font-bold text-slate-900 truncate">{currentDoc.doc}</span>
          <span className="text-[11px] text-slate-500">
            Chụp → Đọc → <b className="text-teal-700">Xác nhận</b> → Lưu
          </span>
        </div>

        <button
          type="button"
          onClick={() => alert('Xem ảnh chụp gốc')}
          className="text-xs font-bold text-[#1F7A8C] hover:underline shrink-0"
        >
          Ảnh gốc
        </button>
      </div>

      {/* 2. Danh sách các trường dữ liệu AI trích xuất */}
      <div className="bg-white rounded-2xl px-4 py-1 shadow-sm border border-slate-100 flex flex-col divide-y divide-slate-100">
        {currentDoc.fields.map((f: CamField, idx: number) => (
          <div key={idx} className="flex items-center gap-2 py-3">
            <span className="w-24 text-xs font-bold text-slate-500 shrink-0">{f.key}</span>
            <span className="flex-1 text-xs font-extrabold text-slate-900">{f.value}</span>
            <span className={`text-[11px] font-bold shrink-0 ${f.normal ? 'text-emerald-700' : 'text-amber-700'}`}>
              {f.conf}
            </span>
          </div>
        ))}
      </div>

      <span className="text-[11px] text-slate-500 leading-relaxed px-1">
        Dữ liệu chỉ được ghi vào hồ sơ khi bạn xác nhận. Ảnh gốc được lưu an toàn để đối chiếu.
      </span>
    </div>
  );
};
