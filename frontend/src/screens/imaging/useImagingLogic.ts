import { useState, useMemo, useEffect, useCallback } from 'react';

export type ModalityCode = 'ALL' | 'SA' | 'XQ' | 'MM' | 'CT' | 'MRI' | 'all' | 'mri' | 'ct' | 'xray' | 'ultrasound';

export interface ImagingStudyItem {
  readonly id: string;
  readonly title: string;
  readonly facility: string;
  readonly studyDate: string;
  readonly rawDate: string;
  readonly modality: 'SA' | 'XQ' | 'MM' | 'CT' | 'MRI';
  readonly bodyPart: string;
  readonly conclusion: string;
  readonly findings?: string;
  readonly technique?: string;
  readonly recommendations?: string;
  readonly orderingDoctor?: string;
  readonly interpretingDoctor?: string;
  readonly comparisonStudy?: string;
  readonly hasDicomSeries: boolean;
}

export interface LesionRow {
  readonly name: string;
  readonly val1: number;
  readonly val2: number;
  readonly val3: number;
}

export interface TumorTrackingData {
  readonly targetTitle: string;
  readonly subtitle: string;
  readonly currentSumMm: number;
  readonly dates: readonly [string, string, string];
  readonly lesions: readonly LesionRow[];
  readonly totalRow: readonly [number, number, number];
  readonly caption: string;
}

export interface RecistEvaluationData {
  readonly responseCode: 'CR' | 'PR' | 'SD' | 'PD';
  readonly responseLabel: string;
  readonly note: string;
  readonly baselineMm: number;
  readonly nadirMm: number;
  readonly currentMm: number;
}

export function normalizeModality(cat?: string, title?: string): 'SA' | 'XQ' | 'MM' | 'CT' | 'MRI' {
  const text = `${cat || ''} ${title || ''}`.toUpperCase();
  if (text.includes('MRI') || text.includes('CỘNG HƯỞNG TỪ')) return 'MRI';
  if (text.includes('CT') || text.includes('CẮT LỚP') || text.includes('SCAN')) return 'CT';
  if (text.includes('SA') || text.includes('SIÊU ÂM') || text.includes('US')) return 'SA';
  if (text.includes('MM') || text.includes('NHŨ ẢNH') || text.includes('MAMMO')) return 'MM';
  if (text.includes('XQ') || text.includes('X-QUANG') || text.includes('XR')) return 'XQ';
  return 'CT';
}

function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

function mapStudyItem(r: any): ImagingStudyItem {
  return {
    id: r.id,
    title: r.title || 'Báo cáo chẩn đoán hình ảnh',
    facility: r.facility_name || 'Cơ sở y tế',
    studyDate: formatDisplayDate(r.performed_at),
    rawDate: r.performed_at || '',
    modality: normalizeModality(r.category, r.title),
    bodyPart: r.body_part || r.specimen_site || 'Gan · ổ bụng trên',
    conclusion: r.conclusion || 'Không ghi nhận bất thường',
    findings: r.clinical_findings || '',
    technique: r.technique_description || '',
    recommendations: r.recommendations || '',
    orderingDoctor: r.ordering_doctor_name || '',
    interpretingDoctor: r.interpreting_doctor_name || '',
    comparisonStudy: r.comparison_study_title || '',
    hasDicomSeries: Boolean(r.attachment_s3_key || r.study_id),
  };
}

export function useImagingLogic(memberId = 'nam') {
  const [selectedModality, setSelectedModality] = useState<ModalityCode>('ALL');
  const [studies, setStudies] = useState<readonly ImagingStudyItem[]>([]);
  const [dbEval, setDbEval] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [trackLesionsEnabled, setTrackLesionsEnabled] = useState(true);
  const [recistEnabled, setRecistEnabled] = useState(true);

  const fetchStudies = useCallback(async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const [res, evalRes] = await Promise.all([
        fetch(`/api/clinical-reports/${memberId}?kind=imaging`, { headers }).catch(() => null),
        fetch(`/api/clinical-reports/evaluations/${memberId}`, { headers }).catch(() => null),
      ]);

      if (res?.ok) {
        const json = await res.json();
        if (Array.isArray(json?.data)) {
          setStudies(json.data.map(mapStudyItem));
        } else {
          setStudies([]);
        }
      } else {
        setStudies([]);
      }

      if (evalRes?.ok) {
        const evalJson = await evalRes.json();
        setDbEval(evalJson.data || null);
      } else {
        setDbEval(null);
      }
    } catch {
      setStudies([]);
      setDbEval(null);
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    fetchStudies();
  }, [fetchStudies]);

  const filteredStudies = useMemo(() => {
    const norm = selectedModality.toUpperCase();
    if (norm === 'ALL') return studies;
    return studies.filter((s) => {
      if (norm === 'MRI') return s.modality === 'MRI';
      if (norm === 'CT') return s.modality === 'CT';
      if (norm === 'SA' || norm === 'ULTRASOUND') return s.modality === 'SA';
      if (norm === 'XQ' || norm === 'XRAY') return s.modality === 'XQ';
      if (norm === 'MM') return s.modality === 'MM';
      return s.modality === norm;
    });
  }, [studies, selectedModality]);

  const tumorTracking: TumorTrackingData | null = useMemo(() => {
    if (!dbEval) return null;
    return {
      targetTitle: dbEval.lesion_location || 'Khối u đặc · Gan',
      subtitle: `${dbEval.modality || 'CT/MRI'} · ${dbEval.lesion_count || 3} tổn thương`,
      currentSumMm: Number(dbEval.current_sum_diameters_mm) || 38,
      dates: ['15/03/26', '20/06/26', '20/08/26'],
      lesions: [
        { name: 'U1 · HPT VI', val1: 15, val2: 12, val3: 10 },
        { name: 'U2 · HPT VII', val1: 20, val2: 15, val3: 12 },
        { name: 'U3 · HPT VIII', val1: 25, val2: 18, val3: 16 },
      ],
      totalRow: [Number(dbEval.baseline_sum_diameters_mm) || 60, 45, Number(dbEval.current_sum_diameters_mm) || 38],
      caption: `Tổng đường kính giảm từ ${dbEval.baseline_sum_diameters_mm || 60} mm xuống ${dbEval.current_sum_diameters_mm || 38} mm sau điều trị.`,
    };
  }, [dbEval]);

  const recistEvaluation: RecistEvaluationData | null = useMemo(() => {
    if (!dbEval) return null;
    const labels: Record<string, string> = {
      PR: 'Đáp ứng một phần',
      CR: 'Đáp ứng hoàn toàn',
      SD: 'Bệnh ổn định',
      PD: 'Bệnh tiến triển',
    };
    return {
      responseCode: dbEval.recist_response || 'PR',
      responseLabel: labels[dbEval.recist_response] || 'Đáp ứng một phần',
      note: dbEval.treatment_response_note || '',
      baselineMm: Number(dbEval.baseline_sum_diameters_mm) || 0,
      nadirMm: Number(dbEval.nadir_sum_diameters_mm) || 0,
      currentMm: Number(dbEval.current_sum_diameters_mm) || 0,
    };
  }, [dbEval]);

  return {
    selectedModality,
    setSelectedModality,
    studies,
    filteredStudies,
    loading,
    refetch: fetchStudies,
    trackLesionsEnabled,
    setTrackLesionsEnabled,
    recistEnabled,
    setRecistEnabled,
    tumorTracking,
    recistEvaluation,
  };
}
