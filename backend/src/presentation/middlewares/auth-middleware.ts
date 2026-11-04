import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../../infrastructure/security/token-provider';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * Middleware xác thực JWT Token từ Header hoặc Cookie
 */
export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.dhealth_token;
  
  let token: string | undefined;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (cookieToken) {
    token = cookieToken;
  }

  if (!token) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Bạn chưa đăng nhập hoặc phiên làm việc đã kết thúc.',
      },
    });
    return;
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: err.message,
      },
    });
  }
}

/**
 * Middleware phân quyền theo vai trò (RBAC)
 */
export function requireRole(...roles: (string | string[])[]) {
  const allowedRoles = roles.flat();
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Yêu cầu đăng nhập.' },
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN_ROLE',
          message: 'Bạn không có quyền truy cập chức năng này.',
        },
      });
      return;
    }

    next();
  };
}
