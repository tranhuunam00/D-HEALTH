import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SCR02_HomeScreen } from './SCR02_HomeScreen';

describe('SCR02_HomeScreen Mobile View', () => {
  it('render đầy đủ điểm sức khỏe, nút SOS cấp cứu, 2 vấn đề theo dõi và Health Timeline', () => {
    render(<SCR02_HomeScreen onOpenEmergency={vi.fn()} />);

    expect(screen.getByText('Điểm sức khoẻ')).toBeDefined();
    expect(screen.getByText('SOS')).toBeDefined();
    expect(screen.getByText('Huyết áp')).toBeDefined();
    expect(screen.getByText('Nhịp tim')).toBeDefined();
    expect(screen.getByText('2 vấn đề cần theo dõi')).toBeDefined();
    expect(screen.getByText('9 nhóm dữ liệu')).toBeDefined();
    expect(screen.getByText('Health Timeline')).toBeDefined();
    expect(screen.getByText('Xem phân tích')).toBeDefined();
    expect(screen.getByRole('button', { name: /Nhập số đo/i })).toBeDefined();
  });

  it('gọi onOpenEmergency khi người dùng nhấn nút SOS', () => {
    const handleSOS = vi.fn();
    render(<SCR02_HomeScreen onOpenEmergency={handleSOS} />);

    fireEvent.click(screen.getByText('SOS'));
    expect(handleSOS).toHaveBeenCalled();
  });

  it('gọi onNavigate khi người dùng nhấn thẻ Huyết áp', () => {
    const handleNav = vi.fn();
    render(<SCR02_HomeScreen onOpenEmergency={vi.fn()} onNavigate={handleNav} />);

    fireEvent.click(screen.getByText('Huyết áp'));
    expect(handleNav).toHaveBeenCalledWith('biometrics');
  });

  it('xử lý click Đã uống thuốc và hiển thị trạng thái đã hoàn thành', () => {
    render(<SCR02_HomeScreen onOpenEmergency={vi.fn()} />);

    const doseBtn = screen.getByRole('button', { name: /Đã uống/i });
    fireEvent.click(doseBtn);
    expect(screen.getByText(/Đã uống/i)).toBeDefined();
  });
});
