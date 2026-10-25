# Changelog

All notable changes to the **EduReach** platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-25

### Added

- **Multi-Stage Containerization**:
  - `server/Dockerfile`: Lightweight multi-stage build using `node:24-alpine`, compiling TypeScript to `dist/`, bundling `knowledge-base/`, and running as non-root user `node` with automated `/api/health` healthchecks.
  - `client/Dockerfile`: Multi-stage build producing optimized static bundles served via `nginx:alpine`.
  - `client/nginx.conf`: Nginx SPA configuration supporting client-side routing fallback to `index.html`, gzip compression, immutable asset caching, and security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`).
  - `docker-compose.yml`: Root multi-container orchestration binding `client` to port `8080` and `server` to port `5000` with container health monitoring.
- **Enterprise Documentation & Quality Guides**:
  - `README.md`: Submission-ready guide including a full Mermaid architecture diagram, visitor vs authenticated experience matrix, step-by-step local setup, Docker deployment instructions, and troubleshooting.
  - `docs/API.md`: Comprehensive REST API reference documenting all 6 endpoints (`/health`, `/auth/register`, `/auth/login`, `/auth/me`, `/chat/message`, `/vapi/call`) with Zod request schemas, response envelopes, status codes, and rate limits.
  - `SECURITY.md`: Threat model analysis (`localStorage` vs `HttpOnly` cookies, rate limits, secret isolation, CORS), vulnerability reporting procedure, and secret rotation checklist.
  - `CONTRIBUTING.md`: Git protocol, conventional commits, pre-commit hooks, verify pipeline, and Node 24 TypeScript guidelines.
  - `docs/adr/0001-agentic-rag.md`: Architecture decision record detailing why an Agentic tool-calling RAG pipeline was chosen over naive fixed retrieval.
  - `docs/adr/0002-auth-protected-chat.md`: Architecture decision record documenting rationale for auth-gating the AI chat endpoint to protect LLM quota.
  - `docs/DEMO.md`: 90-second live presentation walkthrough script and LinkedIn announcement draft.
- **CI/CD Automation**:
  - Automated Docker build verification job added to GitHub Actions workflow (`.github/workflows/ci.yml`).

### Changed

- Configured `forks: { singleFork: true }` in `server/vitest.config.ts` to ensure reliable isolated worker execution across Windows and Linux environments.
- Updated root, server, and client package versions to `1.0.0`.

### Security

- Applied safe upstream dependency update for `body-parser` (2.3.0 → 2.4.0) resolving denial-of-service advisory.
- Enforced strict credential sanitization across documentation to prevent false positives in automated secret scanners.

---

## [0.3.0] - 2026-10-25

### Added

- **Outbound Voice Telephony (Ava)**:
  - `server/src/services/vapi.service.ts`: Integration with the Vapi Cloud Platform for dispatching outbound telephone calls with customizable assistant prompt, system persona, and context injection.
  - `server/src/controllers/vapi.controller.ts`: Controller validating Indian mobile numbers (`^[6-9]\d{9}$`) or valid E.164 numbers, with strict IP/user rate limiting (3 calls per hour).
  - `client/src/components/CallPopup.tsx`: 4-state accessible modal (Form → Calling → Done / Error with Try Again) featuring read-only authenticated student name, `+91` visual prefix, and a mandatory consent confirmation checkbox.
  - `docs/TESTING.md`: Extended E2E testing checklist for telephony dispatch and call rate limit scenarios.

### Security

- Added explicit user consent requirement prior to dispatching outbound telephony calls.
- Enforced phone number sanitization to E.164 international standard format before transmitting to telephony carrier.

---

## [0.2.0] - 2026-10-24

### Added

- **Agentic RAG Subsystem**:
  - `server/knowledge-base/`: Markdown knowledge base covering EduReach courses (B.Tech, M.Tech, MBA), fees, placements, scholarships, and campus facilities.
  - `server/src/services/rag.service.ts`: Dynamic tool-calling LangChain agent powered by Google Gemini 2.5 Flash and Google Generative AI Embeddings (`gemini-embedding-001`, 3072 dimensions).
  - Integrated MongoDB Atlas Vector Search (`edureach_vector_index`) using cosine similarity.
  - Document hash checking: re-indexes knowledge chunks automatically only when the knowledge base file hash changes.
- **Floating AI Chatbot Interface**:
  - `client/src/components/FloatingChatButton.tsx`: Accessible floating chat widget and drawer.
  - Real-time conversational streaming, markdown response rendering, auto-scrolling message history, and error recovery states.

### Changed

- Configured Google Gemini model temperature to `0.2` to eliminate hallucinations and ensure strictly factual institutional responses.

---

## [0.1.0] - 2026-10-22

### Added

- **Repository Scaffold & Tooling**:
  - Monorepo tooling: Husky, lint-staged, Prettier, Commitlint, automated verification script (`scripts/verify.mjs`), and shipping automation (`scripts/ship.sh`).
  - GitHub Actions CI matrix checking code quality, type safety, 129 automated tests, TruffleHog secret scanning, and automated PR review.
- **Backend Foundation (`server/`)**:
  - Node.js 24 native ESM runtime with Express 5 and strict TypeScript.
  - MongoDB Atlas connection with Mongoose User schema.
  - Secure authentication API: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`.
  - Passwords hashed with bcryptjs (salt rounds: 10); signed HMAC-SHA256 JWT tokens.
  - Global error handling, structured logging via Pino, and security middleware (Helmet, CORS, Rate Limiters).
- **Frontend Foundation (`client/`)**:
  - Vite + React 19 + TypeScript frontend styled with Tailwind CSS v4.
  - EduReach burgundy (`#7B1E2B`) and cream (`#FAF7F5`) institutional design system.
  - Responsive public showcase: Navbar, Hero, About (25-acre campus), Milestones, Academic Programs, Mentors, and Testimonials.
  - Auth-gated dynamic homepage with progressive "Want to See More?" teaser and automatic scroll-triggered `SignupPopup`.
  - Accessible dialogs (`role="dialog"`, Esc listener, focus trap) and top-level `ErrorBoundary`.

---

## Deliberate Architectural Deviations from Original Course Guide

| Original Guide Directive                              | EduReach Implementation                                            | Architectural Rationale                                                                   |
| ----------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `npm create vite@latest cd client`                    | `npm create vite@latest client -- --template react-ts`             | The original command was syntactically malformed and failed in modern npm.                |
| Chat API returns `response`, frontend reads `message` | Standardized on `response` across backend and frontend             | Eliminates internal schema inconsistency and aligns with API contract.                    |
| Vector index named `edureachvectorindex`              | Standardized as `edureach_vector_index`                            | Follows snake_case naming conventions and matches the production codebase.                |
| Chat endpoint public without authentication           | Auth-protected (`authGuard`) + rate-limited                        | Prevents quota exhaustion of Google Gemini API key by unauthorized internet scrapers.     |
| Sample JWT secret in `.env`                           | Cryptographically generated ≥32-character secret validated at boot | Baseline hardening against token forgery; prevents boot if secret is weak.                |
| Minimum password length 6                             | Minimum password length 8                                          | Industry-standard security baseline.                                                      |
| LLM Temperature set to 0.7                            | LLM Temperature set to 0.2                                         | Factual institutional college data (fees, cutoffs, placements) must not hallucinate.      |
| Index knowledge base once if documents exist          | Re-index when knowledge file hash changes                          | Content edits to the knowledge base otherwise never synchronize to the database.          |
| Telephony call triggered without consent              | Mandatory explicit consent checkbox                                | Telephony compliance regulations mandate explicit affirmative consent for outbound calls. |
