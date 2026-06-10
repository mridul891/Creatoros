# Code Standards — DealFlow

> These rules apply to all code written for DealFlow.
> Read this before writing any file.

---

## Language & Runtime

- **TypeScript everywhere.** No `.js` files in `app/`, `components/`, or `lib/`. Config files (e.g., `tailwind.config.ts`, `next.config.ts`) are TS.
- **No `any` types.** If you need an escape hatch, use `unknown` and narrow it. If you're typing a Supabase response, use the generated types from `types/database.ts`.
- **Strict mode on.** `tsconfig.json` has `"strict": true`. Do not weaken it.
- **Node 20+.** Use native fetch. No `axios` or `node-fetch`.

---

## Next.js Conventions

### App Router Rules
- All pages are **Server Components by default.** Only opt into `"use client"` when the component needs:
  - `useState` / `useEffect`
  - Browser-only APIs
  - Event listeners
  - Client-side libraries (drag-and-drop, PDF rendering)
- **Server Actions** for all form submissions and data mutations. No client-side `fetch()` to internal API routes.
- **Route handlers** (`app/api/`) only for external webhooks (Stripe, Resend).

### Data Fetching
```typescript
// ✅ Correct — Server Component fetching
export default async function PipelinePage() {
  const supabase = createServerClient()
  const { data: deals } = await supabase.from('deals').select('*')
  return <PipelineBoard deals={deals} />
}

// ❌ Wrong — Don't fetch in useEffect
useEffect(() => {
  fetch('/api/deals').then(...)
}, [])
```

### Loading & Error States
- Every page that fetches data must have a `loading.tsx` and `error.tsx` sibling.
- Use React Suspense boundaries for async Server Components.

---

## File Naming

| Type | Convention | Example |
|---|---|---|
| Pages | `page.tsx` | `app/pipeline/page.tsx` |
| Layouts | `layout.tsx` | `app/(dashboard)/layout.tsx` |
| Loading | `loading.tsx` | `app/pipeline/loading.tsx` |
| Error | `error.tsx` | `app/pipeline/error.tsx` |
| Components | PascalCase | `DealCard.tsx` |
| Hooks | camelCase + `use` prefix | `useDeals.ts` |
| Utilities | camelCase | `formatCurrency.ts` |
| Types | PascalCase | `Deal.ts` or in `types/app.ts` |
| Server Actions | camelCase in `actions/` | `actions/deals.ts` |

---

## Component Structure

```typescript
// components/deals/DealCard.tsx

import type { Deal } from '@/types/app'

interface DealCardProps {
  deal: Deal
  onStageChange?: (stage: string) => void
}

export function DealCard({ deal, onStageChange }: DealCardProps) {
  // 1. Hooks at the top
  // 2. Derived state / computed values
  // 3. Event handlers
  // 4. Return JSX
}
```

- **Named exports** for components. No default exports in `components/`.
- **Default exports** only for Next.js pages and layouts (required by the framework).
- **Props interfaces** always explicitly typed. No `React.FC` — just plain function with typed props.

---

## Supabase Query Conventions

All Supabase queries live in `lib/supabase/queries/`. Never write raw Supabase calls in components or pages.

```typescript
// lib/supabase/queries/deals.ts

import { createServerClient } from '@/lib/supabase/server'
import type { Deal } from '@/types/app'

export async function getDeals(userId: string): Promise<Deal[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('deals')
    .select('*, brands(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch deals: ${error.message}`)
  return data ?? []
}
```

- **Always handle errors** — throw with a descriptive message, don't silently return `null`.
- **Use `.select()` explicitly** — never `select('*')` in production; specify only the columns you need (exception: prototyping is fine, clean up before shipping).
- **RLS handles auth** — never pass `user_id` from the client. Let RLS filter by `auth.uid()`.

---

## Server Actions

```typescript
// app/actions/deals.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import type { DealFormData } from '@/types/app'

export async function createDeal(data: DealFormData) {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('deals').insert({
    ...data,
    user_id: user.id,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/pipeline')
}
```

- Always verify auth in Server Actions — do not trust client input for `user_id`.
- Call `revalidatePath()` after mutations to refresh Server Component data.
- Return `{ success: true }` or throw — don't return error objects (use try/catch at the call site).

---

## Tailwind Conventions

- **No arbitrary values** unless absolutely necessary. Use the design token values from `context/ui-tokens.md`.
- **Responsive prefix order:** `base → sm → md → lg → xl`
- **No inline styles.** Everything in Tailwind classes.
- **Class organisation:** layout → spacing → typography → color → border → shadow → interactivity

```tsx
// ✅ Correct class order
<div className="flex flex-col gap-4 p-6 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">

// ❌ Don't mix concerns randomly
<div className="text-sm border bg-white hover:shadow-md flex p-6 shadow-sm gap-4 ...">
```

---

## Error Handling

- **User-facing errors:** Show a toast notification (use `sonner`) with a human-readable message.
- **Developer errors:** Log with `console.error()` in development; use PostHog error capture in production.
- **Network errors:** Always handle — assume the network can fail.
- **No swallowed errors:** Every `catch` block must do something visible.

```typescript
// ✅ Correct
try {
  await createDeal(formData)
  toast.success('Deal added to pipeline')
} catch (error) {
  toast.error('Failed to add deal. Please try again.')
  console.error(error)
}

// ❌ Wrong — silent failure
try {
  await createDeal(formData)
} catch (e) {}
```

---

## Git Conventions

- **Branch naming:** `feature/pipeline-board`, `fix/reminder-cron`, `chore/update-deps`
- **Commit messages:** Imperative, present tense. `Add deal card component` not `Added deal card`
- **One logical change per commit.** Don't bundle a feature + bug fix in one commit.
- **Never commit:** `.env.local`, Supabase service role key, Stripe secret key

---

## Testing (Pragmatic for MVP)

No unit test framework for MVP — manual testing only. But:
- Every new feature must have a **manual smoke test checklist** added to `context/progress-tracker.md`
- Stripe webhooks must be tested with the Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Reminder cron must be tested manually by setting a deal date to "tomorrow" and checking email delivery

Post-MVP (V2): Add Vitest for utility functions and Playwright for critical user flows.
