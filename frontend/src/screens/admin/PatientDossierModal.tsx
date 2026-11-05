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
} from 'lucide-react';

interface PatientDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  userName?: string;
}

export const PatientDossierModal: React.FC<PatientDossierModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'biometrics' | 'prescriptions' | 'reports' | 'chronic' | 'family'>('overview');
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
                Toàn bộ dữ liệu lâm sàng, sinh trắc IoT, kết quả xét nghiệm & đơn thuốc điều trị
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
            { id: 'biometrics', label: 'Sinh Trắc Học IoT', icon: Heart, count: dossier?.biometrics?.length },
            { id: 'prescriptions', label: 'Đơn Thuốc & Tuân Thủ', icon: Pill, count: dossier?.prescriptions?.length },
            { id: 'reports', label: 'Xét Nghiệm & CĐHA', icon: FileText, count: dossier?.reports?.length },
            { id: 'chronic', label: 'Bệnh Mạn Tính & Lịch Hẹn', icon: Activity, count: dossier?.conditions?.length },
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

                  {/* Tóm tắt nhanh */}
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

              {/* TAB 2: SINH TRẮC HỌC IOT */}
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
                                {b.biometric_type === 'blood_pressure'
                                  ? 'Huyết Áp'
                                  : b.biometric_type === 'glucose'
                                  ? 'Đường Huyết'
                                  : b.biometric_type === 'spo2'
                                  ? 'SpO2'
                                  : b.biometric_type === 'heart_rate'
                                  ? 'Nhịp Tim'
                                  : b.biometric_type}
                              </td>
                              <td className="px-4 py-3 font-mono font-bold text-teal-700">
                                {b.biometric_type === 'blood_pressure' && `${b.systolic}/${b.diastolic} mmHg (Mạch: ${b.pulse_bpm || '--'})`}
                                {b.biometric_type === 'glucose' && `${b.glucose_value} mmol/L`}
                                {b.biometric_type === 'spo2' && `${b.spo2_percent}%`}
                                {b.biometric_type === 'heart_rate' && `${b.pulse_bpm} bpm`}
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

              {/* TAB 3: ĐƠN THUỐC & TUÂN THỦ */}
              {activeTab === 'prescriptions' && (
                <div className="space-y-4">
                  {dossier.prescriptions.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
                      Chưa có đơn thuốc điều trị nào được kê.
                    </div>
                  ) : (
                    dossier.prescriptions.map((p: any) => (
                      <div key={p.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs">Chẩn đoán: {p.diagnosis || 'Theo dõi huyết áp'}</h4>
                            <p className="text-[11px] text-slate-500">Bác sĩ kê: {p.doctor_name || 'Bác sĩ điều trị'}</p>
                          </div>
                          <span className="text-[11px] font-mono text-slate-500">
                            Ngày kê: {new Date(p.prescribed_date || p.created_at).toLocaleDateString('vi-VN')}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Danh mục thuốc đang dùng:</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {(p.items || []).filter(Boolean).map((item: any, idx: number) => (
                              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                <div className="font-bold text-slate-800">{item.medication_name}</div>
                                <div className="text-[11px] text-teal-700 font-medium">Liều dùng: {item.dosage_instructions}</div>
                                <div className="text-[10px] text-slate-500">Đường dùng: {item.route || 'Uống'}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 4: XÉT NGHIỆM & CĐHA */}
              {activeTab === 'reports' && (
                <div className="space-y-4">
                  {dossier.reports.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
                      Chưa có kết quả cận lâm sàng hoặc xét nghiệm nào.
                    </div>
                  ) : (
                    dossier.reports.map((r: any) => (
                      <div key={r.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div>
                            <span className="font-bold text-slate-900 text-xs">{r.report_title || r.title || 'Phiếu xét nghiệm'}</span>
                            <p className="text-[11px] text-slate-500">{r.facility_name || 'Bệnh viện đối tác'}</p>
                          </div>
                          <span className="text-[11px] font-mono text-slate-500">
                            {new Date(r.performed_at).toLocaleDateString('vi-VN')}
                          </span>
                        </div>

                        {/* Lab Results Table */}
                        {r.lab_results && r.lab_results.filter(Boolean).length > 0 && (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="text-[10px] text-slate-400 uppercase">
                                <tr>
                                  <th className="py-1">Chỉ Số Xét Nghiệm</th>
                                  <th className="py-1">Kết Quả</th>
                                  <th className="py-1">Đơn Vị</th>
                                  <th className="py-1">Khoảng Tham Chiếu</th>
                                  <th className="py-1">Đánh Giá</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {r.lab_results.filter(Boolean).map((l: any, lIdx: number) => (
                                  <tr key={lIdx}>
                                    <td className="py-1.5 font-medium text-slate-800">{l.test_name}</td>
                                    <td className="py-1.5 font-mono font-bold text-teal-700">{l.numeric_value || l.value_text}</td>
                                    <td className="py-1.5 text-slate-500">{l.unit}</td>
                                    <td className="py-1.5 font-mono text-slate-500">{l.reference_range}</td>
                                    <td className="py-1.5">
                                      {l.abnormal_flag === 'high' ? (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                                          Cao ↑
                                        </span>
                                      ) : l.abnormal_flag === 'low' ? (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                                          Thấp ↓
                                        </span>
                                      ) : (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                                          Bình thường
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
                    ))
                  )}
                </div>
              )}

              {/* TAB 5: BỆNH MẠN TÍNH & LỊCH HẸN */}
              {activeTab === 'chronic' && (
                <div className="space-y-4">
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
