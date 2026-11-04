import { useState, useEffect, useCallback } from 'react';

export interface PassportMember {
  readonly id: string;
  readonly fullName: string;
  readonly isOwner: boolean;
  readonly relationship: string;
  readonly gender: string;
  readonly age: number;
  readonly heightCm: number;
  readonly weightKg: number;
  readonly bmi: number;
  readonly bloodType: string;
}

export type PassportMemberInfo = PassportMember;

export interface PassportCounts {
  readonly allergies: number;
  readonly chronic: number;
  readonly meds: number;
  readonly labs: number;
  readonly imaging: number;
  readonly pathology: number;
  readonly documents: number;
  readonly doctors: number;
  readonly facilities: number;
}

const DEFAULT_COUNTS: PassportCounts = {
  allergies: 1,
  chronic: 2,
  meds: 3,
  labs: 24,
  imaging: 7,
  pathology: 2,
  documents: 31,
  doctors: 6,
  facilities: 4,
};

export function useRecordsLogic(memberId = 'nam') {
  const [member, setMember] = useState<PassportMember | null>(null);
  const [counts, setCounts] = useState<PassportCounts>(DEFAULT_COUNTS);
  const [loading, setLoading] = useState(false);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const res = await fetch(`/api/user/profile/passport-summary/${memberId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          setMember(json.data.member);
          if (json.data.counts) {
            setCounts(json.data.counts);
          }
          return;
        }
      }
    } catch {
      // Maintain state
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    member,
    counts,
    loading,
    refetch: fetchSummary,
  };
}
