import { describe, it, expect } from 'vitest';
import { parseGooglePayload, generateRandomOAuthSecret } from './google-auth.service';

describe('GoogleAuthService', () => {
  describe('parseGooglePayload', () => {
    // 1. HAPPY PATH & OUTPUT
    it('trích xuất hồ sơ người dùng chính xác từ payload Google chuẩn', () => {
      const payload = {
        sub: 'google_sub_10928374',
        email: 'Nam.Tran@gmail.com',
        name: 'Trần Hữu Nam',
        picture: 'https://lh3.googleusercontent.com/avatar123.jpg',
      };

      const profile = parseGooglePayload(payload);
      expect(profile.googleId).toBe('google_sub_10928374');
      expect(profile.email).toBe('nam.tran@gmail.com');
      expect(profile.fullName).toBe('Trần Hữu Nam');
      expect(profile.avatarUrl).toBe('https://lh3.googleusercontent.com/avatar123.jpg');
    });

    // 2. ERROR & BOUNDARY
    it('ném lỗi khi payload rỗng hoặc null', () => {
      expect(() => parseGooglePayload(null)).toThrow('Dữ liệu xác thực Google không hợp lệ.');
      expect(() => parseGooglePayload('invalid')).toThrow('Dữ liệu xác thực Google không hợp lệ.');
    });

    it('ném lỗi khi thiếu email hoặc googleId', () => {
      expect(() => parseGooglePayload({ name: 'Chỉ có tên' })).toThrow(/thiếu thông tin định danh/);
    });

    it('ném lỗi khi email sai định dạng', () => {
      expect(() => parseGooglePayload({ sub: '123', email: 'email_khong_hop_le' })).toThrow(/không đúng định dạng/);
    });
  });

  describe('generateRandomOAuthSecret', () => {
    it('tạo chuỗi mật khẩu ngẫu nhiên có độ dài bảo mật cao', () => {
      const secret = generateRandomOAuthSecret();
      expect(typeof secret).toBe('string');
      expect(secret.length).toBeGreaterThanOrEqual(28);
      expect(secret.startsWith('G_OAuth_')).toBe(true);
    });
  });
});
