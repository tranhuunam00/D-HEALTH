export type BiometricType =
  | 'blood_pressure'
  | 'heart_rate'
  | 'spo2'
  | 'blood_glucose'
  | 'temperature'
  | 'weight'
  | 'bmi';

export interface BiometricRecord {
  id: string;
  member_id: string;
  metric_type: BiometricType;
  value_numeric: number;
  secondary_value?: number; // Huyết áp tâm trương
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  source_type: 'device' | 'manual';
  measured_at: string;
}

export interface ManualVitalsInput {
  systolic?: number;
  diastolic?: number;
  heartRate?: number;
  spo2?: number;
  glucose?: number;
  glucoseContext?: 'fasting' | 'postprandial' | 'random';
  weightKg?: number;
  heightCm?: number;
  temperature?: number;
}
