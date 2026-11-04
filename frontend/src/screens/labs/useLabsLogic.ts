import { useState, useMemo, useEffect } from 'react';

export type LabCategory = 'all' | 'biochemistry' | 'hematology' | 'immunology' | 'urinalysis';

export interface LabReportItem {
  readonly id: string;
  readonly title: string;
  readonly facility: string;
  readonly testDate: string;
  readonly category: LabCategory;
  readonly abnormalCount: number;
  readonly summary: string;
  readonly hasAttachment: boolean;
}

const mapDbCategory = (cat?: string): LabCategory => {
  if (!cat) return 'biochemistry';
  const c = cat.toUpperCase();
  if (c === 'SH' || c === 'BIOCHEMISTRY') return 'biochemistry';
  if (c === 'HH' || c === 'HEMATOLOGY') return 'hematology';
  if (c === 'VS' || c === 'URINALYSIS' || c === 'NT') return 'urinalysis';
  if (c === 'MD' || c === 'IMMUNOLOGY') return 'immunology';
  return 'biochemistry';
};

const INITIAL_REPORTS: readonly LabReportItem[] = Object.freeze([
  {
    id: 'rep-01',
    title: 'Sinh hoá máu 18 chỉ số',
    facility: 'Bệnh viện Bạch Mai',
    testDate: '20/10/2026',
    category: 'biochemistry',
    abnormalCount: 2,
    summary: '2 chỉ số vượt ngưỡng (Glucose 7.2, LDL-C 3.8)',
    hasAttachment: true,
  },
  {
    id: 'rep-02',
    title: 'Tổng phân tích tế bào máu ngoại vi',
    facility: 'Bệnh viện Đại học Y Hà Nội',
    testDate: '15/09/2026',
    category: 'hematology',
    abnormalCount: 0,
    summary: 'Tất cả 24 chỉ số trong giới hạn tham chiếu',
    hasAttachment: true,
  },
  {
    id: 'rep-03',
    title: 'Xét nghiệm nước tiểu 10 thông số',
    facility: 'Phòng khám Đa khoa Medlatec',
    testDate: '10/08/2026',
    category: 'urinalysis',
    abnormalCount: 0,
    summary: 'Protein âm tính, pH 6.0',
    hasAttachment: false,
  },
]);

export function useLabsLogic(memberId = 'me') {
  const [selectedCategory, setSelectedCategory] = useState<LabCategory>('all');
  const [reports, setReports] = useState<readonly LabReportItem[]>(INITIAL_REPORTS);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/clinical-reports/${memberId}?kind=lab`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          const mapped: LabReportItem[] = json.data.map((r: any) => ({
            id: r.id,
            title: r.title || 'Phiếu xét nghiệm',
            facility: r.facility_name || 'Cơ sở y tế',
            testDate: r.performed_at ? new Date(r.performed_at).toLocaleDateString('vi-VN') : '20/10/2026',
            category: mapDbCategory(r.category),
            abnormalCount: Number(r.abnormal_count || 0),
            summary: r.conclusion || (Number(r.abnormal_count) > 0 ? `${r.abnormal_count} chỉ số bất thường` : 'Tất cả chỉ số trong giới hạn tham chiếu'),
            hasAttachment: Boolean(r.attachment_s3_key),
          }));
          setReports(mapped);
        }
      }
    } catch {
      // Fallback to initial reports if fetch fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [memberId]);

  const filteredReports = useMemo(() => {
    if (selectedCategory === 'all') return reports;
    return reports.filter((r) => r.category === selectedCategory);
  }, [reports, selectedCategory]);

  return {
    selectedCategory,
    setSelectedCategory,
    reports,
    filteredReports,
    loading,
    refetch: fetchReports,
  };
}
