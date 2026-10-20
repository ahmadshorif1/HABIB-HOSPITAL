import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Bed } from '../../types';
import { BedDouble, CheckCircle, AlertTriangle, UserPlus, LogOut, Search, ShieldAlert, X } from 'lucide-react';

export const BedCabinManagement: React.FC = () => {
  const { beds, updateBedStatus, patients, settings, t } = useHospital();

  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [patientIdInput, setPatientIdInput] = useState('');
  const [patientNameInput, setPatientNameInput] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const availableBeds = beds.filter(b => b.status === 'AVAILABLE').length;
  const occupiedBeds = beds.filter(b => b.status === 'OCCUPIED').length;

  const handleOpenAssign = (bed: Bed) => {
    setSelectedBed(bed);
    setPatientIdInput('');
    setPatientNameInput('');
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBed || !patientNameInput) return;

    updateBedStatus(
      selectedBed.id, 
      'OCCUPIED', 
      patientIdInput || `HH-2026-${Math.floor(1000 + Math.random() * 9000)}`, 
      patientNameInput
    );
    setIsAssignModalOpen(false);
  };

  const handleDischarge = (bed: Bed) => {
    if (confirm(`আপনি কি "${bed.wardOrCabin}" থেকে রোগীকে রিলিজ / ডিসচার্জ করতে চান?`)) {
      updateBedStatus(bed.id, 'AVAILABLE');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Statistics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t('কেবিন, সাধারণ ওয়ার্ড ও আইসিইউ বেড ব্যবস্থাপনা', 'Bed & Cabin Management')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('আইসিইউ, সিসিইউ, ডিলাক্স কেবিন ও ওয়ার্ডের লাইভ অকুপেন্সি এবং রোগী ভর্তি পরিচালনা।', 'Real-time monitoring of ICU, CCU, Ward, and Deluxe Cabins admission status.')}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 font-semibold">
            খালি বেড: {availableBeds} টি
          </div>
          <div className="px-3 py-1.5 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 font-semibold">
            ভর্তি রোগী: {occupiedBeds} জন
          </div>
        </div>
      </div>

      {/* Bed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {beds.map(bed => {
          const isOccupied = bed.status === 'OCCUPIED';
          return (
            <div
              key={bed.id}
              className={`p-5 rounded-xl border transition-all ${isOccupied ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200 bg-white hover:border-teal-500 shadow-2xs'}`}
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isOccupied ? 'bg-amber-100 text-amber-800' : 'bg-teal-50 text-teal-700'}`}>
                    <BedDouble className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{bed.wardOrCabin}</h4>
                    <span className="text-[11px] text-slate-500 block">{bed.type}</span>
                  </div>
                </div>

                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${isOccupied ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                  {isOccupied ? 'ভর্তি রয়েছে' : 'খালি আছে'}
                </span>
              </div>

              {/* Occupancy details */}
              <div className="text-xs space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-slate-500">
                  <span>দৈনিক ভাড়া:</span>
                  <span className="font-bold text-slate-800">{settings.currency} {bed.costPerDay} / দিন</span>
                </div>

                {isOccupied ? (
                  <>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>ভর্তি রোগী:</span>
                      <span className="font-bold text-slate-900">{bed.occupiedByPatientName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>পেশেন্ট আইডি:</span>
                      <span className="font-mono text-teal-800">{bed.occupiedByPatientId}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>ভর্তির তারিখ:</span>
                      <span>{bed.admissionDate}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-[11px] text-slate-400 py-1">
                    বর্তমানে কোনো রোগী ভর্তি নেই। নতুন রোগী অ্যাসাইন করতে পারেন।
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100">
                {isOccupied ? (
                  <button
                    onClick={() => handleDischarge(bed)}
                    className="w-full py-1.5 px-3 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ডিসচার্জ / বেড খালি করুন</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenAssign(bed)}
                    className="w-full py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>রোগী ভর্তি / বেড বরাদ্দ করুন</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: Assign Bed to Patient */}
      {isAssignModalOpen && selectedBed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-teal-700 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">বেড বরাদ্দ ও রোগী ভর্তি</h3>
                <p className="text-xs text-teal-100">{selectedBed.wardOrCabin} ({selectedBed.type})</p>
              </div>
              <button 
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1 rounded-lg text-teal-100 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAssign} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">রোগীর পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={patientNameInput}
                  onChange={(e) => setPatientNameInput(e.target.value)}
                  placeholder="যেমন: সফিকুল ইসলাম"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">পেশেন্ট আইডি (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={patientIdInput}
                  onChange={(e) => setPatientIdInput(e.target.value)}
                  placeholder="যেমন: HH-2026-0101"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="text-slate-500">দৈনিক ভাড়া: </span>
                <strong className="text-slate-900">{settings.currency} {selectedBed.costPerDay}</strong>
                <p className="text-[10px] text-slate-400 mt-0.5">রিলিজের সময় স্বয়ংক্রিয়ভাবে ইনভয়েস জেনারেট করা যাবে।</p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  বেড বরাদ্দ নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
