export interface FamilyMember {
  id: string;
  user_id: string;
  full_name: string;
  relationship: 'owner' | 'spouse' | 'child' | 'parent' | 'other';
  gender: 'Nam' | 'Nữ' | 'Khác';
  birth_date: string;
  blood_type?: string;
  height_cm?: number;
  weight_kg?: number;
  avatar_url?: string;
  is_above_18: boolean;
  consent_approved: boolean;
}

export interface HealthScore {
  total: number;
  biometrics: number;
  medications: number;
  clinical: number;
  status: 'Xuất sắc' | 'Ổn định' | 'Cần lưu ý' | 'Nguy cơ' | 'Chưa có số đo' | 'Chưa đủ dữ liệu';
}
