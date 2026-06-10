# UI Tokens — DealFlow Design System

> These are the design tokens for DealFlow.
> All colours, typography, spacing, and shadows are defined here.
> Use these in `tailwind.config.ts`. Do not introduce arbitrary values.

---

## Brand Identity

**Product:** DealFlow — a professional CRM for creators
**Tone:** Clean, confident, modern. Not playful or bubbly. Feels like a tool you'd pay for.
**Reference aesthetic:** Linear, Notion, Lemon Squeezy — clean data-dense apps.

---

## Colour Palette

### Brand Colours
```
primary-50:   #f0f4ff
primary-100:  #e0eaff
primary-200:  #c3d4ff
primary-300:  #93afff
primary-400:  #6485ff
primary-500:  #4361ee   ← Brand primary (buttons, links, accents)
primary-600:  #2d47d4
primary-700:  #2437ac
primary-800:  #1e2d88
primary-900:  #1a266e
primary-950:  #111540
```

### Neutral / UI
```
gray-50:   #f8fafc
gray-100:  #f1f5f9
gray-200:  #e2e8f0
gray-300:  #cbd5e1
gray-400:  #94a3b8
gray-500:  #64748b
gray-600:  #475569
gray-700:  #334155
gray-800:  #1e293b
gray-900:  #0f172a
gray-950:  #020617
```

### Semantic Colours

#### Status / Pipeline Stage Colours
```
stage-inbound:       #e0f2fe / text: #0369a1   (sky blue)
stage-negotiating:   #fef3c7 / text: #92400e   (amber)
stage-contracted:    #f3e8ff / text: #7e22ce   (purple)
stage-in-progress:   #dbeafe / text: #1d4ed8   (blue)
stage-awaiting:      #ffedd5 / text: #c2410c   (orange)
stage-live:          #d1fae5 / text: #065f46   (green)
stage-invoice-sent:  #ede9fe / text: #5b21b6   (violet)
stage-paid:          #dcfce7 / text: #15803d   (green)
```

#### System Colours
```
success: #22c55e (green-500)
warning: #f59e0b (amber-500)
error:   #ef4444 (red-500)
info:    #3b82f6 (blue-500)
```

### Dark Mode
Dark mode support is a **V2 feature**. Build light mode only for MVP.

---

## Typography

### Font Stack
```
font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace
```

Load via `next/font/google`:
```typescript
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
```

### Type Scale
```
text-xs:    12px / line-height: 16px   — Labels, tags, metadata
text-sm:    14px / line-height: 20px   — Body text, form fields, table cells
text-base:  16px / line-height: 24px   — Default body, card descriptions
text-lg:    18px / line-height: 28px   — Card titles, section headings
text-xl:    20px / line-height: 28px   — Page section titles
text-2xl:   24px / line-height: 32px   — Dashboard metric values
text-3xl:   30px / line-height: 36px   — Page titles
text-4xl:   36px / line-height: 40px   — Hero/marketing only
```

### Font Weights
```
font-normal:   400 — Body text
font-medium:   500 — Labels, table headers, form labels
font-semibold: 600 — Card titles, section headings, button text
font-bold:     700 — Page titles, metric values
```

---

## Spacing

Using Tailwind's default 4px base unit. Key values:

```
1  →  4px    (micro gaps)
2  →  8px    (tight spacing)
3  →  12px   (compact)
4  →  16px   (default padding)
5  →  20px   (comfortable)
6  →  24px   (section gaps)
8  →  32px   (large gaps)
10 →  40px   (section padding)
12 →  48px   (major sections)
16 →  64px   (page-level padding)
```

### Standard Padding Values
```
Card padding:       p-4 (mobile) / p-6 (desktop)
Page padding:       px-4 (mobile) / px-6 (desktop)
Form field padding: px-3 py-2
Button padding:     px-4 py-2 (default) / px-3 py-1.5 (small) / px-5 py-2.5 (large)
Modal padding:      p-6
```

---

## Border Radius

```
rounded-sm:  2px   — Very subtle
rounded:     4px   — Default (form fields, tags)
rounded-md:  6px   — Buttons, badges
rounded-lg:  8px   — Cards, dropdowns
rounded-xl:  12px  — Modal dialogs, large cards
rounded-2xl: 16px  — Feature cards, sidebars
rounded-full: 9999px — Avatars, pill badges
```

---

## Shadows

```
shadow-none  — Flat/no shadow (table rows, list items)
shadow-sm    — Subtle (deal cards at rest)
shadow       — Default (deal cards on hover)
shadow-md    — Medium (dropdowns, tooltips)
shadow-lg    — Heavy (modals, command palette)
shadow-xl    — Maximum (fullscreen drawers)
```

**Card default:** `shadow-sm border border-gray-200`
**Card hover:** `shadow border-gray-300`

---

## Pipeline Stage Badge Colours

Applied to the stage pill/badge on each deal card:

```typescript
const STAGE_STYLES = {
  inbound:          { bg: 'bg-sky-100',    text: 'text-sky-700',    dot: 'bg-sky-400' },
  negotiating:      { bg: 'bg-amber-100',  text: 'text-amber-800',  dot: 'bg-amber-400' },
  contract_signed:  { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-400' },
  content_progress: { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-400' },
  awaiting_approval:{ bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-400' },
  live:             { bg: 'bg-emerald-100',text: 'text-emerald-800',dot: 'bg-emerald-400' },
  invoice_sent:     { bg: 'bg-violet-100', text: 'text-violet-800', dot: 'bg-violet-400' },
  paid_complete:    { bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500' },
}
```

---

## Animation

Keep animations subtle and purposeful. No decorative animations in a productivity app.

```
transition-all duration-150  — Default for hover/focus states
transition-colors duration-150  — Colour-only transitions
transition-shadow duration-150  — Shadow on card hover
duration-200  — Modal open/close
duration-300  — Sidebar slide
```

**Never use:** `animate-bounce`, `animate-spin` (except loading indicators), or transitions > 300ms for UI interactions.

---

## Tailwind Config Extension

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0eaff',
          200: '#c3d4ff',
          300: '#93afff',
          400: '#6485ff',
          500: '#4361ee',
          600: '#2d47d4',
          700: '#2437ac',
          800: '#1e2d88',
          900: '#1a266e',
          950: '#111540',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```
