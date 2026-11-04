import { useState, useCallback } from 'react';

export interface DeviceItem {
  readonly id: string;
  readonly name: string;
  readonly group: 'platforms' | 'wearables' | 'medical';
  readonly subtitle: string;
  readonly isConnected: boolean;
  readonly abbr: string;
  readonly bg: string;
  readonly fg: string;
}

export const INITIAL_DEVICES: readonly DeviceItem[] = Object.freeze([
  // 1. Nền tảng sức khoẻ
  {
    id: 'apple-health',
    name: 'Apple Health',
    group: 'platforms',
    subtitle: 'Đồng bộ 5 phút trước',
    isConnected: true,
    abbr: 'AH',
    bg: '#FEE2E2',
    fg: '#DC2626',
  },
  {
    id: 'google-health',
    name: 'Google Health Connect',
    group: 'platforms',
    subtitle: 'Dành cho Android',
    isConnected: false,
    abbr: 'HC',
    bg: '#E0F2FE',
    fg: '#0284C7',
  },
  // 2. Đồng hồ thông minh
  {
    id: 'apple-watch',
    name: 'Apple Watch',
    group: 'wearables',
    subtitle: 'Pin 64% · đồng bộ 5 phút trước',
    isConnected: true,
    abbr: 'AW',
    bg: '#F1F5F9',
    fg: '#334155',
  },
  {
    id: 'garmin',
    name: 'Garmin',
    group: 'wearables',
    subtitle: 'Qua ứng dụng Garmin Connect',
    isConnected: false,
    abbr: 'GA',
    bg: '#E0F2FE',
    fg: '#0284C7',
  },
  {
    id: 'samsung-watch',
    name: 'Samsung Galaxy Watch',
    group: 'wearables',
    subtitle: 'Qua Samsung Health',
    isConnected: false,
    abbr: 'SG',
    bg: '#EDE9FE',
    fg: '#7C3AED',
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    group: 'wearables',
    subtitle: 'Qua tài khoản Fitbit',
    isConnected: false,
    abbr: 'FB',
    bg: '#D1FAE5',
    fg: '#059669',
  },
  // 3. Thiết bị y tế
  {
    id: 'omron-bp',
    name: 'Máy đo huyết áp',
    group: 'medical',
    subtitle: 'Lần đo gần nhất 07:15 · 26/10',
    isConnected: true,
    abbr: 'HA',
    bg: '#DBEAFE',
    fg: '#2563EB',
  },
  {
    id: 'spo2-meter',
    name: 'Máy đo SpO₂',
    group: 'medical',
    subtitle: 'Bluetooth · kẹp ngón tay',
    isConnected: false,
    abbr: 'O₂',
    bg: '#E0F2FE',
    fg: '#0891B2',
  },
  {
    id: 'glucose-meter',
    name: 'Máy đo đường huyết',
    group: 'medical',
    subtitle: 'Bluetooth',
    isConnected: false,
    abbr: 'ĐH',
    bg: '#FEF3C7',
    fg: '#D97706',
  },
  {
    id: 'smart-scale',
    name: 'Cân thông minh',
    group: 'medical',
    subtitle: 'Bluetooth · Wi-Fi',
    isConnected: false,
    abbr: 'CN',
    bg: '#F3E8FF',
    fg: '#9333EA',
  },
  {
    id: 'thermometer',
    name: 'Nhiệt kế điện tử',
    group: 'medical',
    subtitle: 'Bluetooth',
    isConnected: false,
    abbr: 'NĐ',
    bg: '#FFEDD5',
    fg: '#EA580C',
  },
]);

export function useDevicesLogic() {
  const [devices, setDevices] = useState<readonly DeviceItem[]>(INITIAL_DEVICES);
  const [isScanning, setIsScanning] = useState(false);

  const startScan = useCallback(() => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2500);
  }, []);

  const toggleDeviceConnection = useCallback((deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, isConnected: !d.isConnected } : d))
    );
  }, []);

  const connectedCount = devices.filter((d) => d.isConnected).length;

  return {
    devices,
    connectedCount,
    isScanning,
    startScan,
    toggleDeviceConnection,
  };
}
