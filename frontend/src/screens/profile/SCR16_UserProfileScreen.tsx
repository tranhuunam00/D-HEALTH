import React from 'react';
import { Camera, ArrowLeft, CheckCircle2, ChevronDown, Edit3, ShieldCheck, HeartPulse } from 'lucide-react';
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
  const { user, activeMember, isEditOpen, setIsEditOpen, successMsg, bmi, handleUpdateProfile } = useProfileLogic(propUser, activeMemberId);

  const realPhone = (user?.phoneNumber && !user.phoneNumber.startsWith('gg_'))
    ? user.phoneNumber
    : '[Chưa cập nhật SĐT]';

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans select-none pb-12">
      {/* 1. Header Badges */}
      <div className="flex gap-1.5 items-center flex-wrap px-4 pt-4 shrink-0">
        <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-white text-slate-700 text-xs font-semibold shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Hôm nay: 26/10/2026
        </span>
        <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-[#111827] text-white text-xs font-semibold shadow-xs">
          Hồ sơ sức khoẻ: <b>{activeMember.full_name}</b>
        </span>
      </div>

      {/* 2. Topbar Navigation matching Original Design */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-xs active:scale-95 transition"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 leading-tight">Thông tin người dùng</h1>
            <span className="text-[10px] text-slate-400 font-semibold block">Hồ Sơ Sức Khỏe Cá Nhân</span>
          </div>
        </div>

        <button
          onClick={() => setIsEditOpen(true)}
          className="h-8 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition"
        >
          <span>Lưu</span>
        </button>
      </div>

      <div className="flex-1 px-4 space-y-3.5 overflow-y-auto">
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 3. Hero Avatar & Identity Card with Pastel Gradient (Original Design 1:1) */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#E0F2FE] via-[#EDE9FE] to-[#FCE7F3] flex flex-col items-center text-center shadow-xs border border-slate-200/50 relative">
          <div className="relative mb-2.5">
            <div className="w-20 h-20 rounded-full bg-white border-2 border-white shadow-md overflow-hidden flex items-center justify-center text-2xl font-black text-[#1F7A8C]">
              {activeMember.avatar_url ? (
                <img src={activeMember.avatar_url} alt={activeMember.full_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-[#1F7A8C]">{activeMember.full_name.charAt(0)}</span>
              )}
            </div>
            <button
              onClick={() => setIsEditOpen(true)}
              aria-label="Đổi ảnh đại diện"
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-white shadow"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <h2 className="text-lg font-black text-slate-900">{activeMember.full_name}</h2>
          <div className="flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-emerald-700">Đã xác thực định danh điện tử</span>
          </div>
        </div>

        {/* 4. Card 1: THÔNG TIN CÁ NHÂN (Original Design 1:1) */}
        <div className="bg-white rounded-3xl p-4.5 shadow-xs border border-slate-100 flex flex-col gap-3">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
            THÔNG TIN CÁ NHÂN
          </span>

          <div>
            <label className="text-xs text-slate-500 font-medium block">Số căn cước công dân</label>
            <span className="text-sm font-bold text-slate-900">[Số CCCD – 12 chữ số]</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-50">
            <div>
              <label className="text-xs text-slate-500 font-medium block">Ngày sinh</label>
              <span className="text-sm font-bold text-slate-900">
                {activeMember.birth_date ? new Date(activeMember.birth_date).toLocaleDateString('vi-VN') : '20/06/1985'}
              </span>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium block">Giới tính</label>
              <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                <span>{activeMember.gender || 'Nam'}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="pt-1 border-t border-slate-50">
            <label className="text-xs text-slate-500 font-medium block">Số điện thoại</label>
            <span className="text-sm font-bold text-slate-900 font-mono">
              {realPhone}
            </span>
          </div>

          <div className="pt-1 border-t border-slate-50">
            <label className="text-xs text-slate-500 font-medium block">Email</label>
            <span className="text-sm font-bold text-slate-900">
              {user?.email || 'tranhuunam@gmail.com'}
            </span>
          </div>

          <div className="pt-1 border-t border-slate-50">
            <label className="text-xs text-slate-500 font-medium block">Địa chỉ</label>
            <span className="text-sm font-bold text-slate-900">
              {user?.address || '[Số nhà, đường, phường/xã, tỉnh/thành phố]'}
            </span>
          </div>
        </div>

        {/* 5. Card 2: THÔNG TIN Y TẾ · CHỈ SỐ THỂ TRẠNG NỀN (Original Design 1:1) */}
        <div className="bg-white rounded-3xl p-4.5 shadow-xs border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                THÔNG TIN Y TẾ
              </span>
              <span className="text-xs text-slate-500 font-medium">Chỉ Số Thể Trạng Nền</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Chỉ số khối (BMI): <b className="text-slate-900">{bmi}</b>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block mb-0.5">Nhóm máu</span>
              <span className="text-lg font-black text-rose-600">
                {activeMember.blood_type || '--'}
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block mb-0.5">Chiều cao</span>
              <span className="text-lg font-black text-slate-900">
                {activeMember.height_cm ? `${activeMember.height_cm} cm` : '-- cm'}
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block mb-0.5">Cân nặng</span>
              <span className="text-lg font-black text-slate-900">
                {activeMember.weight_kg ? `${activeMember.weight_kg} kg` : '-- kg'}
              </span>
            </div>
          </div>
        </div>

        {/* 6. Link chuyển sang PC Admin */}
        {onNavigateToAdmin && (
          <button
            onClick={onNavigateToAdmin}
            className="w-full py-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition-all active:scale-[0.99] flex items-center justify-center gap-1.5"
          >
            <span>Chuyển sang Quản Trị Hệ Thống (PC Admin)</span>
          </button>
        )}

        {/* 7. Nghị Định 13/2023/NĐ-CP */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Tuân Thủ Nghị Định 13/2023/NĐ-CP</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
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
