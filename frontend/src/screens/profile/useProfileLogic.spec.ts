import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProfileLogic } from './useProfileLogic';

describe('useProfileLogic Hook', () => {
  it('tự động tính đúng chỉ số BMI từ chiều cao và cân nặng khi có số liệu', () => {
    const mockUser: any = { id: 'usr_1', heightCm: 172, weightKg: 68 };
    const { result } = renderHook(() => useProfileLogic(mockUser));
    // 68kg / (1.72m)^2 = 22.98 -> 23.0
    expect(result.current.bmi).toBe('23.0');
  });

  it('trả về BMI là -- khi chưa có chiều cao cân nặng', () => {
    const { result } = renderHook(() => useProfileLogic());
    expect(result.current.bmi).toBe('--');
  });

  it('hỗ trợ mở và đóng BottomSheet chỉnh sửa hồ sơ', () => {
    const { result } = renderHook(() => useProfileLogic());
    act(() => {
      result.current.setIsEditOpen(true);
    });
    expect(result.current.isEditOpen).toBe(true);

    act(() => {
      result.current.setIsEditOpen(false);
    });
    expect(result.current.isEditOpen).toBe(false);
  });
});
