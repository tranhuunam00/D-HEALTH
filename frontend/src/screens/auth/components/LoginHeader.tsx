import React from 'react';

export const LoginHeader: React.FC = () => {
  return (
    <div className="pt-6 flex flex-col items-center text-center">
      <div className="w-18 h-18 rounded-[26px] bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] flex items-center justify-center shadow-xl shadow-teal-700/20 mb-3">
        <svg width="42" height="42" viewBox="0 0 48 48" role="img" aria-label="Logo D-Health">
          <path
            d="M24 40 L9.5 26 A8.5 8.5 0 0 1 21.5 14 L24 16.5 L26.5 14 A8.5 8.5 0 0 1 38.5 26 Z"
            fill="#FFFFFF"
          />
          <path
            d="M12 25 H19 L21.5 20 L25 30 L27.5 25 H36"
            fill="none"
            stroke="#1F7A8C"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-black tracking-wider text-slate-900 uppercase">D–HEALTH</h1>
      <span className="text-[11px] font-extrabold text-[#1F7A8C] tracking-widest uppercase mt-0.5">
        TRỢ LÝ SỨC KHOẺ THÔNG MINH
      </span>
    </div>
  );
};
