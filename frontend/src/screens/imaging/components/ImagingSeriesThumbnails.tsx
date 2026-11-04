import React from 'react';

export interface SeriesItem {
  id: string;
  name: string;
}

export interface ImagingSeriesThumbnailsProps {
  series: readonly SeriesItem[];
}

export const ImagingSeriesThumbnails: React.FC<ImagingSeriesThumbnailsProps> = ({
  series,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {series.map((pulse, idx) => (
        <div
          key={pulse.id || idx}
          className="bg-[#0F172A] rounded-2xl h-22 relative overflow-hidden flex items-center justify-center shadow-xs border border-slate-800"
        >
          <div
            className="w-14 h-14 rounded-full opacity-60"
            style={{
              background:
                idx === 0
                  ? 'radial-gradient(circle, rgba(148,163,184,0.5) 0%, rgba(15,23,42,0) 70%)'
                  : idx === 1
                  ? 'radial-gradient(circle, rgba(203,213,225,0.7) 0%, rgba(15,23,42,0) 70%)'
                  : 'radial-gradient(circle, rgba(100,116,139,0.5) 0%, rgba(15,23,42,0) 70%)',
            }}
          />
          <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded-md">
            {pulse.name}
          </span>
        </div>
      ))}
    </div>
  );
};
