import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Button } from './Button';

describe('Button Atom Component', () => {
  it('hiển thị đúng nhãn văn bản và kích thước vùng chạm tối thiểu 48px (>=44pt)', () => {
    render(<Button>Đăng Nhập</Button>);
    const btn = screen.getByRole('button', { name: /Đăng Nhập/i });
    expect(btn).toBeDefined();
    expect(btn.className).toContain('min-h-[48px]');
  });

  it('vô hiệu hóa nút khi isLoading là true', () => {
    render(<Button isLoading>Đang lưu</Button>);
    const btn = screen.getByRole('button');
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });
});
