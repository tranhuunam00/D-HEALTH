import { useState, useCallback, useEffect } from 'react';

export type MetricType = 'bp' | 'hr' | 'spo2' | 'weight' | 'glucose';

export interface BiometricReading {
  readonly id: string;
  readonly type: MetricType;
  readonly value: string;
  readonly unit: string;
  readonly recordedAt: string;
  readonly source: 'device' | 'manual';
  readonly status: 'normal' | 'warning' | 'critical';
}

const INITIAL_HISTORY: readonly BiometricReading[] = Object.freeze([
  { id: '1', type: 'bp', value: '131/82', unit: 'mmHg', recordedAt: 'Hôm nay 07:15', source: 'device', status: 'normal' },
  { id: '2', type: 'bp', value: '135/85', unit: 'mmHg', recordedAt: 'Hôm qua 19:40', source: 'device', status: 'warning' },
  { id: '3', type: 'bp', value: '128/80', unit: 'mmHg', recordedAt: '24/10 07:20', source: 'manual', status: 'normal' },
  { id: '4', type: 'bp', value: '130/84', unit: 'mmHg', recordedAt: '23/10 18:30', source: 'device', status: 'normal' },
  { id: '5', type: 'bp', value: '138/88', unit: 'mmHg', recordedAt: '22/10 07:10', source: 'manual', status: 'warning' },
]);

export function useBiometricsLogic(memberId = 'nam') {
  const [activeMetric, setActiveMetric] = useState<MetricType>('bp');
  const [history, setHistory] = useState<readonly BiometricReading[]>(INITIAL_HISTORY);
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`/api/biometrics/${memberId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          const mapped: BiometricReading[] = json.data.map((r: any) => ({
            id: r.id,
            type: r.biometric_type,
            value: r.biometric_type === 'bp' ? `${Math.round(r.systolic)}/${Math.round(r.diastolic)}` : `${r.value_numeric}`,
            unit: r.unit,
            recordedAt: new Date(r.measured_at).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            source: r.source === 'device_ble' ? 'device' : 'manual',
            status: r.severity_level === 3 ? 'critical' : r.severity_level === 2 ? 'warning' : 'normal',
          }));
          setHistory(mapped);
        }
      }
    } catch {}
  }, [memberId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const openEntrySheet = useCallback(() => setIsEntrySheetOpen(true), []);
  const closeEntrySheet = useCallback(() => setIsEntrySheetOpen(false), []);

  return {
    activeMetric,
    setActiveMetric,
    history,
    isEntrySheetOpen,
    openEntrySheet,
    closeEntrySheet,
  };
}
