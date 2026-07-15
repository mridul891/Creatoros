# design.md - DealFlow Design Language

This file defines what "clean" means in this product.
Use it as the default visual and interaction contract.

---

## Brand Feel

- Tone: clean, confident, modern, operational
- Product personality: premium productivity software, not playful consumer social UI
- Benchmarks: data-dense and restrained, with strong readability and clear hierarchy

---

## Core Principles

- Mobile-first by default (target 390px width first, then scale up)
- Clarity over decoration
- Consistent spacing and typography over one-off visual flourishes
- Fast-feeling interactions (subtle transitions, no noisy animations)
- Reuse existing UI primitives and patterns before inventing new visual variants

---

## Color Tokens

Use these values (from `context/ui-tokens.md`) as canonical brand/UI references:

### Brand Primary

- `primary-500`: `#4361ee` (default primary action color)
- Full scale: `primary-50` to `primary-950` from `context/ui-tokens.md`

### Neutrals

- Gray scale: `gray-50` to `gray-950` from `context/ui-tokens.md`

### Semantic

- Success: `#22c55e`
- Warning: `#f59e0b`
- Error: `#ef4444`
- Info: `#3b82f6`

### Pipeline Stage Colors

Use the stage mapping from `context/ui-tokens.md` (background + text + optional dot color), and keep stage colors consistent across badges, cards, and filters.

---

## Typography

- Base family: Inter/system sans stack
- Body default: `text-sm` or `text-base` depending on density
- Labels/metadata: `text-xs` or `text-sm`
- Section headings: `text-lg`/`text-xl`
- Page headings: `text-2xl`/`text-3xl`
- Typical weights:
  - body `font-normal`
  - labels `font-medium`
  - section headings/buttons `font-semibold`
  - key metrics/page titles `font-bold`

---

## Spacing, Radius, and Surfaces

- Spacing unit: Tailwind 4px scale; prefer standard tokens (`p-4`, `p-6`, `gap-2`, `gap-4`, `gap-6`)
- Default paddings:
  - card: `p-4` mobile, `p-6` desktop
  - page: `px-4` mobile, `px-6` desktop
  - form fields: `px-3 py-2`
  - buttons: `px-4 py-2` default
- Radius:
  - form fields/tags: `rounded` or `rounded-md`
  - cards/dropdowns: `rounded-lg`
  - dialogs/large containers: `rounded-xl`
- Card baseline:
  - rest: `border border-gray-200 shadow-sm`
  - hover: `border-gray-300 shadow`

---

## Interaction and Motion

- Default transitions:
  - `transition-colors duration-150`
  - `transition-shadow duration-150`
  - `transition-all duration-150` when needed
- Modal/dialog transitions can go up to `duration-200`
- Sidebar/drawer transitions can go up to `duration-300`
- Avoid decorative animation (`animate-bounce`, gratuitous motion)
- Use loading animations only for clear feedback (skeletons/spinners)

---

## Tailwind Usage Rules

- Prefer design tokens and utility standards over arbitrary values.
- Avoid one-off custom hex classes in component markup when token classes exist.
- Keep utility intent consistent:
  - structure/layout first
  - spacing next
  - typography
  - color and effects
  - interaction states
- Use responsive prefixes intentionally (`sm:`, `md:`, `lg:`) after mobile baseline works.
- Prefer composable shared primitives in `components/ui/` over repeated custom class blobs.

---

## Component-Level Visual Rules

### Buttons

- One clear primary action per surface.
- Secondary actions use quieter variants (`secondary`/`ghost` patterns).
- Destructive actions use explicit danger styling and confirmation flow.

### Forms

- Always show labels; placeholders are not labels.
- Keep input heights and vertical rhythm consistent.
- Show error/help text inline with stable spacing.

### Cards and Panels

- Keep cards compact, readable, and scannable.
- Avoid deep nesting of visual containers.
- Use consistent card header/content/footer rhythm.

### Tables and Dense Lists

- Optimize for scan speed and alignment.
- Keep row actions predictable (right-aligned action slots/pattern).
- Preserve readable contrast and hover affordances.

### Empty States

- Include: title, short explanation, clear next action CTA.
- Tone should be actionable, not decorative.

### Dialogs and Confirmations

- Use dialogs for focused tasks and irreversible confirmations.
- Destructive dialogs must state consequence clearly.

---

## Definition Of "Clean" In DealFlow

"Clean" means:

- no visual clutter
- predictable spacing and typography
- consistent reuse of components
- restrained color usage with clear semantic meaning
- interfaces that feel operational and fast to scan

"Clean" does not mean:

- minimal at the cost of clarity
- novelty animations
- custom styles per page
- hidden actions or low-contrast micro-text

---

## Anti-Patterns

- Creating new component styles when existing primitives already fit
- Arbitrary paddings/margins not based on token scale
- Mixed button styles with no hierarchy
- Overusing bright colors for non-semantic emphasis
- Building desktop-first layouts that collapse poorly on mobile
