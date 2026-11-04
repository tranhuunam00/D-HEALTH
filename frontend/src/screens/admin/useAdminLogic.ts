import { useState, useEffect } from 'react';

export interface AdminStats {
  totalUsers: number;
  totalMembers: number;
  totalFacilities: number;
  totalDoctors: number;
  totalMedications: number;
  totalClinicalReports: number;
}

export function useAdminLogic() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 2,
    totalMembers: 5,
    totalFacilities: 5,
    totalDoctors: 3,
    totalMedications: 5,
    totalClinicalReports: 1,
  });
  const [facilities, setFacilities] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'facilities' | 'doctors' | 'medications' | 'thresholds'>('overview');
  const [loading, setLoading] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [ovRes, facRes, docRes, medRes] = await Promise.all([
        fetch('/api/admin/overview'),
        fetch('/api/facilities'),
        fetch('/api/doctors'),
        fetch('/api/medications'),
      ]);

      if (ovRes.ok) {
        const d = await ovRes.json();
        if (d.data) setStats(d.data);
      }
      if (facRes.ok) {
        const d = await facRes.json();
        if (d.data) setFacilities(d.data);
      }
      if (docRes.ok) {
        const d = await docRes.json();
        if (d.data) setDoctors(d.data);
      }
      if (medRes.ok) {
        const d = await medRes.json();
        if (d.data) setMedications(d.data);
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu Admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return {
    stats,
    facilities,
    doctors,
    medications,
    activeTab,
    setActiveTab,
    loading,
    refresh: fetchAdminData,
  };
}
