import { useState, useEffect } from 'react';
import { FamilyMember } from '../../types/member.types';
import { User } from '../../types/auth.types';

export function useProfileLogic(initialUser?: User | null, initialMemberId?: string) {
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [activeMember, setActiveMember] = useState<FamilyMember>(() => {
    if (initialUser) {
      return {
        id: initialUser.activeMemberId || initialMemberId || '',
        user_id: initialUser.id,
        full_name: initialUser.fullName || '',
        relationship: 'owner',
        gender: 'Khác',
        birth_date: '',
        avatar_url: initialUser.avatarUrl,
        blood_type: initialUser.bloodType || '',
        height_cm: initialUser.heightCm ? Number(initialUser.heightCm) : undefined,
        weight_kg: initialUser.weightKg ? Number(initialUser.weightKg) : undefined,
        is_above_18: true,
        consent_approved: true,
      };
    }
    return {
      id: '',
      user_id: '',
      full_name: '',
      relationship: 'owner',
      gender: 'Khác',
      birth_date: '',
      blood_type: '',
      height_cm: undefined,
      weight_kg: undefined,
      is_above_18: true,
      consent_approved: true,
    };
  });

  const [fullName, setFullName] = useState(activeMember.full_name);
  const [gender, setGender] = useState<'Nam' | 'Nữ' | 'Khác'>(activeMember.gender);
  const [birthDate, setBirthDate] = useState(activeMember.birth_date);
  const [bloodType, setBloodType] = useState(activeMember.blood_type || '');
  const [heightCm, setHeightCm] = useState(activeMember.height_cm ? String(activeMember.height_cm) : '');
  const [weightKg, setWeightKg] = useState(activeMember.weight_kg ? String(activeMember.weight_kg) : '');
  const [avatarUrl, setAvatarUrl] = useState(activeMember.avatar_url || '');
  const [citizenId, setCitizenId] = useState((initialUser as any)?.national_id || (initialUser as any)?.nationalId || '');
  const [address, setAddress] = useState((initialUser as any)?.address || '');

  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatIsoDate = (d?: string | null) => {
    if (!d) return '';
    return d.split('T')[0];
  };

  const syncFormFromMember = (m: FamilyMember) => {
    setFullName(m.full_name || '');
    setGender(m.gender || 'Khác');
    setBirthDate(formatIsoDate(m.birth_date));
    setBloodType(m.blood_type || '');
    setHeightCm(m.height_cm ? String(m.height_cm) : '');
    setWeightKg(m.weight_kg ? String(m.weight_kg) : '');
    setAvatarUrl(m.avatar_url || '');
    if ((m as any).insurance_number && !citizenId) {
      setCitizenId((m as any).insurance_number);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const memberQuery = initialMemberId ? `?memberId=${encodeURIComponent(initialMemberId)}` : '';
      const res = await fetch(`/api/user/profile${memberQuery}`, { headers });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.user) {
          setUser(json.data.user);
          if (json.data.user.national_id || json.data.user.nationalId || json.data.user.citizenId) {
            setCitizenId(json.data.user.national_id || json.data.user.nationalId || json.data.user.citizenId);
          }
          if (json.data.user.address) {
            setAddress(json.data.user.address);
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
    if (initialUser) {
      if ((initialUser as any).national_id || (initialUser as any).nationalId || (initialUser as any).citizenId) {
        setCitizenId((initialUser as any).national_id || (initialUser as any).nationalId || (initialUser as any).citizenId);
      }
      if ((initialUser as any).address) {
        setAddress((initialUser as any).address);
      }
    }
  }, [initialUser]);

  useEffect(() => {
    fetchProfile();
  }, [initialMemberId]);

  const handleUpdateProfile = async (payload: any) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // Nếu avatar là ảnh mới dạng Base64, upload trực tiếp lên MinIO trước
      let minioAvatarUrl = payload.avatar_url;
      if (minioAvatarUrl && minioAvatarUrl.startsWith('data:image/')) {
        try {
          const upRes = await fetch('/api/storage/upload', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              bucket: 'dhealth-avatars',
              dataBase64: minioAvatarUrl,
            }),
          });
          const upJson = await upRes.json();
          if (upJson.success && upJson.data?.url) {
            minioAvatarUrl = upJson.data.url;
            setAvatarUrl(minioAvatarUrl);
            payload.avatar_url = minioAvatarUrl;
          }
        } catch {
          // nếu minio upload lỗi sẽ gửi trực tiếp payload
        }
      }

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
        const updatedMember = json.data.member || json.data;
        const updatedUser = json.data.user;
        setActiveMember(updatedMember);
        syncFormFromMember(updatedMember);
        if (updatedUser) {
          setUser(updatedUser);
          if (updatedUser.national_id) setCitizenId(updatedUser.national_id);
          if (updatedUser.address) setAddress(updatedUser.address);
        } else {
          if (payload.citizenId) setCitizenId(payload.citizenId);
          if (payload.address) setAddress(payload.address);
        }
        try {
          const stored = localStorage.getItem('dhealth_user');
          if (stored) {
            const u = JSON.parse(stored);
            u.fullName = updatedMember.full_name;
            u.avatarUrl = updatedMember.avatar_url;
            u.bloodType = updatedMember.blood_type;
            u.heightCm = updatedMember.height_cm;
            u.weightKg = updatedMember.weight_kg;
            if (updatedUser) {
              u.national_id = updatedUser.national_id;
              u.nationalId = updatedUser.national_id;
              u.citizenId = updatedUser.national_id;
              u.address = updatedUser.address;
            } else {
              if (payload.citizenId) {
                u.national_id = payload.citizenId;
                u.nationalId = payload.citizenId;
                u.citizenId = payload.citizenId;
              }
              if (payload.address) u.address = payload.address;
            }
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
      birth_date: birthDate || null,
      blood_type: bloodType || null,
      height_cm: heightCm ? parseFloat(heightCm) : undefined,
      weight_kg: weightKg ? parseFloat(weightKg) : undefined,
      avatar_url: avatarUrl || undefined,
      citizenId: citizenId || null,
      address: address || null,
      email: user?.email || null,
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
