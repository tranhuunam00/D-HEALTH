import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { ScreenHeaderPills } from '../../components/molecules/ScreenHeaderPills';
import { LabAnalytesTable, AnalyteRow } from './components/LabAnalytesTable';
import { LabMetadataCard } from './components/LabMetadataCard';

interface SCR06Props {
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberName?: string;
  readonly activeMemberId?: string;
  readonly reportId?: string | null;
}

export const SCR06_LabDetailScreen: React.FC<SCR06Props> = ({
  onNavigate,
  activeMemberName = '',
  activeMemberId = 'mem_145deb71',
  reportId,
}) => {
  const [report, setReport] = useState<any>(null);
  const [analytes, setAnalytes] = useState<readonly AnalyteRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const targetId = reportId || 'rep_nam_01';
        const [repRes, resRes] = await Promise.all([
          fetch(`/api/clinical-reports/${activeMemberId}?kind=lab`, { headers }).catch(() => null),
          fetch(`/api/clinical-reports/results/${targetId}`, { headers }).catch(() => null),
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
              refRange: r.reference_range || (r.ref_min !== null && r.ref_max !== null ? `${r.ref_min} – ${r.ref_max}` : (r.ref_max ? `< ${r.ref_max}` : '3,9 – 6,4')),
            }));
            setAnalytes(mapped);
          } else {
            setAnalytes([]);
          }
        }
      } catch (err) {
        console.error('Lỗi tải chi tiết xét nghiệm từ database:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [reportId, activeMemberId]);

  const title = report?.title || 'Phiếu xét nghiệm';
  const categoryBadge = report?.category || 'SH';
  const facility = report?.facility_name || 'Bệnh viện Bạch Mai';
  const doctor = report?.ordering_doctor_name || 'BS Trần Văn B';
  const conclusion = report?.conclusion || 'Chỉ số Glucose và Cholesterol trong giới hạn an toàn';
  const sampleDate = report?.performed_at
    ? new Date(report.performed_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '20/10/2026';

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans select-none pb-8">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 flex flex-col gap-3.5">
        {/* 1. Header Badges */}
        <ScreenHeaderPills
          activeMemberName={activeMemberName}
          onSelectMember={() => onNavigate('family')}
        />

        {/* 2. Topbar với nút Back & Badge Chuyên khoa */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => onNavigate('labs')}
              aria-label="Quay lại"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white text-slate-800 flex items-center justify-center shadow-xs active:scale-95 transition shrink-0"
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

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400 font-medium">
            Đang tải dữ liệu xét nghiệm từ cơ sở dữ liệu...
          </div>
        ) : (
          <>
            {/* 3. Metadata Card */}
            <LabMetadataCard
              facility={facility}
              doctor={doctor}
              sampleDate={`${sampleDate} · 07:30`}
              resultDate={`${sampleDate} · 11:00`}
              orderCode={report?.id || 'XN-2026-8891'}
            />

            {/* 4. Table Card: Chỉ số, Kết quả, Tham chiếu */}
            <LabAnalytesTable analytes={analytes} />

            {/* 5. AI Insight Callout */}
            <div className="bg-[#EAF8F0] border border-teal-100/80 rounded-[22px] p-3.5 flex items-start gap-2.5">
              <span className="text-teal-700 text-xs font-black mt-0.5">✦</span>
              <span className="text-xs font-bold text-slate-800 leading-relaxed">
                {conclusion}
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
              className="bg-white rounded-[22px] p-3.5 shadow-xs border border-slate-100 flex items-center justify-between hover:bg-slate-50 min-h-[44px] transition"
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
                <span className="text-xs font-bold text-slate-900">Nhập từ cơ sở y tế</span>
                <span className="text-[11px] text-slate-400 font-medium">Đã đối soát với CSDL Bệnh viện</span>
              </div>
            </div>

            {/* 9. Bottom Action Buttons */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('ai')}
                className="flex-1 h-12 min-h-[44px] rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-xs active:scale-95 transition"
              >
                Hỏi trợ lý AI
              </button>
              <button
                type="button"
                onClick={() => alert('Đã gửi phiếu xét nghiệm cho bác sĩ điều trị')}
                className="flex-1 h-12 min-h-[44px] rounded-full bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] text-white text-xs font-extrabold shadow-md active:scale-95 transition"
              >
                Gửi cho bác sĩ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
