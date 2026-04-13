# CLAUDE.md — Kanisa360 Church Management System

> This file is the **single source of truth** for the Kanisa360 codebase.
> Read this fully before writing any code, making any schema change, or adding any feature.

---

## 1. Project Overview

**Kanisa360** is a full-stack church management platform built for a single Lead Church
and its sub-churches. It manages congregation data, financials, pledges, services,
attendance, and generates reports for church leadership.

**Primary Users:**
- Church Admin / Pastor — full access
- Secretary — data entry, member management, financials
- Sub-church Leader — view/manage their sub-church only
- Viewer — read-only access to reports

**Primary Language:** Swahili UI labels, English codebase
**Target Devices:** Desktop (admin work) + Mobile (data entry in the field)

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 14 (App Router) | Use server components by default |
| Backend | Supabase | Auth, DB, Storage, Realtime |
| Database | PostgreSQL (via Supabase) | |
| Styling | Tailwind CSS + shadcn/ui | Custom theme defined below |
| State | Zustand | Client state only (minimal) |
| Forms | React Hook Form + Zod | All forms validated with Zod schemas |
| Charts | Recharts | Dashboard visualizations |
| PDF Export | react-pdf / @react-pdf/renderer | Reports |
| Language | TypeScript (strict mode) | No `any` types ever |
| Deployment | Vercel | Connected to Supabase prod |

---

## 3. Repository Structure

```
kanisa360/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Sidebar + topbar shell
│   │   ├── page.tsx              # Dashboard home (KPIs)
│   │   ├── members/
│   │   │   ├── page.tsx          # Member list
│   │   │   ├── new/page.tsx      # Register new member
│   │   │   └── [id]/
│   │   │       ├── page.tsx      # Member profile
│   │   │       └── edit/page.tsx
│   │   ├── financials/
│   │   │   ├── pledges/page.tsx  # Ahadi Zake
│   │   │   ├── ledger/page.tsx   # Income & expenses
│   │   │   └── payments/page.tsx # Pledge payment recording
│   │   ├── services/
│   │   │   ├── page.tsx          # Upcoming & past services
│   │   │   └── [id]/page.tsx     # Service detail + attendance
│   │   ├── reports/
│   │   │   └── page.tsx          # Generate & export reports
│   │   └── settings/
│   │       ├── church/page.tsx   # Church profile
│   │       └── users/page.tsx    # Manage user roles
├── components/
│   ├── ui/                       # shadcn/ui base components (do not modify)
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── PageHeader.tsx
│   ├── members/
│   ├── financials/
│   ├── dashboard/
│   ├── services/
│   └── reports/
├── lib/
│   ├── supabase/
│   ├── hooks/
│   ├── validations/
│   └── utils/
├── supabase/
│   ├── migrations/001_initial_schema.sql
│   ├── seed.sql
│   └── types.ts
├── middleware.ts
├── CLAUDE.md
└── .env.local
```

---

## 4. Database Schema

See `supabase/migrations/001_initial_schema.sql` for the full schema.

**Tables:** church, profiles, members, member_categories, pledges,
pledge_payments, financials, services, attendance

**Views:** pledge_summary, monthly_financials

**RLS:** Enabled on all tables — church isolation enforced.

---

## 5. Authentication & Authorization

- Supabase Auth handles login (email/password)
- On sign-up, a `profiles` row is created via a Supabase trigger
- `middleware.ts` protects all `/dashboard/*` routes
- Role is read from `profiles.role` — **never trust client-side role claims**

---

## 6. Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Files | kebab-case | `member-form.tsx` |
| Components | PascalCase | `MemberForm` |
| Functions | camelCase | `getMemberById` |
| DB columns | snake_case | `full_name` |
| Zod schemas | camelCase + Schema suffix | `memberSchema` |
| Types | PascalCase | `Member`, `Pledge` |
| Server actions | verb + noun | `createMember`, `updatePledge` |
| Constants | SCREAMING_SNAKE | `PLEDGE_TYPES` |

---

## 7. Design System

**Theme:** Refined dark luxury — deep navy/charcoal backgrounds, gold accents, clean serif headings.

```typescript
colors: {
  brand: {
    gold:     '#c9a84c',
    goldLight:'#e8c97a',
    dark:     '#0f0e17',
    surface:  '#1a1826',
    card:     '#211f30',
    border:   '#2e2b3e',
  },
  status: {
    active:   '#4caf88',
    warning:  '#e8c97a',
    danger:   '#e05c5c',
    info:     '#5c9de0',
  }
}
```

**Typography:** Cormorant Garamond (headings) + Josefin Sans (body)

---

## 8. Build Order (Implementation Phases)

### ✅ Phase 1 — Foundation
- [x] Next.js 14 project setup with TypeScript + Tailwind + shadcn/ui
- [x] Supabase project creation + `001_initial_schema.sql` migration
- [x] Auth: login page, middleware, session handling
- [x] Profile creation trigger in Supabase
- [x] Dashboard shell (sidebar, topbar, layout)

### ✅ Phase 2 — Member Management
- [x] Member list page with search + filter by status
- [x] Member registration form (full Taarifa Binafsi)
- [x] Member profile page
- [x] Member category tagging
- [x] Member edit

### ✅ Phase 3 — Financials & Pledges
- [x] Pledge creation per member (all 5 types)
- [x] Pledge payment recording
- [x] Pledge progress visualization per member
- [x] General ledger (income/expense entry)

### ✅ Phase 4 — Dashboard & Reports
- [x] KPI cards (total members, total pledged, total paid, services)
- [x] Member growth chart (Recharts AreaChart)
- [x] Pledge fulfillment chart by type (Recharts BarChart)
- [x] Printable weekly report
- [ ] PDF export (react-pdf — Phase 5)

### ✅ Phase 5 — Services & Events
- [x] Service/event creation form
- [x] Service history list
- [x] Service detail page with attendance list

### ✅ Phase 6 — Settings
- [x] Church profile page
- [x] User management page

---

## 9. Rules Claude Must Follow

1. **Never use `any` in TypeScript** — use proper types or `unknown`
2. **Never hardcode Swahili strings** — all labels come from `@/lib/constants`
3. **Never call Supabase from a client component** — use server actions or hooks
4. **Never skip Zod validation** — every form mutation is validated
5. **Always handle loading + error states** — use Skeleton components
6. **Always use RLS** — never use service role key on the client
7. **Always format currency as TZS** — use `formatCurrency()` util
8. **Component files max 200 lines** — split into smaller components if longer
9. **Every new table needs a migration file** — never edit prod DB manually
10. **Always check CLAUDE.md before building** — don't jump ahead of phases
