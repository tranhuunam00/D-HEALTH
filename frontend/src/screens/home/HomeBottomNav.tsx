import React from 'react';
import { Home, Activity, FileText, Sparkles, Users } from 'lucide-react';

export type NavTabId = 'home' | 'health' | 'records' | 'ai' | 'care' | 'meds' | 'profile';

export interface HomeBottomNavProps {
  activeTab?: NavTabId;
  onTabChange?: (tab: NavTabId) => void;
}

export const HomeBottomNav: React.FC<HomeBottomNavProps> = ({
  activeTab = 'home',
  onTabChange,
}) => {
  return (
    <nav className="fixed bottom-3 left-3 right-3 max-w-[456px] mx-auto h-16 bg-white/95 backdrop-blur-md rounded-[24px] px-3 shadow-xl shadow-slate-200/50 border border-slate-100/80 flex items-center justify-around z-30 font-sans">
      {/* 1. Trang chủ */}
      <button
        onClick={() => onTabChange?.('home')}
        className={`flex flex-col items-center gap-0.5 transition-all ${
          activeTab === 'home' ? 'text-[#1F7A8C] font-bold' : 'text-slate-400 font-medium hover:text-slate-600'
        }`}
      >
        <span
          className={`w-9 h-7 rounded-full flex items-center justify-center transition-all ${
            activeTab === 'home' ? 'bg-[#E6F4F1] text-[#1F7A8C]' : ''
          }`}
        >
          <Home className="w-4.5 h-4.5" />
        </span>
        <span className="text-[10px]">Trang chủ</span>
      </button>

      {/* 2. Sức khoẻ */}
      <button
        onClick={() => onTabChange?.('health')}
        className={`flex flex-col items-center gap-0.5 transition-all ${
          activeTab === 'health' ? 'text-[#1F7A8C] font-bold' : 'text-slate-400 font-medium hover:text-slate-600'
        }`}
      >
        <span
          className={`w-9 h-7 rounded-full flex items-center justify-center transition-all ${
            activeTab === 'health' ? 'bg-[#E6F4F1] text-[#1F7A8C]' : ''
          }`}
        >
          <Activity className="w-4.5 h-4.5" />
        </span>
        <span className="text-[10px]">Sức khoẻ</span>
      </button>

      {/* 3. Hồ sơ */}
      <button
        onClick={() => onTabChange?.('records')}
        className={`flex flex-col items-center gap-0.5 transition-all ${
          activeTab === 'records' || activeTab === 'profile' ? 'text-[#1F7A8C] font-bold' : 'text-slate-400 font-medium hover:text-slate-600'
        }`}
      >
        <span
          className={`w-9 h-7 rounded-full flex items-center justify-center transition-all ${
            activeTab === 'records' || activeTab === 'profile' ? 'bg-[#E6F4F1] text-[#1F7A8C]' : ''
          }`}
        >
          <FileText className="w-4.5 h-4.5" />
        </span>
        <span className="text-[10px]">Hồ sơ</span>
      </button>

      {/* 4. Trợ lý AI */}
      <button
        onClick={() => onTabChange?.('ai')}
        className={`flex flex-col items-center gap-0.5 transition-all ${
          activeTab === 'ai' ? 'text-[#1F7A8C] font-bold' : 'text-slate-400 font-medium hover:text-slate-600'
        }`}
      >
        <span className="w-8 h-8 rounded-full bg-[#1F7A8C] text-white flex items-center justify-center shadow-md shadow-teal-700/25 active:scale-90 transition">
          <Sparkles className="w-4 h-4" />
        </span>
        <span className="text-[10px]">Trợ lý AI</span>
      </button>

      {/* 5. Chăm sóc */}
      <button
        onClick={() => onTabChange?.('care')}
        className={`flex flex-col items-center gap-0.5 transition-all ${
          activeTab === 'care' ? 'text-[#1F7A8C] font-bold' : 'text-slate-400 font-medium hover:text-slate-600'
        }`}
      >
        <span
          className={`w-9 h-7 rounded-full flex items-center justify-center transition-all ${
            activeTab === 'care' ? 'bg-[#E6F4F1] text-[#1F7A8C]' : ''
          }`}
        >
          <Users className="w-4.5 h-4.5" />
        </span>
        <span className="text-[10px]">Chăm sóc</span>
      </button>
    </nav>
  );
};
