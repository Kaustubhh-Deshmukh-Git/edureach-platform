# EduReach API — Thunder Client Request Collection

This document contains request specifications and sample payloads for testing EduReach authentication endpoints using Thunder Client or cURL.

**Base URL:** `http://localhost:5000/api`

---

## 1. Register User

Register a new student account. On success, returns an authentication token and user profile (with the password sanitized).

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/register`
- **Headers:**
  - `Content-Type: application/json`

### Request Body

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "Password123!",
  "phone": "9876543210"
}
```

> **Note:** Password must be at least 8 characters (and up to 72 characters). Phone is optional but must be exactly 10 digits if provided.

### Sample Success Response (`201 Created`)

```json
{
  "success": true,
  "data": {
    "token": "<JWT_AUTH_TOKEN>",
    "user": {
      "id": "67162bd93cfad8e6c70f1a23",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "phone": "9876543210",
      "created_at": "2026-10-21T11:50:00.000Z"
    }
  }
}
```

---

## 2. Login User

Authenticate with existing credentials and receive a JWT token.

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/login`
- **Headers:**
  - `Content-Type: application/json`

### Request Body

```json
{
  "email": "jane.doe@example.com",
  "password": "Password123!"
}
```

### Sample Success Response (`200 OK`)

```json
{
  "success": true,
  "data": {
    "token": "<JWT_AUTH_TOKEN>",
    "user": {
      "id": "67162bd93cfad8e6c70f1a23",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "phone": "9876543210",
      "created_at": "2026-10-21T11:50:00.000Z"
    }
  }
}
```

### Sample Failure Response (`401 Unauthorized`)

```json
{
  "success": false,
  "message": "Invalid email or password."
}
```

---

## 3. Get Current User Profile (`GetMe`)

Retrieve the profile of the currently authenticated user using Bearer authentication.

- **Method:** `GET`
- **URL:** `http://localhost:5000/api/auth/me`
- **Headers:**
  - `Authorization: Bearer <TOKEN_FROM_LOGIN_OR_REGISTER>`

### Sample Success Response (`200 OK`)

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "67162bd93cfad8e6c70f1a23",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "phone": "9876543210",
      "created_at": "2026-10-21T11:50:00.000Z"
    }
  }
}
```

### Sample Expired Token Response (`401 Unauthorized`)

```json
{
  "success": false,
  "message": "Token expired. Please log in again."
}
```

---

## 4. Send Message to Campus Assistant (`Chat`)

Submit an inquiry to the grounded Agentic RAG Campus Assistant. The route requires authentication (`Bearer <TOKEN>`) to protect Gemini API quota and is rate-limited to 20 requests per minute per user.

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/chat/message`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <TOKEN_FROM_LOGIN_OR_REGISTER>`

### Request Body

```json
{
  "message": "What is the fee for B.Tech CSE?"
}
```

> **Constraints:** `message` is required, trimmed, and must be between 1 and 1000 characters.

### Sample Success Response (`200 OK`)

```json
{
  "success": true,
  "data": {
    "response": "The annual tuition fee for B.Tech in Computer Science and Engineering (CSE) at EduReach College is ₹1,50,000 per year. For day scholars, total fees are ₹1,70,000/year (including institutional fees), while hostellers pay ₹2,50,000/year (including boarding and lodging)."
  }
}
```

### Sample Unauthorized Response (`401 Unauthorized`)

```json
{
  "success": false,
  "message": "Authorization token required."
}
```

### Sample Validation Error Response (`400 Bad Request`)

```json
{
  "success": false,
  "message": "Message cannot be empty."
}
```

### Sample Rate Limit Response (`429 Too Many Requests`)

```json
{
  "success": false,
  "message": "Too many chat requests. Please try again after a minute."
}
```

### Sample Upstream Assistant Unavailable (`502 Bad Gateway`)

```json
{
  "success": false,
  "message": "The assistant is temporarily unavailable. Please try again."
}
```
