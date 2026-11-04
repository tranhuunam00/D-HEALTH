import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SCR05_LabsScreen } from './SCR05_LabsScreen';

describe('SCR05_LabsScreen Mobile View TDD', () => {
  it('render đầy đủ danh mục xét nghiệm và các phiếu xét nghiệm gần đây', () => {
    render(<SCR05_LabsScreen onNavigate={vi.fn()} />);

    expect(screen.getAllByText('Sức khoẻ').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Xét nghiệm')).toBeDefined();
    expect(screen.getByText('Sinh hoá máu 18 chỉ số')).toBeDefined();
    expect(screen.getByText(/Bệnh viện Bạch Mai/)).toBeDefined();
    expect(screen.getByText(/Nhập kết quả xét nghiệm/)).toBeDefined();
  });

  it('gọi onNavigate khi bấm vào phiếu xét nghiệm để xem chi tiết', () => {
    const handleNavigate = vi.fn();
    render(<SCR05_LabsScreen onNavigate={handleNavigate} />);

    fireEvent.click(screen.getByText('Sinh hoá máu 18 chỉ số'));
    expect(handleNavigate).toHaveBeenCalledWith('lab-detail', 'rep-01');
  });
});
