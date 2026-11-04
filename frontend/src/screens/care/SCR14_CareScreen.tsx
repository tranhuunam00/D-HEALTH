import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { HomeBottomNav } from '../home/HomeBottomNav';
import { useCareLogic } from './useCareLogic';
import { AppointmentCard } from './components/AppointmentCard';
import { CareTeamRow } from './components/CareTeamRow';
import { DoctorProfileCard } from './components/DoctorProfileCard';
import { DataSharingBox } from './components/DataSharingBox';
import { AddDoctorSheet } from './components/AddDoctorSheet';

interface SCR14Props {
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberName?: string;
  readonly activeMemberId?: string;
}

export const SCR14_CareScreen: React.FC<SCR14Props> = ({
  onNavigate,
  activeMemberName = 'Trần Minh Khang',
  activeMemberId = 'nam',
}) => {
  const {
    upcomingAppointment,
    careTeam,
    selectedMember,
    selectedMemberId,
    setSelectedMemberId,
    sharingStats,
    isAddDoctorOpen,
    setIsAddDoctorOpen,
    successMsg,
    handleSendPreExamDossier,
    handleAddDoctor,
  } = useCareLogic(activeMemberId);

  return (
    <div className="w-full min-h-screen relative bg-[#F1F5F9] text-[#111827] flex flex-col font-sans select-none pb-20">
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 flex flex-col gap-3.5">
        {/* 1. Header Badges */}
        <div className="flex gap-1.5 items-center flex-wrap shrink-0">
          <span className="inline-flex items-center gap-1.5 h-6.5 px-3 rounded-full bg-white text-slate-700 text-xs font-semibold shadow-xs border border-slate-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Hôm nay: 26/10/2026
          </span>
          <span className="inline-flex items-center gap-1.5 h-6.5 px-3 rounded-full bg-[#111827] text-white text-xs font-semibold shadow-xs">
            <span>👤</span>
            <span>Hồ sơ sức khoẻ:</span>
            <b>{activeMemberName}</b>
          </span>
        </div>

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
        <AppointmentCard
          month={upcomingAppointment.month}
          date={upcomingAppointment.date}
          title={upcomingAppointment.title}
          timeDoctor={upcomingAppointment.timeDoctor}
        />

        {/* 4. My Care Team (Horizontal Chips) */}
        <CareTeamRow
          team={careTeam}
          selectedId={selectedMemberId}
          onSelectMember={setSelectedMemberId}
          onAddDoctor={() => setIsAddDoctorOpen(true)}
        />

        {/* 5. Doctor Profile Card */}
        {selectedMember && (
          <DoctorProfileCard
            member={selectedMember}
            onSendPreExamDossier={handleSendPreExamDossier}
            onEdit={() => setIsAddDoctorOpen(true)}
          />
        )}

        {/* 6. Data Sharing Permission Box */}
        <DataSharingBox
          activeCount={sharingStats.activeCount}
          expiringDays={sharingStats.expiringDays}
          onManage={() => alert('Quản lý phân quyền truy cập hồ sơ y tế theo Nghị định 13/2023/NĐ-CP.')}
        />
      </div>

      {/* Add Doctor Bottom Sheet */}
      <AddDoctorSheet
        isOpen={isAddDoctorOpen}
        onClose={() => setIsAddDoctorOpen(false)}
        onSubmit={handleAddDoctor}
      />

      {/* 7. Bottom Navigation */}
      <HomeBottomNav
        activeTab="care"
        onTabChange={(tab) => onNavigate(tab)}
      />
    </div>
  );
};
