import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { SCR07_ImagingScreen } from './SCR07_ImagingScreen';

describe('SCR07_ImagingScreen Mobile View TDD', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            id: 'rep_img_01',
            title: 'CT ngực liều thấp',
            category: 'CT',
            performed_at: '2026-10-08',
            conclusion: 'Nốt đặc phổi phải 7 mm',
          },
          {
            id: 'rep_img_03',
            title: 'MRI gan có tiêm thuốc',
            category: 'MRI',
            performed_at: '2026-08-20',
            conclusion: '3 khối đặc gan (tổng 38 mm)',
          },
        ],
      }),
    });
  });

  it('render đầy đủ danh mục CĐHA, tiêu đề Sức khoẻ và các bộ lọc modality', async () => {
    render(<SCR07_ImagingScreen onNavigate={vi.fn()} activeMemberName="Trần Hữu Nam" />);

    expect(screen.getAllByText('Sức khoẻ').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('CĐHA')).toBeDefined();
    expect(screen.getByText('Kết quả chẩn đoán hình ảnh')).toBeDefined();
    expect(screen.getAllByText('Tất cả').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('SA').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('XQ')).toBeDefined();
    expect(screen.getByText('MM')).toBeDefined();
    expect(screen.getAllByText('CT').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('MRI').length).toBeGreaterThanOrEqual(1);

    await waitFor(() => {
      expect(screen.getByText('CT ngực liều thấp')).toBeDefined();
    });
  });

  it('render phần Theo dõi kích thước tổn thương và bảng RECIST 1.1 khi có dữ liệu', async () => {
    render(<SCR07_ImagingScreen onNavigate={vi.fn()} />);

    expect(screen.getByText('Theo dõi kích thước tổn thương')).toBeDefined();
    expect(screen.getByText('Đánh giá đáp ứng RECIST 1.1')).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText('Ban đầu')).toBeDefined();
      expect(screen.getByText('Nhỏ nhất')).toBeDefined();
      expect(screen.getByText('Hiện tại')).toBeDefined();
    });
  });

  it('gọi onNavigate khi bấm nút Nhập kết quả CĐHA', () => {
    const handleNavigate = vi.fn();
    render(<SCR07_ImagingScreen onNavigate={handleNavigate} />);

    const btn = screen.getByText(/Nhập kết quả CĐHA/);
    fireEvent.click(btn);
    expect(handleNavigate).toHaveBeenCalledWith('camera-ocr');
  });
});
