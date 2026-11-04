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

const DEFAULT_APPOINTMENT: UpcomingAppointment = {
  id: 'app_nam_cardio_01',
  month: 'TH 11',
  date: '12',
  title: 'Tái khám tim mạch',
  timeDoctor: '09:00 · BS Trần Văn B',
  facility: '[Bệnh viện đối tác]',
};

const DEFAULT_CARE_TEAM: CareTeamMember[] = [
  {
    id: 'hd',
    code: 'HD',
    name: 'Trần Minh Hương',
    role: 'Gia đình',
    org: 'Gia đình',
    phone: '0987 654 321',
    email: 'huong@gmail.com',
    color: 'mint',
  },
  {
    id: 'tb',
    code: 'TB',
    name: 'BS Trần Văn B',
    role: 'Tim mạch',
    org: '[Bệnh viện đối tác]',
    phone: '[Số điện thoại]',
    email: '[email bác sĩ]',
    color: 'pink',
  },
  {
    id: 'lc',
    code: 'LC',
    name: 'BS Lê Văn C',
    role: 'CĐHA',
    org: 'Bệnh viện K',
    phone: '0912 345 678',
    email: 'levanc@dhealth.vn',
    color: 'purple',
  },
];

const DEFAULT_SHARING_STATS: SharingStats = {
  activeCount: 3,
  expiringSoonCount: 1,
  expiringDays: 7,
};

export function useCareLogic(memberId = 'nam') {
  const [upcomingAppointment, setUpcomingAppointment] = useState<UpcomingAppointment>(DEFAULT_APPOINTMENT);
  const [careTeam, setCareTeam] = useState<CareTeamMember[]>(DEFAULT_CARE_TEAM);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('tb');
  const [sharingStats, setSharingStats] = useState<SharingStats>(DEFAULT_SHARING_STATS);
  const [loading, setLoading] = useState(false);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchCareSummary = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl = typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null') ? window.location.origin : 'http://localhost';
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${baseUrl}/api/care/${memberId}/care-summary`, { headers });
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          if (json.data.upcomingAppointment) {
            setUpcomingAppointment(json.data.upcomingAppointment);
          }
          if (Array.isArray(json.data.careTeam) && json.data.careTeam.length > 0) {
            setCareTeam(json.data.careTeam);
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
  }, [memberId]);

  useEffect(() => {
    fetchCareSummary();
  }, [fetchCareSummary]);

  const selectedMember = useMemo(
    () => careTeam.find((m) => m.id === selectedMemberId) || careTeam[1] || careTeam[0],
    [careTeam, selectedMemberId]
  );

  const handleSendPreExamDossier = async () => {
    try {
      const res = await fetch(`/api/care/${memberId}/send-pre-exam-dossier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId: selectedMember?.id }),
      });
      if (res.ok) {
        setSuccessMsg(`Đã gửi hồ sơ y tế thành công cho ${selectedMember?.name || 'Bác sĩ'}.`);
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } catch {}
  };

  const handleAddDoctor = async (payload: {
    doctorName: string;
    specialty: string;
    hospital: string;
    phone: string;
    email: string;
  }) => {
    try {
      const res = await fetch(`/api/care/${memberId}/add-doctor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsAddDoctorOpen(false);
        setSuccessMsg(`Đã thêm ${payload.doctorName} vào My Care Team.`);
        setTimeout(() => setSuccessMsg(null), 3500);
        await fetchCareSummary();
      }
    } catch {}
  };

  return {
    upcomingAppointment,
    careTeam,
    selectedMember,
    selectedMemberId,
    setSelectedMemberId,
    sharingStats,
    loading,
    isAddDoctorOpen,
    setIsAddDoctorOpen,
    successMsg,
    fetchCareSummary,
    handleSendPreExamDossier,
    handleAddDoctor,
  };
}
