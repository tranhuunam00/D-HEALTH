import { useState, useMemo } from 'react';

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

export function useImagingLogic() {
  const [selectedModality, setSelectedModality] = useState<ModalityType>('all');
  const [studies] = useState<readonly ImagingStudyItem[]>(INITIAL_STUDIES);

  const filteredStudies = useMemo(() => {
    if (selectedModality === 'all') return studies;
    return studies.filter((s) => s.modality === selectedModality);
  }, [studies, selectedModality]);

  return {
    selectedModality,
    setSelectedModality,
    studies,
    filteredStudies,
  };
}
