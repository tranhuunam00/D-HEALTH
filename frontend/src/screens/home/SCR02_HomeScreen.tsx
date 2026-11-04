import React from 'react';
import { Bell, Activity, Pill, Plus } from 'lucide-react';
import { useHomeLogic } from './useHomeLogic';
import { BiometricEntrySheet } from '../../components/organisms/BiometricEntrySheet';
import { DesignTokens } from '../../theme/tokens';
import { HomeBottomNav } from './HomeBottomNav';

export const SCR02_HomeScreen: React.FC<{ onOpenEmergency: () => void; user?: any }> = ({
  onOpenEmergency,
  user,
}) => {
  const {
    members,
    activeMemberId,
    healthScore,
    isVitalsSheetOpen,
    setIsVitalsSheetOpen,
    handleRecordVitals,
  } = useHomeLogic();

  const activeMember = members.find((m) => m.id === activeMemberId) || {
    full_name: user?.fullName || 'Người Dùng',
  };

  return (
    <div
      style={{
        width: '390px',
        height: '844px',
        backgroundColor: DesignTokens.colors.bgApp,
        color: DesignTokens.colors.textPrimary,
        fontFamily: DesignTokens.typography.fontFamily,
      }}
      className="relative overflow-hidden box-border flex flex-col justify-between"
    >
      {/* Scrollable Main Area */}
      <div className="h-[760px] overflow-y-auto box-border px-4 pt-12 pb-24 flex flex-col gap-3.5 no-scrollbar">
        {/* 1. Header: Avatar + Name + SOS + Bell */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] text-white flex items-center justify-center font-bold text-base shadow">
            {activeMember.full_name.charAt(0)}
          </div>
          <div className="flex-1 flex flex-col">
            <span className="text-xs text-[#4B5563]">Xin chào,</span>
            <span className="text-base font-extrabold text-[#111827]">{activeMember.full_name}</span>
          </div>
          <button
            onClick={onOpenEmergency}
            style={{
              backgroundColor: DesignTokens.colors.badgeCriticalBg,
              color: DesignTokens.colors.badgeCriticalText,
            }}
            className="h-11 px-3.5 rounded-full text-xs font-extrabold tracking-wider shadow-sm active:scale-95 transition-all"
          >
            SOS
          </button>
          <button className="w-11 h-11 rounded-full bg-white text-[#111827] flex items-center justify-center shadow-sm">
            <Bell className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {/* 2. Greeting Title */}
        <div className="flex flex-col gap-1.5">
          <span className="text-2xl font-extrabold tracking-tight text-[#111827]">Hôm nay bạn thế nào?</span>
          <span className="self-start inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-white text-xs font-semibold text-[#374151]">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            Hôm nay: {new Date().toLocaleDateString('vi-VN')}
          </span>
        </div>

        {/* 3. Health Score Arc */}
        <div className="relative h-40 flex justify-center items-center">
          <svg width="280" height="150" viewBox="0 0 300 168" role="img" aria-label="Điểm sức khoẻ">
            <defs>
              <linearGradient id="gauge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#EF4444" />
                <stop offset="0.5" stopColor="#F59E0B" />
                <stop offset="1" stopColor="#22C55E" />
              </linearGradient>
            </defs>
            <path d="M 34 150 A 116 116 0 0 1 266 150" fill="none" stroke="#DDE3EA" strokeWidth="22" strokeLinecap="round" />
            <path d="M 34 150 A 116 116 0 0 1 266 150" fill="none" stroke="url(#gauge)" strokeWidth="22" strokeLinecap="round" />
            <circle cx="239" cy="76" r="12" fill="#FFFFFF" stroke="#111827" strokeWidth="4" />
          </svg>
          <div className="absolute top-16 flex flex-col items-center">
            <span className="text-xs text-[#4B5563] font-medium">Điểm sức khoẻ</span>
            <span className="text-4xl font-extrabold text-[#111827] tracking-tight">{healthScore.total}</span>
          </div>
          <span className="absolute right-4 top-4 bg-[#111827] text-white rounded-full px-3 py-1 text-xs font-bold">
            {healthScore.status}
          </span>
        </div>

        {/* 4. Nhắc uống thuốc banner */}
        <div
          style={{ boxShadow: `inset 0 0 0 2px ${DesignTokens.colors.badgeFollowUpBorder}` }}
          className="bg-white rounded-[22px] p-3.5 flex items-center gap-3 shadow-sm"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0">
            <Pill className="w-5 h-5" />
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            <span className="text-[11px] font-extrabold text-[#92400E]">NHẮC UỐNG THUỐC · 20:00</span>
            <span className="text-sm font-extrabold text-[#111827] truncate">Metformin 500 mg</span>
            <span className="text-[11px] text-[#4B5563]">1 viên sau ăn tối · hôm nay 2/4 liều</span>
          </div>
          <button className="h-9 px-3 rounded-full bg-[#111827] text-white text-xs font-bold shrink-0">
            Đã uống
          </button>
        </div>

        {/* 5. 4 Vitals Cards (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-2.5">
          <div
            style={{ backgroundColor: DesignTokens.colors.vitalsCardBlue }}
            className="text-white rounded-[22px] p-3.5 flex flex-col justify-between h-24 shadow"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">Huyết áp</span>
              <span className="text-[10px] font-bold bg-white/20 rounded-full px-2 py-0.5">Tốt</span>
            </div>
            <span className="text-2xl font-extrabold">120/80 <span className="text-xs font-normal">mmHg</span></span>
          </div>

          <div className="bg-white text-[#111827] rounded-[22px] p-3.5 flex flex-col justify-between h-24 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-700">Nhịp tim</span>
              <span className="text-[10px] font-bold bg-[#DCFCE7] text-[#166534] rounded-full px-2 py-0.5">Tốt</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-extrabold">71 <span className="text-xs font-normal text-slate-500">bpm</span></span>
              <svg width="50" height="18" viewBox="0 0 130 22">
                <path d="M0 14 L14 12 L24 4 L34 16 L46 10 L58 12 L70 6 L82 14 L96 9 L110 12 L130 8" fill="none" stroke="#EF4444" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          <div
            style={{ backgroundColor: DesignTokens.colors.vitalsCardOrange }}
            className="text-white rounded-[22px] p-3.5 flex flex-col justify-between h-24 shadow"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">Cân nặng</span>
              <span className="text-[10px] font-bold bg-white/20 rounded-full px-2 py-0.5">Theo dõi</span>
            </div>
            <span className="text-2xl font-extrabold">72,5 <span className="text-xs font-normal">kg</span></span>
          </div>

          <div className="bg-white text-[#111827] rounded-[22px] p-3.5 flex flex-col justify-between h-24 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-700">HbA1c</span>
              <span className="text-[10px] font-bold bg-[#DCFCE7] text-[#166534] rounded-full px-2 py-0.5">Tốt</span>
            </div>
            <span className="text-2xl font-extrabold">6,6 <span className="text-xs font-normal text-slate-500">%</span></span>
          </div>
        </div>

        {/* 6. AI Insight Banner */}
        <div className="bg-gradient-to-r from-[#DDF4EE] via-[#E3EBFF] to-[#FCEBDD] rounded-[22px] p-3.5 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#34C3A6] to-[#4F7FE8] text-white flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <span className="font-bold text-[#1F5F6C] block text-[10px] uppercase">AI Insight</span>
            <span className="font-semibold text-slate-800">Các chỉ số sinh trắc duy trì ở mức an toàn ổn định.</span>
          </div>
        </div>
      </div>

      {/* Floating Action Button (+) Nhập số đo */}
      <button
        onClick={() => setIsVitalsSheetOpen(true)}
        className="absolute bottom-20 right-5 w-12 h-12 rounded-full bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] text-white flex items-center justify-center shadow-xl active:scale-95 transition-all z-20"
        title="Nhập số đo"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* 7. Bottom Navigation Bar */}
      <HomeBottomNav />

      {/* Biometric Entry Modal Bottom Sheet */}
      <BiometricEntrySheet
        isOpen={isVitalsSheetOpen}
        onClose={() => setIsVitalsSheetOpen(false)}
        onSubmit={handleRecordVitals}
      />
    </div>
  );
};
