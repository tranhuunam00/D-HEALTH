import {
  ALLOWED_STORAGE_BUCKETS,
  StorageBucket,
} from '../../domain/storage/storage.types';
import { StorageValidationError } from '../../domain/storage/storage.errors';

const MIN_EXPIRY = 60; // 1 phút
const MAX_EXPIRY = 604800; // 7 ngày
const DEFAULT_EXPIRY = 3600; // 1 giờ

export interface ValidatedStorageParams {
  readonly bucket: StorageBucket;
  readonly objectKey: string;
  readonly expirySeconds: number;
}

export function validateStorageParams(
  bucket: StorageBucket,
  objectKey: string,
  expirySeconds?: number
): ValidatedStorageParams {
  if (!ALLOWED_STORAGE_BUCKETS.includes(bucket)) {
    throw new StorageValidationError('INVALID_BUCKET', 'Tên bucket không hợp lệ');
  }

  if (!objectKey || typeof objectKey !== 'string' || objectKey.trim() === '') {
    throw new StorageValidationError('INVALID_OBJECT_KEY', 'Khóa đối tượng không được để trống');
  }

  if (objectKey.startsWith('/') || objectKey.includes('..') || objectKey.includes('\\')) {
    throw new StorageValidationError('INVALID_OBJECT_KEY', 'Khóa đối tượng chứa ký tự không an toàn');
  }

  const expiry = expirySeconds ?? DEFAULT_EXPIRY;
  if (expiry < MIN_EXPIRY || expiry > MAX_EXPIRY) {
    throw new StorageValidationError('INVALID_EXPIRY', 'Thời gian hiệu lực phải từ 60 đến 604800 giây');
  }

  return Object.freeze({
    bucket,
    objectKey: objectKey.trim(),
    expirySeconds: expiry,
  });
}
