import React, { useRef } from 'react';
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';
import { useProfileLogic } from './useProfileLogic';
import { ScreenHeaderPills } from '../../components/molecules/ScreenHeaderPills';
import { User as UserType } from '../../types/auth.types';
import { ProfileIdentityCard } from './components/ProfileIdentityCard';
import { ProfilePersonalInfoCard } from './components/ProfilePersonalInfoCard';
import { ProfileMedicalInfoCard } from './components/ProfileMedicalInfoCard';

export interface UserProfileScreenProps {
  onBack: () => void;
  onNavigateToAdmin?: () => void;
  onLogout?: () => void;
  user?: UserType | null;
  activeMemberId?: string;
}

export const SCR15_UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  onBack,
  onNavigateToAdmin,
  onLogout,
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
    : (user?.phone_number || '');

  const userEmail = user?.email || '';

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans select-none pb-12">
      {/* 1. Header with Pills (1:1 with Reference Design) */}
      <div className="px-4 pt-3 pb-2 flex flex-col gap-2">
        <ScreenHeaderPills activeMemberName={fullName || user?.fullName || ''} />

        {/* Top Navbar: Back + Title + Save Button */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition"
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
            className="h-9 min-h-[36px] px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition active:scale-95 disabled:opacity-50"
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
        {/* Identity Card */}
        <ProfileIdentityCard
          fullName={fullName}
          avatarUrl={avatarUrl}
          fileInputRef={fileInputRef}
          onAvatarFileChange={handleAvatarFile}
        />

        {/* Personal Info Card */}
        <ProfilePersonalInfoCard
          citizenId={citizenId}
          setCitizenId={setCitizenId}
          birthDate={birthDate}
          setBirthDate={setBirthDate}
          gender={gender}
          setGender={setGender}
          realPhone={realPhone}
          userEmail={userEmail}
          address={address}
          setAddress={setAddress}
        />

        {/* Medical Info Card */}
        <ProfileMedicalInfoCard
          bloodType={bloodType}
          setBloodType={setBloodType}
          heightCm={heightCm}
          setHeightCm={setHeightCm}
          weightKg={weightKg}
          setWeightKg={setWeightKg}
          bmi={bmi}
        />

        {/* PC Admin Switcher (Chỉ hiển thị cho tài khoản Quản trị viên) */}
        {onNavigateToAdmin && (user?.role === 'admin' || user?.role === 'super_admin' || (user as any)?.role_id === 'super_admin') && (
          <button
            type="button"
            onClick={onNavigateToAdmin}
            className="w-full py-3 min-h-[44px] rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs flex items-center justify-center cursor-pointer"
          >
            <span>Chuyển sang Quản Trị Hệ Thống (PC Admin)</span>
          </button>
        )}

        {/* Nút Đăng Xuất (Dành cho Mobile) */}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-3 min-h-[44px] rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất tài khoản</span>
          </button>
        )}

        {/* Decree 13 Compliance */}
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


    </div>
  );
};
