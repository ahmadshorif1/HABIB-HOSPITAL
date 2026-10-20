import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { 
  Users, 
  CalendarCheck, 
  Wallet, 
  BedDouble, 
  TrendingUp, 
  Activity, 
  Settings, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Printer, 
  PhoneCall, 
  ShieldCheck,
  Stethoscope,
  Building
} from 'lucide-react';
import { PatientRecords } from './PatientRecords';
import { AccountsAudit } from './AccountsAudit';
import { BedCabinManagement } from './BedCabinManagement';
import { HospitalSettingsModal } from './HospitalSettingsModal';
import { DomainHostingManager } from './DomainHostingManager';
import { FirebaseTestingManager } from './FirebaseTestingManager';
import { TelegramBotManager } from './TelegramBotManager';
import { Globe, Flame, Send as SendIcon } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    settings, 
    currentUser, 
    adminView, 
    setAdminView, 
    patients, 
    appointments, 
    updateAppointmentStatus, 
    payAppointment,
    doctors, 
    beds, 
    getLedgerSummary, 
    t 
  } = useHospital();

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [appointmentSearch, setAppointmentSearch] = useState('');

  const summary = getLedgerSummary();
  const availableBeds = beds.filter(b => b.status === 'AVAILABLE').length;

  // Today's appointments
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => {
    const matchesSearch = a.patientName.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      a.patientPhone.includes(appointmentSearch) ||
      a.id.toLowerCase().includes(appointmentSearch.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Sub-header Navigation for Staff */}
      <div className="bg-white border-b border-slate-200 sticky top-14.5 z-30">
        <div className="container mx-auto px-4 flex items-center justify-between overflow-x-auto py-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setAdminView('dashboard')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${adminView === 'dashboard' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              {t('মূল ড্যাশবোর্ড', 'Overview')}
            </button>
            <button
              onClick={() => setAdminView('patients')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${adminView === 'patients' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              {t('সকল রোগী ও ইএমআর (EMR)', 'Patients & EMR')}
            </button>
            <button
              onClick={() => setAdminView('audit')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${adminView === 'audit' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              {t('হিসাব ও অডিট লেজার', 'Accounts & Audit')}
            </button>
            <button
              onClick={() => setAdminView('beds')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${adminView === 'beds' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              {t('কেবিন ও আইসিইউ বেড', 'Cabins & ICU')}
            </button>
            <button
              onClick={() => setAdminView('domain_hosting')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${adminView === 'domain_hosting' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t('ডোমেইন ও হোস্টিং', 'Domain & Hosting')}</span>
            </button>
            <button
              onClick={() => setAdminView('firebase_testing')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${adminView === 'firebase_testing' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{t('ফায়ারবেজ টেস্টিং', 'Firebase Sandbox')}</span>
            </button>
            <button
              onClick={() => setAdminView('telegram_bot')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${adminView === 'telegram_bot' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              <SendIcon className="w-3.5 h-3.5" />
              <span>{t('টেলিগ্রাম বট টোকেন', 'Telegram Bot')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-slate-600" />
                <span>{t('হাসপাতাল সেটিংস ও নাম পরিবর্তন', 'Hospital Settings')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 py-6">

        {/* View Switcher based on adminView */}
        {adminView === 'patients' && <PatientRecords />}
        {adminView === 'audit' && <AccountsAudit />}
        {adminView === 'beds' && <BedCabinManagement />}
        {adminView === 'domain_hosting' && <DomainHostingManager />}
        {adminView === 'firebase_testing' && <FirebaseTestingManager />}
        {adminView === 'telegram_bot' && <TelegramBotManager />}

        {adminView === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Top Welcome & KPI Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{settings.name} ম্যানেজমেন্ট ড্যাশবোর্ড</h2>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    সিস্টেম লাইভ
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  স্বাগতম, {currentUser?.name} ({currentUser?.role}) · রোগীর আগমন, ডাক্তার ওপিডি ও আর্থিক অডিট নিরবচ্ছিন্ন পর্যবেক্ষণ।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAdminView('patients')}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  + নতুন রোগী গ্রহণ
                </button>
                <button
                  onClick={() => setAdminView('audit')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  অডিট শীট প্রিন্ট
                </button>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              <div 
                onClick={() => setAdminView('patients')}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-teal-500 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">মোট নিবন্ধিত রোগী</span>
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2">{patients.length} জন</div>
                <div className="text-[10px] text-slate-400 mt-1">তাৎক্ষণিক রেকর্ড অনুসন্ধান সক্রিয়</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">আজকের সিরিয়াল</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-blue-700 mt-2">{appointments.length} টি</div>
                <div className="text-[10px] text-slate-400 mt-1">ওপিডি কনসালটেশন চলমান</div>
              </div>

              <div 
                onClick={() => setAdminView('audit')}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">আজকের মোট আদায়</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-700 mt-2">
                  {settings.currency} {summary.todayIncome.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">ক্যাশ: ৳{summary.cashCollection} · ডিজিটাল: ৳{summary.digitalCollection}</div>
              </div>

              <div 
                onClick={() => setAdminView('audit')}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-400 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">মোট নিট ফান্ড ব্যালেন্স</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2">
                  {settings.currency} {summary.netBalance.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">আয় ও ব্যয়ের নিরীক্ষিত উদ্বৃত্ত</div>
              </div>

              <div 
                onClick={() => setAdminView('beds')}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-500 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">কেবিন ও বেড অবস্থা</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <BedDouble className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2">
                  {beds.length - availableBeds} / {beds.length}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-1">খালি আছে: {availableBeds} টি শয্যা</div>
              </div>

            </div>

            {/* Real-time Appointments & Serial Queue Table */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {t('লাইভ ওপিডি সিরিয়াল কিউ (Live Serial Queue)', 'Live OPD Serial Queue')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    আজকের রোগীদের সিরিয়াল আগমন ও ডাক্তার কনসালটেশন স্ট্যাটাস পরিবর্তন
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={appointmentSearch}
                    onChange={(e) => setAppointmentSearch(e.target.value)}
                    placeholder="রোগীর নাম বা মোবাইল..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-y border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">টোকেন নং</th>
                      <th className="py-2.5 px-3">রোগীর বিবরণ</th>
                      <th className="py-2.5 px-3">কনসালট্যান্ট ডাক্তার</th>
                      <th className="py-2.5 px-3">পেমেন্ট অবস্থা</th>
                      <th className="py-2.5 px-3">বর্তমান অবস্থা (Status)</th>
                      <th className="py-2.5 px-3 text-right">কার্যক্রম (Action)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {todayAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          কোনো সিরিয়াল পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      todayAppointments.map(apt => (
                        <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3">
                            <span className="text-base font-black text-teal-800">#{apt.serialNo}</span>
                            <span className="block text-[10px] text-slate-400 font-mono">{apt.id}</span>
                          </td>

                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900 block">{apt.patientName}</span>
                            <span className="text-[11px] text-slate-500">
                              {apt.patientPhone} · {apt.patientAge}Y · {apt.patientGender}
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-800 block">{apt.doctorName}</span>
                            <span className="text-[11px] text-teal-700">{apt.department}</span>
                          </td>

                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[11px] font-bold ${apt.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'}`}>
                                {apt.paymentStatus === 'PAID' ? `পরিশোধিত (${apt.paymentMethod})` : 'অপরিশোধিত'}
                              </span>
                              {apt.paymentStatus !== 'PAID' && (
                                <button
                                  onClick={() => payAppointment(apt.id, 'Cash')}
                                  className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded cursor-pointer font-bold"
                                  title="ক্যাশ গ্রহণ ও নিশ্চিত করুন"
                                >
                                  ক্যাশ আদায়
                                </button>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              ফি: {settings.currency} {apt.fee} {apt.transactionId && `· ${apt.transactionId}`}
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <select
                              value={apt.status}
                              onChange={(e) => updateAppointmentStatus(apt.id, e.target.value as any)}
                              className={`text-[11px] font-semibold px-2 py-1 rounded border ${
                                apt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                                apt.status === 'IN_CONSULTATION' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                                apt.status === 'CANCELLED' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                                'bg-slate-50 text-slate-800 border-slate-300'
                              }`}
                            >
                              <option value="SCHEDULED">অপেক্ষমান (Scheduled)</option>
                              <option value="IN_CONSULTATION">ডাক্তার দেখছেন (In Consultation)</option>
                              <option value="COMPLETED">সম্পন্ন (Completed)</option>
                              <option value="CANCELLED">বাতিল (Cancelled)</option>
                            </select>
                          </td>

                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => {
                                setAdminView('patients');
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-50 rounded transition-colors cursor-pointer"
                            >
                              ইএমআর ফাইল দেখুন →
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* Doctor Roster & OPD Status */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-900 text-sm">ডাক্তার তালিকা ও ওপিডি চেম্বার</h4>
                  <span className="text-xs text-slate-500">{doctors.length} জন বিশেষজ্ঞ</span>
                </div>
                <div className="space-y-2">
                  {doctors.slice(0, 4).map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{doc.name}</span>
                        <span className="text-slate-500 block text-[11px]">{doc.department} · রুম: {doc.roomNo}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-teal-800">{settings.currency} {doc.consultationFee}</span>
                        <span className="text-[10px] text-slate-400 block">{doc.timing}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security & Access Overview */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-900 text-sm">রোল ভিত্তিক সিকিউরিটি ও এক্সেস কন্ট্রোল</h4>
                  <span className="text-xs text-emerald-700 font-bold">এনক্রিপ্টেড সেশন</span>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">এডমিন ও সাব-এডমিন বিচ্ছিন্নকরণ:</strong>
                      <p className="text-[11px] text-slate-500 mt-0.5">সাধারণ রোগী বা বহিরাগত ব্যবহারকারীরা কোনো অবস্থাতেই এডমিন প্যানেলে প্রবেশ করতে পারেন না।</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <Building className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">মালিকানা ও ব্র্যান্ডিং পরিবর্তন:</strong>
                      <p className="text-[11px] text-slate-500 mt-0.5">হাসপাতাল সেটিংস থেকে যেকোনো সময় হাসপাতালের নাম, ঠিকানা এবং যোগাযোগের তথ্য পরিবর্তন করা যায়।</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Settings Modal */}
      <HospitalSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

    </div>
  );
};
