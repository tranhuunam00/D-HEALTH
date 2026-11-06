import React from 'react';
import type { PassportMemberInfo } from '../useRecordsLogic';
import { formatAvatarUrl } from '../../../config/native-network';

interface PassportIdentityCardProps {
  member: PassportMemberInfo;
  onSwitchMember: () => void;
}

export const PassportIdentityCard: React.FC<PassportIdentityCardProps> = ({
  member,
  onSwitchMember,
}) => {
  const formattedWeight = member.weightKg
    ? member.weightKg.toString().replace('.', ',')
    : '--';
  const vitalsText = `${member.gender || 'Nam'} · ${member.age || '--'} tuổi · ${
    member.heightCm || '--'
  } cm · ${formattedWeight} kg · BMI ${member.bmi || '--'}`;

  return (
    <div className="bg-white rounded-[24px] p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {member.avatarUrl ? (
          <img
            src={formatAvatarUrl(member.avatarUrl)}
            alt={member.fullName}
            className="w-12 h-12 rounded-full object-cover border-2 border-sky-200 shadow-2xs shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] text-white font-extrabold text-base shrink-0 flex items-center justify-center shadow-2xs border-2 border-sky-200">
            {member.fullName.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-black text-slate-800 text-[15px] truncate">
              {member.fullName}
            </span>
            <span className="bg-[#CCFBF1] text-[#0F766E] text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
              {member.relationship || 'Chủ tài khoản'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
            {vitalsText}
          </p>
          <button
            type="button"
            onClick={onSwitchMember}
            className="text-[11px] font-semibold text-[#0F766E] hover:underline cursor-pointer text-left mt-0.5 block"
          >
            Chạm để đổi hồ sơ thành viên
          </button>
        </div>
      </div>

      <div className="bg-[#FEE2E2] rounded-xl px-2.5 py-2 text-center min-w-[68px] flex-shrink-0">
        <div className="text-[8.5px] font-black tracking-wider text-[#E11D48] uppercase leading-none">
          NHÓM MÁU
        </div>
        <div className="text-xl font-black text-[#E11D48] mt-1 leading-none">
          {member.bloodType || 'Chưa rõ'}
        </div>
      </div>
    </div>
  );
};
