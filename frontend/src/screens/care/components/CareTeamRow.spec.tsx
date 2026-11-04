import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { CareTeamRow } from './CareTeamRow';
import type { CareTeamMember } from '../useCareLogic';

describe('CareTeamRow Component TDD', () => {
  const mockTeam: CareTeamMember[] = [
    { id: 'hd', code: 'HD', name: 'Trần Minh Hương', role: 'Gia đình', color: 'mint', phone: '0987', email: 'huong@dhealth.vn' },
    { id: 'tb', code: 'TB', name: 'BS Trần Văn B', role: 'Tim mạch', color: 'pink', phone: '0912', email: 'b@dhealth.vn' },
    { id: 'lc', code: 'LC', name: 'BS Lê Văn C', role: 'CĐHA', color: 'purple', phone: '0913', email: 'c@dhealth.vn' },
  ];

  it('render đầy đủ tiêu đề, các thành viên HD, TB, LC và nút Thêm bác sĩ', () => {
    const handleSelect = vi.fn();
    const handleAdd = vi.fn();

    render(
      <CareTeamRow
        team={mockTeam}
        selectedId="tb"
        onSelectMember={handleSelect}
        onAddDoctor={handleAdd}
      />
    );

    expect(screen.getByText('My Care Team')).toBeDefined();
    expect(screen.getByText('Chạm để xem, sửa liên hệ')).toBeDefined();
    expect(screen.getByText('Gia đình')).toBeDefined();
    expect(screen.getByText('Tim mạch')).toBeDefined();
    expect(screen.getByText('CĐHA')).toBeDefined();
    expect(screen.getByText('Thêm bác sĩ')).toBeDefined();

    fireEvent.click(screen.getByText('CĐHA'));
    expect(handleSelect).toHaveBeenCalledWith('lc');

    fireEvent.click(screen.getByText('Thêm bác sĩ'));
    expect(handleAdd).toHaveBeenCalled();
  });
});
