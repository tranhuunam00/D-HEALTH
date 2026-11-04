import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBiometricsRouter } from './biometrics.routes';

describe('BiometricsRoutes TDD', () => {
  let router: any;
  let mockPool: any;

  const createReqRes = (reqData: any = {}) => {
    const req: any = {
      query: {},
      params: {},
      body: {},
      user: { userId: 'user_1', role: 'patient' },
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
    router = createBiometricsRouter(mockPool);
  });

  describe('GET /:memberId', () => {
    it('trả về danh sách chỉ số sinh trắc học của thành viên', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'rec_1',
            member_id: 'mem_1',
            biometric_type: 'blood_pressure',
            value_systolic: 120,
            value_diastolic: 80,
            measured_at: '2026-11-04T08:00:00Z',
          },
        ],
      });

      const handler = getHandler('GET', '/:memberId');
      const { req, res } = createReqRes({ params: { memberId: 'mem_1' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.length).toBe(1);
    });

    it('xử lý biên: trả về mảng rỗng khi thành viên chưa có số đo', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      const handler = getHandler('GET', '/:memberId');
      const { req, res } = createReqRes({ params: { memberId: 'mem_new' } });

      await handler(req, res);
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data).toEqual([]);
    });
  });

  describe('POST /', () => {
    it('lưu thành công chỉ số Huyết áp và tự động phân loại AHA', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'rec_new',
            member_id: 'mem_1',
            biometric_type: 'blood_pressure',
            value_systolic: 135,
            value_diastolic: 85,
            classification: 'stage_1',
          },
        ],
      });

      const handler = getHandler('POST', '/');
      const { req, res } = createReqRes({
        body: {
          memberId: 'mem_1',
          biometricType: 'blood_pressure',
          systolic: 135,
          diastolic: 85,
          unit: 'mmHg',
        },
      });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.classification).toBe('stage_1');
    });

    it('xử lý lỗi: trả về 400 khi thiếu memberId hoặc biometricType', async () => {
      const handler = getHandler('POST', '/');
      const { req, res } = createReqRes({
        body: { memberId: '' },
      });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(false);
      expect(output.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
