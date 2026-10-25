# Security Policy & Architecture Guide

EduReach is designed with a defense-in-depth security posture, ensuring that student data, institutional knowledge, and downstream AI/telephony credentials remain protected across development, testing, and production environments.

---

## 1. Threat Model & Architectural Mitigations

### 1.1 JWT in `localStorage` vs `HttpOnly` Cookies

| Architecture Aspect                   | Implementation in EduReach                                     | Rationale & Threat Mitigation                                                                                                                                                                                          |
| ------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Storage Mechanism**                 | Browser `localStorage`                                         | Enables single-page application (SPA) decoupled architecture across subdomains and multi-container Docker deployments without complex cross-domain cookie routing.                                                     |
| **Cross-Site Scripting (XSS)**        | React automatic text escaping + Zero `dangerouslySetInnerHTML` | The primary vector against `localStorage` is XSS. EduReach mitigates this by eliminating raw HTML rendering, using React JSX binding which automatically HTML-escapes output, and enforcing strict input sanitization. |
| **Content Security Policy**           | Enforced by Helmet & Nginx                                     | Nginx and Express configure `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and strict script origin restrictions to prevent malicious code injection.                                                     |
| **Cross-Site Request Forgery (CSRF)** | Immune by architecture                                         | Because Bearer tokens are explicitly passed in the `Authorization` header rather than via ambient browser cookies, EduReach is inherently immune to standard CSRF attacks.                                             |
| **Token Lifetime**                    | 7-day expiration (`JWT_EXPIRES_IN=7d`)                         | Tokens are signed with HMAC-SHA256 using a high-entropy secret (`≥ 32` characters). On logout, the token is destroyed from memory and `localStorage`.                                                                  |

---

### 1.2 Rate Limiting Architecture

To protect upstream APIs (Google Gemini, Vapi Telephony) and backend computational capacity, EduReach implements tiered sliding-window rate limiters via `express-rate-limit`:

| Route Category                         | Window     | Max Requests | Threat Mitigated                                                                           |
| -------------------------------------- | ---------- | ------------ | ------------------------------------------------------------------------------------------ |
| **Authentication** (`/api/auth/*`)     | 15 minutes | 20 requests  | Brute-force credential stuffing and denial of service on bcrypt hashing.                   |
| **AI RAG Chat** (`/api/chat/message`)  | 1 minute   | 30 requests  | Google Gemini quota exhaustion, embedding API flooding, and vector DB latency degradation. |
| **Voice Telephony** (`/api/vapi/call`) | 1 hour     | 3 requests   | Outbound telephony abuse, phone harassment, and runaway carrier telephony billing.         |

---

### 1.3 Secret Handling & Environment Isolation

- **Zero Secrets in Source Control**: Secrets are strictly quarantined in gitignored `.env` files (`server/.env`, `client/.env`). Only sanitized `.env.example` templates with placeholder values are committed.
- **Automated CI Secret Scanning**: Every pull request is inspected via TruffleHog in GitHub Actions to detect accidental credential commits prior to merge.
- **Fail-Fast Boot Validation**: The server validates all required environment variables using strict Zod schemas (`server/src/config/env.ts`) during initialization. If `JWT_SECRET` is shorter than 32 characters or any required API key is missing, the process terminates immediately with an informative diagnostic error.

---

### 1.4 Network & Transport Security

- **CORS Whitelisting**: The Express backend enforces explicit CORS whitelisting (`cors({ origin: env.CLIENT_URL, credentials: true })`), rejecting cross-origin requests from arbitrary web domains.
- **Helmet HTTP Headers**: Standard production security headers are attached to every Express response:
  - `X-DNS-Prefetch-Control: off`
  - `X-Frame-Options: DENY` (clickjacking defense)
  - `Strict-Transport-Security: max-age=15552000; includeSubDomains` (enforces HTTPS)
  - `X-Download-Options: noopen`
  - `X-Content-Type-Options: nosniff` (MIME-sniffing prevention)
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **Non-Root Container Execution**: Multi-stage Docker containers run with non-privileged system users (`node` UID 1000 in server, `nginx` in client) to prevent container breakout exploits.

---

## 2. Vulnerability Reporting Procedure

We take the security of EduReach seriously. If you discover a vulnerability or potential security flaw, please report it responsibly:

### How to Report

1. **Email**: Contact the maintainers at **`security@edureach.edu`** (or open a confidential GitHub Security Advisory).
2. **Include**:
   - Detailed description of the vulnerability.
   - Step-by-step reproduction instructions or proof-of-concept payload.
   - Affected component (`server`, `client`, or `infra`).
   - Potential impact assessment.
3. **Do Not**: Please do not file public GitHub issues for security vulnerabilities until a patch has been released.

### SLA & Disclosure Timeline

- **Initial Response**: Within **48 hours** of report receipt.
- **Triage & Patch**: Verified security flaws will be prioritized and resolved within **14 calendar days**.
- **Coordinated Disclosure**: Public release of the advisory occurs within **30 days** of fix verification.

---

## 3. Secret Rotation Checklist

In the event of suspected credential exposure or routine key rotation, follow this standard operational procedure:

### 3.1 Rotating `JWT_SECRET`

1. Generate a new high-entropy secret (at least 48 characters):
   ```bash
   openssl rand -base64 48
   ```
2. Update `JWT_SECRET` in `server/.env` (and your production deployment secret manager).
3. Restart the backend service (`npm --prefix server run start` or `docker compose restart server`).
4. _Effect_: All currently active student sessions will be invalidated. Students will cleanly re-authenticate on their next request.

### 3.2 Rotating MongoDB Atlas Database Credentials

1. In the MongoDB Atlas Dashboard, go to **Database Access**.
2. Locate user `edureach_admin` → Click **Edit** → **Edit Password** → Generate a new secure password.
3. Update `MONGODB_URI` in `server/.env` with the new password.
4. Restart the backend service. Verify connectivity via `GET /api/health`.

### 3.3 Rotating Google Gemini API Key

1. In [Google AI Studio](https://aistudio.google.com/apikey), create a new API Key for the EduReach project.
2. Update `GOOGLE_API_KEY` in `server/.env`.
3. Restart the backend service and verify that the startup vector search indexing and chat queries succeed.
4. Delete the previous API key from Google AI Studio.

### 3.4 Rotating Vapi Telephony Credentials

1. In the [Vapi Dashboard](https://vapi.ai/), navigate to **Account** → **API Keys** and generate a new private API key.
2. Update `VAPI_API_KEY` in `server/.env`.
3. If replacing the voice assistant or outbound number, update `VAPI_ASSISTANT_ID` and `VAPI_PHONE_NUMBER_ID` accordingly.
4. Restart the backend service and test an outbound call request.
5. Revoke the old Vapi API key in the dashboard.
