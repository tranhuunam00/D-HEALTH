import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SCR03_BiometricsScreen } from './SCR03_BiometricsScreen';

describe('SCR03_BiometricsScreen Mobile View TDD', () => {
  it('render đầy đủ thanh tab Sức khoẻ, biểu đồ sinh trắc 7 ngày và 8 thẻ chỉ số', () => {
    render(
      <SCR03_BiometricsScreen
        onNavigate={vi.fn()}
        onSelectMember={vi.fn()}
      />
    );

    expect(screen.getAllByText('Sức khoẻ').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Sinh trắc')).toBeDefined();
    expect(screen.getByText('Xét nghiệm')).toBeDefined();
    expect(screen.getByText(/Đồng bộ từ Apple Watch/i)).toBeDefined();
    expect(screen.getByText(/Nhập số đo.*thủ công/i)).toBeDefined();
    expect(screen.getByText('Huyết áp')).toBeDefined();
    expect(screen.getByText('Nhịp tim')).toBeDefined();
  });

  it('gọi onNavigate khi bấm nút Thiết bị hoặc chuyển tab', () => {
    const handleNavigate = vi.fn();
    render(
      <SCR03_BiometricsScreen
        onNavigate={handleNavigate}
        onSelectMember={vi.fn()}
      />
    );

    fireEvent.click(screen.getAllByText(/Thiết bị/i)[0]);
    expect(handleNavigate).toHaveBeenCalledWith('devices');
  });
});
