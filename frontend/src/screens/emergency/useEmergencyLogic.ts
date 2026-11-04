import { useState, useEffect } from 'react';

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

const DEFAULT_EMERGENCY_DATA: EmergencyCardData = Object.freeze({
  fullName: 'Trần Hữu Nam',
  birthYear: 1985,
  gender: 'Nam',
  bloodType: 'O+',
  allergies: 'Penicillin (Sốc phản vệ độ 2)',
  conditions: 'Tăng huyết áp độ 1, Đái tháo đường type 2',
  emergencyContact: {
    name: 'Nguyễn Thị Mai',
    relationship: 'Vợ',
    phone: '0988 777 666',
  },
  qrData: 'DHEALTH:EMERGENCY:O+:ALLERGIES=Penicillin:CONTACT=0988777666',
});

export function useEmergencyLogic(memberId = 'nam', activeMemberName?: string) {
  const [emergencyData, setEmergencyData] = useState<EmergencyCardData>(DEFAULT_EMERGENCY_DATA);

  useEffect(() => {
    let isMounted = true;
    const fetchEmergency = async () => {
      try {
        const res = await fetch(`/api/emergency/${memberId}`);
        if (!res.ok) return;
        const json = await res.json();
        const card = json?.data?.card;
        const contacts = json?.data?.contacts || [];

        if (card && isMounted) {
          const primaryContact = contacts[0] || DEFAULT_EMERGENCY_DATA.emergencyContact;
          const allergiesStr = Array.isArray(card.allergies)
            ? card.allergies.map((a: any) => `${a.allergen || a} (${a.reaction || 'Cần chú ý'})`).join(', ')
            : (card.emergency_notes || 'Không ghi nhận');
          const conditionsStr = Array.isArray(card.chronic_conditions)
            ? card.chronic_conditions.join(', ')
            : 'Không có';

          setEmergencyData({
            fullName: activeMemberName || (memberId === 'nam' ? 'Trần Hữu Nam' : 'Trần Minh Khang'),
            birthYear: memberId === 'nam' ? 1985 : 1983,
            gender: 'Nam',
            bloodType: card.blood_group_snapshot || 'O+',
            allergies: allergiesStr || 'Penicillin (Sốc phản vệ độ 2)',
            conditions: conditionsStr,
            emergencyContact: {
              name: primaryContact.contact_name || primaryContact.name || 'Người thân',
              relationship: primaryContact.relationship || 'Người liên hệ',
              phone: primaryContact.phone_number || primaryContact.phone || '0988 777 666',
            },
            qrData: card.offline_qr_payload || DEFAULT_EMERGENCY_DATA.qrData,
          });
        }
      } catch {
        // Fallback giữ nguyên dữ liệu mặc định an toàn cho y tế
      }
    };
    fetchEmergency();
    return () => { isMounted = false; };
  }, [memberId, activeMemberName]);

  return {
    emergencyData,
  };
}
