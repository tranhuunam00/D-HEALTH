import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { AdminUserManagement } from './AdminUserManagement';

describe('AdminUserManagement Integration Flow (E2E Component Test)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. HAPPY PATH FLOW (LOAD LIST -> OPEN MODAL -> CREATE USER -> REFRESH)
  // =========================================================================
  it('tải danh sách -> mở modal thêm người dùng -> submit tạo bác sĩ mới thành công', async () => {
    const mockUsers = [
      {
        id: 'u1',
        full_name: 'Nguyễn Văn A',
        phone_number: '0912345678',
        email: 'a@dhealth.vn',
        role: 'patient',
        is_active: true,
        created_at: '2026-11-01T00:00:00.000Z',
      },
    ];

    const mockFetch = vi.fn().mockImplementation((url: string, options?: any) => {
      if (url.includes('/api/admin/users') && (!options || options.method === 'GET')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              data: mockUsers,
              meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
            }),
        });
      }
      if (url.includes('/api/admin/users') && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: { id: 'u2' } }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    global.fetch = mockFetch as any;

    render(<AdminUserManagement />);

    // 1.1 Khẳng định người dùng ban đầu hiển thị trên bảng
    await waitFor(() => {
      expect(screen.getByText('Nguyễn Văn A')).toBeDefined();
      expect(screen.getByText('0912345678')).toBeDefined();
    });

    // 1.2 Mở Modal Thêm Người Dùng
    const addBtn = screen.getByRole('button', { name: /Thêm Người Dùng/i });
    fireEvent.click(addBtn);

    expect(screen.getByText('Thêm Người Dùng Mới')).toBeDefined();

    // 1.3 Điền form và chọn vai trò Bác Sĩ
    fireEvent.change(screen.getByLabelText(/Họ và tên/i), { target: { value: 'Bác Sĩ Trần' } });
    fireEvent.change(screen.getByLabelText(/Số điện thoại/i), { target: { value: '0988776655' } });
    fireEvent.change(screen.getByLabelText(/Mật khẩu khởi tạo/i), { target: { value: 'Password123' } });

    const roleSelect = screen.getByRole('combobox');
    fireEvent.change(roleSelect, { target: { value: 'doctor' } });

    // 1.4 Submit Form
    const submitBtn = screen.getByRole('button', { name: /Tạo Mới/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      // Xác nhận fetch POST được gọi với đúng payload
      const postCall = mockFetch.mock.calls.find((call) => call[1]?.method === 'POST');
      expect(postCall).toBeDefined();
      const body = JSON.parse(postCall[1].body);
      expect(body.fullName).toBe('Bác Sĩ Trần');
      expect(body.role).toBe('doctor');
    });
  });

  // =========================================================================
  // 2. BOUNDARY & ERROR RESILIENCE CASES (DANH SÁCH RỖNG / LỖI MẠNG)
  // =========================================================================
  it('hiển thị trạng thái rỗng khi tìm kiếm không khớp bản ghi nào (Boundary empty data)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: [],
          meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
        }),
    }) as any;

    render(<AdminUserManagement />);

    await waitFor(() => {
      expect(screen.getByText(/Không tìm thấy người dùng nào phù hợp/i)).toBeDefined();
    });
  });

  it('xử lý an toàn khi API gặp lỗi 500 mạng -> không làm crash giao diện (Error Resilience)', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error 500'));

    render(<AdminUserManagement />);

    // Giao diện vẫn render thanh tìm kiếm và nút thao tác bình thường
    expect(screen.getByPlaceholderText(/Tìm theo tên, SĐT hoặc email.../i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Thêm Người Dùng/i })).toBeDefined();
  });
});
