import { describe, it, expect } from 'vitest';
import { BloodType } from './blood-type.vo';

describe('BloodType Value Object (DDD TDD)', () => {
  it('tạo thành công nhóm máu hợp lệ (O+, A+, B+, AB-, v.v.) và bất biến', () => {
    const bt = new BloodType('O+');
    expect(bt.type).toBe('O+');
    expect(bt.abo).toBe('O');
    expect(bt.rh).toBe('+');
    expect(Object.isFrozen(bt)).toBe(true);
  });

  it('tự động chuẩn hóa chữ hoa (o+ -> O+)', () => {
    const bt = new BloodType('o+');
    expect(bt.type).toBe('O+');
  });

  it('xử lý biên: kiểm tra khả năng tương thích truyền máu khẩn cấp (Universal Donor/Recipient)', () => {
    const oNeg = new BloodType('O-');
    expect(oNeg.isUniversalDonor()).toBe(true);

    const abPos = new BloodType('AB+');
    expect(abPos.isUniversalRecipient()).toBe(true);
  });

  it('ném ngoại lệ khi nhóm máu không hợp lệ (C+, XYZ, rỗng, v.v.)', () => {
    expect(() => new BloodType('C+')).toThrow('Nhóm máu không hợp lệ');
    expect(() => new BloodType('')).toThrow('Nhóm máu không hợp lệ');
    expect(() => new BloodType('OO+')).toThrow('Nhóm máu không hợp lệ');
  });

  it('so sánh bằng nhau theo giá trị (equals)', () => {
    const b1 = new BloodType('A+');
    const b2 = new BloodType('a+');
    const b3 = new BloodType('B+');
    expect(b1.equals(b2)).toBe(true);
    expect(b1.equals(b3)).toBe(false);
  });
});
