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

  describe('GET /passport-summary/:memberId', () => {
    it('trả về thông tin thể trạng và 9 chỉ số danh mục từ database', async () => {
      mockPool.query
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'nam',
              full_name: 'Trần Hữu Nam',
              gender: 'Nam',
              birth_date: '1980-04-12',
              height_cm: 174,
              weight_kg: 72.5,
              blood_type: 'O+',
              relationship: 'owner',
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            {
              allergies: '1',
              chronic: '2',
              meds: '3',
              labs: '24',
              imaging: '7',
              pathology: '2',
              documents: '31',
              doctors: '6',
              facilities: '4',
            },
          ],
        });

      const handler = getHandler('GET', '/passport-summary/:memberId');
      const { req, res } = createReqRes({ params: { memberId: 'nam' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.member.fullName).toBe('Trần Hữu Nam');
      expect(output.data.member.age).toBe(46);
      expect(output.data.member.bmi).toBe(23.9);
      expect(output.data.counts.allergies).toBe(1);
      expect(output.data.counts.labs).toBe(24);
      expect(output.data.counts.imaging).toBe(7);
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

    it('cập nhật thành công hồ sơ thành viên khi dữ liệu hợp lệ và tự động đồng bộ BMI', async () => {
      mockPool.query
        .mockResolvedValueOnce({
          rowCount: 1,
          rows: [{ id: 'mem_1', full_name: 'Trần Bệnh Nhân Cập Nhật', blood_type: 'O+', height_cm: 174, weight_kg: 72.5, avatar_url: 'https://example.com/a.jpg' }],
        })
        .mockResolvedValueOnce({ rowCount: 1 }) // weight insert
        .mockResolvedValueOnce({ rowCount: 1 }); // bmi insert

      const handler = getHandler('PUT', '/members/:memberId');
      const { req, res } = createReqRes({
        params: { memberId: 'mem_1' },
        body: { fullName: 'Trần Bệnh Nhân Cập Nhật', bloodType: 'O+', heightCm: 174, weightKg: 72.5, avatarUrl: 'https://example.com/a.jpg' },
      });

      await handler(req, res);
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.blood_type).toBe('O+');
      expect(output.data.avatar_url).toBe('https://example.com/a.jpg');
      // kiểm tra pool.query đã được gọi cho cả UPDATE, biometric weight và bmi
      expect(mockPool.query).toHaveBeenCalledTimes(3);
    });
  });
});
