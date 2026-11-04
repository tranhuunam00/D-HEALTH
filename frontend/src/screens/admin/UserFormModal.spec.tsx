import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { UserFormModal } from './UserFormModal';

describe('UserFormModal Component TDD', () => {
  it('render form Thêm Người Dùng Mới khi không truyền initialUser', () => {
    render(
      <UserFormModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText('Thêm Người Dùng Mới')).toBeDefined();
    expect(screen.getByLabelText(/Họ và tên/)).toBeDefined();
    expect(screen.getByLabelText(/Số điện thoại/)).toBeDefined();
  });

  it('render form Chỉnh Sửa Người Dùng và điền dữ liệu cũ khi có initialUser', () => {
    const existingUser = {
      id: 'u_1',
      phone_number: '0988666555',
      full_name: 'Trần Bác Sĩ',
      email: 'doctor@dhealth.vn',
      role: 'doctor',
      is_active: true,
      created_at: '2026-11-04T08:00:00Z',
    };

    render(
      <UserFormModal
        isOpen={true}
        initialUser={existingUser}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText('Chỉnh Sửa Người Dùng')).toBeDefined();
    expect(screen.getByDisplayValue('Trần Bác Sĩ')).toBeDefined();
    expect(screen.getByDisplayValue('0988666555')).toBeDefined();
  });

  it('gọi onSubmit với đúng payload khi submit form', () => {
    const handleSubmit = vi.fn();
    render(
      <UserFormModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={handleSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText(/Họ và tên/), { target: { value: 'Lê Văn Mới' } });
    fireEvent.change(screen.getByLabelText(/Số điện thoại/), { target: { value: '0901234567' } });
    fireEvent.change(screen.getByLabelText(/Mật khẩu/), { target: { value: 'Secret123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Tạo Mới/ }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: 'Lê Văn Mới',
        phoneNumber: '0901234567',
      })
    );
  });
});
