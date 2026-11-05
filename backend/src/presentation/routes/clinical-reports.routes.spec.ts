import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClinicalReportsRouter, ensureClinicalReportsSchema } from './clinical-reports.routes';

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

  describe('ensureClinicalReportsSchema', () => {
    it('thực thi câu lệnh ALTER TABLE ADD COLUMN IF NOT EXISTS an toàn', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [] });
      await ensureClinicalReportsSchema(mockPool);
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('ALTER TABLE clinical_reports')
      );
    });

    it('không làm crash khi câu lệnh ALTER TABLE gặp lỗi kết nối', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('Connection lost'));
      await expect(ensureClinicalReportsSchema(mockPool)).resolves.not.toThrow();
    });
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

    it('xử lý lỗi DB khi truy vấn danh sách thất bại', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('DB failure'));

      const handler = getHandler('GET', '/:memberId');
      const { req, res } = createReqRes({ params: { memberId: 'mem_1' } });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(false);
      expect(output.error.code).toBe('DB_ERROR');
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

  describe('GET /detail/:reportId', () => {
    it('trả về chi tiết phiếu kết quả và chuỗi xung series khi tìm thấy', async () => {
      mockPool.query
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'rep_img_03',
              title: 'MRI gan có tiêm thuốc',
              study_id: 'std_img_03',
              modality: 'MRI',
              facility_name: '[Bệnh viện đối tác]',
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            { id: 'ser_1', series_name: 'T1 + thuốc', series_number: 1 },
            { id: 'ser_2', series_name: 'T2', series_number: 2 },
          ],
        });

      const handler = getHandler('GET', '/detail/:reportId');
      const { req, res } = createReqRes({ params: { reportId: 'rep_img_03' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.title).toBe('MRI gan có tiêm thuốc');
      expect(output.data.series.length).toBe(2);
    });

    it('trả về 404 khi không tìm thấy phiếu kết quả', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      const handler = getHandler('GET', '/detail/:reportId');
      const { req, res } = createReqRes({ params: { reportId: 'non_existent' } });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(false);
      expect(output.error.code).toBe('NOT_FOUND');
    });
  });

  describe('GET /evaluations/:memberId', () => {
    it('trả về đánh giá đáp ứng khối u RECIST 1.1 từ CSDL', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'tte_1',
            study_id: 'std_img_03',
            organ: 'Gan',
            recist_response: 'PR',
            baseline_sum_diameters_mm: 60,
            current_sum_diameters_mm: 38,
            treatment_response_note: '–36,7% so với ban đầu',
          },
        ],
      });

      const handler = getHandler('GET', '/evaluations/:memberId');
      const { req, res } = createReqRes({ params: { memberId: 'nam' } });

      await handler(req, res);
      expect(res.json).toHaveBeenCalled();
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.recist_response).toBe('PR');
      expect(output.data.baseline_sum_diameters_mm).toBe(60);
    });
  });

  describe('POST /', () => {
    it('tạo mới phiếu kết quả cận lâm sàng thành công với đầy đủ bác sĩ và thông tin', async () => {
      // 1. SELECT columns
      mockPool.query
        .mockResolvedValueOnce({
          rows: [
            { column_name: 'id' },
            { column_name: 'member_id' },
            { column_name: 'kind' },
            { column_name: 'category' },
            { column_name: 'title' },
            { column_name: 'performed_at' },
            { column_name: 'facility_name' },
            { column_name: 'ordering_doctor_name' },
            { column_name: 'conclusion' },
          ],
        })
        // 2. INSERT clinical_reports
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'rep_new_1',
              member_id: 'mem_1',
              kind: 'lab',
              category: 'SH',
              title: 'Sinh hóa máu',
              performed_at: '2026-10-26',
              ordering_doctor_name: 'BS Trần Văn B',
            },
          ],
        });

      const handler = getHandler('POST', '/');
      const { req, res } = createReqRes({
        body: {
          memberId: 'mem_1',
          kind: 'lab',
          category: 'SH',
          title: 'Sinh hóa máu',
          performedAt: '2026-10-26',
          facilityName: 'Bệnh viện Bạch Mai',
          doctorName: 'BS Trần Văn B',
          conclusion: 'Bình thường',
        },
      });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.id).toBe('rep_new_1');
    });

    it('tự động thích ứng khi CSDL cũ chưa có cột ordering_doctor_name mà có ordering_doctor', async () => {
      // 1. SELECT columns (legacy schema)
      mockPool.query
        .mockResolvedValueOnce({
          rows: [
            { column_name: 'id' },
            { column_name: 'member_id' },
            { column_name: 'kind' },
            { column_name: 'category' },
            { column_name: 'title' },
            { column_name: 'performed_at' },
            { column_name: 'ordering_doctor' },
            { column_name: 'summary' },
          ],
        })
        // 2. INSERT clinical_reports
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'rep_legacy',
              member_id: 'mem_1',
              kind: 'lab',
              title: 'Huyết học',
            },
          ],
        });

      const handler = getHandler('POST', '/');
      const { req, res } = createReqRes({
        body: {
          memberId: 'mem_1',
          kind: 'lab',
          title: 'Huyết học',
          doctorName: 'BS Lê Văn C',
          conclusion: 'Ổn định',
        },
      });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      const insertCall = mockPool.query.mock.calls.find((call: any[]) =>
        call[0].includes('INSERT INTO clinical_reports')
      );
      expect(insertCall).toBeDefined();
      expect(insertCall[0]).toContain('ordering_doctor');
      expect(insertCall[0]).not.toContain('ordering_doctor_name');
    });

    it('tạo mới phiếu CĐHA kèm danh sách khối u và định dạng số thập phân có dấu phẩy', async () => {
      mockPool.query
        .mockResolvedValueOnce({
          rows: [
            { column_name: 'id' },
            { column_name: 'member_id' },
            { column_name: 'kind' },
            { column_name: 'category' },
            { column_name: 'title' },
            { column_name: 'specimen_site' },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'rep_img_new',
              member_id: 'mem_1',
              kind: 'imaging',
              category: 'MRI',
              title: 'MRI gan có tiêm thuốc',
            },
          ],
        })
        .mockResolvedValueOnce({ rows: [] }) // imaging_studies
        .mockResolvedValueOnce({ rows: [] }); // tumor_tracking_evaluations

      const handler = getHandler('POST', '/');
      const { req, res } = createReqRes({
        body: {
          memberId: 'mem_1',
          kind: 'imaging',
          category: 'MRI',
          title: 'MRI gan có tiêm thuốc',
          organ: 'Gan',
          lesions: [
            { type: 'Khối u đặc', size: '20,5', side: 'Hạ phân thùy VI' },
            { type: 'Khối u đặc', size: '15.5', side: 'Hạ phân thùy VII' },
          ],
        },
      });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(true);
      expect(output.data.id).toBe('rep_img_new');
    });

    it('trả về 400 khi thiếu thông tin bắt buộc (memberId, kind, title)', async () => {
      const handler = getHandler('POST', '/');

      // Thiếu memberId
      const { req: req1, res: res1 } = createReqRes({ body: { kind: 'lab', title: 'T' } });
      await handler(req1, res1);
      expect(res1.status).toHaveBeenCalledWith(400);

      // Thiếu kind
      const { req: req2, res: res2 } = createReqRes({ body: { memberId: 'm1', title: 'T' } });
      await handler(req2, res2);
      expect(res2.status).toHaveBeenCalledWith(400);

      // Thiếu title
      const { req: req3, res: res3 } = createReqRes({ body: { memberId: 'm1', kind: 'lab' } });
      await handler(req3, res3);
      expect(res3.status).toHaveBeenCalledWith(400);
    });

    it('trả về 500 với mã DB_ERROR khi truy vấn INSERT gặp lỗi cơ sở dữ liệu', async () => {
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ column_name: 'id' }] })
        .mockRejectedValueOnce(new Error('Fatal database constraint error'));

      const handler = getHandler('POST', '/');
      const { req, res } = createReqRes({
        body: {
          memberId: 'mem_1',
          kind: 'lab',
          title: 'Sinh hóa',
        },
      });

      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      const output = res.json.mock.calls[0][0];
      expect(output.success).toBe(false);
      expect(output.error.code).toBe('DB_ERROR');
    });
  });
});
