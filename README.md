# 📚 BOI LAGBE Backend

Production-ready **NestJS** backend for **BOI LAGBE** — an enterprise SaaS platform for books, digital content, custom orders, used-book buyback, agents, riders, and delivery. Built with **TypeORM**, **Neon Cloud PostgreSQL**, **Passport JWT**, and a **Zero-Trust security architecture** with a full admin panel.

---

## 1. Project Overview

BOI LAGBE Backend provides:

- **User & authentication services** — register, OTP, login, refresh tokens, session management.
- **A complete admin panel** — 17 feature modules covering users, agents, riders, areas, warehouses & inventory, product catalog, books, used-book buyback, digital content, custom orders & gifts, orders & delivery, finance, reports/BI, CRM, and RBAC.
- **Production hardening** — strict JWT guards, role-based authorization, rate limiting, security headers, centralized error handling, and DB schema managed through TypeORM migrations.

> **Status:** API testing completed — see [API Testing Report](./api-testing-report.md) for the full test matrix and results. Build/typecheck/test suites all pass (see [Testing Status](#11-testing-status)).

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS (v11) |
| Language | TypeScript |
| ORM | TypeORM |
| Database | Neon Cloud PostgreSQL (`pg`) |
| Auth | `@nestjs/passport`, `passport-jwt`, `@nestjs/jwt`, `bcryptjs` |
| Security | `helmet`, `express-rate-limit`, `cookie-parser` |
| Validation | `class-validator`, `class-transformer` (global `ValidationPipe`) |
| API Docs | `@nestjs/swagger` (Swagger UI + OpenAPI) |
| Tests | Jest (unit + e2e via `supertest`) |

---

## 3. Backend Architecture

```
src/
├── main.ts                     # Bootstrap: Helmet, rate limit, cookies, pipes, CORS, Swagger
├── app.module.ts               # Root module: Config, TypeORM, global StrictJwtAuthGuard
├── app.controller.ts           # Public root health endpoint
├── common/
│   └── filters/
│       └── global-exception.filter.ts   # Standardized error envelope
├── auth/                       # Authentication & user domain
│   ├── auth.controller.ts      # Public auth endpoints
│   ├── auth.service.ts         # Transactional register/login/OTP/session logic
│   ├── dto/                    # Register, Login, SendOtp, VerifyOtp
│   ├── entities/               # 16 auth/user entities
│   ├── guards/                 # strict-jwt-auth.guard (global), jwt-auth.guard (refresh)
│   ├── interceptors/           # token-required.interceptor
│   └── strategies/             # jwt.strategy, jwt-refresh.strategy
├── admin/                      # Admin panel (17 feature modules, see §6)
├── database/
│   ├── data-source.ts          # TypeORM CLI DataSource (migrations)
│   └── migrations/             # Versioned schema migrations
```

**Key architectural decisions:**

- **Global Zero-Trust guard** — `StrictJwtAuthGuard` is registered as a global `APP_GUARD`, so **every route is protected by default**. New controllers require no per-route guard; public routes are explicitly opted-in with `@Public()`.
- **DB schema via migrations** — `synchronize: false`. Schema changes are managed with versioned TypeORM migrations (see [§7 Environment Setup](#7-environment-setup) and [§10 Production Notes](#10-production-notes)).
- **Transactional services** — multi-entity workflows (e.g., register) use `QueryRunner` transactions for atomicity.
- **Layered admin modules** — each admin feature has controller → service → DTOs → entities, with shared `QueryBuilder` pagination/search/filter utilities and an admin audit service.

---

## 4. Authentication Flow

The system uses a **Dual JWT Token System**:

| Token | Lifetime | Location |
|---|---|---|
| Access token | 15 minutes | `HttpOnly`, `SameSite=Strict` cookie `access_token`, or `Authorization: Bearer <token>` |
| Refresh token | 7 days | `HttpOnly` cookie `refresh_token`, or `x-refresh-token` header |

**Flow:**

1. **Register** (`POST /auth/register`) — creates the user plus linked profile/security/preference/notification records in one transaction. Registered accounts are always created as `STUDENT`; privileged roles are granted only by admins (see RBAC below).
2. **Verify** — `send-otp` / `verify-otp` mark the phone/account verified (OTP debug code is returned only in development).
3. **Login** (`POST /auth/login`) — validates credentials (with brute-force lockout after 5 failed attempts), creates an active session, and sets both HTTP-only cookies.
4. **Session revocation** — every protected request re-checks the session row; logged-out/expired sessions are rejected even with a valid JWT signature.
5. **Refresh** (`POST /auth/refresh-token`) — rotates both tokens; tampered or reused refresh tokens are rejected.
6. **Logout** — marks the session `LOGGED_OUT` and clears cookies.

**Zero-Trust rules for developers:**

- New routes are **protected by default** (401 if no valid token/session).
- To expose a route publicly, decorate it with `@Public()` from `src/auth/guards/strict-jwt-auth.guard`.
- Admin routes use `@AdminOnly()` (requires `ADMIN` or `SUPER_ADMIN` role). **Never combine `@AdminOnly()` with `@Public()`.**
- Role names are normalized to `UPPER_SNAKE_CASE` at creation so grants always match the guard.

---

## 5. Admin Panel Summary

The admin panel is a set of **17 controllers** under `/api/v1/admin/*`, each protected by the global `StrictJwtAuthGuard` **and** the `AdminRoleGuard` (`@AdminOnly()` → `ADMIN` / `SUPER_ADMIN` only).

**Capabilities by area:**

- **RBAC & governance** — roles, permissions, role-permission and user-role assignments, approval workflows, audit & activity logs. Role grants update the user's `roles` claim so they take effect on the next login.
- **Users, Agents, Riders** — full management including operational sub-entities (documents, leave, attendance, bonuses, penalties, settlements, wallets, performance, analytics).
- **Areas & academic structure** — country/division/district/upazila/area hierarchy, institutes, campuses, departments, programs, semesters, academic sessions.
- **Warehouses & inventory** — warehouses, zones, shelves, suppliers, stock movements, transfers, restocks, audits (central warehouse + agent store inventory).
- **Products & books** — catalogs, categories, variants, reviews, bundles, price history, publish & inventory-sync actions.
- **Used books** — sell-request review, evaluation, offers, approval, pickup, inspection, repricing, publish-to-resale, analytics.
- **Digital content** — content CRUD, categories, exams, certificates, access grants, analytics/reports.
- **Custom orders & gifts** — quotations, approvals, production stages, delivery scheduling, print services/jobs.
- **Orders & delivery** — status transitions, agent/rider assignment, returns, refunds, cancellations, exchanges, tracking.
- **Finance** — dashboard, transactions, invoices, journal entries, ledgers, accounts, profit/loss, balance sheet, salaries, commissions, settlements.
- **Reports & BI** — dashboards, KPIs, sales/revenue analytics, custom report generation and export.
- **CRM** — support tickets, live chat, notifications, loyalty.

> See [BOI-LAGBE-ADMIN-PANEL-PLAN.md](./BOI-LAGBE-ADMIN-PANEL-PLAN.md) for the full phase-by-phase admin implementation plan and entity reference.

---

## 6. Module Structure

### Auth & core
| Module | Path | Purpose |
|---|---|---|
| Auth | `src/auth/` | Register, login, OTP, refresh, logout, profile |
| Common | `src/common/` | Global exception filter |

### Admin modules (`src/admin/`)
| Module | Route prefix | Purpose |
|---|---|---|
| Users | `/admin/users` | User management (list, detail, status) |
| Agents | `/admin/agents` | Agent operations & financials |
| Riders | `/admin/riders` | Rider operations & financials |
| Areas | `/admin/areas` | Geo hierarchy + academic structure |
| Warehouses | `/admin/warehouses` | Warehouse & supplier management |
| Inventory | `/admin/inventory` | Stock, transfers, restocks, audits |
| Products | `/admin/products` | Product catalog & reviews |
| Books | `/admin/books` | Academic book catalog |
| Used Books | `/admin/used-books` | Buyback/resale lifecycle |
| Digital Content | `/admin/digital-content` | Digital resources & exams |
| Custom Orders | `/admin/custom-orders` | Custom products, gifts, print |
| Orders | `/admin/orders` | Order lifecycle & fulfillment |
| Delivery | `/admin/delivery` | Delivery & tracking |
| Finance | `/admin/finance` | Accounting & reporting |
| Reports | `/admin/reports` | Dashboards, KPIs, reports |
| CRM | `/admin/crm` | Tickets, chat, notifications, loyalty |
| RBAC | `/admin/rbac` | Roles, permissions, audit logs |

Each admin module contains `controller → service → dto/ → entities/`, and every `:id` route param is validated with `ParseUUIDPipe`.

---

## 7. Environment Setup

Copy `example.env` to `.env` and fill in real values. `.env` is git-ignored; **never commit real secrets**.

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (e.g., Neon) |
| `JWT_SECRET` | Secret for access tokens (≥32 chars, random) |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens (different from `JWT_SECRET`) |
| `PORT` | HTTP port (default `3000`) |
| `NODE_ENV` | `development` / `production` / `test` — controls cookie `secure` flag and OTP debug output |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |

> `example.env` contains placeholders only — safe to commit.

**Database schema (migrations):**
The app runs with `synchronize: false`; schema is managed via TypeORM migrations. The initial baseline migration is included in `src/database/migrations/`.

---

## 8. Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp example.env .env          # Unix / Git Bash
# or: Copy-Item example.env .env   (Windows PowerShell)
# then fill in DATABASE_URL, JWT secrets, etc.

# 3. Apply database migrations
npm run migration:run

# 4. Run
npm run start:dev          # development (watch mode)
npm run build && npm run start:prod   # production build
```

**Useful scripts:**

| Command | Purpose |
|---|---|
| `npm run build` | Compile TypeScript (`nest build`) |
| `npm run start:dev` | Development server with watch mode |
| `npm run start:prod` | Run the compiled build (`node dist/main`) |
| `npm run migration:run` | Apply pending migrations |
| `npm run migration:revert` | Revert the last migration |
| `npm run migration:show` | List applied/pending migrations |
| `npm run lint` | ESLint (autofix) |
| `npm run format` | Prettier formatting |
| `npm test` | Unit tests (Jest) |
| `npm run test:e2e` | End-to-end tests |

---

## 9. API Documentation

- **Swagger UI:** `http://localhost:<PORT>/api/v1/docs`
- **OpenAPI JSON:** `http://localhost:<PORT>/api/v1/docs-json`
- **Base URL for all APIs:** `http://localhost:<PORT>/api/v1`

Swagger is served with the global prefix (`useGlobalPrefix: true`) and Bearer auth support. Click **Authorize** in the UI and paste an access token to exercise protected/admin endpoints.

**Auth endpoints:**

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register a user (always created as STUDENT) |
| `POST` | `/api/v1/auth/send-otp` | Public | Send OTP |
| `POST` | `/api/v1/auth/verify-otp` | Public | Verify OTP |
| `POST` | `/api/v1/auth/login` | Public | Login, sets HTTP-only cookies |
| `POST` | `/api/v1/auth/refresh-token` | Refresh token | Rotate tokens |
| `POST` | `/api/v1/auth/logout` | Access token | Invalidate session |
| `GET` | `/api/v1/auth/me` | Access token | Current profile + linked records |
| `GET` | `/api/v1` | Public | Root health check |

All `/api/v1/admin/*` endpoints require an access token with the `ADMIN` or `SUPER_ADMIN` role. See the Swagger UI for the complete route list and request/response schemas (auto-generated from DTOs).

---

## 10. Production Notes

- **Migrations before deploy** — run `npm run migration:run` against the target database before starting the app. `migrationsRun` is `false` in the app config; apply migrations explicitly.
- **Environment** — set `NODE_ENV=production` (enables `secure` cookies and disables OTP debug codes), strong random `JWT_SECRET` / `JWT_REFRESH_SECRET`, and the real `ALLOWED_ORIGINS`.
- **Rate limiting** — 100 requests per 15 minutes per IP (global). Adjust in `src/main.ts` if a higher public-API budget is needed.
- **TLS** — the dev DB config uses `ssl.rejectUnauthorized: false` for Neon; consider `verify-full` for stricter production TLS.
- **Security posture** — Helmet headers, HTTP-only cookies, global validation (`whitelist` + `forbidNonWhitelisted`), UUID param validation, bcrypt password hashing, session revocation, and admin role guards are all active by default.
- **Admin bootstrap** — the first admin account is provisioned during initial setup rather than through public registration; public registration always creates `STUDENT` accounts (privileged roles are granted via the admin RBAC module).

---

## 11. Testing Status

| Suite | Command | Result |
|---|---|---|
| Unit tests | `npm test` | ✅ Passing (28/28) |
| E2E tests | `npm run test:e2e` | ✅ Passing (9/9) |
| TypeScript | `npx tsc --noEmit` | ✅ Clean |
| Build | `npm run build` | ✅ Clean |
| Migration check | `npm run migration:show` | ✅ Metadata valid |

**E2E coverage includes the auth/authorization matrix:** public root 200, register-with-client-roles rejected (400), unauthenticated access 401, non-admin 403, admin/super-admin 200, tampered tokens 401.

> Full API test matrix and results: **[api-testing-report.md](./api-testing-report.md)**. It includes the critical findings fixed during testing (e.g., preventing privilege escalation via client-supplied roles, RBAC role-grant synchronization, and the bootstrap/deployment workflow).

---

## 12. Deployment Guidance

1. **Build** — `npm run build` (compiles to `dist/`).
2. **Migrate** — `npm run migration:run` against the target database.
3. **Configure env** — production values for `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `NODE_ENV=production`, `ALLOWED_ORIGINS`, `PORT`.
4. **Run** — `npm run start:prod` (`node dist/main`), behind a reverse proxy (HTTPS termination) with cookies set to `secure` in production.
5. **Verify** — hit `GET /api/v1` (health), open `/api/v1/docs`, and confirm an admin can authenticate and access `/api/v1/admin/*`.

---

📄 **Additional documents:**
- [Admin Panel Implementation Plan & Entity Reference](./BOI-LAGBE-ADMIN-PANEL-PLAN.md)
- [API Testing Report](./api-testing-report.md)
- [Technical Review](./TECHNICAL_REVIEW.md)
