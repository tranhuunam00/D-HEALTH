import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { SCR16_FamilyProfilesScreen } from './SCR16_FamilyProfilesScreen';

describe('SCR16_FamilyProfilesScreen Mobile View TDD', () => {
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
    {
      id: 'duc_anh',
      full_name: 'Trần Đức Anh',
      relationship: 'child',
      birth_date: '2012-11-05',
      gender: 'Nam',
      blood_type: 'O+',
      is_above_18: false,
      consent_approved: true,
    },
    {
      id: 'hoa',
      full_name: 'Bà Lê Thị Hoa',
      relationship: 'parent',
      birth_date: '1955-06-15',
      gender: 'Nữ',
      blood_type: 'B+',
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

  it('render danh sách hồ sơ gia đình từ CSDL, Consent Gate theo Nghị định 13/2023 và nút thêm thành viên', async () => {
    const handleNavigate = vi.fn();
    const handleSelectMember = vi.fn();

    render(
      <SCR16_FamilyProfilesScreen
        onNavigate={handleNavigate}
        onSelectMember={handleSelectMember}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Trần Hữu Nam')).toBeDefined();
    });

    expect(screen.getByText('Hồ sơ gia đình')).toBeDefined();
    expect(screen.getByText('Tuân thủ Nghị định 13/2023/NĐ-CP')).toBeDefined();
    expect(screen.getByText('Nguyễn Thị Mai')).toBeDefined();
    expect(screen.getByText('Trần Đức Anh')).toBeDefined();
    expect(screen.getByText('Bà Lê Thị Hoa')).toBeDefined();
    expect(screen.getAllByText('Đã đồng thuận chia sẻ').length).toBeGreaterThan(0);
  });

  it('gọi onSelectMember khi bấm chọn xem hồ sơ của một thành viên', async () => {
    const handleSelectMember = vi.fn();

    render(
      <SCR16_FamilyProfilesScreen
        onNavigate={vi.fn()}
        onSelectMember={handleSelectMember}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Trần Hữu Nam')).toBeDefined();
    });

    const selectButtons = screen.getAllByText('Chọn xem hồ sơ');
    fireEvent.click(selectButtons[0]);
    expect(handleSelectMember).toHaveBeenCalledWith('nam');
  });
});
