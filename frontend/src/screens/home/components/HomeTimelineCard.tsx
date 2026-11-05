import React from 'react';
import { FlaskConical, Scan } from 'lucide-react';

export interface ClinicalReportSummary {
  id: string;
  kind?: 'lab' | 'imaging' | string;
  title?: string;
  performed_at?: string;
}

export interface HomeTimelineCardProps {
  reports?: readonly ClinicalReportSummary[];
  onNavigateRecords?: () => void;
  onNavigateLabs?: () => void;
  onNavigateImaging?: () => void;
}

function formatDayMonth(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  } catch {
    return dateStr;
  }
}

interface TimelineItemRowProps {
  report: ClinicalReportSummary;
  onNavigateLabs?: () => void;
  onNavigateImaging?: () => void;
}

const TimelineItemRow: React.FC<TimelineItemRowProps> = ({
  report,
  onNavigateLabs,
  onNavigateImaging,
}) => {
  const isImaging = report.kind === 'imaging';
  const Icon = isImaging ? Scan : FlaskConical;
  const bgClass = isImaging ? 'bg-purple-50 text-purple-600' : 'bg-sky-50 text-sky-600';
  const clickHandler = isImaging ? onNavigateImaging : onNavigateLabs;

  return (
    <div
      onClick={clickHandler}
      className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${bgClass} flex items-center justify-center shrink-0`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
          {report.title || (isImaging ? 'Chẩn đoán hình ảnh' : 'Xét nghiệm')}
        </span>
      </div>
      <span className="text-xs font-semibold text-slate-400">
        {formatDayMonth(report.performed_at)}
      </span>
    </div>
  );
};

export const HomeTimelineCard: React.FC<HomeTimelineCardProps> = ({
  reports = [],
  onNavigateRecords,
  onNavigateLabs,
  onNavigateImaging,
}) => {
  return (
    <div className="bg-white rounded-[24px] p-4 sm:p-[18px] border border-slate-100 shadow-xs flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold text-slate-900">Health Timeline</span>
        <button
          type="button"
          onClick={onNavigateRecords}
          className="text-xs font-bold text-[#1F7A8C] hover:underline"
        >
          Xem tất cả
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {reports.length === 0 ? (
          <div className="py-5 px-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col items-center justify-center text-center">
            <span className="text-xs text-slate-400 font-medium leading-relaxed">
              Chưa có sự kiện cận lâm sàng nào gần đây trong cơ sở dữ liệu.
            </span>
          </div>
        ) : (
          reports.map((r) => (
            <TimelineItemRow
              key={r.id}
              report={r}
              onNavigateLabs={onNavigateLabs}
              onNavigateImaging={onNavigateImaging}
            />
          ))
        )}
      </div>
    </div>
  );
};
