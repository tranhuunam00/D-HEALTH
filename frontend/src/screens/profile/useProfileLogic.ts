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
        birth_date: '1985-06-20',
        avatar_url: initialUser.avatarUrl,
        blood_type: initialUser.bloodType || '',
        height_cm: initialUser.heightCm ? Number(initialUser.heightCm) : undefined,
        weight_kg: initialUser.weightKg ? Number(initialUser.weightKg) : undefined,
        is_above_18: true,
        consent_approved: true,
      };
    }
    return {
      id: 'nam',
      user_id: 'usr_default',
      full_name: 'Trần Hữu Nam',
      relationship: 'owner',
      gender: 'Nam',
      birth_date: '1985-06-20',
      blood_type: '',
      height_cm: undefined,
      weight_kg: undefined,
      is_above_18: true,
      consent_approved: true,
    };
  });
  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const baseUrl = typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null') ? window.location.origin : 'http://localhost';
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`${baseUrl}/api/user/profile`, { headers });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.user) setUser(json.data.user);
        if (json.data?.members && json.data.members.length > 0) {
          const owner = json.data.members.find((m: any) => m.relationship === 'owner') || json.data.members[0];
          setActiveMember(owner);
        }
      }
    } catch (err) {
      console.error('Lỗi tải hồ sơ cá nhân:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [initialMemberId]);

  const handleUpdateProfile = async (payload: Partial<FamilyMember>) => {
    setLoading(true);
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
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setActiveMember(json.data);
          // Đồng bộ lại vào localStorage
          try {
            const stored = localStorage.getItem('dhealth_user');
            if (stored) {
              const u = JSON.parse(stored);
              u.fullName = json.data.full_name;
              u.bloodType = json.data.blood_type;
              u.heightCm = json.data.height_cm;
              u.weightKg = json.data.weight_kg;
              localStorage.setItem('dhealth_user', JSON.stringify(u));
            }
          } catch {}
        }
        setIsEditOpen(false);
        setSuccessMsg('Hồ sơ sức khỏe đã được cập nhật thành công!');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error('Lỗi cập nhật hồ sơ:', err);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán BMI tự động nếu có đủ chiều cao và cân nặng
  const bmi = activeMember.height_cm && activeMember.weight_kg
    ? (Number(activeMember.weight_kg) / Math.pow(Number(activeMember.height_cm) / 100, 2)).toFixed(1)
    : '--';

  return {
    user,
    activeMember,
    loading,
    isEditOpen,
    setIsEditOpen,
    successMsg,
    bmi,
    handleUpdateProfile,
    fetchProfile,
  };
}
