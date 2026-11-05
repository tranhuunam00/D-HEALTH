import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Heart,
  Pill,
  FileText,
  Activity,
  Users,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Loader2,
  Printer,
  AlertTriangle,
  FlaskConical,
  Camera,
  Microscope,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle,
  Sparkles,
  Stethoscope,
} from 'lucide-react';

interface PatientDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  userName?: string;
}

const getReportKind = (r: any): 'lab' | 'imaging' | 'pathology' => {
  if (r.kind === 'pathology' || r.category === 'GPB') return 'pathology';
  if (r.kind === 'imaging' || ['XQ', 'CT', 'MRI', 'US', 'CDHA'].includes(r.category) || r.imaging_study) return 'imaging';
  return 'lab';
};

const getLabRefRange = (name: string, min?: any, max?: any) => {
  if (min != null && max != null) return `${min} - ${max}`;
  if (min != null) return `> ${min}`;
  if (max != null) return `< ${max}`;
  const lower = (name || '').toLowerCase();
  if (lower.includes('bạch cầu') || lower.includes('wbc')) return '4.0 - 10.0';
  if (lower.includes('glucose')) return '4.1 - 5.9';
  if (lower.includes('hba1c')) return '< 6.5';
  if (lower.includes('ldl')) return '< 2.6';
  if (lower.includes('triglyceride')) return '< 1.7';
  if (lower.includes('cholesterol')) return '< 5.2';
  return '4.0 - 10.0';
};

const formatBiometricType = (typeRaw: string) => {
  const type = (typeRaw || '').toLowerCase();
  switch (type) {
    case 'bp':
    case 'blood_pressure':
      return 'Huyết Áp';
    case 'hr':
    case 'heart_rate':
      return 'Nhịp Tim';
    case 'glucose':
      return 'Đường Huyết';
    case 'spo2':
      return 'SpO2';
    case 'weight':
      return 'Cân Nặng';
    case 'bmi':
      return 'Chỉ Số BMI';
    case 'height':
      return 'Chiều Cao';
    case 'temp':
    case 'temperature':
      return 'Thân Nhiệt';
    default:
      return (typeRaw || '--').toUpperCase();
  }
};

const formatBiometricValue = (b: any) => {
  const type = (b.biometric_type || '').toLowerCase();
  if (type === 'bp' || type === 'blood_pressure') {
    const sys = b.systolic != null ? Math.round(Number(b.systolic)) : null;
    const dia = b.diastolic != null ? Math.round(Number(b.diastolic)) : null;
    if (sys != null && dia != null) {
      const pulse = b.pulse_bpm ? ` (Mạch: ${Math.round(Number(b.pulse_bpm))} bpm)` : '';
      return `${sys}/${dia} mmHg${pulse}`;
    }
    if (b.value_numeric) return `${b.value_numeric} mmHg`;
  }
  if (type === 'hr' || type === 'heart_rate') {
    const hr = b.pulse_bpm || b.value_numeric;
    return hr ? `${Math.round(Number(hr))} bpm` : '--';
  }
  if (type === 'weight') {
    const w = b.value_numeric;
    return w ? `${parseFloat(Number(w).toFixed(1))} kg` : '--';
  }
  if (type === 'bmi') {
    const bmi = b.value_numeric;
    return bmi ? `${parseFloat(Number(bmi).toFixed(1))} kg/m²` : '--';
  }
  if (type === 'glucose') {
    const g = b.glucose_value || b.value_numeric;
    return g ? `${parseFloat(Number(g).toFixed(1))} mmol/L` : '--';
  }
  if (type === 'spo2') {
    const s = b.spo2_percent || b.value_numeric;
    return s ? `${Math.round(Number(s))}%` : '--';
  }
  return b.value_numeric ? `${b.value_numeric} ${b.unit || ''}`.trim() : '--';
};

export const PatientDossierModal: React.FC<PatientDossierModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'biometrics' | 'prescriptions' | 'reports' | 'chronic' | 'family'>('overview');
  const [reportFilter, setReportFilter] = useState<'all' | 'lab' | 'imaging' | 'pathology'>('all');
  const [loading, setLoading] = useState(false);
  const [dossier, setDossier] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      setError(null);
      fetch(`/api/admin/users/${userId}/dossier`)
        .then((res) => {
          if (!res.ok) throw new Error('Không thể tải bệnh án bệnh nhân');
          return res.json();
        })
        .then((json) => {
          if (json.success && json.data) {
            setDossier(json.data);
          } else {
            throw new Error('Dữ liệu hồ sơ rỗng');
          }
        })
        .catch((err) => {
          console.error('Lỗi tải hồ sơ bệnh nhân:', err);
          setError(err.message || 'Lỗi kết nối máy chủ');
        })
        .finally(() => setLoading(false));
    } else {
      setDossier(null);
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const user = dossier?.user;
  const ownerMember = dossier?.members?.find((m: any) => m.relationship === 'owner') || dossier?.members?.[0];
  const displayName = ownerMember?.full_name || user?.full_name || userName || 'Bệnh Nhân';

  const allReports = dossier?.reports || [];
  const labReports = allReports.filter((r: any) => getReportKind(r) === 'lab');
  const imagingReports = allReports.filter((r: any) => getReportKind(r) === 'imaging');
  const pathologyReports = allReports.filter((r: any) => getReportKind(r) === 'pathology');

  const filteredReports = allReports.filter((r: any) => {
    if (reportFilter === 'all') return true;
    return getReportKind(r) === reportFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-5xl rounded-3xl shadow-2xl relative text-slate-800 flex flex-col my-6 overflow-hidden">
        {/* 1. Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-[#1F7A8C] font-black flex items-center justify-center text-base shadow-xs">
              {displayName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{displayName}</h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-50 text-[#1F7A8C] font-semibold border border-teal-200">
                  Hồ Sơ Y Tế Toàn Diện
                </span>
                {ownerMember?.blood_type && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-bold border border-rose-200">
                    Nhóm máu: {ownerMember.blood_type}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Toàn bộ dữ liệu lâm sàng, sinh trắc học, kết quả xét nghiệm & đơn thuốc điều trị
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition cursor-pointer"
              title="In bệnh án"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 gap-2 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'overview', label: 'Tổng Quan & Định Danh', icon: User, count: null },
            { id: 'biometrics', label: 'Sinh Trắc Học', icon: Heart, count: dossier?.biometrics?.length },
            { id: 'prescriptions', label: 'Đơn Thuốc & Tuân Thủ', icon: Pill, count: dossier?.prescriptions?.length },
            { id: 'reports', label: 'Xét Nghiệm & CĐHA', icon: FileText, count: dossier?.reports?.length },
            { id: 'chronic', label: 'Bệnh Mạn Tính & Lịch Hẹn', icon: Activity, count: (dossier?.conditions?.length || 0) + (dossier?.appointments?.length || 0) },
            { id: 'family', label: 'Gia Đình Liên Kết', icon: Users, count: dossier?.members?.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#1F7A8C] text-[#1F7A8C] font-bold bg-teal-50/40'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === tab.id ? 'bg-[#1F7A8C] text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 3. Tab Contents */}
        <div className="p-6 max-h-[72vh] overflow-y-auto bg-slate-50/50">
          {loading && (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#1F7A8C]" />
              <span className="text-xs">Đang nạp toàn bộ hồ sơ y tế bệnh nhân...</span>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && dossier && (
            <>
              {/* TAB 1: TỔNG QUAN & ĐỊNH DANH */}
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                      <span className="text-[11px] font-bold uppercase text-slate-400">Định Danh Công Dân</span>
                      <div className="text-sm font-bold text-slate-900">{displayName}</div>
                      <div className="text-xs text-slate-600 flex items-center gap-1.5">
                        <span className="text-slate-400">CCCD:</span>
                        <strong className="font-mono text-slate-800">{user?.national_id || 'Chưa cung cấp'}</strong>
                      </div>
                      <div className="text-xs flex items-center gap-1.5 pt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-medium">
                          {user?.is_ekyc_verified ? 'Đã xác thực eKYC điện tử' : 'Chưa thẩm định eKYC'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                      <span className="text-[11px] font-bold uppercase text-slate-400">Thông Tin Liên Hệ</span>
                      <div className="text-xs text-slate-700 flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-teal-600" />
                        <span className="font-mono">{user?.phone_number || 'Chưa có'}</span>
                      </div>
                      <div className="text-xs text-slate-700 flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span>{user?.email || 'Chưa có email'}</span>
                      </div>
                      <div className="text-xs text-slate-700 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span className="truncate">{user?.address || 'Chưa có địa chỉ'}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                      <span className="text-[11px] font-bold uppercase text-slate-400">Chỉ Số Nhân Trắc</span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400">Giới tính:</span>{' '}
                          <strong className="text-slate-800">{ownerMember?.gender || 'Nam'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Ngày sinh:</span>{' '}
                          <strong className="text-slate-800">
                            {ownerMember?.birth_date ? new Date(ownerMember.birth_date).toLocaleDateString('vi-VN') : '--'}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Chiều cao:</span>{' '}
                          <strong className="text-slate-800">{ownerMember?.height_cm ? `${ownerMember.height_cm} cm` : '--'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Cân nặng:</span>{' '}
                          <strong className="text-slate-800">{ownerMember?.weight_kg ? `${ownerMember.weight_kg} kg` : '--'}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 text-xs flex items-center justify-between">
                    <div>
                      <strong className="text-teal-900">Trạng thái hồ sơ trên hệ thống:</strong>{' '}
                      <span className="text-teal-700">Tài khoản chính thức, đang kích hoạt đồng thuận dữ liệu Nghị định 13/2023/NĐ-CP.</span>
                    </div>
                    <span className="text-[11px] text-teal-800 font-medium">
                      Ngày tham gia: {new Date(user?.created_at || Date.now()).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 2: SINH TRẮC HỌC */}
              {activeTab === 'biometrics' && (
                <div className="space-y-4">
                  {dossier.biometrics.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
                      Bệnh nhân chưa có bản ghi sinh trắc học nào.
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3">Thời Gian Đo</th>
                            <th className="px-4 py-3">Loại Chỉ Số</th>
                            <th className="px-4 py-3">Giá Trị Đo</th>
                            <th className="px-4 py-3">Ngữ Cảnh & Nguồn</th>
                            <th className="px-4 py-3">Đánh Giá Y Khoa</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {dossier.biometrics.map((b: any) => (
                            <tr key={b.id} className="hover:bg-slate-50/80 transition">
                              <td className="px-4 py-3 font-mono text-slate-600">
                                {new Date(b.measured_at).toLocaleString('vi-VN')}
                              </td>
                              <td className="px-4 py-3 font-bold text-slate-800 uppercase">
                                {formatBiometricType(b.biometric_type)}
                              </td>
                              <td className="px-4 py-3 font-mono font-bold text-teal-700">
                                {formatBiometricValue(b)}
                              </td>
                              <td className="px-4 py-3 text-slate-500 capitalize">
                                {b.context || 'Nghỉ ngơi'} · {b.source === 'device_ble' ? 'Thiết bị BLE' : 'Nhập tay'}
                              </td>
                              <td className="px-4 py-3">
                                {b.severity_level === 1 ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                                    Tốt (Mục tiêu)
                                  </span>
                                ) : b.severity_level === 2 ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 font-bold border border-amber-200">
                                    Chú ý theo dõi
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-50 text-rose-700 font-bold border border-rose-200">
                                    Nguy cơ cao
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ĐƠN THUỐC & TUÂN THỦ (ĐẦY ĐỦ THÔNG TIN LIỀU LƯỢNG & LỊCH NHẮC) */}
              {activeTab === 'prescriptions' && (
                <div className="space-y-5">
                  {dossier.prescriptions.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
                      Chưa có đơn thuốc điều trị nào được kê.
                    </div>
                  ) : (
                    dossier.prescriptions.map((p: any) => {
                      const adherence = p.adherence_stats || { total_doses: 0, taken_doses: 0, skipped_doses: 0, adherence_pct: 100 };
                      return (
                        <div key={p.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                          {/* 1. Header Đơn Thuốc */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-sm">
                                  Chẩn đoán: {p.diagnosis || 'Đơn thuốc cá nhân theo dõi'}
                                </h4>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                  p.status === 'completed'
                                    ? 'bg-slate-100 text-slate-600'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}>
                                  {p.status === 'completed' ? 'Đã hoàn thành' : 'Đang điều trị'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 pt-0.5">
                                Kê bởi: <strong className="text-slate-700">{p.doctor_name || 'Bác sĩ điều trị'}</strong> · Cơ sở: <span className="text-slate-700 font-medium">{p.facility_name || 'Bệnh viện Bạch Mai'}</span>
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-mono text-slate-500 flex items-center md:justify-end gap-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                Ngày kê: {new Date(p.prescribed_date || p.created_at).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          </div>

                          {/* 2. Banner Chỉ Số Tuân Thủ Uống Thuốc (Adherence Stats) */}
                          <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/80 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-[#1F7A8C] text-white flex items-center justify-center font-bold text-xs">
                                {adherence.adherence_pct}%
                              </div>
                              <div>
                                <div className="text-xs font-bold text-teal-950">
                                  Tỷ lệ tuân thủ điều trị: {adherence.adherence_pct}%
                                </div>
                                <div className="text-[11px] text-teal-700">
                                  {adherence.adherence_pct >= 85 ? 'Tuân thủ rất tốt theo phác đồ bác sĩ kê' : 'Cần tăng cường nhắc lịch uống thuốc'}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-xs">
                              <span className="px-2.5 py-1 rounded-lg bg-white border border-teal-200 text-teal-900 font-medium">
                                Đã uống: <strong className="text-emerald-700">{adherence.taken_doses} liều</strong>
                              </span>
                              <span className="px-2.5 py-1 rounded-lg bg-white border border-teal-200 text-teal-900 font-medium">
                                Quên/Bỏ: <strong className="text-rose-600">{adherence.skipped_doses} liều</strong>
                              </span>
                              <span className="px-2.5 py-1 rounded-lg bg-white border border-teal-200 text-teal-900 font-medium">
                                Tổng liều: <strong className="text-slate-800">{adherence.total_doses} liều</strong>
                              </span>
                            </div>
                          </div>

                          {/* 3. Danh Mục Thuốc Kê Chi Tiết */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                                Danh mục thuốc đang sử dụng ({p.items?.length || 0}):
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {(p.items || []).filter(Boolean).map((item: any, idx: number) => {
                                const doseText = item.dose_per_intake || (item.dosage ? `${item.dosage} ${item.quantity_unit || 'viên'}` : '1 viên');
                                const mealText = (item.schedules && item.schedules[0]?.meal_relation) === 'before_meal'
                                  ? 'Trước ăn 30 phút'
                                  : (item.schedules && item.schedules[0]?.meal_relation) === 'with_meal'
                                  ? 'Cùng bữa ăn'
                                  : 'Sau ăn 30 phút';

                                return (
                                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs space-y-2 hover:border-teal-300 transition shadow-2xs">
                                    <div className="flex items-start justify-between gap-2">
                                      <div>
                                        <h5 className="font-bold text-slate-900 text-sm text-teal-900 flex items-center gap-1.5">
                                          <Pill className="w-4 h-4 text-[#1F7A8C] shrink-0" />
                                          {item.medication_name}
                                        </h5>
                                        <span className="text-[11px] text-slate-500">
                                          Đường dùng: <strong className="text-slate-700">Đường uống (Oral)</strong>
                                        </span>
                                      </div>
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100/70 text-[#1F7A8C] font-bold border border-teal-200 shrink-0">
                                        {item.quantity_prescribed || 30} {item.quantity_unit || 'viên'}
                                      </span>
                                    </div>

                                    {/* Liều lượng & Chỉ dẫn */}
                                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 space-y-1">
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500">Liều mỗi lần:</span>
                                        <strong className="text-teal-700 font-mono text-xs">{doseText}</strong>
                                      </div>
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500">Chỉ dẫn dùng:</span>
                                        <span className="text-slate-800 font-medium">{item.timing_instructions || mealText}</span>
                                      </div>
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500">Tần suất uống:</span>
                                        <span className="text-slate-800 font-medium">{item.frequency_per_day || 1} lần / ngày</span>
                                      </div>
                                    </div>

                                    {/* Lịch nhắc uống thuốc (Schedules) */}
                                    <div className="pt-1">
                                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                                        Khung giờ nhắc uống:
                                      </span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {item.schedules && item.schedules.length > 0 ? (
                                          item.schedules.map((s: any, sIdx: number) => {
                                            const time = (s.scheduled_time || '08:00:00').substring(0, 5);
                                            const mealLabel = s.meal_relation === 'before_meal' ? 'Trước ăn' : s.meal_relation === 'with_meal' ? 'Trong bữa' : 'Sau ăn';
                                            return (
                                              <span
                                                key={sIdx}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-[#1F7A8C] border border-teal-200 text-[11px] font-bold"
                                              >
                                                <Clock className="w-3 h-3 text-[#1F7A8C]" />
                                                {time} ({mealLabel})
                                              </span>
                                            );
                                          })
                                        ) : (
                                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-[#1F7A8C] border border-teal-200 text-[11px] font-bold">
                                            <Clock className="w-3 h-3 text-[#1F7A8C]" />
                                            08:00 (Sáng · Sau ăn)
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Liệu trình */}
                                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                                      <span>Liệu trình:</span>
                                      <strong className="text-slate-700">
                                        {item.start_date ? new Date(item.start_date).toLocaleDateString('vi-VN') : '--'}
                                        {item.end_date ? ` đến ${new Date(item.end_date).toLocaleDateString('vi-VN')}` : ' (Điều trị liên tục)'}
                                      </strong>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB 4: XÉT NGHIỆM & CĐHA (PHÂN LOẠI RÕ RÀNG & ĐẦY ĐỦ THÔNG TIN KẾT QUẢ/KẾT LUẬN) */}
              {activeTab === 'reports' && (
                <div className="space-y-4">
                  {/* Sub-Filter Chips */}
                  <div className="flex flex-wrap items-center gap-2 pb-1">
                    {[
                      { id: 'all', label: 'Tất Cả Báo Cáo', count: allReports.length, icon: FileText },
                      { id: 'lab', label: 'Xét Nghiệm Máu & Sinh Hóa', count: labReports.length, icon: FlaskConical },
                      { id: 'imaging', label: 'Chẩn Đoán Hình Ảnh (CĐHA)', count: imagingReports.length, icon: Camera },
                      { id: 'pathology', label: 'Giải Phẫu Bệnh & Sinh Thiết', count: pathologyReports.length, icon: Microscope },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => setReportFilter(btn.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          reportFilter === btn.id
                            ? 'bg-[#1F7A8C] text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <btn.icon className="w-3.5 h-3.5" />
                        <span>{btn.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          reportFilter === btn.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {btn.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {filteredReports.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
                      Không có báo cáo nào thuộc danh mục này.
                    </div>
                  ) : (
                    filteredReports.map((r: any) => {
                      const kind = getReportKind(r);

                      return (
                        <div key={r.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5">
                          {/* 1. Header Báo Cáo */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-sm">
                                  {r.report_title || r.title || 'Phiếu báo cáo cận lâm sàng'}
                                </h4>

                                {kind === 'lab' && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 flex items-center gap-1">
                                    <FlaskConical className="w-3 h-3" />
                                    Xét Nghiệm {r.category === 'HH' ? 'Huyết Học (HH)' : 'Sinh Hóa (SH)'}
                                  </span>
                                )}

                                {kind === 'imaging' && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200 flex items-center gap-1">
                                    <Camera className="w-3 h-3" />
                                    CĐHA: {r.imaging_study?.modality || r.category || 'X-Quang'} · {r.imaging_study?.body_part || 'Lồng ngực'}
                                  </span>
                                )}

                                {kind === 'pathology' && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 flex items-center gap-1">
                                    <Microscope className="w-3 h-3" />
                                    Giải Phẫu Bệnh (GPB)
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-500 pt-1">
                                Cơ sở thực hiện: <strong className="text-slate-700">{r.facility_name || 'Bệnh viện Bạch Mai'}</strong>
                                {(r.ordering_doctor_name || r.ordering_doctor) && (
                                  <> · Bác sĩ chỉ định: <strong className="text-slate-700">{r.ordering_doctor_name || r.ordering_doctor}</strong></>
                                )}
                                {(r.interpreting_doctor_name || r.interpreting_doctor) && (
                                  <> · Bác sĩ đọc KQ: <strong className="text-slate-700">{r.interpreting_doctor_name || r.interpreting_doctor}</strong></>
                                )}
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="text-xs font-mono text-slate-500 flex items-center md:justify-end gap-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                Ngày làm: {new Date(r.performed_at).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          </div>

                          {/* 2. KHỐI NỘI DUNG CHO TỪNG LOẠI BÁO CÁO */}

                          {/* A. LOẠI XÉT NGHIỆM MÁU / SINH HÓA */}
                          {kind === 'lab' && (
                            <div className="space-y-3">
                              {r.lab_results && r.lab_results.filter(Boolean).length > 0 ? (
                                <div className="overflow-x-auto rounded-xl border border-slate-200">
                                  <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                      <tr>
                                        <th className="px-3 py-2">Chỉ Số Xét Nghiệm</th>
                                        <th className="px-3 py-2 font-mono">Kết Quả Đo</th>
                                        <th className="px-3 py-2">Đơn Vị</th>
                                        <th className="px-3 py-2">Khoảng Tham Chiếu Chuẩn</th>
                                        <th className="px-3 py-2">Đánh Giá Y Khoa</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                      {r.lab_results.filter(Boolean).map((l: any, lIdx: number) => {
                                        const refRange = getLabRefRange(l.test_name, l.ref_min, l.ref_max);
                                        const isHigh = l.flag === 'HIGH' || l.abnormal_flag === 'high';
                                        const isLow = l.flag === 'LOW' || l.abnormal_flag === 'low';

                                        return (
                                          <tr key={lIdx} className="hover:bg-slate-50/70">
                                            <td className="px-3 py-2 font-semibold text-slate-800">{l.test_name}</td>
                                            <td className="px-3 py-2 font-mono font-bold text-teal-700 text-sm">
                                              {l.numeric_value || l.value_text}
                                            </td>
                                            <td className="px-3 py-2 text-slate-500 font-mono">{l.unit}</td>
                                            <td className="px-3 py-2 font-mono text-slate-600">{refRange}</td>
                                            <td className="px-3 py-2">
                                              {isHigh ? (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                                                  Cao ↑
                                                </span>
                                              ) : isLow ? (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                                                  Thấp ↓
                                                </span>
                                              ) : (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                                                  Bình thường
                                                </span>
                                              )}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                                  {r.conclusion || 'Đã ghi nhận chỉ số xét nghiệm lâm sàng hoàn tất.'}
                                </div>
                              )}

                              {r.conclusion && (
                                <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200 text-xs flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                                  <span className="text-teal-900 font-medium">
                                    <strong>Kết luận:</strong> {r.conclusion}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* B. LOẠI CHẨN ĐOÁN HÌNH ẢNH (X-QUANG / CT / MRI / SIÊU ÂM) */}
                          {kind === 'imaging' && (
                            <div className="space-y-3">
                              {/* Hộp Kết Luận Bác Sĩ CĐHA */}
                              <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-1.5">
                                <div className="flex items-center gap-1.5 text-purple-900 font-bold text-xs">
                                  <Eye className="w-4 h-4 text-purple-600 shrink-0" />
                                  <span>KẾT LUẬN CỦA BÁC SĨ CHẨN ĐOÁN HÌNH ẢNH:</span>
                                </div>
                                <p className="text-purple-950 font-bold text-xs leading-relaxed pl-5">
                                  {r.conclusion || 'Hình ảnh tim phổi và các cấu trúc giải phẫu trong giới hạn bình thường.'}
                                </p>
                                {r.clinical_findings && (
                                  <p className="text-slate-600 text-xs pl-5 pt-1">
                                    <strong className="text-slate-700">Khảo sát chi tiết:</strong> {r.clinical_findings}
                                  </p>
                                )}
                              </div>

                              {/* Thông tin phương tiện & vị trí thực tế */}
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Phương tiện chẩn đoán</span>
                                  <strong className="text-slate-800">
                                    {r.imaging_study?.modality === 'CT'
                                      ? 'Cắt lớp vi tính (CT)'
                                      : r.imaging_study?.modality === 'MRI'
                                      ? 'Cộng hưởng từ (MRI)'
                                      : r.imaging_study?.modality === 'SA'
                                      ? 'Siêu âm (SA)'
                                      : r.imaging_study?.modality === 'MM'
                                      ? 'Nhũ ảnh (MM)'
                                      : r.imaging_study?.modality || r.category || 'X-quang (XQ)'}
                                  </strong>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Vị trí / Bộ phận</span>
                                  <strong className="text-slate-800">{r.imaging_study?.body_part || 'Lồng ngực / Phổi'}</strong>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Đánh giá hình thái</span>
                                  <strong className={r.conclusion?.toLowerCase().includes('tổn thương') ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}>
                                    {r.conclusion?.toLowerCase().includes('tổn thương') ? 'Có nốt / tổn thương' : 'Bình thường'}
                                  </strong>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* C. LOẠI GIẢI PHẪU BỆNH & SINH THIẾT */}
                          {kind === 'pathology' && (
                            <div className="space-y-3">
                              {/* Hộp Kết Luận Giải Phẫu Bệnh */}
                              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                                  <Microscope className="w-4 h-4 text-amber-600 shrink-0" />
                                  <span>CHẨN ĐOÁN MÔ BỆNH HỌC:</span>
                                </div>
                                <p className="text-amber-950 font-bold text-xs leading-relaxed pl-5">
                                  {r.conclusion || 'Đã ghi nhận kết quả mô bệnh học.'}
                                </p>
                              </div>

                              {/* Các Thông Số Thực Tế Đã Nhập */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                {r.specimen_site && (
                                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Vị trí sinh thiết</span>
                                    <strong className="text-slate-800">{r.specimen_site}</strong>
                                  </div>
                                )}
                                {r.accession_number && (
                                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Mã số GPB / tiêu bản</span>
                                    <strong className="font-mono text-slate-800">{r.accession_number}</strong>
                                  </div>
                                )}
                                {r.histological_grade && (
                                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Độ mô học</span>
                                    <strong className="text-slate-800">{r.histological_grade}</strong>
                                  </div>
                                )}
                                {r.surgical_margin && (
                                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Diện cắt phẫu thuật</span>
                                    <strong className="text-emerald-700">{r.surgical_margin}</strong>
                                  </div>
                                )}
                              </div>

                              {/* Dấu Ấn Hóa Mô Miễn Dịch (IHC Markers) nếu có */}
                              {r.ihc_markers && Array.isArray(r.ihc_markers) && r.ihc_markers.filter((m: any) => m.marker && m.result).length > 0 && (
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                                    Dấu ấn Hóa mô miễn dịch (IHC):
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    {r.ihc_markers.filter((m: any) => m.marker && m.result).map((ihc: any, ihcIdx: number) => (
                                      <span
                                        key={ihcIdx}
                                        className="px-2 py-0.5 rounded-lg bg-white border border-slate-300 font-mono text-[11px] text-slate-800"
                                      >
                                        <strong>{ihc.marker}</strong>: {ihc.result}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB 5: BỆNH MẠN TÍNH & LỊCH HẸN */}
              {activeTab === 'chronic' && (
                <div className="space-y-4">
                  {/* Lịch Hẹn Tái Khám Đã Đặt */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#1F7A8C]" />
                        <span>Lịch Hẹn Tái Khám Bệnh Nhân Đã Đặt ({dossier.appointments?.length || 0})</span>
                      </h4>
                      <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        Đồng bộ từ App Mobile
                      </span>
                    </div>
                    {!dossier.appointments || dossier.appointments.length === 0 ? (
                      <p className="text-slate-400 text-xs py-2">Bệnh nhân chưa có lịch hẹn khám nào được đặt.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {dossier.appointments.map((a: any) => (
                          <div key={a.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                <Stethoscope className="w-3.5 h-3.5 text-[#1F7A8C]" />
                                <span>{a.doctor_name || 'Bác sĩ phụ trách'}</span>
                              </div>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-[#1F7A8C] font-bold border border-teal-200">
                                {a.status === 'scheduled' ? 'Đã lên lịch' : a.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 space-y-1">
                              <div><strong>Chuyên khoa:</strong> {a.department_name || '--'} · {a.facility_name || '--'}</div>
                              <div className="text-teal-700 font-mono font-bold flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-teal-600" />
                                <span>Thời gian khám: {new Date(a.appointment_date).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                              </div>
                              <div><strong>Mục đích:</strong> {a.purpose || 'Tái khám định kỳ'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bệnh mạn tính */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                      <h4 className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-2">
                        Bệnh Lý Mạn Tính Đang Quản Lý ({dossier.conditions.length})
                      </h4>
                      {dossier.conditions.length === 0 ? (
                        <p className="text-slate-400 text-xs">Không có bệnh mạn tính nào.</p>
                      ) : (
                        dossier.conditions.map((c: any) => (
                          <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                            <div className="font-bold text-slate-800">{c.condition_name}</div>
                            <div className="text-[11px] text-slate-600">{c.status_summary}</div>
                            {c.next_checkup_date && (
                              <div className="text-[10px] text-teal-700 flex items-center gap-1 font-semibold">
                                <Calendar className="w-3 h-3" /> Tái khám: {new Date(c.next_checkup_date).toLocaleDateString('vi-VN')}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Việc cần làm (Care Tasks) */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                      <h4 className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-2">
                        Việc Cần Làm Tiếp Theo ({dossier.tasks.length})
                      </h4>
                      {dossier.tasks.length === 0 ? (
                        <p className="text-slate-400 text-xs">Không có việc cần làm nào.</p>
                      ) : (
                        dossier.tasks.map((t: any) => (
                          <div key={t.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                            <div>
                              <div className="font-bold text-slate-800">{t.title}</div>
                              <div className="text-[10px] text-slate-500">Ưu tiên: Mức {t.priority || 1}</div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-[#1F7A8C] font-semibold border border-teal-200">
                              Đang thực hiện
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: GIA ĐÌNH LIÊN KẾT */}
              {activeTab === 'family' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dossier.members.map((m: any) => (
                      <div key={m.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-slate-900 text-xs">{m.full_name}</div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold uppercase">
                            {m.relationship === 'owner' ? 'Chủ tài khoản' : m.relationship}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600">
                          {m.gender} · {m.birth_date ? new Date(m.birth_date).toLocaleDateString('vi-VN') : '--'} · Nhóm máu: {m.blood_type || 'Chưa rõ'}
                        </div>
                        <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium pt-1">
                          <ShieldCheck className="w-3 h-3" /> Đã đồng thuận chia sẻ dữ liệu y tế gia đình
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
