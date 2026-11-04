import { classifyBloodPressure, BiometricEvaluationResult } from '../../application/services/biometric-evaluator.service';

export class BloodPressure {
  public readonly systolic: number;
  public readonly diastolic: number;
  public readonly evaluation: BiometricEvaluationResult;

  constructor(systolic: number, diastolic: number) {
    if (isNaN(systolic) || isNaN(diastolic) || systolic <= 0 || diastolic <= 0 || systolic > 300 || diastolic > 200) {
      throw new Error('Giá trị huyết áp không hợp lệ');
    }
    this.systolic = systolic;
    this.diastolic = diastolic;
    this.evaluation = classifyBloodPressure(systolic, diastolic);
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

  public equals(other: BloodPressure): boolean {
    if (!(other instanceof BloodPressure)) return false;
    return this.systolic === other.systolic && this.diastolic === other.diastolic;
  }
}
