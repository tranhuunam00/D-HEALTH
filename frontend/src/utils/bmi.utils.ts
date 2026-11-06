export interface BmiClassification {
  readonly label: string;
  readonly tier: string;
  readonly color: string;
  readonly bgColor: string;
  readonly badgeClass: string;
}

/**
 * Phân loại chỉ số BMI theo thang đo lâm sàng 8 mức chuẩn y tế:
 * - BMI < 16: Gầy độ III
 * - 16 <= BMI < 17: Gầy độ II
 * - 17 <= BMI < 18.5: Gầy độ I
 * - 18.5 <= BMI < 25: Bình thường
 * - 25 <= BMI < 30: Thừa cân
 * - 30 <= BMI < 35: Béo phì độ 1
 * - 35 <= BMI < 40: Béo phì độ II
 * - BMI >= 40: Béo phì độ III
 */
export function classifyBmi(val: number | string | null | undefined): BmiClassification {
  const bmi = typeof val === 'string' ? parseFloat(val.replace(',', '.')) : Number(val);

  if (isNaN(bmi) || bmi <= 0) {
    return {
      label: 'Chưa đủ dữ liệu',
      tier: 'unknown',
      color: 'text-slate-500',
      bgColor: 'bg-slate-50',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    };
  }

  if (bmi < 16) {
    return {
      label: 'Gầy độ III',
      tier: 'severe_thinness',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    };
  }

  if (bmi < 17) {
    return {
      label: 'Gầy độ II',
      tier: 'moderate_thinness',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
    };
  }

  if (bmi < 18.5) {
    return {
      label: 'Gầy độ I',
      tier: 'mild_thinness',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    };
  }

  if (bmi < 25) {
    return {
      label: 'Bình thường',
      tier: 'normal',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
  }

  if (bmi < 30) {
    return {
      label: 'Thừa cân',
      tier: 'overweight',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    };
  }

  if (bmi < 35) {
    return {
      label: 'Béo phì độ 1',
      tier: 'obese_1',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
    };
  }

  if (bmi < 40) {
    return {
      label: 'Béo phì độ II',
      tier: 'obese_2',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    };
  }

  return {
    label: 'Béo phì độ III',
    tier: 'obese_3',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
  };
}

