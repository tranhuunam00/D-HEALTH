import { describe, it, expect } from 'vitest';
import { BloodPressure } from './blood-pressure.vo';

describe('BloodPressure Value Object (DDD TDD)', () => {
  // 1. INPUT & BOUNDARY
  it('tạo thành công đối tượng BloodPressure hợp lệ và bất biến (Immutable)', () => {
    const bp = new BloodPressure(118, 76);
    expect(bp.systolic).toBe(118);
    expect(bp.diastolic).toBe(76);
    expect(Object.isFrozen(bp)).toBe(true);
    // Immutability check
    expect(() => { (bp as any).systolic = 130; }).toThrow();
  });

  it('tự động thẩm định phân loại theo chuẩn AHA/ESC (Self-Validating)', () => {
    const normal = new BloodPressure(115, 75);
    expect(normal.category).toBe('normal');
    expect(normal.severity).toBe('normal');

    const stage1 = new BloodPressure(135, 85);
    expect(stage1.category).toBe('stage_1');
    expect(stage1.severity).toBe('warning');

    const stage2 = new BloodPressure(145, 92);
    expect(stage2.category).toBe('stage_2');
    expect(stage2.severity).toBe('danger');
  });

  it('xử lý giá trị biên: đúng 120/80', () => {
    const bp = new BloodPressure(120, 80);
    expect(bp.category).toBe('stage_1');
  });

  // 2. ERROR & EXCEPTIONS
  it('ném ngoại lệ khi giá trị âm, vượt quá 300 hoặc NaN (Self-Validating Invariant)', () => {
    expect(() => new BloodPressure(-10, 80)).toThrow('Giá trị huyết áp không hợp lệ');
    expect(() => new BloodPressure(120, -5)).toThrow('Giá trị huyết áp không hợp lệ');
    expect(() => new BloodPressure(350, 80)).toThrow('Giá trị huyết áp không hợp lệ');
    expect(() => new BloodPressure(NaN, 80)).toThrow('Giá trị huyết áp không hợp lệ');
  });

  // 3. EQUALITY CHECK
  it('so sánh bằng theo giá trị thay vì tham chiếu (Value Object Equality)', () => {
    const bp1 = new BloodPressure(120, 80);
    const bp2 = new BloodPressure(120, 80);
    const bp3 = new BloodPressure(130, 85);
    expect(bp1.equals(bp2)).toBe(true);
    expect(bp1.equals(bp3)).toBe(false);
  });
});
