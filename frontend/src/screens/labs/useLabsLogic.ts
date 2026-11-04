import { useState, useMemo, useEffect, useCallback } from 'react';

export type LabSpecialtyCode = 'all' | 'HH' | 'SH' | 'VS' | 'PT' | 'DT';

export interface LabReportItem {
  readonly id: string;
  readonly title: string;
  readonly facility: string;
  readonly testDate: string;
  readonly categoryBadge: 'SH' | 'HH' | 'VS' | 'PT' | 'DT';
  readonly abnormalCount: number;
  readonly summary: string;
  readonly hasAttachment: boolean;
}

export interface TrackedMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly unit: string;
  readonly level: string;
  readonly levelType: 'info' | 'warning' | 'normal';
  readonly points: readonly number[];
  readonly insight: string;
}

export const TRACKED_METRICS_CONFIG: readonly TrackedMetric[] = Object.freeze([
  {
    id: 'hba1c',
    label: 'HbA1c',
    value: '6,6',
    unit: '%',
    level: 'Mức 1 · Thông tin',
    levelType: 'info',
    points: [7.8, 7.4, 7.1, 6.8, 6.6],
    insight: 'Giảm từ 7,8% xuống 6,6% qua 5 lần xét nghiệm — xu hướng tích cực.',
  },
  {
    id: 'ldlc',
    label: 'LDL-C',
    value: '3,8',
    unit: 'mmol/L',
    level: 'Mức 2 · Chú ý',
    levelType: 'warning',
    points: [2.8, 3.0, 3.2, 3.5, 3.8],
    insight: 'LDL-C tăng qua 5 lần xét nghiệm gần nhất — cần chú ý chế độ ăn giảm mỡ.',
  },
  {
    id: 'glucose',
    label: 'Glucose đói',
    value: '6,1',
    unit: 'mmol/L',
    level: 'Mức 1 · Tốt',
    levelType: 'normal',
    points: [6.8, 6.5, 6.4, 6.2, 6.1],
    insight: 'Đường huyết đói duy trì ổn định dưới ngưỡng 6,4 mmol/L.',
  },
  {
    id: 'cholesterol',
    label: 'Cholesterol TP',
    value: '4,8',
    unit: 'mmol/L',
    level: 'Mức 1 · Tốt',
    levelType: 'normal',
    points: [5.2, 5.0, 4.9, 4.8, 4.8],
    insight: 'Cholesterol toàn phần trong ngưỡng tham chiếu an toàn.',
  },
  {
    id: 'triglyceride',
    label: 'Triglycerid',
    value: '1,4',
    unit: 'mmol/L',
    level: 'Mức 1 · Tốt',
    levelType: 'normal',
    points: [1.8, 1.6, 1.5, 1.4, 1.4],
    insight: 'Triglycerid duy trì tốt dưới ngưỡng 1.7 mmol/L.',
  },
  {
    id: 'creatinine',
    label: 'Creatinin',
    value: '82',
    unit: 'µmol/L',
    level: 'Mức 1 · Tốt',
    levelType: 'normal',
    points: [88, 86, 85, 83, 82],
    insight: 'Chức năng lọc cầu thận bình thường, Creatinin ổn định.',
  },
]);

export function useLabsLogic(memberId = 'nam') {
  const [selectedCategory, setSelectedCategory] = useState<LabSpecialtyCode>('all');
  const [trackedMetricIds, setTrackedMetricIds] = useState<string[]>(['hba1c', 'ldlc']);
  const [reports, setReports] = useState<readonly LabReportItem[]>([]);
  const [loading, setLoading] = useState(false);

  const getBaseUrl = () => {
    return typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null')
      ? window.location.origin
      : 'http://localhost';
  };

  const mapCategoryBadge = (cat?: string): 'SH' | 'HH' | 'VS' | 'PT' | 'DT' => {
    if (!cat) return 'SH';
    const c = cat.toUpperCase();
    if (c === 'HH' || c === 'HEMATOLOGY') return 'HH';
    if (c === 'VS' || c === 'MICROBIOLOGY') return 'VS';
    if (c === 'PT' || c === 'MOLECULAR') return 'PT';
    if (c === 'DT' || c === 'GENETICS') return 'DT';
    return 'SH';
  };

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl = getBaseUrl();
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${baseUrl}/api/clinical-reports/${memberId}?kind=lab`, { headers });
      if (res.ok) {
        const json = await res.json();
        const apiRecords = Array.isArray(json.data) ? json.data : [];
        const mapped: LabReportItem[] = apiRecords.map((r: any) => ({
          id: r.id,
          title: r.title || 'Phiếu xét nghiệm',
          facility: r.facility_name || 'Cơ sở y tế',
          testDate: r.performed_at
            ? new Date(r.performed_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
            : '',
          categoryBadge: mapCategoryBadge(r.category),
          abnormalCount: Number(r.abnormal_count || 0),
          summary: r.conclusion || 'Tất cả chỉ số trong giới hạn tham chiếu',
          hasAttachment: Boolean(r.attachment_s3_key),
        }));
        setReports(mapped);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.error('Lỗi tải phiếu xét nghiệm từ database:', err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const toggleTrackedMetric = useCallback((id: string) => {
    setTrackedMetricIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }, []);

  const filteredReports = useMemo(() => {
    if (selectedCategory === 'all') return reports;
    return reports.filter((r) => r.categoryBadge === selectedCategory);
  }, [reports, selectedCategory]);

  const activeTrackedMetrics = useMemo(() => {
    return TRACKED_METRICS_CONFIG.filter((m) => trackedMetricIds.includes(m.id));
  }, [trackedMetricIds]);

  return {
    selectedCategory,
    setSelectedCategory,
    trackedMetricIds,
    toggleTrackedMetric,
    reports,
    filteredReports,
    activeTrackedMetrics,
    loading,
    refetch: fetchReports,
  };
}
