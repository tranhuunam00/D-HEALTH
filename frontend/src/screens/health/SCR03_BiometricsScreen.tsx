import React from 'react';
import { Plus, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useBiometricsLogic, MetricType } from './useBiometricsLogic';
import { HomeBottomNav, NavTabId } from '../home/HomeBottomNav';
import { BiometricEntrySheet } from '../../components/organisms/BiometricEntrySheet';

interface SCR03Props {
  readonly onNavigate: (screen: string) => void;
  readonly onSelectMember?: (memberId: string) => void;
  readonly activeMemberName?: string;
  readonly activeMemberId?: string;
}

export const SCR03_BiometricsScreen: React.FC<SCR03Props> = ({
  onNavigate,
  onSelectMember,
  activeMemberName = 'Trần Hữu Nam',
  activeMemberId = 'nam',
}) => {
  const {
    activeMetric,
    setActiveMetric,
    filteredHistory,
    metricsSummaries,
    activeMetricObj,
    isEntrySheetOpen,
    openEntrySheet,
    closeEntrySheet,
    handleSaveBiometrics,
    successMsg,
  } = useBiometricsLogic(activeMemberId);

  // Dữ liệu biểu đồ cột 7 ngày mẫu (chiều cao % các thanh)
  const chartBars = [
    { height: '60%', value: '138', day: '20' },
    { height: '55%', value: '135', day: '21' },
    { height: '65%', value: '133', day: '22' },
    { height: '58%', value: '132', day: '23' },
    { height: '62%', value: '133', day: '24' },
    { height: '54%', value: '130', day: '25' },
    { height: '70%', value: '131', day: '26', isLatest: true },
  ];

  return (
    <div className="w-full min-h-screen relative bg-[#EEF2F6] text-[#111827] flex flex-col font-sans select-none pb-24">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 flex flex-col gap-3">
        {/* 1. Header Pills (1:1 with Design) */}
        <div className="flex gap-1.5 items-center flex-wrap shrink-0">
          <span className="inline-flex items-center gap-1.5 h-6.5 px-3 rounded-full bg-white text-slate-700 text-xs font-semibold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Hôm nay: 26/10/2026
          </span>
          <button
            onClick={() => onSelectMember?.('family')}
            className="inline-flex items-center gap-1.5 h-6.5 px-3 rounded-full bg-[#111827] text-white text-xs font-semibold shadow-xs hover:bg-slate-800"
          >
            <span className="w-4 h-4 rounded-full bg-white text-[#111827] text-[10px] font-black flex items-center justify-center">
              👤
            </span>
            Hồ sơ sức khoẻ: <b>{activeMemberName}</b>
          </button>
        </div>

        {/* 2. Tiêu đề màn hình */}
        <div className="flex items-center justify-between pt-1">
          <h1 className="text-[28px] font-black tracking-tight text-slate-900 leading-tight">Sức khoẻ</h1>
        </div>

        {/* 3. Category Tabs (Pills cuộn ngang) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            className="px-4 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white shadow-xs"
          >
            Sinh trắc
          </button>
          <button
            onClick={() => onNavigate('labs')}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 transition"
          >
            Xét nghiệm
          </button>
          <button
            onClick={() => onNavigate('imaging')}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 transition"
          >
            CĐHA
          </button>
          <button
            onClick={() => onNavigate('chronic')}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 transition"
          >
            Bệnh mạn tính
          </button>
        </div>

        {/* 4. Device Sync Banner (1:1 with Design) */}
        <div
          onClick={() => onNavigate('devices')}
          className="flex items-center justify-between bg-white rounded-2xl p-3 shadow-xs border border-slate-100 cursor-pointer hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs text-slate-700 font-semibold truncate">
              Đồng bộ từ Apple Watch, máy đo huyết áp · 5 phút trước
            </span>
          </div>
          <span className="text-xs font-bold text-[#1F7A8C] shrink-0 flex items-center gap-0.5">
            Thiết bị <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Success toast notification */}
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 5. Detail & 7-Day Bar Chart Card (1:1 with Design) */}
        <div className="bg-white rounded-[28px] p-5 shadow-xs border border-slate-100 flex flex-col gap-3 relative">
          {/* Top row */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-800">{activeMetricObj.name} · 7 ngày</span>
            <span className="px-3 py-1 rounded-full bg-[#EAF8F0] text-[#166534] text-xs font-extrabold">
              Mức 1 · Tốt
            </span>
          </div>

          {/* Value row */}
          <div className="flex items-baseline">
            <span className="text-4xl font-black text-slate-900 tracking-tight">{activeMetricObj.value}</span>
            <span className="text-xs font-medium text-slate-500 ml-1.5">{activeMetricObj.unit}</span>
          </div>

          {/* Subtitle */}
          <span className="text-xs text-slate-400 font-medium -mt-1">
            Lần đo mới nhất: 07:15 · 26/10/2026
          </span>

          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 pt-0.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              Từ thiết bị
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              Nhập tay
            </span>
          </div>

          {/* 7-Day Bar Chart */}
          <div className="h-28 flex items-end justify-between px-3 pt-2 pb-1 border-b border-slate-50">
            {chartBars.map((bar, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  style={{ height: bar.height }}
                  className={`w-4.5 rounded-full transition-all ${
                    bar.isLatest ? 'bg-[#2563EB]' : 'bg-[#BFDBFE]'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Callout box */}
          <div className="bg-[#F0FDF4] border border-emerald-100/70 rounded-2xl p-3 flex items-start gap-2 text-xs">
            <span className="text-teal-600 font-bold shrink-0 mt-0.5">✦</span>
            <span className="text-slate-800 font-medium leading-relaxed">
              Huyết áp tâm thu giảm từ 138 xuống 131 mmHg trong 7 ngày, trong mục tiêu.
            </span>
          </div>

          {/* Large Manual Input Button (1:1 with Design) */}
          <button
            onClick={openEntrySheet}
            className="w-full h-12 rounded-full bg-white border-2 border-[#1F7A8C] hover:bg-teal-50/40 text-[#1F7A8C] text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition shadow-2xs mt-1"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nhập số đo {activeMetricObj.name.toLowerCase()} thủ công</span>
          </button>
        </div>

        {/* 6. Instruction Text */}
        <span className="text-xs text-slate-500 font-semibold px-1">
          Chạm vào một chỉ số để xem diễn biến 7 lần đo gần nhất
        </span>

        {/* 7. Lưới 8 chỉ số đo (2 Cột x 4 Hàng) (1:1 with Design) */}
        <div className="grid grid-cols-2 gap-3">
          {metricsSummaries.map((m) => {
            const isSelected = activeMetric === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setActiveMetric(m.id)}
                className={`rounded-[22px] p-3.5 flex flex-col justify-between h-20 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-2 border-slate-900 shadow-sm ring-1 ring-slate-900/10'
                    : 'bg-white border border-slate-100 shadow-2xs hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-lg ${m.codeBg} ${m.codeColor} text-[11px] font-black flex items-center justify-center shrink-0`}
                  >
                    {m.code}
                  </span>
                  <span className="text-xs font-bold text-slate-700 truncate">{m.name}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-base font-black text-slate-900">{m.value}</span>
                  <span className="text-[11px] text-slate-400 font-medium ml-1 truncate">{m.unit}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 8. Lịch sử đo gần đây (1:1 with Design) */}
        <div className="bg-white rounded-[24px] p-4.5 flex flex-col gap-3 shadow-xs border border-slate-100 mt-1">
          <div className="flex justify-between items-center text-xs font-extrabold text-slate-900 pb-1 border-b border-slate-50">
            <span>Lịch sử đo · {activeMetricObj.name}</span>
            <span className="text-[11px] text-slate-400 font-semibold">7 lần đo</span>
          </div>

          <div className="divide-y divide-slate-50 text-xs max-h-64 overflow-y-auto">
            {filteredHistory.length > 0 ? (
              filteredHistory.slice(0, 7).map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm">
                      {item.value} <span className="text-xs font-normal text-slate-400">{item.unit}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {item.recordedAt} · {item.source === 'device' ? 'Đồng bộ thiết bị' : 'Nhập tay'}
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      item.source === 'device'
                        ? 'bg-teal-50 text-[#1F7A8C]'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {item.source === 'device' ? 'Thiết bị' : 'Nhập tay'}
                  </span>
                </div>
              ))
            ) : (
              // Default fallback entries matching mockup Image 1
              <>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm">
                      131/82 <span className="text-xs font-normal text-slate-400">mmHg</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      07:15 · 26/10/2026 · Đồng bộ thiết bị
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-[#1F7A8C]">
                    Thiết bị
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm">
                      130/81 <span className="text-xs font-normal text-slate-400">mmHg</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      07:15 · 25/10/2026 · Đồng bộ thiết bị
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-[#1F7A8C]">
                    Thiết bị
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm">
                      133/84 <span className="text-xs font-normal text-slate-400">mmHg</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      07:15 · 24/10/2026 · Đồng bộ thiết bị
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-[#1F7A8C]">
                    Thiết bị
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm">
                      132/83 <span className="text-xs font-normal text-slate-400">mmHg</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      07:15 · 23/10/2026 · Đồng bộ thiết bị
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-[#1F7A8C]">
                    Thiết bị
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm">
                      138/88 <span className="text-xs font-normal text-slate-400">mmHg</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      07:15 · 22/10/2026 · Đồng bộ thiết bị
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-[#1F7A8C]">
                    Thiết bị
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 9. Bottom Navigation (1:1 with Design) */}
      <HomeBottomNav
        activeTab="health"
        onTabChange={(tab: NavTabId) => {
          if (tab === 'home') onNavigate('home');
          else if (tab === 'records') onNavigate('records');
          else if (tab === 'ai') onNavigate('ai');
          else if (tab === 'care') onNavigate('care');
          else if (tab === 'health') onNavigate('biometrics');
        }}
      />

      {/* 10. Manual Entry Bottom Sheet (Saves to DB and reloads live!) */}
      <BiometricEntrySheet
        isOpen={isEntrySheetOpen}
        onClose={closeEntrySheet}
        onSubmit={handleSaveBiometrics}
      />
    </div>
  );
};
