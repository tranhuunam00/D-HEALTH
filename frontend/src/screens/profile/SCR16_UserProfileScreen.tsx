import React from 'react';
import { User, ShieldCheck, HeartPulse, Edit3, ArrowLeft, Activity, Droplets, Calendar, Phone } from 'lucide-react';
import { useProfileLogic } from './useProfileLogic';
import { EditProfileBottomSheet } from './EditProfileBottomSheet';
import { Button } from '../../components/atoms/Button';

export interface UserProfileScreenProps {
  onBack: () => void;
  onNavigateToAdmin?: () => void;
}

export const SCR16_UserProfileScreen: React.FC<UserProfileScreenProps> = ({ onBack, onNavigateToAdmin }) => {
  const { user, activeMember, isEditOpen, setIsEditOpen, successMsg, bmi, handleUpdateProfile } = useProfileLogic();

  return (
    <div className="w-full min-h-screen bg-[#0B132B] text-white flex flex-col pb-12">
      {/* 1. Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-[#0B132B]/90 sticky top-0 z-20">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800" aria-label="Quay lại">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Hồ Sơ Sức Khỏe Cá Nhân</h2>
        <div className="w-9" />
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 2. Avatar & Identity Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1F7A8C]/20 via-slate-900 to-slate-900 border border-slate-800 flex flex-col items-center text-center relative shadow-xl">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-[#1F7A8C] flex items-center justify-center text-2xl font-black text-white shadow-lg">
              {activeMember.full_name.charAt(0)}
            </div>
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#1F7A8C] border-2 border-[#0B132B] flex items-center justify-center text-[10px] text-white font-bold">
              ✓
            </span>
          </div>

          <h3 className="text-lg font-black text-white">{activeMember.full_name}</h3>
          <span className="text-[11px] font-semibold text-[#1F7A8C] uppercase tracking-wider mt-0.5">
            Chủ Tài Khoản (Bệnh Nhân Chính)
          </span>

          <div className="flex items-center gap-2 text-slate-400 text-xs mt-2">
            <Phone className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono">{user?.phoneNumber || '0987654321'}</span>
          </div>

          <button
            onClick={() => setIsEditOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 border border-slate-700/80 transition-all active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#1F7A8C]" />
            Chỉnh Sửa Hồ Sơ
          </button>
        </div>

        {/* 3. Vitals Baseline (Physical Metrics Grid) */}
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">
            Chỉ Số Thể Trạng Nền
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Nhóm máu</span>
                <Droplets className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-xl font-black text-white">{activeMember.blood_type || 'Chưa rõ'}</div>
              <span className="text-[10px] text-slate-500">Hệ ABO / Rh</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Chỉ số khối (BMI)</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-black text-white">{bmi}</div>
              <span className="text-[10px] text-emerald-400 font-medium">Thể trạng bình thường</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-xs">Chiều cao</span>
              <div className="text-xl font-black text-white mt-1">
                {activeMember.height_cm || '--'} <span className="text-xs font-normal text-slate-500">cm</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-xs">Cân nặng</span>
              <div className="text-xl font-black text-white mt-1">
                {activeMember.weight_kg || '--'} <span className="text-xs font-normal text-slate-500">kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Link to PC Admin Dashboard */}
        {onNavigateToAdmin && (
          <button
            onClick={onNavigateToAdmin}
            className="w-full p-3.5 rounded-2xl bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-purple-900/50 transition-all active:scale-98"
          >
            <span>Chuyển sang Quản Trị Hệ Thống (PC Admin)</span>
          </button>
        )}

        {/* 5. Decree 13 Compliance Card */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            Tuân Thủ Nghị Định 13/2023/NĐ-CP
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Hồ sơ y tế của bạn được mã hóa hai đầu và lưu trữ an toàn. Dữ liệu chỉ được chia sẻ cho bác sĩ khi có sự cho phép rõ ràng từ bạn.
          </p>
        </div>
      </div>

      {/* Edit Profile Bottom Sheet */}
      <EditProfileBottomSheet
        isOpen={isEditOpen}
        member={activeMember}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleUpdateProfile}
      />
    </div>
  );
};
