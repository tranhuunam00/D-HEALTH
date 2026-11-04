import { useState, useCallback } from 'react';

export interface DeviceItem {
  readonly id: string;
  readonly name: string;
  readonly category: 'bp' | 'watch' | 'glucose' | 'oximeter';
  readonly categoryName: string;
  readonly isConnected: boolean;
  readonly battery?: number;
  readonly lastSync?: string;
  readonly abbr: string;
  readonly bg: string;
  readonly fg: string;
}

const INITIAL_DEVICES: readonly DeviceItem[] = Object.freeze([
  {
    id: 'omron-bp',
    name: 'Omron HEM-7600T',
    category: 'bp',
    categoryName: 'Máy đo huyết áp bắp tay',
    isConnected: true,
    battery: 92,
    lastSync: '5 phút trước',
    abbr: 'BP',
    bg: '#E0F2FE',
    fg: '#0369A1',
  },
  {
    id: 'apple-watch',
    name: 'Apple Watch Series 9',
    category: 'watch',
    categoryName: 'Đồng hồ thông minh theo dõi',
    isConnected: true,
    battery: 78,
    lastSync: 'Vừa xong',
    abbr: 'AW',
    bg: '#F3E8FF',
    fg: '#7E22CE',
  },
  {
    id: 'accu-chek',
    name: 'Accu-Chek Instant',
    category: 'glucose',
    categoryName: 'Máy đo đường huyết',
    isConnected: false,
    abbr: 'GL',
    bg: '#FEF3C7',
    fg: '#B45309',
  },
]);

export function useDevicesLogic() {
  const [devices, setDevices] = useState<readonly DeviceItem[]>(INITIAL_DEVICES);
  const [isScanning, setIsScanning] = useState(false);

  const startScan = useCallback(() => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  }, []);

  const toggleDeviceConnection = useCallback((deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId ? { ...d, isConnected: !d.isConnected } : d
      )
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
