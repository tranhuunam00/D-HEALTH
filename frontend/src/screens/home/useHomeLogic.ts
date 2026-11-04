import { useState, useEffect } from 'react';
import { FamilyMember, HealthScore } from '../../types/member.types';
import { BiometricRecord, ManualVitalsInput } from '../../types/biometric.types';

export function useHomeLogic(initialMemberId = 'me', user?: any) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [activeMemberId, setActiveMemberId] = useState<string>(initialMemberId);
  const [healthScore, setHealthScore] = useState<HealthScore>({
    total: 88,
    biometrics: 36,
    medications: 32,
    clinical: 20,
    status: 'Ổn định',
  });
  const [vitals, setVitals] = useState<BiometricRecord[]>([]);
  const [todayDose, setTodayDose] = useState<any>(null);
  const [todayDosesSummary, setTodayDosesSummary] = useState({ taken: 2, total: 4 });
  const [isDoseTaken, setIsDoseTaken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVitalsSheetOpen, setIsVitalsSheetOpen] = useState(false);
  const [checkinStatus, setCheckinStatus] = useState<string | null>(null);

  useEffect(() => {
    if (initialMemberId && initialMemberId !== activeMemberId) {
      setActiveMemberId(initialMemberId);
    }
  }, [initialMemberId]);

  const fetchHomeData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const urlMembers = user?.id ? `/api/members?userId=${user.id}` : '/api/members';
      const [memRes, bioRes, doseRes] = await Promise.all([
        fetch(urlMembers).catch(() => null),
        fetch(`/api/biometrics/${activeMemberId}`).catch(() => null),
        fetch(`/api/prescriptions/${activeMemberId}/today-doses`).catch(() => null),
      ]);

      if (memRes?.ok) {
        const mData = await memRes.json();
        if (Array.isArray(mData.data) && mData.data.length > 0) {
          setMembers(mData.data);
        }
      }
      if (bioRes?.ok) {
        const bData = await bioRes.json();
        if (Array.isArray(bData.data)) setVitals(bData.data);
      }
      if (doseRes?.ok) {
        const dData = await doseRes.json();
        if (Array.isArray(dData.data) && dData.data.length > 0) {
          const list = dData.data;
          const upcoming = list.find((d: any) => !d.taken) || list[0];
          setTodayDose(upcoming);
          const takenCount = list.filter((d: any) => d.taken).length;
          setTodayDosesSummary({ taken: takenCount, total: list.length });
          setIsDoseTaken(!!upcoming?.taken);
        }
      }
    } catch {
      setErrorMsg('Không thể tải dữ liệu chỉ số. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, [activeMemberId, user?.id]);

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
    setTodayDosesSummary((prev) => ({ ...prev, taken: Math.min(prev.taken + 1, prev.total) }));
    const doseId = todayDose?.id || '44444444-0000-0000-0000-000000000001';
    fetch(`/api/prescriptions/doses/${doseId}/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'taken' }),
    }).catch(() => null);
  };

  const handleQuickCheckin = (mood: string) => {
    setCheckinStatus(mood);
  };

  useEffect(() => {
    if (vitals.length > 0 || isDoseTaken) {
      let bpScore = 32;
      const bp = vitals.find((v: any) => v.biometric_type === 'bp' || v.biometric_type === 'blood_pressure');
      if (bp) {
        const sys = Number((bp as any).systolic || (bp as any).value_systolic || 120);
        const dia = Number((bp as any).diastolic || (bp as any).value_diastolic || 80);
        if (sys <= 125 && dia <= 82) bpScore = 38;
        else if (sys <= 135 && dia <= 85) bpScore = 34;
        else bpScore = 24;
      }
      const medScore = isDoseTaken ? 36 : 30;
      const hr = vitals.find((v: any) => v.biometric_type === 'hr' || v.biometric_type === 'heart_rate');
      const hrVal = hr ? Number((hr as any).value_numeric || 72) : 72;
      const hrScore = (hrVal >= 60 && hrVal <= 85) ? 20 : 14;
      const total = bpScore + medScore + hrScore;
      const status: 'Xuất sắc' | 'Ổn định' | 'Cần lưu ý' | 'Nguy cơ' =
        total >= 90 ? 'Xuất sắc' : total >= 80 ? 'Ổn định' : total >= 65 ? 'Cần lưu ý' : 'Nguy cơ';
      setHealthScore({ total, biometrics: bpScore, medications: medScore, clinical: hrScore, status });
    }
  }, [vitals, isDoseTaken]);

  const bpRec = vitals.find((v: any) => v.biometric_type === 'bp' || v.biometric_type === 'blood_pressure');
  const hrRec = vitals.find((v: any) => v.biometric_type === 'hr' || v.biometric_type === 'heart_rate');
  const weightRec = vitals.find((v: any) => v.biometric_type === 'weight');
  const glucoseRec = vitals.find((v: any) => v.biometric_type === 'glucose' || v.biometric_type === 'blood_sugar');

  const currentMemberObj = members.find((m) => m.id === activeMemberId);
  const fallbackWeight = currentMemberObj?.weight_kg
    ? `${currentMemberObj.weight_kg}`.replace('.', ',')
    : (user?.weightKg ? `${user.weightKg}` : (activeMemberId === 'nam' ? '68' : '72,5'));

  const latestBp = bpRec
    ? `${Math.round(Number((bpRec as any).systolic || (bpRec as any).value_systolic || 120))}/${Math.round(Number((bpRec as any).diastolic || (bpRec as any).value_diastolic || 80))}`
    : (activeMemberId === 'nam' ? '120/80' : '131/82');
  const latestHr = hrRec ? `${Math.round(Number((hrRec as any).value_numeric || 72))}` : (activeMemberId === 'nam' ? '72' : '71');
  const latestWeight = weightRec
    ? `${(weightRec as any).value_numeric || fallbackWeight}`.replace('.00', '').replace('.', ',')
    : fallbackWeight;
  const latestGlucose = glucoseRec
    ? `${(glucoseRec as any).value_numeric || '6,2'}`.replace('.00', '').replace('.', ',')
    : (activeMemberId === 'nam' ? '6,2' : '6,6');

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
    todayDose,
    todayDosesSummary,
    handleRecordVitals,
    handleTakeDose,
    handleQuickCheckin,
    fetchHomeData,
  };
}
