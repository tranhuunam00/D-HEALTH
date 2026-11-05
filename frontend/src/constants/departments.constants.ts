export interface ClinicalDepartment {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly shortName: string;
  readonly iconName: string;
  readonly color: 'pink' | 'purple' | 'mint' | 'amber' | 'blue' | 'rose' | 'slate';
  readonly description: string;
}

export const CLINICAL_DEPARTMENTS: readonly ClinicalDepartment[] = [
  {
    id: 'tim_mach',
    code: 'TM',
    name: 'Khoa Tim Mạch',
    shortName: 'Tim mạch',
    iconName: 'heart',
    color: 'pink',
    description: 'Khám, theo dõi và điều trị tăng huyết áp, suy tim, bệnh mạch vành',
  },
  {
    id: 'noi_tiet',
    code: 'NT',
    name: 'Khoa Nội Tiết - Đái Tháo Đường',
    shortName: 'Nội tiết',
    iconName: 'activity',
    color: 'mint',
    description: 'Quản lý đái tháo đường Type 1/Type 2, rối loạn chuyển hóa lipid máu',
  },
  {
    id: 'cdha',
    code: 'CĐ',
    name: 'Khoa Chẩn Đoán Hình Ảnh',
    shortName: 'CĐHA',
    iconName: 'camera',
    color: 'purple',
    description: 'Chụp MRI 1.5T/3.0T, CT Scanner, X-Quang, siêu âm Doppler màu',
  },
  {
    id: 'ung_buou',
    code: 'UB',
    name: 'Khoa Ung Bướu & Gan Mật',
    shortName: 'Ung bướu',
    iconName: 'shield',
    color: 'rose',
    description: 'Chẩn đoán u bướu, theo dõi khối u đặc theo chuẩn RECIST 1.1',
  },
  {
    id: 'y_hoc_gia_dinh',
    code: 'GD',
    name: 'Bác sĩ Gia Đình & CSSKBĐ',
    shortName: 'Gia đình',
    iconName: 'user-check',
    color: 'blue',
    description: 'Bác sĩ gia đình chăm sóc sức khỏe chủ động và theo dõi hồ sơ y tế',
  },
  {
    id: 'gpb',
    code: 'GP',
    name: 'Khoa Giải Phẫu Bệnh',
    shortName: 'Giải phẫu bệnh',
    iconName: 'microscope',
    color: 'amber',
    description: 'Sinh thiết mô bệnh học, nhuộm hóa mô miễn dịch IHC, giải phẫu tế bào',
  },
  {
    id: 'ho_hap',
    code: 'HH',
    name: 'Khoa Hô Hấp & Phổi',
    shortName: 'Hô hấp',
    iconName: 'wind',
    color: 'blue',
    description: 'Bệnh lý hô hấp, hen phế quản, COPD, viêm phổi',
  },
  {
    id: 'tieu_hoa',
    code: 'TH',
    name: 'Khoa Tiêu Hóa',
    shortName: 'Tiêu hóa',
    iconName: 'utensils',
    color: 'amber',
    description: 'Bệnh lý dạ dày, đại tràng, gan mật tụy',
  },
  {
    id: 'than_kinh',
    code: 'TK',
    name: 'Khoa Thần Kinh',
    shortName: 'Thần kinh',
    iconName: 'brain',
    color: 'purple',
    description: 'Bệnh lý thần kinh, đột quỵ, đau đầu, rối loạn giấc ngủ',
  },
  {
    id: 'co_xuong_khop',
    code: 'CK',
    name: 'Khoa Cơ Xương Khớp',
    shortName: 'Cơ xương khớp',
    iconName: 'bone',
    color: 'slate',
    description: 'Thoái hóa khớp, loãng xương, viêm khớp dạng thấp, gout',
  },
];

