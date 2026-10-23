# EduReach — Agentic College Chatbot

> Full-Stack Educational Platform & AI Voice Counselor powered by MERN, TypeScript, Gemini RAG, and Vapi.

[![Node.js Version](https://img.shields.io/badge/node-v24-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![CI Status](https://github.com/Kaustubhh-Deshmukh-Git/edureach-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/Kaustubhh-Deshmukh-Git/edureach-platform/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Part 1 Overview: Auth & Gated Campus Portal (v0.1.0)

EduReach is a college advisory and admissions web platform for **EduReach College of Engineering & Management** (Est. 2005, Hyderabad).

Part 1 delivers production-ready, full-stack JWT authentication, session management, accessible components, and an auth-gated dynamic homepage.

### Key Capabilities in Part 1

- **Public Institutional Showcase**: Responsive landing page with Hero, About (25-acre campus), Milestones (NAAC A++, ₹42 LPA highest CTC, 92% placement rate), Academic Programs (B.Tech, M.Tech, MBA), Testimonial carousel, and Distinguished Mentors.
- **Secure Authentication Layer**: Registration with strict Zod validation, bcrypt password hashing, JWT generation, HTTP Bearer interceptors, automatic 401 logout, and local storage session persistence.
- **Auth-Gated Homepage**: Visitors see a high-converting "Want to See More?" teaser and an automatic once-per-session `SignupPopup` triggered when scrolling to Mentors; authenticated students unlock full campus facilities, annual hackathon galleries, placement distributions, and voice counselor access.
- **Accessibility & UX**: Top-level `ErrorBoundary`, skip-to-content accessibility links, keyboard focus trapping on dialogs (`role="dialog"`, Esc listener), and responsive viewports (360px, 768px, 1280px).

---

## Monorepo Architecture

```text
edureach-platform/
├── client/                     # Vite + React 19 + TypeScript frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, Hero, About, Mentors, Popups...
│   │   ├── context/            # AuthContext (JWT session management)
│   │   ├── data/               # content.ts (canonical typed college data)
│   │   ├── pages/              # HomePage, LoginPage, SignupPage, NotFoundPage
│   │   └── services/           # Axios instance with Bearer interceptors
├── server/                     # Express 5 + TypeScript backend
│   ├── src/
│   │   ├── config/             # Environment validation (Zod) & DB connection
│   │   ├── controllers/        # Auth controllers (register, login, me)
│   │   ├── middleware/         # Auth guard, error handler, rate limiters
│   │   ├── models/             # Mongoose User model
│   │   └── utils/              # JWT, bcrypt, logger (Pino)
├── docs/                       # Architecture & testing documentation
│   ├── TESTING.md              # E2E manual & automated checklist
│   └── api-thunder-client.md   # API testing documentation
└── scripts/                    # Automation & verification scripts
```

---

## Quick Start (Part 1)

### 1. Prerequisites

- **Node.js**: `v24.x` (Mandatory — verify via `node -v`)
- **npm**: bundled with Node (`npm -v`)
- **Git**: `>= 2.40`
- **MongoDB Atlas** or local MongoDB instance

### 2. Installation

Clone the repository and install all dependencies:

```bash
git clone https://github.com/Kaustubhh-Deshmukh-Git/edureach-platform.git
cd edureach-platform
npm install
```

### 3. Environment Configuration

**Backend (`server/.env`):**
Create `server/.env` from `server/.env.example`:

```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/edureach_db?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**Frontend (`client/.env` - optional in dev):**

```ini
VITE_API_URL=http://localhost:5000/api
```

### 4. Running the Development Servers

Run backend and frontend in separate terminals:

```bash
# Terminal 1 — Express Backend (runs on http://localhost:5000)
npm --prefix server run dev

# Terminal 2 — Vite React Frontend (runs on http://localhost:5173)
npm --prefix client run dev
```

Visit **`http://localhost:5173`** to access the application.

---

## Verification & Testing

The monorepo includes automated linting, typechecking, unit tests, integration tests, and production bundle builds:

```bash
# Run full monorepo verification (all 99+ tests across client and server)
npm run verify

# Run individual package test suites
npm --prefix server run test      # 64 server tests (vitest + MongoMemoryServer)
npm --prefix client run test      # 35 client tests (RTL + jsdom)

# Code quality and typing
npm run lint                      # ESLint checks
npm run typecheck                 # TypeScript compilation checks
```

For complete manual verification steps, consult [docs/TESTING.md](docs/TESTING.md).

---

## Roadmap & Milestones

- [x] **Part 1 (v0.1.0)**: Full-stack JWT authentication, protected routes, and gated homepage.
- [ ] **Part 2 (v0.2.0)**: LangChain + Gemini RAG Knowledge Base and Floating Chatbot.
- [ ] **Part 3 (v0.3.0)**: Vapi Voice AI Agent integration and Live Call Modal.
- [ ] **Part 4 (v1.0.0)**: Docker multi-stage containerization and cloud deployment.

---

## License

MIT License. Designed and built for EduReach College of Engineering & Management.
