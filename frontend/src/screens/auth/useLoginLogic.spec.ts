import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLoginLogic } from './useLoginLogic';

describe('useLoginLogic Hook', () => {
  it('khởi tạo với chế độ login và các trường rỗng', () => {
    const { result } = renderHook(() => useLoginLogic());
    expect(result.current.mode).toBe('login');
    expect(result.current.identifier).toBe('');
    expect(result.current.password).toBe('');
  });

  it('báo lỗi khi bấm Đăng nhập mà chưa nhập thông tin', async () => {
    const { result } = renderHook(() => useLoginLogic());
    await act(async () => {
      await result.current.handleLogin();
    });
    expect(result.current.errorMsg).toContain('Vui lòng nhập đầy đủ');
  });

  it('hỗ trợ chuyển đổi tab giữa login và register', () => {
    const { result } = renderHook(() => useLoginLogic());
    act(() => {
      result.current.setMode('register');
    });
    expect(result.current.mode).toBe('register');
  });
});
