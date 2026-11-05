import React, { useState, useEffect } from 'react';
import { X, User, Lock, ShieldCheck, Activity, Save, Loader2 } from 'lucide-react';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { AdminManagedUser } from './useAdminUsersLogic';

export interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
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

  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [isActive, setIsActive] = useState(true);

  // Identity & Residency
  const [nationalId, setNationalId] = useState('');
  const [address, setAddress] = useState('');
  const [isEkycVerified, setIsEkycVerified] = useState(false);

  // Vitals & Health Profile
  const [gender, setGender] = useState('Nam');
  const [birthDate, setBirthDate] = useState('');
  const [bloodType, setBloodType] = useState('O+');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (targetUser) {
      setFullName(targetUser.full_name || '');
      setPhoneNumber(targetUser.phone_number || '');
      setEmail(targetUser.email || '');
      setRole(targetUser.role || 'patient');
      setIsActive(targetUser.is_active ?? true);
      setPassword(''); // Mặc định trống khi chỉnh sửa

      setNationalId(targetUser.national_id || '');
      setAddress(targetUser.address || '');
      setIsEkycVerified(targetUser.is_ekyc_verified ?? false);

      setGender(targetUser.gender || 'Nam');
      setBirthDate(targetUser.birth_date ? targetUser.birth_date.split('T')[0] : '1980-01-01');
      setBloodType(targetUser.blood_type || 'O+');
      setHeightCm(targetUser.height_cm ? String(targetUser.height_cm) : '');
      setWeightKg(targetUser.weight_kg ? String(targetUser.weight_kg) : '');
    } else {
      setFullName('');
      setPhoneNumber('');
      setEmail('');
      setPassword('');
      setRole('patient');
      setIsActive(true);

      setNationalId('');
      setAddress('');
      setIsEkycVerified(false);

      setGender('Nam');
      setBirthDate('1990-01-01');
      setBloodType('O+');
      setHeightCm('');
      setWeightKg('');
    }
    setErrorMsg('');
  }, [targetUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Họ và tên và Số điện thoại.');
      return;
    }

    if (!targetUser && (!password || password.length < 6)) {
      setErrorMsg('Mật khẩu khởi tạo phải có ít nhất 6 ký tự.');
      return;
    }

    if (password && password.length > 0 && password.length < 6) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await onSubmit({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim() || null,
        password: password ? password.trim() : undefined,
        role,
        isActive,
        nationalId: nationalId.trim() || null,
        address: address.trim() || null,
        isEkycVerified,
        gender,
        birthDate: birthDate || null,
        bloodType,
        heightCm: heightCm ? Number(heightCm) : null,
        weightKg: weightKg ? Number(weightKg) : null,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi lưu thông tin người dùng.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#0B132B] border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl relative text-white flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {targetUser ? 'Chỉnh Sửa Hồ Sơ & Quyền Người Dùng' : 'Thêm Người Dùng Mới'}
              </h3>
              <p className="text-[10px] text-slate-400">
                Quản lý định danh cá nhân, phân quyền, sinh trắc học và cấp đổi mật khẩu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Thông tin tài khoản & Mật khẩu */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3.5">
            <div className="flex items-center gap-2 text-teal-400 font-bold border-b border-slate-800 pb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>1. Thông Tin Tài Khoản & Mật Khẩu</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <Input
                label="Họ và tên *"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Ví dụ: Trần Hữu Nam"
              />

              <Input
                label="Số điện thoại đăng nhập *"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                placeholder="0961766816"
              />

              <Input
                label="Địa chỉ Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="bacsi@dhealth.vn"
              />

              <div className="space-y-1">
                <Input
                  label={targetUser ? 'Đổi mật khẩu mới (bỏ trống nếu giữ cũ)' : 'Mật khẩu khởi tạo *'}
                  type="password"
                  isPassword
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={targetUser ? 'Nhập mật khẩu mới...' : 'Tối thiểu 6 ký tự'}
                  required={!targetUser}
                />
                {targetUser && (
                  <p className="text-[10px] text-slate-400">
                    Chỉ nhập nếu người dùng yêu cầu đổi mật khẩu đăng nhập mới.
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Vai trò hệ thống</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="patient">Bệnh Nhân (Patient)</option>
                  <option value="doctor">Bác Sĩ Điều Trị (Doctor)</option>
                  <option value="clinical_admin">Quản Trị Lâm Sàng (Clinical Admin)</option>
                  <option value="super_admin">Super Admin (Toàn quyền hệ thống)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Trạng thái tài khoản</label>
                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="user_active_status"
                      checked={isActive === true}
                      onChange={() => setIsActive(true)}
                      className="accent-teal-500"
                    />
                    <span>Hoạt động</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="user_active_status"
                      checked={isActive === false}
                      onChange={() => setIsActive(false)}
                      className="accent-rose-500"
                    />
                    <span>Tạm khóa</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Định danh công dân & Cư trú (eKYC) */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3.5">
            <div className="flex items-center gap-2 text-purple-400 font-bold border-b border-slate-800 pb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>2. Định Danh Công Dân & Xác Thực (eKYC)</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <Input
                label="Số CCCD / CMTND"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                placeholder="001200001234"
              />

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Trạng thái eKYC</label>
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={isEkycVerified}
                      onChange={(e) => setIsEkycVerified(e.target.checked)}
                      className="accent-purple-500 w-4 h-4 rounded"
                    />
                    <span>Đã thẩm định định danh điện tử (eKYC)</span>
                  </label>
                </div>
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-slate-300 font-semibold">Địa chỉ thường trú</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số 12 Chùa Bộc, Phường Quang Trung, Đống Đa, Hà Nội"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Hồ sơ sức khỏe & Sinh trắc cơ bản */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold border-b border-slate-800 pb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>3. Thông Tin Sinh Trắc Học & Y Tế Cơ Bản</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Giới tính</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Ngày sinh</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Nhóm máu</label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bt) => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Chiều cao (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="170"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Cân nặng (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="68"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="outline" type="button" onClick={onClose} disabled={submitting}>
              Hủy
            </Button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-[#1F7A8C] hover:bg-[#186473] text-white font-semibold flex items-center gap-2 shadow-lg shadow-teal-500/20 transition cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{targetUser ? 'Lưu Thay Đổi' : 'Tạo Mới Người Dùng'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
