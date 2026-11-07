/**
 * Master Catalog danh mục chỉ số xét nghiệm y tế chuẩn (LOINC / Bộ Y tế)
 * Dùng chung đồng bộ cho:
 * 1. Form nhập thủ công (Dropdown phân nhóm optgroup)
 * 2. Chip chỉ số cần theo dõi & Biểu đồ xu hướng (Trend Charts)
 * 3. Thuật toán tự động phân nhóm chuyên khoa (Sinh hoá, Huyết học, Vi sinh...)
 */

export type LabSpecialtyCategory = 'SH' | 'HH' | 'VS' | 'PT' | 'DT';

export interface LabTestCatalogItem {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly category: LabSpecialtyCategory;
  readonly categoryLabel: string;
  readonly unit: string;
  readonly normalMin?: number;
  readonly normalMax?: number;
  readonly defaultTracked?: boolean;
  readonly testCodes: readonly string[];
}

export const LAB_TEST_CATALOG: readonly LabTestCatalogItem[] = Object.freeze([
  // 1. Bộ mỡ máu (Lipid Panel)
  {
    id: 'cholesterol',
    name: 'Cholesterol TP',
    code: 'CHOL',
    category: 'SH',
    categoryLabel: 'Sinh hoá',
    unit: 'mmol/L',
    normalMin: 2.8,
    normalMax: 5.2,
    defaultTracked: true,
    testCodes: ['CHOL', 'CHOLESTEROL', 'CHOLESTEROL TOÀN PHẦN', 'CHOLESTEROL TP'],
  },
  {
    id: 'triglyceride',
    name: 'Triglycerid',
    code: 'TRIG',
    category: 'SH',
    categoryLabel: 'Sinh hoá',
    unit: 'mmol/L',
    normalMin: 0.46,
    normalMax: 1.88,
    defaultTracked: true,
    testCodes: ['TRIG', 'TRIGLYCERID', 'TRIGLYCERIDE'],
  },
  {
    id: 'ldlc',
    name: 'LDL-C',
    code: 'LDLC',
    category: 'SH',
    categoryLabel: 'Sinh hoá',
    unit: 'mmol/L',
    normalMin: 0,
    normalMax: 3.4,
    defaultTracked: true,
    testCodes: ['LDL-C', 'LDLC', 'LDL'],
  },
  {
    id: 'hdlc',
    name: 'HDL-C',
    code: 'HDLC',
    category: 'SH',
    categoryLabel: 'Sinh hoá',
    unit: 'mmol/L',
    normalMin: 1.03,
    normalMax: 2.5,
    defaultTracked: false,
    testCodes: ['HDL-C', 'HDLC', 'HDL'],
  },

  // 2. Bộ đường huyết (Glycemic Panel)
  {
    id: 'glucose',
    name: 'Glucose đói',
    code: 'GLU',
    category: 'SH',
    categoryLabel: 'Sinh hoá',
    unit: 'mmol/L',
    normalMin: 3.9,
    normalMax: 6.4,
    defaultTracked: true,
    testCodes: ['GLU', 'GLUCOSE', 'GLUCOSE (ĐÓI)', 'ĐƯỜNG HUYẾT'],
  },
  {
    id: 'hba1c',
    name: 'HbA1c',
    code: 'HBA1C',
    category: 'SH',
    categoryLabel: 'Sinh hoá',
    unit: '%',
    normalMin: 4.0,
    normalMax: 6.0,
    defaultTracked: true,
    testCodes: ['HBA1C', 'A1C'],
  },

  // 3. Bộ chức năng thận (Renal Panel)
  {
    id: 'creatinine',
    name: 'Creatinin',
    code: 'CREA',
    category: 'SH',
    categoryLabel: 'Sinh hoá',
    unit: 'µmol/L',
    normalMin: 53,
    normalMax: 106,
    defaultTracked: true,
    testCodes: ['CREA', 'CREATININ', 'CREATININE'],
  },
  {
    id: 'urea',
    name: 'Ure',
    code: 'UREA',
    category: 'SH',
    categoryLabel: 'Sinh hoá',
    unit: 'mmol/L',
    normalMin: 2.5,
    normalMax: 7.5,
    defaultTracked: false,
    testCodes: ['URE', 'UREA', 'BUN'],
  },
  {
    id: 'uric_acid',
    name: 'Acid Uric',
    code: 'URIC',
    category: 'SH',
    categoryLabel: 'Sinh hoá',
    unit: 'µmol/L',
    normalMin: 200,
    normalMax: 420,
    defaultTracked: false,
    testCodes: ['URIC', 'ACID URIC', 'AXIT URIC'],
  },
  {
    id: 'egfr',
    name: 'eGFR',
    code: 'EGFR',
    category: 'SH',
    categoryLabel: 'Sinh hoá',
    unit: 'mL/min/1.73m²',
    normalMin: 90,
    normalMax: 150,
    defaultTracked: false,
    testCodes: ['EGFR', 'MDRD', 'CKD-EPI'],
  },

  // 4. Bộ chức năng gan (Liver Panel)
  {
    id: 'ast',
    name: 'AST (GOT)',
    code: 'AST',
    category: 'SH',
    categoryLabel: 'Sinh hoá',
    unit: 'U/L',
    normalMin: 0,
    normalMax: 40,
    defaultTracked: false,
    testCodes: ['AST', 'GOT', 'SGOT'],
  },
  {
    id: 'alt',
    name: 'ALT (GPT)',
    code: 'ALT',
    category: 'SH',
    categoryLabel: 'Sinh hoá',
    unit: 'U/L',
    normalMin: 0,
    normalMax: 40,
    defaultTracked: false,
    testCodes: ['ALT', 'GPT', 'SGPT'],
  },
  {
    id: 'ggt',
    name: 'GGT',
    code: 'GGT',
    category: 'SH',
    categoryLabel: 'Sinh hoá',
    unit: 'U/L',
    normalMin: 5,
    normalMax: 50,
    defaultTracked: false,
    testCodes: ['GGT', 'GAMMA-GT'],
  },
  {
    id: 'bilirubin',
    name: 'Bilirubin TP',
    code: 'BILI',
    category: 'SH',
    categoryLabel: 'Sinh hoá',
    unit: 'µmol/L',
    normalMin: 3.4,
    normalMax: 17.1,
    defaultTracked: false,
    testCodes: ['BILI', 'BILIRUBIN', 'BILIRUBIN TOÀN PHẦN', 'BILIRUBIN TP'],
  },

  // 5. Bộ huyết học (Complete Blood Count - CBC)
  {
    id: 'hemoglobin',
    name: 'Hemoglobin (Hb)',
    code: 'HGB',
    category: 'HH',
    categoryLabel: 'Huyết học',
    unit: 'g/L',
    normalMin: 120,
    normalMax: 160,
    defaultTracked: false,
    testCodes: ['HGB', 'HB', 'HEMOGLOBIN'],
  },
  {
    id: 'wbc',
    name: 'Bạch cầu (WBC)',
    code: 'WBC',
    category: 'HH',
    categoryLabel: 'Huyết học',
    unit: 'G/L',
    normalMin: 4.0,
    normalMax: 10.0,
    defaultTracked: false,
    testCodes: ['WBC', 'BẠCH CẦU', 'LEUKOCYTE'],
  },
  {
    id: 'plt',
    name: 'Tiểu cầu (PLT)',
    code: 'PLT',
    category: 'HH',
    categoryLabel: 'Huyết học',
    unit: 'G/L',
    normalMin: 150,
    normalMax: 400,
    defaultTracked: false,
    testCodes: ['PLT', 'TIỂU CẦU', 'PLATELET'],
  },
  {
    id: 'rbc',
    name: 'Hồng cầu (RBC)',
    code: 'RBC',
    category: 'HH',
    categoryLabel: 'Huyết học',
    unit: 'T/L',
    normalMin: 3.8,
    normalMax: 5.5,
    defaultTracked: false,
    testCodes: ['RBC', 'HỒNG CẦU', 'ERYTHROCYTE'],
  },

  // 6. Vi sinh & Miễn dịch
  {
    id: 'hbv_dna',
    name: 'HBV DNA (PCR)',
    code: 'HBV',
    category: 'PT',
    categoryLabel: 'Sinh học phân tử',
    unit: 'IU/mL',
    defaultTracked: false,
    testCodes: ['HBV', 'HBV DNA', 'HBV-DNA'],
  },
  {
    id: 'hbsag',
    name: 'HBsAg',
    code: 'HBSAG',
    category: 'VS',
    categoryLabel: 'Vi sinh',
    unit: 'COI',
    defaultTracked: false,
    testCodes: ['HBSAG', 'HBS AG'],
  },
  {
    id: 'urine_culture',
    name: 'Cấy nước tiểu',
    code: 'URINE_CUL',
    category: 'VS',
    categoryLabel: 'Vi sinh',
    unit: 'CFU/mL',
    defaultTracked: false,
    testCodes: ['CẤY NƯỚC TIỂU', 'URINE CULTURE'],
  },

  // 7. Di truyền
  {
    id: 'cyp2c19',
    name: 'Gen CYP2C19',
    code: 'CYP2C19',
    category: 'DT',
    categoryLabel: 'Di truyền',
    unit: '',
    defaultTracked: false,
    testCodes: ['CYP2C19', 'GEN CYP2C19'],
  },
]);

/**
 * Mapping tương thích ngược cho Camera Input
 */
export const LAB_METRICS_INFO: Record<string, [LabSpecialtyCategory, string]> = Object.fromEntries(
  LAB_TEST_CATALOG.map((item) => [item.name, [item.category, item.unit]])
);

/**
 * Danh sách nhóm phân loại có thứ tự cho Dropdown optgroup
 */
export const LAB_CATALOG_GROUPS = [
  { category: 'SH', label: 'Sinh hoá (Mỡ máu, Đường huyết, Gan, Thận)' },
  { category: 'HH', label: 'Huyết học (Tế bào máu ngoại vi)' },
  { category: 'VS', label: 'Vi sinh & Miễn dịch' },
  { category: 'PT', label: 'Sinh học phân tử' },
  { category: 'DT', label: 'Di truyền học' },
] as const;
