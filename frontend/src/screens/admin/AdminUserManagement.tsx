import React from 'react';
import { Users, UserPlus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { useAdminUsersLogic } from './useAdminUsersLogic';
import { UserFormModal } from './UserFormModal';
import { DeleteUserModal } from './DeleteUserModal';

export const AdminUserManagement: React.FC = () => {
  const {
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
  } = useAdminUsersLogic();

  return (
    <div className="space-y-4">
      {/* 1. Header & Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl w-80 text-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            placeholder="Tìm theo tên, SĐT hoặc email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchUsers(1, e.target.value);
            }}
            className="bg-transparent text-white focus:outline-none w-full"
          />
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#1F7A8C]/20 hover:brightness-105"
        >
          <UserPlus className="w-4 h-4" />
          Thêm Người Dùng
        </button>
      </div>

      {/* 2. High-Density Data Grid Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Họ Và Tên</th>
                <th className="px-5 py-3.5">Thông Tin Liên Hệ</th>
                <th className="px-5 py-3.5">Vai Trò</th>
                <th className="px-5 py-3.5">Trạng Thái</th>
                <th className="px-5 py-3.5">Ngày Đăng Ký</th>
                <th className="px-5 py-3.5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 text-[#1F7A8C] font-bold flex items-center justify-center text-xs">
                        {u.full_name.charAt(0)}
                      </div>
                      {u.full_name}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-white font-mono">{u.phone_number}</div>
                      <div className="text-[10px] text-slate-400">{u.email || 'Chưa liên kết email'}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#1F7A8C]/20 text-cyan-300 font-semibold border border-[#1F7A8C]/30">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {u.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Tạm khóa
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {new Date(u.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => setEditingUser(u)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingUser(u)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                        title="Xóa người dùng"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    {loading ? 'Đang tải dữ liệu...' : 'Không tìm thấy người dùng nào phù hợp.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 3. Server-side Pagination Bar */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div>
            Hiển thị <strong className="text-white">{users.length}</strong> / <strong className="text-white">{meta.total}</strong> người dùng
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchUsers(meta.page - 1)}
              disabled={meta.page <= 1 || loading}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-800 text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              Trang <strong className="text-white">{meta.page}</strong> / {meta.totalPages}
            </span>
            <button
              onClick={() => fetchUsers(meta.page + 1)}
              disabled={meta.page >= meta.totalPages || loading}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-800 text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={isAddModalOpen || !!editingUser}
        initialUser={editingUser}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={editingUser ? (d) => handleUpdateUser(editingUser.id, d) : handleCreateUser}
      />

      <DeleteUserModal
        isOpen={!!deletingUser}
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={() => deletingUser && handleDeleteUser(deletingUser.id)}
      />
    </div>
  );
};
