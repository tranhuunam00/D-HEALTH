import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createChronicConditionsRouter } from './chronic-conditions.routes';

describe('ChronicConditionsRoutes TDD', () => {
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
    router = createChronicConditionsRouter(mockPool);
  });

  describe('GET /:memberId', () => {
    it('trả về danh sách bệnh mạn tính và việc cần làm từ database', async () => {
      mockPool.query
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'pcc_tim_mach',
              condition_name: 'Tim mạch',
              status_summary: 'Nguy cơ trung bình · xu hướng ổn định',
              next_checkup_date: '2026-11-12',
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            { id: 't1', title: 'Theo dõi huyết áp sáng và tối', is_completed: false },
          ],
        });

      const handler = getHandler('GET', '/:memberId');
      const { req, res } = createReqRes({ params: { memberId: 'nam' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.conditions.length).toBe(1);
      expect(output.data.tasks.length).toBe(1);
      expect(output.data.conditions[0].condition_name).toBe('Tim mạch');
    });

    it('fallback lấy dữ liệu mẫu khi thành viên mới chưa có hồ sơ bệnh mạn tính riêng', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [] }) // condRes rỗng
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'pcc_tim_mach',
              condition_name: 'Tim mạch',
              status_summary: 'Nguy cơ trung bình · xu hướng ổn định',
            },
          ],
        }) // fallback cond
        .mockResolvedValueOnce({ rows: [] }) // taskRes rỗng
        .mockResolvedValueOnce({
          rows: [{ id: 't1', title: 'Theo dõi huyết áp sáng và tối' }],
        }); // fallback tasks

      const handler = getHandler('GET', '/:memberId');
      const { req, res } = createReqRes({ params: { memberId: 'mem_new_123' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.conditions.length).toBe(1);
      expect(output.data.tasks.length).toBe(1);
    });
  });

  describe('PATCH /tasks/:taskId', () => {
    it('cập nhật trạng thái hoàn thành của việc cần làm', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [{ id: 't1', is_completed: true }],
      });

      const handler = getHandler('PATCH', '/tasks/:taskId');
      const { req, res } = createReqRes({
        params: { taskId: 't1' },
        body: { isCompleted: true },
      });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
    });
  });
});
