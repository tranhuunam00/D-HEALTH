import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  ClinicalDocKind,
  InputMethod,
  ClassificationCategory,
  LabMetricRow,
  ImagingLesion,
  PathologyMarker,
  LAB_METRICS_INFO,
} from './camera-input.types';

export function useCameraInputLogic(initialMemberId = 'mem_145deb71', initialKind: ClinicalDocKind = 'lab') {
  const [kind, setKind] = useState<ClinicalDocKind>(initialKind);

  useEffect(() => {
    if (initialKind) {
      setKind(initialKind);
    }
  }, [initialKind]);

  const [method, setMethod] = useState<InputMethod>('manual');
  const [testDate, setTestDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [doctorName, setDoctorName] = useState('');
  const [facilityName, setFacilityName] = useState('Bệnh viện Bạch Mai');

  // 1. Xét nghiệm
  const [rows, setRows] = useState<LabMetricRow[]>([
    { name: 'LDL-C', value: '', unit: 'mmol/L' },
  ]);
  const [selectedCls, setSelectedCls] = useState<ClassificationCategory | null>(null);

  // 2. Chẩn đoán hình ảnh
  const [modality, setModality] = useState('XQ');
  const [organ, setOrgan] = useState('Phổi · Lồng ngực');
  const [organOther, setOrganOther] = useState('');
  const [techniqueDescription, setTechniqueDescription] = useState('');
  const [clinicalFindings, setClinicalFindings] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [isNormal, setIsNormal] = useState(false);
  const [lesions, setLesions] = useState<ImagingLesion[]>([
    { type: 'Nốt mờ / Khối mờ phổi', side: 'Phổi phải', size: '', target: false },
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


  const buildTitle = () => {
    if (kind === 'lab') return `Xét nghiệm ${curCode || 'SH'} (${testDate})`;
    if (kind === 'img') return `Báo cáo ${modality} ${organ === 'other' ? organOther : organ}`;
    return `Giải phẫu bệnh ${sampleSite} (${specimenCode || 'Tiêu bản'})`;
  };

  const handleSave = async (onSuccess: () => void) => {
    setIsSaving(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const validRows = rows.filter((r) => r.name && String(r.value).trim() !== '');

      // Tự động xử lý kết luận thông minh cho CĐHA (không bao giờ gán 'Kết quả bình thường' khi có tổn thương)
      let finalConclusion = (conclusion || '').trim();
      let finalLesions = lesions;

      if (kind === 'img') {
        if (isNormal) {
          finalConclusion = finalConclusion || 'Không ghi nhận tổn thương bất thường';
          finalLesions = [];
        } else {
          const validLesions = lesions.filter((l) => {
            const s = parseFloat(String(l.size).replace(',', '.'));
            return l.type && !isNaN(s) && s > 0;
          });

          if (!finalConclusion) {
            if (validLesions.length > 0) {
              const summary = validLesions.map((l) => `${l.type}${l.side ? ` (${l.side})` : ''} ${l.size} mm`).join('; ');
              finalConclusion = `Phát hiện ${validLesions.length} tổn thương: ${summary}`;
            } else {
              finalConclusion = 'Ghi nhận tổn thương nghi ngờ';
            }
          }
          finalLesions = validLesions.length > 0 ? validLesions : lesions;
        }
      } else if (kind === 'lab') {
        if (!finalConclusion) {
          finalConclusion = `Đã ghi nhận ${validRows.length} chỉ số xét nghiệm`;
        }
      } else {
        if (!finalConclusion) {
          finalConclusion = diagnosis || 'Kết quả giải phẫu bệnh hoàn tất';
        }
      }

      const body = {
        memberId: initialMemberId,
        kind: kind === 'lab' ? 'lab' : kind === 'img' ? 'imaging' : 'pathology',
        category: kind === 'lab' ? curCode : kind === 'img' ? modality : curCode,
        title: buildTitle(),
        performedAt: testDate,
        facilityName,
        doctorName,
        conclusion: finalConclusion,
        rows: validRows.length > 0 ? validRows : rows,
        lesions: finalLesions,
        markers,
        specimenCode,
        histologicGrade,
        pTNM,
        resectionMargin,
        organ: organ === 'other' ? organOther : organ,
        techniqueDescription: (techniqueDescription || '').trim() || (kind === 'img' ? `Chụp ${modality} ${organ === 'other' ? organOther : organ}` : undefined),
        clinicalFindings: (clinicalFindings || '').trim() || (kind === 'img' ? (isNormal ? 'Không ghi nhận hình ảnh tổn thương bất thường' : finalConclusion) : undefined),
        recommendations: (recommendations || '').trim() || (kind === 'img' ? (isNormal ? 'Theo dõi sức khoẻ định kỳ' : 'Khám chuyên khoa và theo dõi theo chỉ định') : undefined),
      };

      const res = await fetch('/api/clinical-reports', {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const errData = await res.json().catch(() => null);
        const errMsg = errData?.error?.message || `Lỗi lưu kết quả cận lâm sàng (Mã ${res.status})`;
        alert(errMsg);
      }
    } catch (err: any) {
      console.error('Lỗi lưu kết quả cận lâm sàng:', err);
      alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
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
    techniqueDescription,
    setTechniqueDescription,
    clinicalFindings,
    setClinicalFindings,
    conclusion,
    setConclusion,
    recommendations,
    setRecommendations,
    isNormal,
    setIsNormal,
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
