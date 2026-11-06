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

    it('trả về mảng rỗng khi thành viên mới chưa có hồ sơ bệnh mạn tính riêng', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      const handler = getHandler('GET', '/:memberId');
      const { req, res } = createReqRes({ params: { memberId: 'mem_new_123' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.conditions.length).toBe(0);
      expect(output.data.tasks.length).toBe(0);
    });
  });

  describe('POST /:memberId/conditions', () => {
    it('thêm bệnh mạn tính mới kèm các chỉ số theo dõi thành công', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'pcc_123',
            condition_name: 'Rối loạn lipid máu',
            status_summary: 'Nguy cơ trung bình · xu hướng ổn định',
          },
        ],
      });

      const handler = getHandler('POST', '/:memberId/conditions');
      const { req, res } = createReqRes({
        params: { memberId: 'nam' },
        body: {
          conditionName: 'Rối loạn lipid máu',
          icd10Code: 'E78.5',
          riskLevel: 'medium',
          trendStatus: 'stable',
          statusSummary: 'Nguy cơ trung bình · xu hướng ổn định',
          nextCheckupDate: '2026-12-15',
          targetMetrics: [
            { name: 'LDL-C', status: 'Theo dõi', type: 'warning' },
            { name: 'Huyết áp', status: 'Tốt', type: 'good' },
          ],
        },
      });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.condition_name).toBe('Rối loạn lipid máu');
    });

    it('báo lỗi khi thiếu tên bệnh mạn tính', async () => {
      const handler = getHandler('POST', '/:memberId/conditions');
      const { req, res } = createReqRes({
        params: { memberId: 'nam' },
        body: {},
      });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(false);
      expect(output.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('DELETE /:memberId/conditions/:conditionId', () => {
    it('xóa bệnh mạn tính thành công', async () => {
      mockPool.query.mockResolvedValueOnce({ rowCount: 1 });

      const handler = getHandler('DELETE', '/:memberId/conditions/:conditionId');
      const { req, res } = createReqRes({
        params: { memberId: 'nam', conditionId: 'pcc_123' },
      });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
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

  describe('POST /:memberId/tasks', () => {
    it('thêm việc cần làm mới thành công', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [{ id: 'task_new_1', title: 'Xét nghiệm máu trước tái khám', is_completed: false }],
      });

      const handler = getHandler('POST', '/:memberId/tasks');
      const { req, res } = createReqRes({
        params: { memberId: 'nam' },
        body: { title: 'Xét nghiệm máu trước tái khám' },
      });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.title).toBe('Xét nghiệm máu trước tái khám');
    });
  });
});
