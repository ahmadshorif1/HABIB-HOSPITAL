import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { LedgerItem, TransactionType, PaymentMethod } from '../../types';
import { 
  Calculator, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Printer, 
  Search, 
  Filter, 
  CheckCircle2, 
  DollarSign, 
  CreditCard, 
  Calendar, 
  FileText,
  X,
  Wallet
} from 'lucide-react';

export const AccountsAudit: React.FC = () => {
  const { 
    ledger, 
    addTransaction, 
    getLedgerSummary, 
    settings, 
    currentUser, 
    t 
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [filterMethod, setFilterMethod] = useState<string>('ALL');
  const [isAddTxnOpen, setIsAddTxnOpen] = useState(false);
  const [isPrintAuditOpen, setIsPrintAuditOpen] = useState(false);

  // New Transaction Form State
  const [txnType, setTxnType] = useState<TransactionType>('INCOME');
  const [txnCategory, setTxnCategory] = useState<LedgerItem['category']>('Doctor OPD Fee');
  const [txnAmount, setTxnAmount] = useState<number>(1000);
  const [txnMethod, setTxnMethod] = useState<PaymentMethod>('Cash');
  const [txnPatientName, setTxnPatientName] = useState('');
  const [txnDesc, setTxnDesc] = useState('');
  const [txnRefInvoice, setTxnRefInvoice] = useState('');

  const summary = getLedgerSummary();

  // Filtered transactions
  const filteredLedger = ledger.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.patientName && item.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.referenceInvoiceId && item.referenceInvoiceId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'ALL' || item.type === filterType;
    const matchesMethod = filterMethod === 'ALL' || item.paymentMethod === filterMethod;

    return matchesSearch && matchesType && matchesMethod;
  });

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnDesc || txnAmount <= 0) return;

    addTransaction({
      type: txnType,
      category: txnCategory,
      amount: txnAmount,
      paymentMethod: txnMethod,
      patientName: txnPatientName || undefined,
      referenceInvoiceId: txnRefInvoice || `INV-${Date.now().toString().slice(-5)}`,
      description: txnDesc,
    });

    setIsAddTxnOpen(false);
    setTxnDesc('');
    setTxnPatientName('');
    setTxnRefInvoice('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Audit Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t('হাসপাতাল হিসাব ও অডিট স্টেটমেন্ট', 'Hospital Accounts & Financial Audit')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('দৈনিক ক্যাশ ও অনলাইন কালেকশন, ব্যয় নিরীক্ষণ, লেজার ভেরিফিকেশন এবং প্রিন্ট অডিট রিপোর্ট।', 'Real-time revenue, expense ledgers, verified audit trail, and instant balance reconciliation.')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPrintAuditOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('অডিট শিট প্রিন্ট', 'Print Audit Sheet')}</span>
          </button>
          <button
            onClick={() => setIsAddTxnOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t('নতুন আয়/ব্যয় এন্ট্রি', 'Add Entry')}</span>
          </button>
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Net Balance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('নেট ক্যাশ ব্যালেন্স (তহবিল)', 'Net Fund Balance')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {settings.currency} {summary.netBalance.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-700 font-semibold">আয়: {settings.currency} {summary.totalIncome.toLocaleString()}</span>
            <span>·</span>
            <span className="text-rose-600 font-semibold">ব্যয়: {settings.currency} {summary.totalExpense.toLocaleString()}</span>
          </div>
        </div>

        {/* Today's Total Collection */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('আজকের মোট আদায়', "Today's Collection")}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">
            {settings.currency} {summary.todayIncome.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            আজকের ব্যয়: {settings.currency} {summary.todayExpense.toLocaleString()}
          </div>
        </div>

        {/* Cash at Counter vs Digital Split */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('কাউন্টার ক্যাশ আদায়', 'Cash at Counter')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {settings.currency} {summary.cashCollection.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            হাতে নগদ তহবিল সংরক্ষণ
          </div>
        </div>

        {/* Online Digital Payments (bKash/Nagad/Card) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('অনলাইন ডিজিটাল কালেকশন', 'Digital (bKash/Nagad)')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-pink-700 mt-2">
            {settings.currency} {summary.digitalCollection.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            ব্যাংক ও মোবাইল ফাইন্যান্সিং
          </div>
        </div>

      </div>

      {/* Audit Search and Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('বিবরণ, রোগী বা ইনভয়েস নম্বর দিয়ে খুঁজুন...', 'Search description, patient, invoice...')}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Filter Segmented Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${filterType === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                সব ট্রানজেকশন
              </button>
              <button
                onClick={() => setFilterType('INCOME')}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${filterType === 'INCOME' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                শুধুমাত্র আয় (Income)
              </button>
              <button
                onClick={() => setFilterType('EXPENSE')}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${filterType === 'EXPENSE' ? 'bg-rose-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                শুধুমাত্র ব্যয় (Expense)
              </button>
            </div>

            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700"
            >
              <option value="ALL">সকল পেমেন্ট মাধ্যম</option>
              <option value="Cash">Cash (ক্যাশ)</option>
              <option value="bKash">bKash (বিকাশ)</option>
              <option value="Nagad">Nagad (নগদ)</option>
              <option value="Card">Card (কার্ড)</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto border-t border-slate-100 pt-3">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">আইডি ও সময়</th>
                <th className="py-2.5 px-3">ধরণ ও ক্যাটাগরি</th>
                <th className="py-2.5 px-3">বিবরণ ও রেফারেন্স</th>
                <th className="py-2.5 px-3">পেমেন্ট মাধ্যম</th>
                <th className="py-2.5 px-3">এন্ট্রি প্রদানকারী</th>
                <th className="py-2.5 px-3 text-right">পরিমাণ (৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    কোনো ট্রানজেকশন পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredLedger.map(item => {
                  const isIncome = item.type === 'INCOME';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono text-slate-500">
                        <span className="font-bold text-slate-800 block text-xs">{item.id}</span>
                        <span className="text-[10px]">{item.date} · {item.time}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 font-bold text-[11px] ${isIncome ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {isIncome ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          {isIncome ? 'আদায় (Income)' : 'খরচ (Expense)'}
                        </span>
                        <span className="block text-[11px] text-slate-500 mt-0.5">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900 block">{item.description}</span>
                        {item.patientName && (
                          <span className="text-[11px] text-slate-500">
                            রোগী: {item.patientName} {item.referenceInvoiceId && `· ইনভয়েস: ${item.referenceInvoiceId}`}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800">
                          {item.paymentMethod}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-slate-700 block">{item.recordedBy}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          অডিটেড
                        </span>
                      </td>

                      <td className={`py-3 px-3 text-right font-black text-sm ${isIncome ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {isIncome ? '+' : '-'}{settings.currency} {item.amount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Add New Transaction Entry */}
      {isAddTxnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{t('নতুন আয়/ব্যয় অডিট এন্ট্রি', 'New Financial Audit Entry')}</h3>
                <p className="text-xs text-slate-300">হিসাবরক্ষক বা এডমিন কর্তৃক লেজারে ট্রানজেকশন নথিভুক্তকরণ</p>
              </div>
              <button 
                onClick={() => setIsAddTxnOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="p-6 space-y-4">
              
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setTxnType('INCOME'); setTxnCategory('Doctor OPD Fee'); }}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${txnType === 'INCOME' ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-600/20' : 'border-slate-200 text-slate-600'}`}
                >
                  + আয় / রাজস্ব (Income)
                </button>
                <button
                  type="button"
                  onClick={() => { setTxnType('EXPENSE'); setTxnCategory('Medical Supplies'); }}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${txnType === 'EXPENSE' ? 'border-rose-600 bg-rose-50 text-rose-700 ring-2 ring-rose-600/20' : 'border-slate-200 text-slate-600'}`}
                >
                  - ব্যয় / খরচ (Expense)
                </button>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ক্যাটাগরি</label>
                <select
                  value={txnCategory}
                  onChange={(e) => setTxnCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                >
                  {txnType === 'INCOME' ? (
                    <>
                      <option value="Doctor OPD Fee">ডাক্তার ওপিডি কনসালটেশন ফি</option>
                      <option value="Diagnostic Lab">ডায়াগনস্টিক ল্যাব টেস্ট ফি</option>
                      <option value="Cabin & Bed Rent">কেবিন ও সাধারণ বেড ভাড়া</option>
                      <option value="Emergency Service">জরুরী ও অ্যাম্বুলেন্স সেবা</option>
                      <option value="Pharmacy Sale">ফার্মেসি বিক্রয়</option>
                      <option value="Other">অন্যান্য আয়</option>
                    </>
                  ) : (
                    <>
                      <option value="Medical Supplies">চিকিৎসা সামগ্রী ও ঔষধ ক্রয়</option>
                      <option value="Staff Salary">ডাক্তার ও কর্মচারীদের বেতন</option>
                      <option value="Equipment Maintenance">যন্ত্রপাতি সার্ভিসিং ও রক্ষণাবেক্ষণ</option>
                      <option value="Utility & Overhead">বিদ্যুৎ, জেনারেটর ডিজেল ও ইউটিলিটি</option>
                      <option value="Other">অন্যান্য অফিসিয়াল খরচ</option>
                    </>
                  )}
                </select>
              </div>

              {/* Amount and Payment Method */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">টাকার পরিমাণ (৳) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={txnAmount}
                    onChange={(e) => setTxnAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">পেমেন্ট মাধ্যম</label>
                  <select
                    value={txnMethod}
                    onChange={(e) => setTxnMethod(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Cash">Cash (ক্যাশ কাউন্টার)</option>
                    <option value="bKash">bKash (বিকাশ)</option>
                    <option value="Nagad">Nagad (নগদ)</option>
                    <option value="Rocket">Rocket (রকেট)</option>
                    <option value="Card">Visa / Master Card</option>
                    <option value="POS">POS মেশিন</option>
                    <option value="Bank Transfer">Bank Transfer (ব্যাংক)</option>
                  </select>
                </div>
              </div>

              {/* Patient Name / Ref */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">রোগী বা গ্রাহকের নাম (প্রযোজ্য ক্ষেত্রে)</label>
                  <input
                    type="text"
                    value={txnPatientName}
                    onChange={(e) => setTxnPatientName(e.target.value)}
                    placeholder="যেমন: আব্দুর রহিম"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">রেফারেন্স ইনভয়েস / ভাউচার নং</label>
                  <input
                    type="text"
                    value={txnRefInvoice}
                    onChange={(e) => setTxnRefInvoice(e.target.value)}
                    placeholder="যেমন: VOUCHER-901"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">বিবরণ *</label>
                <input
                  type="text"
                  required
                  value={txnDesc}
                  onChange={(e) => setTxnDesc(e.target.value)}
                  placeholder="যেমন: ইসিজি ও প্যাথলজি টেস্ট ফি পরিশোধ"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  লেজারে এন্ট্রি সংরক্ষণ করুন
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: Printable Audit Sheet */}
      {isPrintAuditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 p-8">
            <div className="flex items-center justify-between no-print mb-4 border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-teal-700">দৈনিক / মাসিক অফিশিয়াল অডিট স্টেটমেন্ট</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট করুন</span>
                </button>
                <button
                  onClick={() => setIsPrintAuditOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Hospital Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 mb-4">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{settings.name}</h2>
              <p className="text-xs text-slate-600 font-medium">অভ্যন্তরীণ অডিট ও অর্থ বিভাগ (Internal Audit & Accounts)</p>
              <p className="text-xs text-slate-500 mt-0.5">{settings.address} · রেজিস্ট্রেশন নং: {settings.regNumber}</p>
              <div className="mt-2 text-xs font-bold text-slate-700 bg-slate-100 py-1 rounded inline-block px-4">
                দৈনিক হিসাব নিরীক্ষা বিবরণী (Daily Financial Audit Sheet)
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs mb-4">
              <div>
                <span className="text-slate-400 block text-[10px]">মোট আদায় (Income)</span>
                <strong className="text-emerald-700 text-sm">{settings.currency} {summary.totalIncome.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">মোট খরচ (Expense)</span>
                <strong className="text-rose-600 text-sm">{settings.currency} {summary.totalExpense.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">নিট তহবিল ব্যালেন্স</span>
                <strong className="text-slate-900 text-sm">{settings.currency} {summary.netBalance.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">তারিখ ও সময়</span>
                <strong className="text-slate-700 text-xs">{new Date().toLocaleDateString('bn-BD')}</strong>
              </div>
            </div>

            {/* Itemized Audit Ledger List */}
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2">আইডি</th>
                  <th className="p-2">তারিখ</th>
                  <th className="p-2">ক্যাটাগরি ও বিবরণ</th>
                  <th className="p-2">পদ্ধতি</th>
                  <th className="p-2 text-right">আদায় (+)</th>
                  <th className="p-2 text-right">ব্যয় (-)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ledger.map(item => (
                  <tr key={item.id}>
                    <td className="p-2 font-mono text-[11px]">{item.id}</td>
                    <td className="p-2 text-[11px]">{item.date}</td>
                    <td className="p-2 font-medium">
                      {item.description}
                      {item.patientName && <span className="text-[10px] text-slate-500 block">রোগী: {item.patientName}</span>}
                    </td>
                    <td className="p-2 text-[11px]">{item.paymentMethod}</td>
                    <td className="p-2 text-right font-bold text-emerald-700">
                      {item.type === 'INCOME' ? `${settings.currency} ${item.amount.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-2 text-right font-bold text-rose-600">
                      {item.type === 'EXPENSE' ? `${settings.currency} ${item.amount.toLocaleString()}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Auditor and Director Signatures */}
            <div className="mt-14 pt-6 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
              <div>
                <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800">
                  {currentUser?.name || 'কামাল হোসেন (হিসাবরক্ষক)'}
                </div>
                <span className="text-[10px] text-slate-500">প্রস্তুতকারক (Prepared By)</span>
              </div>
              <div>
                <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800">
                  অভ্যন্তরীণ অডিটর (CPA)
                </div>
                <span className="text-[10px] text-slate-500">নিরীক্ষক (Verified Auditor)</span>
              </div>
              <div>
                <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800">
                  {settings.directorName}
                </div>
                <span className="text-[10px] text-slate-500">ব্যবস্থাপনা পরিচালক / সিইও</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
