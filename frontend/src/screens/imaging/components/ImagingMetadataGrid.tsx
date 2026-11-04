import React from 'react';

export interface ImagingMetadataGridProps {
  performedAt: string;
  bodyPart: string;
  facilityName: string;
  orderingDoctor: string;
  interpretingDoctor: string;
  comparisonText: string;
}

export const ImagingMetadataGrid: React.FC<ImagingMetadataGridProps> = ({
  performedAt,
  bodyPart,
  facilityName,
  orderingDoctor,
  interpretingDoctor,
  comparisonText,
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-200/60 shadow-xs">
      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
        <div>
          <span className="text-slate-500 font-semibold text-[11px] block">Ngày thực hiện</span>
          <span className="font-extrabold text-slate-900 block mt-0.5">{performedAt}</span>
        </div>
        <div>
          <span className="text-slate-500 font-semibold text-[11px] block">Bộ phận</span>
          <span className="font-extrabold text-slate-900 block mt-0.5">{bodyPart}</span>
        </div>
        <div>
          <span className="text-slate-500 font-semibold text-[11px] block">Nơi thực hiện</span>
          <span className="font-extrabold text-slate-900 block mt-0.5">{facilityName}</span>
        </div>
        <div>
          <span className="text-slate-500 font-semibold text-[11px] block">Bác sĩ chỉ định</span>
          <span className="font-extrabold text-slate-900 block mt-0.5">{orderingDoctor}</span>
        </div>
        <div>
          <span className="text-slate-500 font-semibold text-[11px] block">Bác sĩ đọc kết quả</span>
          <span className="font-extrabold text-slate-900 block mt-0.5">{interpretingDoctor}</span>
        </div>
        <div>
          <span className="text-slate-500 font-semibold text-[11px] block">So sánh với</span>
          <span className="font-extrabold text-slate-900 block mt-0.5">{comparisonText}</span>
        </div>
      </div>
    </div>
  );
};

