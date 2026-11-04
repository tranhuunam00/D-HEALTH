import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdminUsersLogic } from './useAdminUsersLogic';

describe('useAdminUsersLogic Hook', () => {
  it('khởi tạo với meta phân trang mặc định trang 1', () => {
    const { result } = renderHook(() => useAdminUsersLogic());
    expect(result.current.meta.page).toBe(1);
    expect(result.current.meta.limit).toBe(10);
    expect(result.current.isAddModalOpen).toBe(false);
  });

  it('hỗ trợ mở và đóng Modal thêm người dùng', () => {
    const { result } = renderHook(() => useAdminUsersLogic());
    act(() => {
      result.current.setIsAddModalOpen(true);
    });
    expect(result.current.isAddModalOpen).toBe(true);

    act(() => {
      result.current.setIsAddModalOpen(false);
    });
    expect(result.current.isAddModalOpen).toBe(false);
  });
});
