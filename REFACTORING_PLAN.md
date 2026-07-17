
# DealFlow Production-Grade Refactoring Plan

**Created:** 2026-07-16  
**Status:** Planning Phase  
**Target:** Zero functional changes, production-grade maintainability

---

## Executive Summary

This plan refactors ~283 TypeScript/TSX files across a CRM dashboard for creators (DealFlow) into a production-grade, maintainable codebase. The refactoring is organized into **12 sequential phases** to ensure zero regression risk.

**Current State:** ~47KB SponsorshipPage, ~26KB InvoicesPage, ~40KB MediaKitPage, ~18KB CalendarPage — all with embedded business logic, duplicate components, and dead code.

**Target State:** Clean separation of UI, logic, data, and utilities with zero dead code, maximum reuse, and clear ownership boundaries.

---

## Phase 0: Discovery & Baseline (Week 0)

**Goal:** Establish metrics, identify all dead code, create baseline

### Tasks:
- [ ] Run full TypeScript build (`tsc --noEmit`) — capture baseline errors
- [ ] Run lint (`pnpm lint`) — capture baseline warnings
- [ ] Run tests if any exist — capture baseline pass/fail
- [ ] Generate dependency graph (madge or similar)
- [ ] Catalog all files >250 lines (components), >200 lines (hooks), >150 lines (utils)
- [ ] Identify all `console.log`, `console.error`, `debugger`, commented code blocks
- [ ] Run `ts-prune` or `knip` for dead code detection
- [ ] Document all duplicate component patterns found

**Deliverable:** `REFACTORING_BASELINE.md` with metrics

---

## Phase 1: Dead Code Elimination (Week 1)

**Goal:** Remove all unused code — zero functional impact

### 1.1 Dead Files & Exports
- [ ] Run `knip` to detect unused exports, files, dependencies
- [ ] Remove `components/logo.tsx` (already deleted per git status)
- [ ] Remove any `.tsx` files with zero imports
- [ ] Remove unused types from `types/` and `enums/`
- [ ] Remove unused enums from `enums/`

### 1.2 Dead Code Inside Files
- [ ] **SponsorshipPage.tsx**: Remove embedded seed data (`seedSponsorships`, `seedDeliverables`, `seedPosts`, `seedFiles`, `seedTasks`, `seedInvoices`, `seedNotes`, `seedActivities` — ~200 lines of mock data)
- [ ] **InvoicesPage.tsx**: Remove any embedded test/mock data
- [ ] **MediaKitPage.tsx**: Remove any embedded test data
- [ ] Remove all `console.log`, `console.error`, `debugger` statements (except intentional logging in `lib/ms-clarity.ts`)
- [ ] Remove commented-out code blocks
- [ ] Remove unused imports in all files

### 1.3 Duplicate Utility Functions
- [ ] Consolidate `formatCurrency`, `formatDate`, `capitalize`, `truncate`, `slugify` — keep one in `lib/utils.ts`
- [ ] Search for duplicate `cn()` / `clsx()` implementations
- [ ] Consolidate date formatting in `lib/format/date.ts` — remove duplicates in components

### 1.4 Unused Hooks
- [ ] Audit all hooks in `hooks/` — remove unused exports
- [ ] Check for hooks that only re-export other hooks without adding logic

---

## Phase 2: Shared UI Component Consolidation (Week 1-2)

**Goal:** Eliminate duplicate UI implementations across CRM modules

### 2.1 Inventory Duplicate Components
**Found duplicates across `components/modules/crm/`:**
| Component | Locations | Canonical Location |
|-----------|-----------|-------------------|
| EmptyState | brands, contacts, deals, tasks, deliverables, notes, files | `components/modules/crm/shared/CrmEmptyState.tsx` |
| Skeleton | brands, contacts, deals, tasks, deliverables | `components/modules/crm/shared/CrmSkeleton.tsx` |
| ConfirmDialog | brands, deals | `components/modules/crm/shared/CrmConfirmDialog.tsx` |
| FormDialog | brands, deals, contacts, tasks, deliverables | `components/modules/crm/shared/CrmFormDialog.tsx` |
| SearchField | brands, deals | `components/modules/crm/shared/CrmSearchField.tsx` |
| Pagination | brands, deals | `components/modules/crm/shared/CrmPagination.tsx` |
| PageHeader | brands, deals | `components/modules/crm/shared/CrmPageHeader.tsx` |
| Toolbar | brands, contacts, deals | Consolidate into one |
| Table | brands, contacts, deals, tasks, deliverables, invoices | Use `components/ui/table.tsx` |

### 2.2 Consolidation Tasks
- [ ] **Empty States:** Delete `BrandEmptyState`, `ContactsEmptyState`, `TasksEmptyState`, `DeliverablesEmptyState`, `DealEmptyState` (if exists) → use `CrmEmptyState`
- [ ] **Skeletons:** Delete `BrandsTableSkeleton`, `ContactsTableSkeleton`, `TasksSkeleton`, `DeliverablesSkeleton`, `ActivityTimelineSkeleton` → use `CrmSkeleton`
- [ ] **Dialogs:** Delete `BrandDeleteDialog`, `DealDeleteDialog`, `DealArchiveDialog`, `ContactArchiveDialog` → use `CrmConfirmDialog` with props
- [ ] **Forms:** Delete `BrandForm`, `DealForm`, `ContactFormModal`, `TaskForm`, `DeliverableForm` → use `CrmFormDialog` + form schema
- [ ] **Tables:** Replace custom table implementations with `components/ui/table.tsx` primitives
- [ ] **Search:** Replace `BrandSearchField`, `DealSearchField` with `CrmSearchField`
- [ ] **Pagination:** Replace custom pagination with `CrmPagination`
- [ ] **Page Headers:** Replace custom headers with `CrmPageHeader`

### 2.3 Landing Page Components
- [ ] Audit `components/modules/Landing/` for duplicates with `components/ui/`
- [ ] Consolidate `Button`, `Card`, `Input` variants if they duplicate primitives

---

## Phase 3: Business Logic Extraction (Week 2-3)

**Goal:** Move all business logic out of React components into `lib/business/` and `lib/api/`

### 3.1 Create Business Logic Layer
```
lib/business/
├── brand.ts          # Brand validation, formatting, business rules
├── deal.ts           # Deal pipeline logic, stage transitions, calculations
├── contact.ts        # Contact validation, formatting
├── task.ts           # Task status transitions, due date logic
├── deliverable.ts    # Deliverable status logic, file validation
├── invoice.ts        # Invoice calculations, status transitions, numbering
├── sponsorship.ts    # Sponsorship metrics, calculations
├── activity.ts       # Activity formatting, grouping
├── analytics.ts      # Dashboard calculations, trends
└── index.ts
```

### 3.2 Extract from Components
**SponsorshipPage.tsx (~47KB) — Priority 1:**
- [ ] Extract `seedSponsorships` → `lib/business/sponsorship.ts` as `getMockSponsorships()` (for dev only)
- [ ] Extract filtering/sorting logic → `useSponsorshipFilters()` hook or business util
- [ ] Extract deal stage transition logic → `lib/business/deal.ts`
- [ ] Extract invoice calculations → `lib/business/invoice.ts`
- [ ] Extract deliverable status logic → `lib/business/deliverable.ts`
- [ ] Extract task status logic → `lib/business/task.ts`

**InvoicesPage.tsx (~26KB):**
- [ ] Extract invoice generation logic → `lib/business/invoice.ts`
- [ ] Extract PDF generation logic → `lib/business/invoicePdf.ts`
- [ ] Extract status transition logic

**MediaKitPage.tsx (~40KB):**
- [ ] Extract media kit generation logic → `lib/business/mediaKit.ts`
- [ ] Extract analytics calculations → `lib/business/analytics.ts`

**CalendarPage.tsx (~18KB):**
- [ ] Extract post scheduling logic → `lib/business/calendar.ts`

**AnalyticsDashboard.tsx:**
- [ ] Extract KPI calculations → `lib/business/analytics.ts`

### 3.3 Create API Layer
```
lib/api/
├── brands.ts         # All brand server actions
├── deals.ts          # All deal server actions
├── contacts.ts       # All contact server actions
├── tasks.ts          # All task server actions
├── deliverables.ts   # All deliverable server actions
├── invoices.ts       # All invoice server actions
├── files.ts          # All file server actions
├── notes.ts          # All note server actions
├── activity.ts       # All activity server actions
├── sponsorship.ts    # All sponsorship server actions
├── analytics.ts      # All analytics server actions
└── index.ts
```

- [ ] Move server actions from `app/action/*.ts` → `lib/api/*.ts`
- [ ] Update all imports across codebase
- [ ] Create typed response wrappers (success/error types)

---

## Phase 4: Custom Hook Refactoring (Week 3)

**Goal:** Extract reusable logic into composable hooks, remove duplicate state

### 4.1 Hook Audit & Consolidation
**Current hooks in `hooks/` (21 files):**
| Hook | Domain | Action |
|------|--------|--------|
| `useBrandContacts` | CRM | Keep, ensure single responsibility |
| `useDealListSearch` | CRM | Consolidate with `useBrandListSearch` → `useEntitySearch` |
| `useDealMutations` | CRM | Split: mutations vs queries |
| `useTaskMutations` | CRM | Consolidate with other mutation hooks |
| `useBrandActivity` | CRM | Keep |
| `useDealPipeline` | CRM | Keep |
| `useDealsNavigation` | CRM | Keep |
| `useDealFiles` | CRM | Keep |
| `useDeliverableMutations` | CRM | Consolidate |
| `useDealTasks` | CRM | Keep |
| `useFileMutations` | CRM | Consolidate |
| `useInvoiceMutations` | CRM | Consolidate |
| `useDealDeliverables` | CRM | Keep |
| `useDealActivity` | CRM | Keep |
| `useDealNotes` | CRM | Keep |
| `useNoteMutations` | CRM | Consolidate |
| `useBrandListSearch` | CRM | → `useEntitySearch` |

### 4.2 New Shared Hooks to Create
```
hooks/
├── useEntitySearch.ts        # Generic search/filter/sort for any entity
├── useEntityMutations.ts     # Generic CRUD mutations with invalidation
├── usePagination.ts          # Pagination state + logic
├── useDebounce.ts            # Debounced value
├── useLocalStorage.ts        # Persisted state
├── useMediaQuery.ts          # Responsive breakpoints (replace use-mobile.ts)
├── useTableSelection.ts      # Multi-select for tables
└── useFormState.ts           # Form state management
```

### 4.3 State Optimization in Components
- [ ] Replace derived state with `useMemo`/`useDerivedValue` pattern
- [ ] Remove `useState` for values computable from props/other state
- [ ] Consolidate multiple `useState` into single `useReducer` where related
- [ ] Move URL-synced state to `useSearchParams` / `useRouter`

---

## Phase 5: Type System Consolidation (Week 3-4)

**Goal:** Centralize types, eliminate duplicates, remove `any`

### 5.1 Type Audit
**Current structure:**
- `types/` — 16 domain type files
- `enums/` — 17 enum files
- Types also defined inline in components

### 5.2 Consolidation Plan
```
types/
├── domain/
│   ├── brand.ts
│   ├── deal.ts
│   ├── contact.ts
│   ├── task.ts
│   ├── deliverable.ts
│   ├── invoice.ts
│   ├── sponsorship.ts
│   ├── activity.ts
│   ├── file.ts
│   ├── note.ts
│   └── user.ts
├── ui/
│   ├── table.ts
│   ├── form.ts
│   ├── dialog.ts
│   └── pagination.ts
├── api/
│   ├── request.ts
│   ├── response.ts
│   └── error.ts
└── index.ts
```

- [ ] Merge `enums/` into corresponding `types/domain/*.ts` as `const` objects or `as const` unions
- [ ] Remove duplicate interfaces (e.g., `Brand` defined in multiple places)
- [ ] Create `types/api/` for server action input/output types
- [ ] Replace all `any` with proper types
- [ ] Use discriminated unions for status fields (dealStage, invoiceStatus, etc.)
- [ ] Export all from `types/index.ts`

---

## Phase 6: Component Architecture Refactor (Week 4-5)

**Goal:** Apply Single Responsibility Principle, reduce file sizes, enable Server Components

### 6.1 Large Component Decomposition

**SponsorshipPage.tsx (47KB → target <250 lines each):**
```
components/modules/dashboard/sponsorship/
├── SponsorshipPage.tsx           # Server component - data fetching + composition
├── SponsorshipPageClient.tsx     # Client wrapper for interactive parts
├── SponsorshipHeader.tsx         # Header with actions
├── SponsorshipFilters.tsx        # Filter/sort controls
├── SponsorshipTable.tsx          # Table using ui/table primitives
├── SponsorshipKanban.tsx         # Kanban board view
├── SponsorshipDetailDrawer.tsx   # Detail panel
├── SponsorshipMetrics.tsx        # KPI cards
├── index.ts
```

**InvoicesPage.tsx (26KB):**
```
components/modules/dashboard/invoices/
├── InvoicesPage.tsx
├── InvoicesPageClient.tsx
├── InvoicesTable.tsx
├── InvoiceDetail.tsx
├── InvoiceDetailModal.tsx
├── InvoiceActions.tsx
├── index.ts
```

**MediaKitPage.tsx (40KB):**
```
components/modules/dashboard/media-kit/
├── MediaKitPage.tsx
├── MediaKitPageClient.tsx
├── MediaKitHeader.tsx
├── MediaKitMetrics.tsx
├── MediaKitAudience.tsx
├── MediaKitDeliverables.tsx
├── MediaKitTestimonials.tsx
├── MediaKitExport.tsx
├── index.ts
```

**CalendarPage.tsx (18KB):**
```
components/modules/dashboard/calendar/
├── CalendarPage.tsx
├── CalendarPageClient.tsx
├── CalendarView.tsx
├── PostModal.tsx
├── PostPanel.tsx
├── index.ts
```

**AnalyticsDashboard.tsx:**
```
components/modules/dashboard/analytics/
├── AnalyticsPage.tsx
├── AnalyticsPageClient.tsx
├── KpiCards.tsx
├── GrowthChart.tsx
├── PerformanceTable.tsx
├── InsightsPanel.tsx
├── index.ts
```

### 6.2 CRM Module Refactoring
Apply consistent structure to each CRM domain:
```
components/modules/crm/brands/
├── BrandsPage.tsx
├── BrandsPageServer.tsx
├── BrandsTable.tsx
├── BrandRow.tsx
├── BrandDetailDrawer.tsx
├── BrandFormDialog.tsx
├── BrandDeleteDialog.tsx
├── index.ts
```

Repeat for: `contacts`, `deals`, `tasks`, `deliverables`, `files`, `notes`, `invoices`, `activity`

### 6.3 Server/Client Boundary Enforcement
- [ ] Move all data fetching to Server Components (`*PageServer.tsx` or `*Page.tsx` with async)
- [ ] Keep only interactive UI in Client Components
- [ ] Pass data as props — no `useEffect` for data fetching in client components
- [ ] Use `Suspense` boundaries for streaming

---

## Phase 7: Styling & Design Token Consistency (Week 5)

**Goal:** Eliminate duplicate styles, enforce design.md tokens

### 7.1 Token Audit
- [ ] Scan for arbitrary Tailwind values (`text-[#123456]`, `p-[13px]`, etc.)
- [ ] Replace with design tokens from `context/ui-tokens.md` (or create if missing)
- [ ] Consolidate `animation-variants.ts` usage
- [ ] Remove duplicate CSS-in-JS or inline styles

### 7.2 Component Styling Standards
- [ ] All cards: `border border-gray-200 shadow-sm` / hover `border-gray-300 shadow`
- [ ] All buttons: use `components/ui/button.tsx` variants
- [ ] All inputs: use `components/ui/input.tsx` + `components/ui/label.tsx`
- [ ] All dialogs: use `components/ui/dialog.tsx`
- [ ] All tables: use `components/ui/table.tsx`
- [ ] Spacing: only standard tokens (`p-4`, `p-6`, `gap-2`, `gap-4`, `gap-6`)

### 7.3 Dark Mode Preparation (Optional - Phase 3)
- [ ] Audit all hardcoded colors
- [ ] Convert to semantic tokens (`bg-background`, `text-foreground`, `border-border`)
- [ ] Add `dark:` variants where needed

---

## Phase 8: API & Server Action Cleanup (Week 5-6)

**Goal:** Centralize all server communication, standardize error handling

### 8.1 Server Action Consolidation
**Current:** `app/action/*.ts` (13 files, some very large)
**Target:** `lib/api/*.ts` with consistent patterns

### 8.2 Standardize Response Types
```typescript
// lib/api/response.ts
export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

export async function safeAction<T>(
  fn: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
```

### 8.3 Apply to All Actions
- [ ] Wrap all server actions with `safeAction`
- [ ] Return typed `ActionResult<T>`
- [ ] Handle errors consistently in client components
- [ ] Add Zod validation schemas for all inputs

### 8.4 Database Access Layer
- [ ] Move Prisma queries from actions → `lib/supabase/queries/*.ts`
- [ ] Create repository pattern per domain
- [ ] Add RLS-aware query helpers

---

## Phase 9: Performance Optimization (Week 6)

**Goal:** Eliminate unnecessary renders, optimize bundle

### 9.1 React Optimization
- [ ] Add `React.memo` to all leaf components (table rows, cards, badges)
- [ ] Add `useCallback` for event handlers passed to memoized children
- [ ] Add `useMemo` for expensive computations (filtering, sorting, grouping)
- [ ] Convert static pages to Server Components (no `'use client'`)
- [ ] Add `Suspense` boundaries for async components
- [ ] Lazy load heavy components (charts, calendars, media kit export)

### 9.2 Bundle Analysis
- [ ] Run `pnpm build && pnpm next-bundle-analyzer`
- [ ] Identify large dependencies
- [ ] Replace heavy libraries with lighter alternatives where possible
- [ ] Enable `modularizeImports` for lodash, date-fns, etc.

### 9.3 Database Query Optimization
- [ ] Add `select` to Prisma queries (avoid `select: *`)
- [ ] Add indexes for common filter/sort columns
- [ ] Use `prefetch` / `unstable_cache` where appropriate

---

## Phase 10: Error Handling & Accessibility (Week 6-7)

**Goal:** Production-grade resilience and a11y

### 10.1 Error Boundaries
- [ ] Add root error boundary in `app/dashboard/error.tsx`
- [ ] Add per-feature error boundaries (Deals, Brands, Invoices, etc.)
- [ ] Standardize error UI with retry action

### 10.2 Loading & Empty States
- [ ] Every async component has `Skeleton` (use `components/ui/skeleton.tsx`)
- [ ] Every list has `CrmEmptyState` with actionable CTA
- [ ] Every form has validation errors inline

### 10.3 Accessibility Audit
- [ ] All buttons have accessible names
- [ ] All inputs have associated labels
- [ ] Dialogs trap focus, restore focus on close
- [ ] Tables have proper headers, scope
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works everywhere

---

## Phase 11: Testing & Verification (Week 7)

**Goal:** Verify zero regression, establish test baseline

### 11.1 Automated Checks
- [ ] `tsc --noEmit` — zero errors
- [ ] `pnpm lint` — zero warnings
- [ ] `pnpm format:check` — zero issues
- [ ] Build succeeds (`pnpm build`)

### 11.2 Smoke Tests (Manual)
| Flow | Test Case |
|------|-----------|
| Auth | Login → dashboard loads |
| Brands | List → create → edit → delete |
| Deals | Kanban drag → detail → stage change |
| Tasks | Create → complete → filter |
| Invoices | Generate from deal → send → mark paid |
| Sponsorships | List → filter → detail view |
| Analytics | Dashboard loads with data |
| Media Kit | Generate → export PDF |
| Calendar | Create post → schedule |

### 11.3 Performance Baselines
- [ ] Lighthouse CI on key pages (Dashboard, Deals, Brands, Analytics)
- [ ] Bundle size < 200KB initial JS
- [ ] TTI < 3s on 3G

---

## Phase 12: Documentation & Handoff (Week 7)

**Goal:** Update all reference docs to match new architecture

### 12.1 Update Documentation
- [ ] `CLAUDE.md` — update folder structure, conventions
- [ ] `components.md` — update component registry
- [ ] `design.md` — verify tokens match implementation
- [ ] `slices.md` — update slice status if any completed
- [ ] Create `ARCHITECTURE.md` — document new layers (business, api, ui)

### 12.2 Create Migration Guide
- [ ] Document breaking changes (none expected)
- [ ] Document new import paths
- [ ] Document new hook APIs
- [ ] Document new component APIs

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Regression in business logic | Phase 11 smoke tests + Phase 3 unit tests for extracted logic |
| Breaking component APIs | Phase 2: extend existing components, don't replace; Phase 6: parallel new + old |
| Bundle size increase | Phase 9 bundle analysis after each phase |
| Type errors | Run `tsc --noEmit` after every phase |
| Server/Client boundary issues | Phase 6: strict enforcement, lint rule |

---

## Success Criteria (Definition of Done)

- [ ] **Zero dead code** — `knip` reports 0 unused
- [ ] **Zero duplicate UI** — single source for each primitive
- [ ] **Minimal state** — no derived state in `useState`, all computed
- [ ] **Business logic separated** — zero business rules in components
- [ ] **API centralized** — all server calls via `lib/api/`
- [ ] **Types centralized** — single source of truth in `types/`
- [ ] **Components < 250 lines** — all decomposed
- [ ] **Hooks < 200 lines** — all focused
- [ ] **Build passes** — `tsc`, `lint`, `build` all green
- [ ] **All smoke tests pass** — manual verification
- [ ] **Docs updated** — architecture reflects reality

---

## Phase Dependencies

```
Phase 0 (Discovery)
    ↓
Phase 1 (Dead Code) ──────────────────────┐
    ↓                                      │
Phase 2 (UI Consolidation)                 │
    ↓                                      │
Phase 3 (Business Logic) ←─────────────────┤ (can parallelize)
    ↓                                      │
Phase 4 (Hooks)                            │
    ↓                                      │
Phase 5 (Types) ───────────────────────────┘
    ↓
Phase 6 (Component Arch) ←──────────────────┐
    ↓                                        │
Phase 7 (Styling)                            │ (parallel)
    ↓                                        │
Phase 8 (API) ──────────────────────────────┘
    ↓
Phase 9 (Performance)
    ↓
Phase 10 (Errors/A11y)
    ↓
Phase 11 (Testing)
    ↓
Phase 12 (Docs)
```

---

## Estimated Effort

| Phase | Effort | Parallelizable |
|-------|--------|----------------|
| 0: Discovery | 1 day | No |
| 1: Dead Code | 2 days | Partially |
| 2: UI Consolidation | 3 days | Partially |
| 3: Business Logic | 4 days | Yes (per domain) |
| 4: Hooks | 2 days | Yes |
| 5: Types | 2 days | No |
| 6: Component Arch | 5 days | Yes (per module) |
| 7: Styling | 2 days | Partially |
| 8: API | 2 days | Yes |
| 9: Performance | 2 days | No |
| 10: Errors/A11y | 2 days | Partially |
| 11: Testing | 2 days | No |
| 12: Docs | 1 day | No |
| **Total** | **~28 days** | |

---

## Next Steps

1. **Approve this plan** — confirm scope and priorities
2. **Run Phase 0** — establish baseline metrics
3. **Begin Phase 1** — dead code elimination (safest, highest immediate impact)
4. **Weekly check-ins** — verify no regressions, adjust scope

---

*This plan follows the DealFlow CLAUDE.md constraints: zero functional changes, preserve MVP slices, reuse before create, and maintain backward compatibility.*