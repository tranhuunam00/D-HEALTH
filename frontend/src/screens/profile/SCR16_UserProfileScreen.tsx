import React, { useRef } from 'react';
import { ArrowLeft, Camera, Check, ShieldCheck, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
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
    loading,
    isEditOpen,
    setIsEditOpen,
    successMsg,
    errorMsg,
    fullName,
    setFullName,
    gender,
    setGender,
    birthDate,
    setBirthDate,
    bloodType,
    setBloodType,
    heightCm,
    setHeightCm,
    weightKg,
    setWeightKg,
    avatarUrl,
    setAvatarUrl,
    citizenId,
    setCitizenId,
    address,
    setAddress,
    bmi,
    handleUpdateProfile,
    handleSaveDirect,
  } = useProfileLogic(propUser, activeMemberId);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const realPhone = user?.phoneNumber && !user.phoneNumber.startsWith('gg_')
    ? user.phoneNumber
    : '0901234567';

  const userEmail = user?.email || 'minhkhang.demo@example.com';

  const getBmiCategory = (val: string) => {
    const n = parseFloat(val);
    if (isNaN(n) || n <= 0) return { label: 'Chưa đủ dữ liệu', color: 'text-slate-500' };
    if (n < 18.5) return { label: 'Thiếu cân', color: 'text-amber-500' };
    if (n < 23) return { label: 'Bình thường (chuẩn Châu Á)', color: 'text-emerald-600' };
    if (n < 25) return { label: 'Tiền béo phì', color: 'text-amber-600' };
    return { label: 'Béo phì', color: 'text-rose-600' };
  };

  const bmiCat = getBmiCategory(bmi);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans select-none pb-12">
      {/* 1. Header with Pills (1:1 with Reference Design) */}
      <div className="px-4 pt-3 pb-2 flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200/80 rounded-full px-3 py-1 text-[11px] font-bold text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>Hôm nay: 26/10/2026</span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-slate-900 text-white rounded-full px-3 py-1 text-[11px] font-bold shadow-2xs">
            <span className="w-4 h-4 rounded-full bg-blue-500 text-[9px] flex items-center justify-center font-bold">👤</span>
            <span>Hồ sơ sức khoẻ: {fullName || 'Trần Minh Khang'}</span>
          </div>
        </div>

        {/* Top Navbar: Back + Title + Save Button */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <h1 className="text-base font-bold text-slate-900">
            Thông tin người dùng
          </h1>

          <button
            type="button"
            onClick={handleSaveDirect}
            disabled={loading}
            className="h-9 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="mx-4 mb-2 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="mx-4 mb-2 p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2. Scrollable Body */}
      <div className="flex-1 px-4 space-y-3.5 overflow-y-auto">
        {/* Identity Card (Soft Cyan Gradient) */}
        <div className="bg-gradient-to-b from-[#E0F2FE]/80 via-[#F0FDFA]/40 to-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-blue-50 border-2 border-white shadow-md overflow-hidden flex items-center justify-center text-2xl font-black text-[#1F7A8C]">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <span>{(fullName || 'B').charAt(0)}</span>
              )}
            </div>
            {/* Camera Change Avatar Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-slate-900 border-2 border-white text-white flex items-center justify-center shadow hover:bg-slate-800 active:scale-95 transition"
              title="Đổi ảnh đại diện"
              aria-label="Đổi ảnh đại diện"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleAvatarFile}
              className="hidden"
            />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-2.5">
            {fullName || 'Trần Minh Khang'}
          </h2>

          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full mt-2">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Đã xác thực định danh điện tử</span>
          </div>
        </div>

        {/* 3. THÔNG TIN CÁ NHÂN Card (1:1 with Design) */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-3">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
            THÔNG TIN CÁ NHÂN
          </span>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-500 block">Số căn cước công dân</label>
            <input
              type="text"
              value={citizenId}
              onChange={(e) => setCitizenId(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50/70 border border-slate-200/70 rounded-xl px-3 py-2 outline-none focus:border-[#1F7A8C]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-500 block">Ngày sinh</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 bg-slate-50/70 border border-slate-200/70 rounded-xl px-3 py-2 outline-none focus:border-[#1F7A8C]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-500 block">Giới tính</label>
              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full text-xs font-semibold text-slate-800 bg-slate-50/70 border border-slate-200/70 rounded-xl px-3 py-2 outline-none focus:border-[#1F7A8C] appearance-none"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-500 block">Số điện thoại</label>
            <input
              type="text"
              value={realPhone}
              readOnly
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50/70 border border-slate-200/70 rounded-xl px-3 py-2 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-500 block">Email</label>
            <input
              type="email"
              value={userEmail}
              readOnly
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50/70 border border-slate-200/70 rounded-xl px-3 py-2 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-500 block">Địa chỉ</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50/70 border border-slate-200/70 rounded-xl px-3 py-2 outline-none focus:border-[#1F7A8C]"
            />
          </div>
        </div>

        {/* 4. THÔNG TIN Y TẾ Card (1:1 with Design) */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              THÔNG TIN Y TẾ
            </span>
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="text-xs font-bold text-[#1F7A8C] hover:underline"
            >
              Chỉnh sửa chi tiết
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center pt-1">
            <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 block">Nhóm máu</span>
              <span className="text-lg font-black text-rose-600 block mt-0.5">{bloodType || 'O+'}</span>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 block">Chiều cao</span>
              <span className="text-lg font-black text-slate-900 block mt-0.5">
                {heightCm} <span className="text-xs font-normal text-slate-500">cm</span>
              </span>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 block">Cân nặng</span>
              <span className="text-lg font-black text-slate-900 block mt-0.5">
                {weightKg.replace('.', ',')} <span className="text-xs font-normal text-slate-500">kg</span>
              </span>
            </div>
          </div>

          {/* Automatic Live BMI feedback from Height & Weight */}
          <div className="bg-[#E0F2FE]/40 border border-[#BAE6FD]/60 rounded-2xl p-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Chỉ số khối (BMI):</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-slate-900">{bmi}</span>
              <span className={`text-[11px] font-bold ${bmiCat.color}`}>• {bmiCat.label}</span>
            </div>
          </div>
        </div>

        {/* 5. PC Admin Switcher (If available) */}
        {onNavigateToAdmin && (
          <button
            type="button"
            onClick={onNavigateToAdmin}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs flex items-center justify-center cursor-pointer"
          >
            <span>Chuyển sang Quản Trị Hệ Thống (PC Admin)</span>
          </button>
        )}

        {/* 6. Decree 13 Compliance */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Tuân Thủ Nghị Định 13/2023/NĐ-CP</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Dữ liệu y tế được lưu trữ an toàn và bảo vệ theo quy chuẩn an toàn thông tin cá nhân.
          </p>
        </div>
      </div>

      {/* Edit Profile Bottom Sheet Modal */}
      <EditProfileBottomSheet
        isOpen={isEditOpen}
        member={activeMember}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleUpdateProfile}
      />
    </div>
  );
};
