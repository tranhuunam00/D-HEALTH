import { describe, it, expect } from 'vitest';
import { HeartRate } from './heart-rate.vo';

describe('HeartRate Value Object (DDD TDD)', () => {
  it('tạo thành công HeartRate hợp lệ và bất biến (Immutable)', () => {
    const hr = new HeartRate(72);
    expect(hr.bpm).toBe(72);
    expect(hr.category).toBe('normal');
    expect(Object.isFrozen(hr)).toBe(true);
    expect(() => { (hr as any).bpm = 80; }).toThrow();
  });

  it('tự động phân loại nhịp chậm (<60) và nhịp nhanh (>100)', () => {
    const brady = new HeartRate(52);
    expect(brady.category).toBe('bradycardia');
    expect(brady.severity).toBe('warning');

    const tachy = new HeartRate(115);
    expect(tachy.category).toBe('tachycardia');
    expect(tachy.severity).toBe('warning');

    const extreme = new HeartRate(150);
    expect(extreme.category).toBe('extreme_tachycardia');
    expect(extreme.severity).toBe('danger');
  });

  it('ném ngoại lệ khi giá trị <= 0, > 250 hoặc NaN', () => {
    expect(() => new HeartRate(0)).toThrow('Giá trị nhịp tim không hợp lệ');
    expect(() => new HeartRate(-10)).toThrow('Giá trị nhịp tim không hợp lệ');
    expect(() => new HeartRate(300)).toThrow('Giá trị nhịp tim không hợp lệ');
    expect(() => new HeartRate(NaN)).toThrow('Giá trị nhịp tim không hợp lệ');
  });

  it('hỗ trợ kiểm tra bằng nhau theo giá trị (equals)', () => {
    const hr1 = new HeartRate(75);
    const hr2 = new HeartRate(75);
    const hr3 = new HeartRate(80);
    expect(hr1.equals(hr2)).toBe(true);
    expect(hr1.equals(hr3)).toBe(false);
  });
});
