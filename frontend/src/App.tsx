import React, { useState } from 'react';
import { Smartphone, Monitor, ShieldCheck, HeartPulse, LogOut, User as UserIcon } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'mobile_patient' | 'pc_admin'>('mobile_patient');
  const [currentScreen, setCurrentScreen] = useState<MobileScreenId>('home');
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'user-default',
    phoneNumber: '0988777666',
    fullName: 'Trần Hữu Nam',
    role: 'patient',
  });

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  const renderMobileScreen = () => {
    if (!currentUser && currentScreen === 'login') {
      return <SCR01_LoginScreen onLoginSuccess={(u) => { setCurrentUser(u); setCurrentScreen('home'); }} />;
    }
    switch (currentScreen) {
      case 'home':
        return <SCR02_HomeScreen onOpenEmergency={() => setCurrentScreen('emergency')} />;
      case 'biometrics':
        return <SCR03_BiometricsScreen onNavigate={(s) => setCurrentScreen(s as any)} />;
      case 'devices':
        return <SCR04_DevicesScreen onNavigate={(s) => setCurrentScreen(s as any)} />;
      case 'labs':
        return <SCR05_LabsScreen onNavigate={(s) => setCurrentScreen(s as any)} />;
      case 'lab-detail':
        return <SCR06_LabDetailScreen onNavigate={(s) => setCurrentScreen(s as any)} />;
      case 'imaging':
        return <SCR07_ImagingScreen onNavigate={(s) => setCurrentScreen(s as any)} />;
      case 'imaging-detail':
        return <SCR08_ImagingDetailScreen onNavigate={(s) => setCurrentScreen(s as any)} />;
      case 'chronic':
        return <SCR09_ChronicScreen onNavigate={(s) => setCurrentScreen(s as any)} />;
      case 'records':
        return <SCR10_RecordsScreen onNavigate={(s) => setCurrentScreen(s as any)} />;
      case 'meds':
        return <SCR11_MedsScreen onNavigate={(s) => setCurrentScreen(s as any)} />;
      case 'camera-ocr':
        return <SCR12_CameraInputScreen onNavigate={(s) => setCurrentScreen(s as any)} />;
      case 'ai':
        return <SCR13_AIAssistantScreen onNavigate={(s) => setCurrentScreen(s as any)} />;
      case 'care':
        return <SCR14_CareScreen onNavigate={(s) => setCurrentScreen(s as any)} />;
      case 'profile':
        return <SCR16_UserProfileScreen onBack={() => setCurrentScreen('home')} />;
      case 'family':
        return <SCR17_FamilyProfilesScreen onNavigate={(s) => setCurrentScreen(s as any)} />;
      case 'emergency':
        return <SCR17_EmergencyScreen onNavigate={() => setCurrentScreen('home')} />;
      default:
        return <SCR02_HomeScreen onOpenEmergency={() => setCurrentScreen('emergency')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans">
      <header className="h-12 bg-slate-950/80 border-b border-slate-800/80 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-[#1F7A8C]" />
          <span className="text-xs font-black tracking-wider text-white">D-HEALTH ECOSYSTEM</span>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-xl">
          <button
            onClick={() => setViewMode('mobile_patient')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'mobile_patient' ? 'bg-[#1F7A8C] text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Bệnh Nhân (390×844)</span>
          </button>
          <button
            onClick={() => setViewMode('pc_admin')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'pc_admin' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>PC Admin Tổng (≥1280px)</span>
          </button>
        </div>

        {/* Screen Quick Selector for Tester/User */}
        {viewMode === 'mobile_patient' && (
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="text-slate-400">Xem nhanh màn hình:</span>
            <select
              value={currentScreen}
              onChange={(e) => setCurrentScreen(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none"
            >
              <option value="home">SCR-02: Trang chủ (Main)</option>
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

        <div className="flex items-center gap-2">
          {currentUser && (
            <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800" title="Đăng xuất">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        {viewMode === 'pc_admin' ? (
          <div className="w-full h-full">
            <AdminDashboard />
          </div>
        ) : (
          <div className="py-6 px-2 flex justify-center w-full">
            <div className="w-[390px] min-h-[844px] bg-[#0B132B] rounded-[40px] border-4 border-slate-700/80 shadow-2xl overflow-hidden relative flex flex-col">
              <div className="w-28 h-5 bg-black rounded-full mx-auto mt-2 z-40" />
              <div className="flex-1 flex flex-col">{renderMobileScreen()}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
