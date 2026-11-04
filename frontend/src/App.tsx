import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, LogOut, HeartPulse } from 'lucide-react';
import { SCR01_LoginScreen } from './screens/auth/SCR01_LoginScreen';
import { SCR02_HomeScreen } from './screens/home/SCR02_HomeScreen';
import { SCR03_BiometricsScreen } from './screens/health/SCR03_BiometricsScreen';
import { SCR04_DevicesScreen } from './screens/devices/SCR04_DevicesScreen';
import { SCR05_LabsScreen } from './screens/labs/SCR05_LabsScreen';
import { SCR06_LabDetailScreen } from './screens/labs/SCR06_LabDetailScreen';
import { SCR07_ImagingScreen } from './screens/imaging/SCR07_ImagingScreen';
import { SCR08_ImagingDetailScreen } from './screens/imaging/SCR08_ImagingDetailScreen';
import { SCR09_ChronicScreen } from './screens/chronic/SCR09_ChronicScreen';
import { SCR10_RecordsScreen } from './screens/records/SCR10_RecordsScreen';
import { SCR11_MedsScreen } from './screens/meds/SCR11_MedsScreen';
import { SCR12_CameraInputScreen } from './screens/camera/SCR12_CameraInputScreen';
import { SCR13_AIAssistantScreen } from './screens/ai/SCR13_AIAssistantScreen';
import { SCR14_CareScreen } from './screens/care/SCR14_CareScreen';
import { SCR16_UserProfileScreen } from './screens/profile/SCR16_UserProfileScreen';
import { SCR17_FamilyProfilesScreen } from './screens/family/SCR17_FamilyProfilesScreen';
import { SCR17_EmergencyScreen } from './screens/emergency/SCR17_EmergencyScreen';
import { AdminDashboard } from './screens/admin/AdminDashboard';
import { User } from './types/auth.types';

export type MobileScreenId =
  | 'login' | 'home' | 'biometrics' | 'devices' | 'labs' | 'lab-detail'
  | 'imaging' | 'imaging-detail' | 'chronic' | 'records' | 'meds'
  | 'camera-ocr' | 'ai' | 'care' | 'profile' | 'family' | 'emergency';

export default function App() {
  const [viewMode, setViewMode] = useState<'mobile_patient' | 'pc_admin'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'admin' || window.location.pathname.startsWith('/admin')) {
        return 'pc_admin';
      }
    }
    return 'mobile_patient';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('dhealth_user');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return null;
  });

  const [currentScreen, setCurrentScreen] = useState<MobileScreenId>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dhealth_user');
      if (!stored) return 'login';
    }
    return 'home';
  });

  const [selectedLabReportId, setSelectedLabReportId] = useState<string | null>(null);
  const [selectedImagingReportId, setSelectedImagingReportId] = useState<string | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const json = await res.json();
          if (json?.data) {
            setCurrentUser(json.data);
            localStorage.setItem('dhealth_user', JSON.stringify(json.data));
          }
        } else if (!currentUser) {
          setCurrentScreen('login');
        }
      } catch {
        // network or server error: maintain local state
      }
    };
    verifySession();
  }, []);

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dhealth_user');
      localStorage.removeItem('dhealth_token');
    }
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  const activeMemberId = currentUser?.activeMemberId || 'nam';
  const activeMemberName = currentUser?.fullName || 'Trần Hữu Nam';

  const renderMobileScreen = () => {
    if (!currentUser || currentScreen === 'login') {
      return (
        <SCR01_LoginScreen
          onLoginSuccess={(u) => {
            setCurrentUser(u);
            setCurrentScreen('home');
          }}
        />
      );
    }

    switch (currentScreen) {
      case 'home':
        return (
          <SCR02_HomeScreen
            user={currentUser}
            activeMemberId={activeMemberId}
            activeMemberName={activeMemberName}
            onOpenEmergency={() => setCurrentScreen('emergency')}
            onNavigate={(s) => setCurrentScreen(s as any)}
          />
        );
      case 'biometrics':
        return (
          <SCR03_BiometricsScreen
            activeMemberId={activeMemberId}
            activeMemberName={activeMemberName}
            onNavigate={(s) => setCurrentScreen(s as any)}
          />
        );
      case 'devices':
        return <SCR04_DevicesScreen onNavigate={(s) => setCurrentScreen(s as any)} activeMemberName={activeMemberName} />;
      case 'labs':
        return (
          <SCR05_LabsScreen
            activeMemberId={activeMemberId}
            activeMemberName={activeMemberName}
            onNavigate={(s, id) => {
              if (id) setSelectedLabReportId(id);
              setCurrentScreen(s as any);
            }}
          />
        );
      case 'lab-detail':
        return (
          <SCR06_LabDetailScreen
            reportId={selectedLabReportId}
            activeMemberId={activeMemberId}
            activeMemberName={activeMemberName}
            onNavigate={(s) => setCurrentScreen(s as any)}
          />
        );
      case 'imaging':
        return (
          <SCR07_ImagingScreen
            activeMemberId={activeMemberId}
            activeMemberName={activeMemberName}
            onNavigate={(s, id) => {
              if (id) setSelectedImagingReportId(id);
              setCurrentScreen(s as any);
            }}
          />
        );
      case 'imaging-detail':
        return (
          <SCR08_ImagingDetailScreen
            reportId={selectedImagingReportId}
            activeMemberName={activeMemberName}
            activeMemberId={activeMemberId}
            onNavigate={(s) => setCurrentScreen(s as any)}
          />
        );
      case 'chronic':
        return <SCR09_ChronicScreen onNavigate={(s) => setCurrentScreen(s as any)} activeMemberName={activeMemberName} />;
      case 'records':
        return (
          <SCR10_RecordsScreen
            onNavigate={(s) => setCurrentScreen(s as any)}
            activeMemberName={activeMemberName}
            onSelectMember={() => setCurrentScreen('family')}
          />
        );
      case 'meds':
        return (
          <SCR11_MedsScreen
            onNavigate={(s) => setCurrentScreen(s as any)}
            activeMemberName={activeMemberName}
            activeMemberId={activeMemberId}
          />
        );
      case 'camera-ocr':
        return (
          <SCR12_CameraInputScreen
            onNavigate={(s) => setCurrentScreen(s as any)}
            activeMemberName={activeMemberName}
            activeMemberId={activeMemberId}
          />
        );
      case 'ai':
        return <SCR13_AIAssistantScreen onNavigate={(s) => setCurrentScreen(s as any)} />;
      case 'care':
        return <SCR14_CareScreen onNavigate={(s) => setCurrentScreen(s as any)} />;
      case 'profile':
        return (
          <SCR16_UserProfileScreen
            user={currentUser}
            activeMemberId={activeMemberId}
            onBack={() => setCurrentScreen('home')}
            onNavigateToAdmin={() => setViewMode('pc_admin')}
          />
        );
      case 'family':
        return <SCR17_FamilyProfilesScreen onNavigate={(s) => setCurrentScreen(s as any)} />;
      case 'emergency':
        return (
          <SCR17_EmergencyScreen
            activeMemberId={activeMemberId}
            activeMemberName={activeMemberName}
            onNavigate={() => setCurrentScreen('home')}
          />
        );
      default:
        return (
          <SCR02_HomeScreen
            user={currentUser}
            activeMemberId={activeMemberId}
            activeMemberName={activeMemberName}
            onOpenEmergency={() => setCurrentScreen('emergency')}
            onNavigate={(s) => setCurrentScreen(s as any)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col font-sans">
      {/* Ecosystem Top Header - Hidden on mobile viewports so mobile users experience a 100% native app */}
      <header className="hidden md:flex h-11 bg-slate-950/95 border-b border-slate-800 px-3 items-center justify-between z-50 shrink-0 text-white">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-[#1F7A8C]" />
          <span className="text-[11px] font-black tracking-wider uppercase">D-HEALTH ECOSYSTEM</span>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
          <button
            onClick={() => setViewMode('mobile_patient')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'mobile_patient' ? 'bg-[#1F7A8C] text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>Mobile Bệnh Nhân</span>
          </button>
          <button
            onClick={() => setViewMode('pc_admin')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'pc_admin' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3 h-3" />
            <span>PC Admin Tổng</span>
          </button>
        </div>

        {/* Screen Quick Selector for Quick Testing */}
        {viewMode === 'mobile_patient' && (
          <div className="hidden md:flex items-center gap-1.5 text-[11px]">
            <select
              value={currentScreen}
              onChange={(e) => setCurrentScreen(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-md px-2 py-0.5 text-[11px] font-medium focus:outline-none"
            >
              <option value="home">SCR-02: Trang chủ</option>
              <option value="biometrics">SCR-03: Sinh trắc học</option>
              <option value="devices">SCR-04: Kết nối thiết bị</option>
              <option value="labs">SCR-05: Xét nghiệm</option>
              <option value="lab-detail">SCR-06: Chi tiết XN</option>
              <option value="imaging">SCR-07: CĐHA</option>
              <option value="imaging-detail">SCR-08: Chi tiết CĐHA</option>
              <option value="chronic">SCR-09: Bệnh mạn tính</option>
              <option value="records">SCR-10: Hồ sơ y tế</option>
              <option value="meds">SCR-11: Quản lý dùng thuốc</option>
              <option value="camera-ocr">SCR-12: Nhập KQ / Camera</option>
              <option value="ai">SCR-13: Trợ lý AI</option>
              <option value="care">SCR-14: Chăm sóc</option>
              <option value="emergency">SCR-15: Thẻ cấp cứu SOS</option>
              <option value="profile">SCR-16: Thông tin cá nhân</option>
              <option value="family">SCR-17: Hồ sơ gia đình</option>
              <option value="login">SCR-01: Đăng nhập</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          {currentUser && (
            <button
              onClick={handleLogout}
              className="p-1 text-slate-400 hover:text-rose-400 rounded-md hover:bg-slate-800"
              title="Đăng xuất"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Main View Area (Responsive Real Mobile / Real PC) */}
      <main className="flex-1 flex justify-center bg-[#F1F5F9]">
        {viewMode === 'pc_admin' ? (
          <div className="w-full h-full">
            <AdminDashboard />
          </div>
        ) : (
          <div className="w-full md:max-w-[480px] min-h-screen bg-[#F8FAFC] flex flex-col relative md:shadow-md">
            {renderMobileScreen()}
          </div>
        )}
      </main>
    </div>
  );
}
