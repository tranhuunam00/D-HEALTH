import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLabsLogic } from './useLabsLogic';

describe('useLabsLogic Hook TDD', () => {
  const mockLabReports = [
    { id: 'rep_nam_01', title: 'Sinh hoá máu', category: 'SH', performed_at: '2026-10-20', facility_name: 'Bệnh viện Bạch Mai', conclusion: '10/12 chỉ số trong giới hạn' },
    { id: 'rep_nam_02', title: 'Tổng phân tích tế bào máu', category: 'HH', performed_at: '2026-10-20', facility_name: 'Bệnh viện Bạch Mai', conclusion: 'Bình thường' },
    { id: 'rep_nam_03', title: 'HbA1c', category: 'SH', performed_at: '2026-10-20', facility_name: 'Bệnh viện Bạch Mai', conclusion: '6,6% đạt mục tiêu' },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: mockLabReports }),
    } as any);
  });

  it('khởi tạo với danh mục Tất cả và tải danh sách phiếu xét nghiệm từ database', async () => {
    const { result } = renderHook(() => useLabsLogic('nam'));

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.selectedCategory).toBe('all');
    expect(result.current.reports.length).toBeGreaterThanOrEqual(3);
  });

  it('lọc danh sách phiếu xét nghiệm theo chuyên khoa sinh hoá SH', async () => {
    const { result } = renderHook(() => useLabsLogic('nam'));

    await act(async () => {
      await result.current.refetch();
    });

    act(() => {
      result.current.setSelectedCategory('SH');
    });
    expect(result.current.selectedCategory).toBe('SH');
    expect(result.current.filteredReports.every((r) => r.categoryBadge === 'SH')).toBe(true);
  });

  it('hỗ trợ toggle bật tắt chỉ số theo dõi', () => {
    const { result } = renderHook(() => useLabsLogic('nam'));
    expect(result.current.trackedMetricIds).toContain('hba1c');
    act(() => {
      result.current.toggleTrackedMetric('hba1c');
    });
    expect(result.current.trackedMetricIds).not.toContain('hba1c');
  });
});
