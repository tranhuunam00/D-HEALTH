import { useState, useMemo, useEffect } from 'react';

export type ModalityType = 'all' | 'mri' | 'ct' | 'xray' | 'ultrasound';

export interface ImagingStudyItem {
  readonly id: string;
  readonly title: string;
  readonly facility: string;
  readonly studyDate: string;
  readonly modality: ModalityType;
  readonly modalityName: string;
  readonly bodyPart: string;
  readonly conclusion: string;
  readonly hasDicomSeries: boolean;
}

const mapDbModality = (mod?: string): { modType: ModalityType; modName: string } => {
  if (!mod) return { modType: 'ct', modName: 'CT' };
  const m = mod.toLowerCase();
  if (m.includes('mri')) return { modType: 'mri', modName: 'MRI 3.0T' };
  if (m.includes('ct')) return { modType: 'ct', modName: 'CT 128 lát' };
  if (m.includes('xq') || m.includes('xray')) return { modType: 'xray', modName: 'X-quang KTS' };
  if (m.includes('sa') || m.includes('siêu âm')) return { modType: 'ultrasound', modName: 'Siêu âm màu' };
  return { modType: 'ct', modName: mod.toUpperCase() };
};

const INITIAL_STUDIES: readonly ImagingStudyItem[] = Object.freeze([
  {
    id: 'img-01',
    title: 'MRI gan có tiêm thuốc đối quang từ',
    facility: 'Bệnh viện K Tân Triều',
    studyDate: '08/10/2026',
    modality: 'mri',
    modalityName: 'MRI 3.0T',
    bodyPart: 'Ổ bụng / Gan',
    conclusion: 'Tổn thương hạ phân thùy VI (22mm), đáp ứng một phần (PR theo RECIST 1.1)',
    hasDicomSeries: true,
  },
  {
    id: 'img-02',
    title: 'CT ngực độ phân giải cao HRCT',
    facility: 'Bệnh viện Phổi Trung ương',
    studyDate: '12/06/2026',
    modality: 'ct',
    modalityName: 'CT 128 lát',
    bodyPart: 'Lồng ngực',
    conclusion: 'Nốt mờ đơn độc 4mm thùy trên phổi phải, không biến đổi kích thước',
    hasDicomSeries: true,
  },
  {
    id: 'img-03',
    title: 'Siêu âm Doppler tim màu',
    facility: 'Viện Tim mạch Quốc gia',
    studyDate: '05/03/2026',
    modality: 'ultrasound',
    modalityName: 'Siêu âm màu',
    bodyPart: 'Tim',
    conclusion: 'Chức năng tâm thu thất trái bảo tồn, EF = 62%',
    hasDicomSeries: false,
  },
]);

export function useImagingLogic(memberId = 'me') {
  const [selectedModality, setSelectedModality] = useState<ModalityType>('all');
  const [studies, setStudies] = useState<readonly ImagingStudyItem[]>(INITIAL_STUDIES);
  const [loading, setLoading] = useState(false);

  const fetchStudies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/clinical-reports/${memberId}?kind=imaging`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          const mapped: ImagingStudyItem[] = json.data.map((r: any) => {
            const { modType, modName } = mapDbModality(r.category || r.title);
            return {
              id: r.id,
              title: r.title || 'Báo cáo chẩn đoán hình ảnh',
              facility: r.facility_name || 'Cơ sở y tế',
              studyDate: r.performed_at ? new Date(r.performed_at).toLocaleDateString('vi-VN') : '20/10/2026',
              modality: modType,
              modalityName: modName,
              bodyPart: r.body_site || 'Ổ bụng',
              conclusion: r.conclusion || 'Theo dõi định kỳ',
              hasDicomSeries: Boolean(r.attachment_s3_key),
            };
          });
          setStudies(mapped);
        }
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudies();
  }, [memberId]);

  const filteredStudies = useMemo(() => {
    if (selectedModality === 'all') return studies;
    return studies.filter((s) => s.modality === selectedModality);
  }, [studies, selectedModality]);

  return {
    selectedModality,
    setSelectedModality,
    studies,
    filteredStudies,
    loading,
    refetch: fetchStudies,
  };
}
