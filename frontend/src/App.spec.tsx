import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from './App';

describe('App Root Component TDD', () => {
  it('render thanh header hệ sinh thái D-HEALTH, nút chuyển đổi Mobile và PC', () => {
    render(<App />);

    expect(screen.getByText('D-HEALTH ECOSYSTEM')).toBeDefined();
    expect(screen.getByText(/Mobile Bệnh Nhân/)).toBeDefined();
    expect(screen.getByText(/PC Admin Tổng/)).toBeDefined();
  });

  it('hỗ trợ chuyển đổi sang chế độ PC Admin Tổng', () => {
    render(<App />);

    fireEvent.click(screen.getByText(/PC Admin Tổng/));
    expect(screen.getByText('D-HEALTH ADMIN')).toBeDefined();
  });
});
