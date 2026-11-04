import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPrescriptionsRouter } from './prescriptions.routes';

describe('PrescriptionsRoutes TDD', () => {
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
    router = createPrescriptionsRouter(mockPool);
  });

  describe('GET /:memberId', () => {
    it('trả về danh sách đơn thuốc kèm thuốc chi tiết của thành viên', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'rx_1',
            member_id: 'mem_1',
            code: 'DT-2026-089',
            doctor_name: 'BS. Lê Thị Hương',
            status: 'active',
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
  });

  describe('POST /doses/:doseId/log', () => {
    it('ghi nhận nhật ký đã uống thuốc thành công', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'log_1',
            dose_schedule_id: 'dose_123',
            status: 'taken',
            taken_at: '2026-11-04T08:00:00Z',
          },
        ],
      });

      const handler = getHandler('POST', '/doses/:doseId/log');
      const { req, res } = createReqRes({ params: { doseId: 'dose_123' }, body: { status: 'taken' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.status).toBe('taken');
    });
  });
});
