import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ScreenHeaderPills } from './ScreenHeaderPills';

describe('ScreenHeaderPills Molecule Component TDD', () => {
  it('render đồng bộ 100% hai pill: ngày hôm nay và Hồ sơ sức khoẻ kèm ChevronDown', () => {
    const handleSelect = vi.fn();
    render(
      <ScreenHeaderPills
        activeMemberName="Trần Minh Khang"
        dateText="26/10/2026"
        onSelectMember={handleSelect}
      />
    );

    // 1. Kiểm tra Date pill
    expect(screen.getByText('Hôm nay: 26/10/2026')).toBeDefined();

    // 2. Kiểm tra Health Profile pill
    expect(screen.getByText(/Hồ sơ sức khoẻ:/)).toBeDefined();
    expect(screen.getByText('Trần Minh Khang')).toBeDefined();

    // 3. Tương tác bấm chọn thành viên
    const profileBtn = screen.getByRole('button', { name: /Đổi hồ sơ thành viên/i });
    fireEvent.click(profileBtn);
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it('sử dụng giá trị mặc định chuẩn khi không truyền props', () => {
    render(<ScreenHeaderPills />);
    expect(screen.getByText('Hôm nay: 26/10/2026')).toBeDefined();
    expect(screen.getByText(/Hồ sơ sức khoẻ:/)).toBeDefined();
  });
});
