import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SCR12_CameraInputScreen } from './SCR12_CameraInputScreen';

describe('SCR12_CameraInputScreen Mobile View TDD', () => {
  it('render đầy đủ trình nhập kết quả cận lâm sàng, nút chụp ảnh và nút lưu hồ sơ', () => {
    render(<SCR12_CameraInputScreen onNavigate={vi.fn()} />);

    expect(screen.getByText('Nhập kết quả cận lâm sàng')).toBeDefined();
    expect(screen.getByText('Xét nghiệm máu')).toBeDefined();
    expect(screen.getByText('Báo cáo CĐHA')).toBeDefined();
    expect(screen.getAllByText('Đơn thuốc').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Chụp ảnh phiếu khám/)).toBeDefined();
    expect(screen.getByText('Lưu vào hồ sơ sức khoẻ')).toBeDefined();
  });

  it('gọi onNavigate khi bấm nút quay lại', () => {
    const handleNavigate = vi.fn();
    render(<SCR12_CameraInputScreen onNavigate={handleNavigate} />);

    fireEvent.click(screen.getByLabelText('Quay lại'));
    expect(handleNavigate).toHaveBeenCalledWith('records');
  });
});
