# Hugeicons Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all 55 component files that directly import Phosphor icons, migrate their indirect dynamic-icon consumers, and remove all remaining Phosphor package records.

**Architecture:** Use the repository's existing Hugeicons pattern: import icon data from `@hugeicons/core-free-icons` and render it with `HugeiconsIcon` from `@hugeicons/react`. Dynamic icon maps store `IconSvgElement` values instead of React component types. No compatibility layer or custom SVGs will be added.

**Tech Stack:** React 19, TypeScript 5.9, Next.js 16, `@hugeicons/react`, `@hugeicons/core-free-icons`, pnpm.

## Global Constraints

- Preserve all existing uncommitted changes; change only icon imports, icon render expressions, icon-data types, and stale Phosphor lockfile records.
- Preserve icon semantics, dimensions, colors, classes, accessibility attributes, and event behavior.
- Use the closest semantic free Hugeicon when there is no exact equivalent.
- Do not add dependencies or custom SVG assets.
- Do not create git commits unless the user explicitly requests them.
- Treat `package.json` and `pnpm-lock.yaml` as canonical; update `package-lock.json` only to remove stale Phosphor records.

## Canonical Icon Mapping

Use this mapping consistently. `Arrow*02Icon` is the full arrow; `Arrow*01Icon` is the caret/chevron.

| Phosphor | Hugeicons |
|---|---|
| `Archive` | `ArchiveIcon` |
| `ArrowClockwise` | `RotateClockwiseIcon` |
| `ArrowCounterClockwise` | `RotateLeftIcon` |
| `ArrowLeft` | `ArrowLeft02Icon` |
| `ArrowRight` | `ArrowRight02Icon` |
| `ArrowSquareOut` | `SquareArrowUpRightIcon` |
| `ArrowUpRight` | `ArrowUpRight02Icon` |
| `Bell` | `BellIcon` |
| `Briefcase` | `Briefcase01Icon` |
| `BuildingOffice` | `Building03Icon` |
| `Calendar` | `Calendar03Icon` |
| `CaretDoubleLeft` | `ArrowLeftDoubleIcon` |
| `CaretDown` | `ArrowDown01Icon` |
| `CaretLeft` | `ArrowLeft01Icon` |
| `CaretRight` | `ArrowRight01Icon` |
| `CaretUp` | `ArrowUp01Icon` |
| `ChartBar` | `BarChartIcon` |
| `Check` | `Tick02Icon` |
| `CheckCircle` | `CheckmarkCircle02Icon` |
| `CircleNotch` | `Loading03Icon` |
| `ClipboardText` | `ClipboardIcon` |
| `Clock` | `Clock01Icon` |
| `Copy` | `Copy01Icon` |
| `CurrencyDollar` | `Dollar01Icon` |
| `DotsThree` | `MoreHorizontalIcon` |
| `Download` | `Download01Icon` |
| `EnvelopeSimple` | `Mail01Icon` |
| `Eye` | `ViewIcon` |
| `FileCode` | `FileCodeIcon` |
| `FileText` | `File02Icon` |
| `Files` | `Files01Icon` |
| `FilmSlate` | `Film01Icon` |
| `FloppyDisk` | `FloppyDiskIcon` |
| `Globe` | `Globe02Icon` |
| `Handshake` | `Agreement02Icon` |
| `Heart` | `HeartIcon` |
| `Image` | `Image02Icon` |
| `InstagramLogo` | `InstagramIcon` |
| `Lightning` | `FlashIcon` |
| `Link` | `Link01Icon` |
| `List` | `LeftToRightListBulletIcon` |
| `MagnifyingGlass`, `MagnifyingGlassIcon` | `Search01Icon` |
| `MapPin` | `Location01Icon` |
| `NotePencil` | `NoteEditIcon` |
| `PaperPlaneRight` | `MailSend01Icon` |
| `Pencil`, `PencilSimple` | `Edit02Icon` |
| `Play` | `PlayIcon` |
| `Plus` | `Add01Icon` |
| `PushPin` | `PinIcon` |
| `Quotes` | `QuotesIcon` |
| `Scissors` | `Scissor01Icon` |
| `ShareNetwork` | `Share01Icon` |
| `SignOut` | `Logout01Icon` |
| `SortAscending` | `SortByUp01Icon` |
| `Sparkle` | `SparklesIcon` |
| `SquaresFour` | `GridViewIcon` |
| `Star` | `StarIcon` |
| `Target` | `Target01Icon` |
| `Trash` | `Delete02Icon` |
| `TrendDown` | `TradeDownIcon` |
| `TrendUp` | `TradeUpIcon` |
| `Trophy` | `ChampionIcon` |
| `UploadSimple` | `Upload01Icon` |
| `User` | `UserIcon` |
| `Users` | `UserGroupIcon` |
| `Warning` | `Alert02Icon` |
| `WarningCircle` | `AlertCircleIcon` |
| `X` | `Cancel01Icon` |
| `YoutubeLogo` | `YoutubeIcon` |

## Standard Transformations

Static icons:

```tsx
import { Add01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

<HugeiconsIcon icon={Add01Icon} size={14} className="..." />
```

Dynamic icon data:

```tsx
import type { IconSvgElement } from "@hugeicons/react"

type Item = {
  icon: IconSvgElement
}

<HugeiconsIcon icon={item.icon} size={14} color={item.color} />
```

Replace Phosphor `weight="bold"` with `strokeWidth={2}` where the weight communicates emphasis. Drop `regular`, `fill`, and `duotone` when the mapped free icon has no corresponding variant; preserve existing size and color classes. Keep spinner animation classes on `Loading03Icon`.

---

### Task 1: Record the Failing Migration Invariant

**Files:** No source changes.

**Interfaces:**
- Consumes: current repository state.
- Produces: a reproducible red check that detects remaining Phosphor usage.

- [ ] **Step 1: Run the source audit and confirm it fails the target invariant**

Run:

```bash
rg -l '@phosphor-icons/react' components --glob '*.{ts,tsx}' | wc -l
```

Expected: `55`, proving the zero-import invariant is currently red.

- [ ] **Step 2: Record the typecheck baseline**

Run:

```bash
pnpm typecheck
```

Expected: capture any pre-existing diagnostics before migration; do not fix unrelated failures.

### Task 2: Migrate Shared UI Primitives

**Files:**
- Modify: `components/ui/breadcrumb.tsx`
- Modify: `components/ui/calendar.tsx`
- Modify: `components/ui/checkbox.tsx`
- Modify: `components/ui/dialog.tsx`
- Modify: `components/ui/dropdown-menu.tsx`
- Modify: `components/ui/pagination.tsx`
- Modify: `components/ui/searchable-select.tsx`
- Modify: `components/ui/select.tsx`
- Modify: `components/ui/sheet.tsx`

**Interfaces:**
- Consumes: canonical mapping and static transformation.
- Produces: Phosphor-free shared primitives with unchanged Radix/shadcn behavior.

- [ ] **Step 1: Verify this batch is red**

Run:

```bash
rg -l '@phosphor-icons/react' components/ui --glob '*.{ts,tsx}'
```

Expected: the nine files listed above.

- [ ] **Step 2: Replace imports and render expressions**

Use `HugeiconsIcon` for every icon. Preserve bare-icon sizing through existing parent SVG selectors and preserve `data-icon`, `className`, and Radix indicator placement. Remove the unused pre-existing `SidebarLeftIcon`/`HugeiconsIcon` duplication in `sheet.tsx` by consolidating its imports.

- [ ] **Step 3: Verify the batch**

Run:

```bash
pnpm typecheck
rg '@phosphor-icons/react' components/ui --glob '*.{ts,tsx}'
```

Expected: typecheck has no new diagnostics and the search returns no matches.

### Task 3: Migrate Landing Components

**Files:**
- Modify: `components/modules/Landing/ai-section.tsx`
- Modify: `components/modules/Landing/footer-cta.tsx`
- Modify: `components/modules/Landing/hero.tsx`
- Modify: `components/modules/Landing/herosection.tsx`
- Modify: `components/modules/Landing/made-for.tsx`
- Modify: `components/modules/Landing/pricing.tsx`
- Modify: `components/modules/Landing/split-section.tsx`
- Modify: `components/modules/Landing/stats-section.tsx`
- Modify: `components/modules/Landing/subpage-hero.tsx`
- Modify: `components/modules/Landing/waitlist-form.tsx`

**Interfaces:**
- Consumes: canonical mapping and static transformation.
- Produces: Phosphor-free marketing components.

- [ ] **Step 1: Verify this batch is red**

Run:

```bash
rg -l '@phosphor-icons/react' components/modules/Landing --glob '*.{ts,tsx}'
```

Expected: ten files.

- [ ] **Step 2: Migrate all icons**

Preserve Tailwind-controlled dimensions in `herosection.tsx` and `waitlist-form.tsx`. Drop `weight="fill"` from the sparkle replacement and preserve `animate-spin` on the waitlist loader.

- [ ] **Step 3: Verify the batch**

Run:

```bash
pnpm typecheck
rg '@phosphor-icons/react' components/modules/Landing --glob '*.{ts,tsx}'
```

Expected: no new type errors and no matches.

### Task 4: Migrate CRM Components

**Files:**
- Modify: `components/modules/crm/deals/DealsTable.tsx`
- Modify: `components/modules/crm/deliverables/DealDeliverablesSection.tsx`
- Modify: `components/modules/crm/files/DealFilesSection.tsx`
- Modify: `components/modules/crm/notes/DealNotesSection.tsx`
- Modify: `components/modules/crm/shared/CrmConfirmDialog.tsx`
- Modify: `components/modules/crm/shared/CrmSearchField.tsx`
- Modify: `components/modules/crm/tasks/TaskRowActions.tsx`
- Modify: `components/modules/crm/tasks/TasksEmptyState.tsx`
- Modify: `components/modules/crm/tasks/TasksToolbar.tsx`

**Interfaces:**
- Consumes: existing CRM Header/EmptyState icon-valued JSX props.
- Produces: CRM components consistent with the CRM files already on Hugeicons.

- [ ] **Step 1: Verify this batch is red**

Run:

```bash
rg -l '@phosphor-icons/react' components/modules/crm --glob '*.{ts,tsx}'
```

Expected: nine files.

- [ ] **Step 2: Migrate static and icon-valued props**

Render Hugeicons JSX before passing `actionIcon` or empty-state icons. Preserve `PushPin` color classes and the bare SVG styling contract in `CrmConfirmDialog`.

- [ ] **Step 3: Verify the batch**

Run:

```bash
pnpm typecheck
rg '@phosphor-icons/react' components/modules/crm --glob '*.{ts,tsx}'
```

Expected: no new type errors and no matches.

### Task 5: Migrate Analytics Icon Data and Consumers

**Files:**
- Modify: `components/modules/dashboard/analytics/data.ts`
- Modify: `components/modules/dashboard/analytics/DashboardHeader.tsx`
- Modify: `components/modules/dashboard/analytics/EmptyState.tsx`
- Modify: `components/modules/dashboard/analytics/InsightCard.tsx`
- Modify: `components/modules/dashboard/analytics/InsightsSection.tsx`
- Modify: `components/modules/dashboard/analytics/KpiCard.tsx`
- Modify: `components/modules/dashboard/analytics/PerformanceSection.tsx`
- Modify: `components/modules/dashboard/analytics/RecentContentSection.tsx`
- Modify: `components/modules/dashboard/analytics/Sidebar.tsx`
- Modify: `components/modules/dashboard/AnalyticsDashboard.tsx`

**Interfaces:**
- Consumes: `IconSvgElement`, `PLATFORMS`, and `KpiCard` icon props.
- Produces: Hugeicons icon-data maps and wrapper-based render sites.

- [ ] **Step 1: Verify direct imports are red**

Run:

```bash
rg -l '@phosphor-icons/react' components/modules/dashboard/analytics components/modules/dashboard/AnalyticsDashboard.tsx --glob '*.{ts,tsx}'
```

Expected: ten files.

- [ ] **Step 2: Convert `PLATFORMS` and `KpiCard` types**

Replace Phosphor `Icon` types with `IconSvgElement`. Convert `<platform.icon />` and `<Icon />` patterns to `<HugeiconsIcon icon={...} />`. Keep refresh spin classes, nav SVG sizing, platform colors, and KPI semantic colors.

- [ ] **Step 3: Migrate remaining static and local-map icons**

Apply the canonical mapping to all imports. Local arrays must store Hugeicons icon data, not JSX components.

- [ ] **Step 4: Verify the batch**

Run:

```bash
pnpm typecheck
rg '@phosphor-icons/react' components/modules/dashboard/analytics components/modules/dashboard/AnalyticsDashboard.tsx --glob '*.{ts,tsx}'
```

Expected: no new type errors and no matches.

### Task 6: Migrate Calendar Icon Data and Consumers

**Files:**
- Modify: `components/modules/dashboard/calendar/shared.ts`
- Modify: `components/modules/dashboard/calendar/PostChip.tsx`
- Modify: `components/modules/dashboard/calendar/PostModal.tsx`
- Modify: `components/modules/dashboard/calendar/PostPanel.tsx`
- Modify: `components/modules/dashboard/CalendarPage.tsx`

**Interfaces:**
- Consumes: `PLATFORM_CFG` and `STATUS_CFG`.
- Produces: `IconSvgElement` config entries rendered through `HugeiconsIcon`.

- [ ] **Step 1: Verify direct imports are red**

Run:

```bash
rg -l '@phosphor-icons/react' components/modules/dashboard/calendar components/modules/dashboard/CalendarPage.tsx --glob '*.{ts,tsx}'
```

Expected: four direct-import files.

- [ ] **Step 2: Convert shared maps and all indirect consumers**

Type `icon` entries as `IconSvgElement`. Replace `P.icon`, `C.icon`, and `S.icon` component instantiation with `HugeiconsIcon`. Translate bold status and add icons to `strokeWidth={2}`.

- [ ] **Step 3: Verify the batch**

Run:

```bash
pnpm typecheck
rg '@phosphor-icons/react' components/modules/dashboard/calendar components/modules/dashboard/CalendarPage.tsx --glob '*.{ts,tsx}'
```

Expected: no new type errors and no matches.

### Task 7: Migrate Sponsorship Icon Data and Consumers

**Files:**
- Modify: `components/modules/dashboard/sponsorship/shared.ts`
- Modify: `components/modules/dashboard/sponsorship/DealCard.tsx`
- Modify: `components/modules/dashboard/sponsorship/DealModal.tsx`
- Modify: `components/modules/dashboard/sponsorship/DealPanel.tsx`
- Modify: `components/modules/dashboard/sponsorship/KpiSummary.tsx`
- Modify: `components/modules/dashboard/sponsorship/PipelineHeader.tsx`
- Modify: `components/modules/dashboard/sponsorship/PipelineKanban.tsx`
- Modify: `components/modules/dashboard/overview/PipelineFunnel.tsx`

**Interfaces:**
- Consumes: `STAGE_CFG`.
- Produces: Hugeicons stage/KPI icon data and wrapper render sites.

- [ ] **Step 1: Verify direct imports are red**

Run:

```bash
rg -l '@phosphor-icons/react' components/modules/dashboard/sponsorship --glob '*.{ts,tsx}'
```

Expected: five direct-import files.

- [ ] **Step 2: Convert shared and local maps**

Replace Phosphor `Icon` with `IconSvgElement` in `STAGE_CFG` and KPI config. Update every stage-icon consumer listed above to `HugeiconsIcon`, retaining stage colors and sizes.

- [ ] **Step 3: Verify the batch**

Run:

```bash
pnpm typecheck
rg '@phosphor-icons/react' components/modules/dashboard/sponsorship --glob '*.{ts,tsx}'
```

Expected: no new type errors and no matches.

### Task 8: Migrate Script Components

**Files:**
- Modify: `components/modules/dashboard/scripts/ScriptCard.tsx`
- Modify: `components/modules/dashboard/scripts/ScriptEditorShell.tsx`
- Modify: `components/modules/dashboard/scripts/ScriptEmptyState.tsx`
- Modify: `components/modules/dashboard/scripts/ScriptsPage.tsx`

**Interfaces:**
- Consumes: local icon-data arrays and view-toggle state.
- Produces: Hugeicons script controls with unchanged loading and active-state behavior.

- [ ] **Step 1: Verify this batch is red**

Run:

```bash
rg -l '@phosphor-icons/react' components/modules/dashboard/scripts --glob '*.{ts,tsx}'
```

Expected: four files.

- [ ] **Step 2: Migrate icons and dynamic weight behavior**

Use `strokeWidth={2}` for previously bold icons. Replace the fill/regular view-toggle weight switch with the same Hugeicon plus existing active/inactive color styling. Keep loading animation classes.

- [ ] **Step 3: Verify the batch**

Run:

```bash
pnpm typecheck
rg '@phosphor-icons/react' components/modules/dashboard/scripts --glob '*.{ts,tsx}'
```

Expected: no new type errors and no matches.

### Task 9: Migrate Remaining Dashboard Pages and Overview Consumers

**Files:**
- Modify: `components/modules/dashboard/InvoicesPage.tsx`
- Modify: `components/modules/dashboard/MediaKitPage.tsx`
- Modify: `components/modules/dashboard/overview/DealsRankedTable.tsx`
- Modify: `components/modules/dashboard/overview/InsightCards.tsx`

**Interfaces:**
- Consumes: local invoice/media-kit maps and sponsorship `STAGE_CFG`.
- Produces: remaining dashboard components on Hugeicons.

- [ ] **Step 1: Verify this batch is red**

Run:

```bash
rg -l '@phosphor-icons/react' components/modules/dashboard/InvoicesPage.tsx components/modules/dashboard/MediaKitPage.tsx components/modules/dashboard/overview --glob '*.{ts,tsx}'
```

Expected: four direct-import files.

- [ ] **Step 2: Convert invoice and media-kit map types**

Replace all Phosphor `Icon` types with `IconSvgElement`; render local map values with `HugeiconsIcon`. Update `DealsRankedTable` to render `STAGE_CFG` icon data through the wrapper. Preserve status, platform, and metric colors.

- [ ] **Step 3: Verify the batch**

Run:

```bash
pnpm typecheck
rg '@phosphor-icons/react' components/modules/dashboard/InvoicesPage.tsx components/modules/dashboard/MediaKitPage.tsx components/modules/dashboard/overview --glob '*.{ts,tsx}'
```

Expected: no new type errors and no matches.

### Task 10: Remove Stale Phosphor Dependency Records

**Files:**
- Modify: `package-lock.json`
- Verify: `package.json`
- Verify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: completed source migration.
- Produces: manifests and lockfiles with no Phosphor records.

- [ ] **Step 1: Confirm dependency records are red**

Run:

```bash
rg -n 'phosphor-icons|@phosphor-icons' package.json pnpm-lock.yaml package-lock.json
```

Expected: stale matches only in `package-lock.json`.

- [ ] **Step 2: Remove only the root dependency entry and `node_modules/@phosphor-icons/react` package entry**

Do not regenerate unrelated lockfile versions. Preserve valid JSON.

- [ ] **Step 3: Verify dependency cleanup**

Run:

```bash
node -e 'JSON.parse(require("fs").readFileSync("package-lock.json", "utf8"))'
rg -n 'phosphor-icons|@phosphor-icons' package.json pnpm-lock.yaml package-lock.json
```

Expected: JSON parsing succeeds and the search returns no matches.

### Task 11: Final Verification

**Files:** Verify all modified files.

**Interfaces:**
- Consumes: all migration tasks.
- Produces: evidence that the repository no longer depends on Phosphor.

- [ ] **Step 1: Prove the original invariant is green**

Run:

```bash
rg '@phosphor-icons/react|phosphor-react' . --glob '*.{ts,tsx,js,jsx,json,yaml,yml}'
```

Expected: no matches.

- [ ] **Step 2: Run static checks**

Run:

```bash
pnpm typecheck
pnpm lint
```

Expected: both commands pass, or only pre-existing diagnostics captured in Task 1 remain.

- [ ] **Step 3: Run the production build**

Run:

```bash
pnpm build
```

Expected: successful Prisma generation and Next.js production build.

- [ ] **Step 4: Review the final diff**

Run:

```bash
git diff --check
git diff --stat
git status --short
```

Expected: no whitespace errors; only scoped migration files plus the approved spec/plan and pre-existing user changes are present.
