import { useState, useEffect } from 'react';
import { FamilyMember } from '../../types/member.types';
import { User } from '../../types/auth.types';

export function useProfileLogic() {
  const [user, setUser] = useState<User | null>(null);
  const [activeMember, setActiveMember] = useState<FamilyMember>({
    id: 'mem_me',
    user_id: 'usr_default',
    full_name: 'Trần Hữu Nam',
    relationship: 'owner',
    gender: 'Nam',
    birth_date: '1992-08-15',
    blood_type: 'O+',
    height_cm: 172,
    weight_kg: 68,
    is_above_18: true,
    consent_approved: true,
  });
  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const baseUrl = typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null') ? window.location.origin : 'http://localhost';
      const res = await fetch(`${baseUrl}/api/user/profile`);
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
  }, []);

  const handleUpdateProfile = async (payload: Partial<FamilyMember>) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/profile/members/${activeMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) setActiveMember(json.data);
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

  // Tính toán BMI tự động
  const bmi = activeMember.height_cm && activeMember.weight_kg
    ? (activeMember.weight_kg / Math.pow(activeMember.height_cm / 100, 2)).toFixed(1)
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
