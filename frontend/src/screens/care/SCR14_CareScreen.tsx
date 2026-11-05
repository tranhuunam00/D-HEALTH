import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { HomeBottomNav } from '../home/HomeBottomNav';
import { useCareLogic } from './useCareLogic';
import { AppointmentCard } from './components/AppointmentCard';
import { CareTeamRow } from './components/CareTeamRow';
import { DoctorProfileCard } from './components/DoctorProfileCard';
import { DataSharingBox } from './components/DataSharingBox';
import { AddDoctorSheet } from './components/AddDoctorSheet';
import { ScreenHeaderPills } from '../../components/molecules/ScreenHeaderPills';

interface SCR14Props {
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberName?: string;
  readonly activeMemberId?: string;
}

export const SCR14_CareScreen: React.FC<SCR14Props> = ({
  onNavigate,
  activeMemberName = '',
  activeMemberId = 'nam',
}) => {
  const {
    upcomingAppointment,
    careTeam,
    selectedMember,
    selectedMemberId,
    setSelectedMemberId,
    selectedCategory,
    sharingStats,
    isAddDoctorOpen,
    setIsAddDoctorOpen,
    openAddDoctorModal,
    successMsg,
    handleSendPreExamDossier,
    handleAddDoctor,
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
          />
        ) : (
          <div className="bg-white rounded-3xl p-4 border border-slate-100 text-center text-xs text-slate-400">
            Không có lịch khám sắp tới
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

        {/* 6. Data Sharing Permission Box */}
        <DataSharingBox
          activeCount={sharingStats.activeCount}
          expiringDays={sharingStats.expiringDays}
          onManage={() => alert('Quản lý phân quyền truy cập hồ sơ y tế theo Nghị định 13/2023/NĐ-CP.')}
        />
      </div>

      {/* Add / Select Doctor Bottom Sheet */}
      <AddDoctorSheet
        isOpen={isAddDoctorOpen}
        onClose={() => setIsAddDoctorOpen(false)}
        initialCategory={selectedCategory}
        onSubmit={handleAddDoctor}
      />

      {/* Bottom Nav */}
      <HomeBottomNav activeTab="care" onTabChange={(tab) => onNavigate(tab)} />
    </div>
  );
};
