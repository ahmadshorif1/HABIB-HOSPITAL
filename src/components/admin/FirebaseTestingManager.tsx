import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { 
  Flame, 
  CheckCircle2, 
  Activity, 
  ShieldCheck, 
  Database, 
  Users, 
  Key, 
  RefreshCw, 
  Save, 
  Check, 
  ExternalLink,
  Code2,
  Copy,
  Terminal,
  Lock
} from 'lucide-react';

export const FirebaseTestingManager: React.FC = () => {
  const { firebaseConfig, updateFirebaseConfig, testFirebaseConnection, currentUser, t } = useHospital();

  const [apiKey, setApiKey] = useState(firebaseConfig.apiKey);
  const [authDomain, setAuthDomain] = useState(firebaseConfig.authDomain);
  const [projectId, setProjectId] = useState(firebaseConfig.projectId);
  const [storageBucket, setStorageBucket] = useState(firebaseConfig.storageBucket);
  const [messagingSenderId, setMessagingSenderId] = useState(firebaseConfig.messagingSenderId);
  const [appId, setAppId] = useState(firebaseConfig.appId);
  const [measurementId, setMeasurementId] = useState(firebaseConfig.measurementId || 'G-TJH56BQ5NC');
  const [isTestingActive, setIsTestingActive] = useState(firebaseConfig.isTestingModeActive);

  const [isPinging, setIsPinging] = useState(false);
  const [pingLatency, setPingLatency] = useState<number | null>(42);
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateFirebaseConfig({
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
      measurementId,
      isTestingModeActive: isTestingActive,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handlePing = async () => {
    setIsPinging(true);
    const start = Date.now();
    await testFirebaseConnection();
    setPingLatency(Date.now() - start);
    setIsPinging(false);
  };

  const firebaseExportCode = `// Firebase Configuration (habib-hospital)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "${apiKey}",
  authDomain: "${authDomain}",
  projectId: "${projectId}",
  storageBucket: "${storageBucket}",
  messagingSenderId: "${messagingSenderId}",
  appId: "${appId}",
  measurementId: "${measurementId}"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);`;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {t('ফায়ারবেজ এক্টিভেশন ও টেস্টিং মোড কন্ট্রোল', 'Firebase Activation & Testing Mode Control')}
            </h2>
            <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
              টেস্টিং মোড সক্রিয়
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('ফায়ারবেজ অথেনটিকেশন (Firebase Auth) এবং স্যান্ডবক্স কানেকশন পরীক্ষা, টেস্টিং সাইনআপ/লগইন এবং ফায়ারস্টোর স্কিমা পর্যবেক্ষণ।', 'Manage Firebase Auth sandbox, test credentials, and real-time synchronization.')}
          </p>
        </div>

        <button
          onClick={handlePing}
          disabled={isPinging}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
          <span>{isPinging ? 'কানেকশন টেস্ট হচ্ছে...' : 'ফায়ারবেজ পিং ও কানেকশন টেস্ট'}</span>
        </button>
      </div>

      {/* Live Firebase Testing Status Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">ফায়ারবেজ প্রজেক্ট আইডি:</span>
                <span className="font-mono font-black text-slate-900 text-base">{firebaseConfig.projectId}</span>
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  সংযুক্ত ও প্রস্তুত
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="text-emerald-700 font-medium">
                  ল্যাটেন্সি: <strong>{pingLatency || 38} ms</strong>
                </span>
                <span>·</span>
                <span>টেস্টিং সাইনআপ মোড: <strong>সক্রিয় (Active)</strong></span>
                <span>·</span>
                <span>রেজিস্টার্ড টেস্ট একাউন্ট: <strong>{firebaseConfig.testUsersCount} টি</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">টেস্টিং মোড টগল:</span>
            <button
              onClick={() => {
                const next = !isTestingActive;
                setIsTestingActive(next);
                updateFirebaseConfig({ isTestingModeActive: next });
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${isTestingActive ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-200 text-slate-700'}`}
            >
              {isTestingActive ? 'সক্রিয় (ENABLED)' : 'নিষ্ক্রিয় (DISABLED)'}
            </button>
          </div>
        </div>

        {/* Feature summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Firebase Authentication</span>
            <div className="font-bold text-slate-800 mt-0.5">
              ইমেইল/পাসওয়ার্ড ও গুগল সাইনইন সিমুলেশন
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Firestore Collections</span>
            <div className="font-bold text-slate-800 mt-0.5">
              patients, appointments, ledger, hospital_meta
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">লগইন স্ক্রিন ইন্টিগ্রেশন</span>
            <div className="font-bold text-teal-700 mt-0.5">
              অথেনটিকেশন মডালে ফায়ারবেজ মোড সক্রিয়
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Firebase Config Editor (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Key className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">ফায়ারবেজ ক্রেডেনশিয়াল ও এনভায়রনমেন্ট</h3>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Firebase API Key</label>
              <input
                type="text"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project ID</label>
                <input
                  type="text"
                  required
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Auth Domain</label>
                <input
                  type="text"
                  required
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Storage Bucket</label>
                <input
                  type="text"
                  value={storageBucket}
                  onChange={(e) => setStorageBucket(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">App ID</label>
                <input
                  type="text"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                {isSaved ? <Check className="w-4 h-4 text-emerald-100" /> : <Save className="w-4 h-4" />}
                <span>{isSaved ? 'ফায়ারবেজ সেটিংস সংরক্ষিত হয়েছে!' : 'ফায়ারবেজ কনফিগারেশন আপডেট করুন'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Code Snippet & Security Rules (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">ফায়ারবেজ ইনিশিয়ালাইজেশন কোড (SDK Export)</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(firebaseExportCode);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              }}
              className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold hover:text-amber-800 cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'কপি সম্পন্ন' : 'কোড কপি করুন'}</span>
            </button>
          </div>

          <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl text-xs space-y-2">
            <pre className="font-mono text-[10px] overflow-x-auto text-amber-200 p-1 scrollbar-none leading-relaxed">
              {firebaseExportCode}
            </pre>
          </div>

          <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs space-y-1.5 text-teal-900">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>টেস্টিং সাইনআপ ও লগইন সুবিধা:</span>
            </div>
            <p className="text-[11px] text-teal-800/90 leading-relaxed">
              রোগী ও স্টাফরা এখন লগইন পপআপ থেকে সরাসরি <strong>"ফায়ারবেজ টেস্টিং মোড"</strong> সিলেক্ট করে একাউন্ট তৈরি করতে পারেন। এতে স্বয়ংক্রিয়ভাবে ফায়ারবেজ UID তৈরি হয়ে সেশন সংরক্ষিত থাকে।
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
