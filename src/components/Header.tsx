import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Building2, 
  PhoneCall, 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  Sparkles, 
  BookOpen, 
  Globe, 
  Settings, 
  Stethoscope, 
  FileText,
  User as UserIcon,
  CalendarCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    settings, 
    currentUser, 
    logoutUser, 
    language, 
    setLanguage, 
    t,
    setIsAuthModalOpen,
    setAuthModalType,
    setIsAiModalOpen,
    setIsDocsModalOpen,
    patientView,
    setPatientView,
    adminView,
    setAdminView
  } = useHospital();

  const isStaff = currentUser && ['admin', 'subadmin_doctor', 'subadmin_reception', 'subadmin_accountant'].includes(currentUser.role);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top emergency announcement bar */}
      {settings.noticeBanner && (
        <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 flex items-center justify-between border-b border-slate-800">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate">{settings.noticeBanner}</span>
            </div>
            <div className="flex items-center gap-4 text-xs shrink-0">
              <a href={`tel:${settings.hotline}`} className="flex items-center gap-1.5 text-teal-300 hover:text-teal-200 font-medium">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{settings.hotline}</span>
              </a>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <button 
                onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                title="Toggle Language"
              >
                <Globe className="w-3 h-3 text-slate-400" />
                <span className="font-semibold">{language === 'bn' ? 'English' : 'বাংলা'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main navigation header */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div 
          onClick={() => isStaff ? setAdminView('dashboard') : setPatientView('home')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:bg-teal-700 transition-colors">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans group-hover:text-teal-700 transition-colors">
                {settings.name}
              </h1>
              {isStaff ? (
                <span className="text-[11px] font-semibold tracking-wide text-teal-700 uppercase bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {currentUser?.role === 'admin' ? 'এডমিন পোর্টাল' : 'স্টাফ পোর্টাল'}
                </span>
              ) : (
                <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                  {settings.established ? `স্থাপিত ${settings.established}` : 'স্মার্ট হসপিটাল'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">
              {settings.slogan}
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Medical Assistant Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 hover:border-teal-300 transition-all cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">{t('এআই স্বাস্থ্য সহকারী', 'AI Health Assistant')}</span>
            <span className="sm:hidden">{t('এআই', 'AI')}</span>
          </button>

          {/* Technical Docs & Schema button */}
          <button
            onClick={() => setIsDocsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
            title="Technical Documentation, Database Schema & Ownership Transfer Guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">{t('টেকনিক্যাল গাইড ও স্কিমা', 'Docs & Schema')}</span>
          </button>

          {/* User state and portal controls */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="text-right hidden lg:block">
                <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500 capitalize">
                  {currentUser.role.replace('subadmin_', '')}
                </div>
              </div>

              {isStaff ? (
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setAdminView('dashboard')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${adminView === 'dashboard' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {t('ড্যাশবোর্ড', 'Dashboard')}
                  </button>
                  <button
                    onClick={() => setAdminView('patients')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${adminView === 'patients' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {t('রোগীদের রেকর্ড', 'EMR Patients')}
                  </button>
                  <button
                    onClick={() => setAdminView('audit')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${adminView === 'audit' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {t('হিসাব ও অডিট', 'Accounts Audit')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setPatientView('home')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${patientView === 'home' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {t('হোম', 'Home')}
                  </button>
                  <button
                    onClick={() => setPatientView('my_bookings')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${patientView === 'my_bookings' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {t('আমার সিরিয়াল', 'My Serials')}
                  </button>
                </div>
              )}

              <button
                onClick={logoutUser}
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title={t('লগআউট', 'Logout')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Patient Login */}
              <button
                onClick={() => {
                  setAuthModalType('patient');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors cursor-pointer shadow-xs"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{t('রোগী লগইন', 'Patient Login')}</span>
              </button>

              {/* Special Admin/Staff Login */}
              <button
                onClick={() => {
                  setAuthModalType('staff');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                title="Admin & Sub-Admin Login"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">{t('অ্যাডমিন / স্টাফ', 'Admin / Staff')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
