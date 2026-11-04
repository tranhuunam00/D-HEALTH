import { Client } from 'minio';
import {
  StorageBucket,
  StorageHealth,
  ALLOWED_STORAGE_BUCKETS,
} from '../../domain/storage/storage.types';
import { StorageOperationError } from '../../domain/storage/storage.errors';
import { validateStorageParams } from './storage-validator';

export class MinioStorageService {
  constructor(
    private readonly client: Client,
    private readonly endpoint: string,
    private readonly port: number
  ) {}

  async checkHealth(): Promise<StorageHealth> {
    try {
      const bucketList = await this.client.listBuckets();
      return {
        status: 'connected',
        buckets: bucketList.map((b) => b.name),
        endpoint: this.endpoint,
        port: this.port,
      };
    } catch (err: any) {
      return {
        status: 'error',
        buckets: [],
        endpoint: this.endpoint,
        port: this.port,
        error: err.message,
      };
    }
  }

  private async setupBucketPolicy(bucket: string): Promise<void> {
    if (bucket !== 'dhealth-avatars' && bucket !== 'dhealth-reports') return;
    const policy = JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucket}/*`],
        },
      ],
    });
    try {
      await this.client.setBucketPolicy(bucket, policy);
    } catch {}
  }

  async ensureBuckets(): Promise<void> {
    try {
      for (const bucket of ALLOWED_STORAGE_BUCKETS) {
        const exists = await this.client.bucketExists(bucket);
        if (!exists) {
          await this.client.makeBucket(bucket);
          await this.setupBucketPolicy(bucket);
        }
      }
    } catch (err: any) {
      throw new StorageOperationError(
        'BUCKET_INIT_FAILED',
        `Khởi tạo S3 Buckets thất bại: ${err.message}`
      );
    }
  }

  async getPresignedUploadUrl(
    bucket: StorageBucket,
    objectKey: string,
    expirySeconds?: number
  ): Promise<string> {
    const valid = validateStorageParams(bucket, objectKey, expirySeconds);
    try {
      return await this.client.presignedPutObject(
        valid.bucket,
        valid.objectKey,
        valid.expirySeconds
      );
    } catch (err: any) {
      throw new StorageOperationError(
        'PRESIGNED_UPLOAD_FAILED',
        `Tạo presigned upload URL thất bại: ${err.message}`
      );
    }
  }

  async getPresignedDownloadUrl(
    bucket: StorageBucket,
    objectKey: string,
    expirySeconds?: number
  ): Promise<string> {
    const valid = validateStorageParams(bucket, objectKey, expirySeconds);
    try {
      return await this.client.presignedGetObject(
        valid.bucket,
        valid.objectKey,
        valid.expirySeconds
      );
    } catch (err: any) {
      throw new StorageOperationError(
        'PRESIGNED_DOWNLOAD_FAILED',
        `Tạo presigned download URL thất bại: ${err.message}`
      );
    }
  }
}
