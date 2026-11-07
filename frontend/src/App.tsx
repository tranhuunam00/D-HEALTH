import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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
import { SCR15_UserProfileScreen } from './screens/profile/SCR15_UserProfileScreen';
import { SCR16_FamilyProfilesScreen } from './screens/family/SCR16_FamilyProfilesScreen';
import { SCR17_EmergencyScreen } from './screens/emergency/SCR17_EmergencyScreen';
import { AdminDashboard } from './screens/admin/AdminDashboard';
import { User } from './types/auth.types';

export type MobileScreenId =
  | 'login' | 'home' | 'biometrics' | 'devices' | 'labs' | 'lab-detail'
  | 'imaging' | 'imaging-detail' | 'chronic' | 'records' | 'meds'
  | 'camera-ocr' | 'ai' | 'care' | 'profile' | 'family' | 'emergency';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('dhealth_token');
      const savedUser = localStorage.getItem('dhealth_user');
      if (token && savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch {}
      }
    }
    return null;
  });

  const [viewMode, setViewMode] = useState<'mobile_patient' | 'pc_admin'>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('dhealth_user');
      if (savedUser) {
        try {
          const u = JSON.parse(savedUser);
          if (u.role === 'admin' || u.role === 'super_admin') return 'pc_admin';
        } catch {}
      }
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'admin' || window.location.pathname.startsWith('/admin')) {
        return 'pc_admin';
      }
    }
    return 'mobile_patient';
  });

  const [currentScreen, setCurrentScreen] = useState<MobileScreenId>(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('dhealth_token');
      const savedUser = localStorage.getItem('dhealth_user');
      const savedScreen = localStorage.getItem('dhealth_screen') as MobileScreenId;
      if (token && savedUser) {
        return savedScreen && savedScreen !== 'login' ? savedScreen : 'home';
      }
    }
    return 'login';
  });

  const navigateTo = (screen: MobileScreenId, param?: string) => {
    if (screen === 'camera-ocr' && param) {
      setCameraInputKind(param as 'lab' | 'img' | 'gpb');
    }
    setCurrentScreen(screen);
    if (typeof window !== 'undefined' && screen !== 'login') {
      localStorage.setItem('dhealth_screen', screen);
    }
  };

  const [selectedLabReportId, setSelectedLabReportId] = useState<string | null>(null);
  const [selectedImagingReportId, setSelectedImagingReportId] = useState<string | null>(null);
  const [cameraInputKind, setCameraInputKind] = useState<'lab' | 'img' | 'gpb'>('lab');
  const [selectedMember, setSelectedMember] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch('/api/auth/me', { headers });
        if (res.ok) {
          const json = await res.json();
          if (json?.data) {
            setCurrentUser(json.data);
            const isAdmin = json.data.role === 'admin' || json.data.role === 'super_admin';
            setViewMode(isAdmin ? 'pc_admin' : 'mobile_patient');
            if (typeof window !== 'undefined') {
              localStorage.setItem('dhealth_user', JSON.stringify(json.data));
            }
            setCurrentScreen((prev) => {
              if (prev === 'login') {
                const savedScreen = typeof window !== 'undefined' ? (localStorage.getItem('dhealth_screen') as MobileScreenId) : null;
                return savedScreen && savedScreen !== 'login' ? savedScreen : 'home';
              }
              return prev;
            });
          }
        } else if (res.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('dhealth_user');
            localStorage.removeItem('dhealth_token');
            localStorage.removeItem('dhealth_screen');
          }
          setCurrentUser(null);
          setCurrentScreen('login');
          setViewMode('mobile_patient');
        }
      } catch {
        // network or server error: maintain local state
      }
    };
    verifySession();
  }, []);

  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dhealth_user');
      localStorage.removeItem('dhealth_token');
      localStorage.removeItem('dhealth_screen');
      localStorage.removeItem('dhealth_member');
      // Xoá triệt để mọi key cache dhealth_* trong localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('dhealth_')) {
          localStorage.removeItem(key);
        }
      });
      sessionStorage.clear();
    }
    // Xóa sạch toàn bộ in-memory query cache của React Query
    queryClient.clear();
    setCurrentUser(null);
    setSelectedMember(null);
    setCurrentScreen('login');
    setViewMode('mobile_patient');
  };

  const handleLoginSuccess = (u: User) => {
    setCurrentUser(u);
    const isAdmin = u.role === 'admin' || u.role === 'super_admin';
    if (isAdmin) {
      setViewMode('pc_admin');
    } else {
      setViewMode('mobile_patient');
      navigateTo('home');
    }
  };

  const activeMemberId = selectedMember?.id || currentUser?.activeMemberId || currentUser?.id || 'mem_145deb71';
  const activeMemberName = selectedMember?.name || currentUser?.fullName || '';

  const renderMobileScreen = () => {
    if (!currentUser || currentScreen === 'login') {
      return <SCR01_LoginScreen onLoginSuccess={handleLoginSuccess} />;
    }

    switch (currentScreen) {
      case 'home':
        return (
          <SCR02_HomeScreen
            user={currentUser}
            activeMemberId={activeMemberId}
            activeMemberName={activeMemberName}
            onOpenEmergency={() => navigateTo('emergency')}
            onNavigate={(s) => navigateTo(s as any)}
          />
        );
      case 'biometrics':
        return (
          <SCR03_BiometricsScreen
            activeMemberId={activeMemberId}
            activeMemberName={activeMemberName}
            onNavigate={(s) => navigateTo(s as any)}
          />
        );
      case 'devices':
        return (
          <SCR04_DevicesScreen
            onNavigate={(s) => navigateTo(s as any)}
            activeMemberName={activeMemberName}
          />
        );
      case 'labs':
        return (
          <SCR05_LabsScreen
            activeMemberId={activeMemberId}
            activeMemberName={activeMemberName}
            onNavigate={(s, id) => {
              if (s === 'lab-detail' && id) {
                setSelectedLabReportId(id);
              }
              navigateTo(s as any);
            }}
          />
        );
      case 'lab-detail':
        return (
          <SCR06_LabDetailScreen
            reportId={selectedLabReportId}
            activeMemberName={activeMemberName}
            activeMemberId={activeMemberId}
            onNavigate={(s) => navigateTo(s as any)}
          />
        );
      case 'imaging':
        return (
          <SCR07_ImagingScreen
            activeMemberName={activeMemberName}
            activeMemberId={activeMemberId}
            onNavigate={(s, id) => {
              if (s === 'imaging-detail' && id) {
                setSelectedImagingReportId(id);
              }
              navigateTo(s as any);
            }}
          />
        );
      case 'imaging-detail':
        return (
          <SCR08_ImagingDetailScreen
            reportId={selectedImagingReportId}
            activeMemberName={activeMemberName}
            activeMemberId={activeMemberId}
            onNavigate={(s) => navigateTo(s as any)}
          />
        );
      case 'chronic':
        return (
          <SCR09_ChronicScreen
            onNavigate={(s) => navigateTo(s as any)}
            activeMemberName={activeMemberName}
            activeMemberId={activeMemberId}
          />
        );
      case 'records':
        return (
          <SCR10_RecordsScreen
            activeMemberId={activeMemberId}
            activeMemberName={activeMemberName}
            onNavigate={(s) => navigateTo(s as any)}
            onSelectMember={() => navigateTo('family')}
          />
        );
      case 'meds':
        return (
          <SCR11_MedsScreen
            onNavigate={(s) => navigateTo(s as any)}
            activeMemberName={activeMemberName}
            activeMemberId={activeMemberId}
          />
        );
      case 'camera-ocr':
        return (
          <SCR12_CameraInputScreen
            initialKind={cameraInputKind}
            activeMemberId={activeMemberId}
            activeMemberName={activeMemberName}
            onNavigate={(s) => navigateTo(s as any)}
          />
        );
      case 'ai':
        return (
          <SCR13_AIAssistantScreen
            onNavigate={(s, detailId) => {
              if (s === 'lab-detail' && detailId) setSelectedLabReportId(detailId);
              navigateTo(s as any);
            }}
            activeMemberName={activeMemberName}
          />
        );
      case 'care':
        return (
          <SCR14_CareScreen
            activeMemberId={activeMemberId}
            activeMemberName={activeMemberName}
            onNavigate={(s) => navigateTo(s as any)}
          />
        );
      case 'profile':
        return (
          <SCR15_UserProfileScreen
            user={currentUser}
            activeMemberId={activeMemberId}
            onProfileUpdated={(updatedUser) => {
              if (updatedUser) setCurrentUser(updatedUser);
            }}
            onBack={() => {
              try {
                const stored = localStorage.getItem('dhealth_user');
                if (stored) setCurrentUser(JSON.parse(stored));
              } catch {}
              navigateTo('home');
            }}
            onNavigateToAdmin={() => setViewMode('pc_admin')}
            onLogout={handleLogout}
          />
        );
      case 'family':
        return (
          <SCR16_FamilyProfilesScreen
            onNavigate={(s) => navigateTo(s as any)}
            onSelectMember={(memId, memName) => {
              setSelectedMember({ id: memId, name: memName || '' });
              navigateTo('home');
            }}
            activeMemberId={activeMemberId}
          />
        );
      case 'emergency':
        return (
          <SCR17_EmergencyScreen
            activeMemberId={activeMemberId}
            activeMemberName={activeMemberName}
            onNavigate={() => navigateTo('home')}
          />
        );
      default:
        return (
          <SCR02_HomeScreen
            user={currentUser}
            activeMemberId={activeMemberId}
            activeMemberName={activeMemberName}
            onOpenEmergency={() => navigateTo('emergency')}
            onNavigate={(s) => navigateTo(s as any)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col font-sans">
      <main className="flex-1 flex justify-center bg-[#F1F5F9]">
        {viewMode === 'pc_admin' && currentUser ? (
          <div className="w-full h-full">
            <AdminDashboard onLogout={handleLogout} />
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
