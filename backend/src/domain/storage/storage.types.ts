export interface StorageHealth {
  status: 'connected' | 'disconnected' | 'error';
  buckets: string[];
  endpoint: string;
  port: number;
  error?: string;
}

export type StorageBucket = 
  | 'dhealth-reports' 
  | 'dhealth-dicom' 
  | 'dhealth-avatars' 
  | 'dhealth-prescriptions';

export const ALLOWED_STORAGE_BUCKETS: readonly StorageBucket[] = Object.freeze([
  'dhealth-reports',
  'dhealth-dicom',
  'dhealth-avatars',
  'dhealth-prescriptions',
]);

export interface PresignedUrlRequest {
  bucket: StorageBucket;
  objectKey: string;
  expirySeconds?: number;
}

export interface PresignedUrlResponse {
  url: string;
  bucket: StorageBucket;
  objectKey: string;
  expiresIn: number;
}
