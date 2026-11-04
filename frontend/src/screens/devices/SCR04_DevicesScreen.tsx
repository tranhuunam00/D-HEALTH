import React from 'react';
import { ArrowLeft, Bluetooth, Battery, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { useDevicesLogic } from './useDevicesLogic';
import { HomeBottomNav } from '../home/HomeBottomNav';

interface SCR04Props {
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberName?: string;
}

export const SCR04_DevicesScreen: React.FC<SCR04Props> = ({
  onNavigate,
  activeMemberName = 'Trần Hữu Nam',
}) => {
  const {
    devices,
    connectedCount,
    isScanning,
    startScan,
    toggleDeviceConnection,
  } = useDevicesLogic();

  return (
    <div className="w-[390px] h-[844px] relative overflow-hidden bg-[#EEF2F6] text-[#111827] flex flex-col font-sans select-none">
      <div className="flex-1 overflow-y-auto px-4 pt-12 pb-24 flex flex-col gap-3.5">
        {/* 1. Header Pills */}
        <div className="flex gap-1.5 items-center flex-wrap shrink-0">
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-white text-slate-700 text-xs font-semibold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Hôm nay: 26/10/2026
          </span>
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-[#111827] text-white text-xs font-semibold shadow-xs">
            Hồ sơ: <b>{activeMemberName}</b>
          </span>
        </div>

        {/* 2. Topbar với nút Back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('biometrics')}
            aria-label="Quay lại"
            className="w-11 h-11 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-xs active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-extrabold text-slate-900">Kết nối thiết bị</span>
        </div>

        {/* 3. Hero Gradient Card */}
        <div className="bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] text-white rounded-3xl p-4 flex flex-col gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Bluetooth className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold">{connectedCount} thiết bị đang kết nối</span>
              <span className="text-xs text-white/90 font-medium">Bluetooth đang bật · Tự động đồng bộ</span>
            </div>
          </div>

          <button
            onClick={startScan}
            disabled={isScanning}
            className="h-11 rounded-full bg-white text-slate-900 text-xs font-extrabold flex items-center justify-center gap-2 shadow active:scale-95 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Đang quét thiết bị xung quanh...' : 'Quét tìm thiết bị mới'}
          </button>
        </div>

        {/* 4. Danh sách thiết bị y tế */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Thiết bị theo dõi sinh hiệu
          </span>

          <div className="bg-white rounded-3xl divide-y divide-slate-100 shadow-xs border border-slate-200/60 overflow-hidden">
            {devices.map((device) => (
              <div
                key={device.id}
                className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0"
                    style={{ backgroundColor: device.bg, color: device.fg }}
                  >
                    {device.abbr}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{device.name}</div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {device.categoryName} {device.lastSync ? `· ${device.lastSync}` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {device.battery !== undefined && (
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Battery className="w-3.5 h-3.5 text-emerald-500" />
                      {device.battery}%
                    </span>
                  )}

                  <button
                    onClick={() => toggleDeviceConnection(device.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition ${
                      device.isConnected
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-rose-50 hover:text-rose-700'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {device.isConnected ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Đã kết nối
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Ghép đôi
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Bottom Navigation */}
      <HomeBottomNav
        activeTab="health"
        onTabChange={(tab) => onNavigate(tab)}
      />
    </div>
  );
};
