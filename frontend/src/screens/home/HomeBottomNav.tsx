import React from 'react';
import { HeartPulse, Activity, Pill, User } from 'lucide-react';

export const HomeBottomNav: React.FC = () => {
  return (
    <nav className="absolute left-3 right-3 bottom-3 h-14 bg-white rounded-[22px] px-2 shadow-lg border border-slate-100 grid grid-cols-5 items-center z-10">
      <button className="flex flex-col items-center text-[#1F7A8C] font-bold text-[10px]">
        <span className="w-8 h-6 rounded-full bg-[#E0F2F1] flex items-center justify-center mb-0.5">
          <HeartPulse className="w-4 h-4 text-[#1F7A8C]" />
        </span>
        Trang chủ
      </button>
      <button className="flex flex-col items-center text-slate-400 font-medium text-[10px]">
        <Activity className="w-4 h-4 mb-1" /> Sức khoẻ
      </button>
      <button className="flex flex-col items-center text-slate-400 font-medium text-[10px]">
        <Pill className="w-4 h-4 mb-1" /> Đơn thuốc
      </button>
      <button className="flex flex-col items-center text-slate-400 font-medium text-[10px]">
        <span className="w-7 h-5 rounded-full bg-gradient-to-r from-[#34C3A6] to-[#4F7FE8] text-white flex items-center justify-center mb-0.5">
          <Activity className="w-3.5 h-3.5" />
        </span>
        Trợ lý AI
      </button>
      <button className="flex flex-col items-center text-slate-400 font-medium text-[10px]">
        <User className="w-4 h-4 mb-1" /> Hồ sơ
      </button>
    </nav>
  );
};
