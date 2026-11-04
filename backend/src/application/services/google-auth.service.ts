export interface GoogleUserProfile {
  googleId: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

/**
 * Phân tích và thẩm định payload từ Google ID Token
 * @param token ID token hoặc verified payload từ Google SDK
 */
export function parseGooglePayload(payload: any): GoogleUserProfile {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Dữ liệu xác thực Google không hợp lệ.');
  }

  const googleId = payload.sub || payload.googleId;
  const email = payload.email;
  const rawName = (payload.name || payload.fullName || payload.displayName || '').trim();
  const emailUser = email && typeof email === 'string' && email.includes('@')
    ? email.split('@')[0].replace(/[._-]/g, ' ')
    : 'Bệnh nhân';
  const fullName = rawName && rawName !== 'Người dùng Google' && rawName !== 'Bệnh Nhân Google'
    ? rawName
    : emailUser;
  const avatarUrl = payload.picture || payload.avatarUrl;

  if (!googleId || !email) {
    throw new Error('Dữ liệu Google thiếu thông tin định danh (sub hoặc email).');
  }

  // Thẩm định định dạng email cơ bản
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error(`Email Google không đúng định dạng: ${email}`);
  }

  return {
    googleId,
    email: email.toLowerCase(),
    fullName,
    avatarUrl,
  };
}

/**
 * Tạo mật khẩu giả lập ngẫu nhiên an toàn cho tài khoản OAuth Google
 */
export function generateRandomOAuthSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let result = 'G_OAuth_';
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
