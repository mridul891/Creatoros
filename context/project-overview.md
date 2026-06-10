# Project Overview — DealFlow

> Distilled from DealFlow PRD v1.0 · June 2026

---

## What Is DealFlow?

DealFlow is a **web-first, mobile-responsive CRM built exclusively for solo content creators** who manage brand sponsorships. It replaces the spreadsheets, Notion templates, and scattered email threads that creators currently use to track their most important income source.

**One-line pitch:** Every brand deal, tracked from first email to final payment, in one place.

---

## The Market Opportunity

| Metric | Figure |
|---|---|
| Creator economy size (2025) | $252 billion |
| Influencer marketing spend (2025) | $32.5 billion (+35.6% YoY) |
| Semi-professional creators worldwide | 50 million |
| Creators not tracking earnings by platform | 68% |
| Micro-creator avg annual brand income | $38,500 |
| Dedicated CRM tools priced for solo creators | **0 — confirmed gap** |

Brand partnerships account for ~70% of creator income. Every existing tool is built for *brands discovering creators*, not for *creators managing their own deals*.

---

## Core Problem

Solo creators manage 5–15 active brand deals using:
- Google Sheets updated irregularly
- Gmail threads mixed with personal email
- WhatsApp DMs with brand contacts
- Notes apps and mental tracking

**Result:** Missed deadlines, lost payments, chronic undercharging, hours of avoidable admin.

### Validated Pain Points (from Reddit)

| # | Pain Point | Evidence |
|---|---|---|
| 1 | No pipeline visibility | r/NewTubers post, 6,800 upvotes |
| 2 | Missed content & payment deadlines | Universal — every community |
| 3 | No rate history → undercharging | r/Influencers post, 9,100 upvotes |
| 4 | Manual invoice creation (20–45 min each) | Reported across all creator subreddits |
| 5 | Lost brand contacts when PR reps leave | r/ContentCreators |
| 6 | No view of outstanding payments | r/YouTubeCreators, 4,200 upvotes |

---

## Primary User — The Micro Creator

**Persona: Jordan, 26 — Lifestyle/tech YouTuber**
- Platforms: YouTube (42K), Instagram (18K), TikTok (31K)
- Active deals: 4–8 at any time, 2–3 new inbounds/week
- Current system: Google Sheet with 4 columns, updated inconsistently
- Biggest pain: "I missed an invoice follow-up and I'm still waiting on $1,200 that's 45 days overdue."
- WTP: $9–19/month without hesitation if it prevents one missed deadline

**User Segments (Priority Order):**
1. ⭐ **Primary:** Micro creators (10K–100K) — $500–$5,000/deal
2. ⭐ **Primary:** Mid-tier creators (100K–500K) — $5K–$25K/deal
3. Secondary: Nano creators, UGC creators

---

## Feature Set

### MVP (Launch — Week 8)
| Feature | Priority | Description |
|---|---|---|
| F1 — Deal Pipeline Board | P0 | 8-stage Kanban board, draggable cards |
| F2 — Automated Deadline Reminders | P0 | Email + push for content, go-live, payment, overdue dates |
| F3 — One-Click Invoice Generator | P0 | PDF from deal data, auto-incremented numbers |
| F4 — Brand Contact Database | P1 | Searchable directory, collaboration history |
| F5 — Earnings Dashboard | P1 | Monthly/quarterly/YTD totals, outstanding, overdue |
| F6 — Rate History | P1 | Per-platform rate history with trend line |
| F7 — Email Templates | P2 | 8 pre-written templates for creator-brand comms |

### V2 / Pro Tier (Weeks 13–16)
- F8 — AI Contract Clause Checker (Anthropic claude-haiku-4-5)
- F9 — Auto-Generated Media Kit Link
- Rate benchmarks (anonymised community data)
- React Native mobile app (Expo)

### V3 (Month 5–6)
- Manager tier (up to 10 creator profiles)
- Sponsorship performance report builder
- Chrome extension for Gmail deal detection

---

## Pipeline Stages (F1)

| # | Stage | Meaning |
|---|---|---|
| 01 | Inbound | Brand reached out, not yet responded |
| 02 | Negotiating | Rate, deliverables, timeline in discussion |
| 03 | Contract Signed | Terms finalised, content not started |
| 04 | Content in Progress | Creating deliverable(s) |
| 05 | Awaiting Approval | Draft submitted to brand |
| 06 | Live | Content published, exclusivity window active |
| 07 | Invoice Sent | Invoice sent, payment tracked |
| 08 | Paid & Complete | Payment received, archived |

---

## Revenue Model

| Tier | Price | Key Limits |
|---|---|---|
| Free | $0 | 3 active deals, 5 brand contacts |
| Creator | $9/mo · $79/yr | Unlimited deals + all MVP features |
| Creator Pro | $19/mo · $149/yr | Creator + AI contract checker + benchmarks + media kit |
| Manager | $49/mo | Up to 10 creator profiles |

**Path to $10K MRR:** ~770 paying users at avg $13/mo (achievable in 9–12 months).

---

## Success Metrics (6 Months Post-Launch)

| Metric | Target |
|---|---|
| Paying subscribers (Month 3) | 200 |
| Paying subscribers (Month 6) | 600 |
| Monthly churn | < 5% |
| Day-7 retention | > 60% |
| Deals logged / active user / month | > 5 |
| Invoices generated / active user / month | > 3 |
| NPS | > 50 |

---

## Competitors (Why They Lose)

| Tool | Price | Why It Fails Creators |
|---|---|---|
| GRIN | $2,500–10,000/mo | Built for brands — creators are the product |
| Aspire | $2,300+/mo | Brand marketplace, wrong direction |
| Later | $28,500/yr | Social scheduling, not creator admin |
| DealKit | Free | iOS only, no web, no invoices, no reminders |
| Notion templates | $0–25 one-time | Static, no automation, proves demand |
| Google Sheets | Free | **The real competitor.** No reminders, no mobile UX, no invoices |

**Our edge:** Web-first, full pipeline + invoices + reminders in one product, priced for creators ($9/mo).
