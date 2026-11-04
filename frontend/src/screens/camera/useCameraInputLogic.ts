import { useState, useMemo, useCallback } from 'react';
import {
  ClinicalDocKind,
  InputMethod,
  ClassificationCategory,
  LabMetricRow,
  ImagingLesion,
  PathologyMarker,
  LAB_METRICS_INFO,
} from './camera-input.types';

export function useCameraInputLogic(initialMemberId = 'nam') {
  const [kind, setKind] = useState<ClinicalDocKind>('lab');
  const [method, setMethod] = useState<InputMethod>('manual');
  const [testDate, setTestDate] = useState('2026-10-26');
  const [doctorName, setDoctorName] = useState('');
  const [facilityName, setFacilityName] = useState('Bệnh viện Bạch Mai');

  // 1. Xét nghiệm
  const [rows, setRows] = useState<LabMetricRow[]>([
    { name: 'LDL-C', value: '', unit: 'mmol/L' },
  ]);
  const [selectedCls, setSelectedCls] = useState<ClassificationCategory | null>(null);

  // 2. Chẩn đoán hình ảnh
  const [modality, setModality] = useState('CT');
  const [organ, setOrgan] = useState('Gan');
  const [organOther, setOrganOther] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [lesions, setLesions] = useState<ImagingLesion[]>([
    { type: 'Khối u đặc', side: 'Bên phải', size: '', target: false },
  ]);

  // 3. Giải phẫu bệnh
  const [biopsyType, setBiopsyType] = useState('Sinh thiết kim');
  const [sampleSite, setSampleSite] = useState('Gan');
  const [specimenCode, setSpecimenCode] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [histologicGrade, setHistologicGrade] = useState('G1');
  const [pTNM, setPTNM] = useState('');
  const [resectionMargin, setResectionMargin] = useState('Âm tính');
  const [markers, setMarkers] = useState<PathologyMarker[]>([
    { marker: 'Ki-67', result: '' },
  ]);

  // 4. Link cơ sở y tế
  const [linkUrl, setLinkUrl] = useState('');
  const [linkUsername, setLinkUsername] = useState('');
  const [linkPassword, setLinkPassword] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Thuật toán đề xuất phân loại nhóm xét nghiệm (BR-110, BR-111, BR-113)
  const classificationAnalysis = useMemo(() => {
    const filled = rows.filter((r) => String(r.value).trim() !== '');
    if ((kind !== 'lab' || method !== 'manual' || filled.length === 0) && method !== 'cam') {
      return { showCls: false, sugCode: 'SH' as ClassificationCategory, mixed: false, mixList: '' };
    }
    if (kind === 'lab' && method === 'cam') {
      return { showCls: true, sugCode: 'SH' as ClassificationCategory, mixed: false, mixList: '' };
    }
    const count: Record<string, number> = {};
    filled.forEach((r) => {
      const cat = LAB_METRICS_INFO[r.name]?.[0] || 'SH';
      count[cat] = (count[cat] || 0) + 1;
    });
    const sortedCats = (Object.keys(count) as ClassificationCategory[]).sort((a, b) => count[b] - count[a]);
    return {
      showCls: true,
      sugCode: sortedCats[0] || 'SH',
      mixed: sortedCats.length > 1,
      mixList: sortedCats.join(', '),
    };
  }, [rows, kind, method]);

  const curCode = selectedCls || classificationAnalysis.sugCode;
  const overridden = Boolean(selectedCls && selectedCls !== classificationAnalysis.sugCode);

  // Actions for Lab Rows
  const addRow = useCallback(() => {
    setRows((prev) => [...prev, { name: 'HbA1c', value: '', unit: '%' }]);
  }, []);

  const removeRow = useCallback((index: number) => {
    setRows((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }, []);

  const updateRow = useCallback((index: number, patch: Partial<LabMetricRow>) => {
    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== index) return r;
        const updated = { ...r, ...patch };
        if (patch.name && LAB_METRICS_INFO[patch.name]) {
          updated.unit = LAB_METRICS_INFO[patch.name][1];
        }
        return updated;
      })
    );
  }, []);

  // Actions for Lesions
  const addLesion = useCallback(() => {
    setLesions((prev) => [...prev, { type: 'Khối u đặc', side: 'Bên phải', size: '', target: false }]);
  }, []);

  const removeLesion = useCallback((index: number) => {
    setLesions((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }, []);

  const updateLesion = useCallback((index: number, patch: Partial<ImagingLesion>) => {
    setLesions((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  }, []);

  // Actions for Pathology Markers
  const addMarker = useCallback(() => {
    setMarkers((prev) => [...prev, { marker: 'ER', result: '' }]);
  }, []);

  const removeMarker = useCallback((index: number) => {
    setMarkers((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }, []);

  const updateMarker = useCallback((index: number, patch: Partial<PathologyMarker>) => {
    setMarkers((prev) => prev.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  }, []);

  const getBaseUrl = () => {
    return typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null')
      ? window.location.origin
      : 'http://localhost';
  };

  const buildTitle = () => {
    if (kind === 'lab') return `Xét nghiệm ${curCode || 'SH'} (${testDate})`;
    if (kind === 'img') return `Báo cáo ${modality} ${organ === 'other' ? organOther : organ}`;
    return `Giải phẫu bệnh ${sampleSite} (${specimenCode || 'Tiêu bản'})`;
  };

  const handleSave = async (onSuccess: () => void) => {
    setIsSaving(true);
    try {
      const baseUrl = getBaseUrl();
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const validRows = rows.filter((r) => r.name && String(r.value).trim() !== '');
      const body = {
        memberId: initialMemberId,
        kind: kind === 'lab' ? 'lab' : kind === 'img' ? 'imaging' : 'pathology',
        category: curCode,
        title: buildTitle(),
        performedAt: testDate,
        facilityName,
        doctorName,
        conclusion,
        rows: validRows.length > 0 ? validRows : rows,
        lesions,
        markers,
        specimenCode,
        histologicGrade,
        pTNM,
        resectionMargin,
        organ: organ === 'other' ? organOther : organ,
      };

      const res = await fetch(`${baseUrl}/api/clinical-reports`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (res.ok) {
        onSuccess();
      }
    } catch (err) {
      console.error('Lỗi lưu kết quả cận lâm sàng:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    kind,
    setKind,
    method,
    setMethod,
    testDate,
    setTestDate,
    doctorName,
    setDoctorName,
    facilityName,
    setFacilityName,
    rows,
    addRow,
    removeRow,
    updateRow,
    showCls: classificationAnalysis.showCls,
    sugCode: classificationAnalysis.sugCode,
    mixed: classificationAnalysis.mixed,
    mixList: classificationAnalysis.mixList,
    curCode,
    overridden,
    setSelectedCls,
    resetCls: () => setSelectedCls(null),
    modality,
    setModality,
    organ,
    setOrgan,
    organOther,
    setOrganOther,
    conclusion,
    setConclusion,
    lesions,
    addLesion,
    removeLesion,
    updateLesion,
    biopsyType,
    setBiopsyType,
    sampleSite,
    setSampleSite,
    specimenCode,
    setSpecimenCode,
    diagnosis,
    setDiagnosis,
    histologicGrade,
    setHistologicGrade,
    pTNM,
    setPTNM,
    resectionMargin,
    setResectionMargin,
    markers,
    addMarker,
    removeMarker,
    updateMarker,
    linkUrl,
    setLinkUrl,
    linkUsername,
    setLinkUsername,
    linkPassword,
    setLinkPassword,
    captchaCode,
    setCaptchaCode,
    isSaving,
    handleSave,
  };
}
