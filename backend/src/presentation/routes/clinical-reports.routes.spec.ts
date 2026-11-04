import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClinicalReportsRouter } from './clinical-reports.routes';

describe('ClinicalReportsRoutes TDD', () => {
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
    router = createClinicalReportsRouter(mockPool);
  });

  describe('GET /:memberId', () => {
    it('trả về danh sách phiếu kết quả cận lâm sàng của thành viên', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'rep_1',
            member_id: 'mem_1',
            report_type: 'lab',
            title: 'Sinh hóa máu định kỳ',
            facility_name: 'Bệnh viện Bạch Mai',
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

  describe('GET /results/:reportId', () => {
    it('trả về chi tiết các chỉ số xét nghiệm trong phiếu', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'res_1',
            test_name: 'Glucose máu đói',
            value_numeric: 5.8,
            reference_range: '3.9 - 6.4',
            unit: 'mmol/L',
            is_abnormal: false,
          },
        ],
      });

      const handler = getHandler('GET', '/results/:reportId');
      const { req, res } = createReqRes({ params: { reportId: 'rep_1' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.length).toBe(1);
      expect(output.data[0].test_name).toBe('Glucose máu đói');
    });
  });
});
