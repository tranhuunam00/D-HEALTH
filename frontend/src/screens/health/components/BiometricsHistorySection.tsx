import React from 'react';

export interface HistoryItem {
  id: string;
  value: string;
  unit: string;
  recordedAt: string;
  source: 'device' | 'manual';
}

export interface BiometricsHistorySectionProps {
  activeMetricName: string;
  history: HistoryItem[];
}

export const BiometricsHistorySection: React.FC<BiometricsHistorySectionProps> = ({
  activeMetricName,
  history,
}) => {
  return (
    <div className="bg-white rounded-[24px] shadow-xs border border-slate-100 mt-1 overflow-hidden flex flex-col">
      <div className="p-4 flex justify-between items-center text-xs font-extrabold text-slate-900 border-b border-slate-50">
        <span>Lịch sử đo · {activeMetricName}</span>
        <span className="text-[11px] text-slate-400 font-semibold">{history.length} lần đo</span>
      </div>

      <div className="divide-y divide-slate-50 text-xs max-h-56 overflow-y-auto px-4">
        {history.length > 0 ? (
          history.map((item) => (
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
          <div className="py-8 text-center text-xs text-slate-400 font-medium">
            Chưa có lịch sử đo cho chỉ số này. Nhấn nút bên trên để ghi nhận số đo mới.
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="p-2.5 text-center text-[11px] text-slate-400 font-medium bg-slate-50/50 border-t border-slate-100">
          {history.length} kết quả · hiển thị 5 mới nhất, kéo trong khung để xem thêm
        </div>
      )}
    </div>
  );
};

