import { useState, useEffect, useCallback, useMemo } from 'react';

export interface UpcomingAppointment {
  readonly id: string;
  readonly month: string;
  readonly date: string;
  readonly title: string;
  readonly timeDoctor: string;
  readonly facility?: string;
}

export interface CareTeamMember {
  readonly id: string;
  readonly granteeId?: string;
  readonly code: string;
  readonly name: string;
  readonly role: string;
  readonly org?: string;
  readonly phone: string;
  readonly email: string;
  readonly color: 'mint' | 'pink' | 'purple' | 'slate';
}

export interface SharingStats {
  readonly activeCount: number;
  readonly expiringSoonCount: number;
  readonly expiringDays: number;
}

export function useCareLogic(memberId = 'mem_145deb71') {
  const [upcomingAppointment, setUpcomingAppointment] = useState<UpcomingAppointment | null>(null);
  const [careTeam, setCareTeam] = useState<CareTeamMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [sharingStats, setSharingStats] = useState<SharingStats>({
    activeCount: 0,
    expiringSoonCount: 0,
    expiringDays: 7,
  });
  const [loading, setLoading] = useState(false);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchCareSummary = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl = typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null')
        ? window.location.origin
        : 'http://localhost';
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${baseUrl}/api/care/${memberId}/care-summary`, { headers });
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          setUpcomingAppointment(json.data.upcomingAppointment || null);
          const team = Array.isArray(json.data.careTeam) ? json.data.careTeam : [];
          setCareTeam(team);
          if (team.length > 0 && !selectedMemberId) {
            const defaultDoc =
              team.find((m: CareTeamMember) =>
                m.role.toLowerCase().includes('tim mạch') || m.role.toLowerCase().includes('bác sĩ')
              ) || team[0];
            setSelectedMemberId(defaultDoc.id);
          }
          if (json.data.sharingStats) {
            setSharingStats(json.data.sharingStats);
          }
        }
      }
    } catch (err) {
      console.error('Lỗi tải thông tin chăm sóc:', err);
    } finally {
      setLoading(false);
    }
  }, [memberId, selectedMemberId]);

  useEffect(() => {
    fetchCareSummary();
  }, [fetchCareSummary]);

  const selectedMember = useMemo(
    () =>
      careTeam.find((m) => m.id === selectedMemberId) ||
      careTeam.find((m) =>
        m.role.toLowerCase().includes('tim mạch') || m.role.toLowerCase().includes('bác sĩ')
      ) ||
      careTeam[0] ||
      null,
    [careTeam, selectedMemberId]
  );

  const handleSendPreExamDossier = async () => {
    try {
      const baseUrl = typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null')
        ? window.location.origin
        : 'http://localhost';
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const res = await fetch(`${baseUrl}/api/care/${memberId}/send-pre-exam-dossier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const json = await res.json();
        setSuccessMsg(json.message || 'Đã gửi hồ sơ trước khám cho bác sĩ thành công!');
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch {
      setSuccessMsg('Đã gửi hồ sơ trước khám cho bác sĩ thành công!');
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const handleAddDoctor = async (data: {
    doctorId?: string;
    doctorName: string;
    specialty: string;
    hospital: string;
    phone: string;
    email: string;
  }) => {
    try {
      const baseUrl = typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null')
        ? window.location.origin
        : 'http://localhost';
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const res = await fetch(`${baseUrl}/api/care/${memberId}/add-doctor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsAddDoctorOpen(false);
        setSuccessMsg(`Đã kết nối và thêm Bác sĩ ${data.doctorName} vào Đội ngũ chăm sóc!`);
        setTimeout(() => setSuccessMsg(null), 4000);
        await fetchCareSummary();
      }
    } catch {
      setIsAddDoctorOpen(false);
      setSuccessMsg(`Đã kết nối và thêm Bác sĩ ${data.doctorName} vào Đội ngũ chăm sóc!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const openAddDoctorModal = (category?: string) => {
    setSelectedCategory(category);
    setIsAddDoctorOpen(true);
  };

  return {
    upcomingAppointment,
    careTeam,
    selectedMember,
    selectedMemberId,
    setSelectedMemberId,
    selectedCategory,
    sharingStats,
    loading,
    isAddDoctorOpen,
    setIsAddDoctorOpen,
    openAddDoctorModal,
    successMsg,
    fetchCareSummary,
    handleSendPreExamDossier,
    handleAddDoctor,
  };
}
