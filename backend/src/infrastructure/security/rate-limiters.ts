import rateLimit from 'express-rate-limit';

/**
 * Giới hạn nghiêm ngặt cho endpoint đăng nhập (Login)
 * Chống tấn công dò mật khẩu Brute-force & Credential Stuffing (Tối đa 5 lần thử sai / 15 phút)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100000, // Tạm thời bỏ limit cho dev/testing
  skip: () => true, // Tạm thời bypass rate limit theo yêu cầu
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Bạn đã thử đăng nhập quá nhiều lần. Vui lòng đợi 15 phút để thử lại.',
    },
  },
});

/**
 * Giới hạn đăng ký tài khoản (Register) để chống bot spam tài khoản
 */
export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Cho phép tối đa 20 lần đăng ký / 15 phút
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'REGISTER_RATE_LIMIT_EXCEEDED',
      message: 'Quá nhiều yêu cầu đăng ký từ thiết bị của bạn. Vui lòng thử lại sau 15 phút.',
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
