import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBiometricsLogic } from './useBiometricsLogic';

describe('useBiometricsLogic Hook TDD', () => {
  it('khởi tạo với chỉ số active là huyết áp bp và 5 bản ghi lịch sử đo', () => {
    const { result } = renderHook(() => useBiometricsLogic());
    expect(result.current.activeMetric).toBe('bp');
    expect(result.current.history.length).toBeLessThanOrEqual(5);
    expect(result.current.isEntrySheetOpen).toBe(false);
  });

  it('chuyển đổi chỉ số active sang nhịp tim hr', () => {
    const { result } = renderHook(() => useBiometricsLogic());
    act(() => {
      result.current.setActiveMetric('hr');
    });
    expect(result.current.activeMetric).toBe('hr');
  });

  it('hỗ trợ mở và đóng bottom sheet nhập số đo sinh trắc', () => {
    const { result } = renderHook(() => useBiometricsLogic());
    act(() => {
      result.current.openEntrySheet();
    });
    expect(result.current.isEntrySheetOpen).toBe(true);

    act(() => {
      result.current.closeEntrySheet();
    });
    expect(result.current.isEntrySheetOpen).toBe(false);
  });
});
