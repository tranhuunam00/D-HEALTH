export interface BiometricEvaluationResult {
  category: string;
  severity: 'normal' | 'warning' | 'danger';
  label: string;
}

export function classifyBloodPressure(sys: number, dia: number): BiometricEvaluationResult {
  if (isNaN(sys) || isNaN(dia) || sys <= 0 || dia <= 0 || sys > 300 || dia > 200) {
    throw new Error('Giá trị huyết áp không hợp lệ');
  }

  if (sys > 180 || dia > 120) {
    return { category: 'crisis', severity: 'danger', label: 'Cơn tăng HA khẩn cấp' };
  }
  if (sys >= 140 || dia >= 90) {
    return { category: 'stage_2', severity: 'danger', label: 'Tăng HA Độ 2' };
  }
  if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
    return { category: 'stage_1', severity: 'warning', label: 'Tăng HA Độ 1' };
  }
  if (sys >= 120 && sys <= 129 && dia < 80) {
    return { category: 'elevated', severity: 'warning', label: 'Tiền tăng HA' };
  }
  return { category: 'normal', severity: 'normal', label: 'Bình thường' };
}

export function classifySpO2(spo2: number): BiometricEvaluationResult {
  if (isNaN(spo2) || spo2 < 0 || spo2 > 100) {
    throw new Error('Giá trị SpO2 không hợp lệ (ngưỡng 0 - 100%)');
  }
  if (spo2 < 90) {
    return { category: 'severe_hypoxemia', severity: 'danger', label: 'Thiếu oxy nghiêm trọng' };
  }
  if (spo2 < 95) {
    return { category: 'mild_hypoxemia', severity: 'warning', label: 'Thiếu oxy máu' };
  }
  return { category: 'normal', severity: 'normal', label: 'Bình thường' };
}

export function classifyHeartRate(bpm: number): BiometricEvaluationResult {
  if (isNaN(bpm) || bpm <= 0 || bpm > 250) {
    throw new Error('Giá trị nhịp tim không hợp lệ (ngưỡng 1 - 250 bpm)');
  }
  if (bpm > 140) {
    return { category: 'extreme_tachycardia', severity: 'danger', label: 'Nhịp nhanh nguy hiểm' };
  }
  if (bpm > 100) {
    return { category: 'tachycardia', severity: 'warning', label: 'Nhịp nhanh' };
  }
  if (bpm < 60) {
    return { category: 'bradycardia', severity: 'warning', label: 'Nhịp chậm' };
  }
  return { category: 'normal', severity: 'normal', label: 'Bình thường' };
}

export function calculateAdherenceRate(totalDoses: number, takenDoses: number): number {
  if (isNaN(totalDoses) || isNaN(takenDoses) || totalDoses < 0 || takenDoses < 0) {
    throw new Error('Tham số số liều thuốc không hợp lệ');
  }
  if (totalDoses === 0) return 100;
  const rate = Math.round((takenDoses / totalDoses) * 100);
  return Math.min(100, Math.max(0, rate));
}

export function classifyBmi(bmi: number): BiometricEvaluationResult {
  if (isNaN(bmi) || bmi <= 0 || bmi > 100) {
    throw new Error('Giá trị BMI không hợp lệ');
  }
  if (bmi < 16) return { category: 'severe_thinness', severity: 'danger', label: 'Gầy độ III' };
  if (bmi < 17) return { category: 'moderate_thinness', severity: 'warning', label: 'Gầy độ II' };
  if (bmi < 18.5) return { category: 'mild_thinness', severity: 'warning', label: 'Gầy độ I' };
  if (bmi < 25) return { category: 'normal', severity: 'normal', label: 'Bình thường' };
  if (bmi < 30) return { category: 'overweight', severity: 'warning', label: 'Thừa cân' };
  if (bmi < 35) return { category: 'obese_1', severity: 'danger', label: 'Béo phì độ 1' };
  if (bmi < 40) return { category: 'obese_2', severity: 'danger', label: 'Béo phì độ II' };
  return { category: 'obese_3', severity: 'danger', label: 'Béo phì độ III' };
}
