import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { HealthCategoryTabs, HealthTabId } from './HealthCategoryTabs';

describe('HealthCategoryTabs Molecule Component', () => {
  it('render đủ 4 chip: Sinh trắc, Xét nghiệm, CĐHA, Bệnh mạn tính', () => {
    render(<HealthCategoryTabs activeTab="biometrics" onSelectTab={vi.fn()} />);

    expect(screen.getByText('Sinh trắc')).toBeDefined();
    expect(screen.getByText('Xét nghiệm')).toBeDefined();
    expect(screen.getByText('CĐHA')).toBeDefined();
    expect(screen.getByText('Bệnh mạn tính')).toBeDefined();
  });

  it('gọi onSelectTab khi người dùng bấm vào chip khác', () => {
    const handleSelect = vi.fn();
    render(<HealthCategoryTabs activeTab="biometrics" onSelectTab={handleSelect} />);

    fireEvent.click(screen.getByText('Xét nghiệm'));
    expect(handleSelect).toHaveBeenCalledWith('labs');
  });

  it('highlight nền đen chữ trắng cho tab đang được chọn', () => {
    render(<HealthCategoryTabs activeTab="biometrics" onSelectTab={vi.fn()} />);

    const activeChip = screen.getByText('Sinh trắc').closest('button');
    expect(activeChip?.className).toContain('bg-[#111827]');
    expect(activeChip?.className).toContain('text-white');
  });
});
