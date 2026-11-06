import { Capacitor } from '@capacitor/core';

// Địa chỉ máy chủ Backend D-HEALTH mặc định cho ứng dụng Mobile Native
export const DEFAULT_REMOTE_API = 'http://103.90.227.173:7102';

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
 * Tự động chuyển tiếp các cuộc gọi fetch('/api/...') sang remote backend
 * khi ứng dụng được khởi chạy dưới dạng Mobile Native App.
 */
export const initNativeFetchInterceptor = (): void => {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch;
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) return;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    let url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

    if (url.startsWith('/api/')) {
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

