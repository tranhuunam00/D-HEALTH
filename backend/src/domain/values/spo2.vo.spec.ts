import { describe, it, expect } from 'vitest';
import { SpO2 } from './spo2.vo';

describe('SpO2 Value Object (DDD TDD)', () => {
  it('tạo thành công SpO2 hợp lệ và bất biến (Immutable)', () => {
    const s = new SpO2(98);
    expect(s.percentage).toBe(98);
    expect(s.category).toBe('normal');
    expect(Object.isFrozen(s)).toBe(true);
    expect(() => { (s as any).percentage = 99; }).toThrow();
  });

  it('tự động phân loại thiếu oxy nhẹ (90-94%) và nghiêm trọng (<90%)', () => {
    const mild = new SpO2(92);
    expect(mild.category).toBe('mild_hypoxemia');
    expect(mild.severity).toBe('warning');

    const severe = new SpO2(86);
    expect(severe.category).toBe('severe_hypoxemia');
    expect(severe.severity).toBe('danger');
  });

  it('xử lý biên: 100% và 0%', () => {
    expect(new SpO2(100).category).toBe('normal');
    expect(new SpO2(0).category).toBe('severe_hypoxemia');
  });

  it('ném ngoại lệ khi giá trị âm, >100 hoặc NaN', () => {
    expect(() => new SpO2(-1)).toThrow('Giá trị SpO2 không hợp lệ');
    expect(() => new SpO2(105)).toThrow('Giá trị SpO2 không hợp lệ');
    expect(() => new SpO2(NaN)).toThrow('Giá trị SpO2 không hợp lệ');
  });

  it('so sánh bằng nhau theo giá trị (equals)', () => {
    const s1 = new SpO2(98);
    const s2 = new SpO2(98);
    const s3 = new SpO2(97);
    expect(s1.equals(s2)).toBe(true);
    expect(s1.equals(s3)).toBe(false);
  });
});
