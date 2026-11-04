import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLabsLogic } from './useLabsLogic';

describe('useLabsLogic Hook TDD', () => {
  it('khởi tạo với danh mục Tất cả và danh sách phiếu xét nghiệm', () => {
    const { result } = renderHook(() => useLabsLogic());
    expect(result.current.selectedCategory).toBe('all');
    expect(result.current.reports.length).toBeGreaterThanOrEqual(3);
  });

  it('lọc danh sách phiếu xét nghiệm theo chuyên khoa sinh hoá SH', () => {
    const { result } = renderHook(() => useLabsLogic());
    act(() => {
      result.current.setSelectedCategory('SH');
    });
    expect(result.current.selectedCategory).toBe('SH');
    expect(result.current.filteredReports.every((r) => r.categoryBadge === 'SH')).toBe(true);
  });

  it('hỗ trợ toggle bật tắt chỉ số theo dõi', () => {
    const { result } = renderHook(() => useLabsLogic());
    expect(result.current.trackedMetricIds).toContain('hba1c');
    act(() => {
      result.current.toggleTrackedMetric('hba1c');
    });
    expect(result.current.trackedMetricIds).not.toContain('hba1c');
  });
});
