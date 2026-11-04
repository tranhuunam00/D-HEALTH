import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AddDoctorSheet } from './AddDoctorSheet';

describe('AddDoctorSheet Component TDD', () => {
  it('render form thêm bác sĩ và submit dữ liệu', () => {
    const handleSubmit = vi.fn();
    render(
      <AddDoctorSheet
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={handleSubmit}
      />
    );

    expect(screen.getByText('Thêm Bác Sĩ Vào Care Team')).toBeDefined();
    expect(screen.getByLabelText(/Tên bác sĩ/i)).toBeDefined();

    fireEvent.change(screen.getByLabelText(/Tên bác sĩ/i), { target: { value: 'BS Nguyễn Văn An' } });
    fireEvent.click(screen.getByRole('button', { name: /Thêm bác sĩ/i }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ doctorName: 'BS Nguyễn Văn An' })
    );
  });
});
