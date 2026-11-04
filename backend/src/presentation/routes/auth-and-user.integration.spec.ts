import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { createAuthRouter } from './auth.routes';
import { createAdminUsersRouter } from './admin-users.routes';
import { createUserProfileRouter } from './user-profile.routes';
import { authenticate, requireRole } from '../middlewares/auth-middleware';
import { generateToken } from '../../infrastructure/security/token-provider';

describe('Auth & User Management Integration Test (E2E API Flows)', () => {
  let app: Express;
  let mockPool: any;

  beforeEach(() => {
    mockPool = {
      query: vi.fn(),
    };
    app = express();
    app.use(express.json());
    app.use(cookieParser());

    // Public auth routes
    app.use('/api/auth', createAuthRouter(mockPool));

    // Protected patient profile routes
    app.use('/api/user/profile', authenticate, createUserProfileRouter(mockPool));

    // Protected admin routes (requires ADMIN, SUPER_ADMIN or CLINICAL_ADMIN)
    app.use(
      '/api/admin/users',
      authenticate,
      requireRole('super_admin', 'clinical_admin', 'ADMIN'),
      createAdminUsersRouter(mockPool)
    );
  });

  // =========================================================================
  // 1. HAPPY PATH INTEGRATION FLOW (REGISTER -> LOGIN -> GET PROFILE)
  // =========================================================================
  describe('Happy Path Integration Flow', () => {
    it('đăng ký tài khoản -> đăng nhập lấy JWT -> truy cập hồ sơ chính chủ thành công', async () => {
      // 1.1 Đăng ký: Query 1 là INSERT users, Query 2 là INSERT family_members
      mockPool.query
        .mockResolvedValueOnce({
          rows: [{ id: 'user_e2e_1', phone_number: '0988776655', email: 'e2e@dhealth.vn' }],
        })
        .mockResolvedValueOnce({ rows: [] });

      const regRes = await request(app).post('/api/auth/register').send({
        phoneNumber: '0988776655',
        fullName: 'Trần Văn E2E',
        password: 'SecurePassword2026',
      });

      expect(regRes.status).toBe(201);
      expect(regRes.body.success).toBe(true);
      expect(regRes.body.data.user.phone_number).toBe('0988776655');

      // 1.2 Đăng nhập
      const bcrypt = await import('bcryptjs');
      const hash = await bcrypt.hash('SecurePassword2026', 10);

      mockPool.query
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'user_e2e_1',
              phone_number: '0988776655',
              email: 'e2e@dhealth.vn',
              password_hash: hash,
              locked_until: null,
              failed_attempts: 0,
            },
          ],
        })
        .mockResolvedValueOnce({ rows: [{ full_name: 'Trần Văn E2E' }] });

      const loginRes = await request(app).post('/api/auth/login').send({
        identifier: '0988776655',
        password: 'SecurePassword2026',
      });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body.success).toBe(true);
      const token = loginRes.body.data.token;
      expect(token).toBeDefined();

      // 1.3 Truy cập hồ sơ được bảo vệ với token vừa nhận
      mockPool.query
        .mockResolvedValueOnce({ rows: [{ id: 'user_e2e_1', phone_number: '0988776655', email: 'e2e@dhealth.vn' }] })
        .mockResolvedValueOnce({ rows: [{ full_name: 'Trần Văn E2E', relationship: 'owner', blood_type: 'O+' }] });

      const profileRes = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(profileRes.status).toBe(200);
      expect(profileRes.body.success).toBe(true);
      expect(profileRes.body.data.user.phone_number).toBe('0988776655');
    });
  });

  // =========================================================================
  // 2. BOUNDARY CASES (GIÁ TRỊ BIÊN)
  // =========================================================================
  describe('Boundary & Edge Input Cases', () => {
    it('xử lý chuỗi rỗng và body rỗng {} -> trả về lỗi biên 400', async () => {
      const res = await request(app).post('/api/auth/register').send({});
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('xử lý giá trị phân trang biên: page âm, limit quá lớn (> 100) -> tự động chuẩn hóa', async () => {
      const adminToken = generateToken({ userId: 'adm_1', role: 'super_admin' });

      mockPool.query
        .mockResolvedValueOnce({ rows: [{ count: '10' }] })
        .mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .get('/api/admin/users?page=-5&limit=9999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.limit).toBe(100);
    });

    it('xử lý tìm kiếm với ký tự đặc biệt SQL injection tiềm ẩn -> an toàn qua tham số hóa', async () => {
      const adminToken = generateToken({ userId: 'adm_1', role: 'super_admin' });

      mockPool.query
        .mockResolvedValueOnce({ rows: [{ count: '0' }] })
        .mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .get("/api/admin/users?search=' OR '1'='1")
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // =========================================================================
  // 3. ERROR & EXCEPTION CASES (DẠNG LỖI & NGOẠI LỆ)
  // =========================================================================
  describe('Error, Status Codes & Exception Resilience Cases', () => {
    it('trả về 409 CONFLICT khi số điện thoại đã tồn tại trong hệ thống (vi phạm Unique Constraint 23505)', async () => {
      mockPool.query.mockRejectedValueOnce({ code: '23505', message: 'duplicate key value violates unique constraint' });

      const res = await request(app).post('/api/auth/register').send({
        phoneNumber: '0912345678',
        fullName: 'Nguyen Van A',
        password: 'password123',
      });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('CONFLICT');
    });

    it('trả về 401 UNAUTHORIZED khi đăng nhập với số điện thoại không tồn tại', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).post('/api/auth/login').send({
        identifier: '0900000000',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('trả về 401 UNAUTHORIZED khi gọi API quản trị mà không có token', async () => {
      const res = await request(app).get('/api/admin/users');
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('trả về 401 UNAUTHORIZED khi token giả mạo hoặc sai chữ ký', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', 'Bearer forged.invalid.token');

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('INVALID_TOKEN');
    });

    it('trả về 403 FORBIDDEN_ROLE khi người dùng là PATIENT cố truy cập API của ADMIN', async () => {
      const patientToken = generateToken({ userId: 'patient_u1', role: 'patient' });

      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${patientToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN_ROLE');
    });

    it('trả về 400 FORBIDDEN_SELF_DELETE khi tài khoản admin cố tự xóa chính mình', async () => {
      const adminToken = generateToken({ userId: 'adm_target_id', role: 'super_admin' });

      const res = await request(app)
        .delete('/api/admin/users/adm_target_id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('FORBIDDEN_SELF_DELETE');
    });

    it('trả về 404 NOT_FOUND khi xóa người dùng không tồn tại', async () => {
      const adminToken = generateToken({ userId: 'adm_current', role: 'super_admin' });

      mockPool.query
        .mockResolvedValueOnce({ rowCount: 0 })
        .mockResolvedValueOnce({ rowCount: 0 });

      const res = await request(app)
        .delete('/api/admin/users/non_existent_id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('trả về 500 DB_ERROR khi cơ sở dữ liệu ngắt kết nối', async () => {
      const adminToken = generateToken({ userId: 'adm_current', role: 'super_admin' });
      mockPool.query.mockRejectedValueOnce(new Error('Connection terminated unexpectedly'));

      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(500);
      expect(res.body.error.code).toBe('DB_ERROR');
    });
  });
});
