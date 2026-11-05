import React, { useState, useEffect } from 'react';
import { X, Stethoscope, Save, Loader2 } from 'lucide-react';
import { DoctorItem } from './DoctorsGrid';

interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, any>) => Promise<boolean>;
  doctor?: DoctorItem | null;
  departments: Array<{ id: string; name: string }>;
  facilities: Array<{ id: string; name: string }>;
}

const ACADEMIC_TITLES = ['BS', 'ThS.BS', 'BS.CKI', 'BS.CKII', 'TS.BS', 'PGS.TS', 'GS.TS'];

export const DoctorModal: React.FC<DoctorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  doctor,
  departments,
  facilities,
}) => {
  const [formData, setFormData] = useState({
    full_name: '',
    academic_title: 'BS.CKI',
    department_id: '',
    facility_id: '',
    license_number: '',
    phone_number: '',
    email: '',
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (doctor) {
      setFormData({
        full_name: doctor.full_name || '',
        academic_title: doctor.academic_title || 'BS.CKI',
        department_id: (doctor as any).department_id || (departments[0]?.id ?? ''),
        facility_id: (doctor as any).facility_id || (facilities[0]?.id ?? ''),
        license_number: (doctor as any).license_number || doctor.license_no || '',
        phone_number: (doctor as any).phone_number || '',
        email: (doctor as any).email || '',
        is_active: doctor.is_active ?? true,
      });
    } else {
      setFormData({
        full_name: '',
        academic_title: 'BS.CKI',
        department_id: departments[0]?.id || '',
        facility_id: facilities[0]?.id || '',
        license_number: `CCHN-0${Math.floor(1000 + Math.random() * 9000)}`,
        phone_number: '',
        email: '',
        is_active: true,
      });
    }
    setErrorMsg('');
  }, [doctor, isOpen, departments, facilities]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên bác sĩ');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');

    const success = await onSave(formData);
    setSubmitting(false);
    if (success) {
      onClose();
    } else {
      setErrorMsg('Có lỗi xảy ra khi lưu thông tin bác sĩ.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0B132B] border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {doctor ? 'Chỉnh Sửa Thông Tin Bác Sĩ' : 'Thêm Bác Sĩ Chuyên Khoa Mới'}
              </h3>
              <p className="text-[10px] text-slate-400">Hồ sơ danh bạ bác sĩ & đội ngũ My Care Team</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Họ và tên bác sĩ <span className="text-rose-400">*</span></label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="VD: Nguyễn Văn An"
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Học hàm / Học vị</label>
              <select
                value={formData.academic_title}
                onChange={(e) => setFormData({ ...formData, academic_title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {ACADEMIC_TITLES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Chuyên khoa / Khoa phòng</label>
              <select
                value={formData.department_id}
                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Chọn chuyên khoa --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Cơ sở y tế công tác</label>
              <select
                value={formData.facility_id}
                onChange={(e) => setFormData({ ...formData, facility_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Chọn cơ sở y tế --</option>
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Số giấy phép CCHN</label>
              <input
                type="text"
                value={formData.license_number}
                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                placeholder="VD: CCHN-01928"
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 font-mono text-purple-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Số điện thoại liên hệ</label>
              <input
                type="text"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="VD: 090 123 4567"
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-slate-300 font-semibold">Email bác sĩ</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="VD: bs.an@bachmai.vn"
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-slate-300 font-semibold">Trạng thái công tác</label>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="doctor_is_active"
                    checked={formData.is_active === true}
                    onChange={() => setFormData({ ...formData, is_active: true })}
                    className="accent-emerald-500"
                  />
                  <span>Đang công tác</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="doctor_is_active"
                    checked={formData.is_active === false}
                    onChange={() => setFormData({ ...formData, is_active: false })}
                    className="accent-rose-500"
                  />
                  <span>Nghỉ phép / Tạm ngừng</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-[#1F7A8C] hover:bg-[#186473] text-white font-semibold flex items-center gap-2 shadow-lg shadow-teal-500/20 transition"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{doctor ? 'Lưu Thay Đổi' : 'Tạo Mới Bác Sĩ'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
