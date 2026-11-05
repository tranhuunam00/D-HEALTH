import { Router, Request, Response } from 'express';
import { MinioStorageService } from '../../infrastructure/storage/minio-storage.service';
import { StorageValidationError, StorageOperationError } from '../../domain/storage/storage.errors';

function handleStorageError(err: any, res: Response): Response {
  if (err instanceof StorageValidationError) {
    return res.status(400).json({
      success: false,
      code: err.code,
      message: err.message,
    });
  }
  if (err instanceof StorageOperationError) {
    return res.status(502).json({
      success: false,
      code: 'STORAGE_ERROR',
      message: err.message,
    });
  }
  return res.status(500).json({
    success: false,
    code: 'INTERNAL_ERROR',
    message: err.message || 'Lỗi xử lý tệp tin',
  });
}

export function createStorageRouter(storageService: MinioStorageService): Router {
  const router = Router();


  router.post('/upload', async (req: Request, res: Response) => {
    try {
      const { bucket = 'dhealth-avatars', objectKey, dataBase64, contentType } = req.body;
      if (!dataBase64) {
        return res.status(400).json({ success: false, code: 'VALIDATION_ERROR', message: 'Thiếu dữ liệu tệp tin dataBase64' });
      }

      // Tách header base64 nếu có data:image/...;base64,
      let base64Clean = dataBase64;
      let detectedType = contentType || 'image/jpeg';
      if (dataBase64.includes(';base64,')) {
        const parts = dataBase64.split(';base64,');
        detectedType = parts[0].replace('data:', '') || detectedType;
        base64Clean = parts[1];
      }

      const buffer = Buffer.from(base64Clean, 'base64');
      const ext = detectedType.includes('png') ? 'png' : detectedType.includes('webp') ? 'webp' : 'jpg';
      const key = objectKey || `avatars/avt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

      const url = await storageService.uploadDirect(bucket, key, buffer, detectedType);
      return res.status(200).json({
        success: true,
        data: { url, bucket, objectKey: key, size: buffer.length },
      });
    } catch (err: any) {
      return handleStorageError(err, res);
    }
  });

  router.post('/presigned-upload', async (req: Request, res: Response) => {
    try {
      const { bucket, objectKey, expirySeconds } = req.body;
      const url = await storageService.getPresignedUploadUrl(bucket, objectKey, expirySeconds);
      return res.status(200).json({
        success: true,
        data: { url, bucket, objectKey, expiresIn: expirySeconds ?? 3600 },
      });
    } catch (err: any) {
      return handleStorageError(err, res);
    }
  });

  router.get('/presigned-download', async (req: Request, res: Response) => {
    try {
      const { bucket, objectKey, expirySeconds } = req.query;
      const expiry = expirySeconds ? parseInt(expirySeconds as string, 10) : undefined;
      const url = await storageService.getPresignedDownloadUrl(
        bucket as any,
        objectKey as string,
        expiry
      );
      return res.status(200).json({
        success: true,
        data: { url, bucket, objectKey },
      });
    } catch (err: any) {
      return handleStorageError(err, res);
    }
  });

  router.get('/health', async (_req: Request, res: Response) => {
    const health = await storageService.checkHealth();
    return res.status(health.status === 'connected' ? 200 : 503).json(health);
  });

  return router;
}
