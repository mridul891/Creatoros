# Library Docs — DealFlow

> Reference for every third-party library used in DealFlow.
> Check here before installing any new dependency.

---

## Core Stack

### Next.js 14 (App Router)
- **Docs:** https://nextjs.org/docs
- **Version:** `next@14.x`
- **Key patterns for this project:**
  - Use App Router only — no Pages Router
  - Server Components by default, `"use client"` only when needed
  - `next/font` for font loading (no external font CDN)
  - `next/image` for all images — required for performance
  - Middleware at `middleware.ts` (root level) for auth protection

### Tailwind CSS
- **Docs:** https://tailwindcss.com/docs
- **Version:** `tailwindcss@3.x`
- **Config:** `tailwind.config.ts` — custom tokens defined there (see `context/ui-tokens.md`)
- **Important:** All custom colours, spacing, and fonts are in the config. Do not use Tailwind arbitrary values for things already in the design system.

---

## Database & Auth

### Supabase
- **Docs:** https://supabase.com/docs
- **Version:** `@supabase/supabase-js@2.x` + `@supabase/ssr@latest`
- **Client setup:**
  ```typescript
  // lib/supabase/client.ts — browser client (for "use client" components)
  import { createBrowserClient } from '@supabase/ssr'
  export const createClient = () =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

  // lib/supabase/server.ts — server client (for Server Components + Actions)
  import { createServerClient as createSSRClient, type CookieOptions } from '@supabase/ssr'
  import { cookies } from 'next/headers'
  export const createServerClient = () => {
    const cookieStore = cookies()
    return createSSRClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { /* cookie handlers */ } }
    )
  }
  ```
- **Type generation:** `npx supabase gen types typescript --local > types/database.ts`
- **RLS:** Must be enabled on all tables. See `context/architecture.md`.

---

## Payments

### Stripe
- **Docs:** https://stripe.com/docs
- **Version:** `stripe@14.x` (server) + `@stripe/stripe-js@3.x` (client)
- **Products to create in Stripe Dashboard:**
  - Creator: $9/mo + $79/yr
  - Creator Pro: $19/mo + $149/yr
  - Manager: $49/mo
- **Webhook events to handle:** `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- **Webhook signature verification:**
  ```typescript
  const event = stripe.webhooks.constructEvent(
    body, signature, process.env.STRIPE_WEBHOOK_SECRET!
  )
  ```
- **Test mode:** Always develop against Stripe test mode. Card `4242 4242 4242 4242` for successful payments.

---

## Email

### Resend
- **Docs:** https://resend.com/docs
- **Version:** `resend@3.x`
- **Usage:**
  ```typescript
  import { Resend } from 'resend'
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'DealFlow <reminders@dealflow.app>',
    to: user.email,
    subject: 'Content due in 3 days — Nike x Jordan',
    react: <ReminderEmail deal={deal} />
  })
  ```
- **Domain:** Verify sending domain in Resend before launch
- **Free tier:** 3,000 emails/month — sufficient for MVP

### React Email
- **Docs:** https://react.email/docs
- **Version:** `@react-email/components@0.x`
- **Preview:** `npx react-email dev` — starts email preview server at localhost:3000
- **Templates live in:** `lib/resend/templates/`

---

## Drag & Drop (Pipeline Board)

### @hello-pangea/dnd
- **Docs:** https://github.com/hello-pangea/dnd
- **Version:** `@hello-pangea/dnd@16.x`
- **Why:** Maintained fork of `react-beautiful-dnd`. Required for the Kanban board.
- **Important:** This is a client-side library — the Kanban board component must be `"use client"`.
- **Pattern for stage columns:**
  ```tsx
  <DragDropContext onDragEnd={handleDragEnd}>
    {stages.map(stage => (
      <Droppable droppableId={stage.id} key={stage.id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {deals.filter(d => d.stage === stage.id).map((deal, index) => (
              <Draggable key={deal.id} draggableId={deal.id} index={index}>
                {(provided) => <DealCard deal={deal} provided={provided} />}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    ))}
  </DragDropContext>
  ```

---

## PDF Generation

### @react-pdf/renderer
- **Docs:** https://react-pdf.org
- **Version:** `@react-pdf/renderer@3.x`
- **Important:** Client-side only (browser PDF rendering). Use `dynamic(() => import(...), { ssr: false })` for any component that imports this.
- **Pattern:**
  ```tsx
  import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

  const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica' },
    // ...
  })

  export function InvoicePDF({ invoice }: { invoice: Invoice }) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Invoice content */}
        </Page>
      </Document>
    )
  }
  ```
- **Fonts:** Load custom fonts with `Font.register()` before use.

---

## Analytics

### PostHog
- **Docs:** https://posthog.com/docs/libraries/next-js
- **Version:** `posthog-js@1.x` + `posthog-node@4.x`
- **Key events to track:**
  ```typescript
  posthog.capture('deal_added', { stage: 'inbound', platform: 'youtube' })
  posthog.capture('invoice_generated', { amount: deal.agreed_rate })
  posthog.capture('stage_changed', { from: 'negotiating', to: 'contract_signed' })
  posthog.capture('subscription_started', { tier: 'creator' })
  ```
- **Provider:** Wrap root layout in `<PHProvider>` (client component)
- **Server-side:** Use `posthog-node` for server-side events (webhooks, cron jobs)

---

## UI Components

### Radix UI (Headless Primitives)
- **Docs:** https://www.radix-ui.com/primitives
- **Packages used:** `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-select`, `@radix-ui/react-tooltip`, `@radix-ui/react-popover`
- **Pattern:** Radix provides the behaviour; Tailwind provides the styles. Never override Radix behaviour with CSS hacks.

### Sonner (Toasts)
- **Docs:** https://sonner.emilkowal.ski
- **Version:** `sonner@1.x`
- **Setup:** `<Toaster />` in root layout. Use `toast.success()`, `toast.error()`, `toast.loading()`.

### Lucide React (Icons)
- **Docs:** https://lucide.dev
- **Version:** `lucide-react@0.x`
- **Usage:** `import { Plus, ChevronRight, Bell } from 'lucide-react'`
- **Size standard:** Default `size={16}` for inline icons, `size={20}` for standalone icons.

### Recharts (Charts)
- **Docs:** https://recharts.org
- **Version:** `recharts@2.x`
- **Used for:** Earnings bar chart (monthly revenue), rate history trend line
- **Client-side only:** Must be in a `"use client"` component or wrapped in `dynamic`

---

## Date Handling

### date-fns
- **Docs:** https://date-fns.org
- **Version:** `date-fns@3.x`
- **Functions used:** `format`, `formatDistanceToNow`, `addDays`, `isBefore`, `isAfter`, `parseISO`
- **All dates stored as ISO strings** in Supabase. Parse with `parseISO()` before using.
- **No moment.js.** No dayjs. date-fns only.

---

## Form Handling

### React Hook Form + Zod
- **Docs:** https://react-hook-form.com + https://zod.dev
- **Versions:** `react-hook-form@7.x` + `zod@3.x` + `@hookform/resolvers@3.x`
- **Pattern:**
  ```typescript
  const dealSchema = z.object({
    brandName: z.string().min(1, 'Brand name is required'),
    agreedRate: z.number().positive('Rate must be positive'),
    contentDueDate: z.string().optional(),
    // ...
  })

  type DealFormData = z.infer<typeof dealSchema>

  const { register, handleSubmit, formState: { errors } } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema)
  })
  ```
- **Schemas live in:** `lib/schemas/` — shared between client and server validation.

---

## Do Not Install (Rejected Libraries)

| Library | Why not |
|---|---|
| `axios` | Native fetch is sufficient; adds bundle weight |
| `moment` | Huge bundle; use `date-fns` |
| `react-query` / `@tanstack/react-query` | Overkill for MVP with Server Components; revisit for V2 |
| `redux` / `zustand` | No global state needed; Server Components + URL state |
| `mongoose` | We use Supabase/PostgreSQL, not MongoDB |
| `styled-components` / `emotion` | Tailwind only |
| `react-beautiful-dnd` | Unmaintained; use `@hello-pangea/dnd` instead |
