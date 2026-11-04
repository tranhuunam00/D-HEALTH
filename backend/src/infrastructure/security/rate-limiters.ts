import rateLimit from 'express-rate-limit';

/**
 * Giới hạn nghiêm ngặt cho các endpoint xác thực (Login, Register, OTP, Google Auth)
 * Chống tấn công dò mật khẩu Brute-force & Credential Stuffing (Tối đa 5 lần / 15 phút)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Tối đa 5 lần thử
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Bạn đã thử đăng nhập quá nhiều lần (tối đa 5 lần). Vui lòng đợi 15 phút để thử lại.',
    },
  },
});

/**
 * Giới hạn chung cho toàn bộ API (100 yêu cầu / phút trên mỗi IP)
 * Chống tấn công DoS và càn quét tài nguyên y tế
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 100, // Tối đa 100 request/phút
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'API_RATE_LIMIT_EXCEEDED',
      message: 'Quá nhiều yêu cầu từ IP của bạn. Vui lòng thử lại sau 1 phút.',
    },
  },
});
