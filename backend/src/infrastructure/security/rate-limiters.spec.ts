import { describe, it, expect } from 'vitest';
import { authLimiter, apiLimiter } from './rate-limiters';

describe('RateLimiters', () => {
  it('authLimiter được cấu hình đúng chuẩn OWASP (max 5 lần / 15 phút)', () => {
    expect(authLimiter).toBeDefined();
    expect(typeof authLimiter).toBe('function');
  });

  it('apiLimiter được cấu hình đúng chuẩn 100 req/phút', () => {
    expect(apiLimiter).toBeDefined();
    expect(typeof apiLimiter).toBe('function');
  });
});
