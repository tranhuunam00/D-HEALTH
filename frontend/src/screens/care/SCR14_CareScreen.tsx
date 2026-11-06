import React from 'react';
import { CheckCircle2, Calendar, Plus } from 'lucide-react';
import { HomeBottomNav } from '../home/HomeBottomNav';
import { useCareLogic } from './useCareLogic';
import { AppointmentCard } from './components/AppointmentCard';
import { CareTeamRow } from './components/CareTeamRow';
import { DoctorProfileCard } from './components/DoctorProfileCard';
import { AddDoctorSheet } from './components/AddDoctorSheet';
import { ScheduleAppointmentSheet } from './components/ScheduleAppointmentSheet';
import { ScreenHeaderPills } from '../../components/molecules/ScreenHeaderPills';

interface SCR14Props {
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberName?: string;
  readonly activeMemberId?: string;
}

export const SCR14_CareScreen: React.FC<SCR14Props> = ({
  onNavigate,
  activeMemberName = '',
  activeMemberId = 'mem_145deb71',
}) => {
  const {
    upcomingAppointment,
    careTeam,
    selectedMember,
    selectedMemberId,
    setSelectedMemberId,
    selectedCategory,
    isAddDoctorOpen,
    setIsAddDoctorOpen,
    isScheduleOpen,
    setIsScheduleOpen,
    openAddDoctorModal,
    successMsg,
    handleSendPreExamDossier,
    handleAddDoctor,
    handleScheduleAppointment,
  } = useCareLogic(activeMemberId);

  return (
    <div className="w-full min-h-screen relative bg-[#F1F5F9] text-[#111827] flex flex-col font-sans select-none pb-20">
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-32 flex flex-col gap-3.5">
        {/* 1. Header Badges */}
        <ScreenHeaderPills
          activeMemberName={activeMemberName}
          onSelectMember={() => onNavigate?.('family')}
        />

        {/* 2. Tiêu đề màn hình + Nút Đặt lịch khám nhanh */}
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-black tracking-tight text-slate-900 leading-tight">
            Chăm sóc
          </h1>
          <button
            type="button"
            onClick={() => setIsScheduleOpen(true)}
            className="h-8 px-3.5 rounded-full bg-[#1F7A8C] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-[#186473] active:scale-95 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Đặt lịch khám</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 3. Danh sách Bác sĩ chuyên khoa (Cho lên đầu để người dùng xem tham khảo) */}
        {careTeam.length > 0 ? (
          <CareTeamRow
            team={careTeam}
            selectedId={selectedMemberId}
            onSelectMember={setSelectedMemberId}
            onAddDoctor={() => openAddDoctorModal()}
          />
        ) : (
          <div className="bg-white rounded-3xl p-4 border border-slate-100 text-center text-xs text-slate-400 flex items-center justify-between shadow-2xs">
            <span>Chưa có bác sĩ trong đội ngũ</span>
            <button
              onClick={() => openAddDoctorModal()}
              className="text-[#1F7A8C] font-bold text-xs hover:underline cursor-pointer"
            >
              + Thêm bác sĩ
            </button>
          </div>
        )}

        {/* 4. Hồ sơ Bác sĩ tham khảo được chọn */}
        {selectedMember && (
          <DoctorProfileCard
            member={selectedMember}
            onSendPreExamDossier={handleSendPreExamDossier}
            onEdit={() => openAddDoctorModal(selectedMember.role)}
            onBookAppointment={() => setIsScheduleOpen(true)}
          />
        )}

        {/* 5. Khối Lịch Khám Định Kỳ & Tái Khám */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#1F7A8C]" />
              <h3 className="text-sm font-extrabold text-slate-900">
                Lịch Khám Định Kỳ
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsScheduleOpen(true)}
              className="text-xs font-bold text-[#1F7A8C] hover:text-[#186473] flex items-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm lịch khám</span>
            </button>
          </div>

          {upcomingAppointment ? (
            <div className="flex flex-col gap-2">
              <AppointmentCard
                month={upcomingAppointment.month}
                date={upcomingAppointment.date}
                title={upcomingAppointment.title}
                timeDoctor={upcomingAppointment.timeDoctor}
                onClick={() => setIsScheduleOpen(true)}
              />
              <button
                type="button"
                onClick={() => setIsScheduleOpen(true)}
                className="w-full py-2.5 rounded-2xl border border-dashed border-slate-300 bg-white/70 hover:bg-white text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#1F7A8C]" />
                <span>Đặt thêm lịch khám định kỳ mới</span>
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsScheduleOpen(true)}
              className="bg-white rounded-3xl p-4.5 border border-dashed border-slate-300 text-xs text-slate-600 cursor-pointer hover:bg-slate-50/80 transition flex items-center justify-between shadow-2xs group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#1F7A8C] flex items-center justify-center group-hover:bg-[#1F7A8C] group-hover:text-white transition">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-800 text-xs">Chưa có lịch khám định kỳ</div>
                  <div className="text-[11px] text-slate-400">Đặt lịch tái khám với bác sĩ chuyên khoa</div>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-[#1F7A8C] text-white font-bold text-xs shadow-xs group-hover:bg-[#186473] transition">
                Đặt lịch ngay
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Add / Select Doctor Bottom Sheet */}
      <AddDoctorSheet
        isOpen={isAddDoctorOpen}
        onClose={() => setIsAddDoctorOpen(false)}
        initialCategory={selectedCategory}
        onSubmit={handleAddDoctor}
      />

      {/* Schedule / Reschedule Appointment Bottom Sheet */}
      <ScheduleAppointmentSheet
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        doctors={careTeam}
        onSchedule={handleScheduleAppointment}
      />

      {/* Bottom Nav */}
      <HomeBottomNav activeTab="care" onTabChange={(tab) => onNavigate(tab)} />
    </div>
  );
};
