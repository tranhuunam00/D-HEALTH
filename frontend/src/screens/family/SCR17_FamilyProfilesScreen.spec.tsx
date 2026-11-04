import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SCR17_FamilyProfilesScreen } from './SCR17_FamilyProfilesScreen';

describe('SCR17_FamilyProfilesScreen Mobile View TDD', () => {
  it('render đầy đủ danh sách Hồ sơ gia đình, các thành viên và trạng thái Nghị định 13', () => {
    render(<SCR17_FamilyProfilesScreen onNavigate={vi.fn()} onSelectMember={vi.fn()} />);

    expect(screen.getByText('Hồ sơ gia đình')).toBeDefined();
    expect(screen.getByText('Thêm người thân')).toBeDefined();
    expect(screen.getByText('Trần Hữu Nam')).toBeDefined();
    expect(screen.getByText('Nguyễn Thị Mai')).toBeDefined();
    expect(screen.getByText(/Nghị định 13/)).toBeDefined();
  });

  it('gọi onSelectMember khi bấm nút Chọn xem hồ sơ', () => {
    const handleSelect = vi.fn();
    render(<SCR17_FamilyProfilesScreen onNavigate={vi.fn()} onSelectMember={handleSelect} />);

    fireEvent.click(screen.getAllByText('Chọn xem hồ sơ')[0]);
    expect(handleSelect).toHaveBeenCalled();
  });
});
