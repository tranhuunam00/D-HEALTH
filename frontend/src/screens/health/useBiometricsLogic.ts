import { useState, useCallback, useEffect } from 'react';
import { ManualVitalsInput } from '../../types/biometric.types';

export type MetricType = 'bp' | 'hr' | 'spo2' | 'temp' | 'resp' | 'bmi' | 'steps' | 'sleep';

export interface BiometricReading {
  readonly id: string;
  readonly type: string;
  readonly value: string;
  readonly unit: string;
  readonly recordedAt: string;
  readonly measuredAt?: string;
  readonly source: 'device' | 'manual';
  readonly status: 'normal' | 'warning' | 'critical';
}

export interface MetricSummary {
  readonly id: MetricType;
  readonly code: string;
  readonly name: string;
  readonly value: string;
  readonly unit: string;
  readonly codeBg: string;
  readonly codeColor: string;
}

export function useBiometricsLogic(memberId = 'nam') {
  const [activeMetric, setActiveMetric] = useState<MetricType>('bp');
  const [history, setHistory] = useState<readonly BiometricReading[]>([]);
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getBaseUrl = () => {
    return typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null')
      ? window.location.origin
      : 'http://localhost';
  };

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl = getBaseUrl();
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${baseUrl}/api/biometrics/${memberId}`, { headers });
      if (res.ok) {
        const json = await res.json();
        const records = Array.isArray(json.data) ? json.data : [];
        const mapped: BiometricReading[] = records.map((r: any) => ({
          id: r.id,
          type: r.biometric_type,
          value: r.biometric_type === 'bp'
            ? `${Math.round(r.systolic || 0)}/${Math.round(r.diastolic || 0)}`
            : `${r.value_numeric}`,
          unit: r.unit || '',
          recordedAt: new Date(r.measured_at).toLocaleDateString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),
          measuredAt: r.measured_at ? new Date(r.measured_at).toISOString() : '',
          source: r.source === 'device_ble' ? 'device' : 'manual',
          status: r.severity_level === 3 ? 'critical' : r.severity_level === 2 ? 'warning' : 'normal',
        }));
        setHistory(mapped);
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu sinh trắc:', err);
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const postBiometric = (baseUrl: string, headers: Record<string, string>, payload: any) => {
    return fetch(`${baseUrl}/api/biometrics`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
  };

  const handleSaveBiometrics = async (input: ManualVitalsInput) => {
    try {
      const baseUrl = getBaseUrl();
      const token = typeof window !== 'undefined' ? localStorage.getItem('dhealth_token') : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const promises: Promise<any>[] = [];
      if (input.systolic && input.diastolic) {
        promises.push(postBiometric(baseUrl, headers, { memberId, biometricType: 'bp', systolic: input.systolic, diastolic: input.diastolic, unit: 'mmHg' }));
      }
      if (input.heartRate) {
        promises.push(postBiometric(baseUrl, headers, { memberId, biometricType: 'hr', valueNumeric: input.heartRate, unit: 'bpm' }));
      }
      if (input.spo2) {
        promises.push(postBiometric(baseUrl, headers, { memberId, biometricType: 'spo2', valueNumeric: input.spo2, unit: '%' }));
      }
      if (input.glucose) {
        promises.push(postBiometric(baseUrl, headers, { memberId, biometricType: 'glucose', valueNumeric: input.glucose, unit: 'mmol/L' }));
      }
      if (input.temperature) {
        promises.push(postBiometric(baseUrl, headers, { memberId, biometricType: 'temp', valueNumeric: input.temperature, unit: '°C' }));
      }
      if (input.weightKg) {
        promises.push(postBiometric(baseUrl, headers, { memberId, biometricType: 'weight', valueNumeric: input.weightKg, unit: 'kg' }));
      }

      await Promise.all(promises);
      await fetchHistory();
      setIsEntrySheetOpen(false);
      setSuccessMsg('Đã lưu số đo mới vào cơ sở dữ liệu thành công!');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      console.error('Lỗi ghi nhận số đo:', err);
    }
  };

  const openEntrySheet = useCallback(() => setIsEntrySheetOpen(true), []);
  const closeEntrySheet = useCallback(() => setIsEntrySheetOpen(false), []);

  // Trích xuất số đo mới nhất của từng chỉ số từ DB
  const latestBpRec = history.find((h) => h.type === 'bp');
  const latestHrRec = history.find((h) => h.type === 'hr');
  const latestSpo2Rec = history.find((h) => h.type === 'spo2');
  const latestTempRec = history.find((h) => h.type === 'temp');
  const latestRespRec = history.find((h) => h.type === 'resp');
  const latestBmiRec = history.find((h) => h.type === 'bmi');
  const latestWeightRec = history.find((h) => h.type === 'weight');

  const latestStepsRec = history.find((h) => h.type === 'steps');
  const latestSleepRec = history.find((h) => h.type === 'sleep');

  const metricsSummaries: readonly MetricSummary[] = [
    {
      id: 'bp',
      code: 'HA',
      name: 'Huyết áp',
      value: latestBpRec ? latestBpRec.value : '--/--',
      unit: 'mmHg',
      codeBg: 'bg-sky-100',
      codeColor: 'text-sky-700',
    },
    {
      id: 'hr',
      code: 'NT',
      name: 'Nhịp tim',
      value: latestHrRec ? latestHrRec.value : '--',
      unit: 'bpm',
      codeBg: 'bg-rose-100',
      codeColor: 'text-rose-700',
    },
    {
      id: 'spo2',
      code: 'O2',
      name: 'SpO₂',
      value: latestSpo2Rec ? latestSpo2Rec.value : '--',
      unit: '%',
      codeBg: 'bg-cyan-100',
      codeColor: 'text-cyan-700',
    },
    {
      id: 'temp',
      code: 'T°',
      name: 'Nhiệt độ',
      value: latestTempRec ? latestTempRec.value.replace('.', ',') : '--',
      unit: '°C',
      codeBg: 'bg-amber-100',
      codeColor: 'text-amber-700',
    },
    {
      id: 'resp',
      code: 'NTh',
      name: 'Nhịp thở',
      value: latestRespRec ? latestRespRec.value : '--',
      unit: 'l/p',
      codeBg: 'bg-emerald-100',
      codeColor: 'text-emerald-700',
    },
    {
      id: 'bmi',
      code: 'BMI',
      name: 'BMI',
      value: latestBmiRec ? latestBmiRec.value.replace('.', ',') : '--',
      unit: 'kg/m²',
      codeBg: 'bg-amber-100',
      codeColor: 'text-amber-800',
    },
    {
      id: 'steps',
      code: 'BC',
      name: 'Bước chân',
      value: latestStepsRec ? latestStepsRec.value : '--',
      unit: 'bước',
      codeBg: 'bg-indigo-100',
      codeColor: 'text-indigo-700',
    },
    {
      id: 'sleep',
      code: 'GN',
      name: 'Giấc ngủ',
      value: latestSleepRec ? latestSleepRec.value : '--',
      unit: 'giờ',
      codeBg: 'bg-purple-100',
      codeColor: 'text-purple-700',
    },
  ];

  // Lọc lịch sử theo chỉ số đang chọn
  const filteredHistory = history.filter((h) => h.type === activeMetric);
  const activeMetricObj = metricsSummaries.find((m) => m.id === activeMetric) || metricsSummaries[0];

  return {
    activeMetric,
    setActiveMetric,
    history,
    filteredHistory,
    metricsSummaries,
    activeMetricObj,
    isEntrySheetOpen,
    openEntrySheet,
    closeEntrySheet,
    handleSaveBiometrics,
    successMsg,
    loading,
    fetchHistory,
  };
}
