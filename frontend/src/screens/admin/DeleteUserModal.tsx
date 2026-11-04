import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../../components/atoms/Button';
import { AdminManagedUser } from './useAdminUsersLogic';

export interface DeleteUserModalProps {
  isOpen: boolean;
  user: AdminManagedUser | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ isOpen, user, onClose, onConfirm }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#0F172A] border border-rose-500/40 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-150 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white mb-2">Xác Nhận Xóa Người Dùng?</h3>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Bạn sắp xóa tài khoản <strong className="text-white">{user.full_name}</strong> ({user.phone_number}). Thao tác này sẽ xóa toàn bộ hồ sơ y tế liên kết và không thể hoàn tác.
        </p>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Hủy Bỏ</Button>
          <Button type="button" variant="danger" onClick={onConfirm} className="flex-1">Xóa Vĩnh Viễn</Button>
        </div>
      </div>
    </div>
  );
};
