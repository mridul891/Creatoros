# components.md - Reusable Component Contract

This file prevents duplicate components and drift.
Before building UI, check this file and `architecture.md`.

---

## Reuse Protocol (Mandatory)

1. Search for an existing component in:
   - `components.md` (this file)
   - `architecture.md` (placement rules)
   - `components/ui/`, `components/shared/`, `components/layout/`
   - `features/<domain>/components/`
2. If a match exists, reuse it.
3. If close but not exact, extend existing component instead of creating a parallel variant.
4. If truly new, create it in the right layer.

Do not silently create a second version of an existing UI pattern.

---

## Component Layers (Canonical)

### 1) Primitives - `components/ui/`

Use for atomic reusable building blocks.

Current examples:

- `components/ui/button.tsx`
- `components/ui/input.tsx`
- `components/ui/select.tsx`
- `components/ui/dialog.tsx`
- `components/ui/sheet.tsx`
- `components/ui/dropdown-menu.tsx`
- `components/ui/table.tsx`
- `components/ui/tabs.tsx`
- `components/ui/pagination.tsx`
- `components/ui/sonner.tsx`

Rule: do not bypass primitives for common controls unless there is a clear gap.
Rule: `components/ui/` must not import features.

### 2) Shared app UI - `components/shared/`

Use for genuinely reusable application composites.

- `components/shared/crm/` — CRM chrome: `CrmPageHeaderClient`, `CrmFormDialog`, `CrmConfirmDialog`, `CrmEmptyState`, `CrmSearchField`, `CrmPagination`
- `LoginForm`, `ThemeProvider`, motion primitives, `ImageWithFallback`

Rule: new CRM feature UIs should compose from `components/shared/crm/` first.

### 3) Layout - `components/layout/`

Dashboard shell only (e.g. `Sidebar`).

### 4) Feature UI - `features/<domain>/components/`

Domain-specific widgets live with their feature:

- `features/deals`, `features/brands`, `features/contacts`, `features/tasks`, …
- `features/media-kit`, `features/scripts`, `features/analytics`, `features/sponsorship`, `features/calendar`, `features/invoices`

Rule: DealCard, BrandForm, MediaKitForm, ScriptEditor belong here — not in `components/ui/`.

### 5) Marketing - `components/marketing/`

Landing sections and composed marketing pages (`landing.tsx`, `product-page.tsx`, `features-page.tsx`, `pricing-page.tsx`, `marketing-page-shell.tsx`).

Rule: keep these compositional; do not place low-level primitives here.

---

## Naming and Export Conventions

- Domain/shared component files: PascalCase (e.g., `DealTasksSection.tsx`)
- shadcn primitive files: lowercase kebab-style (e.g., `dropdown-menu.tsx`)
- Prefer named exports for reusable components
- Keep props explicitly typed
- Keep `"use client"` only where interactivity requires it

---

## Server/Client Boundary Rules

- Data loading and permission-aware fetching should happen in server components/services.
- Interactive UI, local state, drag-and-drop, dialogs, and toasts can be client components.
- Follow existing split patterns when present (feature `*PageServer.tsx` that fetches, plus an interactive page component).
- Feature server actions stay in `features/<domain>/actions/` with `"use server"`.

---

## Placement Rules

- If reused across unrelated features -> `components/ui/` or `components/shared/`
- If only one domain uses it -> `features/<domain>/components/`
- If it is dashboard chrome -> `components/layout/`
- If it is marketing composition -> `components/marketing/`

---

## Drift Guardrails

- When in doubt, follow `architecture.md` and the on-disk `features/` tree.
- Do not import another feature’s private internals; use that feature’s public `index.ts` (or public actions, types, and section components).

---

## Definition Of Done For New Reusable Components

- Correct placement in component layer
- Reuse check completed and duplicates avoided
- Props typed and naming conventions followed
- Mobile-first behavior verified
