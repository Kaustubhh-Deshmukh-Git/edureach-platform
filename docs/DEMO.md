# EduReach — 90-Second Demo Script & Social Announcement

This document outlines the 90-second live demonstration walkthrough for **EduReach — Agentic College Advisory Platform**, followed by a submission-ready LinkedIn announcement draft.

---

## 1. 90-Second Live Demonstration Script

| Time Stamp      | Screen / Action                                                                                                                                                                                                 | Speaker Audio / Voiceover Narrative                                                                                                                                                                                                                                                                                                                                                                                        | Key Visual Highlights                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **0:00 – 0:15** | **Landing Page Hero & Showcase**<br>Open `http://localhost:5173` in a fresh browser session.                                                                                                                    | _"Welcome to EduReach — an autonomous college advisory platform and AI voice counseling system designed for EduReach College of Engineering & Management, Hyderabad. As a prospective student exploring the site, we immediately see our NAAC A++ accreditation, 92% placement track record, and key programs."_                                                                                                           | Clean Burgundy & Cream typography, responsive navbar, dynamic milestones counter.                   |
| **0:15 – 0:30** | **Progressive Gating & Registration**<br>Scroll past academic programs down to Faculty Mentors. Trigger the `SignupPopup` or click **Get Started**.                                                             | _"Notice how deeper campus details — like detailed lab facilities, hackathons, and fee charts — are protected by our progressive onboarding gate. Let's register a new student account. Registration takes less than five seconds with instant Zod validation and auto-login."_                                                                                                                                            | Modal focus trap, instant client-side validation, smooth transition upon registration.              |
| **0:30 – 0:60** | **Agentic Gemini RAG Chatbot**<br>Click the floating chat icon in the bottom right corner.<br>Type: _"What is the annual hostel fee and placement rate for B.Tech in CSE?"_                                     | _"Now that we are authenticated, our 24/7 AI Counselor is unlocked. Behind the scenes, LangChain and Google Gemini 2.5 Flash dynamically evaluate our question, realize it requires factual institutional data, and invoke our MongoDB Atlas 3072-dimensional vector search index. Within a second, we receive a structured, grounded answer highlighting the ₹1.5L tuition, ₹2.5L hostel total, and 92% placement rate."_ | Markdown formatting, streaming animation, instant factual grounding, rate-limit badge.              |
| **0:60 – 0:90** | **AI Voice Counselor Callback ("Ava")**<br>Click **Talk to Ava** in the header or floating phone action.<br>Enter an Indian mobile number, select _B.Tech CSE - Admissions_, check the consent box, and submit. | _"Prefer a phone conversation? EduReach features Ava, our autonomous voice counselor powered by Vapi. We select our program, check the mandatory consent box, and click Request Call. Within moments, the server sanitizes the number, checks rate limits, and triggers an outbound telephony call to the student's phone with institutional memory."_                                                                     | 4-state machine (form → calling → confirmation), explicit consent compliance, mobile phone ringing. |

---

## 2. LinkedIn Announcement Post Draft

```markdown
🚀 Excited to unveil **EduReach — Agentic College Advisory Platform & AI Voice Counselor**!

College admissions can be overwhelming. Scattered fee sheets, unclear eligibility rules, and slow email response times often leave prospective students anxious during peak counseling periods.

To solve this, I built **EduReach** — a modern, production-grade MERN + TypeScript platform featuring autonomous multi-modal counseling.

Here is what powers EduReach under the hood:

🧠 **Agentic RAG with Google Gemini & LangChain**
Instead of a naive fixed-retrieval pipeline that stuffs documents into every prompt, EduReach uses an agentic tool-calling architecture. Gemini 2.5 Flash autonomously reasons whether to query our 3072-dimensional MongoDB Atlas Vector Search index or handle casual queries directly with zero database overhead.

📞 **Autonomous Outbound AI Voice Agent ("Ava")**
Students can request an instant phone call back from Ava, our AI voice counselor integrated via Vapi. In seconds, Ava dials the student's phone, speaks naturally with low latency, and answers questions about courses, cutoffs, and campus life.

🛡️ **Robust Engineering & Security Architecture**
• Node.js 24 native ESM with erasable TypeScript syntax (zero runtime emit overhead).
• Tiered sliding-window rate limiters across Auth, Chat, and Telephony.
• Strict Zod validation on every environment variable and HTTP request.
• Multi-stage Docker containers running as non-root users behind Nginx.
• Automated CI pipeline with 129 tests, TruffleHog secret scanning, and automated squash-merge releases.

Special thanks to the Google AI and Vapi communities for the incredible developer tooling!

🔗 GitHub Repository: https://github.com/Kaustubhh-Deshmukh-Git/edureach-platform
🏷️ #WebDevelopment #TypeScript #React #NodeJS #AI #LangChain #GoogleGemini #Vapi #Docker #FullStack #MongoDB
```
