import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AdminUserManagement } from './AdminUserManagement';

describe('AdminUserManagement Component', () => {
  it('render thanh tìm kiếm và nút Thêm Người Dùng', () => {
    render(<AdminUserManagement />);
    expect(screen.getByPlaceholderText(/Tìm theo tên/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Thêm Người Dùng/i })).toBeDefined();
  });

  it('render tiêu đề các cột của bảng phân trang chuẩn', () => {
    render(<AdminUserManagement />);
    expect(screen.getByText('Họ Và Tên')).toBeDefined();
    expect(screen.getByText('Thông Tin Liên Hệ')).toBeDefined();
    expect(screen.getByText('Vai Trò')).toBeDefined();
    expect(screen.getByText('Trạng Thái')).toBeDefined();
    expect(screen.getByText('Ngày Đăng Ký')).toBeDefined();
  });
});
