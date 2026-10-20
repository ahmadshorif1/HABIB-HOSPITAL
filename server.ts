import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // AI Chatbot endpoint using @google/genai (Gemini 3.8 Flash)
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, hospitalName, language = 'bn', history = [] } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      if (!apiKey) {
        // High quality fallback triage responder if key is not configured yet
        const fallbackText = language === 'bn'
          ? `[স্বাগতম ${hospitalName || 'HABIB HOSPITAL'}-এ] আপনার প্রশ্নের জন্য ধন্যবাদ। আমাদের হাসপাতালে সাধারণ মেডিসিন, কার্ডিওলজি, গাইনিকোলজি, অর্থোপেডিকস, পেডিয়াট্রিক ও আইসিইউ বিভাগ রয়েছে। জরুরী প্রয়োজনে আমাদের হটলাইন: +৮৮০১৭১২-৩৪৫৬৭৮ এ যোগাযোগ করুন বা অনলাইন থেকে যেকোনো স্পেশালিস্ট ডাক্তারের সিরিয়াল বুক করুন। লক্ষণ জটিল হলে অনুগ্রহ করে নিকটস্থ ইমার্জেন্সিতে সরাসরি আসুন।`
          : `[Welcome to ${hospitalName || 'HABIB HOSPITAL'}] Thank you for your inquiry. We offer General Medicine, Cardiology, Gynecology, Orthopedics, Pediatrics, and ICU facilities. For urgent support, contact our hotline at +8801712-345678 or book an appointment online with our specialists.`;
        return res.json({ reply: fallbackText });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are the smart bilingual (Bengali & English) Medical Triaging & Healthcare Navigator AI for "${hospitalName || 'HABIB HOSPITAL'}".
Your duties:
1. Help patients understand hospital services, doctor specialties, OPD/IPD timings, diagnostic lab test preparation, and online serial booking steps.
2. Provide empathetic, accurate medical guidance and symptom triaging. Always clarify that you provide medical information and not a binding emergency prescription.
3. Recommend the appropriate medical department (e.g. Cardiology, Orthopedics, Medicine, Pediatrics, Gynecology, ENT).
4. For emergencies (chest pain, severe bleeding, stroke signs, difficulty breathing), immediately advise calling emergency services or visiting the hospital Emergency Room right away.
5. Match the patient's language. If the user asks in Bengali (বাংলা), reply in warm, respectful, clear Bengali. If in English, reply in English. Keep answers clear, structured, and easy to read.`;

      // Format previous chat history
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          if (item.sender === 'user' && item.text) {
            contents.push({ role: 'user', parts: [{ text: item.text }] });
          } else if (item.sender === 'bot' && item.text) {
            contents.push({ role: 'model', parts: [{ text: item.text }] });
          }
        }
      }
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });

      const reply = response.text || (language === 'bn' ? 'আমি আপনার বার্তাটি পেয়েছি। আর কীভাবে সাহায্য করতে পারি?' : 'I received your message. How else can I assist you?');
      return res.json({ reply });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      const hospitalName = req.body?.hospitalName || 'HABIB HOSPITAL';
      const isBn = req.body?.language !== 'en';
      const fallbackReply = isBn
        ? `[${hospitalName} সহকারী] বর্তমানে সার্ভার সংযোগে সামান্য সমস্যা হয়েছে। তবে আপনি সরাসরি আমাদের ডাক্তারদের তালিকা দেখে অনলাইন সিরিয়াল বুক করতে পারেন অথবা হটলাইনে কল করুন: 01712-345678।`
        : `[${hospitalName} Assistant] Temporary network issue. Please book doctor serials directly from the appointment tab or contact our 24/7 hotline at 01712-345678.`;
      return res.json({ reply: fallbackReply });
    }
  });

  // Telegram Bot: Verify bot token & get bot info
  app.post('/api/telegram/test-bot', async (req, res) => {
    try {
      const botToken = req.body.botToken || process.env.TELEGRAM_BOT_TOKEN;
      if (!botToken) {
        return res.status(400).json({ ok: false, error: 'Telegram Bot Token is required' });
      }

      const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
      const data = await response.json();
      return res.json(data);
    } catch (error: any) {
      console.error('Telegram test-bot error:', error);
      return res.status(500).json({ ok: false, error: error.message });
    }
  });

  // Telegram Bot: Get Webhook Info from Telegram
  app.post('/api/telegram/webhook-info', async (req, res) => {
    try {
      const botToken = req.body.botToken || process.env.TELEGRAM_BOT_TOKEN;
      if (!botToken) {
        return res.status(400).json({ ok: false, error: 'Telegram Bot Token is required' });
      }

      const response = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
      const data = await response.json();
      return res.json(data);
    } catch (error: any) {
      console.error('Telegram webhook-info error:', error);
      return res.status(500).json({ ok: false, error: error.message });
    }
  });

  // Telegram Bot: Set Webhook
  app.post('/api/telegram/set-webhook', async (req, res) => {
    try {
      const { botToken, webhookUrl } = req.body;
      const token = botToken || process.env.TELEGRAM_BOT_TOKEN;
      if (!token || !webhookUrl) {
        return res.status(400).json({ ok: false, error: 'botToken and webhookUrl are required' });
      }

      const targetUrl = webhookUrl.startsWith('http') ? webhookUrl : `https://${req.get('host')}${webhookUrl}`;
      const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(targetUrl)}`);
      const data = await response.json();
      return res.json(data);
    } catch (error: any) {
      console.error('Telegram set-webhook error:', error);
      return res.status(500).json({ ok: false, error: error.message });
    }
  });

  // Telegram Bot: Send message or test alert
  app.post('/api/telegram/send-test', async (req, res) => {
    try {
      const { botToken, chatId, message } = req.body;
      const token = botToken || process.env.TELEGRAM_BOT_TOKEN;
      if (!token || !chatId || !message) {
        return res.status(400).json({ ok: false, error: 'botToken, chatId, and message are required' });
      }

      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });
      const data = await response.json();
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  });

  // Telegram Bot: Incoming Webhook Receiver
  app.post('/api/telegram/webhook', async (req, res) => {
    // Acknowledge Telegram immediately with 200 OK
    res.status(200).send('OK');

    try {
      const botToken = req.query.token as string || process.env.TELEGRAM_BOT_TOKEN;
      const update = req.body;
      const message = update?.message;

      if (!message || !message.text) return;

      const chatId = message.chat.id;
      const userText = message.text.trim();
      const userName = message.from?.first_name || 'রোগী';
      const effectiveToken = botToken || process.env.TELEGRAM_BOT_TOKEN;

      if (!effectiveToken) {
        console.warn('Telegram webhook received update but no botToken configured.');
        return;
      }

      let replyText = '';

      if (userText === '/start' || userText === '/help') {
        replyText = `আসসালামু আলাইকুম ${userName}! 🏥\n\nস্বাগতম *HABIB HOSPITAL* স্মার্ট স্বাস্থ্য ও মেডিকেল সহকারীতে।\n\nআমি আপনাকে স্বাস্থ্য পরামর্শ, লক্ষণ ট্রায়াজ, ডাক্তার বিভাগ নির্বাচন এবং সিরিয়াল বুকিংয়ে সহায়তা করতে পারি।\n\n*কমান্ডসমূহ:*\n• /doctors - বিশেষজ্ঞ ডাক্তার ও সময়সূচি\n• /serial - অনলাইন সিরিয়াল বুকিং লিংক\n• /hotline - ২৪/৭ জরুরী হটলাইন\n\nঅথবা আপনার যেকোনো শারীরিক সমস্যা বা প্রশ্ন সরাসরি এখানে লিখে পাঠান!`;
      } else if (userText === '/doctors') {
        replyText = `👨‍⚕️ *HABIB HOSPITAL বিশেষজ্ঞ ডাক্তারদের তালিকা:*\n\n১. *ডা. মাহফুজ আহমেদ* - কার্ডিওলজিস্ট (হৃদরোগ বিশেষজ্ঞ)\n• ফি: ১০০০ টাকা | সময়: বিকাল ৫:০০ - রাত ৯:০০\n\n২. *ডা. সানজিদা ইসলাম* - গাইনি ও প্রসূতি বিশেষজ্ঞ\n• ফি: ৮০০ টাকা | সময়: সকাল ১০:০০ - দুপুর ২:০০\n\n৩. *ডা. মো. তরিকুল ইসলাম* - মেডিসিন বিশেষজ্ঞ\n• ফি: ৭০০ টাকা | সময়: সন্ধ্যা ৬:০০ - রাত ৯:৩০\n\n৪. *ডা. রেজওয়ানুল হক* - অর্থোপেডিক সার্জন\n• ফি: ৯০০ টাকা | সময়: সন্ধ্যা ৫:০০ - রাত ৮:৩০\n\nসিরিয়াল বুক করতে লিখুন /serial অথবা ভিজিট করুন আমাদের ওয়েবসাইট।`;
      } else if (userText === '/hotline' || userText === '/emergency') {
        replyText = `🚨 *HABIB HOSPITAL জরুরী সেবা:*\n\n• ২৪ ঘণ্টা হটলাইন: +৮৮০১৭১২-৩৪৫৬৭৮\n• আইসিইউ ও অ্যাম্বুলেন্স: +৮৮০১৯১১-০০৯৯৮৮\n• ঠিকানা: বাড়ি নং ১২/এ, রোড নং ০৭, ধানমন্ডি, ঢাকা - ১২০৯`;
      } else if (userText === '/serial') {
        replyText = `📅 *অনলাইন সিরিয়াল বুকিং ও পেমেন্ট:*\n\nঘরে বসেই আপনার পছন্দের ডাক্তারের সিরিয়াল টোকেন নিতে এবং বিকাশ/নগদে ফি দিতে ভিজিট করুন:\n${process.env.APP_URL || 'https://habibhospital.org'}`;
      } else if (userText === '/tests' || userText === '/lab') {
        replyText = `🧪 *HABIB HOSPITAL ডায়াগনস্টিক ল্যাব টেস্ট ও ফি:*\n\n১. *সিবিসি (Complete Blood Count)* - ৳৪০০ (ডেলিভারি: ৪ ঘণ্টা)\n২. *লিপিড প্রোফাইল (Lipid Profile)* - ৳৯০০ (খালি পেটে নমুনা)\n৩. *আল্ট্রাসনোগ্রাম (4D USG)* - ৳১৮০০ (পূর্ব প্রস্তুতি আবশ্যক)\n৪. *ইকো-কার্ডিওগ্রাফি (Echocardiography)* - ৳২২০০\n৫. *এইচবিএ১সি (HbA1c ডায়াবেটিস)* - ৳৭০০\n\nরিপোর্ট অনলাইনে পেতে হটলাইনে যোগাযোগ করুন: +৮৮০১৭১২-৩৪৫৬৭৮।`;
      } else if (userText === '/beds' || userText === '/cabin') {
        replyText = `🛏️ *HABIB HOSPITAL কেবিন ও বেড সুবিধা:*\n\n• ভিআইপি এসি কেবিন (অ্যাটাচড বাথ ও নার্স কল সুবিধা)\n• স্ট্যান্ডার্ড নন-এসি কেবিন\n• সার্বক্ষণিক ডাক্তার সমন্বিত সেন্ট্রাল আইসিইউ ও সিসিইউ\n• জেনারেল ওয়ার্ড (মহিলা ও পুরুষ পৃথক)\n\nজরুরী রোগী ভর্তির জন্য অবিলম্বে কল করুন: +৮৮০১৯১১-০০৯৯৮৮।`;
      } else {
        // AI triage using Gemini
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
          try {
            const ai = new GoogleGenAI({ apiKey });
            const aiResp = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: [{ role: 'user', parts: [{ text: userText }] }],
              config: {
                systemInstruction: `You are the Telegram AI medical assistant for "HABIB HOSPITAL". Provide clear, structured, compassionate healthcare triage in Bengali. If emergency, urge calling +8801712-345678 or visiting the emergency ward. Always advise that you provide clinical guidance and official doctor serials should be booked. Keep messages concise and formatted for Telegram.`,
                temperature: 0.6,
              },
            });
            replyText = aiResp.text || 'আপনার বার্তাটি পেয়েছি। বিস্তারিত জানতে আমাদের হটলাইনে কল করুন: 01712-345678।';
          } catch (e: any) {
            console.error('Telegram AI error:', e);
            replyText = `আপনার প্রশ্নের জন্য ধন্যবাদ। আমাদের হাসপাতালে মেডিসিন, হৃদরোগ, গাইনি ও শিশু বিভাগ রয়েছে। সরাসরি অনলাইন সিরিয়াল বুকিং করতে ভিজিট করুন অথবা হটলাইনে কল করুন: ০১৭১২-৩৪৫৬৭৮।`;
          }
        } else {
          replyText = `আপনার প্রশ্নের জন্য ধন্যবাদ। আমাদের হাসপাতালে মেডিসিন, হৃদরোগ, গাইনি ও শিশু বিভাগ রয়েছে। সরাসরি অনলাইন সিরিয়াল বুকিং করতে ভিজিট করুন অথবা হটলাইনে কল করুন: ০১৭১২-৩৪৫৬৭৮।`;
        }
      }

      // Send reply to Telegram chat
      await fetch(`https://api.telegram.org/bot${effectiveToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: replyText,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🏥 অনলাইন সিরিয়াল বুকিং', url: process.env.APP_URL || 'https://habibhospital.org' },
              ],
            ],
          },
        }),
      });
    } catch (err: any) {
      console.error('Telegram Webhook handling error:', err);
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Setup Vite development server or static serving
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HABIB HOSPITAL Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
