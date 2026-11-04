import React from 'react';
import { Phone, Mail, Edit3 } from 'lucide-react';
import type { CareTeamMember } from '../useCareLogic';

interface DoctorProfileCardProps {
  member: CareTeamMember;
  onSendPreExamDossier: () => void;
  onEdit?: () => void;
}

export const DoctorProfileCard: React.FC<DoctorProfileCardProps> = ({
  member,
  onSendPreExamDossier,
  onEdit,
}) => {
  const isDoctor = member.code !== 'HD';

  return (
    <div className="bg-white rounded-[28px] p-4.5 shadow-xs border border-slate-100 flex flex-col gap-3.5">
      {/* Top Header: Avatar + Name + Edit button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#FCE7F3] text-[#BE185D] font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
            {member.code}
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900 leading-tight">
              {member.name}
            </h4>
            <span className="text-xs text-slate-400 font-medium">
              {member.role} · {member.org || '[Bệnh viện đối tác]'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          aria-label="Chỉnh sửa liên hệ"
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center active:scale-95 transition"
        >
          <Edit3 className="w-4 h-4 text-slate-700" />
        </button>
      </div>

      {/* Contact Row 1: Phone */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-50">
        <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium truncate pr-2">
          <Phone className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">{member.phone}</span>
        </div>
        <a
          href={member.phone.startsWith('0') ? `tel:${member.phone.replace(/\s+/g, '')}` : '#'}
          className="px-4 py-1.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-bold shrink-0 hover:bg-emerald-200 active:scale-95 transition"
        >
          Gọi
        </a>
      </div>

      {/* Contact Row 2: Email */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-50">
        <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium truncate pr-2">
          <Mail className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">{member.email}</span>
        </div>
        <a
          href={member.email.includes('@') ? `mailto:${member.email}` : '#'}
          className="px-4 py-1.5 rounded-full bg-[#E0F2FE] text-[#0284C7] text-xs font-bold shrink-0 hover:bg-sky-200 active:scale-95 transition"
        >
          Email
        </a>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center gap-2.5 pt-1 border-t border-slate-50">
        <button
          type="button"
          onClick={() => alert(`Mở kết nối Video/Nhắn tin bảo mật với ${member.name}`)}
          className="flex-1 py-3 px-3 rounded-full border border-slate-200/90 text-slate-800 text-xs font-extrabold text-center hover:bg-slate-50 active:scale-95 transition"
        >
          Nhắn tin / Video
        </button>
        <button
          type="button"
          onClick={onSendPreExamDossier}
          className="flex-1 py-3 px-3 rounded-full bg-[#1F7A8C] hover:bg-teal-700 text-white text-xs font-extrabold text-center shadow-xs active:scale-95 transition"
        >
          {isDoctor ? 'Gửi hồ sơ trước khám' : 'Chia sẻ hồ sơ'}
        </button>
      </div>
    </div>
  );
};
