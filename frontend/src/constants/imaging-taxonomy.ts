export interface LesionTypeDefinition {
  readonly id: string;
  readonly name: string;
  readonly isMeasurable: boolean;
  readonly isRecistApplicable: boolean;
  readonly classificationSystem?: 'RECIST1.1' | 'BI-RADS' | 'TI-RADS' | 'PI-RADS' | 'NONE';
  readonly lateralityAllowed?: boolean;
}

export interface BodyPartDefinition {
  readonly id: string;
  readonly name: string;
  readonly hasLaterality?: boolean;
  readonly lateralityOptions?: readonly string[];
  readonly lesionTypes: readonly LesionTypeDefinition[];
}

export interface ModalityDefinition {
  readonly id: string;
  readonly code: 'CT' | 'MRI' | 'SA' | 'MM' | 'XQ';
  readonly name: string;
  readonly bodyParts: readonly BodyPartDefinition[];
}

export const IMAGING_TAXONOMY: readonly ModalityDefinition[] = Object.freeze([
  {
    id: 'CT',
    code: 'CT',
    name: 'Cắt lớp vi tính (CT)',
    bodyParts: [
      {
        id: 'liver',
        name: 'Gan · Ổ bụng',
        hasLaterality: false,
        lesionTypes: [
          { id: 'solid_tumor', name: 'Khối u gan đặc (HCC / Di căn)', isMeasurable: true, isRecistApplicable: true, lateralityAllowed: false, classificationSystem: 'RECIST1.1' },
          { id: 'cyst', name: 'Nang gan (U nang)', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: false, classificationSystem: 'NONE' },
          { id: 'hemangioma', name: 'U máu gan (Hemangioma)', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: false, classificationSystem: 'NONE' },
        ],
      },
      {
        id: 'lung',
        name: 'Phổi · Lồng ngực',
        hasLaterality: true,
        lateralityOptions: ['Phổi phải', 'Phổi trái', 'Cả hai bên'],
        lesionTypes: [
          { id: 'solid_nodule', name: 'Khối u phổi / Nốt đặc', isMeasurable: true, isRecistApplicable: true, lateralityAllowed: true, classificationSystem: 'RECIST1.1' },
          { id: 'ggo_nodule', name: 'Nốt kính mờ (GGO)', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'NONE' },
          { id: 'mediastinal_lymph', name: 'Hạch trung thất (đo trục ngắn)', isMeasurable: true, isRecistApplicable: true, lateralityAllowed: false, classificationSystem: 'RECIST1.1' },
        ],
      },
      {
        id: 'kidney',
        name: 'Thận · Tiết niệu',
        hasLaterality: true,
        lateralityOptions: ['Thận phải', 'Thận trái', 'Cả hai bên'],
        lesionTypes: [
          { id: 'kidney_tumor', name: 'Khối u thận đặc (RCC)', isMeasurable: true, isRecistApplicable: true, lateralityAllowed: true, classificationSystem: 'RECIST1.1' },
          { id: 'kidney_cyst', name: 'Nang thận (Bosniak)', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'NONE' },
        ],
      },
      {
        id: 'brain',
        name: 'Sọ não',
        hasLaterality: true,
        lateralityOptions: ['Bán cầu phải', 'Bán cầu trái', 'Đường giữa / Thân não'],
        lesionTypes: [
          { id: 'brain_tumor', name: 'Khối u não / Choán chỗ', isMeasurable: true, isRecistApplicable: true, lateralityAllowed: true, classificationSystem: 'RECIST1.1' },
          { id: 'meningioma', name: 'U màng não', isMeasurable: true, isRecistApplicable: true, lateralityAllowed: true, classificationSystem: 'RECIST1.1' },
        ],
      },
      {
        id: 'lymph_nodes',
        name: 'Hạch ngoại vi / Ổ bụng',
        hasLaterality: false,
        lesionTypes: [
          { id: 'lymph_target', name: 'Hạch ác tính / Di căn (trục ngắn ≥ 15mm)', isMeasurable: true, isRecistApplicable: true, lateralityAllowed: false, classificationSystem: 'RECIST1.1' },
          { id: 'lymph_reactive', name: 'Hạch viêm phản ứng', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: false, classificationSystem: 'NONE' },
        ],
      },
    ],
  },
  {
    id: 'MRI',
    code: 'MRI',
    name: 'Cộng hưởng từ (MRI)',
    bodyParts: [
      {
        id: 'brain',
        name: 'Sọ não',
        hasLaterality: true,
        lateralityOptions: ['Bán cầu phải', 'Bán cầu trái', 'Đường giữa / Thân não'],
        lesionTypes: [
          { id: 'glioma', name: 'Khối u thần kinh đệm (Glioma)', isMeasurable: true, isRecistApplicable: true, lateralityAllowed: true, classificationSystem: 'RECIST1.1' },
          { id: 'meningioma', name: 'U màng não (Meningioma)', isMeasurable: true, isRecistApplicable: true, lateralityAllowed: true, classificationSystem: 'RECIST1.1' },
          { id: 'pituitary_adenoma', name: 'U tuyến yên', isMeasurable: true, isRecistApplicable: true, lateralityAllowed: false, classificationSystem: 'RECIST1.1' },
        ],
      },
      {
        id: 'spine',
        name: 'Cột sống · Tủy sống',
        hasLaterality: true,
        lateralityOptions: ['Đoạn Cổ (C)', 'Đoạn Ngực (T)', 'Đoạn Thắt lưng (L)', 'Cùng cụt (S)'],
        lesionTypes: [
          { id: 'spinal_tumor', name: 'Khối u tủy sống / Thần kinh', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: false, classificationSystem: 'NONE' },
          { id: 'herniation', name: 'Thoát vị đĩa đệm chèn ép', isMeasurable: false, isRecistApplicable: false, lateralityAllowed: false, classificationSystem: 'NONE' },
        ],
      },
      {
        id: 'liver',
        name: 'Gan mật',
        hasLaterality: false,
        lesionTypes: [
          { id: 'liver_hcc', name: 'Khối u gan đặc (HCC / Di căn)', isMeasurable: true, isRecistApplicable: true, lateralityAllowed: false, classificationSystem: 'RECIST1.1' },
          { id: 'cholangiocarcinoma', name: 'U đường mật', isMeasurable: true, isRecistApplicable: true, lateralityAllowed: false, classificationSystem: 'RECIST1.1' },
        ],
      },
      {
        id: 'pelvis',
        name: 'Tiểu khung (Tử cung / Tiền liệt tuyến)',
        hasLaterality: false,
        lesionTypes: [
          { id: 'prostate_tumor', name: 'Khối u tiền liệt tuyến (PI-RADS)', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: false, classificationSystem: 'PI-RADS' },
          { id: 'uterine_fibroid', name: 'U xơ tử cung', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: false, classificationSystem: 'NONE' },
          { id: 'ovarian_tumor', name: 'U nang / Khối u buồng trứng', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'NONE' },
        ],
      },
      {
        id: 'breast',
        name: 'Tuyến vú (MRI Vú)',
        hasLaterality: true,
        lateralityOptions: ['Vú phải', 'Vú trái', 'Cả hai bên'],
        lesionTypes: [
          { id: 'breast_mri_mass', name: 'Khối vú bắt thuốc cản từ (BI-RADS)', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'BI-RADS' },
          { id: 'breast_mri_nme', name: 'Vùng ngấm thuốc không dạng khối (NME)', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'BI-RADS' },
        ],
      },
    ],
  },
  {
    id: 'MM',
    code: 'MM',
    name: 'Nhũ ảnh (Mammography)',
    bodyParts: [
      {
        id: 'breast',
        name: 'Tuyến vú (Vú)',
        hasLaterality: true,
        lateralityOptions: ['Vú phải', 'Vú trái', 'Cả hai bên'],
        lesionTypes: [
          { id: 'mm_mass', name: 'Khối tuyến vú (Mass)', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'BI-RADS' },
          { id: 'mm_calcification', name: 'Cụm vi vôi hóa (Microcalcifications)', isMeasurable: false, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'BI-RADS' },
          { id: 'mm_distortion', name: 'Xáo trộn cấu trúc mô tuyến vú', isMeasurable: false, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'BI-RADS' },
          { id: 'mm_asymmetry', name: 'Bất đối xứng đậm độ mô', isMeasurable: false, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'BI-RADS' },
        ],
      },
      {
        id: 'axillary_lymph',
        name: 'Hạch nách',
        hasLaterality: true,
        lateralityOptions: ['Nách phải', 'Nách trái', 'Cả hai bên'],
        lesionTypes: [
          { id: 'axillary_reactive', name: 'Hạch nách lành tính / dạng xoang', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'NONE' },
          { id: 'axillary_suspicious', name: 'Hạch nách mất cấu trúc rốn hạch', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'BI-RADS' },
        ],
      },
    ],
  },
  {
    id: 'SA',
    code: 'SA',
    name: 'Siêu âm (Ultrasound)',
    bodyParts: [
      {
        id: 'liver_biliary',
        name: 'Ổ bụng (Gan · Mật · Tụy)',
        hasLaterality: false,
        lesionTypes: [
          { id: 'sa_liver_solid', name: 'Khối u gan đặc', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: false, classificationSystem: 'NONE' },
          { id: 'sa_liver_cyst', name: 'Nang gan (Cyst)', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: false, classificationSystem: 'NONE' },
          { id: 'sa_gallstone', name: 'Sỏi túi mật', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: false, classificationSystem: 'NONE' },
        ],
      },
      {
        id: 'thyroid',
        name: 'Tuyến giáp',
        hasLaterality: true,
        lateralityOptions: ['Thùy phải', 'Thùy trái', 'Eo giáp'],
        lesionTypes: [
          { id: 'sa_thyroid_nodule', name: 'Nhân giáp đặc (TI-RADS)', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'TI-RADS' },
          { id: 'sa_thyroid_cyst', name: 'Nang keo tuyến giáp', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'TI-RADS' },
        ],
      },
      {
        id: 'breast',
        name: 'Tuyến vú',
        hasLaterality: true,
        lateralityOptions: ['Vú phải', 'Vú trái', 'Cả hai bên'],
        lesionTypes: [
          { id: 'sa_breast_fibroadenoma', name: 'U tuyến vú (BI-RADS)', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'BI-RADS' },
          { id: 'sa_breast_cyst', name: 'Nang vú đơn thuần', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'BI-RADS' },
        ],
      },
      {
        id: 'kidney_urinary',
        name: 'Thận · Bàng quang',
        hasLaterality: true,
        lateralityOptions: ['Thận phải', 'Thận trái', 'Bàng quang (ở giữa)'],
        lesionTypes: [
          { id: 'sa_kidney_stone', name: 'Sỏi thận / Sỏi bàng quang', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'NONE' },
          { id: 'sa_kidney_cyst', name: 'Nang thận', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'NONE' },
        ],
      },
    ],
  },
  {
    id: 'XQ',
    code: 'XQ',
    name: 'X-quang (X-Ray)',
    bodyParts: [
      {
        id: 'chest',
        name: 'Phổi · Lồng ngực',
        hasLaterality: true,
        lateralityOptions: ['Phổi phải', 'Phổi trái', 'Cả hai bên'],
        lesionTypes: [
          { id: 'xq_nodule', name: 'Nốt mờ / Khối mờ phổi', isMeasurable: true, isRecistApplicable: true, lateralityAllowed: true, classificationSystem: 'RECIST1.1' },
          { id: 'xq_infiltration', name: 'Đám thâm nhiễm phổi', isMeasurable: false, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'NONE' },
          { id: 'xq_effusion', name: 'Tràn dịch màng phổi', isMeasurable: false, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'NONE' },
        ],
      },
      {
        id: 'bone_joint',
        name: 'Xương khớp · Cột sống',
        hasLaterality: true,
        lateralityOptions: ['Bên phải', 'Bên trái', 'Cột sống (ở giữa)'],
        lesionTypes: [
          { id: 'xq_fracture', name: 'Gãy xương / Rạn xương', isMeasurable: false, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'NONE' },
          { id: 'xq_bone_lesion', name: 'Tổn thương tiêu xương / Tiêu hủy xương', isMeasurable: true, isRecistApplicable: false, lateralityAllowed: true, classificationSystem: 'NONE' },
          { id: 'xq_degeneration', name: 'Thoái hóa khớp / Cột sống', isMeasurable: false, isRecistApplicable: false, lateralityAllowed: false, classificationSystem: 'NONE' },
        ],
      },
    ],
  },
]);

export function getModalityTaxonomy(modalityCode: string): ModalityDefinition | undefined {
  const norm = (modalityCode || '').toUpperCase().trim();
  return IMAGING_TAXONOMY.find((m) => m.code === norm || m.id === norm);
}

export function getBodyPartsForModality(modalityCode: string): readonly BodyPartDefinition[] {
  const mod = getModalityTaxonomy(modalityCode);
  return mod ? mod.bodyParts : [];
}

export function getLesionTypesForBodyPart(modalityCode: string, bodyPartNameOrId: string): readonly LesionTypeDefinition[] {
  const bodyParts = getBodyPartsForModality(modalityCode);
  const part = bodyParts.find((p) => p.id === bodyPartNameOrId || p.name === bodyPartNameOrId);
  return part ? part.lesionTypes : [];
}

export function getLateralityOptionsForBodyPart(modalityCode: string, bodyPartNameOrId: string): readonly string[] | null {
  const bodyParts = getBodyPartsForModality(modalityCode);
  const part = bodyParts.find((p) => p.id === bodyPartNameOrId || p.name === bodyPartNameOrId);
  if (!part) return null;
  if (part.hasLaterality === false) return null;
  return part.lateralityOptions || ['Bên phải', 'Bên trái', 'Cả hai bên'];
}
