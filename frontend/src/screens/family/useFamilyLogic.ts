import { useState, useEffect, useCallback } from 'react';
import {
  FAMILY_ADMIN_FILTER_KEYWORDS,
  FAMILY_EXCLUDED_MEMBER_IDS,
  FAMILY_RELATIONSHIP_TEXT_MAP,
} from './family.constants';

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
  readonly avatarUrl?: string;
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
  if (rel && rel in FAMILY_RELATIONSHIP_TEXT_MAP) {
    return (FAMILY_RELATIONSHIP_TEXT_MAP as Record<string, string>)[rel];
  }
  return rel || 'Thành viên gia đình';
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
    condition: m.chronic_conditions || 'Sức khoẻ ổn định',
    avatarUrl: m.avatar_url || m.avatarUrl || '',
  };
}

export function useFamilyLogic() {
  const [members, setMembers] = useState<readonly FamilyMemberViewModel[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      let userId = '';
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('dhealth_user');
          if (stored) {
            const u = JSON.parse(stored);
            if (u.id) userId = u.id;
          }
        } catch {}
      }

      const url = userId ? `/api/members?userId=${userId}` : '/api/members';
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json?.data)) {
          // Lọc bỏ tài khoản Quản Trị Viên Hệ Thống khỏi danh sách hồ sơ gia đình
          const patientMembers = json.data.filter((m: any) => {
            const isMemAdmin = FAMILY_EXCLUDED_MEMBER_IDS.includes(m.id);
            const nameLower = (m.full_name || '').toLowerCase();
            const isAdminName = FAMILY_ADMIN_FILTER_KEYWORDS.some((kw) => nameLower.includes(kw));
            return !isMemAdmin && !isAdminName;
          });
          setMembers(patientMembers.map(mapMemberToViewModel));
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
