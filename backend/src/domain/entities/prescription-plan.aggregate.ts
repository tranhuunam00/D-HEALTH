import { calculateAdherenceRate } from '../../application/services/biometric-evaluator.service';

export interface DoseScheduleItem {
  id: string;
  medName: string;
  timeSlot: 'morning' | 'noon' | 'night';
  isTaken: boolean;
  takenAt?: Date;
}

export interface PrescriptionPlanProps {
  id: string;
  memberId: string;
  doctorName?: string;
  schedules?: DoseScheduleItem[];
}

export class PrescriptionPlan {
  public readonly id: string;
  public readonly memberId: string;
  public readonly doctorName: string;
  private readonly schedules: DoseScheduleItem[];

  constructor(props: PrescriptionPlanProps) {
    if (!props.id || !props.memberId) {
      throw new Error('Dữ liệu kế hoạch đơn thuốc không hợp lệ');
    }
    this.id = props.id;
    this.memberId = props.memberId;
    this.doctorName = props.doctorName ?? 'Bác sĩ điều trị';
    this.schedules = [...(props.schedules ?? [])];
  }

  public getSchedules(): readonly DoseScheduleItem[] {
    return [...this.schedules];
  }

  public markDoseTaken(doseId: string, takenAt: Date): void {
    const doseIndex = this.schedules.findIndex((s) => s.id === doseId);
    if (doseIndex === -1) {
      throw new Error('Không tìm thấy liều thuốc trong đơn');
    }
    if (this.schedules[doseIndex].isTaken) {
      throw new Error('Liều thuốc này đã được ghi nhận uống');
    }

    this.schedules[doseIndex] = {
      ...this.schedules[doseIndex],
      isTaken: true,
      takenAt,
    };
  }

  public calculateAdherence(): number {
    const total = this.schedules.length;
    const taken = this.schedules.filter((s) => s.isTaken).length;
    return calculateAdherenceRate(total, taken);
  }
}
