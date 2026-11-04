import { useState, useEffect, useCallback } from 'react';

export interface EmergencyCardData {
  readonly fullName: string;
  readonly birthYear: number;
  readonly gender: string;
  readonly bloodType: string;
  readonly allergies: string;
  readonly conditions: string;
  readonly emergencyContact: {
    readonly name: string;
    readonly relationship: string;
    readonly phone: string;
  };
  readonly qrData: string;
}

function parseAllergies(card: any): string {
  if (Array.isArray(card.allergies) && card.allergies.length > 0) {
    return card.allergies
      .map((a: any) => `${a.allergen || a} (${a.reaction || 'Cần chú ý'})`)
      .join(', ');
  }
  return card.emergency_notes || 'Không ghi nhận';
}

function parseConditions(card: any): string {
  if (Array.isArray(card.chronic_conditions) && card.chronic_conditions.length > 0) {
    return card.chronic_conditions.join(', ');
  }
  return 'Không ghi nhận bệnh nền';
}

export function useEmergencyLogic(memberId = 'nam', activeMemberName?: string) {
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
            contact_name: 'Người thân',
            relationship: 'Liên hệ',
            phone_number: '115',
          };

          setEmergencyData({
            fullName: activeMemberName || 'Trần Hữu Nam',
            birthYear: 1980,
            gender: 'Nam',
            bloodType: card.blood_group_snapshot || 'Chưa rõ',
            allergies: parseAllergies(card),
            conditions: parseConditions(card),
            emergencyContact: {
              name: primaryContact.contact_name || 'Người thân',
              relationship: primaryContact.relationship || 'Liên hệ',
              phone: primaryContact.phone_number || '115',
            },
            qrData: card.offline_qr_payload || `DHEALTH:EMERGENCY:${memberId}`,
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

  useEffect(() => {
    fetchEmergency();
  }, [fetchEmergency]);

  return {
    emergencyData,
    loading,
    refetch: fetchEmergency,
  };
}
