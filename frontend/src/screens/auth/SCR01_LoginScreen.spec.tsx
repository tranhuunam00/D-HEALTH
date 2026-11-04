import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SCR01_LoginScreen } from './SCR01_LoginScreen';

describe('SCR01_LoginScreen Mobile View', () => {
  it('render đầy đủ logo D-HEALTH, nút sinh trắc học, nút Google và nút Đăng nhập', () => {
    render(<SCR01_LoginScreen onLoginSuccess={vi.fn()} />);

    expect(screen.getByText(/D.HEALTH/i)).toBeDefined();
    expect(screen.getByText('TRỢ LÝ SỨC KHOẺ THÔNG MINH')).toBeDefined();
    expect(screen.getByText('Đăng nhập bằng sinh trắc học')).toBeDefined();
    expect(screen.getByText('Tiếp tục với Google')).toBeDefined();
    expect(screen.getByRole('button', { name: /^Đăng nhập$/i })).toBeDefined();
  });

  it('chuyển đổi sang form Đăng ký khi click liên kết Đăng ký', () => {
    render(<SCR01_LoginScreen onLoginSuccess={vi.fn()} />);

    const registerBtn = screen.getByRole('button', { name: /^Đăng ký$/i });
    fireEvent.click(registerBtn);

    expect(screen.getByText('Họ và tên bệnh nhân')).toBeDefined();
    expect(screen.getByRole('button', { name: /Đăng Ký Hồ Sơ/i })).toBeDefined();
  });
});
