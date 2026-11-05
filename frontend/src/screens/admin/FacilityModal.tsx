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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-[#1F7A8C] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {facility ? 'Chỉnh Sửa Cơ Sở Y Tế' : 'Thêm Cơ Sở Y Tế Mới'}
              </h3>
              <p className="text-[10px] text-slate-500">Danh mục cơ sở đối tác kết nối liên thông</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs bg-slate-50/40">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <label className="text-slate-700 font-semibold">Tên cơ sở y tế <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Bệnh viện Bạch Mai"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#1F7A8C] text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-semibold">Mã định danh (Code)</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="VD: 01001"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-300 font-mono text-[#1F7A8C] font-bold text-sm focus:outline-none focus:border-[#1F7A8C]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-semibold">Phân loại tuyến</label>
              <select
                value={formData.facility_type}
                onChange={(e) => setFormData({ ...formData, facility_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#1F7A8C] text-sm"
              >
                <option value="hospital_tw">Hospital Tw (Tuyến TW)</option>
                <option value="hospital_provincial">Hospital Provincial (Tuyến Tỉnh)</option>
                <option value="clinic">Phòng khám đa khoa / chuyên khoa</option>
                <option value="lab_center">Trung tâm xét nghiệm / CĐHA</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-semibold">Tỉnh / Thành phố</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="VD: Hà Nội"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#1F7A8C] text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-semibold">Hotline tổng đài</label>
              <input
                type="text"
                value={formData.hotline}
                onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
                placeholder="VD: 024 3869 3731"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-300 text-slate-900 font-mono text-sm focus:outline-none focus:border-[#1F7A8C]"
              />
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-slate-700 font-semibold">Địa chỉ chi tiết</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="VD: 78 Giải Phóng, Phương Mai, Đống Đa, Hà Nội"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-[#1F7A8C] text-sm"
              />
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-slate-700 font-semibold">Trạng thái kết nối</label>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-800 font-medium">
                  <input
                    type="radio"
                    name="is_active"
                    checked={formData.is_active === true}
                    onChange={() => setFormData({ ...formData, is_active: true })}
                    className="accent-[#1F7A8C] w-4 h-4"
                  />
                  <span>Đang hoạt động</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-800 font-medium">
                  <input
                    type="radio"
                    name="is_active"
                    checked={formData.is_active === false}
                    onChange={() => setFormData({ ...formData, is_active: false })}
                    className="accent-rose-500 w-4 h-4"
                  />
                  <span>Tạm dừng kết nối</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-[#1F7A8C] hover:bg-[#186473] text-white font-semibold flex items-center gap-2 shadow-sm transition cursor-pointer"
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
