import { useState, useEffect } from 'react';
import { FamilyMember, HealthScore } from '../../types/member.types';
import { BiometricRecord, ManualVitalsInput } from '../../types/biometric.types';

export function useHomeLogic(initialMemberId = 'nam', user?: any) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [activeMemberId, setActiveMemberId] = useState<string>(initialMemberId);
  const [healthScore, setHealthScore] = useState<HealthScore>({
    total: 0,
    biometrics: 0,
    medications: 0,
    clinical: 0,
    status: 'Chưa có số đo',
  });
  const [vitals, setVitals] = useState<BiometricRecord[]>([]);
  const [todayDose, setTodayDose] = useState<any>(null);
  const [todayDosesSummary, setTodayDosesSummary] = useState({ taken: 0, total: 0 });
  const [isDoseTaken, setIsDoseTaken] = useState(false);
  const [recentReports, setRecentReports] = useState<any[]>([]);
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
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const urlMembers = user?.id ? `/api/members?userId=${user.id}` : '/api/members';
      const [memRes, bioRes, doseRes, repRes] = await Promise.all([
        fetch(urlMembers, { headers: authHeaders }).catch(() => null),
        fetch(`/api/biometrics/${activeMemberId}`, { headers: authHeaders }).catch(() => null),
        fetch(`/api/prescriptions/${activeMemberId}/today-doses`, { headers: authHeaders }).catch(() => null),
        fetch(`/api/clinical-reports/${activeMemberId}`, { headers: authHeaders }).catch(() => null),
      ]);

      if (memRes?.ok) {
        const mData = await memRes.json();
        if (Array.isArray(mData.data) && mData.data.length > 0) {
          setMembers(mData.data);
        }
      }

      if (bioRes?.ok) {
        const bData = await bioRes.json();
        const records = Array.isArray(bData.data) ? bData.data : [];
        setVitals(records);

        if (records.length === 0) {
          setHealthScore({
            total: 0,
            biometrics: 0,
            medications: 0,
            clinical: 0,
            status: 'Chưa có số đo',
          });
        }
      }

      if (doseRes?.ok) {
        const dData = await doseRes.json();
        const list = Array.isArray(dData.data) ? dData.data : [];
        if (list.length > 0) {
          const upcoming = list.find((d: any) => !d.taken) || list[0];
          setTodayDose(upcoming);
          const takenCount = list.filter((d: any) => d.taken).length;
          setTodayDosesSummary({ taken: takenCount, total: list.length });
          setIsDoseTaken(!!upcoming?.taken);
        } else {
          setTodayDose(null);
          setTodayDosesSummary({ taken: 0, total: 0 });
          setIsDoseTaken(false);
        }
      }

      if (repRes?.ok) {
        const rData = await repRes.json();
        const rList = Array.isArray(rData.data) ? rData.data : [];
        setRecentReports(rList.slice(0, 2));
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
    setTodayDosesSummary((prev) => ({ ...prev, taken: Math.min(prev.taken + 1, prev.total || 4) }));
    if (todayDose?.id) {
      fetch(`/api/prescriptions/doses/${todayDose.id}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'taken' }),
      }).catch(() => null);
    }
  };

  const handleQuickCheckin = (mood: string) => {
    setCheckinStatus(mood);
  };

  useEffect(() => {
    if (vitals.length > 0) {
      let bpScore = 32;
      const bp = vitals.find((v: any) => v.biometric_type === 'bp' || v.biometric_type === 'blood_pressure');
      if (bp) {
        const sys = Number((bp as any).systolic || (bp as any).value_systolic || 0);
        const dia = Number((bp as any).diastolic || (bp as any).value_diastolic || 0);
        if (sys <= 125 && dia <= 82) bpScore = 38;
        else if (sys <= 135 && dia <= 85) bpScore = 34;
        else bpScore = 24;
      }
      const medScore = isDoseTaken ? 36 : 30;
      const hr = vitals.find((v: any) => v.biometric_type === 'hr' || v.biometric_type === 'heart_rate');
      const hrVal = hr ? Number((hr as any).value_numeric || 71) : 71;
      const hrScore = (hrVal >= 60 && hrVal <= 85) ? 14 : 10;
      const total = bpScore + medScore + hrScore;
      const status: 'Xuất sắc' | 'Ổn định' | 'Cần lưu ý' | 'Nguy cơ' =
        total >= 85 ? 'Xuất sắc' : total >= 70 ? 'Ổn định' : total >= 50 ? 'Cần lưu ý' : 'Nguy cơ';
      setHealthScore({ total, biometrics: bpScore, medications: medScore, clinical: hrScore, status });
    }
  }, [vitals, isDoseTaken]);

  const bpRec = vitals.find((v: any) => v.biometric_type === 'bp' || v.biometric_type === 'blood_pressure');
  const hrRec = vitals.find((v: any) => v.biometric_type === 'hr' || v.biometric_type === 'heart_rate');
  const weightRec = vitals.find((v: any) => v.biometric_type === 'weight');
  const glucoseRec = vitals.find((v: any) => v.biometric_type === 'hba1c' || v.biometric_type === 'glucose' || v.biometric_type === 'blood_sugar');

  const currentMemberObj = members.find((m) => m.id === activeMemberId);
  const fallbackWeight = currentMemberObj?.weight_kg
    ? `${currentMemberObj.weight_kg}`.replace('.', ',')
    : (user?.weightKg ? `${user.weightKg}` : null);

  const latestBp = bpRec
    ? `${Math.round(Number((bpRec as any).systolic || (bpRec as any).value_systolic))}/${Math.round(Number((bpRec as any).diastolic || (bpRec as any).value_diastolic))}`
    : '--/--';
  const latestHr = hrRec ? `${Math.round(Number((hrRec as any).value_numeric))}` : '--';
  const latestWeight = weightRec
    ? `${(weightRec as any).value_numeric}`.replace('.00', '').replace('.', ',')
    : (fallbackWeight ? `${fallbackWeight}`.replace('.00', '').replace('.', ',') : '--');
  const latestGlucose = glucoseRec
    ? `${(glucoseRec as any).value_numeric}`.replace('.00', '').replace('.', ',')
    : '--';

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
    recentReports,
    handleRecordVitals,
    handleTakeDose,
    handleQuickCheckin,
    fetchHomeData,
  };
}
