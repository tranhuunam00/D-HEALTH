import { describe, it, expect, vi } from 'vitest';
import { authenticate, optionalAuthenticate, requireRole, AuthenticatedRequest } from './auth-middleware';
import { generateToken } from '../../infrastructure/security/token-provider';
import { Response } from 'express';

describe('AuthMiddleware', () => {
  const createMockRes = () => {
    const res: any = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res as Response;
  };

  describe('authenticate', () => {
    it('cho phép request tiếp tục khi có Bearer token hợp lệ trong Header', () => {
      const token = generateToken({ userId: 'u1', role: 'PATIENT' });
      const req: any = { headers: { authorization: `Bearer ${token}` } };
      const res = createMockRes();
      const next = vi.fn();

      authenticate(req as AuthenticatedRequest, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.user?.userId).toBe('u1');
    });

    it('cho phép request tiếp tục khi có token trong Cookie', () => {
      const token = generateToken({ userId: 'u2', role: 'DOCTOR' });
      const req: any = { headers: {}, cookies: { dhealth_token: token } };
      const res = createMockRes();
      const next = vi.fn();

      authenticate(req as AuthenticatedRequest, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.user?.userId).toBe('u2');
    });

    it('trả về 401 khi không có token nào được gửi', () => {
      const req: any = { headers: {}, cookies: {} };
      const res = createMockRes();
      const next = vi.fn();

      authenticate(req as AuthenticatedRequest, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('trả về 401 khi token sai hoặc giả mạo', () => {
      const req: any = { headers: { authorization: 'Bearer invalid.token.signature' } };
      const res = createMockRes();
      const next = vi.fn();

      authenticate(req as AuthenticatedRequest, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuthenticate', () => {
    it('gắn req.user khi có token hợp lệ và gọi next()', () => {
      const token = generateToken({ userId: 'u_opt', role: 'PATIENT' });
      const req: any = { headers: { authorization: `Bearer ${token}` } };
      const res = createMockRes();
      const next = vi.fn();

      optionalAuthenticate(req as AuthenticatedRequest, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.user?.userId).toBe('u_opt');
    });

    it('vẫn gọi next() và không chặn khi không có token', () => {
      const req: any = { headers: {}, cookies: {} };
      const res = createMockRes();
      const next = vi.fn();

      optionalAuthenticate(req as AuthenticatedRequest, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });

    it('vẫn gọi next() và bỏ qua lỗi khi token không hợp lệ', () => {
      const req: any = { headers: { authorization: 'Bearer garbage.token' } };
      const res = createMockRes();
      const next = vi.fn();

      optionalAuthenticate(req as AuthenticatedRequest, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });
  });

  describe('requireRole', () => {
    it('cho phép khi vai trò của user nằm trong danh sách được cấp phép', () => {
      const req: any = { user: { userId: 'admin_1', role: 'ADMIN' } };
      const res = createMockRes();
      const next = vi.fn();

      requireRole('ADMIN', 'DOCTOR')(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('trả về 403 khi vai trò không được cấp phép', () => {
      const req: any = { user: { userId: 'patient_1', role: 'PATIENT' } };
      const res = createMockRes();
      const next = vi.fn();

      requireRole('ADMIN')(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
