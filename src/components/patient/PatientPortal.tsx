import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Doctor, Appointment } from '../../types';
import { DoctorBookingModal } from './DoctorBookingModal';
import { 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Stethoscope, 
  PhoneCall, 
  FileText, 
  CheckCircle, 
  Sparkles, 
  ShieldCheck, 
  User, 
  Activity, 
  Printer, 
  FlaskConical, 
  HelpCircle,
  QrCode,
  ArrowRight
} from 'lucide-react';

export const PatientPortal: React.FC = () => {
  const { 
    settings, 
    doctors, 
    appointments, 
    labTests, 
    currentUser, 
    patientView, 
    setPatientView, 
    setIsAiModalOpen,
    setIsAuthModalOpen,
    setAuthModalType,
    patients,
    language,
    t 
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [selectedTicketForPrint, setSelectedTicketForPrint] = useState<Appointment | null>(null);

  // Departments list
  const departments = [
    { id: 'all', nameBn: 'সকল বিভাগ', nameEn: 'All Departments' },
    { id: 'Cardiology', nameBn: 'কার্ডিওলজি (হৃদরোগ)', nameEn: 'Cardiology' },
    { id: 'Gynecology & Obstetrics', nameBn: 'গাইনি ও প্রসূতি', nameEn: 'Gynecology' },
    { id: 'Medicine', nameBn: 'মেডিসিন বিশেষজ্ঞ', nameEn: 'Medicine' },
    { id: 'Pediatrics', nameBn: 'শিশু বিভাগ', nameEn: 'Pediatrics' },
    { id: 'Orthopedics', nameBn: 'অর্থোপেডিকস ও ট্রমা', nameEn: 'Orthopedics' },
    { id: 'ENT & Head Neck', nameBn: 'নাক, কান ও গলা (ENT)', nameEn: 'ENT' },
  ];

  // Filtered doctors
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.degrees.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'all' || doc.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  // Patient's own appointments
  const myAppointments = appointments.filter(a => {
    if (currentUser?.phone && a.patientPhone === currentUser.phone) return true;
    if (currentUser?.email && a.patientPhone === currentUser.phone) return true;
    // Default fallback: show all recent bookings in demo mode
    return true;
  });

  // Find linked patient records
  const linkedPatient = patients.find(p => p.phone === currentUser?.phone || p.id === 'HH-2026-0101');

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Patient Portal Secondary Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-14.5 z-30">
        <div className="container mx-auto px-4 flex items-center justify-between overflow-x-auto py-2">
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setPatientView('home')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${patientView === 'home' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              {t('ডাক্তার ও অনলাইন সিরিয়াল', 'Doctors & Serials')}
            </button>
            <button
              onClick={() => setPatientView('my_bookings')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${patientView === 'my_bookings' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              {t('আমার সিরিয়াল টোকেন', 'My Appointment Slips')}
            </button>
            <button
              onClick={() => setPatientView('tests')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${patientView === 'tests' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              {t('ডায়াগনস্টিক ও ল্যাব টেস্ট', 'Lab Tests & Fees')}
            </button>
            <button
              onClick={() => setPatientView('health_records')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${patientView === 'health_records' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              {t('প্রেসক্রিপশন ও রিপোর্ট রেকর্ড', 'Medical Records & EMR')}
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500">
            <span>২৪ ঘণ্টা জরুরী হটলাইন: <strong className="text-teal-700 font-mono">{settings.hotline}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-6">

        {/* VIEW 1: Doctors Roster & Instant Serial Booking */}
        {patientView === 'home' && (
          <div className="space-y-6">
            
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <span className="text-teal-300 text-xs font-semibold tracking-wider uppercase">
                  {settings.name} {t('অনলাইন ডিজিটাল স্বাস্থ্যসেবা', 'Online Digital Healthcare')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 leading-snug">
                  {t('দক্ষ বিশেষজ্ঞ ডাক্তারের সিরিয়াল নিন সহজে ও ঘরে বসেই', 'Book Specialist Doctor Appointments Easily From Home')}
                </h2>
                <p className="text-sm text-teal-100 mt-2">
                  {t('বিকাশ, নগদ, রকেট অথবা কার্ড দিয়ে অনলাইন পেমেন্ট করুন কিংবা হাসপাতালে এসে ফি জমা দিয়ে সিরিয়াল গ্রহণ করুন।', 'Pay securely online via bKash, Nagad, Card or at the hospital reception counter.')}
                </p>

                {/* Search Bar */}
                <div className="mt-5 flex items-center bg-white rounded-xl shadow-md p-1.5 max-w-lg">
                  <Search className="w-5 h-5 text-slate-400 ml-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('ডাক্তারের নাম বা রোগ বিভাগ দিয়ে খুঁজুন...', 'Search doctor name or medical department...')}
                    className="w-full px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      মুছুন
                    </button>
                  )}
                </div>
              </div>

              {/* Decorative accent */}
              <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none hidden md:block">
                <Stethoscope className="w-64 h-64 text-white" />
              </div>
            </div>

            {/* Department interactive filter tabs */}
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                {t('বিভাগ অনুযায়ী ডাক্তার নির্বাচন করুন:', 'Filter Doctors by Specialty:')}
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {departments.map(dept => (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDept(dept.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 cursor-pointer ${selectedDept === dept.id ? 'bg-teal-700 text-white shadow-xs font-semibold' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'}`}
                  >
                    {language === 'bn' ? dept.nameBn : dept.nameEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDoctors.map(doctor => (
                <div 
                  key={doctor.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Top Doctor Info */}
                    <div className="flex items-start gap-3.5 mb-3">
                      <img 
                        src={doctor.avatar} 
                        alt={doctor.name} 
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0" 
                      />
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
                          {doctor.name}
                        </h3>
                        <p className="text-xs text-teal-700 font-medium truncate mt-0.5">
                          {doctor.designation}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {doctor.degrees}
                        </p>
                      </div>
                    </div>

                    {/* Metadata: Room, Timings, Available Days */}
                    <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">বিভাগ:</span>
                        <span className="font-medium text-slate-800">{doctor.department}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">পরামর্শ সময়:</span>
                        <span className="font-medium text-slate-800">{doctor.timing}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">রুম নম্বর:</span>
                        <span className="font-semibold text-slate-800">{doctor.roomNo}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">উপস্থিতির দিন:</span>
                        <span className="font-medium text-slate-700 text-right truncate max-w-[180px]">
                          {doctor.availableDays.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking footer */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">কনসালটেশন ফি</span>
                      <span className="text-lg font-black text-slate-900">
                        {settings.currency} {doctor.consultationFee}
                      </span>
                    </div>

                    <button
                      onClick={() => setBookingDoctor(doctor)}
                      className="py-2 px-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{t('সিরিয়াল বুক করুন', 'Book Serial')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Hospital Features & Trust strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">২৪ ঘণ্টা ইমার্জেন্সি ও ট্রমা</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">সর্বাধুনিক আইসিইউ, সিসিইউ এবং অক্সিজেন সাপোর্ট সুবিধা।</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">ডিজিটাল প্যাথলজি ও ল্যাব</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">স্বয়ংক্রিয় অ্যানালাইজারে নির্ভুল টেস্ট রিপোর্ট ডেলিভারি।</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">নিরাপদ অনলাইন পেমেন্ট</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">বিকাশ, নগদ বা ডেবিট কার্ডের মাধ্যমে তাৎক্ষণিক রসিদ।</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: My Bookings & Printable Appointment Slips */}
        {patientView === 'my_bookings' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {t('আমার সিরিয়াল বুকিং ও টোকেন', 'My Doctor Appointments & Slips')}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('আপনার সকল নিশ্চিতকৃত সিরিয়াল এবং হাসপাতাল ভিজিট স্লিপ', 'View and print confirmed appointment tokens')}
                </p>
              </div>

              <button
                onClick={() => setPatientView('home')}
                className="px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors cursor-pointer"
              >
                + {t('নতুন সিরিয়াল নিন', 'Book New Serial')}
              </button>
            </div>

            {myAppointments.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-semibold text-slate-700 text-sm">কোনো সক্রিয় সিরিয়াল পাওয়া যায়নি</h4>
                <p className="text-xs text-slate-500 mt-1">পছন্দের ডাক্তারের সিরিয়াল নিতে বুকিং অপশন ব্যবহার করুন।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myAppointments.map(apt => (
                  <div key={apt.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
                    <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
                      <div>
                        <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">
                          {apt.department}
                        </span>
                        <h4 className="font-bold text-slate-900 text-base">{apt.doctorName}</h4>
                        <p className="text-xs text-slate-500">{apt.appointmentDate} · {apt.appointmentTime}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">সিরিয়াল নং</span>
                        <span className="text-2xl font-black text-teal-700">#{apt.serialNo}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <span className="text-slate-400 block text-[10px]">রোগীর নাম:</span>
                        <span className="font-medium text-slate-800">{apt.patientName} ({apt.patientAge} বছর)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">মোবাইল:</span>
                        <span className="font-medium text-slate-800">{apt.patientPhone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">পেমেন্ট অবস্থা:</span>
                        <span className={`font-semibold ${apt.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {apt.paymentStatus === 'PAID' ? `পরিশোধিত (${apt.paymentMethod})` : 'কাউন্টারে অপরিশোধিত'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">ট্রানজেকশন আইডি:</span>
                        <span className="font-mono text-slate-600">{apt.transactionId || 'N/A'}</span>
                      </div>
                    </div>

                    {apt.symptoms && (
                      <div className="p-2 bg-slate-50 rounded text-[11px] text-slate-600 mb-4">
                        <strong className="text-slate-700">সমস্যা:</strong> {apt.symptoms}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-800">
                        ফি: {settings.currency} {apt.fee}
                      </span>
                      <button
                        onClick={() => {
                          const doc = doctors.find(d => d.id === apt.doctorId);
                          if (doc) setBookingDoctor(doc);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{t('টোকেন স্লিপ দেখুন', 'View / Print Slip')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: Diagnostic Tests & Pricing */}
        {patientView === 'tests' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {t('ডায়াগনস্টিক ও ল্যাব টেস্ট তালিকা', 'Diagnostic & Laboratory Tests')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('সকল টেস্টের সরকার নির্দেশিত মূল্যতালিকা ও নমুনা প্রদানের নির্দেশাবলী', 'Official rates and sample collection instructions')}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">টেস্টের নাম</th>
                    <th className="py-3 px-4">বিভাগ</th>
                    <th className="py-3 px-4">নমুনা ও প্রস্তুতি</th>
                    <th className="py-3 px-4">রিপোর্ট সময়</th>
                    <th className="py-3 px-4 text-right">মূল্য (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {labTests.map(test => (
                    <tr key={test.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {test.testName}
                        <span className="block font-normal text-[11px] text-slate-500 mt-0.5">{test.description}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{test.category}</td>
                      <td className="py-3 px-4 text-slate-600">{test.sampleRequired}</td>
                      <td className="py-3 px-4 text-slate-600">{test.deliveryHours} ঘণ্টা</td>
                      <td className="py-3 px-4 text-right font-bold text-teal-800 text-sm">
                        {settings.currency} {test.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-teal-900 font-semibold mb-0.5">ল্যাব টেস্ট এর জন্য বিশেষ সতর্কতা:</strong>
                <p className="text-teal-800/90 leading-relaxed">
                  লিপিড প্রোফাইল (Lipid Profile) ও ফাস্টিং ব্লাড সুগার (FBS) টেস্টের জন্য নমুনা দেওয়ার পূর্বে কমপক্ষে ৮ থেকে ১০ ঘণ্টা খালি পেটে থাকতে হবে (শুধুমাত্র সাধারণ পানি পান করা যাবে)। জরুরী টেস্টের রিপোর্ট ১ ঘণ্টার মধ্যে প্রদান করা হয়।
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: Health Records & EMR for Patient */}
        {patientView === 'health_records' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {t('ডিজিটাল প্রেসক্রিপশন ও স্বাস্থ্য রেকর্ড', 'Digital Prescriptions & Health Records')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('হাসপাতালে আপনার পূর্ববর্তী সকল ভিজিট, ভাইটাল সাইন ও ডাক্তারের ব্যবস্থাপত্র', 'Your verified consultation history, vitals, and medications')}
              </p>
            </div>

            {linkedPatient ? (
              <div className="space-y-5">
                {/* Patient Profile Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 font-black text-base flex items-center justify-center">
                        {linkedPatient.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{linkedPatient.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>আইডি: <strong className="text-slate-800 font-mono">{linkedPatient.id}</strong></span>
                          <span>·</span>
                          <span>রক্তের গ্রুপ: <strong className="text-rose-600 font-bold">{linkedPatient.bloodGroup}</strong></span>
                          <span>·</span>
                          <span>বয়স: {linkedPatient.age} বছর</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500">
                      <span>জরুরী যোগাযোগ: <strong className="text-slate-800">{linkedPatient.emergencyContact}</strong></span>
                    </div>
                  </div>

                  {/* Medical History Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-1">
                        দীর্ঘমেয়াদী রোগসমূহ (Chronic Conditions):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {linkedPatient.medicalHistory.chronicDiseases.map((dis, idx) => (
                          <span key={idx} className="text-xs text-slate-700 font-medium">
                            {dis} {idx < linkedPatient.medicalHistory.chronicDiseases.length - 1 ? '·' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-1">
                        অ্যালার্জি ও সংবেদনশীলতা (Allergies):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {linkedPatient.medicalHistory.allergies.map((allg, idx) => (
                          <span key={idx} className="text-xs text-amber-800 font-medium">
                            {allg} {idx < linkedPatient.medicalHistory.allergies.length - 1 ? '·' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consultation Visits & Prescriptions List */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    পূর্ববর্তী কনসালটেশন ইতিহাস ({linkedPatient.visits.length}):
                  </h4>

                  {linkedPatient.visits.map(visit => (
                    <div key={visit.visitId} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                      <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-xs font-semibold text-teal-700">{visit.department}</span>
                          <h5 className="font-bold text-slate-900 text-sm">{visit.doctorName}</h5>
                          <p className="text-[11px] text-slate-500">ভিজিট তারিখ: {visit.date}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">রোগ নির্ণয় (Diagnosis)</span>
                          <span className="font-bold text-slate-800 text-xs">{visit.diagnosis}</span>
                        </div>
                      </div>

                      {/* Vitals */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-50 p-2.5 rounded-lg text-center text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">রক্তচাপ (BP)</span>
                          <span className="font-bold text-slate-800">{visit.vitals.bloodPressure}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">পালস রেট</span>
                          <span className="font-bold text-slate-800">{visit.vitals.pulseRate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">তাপমাত্রা</span>
                          <span className="font-bold text-slate-800">{visit.vitals.temperature}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">ওজন</span>
                          <span className="font-bold text-slate-800">{visit.vitals.weightKg}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">অক্সিজেন SpO2</span>
                          <span className="font-bold text-slate-800">{visit.vitals.spo2}</span>
                        </div>
                      </div>

                      {/* Prescribed Medicines */}
                      <div>
                        <span className="text-xs font-bold text-slate-700 block mb-2">প্রেসক্রিপশন ঔষধসমূহ:</span>
                        <div className="space-y-1.5">
                          {visit.prescription.map((rx, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50/70 border border-slate-100 text-xs">
                              <div>
                                <span className="font-bold text-slate-900">{idx + 1}. {rx.medicineName}</span>
                                <span className="text-slate-500 ml-2">({rx.timing})</span>
                                {rx.notes && <span className="text-slate-500 text-[11px] ml-1">· {rx.notes}</span>}
                              </div>
                              <div className="font-mono font-semibold text-teal-800">
                                {rx.dosage} · {rx.duration}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Advised Tests & Doctor Notes */}
                      {visit.advisedTests && visit.advisedTests.length > 0 && (
                        <div className="text-xs text-slate-600">
                          <strong className="text-slate-800">প্রস্তাবিত পরীক্ষা: </strong>
                          {visit.advisedTests.join(', ')}
                        </div>
                      )}

                      {visit.doctorNotes && (
                        <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded text-xs text-amber-900">
                          <strong>ডাক্তারের পরামর্শ: </strong> {visit.doctorNotes}
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => window.print()}
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>প্রেসক্রিপশন প্রিন্ট করুন</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-semibold text-slate-700 text-sm">কোনো পূর্ববর্তী রেকর্ড সংরক্ষিত নেই</h4>
                <p className="text-xs text-slate-500 mt-1">
                  আপনার পুরাতন রেকর্ড খুঁজতে আপনার নিবন্ধিত মোবাইল নম্বর দিয়ে লগইন করুন।
                </p>
                <button
                  onClick={() => {
                    setAuthModalType('patient');
                    setIsAuthModalOpen(true);
                  }}
                  className="mt-3 px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 cursor-pointer"
                >
                  রোগী লগইন করুন
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Booking Modal */}
      {bookingDoctor && (
        <DoctorBookingModal
          doctor={bookingDoctor}
          onClose={() => setBookingDoctor(null)}
        />
      )}

    </div>
  );
};
