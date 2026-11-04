import { BloodType } from '../values/blood-type.vo';

export interface EmergencyContactItem {
  name: string;
  relationship: string;
  phoneNumber: string;
  priorityOrder: number;
}

export interface EmergencyCardProps {
  id: string;
  memberId: string;
  bloodType: BloodType;
  severeAllergies?: string[];
  medicalConditions?: string[];
  contacts?: EmergencyContactItem[];
}

export class EmergencyCard {
  public readonly id: string;
  public readonly memberId: string;
  public readonly bloodType: BloodType;
  public readonly severeAllergies: string[];
  public readonly medicalConditions: string[];
  private readonly contacts: EmergencyContactItem[];

  constructor(props: EmergencyCardProps) {
    if (!props.id || !props.memberId || !props.bloodType) {
      throw new Error('Dữ liệu thẻ cấp cứu không hợp lệ');
    }
    this.id = props.id;
    this.memberId = props.memberId;
    this.bloodType = props.bloodType;
    this.severeAllergies = props.severeAllergies ?? [];
    this.medicalConditions = props.medicalConditions ?? [];
    this.contacts = [...(props.contacts ?? [])];
  }

  public hasSevereAllergy(): boolean {
    return this.severeAllergies.length > 0;
  }

  public getContacts(): readonly EmergencyContactItem[] {
    return [...this.contacts].sort((a, b) => a.priorityOrder - b.priorityOrder);
  }

  public addContact(contact: EmergencyContactItem): void {
    if (!contact.phoneNumber || contact.phoneNumber.trim() === '') {
      throw new Error('Số điện thoại liên hệ khẩn cấp không được rỗng');
    }
    this.contacts.push(contact);
  }

  public generateOfflineQRPayload(): string {
    const primary = this.getContacts()[0];
    const contactStr = primary ? `${primary.name}:${primary.phoneNumber}` : 'NO_CONTACT';
    const allergiesStr = this.severeAllergies.join(';') || 'NONE';
    return `DHEALTH_SOS_V1|${this.memberId}|${this.bloodType.type}|${allergiesStr}|${contactStr}`;
  }
}
