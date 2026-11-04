import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLabsLogic } from './useLabsLogic';

describe('useLabsLogic Hook TDD', () => {
  it('khởi tạo với danh mục Tất cả và danh sách phiếu xét nghiệm', () => {
    const { result } = renderHook(() => useLabsLogic());
    expect(result.current.selectedCategory).toBe('all');
    expect(result.current.reports.length).toBeGreaterThanOrEqual(3);
  });

  it('lọc danh sách phiếu xét nghiệm theo chuyên khoa sinh hoá', () => {
    const { result } = renderHook(() => useLabsLogic());
    act(() => {
      result.current.setSelectedCategory('biochemistry');
    });
    expect(result.current.selectedCategory).toBe('biochemistry');
    expect(result.current.filteredReports.every(r => r.category === 'biochemistry')).toBe(true);
  });
});
