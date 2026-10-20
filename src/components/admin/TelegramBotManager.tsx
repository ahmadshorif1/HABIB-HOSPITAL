import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { 
  Send, 
  Bot, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  ExternalLink, 
  Key, 
  Terminal, 
  ShieldCheck, 
  Sparkles, 
  MessageSquare, 
  Play, 
  HelpCircle, 
  PhoneCall, 
  Calendar, 
  Stethoscope, 
  Check, 
  Eye, 
  EyeOff,
  Activity,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

export const TelegramBotManager: React.FC = () => {
  const { 
    telegramBot, 
    updateTelegramBot, 
    testTelegramBot, 
    setTelegramWebhook, 
    settings, 
    doctors,
    beds,
    t 
  } = useHospital();

  const [tokenInput, setTokenInput] = useState(telegramBot.botToken);
  const [showToken, setShowToken] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; bot?: any; error?: string } | null>(null);
  
  const [isSettingWebhook, setIsSettingWebhook] = useState(false);
  const [webhookResult, setWebhookResult] = useState<{ ok: boolean; message?: string; details?: any } | null>(null);
  
  // Custom Webhook URL
  const defaultWebhookUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/telegram/webhook` 
    : '/api/telegram/webhook';
  const [customWebhookUrl, setCustomWebhookUrl] = useState(defaultWebhookUrl);

  // Send Test Message State
  const [targetChatId, setTargetChatId] = useState('');
  const [testMessage, setTestMessage] = useState(
    `🏥 *${settings.name} এআই নোটিফিকেশন*\n\nআপনার টেলিগ্রাম বট সফলভাবে যুক্ত হয়েছে! রোগীরা এখন টেলিগ্রাম থেকে সরাসরি ডাক্তারদের তালিকা দেখতে এবং স্বাস্থ্য পরামর্শ গ্রহণ করতে পারবেন।`
  );
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [sendTestStatus, setSendTestStatus] = useState<{ ok: boolean; message: string } | null>(null);

  // Copied state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Telegram Simulator State
  const [simMessages, setSimMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string; buttons?: string[] }>>([
    {
      sender: 'bot',
      text: `আসসালামু আলাইকুম! 🏥\nস্বাগতম *${settings.name}* স্মার্ট স্বাস্থ্য ও মেডিকেল সহকারীতে।\n\nকমান্ডসমূহ:\n• /doctors - বিশেষজ্ঞ ডাক্তার ও সময়সূচি\n• /serial - অনলাইন সিরিয়াল বুকিং লিংক\n• /hotline - ২৪/৭ জরুরী হটলাইন\n• /tests - ডায়াগনস্টিক ল্যাব টেস্ট ফি\n• /beds - কেবিন ও আইসিইউ বেড অবস্থা`,
      time: '10:00 AM',
      buttons: ['/doctors', '/serial', '/hotline', '/tests']
    }
  ]);
  const [simInput, setSimInput] = useState('');
  const [simLoading, setSimLoading] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Test bot token
  const handleTestToken = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testTelegramBot(tokenInput.trim());
      setTestResult(res);
      if (res.ok && res.bot?.username) {
        updateTelegramBot({
          botToken: tokenInput.trim(),
          botUsername: res.bot.username,
          isActive: true,
          lastConnectedAt: new Date().toLocaleString(),
        });
      }
    } catch (e: any) {
      setTestResult({ ok: false, error: e.message });
    } finally {
      setIsTesting(false);
    }
  };

  // Save bot token
  const handleSaveToken = (e: React.FormEvent) => {
    e.preventDefault();
    updateTelegramBot({
      botToken: tokenInput.trim(),
      isActive: Boolean(tokenInput.trim()),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Set Webhook
  const handleSetWebhook = async () => {
    setIsSettingWebhook(true);
    setWebhookResult(null);
    try {
      const token = tokenInput.trim() || telegramBot.botToken;
      const targetUrl = customWebhookUrl.includes('?') 
        ? customWebhookUrl 
        : `${customWebhookUrl}?token=${encodeURIComponent(token)}`;

      const res = await fetch('/api/telegram/set-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: token,
          webhookUrl: targetUrl,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setWebhookResult({ ok: true, message: 'টেলিগ্রাম সার্ভারে ওয়েবহুক সফলভাবে সেট ও ভেরিফাই হয়েছে!', details: data });
        updateTelegramBot({
          webhookUrl: targetUrl,
          isActive: true,
          lastConnectedAt: new Date().toLocaleString(),
        });
      } else {
        setWebhookResult({ ok: false, message: data.description || data.error || 'ওয়েবহুক সেট করতে সমস্যা হয়েছে', details: data });
      }
    } catch (e: any) {
      setWebhookResult({ ok: false, message: e.message });
    } finally {
      setIsSettingWebhook(false);
    }
  };

  // Send Direct Test Message
  const handleSendTestMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetChatId.trim()) return;
    setIsSendingTest(true);
    setSendTestStatus(null);
    try {
      const token = tokenInput.trim() || telegramBot.botToken;
      const res = await fetch('/api/telegram/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: token,
          chatId: targetChatId.trim(),
          message: testMessage,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSendTestStatus({ ok: true, message: 'টেলিগ্রাম চ্যাটে টেস্ট বার্তা সফলভাবে পাঠানো হয়েছে!' });
      } else {
        setSendTestStatus({ ok: false, message: data.description || 'বার্তা পাঠানো যায়নি। চ্যাট আইডি পরীক্ষা করুন।' });
      }
    } catch (e: any) {
      setSendTestStatus({ ok: false, message: e.message });
    } finally {
      setIsSendingTest(false);
    }
  };

  // Simulator Message Sender
  const handleSimSend = async (customPrompt?: string) => {
    const text = (customPrompt || simInput).trim();
    if (!text || simLoading) return;

    const userEntry = {
      sender: 'user' as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSimMessages(prev => [...prev, userEntry]);
    setSimInput('');
    setSimLoading(true);

    try {
      // Local quick command handling or AI triage
      if (text === '/start' || text === '/help') {
        setSimMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: `আসসালামু আলাইকুম! 🏥\nস্বাগতম *${settings.name}* স্মার্ট স্বাস্থ্য ও মেডিকেল সহকারীতে।\n\nকমান্ডসমূহ:\n• /doctors - বিশেষজ্ঞ ডাক্তার ও সময়সূচি\n• /serial - অনলাইন সিরিয়াল বুকিং লিংক\n• /hotline - ২৪/৭ জরুরী হটলাইন\n• /tests - ডায়াগনস্টিক ল্যাব টেস্ট ফি\n• /beds - কেবিন ও আইসিইউ বেড অবস্থা`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            buttons: ['/doctors', '/serial', '/hotline', '/tests']
          }
        ]);
      } else if (text === '/doctors') {
        const docList = doctors.slice(0, 4).map((d, i) => `${i + 1}. *${d.name}* (${d.department})\n   ফি: ৳${d.consultationFee} | সময়: ${d.timing}`).join('\n\n');
        setSimMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: `👨‍⚕️ *${settings.name} বিশেষজ্ঞ ডাক্তারদের তালিকা:*\n\n${docList}\n\nসিরিয়াল বুক করতে টাইপ করুন /serial অথবা ওয়েবসাইটে যান।`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            buttons: ['/serial', '/hotline']
          }
        ]);
      } else if (text === '/serial') {
        setSimMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: `📅 *অনলাইন সিরিয়াল বুকিং ও ডিজিটাল পেমেন্ট:*\n\nঘরে বসেই আপনার পছন্দের বিশেষজ্ঞ ডাক্তারের ওপিডি সিরিয়াল টোকেন নিতে এবং বিকাশ/নগদে ফি পরিশোধ করতে নিচের লিংকে ভিজিট করুন:\n${typeof window !== 'undefined' ? window.location.origin : 'https://habibhospital.org'}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            buttons: ['/doctors', '/hotline']
          }
        ]);
      } else if (text === '/hotline' || text === '/emergency') {
        setSimMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: `🚨 *${settings.name} জরুরী যোগাযোগ:*\n\n• ২৪ ঘণ্টা জরুরি হটলাইন: ${settings.hotline}\n• জরুরি অ্যাম্বুলেন্স: ${settings.emergencyPhone}\n• ঠিকানা: ${settings.address}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            buttons: ['/serial', '/doctors']
          }
        ]);
      } else if (text === '/beds' || text === '/cabin') {
        const avail = beds.filter(b => b.status === 'AVAILABLE').length;
        setSimMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: `🛏️ *বেড ও কেবিন সার্বিক পরিস্থিতি:*\n\n• মোট বেড ও কেবিন: ${beds.length} টি\n• বর্তমানে খালি রয়েছে: ${avail} টি\n• আইসিইউ / সিসিইউ সাপোর্ট সার্বক্ষণিক প্রস্তুত।\nজরুরী ভর্তির জন্য হটলাইনে কল করুন: ${settings.emergencyPhone}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ]);
      } else {
        // AI triage via Gemini
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            hospitalName: settings.name,
            language: 'bn',
          }),
        });
        const data = await res.json();
        setSimMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: data.reply || `আপনার বার্তার জন্য ধন্যবাদ। ${settings.name}-এ বিশেষজ্ঞ ডাক্তারের সিরিয়াল বুক করতে ভিজিট করুন অথবা কল করুন ${settings.hotline}।`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            buttons: ['/serial', '/hotline']
          }
        ]);
      }
    } catch {
      setSimMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: `আপনার প্রশ্নের জন্য ধন্যবাদ। ${settings.name}-এর বিশেষজ্ঞ ডাক্তারের সিরিয়াল বুক করতে অনুগ্রহ করে কল করুন: ${settings.hotline}।`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Top Banner & Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 text-sky-600">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {t('টেলিগ্রাম বট টোকেন ও এআই অ্যাসিস্ট্যান্ট ইন্টিগ্রেশন', 'Telegram Bot AI Token Integration')}
                </h3>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${telegramBot.isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                  {telegramBot.isActive ? '● সক্রিয় (Active)' : '○ নিষ্ক্রিয় (Inactive)'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                টেলিগ্রাম বট টোকেনের মাধ্যমে {settings.name}-এর এআই চ্যাটবট স্বয়ংক্রিয়ভাবে পরিচালিত হয়। রোগীরা টেলিগ্রামে যে কোনো সময় ডাক্তারের সিরিয়াল বুকিং, বিশেষজ্ঞ তথ্য, ডায়াগনস্টিক খরচ এবং এআই ট্রায়াজ পরামর্শ ২৪/৭ গ্রহণ করতে পারবেন।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {telegramBot.botUsername && (
              <a
                href={`https://t.me/${telegramBot.botUsername.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>@{telegramBot.botUsername.replace('@', '')}</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            )}
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
            <span className="text-[11px] text-slate-500 block">বট ইউজারনেম</span>
            <span className="text-xs font-bold text-slate-800 font-mono mt-0.5 block truncate">
              {telegramBot.botUsername ? `@${telegramBot.botUsername.replace('@', '')}` : 'কনফিগার করা হয়নি'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
            <span className="text-[11px] text-slate-500 block">এআই ইঞ্জিন</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span className="text-xs font-bold text-slate-800">Gemini 3.8 Flash</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
            <span className="text-[11px] text-slate-500 block">ওয়েবহুক মেথড</span>
            <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
              POST /api/telegram/webhook
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
            <span className="text-[11px] text-slate-500 block">শেষ সংযোগ যাচাই</span>
            <span className="text-xs font-bold text-slate-700 mt-0.5 block">
              {telegramBot.lastConnectedAt || 'এখনও যাচাই হয়নি'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Token Configuration & Webhook Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Card 1: Telegram Bot Token Input & Verification */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-sky-600" />
                <h4 className="font-bold text-slate-900 text-sm">১. টেলিগ্রাম বট টোকেন (Bot Token Configuration)</h4>
              </div>
              <span className="text-xs text-sky-700 font-medium">@BotFather থেকে সংগৃহীত</span>
            </div>

            <form onSubmit={handleSaveToken} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Telegram Bot API Token <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ_example"
                    className="w-full pl-3 pr-20 py-2.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
                      title={showToken ? 'লুকান' : 'প্রদর্শন'}
                    >
                      {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {tokenInput && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(tokenInput, 'botToken')}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
                        title="টোকেন কপি করুন"
                      >
                        {copiedKey === 'botToken' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  বট টোকেন পাওয়ার নিয়ম: টেলিগ্রামে <strong className="text-slate-700">@BotFather</strong> সার্চ করে <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-700">/newbot</code> লিখে নির্দেশনাবলী অনুসরণ করুন।
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleTestToken}
                  disabled={isTesting || !tokenInput.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'টোকেন যাচাই হচ্ছে...' : 'টোকেন সংযোগ টেস্ট করুন'}</span>
                </button>

                <button
                  type="submit"
                  disabled={!tokenInput.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  <span>{isSaved ? 'সংরক্ষিত হয়েছে!' : 'টোকেন সেভ করুন'}</span>
                </button>
              </div>

              {/* Test Result Message Box */}
              {testResult && (
                <div className={`p-3 rounded-lg border text-xs mt-3 ${testResult.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                  <div className="flex items-start gap-2">
                    {testResult.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <strong className="block font-semibold">
                        {testResult.ok ? 'টেলিগ্রাম বট টোকেন সম্পূর্ণ সঠিক ও সক্রিয়!' : 'টোকেন সংযোগে ত্রুটি:'}
                      </strong>
                      {testResult.ok ? (
                        <div className="mt-1 space-y-0.5 text-[11px]">
                          <div>• বটের নাম: <strong>{testResult.bot?.first_name}</strong></div>
                          <div>• বটের ইউজারনেম: <strong className="text-sky-700">@{testResult.bot?.username}</strong></div>
                          <div>• বট আইডি: <span className="font-mono">{testResult.bot?.id}</span></div>
                          <div>• গ্রুপে যোগদানের অনুমতি: {testResult.bot?.can_join_groups ? 'হ্যাঁ (সক্রিয়)' : 'না'}</div>
                        </div>
                      ) : (
                        <p className="mt-0.5 text-[11px]">{testResult.error || 'অকার্যকর টোকেন। অনুগ্রহ করে BotFather থেকে কপি করা টোকেনটি মিলিয়ে দেখুন।'}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Card 2: Webhook Activation & Sync */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-slate-900 text-sm">২. টেলিগ্রাম ওয়েবহুক অ্যাক্টিভেশন (Set Webhook)</h4>
              </div>
              <span className="text-xs text-emerald-700 font-medium">Real-Time Event Stream</span>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                ওয়েবহুক সক্রিয় করলে কোনো ব্যবহারকারী টেলিগ্রামে বটকে বার্তা দিলে তা সরাসরি আমাদের ক্লাউড সার্ভারে <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-800">/api/telegram/webhook</code> এ চলে আসবে এবং এআই স্বয়ংক্রিয় উত্তর দেবে।
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  সার্ভার ওয়েবহুক ইউআরএল (Server Webhook Target URL)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customWebhookUrl}
                    onChange={(e) => setCustomWebhookUrl(e.target.value)}
                    placeholder="https://habibhospital.org/api/telegram/webhook"
                    className="w-full pl-3 pr-20 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(customWebhookUrl, 'webhookUrl')}
                    className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
                    title="কপি করুন"
                  >
                    {copiedKey === 'webhookUrl' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSetWebhook}
                  disabled={isSettingWebhook || (!tokenInput.trim() && !telegramBot.botToken)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSettingWebhook ? 'animate-spin' : ''}`} />
                  <span>{isSettingWebhook ? 'ওয়েবহুক কনফিগার হচ্ছে...' : '১-ক্লিক ওয়েবহুক সক্রিয় করুন'}</span>
                </button>
              </div>

              {/* Webhook Response */}
              {webhookResult && (
                <div className={`p-3 rounded-lg border text-xs ${webhookResult.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                  <div className="flex items-start gap-2">
                    {webhookResult.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold">{webhookResult.message}</span>
                      {webhookResult.details && (
                        <pre className="mt-1 p-2 bg-black/5 rounded text-[10px] font-mono overflow-x-auto">
                          {JSON.stringify(webhookResult.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Send Direct Live Test Message */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-slate-900 text-sm">৩. টেলিগ্রাম লাইভ টেস্ট বার্তা প্রেরণ (Send Live Test)</h4>
              </div>
              <span className="text-xs text-indigo-700 font-medium">Chat ID Verification</span>
            </div>

            <form onSubmit={handleSendTestMessage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    লক্ষ্য টেলিগ্রাম চ্যাট আইডি (Chat ID) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={targetChatId}
                    onChange={(e) => setTargetChatId(e.target.value)}
                    placeholder="e.g. 123456789"
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    টেলিগ্রামে <strong className="text-slate-600">@userinfobot</strong> এ /start দিলে নিজের Chat ID পাবেন।
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    টেম্পলেট নির্বাচন করুন
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value === 'welcome') {
                        setTestMessage(`🏥 *${settings.name} এআই অ্যাসিস্ট্যান্ট*\n\nআপনার টেলিগ্রাম একাউন্ট সফলভাবে ভেরিফাই হয়েছে। যে কোনো স্বাস্থ্য প্রশ্ন জিজ্ঞাসা করুন!`);
                      } else if (e.target.value === 'serial') {
                        setTestMessage(`📅 *সিরিয়াল নিশ্চিতকরণ*\n\nরোগী: আব্দুর রহিম\nসিরিয়াল নং: ০৩\nডাক্তার: ডা. মাহফুজ আহমেদ (কার্ডিওলজিস্ট)\nসময়: বিকাল ৫:০০`);
                      } else if (e.target.value === 'emergency') {
                        setTestMessage(`🚨 *জরুরী নোটিশ*\n\n${settings.name}-এর আইসিইউ ও অ্যাম্বুলেন্স সেবা সার্বক্ষণিক প্রস্তুত রয়েছে। কল করুন: ${settings.hotline}`);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="welcome">স্বাগতম বার্তা (Welcome Notification)</option>
                    <option value="serial">সিরিয়াল বুকিং নিশ্চিতকরণ (Appointment Slip)</option>
                    <option value="emergency">জরুরী অ্যালার্ট (Emergency Notice)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বার্তার বিষয়বস্তু (Markdown সমর্থিত)
                </label>
                <textarea
                  rows={3}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isSendingTest || !targetChatId.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Send className={`w-3.5 h-3.5 ${isSendingTest ? 'animate-pulse' : ''}`} />
                <span>{isSendingTest ? 'বার্তা পাঠানো হচ্ছে...' : 'টেস্ট বার্তা পাঠান'}</span>
              </button>

              {sendTestStatus && (
                <div className={`p-3 rounded-lg border text-xs ${sendTestStatus.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                  <div className="flex items-center gap-2">
                    {sendTestStatus.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                    <span>{sendTestStatus.message}</span>
                  </div>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Right Column: Interactive Bot Simulator & BotFather Guide (5 cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Telegram Interactive Chat Simulator */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[520px]">
            {/* Telegram Header */}
            <div className="bg-[#17212b] text-white p-3.5 flex items-center justify-between border-b border-[#0e1621]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-white leading-tight">
                    {settings.name} Bot
                  </h5>
                  <span className="text-[10px] text-sky-400 block">
                    {telegramBot.botUsername ? `@${telegramBot.botUsername.replace('@', '')}` : 'bot'} · bot
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-sky-900/60 text-sky-200 font-mono px-2 py-0.5 rounded border border-sky-700/50">
                লাইভ টেস্ট মোড
              </span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3.5 bg-[#0e1621] overflow-y-auto space-y-3 font-sans text-xs">
              {simMessages.map((msg, index) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div key={index} className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs shadow-xs ${isBot ? 'bg-[#182533] text-slate-100 rounded-tl-xs border border-slate-800' : 'bg-[#2b5278] text-white rounded-tr-xs'}`}>
                      <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                      <span className="text-[9px] text-slate-400 mt-1 block text-right">{msg.time}</span>
                    </div>

                    {/* Inline keyboard buttons if present */}
                    {isBot && msg.buttons && msg.buttons.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5 max-w-[85%]">
                        {msg.buttons.map((btn, bIdx) => (
                          <button
                            key={bIdx}
                            onClick={() => handleSimSend(btn)}
                            className="text-[10px] bg-[#242f3d] hover:bg-[#2b5278] text-sky-300 hover:text-white px-2.5 py-1 rounded border border-slate-700 transition-colors cursor-pointer"
                          >
                            {btn}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {simLoading && (
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] bg-[#182533] w-fit px-3 py-1.5 rounded-full border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                  <span>বট উত্তর লিখছে...</span>
                </div>
              )}
            </div>

            {/* Quick Command Suggestions */}
            <div className="px-3 py-1.5 bg-[#17212b] border-t border-[#0e1621] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {['/start', '/doctors', '/serial', '/hotline', '/beds'].map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => handleSimSend(cmd)}
                  className="text-[10px] text-slate-300 hover:text-white bg-[#242f3d] hover:bg-[#2b5278] px-2 py-0.5 rounded shrink-0 transition-colors cursor-pointer"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-2.5 bg-[#17212b] border-t border-[#0e1621]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSimSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={simInput}
                  onChange={(e) => setSimInput(e.target.value)}
                  placeholder="লিখুন বা প্রশ্ন করুন (যেমন: /doctors)..."
                  className="flex-1 px-3 py-2 text-xs bg-[#242f3d] text-white border border-slate-700 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-sky-500 placeholder-slate-400"
                />
                <button
                  type="submit"
                  disabled={simLoading || !simInput.trim()}
                  className="p-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Card: BotFather Configuration & Commands Guide */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-slate-900 text-xs">বটের কমান্ড কনফিগারেশন (@BotFather /setcommands)</h4>
            </div>

            <p className="text-[11px] text-slate-600 mb-2">
              টেলিগ্রামে ব্যবহারকারীদের জন্য কমান্ড বাটন সক্রিয় করতে @BotFather-এ <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-800 font-mono">/setcommands</code> পাঠিয়ে নিচের তালিকাটি পেস্ট করুন:
            </p>

            <div className="relative">
              <pre className="p-3 bg-slate-900 text-emerald-300 rounded-lg text-[10px] font-mono leading-relaxed overflow-x-auto">
{`start - স্বাগতম ও সার্বিক সহায়তা
doctors - বিশেষজ্ঞ ডাক্তার ও ওপিডি সময়সূচি
serial - অনলাইন সিরিয়াল বুকিং ও ডিজিটাল পেমেন্ট
hotline - ২৪ ঘণ্টা জরুরি সেবা ও অ্যাম্বুলেন্স
tests - ডায়াগনস্টিক ল্যাব টেস্ট ও ফি
beds - কেবিন ও আইসিইউ বেড অনুসন্ধান`}
              </pre>
              <button
                onClick={() => copyToClipboard(`start - স্বাগতম ও সার্বিক সহায়তা
doctors - বিশেষজ্ঞ ডাক্তার ও ওপিডি সময়সূচি
serial - অনলাইন সিরিয়াল বুকিং ও ডিজিটাল পেমেন্ট
hotline - ২৪ ঘণ্টা জরুরি সেবা ও অ্যাম্বুলেন্স
tests - ডায়াগনস্টিক ল্যাব টেস্ট ও ফি
beds - কেবিন ও আইসিইউ বেড অনুসন্ধান`, 'botCommands')}
                className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedKey === 'botCommands' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>কপি</span>
              </button>
            </div>

            <div className="mt-4 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>সার্ভার এনভায়রনমেন্ট ভেরিয়েবল (.env):</strong>
                <p className="mt-0.5 font-mono text-[10px] text-slate-700">
                  TELEGRAM_BOT_TOKEN="আপনার_বট_টোকেন"
                </p>
                <p className="mt-0.5 text-[10px] text-amber-800">
                  এটি যোগ করলে সার্ভার রিস্টার্ট হলেও টোকেন স্বয়ংক্রিয়ভাবে কার্যকর থাকবে।
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
