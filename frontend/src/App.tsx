import { useState, useEffect } from 'react';
import { Activity, ShieldCheck, HeartPulse, User, Database, HardDrive, Smartphone, CheckCircle, RefreshCw } from 'lucide-react';

interface HealthData {
  status: string;
  services: {
    database: string;
    minio: string;
  };
  metrics: {
    seededMembers: number;
  };
}

interface Member {
  id: string;
  full_name: string;
  relationship: string;
  blood_type: string;
  gender: string;
}

export default function App() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [activeMem, setActiveMem] = useState<string>('me');

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
      const memRes = await fetch('/api/members');
      if (memRes.ok) {
        const mData = await memRes.json();
        setMembers(mData.data || []);
      }
    } catch (err) {
      console.error("Health check error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 md:p-8">
      {/* Header Dashboard Banner */}
      <header className="max-w-4xl w-full mb-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-teal to-primary-blue flex items-center justify-center shadow-lg shadow-teal-500/20">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">D-HEALTH SYSTEM</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">Nền tảng Quản trị Sức khoẻ Số & Đồng bộ Dữ liệu Đa tầng</p>
        </div>

        <button 
          onClick={checkHealth}
          disabled={loading}
          className="mt-4 md:mt-0 px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-semibold rounded-lg flex items-center gap-2 border border-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Làm mới trạng thái
        </button>
      </header>

      {/* Main Grid: Server Status & Mobile Simulation Frame */}
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Server Infrastructure Diagnostics */}
        <div className="space-y-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary-teal" />
              Hạ tầng Server (Docker Stack)
            </h2>

            <div className="space-y-3">
              {/* PostgreSQL Status */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-sm font-semibold">PostgreSQL 16</div>
                    <div className="text-xs text-slate-400">Cổng 7103 · 13 Bảng CSDL</div>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  health?.services.database.includes('connected') 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {health?.services.database || 'Đang kết nối...'}
                </span>
              </div>

              {/* MinIO S3 Status */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-3">
                  <HardDrive className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-sm font-semibold">MinIO S3 Storage</div>
                    <div className="text-xs text-slate-400">Cổng 7104 (S3) · 7105 (Console)</div>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  health?.services.minio.includes('connected') 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {health?.services.minio || 'Đang kết nối...'}
                </span>
              </div>

              {/* Backend API */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-sm font-semibold">Backend Node.js API</div>
                    <div className="text-xs text-slate-400">Cổng 7102 · Clean Architecture</div>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Seeded Members Selector */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-primary-teal" />
              Thành viên Gia đình Đã Khởi tạo ({members.length})
            </h2>
            <p className="text-xs text-slate-400 mb-4">Dữ liệu seed tự động từ script <code>01-init.sql</code>:</p>

            <div className="grid grid-cols-1 gap-2">
              {members.length > 0 ? (
                members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveMem(m.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition ${
                      activeMem === m.id
                        ? 'bg-primary-teal/20 border-primary-teal text-white'
                        : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-medium">{m.full_name}</div>
                      <div className="text-xs text-slate-400">Mã: {m.id} · {m.gender} · Nhóm máu: {m.blood_type}</div>
                    </div>
                    {activeMem === m.id && <CheckCircle className="w-4 h-4 text-primary-teal" />}
                  </button>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic p-3 text-center">
                  Đang tải danh sách thành viên từ PostgreSQL...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Mobile Frame Preview (390 x 844 iPhone Frame) */}
        <div className="flex flex-col items-center">
          <div className="text-xs text-slate-400 mb-2 flex items-center gap-1.5 font-medium">
            <Smartphone className="w-4 h-4" />
            Khung hiển thị Mobile Screen (390×844)
          </div>

          {/* iPhone Mockup Frame */}
          <div className="w-[360px] h-[720px] bg-slate-50 rounded-[40px] border-[10px] border-slate-800 shadow-2xl overflow-hidden flex flex-col relative text-slate-900">
            {/* Dynamic Island / Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30"></div>

            {/* Mobile Header Bar */}
            <div className="bg-white px-5 pt-8 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Hồ sơ sức khoẻ</span>
                <div className="text-base font-bold text-slate-900 flex items-center gap-1">
                  {members.find(m => m.id === activeMem)?.full_name || 'Trần Minh Khang'}
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">O+</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-teal to-primary-blue text-white flex items-center justify-center font-bold text-xs">
                K
              </div>
            </div>

            {/* Mobile Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50">
              {/* Health Score Card */}
              <div className="bg-gradient-to-r from-primary-teal to-primary-blue rounded-2xl p-4 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs opacity-80 uppercase tracking-wide">Điểm sức khoẻ</span>
                    <div className="text-3xl font-extrabold mt-0.5">78</div>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full mt-1 inline-block">Ổn định</span>
                  </div>
                  <div className="text-right text-xs opacity-90">
                    <div>2 vấn đề cần theo dõi</div>
                    <div className="mt-1">9 nhóm dữ liệu</div>
                  </div>
                </div>
              </div>

              {/* Medication Reminder Card */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Nhắc uống thuốc · 20:00</div>
                  <div className="text-sm font-bold text-slate-900">Metformin 500 mg</div>
                  <div className="text-xs text-slate-500">1 viên sau ăn tối · 2/4 liều</div>
                </div>
                <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-xl border border-emerald-200 transition">
                  Đã uống
                </button>
              </div>

              {/* Biometrics 4-grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Huyết áp</span>
                    <span className="text-emerald-700 bg-emerald-50 text-[10px] font-bold px-1.5 py-0.5 rounded">Tốt</span>
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">131/82 <span className="text-[10px] font-normal text-slate-400">mmHg</span></div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Nhịp tim</span>
                    <span className="text-emerald-700 bg-emerald-50 text-[10px] font-bold px-1.5 py-0.5 rounded">Tốt</span>
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">71 <span className="text-[10px] font-normal text-slate-400">bpm</span></div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Cân nặng</span>
                    <span className="text-amber-700 bg-amber-50 text-[10px] font-bold px-1.5 py-0.5 rounded">Theo dõi</span>
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">72,5 <span className="text-[10px] font-normal text-slate-400">kg</span></div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">HbA1c</span>
                    <span className="text-emerald-700 bg-emerald-50 text-[10px] font-bold px-1.5 py-0.5 rounded">Tốt</span>
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">6,6 <span className="text-[10px] font-normal text-slate-400">%</span></div>
                </div>
              </div>

              {/* Health Timeline */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">Health Timeline</span>
                  <span className="text-[11px] text-primary-teal font-semibold">Xem tất cả</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2">
                  <span className="text-slate-700">🧪 Xét nghiệm máu</span>
                  <span className="text-slate-400 font-medium">20/10</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2">
                  <span className="text-slate-700">📷 CT ngực</span>
                  <span className="text-slate-400 font-medium">08/10</span>
                </div>
              </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="bg-white border-t border-slate-200/80 px-4 py-2 flex justify-between items-center text-[10px] font-semibold text-slate-400">
              <div className="text-primary-teal flex flex-col items-center">
                <span>🏠</span>
                <span>Trang chủ</span>
              </div>
              <div className="flex flex-col items-center hover:text-slate-700">
                <span>📈</span>
                <span>Sức khoẻ</span>
              </div>
              <div className="flex flex-col items-center hover:text-slate-700">
                <span>📁</span>
                <span>Hồ sơ</span>
              </div>
              <div className="flex flex-col items-center hover:text-slate-700">
                <span>✨</span>
                <span>Trợ lý AI</span>
              </div>
              <div className="flex flex-col items-center hover:text-slate-700">
                <span>🩺</span>
                <span>Chăm sóc</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
