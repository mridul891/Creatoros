# Architecture — DealFlow

> Technical decisions, data model, and infrastructure for the DealFlow MVP.

---

## Technology Stack

| Layer | Choice | Rationale |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) + Tailwind CSS | SSR for SEO, fast DX, Vercel deployment, works on web + mobile browser |
| **Mobile (V2)** | React Native (Expo) | Share logic with web; Expo Go simplifies beta testing. iOS + Android from one codebase |
| **Backend / API** | Next.js API routes + Server Actions | Minimal infra overhead; edge-compatible; no separate backend service for MVP |
| **Database** | Supabase (PostgreSQL) | Row-level security built-in, real-time subscriptions, generous free tier, open source |
| **Auth** | Supabase Auth — Magic Link + Google OAuth | No-password login reduces friction for creator sign-up |
| **File Storage** | Supabase Storage | Contract + brief PDF uploads; same provider as DB for simplicity |
| **Invoice PDF** | `@react-pdf/renderer` or `pdf-lib` | Client-side PDF generation — zero server cost per invoice |
| **Email / Notifications** | Resend + React Email | Modern transactional email, excellent DX, generous free tier |
| **Payments** | Stripe | Standard, international currencies, webhooks for subscription events |
| **Hosting** | Vercel (frontend) + Supabase (backend) | Both have free tiers; scale predictably; zero-config deployment from GitHub |
| **Analytics** | PostHog (cloud) | Event tracking without GA4 complexity; self-hostable option available |
| **AI (V2 only)** | Anthropic claude-haiku-4-5 API | Cost-effective for contract clause checking; low latency for document scanning |

---

## Project Structure

```
dealflow/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages (login, signup, verify)
│   ├── (dashboard)/              # Protected app pages
│   │   ├── pipeline/             # Deal pipeline board
│   │   ├── deals/[id]/           # Deal detail view
│   │   ├── brands/               # Brand contact database
│   │   ├── invoices/             # Invoice history
│   │   ├── earnings/             # Earnings dashboard
│   │   └── settings/             # User profile + preferences
│   ├── actions/                  # Server Actions
│   ├── api/                      # API routes (webhooks only)
│   │   ├── webhooks/stripe/
│   │   └── webhooks/resend/
│   └── layout.tsx
├── components/
│   ├── ui/                       # Base design system components
│   ├── deals/                    # Deal-specific components
│   ├── invoices/                 # Invoice components
│   ├── brands/                   # Brand components
│   └── dashboard/                # Dashboard widgets
├── lib/
│   ├── supabase/                 # Supabase client + queries
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client (for Server Components)
│   │   └── queries/              # Per-table query functions
│   ├── stripe/                   # Stripe helpers
│   ├── resend/                   # Email sending helpers
│   └── pdf/                      # Invoice PDF generation
├── types/
│   ├── database.ts               # Generated from Supabase (supabase gen types)
│   └── app.ts                    # Application-level types
├── context/                      # Agent context files (this folder)
└── supabase/
    └── migrations/               # SQL migration files
```

---

## Database Schema

### Table: `users`
```sql
CREATE TABLE users (
  id          uuid PRIMARY KEY REFERENCES auth.users(id),
  email       text NOT NULL,
  full_name   text,
  address     text,                        -- for invoice "from" field
  payment_details jsonb,                   -- bank / PayPal / Wise details
  tax_rate    numeric(5,2) DEFAULT 0,      -- user's applicable tax rate
  invoice_prefix text DEFAULT 'INV',
  invoice_counter integer DEFAULT 0,
  billing_tier text DEFAULT 'free'        -- 'free' | 'creator' | 'pro' | 'manager'
  stripe_customer_id text,
  stripe_subscription_id text,
  notification_prefs jsonb,               -- reminder timing defaults
  created_at  timestamptz DEFAULT now()
);
```

### Table: `brands`
```sql
CREATE TABLE brands (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  category    text,                        -- Beauty, Tech, Food, Fitness, etc.
  contact_name text,
  contact_role text,
  contact_email text,
  contact_linkedin text,
  notes       text,
  star_rating  smallint CHECK (star_rating BETWEEN 1 AND 5),
  is_favourite boolean DEFAULT false,
  is_blacklisted boolean DEFAULT false,
  last_contacted_at timestamptz,
  created_at  timestamptz DEFAULT now()
);
```

### Table: `deals`
```sql
CREATE TABLE deals (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_id      uuid REFERENCES brands(id),
  brand_name    text NOT NULL,              -- denormalised for speed
  contact_name  text,
  contact_email text,
  platforms     text[],                     -- ['youtube', 'instagram', 'tiktok', ...]
  deliverable   text,                       -- "1 × 60-sec mid-roll + 2 × IG Stories"
  agreed_rate   numeric(10,2),
  currency      text DEFAULT 'USD',
  stage         text NOT NULL DEFAULT 'inbound', -- pipeline stage key
  content_due_date date,
  go_live_date  date,
  payment_due_date date,
  exclusivity_end_date date,
  tags          text[],
  internal_notes text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);
```

### Table: `invoices`
```sql
CREATE TABLE invoices (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  deal_id       uuid REFERENCES deals(id),
  invoice_number text NOT NULL,             -- INV-2026-001
  status        text DEFAULT 'draft',       -- draft | sent | paid | overdue
  amount        numeric(10,2) NOT NULL,
  tax_amount    numeric(10,2) DEFAULT 0,
  currency      text DEFAULT 'USD',
  line_items    jsonb NOT NULL,             -- [{description, amount}, ...]
  issued_date   date DEFAULT CURRENT_DATE,
  due_date      date,
  paid_date     date,
  pdf_path      text,                       -- Supabase Storage path
  created_at    timestamptz DEFAULT now()
);
```

### Table: `reminders`
```sql
CREATE TABLE reminders (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id       uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type    text NOT NULL,              -- 'content_due' | 'go_live' | 'payment_due' | 'overdue' | 'exclusivity_end'
  trigger_date  timestamptz NOT NULL,
  sent_at       timestamptz,
  is_dismissed  boolean DEFAULT false,
  created_at    timestamptz DEFAULT now()
);
```

### Table: `notes`
```sql
CREATE TABLE notes (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id   uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  user_id   uuid NOT NULL REFERENCES users(id),
  content   text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

### Table: `files`
```sql
CREATE TABLE files (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id     uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES users(id),
  file_name   text NOT NULL,
  file_type   text,                         -- 'contract' | 'brief' | 'other'
  storage_path text NOT NULL,               -- Supabase Storage path
  created_at  timestamptz DEFAULT now()
);
```

---

## Row-Level Security (RLS)

**All tables must have RLS enabled.** The core policy pattern:

```sql
-- Enable RLS
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Users can only see/modify their own rows
CREATE POLICY "users_own_deals" ON deals
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

Apply the same pattern to: `brands`, `invoices`, `reminders`, `notes`, `files`.

---

## Authentication Flow

1. User enters email → Supabase sends magic link
2. User clicks link → Supabase sets session cookie
3. Next.js middleware checks session on all `/dashboard/*` routes
4. If no session → redirect to `/login`

Google OAuth is the secondary option (one-click sign-in).

---

## Reminder Scheduling

Since we're not running a persistent server (Vercel = serverless):

**Option A (MVP):** Supabase `pg_cron` extension — schedule a SQL function to check `reminders` table every hour and trigger Resend emails via a Supabase Edge Function.

**Option B:** Vercel Cron Jobs (Next.js) — a `/api/cron/send-reminders` route on a 1-hour schedule. Reads overdue reminders, sends via Resend, marks as sent.

**Decision: Use Vercel Cron (Option B) for MVP** — simpler to debug, no Supabase Edge Function complexity.

---

## Stripe Integration

- **Subscription products:** Creator ($9/mo), Creator Pro ($19/mo), Manager ($49/mo)
- **Webhook events to handle:**
  - `checkout.session.completed` → activate subscription, update `users.billing_tier`
  - `customer.subscription.updated` → handle plan changes
  - `customer.subscription.deleted` → downgrade to free tier
  - `invoice.payment_failed` → email user

---

## Invoice PDF Generation

Using `@react-pdf/renderer`:
1. Create a React component (`components/invoices/InvoicePDF.tsx`) that renders the invoice layout
2. On "Generate Invoice" click → render to PDF buffer client-side
3. Upload buffer to Supabase Storage → save path in `invoices.pdf_path`
4. Return download URL

No server round-trip needed for PDF generation.

---

## Security Checklist

- [ ] RLS enabled and policies applied to all tables
- [ ] No sensitive data in URL params
- [ ] Stripe webhook signature verified on every webhook
- [ ] Supabase service role key never exposed to client
- [ ] PDF files in Supabase Storage have private bucket policies (signed URLs only)
- [ ] GDPR: data export + account deletion endpoint built from day one
