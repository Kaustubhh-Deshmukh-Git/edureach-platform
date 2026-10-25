# EduReach — End-to-End (E2E) Testing Checklist

Comprehensive verification checklist for **EduReach Platform: Authentication, Gated Experience, Campus Assistant (Agentic RAG Chat), and Voice Agent (Vapi)** (v0.3.0).

---

## 1. Automated & Programmatic Verification Matrix

All items below have been programmatically verified via automated integration suites and live API execution against the test server.

| Status | Verification Item                                | Test / Verification Method                                                    | Evidence / Result                                                                                                |
| ------ | ------------------------------------------------ | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [x]    | `GET /api/health`                                | HTTP GET via cURL & Supertest                                                 | `HTTP 200 OK` · `{"status": "ok", "uptime": ...}`                                                                |
| [x]    | User Registration (`POST /api/auth/register`)    | Integration test & Live HTTP POST                                             | `HTTP 201 Created` · JWT token issued, password omitted                                                          |
| [x]    | Duplicate Email Error Handling                   | Integration test & Live HTTP POST                                             | `HTTP 409 Conflict` · `"Email already registered."`                                                              |
| [x]    | User Login (`POST /api/auth/login`)              | Integration test & Live HTTP POST                                             | `HTTP 200 OK` · JWT token + sanitized user payload returned                                                      |
| [x]    | Wrong Password Error Handling                    | Integration test & Live HTTP POST                                             | `HTTP 401 Unauthorized` · `"Invalid email or password."`                                                         |
| [x]    | Refresh Session (`GET /api/auth/me`)             | Integration test & Live HTTP GET with Bearer token                            | `HTTP 200 OK` · Session restored from token in localStorage                                                      |
| [x]    | Invalid Token Handling (`GET /api/auth/me`)      | Integration test & Live HTTP GET with bad token                               | `HTTP 401 Unauthorized` · `"Invalid or malformed token."`                                                        |
| [x]    | Session Restore on App Load                      | React Testing Library (`AuthContext.test.tsx`)                                | 6 tests passing; restores user state from `localStorage`                                                         |
| [x]    | Visitor Homepage Teaser Display                  | React Testing Library (`HomePage.test.tsx`)                                   | Teaser banner rendered, `#student-life`, `#events`, `#counselor-cta`, `#hiring-stats` hidden                     |
| [x]    | SignupPopup Once-Per-Session                     | React Testing Library (`HomePage.test.tsx`, `SignupPopup.test.tsx`)           | Opens once via `IntersectionObserver` when Mentors is 50% visible, sets `sessionStorage` key, does not re-open   |
| [x]    | Logged-in Gated Content Access                   | React Testing Library (`HomePage.test.tsx`)                                   | All 4 gated sections rendered; teaser hidden; popup suppressed                                                   |
| [x]    | Responsive Viewport Integrity                    | Playwright / Headless Browser Verification                                    | Inspected at 360px (mobile), 768px (tablet), 1280px (desktop) without overflow                                   |
| [x]    | Client Accessibility & Navigation                | React Testing Library (`Navbar.test.tsx`, `QuotesSection.test.tsx`)           | `aria-expanded` toggle, keyboard trap on modal, timer cleanup on unmount                                         |
| [x]    | Campus Assistant Chat (`POST /api/chat/message`) | Server Integration test (`chat.test.ts`) & Unit tests (`rag.service.test.ts`) | `HTTP 200 OK` · Grounded Gemini responses against campus knowledge base                                          |
| [x]    | Chat Rate Limiting (20 req/min)                  | Server Integration test (`chat.test.ts`)                                      | `HTTP 429 Too Many Requests` after 20 inquiries in a 60-second window                                            |
| [x]    | Floating Chat UI & Drawer                        | React Testing Library (`FloatingChatButton.test.tsx`)                         | FAB rendered, drawer toggles with personalized initial greeting, message exchange, and error handling            |
| [x]    | Voice Agent Call API (`POST /api/vapi/call`)     | Server Integration test (`vapi.test.ts`) & Unit tests                         | `HTTP 200 OK` · E.164 normalization, sanitized inputs, 12s timeout, masked logging (`+91******3210`)             |
| [x]    | Voice Call Rate Limiting (3 calls/hr)            | Server Integration test (`vapi.test.ts`)                                      | `HTTP 429 Too Many Requests` after 3 calls in an hour per user                                                   |
| [x]    | CallPopup 4-State Machine                        | React Testing Library (`CallPopup.test.tsx`)                                  | 4 states (`form`, `calling`, `done`, `error`), invalid phone blocked, consent required, Try Again state recovery |

---

## 2. Manual Eyeball Checklist (For User Verification)

Follow these steps in your browser to eyeball the live interface:

- [ ] **1. Visitor Landing Page:**
  - Open `http://localhost:5173/` in an incognito window.
  - Verify Hero, About, Rankings & Milestones, Courses, Quotes, and Mentors are visible.
  - Verify below Mentors there is a **"Want to See More?"** teaser banner with a **"Sign Up to Unlock"** button.
  - Verify that Student Life, Events Gallery, Counselor CTA, and Detailed Hiring Stats sections are **not** visible.

- [ ] **2. Mentors Auto-Popup Trigger:**
  - While browsing as a visitor, scroll down past Courses into the Mentors section (~50% visible).
  - Verify the **"Unlock Full Campus Insights"** popup modal appears automatically.
  - Press `Esc` or click the backdrop/close button to close it.
  - Scroll up and down past Mentors again; verify the popup **does not reappear** in the same session (`sessionStorage` persistence).

- [ ] **3. User Registration Flow:**
  - Click **"Sign Up"** in the top navigation or on the popup.
  - Attempt submitting an empty form to observe inline field validation errors.
  - Enter valid details: Name (`Jane Student`), Email (`jane@example.edu`), Password (`Password123!`), Phone (`9876543210`).
  - Submit; verify success notification via toast and automatic redirection to home.

- [ ] **4. Logged-in Gated Experience:**
  - Verify top navbar shows user name (`Jane Student`) with a **Logout** button.
  - Scroll down past Mentors; verify the **"Want to See More?"** teaser is gone.
  - Verify all 4 gated sections are rendered:
    1. **Student Life & Infrastructure** (photo grid and facility cards)
    2. **Events & Annual Highlights** (Hackathon, Cultural Fest, Convocation)
    3. **AI Counselor CTA** (Voice helpline banner with Ava)
    4. **Comprehensive Placement Insights** (departmental bar charts and recruiter badges)

- [ ] **5. AI Campus Assistant Chat Drawer:**
  - Locate the floating chat button in the bottom-right corner with a pulse indicator.
  - Click the button to open the slide-over **Campus Assistant** drawer.
  - Verify the personalized greeting: _"Hello Jane Student! I'm your EduReach campus assistant..."_
  - Type an inquiry: _"What are the fees for B.Tech Computer Science?"_ and send.
  - Verify typing indicator displays during processing, followed by grounded response citing annual and hostel fee structure.
  - Test keyboard accessibility: press `Esc` to close drawer; verify focus returns to the floating button.

- [ ] **6. AI Voice Counselor Call Popup:**
  - Scroll to the **Counselor CTA** section and click **"Start Voice Session"**.
  - Verify the modal opens with heading **"Call with Ava"**, pre-filled student name (`Jane Student`), and phone number (`9876543210`).
  - Select a program (e.g. _B.Tech Computer Science & Engineering_) and topic (e.g. _Admissions_).
  - Leave the consent checkbox unchecked and click **"Call Me Now"**; verify validation error _"Consent is required to receive an AI counselor phone call."_
  - Check the consent box and submit:
    - Observe the **"Connecting…"** state with animated spinner and disabled submit.
    - On success, observe the **"Call Dispatched!"** confirmation screen showing destination phone number.
    - Click **"Done"** to close modal and verify all form fields reset when re-opened.

- [ ] **7. Session Persistence on Refresh:**
  - Refresh the browser (`F5` or `Ctrl+R`).
  - Verify you remain logged in without returning to guest state.

- [ ] **8. Logout Flow:**
  - Click **"Logout"** in the navbar.
  - Verify user state clears from `localStorage`.
  - Verify the view immediately reverts to the visitor tier with the gated teaser.

---

## 3. Programmatic API Test Verification Log

### Chat Message (`POST /api/chat/message`)

```bash
curl -i -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"message":"What is the annual fee for B.Tech CSE?"}'
```

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "success": true,
  "data": {
    "response": "The annual tuition fee for B.Tech in Computer Science & Engineering is ₹1,50,000. Total institutional fees for day scholars are ₹1,70,000/year, and hostellers pay ₹2,50,000/year."
  }
}
```

### Voice Call Initiation (`POST /api/vapi/call`)

```bash
curl -i -X POST http://localhost:5000/api/vapi/call \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"phoneNumber":"9876543210","preferredCourse":"B.Tech CSE - Admissions"}'
```

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "success": true,
  "data": {
    "callId": "call_671b58a1b9f4",
    "status": "queued",
    "message": "Call initiated successfully. You will receive a call shortly."
  }
}
```

---

## 4. Test Suite Summary

- **Server Unit & Integration Tests**: **79 tests passed** across 10 test files (`vitest run` in `server/`)
  - `auth.test.ts`: 17 tests
  - `vapi.test.ts`: 14 tests
  - `rag.service.test.ts`: 11 tests
  - `chat.test.ts`: 10 tests
  - `user.model.test.ts`: 5 tests
  - `app.test.ts`: 5 tests
  - `knowledge-base.test.ts`: 5 tests
  - `password.util.test.ts`: 4 tests
  - `jwt.util.test.ts`: 4 tests
  - `env.config.test.ts`: 4 tests
- **Client Unit & Component Tests**: **50 tests passed** across 11 test files (`vitest run` in `client/`)
  - `CallPopup.test.tsx`: 9 tests
  - `QuotesSection.test.tsx`: 6 tests
  - `AuthContext.test.tsx`: 6 tests
  - `FloatingChatButton.test.tsx`: 6 tests
  - `HomePage.test.tsx`: 5 tests
  - `SignupPopup.test.tsx`: 5 tests
  - `LoginPage.test.tsx`: 4 tests
  - `SignupPage.test.tsx`: 3 tests
  - `Navbar.test.tsx`: 3 tests
  - `ErrorBoundary.test.tsx`: 2 tests
  - `App.test.tsx`: 1 test
- **Total Tests Passing**: **129 tests** across the monorepo with 0 regressions.
