import React from 'react';
import { Calendar, Phone, MessageSquare, Plus, Building2, User, Stethoscope } from 'lucide-react';
import { HomeBottomNav } from '../home/HomeBottomNav';

interface SCR14Props {
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberName?: string;
}

const CARE_TEAM = [
  {
    id: 'doc-1',
    name: 'BS. Trần Văn B',
    role: 'Bác sĩ Tim mạch chính',
    facility: 'Bệnh viện Bạch Mai',
    avatarText: 'B',
    phone: '0912 345 678',
  },
  {
    id: 'nurse-1',
    name: 'ĐD. Lê Thị H',
    role: 'Điều dưỡng phụ trách theo dõi',
    facility: 'Bệnh viện Bạch Mai',
    avatarText: 'H',
    phone: '0987 654 321',
  },
] as const;

export const SCR14_CareScreen: React.FC<SCR14Props> = ({
  onNavigate,
  activeMemberName = 'Trần Hữu Nam',
}) => {
  return (
    <div className="w-full min-h-screen relative bg-[#EEF2F6] text-[#111827] flex flex-col font-sans select-none pb-20">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 flex flex-col gap-3.5">
        {/* 1. Header Pills */}
        <div className="flex gap-1.5 items-center flex-wrap shrink-0">
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-white text-slate-700 text-xs font-semibold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Hôm nay: 26/10/2026
          </span>
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-[#111827] text-white text-xs font-semibold shadow-xs">
            Hồ sơ: <b>{activeMemberName}</b>
          </span>
        </div>

        {/* 2. Tiêu đề */}
        <span className="text-[28px] font-extrabold tracking-tight">Chăm sóc</span>

        {/* 3. Lịch hẹn sắp tới (Hero Card) */}
        <div className="bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] text-white rounded-3xl p-4 flex items-center gap-3.5 shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-white text-[#1F7A8C] flex flex-col items-center justify-center shrink-0 shadow">
            <span className="text-[10px] font-bold uppercase tracking-wider">Tháng 11</span>
            <span className="text-xl font-black leading-none">12</span>
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-90 block">
              LỊCH HẸN SẮP TỚI
            </span>
            <span className="text-base font-extrabold block">Tái khám tim mạch</span>
            <span className="text-xs opacity-95">09:00 · BS. Trần Văn B · BV Bạch Mai</span>
          </div>
        </div>

        {/* 4. My Care Team */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-900 px-1">
            <span>Đội ngũ chăm sóc (My Care Team)</span>
            <span className="text-[11px] text-[#1F7A8C] font-semibold">2 thành viên</span>
          </div>

          <div className="space-y-2.5">
            {CARE_TEAM.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-3xl p-4 flex items-center justify-between shadow-xs border border-slate-200/60"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-teal-50 text-[#1F7A8C] font-black text-sm flex items-center justify-center shrink-0">
                    {member.avatarText}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{member.name}</div>
                    <div className="text-xs text-slate-500 font-medium">{member.role}</div>
                    <div className="text-[11px] text-slate-400">{member.facility}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${member.phone.replace(/\s+/g, '')}`}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
                    title="Gọi điện"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => alert(`Mở khung trò chuyện bảo mật với ${member.name}`)}
                    className="w-9 h-9 rounded-xl bg-[#1F7A8C] text-white flex items-center justify-center shadow transition active:scale-95"
                    title="Nhắn tin"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. CSYT liên kết */}
        <div className="bg-white rounded-3xl p-4 flex flex-col gap-2 shadow-xs border border-slate-200/60 text-xs">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#1F7A8C]" />
            Cơ sở y tế liên kết
          </div>
          <div className="divide-y divide-slate-100 text-slate-600">
            <div className="py-2 flex justify-between">
              <span>Bệnh viện Bạch Mai</span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">Đang đồng bộ</span>
            </div>
            <div className="py-2 flex justify-between">
              <span>Phòng khám Đa khoa Medlatec</span>
              <span className="text-slate-500 font-semibold text-[10px]">Đã kết nối</span>
            </div>
          </div>
        </div>

        {/* 6. Nút Đặt lịch khám mới */}
        <button
          onClick={() => alert('Chức năng đặt lịch khám trực tuyến với CSYT')}
          className="h-12 rounded-2xl bg-[#111827] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Đặt lịch khám mới</span>
        </button>
      </div>

      {/* 7. Bottom Navigation */}
      <HomeBottomNav
        activeTab="care"
        onTabChange={(tab) => onNavigate(tab)}
      />
    </div>
  );
};
