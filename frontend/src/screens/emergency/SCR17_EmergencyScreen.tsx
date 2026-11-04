import React from 'react';
import { X, AlertTriangle, PhoneCall, QrCode, HeartPulse, User } from 'lucide-react';
import { useEmergencyLogic } from './useEmergencyLogic';

interface SCR17Props {
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberId?: string;
  readonly activeMemberName?: string;
}

export const SCR17_EmergencyScreen: React.FC<SCR17Props> = ({
  onNavigate,
  activeMemberId = 'nam',
  activeMemberName,
}) => {
  const { emergencyData } = useEmergencyLogic(activeMemberId, activeMemberName);

  return (
    <div className="w-full min-h-screen relative bg-gradient-to-b from-[#3B0D12] via-[#200A0D] to-[#111827] text-white flex flex-col font-sans select-none pb-6">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8 flex flex-col gap-3.5">
        {/* 1. Topbar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            aria-label="Đóng"
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-wide">EMERGENCY HEALTH CARD</span>
            <span className="text-[11px] text-slate-300">Hiển thị khi khoá máy · Quét QR Offline</span>
          </div>
        </div>

        {/* 2. Emergency Medical Card */}
        <div className="bg-white text-slate-900 rounded-[28px] p-5 flex flex-col gap-3.5 shadow-2xl">
          {/* Patient Bio & Blood Type */}
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <div className="text-xl font-extrabold text-slate-900">{emergencyData.fullName}</div>
              <div className="text-xs text-slate-500 font-semibold">
                Năm sinh: {emergencyData.birthYear} · Giới tính: {emergencyData.gender}
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-[#DC2626] text-white flex flex-col items-center justify-center shadow-md">
              <span className="text-[9px] font-bold tracking-wider opacity-90">NHÓM MÁU</span>
              <span className="text-2xl font-black leading-none">{emergencyData.bloodType}</span>
            </div>
          </div>

          {/* Dị ứng nguy hiểm */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-rose-900">DỊ ỨNG NGUY HIỂM</div>
              <div className="text-xs font-semibold text-rose-700">{emergencyData.allergies}</div>
            </div>
          </div>

          {/* Bệnh nền mạn tính */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5">
            <HeartPulse className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-amber-900">BỆNH LÝ MẠN TÍNH</div>
              <div className="text-xs font-semibold text-amber-800">{emergencyData.conditions}</div>
            </div>
          </div>

          {/* Người liên hệ khẩn cấp */}
          <div className="bg-slate-50 rounded-2xl p-3 flex items-center justify-between border border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {emergencyData.emergencyContact.name} ({emergencyData.emergencyContact.relationship})
                </div>
                <div className="text-xs text-slate-500 font-semibold font-mono">
                  {emergencyData.emergencyContact.phone}
                </div>
              </div>
            </div>
            <a
              href={`tel:${emergencyData.emergencyContact.phone.replace(/\s+/g, '')}`}
              className="p-2 rounded-xl bg-emerald-500 text-white shadow hover:bg-emerald-600 transition"
              title="Gọi người nhà"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
          </div>

          {/* Offline QR Code Banner */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 text-white">
            <div className="flex items-center gap-2.5">
              <QrCode className="w-6 h-6 text-emerald-400" />
              <div>
                <div className="text-xs font-bold">Mã QR Y Tế Cấp Cứu</div>
                <div className="text-[10px] text-slate-400">Đọc tức thì không cần Internet</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              ECDSA Offline
            </span>
          </div>
        </div>

        {/* 3. Emergency Action Button (115) */}
        <a
          href="tel:115"
          className="h-13 rounded-full bg-[#DC2626] hover:bg-red-700 active:scale-95 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 transition"
        >
          <PhoneCall className="w-5 h-5" />
          <span>Gọi Cấp Cứu 115</span>
        </a>
      </div>
    </div>
  );
};
