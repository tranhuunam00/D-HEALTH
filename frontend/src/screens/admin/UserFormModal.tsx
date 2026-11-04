import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { AdminManagedUser } from './useAdminUsersLogic';

export interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  user?: AdminManagedUser | null;
  initialUser?: AdminManagedUser | null;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  initialUser,
}) => {
  const targetUser = user !== undefined ? user : initialUser;
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (targetUser) {
      setFullName(targetUser.full_name);
      setPhoneNumber(targetUser.phone_number);
      setEmail(targetUser.email || '');
      setRole(targetUser.role || 'patient');
      setIsActive(targetUser.is_active);
      setPassword('');
    } else {
      setFullName('');
      setPhoneNumber('');
      setEmail('');
      setPassword('');
      setRole('patient');
      setIsActive(true);
    }
  }, [targetUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ fullName, phoneNumber, email, password, role, isActive });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold mb-4">
          {targetUser ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng Mới'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Họ và tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Ví dụ: Bác Sĩ Trần"
          />

          <Input
            label="Số điện thoại"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            placeholder="09xxxxxxxx"
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="bacsi@dhealth.vn"
          />

          {!targetUser && (
            <Input
              label="Mật khẩu khởi tạo"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Tối thiểu 6 ký tự"
            />
          )}

          <div className="space-y-1 text-xs">
            <label className="text-slate-300 font-medium">Vai trò hệ thống</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
            >
              <option value="patient">Bệnh Nhân</option>
              <option value="doctor">Bác Sĩ</option>
              <option value="clinical_admin">Quản Trị Lâm Sàng</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="outline" type="button" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {targetUser ? 'Lưu Thay Đổi' : 'Tạo Mới'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
