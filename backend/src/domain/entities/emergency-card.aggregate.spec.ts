import { describe, it, expect } from 'vitest';
import { EmergencyCard, EmergencyContactItem } from './emergency-card.aggregate';
import { BloodType } from '../values/blood-type.vo';

describe('EmergencyCard Aggregate Root (DDD TDD)', () => {
  it('tạo thành công Aggregate EmergencyCard với BloodType Value Object', () => {
    const card = new EmergencyCard({
      id: 'card_01',
      memberId: 'mem_01',
      bloodType: new BloodType('O+'),
      severeAllergies: ['Penicillin', 'Hải sản vỏ cứng'],
    });

    expect(card.id).toBe('card_01');
    expect(card.bloodType.type).toBe('O+');
    expect(card.hasSevereAllergy()).toBe(true);
    expect(card.getContacts().length).toBe(0);
  });

  it('hỗ trợ thêm người liên hệ khẩn cấp và sắp xếp theo thứ tự ưu tiên (Priority Order)', () => {
    const card = new EmergencyCard({
      id: 'card_01',
      memberId: 'mem_01',
      bloodType: new BloodType('O+'),
    });

    const contact1: EmergencyContactItem = {
      name: 'Nguyễn Thị Hương',
      relationship: 'Vợ',
      phoneNumber: '0988111222',
      priorityOrder: 1,
    };
    const contact2: EmergencyContactItem = {
      name: 'Trần Văn Nam',
      relationship: 'Bố',
      phoneNumber: '0912333444',
      priorityOrder: 2,
    };

    card.addContact(contact2);
    card.addContact(contact1);

    const contacts = card.getContacts();
    expect(contacts.length).toBe(2);
    expect(contacts[0].name).toBe('Nguyễn Thị Hương'); // Sorted by priorityOrder
  });

  it('tạo chuỗi dữ liệu thẻ cấp cứu phục vụ mã QR Offline ECDSA', () => {
    const card = new EmergencyCard({
      id: 'card_01',
      memberId: 'mem_01',
      bloodType: new BloodType('O+'),
      severeAllergies: ['Penicillin'],
    });
    card.addContact({
      name: 'Nguyễn Thị Hương',
      relationship: 'Vợ',
      phoneNumber: '0988111222',
      priorityOrder: 1,
    });

    const payload = card.generateOfflineQRPayload();
    expect(payload).toContain('DHEALTH_SOS_V1');
    expect(payload).toContain('O+');
    expect(payload).toContain('Penicillin');
    expect(payload).toContain('0988111222');
  });

  it('ném ngoại lệ khi thêm người liên hệ không có số điện thoại (Invariant)', () => {
    const card = new EmergencyCard({
      id: 'card_01',
      memberId: 'mem_01',
      bloodType: new BloodType('O+'),
    });

    expect(() => card.addContact({ name: 'A', relationship: 'Vợ', phoneNumber: '', priorityOrder: 1 }))
      .toThrow('Số điện thoại liên hệ khẩn cấp không được rỗng');
  });
});
