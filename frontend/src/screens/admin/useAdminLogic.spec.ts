import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdminLogic } from './useAdminLogic';

describe('useAdminLogic Hook', () => {
  it('khởi tạo với tab active là overview, stats ban đầu và trạng thái sức khỏe dịch vụ', () => {
    const { result } = renderHook(() => useAdminLogic());
    expect(result.current.activeTab).toBe('overview');
    expect(result.current.stats.totalFacilities).toBe(5);
    expect(result.current.health.minio).toBeDefined();
  });

  it('chuyển tab sang quản trị cơ sở y tế facilities', () => {
    const { result } = renderHook(() => useAdminLogic());
    act(() => {
      result.current.setActiveTab('facilities');
    });
    expect(result.current.activeTab).toBe('facilities');
  });
});
