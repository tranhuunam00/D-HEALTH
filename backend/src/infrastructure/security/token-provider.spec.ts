import { describe, it, expect } from 'vitest';
import { generateToken, verifyToken, TokenPayload } from './token-provider';

describe('TokenProvider', () => {
  const validPayload: TokenPayload = {
    userId: 'usr_001',
    role: 'PATIENT',
    email: 'patient@dhealth.vn',
  };

  describe('generateToken', () => {
    // 1. HAPPY PATH & OUTPUT
    it('sinh chuỗi JWT token hợp lệ từ payload', () => {
      const token = generateToken(validPayload);
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // Cấu trúc JWT header.payload.signature
    });

    // 2. ERROR & VALIDATION
    it('ném lỗi khi payload thiếu userId hoặc role', () => {
      expect(() => generateToken({ userId: '', role: 'PATIENT' })).toThrow('Payload token bắt buộc phải có userId và role.');
      expect(() => generateToken(null as unknown as TokenPayload)).toThrow('Payload token bắt buộc phải có userId và role.');
    });
  });

  describe('verifyToken', () => {
    // 3. LOGIC & INVARIANTS
    it('giải mã token chính xác và khớp dữ liệu payload', () => {
      const token = generateToken(validPayload);
      const decoded = verifyToken(token);
      expect(decoded.userId).toBe(validPayload.userId);
      expect(decoded.role).toBe(validPayload.role);
      expect(decoded.email).toBe(validPayload.email);
    });

    // 4. ERROR & EXPIRATION
    it('ném lỗi khi token bị giả mạo hoặc sai chữ ký', () => {
      const invalidToken = 'header.invalid_payload.signature';
      expect(() => verifyToken(invalidToken)).toThrow(/Token không hợp lệ/);
    });

    it('ném lỗi khi token để trống hoặc null', () => {
      expect(() => verifyToken('')).toThrow('Token không hợp lệ hoặc để trống.');
    });
  });
});
