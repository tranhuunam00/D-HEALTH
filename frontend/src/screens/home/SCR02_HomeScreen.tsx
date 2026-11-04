import React from 'react';
import { Bell, Activity, Pill, Plus, Check } from 'lucide-react';
import { useHomeLogic } from './useHomeLogic';
import { BiometricEntrySheet } from '../../components/organisms/BiometricEntrySheet';
import { DesignTokens } from '../../theme/tokens';
import { HomeBottomNav } from './HomeBottomNav';

export interface SCR02Props {
  onOpenEmergency: () => void;
  onNavigate?: (screen: string) => void;
  user?: any;
  activeMemberId?: string;
  activeMemberName?: string;
}

export const SCR02_HomeScreen: React.FC<SCR02Props> = ({
  onOpenEmergency,
  onNavigate,
  user,
  activeMemberId: propMemberId,
  activeMemberName: propMemberName,
}) => {
  const {
    members,
    activeMemberId,
    setActiveMemberId,
    healthScore,
    latestBp,
    latestHr,
    latestWeight,
    latestGlucose,
    isDoseTaken,
    checkinStatus,
    isVitalsSheetOpen,
    setIsVitalsSheetOpen,
    todayDose,
    todayDosesSummary,
    handleRecordVitals,
    handleTakeDose,
    handleQuickCheckin,
  } = useHomeLogic(propMemberId || user?.activeMemberId || 'me', user);

  const activeMember = members.find((m) => m.id === activeMemberId) || {
    id: activeMemberId,
    full_name: propMemberName || user?.fullName || 'Trần Minh Khang',
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#111827] pb-24 relative flex flex-col font-sans select-none">
      {/* Scrollable Content */}
      <div className="flex-1 px-4 pt-4 pb-6 flex flex-col gap-3.5">
        {/* 1. Top Header: Avatar + Greeting + SOS + Bell */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate?.('profile')}
            className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] text-white flex items-center justify-center font-bold text-base shadow hover:opacity-90 transition-all shrink-0"
          >
            {activeMember.full_name.charAt(0)}
          </button>
          <div
            onClick={() => onNavigate?.('profile')}
            className="flex-1 flex flex-col cursor-pointer min-w-0"
          >
            <span className="text-xs text-slate-500">Xin chào,</span>
            <span className="text-base font-extrabold text-slate-900 truncate">{activeMember.full_name}</span>
          </div>
          <button
            onClick={onOpenEmergency}
            style={{ backgroundColor: DesignTokens.colors.badgeCriticalBg, color: DesignTokens.colors.badgeCriticalText }}
            className="h-10 px-3.5 rounded-full text-xs font-black tracking-wider shadow-sm active:scale-95 transition-all shrink-0 flex items-center justify-center"
          >
            SOS
          </button>
          <button
            onClick={() => alert('Chưa có thông báo khẩn cấp mới.')}
            className="w-10 h-10 rounded-full bg-white text-slate-700 flex items-center justify-center shadow-sm border border-slate-200/60 shrink-0"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Family Members Chips Carousel */}
        {members.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {members.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMemberId(m.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeMemberId === m.id
                    ? 'bg-[#1F7A8C] text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {m.relationship === 'owner' ? 'Tôi' : m.full_name}
              </button>
            ))}
          </div>
        )}

        {/* 3. Mood Daily Check-in */}
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Hôm nay bạn thế nào?</span>
          <div className="flex gap-1.5 text-base">
            {['😊', '😐', '🤒', '🤕'].map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickCheckin(emoji)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                  checkinStatus === emoji ? 'bg-teal-100 ring-2 ring-[#1F7A8C]' : 'hover:bg-slate-100'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Health Score Arc Card */}
        <div
          onClick={() => onNavigate?.('biometrics')}
          className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 relative flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
        >
          <svg width="260" height="135" viewBox="0 0 300 168">
            <defs>
              <linearGradient id="gauge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#EF4444" />
                <stop offset="0.5" stopColor="#F59E0B" />
                <stop offset="1" stopColor="#22C55E" />
              </linearGradient>
            </defs>
            <path d="M 34 150 A 116 116 0 0 1 266 150" fill="none" stroke="#E2E8F0" strokeWidth="20" strokeLinecap="round" />
            <path d="M 34 150 A 116 116 0 0 1 266 150" fill="none" stroke="url(#gauge)" strokeWidth="20" strokeLinecap="round" />
            <circle cx="239" cy="76" r="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />
          </svg>
          <div className="absolute top-14 flex flex-col items-center">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Điểm sức khoẻ</span>
            <span className="text-4xl font-black text-slate-900 tracking-tight">{healthScore.total}</span>
          </div>
          <span className="absolute right-3.5 top-3.5 bg-slate-900 text-white rounded-full px-2.5 py-0.5 text-[10px] font-bold">
            {healthScore.status}
          </span>
        </div>

        {/* 5. Nhắc uống thuốc banner */}
        <div
          onClick={() => onNavigate?.('meds')}
          className="bg-white rounded-2xl p-3.5 flex items-center gap-3 shadow-sm border border-amber-200/80 cursor-pointer hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Pill className="w-5 h-5" />
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            <span className="text-[10px] font-black text-amber-700 uppercase">
              NHẮC UỐNG THUỐC · {todayDose?.scheduled_time ? todayDose.scheduled_time.substring(0, 5) : '20:00'}
            </span>
            <span className="text-sm font-extrabold text-slate-900 truncate">
              {todayDose ? `${todayDose.name} ${todayDose.dosage}` : 'Metformin 500 mg'}
            </span>
            <span className="text-[11px] text-slate-500">
              {todayDose?.meal_relation === 'after_meal' ? '1 viên sau ăn tối' : (todayDose?.dose_per_intake || '1 viên')} · hôm nay {todayDosesSummary.taken}/{todayDosesSummary.total} liều
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTakeDose();
            }}
            className={`h-8 px-3 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
              isDoseTaken
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
            }`}
          >
            {isDoseTaken ? <><Check className="w-3.5 h-3.5" /> Đã uống</> : 'Đã uống'}
          </button>
        </div>

        {/* 6. Vitals Cards 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div
            onClick={() => onNavigate?.('biometrics')}
            className="bg-[#2563EB] text-white rounded-2xl p-3.5 flex flex-col justify-between h-24 shadow-sm cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold opacity-90">Huyết áp</span>
              <span className="text-[10px] font-bold bg-white/20 rounded-full px-2 py-0.5">Tốt</span>
            </div>
            <span className="text-2xl font-black">{latestBp} <span className="text-xs font-normal opacity-80">mmHg</span></span>
          </div>

          <div
            onClick={() => onNavigate?.('biometrics')}
            className="bg-white text-slate-900 rounded-2xl p-3.5 flex flex-col justify-between h-24 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md active:scale-[0.98] transition-all"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-600">Nhịp tim</span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5">Tốt</span>
            </div>
            <span className="text-2xl font-black">{latestHr} <span className="text-xs font-normal text-slate-500">bpm</span></span>
          </div>

          <div
            onClick={() => onNavigate?.('biometrics')}
            className="bg-[#EA580C] text-white rounded-2xl p-3.5 flex flex-col justify-between h-24 shadow-sm cursor-pointer hover:brightness-105 active:scale-[0.98] transition-all"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold opacity-90">Cân nặng</span>
              <span className="text-[10px] font-bold bg-white/20 rounded-full px-2 py-0.5">Theo dõi</span>
            </div>
            <span className="text-2xl font-black">{latestWeight} <span className="text-xs font-normal opacity-80">kg</span></span>
          </div>

          <div
            onClick={() => onNavigate?.('labs')}
            className="bg-white text-slate-900 rounded-2xl p-3.5 flex flex-col justify-between h-24 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md active:scale-[0.98] transition-all"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-600">HbA1c / Đường huyết</span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5">Tốt</span>
            </div>
            <span className="text-2xl font-black">{latestGlucose} <span className="text-xs font-normal text-slate-500">%</span></span>
          </div>
        </div>

        {/* 7. AI Insight Banner */}
        <div
          onClick={() => onNavigate?.('ai')}
          className="bg-gradient-to-r from-[#DDF4EE] via-[#E3EBFF] to-[#FCEBDD] rounded-2xl p-3.5 flex items-center gap-3 shadow-sm cursor-pointer hover:opacity-95 transition-opacity border border-teal-200/50"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] text-white flex items-center justify-center shrink-0 shadow">
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <span className="font-extrabold text-[#1F5F6C] block text-[10px] uppercase">AI INSIGHT</span>
            <span className="font-semibold text-slate-800">Các chỉ số sinh trắc duy trì ở mức an toàn ổn định. Chạm để xem chi tiết.</span>
          </div>
        </div>
      </div>

      {/* Floating Action Button (+) Nhập số đo */}
      <button
        onClick={() => setIsVitalsSheetOpen(true)}
        className="fixed bottom-20 right-6 w-13 h-13 rounded-full bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] text-white flex items-center justify-center shadow-2xl active:scale-90 transition-all z-20"
        title="Nhập số đo nhanh"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Bottom Navigation */}
      <HomeBottomNav
        activeTab="home"
        onTabChange={(tab) => {
          if (tab === 'home') onNavigate?.('home');
          else if (tab === 'health') onNavigate?.('biometrics');
          else if (tab === 'meds') onNavigate?.('meds');
          else if (tab === 'ai') onNavigate?.('ai');
          else if (tab === 'profile') onNavigate?.('profile');
          else if (tab === 'records') onNavigate?.('records');
          else if (tab === 'care') onNavigate?.('care');
        }}
      />

      {/* Biometric Entry Modal Bottom Sheet */}
      <BiometricEntrySheet
        isOpen={isVitalsSheetOpen}
        onClose={() => setIsVitalsSheetOpen(false)}
        onSubmit={handleRecordVitals}
      />
    </div>
  );
};
