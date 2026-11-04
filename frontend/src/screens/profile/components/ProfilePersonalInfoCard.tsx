import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface ProfilePersonalInfoCardProps {
  citizenId: string;
  setCitizenId: (val: string) => void;
  birthDate: string;
  setBirthDate: (val: string) => void;
  gender: string;
  setGender: (val: any) => void;
  realPhone: string;
  userEmail: string;
  address: string;
  setAddress: (val: string) => void;
}

export const ProfilePersonalInfoCard: React.FC<ProfilePersonalInfoCardProps> = ({
  citizenId,
  setCitizenId,
  birthDate,
  setBirthDate,
  gender,
  setGender,
  realPhone,
  userEmail,
  address,
  setAddress,
}) => {
  return (
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
  );
};
