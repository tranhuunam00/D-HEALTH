import React, { useState, useEffect } from 'react';
import { BottomSheet } from '../../components/organisms/BottomSheet';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { FamilyMember } from '../../types/member.types';

export interface EditProfileBottomSheetProps {
  isOpen: boolean;
  member: FamilyMember;
  onClose: () => void;
  onSubmit: (data: Partial<FamilyMember>) => void;
}

export const EditProfileBottomSheet: React.FC<EditProfileBottomSheetProps> = ({
  isOpen,
  member,
  onClose,
  onSubmit,
}) => {
  const [fullName, setFullName] = useState(member.full_name);
  const [gender, setGender] = useState(member.gender);
  const [birthDate, setBirthDate] = useState(member.birth_date);
  const [bloodType, setBloodType] = useState(member.blood_type || 'O+');
  const [heightCm, setHeightCm] = useState(String(member.height_cm || ''));
  const [weightKg, setWeightKg] = useState(String(member.weight_kg || ''));

  useEffect(() => {
    setFullName(member.full_name);
    setGender(member.gender);
    setBirthDate(member.birth_date);
    setBloodType(member.blood_type || 'O+');
    setHeightCm(String(member.height_cm || ''));
    setWeightKg(String(member.weight_kg || ''));
  }, [member, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      full_name: fullName,
      gender,
      birth_date: birthDate,
      blood_type: bloodType,
      height_cm: heightCm ? parseFloat(heightCm) : undefined,
      weight_kg: weightKg ? parseFloat(weightKg) : undefined,
    });
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Chỉnh Sửa Hồ Sơ Sức Khỏe">
      <form onSubmit={handleSubmit} className="space-y-3.5 pb-2">
        <Input
          label="Họ và tên bệnh nhân"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Giới tính</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="min-h-[48px] px-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:border-[#1F7A8C] focus:outline-none"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Nhóm máu</label>
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className="min-h-[48px] px-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:border-[#1F7A8C] focus:outline-none"
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Ngày sinh"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Chiều cao (cm)"
            placeholder="170"
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
          />
          <Input
            label="Cân nặng (kg)"
            placeholder="65"
            type="number"
            step="0.5"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
        </div>

        <div className="flex gap-2 pt-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Hủy
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            Lưu Hồ Sơ
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};
