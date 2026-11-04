import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MinioStorageService } from './minio-storage.service';
import { StorageValidationError, StorageOperationError } from '../../domain/storage/storage.errors';

describe('MinioStorageService TDD', () => {
  let mockMinioClient: any;
  let service: MinioStorageService;

  beforeEach(() => {
    mockMinioClient = {
      listBuckets: vi.fn(),
      bucketExists: vi.fn(),
      makeBucket: vi.fn(),
      setBucketPolicy: vi.fn(),
      presignedPutObject: vi.fn(),
      presignedGetObject: vi.fn(),
    };
    service = new MinioStorageService(mockMinioClient, 'minio', 9000);
  });

  describe('checkHealth()', () => {
    it('trả về status connected và danh sách buckets khi MinIO hoạt động (Happy Path)', async () => {
      mockMinioClient.listBuckets.mockResolvedValue([
        { name: 'dhealth-reports' },
        { name: 'dhealth-avatars' },
      ]);

      const health = await service.checkHealth();
      expect(health.status).toBe('connected');
      expect(health.buckets).toEqual(['dhealth-reports', 'dhealth-avatars']);
      expect(health.endpoint).toBe('minio');
      expect(health.port).toBe(9000);
    });

    it('trả về status error và ghi nhận lỗi khi không kết nối được MinIO (Error Resilience)', async () => {
      mockMinioClient.listBuckets.mockRejectedValue(
        new Error('getaddrinfo ENOTFOUND minio')
      );

      const health = await service.checkHealth();
      expect(health.status).toBe('error');
      expect(health.buckets).toEqual([]);
      expect(health.error).toContain('ENOTFOUND minio');
    });
  });

  describe('ensureBuckets()', () => {
    it('tạo các bucket chưa tồn tại và thiết lập policy thành công (Happy Path)', async () => {
      mockMinioClient.bucketExists.mockResolvedValue(false);
      mockMinioClient.makeBucket.mockResolvedValue(undefined);
      mockMinioClient.setBucketPolicy.mockResolvedValue(undefined);

      await expect(service.ensureBuckets()).resolves.toBeUndefined();
      expect(mockMinioClient.makeBucket).toHaveBeenCalledTimes(4);
    });

    it('bỏ qua tạo bucket nếu bucket đã tồn tại sẵn (Idempotency)', async () => {
      mockMinioClient.bucketExists.mockResolvedValue(true);

      await service.ensureBuckets();
      expect(mockMinioClient.makeBucket).not.toHaveBeenCalled();
    });

    it('ném lỗi StorageOperationError khi makeBucket thất bại (Error)', async () => {
      mockMinioClient.bucketExists.mockResolvedValue(false);
      mockMinioClient.makeBucket.mockRejectedValue(new Error('S3 Access Denied'));

      await expect(service.ensureBuckets()).rejects.toThrow(StorageOperationError);
    });
  });

  describe('getPresignedUploadUrl()', () => {
    it('tạo presigned PUT URL thành công (Happy Path)', async () => {
      mockMinioClient.presignedPutObject.mockResolvedValue('https://minio.test/upload-url');

      const url = await service.getPresignedUploadUrl(
        'dhealth-avatars',
        'users/avatar.jpg',
        1800
      );
      expect(url).toBe('https://minio.test/upload-url');
      expect(mockMinioClient.presignedPutObject).toHaveBeenCalledWith(
        'dhealth-avatars',
        'users/avatar.jpg',
        1800
      );
    });

    it('ném StorageValidationError khi bucket không hợp lệ (Boundary/Error)', async () => {
      await expect(
        service.getPresignedUploadUrl('invalid' as any, 'file.txt')
      ).rejects.toThrow(StorageValidationError);
    });

    it('ném StorageOperationError khi MinIO client ném lỗi (Error)', async () => {
      mockMinioClient.presignedPutObject.mockRejectedValue(new Error('Connection reset'));

      await expect(
        service.getPresignedUploadUrl('dhealth-avatars', 'avatar.jpg')
      ).rejects.toThrow(StorageOperationError);
    });
  });

  describe('getPresignedDownloadUrl()', () => {
    it('tạo presigned GET URL thành công (Happy Path)', async () => {
      mockMinioClient.presignedGetObject.mockResolvedValue('https://minio.test/download-url');

      const url = await service.getPresignedDownloadUrl(
        'dhealth-reports',
        'lab/report-1.pdf',
        3600
      );
      expect(url).toBe('https://minio.test/download-url');
    });

    it('ném StorageValidationError khi objectKey không an toàn (Security)', async () => {
      await expect(
        service.getPresignedDownloadUrl('dhealth-reports', '../passwd')
      ).rejects.toThrow(StorageValidationError);
    });
  });
});
