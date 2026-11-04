import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DataSharingBox } from './DataSharingBox';

describe('DataSharingBox Component TDD', () => {
  it('render chuẩn câu hỏi Ai được xem dữ liệu của tôi?, 3 người đang có quyền và nút Quản lý', () => {
    const handleManage = vi.fn();
    render(
      <DataSharingBox
        activeCount={3}
        expiringDays={7}
        onManage={handleManage}
      />
    );

    expect(screen.getByText('Ai được xem dữ liệu của tôi?')).toBeDefined();
    expect(screen.getByText(/3 người đang có quyền · 1 hết hạn sau 7 ngày/)).toBeDefined();
    expect(screen.getByText('Quản lý')).toBeDefined();

    fireEvent.click(screen.getByText('Quản lý'));
    expect(handleManage).toHaveBeenCalled();
  });
});
