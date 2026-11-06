import { useState, useEffect, useCallback } from 'react';

export interface EmergencyCardData {
  readonly fullName: string;
  readonly birthYear: number;
  readonly gender: string;
  readonly bloodType: string;
  readonly allergies: string;
  readonly rawAllergies: string[];
  readonly conditions: string;
  readonly emergencyContact: {
    readonly name: string;
    readonly relationship: string;
    readonly phone: string;
  };
  readonly emergencyNotes?: string;
  readonly qrData: string;
}

function parseAllergies(card: any): { display: string; list: string[] } {
  if (Array.isArray(card.allergies) && card.allergies.length > 0) {
    const list = card.allergies.map((a: any) => (typeof a === 'string' ? a : a.allergen || String(a)));
    const display = card.allergies
      .map((a: any) => (typeof a === 'string' ? a : `${a.allergen || a} (${a.reaction || 'Cần chú ý'})`))
      .join(', ');
    return { display, list };
  }
  return { display: card.emergency_notes || 'Không ghi nhận dị ứng', list: [] };
}

function parseConditions(card: any): string {
  if (Array.isArray(card.chronic_conditions) && card.chronic_conditions.length > 0) {
    return card.chronic_conditions.join(', ');
  }
  return 'Không ghi nhận bệnh nền';
}

export function useEmergencyLogic(memberId = 'mem_145deb71', activeMemberName?: string) {
  const [emergencyData, setEmergencyData] = useState<EmergencyCardData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchEmergency = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/emergency/${memberId}`);
      if (res.ok) {
        const json = await res.json();
        const card = json?.data?.card;
        const contacts = json?.data?.contacts || [];

        if (card) {
          const primaryContact = contacts[0] || {
            contact_name: 'Bác sĩ điều trị / 115',
            relationship: 'Y tế khẩn cấp',
            phone_number: '115',
          };

          const parsedAllergies = parseAllergies(card);

          setEmergencyData({
            fullName: card.member_name || activeMemberName || 'Bệnh nhân',
            birthYear: card.member_birth_date ? new Date(card.member_birth_date).getFullYear() : 1990,
            gender: card.member_gender || 'Khác',
            bloodType: card.blood_group_snapshot || card.member_blood_type || 'Chưa cập nhật',
            allergies: parsedAllergies.display,
            rawAllergies: parsedAllergies.list,
            conditions: parseConditions(card),
            emergencyContact: {
              name: primaryContact.contact_name || 'Bác sĩ điều trị / 115',
              relationship: primaryContact.relationship || 'Y tế khẩn cấp',
              phone: primaryContact.phone_number || '115',
            },
            emergencyNotes: card.emergency_notes || '',
            qrData: card.offline_qr_payload || `DHEALTH:EMERGENCY:${memberId}:${card.blood_group_snapshot || card.member_blood_type || 'UNKNOWN'}`,
          });
          return;
        }
      }
      setEmergencyData(null);
    } catch {
      setEmergencyData(null);
    } finally {
      setLoading(false);
    }
  }, [memberId, activeMemberName]);

  const saveEmergencyCard = async (payload: {
    bloodType?: string;
    allergies: string[];
    chronicConditions?: string[];
    emergencyNotes?: string;
    contacts?: Array<{ name: string; relationship: string; phone: string }>;
  }) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/emergency/${memberId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchEmergency();
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergency();
  }, [fetchEmergency]);

  return {
    emergencyData,
    loading,
    refetch: fetchEmergency,
    saveEmergencyCard,
  };
}
