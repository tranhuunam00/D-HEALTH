import React, { useState } from 'react';
import { UserPlus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { useAdminUsersLogic } from './useAdminUsersLogic';
import { UserFormModal } from './UserFormModal';
import { DeleteUserModal } from './DeleteUserModal';
import { PatientDossierModal } from './PatientDossierModal';

export const AdminUserManagement: React.FC = () => {
  const {
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
  } = useAdminUsersLogic();

  // State for Patient Dossier Modal (Toàn bộ thông tin bệnh nhân)
  const [dossierUserId, setDossierUserId] = useState<string | null>(null);
  const [dossierUserName, setDossierUserName] = useState<string>('');

  const renderRoleBadge = (role: string) => {
    if (role === 'super_admin') {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-purple-50 text-purple-700 font-bold border border-purple-200">Super Admin</span>;
    }
    if (role === 'clinical_admin') {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-200">Quản Trị Lâm Sàng</span>;
    }
    if (role === 'doctor') {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">Bác Sĩ</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-teal-50 text-[#1F7A8C] font-bold border border-teal-200">Người Dùng</span>;
  };

  return (
    <div className="space-y-4">
      {/* 1. Header & Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2 rounded-2xl w-80 text-xs shadow-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            placeholder="Tìm theo tên, SĐT hoặc email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchUsers(1, e.target.value);
            }}
            className="bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none w-full"
          />
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#1F7A8C] hover:bg-[#186473] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-teal-500/20 transition cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Thêm Người Dùng</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
          <XCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. High-Density Data Grid Table (White Theme) */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Họ Và Tên</th>
                <th className="px-5 py-3.5">Thông Tin Liên Hệ</th>
                <th className="px-5 py-3.5">Vai Trò</th>
                <th className="px-5 py-3.5">Trạng Thái</th>
                <th className="px-5 py-3.5">Ngày Đăng Ký</th>
                <th className="px-5 py-3.5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-900 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-teal-50 text-[#1F7A8C] font-bold flex items-center justify-center text-xs border border-teal-200">
                        {u.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold">{u.full_name}</div>
                        {u.national_id && (
                          <div className="text-[10px] font-mono text-slate-400">CCCD: {u.national_id}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-slate-900 font-mono font-medium">{u.phone_number}</div>
                      <div className="text-[10px] text-slate-500">{u.email || 'Chưa liên kết email'}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      {renderRoleBadge(u.role)}
                    </td>
                    <td className="px-5 py-3.5">
                      {u.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" /> Tạm khóa
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {new Date(u.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {/* Nút Xem Hồ Sơ Bệnh Nhân Toàn Bộ */}
                      <button
                        onClick={() => {
                          setDossierUserId(u.id);
                          setDossierUserName(u.full_name);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#1F7A8C] text-[11px] font-bold inline-flex items-center gap-1 border border-teal-200 transition cursor-pointer"
                        title="Xem toàn bộ hồ sơ y tế người dùng"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Xem Hồ Sơ</span>
                      </button>

                      <button
                        onClick={() => setEditingUser(u)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                        title="Chỉnh sửa thông tin"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeletingUser(u)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                        title="Xóa mềm người dùng"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    {loading ? 'Đang tải dữ liệu...' : 'Không tìm thấy người dùng nào phù hợp.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 3. Server-side Pagination Bar */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div>
            Hiển thị <strong className="text-slate-800">{users.length}</strong> / <strong className="text-slate-800">{meta.total}</strong> người dùng
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={meta.page <= 1}
              onClick={() => fetchUsers(meta.page - 1)}
              className="p-1.5 rounded-xl border border-slate-200 bg-white disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-100 text-slate-600 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              Trang <strong className="text-slate-800">{meta.page}</strong> / {meta.totalPages}
            </span>
            <button
              disabled={meta.page >= meta.totalPages}
              onClick={() => fetchUsers(meta.page + 1)}
              className="p-1.5 rounded-xl border border-slate-200 bg-white disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-100 text-slate-600 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={isAddModalOpen || !!editingUser}
        user={editingUser}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={async (data) => {
          if (editingUser) {
            await handleUpdateUser(editingUser.id, data as any);
          } else {
            await handleCreateUser(data);
          }
        }}
      />

      <DeleteUserModal
        isOpen={!!deletingUser}
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={async () => {
          if (deletingUser) {
            await handleDeleteUser(deletingUser.id);
          }
        }}
      />

      {/* Full Patient Dossier Modal */}
      <PatientDossierModal
        isOpen={!!dossierUserId}
        onClose={() => {
          setDossierUserId(null);
          setDossierUserName('');
        }}
        userId={dossierUserId}
        userName={dossierUserName}
      />
    </div>
  );
};
