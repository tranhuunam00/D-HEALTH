import React from 'react';
import { ArrowLeft, UserPlus, ShieldCheck, Heart, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { HomeBottomNav } from '../home/HomeBottomNav';

interface SCR17Props {
  readonly onNavigate: (screen: string) => void;
  readonly onSelectMember?: (memberId: string) => void;
}

interface FamilyMemberItem {
  readonly id: string;
  readonly fullName: string;
  readonly relationship: string;
  readonly age: number;
  readonly gender: string;
  readonly bloodType: string;
  readonly isAbove18: boolean;
  readonly consentApproved: boolean;
  readonly condition: string;
}

const FAMILY_MEMBERS: readonly FamilyMemberItem[] = Object.freeze([
  {
    id: 'mem-1',
    fullName: 'Trần Hữu Nam',
    relationship: 'Chủ tài khoản (Bố)',
    age: 41,
    gender: 'Nam',
    bloodType: 'O+',
    isAbove18: true,
    consentApproved: true,
    condition: 'Tăng huyết áp, ĐTĐ type 2',
  },
  {
    id: 'mem-2',
    fullName: 'Nguyễn Thị Mai',
    relationship: 'Vợ (Mẹ)',
    age: 38,
    gender: 'Nữ',
    bloodType: 'A+',
    isAbove18: true,
    consentApproved: true,
    condition: 'Sức khoẻ tốt',
  },
  {
    id: 'mem-3',
    fullName: 'Trần Đức Anh',
    relationship: 'Con trai',
    age: 14,
    gender: 'Nam',
    bloodType: 'O+',
    isAbove18: false,
    consentApproved: true,
    condition: 'Theo dõi thể chất định kỳ',
  },
  {
    id: 'mem-4',
    fullName: 'Bà Lê Thị Hoa',
    relationship: 'Mẹ đẻ (Bà nội)',
    age: 68,
    gender: 'Nữ',
    bloodType: 'B+',
    isAbove18: true,
    consentApproved: true,
    condition: 'Bệnh tim mạch, Đau xương khớp',
  },
]);

export const SCR17_FamilyProfilesScreen: React.FC<SCR17Props> = ({
  onNavigate,
  onSelectMember,
}) => {
  return (
    <div className="w-full min-h-screen relative bg-[#EEF2F6] text-[#111827] flex flex-col font-sans select-none pb-20">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 flex flex-col gap-3.5">
        {/* 1. Topbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('records')}
              aria-label="Quay lại"
              className="w-11 h-11 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-xs active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-extrabold text-slate-900">Hồ sơ gia đình</span>
          </div>

          <button
            onClick={() => alert('Thêm hồ sơ thành viên mới')}
            className="h-9 px-3 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shadow active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Thêm người thân</span>
          </button>
        </div>

        {/* 2. Decree 13/2023 Consent Gate Banner */}
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900">
            <span className="font-bold block">Tuân thủ Nghị định 13/2023/NĐ-CP</span>
            <span className="text-[11px] text-emerald-700">
              Thành viên từ đủ 18 tuổi trở lên đã kích hoạt Cổng đồng thuận chia sẻ dữ liệu y tế gia đình.
            </span>
          </div>
        </div>

        {/* 3. Danh sách hồ sơ các thành viên */}
        <div className="flex flex-col gap-2.5">
          {FAMILY_MEMBERS.map((mem) => (
            <div
              key={mem.id}
              className="bg-white rounded-3xl p-4 flex flex-col gap-3 shadow-xs border border-slate-200/60"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] text-white font-extrabold text-base flex items-center justify-center shadow">
                    {mem.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{mem.fullName}</div>
                    <div className="text-xs text-slate-500 font-medium">{mem.relationship}</div>
                    <div className="text-[11px] text-slate-400">
                      {mem.age} tuổi · {mem.gender} · Nhóm máu <b>{mem.bloodType}</b>
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#1F7A8C]">
                  {mem.condition}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã đồng thuận chia sẻ
                </span>

                <button
                  onClick={() => onSelectMember?.(mem.id)}
                  className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold active:scale-95 transition"
                >
                  Chọn xem hồ sơ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bottom Navigation */}
      <HomeBottomNav
        activeTab="records"
        onTabChange={(tab) => onNavigate(tab)}
      />
    </div>
  );
};
