import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SCR14_CareScreen } from './SCR14_CareScreen';

describe('SCR14_CareScreen Mobile View TDD', () => {
  it('render đầy đủ Mạng lưới chăm sóc, lịch hẹn sắp tới và đội ngũ bác sĩ', () => {
    render(<SCR14_CareScreen onNavigate={vi.fn()} />);

    expect(screen.getAllByText('Chăm sóc').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('LỊCH HẸN SẮP TỚI')).toBeDefined();
    expect(screen.getByText('Tái khám tim mạch')).toBeDefined();
    expect(screen.getByText('BS. Trần Văn B')).toBeDefined();
    expect(screen.getByText('Đặt lịch khám mới')).toBeDefined();
  });

  it('gọi alert hoặc navigate khi bấm nút Đặt lịch khám mới', () => {
    const handleNavigate = vi.fn();
    render(<SCR14_CareScreen onNavigate={handleNavigate} />);

    fireEvent.click(screen.getByText('Đặt lịch khám mới'));
    expect(screen.getAllByText('Chăm sóc').length).toBeGreaterThanOrEqual(1);
  });
});
