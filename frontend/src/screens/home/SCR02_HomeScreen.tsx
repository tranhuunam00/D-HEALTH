import React from 'react';
import { HeartPulse, Plus, AlertCircle, ShieldAlert, Pill, Activity, User, Smile, Meh, Frown } from 'lucide-react';
import { useHomeLogic } from './useHomeLogic';
import { HealthScoreCard } from '../../components/organisms/HealthScoreCard';
import { BiometricEntrySheet } from '../../components/organisms/BiometricEntrySheet';

export const SCR02_HomeScreen: React.FC<{ onOpenEmergency: () => void }> = ({ onOpenEmergency }) => {
  const {
    members,
    activeMemberId,
    setActiveMemberId,
    healthScore,
    isVitalsSheetOpen,
    setIsVitalsSheetOpen,
    checkinStatus,
    handleRecordVitals,
    handleQuickCheckin,
  } = useHomeLogic();

  return (
    <div className="w-full max-w-[390px] mx-auto min-h-[844px] bg-[#0B132B] text-white flex flex-col pb-20 relative">
      {/* 1. Top Bar: Member Chips & SOS Button */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800/80 sticky top-0 bg-[#0B132B]/95 backdrop-blur z-20">
        {/* Chip Carousel Ngang chọn thành viên */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 flex-1 mr-2">
          {members.length > 0 ? (
            members.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMemberId(m.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeMemberId === m.id
                    ? 'bg-[#1F7A8C] text-white shadow-md shadow-[#1F7A8C]/30'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3 h-3" />
                {m.full_name}
              </button>
            ))
          ) : (
            <span className="text-xs text-slate-400">Đang tải hồ sơ...</span>
          )}
        </div>

        {/* Nút SOS Cấp Cứu Nhanh (SCR-16) */}
        <button
          onClick={onOpenEmergency}
          className="px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-900/30 animate-pulse shrink-0"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          SOS
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        {/* 2. Điểm Sức Khỏe Tổng Thể */}
        <HealthScoreCard score={healthScore} />

        {/* 3. Daily Check-in: Cảm xúc & Triệu chứng hôm nay */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
            <span>Cảm xúc sức khỏe hôm nay?</span>
            {checkinStatus && <span className="text-[10px] text-emerald-400 font-normal">Đã lưu: {checkinStatus}</span>}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Khỏe mạnh', icon: Smile, color: 'text-emerald-400' },
              { label: 'Hơi mệt', icon: Meh, color: 'text-amber-400' },
              { label: 'Đau / Sốt', icon: Frown, color: 'text-rose-400' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => handleQuickCheckin(item.label)}
                className={`p-2 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                  checkinStatus === item.label
                    ? 'bg-[#1F7A8C]/30 border-[#1F7A8C] text-white'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Chỉ số Vitals gần nhất (Cards) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Huyết áp</span>
              <HeartPulse className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-lg font-black text-white">120/80 <span className="text-[10px] font-normal text-slate-400">mmHg</span></div>
            <span className="text-[10px] text-emerald-400 font-medium">Bình thường</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Nhịp tim</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-black text-white">76 <span className="text-[10px] font-normal text-slate-400">BPM</span></div>
            <span className="text-[10px] text-emerald-400 font-medium">Ổn định</span>
          </div>
        </div>

        {/* 5. Nhắc uống thuốc hôm nay */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Metformin 500mg</div>
              <div className="text-[10px] text-slate-400">Uống sau bữa ăn tối (20:00)</div>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-[#1F7A8C] hover:bg-[#1F7A8C]/80 text-white text-[11px] font-bold">
            Đã uống
          </button>
        </div>
      </div>

      {/* 6. Floating Action Button (+) Nhập số đo nhanh */}
      <button
        onClick={() => setIsVitalsSheetOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] text-white flex items-center justify-center shadow-2xl shadow-[#1F7A8C]/50 active:scale-95 transition-all z-30"
        aria-label="Nhập số đo"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* 7. Bottom Sheet Nhập số đo */}
      <BiometricEntrySheet
        isOpen={isVitalsSheetOpen}
        onClose={() => setIsVitalsSheetOpen(false)}
        onSubmit={handleRecordVitals}
      />
    </div>
  );
};
