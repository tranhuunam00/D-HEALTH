import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFamilyLogic } from './useFamilyLogic';

describe('useFamilyLogic Hook TDD (Zero Mock Rule)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('lấy danh sách thành viên gia đình trực tiếp từ CSDL (/api/members)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            id: 'nam',
            full_name: 'Trần Hữu Nam',
            relationship: 'owner',
            gender: 'Nam',
            birth_date: '1980-04-12',
            blood_type: 'O+',
            is_above_18: true,
            consent_approved: true,
          },
          {
            id: 'mai',
            full_name: 'Nguyễn Thị Mai',
            relationship: 'spouse',
            gender: 'Nữ',
            birth_date: '1983-09-20',
            blood_type: 'A+',
            is_above_18: true,
            consent_approved: true,
          },
        ],
      }),
    });

    const { result } = renderHook(() => useFamilyLogic());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.members).toHaveLength(2);
    });

    const nam = result.current.members[0];
    expect(nam.fullName).toBe('Trần Hữu Nam');
    expect(nam.relationshipText).toBe('Chủ tài khoản');
    expect(nam.bloodType).toBe('O+');
    expect(nam.age).toBeGreaterThan(40);
  });

  it('trả về mảng rỗng khi cơ sở dữ liệu chưa có thành viên (không dùng mock)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });

    const { result } = renderHook(() => useFamilyLogic());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.members).toEqual([]);
    });
  });

  it('xử lý an toàn khi API gặp sự cố mạng (500)', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error 500'));

    const { result } = renderHook(() => useFamilyLogic());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.members).toEqual([]);
    });
  });
});

