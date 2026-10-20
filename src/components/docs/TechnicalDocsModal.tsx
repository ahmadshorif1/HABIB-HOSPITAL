import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { 
  BookOpen, 
  X, 
  Database, 
  Key, 
  Code2, 
  Sparkles, 
  CheckCircle2, 
  Server, 
  FileCode, 
  Copy, 
  Layers,
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';

export const TechnicalDocsModal: React.FC = () => {
  const { isDocsModalOpen, setIsDocsModalOpen, settings, t } = useHospital();
  const [activeTab, setActiveTab] = useState<'ownership' | 'schema' | 'roadmap' | 'api' | 'telegram'>('ownership');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isDocsModalOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight">
                  {settings.name} - টেকনিক্যাল ডকুমেন্টেশন ও আর্কিটেকচার গাইড
                </h3>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-400/30">
                  vibe96 Compliance
                </span>
              </div>
              <p className="text-xs text-slate-400">
                মালিকানা পরিবর্তন গাইড, স্কেলেবল ডাটাবেস স্কিমা, এপিআই ডিজাইন ও ভবিষ্যৎ রোডম্যাপ
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDocsModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="bg-slate-100 p-2 flex items-center gap-1 border-b border-slate-200 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('ownership')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${activeTab === 'ownership' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            ১. মালিকানা পরিবর্তন ও রিসোর্স আপডেট
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${activeTab === 'schema' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            ২. স্কেলেবল ডাটাবেস স্কিমা ডিজাইন
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${activeTab === 'roadmap' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            ৩. প্রস্তাবিত ভবিষ্যৎ ফিচার ও রোডম্যাপ
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${activeTab === 'api' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            ৪. এআই ও সিকিউরিটি আর্কিটেকচার
          </button>
          <button
            onClick={() => setActiveTab('telegram')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${activeTab === 'telegram' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>৫. টেলিগ্রাম বট টোকেন সমাধান</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700 leading-relaxed">
          
          {/* TAB 1: OWNERSHIP TRANSFER GUIDE */}
          {activeTab === 'ownership' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  রিসোর্স কোড আপডেট করে মালিকানা পরিবর্তনের বিস্তারিত নির্দেশিকা
                </h4>
                <p className="text-slate-500 mt-1">
                  অ্যাপ্লিকেশনটি অন্য কোনো হাসপাতাল, ক্লিনিক বা ক্লায়েন্টের নামে স্থানান্তর (White-labeling / Ownership Transfer) করতে নিচের ফাইল ও স্থানগুলোতে আপডেট করতে হবে:
                </p>
              </div>

              {/* Table of files to update */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">ফাইলের পাথ (File Path)</th>
                      <th className="p-3">কী কী আপডেট করতে হবে (Fields to Update)</th>
                      <th className="p-3">উদ্দেশ্য (Purpose)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-mono text-teal-800 font-semibold">/src/data/mockData.ts</td>
                      <td className="p-3">
                        <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">initialHospitalSettings</code> অবজেক্টের নাম, স্লোগান, ঠিকানা, হটলাইন, ইমার্জেন্সি নম্বর, পরিচালক নাম, এবং কারেন্সি প্রতীক।
                      </td>
                      <td className="p-3 text-slate-600">ডিফল্ট হাসপাতালের ব্র্যান্ডিং ও যোগাযোগের তথ্য নির্ধারণ।</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-teal-800 font-semibold">/index.html</td>
                      <td className="p-3">
                        <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">&lt;title&gt;</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">meta description</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">og:title</code>
                      </td>
                      <td className="p-3 text-slate-600">এসইও (SEO), ব্রাউজার ট্যাব টাইটেল এবং সোশ্যাল মিডিয়া প্রিভিউ।</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-teal-800 font-semibold">/metadata.json</td>
                      <td className="p-3">
                        <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">"name"</code> এবং <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">"description"</code>
                      </td>
                      <td className="p-3 text-slate-600">গুগল এআই স্টুডিও ও ক্লাউড রান ডিপ্লয়মেন্ট মেটাডাটা।</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-teal-800 font-semibold">/server.ts</td>
                      <td className="p-3">
                        <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">fallbackText</code> ও <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">systemInstruction</code>-এ হাসপাতালের নাম
                      </td>
                      <td className="p-3 text-slate-600">এআই চ্যাটবটের ব্যাকএন্ড উত্তর এবং ডিফল্ট নলেজ বেস।</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-teal-800 font-semibold">/.env (বা পরিবেশ ভেরিয়েবল)</td>
                      <td className="p-3">
                        <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">GEMINI_API_KEY</code>, পেমেন্ট গেটওয়ে মার্চেন্ট আইডি (bKash/Nagad/SSLCommerz)
                      </td>
                      <td className="p-3 text-slate-600">নতুন মালিকের এপিআই কি ও ব্যাংক মার্চেন্ট একাউন্ট লিংক।</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-teal-800 font-semibold">এডমিন প্যানেল সেটিংস UI</td>
                      <td className="p-3">
                        এডমিন লগইন করে সরাসরি <strong>হাসপাতাল সেটিংস</strong> বাটন থেকে লাইভ নাম ও ঠিকানা পরিবর্তন করা যায়।
                      </td>
                      <td className="p-3 text-slate-600">কোড এডিট না করেই ব্রাউজারে ইনস্ট্যান্ট নাম ও স্লোগান আপডেট।</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Code snippet example */}
              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] relative">
                <span className="text-slate-400 block mb-2">// উদাহরণ: src/data/mockData.ts এ নতুন হাসপাতাল তথ্য বসানোর কোড</span>
                <pre>{`export const initialHospitalSettings = {
  name: "আপনার নতুন হাসপাতালের নাম", // যেমন: "POPULAR SPECIALIZED HOSPITAL"
  slogan: "আপনার স্লোগান",
  hotline: "+880 1XXXXXXXXX",
  address: "হাসপাতালের পুর্ণ ঠিকানা, ঢাকা, বাংলাদেশ",
  directorName: "পরিচালকের নাম ও পদবী",
  currency: "৳"
};`}</pre>
              </div>
            </div>
          )}

          {/* TAB 2: SCALABLE DATABASE SCHEMA */}
          {activeTab === 'schema' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  লাখো রোগীর ডেটার জন্য স্কেলেবল রিলেশনাল ডাটাবেস স্কিমা (PostgreSQL Architecture)
                </h4>
                <p className="text-slate-500 mt-1">
                  একটি বড় আধুনিক হাসপাতালের জন্য ইনডেক্সিং, পার্টিশনিং এবং রিলেশনশিপসহ সম্পূর্ণ প্রডাকশন-রেডি স্কিমা ডিজাইন:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Table: patients */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px]">
                  <div className="font-bold text-teal-800 mb-2 border-b pb-1 font-sans text-xs">
                    TABLE: patients (রোগীদের কেন্দ্রীয় তথ্যভান্ডার)
                  </div>
                  <ul className="space-y-1 text-slate-700">
                    <li>• <strong className="text-slate-900">id:</strong> UUID / VARCHAR(32) PRIMARY KEY</li>
                    <li>• <strong className="text-slate-900">mrn_number:</strong> VARCHAR(20) UNIQUE INDEX</li>
                    <li>• <strong className="text-slate-900">full_name:</strong> VARCHAR(120) NOT NULL</li>
                    <li>• <strong className="text-slate-900">phone:</strong> VARCHAR(20) INDEX</li>
                    <li>• <strong className="text-slate-900">nid_number:</strong> VARCHAR(30) UNIQUE INDEX</li>
                    <li>• <strong className="text-slate-900">blood_group:</strong> ENUM ('A+', 'B+', 'O+', ...)</li>
                    <li>• <strong className="text-slate-900">emergency_contact:</strong> VARCHAR(50)</li>
                    <li>• <strong className="text-slate-900">chronic_illnesses:</strong> TEXT[]</li>
                    <li>• <strong className="text-slate-900">allergies:</strong> TEXT[]</li>
                    <li>• <strong className="text-slate-900">created_at:</strong> TIMESTAMP DEFAULT NOW()</li>
                  </ul>
                </div>

                {/* Table: appointments */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px]">
                  <div className="font-bold text-teal-800 mb-2 border-b pb-1 font-sans text-xs">
                    TABLE: appointments (সিরিয়াল ও শিডিউলিং)
                  </div>
                  <ul className="space-y-1 text-slate-700">
                    <li>• <strong className="text-slate-900">id:</strong> UUID PRIMARY KEY</li>
                    <li>• <strong className="text-slate-900">patient_id:</strong> UUID REFERENCES patients(id)</li>
                    <li>• <strong className="text-slate-900">doctor_id:</strong> UUID REFERENCES doctors(id)</li>
                    <li>• <strong className="text-slate-900">serial_number:</strong> INTEGER NOT NULL</li>
                    <li>• <strong className="text-slate-900">appointment_date:</strong> DATE INDEX</li>
                    <li>• <strong className="text-slate-900">status:</strong> ENUM('SCHEDULED', 'IN_CONSULTATION', 'COMPLETED')</li>
                    <li>• <strong className="text-slate-900">payment_status:</strong> ENUM('PAID', 'UNPAID')</li>
                    <li>• <strong className="text-slate-900">fee_amount:</strong> DECIMAL(10,2)</li>
                    <li>• <strong className="text-slate-900">transaction_id:</strong> VARCHAR(50)</li>
                  </ul>
                </div>

                {/* Table: clinical_visits & prescriptions */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px]">
                  <div className="font-bold text-teal-800 mb-2 border-b pb-1 font-sans text-xs">
                    TABLE: clinical_visits & prescriptions (ইএমআর ও চিকিৎসা)
                  </div>
                  <ul className="space-y-1 text-slate-700">
                    <li>• <strong className="text-slate-900">id:</strong> UUID PRIMARY KEY</li>
                    <li>• <strong className="text-slate-900">patient_id:</strong> UUID REFERENCES patients(id)</li>
                    <li>• <strong className="text-slate-900">doctor_id:</strong> UUID REFERENCES doctors(id)</li>
                    <li>• <strong className="text-slate-900">bp_systolic / bp_diastolic:</strong> INT</li>
                    <li>• <strong className="text-slate-900">pulse / temp / spo2 / weight:</strong> VARCHAR(20)</li>
                    <li>• <strong className="text-slate-900">chief_complaint:</strong> TEXT</li>
                    <li>• <strong className="text-slate-900">icd11_diagnosis:</strong> VARCHAR(100)</li>
                    <li>• <strong className="text-slate-900">prescription_items:</strong> JSONB (Medicine, dosage, timing)</li>
                    <li>• <strong className="text-slate-900">advised_lab_tests:</strong> JSONB</li>
                    <li>• <strong className="text-slate-900">next_follow_up:</strong> DATE</li>
                  </ul>
                </div>

                {/* Table: financial_ledger & audit */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px]">
                  <div className="font-bold text-teal-800 mb-2 border-b pb-1 font-sans text-xs">
                    TABLE: financial_ledger (অডিট ও নির্ভুল হিসাবরক্ষণ)
                  </div>
                  <ul className="space-y-1 text-slate-700">
                    <li>• <strong className="text-slate-900">id:</strong> BIGSERIAL PRIMARY KEY</li>
                    <li>• <strong className="text-slate-900">transaction_type:</strong> ENUM ('INCOME', 'EXPENSE')</li>
                    <li>• <strong className="text-slate-900">category:</strong> VARCHAR(50) INDEX</li>
                    <li>• <strong className="text-slate-900">amount:</strong> DECIMAL(12,2) NOT NULL</li>
                    <li>• <strong className="text-slate-900">payment_method:</strong> ENUM ('bKash', 'Nagad', 'Cash', 'Card')</li>
                    <li>• <strong className="text-slate-900">patient_id:</strong> UUID REFERENCES patients(id)</li>
                    <li>• <strong className="text-slate-900">recorded_by_user_id:</strong> UUID NOT NULL</li>
                    <li>• <strong className="text-slate-900">verified:</strong> BOOLEAN DEFAULT TRUE</li>
                    <li>• <strong className="text-slate-900">created_at:</strong> TIMESTAMP WITH TIME ZONE</li>
                  </ul>
                </div>

              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs">
                <strong>স্কেলেবিলিটি অপটিমাইজেশন টিপস:</strong>
                <p className="mt-1">
                  ১. <code className="font-mono font-bold">phone</code> এবং <code className="font-mono font-bold">mrn_number</code> এর ওপর B-Tree Index থাকায় ১০ লাখ রোগীর মধ্যেও ১ মিলি সেকেন্ডে পুরাতন রোগীর রেকর্ড খুঁজে পাওয়া যায়।
                  ২. আর্থিক লেজারে <code className="font-mono font-bold">created_at</code> দিয়ে মাসিক বা বাৎসরিক টেবিল পার্টিশনিং (Partition by Range) সমর্থন করে।
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: FUTURE ROADMAP & ADDITIONS */}
          {activeTab === 'roadmap' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  ভবিষ্যতে হাসপাতাল অ্যাপে যেসকল অত্যাধুনিক ফিচার যুক্ত করা প্রয়োজন (Feature Roadmap)
                </h4>
                <p className="text-slate-500 mt-1">
                  অ্যাপ্লিকেশনটিকে আন্তর্জাতিক মানের পূর্ণাঙ্গ হসপিটাল ইনফরমেশন ম্যানেজমেন্ট সিস্টেম (HIMS) এ রূপান্তরের সুস্পষ্ট প্ল্যান:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">১</span>
                    <span>টেলিমেডিসিন ও ভিডিও কনসালটেশন (WebRTC)</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    রোগী ঘরে বসেই সরাসরি ডাক্তারের সাথে এইচডি এনক্রিপ্টেড ভিডিও কলে কথা বলে চিকিৎসা নিতে পারবেন। প্রেসক্রিপশন সরাসরি স্ক্রিনে তৈরি হবে।
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">২</span>
                    <span>এসএমএস ও হোয়াটসঅ্যাপ ওটিপি গেটওয়ে (Bulk SMS)</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    সিরিয়াল বুকিং নিশ্চিত হলে স্বয়ংক্রিয় এসএমএস যাবে: "আপনার সিরিয়াল #০৫, আনুমানিক সময় ৫:৩০ PM, রুম ৪০২"। এতে হাসপাতালে রোগীদের দীর্ঘ লাইন এড়ানো যাবে।
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">৩</span>
                    <span>ফার্মেসি বারকোড ও ইনভেন্টরি স্টক অ্যালার্ট</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    হাসপাতাল ফার্মেসির ঔষধের মেয়াদ উত্তীর্ণের অ্যালার্ট, বারকোড স্ক্যানার দিয়ে ড্রাগ বিক্রয় ও স্বয়ংক্রিয় স্টক কাউন্ট।
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">৪</span>
                    <span>আইসিইউ ও টেলিমেট্রি পেশেন্ট মনিটর আইওটি (IoT)</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    ভর্তি রোগীদের হার্ট রেট ও অক্সিজেন স্যাচুরেশন ড্রপ করলে সরাসরি ডিউটি ডাক্তারের মোবাইল নোটিফিকেশনে লাল এলার্ম বাজবে।
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">৫</span>
                    <span>অ্যাম্বুলেন্স লাইভ জিপিএস ট্র্যাকিং (Google Maps)</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    জরুরী প্রয়োজনে রোগী বা রোগীর আত্মীয় হাসপাতালের অ্যাম্বুলেন্সের লাইভ অবস্থান দেখতে পারবেন এবং ড্রাইভারকে কল দিতে পারবেন।
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">৬</span>
                    <span>HL7 ও FHIR আন্তর্জাতিক মেডিকেল স্ট্যান্ডার্ড</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    অন্য কোনো ডায়াগনস্টিক ল্যাব বা দেশের বাইরের হাসপাতাল থেকে রিপোর্ট ট্রান্সফারের জন্য গ্লোবাল মেডিকেল ইন্টারঅপারেবিলিটি।
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: API & SECURITY */}
          {activeTab === 'api' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  সিস্টেম আর্কিটেকচার, সিকিউরিটি ও এআই ইন্টিগ্রেশন
                </h4>
                <p className="text-slate-500 mt-1">
                  অ্যাপ্লিকেশনটিতে জেমিনি এআই ও সিকিউরিটি কিভাবে বাস্তবায়িত হয়েছে:
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>গ্রাহক ও এডমিন প্যানেল পৃথকীকরণ নীতি:</span>
                </div>
                <p className="text-slate-600">
                  ক্লায়েন্ট বা রোগীরা কেবলমাত্র তাদের নিজস্ব বুকিং, ডক্টর তালিকা, টেস্ট ফি ও স্বাস্থ্য হিস্ট্রি দেখতে পারেন। এডমিন প্যানেলের কোনো ইউআরএল বা কন্ট্রোল রোগী সেশনে রেন্ডার হয় না। বিশেষ প্রমাণীকরণ ছাড়া অভ্যন্তরীণ লেজার বা অডিট ডেটা পুরোপুরি সুরক্ষিত।
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Google GenAI SDK (Gemini 3.8 Flash):</span>
                </div>
                <p className="text-slate-600">
                  সার্ভার সাইড প্রক্সি <code className="font-mono text-teal-800">/api/ai/chat</code> দিয়ে চালিত, যা নিরাপদভাবে সিস্টেম প্রম্পট ও স্বাস্থ্য ট্রায়াজ পরিচালনা করে। কোনো সিক্রেট কি ব্রাউজারে প্রকাশিত হয় না।
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: TELEGRAM BOT INTEGRATION SOLUTION */}
          {activeTab === 'telegram' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Send className="w-4 h-4 text-sky-600" />
                  <span>টেলিগ্রাম বট টোকেনের মাধ্যমে এআই চ্যাটবট পরিচালনার পূর্ণাঙ্গ সমাধান</span>
                </h4>
                <p className="text-slate-500 mt-1">
                  টেলিগ্রাম বট এপিআই (Bot API) এবং গুগল জেমিনি এআই-এর সমন্বয়ে কীভাবে {settings.name}-এর সার্বক্ষণিক এআই স্বাস্থ্য সহকারী পরিচালিত হয় তার প্রযুক্তিগত সমাধান ও স্থাপত্য নির্দেশিকা।
                </p>
              </div>

              {/* Step 1 & 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">ধাপ ১: বট টোকেন সংগ্রহ</span>
                  <h5 className="font-bold text-slate-900 text-xs">@BotFather থেকে টোকেন জেনারেশন</h5>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600">
                    <li>টেলিগ্রামে সার্চ করুন: <strong className="text-slate-800">@BotFather</strong></li>
                    <li>কমান্ড পাঠান: <code className="bg-slate-200 px-1 py-0.2 rounded font-mono">/newbot</code></li>
                    <li>বটের নাম দিন: যেমন <span className="font-semibold">{settings.name} Assistant</span></li>
                    <li>ইউজারনেম দিন (যা _bot দিয়ে শেষ হতে হবে): যেমন <span className="font-mono text-sky-700">habib_hospital_bot</span></li>
                    <li>BotFather আপনাকে একটি HTTP API Token প্রদান করবে (যেমন: <code className="font-mono text-[10px] bg-white px-1 py-0.5 border rounded">7123456789:ABCDef...</code>)।</li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">ধাপ ২: ওয়েবহুক ও ইভেন্ট রিসিভার</span>
                  <h5 className="font-bold text-slate-900 text-xs">সার্ভারে রিয়েল-টাইম ওয়েবহুক রেজিস্ট্রি</h5>
                  <p className="text-[11px] text-slate-600">
                    লং-পোলিং এর চেয়ে ক্লাউড সার্ভারে <strong>Webhook আর্কিটেকচার</strong> শতগুণ বেশি দ্রুত ও সার্ভার রিসোর্স-সাশ্রয়ী।
                  </p>
                  <div className="p-2 bg-slate-900 text-emerald-400 font-mono text-[10px] rounded">
                    POST https://api.telegram.org/bot&lt;TOKEN&gt;/setWebhook?url=https://&lt;YOUR_DOMAIN&gt;/api/telegram/webhook?token=&lt;TOKEN&gt;
                  </div>
                  <p className="text-[10px] text-slate-500">
                    এডমিন প্যানেলের <strong>"টেলিগ্রাম বট টোকেন"</strong> ট্যাব থেকে ১-ক্লিকেই এই ওয়েবহুক সেট ও টেস্ট করা যায়।
                  </p>
                </div>
              </div>

              {/* Architecture Explanation */}
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-3 font-mono text-[11px]">
                <div className="flex items-center justify-between text-xs text-sky-400 font-bold border-b border-slate-800 pb-2">
                  <span>টেলিগ্রাম ও জেমিনি এআই ডাটা-ফ্লো পাইপলাইন</span>
                  <span className="text-[10px] text-slate-400 font-normal">Express + Telegram Webhook + Gemini 3.8 Flash</span>
                </div>
                <div className="space-y-1.5 text-slate-300 leading-relaxed text-[10px]">
                  <div>১. [Telegram User] ──(পাঠায়)──► Telegram Cloud Server</div>
                  <div>২. Telegram Server ──(POST Webhook)──► Hospital Server (/api/telegram/webhook)</div>
                  <div>৩. Hospital Backend ──(ইন্টেলিজেন্ট প্রসেসিং)──► Gemini 3.8 Flash Triage Engine</div>
                  <div>৪. Hospital Backend ──(POST sendMessage)──► Telegram API (ইনলাইন সিরিয়াল বাটন সহ)</div>
                  <div>৫. Telegram User ──(তাত্ক্ষণিক উত্তর ও ওপিডি লিংক পান)──► 100% স্বয়ংক্রিয় ২৪/৭ সেবা</div>
                </div>
              </div>

              {/* Supported Bot Commands */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 text-xs">স্বয়ংক্রিয় বট কমান্ডসমূহ (Commands Supported):</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <code className="font-bold text-sky-700">/start & /help</code>
                    <p className="text-slate-500 text-[10px] mt-0.5">বটের স্বাগতম বার্তা ও সকল সুবিধার গাইডলাইন।</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <code className="font-bold text-teal-700">/doctors</code>
                    <p className="text-slate-500 text-[10px] mt-0.5">সকল বিশেষজ্ঞ ডাক্তারের তালিকা, ফি ও বসার সময়সূচি।</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <code className="font-bold text-emerald-700">/serial</code>
                    <p className="text-slate-500 text-[10px] mt-0.5">অনলাইন সিরিয়াল বুকিং ও ডিজিটাল পেমেন্ট লিংক।</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <code className="font-bold text-rose-700">/hotline & /emergency</code>
                    <p className="text-slate-500 text-[10px] mt-0.5">২৪ ঘণ্টা জরুরি হটলাইন, অ্যাম্বুলেন্স ও ঠিকানা।</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <code className="font-bold text-indigo-700">/tests & /lab</code>
                    <p className="text-slate-500 text-[10px] mt-0.5">সিবিসি, লিপিড প্রোফাইল, ইউএসজি সহ ল্যাব টেস্টের ফি।</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <code className="font-bold text-amber-700">/beds & /cabin</code>
                    <p className="text-slate-500 text-[10px] mt-0.5">ভিআইপি কেবিন ও আইসিইউ বেডের তাৎক্ষণিক অবস্থা।</p>
                  </div>
                </div>
              </div>

              {/* Free-form Medical AI Triaging */}
              <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-teal-950 text-xs">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>ফ্রি-ফর্ম টেক্সট ও লক্ষণ ট্রায়াজ (Gemini 3.8 Flash):</span>
                </div>
                <p className="text-[11px] text-teal-900 leading-relaxed">
                  রোগী যেকোনো ভাষায় (বাংলা বা ইংরেজি) তাদের শারীরিক সমস্যার কথা লিখলে (যেমন: <em>"গত দুই দিন ধরে বুকে অস্বস্তি ও রাতে শ্বাসকষ্ট হচ্ছে"</em>), এআই ক্লিনিক্যাল গাইডলাইন অনুযায়ী সম্ভাব্য বিভাগ (কার্ডিওলজিস্ট/মেডিসিন) সুপারিশ করবে, রেড-ফ্ল্যাগ অ্যালার্ট দিবে এবং সরাসরি ওয়েবসাইটে সিরিয়াল নিশ্চিত করার বাটন প্রদান করবে।
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {settings.name} Engineering Documentation · Fully Scalable Architecture
          </span>
          <button
            onClick={() => setIsDocsModalOpen(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            বুঝেছি, বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
