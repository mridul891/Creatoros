# UI Registry — DealFlow

> The single source of truth for all UI components in DealFlow.
> **Before creating a new component, check if it already exists here.**
> **After creating a new component, add it here.**

---

## How to Use This Registry

1. Search for the component you need (Cmd+F)
2. If it exists → use it from the path listed. Do not create a duplicate.
3. If it doesn't exist → create it, then add it to this file.

---

## Base UI Components (`components/ui/`)

These are the raw design system primitives. Use these to build feature components.

| Component | Path | Description | Props |
|---|---|---|---|
| `Button` | `components/ui/Button.tsx` | Primary action button | `variant` (primary/secondary/ghost/destructive), `size` (sm/md/lg), `loading`, `disabled` |
| `Input` | `components/ui/Input.tsx` | Text input field | `label`, `error`, `hint`, `required` |
| `Textarea` | `components/ui/Textarea.tsx` | Multi-line text input | `label`, `error`, `rows` |
| `Select` | `components/ui/Select.tsx` | Dropdown select (Radix) | `label`, `options`, `error`, `placeholder` |
| `DatePicker` | `components/ui/DatePicker.tsx` | Date picker with calendar | `label`, `value`, `onChange`, `minDate`, `showRelative` |
| `MultiSelect` | `components/ui/MultiSelect.tsx` | Multi-value select | `label`, `options`, `values`, `onChange` (used for platforms) |
| `Badge` | `components/ui/Badge.tsx` | Status/tag badge | `variant` (stage key), `size` |
| `Card` | `components/ui/Card.tsx` | Container card | `padding`, `hover`, `className` |
| `Modal` | `components/ui/Modal.tsx` | Dialog modal (Radix) | `open`, `onClose`, `title`, `description` |
| `SlideOver` | `components/ui/SlideOver.tsx` | Side drawer panel | `open`, `onClose`, `title`, `side` (left/right) |
| `Skeleton` | `components/ui/Skeleton.tsx` | Shimmer loading placeholder | `className`, `count` |
| `Toast` | — | Via `sonner` library — no custom component | Use `toast.success()`, `toast.error()` directly |
| `Avatar` | `components/ui/Avatar.tsx` | User/brand avatar | `name`, `src`, `size` |
| `Tooltip` | `components/ui/Tooltip.tsx` | Hover tooltip (Radix) | `content`, `side` |
| `DropdownMenu` | `components/ui/DropdownMenu.tsx` | Contextual dropdown (Radix) | `trigger`, `items` |
| `Tabs` | `components/ui/Tabs.tsx` | Tab navigation (Radix) | `tabs`, `defaultTab` |
| `EmptyState` | `components/ui/EmptyState.tsx` | Empty state with CTA | `title`, `description`, `action`, `icon` |
| `ConfirmDialog` | `components/ui/ConfirmDialog.tsx` | Destructive action confirmation | `open`, `title`, `description`, `onConfirm`, `onCancel` |
| `StarRating` | `components/ui/StarRating.tsx` | 1–5 star rating input/display | `value`, `onChange`, `readOnly` |
| `CurrencyInput` | `components/ui/CurrencyInput.tsx` | Numeric input with currency symbol | `currency`, `value`, `onChange`, `label` |

---

## Layout Components (`components/`)

| Component | Path | Description |
|---|---|---|
| `Sidebar` | `components/Sidebar.tsx` | Main app navigation sidebar |
| `Header` | `components/Header.tsx` | Top bar with notifications + user menu |
| `NotificationBell` | `components/NotificationBell.tsx` | Bell icon with unread count + dropdown |
| `PageHeader` | `components/PageHeader.tsx` | Page title + subtitle + primary action |
| `ExclusivityBanner` | `components/ExclusivityBanner.tsx` | Dismissible banner for exclusivity end alerts |

---

## Deal Components (`components/deals/`)

| Component | Path | Description | Status |
|---|---|---|---|
| `PipelineBoard` | `components/deals/PipelineBoard.tsx` | Full Kanban board with drag-and-drop | ⬜ Not built |
| `StageColumn` | `components/deals/StageColumn.tsx` | Individual pipeline stage column | ⬜ Not built |
| `DealCard` | `components/deals/DealCard.tsx` | Compact deal card (shown on board) | ⬜ Not built |
| `DealCardSkeleton` | `components/deals/DealCardSkeleton.tsx` | Loading skeleton for deal card | ⬜ Not built |
| `DealDetailPanel` | `components/deals/DealDetailPanel.tsx` | Full deal detail view (slide-over) | ⬜ Not built |
| `AddDealForm` | `components/deals/AddDealForm.tsx` | Form to create a new deal | ⬜ Not built |
| `EditDealForm` | `components/deals/EditDealForm.tsx` | Form to edit existing deal | ⬜ Not built |
| `DealNotes` | `components/deals/DealNotes.tsx` | Timestamped notes thread for a deal | ⬜ Not built |
| `DealFiles` | `components/deals/DealFiles.tsx` | File attachments (PDF upload/download) | ⬜ Not built |
| `PlatformIcons` | `components/deals/PlatformIcons.tsx` | Row of platform icons (YouTube, IG, TikTok) | ⬜ Not built |
| `StageBadge` | `components/deals/StageBadge.tsx` | Coloured pipeline stage badge | ⬜ Not built |
| `DeadlineLabel` | `components/deals/DeadlineLabel.tsx` | Date + relative time + overdue indicator | ⬜ Not built |
| `StageUpdateButton` | `components/deals/StageUpdateButton.tsx` | One-click advance/change stage | ⬜ Not built |

---

## Invoice Components (`components/invoices/`)

| Component | Path | Description | Status |
|---|---|---|---|
| `InvoiceList` | `components/invoices/InvoiceList.tsx` | Table of all invoices with status + actions | ⬜ Not built |
| `InvoiceRow` | `components/invoices/InvoiceRow.tsx` | Single invoice row | ⬜ Not built |
| `InvoicePreview` | `components/invoices/InvoicePreview.tsx` | HTML preview of invoice before PDF generation | ⬜ Not built |
| `InvoicePDF` | `components/invoices/InvoicePDF.tsx` | react-pdf Document component | ⬜ Not built |
| `GenerateInvoiceButton` | `components/invoices/GenerateInvoiceButton.tsx` | Triggers invoice generation flow | ⬜ Not built |
| `InvoiceStatusBadge` | `components/invoices/InvoiceStatusBadge.tsx` | Draft/Sent/Paid/Overdue badge | ⬜ Not built |
| `InvoiceActions` | `components/invoices/InvoiceActions.tsx` | Download, Send, Mark Paid actions | ⬜ Not built |

---

## Brand Components (`components/brands/`)

| Component | Path | Description | Status |
|---|---|---|---|
| `BrandList` | `components/brands/BrandList.tsx` | Searchable table of brands | ⬜ Not built |
| `BrandCard` | `components/brands/BrandCard.tsx` | Brand summary card (optional grid view) | ⬜ Not built |
| `BrandDetailPanel` | `components/brands/BrandDetailPanel.tsx` | Brand detail slide-over (collaboration history) | ⬜ Not built |
| `AddBrandForm` | `components/brands/AddBrandForm.tsx` | Form to add/edit a brand contact | ⬜ Not built |
| `BrandSearchBar` | `components/brands/BrandSearchBar.tsx` | Search + filter bar for brand list | ⬜ Not built |
| `CollaborationHistory` | `components/brands/CollaborationHistory.tsx` | List of deals linked to a brand | ⬜ Not built |

---

## Dashboard / Earnings Components (`components/dashboard/`)

| Component | Path | Description | Status |
|---|---|---|---|
| `MetricCard` | `components/dashboard/MetricCard.tsx` | Single KPI card (value + label + delta) | ⬜ Not built |
| `EarningsChart` | `components/dashboard/EarningsChart.tsx` | Monthly revenue bar chart (Recharts) | ⬜ Not built |
| `OutstandingInvoices` | `components/dashboard/OutstandingInvoices.tsx` | List of unpaid invoices | ⬜ Not built |
| `TopBrands` | `components/dashboard/TopBrands.tsx` | Top brands by total paid | ⬜ Not built |
| `IncomeByPlatform` | `components/dashboard/IncomeByPlatform.tsx` | Pie/bar breakdown by platform | ⬜ Not built |
| `RateHistoryChart` | `components/dashboard/RateHistoryChart.tsx` | Rate trend line chart | ⬜ Not built |

---

## Email Template Components (`lib/resend/templates/`)

| Component | Path | Description | Status |
|---|---|---|---|
| `ContentDueReminder` | `lib/resend/templates/ContentDueReminder.tsx` | Email: content due date approaching | ⬜ Not built |
| `GoLiveReminder` | `lib/resend/templates/GoLiveReminder.tsx` | Email: go-live date approaching | ⬜ Not built |
| `PaymentDueReminder` | `lib/resend/templates/PaymentDueReminder.tsx` | Email: payment due date approaching | ⬜ Not built |
| `PaymentOverdueAlert` | `lib/resend/templates/PaymentOverdueAlert.tsx` | Email: payment is overdue | ⬜ Not built |
| `ExclusivityEndReminder` | `lib/resend/templates/ExclusivityEndReminder.tsx` | Email: exclusivity window ending | ⬜ Not built |
| `InvoiceEmail` | `lib/resend/templates/InvoiceEmail.tsx` | Email with invoice attached | ⬜ Not built |

---

## Status Legend

| Symbol | Meaning |
|---|---|
| ⬜ Not built | Component doesn't exist yet |
| 🔨 In progress | Currently being built |
| ✅ Done | Built, tested, and working |
| ⚠️ Needs review | Built but has known issues |

---

## CRM Workspace Components (`components/modules/crm/`)

| Component | Path | Description | Status |
|---|---|---|---|
| `DealWorkspaceHeader` | `components/modules/crm/deals/workspace/DealWorkspaceHeader.tsx` | Deal workspace header with actions and summary cards | ✅ Done |
| `DealWorkspaceTabs` | `components/modules/crm/deals/workspace/DealWorkspaceTabs.tsx` | URL-backed modular tab shell for deal workspace | ✅ Done |
| `DealOverviewSection` | `components/modules/crm/deals/workspace/DealOverviewSection.tsx` | Workspace overview panel with template quick-apply | ✅ Done |
| `DealTemplateQuickApply` | `components/modules/crm/deals/workspace/DealTemplateQuickApply.tsx` | Apply campaign templates to active deal | ✅ Done |
| `DealDeliverablesSection` | `components/modules/crm/deliverables/DealDeliverablesSection.tsx` | Deliverables list/filter/create/edit/archive UI | ✅ Done |
| `DeliverableForm` | `components/modules/crm/deliverables/DeliverableForm.tsx` | Deliverable create/edit form dialog | ✅ Done |
| `DeliverablesTable` | `components/modules/crm/deliverables/DeliverablesTable.tsx` | Deliverables table with workflow actions | ✅ Done |
| `DealNotesSection` | `components/modules/crm/notes/DealNotesSection.tsx` | Notes workspace with autosave, search, and pinning | ✅ Done |
| `DealFilesSection` | `components/modules/crm/files/DealFilesSection.tsx` | Deal file metadata workspace (upload/rename/archive) | ✅ Done |

---

## Adding a New Component

When you create a new component, add a row to the appropriate section above with:
- Component name
- File path
- One-line description
- Props (for base UI components)
- Status (start at 🔨 In progress, move to ✅ Done when tested)
