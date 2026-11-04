import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface DataSharingBoxProps {
  activeCount: number;
  expiringDays?: number;
  onManage: () => void;
}

export const DataSharingBox: React.FC<DataSharingBoxProps> = ({
  activeCount,
  expiringDays = 7,
  onManage,
}) => {
  return (
    <div className="bg-white rounded-[24px] p-4 shadow-xs border border-slate-100 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
            Ai được xem dữ liệu của tôi?
          </h4>
          <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
            {activeCount} người đang có quyền · 1 hết hạn sau {expiringDays} ngày
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onManage}
        className="text-xs font-bold text-[#1F7A8C] hover:underline cursor-pointer shrink-0 py-1 px-1.5"
      >
        Quản lý
      </button>
    </div>
  );
};
