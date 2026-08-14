# DealFlow Folder Structure

DealFlow is a brand-deal CRM for solo creators. The app is a **Next.js App Router** project (React + TypeScript + Tailwind) with **Prisma** against Postgres and **InsForge** for auth, storage, and backend services.

Placement rules and dependency direction live in [`architecture.md`](architecture.md). This file is a map of the tree.

Generated and secret paths are omitted: `node_modules/`, `.git/`, `.next/`, `.pnpm-store/`, `.insforge/` internals, and `.env`.

---

## Quick tree

```text
dealFlow/
├── app/                 # Routes, layouts, app-wide actions, API
├── features/            # Business domains
├── components/          # ui, shared, layout, marketing
├── lib/                 # Auth, Prisma, InsForge, formatting
├── types/               # Shared TypeScript contracts
├── enums/               # Shared domain enums
├── hooks/               # Generic UI hooks
├── prisma/              # Schema and authoritative migrations
├── public/              # Static images, logos, SVGs
├── styles/              # TipTap SCSS tokens
├── docs/                # Agent specs and implementation plans
├── architecture.md      # How to place new code
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── components.md
├── design.md
├── biome.json
├── components.json
├── docker-compose.yml
├── insforge.toml
├── next.config.ts
├── package.json
├── prisma.config.ts
├── proxy.ts
└── tsconfig.json
```

---

## `app/`

```text
app/
├── (marketing)/               # /, /features, /product, /pricing, /waitlist, legal
├── (auth)/                    # /login, /onboarding
├── (dashboard)/dashboard/     # /dashboard and all /dashboard/*
├── actions/                   # waitlist, mail, users
├── api/auth/
├── layout.tsx
├── globals.css
├── sitemap.ts
└── robots.ts
```

Route groups do not appear in URLs. `proxy.ts` still gates `/dashboard`.

---

## `features/`

Each domain owns components, actions, services, schemas, hooks, and types as needed.

| Feature | Role |
| --- | --- |
| `brands`, `contacts`, `deals`, `tasks`, `deliverables`, `files`, `notes`, `activity` | CRM |
| `invoices`, `templates` | Invoicing and campaign templates |
| `media-kit` | Media kit editor / preview |
| `scripts` | Script list + TipTap editor (`editor/`) |
| `analytics` | Dashboard overview + analytics |
| `sponsorship` | Content pipeline (mock) |
| `calendar` | Content calendar |
| `onboarding` | Creator onboarding |

---

## `components/`

| Path | Role |
| --- | --- |
| `ui/` | shadcn / Radix primitives |
| `shared/` | LoginForm, ThemeProvider, CRM chrome, motion |
| `layout/` | Dashboard Sidebar |
| `marketing/` | Landing sections and marketing pages |

---

## `lib/`

| Path | Role |
| --- | --- |
| `auth/` | Current user, require-user, sync |
| `db/prisma.ts` | Prisma client |
| `insforge/` | Browser/server SDK + auth actions |
| `formatting/` | Display dates and form date-input helpers |
| `infrastructure/` | Site URL, Clarity |
| `utils.ts` | `cn()` (shadcn contract) |
| `utils/` | Pagination, form sanitize, field errors |

---

## `types/` and `enums/`

Shared only: `types/user.ts`, `types/futureModules.ts`, `enums/activity.ts`, `enums/post.ts`, `enums/dashboard-route.ts`, `enums/dashboard-page.ts`.

Feature-specific types and enums live under `features/<domain>/`.

---

## `prisma/`

- `schema.prisma` — Postgres models
- `migrations/` — **authoritative** migration history (`prisma.config.ts`)

Use `pnpm prisma:migrate`. Do not add a second root `migrations/` tree.

---

## Root config

| File | Role |
| --- | --- |
| `architecture.md` | Placement and dependency rules |
| `CLAUDE.md` | Session contract |
| `AGENTS.md` | Next.js + InsForge agent rules |
| `README.md` | Product narrative and setup |
| `design.md` | Visual tokens |
| `components.md` | Reuse protocol |
| `proxy.ts` | Session refresh; gates `/dashboard` |
| `prisma.config.ts` | Prisma CLI → `prisma/migrations` |
