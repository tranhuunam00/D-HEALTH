import React from 'react';
import { ChevronLeft, Bluetooth, RefreshCw } from 'lucide-react';
import { useDevicesLogic, DeviceItem } from './useDevicesLogic';
import { ScreenHeaderPills } from '../../components/molecules/ScreenHeaderPills';

interface SCR04Props {
  readonly onNavigate: (screen: string) => void;
  readonly activeMemberName?: string;
}

export const SCR04_DevicesScreen: React.FC<SCR04Props> = ({
  onNavigate,
  activeMemberName = '',
}) => {
  const {
    devices,
    connectedCount,
    isScanning,
    startScan,
    toggleDeviceConnection,
  } = useDevicesLogic();

  const platforms = devices.filter((d) => d.group === 'platforms');
  const wearables = devices.filter((d) => d.group === 'wearables');
  const medical = devices.filter((d) => d.group === 'medical');

  const renderDeviceRow = (device: DeviceItem) => (
    <div
      key={device.id}
      className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs shrink-0"
          style={{ backgroundColor: device.bg, color: device.fg }}
        >
          {device.abbr}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-slate-900 truncate">{device.name}</span>
          <span className="text-xs text-slate-400 font-medium truncate">{device.subtitle}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => toggleDeviceConnection(device.id)}
        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
          device.isConnected
            ? 'bg-[#EAF8F0] text-[#166534] hover:opacity-90'
            : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
        }`}
      >
        {device.isConnected ? 'Đã kết nối' : 'Kết nối'}
      </button>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col font-sans select-none pb-8">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 flex flex-col gap-3.5">
        {/* 1. Header Badges */}
        <ScreenHeaderPills
          activeMemberName={activeMemberName}
          onSelectMember={() => onNavigate('family')}
        />

        {/* 2. Topbar với nút Back */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => onNavigate('biometrics')}
            aria-label="Quay lại"
            className="w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-xs active:scale-95 transition shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-black text-slate-900 leading-tight">
            Kết nối thiết bị
          </h1>
        </div>

        {/* 3. Hero Gradient Card */}
        <div className="bg-gradient-to-r from-[#177A8C] via-[#207A94] to-[#2B6BD6] text-white rounded-[26px] p-5 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Bluetooth className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight">
                {connectedCount} thiết bị đang kết nối
              </span>
              <span className="text-xs text-white/85 font-medium">
                Bluetooth đang bật · tự động đồng bộ
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={startScan}
            disabled={isScanning}
            className="w-full h-11 rounded-full bg-white text-slate-900 text-xs font-bold flex items-center justify-center gap-2 shadow-xs hover:bg-slate-50 active:scale-[0.99] transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Đang quét thiết bị xung quanh...' : 'Quét tìm thiết bị mới'}</span>
          </button>
        </div>

        {/* 4. Nhóm: Nền tảng sức khoẻ */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-black text-slate-900 px-1">Nền tảng sức khoẻ</h2>
          <div className="bg-white rounded-[24px] divide-y divide-slate-100 shadow-xs border border-slate-100 overflow-hidden">
            {platforms.map(renderDeviceRow)}
          </div>
        </div>

        {/* 5. Nhóm: Đồng hồ thông minh */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-black text-slate-900 px-1">Đồng hồ thông minh</h2>
          <div className="bg-white rounded-[24px] divide-y divide-slate-100 shadow-xs border border-slate-100 overflow-hidden">
            {wearables.map(renderDeviceRow)}
          </div>
        </div>

        {/* 6. Nhóm: Thiết bị y tế */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-black text-slate-900 px-1">Thiết bị y tế</h2>
          <div className="bg-white rounded-[24px] divide-y divide-slate-100 shadow-xs border border-slate-100 overflow-hidden">
            {medical.map(renderDeviceRow)}
          </div>
        </div>

        {/* 7. Disclaimer Policy Text */}
        <p className="text-xs text-slate-400 text-center font-normal px-4 pt-2 pb-6 leading-relaxed">
          D-Health chỉ đọc những loại dữ liệu bạn cho phép. Bạn có thể ngắt kết nối bất cứ lúc nào.
        </p>
      </div>
    </div>
  );
};
