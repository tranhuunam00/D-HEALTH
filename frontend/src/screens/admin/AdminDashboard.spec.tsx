import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { AdminDashboard } from './AdminDashboard';

describe('AdminDashboard PC-First View', () => {
  it('render Sidebar cố định, Topbar và các thẻ chỉ số tổng quan', () => {
    render(<AdminDashboard />);

    expect(screen.getByText('D-HEALTH ADMIN')).toBeDefined();
    expect(screen.getByText('Super Admin Portal')).toBeDefined();
    expect(screen.getByText('CSYT Đối Tác')).toBeDefined();
    expect(screen.getByText('Bác Sĩ Chuyên Khoa')).toBeDefined();
    expect(screen.getAllByText('Dược Thư Quốc Gia').length).toBeGreaterThanOrEqual(1);
  });

  it('hỗ trợ chuyển tab sang Quản Trị Người Dùng khi click nút navigation', async () => {
    render(<AdminDashboard />);

    const userTabBtn = screen.getByText('Quản Trị Người Dùng');
    await act(async () => {
      fireEvent.click(userTabBtn);
    });

    expect(screen.getByText('Thêm Người Dùng')).toBeDefined();
  });

  it('hỗ trợ chuyển tab sang Danh Bạ Bác Sĩ', async () => {
    render(<AdminDashboard />);

    const docTabBtn = screen.getByText('Danh Bạ Bác Sĩ');
    await act(async () => {
      fireEvent.click(docTabBtn);
    });

    expect(screen.getByText('Danh Bạ Bác Sĩ Chuyên Khoa')).toBeDefined();
  });
});
