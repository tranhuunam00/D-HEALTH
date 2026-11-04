import { classifyHeartRate, BiometricEvaluationResult } from '../../application/services/biometric-evaluator.service';

export class HeartRate {
  public readonly bpm: number;
  public readonly evaluation: BiometricEvaluationResult;

  constructor(bpm: number) {
    if (isNaN(bpm) || bpm <= 0 || bpm > 250) {
      throw new Error('Giá trị nhịp tim không hợp lệ (ngưỡng 1 - 250 bpm)');
    }
    this.bpm = bpm;
    this.evaluation = classifyHeartRate(bpm);
    Object.freeze(this);
  }

  get category(): string {
    return this.evaluation.category;
  }

  get severity(): 'normal' | 'warning' | 'danger' {
    return this.evaluation.severity;
  }

  get label(): string {
    return this.evaluation.label;
  }

  public equals(other: HeartRate): boolean {
    if (!(other instanceof HeartRate)) return false;
    return this.bpm === other.bpm;
  }
}
