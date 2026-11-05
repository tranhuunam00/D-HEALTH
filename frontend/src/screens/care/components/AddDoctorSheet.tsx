import React, { useState, useEffect, useMemo } from 'react';
import { Search, Stethoscope, Building2, Phone, Mail, Check, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
import { BottomSheet } from '../../../components/organisms/BottomSheet';
import { Input } from '../../../components/atoms/Input';
import { Button } from '../../../components/atoms/Button';

export interface MasterDoctor {
  id: string;
  full_name: string;
  academic_title?: string;
  phone_number?: string;
  email?: string;
  department_id?: string;
  department_name?: string;
  facility_name?: string;
}

export interface MasterDepartment {
  id: string;
  code: string;
  name: string;
}

interface AddDoctorSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  onSubmit: (data: {
    doctorId?: string;
    doctorName: string;
    specialty: string;
    hospital: string;
    phone: string;
    email: string;
  }) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  tim_mach: { bg: 'bg-[#FCE7F3]', text: 'text-[#BE185D]' },
  cdha: { bg: 'bg-[#EDE9FE]', text: 'text-[#6D28D9]' },
  noi_tiet: { bg: 'bg-[#CCFBF1]', text: 'text-[#0F766E]' },
  ung_buou: { bg: 'bg-[#FEE2E2]', text: 'text-[#B91C1C]' },
  y_hoc_gia_dinh: { bg: 'bg-[#E0F2FE]', text: 'text-[#0369A1]' },
};

export const AddDoctorSheet: React.FC<AddDoctorSheetProps> = ({
  isOpen,
  onClose,
  initialCategory,
  onSubmit,
}) => {
  const [departments, setDepartments] = useState<MasterDepartment[]>([]);
  const [doctors, setDoctors] = useState<MasterDoctor[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);

  // Manual Form State
  const [manualName, setManualName] = useState('');
  const [manualSpecialty, setManualSpecialty] = useState('Tim mạch');
  const [manualHospital, setManualHospital] = useState('Bệnh viện đối tác');
  const [manualPhone, setManualPhone] = useState('0912 345 678');
  const [manualEmail, setManualEmail] = useState('bacsi@dhealth.vn');

  // Fetch departments & doctors when sheet opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const baseUrl = typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null')
          ? window.location.origin
          : 'http://localhost';

        const [deptRes, docRes] = await Promise.all([
          fetch(`${baseUrl}/api/departments`),
          fetch(`${baseUrl}/api/doctors`),
        ]);

        if (deptRes.ok) {
          const deptJson = await deptRes.json();
          if (Array.isArray(deptJson.data)) {
            setDepartments(deptJson.data);
          }
        }

        if (docRes.ok) {
          const docJson = await docRes.json();
          if (Array.isArray(docJson.data)) {
            setDoctors(docJson.data);
          }
        }
      } catch (err) {
        console.error('Lỗi tải danh mục bác sĩ:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  // Set initial category if matching
  useEffect(() => {
    if (initialCategory && departments.length > 0) {
      const match = departments.find(
        (d) =>
          d.name.toLowerCase().includes(initialCategory.toLowerCase()) ||
          initialCategory.toLowerCase().includes(d.name.toLowerCase())
      );
      if (match) {
        setSelectedDeptId(match.id);
      }
    }
  }, [initialCategory, departments]);

  // Filter doctors by category chip and search query
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchCategory =
        selectedDeptId === 'all' || doc.department_id === selectedDeptId;

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        doc.full_name.toLowerCase().includes(q) ||
        (doc.academic_title && doc.academic_title.toLowerCase().includes(q)) ||
        (doc.department_name && doc.department_name.toLowerCase().includes(q)) ||
        (doc.facility_name && doc.facility_name.toLowerCase().includes(q));

      return matchCategory && matchQuery;
    });
  }, [doctors, selectedDeptId, searchQuery]);

  const handleSelectDoctor = (doc: MasterDoctor) => {
    const fullNameWithTitle = `${doc.academic_title ? doc.academic_title + ' ' : ''}${doc.full_name}`;
    onSubmit({
      doctorId: doc.id,
      doctorName: fullNameWithTitle,
      specialty: doc.department_name || 'Bác sĩ chuyên khoa',
      hospital: doc.facility_name || 'Cơ sở y tế',
      phone: doc.phone_number || '',
      email: doc.email || '',
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;
    onSubmit({
      doctorName: manualName.trim(),
      specialty: manualSpecialty,
      hospital: manualHospital,
      phone: manualPhone,
      email: manualEmail,
    });
    setManualName('');
  };

  const getDocInitials = (doc: MasterDoctor) => {
    const words = doc.full_name.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[words.length - 2][0]}${words[words.length - 1][0]}`.toUpperCase();
    }
    return doc.full_name.slice(0, 2).toUpperCase();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Chọn Bác Sĩ Chăm Sóc">
      <div className="space-y-3.5 pb-3">
        {/* Subtitle */}
        <p className="text-xs text-slate-500 font-medium">
          Chọn bác sĩ từ danh mục chuyên khoa hệ thống do Admin quản lý để thêm vào Care Team của bạn.
        </p>

        {/* 1. Category Filter Chips (Horizontal Carousel) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar -mx-1 px-1">
          <button
            type="button"
            onClick={() => setSelectedDeptId('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
              selectedDeptId === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả
          </button>
          {departments.map((dept) => {
            const isSelected = selectedDeptId === dept.id;
            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => setSelectedDeptId(dept.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
                  isSelected
                    ? 'bg-[#1F7A8C] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept.name.replace('Khoa ', '')}
              </button>
            );
          })}
        </div>

        {/* 2. Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên bác sĩ, bệnh viện..."
            className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1F7A8C]/20 focus:border-[#1F7A8C]"
          />
        </div>

        {/* 3. Doctors List */}
        <div className="max-h-[300px] overflow-y-auto space-y-2.5 pr-0.5">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Đang tải danh sách bác sĩ...
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl p-4">
              Không tìm thấy bác sĩ nào trong chuyên khoa này.
            </div>
          ) : (
            filteredDoctors.map((doc) => {
              const colorConfig = CATEGORY_COLORS[doc.department_id || ''] || {
                bg: 'bg-slate-100',
                text: 'text-slate-700',
              };
              const initials = getDocInitials(doc);
              const fullNameWithTitle = `${doc.academic_title ? doc.academic_title + ' ' : ''}${doc.full_name}`;

              return (
                <div
                  key={doc.id}
                  className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#1F7A8C]/50 transition flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-full ${colorConfig.bg} ${colorConfig.text} font-black text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-extrabold text-slate-900 truncate">
                          {fullNameWithTitle}
                        </h4>
                        {doc.department_name && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-[#1F7A8C]">
                            {doc.department_name.replace('Khoa ', '')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{doc.facility_name || 'Bệnh viện đối tác'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                        {doc.phone_number && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-2.5 h-2.5 text-slate-400" />
                            {doc.phone_number}
                          </span>
                        )}
                        {doc.email && (
                          <span className="flex items-center gap-1 truncate max-w-[120px]">
                            <Mail className="w-2.5 h-2.5 text-slate-400" />
                            {doc.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Select CTA Button */}
                  <button
                    type="button"
                    onClick={() => handleSelectDoctor(doc)}
                    className="px-3.5 py-2 rounded-full bg-[#1F7A8C] hover:bg-teal-700 text-white text-xs font-bold shrink-0 shadow-2xs active:scale-95 transition flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Chọn</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* 4. Manual Entry Accordion Toggle */}
        <div className="pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowManualForm(!showManualForm)}
            className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
          >
            <span className="flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5 text-[#1F7A8C]" />
              Nhập thông tin bác sĩ ngoài danh mục
            </span>
            {showManualForm ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showManualForm && (
            <form onSubmit={handleManualSubmit} className="space-y-3 pt-2">
              <Input
                label="Tên bác sĩ"
                placeholder="Ví dụ: BS Nguyễn Văn An"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-2.5">
                <Input
                  label="Chuyên khoa"
                  placeholder="Ví dụ: Tim mạch"
                  value={manualSpecialty}
                  onChange={(e) => setManualSpecialty(e.target.value)}
                  required
                />
                <Input
                  label="Cơ sở y tế"
                  placeholder="Ví dụ: Bệnh viện Bạch Mai"
                  value={manualHospital}
                  onChange={(e) => setManualHospital(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <Input
                  label="Số điện thoại"
                  placeholder="0912 345 678"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                />
                <Input
                  label="Email"
                  placeholder="bacsi@dhealth.vn"
                  type="email"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                />
              </div>
              <Button type="submit" variant="primary" className="w-full mt-2">
                Thêm bác sĩ này
              </Button>
            </form>
          )}
        </div>
      </div>
    </BottomSheet>
  );
};
