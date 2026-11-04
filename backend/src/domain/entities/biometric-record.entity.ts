import { BloodPressure } from '../values/blood-pressure.vo';
import { SpO2 } from '../values/spo2.vo';
import { HeartRate } from '../values/heart-rate.vo';

export type BiometricMeasurement = BloodPressure | SpO2 | HeartRate;

export interface BiometricRecordProps {
  id: string;
  memberId: string;
  measurement: BiometricMeasurement;
  deviceId?: string | null;
  measuredAt?: Date;
}

export class BiometricRecord {
  public readonly id: string;
  public readonly memberId: string;
  public readonly measurement: BiometricMeasurement;
  public readonly deviceId: string | null;
  public readonly measuredAt: Date;

  constructor(props: BiometricRecordProps) {
    if (!props.id || props.id.trim() === '') {
      throw new Error('id không được rỗng');
    }
    if (!props.memberId || props.memberId.trim() === '') {
      throw new Error('memberId không được rỗng');
    }
    if (!props.measurement) {
      throw new Error('measurement không được rỗng');
    }

    this.id = props.id;
    this.memberId = props.memberId;
    this.measurement = props.measurement;
    this.deviceId = props.deviceId ?? null;
    this.measuredAt = props.measuredAt ?? new Date();
    Object.freeze(this);
  }

  public isCritical(): boolean {
    return this.measurement.severity === 'danger';
  }

  public isManualInput(): boolean {
    return this.deviceId === null;
  }
}
