import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Doctor, PaymentMethod, Appointment } from '../../types';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Smartphone, 
  Printer, 
  QrCode, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

interface Props {
  doctor: Doctor | null;
  onClose: () => void;
}

export const DoctorBookingModal: React.FC<Props> = ({ doctor, onClose }) => {
  const { settings, currentUser, bookAppointment, t } = useHospital();

  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');
  const [patientAge, setPatientAge] = useState<number>(35);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [symptoms, setSymptoms] = useState('');
  
  // Payment step
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bKash');
  const [mobileNumber, setMobileNumber] = useState(patientPhone || '01711223344');
  const [simulatedTrxId, setSimulatedTrxId] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  if (!doctor) return null;

  const handleConfirmAndPay = () => {
    if (!patientName || !patientPhone) {
      alert(t('রোগীর নাম ও মোবাইল নম্বর প্রদান করুন', 'Please provide patient name and phone number'));
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      let trx = '';
      if (paymentMethod === 'bKash') trx = `BK${Math.floor(10000000 + Math.random() * 90000000)}`;
      else if (paymentMethod === 'Nagad') trx = `NG${Math.floor(10000000 + Math.random() * 90000000)}`;
      else if (paymentMethod === 'Rocket') trx = `RK${Math.floor(10000000 + Math.random() * 90000000)}`;
      else if (paymentMethod === 'Card') trx = `CRD${Math.floor(100000 + Math.random() * 900000)}`;
      else trx = `CSH-CTR-${Math.floor(100 + Math.random() * 900)}`;

      const apt = bookAppointment({
        patientName,
        patientPhone,
        patientAge,
        patientGender,
        doctorId: doctor.id,
        symptoms: symptoms || 'সাধারণ স্বাস্থ্য পরীক্ষা ও পরামর্শ',
        paymentMethod,
        transactionId: trx,
      });

      setIsProcessingPayment(false);
      setConfirmedAppointment(apt);
    }, 900);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-teal-700 text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-teal-200 text-xs font-semibold uppercase tracking-wider">
              {t('অনলাইন ডক্টর সিরিয়াল বুকিং', 'Doctor Serial Online Booking')}
            </span>
            <h3 className="text-lg font-bold mt-0.5">{doctor.name}</h3>
            <p className="text-xs text-teal-100">{doctor.degrees} · {doctor.department}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-teal-100 hover:text-white hover:bg-teal-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedAppointment ? (
          /* Confirmation & Printable Serial Slip */
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                {t('সিরিয়াল বুকিং ও পেমেন্ট সফল হয়েছে!', 'Serial Booking & Payment Successful!')}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {t('আপনার সিরিয়াল স্লিপ নিচে প্রদর্শিত হচ্ছে। আপনি এটি সংরক্ষণ বা প্রিন্ট করতে পারেন।', 'Your serial token is confirmed. You can print or show this at the hospital counter.')}
              </p>
            </div>

            {/* Printable Serial Token Card */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 relative overflow-hidden">
              <div className="flex items-start justify-between border-b border-slate-200 pb-3 mb-3">
                <div>
                  <h5 className="font-extrabold text-sm text-slate-900">{settings.name}</h5>
                  <p className="text-[11px] text-slate-500">{settings.address}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">সিরিয়াল টোকেন নং</span>
                  <span className="text-2xl font-black text-teal-700">#{confirmedAppointment.serialNo}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div>
                  <span className="text-slate-400 block text-[10px]">রোগীর নাম:</span>
                  <span className="font-semibold text-slate-800">{confirmedAppointment.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">রোগী আইডি / মোবাইল:</span>
                  <span className="font-semibold text-slate-800">{confirmedAppointment.patientId} · {confirmedAppointment.patientPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ডাক্তার ও রুম:</span>
                  <span className="font-semibold text-slate-800">{doctor.name} (রুম {doctor.roomNo})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">পরামর্শ সময়:</span>
                  <span className="font-semibold text-slate-800">{doctor.timing}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">পেমেন্ট মাধ্যম:</span>
                  <span className="font-semibold text-emerald-700">{confirmedAppointment.paymentMethod} (পরিশোধিত)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ট্রানজেকশন আইডি:</span>
                  <span className="font-mono text-slate-700">{confirmedAppointment.transactionId}</span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <QrCode className="w-8 h-8 text-slate-700" />
                  <div className="text-[10px] text-slate-500">
                    <p className="font-semibold text-slate-800">ভেরিফিকেশন কিউআর কোড</p>
                    <p>হাসপাতাল অভ্যর্থনা ডেস্কে প্রদর্শন করুন</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">মোট ফি</span>
                  <span className="text-base font-bold text-slate-900">{settings.currency} {doctor.consultationFee}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 mt-6">
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>{t('টোকেন স্লিপ প্রিন্ট করুন', 'Print Token Slip')}</span>
              </button>
              <button
                onClick={onClose}
                className="py-2.5 px-4 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                {t('বন্ধ করুন', 'Close')}
              </button>
            </div>
          </div>
        ) : (
          /* Form for Patient Details & Payment */
          <div className="p-6 space-y-5">
            {/* Doctor quick info badge */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>{doctor.timing}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>রুম নং {doctor.roomNo}</span>
                </div>
              </div>
              <div className="font-bold text-teal-800 text-sm">
                ফি: {settings.currency} {doctor.consultationFee}
              </div>
            </div>

            {/* Patient Form */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('রোগীর পুরো নাম *', 'Patient Full Name *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="যেমন: আব্দুর রহিম"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('মোবাইল নম্বর (সিরিয়াল এসএমএস এর জন্য) *', 'Mobile Number (for SMS) *')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="01711223344"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('বয়স', 'Age')}
                  </label>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(Number(e.target.value))}
                    min={1}
                    max={120}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('লিঙ্গ', 'Gender')}
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Male">পুরুষ (Male)</option>
                    <option value="Female">মহিলা (Female)</option>
                    <option value="Other">অন্যান্য (Other)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('শারীরিক সমস্যা বা লক্ষণসমূহ (সংক্ষেপে)', 'Symptoms / Reason for Visit')}
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={2}
                  placeholder="যেমন: ৩ দিন ধরে তীব্র জ্বর, মাথাব্যথা ও কাশির সমস্যা..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>

            {/* Payment Options Section */}
            <div className="pt-2 border-t border-slate-200">
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                {t('পেমেন্ট পদ্ধতি নির্বাচন করুন:', 'Select Payment Method:')}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bKash')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${paymentMethod === 'bKash' ? 'border-pink-500 bg-pink-50 text-pink-700 font-bold ring-2 ring-pink-500/20' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="text-xs font-bold">বিকাশ (bKash)</div>
                  <div className="text-[10px] text-slate-500">অনলাইন ইনস্ট্যান্ট</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Nagad')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${paymentMethod === 'Nagad' ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold ring-2 ring-orange-500/20' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="text-xs font-bold">নগদ (Nagad)</div>
                  <div className="text-[10px] text-slate-500">অনলাইন ইনস্ট্যান্ট</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${paymentMethod === 'Card' ? 'border-teal-600 bg-teal-50 text-teal-800 font-bold ring-2 ring-teal-600/20' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="text-xs font-bold">ভিসা / কার্ড</div>
                  <div className="text-[10px] text-slate-500">Debit / Credit</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${paymentMethod === 'Cash' ? 'border-slate-700 bg-slate-100 text-slate-900 font-bold ring-2 ring-slate-700/20' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="text-xs font-bold">কাউন্টারে ক্যাশ</div>
                  <div className="text-[10px] text-slate-500">Pay at Counter</div>
                </button>
              </div>

              {/* Online payment simulation inputs */}
              {['bKash', 'Nagad', 'Rocket'].includes(paymentMethod) && (
                <div className="p-3 bg-pink-50/50 border border-pink-200 rounded-lg text-xs space-y-2">
                  <div className="flex items-center justify-between text-pink-900 font-semibold">
                    <span>{paymentMethod} মার্চেন্ট পেমেন্ট গেটওয়ে</span>
                    <span>ফি: {settings.currency} {doctor.consultationFee}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    আমাদের অফিশিয়াল মার্চেন্ট নম্বর: <strong className="text-slate-800 font-mono">০১৭১২-৩৪৫৬৭৮</strong>। পেমেন্ট সম্পন্ন হলে স্বয়ংক্রিয় ট্রানজেকশন আইডি যুক্ত হবে।
                  </p>
                </div>
              )}

              {paymentMethod === 'Card' && (
                <div className="p-3 bg-teal-50/50 border border-teal-200 rounded-lg text-xs space-y-2">
                  <div className="flex items-center justify-between text-teal-900 font-semibold">
                    <span>SSLCommerz / Shurjopay নিরাপদ কার্ড গেটওয়ে</span>
                    <span>ফি: {settings.currency} {doctor.consultationFee}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    ভিসা, মাস্টারকার্ড ও নেক্সাসপে সমর্থিত। সম্পূর্ণ এনক্রিপ্টেড পেমেন্ট প্রসেসিং।
                  </p>
                </div>
              )}

              {paymentMethod === 'Cash' && (
                <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">হাসপাতাল কাউন্টারে পরিশোধ করবেন:</p>
                  <p className="text-[11px] mt-0.5">সিরিয়ালটি সাময়িকভাবে বুক করা হবে। ডাক্তার দেখানোর পূর্বে রিসেপশন ডেস্কে ফি জমা দিয়ে রসিদ গ্রহণ করতে হবে।</p>
                </div>
              )}
            </div>

            {/* Confirm Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleConfirmAndPay}
                disabled={isProcessingPayment}
                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-teal-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>পেমেন্ট ও সিরিয়াল নিশ্চিত হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {paymentMethod === 'Cash'
                        ? t('সিরিয়াল নিশ্চিত করুন (কাউন্টারে ফি প্রদান)', 'Confirm Serial (Pay at Counter)')
                        : `${paymentMethod} দিয়ে ${settings.currency} ${doctor.consultationFee} পরিশোধ ও সিরিয়াল গ্রহণ করুন`}
                    </span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
