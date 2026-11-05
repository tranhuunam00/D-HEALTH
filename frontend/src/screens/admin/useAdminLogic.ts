import { useState, useEffect } from 'react';

export interface AdminStats {
  totalUsers: number;
  totalMembers: number;
  totalFacilities: number;
  totalDoctors: number;
  totalMedications: number;
  totalClinicalReports: number;
}

export interface ServiceHealthState {
  database: string;
  minio: string;
}

export const ZERO_ADMIN_STATS: AdminStats = Object.freeze({
  totalUsers: 0,
  totalMembers: 0,
  totalFacilities: 0,
  totalDoctors: 0,
  totalMedications: 0,
  totalClinicalReports: 0,
});

export function useAdminLogic() {
  const [stats, setStats] = useState<AdminStats>(ZERO_ADMIN_STATS);
  const [health, setHealth] = useState<ServiceHealthState>({
    database: 'Đang kiểm tra...',
    minio: 'Đang kiểm tra...',
  });
  const [facilities, setFacilities] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'facilities' | 'doctors' | 'medications'>('overview');
  const [loading, setLoading] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [ovRes, facRes, docRes, depRes, medRes, healthRes] = await Promise.all([
        fetch('/api/admin/overview').catch(() => null),
        fetch('/api/facilities?all=true').catch(() => null),
        fetch('/api/doctors?all=true').catch(() => null),
        fetch('/api/departments').catch(() => null),
        fetch('/api/medications').catch(() => null),
        fetch('/api/health').catch(() => null),
      ]);

      if (ovRes?.ok) {
        const d = await ovRes.json();
        if (d.data) setStats(d.data);
      }
      if (facRes?.ok) {
        const d = await facRes.json();
        if (d.data) setFacilities(d.data);
      }
      if (docRes?.ok) {
        const d = await docRes.json();
        if (d.data) setDoctors(d.data);
      }
      if (depRes?.ok) {
        const d = await depRes.json();
        if (d.data) setDepartments(d.data);
      }
      if (medRes?.ok) {
        const d = await medRes.json();
        if (d.data) setMedications(d.data);
      }
      if (healthRes?.ok) {
        const h = await healthRes.json();
        if (h.services) {
          setHealth({
            database: h.services.database || 'disconnected',
            minio: h.services.minio || 'disconnected',
          });
        }
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

  const createFacility = async (data: Record<string, any>) => {
    try {
      const res = await fetch('/api/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Lỗi thêm CSYT:', err);
      return false;
    }
  };

  const updateFacility = async (id: string, data: Record<string, any>) => {
    try {
      const res = await fetch(`/api/facilities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Lỗi cập nhật CSYT:', err);
      return false;
    }
  };

  const deleteFacility = async (id: string) => {
    try {
      const res = await fetch(`/api/facilities/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Lỗi ngừng kích hoạt CSYT:', err);
      return false;
    }
  };

  const createDoctor = async (data: Record<string, any>) => {
    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Lỗi thêm Bác sĩ:', err);
      return false;
    }
  };

  const updateDoctor = async (id: string, data: Record<string, any>) => {
    try {
      const res = await fetch(`/api/doctors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Lỗi cập nhật Bác sĩ:', err);
      return false;
    }
  };

  const deleteDoctor = async (id: string) => {
    try {
      const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchAdminData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Lỗi ngừng kích hoạt Bác sĩ:', err);
      return false;
    }
  };

  return {
    stats,
    health,
    facilities,
    doctors,
    departments,
    medications,
    activeTab,
    setActiveTab,
    loading,
    refresh: fetchAdminData,
    createFacility,
    updateFacility,
    deleteFacility,
    createDoctor,
    updateDoctor,
    deleteDoctor,
  };
}
