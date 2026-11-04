import { useState } from 'react';

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

export function useEmergencyLogic() {
  const [emergencyData] = useState<EmergencyCardData>(DEFAULT_EMERGENCY_DATA);

  return {
    emergencyData,
  };
}
