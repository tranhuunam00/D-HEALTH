import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecordsLogic } from './useRecordsLogic';

describe('useRecordsLogic Hook TDD', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('lấy thông tin thể trạng và 9 chỉ số hồ sơ y tế từ API', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          member: {
            id: 'nam',
            fullName: 'Trần Hữu Nam',
            gender: 'Nam',
            age: 46,
            heightCm: 174,
            weightKg: 72.5,
            bmi: 23.9,
            bloodType: 'O+',
          },
          counts: {
            allergies: 1,
            chronic: 2,
            meds: 3,
            labs: 24,
            imaging: 7,
            pathology: 2,
            documents: 31,
            doctors: 6,
            facilities: 4,
          },
        },
      }),
    });

    const { result } = renderHook(() => useRecordsLogic('nam'));

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.member?.fullName).toBe('Trần Hữu Nam');
    expect(result.current.member?.age).toBe(46);
    expect(result.current.member?.bmi).toBe(23.9);
    expect(result.current.member?.bloodType).toBe('O+');
    expect(result.current.counts.allergies).toBe(1);
    expect(result.current.counts.chronic).toBe(2);
    expect(result.current.counts.meds).toBe(3);
    expect(result.current.counts.labs).toBe(24);
    expect(result.current.counts.imaging).toBe(7);
    expect(result.current.counts.pathology).toBe(2);
  });
});
