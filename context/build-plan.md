# Build Plan — DealFlow MVP (8-Week Sprint)

> Designed for a solo developer or two-person team.
> Goal: Get a **paying product** in front of real users, fast.
> Reference: PRD Section 8.

---

## Phase 0 — Validation (Days 1–7) ✅ PRE-BUILD

> **DO THIS BEFORE WRITING ANY CODE.** Confirms real demand.

| Day | Task | Success Signal |
|---|---|---|
| 1–2 | Build Notion template: pipeline + invoice tracker + brand contacts. Publish on Gumroad at $9. | 50 purchases in 30 days with no paid promotion |
| 2–3 | Post in r/NewTubers: "How do you track brand deals? What's most painful?" (no promotion) | 50+ replies, majority mention spreadsheets |
| 3–5 | Build one-page waitlist site. Clear value prop: "Never miss a brand deal deadline again." | 300 email sign-ups before writing code |
| 5–7 | DM 10 Gumroad buyers. 30-min user interviews. WTP at $9/mo? | 6/10 say yes → proceed. Fewer → pivot. |

---

## Phase 1 — Core MVP Build (Weeks 2–5)

> Build **only** the three features that solve the three biggest pain points: pipeline, reminders, invoices.

### Week 2 — Foundation
**Goal:** Working auth + profile + empty dashboard

| Task | Details |
|---|---|
| Project setup | Next.js 14 + Supabase + Stripe initialised |
| Authentication | Magic link + Google OAuth via Supabase Auth |
| User profile page | Name, address, payment details (used for invoice "from" field) |
| Data model | `users`, `deals`, `brands` tables with RLS enabled |
| Middleware | Protect all `/dashboard/*` routes, redirect to `/login` |
| Basic layout | Sidebar nav, header, responsive shell |

**Deliverable:** Can sign up, sign in, see an empty dashboard.

---

### Week 3 — Deal Pipeline
**Goal:** Functional pipeline — users can add and track deals

| Task | Details |
|---|---|
| Pipeline board | Kanban with all 8 stages, draggable cards (use `@hello-pangea/dnd`) |
| Add deal form | All fields from PRD F1: brand, contact, platforms, deliverable, rate, dates, notes |
| Deal detail view | Full deal card with all fields, edit mode, file attach |
| Stage updates | Drag-to-move + one-click stage button from detail view |
| Basic brand input | Brand name + contact inline (full brand DB in Week 7) |

**Deliverable:** Add a deal, see it on the board, move it through stages.

---

### Week 4 — Reminders
**Goal:** Reminders firing correctly in staging

| Task | Details |
|---|---|
| Reminder scheduler | On deal save, create rows in `reminders` table for all date types |
| Vercel Cron job | `/api/cron/send-reminders` runs hourly, checks overdue reminders |
| Resend integration | Email templates for: content due, go-live, payment due, overdue |
| Email templates | React Email components for each reminder type |
| User preferences | Settings page: default reminder timing (7d/3d/1d), disable per-deal |
| In-app notifications | Bell icon in header, unread count, notification list |

**Reminder schedule:**
- Content due: 7 days before, 3 days before, 1 day before, day-of
- Go-live: 3 days before, 1 day before
- Payment due: 7 days before, day-of, 7 days after (overdue)
- Exclusivity end: 14 days before, 3 days before

**Deliverable:** Add a deal with tomorrow's due date → receive a reminder email.

---

### Week 5 — Invoices + Earnings
**Goal:** Invoice generated and downloadable. Earnings totals visible.

| Task | Details |
|---|---|
| Invoice generator | `@react-pdf/renderer` PDF component with all deal data pre-filled |
| Auto-increment | `INV-2026-001`, `INV-2026-002`... tracked in `users.invoice_counter` |
| Invoice actions | Download PDF, email from app (via Resend), mark as paid |
| Invoice history | List view with status: Draft / Sent / Paid / Overdue |
| Earnings dashboard | Total earned (month / quarter / YTD), outstanding, overdue |
| Revenue chart | Monthly bar chart, last 12 months (use Recharts or Chart.js) |

**Deliverable:** Complete a deal → click "Generate Invoice" → download a professional PDF.

---

## Phase 2 — Pre-Launch Polish (Weeks 6–7)

### Week 6 — Payments + Onboarding
**Goal:** Payments working end-to-end. App usable on iPhone browser.

| Task | Details |
|---|---|
| Stripe integration | Creator ($9/mo) + free tier limits enforced in middleware |
| Stripe webhooks | Handle `checkout.session.completed`, `subscription.deleted`, `payment_failed` |
| Onboarding flow | 3-step: (1) select platforms → (2) add first deal → (3) set deadline |
| Mobile responsive | CSS pass: every page must work on 390px viewport |
| Beta testing | 5 real users, 1-hour sessions each. Fix bugs. |

**Deliverable:** A creator can sign up, pay $9, add a deal, and use the app on their phone.

---

### Week 7 — Polish + Remaining MVP Features
**Goal:** All MVP features complete. Ready for launch.

| Task | Details |
|---|---|
| Email templates (F7) | Library of 8 pre-written templates, copy-to-clipboard |
| Rate history view (F6) | History of agreed rates per deal, per platform, with trend |
| CSV export | Export all deals to CSV for tax/accountant use |
| Brand contact DB (F4) | Full add/edit/search for brand contacts |
| PostHog events | Track: deal_added, stage_changed, invoice_generated, payment_received |
| Legal | Privacy policy + Terms of Service pages |
| GDPR | Data export endpoint + account deletion |
| Bug fixes | Fix all issues surfaced from beta users |

**Deliverable:** Every MVP feature in the PRD is working and tested.

---

## Phase 3 — Launch Week (Week 8)

| Day | Action |
|---|---|
| **Monday** | Email waitlist (300+): "DealFlow is live. You're first in." Include 14-day free trial link. Target: 50 sign-ups day one. |
| **Monday** | Post in r/NewTubers: authentic post with demo GIF. Not promotional — show the problem and solution. |
| **Tuesday** | Post in r/ContentCreators, r/Podcasting, r/InstagramMarketing. Same approach. |
| **Wednesday** | Launch on Product Hunt at 12:01 AM PST. Pre-warm network the week before for upvotes. |
| **Thursday** | Twitter/X thread: the problem, the data, the solution. One screenshot of pipeline board. |
| **Friday** | DM 50 people who posted about brand deal spreadsheet problems on Reddit in last 60 days. Include free trial code. |
| **All week** | Respond to every comment, reply, and email personally. Fix critical bugs within 24 hours. |

---

## Post-Launch Roadmap

| Period | Focus |
|---|---|
| Weeks 9–12 | Fix bugs only. Talk to every paying user. Understand free → paid friction. Hit 200 paying users. |
| Weeks 13–16 | V2: AI contract clause checker, rate benchmarks, media kit link (Pro tier at $19/mo). Begin React Native (Expo). |
| Month 5–6 | V3: Mobile app beta. Manager tier ($49/mo). Sponsorship performance report builder. Chrome extension (Gmail deal detection). |

---

## Scope Rules

### In scope for MVP (do not skip)
- Deal pipeline board (all 8 stages)
- Automated reminders (email + in-app)
- Invoice generator (PDF download + email)
- Brand contact database
- Earnings dashboard
- Rate history
- Email templates
- Stripe subscriptions
- Mobile-responsive UI

### Out of scope for MVP (do not build early)
- React Native / mobile app
- AI contract clause checker
- Rate benchmarks (anonymised data)
- Auto-generated media kit
- Manager tier (multi-creator)
- Chrome extension
- Bank/payment API integrations
- Any form of social login other than Google + magic link
