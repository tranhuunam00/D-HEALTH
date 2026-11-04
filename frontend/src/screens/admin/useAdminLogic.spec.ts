import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAdminLogic } from './useAdminLogic';

describe('useAdminLogic Hook (Zero Mock Rule)', () => {
  const mockOverview = {
    totalUsers: 2,
    totalMembers: 5,
    totalFacilities: 5,
    totalDoctors: 3,
    totalMedications: 5,
    totalClinicalReports: 1,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('admin/overview')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: mockOverview }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ data: [], services: { database: 'connected', minio: 'connected' } }),
      });
    });
  });

  it('lấy số liệu thống kê hệ thống từ CSDL (/api/admin/overview)', async () => {
    const { result } = renderHook(() => useAdminLogic());
    expect(result.current.activeTab).toBe('overview');

    await waitFor(() => {
      expect(result.current.stats.totalFacilities).toBe(5);
      expect(result.current.stats.totalDoctors).toBe(3);
    });
  });

  it('chuyển tab sang quản trị cơ sở y tế facilities', () => {
    const { result } = renderHook(() => useAdminLogic());
    act(() => {
      result.current.setActiveTab('facilities');
    });
    expect(result.current.activeTab).toBe('facilities');
  });
});
