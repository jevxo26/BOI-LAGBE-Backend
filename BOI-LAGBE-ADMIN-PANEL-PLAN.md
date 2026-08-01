# BOI LAGBE – Admin Panel Implementation Plan

This document tracks the backend admin panel implementation for the BOI LAGBE project.

- ✅ = Completed
- 🚧 = Working on it (partial — see Status notes)
- ⬜ = Pending

> **Progress summary:** Phases 1, 2 and 4 are complete. Phase 3 is complete for the core
> modules (users, agents, riders, areas) — the sub-items marked 🚧 have their entities
> created but their dedicated endpoints are not yet built. Phases 5–12 are pending.
>
> **Build status (as of Phase 4):** `tsc --noEmit` ✅ · `eslint` ✅ · code review ✅
> — 181 admin source files, 7 feature modules + `AdminModule`, 129 registered entities.

---

## Phase 1 – Admin foundation and role guard

**Goal:** Create the admin module structure, role-based guard, and shared utilities.

- ✅ Create `src/admin/` folder and `admin.module.ts` (now `@Global()`)
- ✅ Create `src/admin/common/guards/admin-role.guard.ts` (ADMIN / SUPER_ADMIN only)
- ✅ Create `src/admin/common/decorators/admin-roles.decorator.ts`
- ✅ Create `src/admin/common/decorators/admin-only.decorator.ts`
- ✅ Create shared DTOs:
  - ✅ `paginated-query.dto.ts`
  - ✅ `date-range-query.dto.ts`
- ✅ Create shared query helpers in `src/admin/common/utils/query-builder.ts`
- ✅ Wire admin module into `app.module.ts` (no changes to auth)

---

## Phase 2 – RBAC and governance

**Goal:** Role, permission, approval, audit, and activity logging.

- ✅ Create `src/admin/rbac/` module (controller, service, DTOs)
- ✅ Entities:
  - ✅ Role
  - ✅ Permission
  - ✅ PermissionGroup
  - ✅ SystemModule
  - ✅ RolePermission
  - ✅ UserRole
  - ✅ UserPermission
  - ✅ ApprovalLevel
  - ✅ ApprovalWorkflow
  - ✅ AuditLog
  - ✅ ActivityLog
  - ✅ LoginPolicy
- ✅ Routes:
  - ✅ CRUD for roles, permissions, modules (roles full CRUD; permissions GET/POST; modules read-only)
  - ✅ Assign roles to users
  - ✅ Create/approve approval workflows
  - ✅ List audit logs and activity logs
- ✅ Add DTO validation and pagination

---

## Phase 3 – Users, agents, riders, areas, academic

**Goal:** Admin management for users, agents, riders, areas, and academic structure.

- ✅ Create `src/admin/users/` module
  - ✅ User listing and detail views
  - ✅ Status update endpoints
- ✅ Create `src/admin/agents/` module
  - ✅ Agent CRUD (create, update, list, detail, status)
  - ✅ Agent area/institute assignment
  - 🚧 Agent performance, salary, commission, settlement (entities done, endpoints pending)
  - 🚧 Agent wallet and transactions (entities done, endpoints pending)
  - 🚧 Agent documents, leave, attendance, bonus, penalty, announcements (entities done, endpoints pending)
- ✅ Create `src/admin/riders/` module
  - 🚧 Rider CRUD and status (list/detail/status + area assignment done; create/update pending)
  - 🚧 Rider area, route, availability (area assignment done; route/availability entities only)
  - 🚧 Shift, attendance, assignment (entities done, endpoints pending)
  - 🚧 Delivery, tracking, OTP, proof (entities done, endpoints pending)
  - 🚧 Earnings, settlement, wallet, bonus, penalty, rating, performance (entities done, endpoints pending)
- ✅ Create `src/admin/areas/` module
  - ✅ Country, division, district, upazila, area (entities + CRUD + drill-down browse)
  - 🚧 Area coverage (agent assignment) (entity done; agent–area assignment lives in the agents module)
- ⬜ Create `src/admin/academic/` module (academic entities live under
  `src/admin/areas/entities/`; a separate module was not created per the original file list)
  - 🚧 Institute, campus, department, program, semester, academic session (entities done; institute browse via the areas module; no CRUD for campus/department/program/semester/session)
  - 🚧 StudentInstitute, InstituteAgent, InstituteDocument (entities done, endpoints pending)

---

## Phase 4 – Warehouse and inventory

**Goal:** Central warehouse and agent store inventory oversight.

- ✅ Create `src/admin/warehouses/` module
  - ✅ Warehouse, zone, shelf
  - ✅ Supplier, purchase, purchase item
  - ✅ Inventory, batch, stock movement
  - ✅ Stock transfer, reservation, adjustment, damage, return
  - ✅ Inventory audit, reorder rule, restock request, barcode
- ✅ Create `src/admin/inventory/` module
  - ✅ Agent store, shelf, inventory, batch
  - ✅ Stock movement, transfer, reservation
  - ✅ Restock request and items
  - ✅ Damage, return, adjustment, audit
  - ✅ Daily sales, low stock alerts, product receive
  - ✅ Store expense and expense category
  - ✅ Store closing
- ✅ Admin approval routes:
  - ✅ Restock approval (`POST /admin/inventory/restock-requests/:id/approve`)
  - ✅ Stock transfer approval (`POST /admin/inventory/transfers/:id/approve`)
  - ✅ Inventory audit management (`POST /admin/inventory/audits`)
- ✅ Warehouse CRUD (`GET` / `POST` / `PATCH /admin/warehouses`, `GET :id`)
- ✅ Inventory listing + stock movements with filters and pagination

---

## Phase 5 – Product catalog and books

**Goal:** Admin control over products and academic books.

- ⬜ Create `src/admin/products/` module
  - ⬜ Product, category, subcategory, brand
  - ⬜ Variant, variant option
  - ⬜ Attribute, attribute value
  - ⬜ Image, gallery, price, cost, inventory, barcode
  - ⬜ Tag, review, rating, FAQ, SEO
  - ⬜ Bundle, bundle item, recommendation
  - ⬜ View history, wishlist, comparison
- ⬜ Create `src/admin/books/` module
  - ⬜ Book, edition, author, publisher
  - ⬜ Category, subject, language, series
  - ⬜ Course, semester, department, institute mapping
  - ⬜ Condition (used book), tag, file, preview
  - ⬜ Recommendation, review, favorite, reading list
  - ⬜ Price history
- ⬜ Admin actions:
  - ⬜ Create/edit/publish products and books
  - ⬜ Review management
  - ⬜ Price and inventory sync

---

## Phase 6 – Used books buyback and resale

**Goal:** Admin review and approval for used-book lifecycle.

- ⬜ Create `src/admin/used-books/` module
  - ⬜ UsedBookSellRequest, UsedBookItem, UsedBookImage
  - ⬜ Evaluation, offer, approval, pickup
  - ⬜ Inspection, inventory, pricing, resale
  - ⬜ History, payment, condition report, repair
  - ⬜ Reject reason, return, audit, analytics, settlement
- ⬜ Admin routes:
  - ⬜ Review sell requests
  - ⬜ Generate and approve offers
  - ⬜ Schedule pickup
  - ⬜ Inspect and repair decisions
  - ⬜ Publish to resale
  - ⬜ View used-book analytics

---

## Phase 7 – Digital content management

**Goal:** Admin control over digital learning resources.

- ⬜ Create `src/admin/digital-content/` module
  - ⬜ DigitalContent, category, subcategory
  - ⬜ File, version, preview
  - ⬜ Author, publisher, course, department, semester, institute
  - ⬜ Access, purchase, download, bookmark, reading history
  - ⬜ Review, rating, wishlist, subscription
  - ⬜ Certificate, exam, question, result
  - ⬜ Announcement, FAQ, SEO
  - ⬜ Analytics, report
- ⬜ Admin actions:
  - ⬜ CRUD and publish content
  - ⬜ Access grant (including ADMINGRANTED)
  - ⬜ Exam and certificate oversight
  - ⬜ View analytics and reports

---

## Phase 8 – Custom orders, gifts, print

**Goal:** Admin oversight of custom products, gifts, and printing.

- ⬜ Create `src/admin/custom-orders/` module
  - ⬜ CustomOrder, CustomOrderItem
  - ⬜ CustomProduct, template, design, design file
  - ⬜ Specification, quotation, approval
  - ⬜ Production, production stage, delivery schedule
  - ⬜ Gift category, product, bundle, bundle item
  - ⬜ Gift message, wrapping, occasion, recipient
  - ⬜ Print service, job, file, pricing, delivery
  - ⬜ Review, wishlist, analytics, order history, report
- ⬜ Admin actions:
  - ⬜ Quotation and design approval
  - ⬜ Production start/monitor
  - ⬜ Delivery scheduling
  - ⬜ Print service and job management
  - ⬜ Analytics and reporting

---

## Phase 9 – Orders and delivery management

**Goal:** Admin oversight of all orders and delivery operations.

- ⬜ Create `src/admin/orders/` module
  - ⬜ ShoppingCart, CartItem, Checkout
  - ⬜ Order, OrderItem, OrderStatus, OrderTimeline
  - ⬜ OrderAddress, coupon, discount, tax
  - ⬜ OrderPayment, invoice, package, shipment
  - ⬜ OrderDelivery, tracking
  - ⬜ Return, refund, cancel, exchange
  - ⬜ Rating, notification, history
  - ⬜ Analytics, report
- ⬜ Admin actions:
  - ⬜ List and filter orders
  - ⬜ Update order status
  - ⬜ Assign agent and rider
  - ⬜ Manage returns, refunds, cancellations, exchanges
  - ⬜ View order analytics and reports

---

## Phase 10 – Finance and accounting

**Goal:** Admin control over platform finance (no payment gateway integration).

- ⬜ Create `src/admin/finance/` module
  - ⬜ Company, CompanyBranch
  - ⬜ BankAccount, PaymentGateway (config only)
  - ⬜ PaymentTransaction, PaymentMethod
  - ⬜ Wallet, WalletTransaction
  - ⬜ Invoice
  - ⬜ ExpenseCategory, Expense
  - ⬜ IncomeCategory, Income
  - ⬜ CashFlow
  - ⬜ JournalEntry, Ledger, Account
  - ⬜ Tax
  - ⬜ Commission
  - ⬜ Salary, Payroll
  - ⬜ SupplierPayment, CustomerRefund
  - ⬜ FinancialSettlement
  - ⬜ ProfitLoss, BalanceSheet, FinancialReport
  - ⬜ SystemSetting, AdminActivity
- ⬜ Admin actions:
  - ⬜ View transactions, invoices, expenses, incomes
  - ⬜ View journal entries, ledgers, accounts
  - ⬜ View profit/loss, balance sheet, financial reports
  - ⬜ Manage salary, commission, refunds, settlements
  - ⬜ Manage system settings and log admin activity

---

## Phase 11 – Reports, BI, CRM, support

**Goal:** Dashboards, analytics, reports, and customer support.

- ⬜ Create `src/admin/reports/` module
  - ⬜ Dashboard, DashboardWidget
  - ⬜ KPI
  - ⬜ Sales, revenue, customer, agent, rider analytics
  - ⬜ Inventory, product, used-book, digital-content analytics
  - ⬜ Custom-order, payment, area, vendor, marketing analytics
  - ⬜ Notification, search, order, delivery analytics
  - ⬜ Financial, user activity analytics
  - ⬜ ReportTemplate, GeneratedReport, ScheduledReport
  - ⬜ ExportHistory, Forecast, AuditReport, BusinessInsight
- ⬜ Create `src/admin/crm/` module
  - ⬜ CustomerTicket, TicketCategory, TicketPriority, TicketStatus
  - ⬜ TicketReply, Attachment, Assignment
  - ⬜ LiveChat, ChatMessage, ChatAttachment
  - ⬜ CustomerFeedback, Complaint, Suggestion
  - ⬜ FAQ, KnowledgeBase, Announcement
  - ⬜ Notification, NotificationTemplate
  - ⬜ EmailQueue, SMSQueue, PushNotification
  - ⬜ ContactMessage
  - ⬜ CustomerSurvey, SurveyQuestion, SurveyResponse
  - ⬜ LoyaltyPointHistory, CustomerReward
  - ⬜ CRMActivity, CustomerSupportAnalytics, CustomerSupportReport
- ⬜ Admin actions:
  - ⬜ View dashboards and KPIs
  - ⬜ Generate and export reports
  - ⬜ Manage support tickets and live chat
  - ⬜ Manage notifications and announcements
  - ⬜ View loyalty and CRM analytics

---

## Phase 12 – Hardening and production readiness

**Goal:** Final polish, security, validation, and tests.

- ✅ Add consistent DTO validation across all modules (Phases 1–4)
- ✅ Add standardized error handling and response format (`GlobalHttpExceptionFilter`)
- ✅ Add transaction-safe service methods for multi-entity workflows (Phases 2–4)
- ✅ Add pagination, sorting, and filtering everywhere relevant (`QueryBuilder`)
- ✅ Add audit logging for important admin actions (`AdminAuditService`)
- ⬜ Add Swagger/OpenAPI annotations (N/A for now — the project does not use Swagger; revisit only if the team adopts it)
- ⬜ Write tests for:
  - ⬜ Admin role guard behavior
  - ⬜ Key approval and finance flows
- ✅ Verify:
  - ✅ All admin routes require authentication (global `StrictJwtAuthGuard`)
  - ✅ All admin routes require ADMIN or SUPER_ADMIN role (`@AdminOnly()`)
  - ✅ No admin route uses `@Public()`
  - ✅ No payment gateway integration code exists

---

## Status notes

- **Phase 3 🚧 items** mean the entities are fully created and registered (schema-ready)
  but the dedicated admin endpoints are not built yet. The agent/rider financial and
  operational entities (salaries, wallets, settlements, deliveries, etc.) are dormant
  data models awaiting their Phase 5/9/10 endpoint work.
- **`src/admin/academic/`** was not created as a separate module — academic entities
  (Department, Program, Semester, AcademicSession, StudentInstitute, InstituteAgent,
  InstituteDocument) live under `src/admin/areas/entities/` per the original file list.
- **Permissions/modules** are intentionally partial (GET/POST permissions, GET-only
  modules) — matching the Phase 2 route list. Full CRUD can be added later.
- **Agent store inventory** (agent-side entities in `src/admin/inventory/entities/`) is
  registered schema-only; the live oversight endpoints operate on central-warehouse
  stock (restock/transfer/audit).
- **`synchronize: true`** is still enabled in `app.module.ts`; consider switching to
  real TypeORM migrations before the schema grows further (recommended before Phase 5).

---

## How to use this file

1. Save this as `BOI-LAGBE-ADMIN-PANEL-PLAN.md` in your repo root.
2. As you implement features, update the checkboxes:
   - ✅ for completed
   - 🚧 for in-progress
   - ⬜ for pending
3. Keep this file updated so your team can see progress at a glance.

## Optional sections you can add later

- A “Known issues / TODOs” section.
- A “Deployment checklist” section.
- A “Frontend integration status” section (once admin UI work starts).
