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
    expect(screen.getByText('Nền tảng sức khoẻ')).toBeDefined();
    expect(screen.getByText('Apple Health')).toBeDefined();
    expect(screen.getByText('Google Health Connect')).toBeDefined();
    expect(screen.getByText('Đồng hồ thông minh')).toBeDefined();
    expect(screen.getByText('Apple Watch')).toBeDefined();
    expect(screen.getByText('Thiết bị y tế')).toBeDefined();
    expect(screen.getByText('Máy đo huyết áp')).toBeDefined();
    expect(screen.getByText(/D-Health chỉ đọc những loại dữ liệu/)).toBeDefined();
  });

  it('gọi onNavigate khi bấm nút quay lại', () => {
    const handleNavigate = vi.fn();
    render(<SCR04_DevicesScreen onNavigate={handleNavigate} />);

    fireEvent.click(screen.getByLabelText('Quay lại'));
    expect(handleNavigate).toHaveBeenCalledWith('biometrics');
  });
});
