# CRM Deals Engineering Review

## Scope

- Domain audited: CRM Deals
- Layers covered: App Router pages, server actions, service layer, validation, hooks, UI components, shared utilities, and Prisma access patterns for deals
- Goal: production hardening without changing intended behavior

## Engineering Scores

- Architecture Score: **7.8 / 10**
- Maintainability Score: **8.1 / 10**
- Performance Score: **7.4 / 10**
- Scalability Score: **7.3 / 10**
- Security Score: **8.0 / 10**
- Type Safety Score: **8.4 / 10**

## Severity-Ranked Findings

### Critical

1. **List edit payload data loss risk**
   - Why it matters: editing from table used partial list item data and could overwrite nullable fields with empty values.
   - Implemented fix: `DealsPage` now fetches full deal detail via `getDealAction` before opening edit.

2. **Invalid stage transition guard was effectively disabled**
   - Why it matters: users could move deals directly to terminal states and bypass pipeline progression.
   - Implemented fix: `isValidStageTransition` now enforces forward-only transitions, allows cancellation, blocks terminal transitions from `Paid/Cancelled`.

3. **Update path missing strict deal id validation**
   - Why it matters: malformed IDs reached database layer and produced inconsistent errors.
   - Implemented fix: added `dealUpdateSchema` and switched `updateDealAction` to full schema parsing.

### High

1. **Inconsistent archived mutation rules**
   - Why it matters: archived records were blocked in stage/priority updates but not full update.
   - Implemented fix: `updateDeal` now rejects edits when deal is archived.

2. **Duplicate campaign policy drift with DB constraint**
   - Why it matters: service logic only checked active duplicates while DB unique key applied globally, causing constraint-time failures.
   - Implemented fix: duplicate check now aligns with DB uniqueness scope; Prisma `P2002` is mapped to structured `campaignName` field error.

3. **Duplicate mutation orchestration across pages**
   - Why it matters: behavior drift and repeated error/toast/refresh logic.
   - Implemented fix: introduced shared `useDealMutations` hook and used it in list and detail surfaces.

### Medium

1. **URL/search state behavior caused redundant navigations**
   - Why it matters: filter changes could trigger an extra debounced replace and unnecessary fetches.
   - Implemented fix: search hook now debounces only meaningful search changes and uses shared URL builder.

2. **Kanban/table data divergence risk**
   - Why it matters: local pipeline interactions could drift from server list state.
   - Implemented fix: pipeline hook now uses optimistic stage overlays on top of server data and clears overlays after mutation result.

3. **Revenue widget used row-fetch + JS reduce**
   - Why it matters: unnecessary overfetch and memory work at scale.
   - Implemented fix: switched to Prisma aggregate sum.

### Low

1. **Accessibility gaps in list controls**
   - Implemented fixes:
     - Added `aria-label`s to stage/priority selects and row action menu button.
     - Added search field `aria-label`.
     - Stage labels in selects now use user-friendly `DEAL_STAGE_LABEL`.

2. **Large component orchestration**
   - Implemented partial decomposition:
     - `DealsSummaryWidgets`
     - `useDealsNavigation`
     - shared URL builder in `lib/crm/deals/dealsUrl.ts`
   - Remaining opportunity: extract list section and modal state manager into dedicated modules.

## Refactoring Summary

### Backend and Validation

- `dealUpdateSchema` added and wired into `updateDealAction`.
- Service-level Prisma unique constraint mapping to `DealServiceError`.
- Archived update guard added in full update service path.
- Stage transition guard implemented and enforced.
- Revenue-in-progress moved to DB aggregate.

### Frontend and Hooks

- `DealsPage` now hydrates edit form from full detail fetch.
- Form state split between create/edit paths to avoid cross-dialog coupling.
- Shared mutation hook introduced and adopted in both `DealsPage` and `DealDetailPage`.
- URL navigation consolidated via `useDealsNavigation` and `buildDealsUrl`.
- Kanban optimistic state architecture changed from local list clone to stage override map.

### UX / Error Handling / Metadata

- Detail timeline now surfaces initial fetch failures (`activityError`) instead of silently appearing empty.
- Deal detail metadata upgraded to dynamic title via `generateMetadata`.
- Empty state now distinguishes no-data vs no-filter-match scenarios.

## Technical Debt Summary

- `DealsPage` remains large and should be further split into:
  - list rendering section component
  - modal/controller hook for create/edit/archive/restore/delete dialogs
- Widgets are still computed with multiple queries on each list load.
- Kanban loads full matching dataset in current server request path; this should eventually move to a dedicated board endpoint with explicit limits/caching.
- Analytics page remains disconnected from CRM Deals data model (legacy sponsorship module).

## Migration-Safe Scalability Recommendations

1. **Index and query roadmap**
   - Add composite indexes for high-volume sort/filter combinations (`userId,status,dealValue`, `userId,status,priority,updatedAt`).
   - Evaluate trigram/GIN strategy for cross-entity search at larger scales.

2. **Constraint policy decision**
   - If product should allow reusing campaign names after terminal/archived lifecycle, replace current global unique key with partial unique index through explicit SQL migration.
   - Keep current app-level duplicate logic and DB constraint aligned at all times.

3. **Widgets strategy**
   - Separate list query from widgets query and cache widgets by user with short TTL.
   - Optionally disable expensive widget recomputation on non-primary pages.

4. **Deletion semantics**
   - Consider restricting brand hard-delete where cascading deal deletion is not acceptable for audit history.

## Verification Run

- `pnpm -s tsc --noEmit`: **pass**
- `pnpm -s eslint` on touched Deals files: **pass**
- `pnpm -s test`: no configured test script in repository (command exits non-zero with no test runner configured)
