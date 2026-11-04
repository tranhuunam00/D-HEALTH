import { useState, useEffect } from 'react';

export interface AdminManagedUser {
  id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function useAdminUsersLogic() {
  const [users, setUsers] = useState<AdminManagedUser[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminManagedUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminManagedUser | null>(null);

  const fetchUsers = async (page = 1, currentSearch = search) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=${page}&limit=${meta.limit}&search=${encodeURIComponent(currentSearch)}`);
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data || []);
        if (json.meta) setMeta(json.meta);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách người dùng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, search);
  }, []);

  const handleCreateUser = async (payload: { fullName: string; phoneNumber: string; password: string; email?: string }) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        await fetchUsers(1);
      }
    } catch (err) {
      console.error('Lỗi tạo người dùng:', err);
    }
  };

  const handleUpdateUser = async (id: string, payload: { fullName: string; email?: string; phoneNumber?: string; isActive?: boolean }) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setEditingUser(null);
        await fetchUsers(meta.page);
      }
    } catch (err) {
      console.error('Lỗi cập nhật người dùng:', err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeletingUser(null);
        await fetchUsers(meta.page);
      }
    } catch (err) {
      console.error('Lỗi xóa người dùng:', err);
    }
  };

  const handleGrantRole = async (id: string, role: string, facilityId?: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/grant-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, facilityId }),
      });
      if (res.ok) {
        await fetchUsers(meta.page);
      }
    } catch (err) {
      console.error('Lỗi cấp quyền vai trò:', err);
    }
  };

  return {
    users,
    meta,
    search,
    setSearch,
    loading,
    isAddModalOpen,
    setIsAddModalOpen,
    editingUser,
    setEditingUser,
    deletingUser,
    setDeletingUser,
    fetchUsers,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleGrantRole,
  };
}
