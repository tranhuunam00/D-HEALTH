import React from 'react';
import { ArrowLeft, Sparkles, Image, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { HomeBottomNav } from '../home/HomeBottomNav';

interface SCR06Props {
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberName?: string;
}

interface AnalyteItem {
  readonly name: string;
  readonly value: string;
  readonly unit: string;
  readonly refRange: string;
  readonly isHigh: boolean;
}

const ANALYTES: readonly AnalyteItem[] = Object.freeze([
  { name: 'Glucose', value: '7.2', unit: 'mmol/L', refRange: '3.9 - 6.4', isHigh: true },
  { name: 'HbA1c', value: '6.6', unit: '%', refRange: '4.0 - 5.6', isHigh: true },
  { name: 'Cholesterol TP', value: '5.4', unit: 'mmol/L', refRange: '3.9 - 5.2', isHigh: true },
  { name: 'Triglyceride', value: '1.8', unit: 'mmol/L', refRange: '0.4 - 1.7', isHigh: true },
  { name: 'HDL-C', value: '1.1', unit: 'mmol/L', refRange: '> 0.9', isHigh: false },
  { name: 'LDL-C', value: '3.8', unit: 'mmol/L', refRange: '< 2.6', isHigh: true },
  { name: 'AST (GOT)', value: '28', unit: 'U/L', refRange: '< 35', isHigh: false },
  { name: 'ALT (GPT)', value: '32', unit: 'U/L', refRange: '< 35', isHigh: false },
  { name: 'Ure', value: '5.8', unit: 'mmol/L', refRange: '2.5 - 7.5', isHigh: false },
  { name: 'Creatinine', value: '82', unit: 'µmol/L', refRange: '53 - 106', isHigh: false },
  { name: 'Acid Uric', value: '360', unit: 'µmol/L', refRange: '180 - 420', isHigh: false },
]);

export const SCR06_LabDetailScreen: React.FC<SCR06Props> = ({
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
            20/10/2026
          </span>
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-[#111827] text-white text-xs font-semibold shadow-xs">
            Hồ sơ: <b>{activeMemberName}</b>
          </span>
        </div>

        {/* 2. Topbar với nút Back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('labs')}
            aria-label="Quay lại"
            className="w-11 h-11 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-xs active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-base font-extrabold text-slate-900 leading-tight block">
              Sinh hoá máu 18 chỉ số
            </span>
            <span className="text-xs text-slate-500 font-medium">Bệnh viện Bạch Mai · BS. Nguyễn Văn An</span>
          </div>
        </div>

        {/* 3. Bảng chỉ số xét nghiệm mật độ cao */}
        <div className="bg-white rounded-3xl p-4 flex flex-col gap-2.5 shadow-xs border border-slate-200/60">
          <div className="flex justify-between items-center text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
            <span>Chi tiết 11 chỉ số xét nghiệm</span>
            <span className="text-[11px] text-amber-600 font-bold">5 chỉ số vượt ngưỡng</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {ANALYTES.map((item) => (
              <div
                key={item.name}
                className={`py-2 px-1 flex items-center justify-between rounded-lg transition ${
                  item.isHigh ? 'bg-amber-50/70' : ''
                }`}
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    {item.name}
                    {item.isHigh && <AlertCircle className="w-3 h-3 text-amber-600" />}
                  </div>
                  <div className="text-[11px] text-slate-400">Tham chiếu: {item.refRange}</div>
                </div>

                <div className="text-right">
                  <div className={`font-extrabold text-sm ${item.isHigh ? 'text-amber-700' : 'text-slate-900'}`}>
                    {item.value} <span className="text-[10px] font-normal text-slate-500">{item.unit}</span>
                  </div>
                  <span
                    className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      item.isHigh ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {item.isHigh ? 'Cao' : 'Chuẩn'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Action Buttons */}
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => onNavigate('ai')}
            className="h-12 rounded-2xl bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] text-white text-xs font-bold flex items-center justify-center gap-2 shadow active:scale-95 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Hỏi Trợ lý AI về kết quả này</span>
          </button>

          <button
            onClick={() => alert('Xem phiếu chụp gốc từ kho lưu trữ MinIO S3')}
            className="h-11 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-95 transition"
          >
            <Image className="w-4 h-4 text-slate-500" />
            <span>Xem ảnh phiếu gốc (MinIO S3 Storage)</span>
          </button>
        </div>
      </div>

      {/* 5. Bottom Navigation */}
      <HomeBottomNav
        activeTab="health"
        onTabChange={(tab) => onNavigate(tab)}
      />
    </div>
  );
};
