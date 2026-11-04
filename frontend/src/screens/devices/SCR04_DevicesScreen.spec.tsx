import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SCR04_DevicesScreen } from './SCR04_DevicesScreen';

describe('SCR04_DevicesScreen Mobile View TDD', () => {
  it('render tiêu đề Kết nối thiết bị, danh sách thiết bị và nút Quét Bluetooth', () => {
    render(<SCR04_DevicesScreen onNavigate={vi.fn()} />);

    expect(screen.getByText('Kết nối thiết bị')).toBeDefined();
    expect(screen.getByText(/thiết bị đang kết nối/)).toBeDefined();
    expect(screen.getByText('Quét tìm thiết bị mới')).toBeDefined();
    expect(screen.getByText('Omron HEM-7600T')).toBeDefined();
    expect(screen.getByText('Apple Watch Series 9')).toBeDefined();
  });

  it('gọi onNavigate khi bấm nút quay lại', () => {
    const handleNavigate = vi.fn();
    render(<SCR04_DevicesScreen onNavigate={handleNavigate} />);

    fireEvent.click(screen.getByLabelText('Quay lại'));
    expect(handleNavigate).toHaveBeenCalledWith('biometrics');
  });
});
