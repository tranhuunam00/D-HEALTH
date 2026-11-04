import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createUserProfileRouter } from './user-profile.routes';

describe('UserProfileRoutes Unit Tests (TDD)', () => {
  let router: any;
  let mockPool: any;

  const createReqRes = (reqData: any = {}) => {
    const req: any = {
      query: {},
      params: {},
      body: {},
      user: { userId: 'usr_me', role: 'patient' },
      ...reqData,
    };
    const res: any = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
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
    router = createUserProfileRouter(mockPool);
  });

  describe('GET /', () => {
    it('trả về thông tin tài khoản và danh sách thành viên gia đình', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 'usr_me', phone_number: '0988776655' }] })
        .mockResolvedValueOnce({ rows: [{ id: 'mem_1', full_name: 'Trần Bệnh Nhân', relationship: 'owner' }] });

      const handler = getHandler('GET', '/');
      const { req, res } = createReqRes();

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.user.id).toBe('usr_me');
      expect(output.data.members.length).toBe(1);
    });
  });

  describe('PUT /members/:memberId', () => {
    it('trả về 400 khi cập nhật nhóm máu không hợp lệ (Boundary/Error Case)', async () => {
      const handler = getHandler('PUT', '/members/:memberId');
      const { req, res } = createReqRes({
        params: { memberId: 'mem_1' },
        body: { bloodType: 'XYZ_INVALID' },
      });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      const output = res.json.mock.calls[0][0];
      expect(output.error.code).toBe('INVALID_BLOOD_TYPE');
    });

    it('cập nhật thành công hồ sơ thành viên khi dữ liệu hợp lệ', async () => {
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 'mem_1', full_name: 'Trần Bệnh Nhân Cập Nhật', blood_type: 'O+' }],
      });

      const handler = getHandler('PUT', '/members/:memberId');
      const { req, res } = createReqRes({
        params: { memberId: 'mem_1' },
        body: { fullName: 'Trần Bệnh Nhân Cập Nhật', bloodType: 'O+' },
      });

      await handler(req, res);
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.blood_type).toBe('O+');
    });
  });
});
