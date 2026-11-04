import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { SCR17_FamilyProfilesScreen } from './SCR17_FamilyProfilesScreen';

describe('SCR17_FamilyProfilesScreen Mobile View TDD', () => {
  const mockFamilyMembers = [
    {
      id: 'nam',
      full_name: 'Trần Hữu Nam',
      relationship: 'owner',
      birth_date: '1980-04-12',
      gender: 'Nam',
      blood_type: 'O+',
      is_above_18: true,
      consent_approved: true,
    },
    {
      id: 'mai',
      full_name: 'Nguyễn Thị Mai',
      relationship: 'spouse',
      birth_date: '1983-09-20',
      gender: 'Nữ',
      blood_type: 'A+',
      is_above_18: true,
      consent_approved: true,
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: mockFamilyMembers,
      }),
    });
  });

  it('render đầy đủ danh sách Hồ sơ gia đình, các thành viên và trạng thái Nghị định 13', async () => {
    render(<SCR17_FamilyProfilesScreen onNavigate={vi.fn()} onSelectMember={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Trần Hữu Nam')).toBeDefined();
    });

    expect(screen.getByText('Hồ sơ gia đình')).toBeDefined();
    expect(screen.getByText('Thêm người thân')).toBeDefined();
    expect(screen.getByText('Nguyễn Thị Mai')).toBeDefined();
    expect(screen.getByText(/Nghị định 13/)).toBeDefined();
  });

  it('gọi onSelectMember khi bấm nút Chọn xem hồ sơ', async () => {
    const handleSelect = vi.fn();
    render(<SCR17_FamilyProfilesScreen onNavigate={vi.fn()} onSelectMember={handleSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Trần Hữu Nam')).toBeDefined();
    });

    fireEvent.click(screen.getAllByText('Chọn xem hồ sơ')[0]);
    expect(handleSelect).toHaveBeenCalledWith('nam');
  });
});
