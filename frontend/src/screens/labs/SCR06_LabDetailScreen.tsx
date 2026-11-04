import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, User, CheckCircle2 } from 'lucide-react';

interface SCR06Props {
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberName?: string;
  readonly activeMemberId?: string;
  readonly reportId?: string | null;
}

interface AnalyteRow {
  readonly name: string;
  readonly value: string;
  readonly unit: string;
  readonly refRange: string;
}

const DEFAULT_ANALYTES: readonly AnalyteRow[] = Object.freeze([
  { name: 'Glucose (đói)', value: '6,1', unit: 'mmol/L', refRange: '3,9 – 6,4' },
  { name: 'Cholesterol toàn phần', value: '4,8', unit: 'mmol/L', refRange: '3,9 – 5,2' },
  { name: 'Triglyceride', value: '1,4', unit: 'mmol/L', refRange: '0,4 – 1,7' },
  { name: 'LDL-C', value: '3,8', unit: 'mmol/L', refRange: '< 2,6' },
]);

export const SCR06_LabDetailScreen: React.FC<SCR06Props> = ({
  onNavigate,
  activeMemberName = 'Trần Hữu Nam',
  activeMemberId = 'nam',
  reportId,
}) => {
  const [report, setReport] = useState<any>(null);
  const [analytes, setAnalytes] = useState<readonly AnalyteRow[]>(DEFAULT_ANALYTES);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const baseUrl = typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null')
          ? window.location.origin
          : 'http://localhost';
        const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const targetId = reportId || 'rep_nam_01';
        const [repRes, resRes] = await Promise.all([
          fetch(`${baseUrl}/api/clinical-reports/${activeMemberId}?kind=lab`, { headers }).catch(() => null),
          fetch(`${baseUrl}/api/clinical-reports/results/${targetId}`, { headers }).catch(() => null),
        ]);

        if (repRes?.ok) {
          const json = await repRes.json();
          const list = Array.isArray(json.data) ? json.data : [];
          const found = list.find((r: any) => r.id === targetId) || list[0];
          if (found) setReport(found);
        }

        if (resRes?.ok) {
          const json = await resRes.json();
          const results = Array.isArray(json.data) ? json.data : [];
          if (results.length > 0) {
            const mapped: AnalyteRow[] = results.map((r: any) => ({
              name: r.test_name || r.test_code || 'Chỉ số',
              value: r.value_numeric !== null && r.value_numeric !== undefined
                ? `${r.value_numeric}`.replace('.', ',')
                : (r.value_text || '--'),
              unit: r.unit || 'mmol/L',
              refRange: r.reference_range || (r.test_name?.includes('Glucose') ? '3,9 – 6,4' : '< 2,6'),
            }));
            setAnalytes(mapped);
          }
        }
      } catch (err) {
        console.error('Lỗi tải chi tiết xét nghiệm:', err);
      }
    };

    fetchDetails();
  }, [reportId, activeMemberId]);

  const title = report?.title || 'Sinh hoá máu';
  const categoryBadge = report?.category || 'SH';
  const facility = report?.facility_name || 'Bệnh viện Bạch Mai';
  const doctor = report?.ordering_doctor_name || 'BS Trần Văn B';
  const conclusion = report?.conclusion || 'Chỉ số Glucose và Cholesterol trong giới hạn an toàn';

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans select-none pb-8">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 flex flex-col gap-3.5">
        {/* 1. Header Badges */}
        <div className="flex gap-1.5 items-center flex-wrap shrink-0">
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-white text-slate-700 text-xs font-semibold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Hôm nay: 26/10/2026
          </span>
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-[#111827] text-white text-xs font-semibold shadow-xs">
            <User className="w-3.5 h-3.5" />
            Hồ sơ sức khoẻ: <b>{activeMemberName}</b>
          </span>
        </div>

        {/* 2. Topbar với nút Back & Badge Chuyên khoa */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => onNavigate('labs')}
              aria-label="Quay lại"
              className="w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-xs active:scale-95 transition shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col min-w-0">
              <h1 className="text-base font-black text-slate-900 leading-tight truncate">
                {title}
              </h1>
              <span className="text-xs text-slate-400 font-medium">Kết quả xét nghiệm chi tiết</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 font-bold text-xs shrink-0 shadow-2xs">
            {categoryBadge}
          </span>
        </div>

        {/* 3. Metadata Card */}
        <div className="bg-white rounded-[24px] p-4 shadow-xs border border-slate-100 grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Ngày lấy mẫu</span>
            <span className="text-slate-900 font-bold mt-0.5 block">20/10/2026 · 07:30</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Ngày trả kết quả</span>
            <span className="text-slate-900 font-bold mt-0.5 block">20/10/2026 · 11:00</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Nơi thực hiện</span>
            <span className="text-slate-900 font-bold mt-0.5 block truncate">{facility}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Bác sĩ chỉ định</span>
            <span className="text-slate-900 font-bold mt-0.5 block truncate">{doctor}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Loại mẫu</span>
            <span className="text-slate-900 font-bold mt-0.5 block">Huyết thanh · lúc đói</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Mã phiếu</span>
            <span className="text-slate-900 font-bold mt-0.5 block">XN-2026-8891</span>
          </div>
        </div>

        {/* 4. Table Card: Chỉ số, Kết quả, Tham chiếu */}
        <div className="bg-white rounded-[24px] p-4 shadow-xs border border-slate-100 flex flex-col gap-2">
          <div className="grid grid-cols-[1.4fr_1fr_1.2fr] text-xs font-bold text-slate-400 border-b border-slate-100 pb-2 px-1">
            <span>Chỉ số</span>
            <span className="text-center">Kết quả</span>
            <span className="text-right">Tham chiếu</span>
          </div>

          <div className="divide-y divide-slate-100">
            {analytes.map((item, idx) => (
              <div key={idx} className="grid grid-cols-[1.4fr_1fr_1.2fr] items-center py-2.5 px-1 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block leading-tight">{item.name}</span>
                  <span className="text-[11px] text-slate-400 block">{item.unit}</span>
                </div>
                <div className="text-center font-black text-sm text-slate-900">
                  {item.value}
                </div>
                <div className="text-right text-slate-500 font-medium">
                  {item.refRange}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. AI Insight Callout */}
        <div className="bg-[#EAF8F0] border border-teal-100/80 rounded-[22px] p-3.5 flex items-start gap-2.5">
          <span className="text-teal-700 text-xs font-black mt-0.5">✦</span>
          <span className="text-xs font-bold text-slate-800 leading-relaxed">
            10/12 chỉ số trong giới hạn tham chiếu. LDL-C và Cholesterol toàn phần cao hơn mục tiêu, LDL-C tăng 3 lần liên tiếp — nên trao đổi với bác sĩ tim mạch khi tái khám 12/11.
          </span>
        </div>

        {/* 6. Nhận xét của bác sĩ */}
        <div className="bg-white rounded-[24px] p-4 shadow-xs border border-slate-100 flex flex-col gap-1.5">
          <h2 className="text-sm font-extrabold text-slate-900">Nhận xét của bác sĩ</h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {conclusion}
          </p>
        </div>

        {/* 7. Phiếu kết quả gốc PDF */}
        <button
          type="button"
          onClick={() => alert('Xem file PDF gốc phiếu xét nghiệm')}
          className="bg-white rounded-[22px] p-3.5 shadow-xs border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-black text-[11px]">
              PDF
            </span>
            <span className="text-xs font-bold text-slate-900">Phiếu kết quả gốc</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* 8. Nguồn dữ liệu đã xác nhận */}
        <div className="bg-white rounded-[22px] p-3 shadow-xs border border-slate-100 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900">Nhập từ link cơ sở y tế</span>
            <span className="text-[11px] text-slate-400 font-medium">Bạn đã xác nhận ngày 20/10/2026</span>
          </div>
        </div>

        {/* 9. Bottom Action Buttons */}
        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('ai')}
            className="flex-1 h-12 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-xs active:scale-95 transition"
          >
            Hỏi trợ lý AI
          </button>
          <button
            type="button"
            onClick={() => alert('Đã gửi phiếu xét nghiệm cho bác sĩ điều trị')}
            className="flex-1 h-12 rounded-full bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] text-white text-xs font-extrabold shadow-md active:scale-95 transition"
          >
            Gửi cho bác sĩ
          </button>
        </div>
      </div>
    </div>
  );
};
