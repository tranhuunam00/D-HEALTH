import React, { useState } from 'react';
import {
  Building2,
  Stethoscope,
  Pill,
  ShieldCheck,
  Database,
  RefreshCw,
  Activity,
  Search,
  Users,
  UserCheck,
  HardDrive,
  LogOut,
  Calendar,
} from 'lucide-react';
import { useAdminLogic } from './useAdminLogic';
import { AdminUserManagement } from './AdminUserManagement';
import { FacilitiesGrid, FacilityItem } from './FacilitiesGrid';
import { DoctorsGrid, DoctorItem } from './DoctorsGrid';
import { MedicationsGrid } from './MedicationsGrid';
import { AppointmentsGrid } from './AppointmentsGrid';
import { FacilityModal } from './FacilityModal';
import { DoctorModal } from './DoctorModal';

interface AdminDashboardProps {
  readonly onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const {
    stats,
    health,
    facilities,
    doctors,
    departments,
    medications,
    appointments,
    activeTab,
    setActiveTab,
    loading,
    refresh,
    createFacility,
    updateFacility,
    deleteFacility,
    createDoctor,
    updateDoctor,
    deleteDoctor,
  } = useAdminLogic();

  // Modal states for Facility
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<FacilityItem | null>(null);

  // Modal states for Doctor
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorItem | null>(null);

  // Handlers for Facility
  const handleOpenAddFacility = () => {
    setSelectedFacility(null);
    setIsFacilityModalOpen(true);
  };

  const handleOpenEditFacility = (facility: FacilityItem) => {
    setSelectedFacility(facility);
    setIsFacilityModalOpen(true);
  };

  const handleDeleteFacility = async (facility: FacilityItem) => {
    const actionName = facility.is_active ? 'ngừng kích hoạt' : 'xóa';
    if (window.confirm(`Bạn có chắc muốn ${actionName} cơ sở "${facility.name}"?`)) {
      await deleteFacility(facility.id);
    }
  };

  const handleSaveFacility = async (data: Record<string, any>) => {
    if (selectedFacility) {
      return await updateFacility(selectedFacility.id, data);
    }
    return await createFacility(data);
  };

  // Handlers for Doctor
  const handleOpenAddDoctor = () => {
    setSelectedDoctor(null);
    setIsDoctorModalOpen(true);
  };

  const handleOpenEditDoctor = (doctor: DoctorItem) => {
    setSelectedDoctor(doctor);
    setIsDoctorModalOpen(true);
  };

  const handleDeleteDoctor = async (doctor: DoctorItem) => {
    const actionName = doctor.is_active ? 'ngừng kích hoạt' : 'xóa';
    if (window.confirm(`Bạn có chắc muốn ${actionName} bác sĩ "${doctor.full_name}"?`)) {
      await deleteDoctor(doctor.id);
    }
  };

  const handleSaveDoctor = async (data: Record<string, any>) => {
    if (selectedDoctor) {
      return await updateDoctor(selectedDoctor.id, data);
    }
    return await createDoctor(data);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 flex">
      {/* 1. Sidebar Trái Cố Định (White Theme) */}
      <aside className="w-64 border-r border-slate-200 bg-white p-5 flex flex-col justify-between shrink-0 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] flex items-center justify-center shadow-md shadow-teal-500/20">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 tracking-tight">D-HEALTH ADMIN</h1>
              <span className="text-[10px] text-[#1F7A8C] font-bold uppercase tracking-wider">Super Admin Portal</span>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Toàn Cảnh Hệ Thống', icon: Activity },
              { id: 'users', label: 'Quản Trị Người Dùng', icon: UserCheck },
              { id: 'appointments', label: 'Lịch Hẹn Khám', icon: Calendar, badge: appointments.length },
              { id: 'facilities', label: 'Cơ Sở Y Tế (CSYT)', icon: Building2 },
              { id: 'doctors', label: 'Danh Bạ Bác Sĩ', icon: Stethoscope },
              { id: 'medications', label: 'Tủ Thuốc', icon: Pill },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#1F7A8C] text-white shadow-md shadow-teal-600/20 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <tab.icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge != null && tab.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-teal-50 text-[#1F7A8C]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-2">
          <div className="flex items-center justify-between text-emerald-700 font-bold">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> PostgreSQL 16</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Active</span>
          </div>
          <div className="flex items-center justify-between text-purple-700 font-bold pt-1.5 border-t border-slate-200">
            <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-purple-600" /> MinIO S3</span>
            <a
              href="http://103.90.227.173:7105"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-purple-700 hover:text-purple-900 underline font-semibold"
            >
              Console 7105 ↗
            </a>
          </div>
          <p className="text-[9px] text-slate-400 font-mono truncate" title={health.minio}>S3: {health.minio}</p>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar (White Theme) */}
        <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white shadow-xs">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl w-80 text-xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              placeholder="Tìm bệnh viện, bác sĩ, thuốc..."
              className="bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 cursor-pointer transition"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="h-4 w-[1px] bg-slate-200" />
            <span className="text-xs text-slate-600">Admin Tổng: <strong className="text-slate-900 font-bold">Admin NamTH</strong></span>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition ml-2 cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Đăng xuất</span>
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Panels */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'users' && <AdminUserManagement />}

          {activeTab !== 'users' && (
            <>
              {/* Overview Cards (White Theme) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                    <Building2 className="w-4 h-4 text-blue-600" /> CSYT Đối Tác
                  </span>
                  <div className="text-2xl font-black text-slate-900">
                    {stats.totalFacilities} <span className="text-xs font-normal text-slate-400">cơ sở</span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                    <Stethoscope className="w-4 h-4 text-emerald-600" /> Bác Sĩ Chuyên Khoa
                  </span>
                  <div className="text-2xl font-black text-slate-900">
                    {stats.totalDoctors} <span className="text-xs font-normal text-slate-400">bác sĩ</span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                    <Pill className="w-4 h-4 text-amber-600" /> Tủ Thuốc
                  </span>
                  <div className="text-2xl font-black text-slate-900">
                    {stats.totalMedications} <span className="text-xs font-normal text-slate-400">loại</span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                    <Users className="w-4 h-4 text-purple-600" /> Bệnh Nhân & Gia Đình
                  </span>
                  <div className="text-2xl font-black text-slate-900">
                    {stats.totalMembers} <span className="text-xs font-normal text-slate-400">hồ sơ</span>
                  </div>
                </div>
              </div>

              {/* High-Density Data Grid Container (White Theme) */}
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    {activeTab === 'facilities'
                      ? 'Danh Sách Cơ Sở Y Tế Đối Tác'
                      : activeTab === 'doctors'
                      ? 'Danh Bạ Bác Sĩ Chuyên Khoa'
                      : activeTab === 'medications'
                      ? 'Tủ Thuốc & Dược Thư'
                      : activeTab === 'appointments'
                      ? 'Danh Sách Lịch Hẹn Khám Đã Đặt'
                      : 'Bảng Điều Khiển Cấu Hình Master Data'}
                  </h2>
                  <span className="text-[11px] text-purple-700 font-bold px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200">
                    Admin Configurable (PostgreSQL 16)
                  </span>
                </div>

                {activeTab === 'facilities' && (
                  <FacilitiesGrid
                    facilities={facilities}
                    onAdd={handleOpenAddFacility}
                    onEdit={handleOpenEditFacility}
                    onDelete={handleDeleteFacility}
                  />
                )}
                {activeTab === 'doctors' && (
                  <DoctorsGrid
                    doctors={doctors}
                    onAdd={handleOpenAddDoctor}
                    onEdit={handleOpenEditDoctor}
                    onDelete={handleDeleteDoctor}
                  />
                )}
                {activeTab === 'medications' && <MedicationsGrid medications={medications} />}
                {activeTab === 'appointments' && <AppointmentsGrid appointments={appointments} loading={loading} />}
                {activeTab === 'overview' && (
                  <FacilitiesGrid
                    facilities={facilities}
                    onAdd={handleOpenAddFacility}
                    onEdit={handleOpenEditFacility}
                    onDelete={handleDeleteFacility}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Facility Modal (Add & Edit) */}
      <FacilityModal
        isOpen={isFacilityModalOpen}
        onClose={() => setIsFacilityModalOpen(false)}
        onSave={handleSaveFacility}
        facility={selectedFacility}
      />

      {/* Doctor Modal (Add & Edit) */}
      <DoctorModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        onSave={handleSaveDoctor}
        doctor={selectedDoctor}
        departments={departments}
        facilities={facilities}
      />
    </div>
  );
};
