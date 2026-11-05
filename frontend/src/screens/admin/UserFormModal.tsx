import React, { useState, useEffect } from 'react';
import { X, User, Lock, ShieldCheck, Activity, Save, Loader2, KeyRound } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0B132B] border border-slate-700 w-full max-w-5xl rounded-3xl shadow-2xl relative text-white flex flex-col my-4 overflow-hidden">
        {/* Header Bar */}
        <div className="px-7 py-4.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] text-white flex items-center justify-center shadow-md shadow-teal-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {targetUser ? 'Chỉnh Sửa Toàn Diện Hồ Sơ Người Dùng' : 'Thêm Người Dùng Mới'}
                </h3>
                {targetUser && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                    ID: {targetUser.id.substring(0, 8)}...
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Quản lý định danh cá nhân, vai trò hệ thống, cấp đổi mật khẩu và thông tin y tế cơ bản
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-7 space-y-6 text-xs max-h-[82vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 font-medium">
              {errorMsg}
            </div>
          )}

          {/* SECTION 1: Thông tin tài khoản & Mật khẩu (Full Width - 3 Columns) */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                <Lock className="w-4 h-4" />
                <span>1. TÀI KHOẢN ĐĂNG NHẬP, PHÂN QUYỀN & MẬT KHẨU</span>
              </div>
              {targetUser && (
                <span className="text-[11px] text-amber-400 flex items-center gap-1 font-medium">
                  <KeyRound className="w-3.5 h-3.5" /> Có thể đổi mật khẩu mới trực tiếp
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  label={targetUser ? 'Đổi mật khẩu mới (để trống nếu giữ cũ)' : 'Mật khẩu khởi tạo *'}
                  type="password"
                  isPassword
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={targetUser ? 'Nhập mật khẩu mới...' : 'Tối thiểu 6 ký tự'}
                  required={!targetUser}
                />
                {targetUser && (
                  <p className="text-[10px] text-slate-400 italic">
                    Nhập $\ge 6$ ký tự nếu muốn cấp lại mật khẩu đăng nhập mới cho người dùng.
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Vai trò hệ thống</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full min-h-[48px] bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-teal-500 text-sm"
                >
                  <option value="patient">Bệnh Nhân (Patient)</option>
                  <option value="doctor">Bác Sĩ Điều Trị (Doctor)</option>
                  <option value="clinical_admin">Quản Trị Lâm Sàng (Clinical Admin)</option>
                  <option value="super_admin">Super Admin (Toàn quyền hệ thống)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Trạng thái tài khoản</label>
                <div className="flex items-center gap-5 pt-3">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                    <input
                      type="radio"
                      name="user_active_status"
                      checked={isActive === true}
                      onChange={() => setIsActive(true)}
                      className="accent-teal-500 w-4 h-4"
                    />
                    <span className="font-medium text-emerald-400">Đang hoạt động</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                    <input
                      type="radio"
                      name="user_active_status"
                      checked={isActive === false}
                      onChange={() => setIsActive(false)}
                      className="accent-rose-500 w-4 h-4"
                    />
                    <span className="font-medium text-rose-400">Tạm khóa</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* TWO COLUMNS: SECTION 2 & SECTION 3 SIDE-BY-SIDE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Section 2: Định danh công dân & Cư trú (eKYC) */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs border-b border-slate-800 pb-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>2. ĐỊNH DANH CÔNG DÂN & XÁC THỰC (eKYC)</span>
              </div>

              <div className="space-y-3.5">
                <Input
                  label="Số CCCD / CMTND"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="VD: 001200001234"
                />

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Trạng thái eKYC</label>
                  <div className="pt-2">
                    <label className="flex items-center gap-2.5 cursor-pointer text-slate-300 p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition">
                      <input
                        type="checkbox"
                        checked={isEkycVerified}
                        onChange={(e) => setIsEkycVerified(e.target.checked)}
                        className="accent-purple-500 w-4 h-4 rounded"
                      />
                      <span className="font-medium text-purple-200">Đã thẩm định định danh điện tử (eKYC Verified)</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Địa chỉ cư trú thường trú</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="VD: Số 12 Chùa Bộc, Phường Quang Trung, Đống Đa, Hà Nội"
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Hồ sơ sức khỏe & Sinh trắc cơ bản */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs border-b border-slate-800 pb-2.5">
                <Activity className="w-4 h-4" />
                <span>3. SINH TRẮC HỌC & HỒ SƠ Y TẾ CƠ BẢN</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Giới tính</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full min-h-[48px] bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2 text-white focus:outline-none focus:border-rose-500 text-sm"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Ngày sinh</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full min-h-[48px] bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2 text-white focus:outline-none focus:border-rose-500 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Nhóm máu</label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full min-h-[48px] bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2 text-white font-mono focus:outline-none focus:border-rose-500 text-sm"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bt) => (
                      <option key={bt} value={bt}>{bt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Chiều cao (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="170"
                    className="w-full min-h-[48px] bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2 text-white font-mono focus:outline-none focus:border-rose-500 text-sm"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-semibold text-slate-300">Cân nặng (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="68"
                    className="w-full min-h-[48px] bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2 text-white font-mono focus:outline-none focus:border-rose-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="flex items-center justify-between pt-5 border-t border-slate-800">
            <span className="text-slate-400 text-xs">
              Mọi thay đổi sẽ được ghi nhận vào nhật ký kiểm toán hệ thống.
            </span>
            <div className="flex items-center gap-3">
              <Button variant="outline" type="button" onClick={onClose} disabled={submitting}>
                Hủy bỏ
              </Button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1F7A8C] to-[#2F6FDB] hover:brightness-110 text-white font-semibold flex items-center gap-2 shadow-lg shadow-teal-500/20 transition cursor-pointer text-xs"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{targetUser ? 'Lưu Toàn Bộ Thay Đổi' : 'Tạo Mới Người Dùng'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
