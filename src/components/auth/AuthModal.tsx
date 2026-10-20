import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { 
  ShieldCheck, 
  UserCheck, 
  X, 
  KeyRound, 
  Mail, 
  Lock, 
  Sparkles, 
  Building, 
  ArrowRight, 
  User,
  Flame,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalType, 
    setAuthModalType, 
    loginUser, 
    firebaseConfig,
    firebaseSignUp,
    firebaseSignIn,
    t, 
    settings 
  } = useHospital();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [authProviderType, setAuthProviderType] = useState<'standard' | 'firebase'>('firebase');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedStaffRole, setSelectedStaffRole] = useState<UserRole>('admin');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg(t('অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড প্রদান করুন', 'Please provide email and password'));
      return;
    }

    setIsSubmitting(true);

    try {
      if (authProviderType === 'firebase') {
        // Firebase Testing Mode Flow
        if (mode === 'signup') {
          const roleToAssign = authModalType === 'staff' ? selectedStaffRole : 'patient';
          await firebaseSignUp(email, password, roleToAssign, name);
        } else {
          await firebaseSignIn(email, password);
        }
      } else {
        // Standard Database Flow
        if (authModalType === 'staff') {
          loginUser(email, selectedStaffRole);
        } else {
          loginUser(email, 'patient');
        }
      }

      setIsAuthModalOpen(false);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || 'অথেনটিকেশন ব্যর্থ হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, role: UserRole) => {
    loginUser(demoEmail, role);
    setIsAuthModalOpen(false);
  };

  const handleFirebaseGoogleTest = async () => {
    setIsSubmitting(true);
    await firebaseSignIn('google.patient.test@gmail.com', 'testpass123');
    setIsSubmitting(false);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className={`p-6 border-b ${authModalType === 'staff' ? 'bg-slate-900 text-white' : 'bg-teal-700 text-white'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {authModalType === 'staff' ? (
                <ShieldCheck className="w-5 h-5 text-teal-400" />
              ) : (
                <UserCheck className="w-5 h-5 text-teal-200" />
              )}
              <h3 className="font-bold text-base tracking-tight">
                {authModalType === 'staff' 
                  ? t('অ্যাডমিন ও সাব-অ্যাডমিন স্পেশাল পোর্টাল', 'Admin & Sub-Admin Secure Portal')
                  : t('রোগী / গ্রাহক পোর্টাল সাইনইন', 'Patient & Client Portal Login')}
              </h3>
            </div>
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-1.5">
            {authModalType === 'staff'
              ? t('হাসপাতাল পরিচালনা, অডিট ও মেডিকেল ডাটাবেস এক্সেসের জন্য সুরক্ষিত প্রমাণীকরণ', 'Authorized medical staff, accountants, and hospital leadership only')
              : t('সহজ সিরিয়াল বুকিং, প্রেসক্রিপশন ডাউনলোড ও রিপোর্ট দেখতে লগইন করুন', 'Access appointment tokens, diagnostic history & digital prescriptions')}
          </p>

          {/* Switcher tabs */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px]">{t('পোর্টাল:', 'Portal:')}</span>
              <button
                onClick={() => { setAuthModalType('patient'); setErrorMsg(''); }}
                className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${authModalType === 'patient' ? 'bg-white text-teal-900 font-semibold' : 'text-slate-300 hover:text-white'}`}
              >
                {t('গ্রাহক / রোগী', 'Patient')}
              </button>
              <button
                onClick={() => { setAuthModalType('staff'); setErrorMsg(''); }}
                className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${authModalType === 'staff' ? 'bg-white text-slate-900 font-semibold' : 'text-slate-300 hover:text-white'}`}
              >
                {t('অ্যাডমিন / স্টাফ', 'Staff')}
              </button>
            </div>

            {/* Auth Provider Mode: Standard vs Firebase Testing */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setAuthProviderType(authProviderType === 'firebase' ? 'standard' : 'firebase')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  authProviderType === 'firebase' 
                    ? 'bg-amber-400 text-slate-950 shadow-xs' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                title="ফায়ারবেজ টেস্টিং মোড টগল"
              >
                <Flame className="w-3 h-3 text-amber-900" />
                <span>{authProviderType === 'firebase' ? 'Firebase Auth Mode' : 'Standard Mode'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* Firebase Testing Mode Badge */}
          {authProviderType === 'firebase' && (
            <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>ফায়ারবেজ টেস্টিং মোড:</strong> {firebaseConfig.projectId}
                </span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                সংযুক্ত
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('পূর্ণ নাম', 'Full Name')}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: ডা. মাহফুজ বা আব্দুর রহিম"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('ইমেইল অ্যাড্রেস', 'Email Address')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={authModalType === 'staff' ? "admin@habibhospital.com" : "patient@gmail.com"}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('পাসওয়ার্ড', 'Password')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            {/* Staff role selector for signups */}
            {authModalType === 'staff' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('স্টাফ পদবী / রোল নির্বাচন করুন', 'Staff Role / Access Level')}
                </label>
                <select
                  value={selectedStaffRole}
                  onChange={(e) => setSelectedStaffRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                >
                  <option value="admin">সুপার এডমিন (পূর্ণ হাসপাতাল ও অডিট নিয়ন্ত্রণ)</option>
                  <option value="subadmin_doctor">সাব-এডমিন: ডক্টর (ইএমআর, প্রেসক্রিপশন ও রোগী দেখা)</option>
                  <option value="subadmin_reception">সাব-এডমিন: রিসেপশন (নতুন রোগী ও সিরিয়াল বুকিং)</option>
                  <option value="subadmin_accountant">সাব-এডমিন: হিসাবরক্ষক (ক্যাশ কালেকশন ও হিসাব অডিট)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                authProviderType === 'firebase'
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                  : authModalType === 'staff' 
                    ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20' 
                    : 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20'
              }`}
            >
              <span>
                {isSubmitting
                  ? 'প্রসেসিং হচ্ছে...'
                  : authProviderType === 'firebase'
                    ? (mode === 'login' ? 'ফায়ারবেজ সাইনইন' : 'ফায়ারবেজ একাউন্ট তৈরি করুন')
                    : (mode === 'login' ? t('লগইন সম্পন্ন করুন', 'Sign In') : t('নতুন একাউন্ট তৈরি করুন', 'Create Account'))}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Firebase Google Test Sign-in */}
          {authProviderType === 'firebase' && (
            <div className="mt-3">
              <button
                type="button"
                onClick={handleFirebaseGoogleTest}
                disabled={isSubmitting}
                className="w-full py-2 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google দিয়ে ফায়ারবেজ টেস্টিং সাইনইন</span>
              </button>
            </div>
          )}

          {/* Quick Demo Access Bar */}
          <div className="mt-5 pt-4 border-t border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {t('তাৎক্ষণিক ডেমো লগইন (১-ক্লিক পরীক্ষা):', 'Instant Demo Logins (1-Click Test):')}
            </div>
            
            {authModalType === 'staff' ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@habibhospital.com', 'admin')}
                  className="p-2 border border-slate-200 rounded-lg hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all cursor-pointer"
                >
                  <div className="font-bold text-slate-800">Super Admin</div>
                  <div className="text-[10px] text-slate-500">পরিচালক / পূর্ণ এক্সেস</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('doctor.mahfuz@habibhospital.com', 'subadmin_doctor')}
                  className="p-2 border border-slate-200 rounded-lg hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all cursor-pointer"
                >
                  <div className="font-bold text-slate-800">Doctor Portal</div>
                  <div className="text-[10px] text-slate-500">ডা. মাহফুজ (কার্ডিওলজিস্ট)</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('reception@habibhospital.com', 'subadmin_reception')}
                  className="p-2 border border-slate-200 rounded-lg hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all cursor-pointer"
                >
                  <div className="font-bold text-slate-800">Reception Desk</div>
                  <div className="text-[10px] text-slate-500">ফাতেমা আক্তার (সিরিয়াল)</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('accounts@habibhospital.com', 'subadmin_accountant')}
                  className="p-2 border border-slate-200 rounded-lg hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all cursor-pointer"
                >
                  <div className="font-bold text-slate-800">Accounts Audit</div>
                  <div className="text-[10px] text-slate-500">কামাল হোসেন (হিসাবরক্ষক)</div>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('patient.rahim@gmail.com', 'patient')}
                  className="p-2 border border-slate-200 rounded-lg hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-800">আব্দুর রহিম (পুরাতন রোগী)</div>
                    <div className="text-[10px] text-slate-500">আইডি: HH-2026-0101 · ফোন: 01711223344</div>
                  </div>
                  <span className="text-[11px] font-semibold text-teal-600">লগইন করুন →</span>
                </button>
              </div>
            )}
          </div>

          {/* Toggle between login / signup */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-xs text-teal-700 hover:text-teal-800 font-medium cursor-pointer"
            >
              {mode === 'login'
                ? t('নতুন একাউন্ট প্রয়োজন? এখানে সাইনআপ করুন', 'Need a new account? Register here')
                : t('পূর্বের একাউন্ট আছে? সাইনইন করুন', 'Already have an account? Sign in')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
