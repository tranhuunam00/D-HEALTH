import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from './password-hasher';

describe('PasswordHasher', () => {
  describe('hashPassword', () => {
    // 1. HAPPY PATH & OUTPUT
    it('băm mật khẩu hợp lệ thành công và trả về chuỗi bcrypt', async () => {
      const raw = 'HealthSecure@2026';
      const hash = await hashPassword(raw);
      expect(typeof hash).toBe('string');
      expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true);
      expect(hash).not.toBe(raw);
    });

    // 2. BOUNDARY & ERROR
    it('ném ngoại lệ khi mật khẩu ngắn hơn 8 ký tự', async () => {
      await expect(hashPassword('1234567')).rejects.toThrow('Mật khẩu phải chứa ít nhất 8 ký tự.');
    });

    it('ném ngoại lệ khi mật khẩu rỗng hoặc null', async () => {
      await expect(hashPassword('')).rejects.toThrow('Mật khẩu không được để trống.');
      await expect(hashPassword(null as unknown as string)).rejects.toThrow('Mật khẩu không được để trống.');
    });
  });

  describe('verifyPassword', () => {
    // 3. LOGIC & INVARIANTS
    it('trả về true khi mật khẩu khớp chính xác với hash', async () => {
      const raw = 'DHealthDoctor@999';
      const hash = await hashPassword(raw);
      const isMatch = await verifyPassword(raw, hash);
      expect(isMatch).toBe(true);
    });

    it('trả về false khi mật khẩu sai', async () => {
      const hash = await hashPassword('CorrectPassword123');
      const isMatch = await verifyPassword('WrongPassword123', hash);
      expect(isMatch).toBe(false);
    });

    it('trả về false khi tham số rỗng hoặc thiếu', async () => {
      const isMatch1 = await verifyPassword('', '$2a$10$something');
      const isMatch2 = await verifyPassword('pass', '');
      expect(isMatch1).toBe(false);
      expect(isMatch2).toBe(false);
    });
  });
});
