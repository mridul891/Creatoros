# CLAUDE.md — DealFlow Agent Instructions

> This file is read automatically by Claude Code at the start of every session.
> It defines how the agent should behave, what the project is, and where to find context.

---

## Project Identity

**Product:** DealFlow — Brand Deal CRM for Solo Creators
**Stack:** Next.js 14 + Tailwind CSS · Supabase (PostgreSQL + Auth + Storage) · Stripe · Resend
**Stage:** MVP — 8-week sprint to first paying users
**Goal:** Ship a working, paid product. Not a demo. Not a prototype.

---

## Context Files — Read These First

Before writing any code, read the relevant context files in `/context/`:

| File | When to read |
|---|---|
| `context/project-overview.md` | Always — start here |
| `context/architecture.md` | Before touching DB schema, API routes, or infra |
| `context/build-plan.md` | Before starting any new week of work |
| `context/progress-tracker.md` | Before starting any session — check what's done |
| `context/code-standards.md` | Before writing any code |
| `context/library-docs.md` | Before using any third-party library |
| `context/ui-tokens.md` | Before writing any CSS or Tailwind classes |
| `context/ui-rules.md` | Before building any UI component |
| `context/ui-registry.md` | Before creating or modifying any component |

---

## How to Work

### Always do this at session start
1. Read `context/progress-tracker.md` to understand current state
2. Read `context/build-plan.md` to understand what phase we're in
3. Ask the user which task to tackle if it's not clear

### Before writing code
- Check `context/code-standards.md` for conventions
- Check `context/ui-registry.md` before creating a new component (it may exist)
- Use TypeScript everywhere — no `any` types
- Write self-documenting code; avoid inline comments unless explaining *why*, not *what*

### File structure rules
- All new pages go in `app/` (Next.js App Router)
- All reusable components go in `components/`
- All Supabase queries go in `lib/supabase/`
- All Stripe logic goes in `lib/stripe/`
- Server actions go in `app/actions/`
- Types go in `types/` — keep them co-located when feature-specific

### After completing a task
- Update `context/progress-tracker.md` with what was completed
- Note any new decisions made (schema changes, library choices, etc.)
- Flag any blockers or open questions

---

## Core Principles

1. **Ship fast, ship small.** Every task should produce something that works end-to-end.
2. **Don't gold-plate MVP.** If a feature isn't in `build-plan.md` Phase 1, don't build it yet.
3. **Real emails, real payments.** Test with Stripe test mode and real email addresses.
4. **Mobile first.** Every UI must work on a 390px iPhone screen before desktop.
5. **No breaking changes without warning.** If a DB migration is needed, say so explicitly.

---

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=
POSTHOG_KEY=
```

---

## What NOT to Do

- Do not install new dependencies without checking `context/library-docs.md` first
- Do not modify Supabase RLS policies without explicitly confirming with the user
- Do not add V2/V3 features (AI contract checker, media kit, React Native) during MVP phase
- Do not use `localStorage` for any user data — Supabase only
- Do not skip TypeScript types to save time
