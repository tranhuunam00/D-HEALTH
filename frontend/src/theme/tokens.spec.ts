import { describe, it, expect } from 'vitest';
import { DesignTokens } from './tokens';

describe('DesignTokens', () => {
  it('chứa mã màu Primary Teal #1F7A8C chuẩn của thương hiệu', () => {
    expect(DesignTokens.colors.primaryTeal.toLowerCase()).toBe('#1f7a8c');
    expect(DesignTokens.colors.accentBlue.toLowerCase()).toBe('#2f6fdb');
  });

  it('đáp ứng chuẩn công thái học Touch Target >= 44pt (WCAG 2.1 AA)', () => {
    expect(DesignTokens.touch.minTargetPt).toBeGreaterThanOrEqual(44);
  });

  it('chứa cấu hình bo góc chuẩn cho Mobile Bottom Sheet (28px) và Card (24px)', () => {
    expect(DesignTokens.radius.bottomSheetTop).toBe('28px');
    expect(DesignTokens.radius.card).toBe('24px');
  });
});
