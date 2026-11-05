import React, { RefObject } from 'react';
import { Camera, Check } from 'lucide-react';

export interface ProfileIdentityCardProps {
  fullName: string;
  avatarUrl: string;
  fileInputRef: RefObject<HTMLInputElement>;
  onAvatarFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileIdentityCard: React.FC<ProfileIdentityCardProps> = ({
  fullName,
  avatarUrl,
  fileInputRef,
  onAvatarFileChange,
}) => {
  return (
    <div className="bg-gradient-to-b from-[#E0F2FE]/80 via-[#F0FDFA]/40 to-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex flex-col items-center text-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-blue-50 border-2 border-white shadow-md overflow-hidden flex items-center justify-center text-2xl font-black text-[#1F7A8C]">
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <span>{(fullName || 'N').charAt(0)}</span>
          )}
        </div>
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
          onChange={onAvatarFileChange}
          className="hidden"
        />
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-2.5">
        {fullName || ''}
      </h2>

      <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full mt-2">
        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Đã xác thực định danh điện tử</span>
      </div>
    </div>
  );
};

