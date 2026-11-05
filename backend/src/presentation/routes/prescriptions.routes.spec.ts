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
    it('trả về tỷ lệ tuân thủ 91%, tổng số liều và số ngày động theo tháng trong lịch', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ count: '4' }] })
        .mockResolvedValueOnce({ rows: [{ id: 'ds_1', status: 'taken' }, { id: 'ds_2', status: 'pending' }] });

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
      const now = new Date();
      const expectedDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      expect(output.data.calendarDays.length).toBe(expectedDays);
    });

    it('hỗ trợ query year và month để trả về đúng số ngày của tháng được chọn (ví dụ Tháng 10/2026 có 31 ngày)', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ count: '4' }] })
        .mockResolvedValueOnce({ rows: [{ id: 'ds_1', status: 'taken' }] });

      const handler = getHandler('GET', '/:memberId/adherence-summary');
      const { req, res } = createReqRes({ params: { memberId: 'nam' }, query: { year: '2026', month: '10' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.calendarDays.length).toBe(31);
      expect(output.data.month).toBe(10);
      expect(output.data.year).toBe(2026);
    });
  });

  describe('POST /doses/:doseId/log', () => {
    it('ghi nhận nhật ký đã uống hoặc bỏ liều thuốc thành công', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rowCount: 1 })
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
        .mockResolvedValueOnce({ rows: [{ id: 'rx_nam_01' }] })
        .mockResolvedValueOnce({ rows: [{ id: 'pi_new_1', medication_name: 'Aspirin' }] })
        .mockResolvedValueOnce({ rows: [{ id: 'ds_new_1' }] });

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

    it('thêm thuốc với thời lượng tuỳ chọn (3 ngày, 5 ngày, 1 tuần, custom) tính đúng số lượng và ngày kết thúc', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 'rx_nam_01' }] })
        .mockResolvedValueOnce({ rows: [{ id: 'pi_new_2', medication_name: 'Amoxicillin' }] })
        .mockResolvedValueOnce({ rows: [{ id: 'ds_new_2' }] });

      const handler = getHandler('POST', '/:memberId/items');
      const { req, res } = createReqRes({
        params: { memberId: 'nam' },
        body: {
          medicationName: 'Amoxicillin',
          dosage: '500 mg',
          durationMode: '5days',
          startDate: '2026-10-26',
        },
      });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);

      const insertItemCall = mockPool.query.mock.calls[1];
      expect(insertItemCall[0]).toContain('quantity_prescribed');
      expect(insertItemCall[1][3]).toBe(5);
      expect(insertItemCall[1][6]).toBe('2026-10-30');
    });
  });

  describe('PUT /doses/:doseId (Chỉnh sửa thuốc - tính từ lúc sửa)', () => {
    it('cập nhật thuốc theo doseId với start_date tính từ hôm nay và tính lại end_date', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 'ds_123', prescription_item_id: 'pi_123' }] }) // find schedule
        .mockResolvedValueOnce({ rows: [{ id: 'pi_123', medication_name: 'NAMTH 1 Updated', dosage: '500 mg' }] }) // update item
        .mockResolvedValueOnce({ rowCount: 1 }); // update schedule

      const handler = getHandler('PUT', '/doses/:doseId');
      const { req, res } = createReqRes({
        params: { doseId: 'ds_123' },
        body: {
          medicationName: 'NAMTH 1 Updated',
          dosage: '500 mg',
          scheduledTime: '08:30:00',
          durationMode: '3days',
        },
      });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.medication_name).toBe('NAMTH 1 Updated');

      const updateCall = mockPool.query.mock.calls[1];
      expect(updateCall[0]).toContain('UPDATE prescription_items');
      const todayStr = new Date().toISOString().split('T')[0];
      expect(updateCall[1][4]).toBe(todayStr); // effectiveStartDate is today
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
