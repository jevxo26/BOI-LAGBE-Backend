# 📚 BOI LAGBE Backend - Enterprise Authentication & Security Architecture

Production-ready NestJS Backend for **BOI LAGBE**, built with **TypeORM**, **Neon Cloud PostgreSQL**, and **Passport JWT** using an **Ultra-Strict Zero-Trust SaaS Security Architecture**.

---

## 👨‍💻 Developer Onboarding & Architecture Guide

Welcome! This backend uses an **Enterprise SaaS Architecture**. If you are a frontend developer or another backend engineer joining the team, read this section to understand how the system works.

### 🔑 Authentication Flow & How to Integrate
1. **Tokens**: Authentication relies on a **Dual JWT Token System** (Access Token - 15m expiry, Refresh Token - 7d expiry).
2. **Cookie Management**: Access and Refresh tokens are set automatically in `HttpOnly`, `SameSite=Strict` cookies upon successful login/registration.
3. **Mobile & API Support**: Mobile/API clients can pass `Authorization: Bearer <access_token>` in headers or `x-refresh-token` for token refreshing.
4. **Zero-Trust Security Model**: Every route in the system is **PROTECTED BY DEFAULT**. If you create a new Controller/Route, you do **NOT** need to add an auth guard; the global `StrictJwtAuthGuard` will automatically protect it and throw a standardized **HTTP 401 Unauthorized** error if no valid token or active session is found.
5. **Public Endpoints**: If you create a route that must be accessible without login (e.g. public product list or search), simply decorate it with `@Public()` from `src/auth/guards/strict-jwt-auth.guard`.

---

## 🚀 Key Achievements & Completed Features

### 1. Database Architecture (16 TypeORM Entities)
Integrated Neon PostgreSQL Database connected via TypeORM (`synchronize: true`). Implemented 16 modular entities under `src/auth/entities/`:

- **`User`** (`users`): Main authentication table supporting multi-role array (`roles: string[]`).
- **`UserProfile`** (`user_profiles`): 1:1 user profile metadata.
- **`StudentProfile`** (`student_profiles`): 1:1 student-specific academic information.
- **`UserAddress`** (`user_addresses`): 1:N address book (`HOME`, `HOSTEL`, `CAMPUS`, `OFFICE`, `OTHER`).
- **`UserDevice`** (`user_devices`): 1:N device tracking (`ANDROID`, `IOS`, `WEB`, `WINDOWS`, `MAC`).
- **`UserSession`** (`user_sessions`): 1:N session manager supporting immediate session revocation (`ACTIVE`, `EXPIRED`, `LOGGED_OUT`).
- **`UserOTP`** (`user_otps`): 1:N OTP verification tracker with attempt counting and expiration limits.
- **`UserToken`** (`user_tokens`): 1:N token tracker for verification and resets.
- **`UserLoginHistory`** (`user_login_histories`): 1:N audit logs (IP, Browser, OS).
- **`UserSecurity`** (`user_securities`): 1:1 account security tracker with brute-force lockout (locked at >= 5 failed attempts).
- **`UserPreference`** (`user_preferences`): 1:1 localization & UI theme settings.
- **`UserNotificationSetting`** (`user_notification_settings`): 1:1 notification toggles.
- **`UserIdentityVerification`** (`user_identity_verifications`): 1:1 KYC verification for Agents/Riders (`NID`, `PASSPORT`, `STUDENT_ID`, `DRIVING_LICENSE`).
- **`UserAttachment`** (`user_attachments`): 1:N user document attachments.
- **`UserActivity`** (`user_activities`): 1:N audit activity logs (`REGISTER`, `LOGIN`, `LOGOUT`, etc.).
- **`SupportTicket`** (`support_tickets`): 1:N user support system tickets.

---

### 2. SaaS Ultra-Strict Security Layer

- 🔒 **Zero-Trust Global Guard (`StrictJwtAuthGuard`)**: Protects **ALL** endpoints by default. Unauthenticated calls return a strict **HTTP 401 Unauthorized** JSON. Public endpoints are explicitly marked using `@Public()`.
- 🔑 **Active Session Revocation**: Every request checks the `UserSession` table in Neon DB. Logged out or revoked sessions are blocked instantly even if the JWT signature is valid.
- 🛡️ **Helmet Security Headers**: Protects against XSS, Clickjacking, and MIME sniffing attacks.
- ⏱️ **Rate Limiting**: Integrated `express-rate-limit` restricting IPs to 100 requests per 15 minutes to block DDoS and brute-force attacks.
- 🍪 **Signed HTTP-Only Cookies**: Tokens are issued via `SameSite=Strict`, `HttpOnly` signed cookies (`access_token` and `refresh_token`), with Bearer header fallback for mobile apps.
- 🌐 **Global Exception Handling**: All errors format into a standardized, safe JSON structure via `GlobalHttpExceptionFilter`.

---

## 🛠️ Tech Stack & Environment

- **Framework**: NestJS (v11)
- **ORM**: TypeORM
- **Database**: Neon Cloud PostgreSQL (`postgresql://...`)
- **Security**: `@nestjs/passport`, `passport-jwt`, `bcryptjs`, `cookie-parser`, `helmet`, `express-rate-limit`

---

## 📁 Project Structure & Code Map

```
src/
├── app.module.ts              # AppModule registering TypeORM and Global APP_GUARD
├── main.ts                    # Entrypoint with Helmet, RateLimiter, CookieParser & Pipes
├── common/
│   └── filters/
│       └── global-exception.filter.ts  # Standardized 400/401/500 JSON error filter
└── auth/
    ├── auth.controller.ts     # Auth endpoints with @Public() decorators
    ├── auth.module.ts         # Passport JwtModule & TypeORM Feature registration
    ├── auth.service.ts        # Atomic QueryRunner Transactions for register, login, session, OTP
    ├── dto/
    │   └── auth.dto.ts        # DTOs for Register, Login, SendOtp, VerifyOtp
    ├── entities/              # 16 TypeORM Entities & Enums
    ├── guards/
    │   ├── jwt-auth.guard.ts  # Passport guards
    │   └── strict-jwt-auth.guard.ts # SaaS Zero-Trust Global Guard
    └── strategies/
        ├── jwt.strategy.ts    # Access Token Strategy (Cookie + Bearer)
        └── jwt-refresh.strategy.ts # Refresh Token Strategy
```

---

## 🔌 API Endpoints Reference

Base URL: `http://localhost:3000/api/v1`

| Method | Endpoint | Security Level | Auth Required | Description |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public (`@Public()`) | ❌ No | User & Student Profile registration transaction |
| `POST` | `/api/v1/auth/send-otp` | Public (`@Public()`) | ❌ No | Generates and dispatches 6-digit OTP |
| `POST` | `/api/v1/auth/verify-otp` | Public (`@Public()`) | ❌ No | Verifies OTP code and sets `isVerified = true` |
| `POST` | `/api/v1/auth/login` | Public (`@Public()`) | ❌ No | Validates credentials, sets HTTP-Only cookies |
| `POST` | `/api/v1/auth/refresh-token` | Public + Refresh Guard | ⚠️ Refresh Token | Rotates access and refresh tokens |
| `POST` | `/api/v1/auth/logout` | Protected (Zero-Trust) | ✅ Access Token | Invalidates session and clears cookies |
| `GET` | `/api/v1/auth/me` | Protected (Zero-Trust) | ✅ Access Token | Returns complete user profile & linked sub-objects |

---

## 🧪 Installation & Running Locally

1. **Clone & Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure `.env`**:
   ```env
   DATABASE_URL="postgresql://neondb_owner:npg_6kbvAdx1Irze@ep-green-dew-axahl7km-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require"
   JWT_SECRET="supersecret_jwt_access_key_boi_lagbe_enterprise"
   JWT_REFRESH_SECRET="supersecret_jwt_refresh_key_boi_lagbe_enterprise"
   PORT=3000
   NODE_ENV="development"
   ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
   ```

3. **Build & Run**:
   ```bash
   # Build TypeScript
   npm run build

   # Run Development Server
   npm run start:dev
   ```

---

📄 Detailed technical code review and rationale: [TECHNICAL_REVIEW.md](./TECHNICAL_REVIEW.md)
