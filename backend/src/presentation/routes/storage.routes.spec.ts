import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { createStorageRouter } from './storage.routes';
import { StorageValidationError, StorageOperationError } from '../../domain/storage/storage.errors';

describe('Storage Routes TDD', () => {
  let app: express.Application;
  let mockStorageService: any;

  beforeEach(() => {
    mockStorageService = {
      getPresignedUploadUrl: vi.fn(),
      getPresignedDownloadUrl: vi.fn(),
      checkHealth: vi.fn(),
    };

    app = express();
    app.use(express.json());
    app.use('/api/storage', createStorageRouter(mockStorageService));
  });

  describe('POST /api/storage/presigned-upload', () => {
    it('trả về 200 và presigned upload url khi request hợp lệ (Happy Path)', async () => {
      mockStorageService.getPresignedUploadUrl.mockResolvedValue('https://minio.test/upload/avatar.jpg');

      const res = await request(app)
        .post('/api/storage/presigned-upload')
        .send({
          bucket: 'dhealth-avatars',
          objectKey: 'users/123/avatar.jpg',
          expirySeconds: 1800,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.url).toBe('https://minio.test/upload/avatar.jpg');
      expect(res.body.data.bucket).toBe('dhealth-avatars');
    });

    it('trả về 400 khi validation thất bại (Boundary/Error)', async () => {
      mockStorageService.getPresignedUploadUrl.mockRejectedValue(
        new StorageValidationError('INVALID_BUCKET', 'Bucket không hợp lệ')
      );

      const res = await request(app)
        .post('/api/storage/presigned-upload')
        .send({ bucket: 'hack' });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('INVALID_BUCKET');
    });

    it('trả về 502 khi MinIO gặp sự cố kết nối (Error Resilience)', async () => {
      mockStorageService.getPresignedUploadUrl.mockRejectedValue(
        new StorageOperationError('PRESIGNED_UPLOAD_FAILED', 'MinIO unreachable')
      );

      const res = await request(app)
        .post('/api/storage/presigned-upload')
        .send({ bucket: 'dhealth-avatars', objectKey: 'test.jpg' });

      expect(res.status).toBe(502);
      expect(res.body.code).toBe('STORAGE_ERROR');
    });
  });

  describe('GET /api/storage/presigned-download', () => {
    it('trả về 200 và download URL khi query hợp lệ (Happy Path)', async () => {
      mockStorageService.getPresignedDownloadUrl.mockResolvedValue('https://minio.test/download/doc.pdf');

      const res = await request(app)
        .get('/api/storage/presigned-download')
        .query({ bucket: 'dhealth-reports', objectKey: 'lab/doc.pdf' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.url).toBe('https://minio.test/download/doc.pdf');
    });

    it('trả về 400 khi thiếu tham số query (Boundary/Error)', async () => {
      mockStorageService.getPresignedDownloadUrl.mockRejectedValue(
        new StorageValidationError('INVALID_OBJECT_KEY', 'Khóa đối tượng không được để trống')
      );

      const res = await request(app).get('/api/storage/presigned-download');

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('INVALID_OBJECT_KEY');
    });
  });
});
