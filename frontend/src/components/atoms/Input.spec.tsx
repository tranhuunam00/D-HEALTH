import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Input } from './Input';

describe('Input Atom Component', () => {
  it('hiển thị đúng nhãn và trường nhập liệu', () => {
    render(<Input label="Số điện thoại" placeholder="0912345678" />);
    expect(screen.getByLabelText(/Số điện thoại/i)).toBeDefined();
    expect(screen.getByPlaceholderText('0912345678')).toBeDefined();
  });

  it('hiển thị thông báo lỗi khi có props error', () => {
    render(<Input label="Mật khẩu" error="Mật khẩu phải có ít nhất 8 ký tự" />);
    expect(screen.getByText('Mật khẩu phải có ít nhất 8 ký tự')).toBeDefined();
  });

  it('hỗ trợ toggle ẩn/hiện mật khẩu', () => {
    render(<Input label="Mật khẩu" isPassword />);
    const input = screen.getByLabelText('Mật khẩu') as HTMLInputElement;
    expect(input.type).toBe('password');

    const toggleBtn = screen.getByRole('button', { name: /Hiện mật khẩu/i });
    fireEvent.click(toggleBtn);
    expect(input.type).toBe('text');
  });
});
