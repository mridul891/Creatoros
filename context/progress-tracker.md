# Progress Tracker — DealFlow

> Update this file at the end of every session.
> This is the source of truth for what's done, what's in progress, and what's next.

**Last updated:** [UPDATE THIS EACH SESSION]
**Current phase:** Phase 0 — Pre-build validation
**Current week:** Pre-Week 1

---

## Phase Status

| Phase | Status | Notes |
|---|---|---|
| Phase 0 — Validation | ⬜ Not started | Must complete before writing code |
| Phase 1 — Core MVP Build | ⬜ Not started | Weeks 2–5 |
| Phase 2 — Pre-Launch Polish | ⬜ Not started | Weeks 6–7 |
| Phase 3 — Launch | ⬜ Not started | Week 8 |

---

## Feature Checklist

### F1 — Deal Pipeline Board (P0)
- [ ] Pipeline board layout (8 columns / stages)
- [ ] Deal card component (all fields rendered)
- [ ] Add deal form (all required fields)
- [ ] Deal detail view (edit mode)
- [ ] Drag-and-drop between stages (`@hello-pangea/dnd`)
- [ ] One-click stage update button (from detail view)
- [ ] File attachment (brief PDF, contract PDF)
- [ ] Inline notes (timestamped)
- [ ] Platform multi-select (YouTube / Instagram / TikTok / etc.)
- [ ] Tags / labels

**Smoke test:**
- [ ] Can add a deal with all fields filled
- [ ] Deal appears in correct stage on board
- [ ] Can drag deal to next stage
- [ ] Detail view shows all fields correctly
- [ ] Notes append correctly with timestamps

---

### F2 — Automated Deadline Reminders (P0)
- [ ] Reminder rows created on deal save
- [ ] Vercel Cron job (`/api/cron/send-reminders`) — hourly
- [ ] Content due: 7d, 3d, 1d, day-of reminders
- [ ] Go-live: 3d, 1d reminders
- [ ] Payment due: 7d, day-of, +7d overdue reminders
- [ ] Exclusivity end: 14d, 3d reminders
- [ ] React Email templates for each reminder type
- [ ] In-app notification bell (unread count)
- [ ] In-app notification list
- [ ] User settings: global reminder timing defaults
- [ ] Per-deal reminder override (disable individual reminders)

**Smoke test:**
- [ ] Add deal with content due date = tomorrow
- [ ] Cron fires and sends email within 1 hour
- [ ] Email renders correctly in Gmail and Apple Mail
- [ ] Notification appears in-app

---

### F3 — One-Click Invoice Generator (P0)
- [ ] Invoice PDF component (`InvoicePDF.tsx`)
- [ ] Auto-populate from deal data (all fields)
- [ ] Auto-increment invoice number (INV-2026-001...)
- [ ] Tax line (optional, from user profile)
- [ ] Additional line items (usage rights, expenses)
- [ ] Download PDF action
- [ ] Email invoice from app (via Resend)
- [ ] Mark invoice as paid
- [ ] Invoice history view (all invoices)
- [ ] Invoice status: Draft / Sent / Paid / Overdue
- [ ] Overdue invoice detection (past due date + unpaid)

**Smoke test:**
- [ ] Move deal to "Live" stage → "Generate Invoice" button appears
- [ ] Click → PDF opens with all data pre-filled
- [ ] Invoice number increments correctly on second invoice
- [ ] Download works on desktop and mobile
- [ ] Email sends successfully via Resend

---

### F4 — Brand Contact Database (P1)
- [ ] Brand list view (searchable, filterable)
- [ ] Add/edit brand form (all fields)
- [ ] Star rating (1–5)
- [ ] Favourite / blacklist flags
- [ ] Collaboration history (linked deal cards)
- [ ] Total lifetime value (auto-calculated)
- [ ] Last contacted date (auto-tracked from deal activity)
- [ ] Industry / category filter

**Smoke test:**
- [ ] Add a brand, link it to a deal
- [ ] Brand shows in search
- [ ] Lifetime value updates when deal is marked paid

---

### F5 — Earnings Dashboard (P1)
- [ ] Total earned (month / quarter / YTD)
- [ ] Total outstanding (invoices sent, unpaid)
- [ ] Total overdue (past due date, unpaid)
- [ ] Pipeline value (sum of active deals)
- [ ] Monthly revenue bar chart (last 12 months)
- [ ] Average deal value (this year vs. last year)
- [ ] Top brands by total paid
- [ ] Income by platform breakdown
- [ ] CSV export

**Smoke test:**
- [ ] Add 3 paid deals → totals update correctly
- [ ] Mark one invoice overdue → overdue total reflects it
- [ ] CSV export downloads and opens in Excel

---

### F6 — Rate History (P1)
- [ ] Rate history list (per deal, sorted by date)
- [ ] Filter by platform, niche, deliverable type
- [ ] Rate trend line chart (are rates increasing?)
- [ ] Flag when new inbound is below 6-month average

**Smoke test:**
- [ ] Add 5 deals with different rates and platforms
- [ ] Filter to YouTube only → shows only YouTube rates
- [ ] Trend chart renders correctly

---

### F7 — Email Templates (P2)
- [ ] Cold outreach pitch template
- [ ] Rate counter-offer template
- [ ] Contract received confirmation template
- [ ] Content submission for approval template
- [ ] Invoice follow-up (polite) template
- [ ] Invoice follow-up (firm) template
- [ ] Deal declined (gracefully) template
- [ ] Post-campaign wrap-up template
- [ ] Copy-to-clipboard for all templates
- [ ] Variable substitution (insert brand name, rate, etc.)

**Smoke test:**
- [ ] All 8 templates visible and copyable
- [ ] Variables populate correctly from deal data

---

## Infrastructure Checklist

### Auth
- [ ] Supabase project created
- [ ] Magic link auth configured
- [ ] Google OAuth configured (app registered in Google Cloud Console)
- [ ] Auth middleware protecting `/dashboard/*`
- [ ] Redirect to `/login` when unauthenticated

### Database
- [ ] All 6 tables created with correct schema
- [ ] RLS enabled on all tables
- [ ] RLS policies applied (users can only see own data)
- [ ] TypeScript types generated (`types/database.ts`)
- [ ] Indexes on `user_id`, `deal_id`, `brand_id` columns

### Stripe
- [ ] Stripe account created
- [ ] 3 products + prices created (Creator, Creator Pro, Manager)
- [ ] Webhook endpoint registered in Stripe Dashboard
- [ ] All 4 webhook events handled in code
- [ ] Free tier limits enforced (3 deals, 5 brands)
- [ ] Billing portal link in Settings

### Email / Reminders
- [ ] Resend account created
- [ ] Sending domain verified
- [ ] `from` address configured
- [ ] Vercel Cron job configured in `vercel.json`
- [ ] Cron job tested in production (not just local)

### Analytics
- [ ] PostHog project created
- [ ] `<PHProvider>` in root layout
- [ ] All key events tracked (see `library-docs.md`)
- [ ] Funnel configured: sign-up → first deal → first invoice → paid

### Hosting
- [ ] Vercel project connected to GitHub repo
- [ ] All environment variables set in Vercel dashboard
- [ ] Custom domain configured
- [ ] Preview deployments working

---

## Open Questions & Decisions

> Add new items here as they arise. Never delete resolved items — mark them as resolved.

| # | Question | Status | Decision |
|---|---|---|---|
| 1 | Reminder cron: Vercel Cron or Supabase pg_cron? | ✅ Resolved | **Vercel Cron** — simpler to debug for MVP |
| 2 | PDF generation: client-side or server-side? | ✅ Resolved | **Client-side** (`@react-pdf/renderer`) — zero server cost |
| 3 | Which drag-and-drop library? | ✅ Resolved | **`@hello-pangea/dnd`** — maintained fork of react-beautiful-dnd |
| 4 | Multi-currency support for MVP? | ⬜ Open | — |
| 5 | Free trial duration (time-limited vs feature-limited)? | ⬜ Open | PRD suggests 30-day time limit |
| 6 | Invoice email: send via Resend or open mailto: link? | ⬜ Open | — |

---

## Known Bugs

> Add bugs here as they're discovered. Remove when fixed.

| # | Bug | Severity | Status |
|---|---|---|---|
| — | No bugs logged yet | — | — |

---

## Session Log

> Brief notes from each work session for continuity.

| Date | What was done | What's next |
|---|---|---|
| — | Project initialised. Context files created. | Start Phase 0 validation tasks. |
