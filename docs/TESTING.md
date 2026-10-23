# EduReach Part 1 — End-to-End (E2E) Testing Checklist

Comprehensive verification checklist for **Part 1: Full-Stack Authentication & Gated Homepage** (v0.1.0).

---

## 1. Automated & Programmatic Verification Matrix

All items below have been programmatically verified via automated integration suites and live API execution against the test server.

| Status | Verification Item                             | Test / Verification Method                                          | Evidence / Result                                                                                              |
| ------ | --------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [x]    | `GET /api/health`                             | HTTP GET via cURL & Supertest                                       | `HTTP 200 OK` · `{"status": "ok", "uptime": ...}`                                                              |
| [x]    | User Registration (`POST /api/auth/register`) | Integration test & Live HTTP POST                                   | `HTTP 201 Created` · JWT token issued, password omitted                                                        |
| [x]    | Duplicate Email Error Handling                | Integration test & Live HTTP POST                                   | `HTTP 409 Conflict` · `"Email already registered."`                                                            |
| [x]    | User Login (`POST /api/auth/login`)           | Integration test & Live HTTP POST                                   | `HTTP 200 OK` · JWT token + sanitized user payload returned                                                    |
| [x]    | Wrong Password Error Handling                 | Integration test & Live HTTP POST                                   | `HTTP 401 Unauthorized` · `"Invalid email or password."`                                                       |
| [x]    | Refresh Session (`GET /api/auth/me`)          | Integration test & Live HTTP GET with Bearer token                  | `HTTP 200 OK` · Session restored from token in localStorage                                                    |
| [x]    | Invalid Token Handling (`GET /api/auth/me`)   | Integration test & Live HTTP GET with bad token                     | `HTTP 401 Unauthorized` · `"Invalid or malformed token."`                                                      |
| [x]    | Session Restore on App Load                   | React Testing Library (`AuthContext.test.tsx`)                      | 6 tests passing; restores user state from `localStorage`                                                       |
| [x]    | Visitor Homepage Teaser Display               | React Testing Library (`HomePage.test.tsx`)                         | Teaser banner rendered, `#student-life`, `#events`, `#counselor-cta`, `#hiring-stats` hidden                   |
| [x]    | SignupPopup Once-Per-Session                  | React Testing Library (`HomePage.test.tsx`, `SignupPopup.test.tsx`) | Opens once via `IntersectionObserver` when Mentors is 50% visible, sets `sessionStorage` key, does not re-open |
| [x]    | Logged-in Gated Content Access                | React Testing Library (`HomePage.test.tsx`)                         | All 4 gated sections rendered; teaser hidden; popup suppressed                                                 |
| [x]    | Responsive Viewport Integrity                 | Playwright / Headless Browser Verification                          | Inspected at 360px (mobile), 768px (tablet), 1280px (desktop) without overflow                                 |
| [x]    | Client Accessibility & Navigation             | React Testing Library (`Navbar.test.tsx`, `QuotesSection.test.tsx`) | `aria-expanded` toggle, keyboard trap on modal, timer cleanup on unmount                                       |

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
  - Click **"Start Voice Session"**; verify the `CallPopup` dialog appears with Counselor Ava details.

- [ ] **5. Session Persistence on Refresh:**
  - Refresh the browser (`F5` or `Ctrl+R`).
  - Verify you remain logged in without returning to guest state.

- [ ] **6. Logout Flow:**
  - Click **"Logout"** in the navbar.
  - Verify user state clears from `localStorage`.
  - Verify the view immediately reverts to the visitor tier with the gated teaser.

- [ ] **7. Mobile & Responsive Layouts:**
  - Open browser DevTools (`F12`), toggle Device Toolbar:
    - **Mobile (360px)**: Hamburger menu toggles navigation links and auth buttons cleanly. Cards stack in a single column.
    - **Tablet (768px)**: 2-column grids with appropriate touch targets.
    - **Desktop (1280px)**: Full multi-column grid layouts with hover micro-animations.

---

## 3. Programmatic API Test Verification Log

Direct cURL executions against live HTTP server endpoints:

### Health Check

```bash
curl -i http://localhost:5000/api/health
```

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "success": true,
  "data": {
    "status": "ok",
    "uptime": 1.48
  }
}
```

### Registration (Success)

```bash
curl -i -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex Rivers","email":"alex@edureach.edu","password":"Password123!","phone":"9876543210"}'
```

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "success": true,
  "data": {
    "token": "<JWT_AUTH_TOKEN_STRING>",
    "user": {
      "id": "6adb2d658aad85a26d26319b",
      "name": "Alex Rivers",
      "email": "alex@edureach.edu",
      "phone": "9876543210"
    }
  }
}
```

### Registration (Duplicate Email)

```bash
curl -i -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex Duplicate","email":"alex@edureach.edu","password":"Password123!"}'
```

```http
HTTP/1.1 409 Conflict
Content-Type: application/json; charset=utf-8

{
  "success": false,
  "message": "Email already registered."
}
```

### Login (Success)

```bash
curl -i -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@edureach.edu","password":"Password123!"}'
```

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "success": true,
  "data": {
    "token": "<JWT_AUTH_TOKEN_STRING>",
    "user": {
      "id": "6adb2d658aad85a26d26319b",
      "name": "Alex Rivers",
      "email": "alex@edureach.edu",
      "phone": "9876543210"
    }
  }
}
```

### Login (Wrong Password)

```bash
curl -i -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@edureach.edu","password":"WrongPassword!"}'
```

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{
  "success": false,
  "message": "Invalid email or password."
}
```

### Active Session Verification (`/api/auth/me`)

```bash
curl -i http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "success": true,
  "data": {
    "user": {
      "id": "6adb2d658aad85a26d26319b",
      "name": "Alex Rivers",
      "email": "alex@edureach.edu",
      "phone": "9876543210"
    }
  }
}
```

### Invalid Token Verification

```bash
curl -i http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <INVALID_TOKEN>"
```

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{
  "success": false,
  "message": "Invalid or malformed token."
}
```

---

## 4. Test Suite Summary

- **Server Unit & Integration Tests**: 37 tests passed (`vitest run` in `server/`)
  - `auth.test.ts`: 17 tests
  - `user.model.test.ts`: 5 tests
  - `password.util.test.ts`: 4 tests
  - `jwt.util.test.ts`: 4 tests
  - `app.test.ts`: 5 tests
  - `env.config.test.ts`: 2 tests
- **Client Unit & Component Tests**: 35 tests passed (`vitest run` in `client/`)
  - `HomePage.test.tsx`: 5 tests
  - `SignupPopup.test.tsx`: 5 tests
  - `QuotesSection.test.tsx`: 6 tests
  - `Navbar.test.tsx`: 3 tests
  - `LoginPage.test.tsx`: 4 tests
  - `SignupPage.test.tsx`: 3 tests
  - `AuthContext.test.tsx`: 6 tests
  - `ErrorBoundary.test.tsx`: 2 tests
  - `App.test.tsx`: 1 test
- **Total Tests Passing**: **72 tests** across the monorepo with 0 regressions.
