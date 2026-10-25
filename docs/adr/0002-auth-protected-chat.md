# ADR 0002: Authentication-Protected AI Chat Endpoint

- **Status**: Accepted
- **Deciders**: EduReach Core Architecture Team
- **Date**: 2026-10-25

---

## Context and Problem Statement

The initial project specification proposed leaving the conversational AI endpoint (`POST /api/chat/message`) public without user authentication.

Exposing an LLM-backed endpoint with vector search capabilities publicly on the open internet presents severe security and operational vulnerabilities:

1. **Denial of Wallet & Quota Exhaustion**: Unauthenticated bots, scrapers, or malicious actors can saturate the Google Gemini API key quota, incurring costs or triggering rate limits that deny service to legitimate applicants.
2. **Telemetry & Abuse Blindness**: Without user identity binding, it is difficult to detect or ban malicious actors attempting prompt injections or automated fuzzing.
3. **No Progressive Conversion**: The core business objective of EduReach is prospective student conversion. Free, unrestricted access to deep institutional advice diminishes student incentives to create an account and submit contact details for counselor follow-up.

---

## Decision Drivers

- Prevent abuse, Denial of Service (DoS), and cost overrun of the Google AI Studio / Gemini API.
- Provide a personalized student experience with session persistence.
- Encourage prospective student onboarding through progressive gating.
- Comply with responsible AI deployment practices.

---

## Decision Outcome

**Chosen Decision: Protect the AI Chat endpoint behind JWT Bearer authentication and tier it with an IP-based rate limiter.**

- Public visitors can view the complete institutional showcase (Hero, About, Programs, Milestones, Mentors, Testimonials).
- The floating AI Chatbot widget and outbound AI Voice Counselor are gated behind student authentication (`authGuard` middleware).
- Unauthenticated requests to `POST /api/chat/message` return `401 Unauthorized` with a structured error envelope.
- Authenticated requests are subject to an additional sliding-window rate limit (`30` requests per minute) to deter automated script abuse by authenticated users.

### Consequences

#### Positive

- **Guaranteed Resource Protection**: Gemini Flash and Atlas Vector Search are protected from public crawler abuse and scripted DDoS attacks.
- **Auditable Telemetry**: All inquiries are associated with verified student accounts, allowing college admissions officers to understand applicant interests.
- **Conversion Optimization**: Visitors naturally transition from exploratory browsing to authenticated engagement.

#### Negative / Trade-offs

- **Registration Friction**: Prospective students must complete a quick registration (name, email, password) before chatting with the AI counselor.
- **Mitigation**: The registration form is streamlined to 3 fields with instant local validation and auto-login upon submission.
