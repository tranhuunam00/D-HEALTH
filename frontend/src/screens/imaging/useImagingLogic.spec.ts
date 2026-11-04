import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useImagingLogic } from './useImagingLogic';

describe('useImagingLogic Hook TDD', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('khởi tạo với modality ALL và các toggle mặc định bật', () => {
    const { result } = renderHook(() => useImagingLogic('nam'));
    expect(result.current.selectedModality.toUpperCase()).toBe('ALL');
    expect(result.current.trackLesionsEnabled).toBe(true);
    expect(result.current.recistEnabled).toBe(true);
  });

  it('lọc danh sách CĐHA theo modality MRI hoặc SA', async () => {
    const mockData = [
      { id: 'rep_1', title: 'MRI gan', category: 'MRI', performed_at: '2026-08-20' },
      { id: 'rep_2', title: 'Siêu âm thận', category: 'SA', performed_at: '2026-08-22' },
      { id: 'rep_3', title: 'CT ngực', category: 'CT', performed_at: '2026-10-08' },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockData }),
    });

    const { result } = renderHook(() => useImagingLogic('nam'));

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.studies.length).toBe(3);

    act(() => {
      result.current.setSelectedModality('MRI');
    });

    expect(result.current.filteredStudies.length).toBe(1);
    expect(result.current.filteredStudies[0].modality).toBe('MRI');

    act(() => {
      result.current.setSelectedModality('SA');
    });

    expect(result.current.filteredStudies.length).toBe(1);
    expect(result.current.filteredStudies[0].modality).toBe('SA');

    act(() => {
      result.current.setSelectedModality('ALL');
    });

    expect(result.current.filteredStudies.length).toBe(3);
  });

  it('cho phép bật tắt toggle Theo dõi tổn thương và RECIST 1.1', () => {
    const { result } = renderHook(() => useImagingLogic('nam'));

    act(() => {
      result.current.setTrackLesionsEnabled(false);
      result.current.setRecistEnabled(false);
    });

    expect(result.current.trackLesionsEnabled).toBe(false);
    expect(result.current.recistEnabled).toBe(false);
  });

  it('xử lý lỗi khi API trả về rỗng hoặc thất bại mà không crash', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useImagingLogic('unknown_user'));

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.studies).toEqual([]);
  });
});
