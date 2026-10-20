# HABIB HOSPITAL - স্মার্ট হসপিটাল ও মেডিকেল ম্যানেজমেন্ট সিস্টেম

একটি আধুনিক, সুরক্ষিত ও স্বয়ংক্রিয় ক্লাউড-রেডি মেডিকেল ম্যানেজমেন্ট ওয়েব অ্যাপ্লিকেশন, যা ক্লিনিক্যাল কার্যক্রম, ডাক্তার সিরিয়াল বুকিং, রোগীদের ইএমআর (EMR) রেকর্ড, আর্থিক হিসাব অডিট এবং কৃত্রিম বুদ্ধিমত্তা (Gemini AI) চালিত স্বাস্থ্য সহকারী সমন্বয়ে নির্মিত।

---

## 🌟 প্রধান মডিউল ও সুবিধাসমূহ

### ১. রোগীদের দ্রুত তথ্য অনুসন্ধান ও ইএমআর (EMR Records)
- **তাৎক্ষণিক সার্চ ইঞ্জিন:** মোবাইল নম্বর, জাতীয় পরিচয়পত্র (NID), ইউনিক পেশেন্ট আইডি (যেমন `HH-2026-0101`) বা রোগীর নাম দিয়ে চোখের পলকে পুরাতন রেকর্ড খুঁজে বের করা।
- **নতুন তথ্য ও প্রেসক্রিপশন আপডেট:** পূর্বের রেকর্ড বের করে নতুন ভিজিট যোগ করা, শারীরিক ভাইটালস (BP, Pulse, Temp, SpO2, Weight) সংরক্ষণ, ডিজিটাল প্রেসক্রিপশন (Rx) তৈরি এবং অফিসিয়াল প্যাডে প্রিন্ট।
- **মেডিকেল হিস্ট্রি:** অ্যালার্জি, দীর্ঘমেয়াদী রোগ ও সার্জারি হিস্ট্রি ট্র্যাকিং।

### ২. হিসাব ও আর্থিক অডিট (Financial Ledger & Audit)
- **আয় ও ব্যয় ট্র্যাকিং:** ওপিডি কনসালটেশন, ল্যাব টেস্ট, কেবিন ও বেড ভাড়া, ফার্মেসি, স্টাফদের বেতন এবং হাসপাতালের পরিচালন ব্যয়ের বিস্তারিত ডাবল-এন্ট্রি লেজার।
- **পেমেন্ট মেথড বিভাজন:** কাউন্টার ক্যাশ বনাম ডিজিটাল মোবাইল ব্যাংকিং (bKash, Nagad, Rocket, Card) পৃথক অডিট হিসাব।
- **১-ক্লিক প্রিন্ট অডিট স্টেটমেন্ট:** ম্যানেজমেন্ট মিটিং বা সরকারি অডিটের জন্য তাৎক্ষণিক প্রিন্টযোগ্য অডিট শীট।

### ৩. অনলাইন ও অফলাইন পেমেন্ট গেটওয়ে
- **অনলাইন পেমেন্ট:** বিকাশ, নগদ, রকেট এবং ভিসা/মাস্টারকার্ডের মাধ্যমে ঘরে বসেই ডাক্তার ফি পরিশোধ ও ট্রানজেকশন আইডি সহ ইনস্ট্যান্ট ভেরিফিকেশন।
- **অফলাইন পেমেন্ট:** রিসেপশন ডেস্কে নগদ ক্যাশ বা কার্ডে পেমেন্ট গ্রহণ ও মানি রিসিট প্রদান।

### ৪. ক্লায়েন্ট ও এডমিন প্যানেলের কঠোর বিচ্ছিন্নকরণ (Role Security)
- সাধারণ রোগী বা বহিরাগত ব্যবহারকারীদের সামনে এডমিন প্যানেলের কোনো ইউআরএল, অপশন বা ডেটা রেন্ডার হবে না।
- **এডমিন ও সাব-এডমিন বিশেষ পোর্টাল:** স্পেশাল ইমেইল ও পাসওয়ার্ড প্রমাণীকরণ দ্বারা পরিচালক (Admin), ডাক্তার (Doctor), অভ্যর্থনা কর্মী (Reception) এবং হিসাবরক্ষক (Accountant) স্বতন্ত্র ভূমিকা পালন করবেন।

### ৫. জেমিনি ৩.৮ ফ্ল্যাশ চালিত এআই স্বাস্থ্য সহকারী (Gemini AI Chatbot)
- `@google/genai` (Gemini 3.8 Flash) দ্বারা পরিচালিত সার্বক্ষণিক দ্বিভাষিক (বাংলা ও ইংরেজি) হেলথ চ্যাটবট।
- রোগীর প্রাথমিক লক্ষণ পর্যালোচনা (Symptom Triage), সঠিক ডাক্তার বিভাগ নির্বাচন, ল্যাব টেস্টের প্রস্তুতি নির্দেশিকা এবং হাসপাতাল সংক্রান্ত তথ্যে সহায়তা।

### ৬. নিজস্ব ডোমেইন ও হোস্টিং অ্যাক্টিভেশন সিস্টেম (Custom Domain & Hosting)
- **কাস্টম ডোমেইন কানেকশন:** হাসপাতালের নিজস্ব ডোমেইন (যেমন `habibhospital.org` বা `hospital.com.bd`) লাইভ যুক্ত ও পরিবর্তন করার সুবিধা।
- **ডিএনএস রেকর্ড ভেরিফিকেশন:** A-Record, CNAME এবং TXT ভেরিফিকেশন রেকর্ড টেবিল ও লাইভ ডিএনএস পিং চেকার।
- **এসএসএল ও রিভার্স প্রক্সি:** Let's Encrypt SSL/HTTPS সক্রিয়করণ এবং Ubuntu VPS-এর জন্য অটো-জেনারেটেড Nginx Reverse Proxy কনফিগারেশন।

### ৭. ফায়ারবেজ অ্যাক্টিভেশন ও টেস্টিং মোড (Firebase Auth & Sandbox)
- **লাইভ ফায়ারবেজ এসডিকে:** আপনার প্রজেক্ট (`habib-hospital`) এর সাথে সরাসরি সংযুক্ত।
- **টেস্টিং সাইনআপ ও লগইন:** অথেনটিকেশন মডালে স্ট্যান্ডার্ড লগইন ছাড়াও ফায়ারবেজ ইমেইল/পাসওয়ার্ড ও গুগল সাইনইন সিমুলেশন সুবিধা।
- **ক্রেডেনশিয়াল কন্ট্রোল:** এডমিন প্যানেল থেকে API Key, Auth Domain, Project ID, Storage Bucket পরীক্ষা ও লাইভ পিং ল্যাটেন্সি মনিটরিং।

### ৮. টেলিগ্রাম বট টোকেন ও এআই স্বাস্থ্য সহকারী (Telegram Bot AI Operations)
- **টেলিগ্রাম বট টোকেন অ্যাক্টিভেশন:** @BotFather থেকে প্রাপ্ত HTTP API Token দিয়ে এডমিন প্যানেল থেকে লাইভ সংযোগ যাচাই ও বটের তথ্য প্রাপ্তি।
- **রিয়েল-টাইম ওয়েবহুক আর্কিটেকচার:** `/api/telegram/webhook?token=...` দিয়ে টেলিগ্রাম ক্লাউড সার্ভার থেকে হাসপাতালের ক্লাউড ব্যাকএন্ডে শূন্য-বিলম্বিত (Zero-latency) ইভেন্ট ডেলিভারি।
- **Gemini 3.8 Flash এআই ট্রায়াজ:** টেলিগ্রামে রোগী যেকোনো প্রশ্ন করলে তাৎক্ষণিক বাংলা/ইংরেজি স্বাস্থ্য ট্রায়াজ এবং প্রেসক্রিপশন সতর্কবার্তা।
- **স্বয়ংক্রিয় কমান্ড ব্যবস্থা:** `/start`, `/doctors`, `/serial`, `/hotline`, `/tests`, `/beds`।
- **ইন-অ্যাপ সিমুলেটর ও লাইভ মেসেজ টেস্ট:** এডমিন প্যানেল থেকেই যেকোনো Telegram Chat ID-তে টেস্ট অ্যালার্ট পাঠানো এবং ব্রাউজারে ইন্টারেক্টিভ সিমুলেটরে পরীক্ষা করার সুবিধা।

---

## 🔄 রিসোর্স কোড আপডেট করে মালিকানা পরিবর্তন গাইডলাইন (Ownership Transfer)

অ্যাপ্লিকেশনটির নাম পরিবর্তন করে অন্য কোনো হাসপাতাল বা ক্লিনিকে হস্তান্তর করার জন্য নিচের ফাইলগুলোতে পরিবর্তন আনতে হবে:

| ক্রম | ফাইলের পাথ | যে বিষয়গুলো আপডেট করতে হবে |
|:---:|:---|:---|
| **১** | `/src/data/mockData.ts` | `initialHospitalSettings` অবজেক্টে `name`, `slogan`, `address`, `hotline`, `emergencyPhone`, `email`, `directorName` পরিবর্তন করুন। |
| **২** | `/index.html` | `<title>`, `<meta name="description">`, `<meta property="og:title">` ট্যাগে নতুন হাসপাতালের নাম ও বর্ণনা বসান। |
| **৩** | `/metadata.json` | `"name"` এবং `"description"` প্রোপার্টিতে নতুন ক্লায়েন্টের ব্র্যান্ডিং সেট করুন। |
| **৪** | `/server.ts` | এআই চ্যাটবটের ব্যাকএন্ড সিস্টেম নির্দেশিকায় হাসপাতালের ডিফল্ট নাম ও হটলাইন নম্বর আপডেট করুন। |
| **৫** | `/.env` | `GEMINI_API_KEY` এবং ভবিষ্যতে পেমেন্ট গেটওয়ের মার্চেন্ট কি (bKash/Nagad/SSLCommerz Credentials) কনফিগার করুন। |
| **৬** | **এডমিন সেটিংস UI** | কোড এডিট ছাড়াও সরাসরি ব্রাউজারে এডমিন লগইন করে **"হাসপাতাল সেটিংস ও নাম পরিবর্তন"** মডালে গিয়ে লাইভ নাম, স্লোগান ও ঠিকানা আপডেট করা যায়। |

---

## 🗄️ স্কেলেবল ডাটাবেস স্কিমা ডিজাইন (Scalable PostgreSQL Schema)

লাখো রোগীর তথ্য ও নিরবচ্ছিন্ন অডিট ট্রেইলের জন্য রিলেশনাল স্কিমা স্থাপত্য:

```sql
-- ১. রোগী টেবিল (Patients Table with B-Tree Indexing)
CREATE TABLE patients (
    id VARCHAR(36) PRIMARY KEY,
    mrn_number VARCHAR(20) UNIQUE NOT NULL, -- যেমন: 'HH-2026-0101'
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    nid_number VARCHAR(30) UNIQUE,
    gender VARCHAR(10) NOT NULL,
    age INT NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    address TEXT,
    emergency_contact VARCHAR(60),
    chronic_illnesses TEXT[],
    allergies TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_patients_mrn ON patients(mrn_number);
CREATE INDEX idx_patients_nid ON patients(nid_number);

-- ২. ডাক্তার টেবিল (Doctors Table)
CREATE TABLE doctors (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    designation VARCHAR(100),
    department VARCHAR(80) NOT NULL,
    degrees TEXT NOT NULL,
    room_number VARCHAR(20),
    consultation_fee DECIMAL(10,2) NOT NULL,
    opd_timing VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE
);

-- ৩. সিরিয়াল ও অ্যাপয়েন্টমেন্ট টেবিল (Appointments & Serials)
CREATE TABLE appointments (
    id VARCHAR(36) PRIMARY KEY,
    serial_no INT NOT NULL,
    patient_id VARCHAR(36) REFERENCES patients(id) ON DELETE RESTRICT,
    doctor_id VARCHAR(36) REFERENCES doctors(id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(50),
    fee DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'UNPAID', -- 'PAID', 'UNPAID'
    payment_method VARCHAR(30), -- 'bKash', 'Nagad', 'Cash', 'Card'
    transaction_id VARCHAR(60),
    status VARCHAR(30) DEFAULT 'SCHEDULED', -- 'SCHEDULED', 'IN_CONSULTATION', 'COMPLETED'
    symptoms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_appointments_date_doc ON appointments(appointment_date, doctor_id);

-- ৪. ক্লিনিক্যাল কনসালটেশন ও ইএমআর ভিজিট টেবিল (Clinical Visits & Prescriptions)
CREATE TABLE clinical_visits (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id VARCHAR(36) REFERENCES doctors(id),
    visit_date DATE NOT NULL,
    chief_complaint TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    blood_pressure VARCHAR(20),
    pulse_rate VARCHAR(20),
    temperature VARCHAR(20),
    weight_kg VARCHAR(20),
    spo2 VARCHAR(20),
    prescription_items JSONB NOT NULL, -- [{medicineName, dosage, timing, duration, notes}]
    advised_tests TEXT[],
    doctor_notes TEXT,
    next_follow_up DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_visits_patient ON clinical_visits(patient_id);

-- ৫. আর্থিক লেজার ও অডিট টেবিল (Financial Ledger & Audit Trail)
CREATE TABLE financial_ledger (
    id BIGSERIAL PRIMARY KEY,
    transaction_date DATE NOT NULL,
    transaction_time VARCHAR(20) NOT NULL,
    type VARCHAR(10) NOT NULL, -- 'INCOME' অথবা 'EXPENSE'
    category VARCHAR(60) NOT NULL, -- 'Doctor OPD Fee', 'Diagnostic Lab', 'Salary', etc.
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    patient_id VARCHAR(36) REFERENCES patients(id),
    reference_invoice_id VARCHAR(60),
    description TEXT NOT NULL,
    recorded_by VARCHAR(100) NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_ledger_date ON financial_ledger(transaction_date);
CREATE INDEX idx_ledger_type ON financial_ledger(type);
```

---

## 📱 টেলিগ্রাম বট টোকেন দিয়ে চ্যাটবট পরিচালনার পূর্ণাঙ্গ সল্যুশন ও আর্কিটেকচার

হাসপাতালের সার্বক্ষণিক স্বাস্থ্য পরামর্শ, ডাক্তার সিরিয়াল বুকিং এবং জরুরী হটলাইন সেবা সরাসরি টেলিগ্রামে পরিচালনার জন্য টেলিগ্রাম বট টোকেন আর্কিটেকচারটি সম্পূর্ণ প্রস্তুত।

### ১. কীভাবে বট টোকেন তৈরি করবেন (Step-by-Step @BotFather Setup):
1. আপনার টেলিগ্রাম অ্যাপ খুলে সার্চ করুন: **`@BotFather`** (অফিসিয়াল ব্লু টিক সহ)।
2. চ্যাটে লিখুন: `/newbot`
3. বটের ডিসপ্লে নাম দিন: যেমন `HABIB HOSPITAL Assistant`
4. বটের ইউনিক ইউজারনেম দিন: যেমন `habib_hospital_bot` (অবশ্যই `bot` দিয়ে শেষ হতে হবে)।
5. `@BotFather` আপনাকে একটি গোপন **HTTP API Token** প্রদান করবে:
   ```
   7123456789:AAHxyzABCdef1234567890_exampleToken
   ```
6. বটের কমান্ড লিস্ট সেট করতে `@BotFather`-এ পাঠান `/setcommands`, এরপর আপনার বট সিলেক্ট করে নিচের অংশটি পেস্ট করুন:
   ```
   start - স্বাগতম ও সার্বিক সহায়তা
   doctors - বিশেষজ্ঞ ডাক্তার ও ওপিডি সময়সূচি
   serial - অনলাইন সিরিয়াল বুকিং ও ডিজিটাল পেমেন্ট
   hotline - ২৪ ঘণ্টা জরুরি সেবা ও অ্যাম্বুলেন্স
   tests - ডায়াগনস্টিক ল্যাব টেস্ট ও ফি
   beds - কেবিন ও আইসিইউ বেড অনুসন্ধান
   ```

### ২. সার্ভার ও ক্লাউড আর্কিটেকচার (Webhook Pattern):
- **কেন লং-পোলিং এর বদলে ওয়েবহুক?**
  লং-পোলিংয়ে সার্ভারকে প্রতি সেকেন্ডে টেলিগ্রাম সার্ভারে রিকোয়েস্ট পাঠাতে হয় যা সার্ভারকে ভারী করে। অপরদিকে **Webhook** প্যাটার্নে টেলিগ্রাম নিজে ইভেন্ট পুশ করে, ফলে সার্ভার মেমরি ব্যবহার প্রায় শূন্যের কাছাকাছি থাকে এবং ১০০% রিয়েল-টাইম রেসপন্স পাওয়া যায়।
- **ওয়েবহুক এন্ডপয়েন্ট:**
  ```
  POST https://<YOUR_APP_URL>/api/telegram/webhook?token=<TELEGRAM_BOT_TOKEN>
  ```
- **এক-ক্লিকে অ্যাক্টিভেশন:**
  এডমিন প্যানেলে **"টেলিগ্রাম বট টোকেন"** ট্যাবে গিয়ে টোকেন ইনপুট বক্সে পেস্ট করে **"১-ক্লিক ওয়েবহুক সক্রিয় করুন"** বাটনে চাপ দিলেই স্বয়ংক্রিয়ভাবে টেলিগ্রাম এপিআইতে রেজিস্টার হয়ে যাবে।

### ৩. জেমিনি ৩.৮ ফ্ল্যাশ চালিত ট্রায়াজ প্রসেসর:
রোগী যখন কোনো শারীরিক সমস্যা লিখে পাঠাবে, তখন ব্যাকএন্ডের `GoogleGenAI` ইঞ্জিন রোগীর বার্তাটি বিশ্লেষণ করে:
- সহমর্মিতাপূর্ণ প্রাথমিক পরামর্শ প্রদান করে
- যথাযথ মেডিকেল বিভাগ (কার্ডিওলজিস্ট, অর্থোপেডিক, গাইনি, শিশু) সুপারিশ করে
- জটিল লক্ষণ থাকলে অবিলম্বে ইমার্জেন্সিতে যাওয়ার লাল সতর্কতা দেয়
- টেলিগ্রাম চ্যাটের নিচে **"🏥 অনলাইন সিরিয়াল বুকিং"** ইনলাইন বাটন সংযুক্ত করে, যাতে রোগী এক ক্লিকেই অ্যাপে এসে ওপিডি টিকিট কাটতে পারেন।

---

## 🚀 ভবিষ্যৎ রোডম্যাপ ও প্রস্তাবিত ফিচারসমূহ (Future Roadmap)

আন্তর্জাতিক মানের হাসপাতাল ইকোসিস্টেম গড়ে তোলার জন্য ভবিষ্যৎ রিলিজের রূপরেখা:

1. **টেলিমেডিসিন ও ভিডিও কনসালটেশন (WebRTC):** দূরবর্তী রোগীদের জন্য ডাক্তারদের সাথে সরাসরি রিয়েল-টাইম ভিডিও কনসালটেশন ও স্ক্রিনে লাইভ প্রেসক্রিপশন প্রদান।
2. **এসএমএস ও হোয়াটসঅ্যাপ ওটিপি অ্যালার্ট (SMS Gateway):** সিরিয়াল গ্রহণের পর স্বয়ংক্রিয় এসএমএস প্রেরন: *"আপনার সিরিয়াল নং #০৪, আনুমানিক সময় ৫:৪৫ PM"।*
3. **ফার্মেসি ইনভেন্টরি ও বারকোড স্ক্যানিং:** ড্রাগের মেয়াদ উত্তীর্ণ হওয়ার অ্যালার্ট এবং প্রেসক্রিপশনের বারকোড স্ক্যান করে ফার্মেসি থেকে সরাসরি ঔষধ ডেলিভারি।
4. **আইসিইউ ও টেলিমেট্রি আইওটি (IoT):** রোগীর পালস বা অক্সিজেন স্যাচুরেশন বিপজ্জনক স্তরে নামলে ডিউটি নার্স ও চিকিৎসকের মনিটরে জরুরি লাল এলার্ম বাজবে।
5. **অ্যাম্বুলেন্স লাইভ ট্র্যাকিং (Google Maps Integration):** রোগীর নিকটবর্তী অ্যাম্বুলেন্সের জিপিএস ট্র্যাক করা এবং ড্রাইভারের সাথে তাত্ক্ষণিক যোগাযোগ।
6. **HL7 / FHIR স্ট্যান্ডার্ড:** আন্তর্জাতিক ডায়াগনস্টিক রিপোর্ট ও ইএইচআর ইন্টারঅপারেবিলিটি সমর্থন।

---

## 🛠️ প্রযুক্তি স্ট্যাক ও স্থাপত্য

- **ফ্রন্টএন্ড:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **ব্যাকএন্ড:** Express, Node.js, TSX, Vite Middleware
- **কৃত্রিম বুদ্ধিমত্তা:** Google GenAI SDK (`@google/genai`), Gemini 3.8 Flash (`gemini-3.8-flash`)
- **ডিজাইন ফিলোসফি:** { vibe96 } কমপ্লায়েন্ট — নো পিল বাটন স্লপ, হাই কনট্রাস্ট ক্লিনিক্যাল অ্যাকসেন্ট, মেটাডাটা সেপারেটর (`·`) এবং রেসপন্সিভ গ্রিড।
