import { useState, useMemo, useEffect, useCallback } from 'react';
import { MODALITY_TAXONOMY_KEYWORDS } from './imaging.constants';

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

export interface EvaluationHistoryItem {
  readonly id: string;
  readonly study_id: string;
  readonly organ: string;
  readonly lesion_location: string;
  readonly lesion_count: number;
  readonly baseline_sum_diameters_mm: number;
  readonly nadir_sum_diameters_mm: number;
  readonly current_sum_diameters_mm: number;
  readonly recist_response: 'CR' | 'PR' | 'SD' | 'PD' | string;
  readonly treatment_response_note?: string;
  readonly performed_at: string;
  readonly modality: string;
  readonly body_part: string;
  readonly title?: string;
  readonly lesion_type?: string;
  readonly laterality?: string;
}

export interface TumorTrackingData {
  readonly targetTitle: string;
  readonly subtitle: string;
  readonly currentSumMm: number;
  readonly dates: readonly string[];
  readonly totalRow: readonly number[];
  readonly caption: string;
  readonly isBaselineOnly: boolean;
  readonly history: readonly EvaluationHistoryItem[];
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
  if (MODALITY_TAXONOMY_KEYWORDS.MRI.some((kw) => text.includes(kw))) return 'MRI';
  if (MODALITY_TAXONOMY_KEYWORDS.CT.some((kw) => text.includes(kw))) return 'CT';
  if (MODALITY_TAXONOMY_KEYWORDS.SA.some((kw) => text.includes(kw))) return 'SA';
  if (MODALITY_TAXONOMY_KEYWORDS.MM.some((kw) => text.includes(kw))) return 'MM';
  if (MODALITY_TAXONOMY_KEYWORDS.XQ.some((kw) => text.includes(kw))) return 'XQ';
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

export function useImagingLogic(memberId = 'mem_145deb71') {
  const [selectedModality, setSelectedModality] = useState<ModalityCode>('ALL');
  const [studies, setStudies] = useState<readonly ImagingStudyItem[]>([]);
  const [dbEval, setDbEval] = useState<any>(null);
  const [evalHistory, setEvalHistory] = useState<readonly EvaluationHistoryItem[]>([]);
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
        setEvalHistory(Array.isArray(evalJson.history) ? evalJson.history : []);
      } else {
        setDbEval(null);
        setEvalHistory([]);
      }
    } catch {
      setStudies([]);
      setDbEval(null);
      setEvalHistory([]);
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
    if (!evalHistory || evalHistory.length === 0) return null;

    const sorted = [...evalHistory].sort((a, b) => {
      const ta = new Date(a.performed_at).getTime();
      const tb = new Date(b.performed_at).getTime();
      return ta - tb;
    });

    const dates = sorted.map((e) => formatDisplayDate(e.performed_at));
    const totalRow = sorted.map((e) => Number(e.current_sum_diameters_mm) || 0);
    const latest = sorted[sorted.length - 1];
    const first = sorted[0];
    const currentSum = Number(latest.current_sum_diameters_mm) || 0;
    const firstSum = Number(first.current_sum_diameters_mm) || 0;

    let caption = `Số đo cơ sở: ${currentSum} mm.`;
    if (sorted.length >= 2) {
      const diff = currentSum - firstSum;
      if (diff < 0) {
        caption = `Tổng đường kính giảm từ ${firstSum} mm xuống ${currentSum} mm sau điều trị (-${Math.abs(diff).toFixed(1)} mm).`;
      } else if (diff > 0) {
        caption = `Tổng đường kính tăng từ ${firstSum} mm lên ${currentSum} mm (+${diff.toFixed(1)} mm).`;
      } else {
        caption = `Tổng đường kính ổn định không đổi (${currentSum} mm).`;
      }
    }

    return {
      targetTitle: latest.lesion_location || `Tổn thương · ${latest.organ || 'Gan'}`,
      subtitle: `${latest.modality || 'CĐHA'} · ${latest.lesion_count || 1} tổn thương`,
      currentSumMm: currentSum,
      dates,
      totalRow,
      caption,
      isBaselineOnly: sorted.length === 1,
      history: sorted,
    };
  }, [evalHistory]);

  const recistEvaluation: RecistEvaluationData | null = useMemo(() => {
    if (!dbEval) return null;
    const labels: Record<string, string> = {
      PR: 'Đáp ứng một phần',
      CR: 'Đáp ứng hoàn toàn',
      SD: 'Bệnh ổn định',
      PD: 'Bệnh tiến triển',
    };
    return {
      responseCode: (dbEval.recist_response as any) || 'SD',
      responseLabel: labels[dbEval.recist_response] || 'Bệnh ổn định',
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
