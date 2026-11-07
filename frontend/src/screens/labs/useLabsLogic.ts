import { useState, useMemo, useEffect, useCallback } from 'react';
import { LAB_TEST_CATALOG } from '../../constants/lab-catalog.constants';

export type LabSpecialtyCode = 'all' | 'HH' | 'SH' | 'VS' | 'PT' | 'DT';

export interface LabMetricRaw {
  readonly test_name?: string;
  readonly test_code?: string;
  readonly value_numeric?: number | string | null;
  readonly value_text?: string | null;
  readonly unit?: string | null;
}

export interface LabReportItem {
  readonly id: string;
  readonly title: string;
  readonly facility: string;
  readonly testDate: string;
  readonly rawDate: string;
  readonly categoryBadge: 'SH' | 'HH' | 'VS' | 'PT' | 'DT';
  readonly abnormalCount: number;
  readonly summary: string;
  readonly hasAttachment: boolean;
  readonly rawResults?: readonly LabMetricRaw[];
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
  readonly testCodes: readonly string[];
}

export const TRACKED_METRICS_CONFIG: readonly TrackedMetric[] = Object.freeze(
  LAB_TEST_CATALOG.map((item) => ({
    id: item.id,
    label: item.name,
    value: '--',
    unit: item.unit,
    level: 'Chưa có số đo',
    levelType: 'info' as const,
    points: [] as number[],
    insight: 'Chưa có kết quả xét nghiệm để phân tích xu hướng.',
    testCodes: item.testCodes,
  }))
);

const DEFAULT_TRACKED_IDS = LAB_TEST_CATALOG.filter((i) => i.defaultTracked).map((i) => i.id);

export function useLabsLogic(memberId = 'mem_145deb71') {
  const [selectedCategory, setSelectedCategory] = useState<LabSpecialtyCode>('all');
  const [trackedMetricIds, setTrackedMetricIds] = useState<string[]>(DEFAULT_TRACKED_IDS);
  const [reports, setReports] = useState<readonly LabReportItem[]>([]);
  const [loading, setLoading] = useState(false);


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
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/clinical-reports/${memberId}?kind=lab`, { headers });
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
          rawDate: r.performed_at ? new Date(r.performed_at).toISOString().slice(0, 10) : '',
          categoryBadge: mapCategoryBadge(r.category),
          abnormalCount: Number(r.abnormal_count || 0),
          summary: r.conclusion || 'Tất cả chỉ số trong giới hạn tham chiếu',
          hasAttachment: Boolean(r.attachment_s3_key),
          rawResults: Array.isArray(r.lab_results) ? r.lab_results : [],
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
    return TRACKED_METRICS_CONFIG.filter((m) => trackedMetricIds.includes(m.id)).map((def) => {
      const matchingValues: number[] = [];

      // Sắp xếp các báo cáo theo ngày thực hiện tăng dần để phân tích xu hướng
      const sortedReports = [...reports].sort((a, b) => (a.rawDate > b.rawDate ? 1 : -1));

      for (const rep of sortedReports) {
        if (rep.rawResults && rep.rawResults.length > 0) {
          for (const row of rep.rawResults) {
            const nameNorm = (row.test_name || '').toUpperCase().trim();
            const codeNorm = (row.test_code || '').toUpperCase().trim();
            const match = def.testCodes.some((tc) => nameNorm.includes(tc) || codeNorm.includes(tc));
            if (match && row.value_numeric !== null && row.value_numeric !== undefined) {
              const num = parseFloat(String(row.value_numeric));
              if (!isNaN(num)) matchingValues.push(num);
            }
          }
        }
      }

      if (matchingValues.length === 0) {
        return {
          id: def.id,
          label: def.label,
          value: '--',
          unit: def.unit,
          level: 'Chưa có số đo',
          levelType: 'info' as const,
          points: [] as number[],
          insight: 'Chưa có phiếu xét nghiệm nào ghi nhận chỉ số này. Hãy nhấn nút nhập phiếu bên trên để theo dõi.',
          testCodes: def.testCodes,
        };
      }

      const latestVal = matchingValues[matchingValues.length - 1];
      const firstVal = matchingValues[0];
      const isMultiple = matchingValues.length >= 2;

      let insight = `Đã ghi nhận 1 lần xét nghiệm: ${latestVal} ${def.unit}. Cần thêm kết quả để phân tích xu hướng.`;
      if (isMultiple) {
        const diff = latestVal - firstVal;
        if (diff < 0) {
          insight = `Giảm từ ${firstVal} xuống ${latestVal} ${def.unit} qua ${matchingValues.length} lần xét nghiệm.`;
        } else if (diff > 0) {
          insight = `Tăng từ ${firstVal} lên ${latestVal} ${def.unit} qua ${matchingValues.length} lần xét nghiệm.`;
        } else {
          insight = `Duy trì ổn định ở mức ${latestVal} ${def.unit} qua ${matchingValues.length} lần xét nghiệm.`;
        }
      }

      const catItem = LAB_TEST_CATALOG.find((c) => c.id === def.id);
      let level = 'Mức 1 · Bình thường';
      let levelType: 'info' | 'warning' | 'normal' = 'normal';

      if (catItem?.normalMax !== undefined && latestVal > catItem.normalMax) {
        level = `Cao hơn tham chiếu (>${catItem.normalMax})`;
        levelType = 'warning';
      } else if (catItem?.normalMin !== undefined && latestVal < catItem.normalMin) {
        level = `Thấp hơn tham chiếu (<${catItem.normalMin})`;
        levelType = 'warning';
      }

      return {
        id: def.id,
        label: def.label,
        value: String(latestVal).replace('.', ','),
        unit: def.unit,
        level,
        levelType,
        points: matchingValues,
        insight,
        testCodes: def.testCodes,
      };
    });
  }, [reports, trackedMetricIds]);

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
