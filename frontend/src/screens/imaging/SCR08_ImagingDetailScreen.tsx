import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ImagingSeriesThumbnails } from './components/ImagingSeriesThumbnails';
import { ImagingMetadataGrid } from './components/ImagingMetadataGrid';
import { ImagingFindingsCard } from './components/ImagingFindingsCard';
import { ImagingConclusionCard } from './components/ImagingConclusionCard';

interface SCR08Props {
  readonly reportId?: string | null;
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberName?: string;
  readonly activeMemberId?: string;
}

interface ImagingDetailData {
  readonly id: string;
  readonly title: string;
  readonly modality: string;
  readonly performedAt: string;
  readonly bodyPart: string;
  readonly facilityName: string;
  readonly orderingDoctor: string;
  readonly interpretingDoctor: string;
  readonly comparisonText: string;
  readonly technique: string;
  readonly findings: string;
  readonly conclusion: string;
  readonly recommendations: string;
  readonly series: readonly { id: string; name: string }[];
}

function formatDateVN(dateStr?: string): string {
  if (!dateStr) return '20/08/2026';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export const SCR08_ImagingDetailScreen: React.FC<SCR08Props> = ({
  reportId,
  onNavigate,
}) => {
  const [detail, setDetail] = useState<ImagingDetailData | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const idToFetch = reportId || 'rep_img_03';
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
        const res = await fetch(`/api/clinical-reports/detail/${idToFetch}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const json = await res.json();
          if (json?.data) {
            const d = json.data;
            const compText = d.comparison_study_modality && d.comparison_study_date
              ? `${d.comparison_study_modality} ${formatDateVN(d.comparison_study_date)}`
              : d.comparison_study_title || 'CT 20/06/2026';

            setDetail({
              id: d.id,
              title: d.title || 'MRI gan có tiêm thuốc',
              modality: d.modality || d.category || 'MRI',
              performedAt: formatDateVN(d.performed_at),
              bodyPart: d.body_part || d.specimen_site || 'Gan · ổ bụng trên',
              facilityName: d.facility_name || '[Bệnh viện đối tác]',
              orderingDoctor: d.ordering_doctor_name || '[Bác sĩ ung bướu]',
              interpretingDoctor: d.interpreting_doctor_name || 'BS Lê Văn C',
              comparisonText: compText,
              technique: d.technique_description || 'MRI 1.5T ổ bụng trên, chuỗi T1, T2, DWI; tiêm thuốc tương phản từ, chụp động học các thì.',
              findings: d.clinical_findings || 'Gan kích thước bình thường, bờ đều. Ba khối đặc ở hạ phân thuỳ VI, VII, VIII, ngấm thuốc dạng viền, kích thước giảm so với phim trước. Nang gan đơn thuần hạ phân thuỳ II, 12 mm, không thay đổi. Không thấy huyết khối tĩnh mạch cửa. Không có dịch ổ bụng.',
              conclusion: d.conclusion || 'Ba khối đặc gan giảm kích thước so với phim 20/06/2026 (tổng 45 → 38 mm). Nang gan đơn thuần ổn định.',
              recommendations: d.recommendations || 'Theo dõi đáp ứng điều trị, chụp lại sau 3 tháng.',
              series: Array.isArray(d.series) && d.series.length > 0
                ? d.series.map((s: any) => ({ id: s.id, name: s.series_name }))
                : [
                    { id: '1', name: 'T1 + thuốc' },
                    { id: '2', name: 'T2' },
                    { id: '3', name: 'DWI' },
                  ],
            });
          }
        }
      } catch {
        // Fallback
      }
    };

    fetchDetail();
  }, [reportId]);

  const seriesList = detail?.series || [
    { id: '1', name: 'T1 + thuốc' },
    { id: '2', name: 'T2' },
    { id: '3', name: 'DWI' },
  ];

  return (
    <div className="w-full min-h-screen relative bg-[#EEF2F6] text-[#111827] flex flex-col font-sans select-none pb-8">
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 flex flex-col gap-3">
        {/* 1. Topbar with Back, Title & Modality Badge */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => onNavigate('imaging')}
              aria-label="Quay lại"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white text-slate-800 flex items-center justify-center shadow-xs active:scale-95 transition shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base font-black text-slate-900 leading-tight truncate">
                {detail?.title || 'MRI gan có tiêm thuốc'}
              </h1>
              <span className="text-xs text-slate-500 font-medium block">
                Báo cáo chẩn đoán hình ảnh
              </span>
            </div>
          </div>
          <span className="w-11 h-7 rounded-xl bg-[#CCFBF1] text-[#0F766E] text-xs font-black flex items-center justify-center shrink-0">
            {detail?.modality || 'MRI'}
          </span>
        </div>

        {/* 2. DICOM Thumbnails */}
        <ImagingSeriesThumbnails series={seriesList} />

        {/* 3. Metadata Grid */}
        <ImagingMetadataGrid
          performedAt={detail?.performedAt || '20/08/2026'}
          bodyPart={detail?.bodyPart || 'Gan · ổ bụng trên'}
          facilityName={detail?.facilityName || '[Bệnh viện đối tác]'}
          orderingDoctor={detail?.orderingDoctor || '[Bác sĩ ung bướu]'}
          interpretingDoctor={detail?.interpretingDoctor || 'BS Lê Văn C'}
          comparisonText={detail?.comparisonText || 'CT 20/06/2026'}
        />

        {/* 4. Clinical Details */}
        <ImagingFindingsCard
          technique={detail?.technique || 'MRI 1.5T ổ bụng trên, chuỗi T1, T2, DWI; tiêm thuốc tương phản từ, chụp động học các thì.'}
          findings={detail?.findings || 'Gan kích thước bình thường, bờ đều. Ba khối đặc ở hạ phân thuỳ VI, VII, VIII, ngấm thuốc dạng viền, kích thước giảm so với phim trước. Nang gan đơn thuần hạ phân thuỳ II, 12 mm, không thay đổi. Không thấy huyết khối tĩnh mạch cửa. Không có dịch ổ bụng.'}
        />

        {/* 5. Conclusion & Recommendations */}
        <ImagingConclusionCard
          conclusion={detail?.conclusion || 'Ba khối đặc gan giảm kích thước so với phim 20/06/2026 (tổng 45 → 38 mm). Nang gan đơn thuần ổn định.'}
          recommendations={detail?.recommendations || 'Theo dõi đáp ứng điều trị, chụp lại sau 3 tháng.'}
        />

        {/* 6. Action Button: Xem ảnh DICOM (PACS) */}
        <button
          onClick={() => alert('Mở PACS Cloud Viewer (MinIO S3 / Orthanc)...')}
          className="w-full h-11 min-h-[44px] rounded-2xl bg-white border border-slate-200 text-slate-800 font-extrabold text-xs shadow-xs hover:bg-slate-50 active:scale-98 transition flex items-center justify-center"
        >
          Xem ảnh DICOM (PACS) · Báo cáo PDF
        </button>

        {/* 7. Dual Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onNavigate('imaging')}
            className="flex-1 h-11 min-h-[44px] rounded-2xl bg-white border border-slate-200 text-slate-800 font-extrabold text-xs shadow-xs hover:bg-slate-50 active:scale-98 transition flex items-center justify-center"
          >
            Theo dõi tổn thương
          </button>
          <button
            onClick={() => alert('Đã gửi liên kết báo cáo và phim chụp cho Bác sĩ điều trị!')}
            className="flex-1 h-11 min-h-[44px] rounded-2xl bg-[#1F7A8C] hover:bg-[#196575] text-white font-extrabold text-xs shadow-xs active:scale-98 transition flex items-center justify-center"
          >
            Gửi cho bác sĩ
          </button>
        </div>
      </div>
    </div>
  );
};
