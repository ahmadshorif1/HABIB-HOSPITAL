import React, { useState, useRef, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Stethoscope, 
  AlertCircle, 
  Calendar, 
  FileText, 
  PhoneCall,
  Loader2,
  ExternalLink
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const AiChatAssistant: React.FC = () => {
  const { 
    isAiModalOpen, 
    setIsAiModalOpen, 
    settings, 
    language, 
    setPatientView, 
    telegramBot,
    t 
  } = useHospital();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: `আসসালামু আলাইকুম! আমি ${settings.name}-এর স্মার্ট এআই স্বাস্থ্য সহকারী। আমি কীভাবে আপনাকে সাহায্য করতে পারি? আপনি কোনো রোগের লক্ষণ, বিশেষজ্ঞ ডাক্তার নির্বাচন, ল্যাব টেস্ট প্রস্তুতি বা সিরিয়াল বুকিং সংক্রান্ত যেকোনো প্রশ্ন জিজ্ঞাসা করতে পারেন।`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiModalOpen) {
      scrollToBottom();
    }
  }, [messages, isAiModalOpen]);

  if (!isAiModalOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          hospitalName: settings.name,
          language,
          history: messages.slice(-5),
        }),
      });

      if (!response.ok) {
        throw new Error('Network error');
      }

      const data = await response.json();
      const botReply = data.reply || 'আমি আপনার তথ্য বুঝতে পেরেছি। দয়া করে বিস্তারিত জানান।';

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      // Friendly responsive fallback
      setMessages(prev => [
        ...prev,
        {
          id: `bot-fallback-${Date.now()}`,
          sender: 'bot',
          text: `${settings.name}-এ যোগাযোগের জন্য ধন্যবাদ। আমাদের কার্ডিওলজি, মেডিসিন, গাইনি, অর্থোপেডিকস ও শিশু বিভাগে অভিজ্ঞ কনসালট্যান্ট নিয়মিত রোগী দেখছেন। সরাসরি অনলাইন সিরিয়াল নিতে আমাদের ডাক্তার তালিকা অপশনে যান অথবা হটলাইনে কল করুন: ${settings.hotline}। জরুরী ক্ষেত্রে নিকটস্থ জরুরি বিভাগে যোগাযোগ করুন।`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'বুকের ব্যথা বা শ্বাসকষ্ট হলে কোন ডাক্তার দেখাব?',
    'লিপিড প্রোফাইল টেস্টের আগে কি খালি পেটে থাকতে হবে?',
    'অনলাইন সিরিয়াল কীভাবে বুক করব ও পেমেন্ট করব?',
    'শিশু বিশেষজ্ঞ ডাক্তারের সময়সূচি ও ফি কত?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4">
      <div className="relative w-full max-w-xl h-[620px] max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-teal-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight">{settings.name} এআই স্বাস্থ্য সহকারী</h3>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded border border-teal-400/30">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                লক্ষণ ট্রায়াজ, ডাক্তার বিভাগ ও টেস্ট নির্দেশিকা (বাংলা ও English)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Medical disclaimer strip */}
        <div className="bg-amber-50 border-b border-amber-200 py-1.5 px-4 text-[11px] text-amber-900 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span className="truncate">
            এআই সহকারী প্রাথমিক নির্দেশনার জন্য। জরুরী শারীরিক সমস্যায় সরাসরি হটলাইন <strong>{settings.hotline}</strong> বা ইমার্জেন্সিতে যান।
          </span>
        </div>

        {/* Telegram Bot Notification Strip */}
        <div className="bg-sky-50 border-b border-sky-200 py-1.5 px-4 text-[11px] text-sky-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <Send className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span className="truncate">
              টেলিগ্রামেও আমাদের এআই সহকারী সক্রিয়! <strong>@{telegramBot.botUsername ? telegramBot.botUsername.replace('@', '') : 'habib_hospital_bot'}</strong>
            </span>
          </div>
          <a
            href={`https://t.me/${telegramBot.botUsername ? telegramBot.botUsername.replace('@', '') : 'habib_hospital_bot'}`}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-sky-700 hover:text-sky-900 hover:underline"
          >
            <span>টেলিগ্রামে খুলুন</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
          {messages.map(msg => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs whitespace-pre-wrap ${
                    isBot
                      ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                      : 'bg-teal-700 text-white rounded-tr-xs'
                  }`}
                >
                  {msg.text}
                  <div className={`text-[10px] mt-1 ${isBot ? 'text-slate-400' : 'text-teal-200 text-right'}`}>
                    {msg.time}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs p-2 bg-white rounded-lg border border-slate-200 w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
              <span>এআই সহকারী উত্তর প্রস্তুত করছে...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto scrollbar-none flex gap-1.5">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] text-slate-600 hover:text-teal-800 bg-slate-100 hover:bg-teal-50 px-2.5 py-1 rounded-md shrink-0 border border-slate-200 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="আপনার স্বাস্থ্য সংক্রান্ত প্রশ্ন বা লক্ষণ লিখুন..."
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-colors cursor-pointer disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
