import React from 'react';
import { ChevronDown } from 'lucide-react';
import { classifyBmi } from '../../../utils/bmi.utils';

export interface ProfileMedicalInfoCardProps {
  bloodType: string;
  setBloodType: (val: string) => void;
  heightCm: string;
  setHeightCm: (val: string) => void;
  weightKg: string;
  setWeightKg: (val: string) => void;
  bmi: string;
}

export const ProfileMedicalInfoCard: React.FC<ProfileMedicalInfoCardProps> = ({
  bloodType,
  setBloodType,
  heightCm,
  setHeightCm,
  weightKg,
  setWeightKg,
  bmi,
}) => {
  const bmiCat = classifyBmi(bmi);

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
          THÔNG TIN Y TẾ
        </span>
        <span className="text-[10px] text-[#1F7A8C] font-semibold bg-[#E0F2FE]/60 px-2 py-0.5 rounded-full">
          Chọn nhóm máu & nhập số đo
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 pt-1">
        {/* Nhóm máu (Select Dropdown) */}
        <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100 flex flex-col items-center">
          <label className="text-[11px] font-medium text-slate-500 block mb-1">Nhóm máu</label>
          <div className="relative w-full">
            <select
              value={bloodType || ''}
              onChange={(e) => setBloodType(e.target.value)}
              className="w-full h-9 text-sm font-bold text-rose-600 bg-white border border-slate-200 rounded-xl pl-3 pr-6 py-1 outline-none focus:border-[#1F7A8C] appearance-none cursor-pointer text-center"
            >
              <option value="">Chọn</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Chiều cao */}
        <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100 flex flex-col items-center">
          <label className="text-[11px] font-medium text-slate-500 block mb-1">Chiều cao (cm)</label>
          <div className="relative w-full">
            <input
              type="number"
              step="0.5"
              min="30"
              max="250"
              value={heightCm}
              placeholder="cm"
              onChange={(e) => setHeightCm(e.target.value)}
              className="w-full h-9 text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-xl px-2 py-1 outline-none focus:border-[#1F7A8C] text-center"
            />
          </div>
        </div>

        {/* Cân nặng */}
        <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100 flex flex-col items-center">
          <label className="text-[11px] font-medium text-slate-500 block mb-1">Cân nặng (kg)</label>
          <div className="relative w-full">
            <input
              type="number"
              step="0.1"
              min="2"
              max="300"
              value={weightKg}
              placeholder="kg"
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full h-9 text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-xl px-2 py-1 outline-none focus:border-[#1F7A8C] text-center"
            />
          </div>
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
