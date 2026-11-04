import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAuthRouter } from './auth.routes';

describe('AuthRoutes Unit Tests (TDD)', () => {
  let router: any;
  let mockPool: any;

  const createReqRes = (reqData: any = {}) => {
    const req: any = {
      query: {},
      params: {},
      body: {},
      ...reqData,
    };
    const res: any = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    res.cookie = vi.fn().mockReturnValue(res);
    res.clearCookie = vi.fn().mockReturnValue(res);
    return { req, res };
  };

  const getHandler = (method: string, path: string) => {
    const layer = router.stack.find(
      (s: any) => s.route && s.route.path === path && s.route.methods[method.toLowerCase()]
    );
    if (!layer) throw new Error(`Route ${method} ${path} not found`);
    return layer.route.stack[layer.route.stack.length - 1].handle;
  };

  beforeEach(() => {
    mockPool = {
      query: vi.fn(),
    };
    router = createAuthRouter(mockPool);
  });

  describe('POST /register', () => {
    it('trả về 400 khi thiếu số điện thoại hoặc mật khẩu (Boundary Case)', async () => {
      const handler = getHandler('POST', '/register');
      const { req, res } = createReqRes({
        body: { phoneNumber: '', password: '', fullName: 'A' },
      });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(false);
      expect(output.error.code).toBe('VALIDATION_ERROR');
    });

    it('trả về 409 khi số điện thoại đã tồn tại trong hệ thống', async () => {
      mockPool.query.mockRejectedValueOnce({ code: '23505' }); // Unique violation

      const handler = getHandler('POST', '/register');
      const { req, res } = createReqRes({
        body: { phoneNumber: '0988776655', password: 'Password123', fullName: 'Nguyen Van A' },
      });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
      const output = res.json.mock.calls[0][0];
      expect(output.error.code).toBe('CONFLICT');
    });
  });

  describe('POST /logout', () => {
    it('xóa cookie dhealth_token và trả về thông báo đăng xuất thành công', async () => {
      const handler = getHandler('POST', '/logout');
      const { req, res } = createReqRes();

      await handler(req, res);
      expect(res.clearCookie).toHaveBeenCalledWith('dhealth_token');
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, message: 'Đăng xuất thành công.' })
      );
    });
  });
});
