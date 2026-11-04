import React from 'react';

export interface ImagingFindingsCardProps {
  technique: string;
  findings: string;
}

export const ImagingFindingsCard: React.FC<ImagingFindingsCardProps> = ({
  technique,
  findings,
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-200/60 shadow-xs flex flex-col gap-3">
      <div>
        <span className="font-black text-xs text-slate-800 tracking-wider block">
          KỸ THUẬT
        </span>
        <p className="text-xs text-slate-700 font-medium leading-relaxed mt-1">
          {technique}
        </p>
      </div>
      <div>
        <span className="font-black text-xs text-slate-800 tracking-wider block">
          MÔ TẢ
        </span>
        <p className="text-xs text-slate-700 font-medium leading-relaxed mt-1">
          {findings}
        </p>
      </div>
    </div>
  );
};
