import { describe, it, expect } from 'vitest';
import {
  classifyBloodPressure,
  classifySpO2,
  classifyHeartRate,
  calculateAdherenceRate,
} from './biometric-evaluator.service';

describe('BiometricEvaluatorService - classifyBloodPressure (TDD)', () => {
  // 1. HAPPY PATH & AHA/ESC MEDICAL LOGIC
  it('phân loại đúng Huyết áp bình thường (<120 và <80)', () => {
    const res = classifyBloodPressure(115, 75);
    expect(res.category).toBe('normal');
    expect(res.severity).toBe('normal');
    expect(res.label).toBe('Bình thường');
  });

  it('phân loại đúng Tiền tăng huyết áp (120-129 và <80)', () => {
    const res = classifyBloodPressure(125, 78);
    expect(res.category).toBe('elevated');
    expect(res.severity).toBe('warning');
    expect(res.label).toBe('Tiền tăng HA');
  });

  it('phân loại đúng Tăng HA Độ 1 (130-139 hoặc 80-89)', () => {
    const res = classifyBloodPressure(135, 85);
    expect(res.category).toBe('stage_1');
    expect(res.severity).toBe('warning');
    expect(res.label).toBe('Tăng HA Độ 1');
  });

  it('phân loại đúng Tăng HA Độ 2 (>=140 hoặc >=90)', () => {
    const res = classifyBloodPressure(145, 92);
    expect(res.category).toBe('stage_2');
    expect(res.severity).toBe('danger');
    expect(res.label).toBe('Tăng HA Độ 2');
  });

  it('phân loại đúng Cơn tăng huyết áp khẩn cấp (>180 hoặc >120)', () => {
    const res = classifyBloodPressure(185, 110);
    expect(res.category).toBe('crisis');
    expect(res.severity).toBe('danger');
    expect(res.label).toBe('Cơn tăng HA khẩn cấp');
  });

  // 2. BOUNDARY CASES
  it('xử lý chính xác giá trị biên: đúng 120/80 (ngưỡng chuyển giao)', () => {
    const res = classifyBloodPressure(120, 80);
    expect(res.category).toBe('stage_1'); // diastolic = 80 -> Stage 1
  });

  // 3. ERROR & EXCEPTION HANDLING
  it('ném ngoại lệ khi giá trị âm hoặc vượt ngưỡng sinh lý người (>300 mmHg)', () => {
    expect(() => classifyBloodPressure(-10, 80)).toThrow('Giá trị huyết áp không hợp lệ');
    expect(() => classifyBloodPressure(120, -5)).toThrow('Giá trị huyết áp không hợp lệ');
    expect(() => classifyBloodPressure(350, 80)).toThrow('Giá trị huyết áp không hợp lệ');
    expect(() => classifyBloodPressure(NaN, 80)).toThrow('Giá trị huyết áp không hợp lệ');
  });
});

describe('BiometricEvaluatorService - classifySpO2 (TDD)', () => {
  it('phân loại đúng SpO2 bình thường (>=95%)', () => {
    const res = classifySpO2(98);
    expect(res.category).toBe('normal');
    expect(res.severity).toBe('normal');
    expect(res.label).toBe('Bình thường');
  });

  it('phân loại đúng Thiếu oxy nhẹ (90-94%)', () => {
    const res = classifySpO2(92);
    expect(res.category).toBe('mild_hypoxemia');
    expect(res.severity).toBe('warning');
    expect(res.label).toBe('Thiếu oxy máu');
  });

  it('phân loại đúng Suy hô hấp nguy hiểm (<90%)', () => {
    const res = classifySpO2(88);
    expect(res.category).toBe('severe_hypoxemia');
    expect(res.severity).toBe('danger');
    expect(res.label).toBe('Thiếu oxy nghiêm trọng');
  });

  it('xử lý biên chính xác: 95% và 90%', () => {
    expect(classifySpO2(95).category).toBe('normal');
    expect(classifySpO2(90).category).toBe('mild_hypoxemia');
  });

  it('ném ngoại lệ khi giá trị âm, >100% hoặc NaN', () => {
    expect(() => classifySpO2(-1)).toThrow('Giá trị SpO2 không hợp lệ');
    expect(() => classifySpO2(101)).toThrow('Giá trị SpO2 không hợp lệ');
    expect(() => classifySpO2(NaN)).toThrow('Giá trị SpO2 không hợp lệ');
  });
});

describe('BiometricEvaluatorService - classifyHeartRate (TDD)', () => {
  it('phân loại đúng Nhịp tim bình thường (60-100 bpm)', () => {
    const res = classifyHeartRate(75);
    expect(res.category).toBe('normal');
    expect(res.severity).toBe('normal');
    expect(res.label).toBe('Bình thường');
  });

  it('phân loại đúng Nhịp tim chậm (<60 bpm)', () => {
    const res = classifyHeartRate(54);
    expect(res.category).toBe('bradycardia');
    expect(res.severity).toBe('warning');
    expect(res.label).toBe('Nhịp chậm');
  });

  it('phân loại đúng Nhịp tim nhanh (>100 bpm)', () => {
    const res = classifyHeartRate(112);
    expect(res.category).toBe('tachycardia');
    expect(res.severity).toBe('warning');
    expect(res.label).toBe('Nhịp nhanh');
  });

  it('phân loại nguy hiểm khi nhịp nhanh kịch phát (>140 bpm)', () => {
    const res = classifyHeartRate(155);
    expect(res.category).toBe('extreme_tachycardia');
    expect(res.severity).toBe('danger');
    expect(res.label).toBe('Nhịp nhanh nguy hiểm');
  });

  it('xử lý biên chính xác: 60 và 100 bpm', () => {
    expect(classifyHeartRate(60).category).toBe('normal');
    expect(classifyHeartRate(100).category).toBe('normal');
  });

  it('ném ngoại lệ khi giá trị âm, 0, >250 hoặc NaN', () => {
    expect(() => classifyHeartRate(0)).toThrow('Giá trị nhịp tim không hợp lệ');
    expect(() => classifyHeartRate(-5)).toThrow('Giá trị nhịp tim không hợp lệ');
    expect(() => classifyHeartRate(280)).toThrow('Giá trị nhịp tim không hợp lệ');
    expect(() => classifyHeartRate(NaN)).toThrow('Giá trị nhịp tim không hợp lệ');
  });
});

describe('BiometricEvaluatorService - calculateAdherenceRate (TDD)', () => {
  it('tính toán chính xác tỷ lệ tuân thủ đơn thuốc (88% cho 22/25 liều)', () => {
    expect(calculateAdherenceRate(25, 22)).toBe(88);
  });

  it('xử lý biên: 0 liều đã uống -> 0%, 100% khi uống đủ', () => {
    expect(calculateAdherenceRate(10, 0)).toBe(0);
    expect(calculateAdherenceRate(10, 10)).toBe(100);
  });

  it('xử lý biên: 0 tổng số liều quy định -> trả về 100%', () => {
    expect(calculateAdherenceRate(0, 0)).toBe(100);
  });

  it('giới hạn tối đa 100% nếu số liều uống vượt quá số lượng kê', () => {
    expect(calculateAdherenceRate(10, 12)).toBe(100);
  });

  it('ném ngoại lệ khi tham số âm hoặc NaN', () => {
    expect(() => calculateAdherenceRate(-5, 2)).toThrow('Tham số số liều thuốc không hợp lệ');
    expect(() => calculateAdherenceRate(10, -1)).toThrow('Tham số số liều thuốc không hợp lệ');
    expect(() => calculateAdherenceRate(NaN, 5)).toThrow('Tham số số liều thuốc không hợp lệ');
  });
});
