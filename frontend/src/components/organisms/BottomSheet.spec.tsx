import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BottomSheet } from './BottomSheet';

describe('BottomSheet Organism Component', () => {
  it('không render khi isOpen là false', () => {
    render(
      <BottomSheet isOpen={false} onClose={vi.fn()} title="Nhập số đo">
        <div>Nội dung</div>
      </BottomSheet>
    );
    expect(screen.queryByText('Nhập số đo')).toBeNull();
  });

  it('render nội dung và gọi onClose khi click backdrop', () => {
    const handleClose = vi.fn();
    render(
      <BottomSheet isOpen={true} onClose={handleClose} title="Nhập Huyết Áp">
        <div>Form nhập liệu</div>
      </BottomSheet>
    );

    expect(screen.getByText('Nhập Huyết Áp')).toBeDefined();
    expect(screen.getByText('Form nhập liệu')).toBeDefined();

    const backdrop = screen.getByTestId('bottom-sheet-backdrop');
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalled();
  });
});
