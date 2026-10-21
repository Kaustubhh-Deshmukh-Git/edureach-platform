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
