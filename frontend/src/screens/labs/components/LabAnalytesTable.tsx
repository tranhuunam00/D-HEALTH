import React from 'react';

export interface AnalyteRow {
  readonly name: string;
  readonly value: string;
  readonly unit: string;
  readonly refRange: string;
}

export interface LabAnalytesTableProps {
  analytes: readonly AnalyteRow[];
}

export const LabAnalytesTable: React.FC<LabAnalytesTableProps> = ({ analytes }) => {
  return (
    <div className="bg-white rounded-[24px] p-4 shadow-xs border border-slate-100 flex flex-col gap-2">
      <div className="grid grid-cols-[1.4fr_1fr_1.2fr] text-xs font-bold text-slate-400 border-b border-slate-100 pb-2 px-1">
        <span>Chỉ số</span>
        <span className="text-center">Kết quả</span>
        <span className="text-right">Tham chiếu</span>
      </div>

      <div className="divide-y divide-slate-100">
        {analytes.map((item, idx) => (
          <div key={idx} className="grid grid-cols-[1.4fr_1fr_1.2fr] items-center py-2.5 px-1 text-xs">
            <div>
              <span className="font-bold text-slate-900 block leading-tight">{item.name}</span>
              <span className="text-[11px] text-slate-400 block">{item.unit}</span>
            </div>
            <div className="text-center font-black text-sm text-slate-900">
              {item.value}
            </div>
            <div className="text-right text-slate-500 font-medium">
              {item.refRange}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
