import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Patient, PatientVisit, PrescriptionItem } from '../../types';
import { 
  Search, 
  UserPlus, 
  Edit3, 
  FilePlus, 
  Phone, 
  Heart, 
  Calendar, 
  Printer, 
  X, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Plus, 
  Trash2,
  Stethoscope,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

export const PatientRecords: React.FC = () => {
  const { 
    patients, 
    searchPatients, 
    addPatient, 
    updatePatient, 
    addPatientVisit, 
    settings, 
    currentUser, 
    t 
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients[0] || null);
  
  // Modals
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isAddVisitOpen, setIsAddVisitOpen] = useState(false);
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
  const [isPrintPrescriptionOpen, setIsPrintPrescriptionOpen] = useState(false);
  const [selectedVisitForPrint, setSelectedVisitForPrint] = useState<PatientVisit | null>(null);

  // New Patient Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAge, setNewAge] = useState<number>(30);
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newBloodGroup, setNewBloodGroup] = useState<Patient['bloodGroup']>('B+');
  const [newNid, setNewNid] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newEmergency, setNewEmergency] = useState('');
  const [newChronic, setNewChronic] = useState('');
  const [newAllergies, setNewAllergies] = useState('');

  // Add Visit / Consultation State
  const [visitDoctorName, setVisitDoctorName] = useState(currentUser?.name || 'ডা. মাহফুজ আহমেদ');
  const [visitDepartment, setVisitDepartment] = useState('Cardiology');
  const [visitComplaint, setVisitComplaint] = useState('');
  const [visitDiagnosis, setVisitDiagnosis] = useState('');
  const [visitBp, setVisitBp] = useState('120/80 mmHg');
  const [visitPulse, setVisitPulse] = useState('76 bpm');
  const [visitTemp, setVisitTemp] = useState('98.4 °F');
  const [visitWeight, setVisitWeight] = useState('68 kg');
  const [visitSpo2, setVisitSpo2] = useState('99%');
  const [visitNotes, setVisitNotes] = useState('');
  const [visitFollowUp, setVisitFollowUp] = useState('');
  const [visitAdvisedTests, setVisitAdvisedTests] = useState('');

  // Prescription items in visit modal
  const [prescriptionList, setPrescriptionList] = useState<PrescriptionItem[]>([
    { medicineName: 'Tab. Paracetamol 500mg', dosage: '1+0+1', timing: 'After meal', duration: '5 days', notes: 'জ্বর বা ব্যথা হলে' }
  ]);

  const searchResults = searchPatients(searchQuery);

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const created = addPatient({
      name: newName,
      phone: newPhone,
      age: newAge,
      gender: newGender,
      bloodGroup: newBloodGroup,
      nid: newNid || undefined,
      address: newAddress || 'ঢাকা, বাংলাদেশ',
      emergencyContact: newEmergency || newPhone,
      medicalHistory: {
        chronicDiseases: newChronic ? newChronic.split(',').map(s => s.trim()) : [],
        allergies: newAllergies ? newAllergies.split(',').map(s => s.trim()) : [],
        pastSurgeries: [],
      },
    });

    setSelectedPatient(created);
    setIsAddPatientOpen(false);
    // Reset form
    setNewName('');
    setNewPhone('');
    setNewNid('');
    setNewChronic('');
    setNewAllergies('');
  };

  const handleAddPrescriptionRow = () => {
    setPrescriptionList(prev => [
      ...prev,
      { medicineName: '', dosage: '1+0+1', timing: 'After meal', duration: '7 days' }
    ]);
  };

  const handleRemovePrescriptionRow = (index: number) => {
    setPrescriptionList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const validPrescriptions = prescriptionList.filter(p => p.medicineName.trim().length > 0);

    addPatientVisit(selectedPatient.id, {
      doctorName: visitDoctorName,
      department: visitDepartment,
      chiefComplaint: visitComplaint || 'নিয়মিত স্বাস্থ্য পরীক্ষা',
      diagnosis: visitDiagnosis || 'Clinical Examination Normal',
      vitals: {
        bloodPressure: visitBp,
        pulseRate: visitPulse,
        temperature: visitTemp,
        weightKg: visitWeight,
        spo2: visitSpo2,
      },
      prescription: validPrescriptions,
      advisedTests: visitAdvisedTests ? visitAdvisedTests.split(',').map(t => t.trim()) : [],
      nextFollowUp: visitFollowUp || undefined,
      doctorNotes: visitNotes || undefined,
    });

    // Refresh selected patient reference
    const updated = patients.find(p => p.id === selectedPatient.id);
    if (updated) setSelectedPatient(updated);

    setIsAddVisitOpen(false);
    setVisitComplaint('');
    setVisitDiagnosis('');
  };

  return (
    <div className="space-y-5">
      
      {/* Top action and title header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t('রোগীদের মেডিকেল রেকর্ড ও ইএমআর (EMR)', 'Patient Medical Records & History')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('পুরাতন রোগীদের তথ্য মোবাইল, এনআইডি বা আইডি দিয়ে দ্রুত খুঁজুন এবং নতুন প্রেসক্রিপশন ও ভাইটালস আপডেট করুন।', 'Instant lookup by phone, NID or Patient ID with multi-visit clinical record tracking.')}
          </p>
        </div>

        <button
          onClick={() => setIsAddPatientOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('নতুন রোগী নিবন্ধন করুন', 'Register New Patient')}</span>
        </button>
      </div>

      {/* Main Layout: Left Search & Patient List, Right Full Patient Clinical Record */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Instant Lookup & Patient List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col h-[750px]">
          
          {/* Instant Search Bar */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('ফোন, এনআইডি, পেশেন্ট আইডি বা নাম...', 'Phone, NID, Patient ID or Name...')}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 px-1">
            <span>ফলাফল: {searchResults.length} জন রোগী</span>
            <span className="text-teal-700 font-medium">তাৎক্ষণিক ফিল্টার সক্রিয়</span>
          </div>

          {/* Patients List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {searchResults.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                <p>কোনো রোগী পাওয়া যায়নি।</p>
                <button
                  onClick={() => setIsAddPatientOpen(true)}
                  className="mt-2 text-teal-700 font-semibold hover:underline cursor-pointer"
                >
                  + নতুন রোগী হিসেবে যুক্ত করুন
                </button>
              </div>
            ) : (
              searchResults.map(patient => {
                const isSelected = selectedPatient?.id === patient.id;
                return (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-3 rounded-lg border text-xs transition-all cursor-pointer ${isSelected ? 'border-teal-600 bg-teal-50/60 shadow-xs' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-bold text-slate-900 text-sm truncate">
                        {patient.name}
                      </div>
                      <span className="font-mono text-[10px] text-teal-700 bg-white px-1.5 py-0.5 rounded border border-teal-200 shrink-0">
                        {patient.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span>{patient.age} বছর</span>
                      <span>·</span>
                      <span>{patient.gender}</span>
                      <span>·</span>
                      <span className="font-bold text-rose-600">{patient.bloodGroup}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2 pt-1.5 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {patient.phone}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ভিজিট: {patient.visits.length} বার
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Patient Profile, History & Consultation Manager (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col h-[750px] overflow-y-auto">
          {selectedPatient ? (
            <div className="space-y-6">
              
              {/* Header profile info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-xl bg-teal-700 text-white font-black text-xl flex items-center justify-center shrink-0">
                    {selectedPatient.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-900">{selectedPatient.name}</h3>
                      <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {selectedPatient.id}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                      <span>বয়স: <strong className="text-slate-800">{selectedPatient.age} বছর</strong></span>
                      <span>·</span>
                      <span>লিঙ্গ: <strong className="text-slate-800">{selectedPatient.gender}</strong></span>
                      <span>·</span>
                      <span>রক্তের গ্রুপ: <strong className="text-rose-600 font-bold">{selectedPatient.bloodGroup}</strong></span>
                      {selectedPatient.nid && (
                        <>
                          <span>·</span>
                          <span>এনআইডি: <strong className="font-mono text-slate-700">{selectedPatient.nid}</strong></span>
                        </>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      মোবাইল: <strong className="text-slate-800 font-mono">{selectedPatient.phone}</strong> · জরুরী যোগাযোগ: {selectedPatient.emergencyContact}
                    </div>
                  </div>
                </div>

                {/* Patient Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsAddVisitOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <FilePlus className="w-3.5 h-3.5" />
                    <span>{t('নতুন প্রেসক্রিপশন / ভিজিট লিখুন', 'Add New Visit / Rx')}</span>
                  </button>
                </div>
              </div>

              {/* Chronic Conditions & Allergies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>দীর্ঘমেয়াদী রোগ (Chronic Illnesses):</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedPatient.medicalHistory.chronicDiseases.length > 0 ? (
                      selectedPatient.medicalHistory.chronicDiseases.map((d, i) => (
                        <span key={i} className="text-xs text-slate-800 font-medium bg-white px-2 py-0.5 rounded border border-slate-200">
                          {d}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-[11px]">কোনো দীর্ঘমেয়াদী রোগ নথিভুক্ত নেই</span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-700 mb-1">
                    <span>ঔষধ ও অন্যান্য অ্যালার্জি (Allergies):</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedPatient.medicalHistory.allergies.length > 0 ? (
                      selectedPatient.medicalHistory.allergies.map((a, i) => (
                        <span key={i} className="text-xs text-amber-900 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          ⚠️ {a}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-[11px]">কোনো অ্যালার্জি নথিভুক্ত নেই</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Patient Visits History */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    কনসালটেশন ও ভিজিট ইতিহাস ({selectedPatient.visits.length}):
                  </h4>
                  <span className="text-xs text-slate-500">
                    সর্বশেষ ভিজিট: {selectedPatient.lastVisitAt || 'আজ পর্যন্ত কোনো ভিজিট নেই'}
                  </span>
                </div>

                {selectedPatient.visits.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-xs text-slate-500 mb-2">এই রোগীর কোনো পূর্ববর্তী প্রেসক্রিপশন বা ভিজিট রেকর্ড নেই।</p>
                    <button
                      onClick={() => setIsAddVisitOpen(true)}
                      className="px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 cursor-pointer"
                    >
                      + প্রথম প্রেসক্রিপশন ও ভাইটালস যুক্ত করুন
                    </button>
                  </div>
                ) : (
                  selectedPatient.visits.map((visit) => (
                    <div 
                      key={visit.visitId}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3"
                    >
                      <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{visit.doctorName}</span>
                            <span className="text-[11px] text-teal-700 font-medium">({visit.department})</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            তারিখ: {visit.date} · অভিযোগ: <span className="text-slate-700 font-medium">{visit.chiefComplaint}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <button
                            onClick={() => {
                              setSelectedVisitForPrint(visit);
                              setIsPrintPrescriptionOpen(true);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-teal-700 hover:text-teal-800 hover:bg-teal-50 rounded transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>প্রেসক্রিপশন প্রিন্ট</span>
                          </button>
                        </div>
                      </div>

                      {/* Vitals Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-50 p-2 rounded-lg text-center text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">BP</span>
                          <span className="font-bold text-slate-800">{visit.vitals.bloodPressure}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Pulse</span>
                          <span className="font-bold text-slate-800">{visit.vitals.pulseRate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Temp</span>
                          <span className="font-bold text-slate-800">{visit.vitals.temperature}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Weight</span>
                          <span className="font-bold text-slate-800">{visit.vitals.weightKg}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">SpO2</span>
                          <span className="font-bold text-slate-800">{visit.vitals.spo2}</span>
                        </div>
                      </div>

                      {/* Diagnosis */}
                      <div className="text-xs">
                        <strong className="text-slate-800">রোগ নির্ণয় (Diagnosis): </strong>
                        <span className="text-slate-700 font-medium">{visit.diagnosis}</span>
                      </div>

                      {/* Medicines List */}
                      <div>
                        <span className="text-xs font-bold text-slate-800 block mb-1.5">ব্যবস্থাপত্র (Rx):</span>
                        <div className="space-y-1">
                          {visit.prescription.map((rx, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 text-xs border border-slate-100">
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
                        <div className="text-xs text-slate-700">
                          <strong className="text-slate-800">প্রস্তাবিত টেস্ট: </strong>
                          {visit.advisedTests.join(', ')}
                        </div>
                      )}

                      {visit.doctorNotes && (
                        <div className="p-2 bg-amber-50/70 border border-amber-200 rounded text-xs text-amber-900">
                          <strong>ডাক্তারের পরামর্শ: </strong> {visit.doctorNotes}
                        </div>
                      )}

                      {visit.nextFollowUp && (
                        <div className="text-[11px] text-slate-500 text-right">
                          পরবর্তী ফলোআপ: <strong className="text-slate-700">{visit.nextFollowUp}</strong>
                        </div>
                      )}

                    </div>
                  ))
                )}
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs">
              বাম পাশের তালিকা থেকে কোনো রোগীকে নির্বাচন করুন।
            </div>
          )}
        </div>

      </div>

      {/* MODAL 1: Register New Patient */}
      {isAddPatientOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-teal-700 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{t('নতুন রোগী নিবন্ধন ফর্ম', 'New Patient Intake Form')}</h3>
                <p className="text-xs text-teal-100">স্বয়ংক্রিয় ইউনিক পেশেন্ট আইডি তৈরি হবে</p>
              </div>
              <button 
                onClick={() => setIsAddPatientOpen(false)}
                className="p-1 rounded-lg text-teal-100 hover:text-white hover:bg-teal-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">রোগীর নাম *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="যেমন: মো. কামরুল ইসলাম"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="01712000000"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">বয়স</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">লিঙ্গ</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Male">পুরুষ</option>
                    <option value="Female">মহিলা</option>
                    <option value="Other">অন্যান্য</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">রক্তের গ্রুপ</label>
                  <select
                    value={newBloodGroup}
                    onChange={(e) => setNewBloodGroup(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">জাতীয় পরিচয়পত্র (NID) নম্বর</label>
                  <input
                    type="text"
                    value={newNid}
                    onChange={(e) => setNewNid(e.target.value)}
                    placeholder="ঐচ্ছিক"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">জরুরী যোগাযোগের ফোন</label>
                  <input
                    type="tel"
                    value={newEmergency}
                    onChange={(e) => setNewEmergency(e.target.value)}
                    placeholder="পিতা / স্বামী / অভিভাবক"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ঠিকানা</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="বাড়ি, রোড, থানা, জেলা"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">দীর্ঘমেয়াদী রোগসমূহ (কমা দিয়ে লিখুন)</label>
                <input
                  type="text"
                  value={newChronic}
                  onChange={(e) => setNewChronic(e.target.value)}
                  placeholder="যেমন: ডায়াবেটিস, উচ্চ রক্তচাপ, হাঁপানি"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">অ্যালার্জি বা সংবেদনশীলতা</label>
                <input
                  type="text"
                  value={newAllergies}
                  onChange={(e) => setNewAllergies(e.target.value)}
                  placeholder="যেমন: পেনিসিলিন, ডাস্ট, সি-ফুড"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  নিবন্ধন সম্পন্ন করুন এবং আইডি তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Consultation Visit & Prescription */}
      {isAddVisitOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {selectedPatient.name} - নতুন কনসালটেশন ও ব্যবস্থাপত্র (Rx)
                </h3>
                <p className="text-xs text-slate-300">
                  আইডি: {selectedPatient.id} · বয়স: {selectedPatient.age} · রক্ত: {selectedPatient.bloodGroup}
                </p>
              </div>
              <button 
                onClick={() => setIsAddVisitOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVisit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Doctor and Department */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">কনসালট্যান্ট ডাক্তার</label>
                  <input
                    type="text"
                    required
                    value={visitDoctorName}
                    onChange={(e) => setVisitDoctorName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">বিভাগ</label>
                  <input
                    type="text"
                    required
                    value={visitDepartment}
                    onChange={(e) => setVisitDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Chief complaint & Diagnosis */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">রোগীর প্রধান সমস্যা (Chief Complaint)</label>
                  <input
                    type="text"
                    required
                    value={visitComplaint}
                    onChange={(e) => setVisitComplaint(e.target.value)}
                    placeholder="যেমন: ৩ দিন ধরে তীব্র শ্বাসকষ্ট ও কাশি"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">রোগ নির্ণয় (Diagnosis)</label>
                  <input
                    type="text"
                    required
                    value={visitDiagnosis}
                    onChange={(e) => setVisitDiagnosis(e.target.value)}
                    placeholder="যেমন: Acute Bronchitis"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Vitals Input */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-2">শারীরিক ভাইটালস (Patient Vitals):</span>
                <div className="grid grid-cols-5 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">BP (mmHg)</label>
                    <input
                      type="text"
                      value={visitBp}
                      onChange={(e) => setVisitBp(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Pulse</label>
                    <input
                      type="text"
                      value={visitPulse}
                      onChange={(e) => setVisitPulse(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Temp</label>
                    <input
                      type="text"
                      value={visitTemp}
                      onChange={(e) => setVisitTemp(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Weight</label>
                    <input
                      type="text"
                      value={visitWeight}
                      onChange={(e) => setVisitWeight(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">SpO2</label>
                    <input
                      type="text"
                      value={visitSpo2}
                      onChange={(e) => setVisitSpo2(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Prescription Items Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">প্রেসক্রিপশন ঔষধের তালিকা (Rx):</span>
                  <button
                    type="button"
                    onClick={handleAddPrescriptionRow}
                    className="flex items-center gap-1 text-xs text-teal-700 hover:text-teal-800 font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ আরেকটি ঔষধ যোগ করুন</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {prescriptionList.map((rx, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <div className="w-6 text-center text-xs font-bold text-slate-400">{idx + 1}</div>
                      <input
                        type="text"
                        placeholder="ঔষধের নাম (যেমন: Tab. Napa 500mg)"
                        value={rx.medicineName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPrescriptionList(prev => prev.map((item, i) => i === idx ? { ...item, medicineName: val } : item));
                        }}
                        className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                      />
                      <input
                        type="text"
                        placeholder="ডোজ (১+০+১)"
                        value={rx.dosage}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPrescriptionList(prev => prev.map((item, i) => i === idx ? { ...item, dosage: val } : item));
                        }}
                        className="w-20 px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white text-center"
                      />
                      <select
                        value={rx.timing}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setPrescriptionList(prev => prev.map((item, i) => i === idx ? { ...item, timing: val } : item));
                        }}
                        className="px-2 py-1.5 text-xs border border-slate-300 rounded bg-white"
                      >
                        <option value="After meal">খাবারের পর</option>
                        <option value="Before meal">খাবারের পূর্বে</option>
                        <option value="With meal">খাবারের সাথে</option>
                        <option value="Anytime">যেকোনো সময়</option>
                      </select>
                      <input
                        type="text"
                        placeholder="মেয়াদ (৭ দিন)"
                        value={rx.duration}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPrescriptionList(prev => prev.map((item, i) => i === idx ? { ...item, duration: val } : item));
                        }}
                        className="w-20 px-2 py-1.5 text-xs border border-slate-300 rounded bg-white text-center"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePrescriptionRow(idx)}
                        disabled={prescriptionList.length === 1}
                        className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advised Tests and Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">প্রস্তাবিত ডায়াগনস্টিক টেস্ট (কমা দিয়ে লিখুন)</label>
                <input
                  type="text"
                  value={visitAdvisedTests}
                  onChange={(e) => setVisitAdvisedTests(e.target.value)}
                  placeholder="যেমন: CBC, Chest X-Ray PA View, Serum Creatinine"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">পরবর্তী ফলোআপ তারিখ</label>
                  <input
                    type="date"
                    value={visitFollowUp}
                    onChange={(e) => setVisitFollowUp(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">বিশেষ পরামর্শ / উপদেশ</label>
                  <input
                    type="text"
                    value={visitNotes}
                    onChange={(e) => setVisitNotes(e.target.value)}
                    placeholder="যেমন: প্রচুর পানি পান করবেন ও বিশ্রাম নিবেন"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  প্রেসক্রিপশন ও ভিজিট রেকর্ড সংরক্ষণ করুন
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Printable Medical Prescription Slip */}
      {isPrintPrescriptionOpen && selectedVisitForPrint && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 p-8">
            <div className="flex items-center justify-between no-print mb-4 border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-teal-700">অফিসিয়াল প্রেসক্রিপশন প্রিন্ট প্রিভিউ</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট করুন</span>
                </button>
                <button
                  onClick={() => setIsPrintPrescriptionOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Hospital Header */}
            <div className="border-b-2 border-teal-700 pb-4 mb-5 text-center">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{settings.name}</h2>
              <p className="text-xs text-slate-600">{settings.slogan}</p>
              <p className="text-xs text-slate-500 mt-1">{settings.address} · হটলাইন: {settings.hotline}</p>
            </div>

            {/* Doctor Info */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-3 mb-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{selectedVisitForPrint.doctorName}</h4>
                <p className="text-slate-600">{selectedVisitForPrint.department}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-500">তারিখ: </span>
                <strong className="text-slate-800">{selectedVisitForPrint.date}</strong>
              </div>
            </div>

            {/* Patient demographic bar */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-4 gap-2 text-xs mb-6">
              <div>
                <span className="text-slate-400 block text-[10px]">রোগীর নাম:</span>
                <strong className="text-slate-900">{selectedPatient.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">আইডি / বয়স / লিঙ্গ:</span>
                <strong className="text-slate-900">{selectedPatient.id} · {selectedPatient.age}Y · {selectedPatient.gender}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">রক্তের গ্রুপ:</span>
                <strong className="text-rose-600">{selectedPatient.bloodGroup}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">BP / SpO2:</span>
                <strong className="text-slate-900">{selectedVisitForPrint.vitals.bloodPressure} · {selectedVisitForPrint.vitals.spo2}</strong>
              </div>
            </div>

            {/* Prescription Content: 2-column layout (Left: Tests & Advice, Right: Rx Medicines) */}
            <div className="grid grid-cols-12 gap-6 min-h-[300px]">
              
              {/* Left Column: Complaints, Diagnosis, Tests (4 cols) */}
              <div className="col-span-4 border-r border-slate-200 pr-4 space-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">লক্ষণ (Complaint)</span>
                  <p className="font-medium text-slate-800 mt-0.5">{selectedVisitForPrint.chiefComplaint}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">রোগ নির্ণয় (Diagnosis)</span>
                  <p className="font-bold text-teal-800 mt-0.5">{selectedVisitForPrint.diagnosis}</p>
                </div>

                {selectedVisitForPrint.advisedTests.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">প্রস্তাবিত পরীক্ষা (Tests)</span>
                    <ul className="list-disc list-inside space-y-1 mt-1 text-slate-700">
                      {selectedVisitForPrint.advisedTests.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column: Rx Symbol & Medicines (8 cols) */}
              <div className="col-span-8 space-y-3">
                <div className="text-2xl font-serif font-black text-teal-800">℞</div>
                <div className="space-y-3">
                  {selectedVisitForPrint.prescription.map((rx, idx) => (
                    <div key={idx} className="border-b border-slate-100 pb-2 text-xs">
                      <div className="flex items-baseline justify-between font-bold text-slate-900 text-sm">
                        <span>{idx + 1}. {rx.medicineName}</span>
                        <span className="font-mono text-teal-800 text-xs">{rx.dosage}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 mt-0.5 text-[11px]">
                        <span>{rx.timing}</span>
                        <span>·</span>
                        <span>{rx.duration}</span>
                        {rx.notes && (
                          <>
                            <span>·</span>
                            <span className="text-slate-600">{rx.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedVisitForPrint.doctorNotes && (
                  <div className="mt-4 p-2 bg-slate-50 rounded text-xs text-slate-700">
                    <strong>পরামর্শ: </strong>{selectedVisitForPrint.doctorNotes}
                  </div>
                )}
              </div>

            </div>

            {/* Footer with Doctor Signature Line */}
            <div className="mt-12 pt-6 border-t border-slate-200 flex items-end justify-between text-xs">
              <div className="text-[10px] text-slate-400">
                <p>সফটওয়্যার জেনারেটেড ডিজিটাল প্রেসক্রিপশন · {settings.name}</p>
                <p>পরবর্তী ভিজিটের সময় প্রেসক্রিপশনটি সাথে আনবেন</p>
              </div>
              <div className="text-center w-48">
                <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800">
                  {selectedVisitForPrint.doctorName}
                </div>
                <span className="text-[10px] text-slate-400">ডাক্তারের স্বাক্ষর ও সীল</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
