import { useState } from 'react';
import { Smartphone, Monitor, ShieldCheck, HeartPulse, LogOut } from 'lucide-react';
import { SCR01_LoginScreen } from './screens/auth/SCR01_LoginScreen';
import { SCR02_HomeScreen } from './screens/home/SCR02_HomeScreen';
import { AdminDashboard } from './screens/admin/AdminDashboard';
import { User } from './types/auth.types';

export default function App() {
  const [viewMode, setViewMode] = useState<'mobile_patient' | 'pc_admin'>('mobile_patient');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans">
      {/* Global Mode Switcher Bar */}
      <header className="h-12 bg-slate-950/80 border-b border-slate-800/80 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-[#1F7A8C]" />
          <span className="text-xs font-black tracking-wider text-white">D-HEALTH ECOSYSTEM</span>
        </div>

        {/* Device Switcher Pills (Rule 3) */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-xl">
          <button
            onClick={() => setViewMode('mobile_patient')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'mobile_patient'
                ? 'bg-[#1F7A8C] text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Bệnh Nhân (390×844)</span>
          </button>

          <button
            onClick={() => setViewMode('pc_admin')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'pc_admin'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>PC Admin Tổng (≥1280px)</span>
          </button>
        </div>

        {/* User Status */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                {currentUser.fullName || currentUser.phoneNumber}
              </span>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                title="Đăng xuất"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Bảo mật SSL
            </span>
          )}
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 flex items-center justify-center">
        {viewMode === 'pc_admin' ? (
          /* PC-First Admin Portal */
          <div className="w-full h-full">
            <AdminDashboard />
          </div>
        ) : (
          /* Mobile-First Patient Container (390x844 iPhone Viewport) */
          <div className="py-6 px-2 flex justify-center w-full">
            <div className="w-[390px] min-h-[844px] bg-[#0B132B] rounded-[40px] border-4 border-slate-700/80 shadow-2xl overflow-hidden relative flex flex-col">
              {/* iPhone Dynamic Island */}
              <div className="w-28 h-5 bg-black rounded-full mx-auto mt-2 z-40" />

              {/* Mobile Screen Content */}
              <div className="flex-1 flex flex-col">
                {!currentUser ? (
                  <SCR01_LoginScreen onLoginSuccess={handleLoginSuccess} />
                ) : (
                  <SCR02_HomeScreen onOpenEmergency={() => alert('Thẻ Cấp Cứu SOS (SCR-16) đã kích hoạt!')} />
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
