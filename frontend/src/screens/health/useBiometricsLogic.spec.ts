import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBiometricsLogic } from './useBiometricsLogic';

describe('useBiometricsLogic Hook TDD', () => {
  it('khởi tạo với chỉ số active là huyết áp bp và 8 nhóm metrics sinh trắc', () => {
    const { result } = renderHook(() => useBiometricsLogic());
    expect(result.current.activeMetric).toBe('bp');
    expect(result.current.metricsSummaries.length).toBe(8);
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
