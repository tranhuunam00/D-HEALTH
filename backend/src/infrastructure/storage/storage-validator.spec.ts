import { describe, it, expect } from 'vitest';
import { validateStorageParams } from './storage-validator';
import { StorageValidationError } from '../../domain/storage/storage.errors';

describe('validateStorageParams TDD', () => {
  it('thành công với bucket hợp lệ và objectKey chuẩn (Happy Path)', () => {
    const result = validateStorageParams('dhealth-avatars', 'users/user-123.jpg', 1800);
    expect(result.bucket).toBe('dhealth-avatars');
    expect(result.objectKey).toBe('users/user-123.jpg');
    expect(result.expirySeconds).toBe(1800);
  });

  it('gán giá trị mặc định 3600 khi expirySeconds không truyền vào (Boundary)', () => {
    const result = validateStorageParams('dhealth-reports', 'reports/lab-999.pdf');
    expect(result.expirySeconds).toBe(3600);
  });

  it('ném lỗi StorageValidationError khi bucket không nằm trong whitelist (Error)', () => {
    expect(() => validateStorageParams('hack-bucket' as any, 'file.txt')).toThrow(
      StorageValidationError
    );
    try {
      validateStorageParams('' as any, 'file.txt');
    } catch (err: any) {
      expect(err).toBeInstanceOf(StorageValidationError);
      expect(err.code).toBe('INVALID_BUCKET');
    }
  });

  it('ném lỗi StorageValidationError khi objectKey rỗng hoặc chứa path traversal nguy hiểm (Security Error)', () => {
    expect(() => validateStorageParams('dhealth-avatars', '')).toThrow(StorageValidationError);
    expect(() => validateStorageParams('dhealth-avatars', '../../etc/passwd')).toThrow(
      StorageValidationError
    );
    expect(() => validateStorageParams('dhealth-avatars', '..\\config.json')).toThrow(
      StorageValidationError
    );
    expect(() => validateStorageParams('dhealth-avatars', '/root/avatar.png')).toThrow(
      StorageValidationError
    );
  });

  it('ném lỗi khi expirySeconds vượt quá giới hạn 7 ngày hoặc nhỏ hơn 60 giây (Boundary Error)', () => {
    expect(() => validateStorageParams('dhealth-dicom', 'scan.dcm', 30)).toThrow(
      StorageValidationError
    );
    expect(() => validateStorageParams('dhealth-dicom', 'scan.dcm', 700000)).toThrow(
      StorageValidationError
    );
  });
});
