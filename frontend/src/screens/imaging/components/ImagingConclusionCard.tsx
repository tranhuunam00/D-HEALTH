import React from 'react';

export interface ImagingConclusionCardProps {
  conclusion: string;
  recommendations: string;
}

export const ImagingConclusionCard: React.FC<ImagingConclusionCardProps> = ({
  conclusion,
  recommendations,
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-200/60 border-l-4 border-l-[#1F7A8C] shadow-xs flex flex-col gap-3">
      <div>
        <span className="font-black text-xs text-[#1F7A8C] tracking-wider block">
          KẾT LUẬN
        </span>
        <p className="text-xs text-slate-900 font-bold leading-relaxed mt-1">
          {conclusion}
        </p>
      </div>
      <div>
        <span className="font-black text-xs text-slate-800 tracking-wider block">
          ĐỀ NGHỊ
        </span>
        <p className="text-xs text-slate-700 font-medium leading-relaxed mt-1">
          {recommendations}
        </p>
      </div>
    </div>
  );
};

