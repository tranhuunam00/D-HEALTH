import React from 'react';
import { ArrowLeft, Edit3, ShieldCheck, Droplet, Activity, Phone } from 'lucide-react';
import { useProfileLogic } from './useProfileLogic';
import { EditProfileBottomSheet } from './EditProfileBottomSheet';
import { User as UserType } from '../../types/auth.types';

export interface UserProfileScreenProps {
  onBack: () => void;
  onNavigateToAdmin?: () => void;
  user?: UserType | null;
  activeMemberId?: string;
}

export const SCR16_UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  onBack,
  onNavigateToAdmin,
  user: propUser,
  activeMemberId,
}) => {
  const {
    user,
    activeMember,
    isEditOpen,
    setIsEditOpen,
    bmi,
    handleUpdateProfile,
  } = useProfileLogic(propUser, activeMemberId);

  const realPhone =
    user?.phoneNumber && !user.phoneNumber.startsWith('gg_')
      ? user.phoneNumber
      : null;

  const displayBlood = activeMember.blood_type || user?.bloodType || 'Chưa rõ';
  const displayHeight = activeMember.height_cm || user?.heightCm;
  const displayWeight = activeMember.weight_kg || user?.weightKg;
  const formattedWeight = displayWeight ? displayWeight.toString().replace('.', ',') : null;

  return (
    <div className="w-full min-h-screen bg-[#070E1E] text-white flex flex-col font-sans select-none pb-10">
      {/* 1. Header with back button */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="p-2 text-slate-300 hover:text-white cursor-pointer active:scale-95 transition"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-black tracking-wider uppercase text-white pr-7 flex-1 text-center">
          HỒ SƠ SỨC KHỎE CÁ NHÂN
        </h1>
      </div>

      <div className="flex-1 px-4 space-y-4 overflow-y-auto pt-1">
        {/* 2. User Profile Identity Box (1:1 with Design) */}
        <div className="bg-[#131F37] rounded-[28px] p-6 border border-slate-700/60 flex flex-col items-center text-center relative shadow-lg">
          <div className="relative mb-1">
            <div className="w-20 h-20 rounded-full bg-[#1E293B] border-2 border-teal-400/80 shadow-md overflow-hidden flex items-center justify-center text-2xl font-black text-white">
              {activeMember.avatar_url ? (
                <img
                  src={activeMember.avatar_url}
                  alt={activeMember.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{(activeMember.full_name || 'B').charAt(0)}</span>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-teal-500 border-2 border-[#131F37] flex items-center justify-center text-white text-[11px] font-bold shadow">
              ✓
            </div>
          </div>

          <h2 className="text-xl font-black text-white mt-2">
            {activeMember.full_name || 'Trần Hữu Nam'}
          </h2>
          <span className="text-[10px] font-black text-[#38BDF8] tracking-widest uppercase mt-1">
            CHỦ TÀI KHOẢN (BỆNH NHÂN CHÍNH)
          </span>

          {realPhone && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{realPhone}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="mt-4 px-5 py-2 rounded-full bg-[#1E293B] hover:bg-slate-700 text-slate-200 border border-slate-600/70 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Chỉnh Sửa Hồ Sơ</span>
          </button>
        </div>

        {/* 3. Chỉ Số Thể Trạng Nền (1:1 with Design) */}
        <div>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2.5 px-1 block">
            CHỈ SỐ THỂ TRẠNG NỀN
          </span>

          <div className="grid grid-cols-2 gap-3">
            {/* Nhóm máu */}
            <div className="bg-[#131F37] rounded-2xl p-4 border border-slate-700/60 flex flex-col justify-between min-h-[96px]">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Nhóm máu</span>
                <Droplet className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-white mt-1">
                {displayBlood}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                Hệ ABO / Rh
              </span>
            </div>

            {/* BMI */}
            <div className="bg-[#131F37] rounded-2xl p-4 border border-slate-700/60 flex flex-col justify-between min-h-[96px]">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Chỉ số khối (BMI)</span>
                <Activity className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-2xl font-black text-white mt-1">
                {bmi}
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">
                Thể trạng bình thường
              </span>
            </div>

            {/* Chiều cao */}
            <div className="bg-[#131F37] rounded-2xl p-4 border border-slate-700/60 flex flex-col justify-between min-h-[96px]">
              <span className="text-xs text-slate-400 font-medium">
                Chiều cao
              </span>
              <div className="mt-1">
                <span className="text-2xl font-black text-white">
                  {displayHeight || '--'}
                </span>
                {displayHeight && <span className="text-xs text-slate-400 ml-1">cm</span>}
              </div>
              <div className="h-2" />
            </div>

            {/* Cân nặng */}
            <div className="bg-[#131F37] rounded-2xl p-4 border border-slate-700/60 flex flex-col justify-between min-h-[96px]">
              <span className="text-xs text-slate-400 font-medium">
                Cân nặng
              </span>
              <div className="mt-1">
                <span className="text-2xl font-black text-white">
                  {formattedWeight || '--'}
                </span>
                {formattedWeight && <span className="text-xs text-slate-400 ml-1">kg</span>}
              </div>
              <div className="h-2" />
            </div>
          </div>
        </div>

        {/* 4. Chuyển sang PC Admin (1:1 with Design) */}
        {onNavigateToAdmin && (
          <button
            type="button"
            onClick={onNavigateToAdmin}
            className="w-full py-3.5 rounded-2xl bg-[#26163F] hover:bg-[#341F54] border border-purple-500/40 text-purple-200 text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer shadow"
          >
            <span>Chuyển sang Quản Trị Hệ Thống (PC Admin)</span>
          </button>
        )}

        {/* 5. Tuân thủ Nghị Định 13/2023/NĐ-CP (1:1 with Design) */}
        <div className="bg-[#131F37] rounded-2xl p-4 border border-slate-700/60 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Tuân Thủ Nghị Định 13/2023/NĐ-CP</span>
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
