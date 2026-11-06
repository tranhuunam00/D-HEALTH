import { Capacitor } from '@capacitor/core';

// Địa chỉ máy chủ Backend D-HEALTH mặc định cho ứng dụng Mobile Native (HTTPS)
export const DEFAULT_REMOTE_API = 'https://dhealth.home-care.vn';

/**
 * Trả về địa chỉ Base URL phù hợp cho môi trường hiện tại:
 * - Khi chạy Web: trả về chuỗi rỗng '' để Nginx / Vite proxy xử lý tương đối.
 * - Khi chạy App Mobile Native (Android / iOS): trả về URL máy chủ D-HEALTH.
 */
export const getApiBaseUrl = (): string => {
  const envApi = (import.meta as any).env?.VITE_API_URL;
  if (envApi) return envApi.replace(/\/+$/, '');

  if (Capacitor.isNativePlatform()) {
    return DEFAULT_REMOTE_API;
  }
  return '';
};

/**
 * Chuẩn hóa URL ảnh đại diện hoặc tệp tin media:
 * - Nếu là ảnh data base64 hoặc URL tuyệt đối (http/https): giữ nguyên.
 * - Nếu là đường dẫn tương đối (/s3/... hoặc /api/...): tự động gắn base URL máy chủ remote khi chạy native.
 */
export const formatAvatarUrl = (url?: string | null): string => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const base = getApiBaseUrl();
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * Tự động chuyển tiếp các cuộc gọi fetch('/api/...') hoặc fetch('/s3/...') sang remote backend
 * khi ứng dụng được khởi chạy dưới dạng Mobile Native App.
 */
export const initNativeFetchInterceptor = (): void => {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch;
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) return;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    let url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

    if (url.startsWith('/api/') || url.startsWith('/s3/')) {
      url = `${baseUrl}${url}`;
      if (typeof input === 'string' || input instanceof URL) {
        return originalFetch(url, init);
      } else {
        const newRequest = new Request(url, input);
        return originalFetch(newRequest, init);
      }
    }

    return originalFetch(input, init);
  };
};

