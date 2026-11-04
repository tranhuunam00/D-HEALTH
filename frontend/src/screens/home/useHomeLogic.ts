import { useState, useEffect } from 'react';
import { FamilyMember, HealthScore } from '../../types/member.types';
import { BiometricRecord, ManualVitalsInput } from '../../types/biometric.types';

export function useHomeLogic() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [activeMemberId, setActiveMemberId] = useState<string>('me');
  const [healthScore, setHealthScore] = useState<HealthScore>({
    total: 88,
    biometrics: 36, // max 40
    medications: 32, // max 35
    clinical: 20, // max 25
    status: 'Ổn định',
  });
  const [vitals, setVitals] = useState<BiometricRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVitalsSheetOpen, setIsVitalsSheetOpen] = useState(false);
  const [checkinStatus, setCheckinStatus] = useState<string | null>(null);

  const fetchHomeData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const memRes = await fetch('/api/members');
      if (memRes.ok) {
        const mData = await memRes.json();
        setMembers(mData.data || []);
      }

      const bioRes = await fetch(`/api/biometrics/${activeMemberId}`);
      if (bioRes.ok) {
        const bData = await bioRes.json();
        setVitals(bData.data || []);
      }
    } catch (err: any) {
      setErrorMsg('Không thể tải dữ liệu chỉ số. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, [activeMemberId]);

  const handleRecordVitals = async (input: ManualVitalsInput) => {
    // Lưu số đo nhanh
    setIsVitalsSheetOpen(false);
    await fetchHomeData();
  };

  const handleQuickCheckin = (mood: string) => {
    setCheckinStatus(mood);
  };

  return {
    members,
    activeMemberId,
    setActiveMemberId,
    healthScore,
    vitals,
    loading,
    errorMsg,
    isVitalsSheetOpen,
    setIsVitalsSheetOpen,
    checkinStatus,
    handleRecordVitals,
    handleQuickCheckin,
    fetchHomeData,
  };
}
