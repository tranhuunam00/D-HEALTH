import { useState, useEffect, useCallback } from 'react';

export interface FamilyMemberViewModel {
  readonly id: string;
  readonly fullName: string;
  readonly relationshipText: string;
  readonly age: number;
  readonly gender: string;
  readonly bloodType: string;
  readonly isAbove18: boolean;
  readonly consentApproved: boolean;
  readonly condition?: string;
}

function calculateAge(birthDate?: string): number {
  if (!birthDate) return 0;
  try {
    const birthYear = new Date(birthDate).getFullYear();
    if (isNaN(birthYear)) return 0;
    return new Date().getFullYear() - birthYear;
  } catch {
    return 0;
  }
}

function formatRelationship(rel?: string): string {
  switch (rel) {
    case 'owner':
      return 'Chủ tài khoản';
    case 'spouse':
      return 'Vợ / Chồng';
    case 'child':
      return 'Con';
    case 'parent':
      return 'Bố / Mẹ';
    default:
      return rel || 'Thành viên gia đình';
  }
}

function mapMemberToViewModel(m: any): FamilyMemberViewModel {
  return {
    id: m.id,
    fullName: m.full_name || 'Thành viên',
    relationshipText: formatRelationship(m.relationship),
    age: calculateAge(m.birth_date),
    gender: m.gender || 'Khác',
    bloodType: m.blood_type || '--',
    isAbove18: Boolean(m.is_above_18),
    consentApproved: Boolean(m.consent_approved),
    condition: m.relationship === 'owner' ? 'Tăng huyết áp · ĐTĐ type 2' : 'Sức khoẻ ổn định',
  };
}

export function useFamilyLogic() {
  const [members, setMembers] = useState<readonly FamilyMemberViewModel[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const res = await fetch('/api/members', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json?.data)) {
          setMembers(json.data.map(mapMemberToViewModel));
          return;
        }
      }
      setMembers([]);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    loading,
    refetch: fetchMembers,
  };
}

