import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCareRouter } from './care.routes';

describe('CareRoutes TDD', () => {
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
    router = createCareRouter(mockPool);
  });

  describe('GET /:memberId/care-summary', () => {
    it('trả về thông tin lịch hẹn 12/11, đội ngũ chăm sóc 3 thành viên và thống kê chia sẻ quyền', async () => {
      // Mock upcoming appointment
      mockPool.query
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'app_1',
              appointment_date: '2026-11-12T09:00:00Z',
              purpose: 'Tái khám tim mạch',
              doctor_name: 'BS Trần Văn B',
              facility_name: '[Bệnh viện đối tác]',
            },
          ],
        })
        // Mock share grants
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'sg_01',
              grantee_name: 'BS Trần Văn B',
              grantee_role: 'Tim mạch',
              grantee_org: '[Bệnh viện đối tác]',
              grantee_phone: '[Số điện thoại]',
              grantee_email: '[email bác sĩ]',
              expires_at: '2026-11-11T00:00:00Z',
            },
            {
              id: 'sg_02',
              grantee_name: 'BS Lê Văn C',
              grantee_role: 'CĐHA',
              grantee_org: 'Bệnh viện K',
              grantee_phone: '0912 345 678',
              grantee_email: 'levanc@dhealth.vn',
              expires_at: '2026-12-04T00:00:00Z',
            },
            {
              id: 'sg_03',
              grantee_name: 'Trần Minh Hương',
              grantee_role: 'Gia đình',
              grantee_org: 'Gia đình',
              grantee_phone: '0987 654 321',
              grantee_email: 'huong@gmail.com',
              expires_at: '2027-11-04T00:00:00Z',
            },
          ],
        });

      const handler = getHandler('GET', '/:memberId/care-summary');
      const { req, res } = createReqRes({ params: { memberId: 'nam' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.upcomingAppointment.month).toBe('TH 11');
      expect(output.data.upcomingAppointment.date).toBe('12');
      expect(output.data.upcomingAppointment.title).toBe('Tái khám tim mạch');
      expect(output.data.careTeam.length).toBe(3);
      expect(output.data.sharingStats.activeCount).toBe(3);
    });
  });

  describe('POST /:memberId/send-pre-exam-dossier', () => {
    it('gửi hồ sơ bệnh án trước khám cho bác sĩ thành công', async () => {
      const handler = getHandler('POST', '/:memberId/send-pre-exam-dossier');
      const { req, res } = createReqRes({
        params: { memberId: 'nam' },
        body: { doctorId: 'bs_tran_van_b' },
      });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.message).toContain('Đã gửi hồ sơ');
    });
  });
});
