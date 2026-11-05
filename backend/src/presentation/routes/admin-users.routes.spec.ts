import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAdminUsersRouter } from './admin-users.routes';

describe('AdminUsersRoutes', () => {
  let router: any;
  let mockPool: any;

  const createReqRes = (reqData: any = {}) => {
    const req: any = {
      query: {},
      params: {},
      body: {},
      user: { userId: 'admin_current_id', role: 'super_admin' },
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
    return layer.route.stack[0].handle;
  };

  beforeEach(() => {
    mockPool = {
      query: vi.fn(),
    };
    router = createAdminUsersRouter(mockPool);
  });

  describe('GET /', () => {
    it('trả về danh sách người dùng và meta phân trang', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ count: '1' }] })
        .mockResolvedValueOnce({ rows: [{ id: 'u1', full_name: 'Nguyen Van A', role: 'patient' }] });

      const handler = getHandler('GET', '/');
      const { req, res } = createReqRes({ query: { page: '1', limit: '10' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.length).toBe(1);
      expect(output.meta.total).toBe(1);
    });

    it('trả về lỗi 500 khi CSDL gặp lỗi truy vấn', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('Connection lost'));
      const handler = getHandler('GET', '/');
      const { req, res } = createReqRes();

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.objectContaining({ code: 'DB_ERROR' }) })
      );
    });
  });

  describe('POST /', () => {
    it('trả về 400 khi thiếu thông tin bắt buộc', async () => {
      const handler = getHandler('POST', '/');
      const { req, res } = createReqRes({ body: { fullName: 'A' } });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.objectContaining({ code: 'VALIDATION_ERROR' }) })
      );
    });

    it('tạo người dùng bệnh nhân thành công', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 'u_new', phone_number: '0912345678', email: 'a@d.vn' }] })
        .mockResolvedValueOnce({ rows: [] });

      const handler = getHandler('POST', '/');
      const { req, res } = createReqRes({
        body: { fullName: 'Nguyen Van A', phoneNumber: '0912345678', password: 'password123', role: 'patient' },
      });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
    });
  });

  describe('PUT /:id', () => {
    it('cập nhật tài khoản Admin và đổi mật khẩu thành công', async () => {
      mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'adm_1' }] });
      const handler = getHandler('PUT', '/:id');
      const { req, res } = createReqRes({
        params: { id: 'adm_1' },
        body: { fullName: 'Admin Updated', password: 'newSecurePassword123' },
      });

      await handler(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('password_hash'),
        expect.any(Array)
      );
    });

    it('cập nhật hồ sơ bệnh nhân, sinh trắc và đổi mật khẩu thành công', async () => {
      // 1. admin_users rowCount = 0 (not admin)
      // 2. users UPDATE
      // 3. family_members UPDATE
      mockPool.query
        .mockResolvedValueOnce({ rowCount: 0 })
        .mockResolvedValueOnce({ rowCount: 1 })
        .mockResolvedValueOnce({ rowCount: 1 });

      const handler = getHandler('PUT', '/:id');
      const { req, res } = createReqRes({
        params: { id: 'u_patient_1' },
        body: {
          fullName: 'Trần Hữu Nam Updated',
          phoneNumber: '0961766816',
          nationalId: '001200001234',
          gender: 'Nam',
          birthDate: '1980-05-15',
          bloodType: 'O+',
          heightCm: 170,
          weightKg: 68,
          password: 'newPassword123456',
        },
      });

      await handler(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('national_id'),
        expect.any(Array)
      );
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('family_members'),
        expect.any(Array)
      );
    });
  });

  describe('POST /:id/grant-role', () => {
    it('trả về 400 khi vai trò chỉ định không hợp lệ', async () => {
      const handler = getHandler('POST', '/:id/grant-role');
      const { req, res } = createReqRes({ params: { id: 'u1' }, body: { role: 'hacker' } });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.objectContaining({ code: 'INVALID_ROLE' }) })
      );
    });

    it('cập nhật vai trò khi người dùng đã tồn tại trong admin_users', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'adm_1' }] })
        .mockResolvedValueOnce({ rowCount: 1 });

      const handler = getHandler('POST', '/:id/grant-role');
      const { req, res } = createReqRes({ params: { id: 'adm_1' }, body: { role: 'clinical_admin' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });

  describe('DELETE /:id', () => {
    it('ngăn chặn tài khoản admin tự xóa chính mình', async () => {
      const handler = getHandler('DELETE', '/:id');
      const { req, res } = createReqRes({ params: { id: 'admin_current_id' } });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.objectContaining({ code: 'FORBIDDEN_SELF_DELETE' }) })
      );
    });

    it('trả về 404 khi không tìm thấy người dùng', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rowCount: 0 })
        .mockResolvedValueOnce({ rowCount: 0 });

      const handler = getHandler('DELETE', '/:id');
      const { req, res } = createReqRes({ params: { id: 'non_existent' } });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.objectContaining({ code: 'NOT_FOUND' }) })
      );
    });

    it('xóa thành công người dùng bệnh nhân', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rowCount: 0 })
        .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'u1' }] });

      const handler = getHandler('DELETE', '/:id');
      const { req, res } = createReqRes({ params: { id: 'u1' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });

  describe('GET /:id/dossier', () => {
    it('trả về toàn bộ hồ sơ lâm sàng chi tiết của bệnh nhân (bệnh án tổng hợp)', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 'u1', phone_number: '0961766816' }] }) // user
        .mockResolvedValueOnce({ rows: [{ id: 'nam', full_name: 'Trần Hữu Nam' }] }) // members
        .mockResolvedValueOnce({ rows: [{ id: 'bio_1', systolic: 120, diastolic: 80 }] }) // biometrics
        .mockResolvedValueOnce({ rows: [{ id: 'cond_1', condition_name: 'Tim mạch' }] }) // conditions
        .mockResolvedValueOnce({ rows: [{ id: 'task_1', title: 'Đo huyết áp' }] }) // tasks
        .mockResolvedValueOnce({ rows: [{ id: 'rep_1', report_type: 'blood_test' }] }) // reports
        .mockResolvedValueOnce({ rows: [{ id: 'rx_1', diagnosis: 'Tăng huyết áp' }] }) // prescriptions
        .mockResolvedValueOnce({ rows: [{ id: 'grant_1', grantee_name: 'BS B' }] }); // care team

      const handler = getHandler('GET', '/:id/dossier');
      const { req, res } = createReqRes({ params: { id: 'u1' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.user.phone_number).toBe('0961766816');
      expect(output.data.biometrics.length).toBe(1);
      expect(output.data.conditions.length).toBe(1);
      expect(output.data.reports.length).toBe(1);
    });
  });
});
