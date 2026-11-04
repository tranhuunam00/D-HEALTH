import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SCR11_MedsScreen } from './SCR11_MedsScreen';

describe('SCR11_MedsScreen Mobile View TDD', () => {
  it('render đầy đủ Quản lý dùng thuốc, tỷ lệ tuân thủ và danh sách liều thuốc hôm nay', () => {
    render(<SCR11_MedsScreen onNavigate={vi.fn()} />);

    expect(screen.getByText('Quản lý dùng thuốc')).toBeDefined();
    expect(screen.getByText(/Tuân thủ/)).toBeDefined();
    expect(screen.getByText('Amlodipine 5mg')).toBeDefined();
    expect(screen.getByText('Metformin 500mg')).toBeDefined();
    expect(screen.getByText('Atorvastatin 20mg')).toBeDefined();
    expect(screen.getByText(/Thêm liều thuốc/)).toBeDefined();
  });

  it('gọi onNavigate khi bấm nút quay lại', () => {
    const handleNavigate = vi.fn();
    render(<SCR11_MedsScreen onNavigate={handleNavigate} />);

    fireEvent.click(screen.getByLabelText('Quay lại'));
    expect(handleNavigate).toHaveBeenCalledWith('home');
  });
});
