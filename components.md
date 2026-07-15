# components.md - Reusable Component Contract

This file prevents duplicate components and drift.
Before building UI, check this file and `context/ui-registry.md`.

---

## Reuse Protocol (Mandatory)

1. Search for an existing component in:
   - `components.md` (this file)
   - `context/ui-registry.md` (detailed inventory)
   - `components/ui/` and `components/modules/`
2. If a match exists, reuse it.
3. If close but not exact, extend existing component instead of creating a parallel variant.
4. If truly new, create it in the right layer and document it in `context/ui-registry.md`.

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

### 2) Shared CRM UI - `components/modules/crm/shared/`

Use for cross-CRM shell patterns.

Key shared components:

- `CrmPageHeader`
- `CrmFormDialog`
- `CrmConfirmDialog`
- `CrmEmptyState`
- `CrmSearchField`
- `CrmPagination`

Rule: new CRM feature UIs should compose from these first.

### 3) Feature Modules - `components/modules/<domain>/`

Current major domains:

- `components/modules/crm/` (deals, brands, contacts, tasks, files, notes, deliverables, activity)
- `components/modules/dashboard/` (analytics, calendar, sponsorship, invoices/media kit pages)
- `components/modules/Landing/` (marketing sections)

Rule: domain-specific components stay within their domain module.

### 4) Page Compositions - `components/individualPages/`

Used for composed page-level marketing shells:

- `landing.tsx`
- `product-page.tsx`
- `features-page.tsx`
- `pricing-page.tsx`
- `marketing-page-shell.tsx`

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
- Follow existing split patterns when present (`*PageServer.tsx` + interactive page component).

---

## Placement Rules

- If reused across multiple domains -> `components/ui/` or `components/modules/crm/shared/`
- If only one domain uses it -> domain folder in `components/modules/<domain>/`
- If only one page composition uses it -> `components/individualPages/` (or co-locate if purely local)

---

## Drift Guardrails

- `context/ui-registry.md` may contain planned paths that differ from current implementation.
- When in doubt, prefer current on-disk module structure and document updates explicitly.
- If a move/refactor is needed, require approval before broad component relocation.

---

## Definition Of Done For New Reusable Components

- Correct placement in component layer
- Reuse check completed and duplicates avoided
- Props typed and naming conventions followed
- Mobile-first behavior verified
- Added/updated in `context/ui-registry.md`
