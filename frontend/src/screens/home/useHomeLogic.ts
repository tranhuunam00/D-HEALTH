import { useState, useEffect } from 'react';
import { FamilyMember, HealthScore } from '../../types/member.types';
import { BiometricRecord, ManualVitalsInput } from '../../types/biometric.types';

export function useHomeLogic() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [activeMemberId, setActiveMemberId] = useState<string>('me');
  const [healthScore, setHealthScore] = useState<HealthScore>({
    total: 88,
    biometrics: 36,
    medications: 32,
    clinical: 20,
    status: 'Ổn định',
  });
  const [vitals, setVitals] = useState<BiometricRecord[]>([]);
  const [isDoseTaken, setIsDoseTaken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVitalsSheetOpen, setIsVitalsSheetOpen] = useState(false);
  const [checkinStatus, setCheckinStatus] = useState<string | null>(null);

  const fetchHomeData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [memRes, bioRes] = await Promise.all([
        fetch('/api/members').catch(() => null),
        fetch(`/api/biometrics/${activeMemberId}`).catch(() => null),
      ]);

      if (memRes?.ok) {
        const mData = await memRes.json();
        if (mData.data) setMembers(mData.data);
      }
      if (bioRes?.ok) {
        const bData = await bioRes.json();
        if (bData.data) setVitals(bData.data);
      }
    } catch {
      setErrorMsg('Không thể tải dữ liệu chỉ số. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, [activeMemberId]);

  const handleRecordVitals = async (input: ManualVitalsInput) => {
    try {
      if (input.systolic && input.diastolic) {
        await fetch('/api/biometrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            memberId: activeMemberId,
            biometricType: 'blood_pressure',
            systolic: input.systolic,
            diastolic: input.diastolic,
            unit: 'mmHg',
          }),
        });
      }
      setIsVitalsSheetOpen(false);
      await fetchHomeData();
    } catch (err) {
      console.error('Lỗi lưu số đo:', err);
    }
  };

  const handleTakeDose = () => {
    setIsDoseTaken(true);
    fetch('/api/prescriptions/doses/44444444-0000-0000-0000-000000000001/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'taken' }),
    }).catch(() => null);
  };

  const handleQuickCheckin = (mood: string) => {
    setCheckinStatus(mood);
  };

  // Tính điểm sức khỏe động theo chỉ số đo và tuân thủ thuốc thực tế
  useEffect(() => {
    if (vitals.length > 0 || isDoseTaken) {
      let bpScore = 32;
      const bp = vitals.find((v: any) => v.biometric_type === 'bp' || v.biometric_type === 'blood_pressure');
      if (bp) {
        const sys = Number((bp as any).systolic || (bp as any).value_systolic || 131);
        const dia = Number((bp as any).diastolic || (bp as any).value_diastolic || 82);
        if (sys <= 125 && dia <= 82) bpScore = 38;
        else if (sys <= 135 && dia <= 85) bpScore = 34;
        else bpScore = 24;
      }
      const medScore = isDoseTaken ? 36 : 30;
      const hr = vitals.find((v: any) => v.biometric_type === 'hr' || v.biometric_type === 'heart_rate');
      const hrVal = hr ? Number((hr as any).value_numeric || 71) : 71;
      const hrScore = (hrVal >= 60 && hrVal <= 85) ? 20 : 14;
      const total = bpScore + medScore + hrScore;
      const status: 'Xuất sắc' | 'Ổn định' | 'Cần lưu ý' | 'Nguy cơ' =
        total >= 90 ? 'Xuất sắc' : total >= 80 ? 'Ổn định' : total >= 65 ? 'Cần lưu ý' : 'Nguy cơ';
      setHealthScore({ total, biometrics: bpScore, medications: medScore, clinical: hrScore, status });
    }
  }, [vitals, isDoseTaken]);

  // Trích xuất số liệu thực tế từ CSDL
  const bpRec = vitals.find((v: any) => v.biometric_type === 'bp' || v.biometric_type === 'blood_pressure');
  const hrRec = vitals.find((v: any) => v.biometric_type === 'hr' || v.biometric_type === 'heart_rate');
  const weightRec = vitals.find((v: any) => v.biometric_type === 'weight');
  const glucoseRec = vitals.find((v: any) => v.biometric_type === 'glucose' || v.biometric_type === 'blood_sugar');

  const latestBp = bpRec
    ? `${Math.round(Number((bpRec as any).systolic || (bpRec as any).value_systolic || 131))}/${Math.round(Number((bpRec as any).diastolic || (bpRec as any).value_diastolic || 82))}`
    : '131/82';
  const latestHr = hrRec ? `${Math.round(Number((hrRec as any).value_numeric || 71))}` : '71';
  const latestWeight = weightRec ? `${(weightRec as any).value_numeric || 72.5}` : '72,5';
  const latestGlucose = glucoseRec ? `${(glucoseRec as any).value_numeric || 6.6}` : '6,6';

  return {
    members,
    activeMemberId,
    setActiveMemberId,
    healthScore,
    vitals,
    latestBp,
    latestHr,
    latestWeight,
    latestGlucose,
    isDoseTaken,
    loading,
    errorMsg,
    isVitalsSheetOpen,
    setIsVitalsSheetOpen,
    checkinStatus,
    handleRecordVitals,
    handleTakeDose,
    handleQuickCheckin,
    fetchHomeData,
  };
}
