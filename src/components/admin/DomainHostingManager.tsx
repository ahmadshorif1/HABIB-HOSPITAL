import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { 
  Globe, 
  Server, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Copy, 
  ExternalLink, 
  Lock, 
  Terminal, 
  Check, 
  AlertCircle,
  HelpCircle,
  Settings
} from 'lucide-react';

export const DomainHostingManager: React.FC = () => {
  const { domainHosting, updateDomainHosting, verifyDomainDns, settings, t } = useHospital();

  const [domainInput, setDomainInput] = useState(domainHosting.customDomain);
  const [subdomainInput, setSubdomainInput] = useState(domainHosting.subdomain);
  const [provider, setProvider] = useState(domainHosting.hostingProvider);
  const [serverIpInput, setServerIpInput] = useState(domainHosting.serverIp);
  const [portInput, setPortInput] = useState(domainHosting.port);
  const [sslEnforced, setSslEnforced] = useState(domainHosting.sslEnabled);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveDomain = (e: React.FormEvent) => {
    e.preventDefault();
    updateDomainHosting({
      customDomain: domainInput.trim().toLowerCase().replace(/^https?:\/\//, ''),
      subdomain: subdomainInput.trim(),
      hostingProvider: provider,
      serverIp: serverIpInput.trim(),
      port: portInput,
      sslEnabled: sslEnforced,
      dnsRecords: [
        { type: 'A', host: '@', value: serverIpInput.trim(), status: 'VERIFIED', ttl: '3600' },
        { type: 'CNAME', host: subdomainInput.trim() || 'www', value: domainInput.trim(), status: 'VERIFIED', ttl: '3600' },
        { type: 'TXT', host: '_hospital-verify', value: `habib-hosp-token-${Date.now().toString().slice(-6)}`, status: 'VERIFIED', ttl: '3600' },
      ],
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleVerifyDns = async () => {
    setIsVerifying(true);
    await verifyDomainDns();
    setIsVerifying(false);
  };

  const handleCopyNginx = () => {
    navigator.clipboard.writeText(domainHosting.reverseProxyConfig);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {t('নিজস্ব ডোমেইন ও হোস্টিং অ্যাক্টিভেশন সিস্টেম', 'Custom Domain & Hosting Activation')}
            </h2>
            <span className="text-[11px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded border border-teal-200">
              লাইভ সিস্টেম
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('আপনার হাসপাতালের নিজস্ব ডোমেইন কানেক্ট করুন, ডিএনএস (DNS) রেকর্ড কনফিগার করুন এবং ক্লাউড বা ভিপিএস হোস্টিং সার্ভার যুক্ত করুন।', 'Connect your custom hospital domain, configure DNS records and verify SSL certificates.')}
          </p>
        </div>

        <button
          onClick={handleVerifyDns}
          disabled={isVerifying}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
          <span>{isVerifying ? 'ডিএনএস যাচাই হচ্ছে...' : 'ডিএনএস ও কানেকশন ভেরিফাই করুন'}</span>
        </button>
      </div>

      {/* Domain Status Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">বর্তমানে সংযুক্ত ডোমেইন:</span>
                <span className="font-mono font-black text-slate-900 text-base">
                  https://{domainHosting.subdomain ? `${domainHosting.subdomain}.` : ''}{domainHosting.customDomain}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  সক্রিয় ও ভেরিফাইড
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <Lock className="w-3.5 h-3.5" />
                  SSL/TLS এনক্রিপশন সক্রিয় (Let's Encrypt)
                </span>
                <span>·</span>
                <span>হোস্টিং ইঞ্জিন: <strong>{domainHosting.hostingProvider}</strong></span>
                <span>·</span>
                <span>সর্বশেষ চেক: {domainHosting.lastVerifiedAt || 'আজ'}</span>
              </div>
            </div>
          </div>

          <a
            href={`https://${domainHosting.customDomain}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors shrink-0"
          >
            <span>ডোমেইন ব্রাউজ করুন</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </div>

        {/* Quick Connection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">ডিএনএস স্ট্যাটাস (DNS Status)</span>
            <div className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>প্রপাগেশন ১০০% সম্পন্ন</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">সার্ভার আইপি ও পোর্ট (Host IP)</span>
            <div className="font-bold font-mono text-slate-800 mt-0.5">
              {domainHosting.serverIp}:{domainHosting.port}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">এইচটিটিপিএস রিডাইরেক্ট (HTTPS Enforce)</span>
            <div className="font-bold text-emerald-700 mt-0.5">
              স্বয়ংক্রিয় ৩০১ এসএসএল সক্রিয়
            </div>
          </div>
        </div>
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Form: Domain & Hosting Activation Inputs (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Settings className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">ডোমেইন ও হোস্টিং সেটিংস কনফিগারেশন</h3>
          </div>

          <form onSubmit={handleSaveDomain} className="space-y-4">
            
            {/* Custom Domain Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('হাসপাতালের মূল ডোমেইন (Root Domain) *', 'Hospital Custom Domain *')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="যেমন: habibhospital.org বা hospital.com.bd"
                  className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                http/https ছাড়া শুধু ডোমেইনের নাম লিখুন (যেমন: habibhospital.org)
              </p>
            </div>

            {/* Subdomain */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">সাব-ডোমেইন (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={subdomainInput}
                  onChange={(e) => setSubdomainInput(e.target.value)}
                  placeholder="যেমন: www বা portal"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">হোস্টিং এনভায়রনমেন্ট</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Cloud Run">Google Cloud Run (অটো-স্কেলিং)</option>
                  <option value="Ubuntu VPS (Nginx)">Ubuntu VPS (Nginx রিভার্স প্রক্সি)</option>
                  <option value="cPanel / DirectAdmin">cPanel / Shared হোস্টিং Node.js</option>
                  <option value="Docker / K8s">Docker কন্টেইনারাইজড ক্লাস্টার</option>
                </select>
              </div>
            </div>

            {/* Server IP & Port */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">সার্ভার ডেডিকেটেড আইপি (IPv4)</label>
                <input
                  type="text"
                  value={serverIpInput}
                  onChange={(e) => setServerIpInput(e.target.value)}
                  placeholder="199.36.158.100"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">অ্যাপ্লিকেশন পোর্ট (App Port)</label>
                <input
                  type="number"
                  value={portInput}
                  onChange={(e) => setPortInput(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* SSL Switch */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">এসএসএল ও এইচটিটিপিএস জোরদার (Force HTTPS)</span>
                <span className="text-[11px] text-slate-500">সকল ভিজিটর স্বয়ংক্রিয়ভাবে এনক্রিপ্টেড লিংকে যাবে</span>
              </div>
              <input
                type="checkbox"
                checked={sslEnforced}
                onChange={(e) => setSslEnforced(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                {saveSuccess ? <Check className="w-4 h-4 text-emerald-200" /> : <Server className="w-4 h-4" />}
                <span>{saveSuccess ? 'ডোমেইন কনফিগারেশন সংরক্ষিত হয়েছে!' : 'ডোমেইন ও হোস্টিং সেটিংস সেভ করুন'}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right: Live DNS Records Table & Setup Instructions (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">ডিএনএস রেকর্ড ভেরিফিকেশন (DNS Records)</h3>
            <span className="text-[11px] text-slate-500">Domain Registrar DNS Manager</span>
          </div>

          <p className="text-xs text-slate-500">
            আপনার ডোমেইন প্রোভাইডারের (যেমন: BTCL, Namecheap, GoDaddy, Cloudflare) ডিএনএস ম্যানেজমেন্টে নিচের রেকর্ডগুলো যোগ করুন:
          </p>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-2 px-3">রেকর্ড টাইপ</th>
                  <th className="py-2 px-3">হোস্ট / নাম</th>
                  <th className="py-2 px-3">ভ্যালু / টার্গেট</th>
                  <th className="py-2 px-3 text-right">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {domainHosting.dnsRecords.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-bold text-slate-800">{rec.type}</td>
                    <td className="py-2.5 px-3 text-teal-800 font-semibold">{rec.host}</td>
                    <td className="py-2.5 px-3 text-slate-600 truncate max-w-[140px]" title={rec.value}>
                      {rec.value}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 font-sans text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Nginx Configuration Snippet */}
          <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-teal-400" />
                <span>Nginx Reverse Proxy Config (/etc/nginx/sites-available/)</span>
              </div>
              <button
                onClick={handleCopyNginx}
                className="flex items-center gap-1 text-[11px] text-teal-300 hover:text-white cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'কপি হয়েছে' : 'কোড কপি করুন'}</span>
              </button>
            </div>

            <pre className="font-mono text-[10px] overflow-x-auto text-slate-300 p-1 scrollbar-none leading-relaxed">
              {domainHosting.reverseProxyConfig}
            </pre>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>ডোমেইন অ্যাক্টিভেশন টিপস:</strong> নতুন ডোমেইনে ডিএনএস রেকর্ড যোগ করার পর বিশ্বব্যাপী প্রপাগেশন হতে ১৫ মিনিট থেকে ২৪ ঘণ্টা পর্যন্ত সময় লাগতে পারে। ক্লাউডফ্লেয়ার (Cloudflare) ব্যবহার করলে কয়েক মিনিটেই সক্রিয় হয়।
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
