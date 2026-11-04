import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { SCR16_FamilyProfilesScreen } from './SCR16_FamilyProfilesScreen';

describe('SCR16_FamilyProfilesScreen Mobile View TDD', () => {
  it('render danh sách hồ sơ gia đình, Consent Gate theo Nghị định 13/2023 và nút thêm thành viên', async () => {
    const handleNavigate = vi.fn();
    const handleSelectMember = vi.fn();

    await act(async () => {
      render(
        <SCR16_FamilyProfilesScreen
          onNavigate={handleNavigate}
          onSelectMember={handleSelectMember}
        />
      );
    });

    expect(screen.getByText('Hồ sơ gia đình')).toBeDefined();
    expect(screen.getByText('Tuân thủ Nghị định 13/2023/NĐ-CP')).toBeDefined();
    expect(screen.getByText('Trần Hữu Nam')).toBeDefined();
    expect(screen.getByText('Nguyễn Thị Mai')).toBeDefined();
    expect(screen.getByText('Trần Đức Anh')).toBeDefined();
    expect(screen.getByText('Bà Lê Thị Hoa')).toBeDefined();
    expect(screen.getAllByText('Đã đồng thuận chia sẻ').length).toBeGreaterThan(0);
  });

  it('gọi onSelectMember khi bấm chọn xem hồ sơ của một thành viên', async () => {
    const handleSelectMember = vi.fn();

    await act(async () => {
      render(
        <SCR16_FamilyProfilesScreen
          onNavigate={vi.fn()}
          onSelectMember={handleSelectMember}
        />
      );
    });

    const selectButtons = screen.getAllByText('Chọn xem hồ sơ');
    fireEvent.click(selectButtons[0]);
    expect(handleSelectMember).toHaveBeenCalledWith('mem-1');
  });
});
