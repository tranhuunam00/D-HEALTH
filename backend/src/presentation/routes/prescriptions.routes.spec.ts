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

  describe('GET /:memberId/today-doses', () => {
    it('trả về 4 cữ uống thuốc trong ngày của thành viên', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [
          { id: 'ds_1', name: 'Losartan', dosage: '50 mg', scheduled_time: '07:00:00', status: 'taken', taken: true },
          { id: 'ds_2', name: 'Metformin', dosage: '500 mg', scheduled_time: '07:00:00', status: 'taken', taken: true },
          { id: 'ds_3', name: 'Metformin', dosage: '500 mg', scheduled_time: '20:00:00', status: 'pending', taken: false },
          { id: 'ds_4', name: 'Atorvastatin', dosage: '20 mg', scheduled_time: '21:00:00', status: 'pending', taken: false },
        ],
      });

      const handler = getHandler('GET', '/:memberId/today-doses');
      const { req, res } = createReqRes({ params: { memberId: 'nam' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.length).toBe(4);
      expect(output.data[0].name).toBe('Losartan');
    });
  });

  describe('GET /:memberId/adherence-summary', () => {
    it('trả về tỷ lệ tuân thủ 91%, tổng số liều và 31 ngày trong lịch', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [{ count: '4' }],
      });

      const handler = getHandler('GET', '/:memberId/adherence-summary');
      const { req, res } = createReqRes({ params: { memberId: 'nam' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.adherencePercent).toBe(91);
      expect(output.data.takenCount).toBe(109);
      expect(output.data.missedCount).toBe(7);
      expect(output.data.skippedCount).toBe(4);
      expect(output.data.calendarDays.length).toBe(31);
    });
  });

  describe('POST /doses/:doseId/log', () => {
    it('ghi nhận nhật ký đã uống hoặc bỏ liều thuốc thành công', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rowCount: 1 }) // delete old log for today
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'log_1',
              schedule_id: 'dose_123',
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

  describe('POST /:memberId/items (Nhập thuốc thủ công)', () => {
    it('thêm đơn thuốc mới và tạo cữ uống thuốc thành công', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 'rx_nam_01' }] }) // check or get prescription
        .mockResolvedValueOnce({ rows: [{ id: 'pi_new_1', medication_name: 'Aspirin' }] }) // insert item
        .mockResolvedValueOnce({ rows: [{ id: 'ds_new_1' }] }); // insert dose schedule

      const handler = getHandler('POST', '/:memberId/items');
      const { req, res } = createReqRes({
        params: { memberId: 'nam' },
        body: {
          medicationName: 'Aspirin',
          dosage: '81 mg',
          dosePerIntake: '1 viên',
          timingInstructions: '1 viên sau ăn sáng',
          scheduledTime: '08:00:00',
        },
      });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.medication_name).toBe('Aspirin');
    });
  });

  describe('POST /:memberId/send-history', () => {
    it('gửi tiền sử dùng thuốc cho bác sĩ điều trị thành công', async () => {
      const handler = getHandler('POST', '/:memberId/send-history');
      const { req, res } = createReqRes({ params: { memberId: 'nam' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.message).toContain('Đã gửi tiền sử dùng thuốc');
    });
  });
});
