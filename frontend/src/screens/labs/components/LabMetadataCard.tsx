import React from 'react';

export interface LabMetadataCardProps {
  facility: string;
  doctor: string;
  sampleDate?: string;
  resultDate?: string;
  sampleType?: string;
  orderCode?: string;
}

export const LabMetadataCard: React.FC<LabMetadataCardProps> = ({
  facility,
  doctor,
  sampleDate = '20/10/2026 · 07:30',
  resultDate = '20/10/2026 · 11:00',
  sampleType = 'Huyết thanh · lúc đói',
  orderCode = 'XN-2026-8891',
}) => {
  return (
    <div className="bg-white rounded-[24px] p-4 shadow-xs border border-slate-100 grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
      <div>
        <span className="text-slate-400 block font-medium">Ngày lấy mẫu</span>
        <span className="text-slate-900 font-bold mt-0.5 block">{sampleDate}</span>
      </div>
      <div>
        <span className="text-slate-400 block font-medium">Ngày trả kết quả</span>
        <span className="text-slate-900 font-bold mt-0.5 block">{resultDate}</span>
      </div>
      <div>
        <span className="text-slate-400 block font-medium">Nơi thực hiện</span>
        <span className="text-slate-900 font-bold mt-0.5 block truncate">{facility}</span>
      </div>
      <div>
        <span className="text-slate-400 block font-medium">Bác sĩ chỉ định</span>
        <span className="text-slate-900 font-bold mt-0.5 block truncate">{doctor}</span>
      </div>
      <div>
        <span className="text-slate-400 block font-medium">Loại mẫu</span>
        <span className="text-slate-900 font-bold mt-0.5 block">{sampleType}</span>
      </div>
      <div>
        <span className="text-slate-400 block font-medium">Mã phiếu</span>
        <span className="text-slate-900 font-bold mt-0.5 block">{orderCode}</span>
      </div>
    </div>
  );
};

