export type ClinicalDocKind = 'lab' | 'img' | 'gpb';
export type ClsKind = ClinicalDocKind;
export type InputMethod = 'manual' | 'link' | 'cam';
export type ClassificationCategory = 'HH' | 'SH' | 'VS' | 'PT' | 'DT';

export interface LabMetricRow {
  name: string;
  value: string;
  unit: string;
}

export interface ImagingLesion {
  type: string;
  side: string;
  size: string;
  target: boolean;
  birads?: string;
  tirads?: string;
}

export interface PathologyMarker {
  marker: string;
  result: string;
}

export const CLASSIFICATION_LABELS: Record<ClassificationCategory, string> = {
  HH: 'Huyết học',
  SH: 'Sinh hoá',
  VS: 'Vi sinh',
  PT: 'Sinh học phân tử',
  DT: 'Di truyền',
};

import { LAB_METRICS_INFO as SHARED_LAB_METRICS_INFO } from '../../constants/lab-catalog.constants';

export const LAB_METRICS_INFO: Record<string, [ClassificationCategory, string]> = SHARED_LAB_METRICS_INFO as Record<string, [ClassificationCategory, string]>;

export const ORGAN_OPTIONS = [
  'Gan', 'Phổi', 'Tuyến giáp', 'Hạch', 'Tuyến vú', 'Tim', 'Túi mật',
  'Tuỵ', 'Lách', 'Thận', 'Tuyến thượng thận', 'Bàng quang', 'Tử cung',
  'Buồng trứng', 'Tiền liệt tuyến', 'Tinh hoàn', 'Cột sống', 'Xương khớp',
  'Mạch máu', 'Sọ não', 'other'
] as const;

export const MODALITY_OPTIONS = [
  'CT', 'MRI', 'X-quang', 'Siêu âm', 'Nội soi', 'PET/CT', 'DEXA', 'Khác'
] as const;

export const CONTRAST_OPTIONS = [
  'none', 'with_contrast', 'without_contrast', 'both', 'other'
] as const;

export interface CamField {
  key: string;
  value: string;
  conf: string;
  normal: boolean;
}

export interface CamDoc {
  doc: string;
  fields: CamField[];
}

export const CAM_READINGS: Record<ClinicalDocKind, CamDoc> = {
  lab: {
    doc: 'Phiếu xét nghiệm · 20/10/2026',
    fields: [
      { key: 'HbA1c', value: '6,6 %', conf: '99%', normal: true },
      { key: 'Glucose', value: '6,1 mmol/L', conf: '98%', normal: true },
      { key: 'Creatinin', value: '92 µmol/L', conf: '97%', normal: true },
      { key: 'LDL-C', value: '3,8 mmol/L', conf: 'Cần kiểm tra · 71%', normal: false },
    ],
  },
  img: {
    doc: 'Báo cáo CT ngực · 08/10/2026',
    fields: [
      { key: 'Phương tiện', value: 'CT', conf: '99%', normal: true },
      { key: 'Bộ phận', value: 'Phổi', conf: '98%', normal: true },
      { key: 'Tổn thương', value: 'Khối u đặc · thuỳ trên phải · 7 mm', conf: '84%', normal: false },
      { key: 'Kết luận', value: 'Nốt đặc 7 mm, tăng nhẹ so với 2025', conf: '90%', normal: true },
    ],
  },
  gpb: {
    doc: 'Phiếu giải phẫu bệnh · 25/02/2026',
    fields: [
      { key: 'Bệnh phẩm', value: 'Sinh thiết kim · gan HPT VII', conf: '97%', normal: true },
      { key: 'Chẩn đoán', value: 'Ung thư biểu mô tế bào gan, biệt hoá vừa', conf: '93%', normal: true },
      { key: 'Độ mô học', value: 'G2', conf: '95%', normal: true },
      { key: 'HMMD', value: 'Glypican-3 (+), Ki-67 20%', conf: '81%', normal: false },
    ],
  },
};
