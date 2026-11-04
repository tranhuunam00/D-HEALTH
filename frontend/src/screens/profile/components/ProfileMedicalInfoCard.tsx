import React from 'react';

export interface ProfileMedicalInfoCardProps {
  bloodType: string;
  heightCm: string;
  weightKg: string;
  bmi: string;
  onOpenEditModal: () => void;
}

export const ProfileMedicalInfoCard: React.FC<ProfileMedicalInfoCardProps> = ({
  bloodType,
  heightCm,
  weightKg,
  bmi,
  onOpenEditModal,
}) => {
  const getBmiCategory = (val: string) => {
    const n = parseFloat(val);
    if (isNaN(n) || n <= 0) return { label: 'Chưa đủ dữ liệu', color: 'text-slate-500' };
    if (n < 18.5) return { label: 'Thiếu cân', color: 'text-amber-500' };
    if (n < 23) return { label: 'Bình thường (chuẩn Châu Á)', color: 'text-emerald-600' };
    if (n < 25) return { label: 'Tiền béo phì', color: 'text-amber-600' };
    return { label: 'Béo phì', color: 'text-rose-600' };
  };

  const bmiCat = getBmiCategory(bmi);

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
          THÔNG TIN Y TẾ
        </span>
        <button
          type="button"
          onClick={onOpenEditModal}
          className="text-xs font-bold text-[#1F7A8C] hover:underline"
        >
          Chỉnh sửa chi tiết
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2.5 text-center pt-1">
        <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500 block">Nhóm máu</span>
          <span className="text-lg font-black text-rose-600 block mt-0.5">{bloodType || 'O+'}</span>
        </div>

        <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500 block">Chiều cao</span>
          <span className="text-lg font-black text-slate-900 block mt-0.5">
            {heightCm} <span className="text-xs font-normal text-slate-500">cm</span>
          </span>
        </div>

        <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100">
          <span className="text-[11px] font-medium text-slate-500 block">Cân nặng</span>
          <span className="text-lg font-black text-slate-900 block mt-0.5">
            {weightKg.replace('.', ',')} <span className="text-xs font-normal text-slate-500">kg</span>
          </span>
        </div>
      </div>

      {/* Automatic Live BMI feedback from Height & Weight */}
      <div className="bg-[#E0F2FE]/40 border border-[#BAE6FD]/60 rounded-2xl p-3 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700">Chỉ số khối (BMI):</span>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-black text-slate-900">{bmi}</span>
          <span className={`text-[11px] font-bold ${bmiCat.color}`}>• {bmiCat.label}</span>
        </div>
      </div>
    </div>
  );
};
