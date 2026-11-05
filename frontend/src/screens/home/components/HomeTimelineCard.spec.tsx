import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { HomeTimelineCard } from './HomeTimelineCard';

describe('HomeTimelineCard', () => {
  it('render tiêu đề Health Timeline và nút Xem tất cả', () => {
    const handleNavigateRecords = vi.fn();
    render(<HomeTimelineCard onNavigateRecords={handleNavigateRecords} />);

    expect(screen.getByText('Health Timeline')).toBeDefined();
    const allBtn = screen.getByText('Xem tất cả');
    expect(allBtn).toBeDefined();

    fireEvent.click(allBtn);
    expect(handleNavigateRecords).toHaveBeenCalledTimes(1);
  });

  it('render thông báo empty state khi reports rỗng', () => {
    render(<HomeTimelineCard reports={[]} />);

    expect(
      screen.getByText('Chưa có sự kiện cận lâm sàng nào gần đây trong cơ sở dữ liệu.')
    ).toBeDefined();
  });

  it('render thông báo empty state khi reports undefined', () => {
    render(<HomeTimelineCard reports={undefined} />);

    expect(
      screen.getByText('Chưa có sự kiện cận lâm sàng nào gần đây trong cơ sở dữ liệu.')
    ).toBeDefined();
  });

  it('render danh sách reports với đầy đủ thông tin và định dạng ngày tháng', () => {
    const mockReports = [
      { id: '1', kind: 'lab', title: 'Xét nghiệm máu', performed_at: '2026-10-20T08:00:00Z' },
      { id: '2', kind: 'imaging', title: 'CT ngực', performed_at: '2026-10-08T09:30:00Z' },
    ];

    render(<HomeTimelineCard reports={mockReports} />);

    expect(screen.getByText('Xét nghiệm máu')).toBeDefined();
    expect(screen.getByText('CT ngực')).toBeDefined();
    expect(screen.getByText('20/10')).toBeDefined();
    expect(screen.getByText('08/10')).toBeDefined();
  });

  it('xử lý click điều hướng cho từng loại báo cáo lab và imaging', () => {
    const handleNavigateLabs = vi.fn();
    const handleNavigateImaging = vi.fn();

    const mockReports = [
      { id: '1', kind: 'lab', title: 'Xét nghiệm sinh hóa', performed_at: '2026-10-20' },
      { id: '2', kind: 'imaging', title: 'MRI sọ não', performed_at: '2026-10-08' },
    ];

    render(
      <HomeTimelineCard
        reports={mockReports}
        onNavigateLabs={handleNavigateLabs}
        onNavigateImaging={handleNavigateImaging}
      />
    );

    fireEvent.click(screen.getByText('Xét nghiệm sinh hóa'));
    expect(handleNavigateLabs).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('MRI sọ não'));
    expect(handleNavigateImaging).toHaveBeenCalledTimes(1);
  });

  it('xử lý an toàn khi báo cáo thiếu title hoặc ngày không hợp lệ', () => {
    const fallbackReports = [
      { id: '3', kind: 'imaging', performed_at: 'invalid-date' },
      { id: '4', kind: 'lab', title: '', performed_at: '' },
    ];

    render(<HomeTimelineCard reports={fallbackReports} />);

    expect(screen.getByText('Chẩn đoán hình ảnh')).toBeDefined();
    expect(screen.getByText('Xét nghiệm')).toBeDefined();
    expect(screen.getByText('invalid-date')).toBeDefined();
  });
});

