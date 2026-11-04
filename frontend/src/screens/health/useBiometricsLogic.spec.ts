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

  it('không tự động bịa số đo mặc định khi CSDL chưa có dữ liệu (Zero Mock Rule)', () => {
    const { result } = renderHook(() => useBiometricsLogic('empty-user-id'));
    const bp = result.current.metricsSummaries.find((m) => m.id === 'bp');
    const hr = result.current.metricsSummaries.find((m) => m.id === 'hr');
    const spo2 = result.current.metricsSummaries.find((m) => m.id === 'spo2');
    expect(bp?.value).toBe('--/--');
    expect(hr?.value).toBe('--');
    expect(spo2?.value).toBe('--');
  });
});
