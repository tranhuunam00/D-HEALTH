import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHomeLogic } from './useHomeLogic';

describe('useHomeLogic Hook', () => {
  it('khởi tạo với trạng thái activeMemberId là me và điểm sức khỏe mặc định', () => {
    const { result } = renderHook(() => useHomeLogic());
    expect(result.current.activeMemberId).toBe('me');
    expect(result.current.healthScore.total).toBe(88);
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
});
