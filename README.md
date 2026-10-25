# EduReach — Agentic College Advisory Platform

> An autonomous, full-stack educational advisory platform and AI voice counseling system powered by the **MERN** stack, **TypeScript**, **LangChain Agentic RAG** with **Google Gemini**, and **Vapi Outbound Telephony**.

[![Node.js Version](https://img.shields.io/badge/Node.js-v24.x-brightgreen.svg?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61dafb.svg?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.x-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_Vector_Search-47A248.svg?logo=mongodb)](https://www.mongodb.com/atlas)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2.svg?logo=google)](https://ai.google.dev/)
[![Vapi AI](https://img.shields.io/badge/Vapi-Voice_Agent-FF6B6B.svg)](https://vapi.ai/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?logo=docker)](https://www.docker.com/)
[![CI Status](https://github.com/Kaustubhh-Deshmukh-Git/edureach-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/Kaustubhh-Deshmukh-Git/edureach-platform/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 1. Problem & Solution Statement

### The Problem

Prospective college students and their guardians face significant hurdles navigating university admissions:

- **Scattered Information**: Fee breakdowns, cutoff ranks, hostel amenities, and scholarship eligibility criteria are typically spread across outdated PDFs and disparate web portals.
- **Delayed Administrative Response**: Admissions desks receive thousands of redundant inquiries during peak counseling periods, resulting in days of delay or missed deadlines.
- **Generic Chatbots**: Traditional rule-based or naive RAG bots hallucinate, disregard context, or retrieve irrelevant documents for basic conversational queries.

### The EduReach Solution

**EduReach** bridges the communication divide through an institutional web portal augmented with two intelligent, autonomous interfaces:

1. **Agentic RAG Assistant**: A 24/7 web chatbot powered by Google Gemini and LangChain. Rather than performing blunt document injection on every turn, the agent dynamically decides whether to query the MongoDB Atlas 3072-dimensional vector search index, calculate costs, or clarify student queries.
2. **Autonomous Voice Counselor ("Ava")**: An outbound AI counselor powered by Vapi. Students request a consultation with their preferred program and inquiry topic, and within seconds, receive a live, natural phone call from Ava with low latency and institutional knowledge.
3. **Auth-Gated Campus Experience**: Visitors experience a rich public institutional showcase with progressive gating, leading to authenticated access for fee structures, hackathons, and counseling tools.

---

## 2. System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Layer (React 19 + TypeScript + Vite)"]
        UI["Public Showcase & Campus Portal"]
        AuthCtx["Auth Context (JWT Session)"]
        ChatUI["Agentic Chat Widget (RAG)"]
        VoiceModal["AI Voice Counselor Modal (Consent Gated)"]
    end

    subgraph Server ["Server Layer (Node 24 + Express 5 ESM)"]
        Gateway["Express API Gateway & Security Middleware"]
        AuthCtrl["Auth Controller & Middleware (bcrypt + JWT)"]
        ChatCtrl["Chat Controller (Rate Limited)"]
        VoiceCtrl["Voice Controller (Rate Limited + E.164 Sanitize)"]

        subgraph AI_Engine ["AI & Reasoning Subsystem"]
            LangChainAgent["LangChain Agentic Executor (Gemini 2.5 Flash)"]
            RetrieverTool["retrieveKnowledge Tool"]
            Embeddings["Google Generative AI Embeddings (3072-dim)"]
        end

        subgraph Voice_Service ["Voice Dispatcher"]
            VapiClient["Vapi Outbound Call Service (Axios + Timeout)"]
        end
    end

    subgraph Data ["Data & External Providers"]
        MongoUsers[("MongoDB Atlas (Mongoose: Users Collection)")]
        MongoVector[("MongoDB Atlas (Native Vector Search: 20 Chunks)")]
        GeminiAPI["Google AI Studio (Gemini 2.5 Flash API)"]
        VapiAPI["Vapi Cloud Platform (Telephony Engine)"]
        PhoneUser["Student Mobile Device (+91 Cellular / PSTN)"]
    end

    %% Client to Server
    UI -->|HTTP / SPA| Gateway
    AuthCtx -->|Bearer JWT| Gateway
    ChatUI -->|POST /api/chat/message| Gateway
    VoiceModal -->|POST /api/vapi/call| Gateway

    %% Server Internal Routing
    Gateway --> AuthCtrl
    Gateway --> ChatCtrl
    Gateway --> VoiceCtrl

    %% Server to Data / AI
    AuthCtrl -->|CRUD Users| MongoUsers
    ChatCtrl --> LangChainAgent
    LangChainAgent -->|Invokes Tool when needed| RetrieverTool
    RetrieverTool --> Embeddings
    RetrieverTool -->|knnBeta 3072-dim Vector Search| MongoVector
    LangChainAgent -->|Chat Completion| GeminiAPI

    %% Voice Flow
    VoiceCtrl --> VapiClient
    VapiClient -->|Trigger Outbound Call| VapiAPI
    VapiAPI -->|Dials via Carrier| PhoneUser
```

---

## 3. Experience & Feature Matrix

| Feature / Capability                                              |   Public Visitor   | Authenticated Student |
| ----------------------------------------------------------------- | :----------------: | :-------------------: |
| **Hero & Campus Overview** (25-acre campus, Hyderabad)            |         ✅         |          ✅           |
| **Milestones & Accreditations** (NAAC A++, 42 LPA, 92% placement) |         ✅         |          ✅           |
| **Academic Program Cards** (B.Tech, M.Tech, MBA)                  |         ✅         |          ✅           |
| **Faculty Mentors & Student Testimonials**                        |         ✅         |          ✅           |
| **Progressive Teaser & Scroll-Triggered Signup Popup**            |         ✅         |    — (Suppressed)     |
| **Interactive Fee Structures & Scholarship Breakdown**            | 🔒 (Teaser Locked) |          ✅           |
| **Campus Facilities & Hackathon Gallery**                         | 🔒 (Teaser Locked) |          ✅           |
| **24/7 Agentic AI Chatbot** (Gemini RAG + Vector Retrieval)       |   🔒 (Auth Gate)   |          ✅           |
| **One-Click AI Voice Counselor Phone Call ("Ava")**               |   🔒 (Auth Gate)   | ✅ (Consent Verified) |
| **User Profile Management & Session Persistence**                 |         —          |          ✅           |

---

## 4. Technology Stack Breakdown

### Frontend (`client/`)

- **Core**: React 19, TypeScript 5.8, Vite 6
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`), Vanilla CSS tokens
- **Typography & Theme**: Playfair Display (editorial serif headings), Source Sans 3 (high-legibility body), EduReach Burgundy (`#7B1E2B`) and Warm Cream (`#FAF7F5`)
- **State & Routing**: React Context API, React Router DOM 7
- **Networking & Feedback**: Axios with Bearer token request/response interceptors, React Hot Toast
- **Icons & Accessibility**: Lucide React, WAI-ARIA accessible dialogs with focus trapping and keyboard navigation

### Backend (`server/`)

- **Runtime**: Node.js v24 (Mandatory, native ECMAScript Modules `"type": "module"`)
- **Web Framework**: Express 5.x
- **Type Safety**: TypeScript 5.8 with `verbatimModuleSyntax` and erasable syntax (zero runtime emit overhead)
- **Validation**: Zod (strict schema validation for environment variables and all request bodies)
- **Security**: Helmet HTTP headers, CORS whitelisting, Express Rate Limit (Auth, Chat, Voice), bcryptjs password hashing, JSON Web Tokens (JWT)
- **Logging**: Pino and Pino-HTTP structured JSON logger

### AI, Vector Search & Voice

- **Orchestration**: LangChain.js (`@langchain/core`, `@langchain/google-genai`, `@langchain/mongodb`)
- **Large Language Model**: Google Gemini 2.5 Flash (`gemini-2.5-flash`, temperature 0.2 for strict factual accuracy)
- **Embeddings**: `text-embedding-004` / `gemini-embedding-001` (3072-dimensional embeddings)
- **Vector Search Engine**: MongoDB Atlas Vector Search (`edureach_vector_index`, cosine similarity, 20 chunked knowledge documents)
- **Voice Agent**: Vapi Cloud Platform (`Ava - EduReach Counselor` system prompt, 10-digit Indian mobile number validation, explicit consent logging)

### DevOps, Tooling & Testing

- **Containerization**: Multi-stage Dockerfiles (`node:24-alpine` non-root user, `nginx:alpine` SPA), Docker Compose
- **Quality Gates**: Husky git hooks, lint-staged, Prettier, Commitlint (Conventional Commits)
- **Automated Testing**: Monorepo verification suite (`npm run verify`), Vitest, Supertest, React Testing Library, JSDOM
- **CI/CD**: GitHub Actions (linting, typechecking, 129 automated tests, TruffleHog secret scanning, multi-stage Docker builds, Cubic AI PR reviews)

---

## 5. Monorepo Directory Structure

```text
edureach-platform/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI (audit, secrets, verify, docker)
├── .husky/                      # Git hooks (pre-commit, commit-msg)
├── client/                      # Frontend Application (Vite + React 19)
│   ├── src/
│   │   ├── components/          # Reusable UI (Navbar, Hero, Chat, CallPopup...)
│   │   ├── context/             # AuthContext (session state, login, logout)
│   │   ├── data/                # content.ts (institutional catalog & programs)
│   │   ├── pages/               # HomePage, LoginPage, SignupPage, NotFoundPage
│   │   ├── services/            # Axios API clients (auth, chat, vapi)
│   │   └── types/               # TypeScript interfaces & DTOs
│   ├── nginx.conf               # Production Nginx SPA & security config
│   ├── Dockerfile               # Client production multi-stage Dockerfile
│   └── package.json
├── server/                      # Backend Application (Node 24 + Express 5)
│   ├── knowledge-base/          # Markdown institutional knowledge documents
│   ├── src/
│   │   ├── config/              # Zod env validation & MongoDB connection
│   │   ├── controllers/         # Auth, Chat, and Voice HTTP controllers
│   │   ├── middleware/          # JWT auth guard, rate limiters, error handler
│   │   ├── models/              # Mongoose User model & schemas
│   │   ├── routes/              # Express API route declarations
│   │   ├── services/            # LangChain Agentic RAG & Vapi telephony
│   │   ├── types/               # Express & domain TypeScript definitions
│   │   └── utils/               # Password hashing, JWT utils, Pino logger
│   ├── Dockerfile               # Server production multi-stage Dockerfile
│   └── package.json
├── docs/                        # Project & Engineering Documentation
│   ├── adr/                     # Architecture Decision Records
│   │   ├── 0001-agentic-rag.md
│   │   └── 0002-auth-protected-chat.md
│   ├── API.md                   # Complete REST API specification
│   ├── DEMO.md                  # 90-second demo script & social draft
│   └── TESTING.md               # Monorepo test & verification checklist
├── scripts/
│   ├── ship.sh                  # Git release & PR automation script
│   └── verify.mjs               # Monorepo test & build pipeline runner
├── docker-compose.yml           # Unified local multi-container stack
├── CONTRIBUTING.md              # Engineering guidelines & PR protocol
├── SECURITY.md                  # Security model, threat analysis & disclosure
└── README.md                    # Project documentation (this file)
```

---

## 6. Prerequisites

Ensure the following tools are installed on your workstation:

| Tool                 | Required Version                       | Verification Command                             |
| -------------------- | -------------------------------------- | ------------------------------------------------ |
| **Node.js**          | `v24.x` (Mandatory)                    | `node -v`                                        |
| **npm**              | `10.x` or higher                       | `npm -v`                                         |
| **Git**              | `>= 2.40`                              | `git --version`                                  |
| **Docker Desktop**   | `>= 24.0` (Optional for containers)    | `docker --version`                               |
| **MongoDB Atlas**    | M0 Free or dedicated cluster           | [MongoDB Atlas](https://www.mongodb.com/atlas)   |
| **Google AI Studio** | Gemini API Key                         | [Google AI Studio](https://aistudio.google.com/) |
| **Vapi Account**     | API Key, Assistant ID, Phone Number ID | [Vapi Dashboard](https://vapi.ai/)               |

---

## 7. Step-by-Step Local Setup

### Step 1: Clone Repository & Install Dependencies

```bash
git clone https://github.com/Kaustubhh-Deshmukh-Git/edureach-platform.git
cd edureach-platform
npm install
```

### Step 2: Configure Environment Variables

**Backend (`server/.env`):**
Create `server/.env` by copying `server/.env.example`:

```bash
cp server/.env.example server/.env
```

Populate the values:

```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/edureach_db?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
GOOGLE_API_KEY=<your_google_gemini_api_key>
VAPI_API_KEY=<your_vapi_private_api_key>
VAPI_ASSISTANT_ID=<your_vapi_assistant_uuid>
VAPI_PHONE_NUMBER_ID=<your_vapi_phone_number_uuid>
```

**Frontend (`client/.env`):**
Create `client/.env` by copying `client/.env.example`:

```bash
cp client/.env.example client/.env
```

Populate the value:

```ini
VITE_API_URL=http://localhost:5000/api
```

### Step 3: MongoDB Atlas Vector Search Index Setup

1. In MongoDB Atlas, navigate to **Atlas Search & Vector Search** under your database cluster.
2. Click **Create Search Index** → select **JSON Editor** under **Atlas Vector Search**.
3. Select your database (`edureach_db`) and collection (`knowledge_chunks`).
4. Set the **Index Name** to exactly `edureach_vector_index`.
5. Paste the vector index configuration:

```json
{
  "fields": [
    {
      "numDimensions": 3072,
      "path": "embedding",
      "similarity": "cosine",
      "type": "vector"
    }
  ]
}
```

6. Click **Create Vector Search Index** and wait until the status changes from `BUILDING` to `READY`.

### Step 4: Run the Development Stack

Launch backend and frontend in separate terminals:

```bash
# Terminal 1: Backend Server (runs on http://localhost:5000)
npm --prefix server run dev

# Terminal 2: Frontend Client (runs on http://localhost:5173)
npm --prefix client run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 8. Docker Deployment

EduReach provides an enterprise multi-stage Docker Compose setup running the frontend behind Nginx and the backend on Node 24 Alpine:

```bash
# Build and start both containers
docker compose up --build -d

# View real-time container logs
docker compose logs -f

# Verify service health
curl http://localhost:5000/api/health

# Stop containers
docker compose down
```

| Service      | Container Port | Host Port | Health Check                     |
| ------------ | -------------- | --------- | -------------------------------- |
| **`client`** | 80             | **8080**  | Nginx HTTP 200 on `/`            |
| **`server`** | 5000           | **5000**  | `/api/health` returning `200 OK` |

---

## 9. Environment Variables Reference

| Variable               | Target | Required | Description                                              | Example / Default                                         |
| ---------------------- | ------ | :------: | -------------------------------------------------------- | --------------------------------------------------------- |
| `PORT`                 | Server |   Yes    | HTTP listening port for Express backend                  | `5000`                                                    |
| `NODE_ENV`             | Server |   Yes    | Runtime environment mode                                 | `development` / `production`                              |
| `MONGODB_URI`          | Server |   Yes    | MongoDB Atlas connection string with database            | `mongodb+srv://user:pass@cluster.mongodb.net/edureach_db` |
| `JWT_SECRET`           | Server |   Yes    | Cryptographic HMAC key for signing JWTs (min 32 chars)   | `openssl rand -base64 48`                                 |
| `JWT_EXPIRES_IN`       | Server |   Yes    | Token validity duration string                           | `7d`                                                      |
| `CLIENT_URL`           | Server |   Yes    | Allowed CORS origin for frontend requests                | `http://localhost:5173`                                   |
| `GOOGLE_API_KEY`       | Server |   Yes    | Google AI Studio key for Gemini 2.5 Flash and Embeddings | `<google_gemini_api_key>`                                 |
| `VAPI_API_KEY`         | Server |   Yes    | Vapi private API key for initiating outbound calls       | `<vapi_private_api_key>`                                  |
| `VAPI_ASSISTANT_ID`    | Server |   Yes    | UUID of the configured Ava voice counselor assistant     | `<vapi_assistant_uuid>`                                   |
| `VAPI_PHONE_NUMBER_ID` | Server |   Yes    | UUID of the imported or purchased Vapi phone number      | `<vapi_phone_number_uuid>`                                |
| `VITE_API_URL`         | Client |   Yes    | Base URL for Express REST API                            | `http://localhost:5000/api`                               |

---

## 10. Available npm Scripts

| Scope      | Command                             | Description                                                                  |
| ---------- | ----------------------------------- | ---------------------------------------------------------------------------- |
| **Root**   | `npm run verify`                    | Full verification pipeline (lint + typecheck + test + build across packages) |
| **Root**   | `npm run format`                    | Runs Prettier across all `.ts`, `.tsx`, `.json`, `.css`, `.md` files         |
| **Root**   | `npm run prepare`                   | Sets up Husky Git hooks                                                      |
| **Server** | `npm --prefix server run dev`       | Starts server with Node 24 native watch mode & `.env` injection              |
| **Server** | `npm --prefix server run build`     | Compiles TypeScript source to production `dist/`                             |
| **Server** | `npm --prefix server run start`     | Runs compiled production server (`node dist/server.js`)                      |
| **Server** | `npm --prefix server run test`      | Runs 79 backend tests (Vitest + Supertest)                                   |
| **Server** | `npm --prefix server run typecheck` | Verifies backend types (`tsc --noEmit`)                                      |
| **Client** | `npm --prefix client run dev`       | Launches Vite local development server on port 5173                          |
| **Client** | `npm --prefix client run build`     | Produces optimized production bundle in `client/dist/`                       |
| **Client** | `npm --prefix client run test`      | Runs 50 frontend tests (React Testing Library + Vitest)                      |
| **Client** | `npm --prefix client run typecheck` | Verifies frontend types (`tsc --noEmit`)                                     |

---

## 11. REST API Specification Summary

All API endpoints follow the canonical contract:

- **Success (`2xx`)**: `{ "success": true, "data": { ... } }`
- **Error (`4xx/5xx`)**: `{ "success": false, "message": "Clear error description" }`

| Method | Endpoint             |    Auth    | Rate Limit      | Description                                      |
| ------ | -------------------- | :--------: | --------------- | ------------------------------------------------ |
| `GET`  | `/api/health`        |   Public   | None            | Server uptime, timestamp & database status       |
| `POST` | `/api/auth/register` |   Public   | 20 req / 15 min | Creates user with name, email & hashed password  |
| `POST` | `/api/auth/login`    |   Public   | 20 req / 15 min | Authenticates credentials and issues signed JWT  |
| `GET`  | `/api/auth/me`       | Bearer JWT | None            | Retrieves authenticated user profile             |
| `POST` | `/api/chat/message`  | Bearer JWT | 30 req / 1 min  | Conversational LangChain Agentic RAG with Gemini |
| `POST` | `/api/vapi/call`     | Bearer JWT | 3 req / 1 hour  | Initiates outbound telephony voice call via Vapi |

_For full request/response schemas, validation rules, and error examples, see [docs/API.md](docs/API.md)._

---

## 12. Troubleshooting & FAQ

### 1. MongoDB Atlas `MongoServerSelectionError: connection timed out`

- **Cause**: Your current public IP address is not whitelisted in the MongoDB Atlas Network Access rules.
- **Fix**: Open MongoDB Atlas → **Network Access** → Click **Add IP Address** → Choose **Add Current IP Address** (or `0.0.0.0/0` strictly for testing).

### 2. Vector Search returns empty results or errors

- **Cause**: The vector index is missing, still building, or misconfigured.
- **Fix**: Verify that index name is strictly `edureach_vector_index`, field path is `embedding`, similarity metric is `cosine`, and dimensions are `3072`. Check that the index status is `READY`.

### 3. Vapi Outbound Phone Call not ringing

- **Cause**: Free tier Vapi accounts only support dialing numbers within their provisioned country, or require explicit Twilio/Vonage carrier integration for international numbers (such as India `+91`).
- **Fix**: In the Vapi Dashboard, check **Phone Numbers** and **Call Logs**. If calling an Indian phone number, import an Indian Twilio/Vonage SIP trunk or configure an approved destination country. Verify that `VAPI_PHONE_NUMBER_ID` matches your provisioned number.

### 4. Node.js Version Incompatibility

- **Cause**: Using Node.js versions earlier than v24.
- **Fix**: EduReach leverages Node 24 native ESM module resolution and TypeScript erasable syntax. Run `node -v` to ensure you are running `v24.x`. If using NVM, run `nvm use 24` or `nvm install 24`.

---

## 13. Security & Quality Assurance

- **Vulnerability Management**: Verified zero unhandled critical production dependencies; safe transitive updates applied (`npm audit`).
- **Secret Hygiene**: Zero environment variables or credentials committed to source control. Secret detection automated in CI via TruffleHog.
- **Automated CI**: Every pull request is verified against 129 monorepo tests, linting, typechecks, Docker builds, and AI review.

---

## 14. License

This project is licensed under the **MIT License**. Created for EduReach College of Engineering & Management.
