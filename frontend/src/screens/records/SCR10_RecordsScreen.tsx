import React from 'react';
import { Camera, ChevronRight, AlertTriangle, ShieldCheck, Pill, FileText, Film, FolderLock, Plus } from 'lucide-react';
import { HomeBottomNav } from '../home/HomeBottomNav';

interface SCR10Props {
  readonly onNavigate: (screen: string) => void;
  readonly onSelectMember?: (memberId: string) => void;
  readonly activeMemberName?: string;
}

const CATEGORY_TILES = [
  { id: 'emergency', label: 'Dị ứng', abbr: 'DƯ', sub: '1 dị ứng', bg: '#FEE2E2', fg: '#B91C1C', icon: AlertTriangle },
  { id: 'chronic', label: 'Bệnh lý', abbr: 'BL', sub: '2 bệnh mạn tính', bg: '#FEF3C7', fg: '#B45309', icon: ShieldCheck },
  { id: 'meds', label: 'Thuốc', abbr: 'TH', sub: '3 loại đang dùng', bg: '#DCFCE7', fg: '#166534', icon: Pill },
  { id: 'labs', label: 'Xét nghiệm', abbr: 'XN', sub: '18 phiếu khám', bg: '#E0F2FE', fg: '#0369A1', icon: FileText },
  { id: 'imaging', label: 'CĐHA', abbr: 'CĐ', sub: '4 phim chụp', bg: '#F3E8FF', fg: '#7E22CE', icon: Film },
  { id: 'camera-ocr', label: 'Tài liệu', abbr: 'TL', sub: 'Hồ sơ gốc', bg: '#F1F5F9', fg: '#475569', icon: FolderLock },
] as const;

export const SCR10_RecordsScreen: React.FC<SCR10Props> = ({
  onNavigate,
  onSelectMember,
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
          <button
            onClick={() => onSelectMember?.('family')}
            className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-[#111827] text-white text-xs font-semibold shadow-xs"
          >
            Hồ sơ: <b>{activeMemberName}</b>
          </button>
        </div>

        {/* 2. Tiêu đề */}
        <div>
          <span className="text-[28px] font-extrabold tracking-tight block">Hồ sơ y tế</span>
          <span className="text-xs text-slate-500 font-semibold">Medical Passport · Sổ theo dõi toàn diện</span>
        </div>

        {/* 3. Patient Identity Card */}
        <div className="bg-white rounded-3xl p-4 flex items-center justify-between shadow-xs border border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] text-white text-lg font-black flex items-center justify-center shadow">
              N
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900">{activeMemberName}</div>
              <div className="text-xs text-slate-500 font-medium">41 tuổi · Nam · Nhóm máu O+</div>
              <div className="text-[11px] text-slate-400 font-mono">BHYT: DN4010203040506</div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 4. 6 Phân hệ y tế (Grid 3x2) */}
        <div className="grid grid-cols-3 gap-2">
          {CATEGORY_TILES.map((tile) => (
            <button
              key={tile.id}
              onClick={() => onNavigate(tile.id)}
              className="bg-white rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-xs border border-slate-200/50 hover:bg-slate-50 active:scale-95 transition"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-1.5"
                style={{ backgroundColor: tile.bg, color: tile.fg }}
              >
                <span className="text-xs font-black">{tile.abbr}</span>
              </div>
              <span className="text-xs font-bold text-slate-900">{tile.label}</span>
              <span className="text-[10px] text-slate-400">{tile.sub}</span>
            </button>
          ))}
        </div>

        {/* 5. Nút Nhập kết quả vào hồ sơ */}
        <button
          onClick={() => onNavigate('camera-ocr')}
          className="h-12 rounded-2xl bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] text-white text-xs font-bold flex items-center justify-center gap-2 shadow active:scale-95 transition"
        >
          <Camera className="w-4 h-4" />
          <span>Nhập kết quả vào hồ sơ (Chụp ảnh / OCR)</span>
        </button>

        {/* 6. Medical Timeline Gần đây */}
        <div className="bg-white rounded-3xl p-4 flex flex-col gap-2.5 shadow-xs border border-slate-200/60">
          <div className="flex justify-between items-center text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
            <span>Dòng sự kiện y tế</span>
            <span className="text-[11px] text-[#1F7A8C] font-semibold">Gần nhất</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-700 font-semibold">🧪 Sinh hoá máu 18 chỉ số</span>
              <span className="text-slate-400 font-medium">20/10/2026</span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-700 font-semibold">📷 MRI gan có tiêm thuốc</span>
              <span className="text-slate-400 font-medium">08/10/2026</span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-700 font-semibold">💊 Đơn thuốc Tăng HA &amp; ĐTĐ</span>
              <span className="text-slate-400 font-medium">15/09/2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Bottom Navigation */}
      <HomeBottomNav
        activeTab="records"
        onTabChange={(tab) => onNavigate(tab)}
      />
    </div>
  );
};
