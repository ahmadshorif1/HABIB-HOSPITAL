export type UserRole = 
  | 'admin' 
  | 'subadmin_doctor' 
  | 'subadmin_reception' 
  | 'subadmin_accountant' 
  | 'patient' 
  | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  specialty?: string; // For doctors
  department?: string;
  employeeId?: string;
  firebaseUid?: string;
  createdAt: string;
}

export interface HospitalSettings {
  name: string;
  slogan: string;
  established: string;
  regNumber: string;
  address: string;
  hotline: string;
  emergencyPhone: string;
  email: string;
  website: string;
  directorName: string;
  currency: string;
  vatPercent: number;
  consultationVatIncluded: boolean;
  themeColor: string;
  noticeBanner?: string;
}

export interface Patient {
  id: string; // e.g. "HH-2026-0101"
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  email?: string;
  nid?: string;
  address: string;
  guardianName?: string;
  emergencyContact: string;
  registeredAt: string;
  lastVisitAt?: string;
  medicalHistory: {
    chronicDiseases: string[];
    allergies: string[];
    pastSurgeries: string[];
  };
  visits: PatientVisit[];
}

export interface PatientVisit {
  visitId: string;
  date: string;
  doctorName: string;
  department: string;
  chiefComplaint: string;
  diagnosis: string;
  vitals: {
    bloodPressure: string;
    pulseRate: string;
    temperature: string;
    weightKg: string;
    spo2: string;
  };
  prescription: PrescriptionItem[];
  advisedTests: string[];
  nextFollowUp?: string;
  doctorNotes?: string;
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string; // e.g. "1+0+1"
  timing: 'Before meal' | 'After meal' | 'With meal' | 'Anytime';
  duration: string; // e.g. "7 days"
  notes?: string;
}

export interface Doctor {
  id: string;
  name: string;
  designation: string;
  department: string;
  degrees: string;
  experienceYears: number;
  roomNo: string;
  consultationFee: number;
  availableDays: string[];
  timing: string;
  maxPatientsPerDay: number;
  bookedToday: number;
  avatar: string;
  isActive: boolean;
}

export interface Appointment {
  id: string; // e.g. "APT-9921"
  serialNo: number; // e.g. 1, 2, 3...
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  department: string;
  appointmentDate: string;
  appointmentTime: string;
  fee: number;
  paymentStatus: 'PAID' | 'UNPAID' | 'REFUNDED';
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  status: 'SCHEDULED' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED';
  symptoms: string;
  bookedAt: string;
  notes?: string;
}

export type TransactionType = 'INCOME' | 'EXPENSE';
export type PaymentMethod = 'bKash' | 'Nagad' | 'Rocket' | 'Card' | 'Cash' | 'POS' | 'Bank Transfer';

export interface LedgerItem {
  id: string;
  date: string;
  time: string;
  type: TransactionType;
  category: 
    | 'Doctor OPD Fee' 
    | 'Diagnostic Lab' 
    | 'Cabin & Bed Rent' 
    | 'Pharmacy Sale' 
    | 'Emergency Service' 
    | 'Staff Salary' 
    | 'Medical Supplies' 
    | 'Equipment Maintenance' 
    | 'Utility & Overhead' 
    | 'Other';
  amount: number;
  paymentMethod: PaymentMethod;
  patientId?: string;
  patientName?: string;
  referenceInvoiceId?: string;
  description: string;
  recordedBy: string;
  verified: boolean;
}

export interface LabTest {
  id: string;
  testName: string;
  category: 'Pathology' | 'Radiology' | 'Biochemistry' | 'Microbiology' | 'Cardiology';
  price: number;
  deliveryHours: number;
  sampleRequired: string;
  description: string;
}

export interface Bed {
  id: string;
  wardOrCabin: string; // e.g. "Cabin 304", "General Ward A-04", "ICU Bed 2"
  type: 'General Ward' | 'Cabin AC' | 'Cabin Non-AC' | 'ICU' | 'CCU';
  costPerDay: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  occupiedByPatientId?: string;
  occupiedByPatientName?: string;
  admissionDate?: string;
}

export interface DnsRecord {
  type: 'A' | 'CNAME' | 'TXT';
  host: string;
  value: string;
  status: 'VERIFIED' | 'PENDING';
  ttl: string;
}

export interface DomainHostingSettings {
  customDomain: string; // e.g. "habibhospital.org"
  subdomain: string; // e.g. "portal"
  isDomainActive: boolean;
  sslEnabled: boolean;
  dnsRecords: DnsRecord[];
  hostingProvider: 'Cloud Run' | 'Ubuntu VPS (Nginx)' | 'cPanel / DirectAdmin' | 'Docker / K8s';
  serverIp: string;
  port: number;
  reverseProxyConfig: string;
  lastVerifiedAt?: string;
}

export interface FirebaseConfigSettings {
  isTestingModeActive: boolean;
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  isConnected: boolean;
  lastConnectedAt?: string;
  testUsersCount: number;
}

export interface TelegramBotSettings {
  botToken: string;
  botUsername: string;
  isActive: boolean;
  webhookUrl: string;
  lastConnectedAt?: string;
  totalMessagesProcessed: number;
}


