# DealFlow Architecture

Feature-oriented layout for a Next.js App Router product. Read this before adding a file.

## Dependency direction

```text
app/ (routes, composition)
  → features/ (domain UI, actions, services)
    → lib/ (auth, Prisma, InsForge, formatting)
  → components/ui | shared | layout
```

- `app/` may import `features/`, `components/`, and `lib/`.
- `features/` may import `components/ui`, `components/shared`, `components/layout`, `lib/`, `types/`, and `enums/`.
- A feature may import another feature’s **public** API (`features/<domain>/index.ts`), actions, types, and section components. Do not import another feature’s private internals (`services/`, `hooks/`, etc.).
- `components/ui/` must not import features.
- `lib/` must not import UI or features.
- Avoid circular dependencies.

## Top-level directories

| Path | Role |
| --- | --- |
| `app/` | Routing and composition only. Route groups do not change URLs. |
| `features/` | Business domains: UI, server actions, services, schemas, hooks, types. |
| `components/ui/` | shadcn/Radix primitives (Button, Dialog, Table, …). |
| `components/shared/` | App-wide composites (CRM shell, LoginForm, ThemeProvider). |
| `components/layout/` | Dashboard shell (Sidebar). |
| `components/marketing/` | Marketing sections and page shells. |
| `lib/` | Infrastructure: auth, Prisma, InsForge, formatting, generic utils. |
| `hooks/` | Generic UI hooks only (`use-media-query`, TipTap window/rect helpers, …). |
| `types/` | Genuinely shared contracts (`types/user.ts`). |
| `enums/` | Shared enums (`activity`, `post`, `dashboard-route`). |
| `prisma/` | Schema and **authoritative** migrations (`prisma/migrations/`). |
| `styles/` | TipTap SCSS tokens. |
| `docs/` | Agent plans/specs, not product docs. |

## App routes

```text
app/
  (marketing)/     → /, /features, /product, /pricing, /waitlist, legal
  (auth)/          → /login, /onboarding
  (dashboard)/dashboard/  → /dashboard, /dashboard/deals, …
  actions/         → app-wide server actions (waitlist, mail)
  api/auth/
  layout.tsx, globals.css, sitemap.ts, robots.ts
```

`proxy.ts` gates `/dashboard` by URL pathname. Do not change public URLs when moving files.

Keep metadata, layouts, loading/error files, `requireOnboardedUser()`, and `"use server"` in place. Pages should stay thin when they only compose a feature.

## Features

Each domain owns what it needs. Do not create empty folders.

```text
features/<domain>/
  components/
  actions/          # "use server" — stay server-only
  services/         # Prisma/data access
  schemas/          # Zod validation
  hooks/
  types/
  utils/
  enums/
```

Current domains: `activity`, `analytics`, `brands`, `calendar`, `contacts`, `deals`, `deliverables`, `files`, `invoices`, `media-kit`, `notes`, `onboarding`, `scripts` (includes TipTap under `editor/`), `sponsorship`, `tasks`, `templates`.

Public barrels (only where cross-feature imports exist):

- `@/features/activity` — `recordActivity` (server-only; do not import this barrel from Client Components)
- `@/features/brands` — `assertOwnedBrand`, `findOwnedBrand`
- `@/features/templates` — `applyCampaignTemplateInTransaction`

Activity UI (timeline sections, list types) is imported from `features/activity/components/` and `features/activity/types/`. Keep those separate from `recordActivity` so Prisma never ships to the browser.

`recordActivity` is the write path used by other mutating services. Import it from `@/features/activity`, not from `services/`.

`/dashboard` overview and `/dashboard/pipeline` currently use mock sponsorship data. `features/analytics/services/commandCenterService.ts` is a real Prisma command-center backend, not yet wired to a page.

Onboarding reads/writes creator profiles through `features/onboarding/services/` and `features/onboarding/actions/`. Do not query Prisma from `app/` routes.

Real CRM deals (`features/deals`) and the mock content pipeline (`features/sponsorship`) are separate. Do not merge them.

## Where to put new code

| You are adding… | Put it in… |
| --- | --- |
| A route | `app/(…)/` matching the public URL |
| Domain UI (DealCard, BrandForm, MediaKitForm) | `features/<domain>/components/` |
| A server action for one domain | `features/<domain>/actions/` with `"use server"` |
| An app-wide action (waitlist, mail) | `app/actions/` |
| Prisma CRUD / business data access | `features/<domain>/services/` calling `@/lib/db/prisma` |
| Zod schemas | `features/<domain>/schemas/` |
| Feature-only types or enums | `features/<domain>/types/` or `enums/` |
| Types used by unrelated features | `types/` or `enums/` |
| Display date/currency helpers | `lib/formatting/` |
| Form-input date / pagination / field errors | `lib/formatting/date-input.ts`, `lib/utils/` |
| `cn()` | `lib/utils.ts` (shadcn contract — do not move) |
| A primitive control | `components/ui/` |
| CRM list/dialog chrome | `components/shared/crm/` |
| Dashboard nav/shell | `components/layout/` |
| Marketing section | `components/marketing/` |
| TipTap editor pieces | `features/scripts/editor/` |

## Database

- Client: `lib/db/prisma.ts`
- Schema: `prisma/schema.prisma`
- Migrations: **`prisma/migrations/` only** (`prisma.config.ts`). Run `pnpm prisma:migrate`.
- Do not add a second migration tree. InsForge CLI is not wired to a root `migrations/` folder.

## Auth

- Session / OAuth: `lib/insforge/` (`@insforge/sdk`)
- Current user + onboarding gate: `lib/auth/` (`requireUser`, `requireOnboardedUser`)
- Dashboard gate: `proxy.ts` (`/dashboard` → `/login` if no access token)
- Do not change env var names or auth behavior without approval.

## Shared UI rules

- Prefer `components/ui/` before creating a new control.
- CRM pages compose `components/shared/crm/` (`CrmPageHeaderClient`, `CrmFormDialog`, `CrmEmptyState`, …).
- Business widgets do not belong in `components/ui/`.
