import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { HomeBottomNav } from './HomeBottomNav';

describe('HomeBottomNav', () => {
  it('hiển thị đủ 5 nút điều hướng chính: Trang chủ, Sức khoẻ, Hồ sơ, Trợ lý AI, Chăm sóc', () => {
    render(<HomeBottomNav />);
    expect(screen.getByText('Trang chủ')).toBeDefined();
    expect(screen.getByText('Sức khoẻ')).toBeDefined();
    expect(screen.getByText('Hồ sơ')).toBeDefined();
    expect(screen.getByText('Trợ lý AI')).toBeDefined();
    expect(screen.getByText('Chăm sóc')).toBeDefined();
  });
});
