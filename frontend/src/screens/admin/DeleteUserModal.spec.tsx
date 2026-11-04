import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DeleteUserModal } from './DeleteUserModal';

describe('DeleteUserModal Component TDD', () => {
  const sampleUser = {
    id: 'user_99',
    phone_number: '0988777999',
    full_name: 'Trần Văn Xóa',
    role: 'patient',
    is_active: true,
    created_at: '2026-11-04T08:00:00Z',
  };

  it('render modal cảnh báo khi isOpen = true', () => {
    render(
      <DeleteUserModal
        isOpen={true}
        user={sampleUser}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(screen.getByText('Xác Nhận Xóa Người Dùng?')).toBeDefined();
    expect(screen.getByText('Trần Văn Xóa')).toBeDefined();
    expect(screen.getByText('Hủy Bỏ')).toBeDefined();
    expect(screen.getByText('Xóa Vĩnh Viễn')).toBeDefined();
  });

  it('không render gì (return null) khi isOpen = false hoặc user = null (Boundary Case)', () => {
    const { container } = render(
      <DeleteUserModal
        isOpen={false}
        user={sampleUser}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('gọi onConfirm khi người dùng click nút Xóa Vĩnh Viễn', () => {
    const handleConfirm = vi.fn();
    render(
      <DeleteUserModal
        isOpen={true}
        user={sampleUser}
        onClose={vi.fn()}
        onConfirm={handleConfirm}
      />
    );

    fireEvent.click(screen.getByText('Xóa Vĩnh Viễn'));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });
});
