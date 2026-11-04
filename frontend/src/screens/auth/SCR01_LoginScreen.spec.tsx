import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SCR01_LoginScreen } from './SCR01_LoginScreen';

describe('SCR01_LoginScreen Mobile View', () => {
  it('render đầy đủ logo D-HEALTH, nút Google và form đăng nhập', () => {
    render(<SCR01_LoginScreen onLoginSuccess={vi.fn()} />);

    expect(screen.getByText('D-HEALTH')).toBeDefined();
    expect(screen.getByText('Tiếp tục với Google')).toBeDefined();
    expect(screen.getByRole('button', { name: /Đăng nhập/i })).toBeDefined();
  });

  it('chuyển đổi sang form Đăng ký khi click tab Đăng Ký Mới', () => {
    render(<SCR01_LoginScreen onLoginSuccess={vi.fn()} />);

    const registerTab = screen.getByRole('button', { name: /Đăng Ký Mới/i });
    fireEvent.click(registerTab);

    expect(screen.getByLabelText(/Họ và tên bệnh nhân/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Đăng Ký Hồ Sơ Sức Khỏe/i })).toBeDefined();
  });
});
