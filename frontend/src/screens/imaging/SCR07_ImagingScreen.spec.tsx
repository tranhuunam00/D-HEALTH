import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SCR07_ImagingScreen } from './SCR07_ImagingScreen';

describe('SCR07_ImagingScreen Mobile View TDD', () => {
  it('render đầy đủ danh mục CĐHA, ca chụp MRI gan và nút Nhập kết quả', () => {
    render(<SCR07_ImagingScreen onNavigate={vi.fn()} />);

    expect(screen.getAllByText('Sức khoẻ').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('CĐHA')).toBeDefined();
    expect(screen.getByText('MRI gan có tiêm thuốc đối quang từ')).toBeDefined();
    expect(screen.getByText(/Bệnh viện K Tân Triều/)).toBeDefined();
    expect(screen.getByText(/Nhập kết quả CĐHA/)).toBeDefined();
  });

  it('gọi onNavigate khi bấm vào ca chụp để xem chi tiết', () => {
    const handleNavigate = vi.fn();
    render(<SCR07_ImagingScreen onNavigate={handleNavigate} />);

    fireEvent.click(screen.getByText('MRI gan có tiêm thuốc đối quang từ'));
    expect(handleNavigate).toHaveBeenCalledWith('imaging-detail', 'img-01');
  });
});
