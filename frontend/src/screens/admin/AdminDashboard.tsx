import React from 'react';
import { Building2, Stethoscope, Pill, ShieldCheck, Database, RefreshCw, Activity, Search, Users, UserCheck, HardDrive, LogOut } from 'lucide-react';
import { useAdminLogic } from './useAdminLogic';
import { AdminUserManagement } from './AdminUserManagement';
import { FacilitiesGrid } from './FacilitiesGrid';
import { DoctorsGrid } from './DoctorsGrid';
import { MedicationsGrid } from './MedicationsGrid';

interface AdminDashboardProps {
  readonly onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { stats, health, facilities, doctors, medications, activeTab, setActiveTab, loading, refresh } = useAdminLogic();

  return (
    <div className="w-full min-h-screen bg-[#070D1E] text-slate-100 flex">
      {/* 1. Sidebar Trái Cố Định */}
      <aside className="w-64 border-r border-slate-800 bg-[#0B132B]/80 p-5 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] flex items-center justify-center shadow-lg shadow-[#1F7A8C]/30">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white">D-HEALTH ADMIN</h1>
              <span className="text-[10px] text-purple-400 font-semibold uppercase">Super Admin Portal</span>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Toàn Cảnh Hệ Thống', icon: Activity },
              { id: 'users', label: 'Quản Trị Người Dùng', icon: UserCheck },
              { id: 'facilities', label: 'Cơ Sở Y Tế (CSYT)', icon: Building2 },
              { id: 'doctors', label: 'Danh Bạ Bác Sĩ', icon: Stethoscope },
              { id: 'medications', label: 'Dược Thư Quốc Gia', icon: Pill },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-2.5 transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#1F7A8C] text-white shadow-md shadow-[#1F7A8C]/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 space-y-2">
          <div className="flex items-center justify-between text-emerald-400 font-bold">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> PostgreSQL 16</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Active</span>
          </div>
          <div className="flex items-center justify-between text-purple-400 font-bold pt-1.5 border-t border-slate-800">
            <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5" /> MinIO S3</span>
            <a
              href="http://103.90.227.173:7105"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-purple-300 hover:text-purple-200 underline"
            >
              Console 7105 ↗
            </a>
          </div>
          <p className="text-[9px] text-slate-500 font-mono truncate" title={health.minio}>S3: {health.minio}</p>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-[#0B132B]/40 backdrop-blur">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl w-80 text-xs">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input placeholder="Tìm bệnh viện, bác sĩ, thuốc..." className="bg-transparent text-white focus:outline-none w-full" />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="h-4 w-[1px] bg-slate-800" />
            <span className="text-xs text-slate-300 font-medium">Admin Tổng: <strong className="text-white">Admin NamTH</strong></span>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 text-xs font-bold flex items-center gap-1.5 transition ml-2 cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-3.5 h-3.5" />
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
              {/* Overview Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1"><Building2 className="w-4 h-4 text-blue-400" /> CSYT Đối Tác</span>
                  <div className="text-2xl font-black text-white">{stats.totalFacilities} <span className="text-xs font-normal text-slate-500">cơ sở</span></div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1"><Stethoscope className="w-4 h-4 text-emerald-400" /> Bác Sĩ Chuyên Khoa</span>
                  <div className="text-2xl font-black text-white">{stats.totalDoctors} <span className="text-xs font-normal text-slate-500">bác sĩ</span></div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1"><Pill className="w-4 h-4 text-amber-400" /> Dược Thư Quốc Gia</span>
                  <div className="text-2xl font-black text-white">{stats.totalMedications} <span className="text-xs font-normal text-slate-500">thuốc</span></div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1"><Users className="w-4 h-4 text-purple-400" /> Bệnh Nhân & Gia Đình</span>
                  <div className="text-2xl font-black text-white">{stats.totalMembers} <span className="text-xs font-normal text-slate-500">hồ sơ</span></div>
                </div>
              </div>

              {/* High-Density Data Grid Container */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl">
                <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    {activeTab === 'facilities'
                      ? 'Danh Sách Cơ Sở Y Tế Đối Tác'
                      : activeTab === 'doctors'
                      ? 'Danh Bạ Bác Sĩ Chuyên Khoa'
                      : activeTab === 'medications'
                      ? 'Từ Điển Thuốc Quốc Gia'
                      : 'Bảng Điều Khiển Cấu Hình Master Data'}
                  </h2>
                  <span className="text-[11px] text-purple-300 font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30">
                    Admin Configurable (PostgreSQL 16)
                  </span>
                </div>

                {activeTab === 'facilities' && <FacilitiesGrid facilities={facilities} />}
                {activeTab === 'doctors' && <DoctorsGrid doctors={doctors} />}
                {activeTab === 'medications' && <MedicationsGrid medications={medications} />}
                {activeTab === 'overview' && <FacilitiesGrid facilities={facilities} />}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
