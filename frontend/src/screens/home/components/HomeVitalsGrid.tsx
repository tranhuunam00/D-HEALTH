import React from 'react';

export interface HomeVitalsGridProps {
  displayBp: string;
  displayHr: string;
  displayWeight: string;
  displayGlucose: string;
  onNavigateBiometrics?: () => void;
  onNavigateLabs?: () => void;
}

export const HomeVitalsGrid: React.FC<HomeVitalsGridProps> = ({
  displayBp,
  displayHr,
  displayWeight,
  displayGlucose,
  onNavigateBiometrics,
  onNavigateLabs,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Card 1: Huyết áp */}
      <div
        onClick={onNavigateBiometrics}
        className="bg-[#2563EB] text-white rounded-[24px] p-4 flex flex-col justify-between h-28 shadow-sm cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all"
      >
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-white/90">Huyết áp</span>
          <span className="text-[10px] font-bold bg-white/20 rounded-full px-2.5 py-0.5">
            {displayBp !== '--/--' ? 'Tốt' : 'Chưa đo'}
          </span>
        </div>
        <div>
          <span className="text-3xl font-black">{displayBp}</span>
          <span className="text-xs font-normal text-white/80 ml-1">mmHg</span>
        </div>
      </div>

      {/* Card 2: Nhịp tim with ECG line */}
      <div
        onClick={onNavigateBiometrics}
        className="bg-white text-slate-900 rounded-[24px] p-4 flex flex-col justify-between h-28 shadow-xs border border-slate-100 cursor-pointer hover:shadow-sm active:scale-[0.98] transition-all"
      >
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-600">Nhịp tim</span>
          <span
            className={`text-[10px] font-bold rounded-full px-2.5 py-0.5 ${
              displayHr !== '--' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {displayHr !== '--' ? 'Tốt' : 'Chưa đo'}
          </span>
        </div>
        <div>
          <div className="flex items-baseline">
            <span className="text-3xl font-black">{displayHr}</span>
            <span className="text-xs font-normal text-slate-400 ml-1">bpm</span>
          </div>
          <svg
            className={`w-full h-3.5 mt-0.5 ${displayHr !== '--' ? 'text-rose-500' : 'text-slate-300'}`}
            viewBox="0 0 100 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {displayHr !== '--' ? (
              <path d="M0 10 L25 10 L32 10 L37 4 L43 17 L49 2 L55 18 L59 10 L65 10 L100 10" />
            ) : (
              <line x1="0" y1="10" x2="100" y2="10" strokeDasharray="3 3" />
            )}
          </svg>
        </div>
      </div>

      {/* Card 3: Cân nặng */}
      <div
        onClick={onNavigateBiometrics}
        className="bg-[#D84A1B] text-white rounded-[24px] p-4 flex flex-col justify-between h-28 shadow-sm cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all"
      >
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-white/90">Cân nặng</span>
          <span className="text-[10px] font-bold bg-white/20 rounded-full px-2.5 py-0.5">
            {displayWeight !== '--' ? 'Theo dõi' : 'Chưa cân'}
          </span>
        </div>
        <div>
          <span className="text-3xl font-black">{displayWeight}</span>
          <span className="text-xs font-normal text-white/80 ml-1">kg</span>
        </div>
      </div>

      {/* Card 4: HbA1c */}
      <div
        onClick={onNavigateLabs}
        className="bg-white text-slate-900 rounded-[24px] p-4 flex flex-col justify-between h-28 shadow-xs border border-slate-100 cursor-pointer hover:shadow-sm active:scale-[0.98] transition-all"
      >
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-600">HbA1c</span>
          <span
            className={`text-[10px] font-bold rounded-full px-2.5 py-0.5 ${
              displayGlucose !== '--' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {displayGlucose !== '--' ? 'Tốt' : 'Chưa đo'}
          </span>
        </div>
        <div>
          <span className="text-3xl font-black">{displayGlucose}</span>
          <span className="text-xs font-normal text-slate-400 ml-1">%</span>
        </div>
      </div>
    </div>
  );
};

