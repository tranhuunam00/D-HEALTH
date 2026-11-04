import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHomeLogic } from './useHomeLogic';

describe('useHomeLogic Hook', () => {
  it('khởi tạo với trạng thái activeMemberId là nam và điểm sức khỏe chưa có số đo', () => {
    const { result } = renderHook(() => useHomeLogic());
    expect(result.current.activeMemberId).toBe('nam');
    expect(result.current.healthScore.status).toBe('Chưa có số đo');
  });

  it('cập nhật trạng thái checkin khi người dùng chọn cảm xúc hôm nay', () => {
    const { result } = renderHook(() => useHomeLogic());
    act(() => {
      result.current.handleQuickCheckin('Khỏe mạnh');
    });
    expect(result.current.checkinStatus).toBe('Khỏe mạnh');
  });

  it('hỗ trợ mở và đóng BottomSheet nhập nhanh số đo', () => {
    const { result } = renderHook(() => useHomeLogic());
    act(() => {
      result.current.setIsVitalsSheetOpen(true);
    });
    expect(result.current.isVitalsSheetOpen).toBe(true);

    act(() => {
      result.current.setIsVitalsSheetOpen(false);
    });
    expect(result.current.isVitalsSheetOpen).toBe(false);
  });

  it('không tự động bịa số đo khi chưa có trong CSDL (Zero Mock Rule)', () => {
    const { result } = renderHook(() => useHomeLogic('empty-user-member'));
    expect(result.current.latestBp).toBe('--/--');
    expect(result.current.latestHr).toBe('--');
    expect(result.current.latestWeight).toBe('--');
    expect(result.current.latestGlucose).toBe('--');
  });
});
