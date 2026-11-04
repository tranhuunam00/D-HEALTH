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
  if (!dateStr) return 'Chưa cập nhật';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      const idToFetch = reportId || 'rep_img_03';
      setLoading(true);
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
              : d.comparison_study_title || 'Không có so sánh';

            setDetail({
              id: d.id,
              title: d.title || 'Báo cáo chẩn đoán hình ảnh',
              modality: d.modality || d.category || 'CĐHA',
              performedAt: formatDateVN(d.performed_at),
              bodyPart: d.body_part || d.specimen_site || 'Chưa cập nhật',
              facilityName: d.facility_name || 'Cơ sở y tế',
              orderingDoctor: d.ordering_doctor_name || 'Bác sĩ chỉ định',
              interpretingDoctor: d.interpreting_doctor_name || 'Bác sĩ đọc kết quả',
              comparisonText: compText,
              technique: d.technique_description || 'Chưa cập nhật kỹ thuật chụp',
              findings: d.clinical_findings || 'Không ghi nhận bất thường',
              conclusion: d.conclusion || 'Bình thường',
              recommendations: d.recommendations || 'Theo dõi định kỳ',
              series: Array.isArray(d.series)
                ? d.series.map((s: any) => ({ id: s.id, name: s.series_name }))
                : [],
            });
          }
        }
      } catch (err) {
        console.error('Lỗi tải chi tiết CĐHA từ database:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [reportId]);

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
                {detail?.title || 'Báo cáo CĐHA'}
              </h1>
              <span className="text-xs text-slate-500 font-medium block">
                Báo cáo chẩn đoán hình ảnh
              </span>
            </div>
          </div>
          <span className="w-11 h-7 rounded-xl bg-[#CCFBF1] text-[#0F766E] text-xs font-black flex items-center justify-center shrink-0">
            {detail?.modality || 'CĐHA'}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400 font-medium">
            Đang tải dữ liệu báo cáo hình ảnh từ cơ sở dữ liệu...
          </div>
        ) : !detail ? (
          <div className="py-12 text-center text-xs text-slate-400 font-medium">
            Không tìm thấy thông tin báo cáo trong cơ sở dữ liệu
          </div>
        ) : (
          <>
            {/* 2. DICOM Thumbnails */}
            <ImagingSeriesThumbnails series={detail.series} />

            {/* 3. Metadata Grid */}
            <ImagingMetadataGrid
              performedAt={detail.performedAt}
              bodyPart={detail.bodyPart}
              facilityName={detail.facilityName}
              orderingDoctor={detail.orderingDoctor}
              interpretingDoctor={detail.interpretingDoctor}
              comparisonText={detail.comparisonText}
            />

            {/* 4. Clinical Details */}
            <ImagingFindingsCard
              technique={detail.technique}
              findings={detail.findings}
            />

            {/* 5. Conclusion & Recommendations */}
            <ImagingConclusionCard
              conclusion={detail.conclusion}
              recommendations={detail.recommendations}
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
          </>
        )}
      </div>
    </div>
  );
};
