# StockSync: Functional and NFR Flow for Interview Explanation

This file is meant to help explain the project in an interview. It maps every major functional requirement (FR) and non-functional requirement (NFR) to the exact route, file, and internal components involved.

---

## 1. Overall Application Flow

### Route-to-feature map

| Flow step | Route / Entry | Main file(s) | Inner components / logic |
| --- | --- | --- | --- |
| Landing page | / | [app/page.tsx](app/page.tsx) | Navbar, Footer, hero section, feature cards |
| Login | /login | [app/login/page.tsx](app/login/page.tsx) | email/password form, validation, login API call |
| Register | /register | [app/register/page.tsx](app/register/page.tsx) | validation, password checks, registration API |
| Verify email | /verify-email | [app/verify-email/page.tsx](app/verify-email/page.tsx) | token read from URL and verification call |
| Dashboard | /dashboard | [app/dashboard/page.tsx](app/dashboard/page.tsx) | DashboardHeader, MetricCard, ProductCard, filters |
| History | /dashboard/history | [app/dashboard/history/page.tsx](app/dashboard/history/page.tsx) | metric cards, filters, audit table |
| Profile | /dashboard/profile | [app/dashboard/profile/page.tsx](app/dashboard/profile/page.tsx) | profile form, save action, stats cards |
| Protected stock update | /api/products/[id]/stock | [app/api/products/[id]/stock/route.ts](app/api/products/[id]/stock/route.ts) | getSession, DataService.updateStock |
| Product API | /api/products | [app/api/products/route.ts](app/api/products/route.ts) | getProducts, getManagersCount, getLogs |
| History API | /api/history | [app/api/history/route.ts](app/api/history/route.ts) | getLogs |
| Auth API | /api/auth/* | [app/api/auth/login/route.ts](app/api/auth/login/route.ts), [app/api/auth/register/route.ts](app/api/auth/register/route.ts), [app/api/auth/me/route.ts](app/api/auth/me/route.ts), [app/api/auth/logout/route.ts](app/api/auth/logout/route.ts) | session token, password verification, logout |
| Shared data layer | lib/ | [lib/dataService.ts](lib/dataService.ts), [lib/auth.ts](lib/auth.ts), [lib/prisma.ts](lib/prisma.ts) | database access, auth logic, fallback logic |

---

## 2. Functional Requirements (FR) Flow

### FR-01: Public landing page and app entry
- Requirement: User should land on a branded homepage with navigation and product overview.
- Route: /
- Main file: [app/page.tsx](app/page.tsx)
- Components involved:
  - [components/Navbar.tsx](components/Navbar.tsx)
  - [components/Footer.tsx](components/Footer.tsx)
  - [components/Logo.tsx](components/Logo.tsx)
- Interview explanation: This is the entry point. The page builds the public home screen and directs users to register or login.

### FR-02: Manager registration
- Requirement: A new manager can create an account.
- Route: /register
- Main file: [app/register/page.tsx](app/register/page.tsx)
- API flow: [app/api/auth/register/route.ts](app/api/auth/register/route.ts)
- Shared logic: [lib/auth.ts](lib/auth.ts), [lib/dataService.ts](lib/dataService.ts), [lib/email.ts](lib/email.ts)
- Components involved:
  - input validation
  - password strength and confirmation validation
  - account creation and verification email trigger
- Interview explanation: Form collects name, email, and password. The frontend validates, then POSTs to the register endpoint. The backend hashes the password, creates the manager, and sends a verification email.

### FR-03: Email verification
- Requirement: Manager must verify their email before login.
- Route: /verify-email
- Main file: [app/verify-email/page.tsx](app/verify-email/page.tsx)
- API flow: [app/api/auth/verify-email/route.ts](app/api/auth/verify-email/route.ts)
- Data logic: [lib/dataService.ts](lib/dataService.ts)
- Interview explanation: The verification URL includes a token. The page calls the verify endpoint, which validates the token and marks emailVerifiedAt.

### FR-04: Login and session creation
- Requirement: Registered managers can log in and receive a secure session.
- Route: /login
- Main file: [app/login/page.tsx](app/login/page.tsx)
- API flow: [app/api/auth/login/route.ts](app/api/auth/login/route.ts)
- Shared logic: [lib/auth.ts](lib/auth.ts), [lib/dataService.ts](lib/dataService.ts)
- Interview explanation: The login form validates email and password. The API checks the manager, verifies the hash, creates a JWT, and sends it via an HTTP-only cookie.

### FR-05: Protected dashboard view
- Requirement: Logged-in managers can access the inventory dashboard and protected pages.
- Route: /dashboard
- Main layout: [app/dashboard/layout.tsx](app/dashboard/layout.tsx)
- Components involved:
  - [components/Sidebar.tsx](components/Sidebar.tsx)
  - [components/DashboardHeader.tsx](components/DashboardHeader.tsx)
  - [components/MetricCard.tsx](components/MetricCard.tsx)
  - [components/ProductCard.tsx](components/ProductCard.tsx)
- Main file: [app/dashboard/page.tsx](app/dashboard/page.tsx)
- Interview explanation: The dashboard layout wraps all protected screens. The sidebar handles navigation, while the page fetches product data and displays KPI cards and inventory items.

### FR-06: Product inventory display and filtering
- Requirement: Managers can view stock levels and filter by search, category, or status.
- Route: /dashboard
- Main file: [app/dashboard/page.tsx](app/dashboard/page.tsx)
- Components involved:
  - [components/ProductCard.tsx](components/ProductCard.tsx)
  - [components/MetricCard.tsx](components/MetricCard.tsx)
- API file: [app/api/products/route.ts](app/api/products/route.ts)
- Interview explanation: Products are fetched from the API, filtered client-side by name, category, and stock status, and rendered as product cards.

### FR-07: Stock add/remove update
- Requirement: A manager must be able to add or remove stock for a product.
- Route: /dashboard + backend stock route
- Frontend file: [components/ProductCard.tsx](components/ProductCard.tsx)
- Backend file: [app/api/products/[id]/stock/route.ts](app/api/products/[id]/stock/route.ts)
- Shared service: [lib/dataService.ts](lib/dataService.ts)
- Interview explanation: Quantity is selected in ProductCard, the UI optimistically updates, and the request is sent to the stock endpoint. The backend validates the delta and updates the database.

### FR-08: Concurrency-safe stock updates
- Requirement: Multiple managers should not overwrite each other’s inventory updates silently.
- Backend logic: [lib/dataService.ts](lib/dataService.ts)
- Route: [app/api/products/[id]/stock/route.ts](app/api/products/[id]/stock/route.ts)
- Interview explanation: The database update is executed inside a Prisma transaction. It reads current stock, checks range validity, updates the product, and creates an audit log in the same transaction.

### FR-09: Inventory audit history
- Requirement: Every stock change should be visible in a history table.
- Route: /dashboard/history
- Main file: [app/dashboard/history/page.tsx](app/dashboard/history/page.tsx)
- API file: [app/api/history/route.ts](app/api/history/route.ts)
- Service file: [lib/dataService.ts](lib/dataService.ts)
- Interview explanation: History data is retrieved from inventory logs, grouped with product and manager data, and displayed with filters and summaries.

### FR-10: Manager profile management
- Requirement: Manager can view and edit their profile details.
- Route: /dashboard/profile
- Main file: [app/dashboard/profile/page.tsx](app/dashboard/profile/page.tsx)
- API file: [app/api/profile/route.ts](app/api/profile/route.ts)
- Shared service: [lib/dataService.ts](lib/dataService.ts)
- Interview explanation: The page fetches current manager data from /api/auth/me and saves updates through /api/profile.

### FR-11: Logout and session cleanup
- Requirement: Manager should be able to log out safely.
- Route: /logout via UI action from sidebar
- Main file: [components/Sidebar.tsx](components/Sidebar.tsx)
- API file: [app/api/auth/logout/route.ts](app/api/auth/logout/route.ts)
- Interview explanation: The sidebar calls logout, and the backend clears the HTTP-only auth cookie from the browser.

---

## 3. Non-Functional Requirements (NFR) Flow

### NFR-01: Security
- Need: Data and sessions must be protected.
- Files involved:
  - [lib/auth.ts](lib/auth.ts)
  - [app/api/auth/login/route.ts](app/api/auth/login/route.ts)
  - [app/api/auth/register/route.ts](app/api/auth/register/route.ts)
  - [app/api/products/[id]/stock/route.ts](app/api/products/[id]/stock/route.ts)
- Interview explanation: Passwords are hashed with bcrypt. JWTs are created for session validation. Protected routes use session checks before mutation operations.

### NFR-02: Concurrency correctness
- Need: The system must avoid race conditions and silent overwrites.
- Files involved:
  - [lib/dataService.ts](lib/dataService.ts)
  - [app/api/products/[id]/stock/route.ts](app/api/products/[id]/stock/route.ts)
- Interview explanation: The stock update uses database transaction semantics, ensuring previous stock and new stock are handled atomically and consistent.

### NFR-03: Reliability and fallback behavior
- Need: The app should remain usable even when database access is unavailable.
- Files involved:
  - [lib/dataService.ts](lib/dataService.ts)
  - [lib/prisma.ts](lib/prisma.ts)
- Interview explanation: The data service includes an in-memory fallback store. This helps keep local development and demo flows alive even if Prisma is not connected.

### NFR-04: Responsive and user-friendly UI
- Need: Inventory screens should work well across dashboards and devices.
- Files involved:
  - [app/dashboard/page.tsx](app/dashboard/page.tsx)
  - [app/dashboard/history/page.tsx](app/dashboard/history/page.tsx)
  - [app/dashboard/profile/page.tsx](app/dashboard/profile/page.tsx)
  - [components/ProductCard.tsx](components/ProductCard.tsx)
- Interview explanation: Layout uses Tailwind classes for responsive design and card-based UI consistency.

### NFR-05: Maintainability and code organization
- Need: The code should be modular and easy to reason about.
- Files involved:
  - [app/](app/)
  - [components/](components/)
  - [lib/](lib/)
- Interview explanation: Routes handle UI, components handle reusable rendering, and service files centralize logic and database access.

### NFR-06: Auditability
- Need: Every stock change must be traceable.
- Files involved:
  - [lib/dataService.ts](lib/dataService.ts)
  - [app/api/history/route.ts](app/api/history/route.ts)
  - [app/dashboard/history/page.tsx](app/dashboard/history/page.tsx)
- Interview explanation: Every stock mutation stores product ID, manager, previous and new stock, and timestamp, which is later displayed in the history page.

---

## 4. Best Interview Talking Script

A good interviewer flow could be:

1. Start from the public route: / and explain the landing page setup.
2. Move to /register and /login to explain onboarding and authentication.
3. Explain session creation in [lib/auth.ts](lib/auth.ts) and cookie handling in auth route files.
4. Move to /dashboard and explain layout, metrics, filtering, and ProductCard.
5. Explain stock mutation via ProductCard → API route → DataService.updateStock.
6. Explain audit trail through history API and logs.
7. End with profile and logout flows to show full lifecycle.

---

## 5. Core Technical Stack behind this flow

- Frontend: Next.js App Router + React + TypeScript
- Styling: Tailwind CSS
- Auth: bcryptjs + JWT
- Database: Prisma + PostgreSQL
- Email: Resend
- Shared service layer: [lib/dataService.ts](lib/dataService.ts)

This flow is enough to explain the app end-to-end in a technical interview while tying each requirement to actual files and components.
