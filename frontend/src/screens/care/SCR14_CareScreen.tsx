import React from 'react';
import { CheckCircle2 } from 'lucide-react';
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

        {/* 2. Tiêu đề màn hình */}
        <h1 className="text-[28px] font-black tracking-tight text-slate-900 leading-tight">
          Chăm sóc
        </h1>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 3. Lịch hẹn sắp tới (Upcoming Appointment) */}
        {upcomingAppointment ? (
          <AppointmentCard
            month={upcomingAppointment.month}
            date={upcomingAppointment.date}
            title={upcomingAppointment.title}
            timeDoctor={upcomingAppointment.timeDoctor}
            onClick={() => setIsScheduleOpen(true)}
          />
        ) : (
          <div
            onClick={() => setIsScheduleOpen(true)}
            className="bg-white rounded-3xl p-4 border border-dashed border-slate-300 text-center text-xs text-slate-500 cursor-pointer hover:bg-slate-50 transition flex items-center justify-between"
          >
            <span>Chưa có lịch khám sắp tới</span>
            <span className="text-[#1F7A8C] font-extrabold">+ Đặt lịch ngay</span>
          </div>
        )}

        {/* 4. My Care Team (Horizontal Chips) */}
        {careTeam.length > 0 ? (
          <CareTeamRow
            team={careTeam}
            selectedId={selectedMemberId}
            onSelectMember={setSelectedMemberId}
            onAddDoctor={() => openAddDoctorModal()}
          />
        ) : (
          <div className="bg-white rounded-3xl p-4 border border-slate-100 text-center text-xs text-slate-400 flex items-center justify-between">
            <span>Chưa có bác sĩ trong đội ngũ</span>
            <button
              onClick={() => openAddDoctorModal()}
              className="text-[#1F7A8C] font-bold text-xs hover:underline"
            >
              + Thêm bác sĩ
            </button>
          </div>
        )}

        {/* 5. Doctor Profile Card */}
        {selectedMember && (
          <DoctorProfileCard
            member={selectedMember}
            onSendPreExamDossier={handleSendPreExamDossier}
            onEdit={() => openAddDoctorModal(selectedMember.role)}
          />
        )}
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
