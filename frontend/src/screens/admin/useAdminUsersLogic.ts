import { useState, useEffect } from 'react';

export interface AdminManagedUser {
  id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  national_id?: string;
  address?: string;
  is_ekyc_verified?: boolean;
  gender?: string;
  birth_date?: string;
  blood_type?: string;
  height_cm?: number;
  weight_kg?: number;
  user_type?: string;
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
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminManagedUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminManagedUser | null>(null);

  const fetchUsers = async (page = 1, currentSearch = search) => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null') ? window.location.origin : 'http://localhost';
      const res = await fetch(`${baseUrl}/api/admin/users?page=${page}&limit=${meta.limit}&search=${encodeURIComponent(currentSearch)}`);
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data || []);
        if (json.meta) setMeta(json.meta);
      } else {
        setError('Không thể tải danh sách người dùng');
      }
    } catch (err) {
      console.error('Lỗi tải danh sách người dùng:', err);
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, search);
  }, []);

  const handleCreateUser = async (payload: Record<string, any>) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        await fetchUsers(1);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Lỗi tạo người dùng:', err);
      return false;
    }
  };

  const handleUpdateUser = async (userId: string, payload: Record<string, any>) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setEditingUser(null);
        await fetchUsers(meta.page);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Lỗi cập nhật người dùng:', err);
      return false;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeletingUser(null);
        await fetchUsers(1);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Lỗi xóa người dùng:', err);
      return false;
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      fetchUsers(newPage, search);
    }
  };

  return {
    users,
    meta,
    search,
    setSearch,
    loading,
    error,
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
    handlePageChange,
  };
}
