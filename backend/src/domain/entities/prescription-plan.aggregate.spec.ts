import { describe, it, expect } from 'vitest';
import { PrescriptionPlan, DoseScheduleItem } from './prescription-plan.aggregate';

describe('PrescriptionPlan Aggregate Root (DDD TDD)', () => {
  const initialSchedules: DoseScheduleItem[] = [
    { id: 'dose_1', medName: 'Metformin 500mg', timeSlot: 'morning', isTaken: true },
    { id: 'dose_2', medName: 'Amlodipine 5mg', timeSlot: 'morning', isTaken: true },
    { id: 'dose_3', medName: 'Metformin 500mg', timeSlot: 'night', isTaken: false },
  ];

  it('tạo thành công Aggregate PrescriptionPlan và tính tỷ lệ tuân thủ ban đầu', () => {
    const plan = new PrescriptionPlan({
      id: 'plan_01',
      memberId: 'mem_01',
      doctorName: 'BS. Lê Thị Hương',
      schedules: initialSchedules,
    });

    expect(plan.id).toBe('plan_01');
    expect(plan.doctorName).toBe('BS. Lê Thị Hương');
    expect(plan.getSchedules().length).toBe(3);
    // 2/3 doses taken = 67%
    expect(plan.calculateAdherence()).toBe(67);
  });

  it('cập nhật trạng thái liều thuốc đã uống (markDoseTaken) và tái tính tỷ lệ tuân thủ lên 100%', () => {
    const plan = new PrescriptionPlan({
      id: 'plan_01',
      memberId: 'mem_01',
      doctorName: 'BS. Lê Thị Hương',
      schedules: initialSchedules,
    });

    plan.markDoseTaken('dose_3', new Date());

    const updated = plan.getSchedules().find((s) => s.id === 'dose_3');
    expect(updated?.isTaken).toBe(true);
    expect(plan.calculateAdherence()).toBe(100);
  });

  it('ném ngoại lệ khi liều thuốc đã được đánh dấu uống trước đó (Domain Invariant)', () => {
    const plan = new PrescriptionPlan({
      id: 'plan_01',
      memberId: 'mem_01',
      doctorName: 'BS. Lê Thị Hương',
      schedules: initialSchedules,
    });

    expect(() => plan.markDoseTaken('dose_1', new Date())).toThrow('Liều thuốc này đã được ghi nhận uống');
  });

  it('ném ngoại lệ khi mã liều thuốc không tồn tại trong đơn', () => {
    const plan = new PrescriptionPlan({
      id: 'plan_01',
      memberId: 'mem_01',
      doctorName: 'BS. Lê Thị Hương',
      schedules: initialSchedules,
    });

    expect(() => plan.markDoseTaken('dose_non_existent', new Date())).toThrow('Không tìm thấy liều thuốc');
  });
});
