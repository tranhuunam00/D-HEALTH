import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SCR17_EmergencyScreen } from './SCR17_EmergencyScreen';

describe('SCR17_EmergencyScreen Mobile View TDD', () => {
  it('render đầy đủ Thẻ cấp cứu, nhóm máu O+, cảnh báo dị ứng và số điện thoại người nhà', () => {
    render(<SCR17_EmergencyScreen onNavigate={vi.fn()} />);

    expect(screen.getByText('EMERGENCY HEALTH CARD')).toBeDefined();
    expect(screen.getByText('Trần Hữu Nam')).toBeDefined();
    expect(screen.getByText('O+')).toBeDefined();
    expect(screen.getByText(/Penicillin/)).toBeDefined();
    expect(screen.getByText(/0988 777 666/)).toBeDefined();
    expect(screen.getByText('Gọi Cấp Cứu 115')).toBeDefined();
  });

  it('gọi onNavigate khi bấm nút đóng', () => {
    const handleNavigate = vi.fn();
    render(<SCR17_EmergencyScreen onNavigate={handleNavigate} />);

    fireEvent.click(screen.getByLabelText('Đóng'));
    expect(handleNavigate).toHaveBeenCalledWith('home');
  });
});
