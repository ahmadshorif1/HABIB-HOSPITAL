import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  HospitalSettings, 
  User, 
  UserRole, 
  Patient, 
  PatientVisit, 
  Doctor, 
  Appointment, 
  LedgerItem, 
  LabTest, 
  Bed,
  PaymentMethod,
  DomainHostingSettings,
  FirebaseConfigSettings,
  TelegramBotSettings
} from '../types';
import { 
  initialHospitalSettings, 
  initialUsers, 
  initialDoctors, 
  initialPatients, 
  initialAppointments, 
  initialLedger, 
  initialLabTests, 
  initialBeds,
  initialDomainHostingSettings,
  initialFirebaseConfigSettings,
  initialTelegramBotSettings
} from '../data/mockData';
import { firebaseRegisterUser, firebaseLoginUser } from '../lib/firebase';

interface HospitalContextType {
  settings: HospitalSettings;
  updateSettings: (newSettings: Partial<HospitalSettings>) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  loginUser: (email: string, role?: UserRole) => boolean;
  logoutUser: () => void;
  language: 'bn' | 'en';
  setLanguage: (lang: 'bn' | 'en') => void;
  t: (bnText: string, enText: string) => string;

  // Domain & Hosting Activation
  domainHosting: DomainHostingSettings;
  updateDomainHosting: (updates: Partial<DomainHostingSettings>) => void;
  verifyDomainDns: () => Promise<boolean>;

  // Firebase Activation & Testing Mode
  firebaseConfig: FirebaseConfigSettings;
  updateFirebaseConfig: (updates: Partial<FirebaseConfigSettings>) => void;
  testFirebaseConnection: () => Promise<boolean>;
  firebaseSignUp: (email: string, password: string, role?: UserRole, name?: string) => Promise<boolean>;
  firebaseSignIn: (email: string, password: string) => Promise<boolean>;

  // Telegram Bot AI Integration
  telegramBot: TelegramBotSettings;
  updateTelegramBot: (updates: Partial<TelegramBotSettings>) => void;
  testTelegramBot: (token?: string) => Promise<{ ok: boolean; bot?: any; error?: string }>;
  setTelegramWebhook: (token?: string, url?: string) => Promise<{ ok: boolean; error?: string }>;



  // Patients
  patients: Patient[];
  searchPatients: (query: string) => Patient[];
  addPatient: (data: Omit<Patient, 'id' | 'registeredAt' | 'visits'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  addPatientVisit: (patientId: string, visit: Omit<PatientVisit, 'visitId' | 'date'>) => void;

  // Doctors
  doctors: Doctor[];
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;

  // Appointments
  appointments: Appointment[];
  bookAppointment: (data: {
    patientId?: string;
    patientName: string;
    patientPhone: string;
    patientAge: number;
    patientGender: string;
    doctorId: string;
    symptoms: string;
    paymentMethod?: PaymentMethod;
    transactionId?: string;
  }) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  payAppointment: (appointmentId: string, method: PaymentMethod, trxId?: string) => void;

  // Financial Ledger & Audit
  ledger: LedgerItem[];
  addTransaction: (data: Omit<LedgerItem, 'id' | 'date' | 'time' | 'recordedBy' | 'verified'>) => LedgerItem;
  getLedgerSummary: () => {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    todayIncome: number;
    todayExpense: number;
    cashCollection: number;
    digitalCollection: number;
  };

  // Lab Tests & Beds
  labTests: LabTest[];
  beds: Bed[];
  updateBedStatus: (bedId: string, status: Bed['status'], patientId?: string, patientName?: string) => void;

  // Navigation state
  adminView: 'dashboard' | 'patients' | 'appointments' | 'audit' | 'doctors' | 'beds' | 'settings' | 'domain_hosting' | 'firebase_testing' | 'telegram_bot';
  setAdminView: (view: 'dashboard' | 'patients' | 'appointments' | 'audit' | 'doctors' | 'beds' | 'settings' | 'domain_hosting' | 'firebase_testing' | 'telegram_bot') => void;
  patientView: 'home' | 'doctors' | 'book_serial' | 'my_bookings' | 'tests' | 'health_records';
  setPatientView: (view: 'home' | 'doctors' | 'book_serial' | 'my_bookings' | 'tests' | 'health_records') => void;

  // Modals
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalType: 'patient' | 'staff';
  setAuthModalType: (type: 'patient' | 'staff') => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  isDocsModalOpen: boolean;
  setIsDocsModalOpen: (open: boolean) => void;
  selectedDoctorForBooking: Doctor | null;
  setSelectedDoctorForBooking: (doc: Doctor | null) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Hospital Settings
  const [settings, setSettings] = useState<HospitalSettings>(() => {
    const saved = localStorage.getItem('hh_settings');
    return saved ? JSON.parse(saved) : initialHospitalSettings;
  });

  useEffect(() => {
    localStorage.setItem('hh_settings', JSON.stringify(settings));
    document.title = `${settings.name} - স্মার্ট হসপিটাল ও মেডিকেল ম্যানেজমেন্ট`;
  }, [settings]);

  const updateSettings = (newSettings: Partial<HospitalSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // 2. Language: Bangla & English
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const t = (bnText: string, enText: string) => (language === 'bn' ? bnText : enText);

  // 3. User Authentication
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hh_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hh_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hh_current_user');
    }
  }, [currentUser]);

  const loginUser = (email: string, roleOverride?: UserRole): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = initialUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setCurrentUser(existing);
      return true;
    }
    // Dynamic user creation if custom email provided
    const newUser: User = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      role: roleOverride || (cleanEmail.includes('admin') ? 'admin' : 'patient'),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCurrentUser(newUser);
    return true;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  // 4. Patients database
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('hh_patients');
    return saved ? JSON.parse(saved) : initialPatients;
  });

  useEffect(() => {
    localStorage.setItem('hh_patients', JSON.stringify(patients));
  }, [patients]);

  const searchPatients = (query: string): Patient[] => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.nid && p.nid.includes(q))
    );
  };

  const addPatient = (data: Omit<Patient, 'id' | 'registeredAt' | 'visits'>): Patient => {
    const nextNum = patients.length + 101;
    const newPatient: Patient = {
      ...data,
      id: `HH-2026-${String(nextNum).padStart(4, '0')}`,
      registeredAt: new Date().toISOString().split('T')[0],
      visits: [],
    };
    setPatients(prev => [newPatient, ...prev]);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addPatientVisit = (patientId: string, visit: Omit<PatientVisit, 'visitId' | 'date'>) => {
    const newVisit: PatientVisit = {
      ...visit,
      visitId: `VST-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
    };
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          lastVisitAt: newVisit.date,
          visits: [newVisit, ...p.visits],
        };
      }
      return p;
    }));
  };

  // 5. Doctors
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  // 6. Appointments
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('hh_appointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  useEffect(() => {
    localStorage.setItem('hh_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const bookAppointment = (data: {
    patientId?: string;
    patientName: string;
    patientPhone: string;
    patientAge: number;
    patientGender: string;
    doctorId: string;
    symptoms: string;
    paymentMethod?: PaymentMethod;
    transactionId?: string;
  }): Appointment => {
    const doc = doctors.find(d => d.id === data.doctorId);
    const doctorName = doc ? doc.name : 'কনসালট্যান্ট';
    const department = doc ? doc.department : 'General';
    const fee = doc ? doc.consultationFee : 800;

    // Calculate serial number for this doctor for today
    const todayStr = new Date().toISOString().split('T')[0];
    const todayDocAppointments = appointments.filter(a => a.doctorId === data.doctorId && a.appointmentDate === todayStr);
    const serialNo = todayDocAppointments.length + 1;

    // Resolve patient ID: if not passed, find or create
    let assignedPatientId = data.patientId;
    if (!assignedPatientId) {
      const match = patients.find(p => p.phone === data.patientPhone);
      if (match) {
        assignedPatientId = match.id;
      } else {
        const created = addPatient({
          name: data.patientName,
          age: data.patientAge,
          gender: data.patientGender as any || 'Male',
          bloodGroup: 'B+',
          phone: data.patientPhone,
          address: 'ঢাকা, বাংলাদেশ',
          emergencyContact: data.patientPhone,
          medicalHistory: { chronicDiseases: [], allergies: [], pastSurgeries: [] },
        });
        assignedPatientId = created.id;
      }
    }

    const isPaid = !!data.transactionId || data.paymentMethod === 'Cash' || data.paymentMethod === 'bKash' || data.paymentMethod === 'Nagad' || data.paymentMethod === 'Card';

    const newAppointment: Appointment = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      serialNo,
      patientId: assignedPatientId,
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      patientAge: data.patientAge,
      patientGender: data.patientGender,
      doctorId: data.doctorId,
      doctorName,
      department,
      appointmentDate: todayStr,
      appointmentTime: `সিরিয়াল নং ${serialNo} (আনুমানিক ${doc?.timing.split('-')[0].trim() || '৫:০০ PM'})`,
      fee,
      paymentStatus: isPaid ? 'PAID' : 'UNPAID',
      paymentMethod: data.paymentMethod || 'bKash',
      transactionId: data.transactionId || (isPaid ? `TX-${Date.now().toString().slice(-6)}` : undefined),
      status: 'SCHEDULED',
      symptoms: data.symptoms,
      bookedAt: new Date().toLocaleString(),
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Record ledger transaction if paid
    if (isPaid) {
      addTransaction({
        type: 'INCOME',
        category: 'Doctor OPD Fee',
        amount: fee,
        paymentMethod: data.paymentMethod || 'bKash',
        patientId: assignedPatientId,
        patientName: data.patientName,
        referenceInvoiceId: newAppointment.id,
        description: `${doctorName} কনসালটেশন ফি (সিরিয়াল #${serialNo})`,
      });
    }

    return newAppointment;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const payAppointment = (appointmentId: string, method: PaymentMethod, trxId?: string) => {
    const target = appointments.find(a => a.id === appointmentId);
    if (!target) return;

    const generatedTrxId = trxId || `TX-${Date.now().toString().slice(-7)}`;
    setAppointments(prev => prev.map(a => a.id === appointmentId ? {
      ...a,
      paymentStatus: 'PAID',
      paymentMethod: method,
      transactionId: generatedTrxId,
    } : a));

    addTransaction({
      type: 'INCOME',
      category: 'Doctor OPD Fee',
      amount: target.fee,
      paymentMethod: method,
      patientId: target.patientId,
      patientName: target.patientName,
      referenceInvoiceId: target.id,
      description: `${target.doctorName} কনসালটেশন ফি পরিশোধ (${method} Trx: ${generatedTrxId})`,
    });
  };

  // 7. Ledger & Accounts Audit
  const [ledger, setLedger] = useState<LedgerItem[]>(() => {
    const saved = localStorage.getItem('hh_ledger');
    return saved ? JSON.parse(saved) : initialLedger;
  });

  useEffect(() => {
    localStorage.setItem('hh_ledger', JSON.stringify(ledger));
  }, [ledger]);

  const addTransaction = (data: Omit<LedgerItem, 'id' | 'date' | 'time' | 'recordedBy' | 'verified'>): LedgerItem => {
    const now = new Date();
    const newTxn: LedgerItem = {
      ...data,
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recordedBy: currentUser ? currentUser.name : 'সিস্টেম ক্যাশিয়ার',
      verified: true,
    };
    setLedger(prev => [newTxn, ...prev]);
    return newTxn;
  };

  const getLedgerSummary = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    let totalIncome = 0;
    let totalExpense = 0;
    let todayIncome = 0;
    let todayExpense = 0;
    let cashCollection = 0;
    let digitalCollection = 0;

    ledger.forEach(item => {
      if (item.type === 'INCOME') {
        totalIncome += item.amount;
        if (item.date === todayStr) {
          todayIncome += item.amount;
        }
        if (item.paymentMethod === 'Cash' || item.paymentMethod === 'POS') {
          cashCollection += item.amount;
        } else {
          digitalCollection += item.amount;
        }
      } else {
        totalExpense += item.amount;
        if (item.date === todayStr) {
          todayExpense += item.amount;
        }
      }
    });

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      todayIncome,
      todayExpense,
      cashCollection,
      digitalCollection,
    };
  };

  // 8. Beds & Lab Tests
  const [beds, setBeds] = useState<Bed[]>(initialBeds);
  const [labTests] = useState<LabTest[]>(initialLabTests);

  const updateBedStatus = (bedId: string, status: Bed['status'], patientId?: string, patientName?: string) => {
    setBeds(prev => prev.map(b => {
      if (b.id === bedId) {
        return {
          ...b,
          status,
          occupiedByPatientId: status === 'OCCUPIED' ? patientId : undefined,
          occupiedByPatientName: status === 'OCCUPIED' ? patientName : undefined,
          admissionDate: status === 'OCCUPIED' ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return b;
    }));
  };

  // 9. Domain & Hosting Activation Settings
  const [domainHosting, setDomainHosting] = useState<DomainHostingSettings>(() => {
    const saved = localStorage.getItem('hh_domain_hosting');
    return saved ? JSON.parse(saved) : initialDomainHostingSettings;
  });

  useEffect(() => {
    localStorage.setItem('hh_domain_hosting', JSON.stringify(domainHosting));
  }, [domainHosting]);

  const updateDomainHosting = (updates: Partial<DomainHostingSettings>) => {
    setDomainHosting(prev => ({ ...prev, ...updates }));
  };

  const verifyDomainDns = async (): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 700));
    setDomainHosting(prev => ({
      ...prev,
      isDomainActive: true,
      sslEnabled: true,
      lastVerifiedAt: new Date().toLocaleString(),
      dnsRecords: prev.dnsRecords.map(r => ({ ...r, status: 'VERIFIED' }))
    }));
    return true;
  };

  // 10. Firebase Activation & Testing Mode
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfigSettings>(() => {
    const saved = localStorage.getItem('hh_firebase_config');
    return saved ? JSON.parse(saved) : initialFirebaseConfigSettings;
  });

  useEffect(() => {
    localStorage.setItem('hh_firebase_config', JSON.stringify(firebaseConfig));
  }, [firebaseConfig]);

  const updateFirebaseConfig = (updates: Partial<FirebaseConfigSettings>) => {
    setFirebaseConfig(prev => ({ ...prev, ...updates }));
  };

  const testFirebaseConnection = async (): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 600));
    setFirebaseConfig(prev => ({
      ...prev,
      isConnected: true,
      lastConnectedAt: new Date().toLocaleString(),
    }));
    return true;
  };

  const firebaseSignUp = async (email: string, pass: string, role: UserRole = 'patient', name?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const fbRes = await firebaseRegisterUser(cleanEmail, pass);
    const newUser: User = {
      id: fbRes.uid,
      firebaseUid: fbRes.uid,
      name: name || cleanEmail.split('@')[0],
      email: cleanEmail,
      role,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCurrentUser(newUser);
    setFirebaseConfig(prev => ({
      ...prev,
      isConnected: true,
      testUsersCount: prev.testUsersCount + 1,
      lastConnectedAt: new Date().toLocaleString(),
    }));
    return true;
  };

  const firebaseSignIn = async (email: string, pass: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const fbRes = await firebaseLoginUser(cleanEmail, pass);
    const existing = initialUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setCurrentUser({ ...existing, firebaseUid: fbRes.uid });
    } else {
      const fbUser: User = {
        id: fbRes.uid,
        firebaseUid: fbRes.uid,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        role: cleanEmail.includes('admin') ? 'admin' : 'patient',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCurrentUser(fbUser);
    }
    setFirebaseConfig(prev => ({
      ...prev,
      isConnected: true,
      lastConnectedAt: new Date().toLocaleString(),
    }));
    return true;
  };

  // 11. Telegram Bot Integration
  const [telegramBot, setTelegramBot] = useState<TelegramBotSettings>(() => {
    const saved = localStorage.getItem('hh_telegram_bot');
    return saved ? JSON.parse(saved) : initialTelegramBotSettings;
  });

  useEffect(() => {
    localStorage.setItem('hh_telegram_bot', JSON.stringify(telegramBot));
  }, [telegramBot]);

  const updateTelegramBot = (updates: Partial<TelegramBotSettings>) => {
    setTelegramBot(prev => ({ ...prev, ...updates }));
  };

  const testTelegramBot = async (customToken?: string): Promise<{ ok: boolean; bot?: any; error?: string }> => {
    const token = customToken || telegramBot.botToken;
    if (!token) return { ok: false, error: 'টেলিগ্রাম বট টোকেন প্রদান করুন' };
    try {
      const res = await fetch('/api/telegram/test-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: token }),
      });
      const data = await res.json();
      if (data.ok) {
        setTelegramBot(prev => ({
          ...prev,
          isActive: true,
          botUsername: data.result?.username || prev.botUsername,
          lastConnectedAt: new Date().toLocaleString(),
        }));
        return { ok: true, bot: data.result };
      }
      return { ok: false, error: data.description || 'বট টোকেন সঠিক নয়' };
    } catch (e: any) {
      return { ok: false, error: e.message };
    }
  };

  const setTelegramWebhook = async (customToken?: string, customUrl?: string): Promise<{ ok: boolean; error?: string }> => {
    const token = customToken || telegramBot.botToken;
    const webhookUrl = customUrl || `${window.location.origin}/api/telegram/webhook`;
    if (!token) return { ok: false, error: 'টেলিগ্রাম বট টোকেন প্রদান করুন' };
    try {
      const res = await fetch('/api/telegram/set-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: token, webhookUrl }),
      });
      const data = await res.json();
      if (data.ok) {
        setTelegramBot(prev => ({
          ...prev,
          isActive: true,
          webhookUrl,
          lastConnectedAt: new Date().toLocaleString(),
        }));
        return { ok: true };
      }
      return { ok: false, error: data.description || 'Webhook সেট করা সম্ভব হয়নি' };
    } catch (e: any) {
      return { ok: false, error: e.message };
    }
  };

  // 12. View State Management
  const [adminView, setAdminView] = useState<'dashboard' | 'patients' | 'appointments' | 'audit' | 'doctors' | 'beds' | 'settings' | 'domain_hosting' | 'firebase_testing' | 'telegram_bot'>('dashboard');
  const [patientView, setPatientView] = useState<'home' | 'doctors' | 'book_serial' | 'my_bookings' | 'tests' | 'health_records'>('home');

  // 13. Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'patient' | 'staff'>('patient');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);

  return (
    <HospitalContext.Provider value={{
      settings,
      updateSettings,
      currentUser,
      setCurrentUser,
      loginUser,
      logoutUser,
      language,
      setLanguage,
      t,
      domainHosting,
      updateDomainHosting,
      verifyDomainDns,
      firebaseConfig,
      updateFirebaseConfig,
      testFirebaseConnection,
      firebaseSignUp,
      firebaseSignIn,
      telegramBot,
      updateTelegramBot,
      testTelegramBot,
      setTelegramWebhook,
      patients,
      searchPatients,
      addPatient,
      updatePatient,
      addPatientVisit,
      doctors,
      updateDoctor,
      appointments,
      bookAppointment,
      updateAppointmentStatus,
      payAppointment,
      ledger,
      addTransaction,
      getLedgerSummary,
      labTests,
      beds,
      updateBedStatus,
      adminView,
      setAdminView,
      patientView,
      setPatientView,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authModalType,
      setAuthModalType,
      isAiModalOpen,
      setIsAiModalOpen,
      isDocsModalOpen,
      setIsDocsModalOpen,
      selectedDoctorForBooking,
      setSelectedDoctorForBooking,
    }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
