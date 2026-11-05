import React, { useState, useEffect } from 'react';
import { X, Building2, Save, Loader2 } from 'lucide-react';
import { FacilityItem } from './FacilitiesGrid';

interface FacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, any>) => Promise<boolean>;
  facility?: FacilityItem | null;
}

export const FacilityModal: React.FC<FacilityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  facility,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    facility_type: 'hospital_tw',
    city: 'Hà Nội',
    hotline: '',
    emergency_phone: '',
    address: '',
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (facility) {
      setFormData({
        name: facility.name || '',
        code: facility.code || '',
        facility_type: facility.facility_type || 'hospital_tw',
        city: facility.city || 'Hà Nội',
        hotline: facility.hotline || '',
        emergency_phone: (facility as any).emergency_phone || '',
        address: (facility as any).address || '',
        is_active: facility.is_active ?? true,
      });
    } else {
      setFormData({
        name: '',
        code: `0${Math.floor(1000 + Math.random() * 9000)}`,
        facility_type: 'hospital_tw',
        city: 'Hà Nội',
        hotline: '',
        emergency_phone: '',
        address: '',
        is_active: true,
      });
    }
    setErrorMsg('');
  }, [facility, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Vui lòng nhập tên cơ sở y tế');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');

    const success = await onSave(formData);
    setSubmitting(false);
    if (success) {
      onClose();
    } else {
      setErrorMsg('Có lỗi xảy ra khi lưu thông tin cơ sở y tế.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0B132B] border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {facility ? 'Chỉnh Sửa Cơ Sở Y Tế' : 'Thêm Cơ Sở Y Tế Mới'}
              </h3>
              <p className="text-[10px] text-slate-400">Danh mục cơ sở đối tác kết nối liên thông</p>
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
            <div className="space-y-1 col-span-2">
              <label className="text-slate-300 font-semibold">Tên cơ sở y tế <span className="text-rose-400">*</span></label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Bệnh viện Bạch Mai"
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Mã định danh (Code)</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="VD: 01001"
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 font-mono text-purple-300 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Phân loại tuyến</label>
              <select
                value={formData.facility_type}
                onChange={(e) => setFormData({ ...formData, facility_type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 focus:outline-none focus:border-teal-500"
              >
                <option value="hospital_tw">Hospital Tw (Tuyến TW)</option>
                <option value="hospital_provincial">Hospital Provincial (Tuyến Tỉnh)</option>
                <option value="clinic">Phòng khám đa khoa / chuyên khoa</option>
                <option value="lab_center">Trung tâm xét nghiệm / CĐHA</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Tỉnh / Thành phố</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="VD: Hà Nội"
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Hotline tổng đài</label>
              <input
                type="text"
                value={formData.hotline}
                onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
                placeholder="VD: 024 3869 3731"
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white font-mono focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-slate-300 font-semibold">Địa chỉ chi tiết</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="VD: 78 Giải Phóng, Phương Mai, Đống Đa, Hà Nội"
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-slate-300 font-semibold">Trạng thái kết nối</label>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="is_active"
                    checked={formData.is_active === true}
                    onChange={() => setFormData({ ...formData, is_active: true })}
                    className="accent-teal-500"
                  />
                  <span>Đang hoạt động</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="is_active"
                    checked={formData.is_active === false}
                    onChange={() => setFormData({ ...formData, is_active: false })}
                    className="accent-rose-500"
                  />
                  <span>Tạm dừng kết nối</span>
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
                  <span>{facility ? 'Lưu Thay Đổi' : 'Tạo Mới CSYT'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

