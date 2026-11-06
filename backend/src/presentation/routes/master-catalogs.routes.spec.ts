import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMasterCatalogsRouter } from './master-catalogs.routes';

describe('MasterCatalogsRoutes TDD', () => {
  let router: any;
  let mockPool: any;

  const createReqRes = (reqData: any = {}) => {
    const req: any = {
      query: {},
      params: {},
      body: {},
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
    router = createMasterCatalogsRouter(mockPool);
  });

  describe('Facilities CRUD', () => {
    it('GET /facilities returns active facilities by default', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [{ id: 'bv_bach_mai', name: 'Bệnh viện Bạch Mai' }],
      });
      const handler = getHandler('get', '/facilities');
      const { req, res } = createReqRes();

      await handler(req, res);
      expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('is_active = true'));
      expect(res.json).toHaveBeenCalledWith({
        data: [{ id: 'bv_bach_mai', name: 'Bệnh viện Bạch Mai' }],
      });
    });

    it('GET /facilities?all=true returns all facilities including inactive', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [{ id: 'bv_bach_mai', is_active: false }],
      });
      const handler = getHandler('get', '/facilities');
      const { req, res } = createReqRes({ query: { all: 'true' } });

      await handler(req, res);
      expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('ORDER BY is_active DESC'));
      expect(res.json).toHaveBeenCalled();
    });

    it('POST /facilities returns 400 when name is missing', async () => {
      const handler = getHandler('post', '/facilities');
      const { req, res } = createReqRes({ body: {} });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });

    it('POST /facilities creates a facility successfully', async () => {
      const newFac = {
        id: 'fac_123',
        code: 'BV-TEST',
        name: 'Bệnh viện Test',
        facility_type: 'hospital_tw',
        city: 'Hà Nội',
        hotline: '1900-1111',
      };
      mockPool.query.mockResolvedValueOnce({ rows: [newFac] });
      const handler = getHandler('post', '/facilities');
      const { req, res } = createReqRes({ body: newFac });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: newFac });
    });

    it('PUT /facilities/:id updates existing facility', async () => {
      const updatedFac = { id: 'bv_bach_mai', name: 'Bạch Mai Updated' };
      mockPool.query.mockResolvedValueOnce({ rows: [updatedFac] });
      const handler = getHandler('put', '/facilities/:id');
      const { req, res } = createReqRes({
        params: { id: 'bv_bach_mai' },
        body: { name: 'Bạch Mai Updated' },
      });

      await handler(req, res);
      expect(res.json).toHaveBeenCalledWith({ data: updatedFac });
    });

    it('PUT /facilities/:id returns 404 when facility does not exist', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [] });
      const handler = getHandler('put', '/facilities/:id');
      const { req, res } = createReqRes({
        params: { id: 'nonexistent' },
        body: { name: 'Test' },
      });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('DELETE /facilities/:id deactivates facility', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [{ id: 'bv_bach_mai', is_active: false }] });
      const handler = getHandler('delete', '/facilities/:id');
      const { req, res } = createReqRes({ params: { id: 'bv_bach_mai' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });

  describe('Doctors CRUD', () => {
    it('GET /doctors returns doctors with facility and department names', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [{ id: 'doc_1', full_name: 'BS Trần Văn B', facility_name: 'Bạch Mai' }],
      });
      const handler = getHandler('get', '/doctors');
      const { req, res } = createReqRes();

      await handler(req, res);
      expect(res.json).toHaveBeenCalledWith({
        data: [{ id: 'doc_1', full_name: 'BS Trần Văn B', facility_name: 'Bạch Mai' }],
      });
    });

    it('POST /doctors returns 400 when full_name is missing', async () => {
      const handler = getHandler('post', '/doctors');
      const { req, res } = createReqRes({ body: {} });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('POST /doctors creates a doctor successfully', async () => {
      const newDoc = {
        id: 'doc_123',
        full_name: 'BS Nguyễn Văn X',
        academic_title: 'TS.BS',
      };
      mockPool.query.mockResolvedValueOnce({ rows: [newDoc] });
      const handler = getHandler('post', '/doctors');
      const { req, res } = createReqRes({ body: newDoc });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: newDoc });
    });

    it('PUT /doctors/:id updates doctor', async () => {
      const updatedDoc = { id: 'doc_1', full_name: 'BS Trần Văn B Updated' };
      mockPool.query.mockResolvedValueOnce({ rows: [updatedDoc] });
      const handler = getHandler('put', '/doctors/:id');
      const { req, res } = createReqRes({
        params: { id: 'doc_1' },
        body: { full_name: 'BS Trần Văn B Updated' },
      });

      await handler(req, res);
      expect(res.json).toHaveBeenCalledWith({ data: updatedDoc });
    });

    it('DELETE /doctors/:id deactivates doctor', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [{ id: 'doc_1', is_active: false }] });
      const handler = getHandler('delete', '/doctors/:id');
      const { req, res } = createReqRes({ params: { id: 'doc_1' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });

  describe('Admin Appointments', () => {
    it('GET /admin/appointments returns all appointments with patient info', async () => {
      const mockAppointments = [
        {
          id: 'app_1',
          member_id: 'mem_1',
          patient_name: 'Trần Hữu Nam',
          doctor_name: 'TS.BS Trần Văn A',
          appointment_date: '2026-11-13T09:00:00.000Z',
          purpose: 'Tái khám định kỳ theo dõi chỉ số',
          status: 'scheduled',
        },
      ];
      mockPool.query.mockResolvedValueOnce({ rows: mockAppointments });
      const handler = getHandler('get', '/admin/appointments');
      const { req, res } = createReqRes();

      await handler(req, res);
      expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('FROM appointments a'));
      expect(res.json).toHaveBeenCalledWith({ data: mockAppointments });
    });

    it('GET /admin/appointments handles database errors gracefully', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('DB Query Failure'));
      const handler = getHandler('get', '/admin/appointments');
      const { req, res } = createReqRes();

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Query Failure' });
    });
  });
});

