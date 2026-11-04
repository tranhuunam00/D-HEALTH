import React from 'react';
import { HeartPulse, Activity, Pill, User } from 'lucide-react';

export type NavTabId = 'home' | 'health' | 'meds' | 'ai' | 'profile' | 'records' | 'care';

export interface HomeBottomNavProps {
  activeTab?: NavTabId;
  onTabChange?: (tab: NavTabId) => void;
}

export const HomeBottomNav: React.FC<HomeBottomNavProps> = ({
  activeTab = 'home',
  onTabChange,
}) => {
  const getTabClass = (tab: NavTabId) =>
    activeTab === tab
      ? 'flex flex-col items-center text-[#1F7A8C] font-bold text-[10px]'
      : 'flex flex-col items-center text-slate-400 font-medium text-[10px]';

  return (
    <nav className="fixed bottom-3 left-3 right-3 max-w-[456px] mx-auto h-14 bg-white/95 backdrop-blur-md rounded-[22px] px-2 shadow-xl border border-slate-100 grid grid-cols-5 items-center z-30">
      <button
        onClick={() => onTabChange?.('home')}
        className={getTabClass('home')}
      >
        <span className={`w-8 h-6 rounded-full flex items-center justify-center mb-0.5 ${activeTab === 'home' ? 'bg-[#E0F2F1]' : ''}`}>
          <HeartPulse className="w-4 h-4 text-[#1F7A8C]" />
        </span>
        Trang chủ
      </button>

      <button
        onClick={() => onTabChange?.('health')}
        className={getTabClass('health')}
      >
        <Activity className="w-4 h-4 mb-1" /> Sức khoẻ
      </button>

      <button
        onClick={() => onTabChange?.('meds')}
        className={getTabClass('meds')}
      >
        <Pill className="w-4 h-4 mb-1" /> Đơn thuốc
      </button>

      <button
        onClick={() => onTabChange?.('ai')}
        className={getTabClass('ai')}
      >
        <span className="w-7 h-5 rounded-full bg-gradient-to-r from-[#34C3A6] to-[#4F7FE8] text-white flex items-center justify-center mb-0.5">
          <Activity className="w-3.5 h-3.5" />
        </span>
        Trợ lý AI
      </button>

      <button
        onClick={() => onTabChange?.('profile')}
        className={getTabClass('profile')}
      >
        <User className="w-4 h-4 mb-1" /> Hồ sơ
      </button>
    </nav>
  );
};
