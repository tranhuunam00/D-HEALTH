import React from 'react';
import { ArrowLeft, Edit3, Camera, CheckCircle2 } from 'lucide-react';
import { useMedsLogic } from './useMedsLogic';
import { MedAdherenceCard } from './components/MedAdherenceCard';
import { MedMonthCalendar } from './components/MedMonthCalendar';
import { TodayDoseList } from './components/TodayDoseList';
import { AddMedicationSheet } from './components/AddMedicationSheet';
import { ScreenHeaderPills } from '../../components/molecules/ScreenHeaderPills';

interface SCR11Props {
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberName?: string;
  readonly activeMemberId?: string;
}

export const SCR11_MedsScreen: React.FC<SCR11Props> = ({
  onNavigate,
  activeMemberName = '',
  activeMemberId = 'nam',
}) => {
  const {
    activeTab,
    setActiveTab,
    selectedDay,
    setSelectedDay,
    doses,
    adherence,
    isAddOpen,
    setIsAddOpen,
    successMsg,
    handleTakeDose,
    handleSkipDose,
    handleSnoozeDose,
    handleAddMedication,
    handleSendHistory,
  } = useMedsLogic(activeMemberId);

  return (
    <div className="w-full min-h-screen bg-[#F1F5F9] text-[#111827] flex flex-col font-sans select-none pb-12">
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-32 flex flex-col gap-3.5">
        {/* 1. Header Badges */}
        <ScreenHeaderPills
          activeMemberName={activeMemberName}
          onSelectMember={() => onNavigate('family')}
        />

        {/* 2. Topbar Navigation */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            aria-label="Quay lại"
            className="w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-xs border border-slate-100 active:scale-95 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Quản lý dùng thuốc
          </h1>
        </div>

        {/* 3. Segmented 3 Tabs */}
        <div className="bg-slate-200/60 p-1 rounded-2xl flex items-center">
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'schedule'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lịch thuốc
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'active'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đang dùng
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tiền sử
          </button>
        </div>

        {/* Success notification */}
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 4. Banner Tuân thủ 30 ngày */}
        <MedAdherenceCard
          adherencePercent={adherence.adherencePercent}
          takenCount={adherence.takenCount}
          missedCount={adherence.missedCount}
          skippedCount={adherence.skippedCount}
          todayTaken={adherence.todayTaken}
          todayTotal={adherence.todayTotal}
        />

        {/* 5. Calendar Tháng 10/2026 */}
        <MedMonthCalendar
          days={adherence.calendarDays}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />

        {/* 6. Danh sách cữ thuốc theo ngày được chọn */}
        <TodayDoseList
          selectedDay={selectedDay}
          doses={doses}
          onTakeDose={handleTakeDose}
          onSkipDose={handleSkipDose}
          onSnoozeDose={handleSnoozeDose}
        />

        {/* 7. Card Thêm thuốc (Nhập thủ công + AI Camera) */}
        <div className="bg-white rounded-[28px] p-4.5 shadow-xs border border-slate-100 flex flex-col gap-2">
          <h4 className="text-sm font-extrabold text-slate-900">Thêm thuốc</h4>
          <p className="text-xs text-slate-400 font-medium">
            Thuốc mới sẽ tự động vào lịch nhắc và Calendar
          </p>
          <div className="grid grid-cols-2 gap-3 mt-1.5">
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="py-3 px-3 rounded-2xl border border-slate-200/90 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 transition"
            >
              <Edit3 className="w-4 h-4 text-slate-600" />
              <span>Nhập thủ công</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('camera-ocr')}
              className="py-3 px-3 rounded-2xl border border-slate-200/90 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 transition"
            >
              <Camera className="w-4 h-4 text-slate-600" />
              <span>AI Camera</span>
            </button>
          </div>
        </div>

        {/* 8. Nút Gửi tiền sử dùng thuốc cho bác sĩ */}
        <button
          type="button"
          onClick={handleSendHistory}
          className="w-full py-3.5 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition text-center"
        >
          Gửi tiền sử dùng thuốc cho bác sĩ
        </button>
      </div>

      {/* Add Medication Bottom Sheet */}
      <AddMedicationSheet
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddMedication}
      />
    </div>
  );
};
