import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Building2, X, Save, RotateCcw, Check, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HospitalSettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, t } = useHospital();

  const [name, setName] = useState(settings.name);
  const [slogan, setSlogan] = useState(settings.slogan);
  const [address, setAddress] = useState(settings.address);
  const [hotline, setHotline] = useState(settings.hotline);
  const [emergencyPhone, setEmergencyPhone] = useState(settings.emergencyPhone);
  const [email, setEmail] = useState(settings.email);
  const [directorName, setDirectorName] = useState(settings.directorName);
  const [currency, setCurrency] = useState(settings.currency);
  const [noticeBanner, setNoticeBanner] = useState(settings.noticeBanner || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      name,
      slogan,
      address,
      hotline,
      emergencyPhone,
      email,
      directorName,
      currency,
      noticeBanner,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    setName('HABIB HOSPITAL');
    setSlogan('সেবাই আমাদের ব্রত, আধুনিক চিকিৎসায় আপনার বিশ্বস্ত আশ্রয়');
    setHotline('+880 1712-345678');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">{t('হাসপাতাল সেটিংস ও মালিকানা কনফিগারেশন', 'Hospital Settings & Branding')}</h3>
              <p className="text-xs text-slate-300">নাম পরিবর্তন, যোগাযোগের তথ্য ও রসিদ হেডার হালনাগাদ</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Hospital Name (Default: HABIB HOSPITAL, user can update) */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              {t('হাসপাতালের নাম (Hospital Name) *', 'Hospital Name *')}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="HABIB HOSPITAL"
              className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              এটি পরিবর্তন করলে তাৎক্ষণিকভাবে সমগ্র ওয়েবসাইট, হেডার, মানি রসিদ ও প্রেসক্রিপশনে স্বয়ংক্রিয়ভাবে আপডেট হবে।
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              স্লোগান / ট্যাগলাইন (Slogan)
            </label>
            <input
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              placeholder="সেবাই আমাদের ব্রত..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">২৪/৭ জরুরী হটলাইন</label>
              <input
                type="text"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">অ্যাম্বুলেন্স / ইমার্জেন্সি ফোন</label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">হাসপাতালের পূর্ণ ঠিকানা</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ব্যবস্থাপনা পরিচালক / সিইও নাম</label>
              <input
                type="text"
                value={directorName}
                onChange={(e) => setDirectorName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">কারেন্সি প্রতীক (Currency)</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-bold text-center focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">হেডার জরুরি নোটিশ ব্যানার</label>
            <textarea
              value={noticeBanner}
              onChange={(e) => setNoticeBanner(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ডিফল্ট নাম রিসেট করুন</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-200" /> : <Save className="w-4 h-4" />}
              <span>{isSaved ? 'সংরক্ষিত হয়েছে!' : 'সেটিংস সেভ করুন'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
