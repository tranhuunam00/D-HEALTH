import React, { useState, useEffect, useRef } from 'react';
import { Camera, Activity } from 'lucide-react';
import { BottomSheet } from '../../components/organisms/BottomSheet';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { FamilyMember } from '../../types/member.types';
import { classifyBmi } from '../../utils/bmi.utils';
import { formatAvatarUrl } from '../../config/native-network';

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
  const [avatarUrl, setAvatarUrl] = useState(member.avatar_url || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFullName(member.full_name);
    setGender(member.gender);
    setBirthDate(member.birth_date);
    setBloodType(member.blood_type || 'O+');
    setHeightCm(String(member.height_cm || ''));
    setWeightKg(String(member.weight_kg || ''));
    setAvatarUrl(member.avatar_url || '');
  }, [member, isOpen]);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const hVal = parseFloat(heightCm);
  const wVal = parseFloat(weightKg);
  const liveBmi = hVal > 0 && wVal > 0 ? (wVal / Math.pow(hVal / 100, 2)).toFixed(1) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      full_name: fullName,
      gender,
      birth_date: birthDate,
      blood_type: bloodType,
      height_cm: heightCm ? parseFloat(heightCm) : undefined,
      weight_kg: weightKg ? parseFloat(weightKg) : undefined,
      avatar_url: avatarUrl || undefined,
    });
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Chỉnh Sửa Hồ Sơ Sức Khỏe">
      <form onSubmit={handleSubmit} className="space-y-3.5 pb-2">
        {/* Avatar Upload Picker */}
        <div className="flex flex-col items-center justify-center pt-1 pb-2">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-teal-400 overflow-hidden flex items-center justify-center text-xl font-bold text-white shadow">
              {avatarUrl ? (
                <img src={formatAvatarUrl(avatarUrl)} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{(fullName || 'B').charAt(0)}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-slate-900 border border-white text-white flex items-center justify-center shadow hover:bg-slate-800 transition"
              title="Đổi ảnh đại diện"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleAvatarFile}
              className="hidden"
            />
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[11px] font-semibold text-teal-400 hover:underline mt-1.5"
          >
            Đổi ảnh đại diện
          </button>
        </div>

        <Input
          label="Họ và tên"
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
            placeholder="174"
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
          />
          <Input
            label="Cân nặng (kg)"
            placeholder="72.5"
            type="number"
            step="0.1"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
        </div>

        {/* Real-time Live BMI feedback from Height and Weight */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Activity className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="font-semibold">Chỉ số khối (BMI) tự động:</span>
          </div>
          {liveBmi ? (() => {
            const bmiCat = classifyBmi(liveBmi);
            return (
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-white">{liveBmi}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bmiCat.badgeClass}`}>
                  {bmiCat.label}
                </span>
              </div>
            );
          })() : (
            <span className="text-slate-400 italic">Nhập chiều cao & cân nặng</span>
          )}
        </div>

        {/* Chuẩn phân loại 8 mức BMI */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-2.5 text-[10px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300 uppercase tracking-wider">Thang đo BMI chuẩn:</div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
            <div>• BMI &lt; 16: Gầy độ III</div>
            <div>• 25 ≤ BMI &lt; 30: Thừa cân</div>
            <div>• 16 ≤ BMI &lt; 17: Gầy độ II</div>
            <div>• 30 ≤ BMI &lt; 35: Béo phì độ 1</div>
            <div>• 17 ≤ BMI &lt; 18.5: Gầy độ I</div>
            <div>• 35 ≤ BMI &lt; 40: Béo phì độ II</div>
            <div className="text-teal-400 font-semibold">• 18.5 ≤ BMI &lt; 25: Bình thường</div>
            <div>• BMI ≥ 40: Béo phì độ III</div>
          </div>
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
