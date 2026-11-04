import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AddMedicationSheet } from './AddMedicationSheet';

describe('AddMedicationSheet Component TDD', () => {
  it('render form nhập thuốc thủ công và submit dữ liệu', () => {
    const handleSubmit = vi.fn();
    render(
      <AddMedicationSheet
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={handleSubmit}
      />
    );

    expect(screen.getByText('Thêm thuốc vào lịch nhắc')).toBeDefined();
    expect(screen.getByLabelText(/Tên thuốc/i)).toBeDefined();

    fireEvent.change(screen.getByLabelText(/Tên thuốc/i), { target: { value: 'Aspirin' } });
    fireEvent.click(screen.getByRole('button', { name: /Lưu thuốc/i }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ medicationName: 'Aspirin' })
    );
  });
});
