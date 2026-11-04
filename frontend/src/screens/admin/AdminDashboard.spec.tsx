import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
