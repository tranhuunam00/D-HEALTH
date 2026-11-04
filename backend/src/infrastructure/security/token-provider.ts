import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'FAMILY';
  email?: string;
  iat?: number;
  exp?: number;
}

const DEFAULT_SECRET = 'dhealth_jwt_super_secret_2026_healthcare_token';
const DEFAULT_EXPIRATION = '12h'; // Tuân thủ Skill Web Security: tối đa 12 tiếng một ca trực

/**
 * Sinh JWT token bảo mật cho phiên đăng nhập
 */
export function generateToken(payload: TokenPayload, expiresIn: string | number = DEFAULT_EXPIRATION): string {
  if (!payload || !payload.userId || !payload.role) {
    throw new Error('Payload token bắt buộc phải có userId và role.');
  }
  const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
  return jwt.sign({ ...payload }, secret, { expiresIn: expiresIn as any });
}

/**
 * Xác thực và giải mã JWT token
 */
export function verifyToken(token: string): TokenPayload {
  if (!token || typeof token !== 'string') {
    throw new Error('Token không hợp lệ hoặc để trống.');
  }
  const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch (err: any) {
    throw new Error(`Token không hợp lệ hoặc đã hết hạn: ${err.message}`);
  }
}
