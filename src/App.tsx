/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Header } from './components/Header';
import { PatientPortal } from './components/patient/PatientPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { AiChatAssistant } from './components/ai/AiChatAssistant';
import { TechnicalDocsModal } from './components/docs/TechnicalDocsModal';
import { Sparkles, MessageSquareHeart } from 'lucide-react';

const MainApp: React.FC = () => {
  const { currentUser, setIsAiModalOpen, settings, t } = useHospital();

  const isStaff = currentUser && ['admin', 'subadmin_doctor', 'subadmin_reception', 'subadmin_accountant'].includes(currentUser.role);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main Body: Strict Separation between Patient View & Admin Panel */}
      <main className="flex-1">
        {isStaff ? (
          /* Admin & Medical Staff Panel */
          <AdminDashboard />
        ) : (
          /* Clean Patient & Client Portal (Admin panel is strictly invisible to patients) */
          <PatientPortal />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs no-print">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white text-sm">{settings.name}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">{settings.slogan}</p>
            <p className="text-[11px] text-slate-500 mt-1">{settings.address} · রেজি: {settings.regNumber}</p>
          </div>

          <div className="flex flex-col sm:items-end text-[11px] text-slate-400">
            <p>২৪/৭ জরুরী ও অ্যাম্বুলেন্স সাপোর্ট: <strong className="text-teal-300 font-mono">{settings.hotline}</strong></p>
            <p className="text-slate-500 mt-1">© {new Date().getFullYear()} {settings.name}. সর্বস্বত্ব সংরক্ষিত।</p>
          </div>
        </div>
      </footer>

      {/* Floating AI Assistant Trigger Button (Bottom Right) */}
      <button
        onClick={() => setIsAiModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-teal-600 hover:bg-teal-700 text-white p-3.5 rounded-2xl shadow-xl shadow-teal-600/30 flex items-center gap-2.5 transition-all transform hover:scale-105 cursor-pointer no-print group"
        title="এআই স্বাস্থ্য সহকারী"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-teal-200 animate-pulse" />
        </div>
        <span className="text-xs font-bold hidden sm:inline pr-1">
          {t('এআই স্বাস্থ্য সহকারী', 'AI Health Assistant')}
        </span>
      </button>

      {/* Global Modals */}
      <AuthModal />
      <AiChatAssistant />
      <TechnicalDocsModal />
    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <MainApp />
    </HospitalProvider>
  );
}
