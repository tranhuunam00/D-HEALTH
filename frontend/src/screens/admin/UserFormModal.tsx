import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { AdminManagedUser } from './useAdminUsersLogic';

export interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialUser?: AdminManagedUser | null;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSubmit, initialUser }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialUser) {
      setFullName(initialUser.full_name);
      setPhoneNumber(initialUser.phone_number);
      setEmail(initialUser.email || '');
      setRole(initialUser.role || 'patient');
      setIsActive(initialUser.is_active);
      setPassword('');
    } else {
      setFullName('');
      setPhoneNumber('');
      setEmail('');
      setPassword('');
      setRole('patient');
      setIsActive(true);
    }
  }, [initialUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ fullName, phoneNumber, email, password, role, isActive });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0F172A] border border-slate-700/80 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-base font-bold text-white">
            {initialUser ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng Mới'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input label="Họ và tên" placeholder="Nguyễn Văn A" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <Input label="Số điện thoại" placeholder="0912345678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
          <Input label="Email liên hệ (tùy chọn)" placeholder="user@gmail.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Vai trò / Phân quyền</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#1F7A8C]"
            >
              <option value="patient">Bệnh nhân / Người dùng gia đình</option>
              <option value="doctor">Bác sĩ chuyên khoa</option>
              <option value="clinical_admin">Quản trị lâm sàng</option>
              <option value="super_admin">Quản trị viên tối cao (Super Admin)</option>
            </select>
          </div>

          {!initialUser && (
            <Input label="Mật khẩu khởi tạo" placeholder="Tối thiểu 8 ký tự" isPassword value={password} onChange={(e) => setPassword(e.target.value)} required />
          )}

          {initialUser && (
            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="userActiveStatus" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded text-[#1F7A8C]" />
              <label htmlFor="userActiveStatus" className="text-xs text-slate-300">Tài khoản đang hoạt động (cho phép đăng nhập)</label>
            </div>
          )}

          <div className="flex gap-2 pt-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Hủy</Button>
            <Button type="submit" variant="primary" className="flex-1">{initialUser ? 'Cập Nhật' : 'Tạo Mới'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
