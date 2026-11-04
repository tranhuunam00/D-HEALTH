import { useState, useEffect } from 'react';
import { FamilyMember } from '../../types/member.types';
import { User } from '../../types/auth.types';

export function useProfileLogic(initialUser?: User | null, initialMemberId?: string) {
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [activeMember, setActiveMember] = useState<FamilyMember>(() => {
    if (initialUser) {
      return {
        id: initialUser.activeMemberId || initialMemberId || 'nam',
        user_id: initialUser.id,
        full_name: initialUser.fullName || 'Trần Hữu Nam',
        relationship: 'owner',
        gender: 'Nam',
        birth_date: '1980-04-12',
        avatar_url: initialUser.avatarUrl,
        blood_type: initialUser.bloodType || 'O+',
        height_cm: initialUser.heightCm ? Number(initialUser.heightCm) : undefined,
        weight_kg: initialUser.weightKg ? Number(initialUser.weightKg) : undefined,
        is_above_18: true,
        consent_approved: true,
      };
    }
    return {
      id: 'nam',
      user_id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Trần Hữu Nam',
      relationship: 'owner',
      gender: 'Nam',
      birth_date: '1980-04-12',
      blood_type: 'O+',
      height_cm: undefined,
      weight_kg: undefined,
      is_above_18: true,
      consent_approved: true,
    };
  });

  const [fullName, setFullName] = useState(activeMember.full_name);
  const [gender, setGender] = useState<'Nam' | 'Nữ' | 'Khác'>(activeMember.gender);
  const [birthDate, setBirthDate] = useState(activeMember.birth_date);
  const [bloodType, setBloodType] = useState(activeMember.blood_type || 'O+');
  const [heightCm, setHeightCm] = useState(activeMember.height_cm ? String(activeMember.height_cm) : '');
  const [weightKg, setWeightKg] = useState(activeMember.weight_kg ? String(activeMember.weight_kg) : '');
  const [avatarUrl, setAvatarUrl] = useState(activeMember.avatar_url || '');
  const [citizenId, setCitizenId] = useState(
    (initialUser as any)?.national_id || (initialUser as any)?.nationalId || '001085012345'
  );
  const [address, setAddress] = useState('Hà Nội, Việt Nam');

  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const syncFormFromMember = (m: FamilyMember) => {
    setFullName(m.full_name);
    setGender(m.gender);
    setBirthDate(m.birth_date || '1980-04-12');
    setBloodType(m.blood_type || 'O+');
    setHeightCm(m.height_cm ? String(m.height_cm) : '');
    setWeightKg(m.weight_kg ? String(m.weight_kg) : '');
    setAvatarUrl(m.avatar_url || '');
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch('/api/user/profile', { headers });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.user) {
          setUser(json.data.user);
          if (json.data.user.national_id) {
            setCitizenId(json.data.user.national_id);
          }
        }
        if (json.data?.members && json.data.members.length > 0) {
          const owner = json.data.members.find((m: any) => m.relationship === 'owner') || json.data.members[0];
          setActiveMember(owner);
          syncFormFromMember(owner);
        }
      }
    } catch {
      // offline/fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [initialMemberId]);

  const handleUpdateProfile = async (payload: Partial<FamilyMember>) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`/api/user/profile/members/${activeMember.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Không thể lưu hồ sơ.');
      }
      if (json.data) {
        setActiveMember(json.data);
        syncFormFromMember(json.data);
        try {
          const stored = localStorage.getItem('dhealth_user');
          if (stored) {
            const u = JSON.parse(stored);
            u.fullName = json.data.full_name;
            u.avatarUrl = json.data.avatar_url;
            u.bloodType = json.data.blood_type;
            u.heightCm = json.data.height_cm;
            u.weightKg = json.data.weight_kg;
            localStorage.setItem('dhealth_user', JSON.stringify(u));
          }
        } catch {}
      }
      setIsEditOpen(false);
      setSuccessMsg('Đã lưu hồ sơ sức khỏe thành công!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi cập nhật hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDirect = () => {
    handleUpdateProfile({
      full_name: fullName,
      gender,
      birth_date: birthDate,
      blood_type: bloodType,
      height_cm: heightCm ? parseFloat(heightCm) : undefined,
      weight_kg: weightKg ? parseFloat(weightKg) : undefined,
      avatar_url: avatarUrl || undefined,
    });
  };

  const hNum = parseFloat(heightCm);
  const wNum = parseFloat(weightKg);
  const bmi = hNum > 0 && wNum > 0
    ? (wNum / Math.pow(hNum / 100, 2)).toFixed(1)
    : '--';

  return {
    user,
    activeMember,
    loading,
    isEditOpen,
    setIsEditOpen,
    successMsg,
    errorMsg,
    fullName,
    setFullName,
    gender,
    setGender,
    birthDate,
    setBirthDate,
    bloodType,
    setBloodType,
    heightCm,
    setHeightCm,
    weightKg,
    setWeightKg,
    avatarUrl,
    setAvatarUrl,
    citizenId,
    setCitizenId,
    address,
    setAddress,
    bmi,
    handleUpdateProfile,
    handleSaveDirect,
    fetchProfile,
  };
}
