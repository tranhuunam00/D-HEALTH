import React from 'react';
import { ArrowLeft, Sparkles, Layers, FileText, CheckCircle2, Eye } from 'lucide-react';
import { HomeBottomNav } from '../home/HomeBottomNav';

interface SCR08Props {
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberName?: string;
}

export const SCR08_ImagingDetailScreen: React.FC<SCR08Props> = ({
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
            08/10/2026
          </span>
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-[#111827] text-white text-xs font-semibold shadow-xs">
            Hồ sơ: <b>{activeMemberName}</b>
          </span>
        </div>

        {/* 2. Topbar với nút Back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('imaging')}
            aria-label="Quay lại"
            className="w-11 h-11 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-xs active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-base font-extrabold text-slate-900 leading-tight block">
              MRI gan có tiêm thuốc đối quang từ
            </span>
            <span className="text-xs text-slate-500 font-medium">Bệnh viện K Tân Triều · BS. Trần Đức Minh</span>
          </div>
        </div>

        {/* 3. 3 Chuỗi xung DICOM then chốt */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-700 px-1">Chuỗi xung DICOM then chốt</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 't1', label: 'T1 + Thuốc', sub: 'Thì động mạch', color: '#1F7A8C' },
              { id: 't2', label: 'T2', sub: 'Tĩnh mạch cửa', color: '#2F6FDB' },
              { id: 'dwi', label: 'DWI', sub: 'Khuếch tán b800', color: '#7E22CE' },
            ].map((pulse) => (
              <div
                key={pulse.id}
                className="bg-slate-900 text-white rounded-2xl p-2.5 flex flex-col items-center justify-center text-center shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center mb-1.5">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-extrabold">{pulse.label}</span>
                <span className="text-[10px] text-slate-300">{pulse.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Khối mô tả & kết luận chuẩn Bộ Y tế */}
        <div className="bg-white rounded-3xl p-4 flex flex-col gap-3 shadow-xs border border-slate-200/60 text-xs">
          <div>
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-xs">
              <FileText className="w-3.5 h-3.5 text-[#1F7A8C]" />
              MÔ TẢ HÌNH ẢNH
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Hạ phân thùy VI có nốt ngấm thuốc mạnh thì động mạch gan, kích thước 22 x 18 mm. Thải thuốc nhanh thì tĩnh mạch cửa và thì muộn. Giảm kích thước so với phim chụp tháng 06/2026 (28 mm).
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              KẾT LUẬN & ĐÁNH GIÁ RECIST 1.1
            </div>
            <p className="text-slate-800 font-semibold leading-relaxed text-[11px]">
              U gan hạ phân thùy VI (HCC). Đáp ứng một phần (PR - Partial Response theo tiêu chuẩn RECIST 1.1: giảm &gt; 30% đường kính).
            </p>
          </div>
        </div>

        {/* 5. Action Buttons */}
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => alert('Mở DICOM Series Viewer kết nối MinIO S3')}
            className="h-12 rounded-2xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2 shadow active:scale-95 transition"
          >
            <Eye className="w-4 h-4 text-purple-400" />
            <span>Xem chuỗi lát cắt DICOM (MinIO S3)</span>
          </button>

          <button
            onClick={() => onNavigate('ai')}
            className="h-11 rounded-2xl bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Hỏi Trợ lý AI về ca chụp này</span>
          </button>
        </div>
      </div>

      {/* 6. Bottom Navigation */}
      <HomeBottomNav
        activeTab="health"
        onTabChange={(tab) => onNavigate(tab)}
      />
    </div>
  );
};
