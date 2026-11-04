import React, { useState } from 'react';
import { Camera, Send, Sparkles, Heart, FileText, ChevronRight } from 'lucide-react';
import { HomeBottomNav } from '../home/HomeBottomNav';

interface SCR13Props {
  readonly onNavigate: (screen: string, detailId?: string) => void;
  readonly activeMemberName?: string;
}

interface ChatMessage {
  readonly id: string;
  readonly sender: 'ai' | 'user';
  readonly text: string;
  readonly sourceChip?: {
    readonly label: string;
    readonly target: string;
    readonly id?: string;
  };
}

const INITIAL_MESSAGES: readonly ChatMessage[] = Object.freeze([
  {
    id: 'm1',
    sender: 'ai',
    text: 'Chào Nam! Tôi đã phân tích kết quả xét nghiệm ngày 20/10 tại BV Bạch Mai của bạn. Có 2 điểm cần lưu ý: Đường huyết đói 7.2 mmol/L và LDL-C 3.8 mmol/L hơi cao hơn ngưỡng tối ưu.',
    sourceChip: {
      label: 'Nguồn: Phiếu xét nghiệm 20/10',
      target: 'lab-detail',
      id: 'rep-01',
    },
  },
  {
    id: 'm2',
    sender: 'user',
    text: 'So sánh giúp tôi chỉ số đường huyết với 3 lần trước.',
  },
  {
    id: 'm3',
    sender: 'ai',
    text: 'Đường huyết đói của bạn có xu hướng tăng nhẹ: Tháng 4 (6.2) ➔ Tháng 8 (6.6) ➔ Tháng 10 (7.2 mmol/L). Bác sĩ khuyến cáo kiểm soát chế độ ăn giảm tinh bột hấp thu nhanh và duy trì đi bộ sau ăn.',
  },
]);

export const SCR13_AIAssistantScreen: React.FC<SCR13Props> = ({
  onNavigate,
  activeMemberName = 'Trần Hữu Nam',
}) => {
  const [messages, setMessages] = useState<readonly ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Tôi đã ghi nhận câu hỏi của bạn. Dựa trên hồ sơ của bạn, chỉ số huyết áp và nhịp tim hiện vẫn ổn định.',
        },
      ]);
    }, 800);
  };

  return (
    <div className="w-[390px] h-[844px] relative overflow-hidden bg-gradient-to-b from-[#D9F3EC] via-[#E6ECFF] to-[#EEF2F6] text-[#111827] flex flex-col font-sans select-none">
      <div className="flex-1 overflow-y-auto px-4 pt-12 pb-32 flex flex-col gap-3.5">
        {/* 1. Header Pills */}
        <div className="flex gap-1.5 items-center flex-wrap shrink-0">
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-white text-slate-700 text-xs font-semibold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Hôm nay: 26/10/2026
          </span>
          <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-[#111827] text-white text-xs font-semibold shadow-xs">
            Hồ sơ: <b>{activeMemberName}</b>
          </span>
        </div>

        {/* 2. AI Assistant Persona Header */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 shrink-0">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#1F7A8C] to-[#2F6FDB] flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow">
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            </span>
          </div>

          <div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight block">
              Trợ lý sức khoẻ AI
            </span>
            <span className="text-xs text-slate-600 font-medium">
              Hiểu hồ sơ của bạn · Cảnh báo sớm y khoa
            </span>
          </div>
        </div>

        {/* 3. Conversation Bubbles */}
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-3xl text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#1F7A8C] text-white rounded-br-sm'
                    : 'bg-white text-slate-800 rounded-bl-sm border border-slate-200/50'
                }`}
              >
                {msg.text}
              </div>

              {msg.sourceChip && (
                <button
                  onClick={() => onNavigate(msg.sourceChip!.target, msg.sourceChip!.id)}
                  className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[11px] font-bold text-[#1F7A8C] shadow-xs hover:bg-teal-50 border border-teal-100 transition"
                >
                  <FileText className="w-3 h-3 text-[#1F7A8C]" />
                  <span>{msg.sourceChip.label}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Chat Input Bar */}
      <div className="absolute bottom-16 left-0 right-0 px-4 py-2 bg-white/80 backdrop-blur-md border-t border-slate-200/60 flex items-center gap-2">
        <button
          onClick={() => onNavigate('camera-ocr')}
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 transition"
          title="Chụp ảnh tài liệu gửi AI"
        >
          <Camera className="w-5 h-5" />
        </button>

        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Hỏi bất kỳ điều gì về sức khoẻ..."
          className="flex-1 h-10 px-3.5 rounded-full bg-slate-100 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1F7A8C]"
        />

        <button
          onClick={handleSend}
          className="w-10 h-10 rounded-full bg-[#1F7A8C] hover:bg-teal-700 text-white flex items-center justify-center shrink-0 shadow transition active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* 5. Bottom Navigation */}
      <HomeBottomNav
        activeTab="ai"
        onTabChange={(tab) => onNavigate(tab)}
      />
    </div>
  );
};
