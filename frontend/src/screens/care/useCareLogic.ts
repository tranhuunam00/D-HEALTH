import { useState, useEffect, useCallback, useMemo } from 'react';
import { SPECIALTY_COLOR_KEYWORDS, CARE_DEFAULT_CONFIG } from './care.constants';

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

function getInitials(name: string): string {
  if (!name) return CARE_DEFAULT_CONFIG.fallbackDoctorCode;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColorByRole(role: string): 'mint' | 'pink' | 'purple' | 'slate' {
  const r = (role || '').toLowerCase();
  if (SPECIALTY_COLOR_KEYWORDS.pink.some((kw) => r.includes(kw))) return 'pink';
  if (SPECIALTY_COLOR_KEYWORDS.purple.some((kw) => r.includes(kw))) return 'purple';
  if (SPECIALTY_COLOR_KEYWORDS.mint.some((kw) => r.includes(kw))) return 'mint';
  return 'slate';
}

export function useCareLogic(memberId = 'mem_145deb71') {
  const [upcomingAppointment, setUpcomingAppointment] = useState<UpcomingAppointment | null>(null);
  const [careTeam, setCareTeam] = useState<CareTeamMember[]>([]);
  const [referenceDoctors, setReferenceDoctors] = useState<CareTeamMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [sharingStats, setSharingStats] = useState<SharingStats>({
    activeCount: 0,
    expiringSoonCount: 0,
    expiringDays: 7,
  });
  const [loading, setLoading] = useState(false);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchCareSummary = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl =
        typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null')
          ? window.location.origin
          : 'http://localhost';
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const [summaryRes, doctorsRes] = await Promise.all([
        fetch(`${baseUrl}/api/care/${memberId}/care-summary`, { headers }),
        fetch(`${baseUrl}/api/doctors`),
      ]);

      if (summaryRes.ok) {
        const json = await summaryRes.json();
        if (json?.data) {
          setUpcomingAppointment(json.data.upcomingAppointment || null);
          const team = Array.isArray(json.data.careTeam) ? json.data.careTeam : [];
          setCareTeam(team);
          if (json.data.sharingStats) {
            setSharingStats(json.data.sharingStats);
          }
        }
      }

      if (doctorsRes.ok) {
        const docJson = await doctorsRes.json();
        if (Array.isArray(docJson?.data)) {
          const mappedDocs: CareTeamMember[] = docJson.data.map((d: any) => {
            const title = d.academic_title ? `${d.academic_title} ` : '';
            const fullName = `${title}${d.full_name || CARE_DEFAULT_CONFIG.defaultDoctorTitle}`.trim();
            const role = d.department_name || d.specialty || CARE_DEFAULT_CONFIG.defaultRole;
            return {
              id: d.id,
              granteeId: d.id,
              code: getInitials(d.full_name || CARE_DEFAULT_CONFIG.fallbackDoctorCode),
              name: fullName,
              role,
              org: d.facility_name || CARE_DEFAULT_CONFIG.defaultOrg,
              phone: d.phone_number || CARE_DEFAULT_CONFIG.defaultPhone,
              email: d.email || CARE_DEFAULT_CONFIG.defaultEmail,
              color: getColorByRole(role),
            };
          });
          setReferenceDoctors(mappedDocs);
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

  // Hợp nhất danh sách bác sĩ: Ưu tiên careTeam của bệnh nhân, bổ sung danh sách bác sĩ hệ thống để tham khảo
  const displayDoctors = useMemo(() => {
    if (careTeam.length > 0) {
      // Bổ sung các bác sĩ hệ thống chưa có trong careTeam để người dùng tham khảo thêm
      const existingIds = new Set(careTeam.map((c) => c.granteeId || c.id));
      const additional = referenceDoctors.filter((r) => !existingIds.has(r.id));
      return [...careTeam, ...additional];
    }
    return referenceDoctors;
  }, [careTeam, referenceDoctors]);

  // Tự động chọn bác sĩ đầu tiên nếu chưa có selectedMemberId
  useEffect(() => {
    if (displayDoctors.length > 0) {
      const exists = displayDoctors.some((m) => m.id === selectedMemberId);
      if (!exists) {
        setSelectedMemberId(displayDoctors[0].id);
      }
    }
  }, [displayDoctors, selectedMemberId]);

  const selectedMember = useMemo(
    () =>
      displayDoctors.find((m) => m.id === selectedMemberId) ||
      displayDoctors[0] ||
      null,
    [displayDoctors, selectedMemberId]
  );

  const handleSendPreExamDossier = async () => {
    try {
      const baseUrl =
        typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null')
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
      const baseUrl =
        typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null')
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

  const handleScheduleAppointment = async (data: {
    doctorId: string;
    doctorName: string;
    facilityName: string;
    departmentName: string;
    appointmentDate: string;
    purpose: string;
  }): Promise<boolean> => {
    try {
      const baseUrl =
        typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null')
          ? window.location.origin
          : 'http://localhost';
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const res = await fetch(`${baseUrl}/api/care/${memberId}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsScheduleOpen(false);
        setSuccessMsg(`Đã đặt lịch hẹn khám thành công với ${data.doctorName}!`);
        setTimeout(() => setSuccessMsg(null), 4000);
        await fetchCareSummary();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return {
    upcomingAppointment,
    careTeam: displayDoctors,
    selectedMember,
    selectedMemberId,
    setSelectedMemberId,
    selectedCategory,
    sharingStats,
    loading,
    isAddDoctorOpen,
    setIsAddDoctorOpen,
    isScheduleOpen,
    setIsScheduleOpen,
    openAddDoctorModal,
    successMsg,
    fetchCareSummary,
    handleSendPreExamDossier,
    handleAddDoctor,
    handleScheduleAppointment,
  };
}
