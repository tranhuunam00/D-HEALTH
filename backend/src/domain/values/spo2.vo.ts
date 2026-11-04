import { classifySpO2, BiometricEvaluationResult } from '../../application/services/biometric-evaluator.service';

export class SpO2 {
  public readonly percentage: number;
  public readonly evaluation: BiometricEvaluationResult;

  constructor(percentage: number) {
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      throw new Error('Giá trị SpO2 không hợp lệ (ngưỡng 0 - 100%)');
    }
    this.percentage = percentage;
    this.evaluation = classifySpO2(percentage);
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

  public equals(other: SpO2): boolean {
    if (!(other instanceof SpO2)) return false;
    return this.percentage === other.percentage;
  }
}
