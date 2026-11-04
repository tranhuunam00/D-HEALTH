import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useImagingLogic } from './useImagingLogic';

describe('useImagingLogic Hook TDD', () => {
  it('khởi tạo với danh mục Tất cả và danh sách ca CĐHA', () => {
    const { result } = renderHook(() => useImagingLogic());
    expect(result.current.selectedModality).toBe('all');
    expect(result.current.studies.length).toBeGreaterThanOrEqual(3);
  });

  it('lọc danh sách CĐHA theo modality MRI', () => {
    const { result } = renderHook(() => useImagingLogic());
    act(() => {
      result.current.setSelectedModality('mri');
    });
    expect(result.current.selectedModality).toBe('mri');
    expect(result.current.filteredStudies.every(s => s.modality === 'mri')).toBe(true);
  });
});
