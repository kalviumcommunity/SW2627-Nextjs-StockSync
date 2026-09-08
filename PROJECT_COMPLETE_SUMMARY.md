# 📖 StockSync: Complete Project Summary & Action Log

This document provides a complete, 360-degree summary of everything created, configured, and tested in this project.

---

## 🎯 1. Project Overview & Concept

**StockSync** is an inventory management web application designed for store managers.
* **Goal:** Enable authenticated managers to view products, update stock (`+ Add Stock` / `- Remove Stock`), receive instant optimistic feedback, and maintain an auditable history of all updates.
* **Concurrency Safety:** Simultaneous updates to the same product by multiple managers are handled safely using atomic database transactions (Prisma + PostgreSQL) so that no stock updates are silently overwritten.
* **Auditability:** Every stock change is permanently logged with the manager's ID, change amount, previous stock, new stock, and timestamp.

---

## 🎨 2. UI Breakdown from Google Doc Screenshots

We analyzed and built all 6 screens from your document:

| # | Screen | URL Route | Key Components & Features |
| :--- | :--- | :--- | :--- |
| **1** | **Landing Page** | `/` | Sticky Navbar (Logo, Features, How It Works, Login, CTA), Hero Section with preview graphic & perks, 4 Features Cards, 3-Step How It Works timeline, Purple CTA Banner, Dark Footer. |
| **2** | **Login Page** | `/login` | Centered card, Email input with validation, Password input with eye toggle, Remember me, "Forgot password?", "Log In" button, "Continue with Google", Link to Register, Demo hints. |
| **3** | **Register Page** | `/register` | Full Name, Email, Password, Confirm Password, Real-time client error validation, "Create Account" button, Terms & Privacy policy links, Navigation to Login. |
| **4** | **Inventory Dashboard** | `/dashboard` | Dark Left Sidebar (`#0F172A`), Topbar (Search, Bell, User Badge), 4 Top Metric Cards (Total Products, Managers, Out of Stock, Today's Updates), Search & Category/Status Filters, 12 Product Cards with independent quantity controls and instant optimistic UI updates. |
| **5** | **Inventory History** | `/dashboard/history` | 4 Summary Metric Cards (Total Updates, Today's, Added Stock, Removed Stock), Search & Filter bar (Manager, Type, Sort Order), Audit Table with Manager, Product, Change (+/-), Prev. Stock, New Stock, Time, Status. |
| **6** | **Manager Profile** | `/dashboard/profile` | Manager profile header (Avatar `MB`, Role badge), Editable name & email form, Save/Cancel buttons, 3 Activity Metric Cards, Static "Change Password" security tile. |

---

## 💻 3. Step-by-Step NPM Commands Applied & Their Effects

### 🔹 Command 1: Package Configuration & Dependency Installation
```bash
npm install
```
* **Why:** Installed all core libraries: Next.js 14, React 18, Tailwind CSS, Prisma ORM, bcryptjs (password hashing), jsonwebtoken (JWT sessions), and Lucide React (UI icons).
* **What Happened:** Created `node_modules/` with 143 packages and locked dependencies in `package.json`.

### 🔹 Command 2: Prisma ORM Code Generation
```bash
npx prisma generate
```
* **Why:** Read `prisma/schema.prisma` and compiled TypeScript types and query builders for `Manager`, `Product`, and `InventoryLog`.
* **What Happened:** Created `@prisma/client` bindings ready for database transactions.

### 🔹 Command 3: Production Build & Validation
```bash
npm run build
```
* **Why:** Validated TypeScript types, linting, Next.js routing, and static page generation.
* **What Happened:** Built all 16 pages and API endpoints with **`✓ Compiled successfully`** (0 errors).

---

## 🗂️ 4. Complete File Structure Created

```text
SW2627-Nextjs-StockSync/
├── app/
│   ├── layout.tsx                     # Global HTML layout, Inter font, SEO metadata
│   ├── globals.css                    # Tailwind directives, color tokens, custom scrollbar
│   ├── page.tsx                       # 1. Landing Page
│   ├── login/page.tsx                 # 2. Manager Login Page
│   ├── register/page.tsx              # 3. Manager Registration Page
│   ├── dashboard/
│   │   ├── layout.tsx                 # Dashboard Layout (Sidebar + content area)
│   │   ├── page.tsx                   # 4. Main Inventory Dashboard
│   │   ├── history/page.tsx           # 5. Inventory History Audit Page
│   │   └── profile/page.tsx           # 6. Manager Profile Page
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts      # Manager account creation & JWT cookie
│       │   ├── login/route.ts         # Manager authentication & bcrypt verification
│       │   ├── logout/route.ts        # Clear session cookie
│       │   └── me/route.ts            # Current manager session endpoint
│       ├── products/
│       │   ├── route.ts               # Get products & dashboard stats
│       │   └── [id]/stock/route.ts    # Concurrency-safe atomic stock update
│       ├── history/route.ts           # Fetch inventory audit logs
│       └── profile/route.ts           # Update manager profile info
├── components/
│   ├── Logo.tsx                       # Brand cube logo + typography
│   ├── Navbar.tsx                     # Landing page top navigation bar
│   ├── Footer.tsx                     # Landing page dark footer
│   ├── Sidebar.tsx                    # Dark dashboard sidebar with user widget
│   ├── DashboardHeader.tsx            # Dashboard topbar with search, notifications, badge
│   ├── MetricCard.tsx                 # Clean metric card component
│   └── ProductCard.tsx                # Product card with independent quantity controls
├── lib/
│   ├── prisma.ts                      # Prisma client singleton instance
│   ├── auth.ts                        # Password hashing (bcrypt) & JWT helpers
│   └── dataService.ts                 # Atomic transactions & in-memory dev repository
├── prisma/
│   ├── schema.prisma                  # PostgreSQL database schema (Manager, Product, Log)
│   └── seed.js                        # Starter seed script (12 products + demo managers)
├── .env                               # Local environment variables
├── .gitignore                         # Git exclusion rules
├── package.json                       # Dependencies & scripts
├── tsconfig.json                      # TypeScript configuration
├── tailwind.config.ts                 # Tailwind design tokens & brand theme
└── postcss.config.js                  # PostCSS plugins
```

---

## 🔒 5. Concurrency Safety & Backend Architecture

To satisfy **FR-11** and **NFR-02**:
* Stock updates use atomic SQL increments rather than naive read-then-write updates.
* If stock would drop below zero, the transaction aborts with an error (`"Cannot remove more stock than currently available."`).
* On success, an audit log is automatically created within the same transaction.
* If the server rejects an update, the frontend instantly rolls back the optimistic UI state to the confirmed database state.

---

## 🛡️ 6. GitHub Privacy & Security Status

* **No Git Uploads:** No code has been pushed to any remote repository or GitHub.
* **Protected Files:** `.env`, `.next/`, `node_modules/`, and temporary build files are included in `.gitignore`.
* **Local Reference:** This repository is stored purely on your local machine (`c:\Users\Dell\Desktop\SW2627-Nextjs-StockSync`) so you can inspect it, understand it, and recreate it component-by-component in your personal repository for daily PRs.

---

## 🚀 7. Running the Application Locally

```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

* **Demo Account:**
  * **Email:** `manager@example.com`
  * **Password:** `password`
