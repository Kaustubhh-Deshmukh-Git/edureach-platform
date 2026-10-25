# EduReach REST API Reference

This document provides the canonical technical specification for the EduReach REST API.

All endpoints adhere strictly to the standardized EduReach response envelope:

- **Success (`2xx`)**:
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```
- **Client or Server Error (`4xx` / `5xx`)**:
  ```json
  {
    "success": false,
    "message": "Human-readable failure explanation"
  }
  ```

---

## Base URL & General Headers

| Environment        | Base URL                                      |
| ------------------ | --------------------------------------------- |
| **Development**    | `http://localhost:5000/api`                   |
| **Docker Compose** | `http://localhost:5000/api`                   |
| **Production**     | Configured via `CLIENT_URL` and reverse proxy |

### Standard Request Headers

- `Content-Type: application/json` (Required for all `POST` requests)
- `Authorization: Bearer <jwt_token>` (Required for protected endpoints)

---

## 1. System Health & Diagnostics

### `GET /api/health`

Retrieves live backend uptime, timestamp, active environment, and MongoDB database connectivity status.

- **Authentication**: None (Public)
- **Rate Limit**: None

#### Request

```http
GET /api/health HTTP/1.1
Host: localhost:5000
```

#### Success Response (`200 OK`)

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "uptime": 142.84,
    "timestamp": "2026-10-25T08:30:00.000Z",
    "environment": "development",
    "database": "connected"
  }
}
```

#### Error Response (`503 Service Unavailable`)

Returned when the database connection is disconnected or failing.

```json
{
  "success": false,
  "message": "Database disconnected"
}
```

---

## 2. Authentication Endpoints

### `POST /api/auth/register`

Registers a new prospective student account. Hashes passwords using `bcryptjs` (salt rounds: 10) and creates a persistent user record.

- **Authentication**: None (Public)
- **Rate Limit**: `20` requests per `15` minutes per IP (`authLimiter`)

#### Request Body

| Field      | Type   | Required | Constraints                                                 |
| ---------- | ------ | :------: | ----------------------------------------------------------- |
| `name`     | string |   Yes    | Min 2 characters, max 100 characters. Trimmed.              |
| `email`    | string |   Yes    | Valid email format. Lowercased and trimmed. Must be unique. |
| `password` | string |   Yes    | Min 8 characters, max 100 characters.                       |

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "Password123!"
}
```

#### Success Response (`201 Created`)

```json
{
  "success": true,
  "data": {
    "token": "<jwt_signed_bearer_token>",
    "user": {
      "id": "670c39f0e1f72a912a789123",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "createdAt": "2026-10-25T08:30:00.000Z"
    }
  }
}
```

#### Error Responses

- **`400 Bad Request`** (Validation failure via Zod):
  ```json
  {
    "success": false,
    "message": "Password must be at least 8 characters long"
  }
  ```
- **`409 Conflict`** (Duplicate email registration):
  ```json
  {
    "success": false,
    "message": "An account with this email already exists"
  }
  ```
- **`429 Too Many Requests`**:
  ```json
  {
    "success": false,
    "message": "Too many requests from this IP, please try again after 15 minutes"
  }
  ```

---

### `POST /api/auth/login`

Authenticates existing student credentials, verifies password against bcrypt hash, and issues a signed JSON Web Token (valid for 7 days).

- **Authentication**: None (Public)
- **Rate Limit**: `20` requests per `15` minutes per IP (`authLimiter`)

#### Request Body

| Field      | Type   | Required | Constraints                     |
| ---------- | ------ | :------: | ------------------------------- |
| `email`    | string |   Yes    | Valid email format. Lowercased. |
| `password` | string |   Yes    | Required string.                |

```json
{
  "email": "jane.doe@example.com",
  "password": "Password123!"
}
```

#### Success Response (`200 OK`)

```json
{
  "success": true,
  "data": {
    "token": "<jwt_signed_bearer_token>",
    "user": {
      "id": "670c39f0e1f72a912a789123",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "createdAt": "2026-10-25T08:30:00.000Z"
    }
  }
}
```

#### Error Responses

- **`401 Unauthorized`** (Invalid email or password):
  ```json
  {
    "success": false,
    "message": "Invalid email or password"
  }
  ```
- **`400 Bad Request`** (Malformed input):
  ```json
  {
    "success": false,
    "message": "Please enter a valid email address"
  }
  ```

---

### `GET /api/auth/me`

Fetches the profile of the currently authenticated student from their JWT token.

- **Authentication**: Bearer JWT (`Authorization: Bearer <token>`)
- **Rate Limit**: None

#### Request

```http
GET /api/auth/me HTTP/1.1
Host: localhost:5000
Authorization: Bearer <jwt_signed_bearer_token>
```

#### Success Response (`200 OK`)

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "670c39f0e1f72a912a789123",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "createdAt": "2026-10-25T08:30:00.000Z"
    }
  }
}
```

#### Error Responses

- **`401 Unauthorized`** (Missing or malformed Authorization header):
  ```json
  {
    "success": false,
    "message": "Authentication token missing or invalid"
  }
  ```
- **`401 Unauthorized`** (Expired or tampered token):
  ```json
  {
    "success": false,
    "message": "Token expired or invalid"
  }
  ```
- **`404 Not Found`** (User associated with valid token was deleted):
  ```json
  {
    "success": false,
    "message": "User not found"
  }
  ```

---

## 3. Conversational AI & RAG Chat

### `POST /api/chat/message`

Submits a prospective student's inquiry to the EduReach LangChain Agentic RAG subsystem powered by Google Gemini 2.5 Flash. The agent dynamically decides whether to query the 3072-dimensional vector search index (`edureach_vector_index`) for factual institutional knowledge or handle general conversational flow.

- **Authentication**: Bearer JWT (`Authorization: Bearer <token>`)
- **Rate Limit**: `30` requests per `1` minute per IP (`chatLimiter`)

#### Request Body

| Field     | Type   | Required | Constraints                                                                                |
| --------- | ------ | :------: | ------------------------------------------------------------------------------------------ |
| `message` | string |   Yes    | Min 1 character, max 1000 characters. Trimmed.                                             |
| `history` | array  |    No    | Optional list of prior messages: `Array<{ role: "user" \| "assistant", content: string }>` |

```json
{
  "message": "What is the tuition fee and average package for B.Tech in CSE?",
  "history": [
    {
      "role": "user",
      "content": "Hi, does EduReach offer B.Tech?"
    },
    {
      "role": "assistant",
      "content": "Yes, EduReach College offers 4-year B.Tech programs in CSE, ECE, AI&DS, ME, CE, and IT."
    }
  ]
}
```

#### Success Response (`200 OK`)

```json
{
  "success": true,
  "data": {
    "response": "At EduReach College of Engineering & Management, the annual tuition fee for B.Tech in Computer Science & Engineering (CSE) is ₹1,50,000 per academic year (or ₹2,50,000 including on-campus accommodation and dining).\n\nRegarding career placements:\n- The overall campus placement rate is **92%**.\n- The average package for CSE graduates is **10.2 LPA**.\n- The highest package achieved was **42 LPA** (Google)."
  }
}
```

#### Error Responses

- **`400 Bad Request`** (Empty message or exceeds 1000 characters):
  ```json
  {
    "success": false,
    "message": "Message cannot be empty"
  }
  ```
- **`401 Unauthorized`** (Unauthenticated user):
  ```json
  {
    "success": false,
    "message": "Authentication required to access AI counseling"
  }
  ```
- **`429 Too Many Requests`**:
  ```json
  {
    "success": false,
    "message": "Chat rate limit exceeded. Please wait a minute before sending another message."
  }
  ```
- **`503 Service Unavailable`** (Gemini API or MongoDB vector lookup failure):
  ```json
  {
    "success": false,
    "message": "AI counseling service is temporarily unavailable. Please try again in a few moments."
  }
  ```

---

## 4. Autonomous AI Voice Counselor

### `POST /api/vapi/call`

Initiates an autonomous outbound telephone call from Ava (EduReach's AI voice counselor) to a student's mobile number via the Vapi Telephony Cloud Platform. Includes phone sanitization to E.164 format and rate limiting to prevent telephony spam.

- **Authentication**: Bearer JWT (`Authorization: Bearer <token>`)
- **Rate Limit**: `3` requests per `1` hour per IP / user (`voiceLimiter`)

#### Request Body

| Field             | Type   | Required | Constraints                                                                                  |
| ----------------- | ------ | :------: | -------------------------------------------------------------------------------------------- |
| `phoneNumber`     | string |   Yes    | 10-digit Indian mobile number (`^[6-9]\d{9}$`) or valid E.164 string (`^\+?[1-9]\d{1,14}$`). |
| `preferredCourse` | string |    No    | Optional context string specifying course or inquiry topic (max 100 chars).                  |

```json
{
  "phoneNumber": "9876543210",
  "preferredCourse": "B.Tech CSE - Admissions"
}
```

#### Success Response (`200 OK`)

```json
{
  "success": true,
  "data": {
    "callId": "b182cb82-3df9-4ba1-b54c-7c01b1a329d4",
    "status": "queued",
    "message": "Call initiated successfully! You will receive a call from Ava shortly."
  }
}
```

#### Error Responses

- **`400 Bad Request`** (Invalid phone number format):
  ```json
  {
    "success": false,
    "message": "Invalid phone number format. Please provide a valid 10-digit mobile number."
  }
  ```
- **`401 Unauthorized`**:
  ```json
  {
    "success": false,
    "message": "Authentication required to request a counseling call"
  }
  ```
- **`429 Too Many Requests`**:
  ```json
  {
    "success": false,
    "message": "Call limit reached. You can request at most 3 calls per hour."
  }
  ```
- **`502 Bad Gateway`** (Vapi upstream provider failure or unverified destination country):
  ```json
  {
    "success": false,
    "message": "Failed to connect with voice service provider. Please verify your phone number and try again."
  }
  ```

---

## 5. Status Code Conventions

| Status Code                 | Meaning                     | Context                                                   |
| --------------------------- | --------------------------- | --------------------------------------------------------- |
| `200 OK`                    | Request succeeded           | Standard queries, login, health check, AI chat completion |
| `201 Created`               | Resource created            | Student account registration                              |
| `400 Bad Request`           | Validation failure          | Zod schema validation errors, missing parameters          |
| `401 Unauthorized`          | Authentication error        | Missing, invalid, or expired JWT                          |
| `404 Not Found`             | Resource missing            | Endpoint or user record not found                         |
| `409 Conflict`              | Unique constraint violation | Email already registered                                  |
| `429 Too Many Requests`     | Rate limit hit              | Exceeded allowed requests in sliding window               |
| `500 Internal Server Error` | Unexpected backend error    | Uncaught exceptions (sanitized before returning)          |
| `502 Bad Gateway`           | Upstream failure            | Vapi API connection or outbound telephony error           |
| `503 Service Unavailable`   | Service degraded            | MongoDB Atlas or Gemini RAG connection error              |
