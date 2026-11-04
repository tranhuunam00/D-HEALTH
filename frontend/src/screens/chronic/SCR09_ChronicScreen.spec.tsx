import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SCR09_ChronicScreen } from './SCR09_ChronicScreen';

describe('SCR09_ChronicScreen Mobile View TDD', () => {
  it('render đầy đủ bệnh mạn tính, mục tiêu điều trị và checklist việc cần làm', () => {
    render(<SCR09_ChronicScreen onNavigate={vi.fn()} />);

    expect(screen.getAllByText('Sức khoẻ').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Bệnh mạn tính')).toBeDefined();
    expect(screen.getByText(/Tăng huyết áp vô căn/)).toBeDefined();
    expect(screen.getByText(/Đái tháo đường type 2/)).toBeDefined();
    expect(screen.getByText('Việc cần làm tiếp theo')).toBeDefined();
    expect(screen.getByText(/Đặt lịch tái khám/)).toBeDefined();
  });

  it('gọi onNavigate khi bấm nút Đặt lịch tái khám', () => {
    const handleNavigate = vi.fn();
    render(<SCR09_ChronicScreen onNavigate={handleNavigate} />);

    fireEvent.click(screen.getByText(/Đặt lịch tái khám/));
    expect(handleNavigate).toHaveBeenCalledWith('care');
  });
});
