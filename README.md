# Frontend — Assignment & Submission Management System

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + TanStack Query.

## Architecture (important — read before editing)
- **Every page under `src/app/` is a Server Component.** Pages fetch their
  initial data by directly `await`-ing a function from `src/actions/` and
  render server-side. No `"use client"` at the page level.
- **`src/actions/` is the only place that calls the backend API.** Every
  action file starts with `'use server'`. Server pages call these directly;
  client components call the *same* actions through a TanStack Query
  `queryFn`/`mutationFn` (Next.js Server Actions can be invoked directly
  from client code as an RPC call — no separate REST proxy needed).
- **Interactive UI is a small Client Component** (forms, tables with
  mutations, grading panels) under `src/components/features/`, hydrated
  with the server-fetched data as `initialData` for TanStack Query so there's
  no loading flash on first paint.
- **`src/lib/api-client.ts`** is the single low-level `fetch` wrapper used
  by every action — it attaches the bearer token from the session cookie,
  normalizes the backend's `{ success, message, data }` envelope, and
  auto-refreshes an expired access token once before failing.
- **Auth session** is an httpOnly cookie set by `actions/auth.actions.ts`
  (`setSession`) after a successful login — read server-side via
  `next/headers` in `src/lib/session.ts`. Route protection is two-layered:
  `src/proxy.ts` (Next 16's replacement for `middleware.ts`) blocks
  unauthenticated requests to any non-public path, and each dashboard
  section (`admin/layout.tsx`, `teacher/layout.tsx`, `student/layout.tsx`)
  re-checks the actual role server-side and redirects if it doesn't match.

## Folder Structure
```
src/
├── app/
│   ├── (auth)/login/               # server page + LoginForm client component
│   └── (dashboard)/
│       ├── admin/                  # users, classes, subjects, teacher-mapping, assignments, submissions
│       ├── teacher/                # assignments (list/new/detail/grade)
│       └── student/                # assignments (list/detail/submit), submissions
├── actions/                        # ALL backend calls (server actions)
├── components/
│   ├── ui/                         # Button, Field, Card, Badge, Table, Modal, Alert
│   └── features/                   # feature-level client components
├── hooks/                          # TanStack Query hooks per entity
├── lib/                            # api-client, session, auth (cached session lookup), query-provider, utils
├── types/                          # DTOs mirroring the backend models
└── proxy.ts                        # route protection (Next.js 16 middleware convention)
```

## Setup

```bash
cp .env.example .env.local   # point API_BASE_URL at your running backend
npm install
npm run dev                  # http://localhost:3000
```

Make sure the backend is running (see `../backend/README.md`) and seeded
with demo accounts before logging in.

### Build / Lint

```bash
npm run build   # production build (also runs the TypeScript check)
npm run lint     # type-check only
```

## Design system
A deliberate "study-hall ledger" palette (ink-blue + goldenrod accent) is
defined as CSS variables in `src/app/globals.css` via Tailwind v4's
`@theme` block, rather than relying on Tailwind's default color scale.

## Motion & feedback
- **`framer-motion`** powers micro-interactions: `Button` hover/tap spring
  animation, `Modal` enter/exit (`AnimatePresence`), `Alert` entrance, and
  page-to-page transitions via the reusable `PageTransition` component in
  `DashboardShell`.
- **`aos`** (Animate On Scroll) handles scroll-reveal. `AOSInit` (mounted
  once in the root layout) initializes it and calls `AOS.refreshHard()` on
  every route change, since AOS doesn't know about Next.js client-side
  navigation by itself. Add reveal effects anywhere with a plain
  `data-aos="fade-up"` attribute — no client component needed for that part.
- **`uivibe-pro-toaster`** gives global toast feedback, configured once via
  `ToastInit`. Every mutation in `hooks/` fires a `toast.success`/
  `toast.error` centrally, so individual components don't need to repeat
  that logic.

## Assumptions
- The frontend and backend are two separately-hosted apps (different
  origins/ports), so the backend's own refresh-token cookie is not relied
  on — the frontend receives the token in the JSON response and stores it
  in its own httpOnly cookie via a server action.
- A student's own submission for an assignment is derived client-side by
  filtering `GET /submissions/mine` rather than adding a new backend
  endpoint, since the existing data is already sufficient.
