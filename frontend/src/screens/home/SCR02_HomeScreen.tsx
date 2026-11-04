import React from 'react';
import { Bell, Pill, Plus, Check, AlertTriangle, FlaskConical, Scan } from 'lucide-react';
import { useHomeLogic } from './useHomeLogic';
import { BiometricEntrySheet } from '../../components/organisms/BiometricEntrySheet';
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
    vitals,
    latestBp,
    latestHr,
    latestWeight,
    latestGlucose,
    isDoseTaken,
    isVitalsSheetOpen,
    setIsVitalsSheetOpen,
    todayDose,
    todayDosesSummary,
    handleRecordVitals,
    handleTakeDose,
  } = useHomeLogic(propMemberId || user?.activeMemberId || 'nam', user);

  const activeMember = members.find((m) => m.id === activeMemberId) || {
    id: activeMemberId,
    full_name: propMemberName || user?.fullName || 'Trần Hữu Nam',
  };

  const displayBp = latestBp;
  const displayHr = latestHr;
  const displayWeight = latestWeight;
  const displayGlucose = latestGlucose;
  const displayScore = healthScore.total > 0 ? healthScore.total : '--';

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#111827] pb-24 relative flex flex-col font-sans select-none">
      {/* Scrollable Content (1:1 with Design) */}
      <div className="flex-1 px-4 pt-4 pb-6 flex flex-col gap-3">
        {/* 1. Top Header: Avatar + Xin chào + SOS + Bell */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate?.('profile')}
            className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] text-white flex items-center justify-center font-black text-base shadow-sm hover:opacity-90 transition-all shrink-0"
          >
            {activeMember.full_name.charAt(0)}
          </button>
          <div
            onClick={() => onNavigate?.('profile')}
            className="flex-1 flex flex-col cursor-pointer min-w-0"
          >
            <span className="text-xs text-slate-500 font-medium">Xin chào,</span>
            <span className="text-base font-extrabold text-slate-900 truncate">{activeMember.full_name}</span>
          </div>
          <button
            onClick={onOpenEmergency}
            className="h-9 px-3.5 rounded-full bg-[#FEE2E2] text-[#DC2626] text-xs font-black tracking-wider shadow-2xs active:scale-95 transition-all shrink-0 flex items-center justify-center"
          >
            SOS
          </button>
          <button
            onClick={() => alert('Chưa có thông báo khẩn cấp mới.')}
            className="w-9 h-9 rounded-full bg-white text-slate-700 flex items-center justify-center shadow-2xs border border-slate-100 shrink-0 hover:bg-slate-50 transition"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Title & Date Tag (1:1 with Design) */}
        <div className="flex flex-col gap-1 pt-1">
          <h1 className="text-2xl font-black text-slate-900 leading-tight">Hôm nay bạn thế nào?</h1>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/70 text-slate-700 text-xs font-semibold shadow-2xs w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Hôm nay: 26/10/2026
          </span>
        </div>

        {/* 3. Health Score Arc Card (1:1 with Design) */}
        <div
          onClick={() => onNavigate?.('biometrics')}
          className="bg-white rounded-[28px] p-5 shadow-xs border border-slate-100 relative flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
        >
          {/* Top-Right Status Badge (Black pill) */}
          <span className="absolute right-4 top-4 bg-slate-900 text-white rounded-full px-3 py-1 text-xs font-bold shadow-2xs">
            {healthScore.status || 'Chưa có số đo'}
          </span>

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
            <circle cx="239" cy="76" r="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />
          </svg>

          <div className="absolute top-15 flex flex-col items-center">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Điểm sức khoẻ</span>
            <div className="flex items-baseline">
              <span className="text-5xl font-black text-slate-900 tracking-tight">
                {displayScore}
              </span>
              <span className="text-emerald-500 text-sm font-black ml-1">▲</span>
            </div>
          </div>

          {/* Two Pills below Arc (1:1 with Design) */}
          <div className="flex items-center gap-2 mt-2 w-full justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/70 text-amber-900 text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              2 vấn đề cần theo dõi
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/70 text-slate-700 text-xs font-bold">
              9 nhóm dữ liệu
            </span>
          </div>
        </div>

        {/* 4. Nhắc uống thuốc Card (1:1 with Design) */}
        <div
          onClick={() => onNavigate?.('meds')}
          className={`bg-white rounded-[24px] p-4 flex items-center justify-between shadow-xs cursor-pointer hover:shadow-sm transition-all border-2 ${
            todayDose ? 'border-amber-300' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              todayDose ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
            }`}>
              <Pill className="w-5 h-5 rotate-45" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-[11px] font-black uppercase tracking-wide ${
                todayDose ? 'text-amber-800' : 'text-slate-400'
              }`}>
                {todayDose
                  ? `NHẮC UỐNG THUỐC · ${todayDose?.scheduled_time ? todayDose.scheduled_time.substring(0, 5) : '20:00'}`
                  : 'ĐƠN THUỐC & NHẮC THUỐC'}
              </span>
              <span className="text-sm font-black text-slate-900 truncate">
                {todayDose
                  ? `${todayDose.name} ${todayDose.dosage || ''}`.trim()
                  : 'Không có lịch uống thuốc hôm nay'}
              </span>
              <span className="text-xs text-slate-500 font-medium truncate">
                {todayDose
                  ? `${todayDose.instructions || '1 viên sau ăn'} · hôm nay ${todayDosesSummary.taken}/${todayDosesSummary.total} liều`
                  : 'Nhấn để xem hoặc thêm đơn thuốc mới'}
              </span>
            </div>
          </div>
          {todayDose ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTakeDose();
              }}
              className={`h-9 px-4 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-xs ${
                isDoseTaken
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
              }`}
            >
              {isDoseTaken ? <><Check className="w-3.5 h-3.5" /> Đã uống</> : 'Đã uống'}
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.('meds');
              }}
              className="h-8 px-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs active:scale-95 transition shrink-0"
            >
              + Thêm
            </button>
          )}
        </div>

        {/* 5. Vitals Cards 2x2 Grid (1:1 with Design) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Huyết áp */}
          <div
            onClick={() => onNavigate?.('biometrics')}
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
            onClick={() => onNavigate?.('biometrics')}
            className="bg-white text-slate-900 rounded-[24px] p-4 flex flex-col justify-between h-28 shadow-xs border border-slate-100 cursor-pointer hover:shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-600">Nhịp tim</span>
              <span className={`text-[10px] font-bold rounded-full px-2.5 py-0.5 ${
                displayHr !== '--' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {displayHr !== '--' ? 'Tốt' : 'Chưa đo'}
              </span>
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="text-3xl font-black">{displayHr}</span>
                <span className="text-xs font-normal text-slate-400 ml-1">bpm</span>
              </div>
              <svg className={`w-full h-3.5 mt-0.5 ${displayHr !== '--' ? 'text-rose-500' : 'text-slate-300'}`} viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
            onClick={() => onNavigate?.('biometrics')}
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
            onClick={() => onNavigate?.('labs')}
            className="bg-white text-slate-900 rounded-[24px] p-4 flex flex-col justify-between h-28 shadow-xs border border-slate-100 cursor-pointer hover:shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-600">HbA1c</span>
              <span className={`text-[10px] font-bold rounded-full px-2.5 py-0.5 ${
                displayGlucose !== '--' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {displayGlucose !== '--' ? 'Tốt' : 'Chưa đo'}
              </span>
            </div>
            <div>
              <span className="text-3xl font-black">{displayGlucose}</span>
              <span className="text-xs font-normal text-slate-400 ml-1">%</span>
            </div>
          </div>
        </div>

        {/* 6. AI INSIGHT Card (1:1 with Design) */}
        <div
          onClick={() => onNavigate?.('ai')}
          className="bg-gradient-to-r from-[#E6F5F2] via-[#EDF3FC] to-[#FCEEE7] rounded-[24px] p-4 flex items-center justify-between border border-teal-100/60 shadow-xs cursor-pointer hover:opacity-95 transition-all"
        >
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-11 h-11 rounded-full bg-[#1F7A8C] text-white flex items-center justify-center shrink-0 shadow-xs">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
                <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-black text-[#1F7A8C] uppercase tracking-wider block">AI INSIGHT</span>
              <span className="text-xs font-bold text-slate-900 leading-snug mt-0.5">
                LDL–C tăng trong 3 lần xét nghiệm gần nhất.
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.('ai');
            }}
            className="px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shrink-0 shadow-xs active:scale-95 transition"
          >
            Xem phân tích
          </button>
        </div>

        {/* 7. Health Timeline Card (1:1 with Design) */}
        <div className="bg-white rounded-[24px] p-4.5 border border-slate-100 shadow-xs flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-900">Health Timeline</span>
            <button
              onClick={() => onNavigate?.('records')}
              className="text-xs font-bold text-[#1F7A8C] hover:underline"
            >
              Xem tất cả
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Timeline Item 1: Xét nghiệm máu */}
            <div
              onClick={() => onNavigate?.('labs')}
              className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <FlaskConical className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-900">Xét nghiệm máu</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">20/10</span>
            </div>

            {/* Timeline Item 2: CT ngực */}
            <div
              onClick={() => onNavigate?.('imaging')}
              className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Scan className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-900">CT ngực</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">08/10</span>
            </div>
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
          else if (tab === 'records') onNavigate?.('records');
          else if (tab === 'ai') onNavigate?.('ai');
          else if (tab === 'care') onNavigate?.('care');
          else if (tab === 'profile') onNavigate?.('profile');
          else if (tab === 'meds') onNavigate?.('meds');
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
