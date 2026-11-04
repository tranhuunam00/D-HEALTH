import { describe, it, expect } from 'vitest';
import { BiometricRecord } from './biometric-record.entity';
import { BloodPressure } from '../values/blood-pressure.vo';
import { SpO2 } from '../values/spo2.vo';

describe('BiometricRecord Entity (DDD TDD)', () => {
  it('tạo thành công thực thể BiometricRecord với Value Object đo lường', () => {
    const bp = new BloodPressure(118, 76);
    const rec = new BiometricRecord({
      id: 'rec_01',
      memberId: 'mem_01',
      measurement: bp,
      deviceId: 'dev_omron',
      measuredAt: new Date('2026-11-04T08:00:00Z'),
    });

    expect(rec.id).toBe('rec_01');
    expect(rec.memberId).toBe('mem_01');
    expect(rec.isCritical()).toBe(false);
    expect(rec.isManualInput()).toBe(false);
  });

  it('nhận diện chính xác trạng thái nguy kịch (isCritical) khi huyết áp vào cơn khẩn cấp', () => {
    const crisisBp = new BloodPressure(190, 115);
    const rec = new BiometricRecord({
      id: 'rec_02',
      memberId: 'mem_01',
      measurement: crisisBp,
      deviceId: null,
      measuredAt: new Date(),
    });

    expect(rec.isCritical()).toBe(true);
    expect(rec.isManualInput()).toBe(true);
  });

  it('nhận diện chính xác trạng thái nguy kịch khi SpO2 suy hô hấp nặng (<90%)', () => {
    const lowSpo2 = new SpO2(85);
    const rec = new BiometricRecord({
      id: 'rec_03',
      memberId: 'mem_01',
      measurement: lowSpo2,
      deviceId: 'dev_beurer',
      measuredAt: new Date(),
    });

    expect(rec.isCritical()).toBe(true);
  });

  it('ném ngoại lệ khi thiếu id hoặc memberId hoặc measurement (Domain Invariant)', () => {
    const bp = new BloodPressure(120, 80);
    expect(() => new BiometricRecord({ id: '', memberId: 'mem_1', measurement: bp })).toThrow('id không được rỗng');
    expect(() => new BiometricRecord({ id: 'rec_1', memberId: '', measurement: bp })).toThrow('memberId không được rỗng');
    expect(() => new BiometricRecord({ id: 'rec_1', memberId: 'mem_1', measurement: null as any })).toThrow('measurement không được rỗng');
  });
});
