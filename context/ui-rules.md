# UI Rules — DealFlow

> UX principles and interaction patterns for DealFlow.
> Read this before building any UI component.
> These rules exist to prevent inconsistent UX and wasted iteration time.

---

## Core UX Principles

### 1. Speed is a feature
Creators are busy. Every interaction must feel instant.
- Optimistic UI updates on stage changes (update locally, sync in background)
- Loading skeletons, not blank states or spinners where possible
- Forms must be submittable with keyboard only (no mouse-only interactions)

### 2. Mobile-first, not mobile-afterthought
Build for 390px first. Expand to desktop.
- Pipeline board stacks vertically on mobile (1 column per stage, scrollable horizontally OR collapsed list)
- Forms are full-screen sheets on mobile (not modal dialogs)
- All tap targets minimum 44×44px

### 3. The dashboard is the app
The pipeline board is the homepage. Users should land on it on every login.
- Never land on a "welcome" or "getting started" page after onboarding is complete
- Sidebar navigation always visible on desktop (collapsible on mobile)

### 4. Empty states teach, they don't apologise
When a user has no data, show them what to do — not "No deals found."
- Empty pipeline: "Add your first deal → [Add Deal]" with a brief explanation
- Empty earnings: "Your earnings appear here once you mark a deal as paid."
- Empty brand list: "Add brands you've worked with or been contacted by → [Add Brand]"

### 5. Feedback for every action
- Every form submission shows success or error feedback (toast notification)
- Every destructive action (delete deal, delete brand) requires a confirmation dialog
- Every async operation shows a loading state

---

## Layout Rules

### Sidebar Navigation
```
Width: 240px (desktop) / full-screen drawer (mobile)
Items:
  - Pipeline (icon: LayoutKanban) ← default landing page
  - Brands (icon: Building2)
  - Invoices (icon: FileText)
  - Earnings (icon: TrendingUp)
  - Templates (icon: Mail)
  - Settings (icon: Settings)
```
Active state: `bg-primary-50 text-primary-700 font-medium`
Default state: `text-gray-600 hover:bg-gray-100 hover:text-gray-900`

### Page Header Pattern
Every page has:
```
[Page Title]                    [Primary Action Button]
[Subtitle or breadcrumb]
[Filter/search bar if relevant]
---divider---
[Page content]
```

### Card Grid
- Desktop: `grid-cols-3` or `grid-cols-4` for dashboard widgets
- Tablet: `grid-cols-2`
- Mobile: `grid-cols-1`

---

## Pipeline Board Rules

### Column Header
```
[Stage Name]                    [Deal count badge]
```
Column header is sticky at the top as the column scrolls.

### Deal Card
Compact card (not overwhelming). Show:
- **Line 1:** Brand name (semibold) + platform icons
- **Line 2:** Deliverable (1 line, truncated)
- **Line 3:** Agreed rate | Next deadline (most urgent)
- **Bottom:** Stage badge (only shown on search/list view, not needed on Kanban)

**Card states:**
- Default: `bg-white border border-gray-200 shadow-sm rounded-lg`
- Hover: `shadow border-gray-300`
- Dragging: `shadow-lg rotate-1 opacity-90 ring-2 ring-primary-400`
- Overdue: Red left border `border-l-4 border-l-red-500`

### Stage Column
- Min width: `280px` (horizontal scroll on mobile)
- Max width: `320px`
- Column background: `bg-gray-50`
- Cards have `gap-3` between them, `p-3` padding in column

---

## Forms

### Add Deal Form
Display as a **slide-over panel** (right-side drawer), not a page.
- Width: `max-w-lg` (desktop), full-width (mobile)
- Required fields marked with `*`
- Optional fields grouped in a collapsible "Additional Details" section
- Submit button: "Add Deal" (primary) | Cancel (ghost)

### Field Validation
- Validate on blur (not on every keystroke)
- Error message appears below the field in `text-red-600 text-sm`
- Successful field gets no visual indicator (don't be noisy)
- Required fields: show error only after first submit attempt

### Date Fields
- Use a date picker component (not raw `<input type="date">` — inconsistent across browsers)
- Show relative date alongside: "Jun 15 · in 8 days"
- Overdue dates shown in red: "Jun 1 · 6 days overdue"

---

## Buttons

### Hierarchy
```
Primary:     bg-primary-500 hover:bg-primary-600 text-white
Secondary:   bg-white border border-gray-300 hover:bg-gray-50 text-gray-700
Destructive: bg-red-500 hover:bg-red-600 text-white
Ghost:       bg-transparent hover:bg-gray-100 text-gray-600
Link:        text-primary-600 hover:underline
```

### Sizes
```
sm:      px-3 py-1.5 text-sm rounded-md
default: px-4 py-2 text-sm rounded-md
lg:      px-5 py-2.5 text-base rounded-lg
icon:    p-2 rounded-md (square)
```

### Loading State
- Replace button label with a spinner + "Saving..." text
- Disable the button during loading (prevent double-submit)
- Never remove the button during loading

---

## Invoice Generator UX

1. User is on a deal card in "Live" or later stage
2. "Generate Invoice" button appears in the deal detail view
3. Click → invoice preview panel opens (side drawer)
4. Preview shows the PDF layout rendered in HTML (not actual PDF at this step — faster)
5. User can edit: due date, add extra line items, toggle tax
6. "Download PDF" → generates and downloads
7. "Send via Email" → prompts for recipient email, sends via Resend
8. Status automatically updates to "Invoice Sent" after sending

---

## Notifications & Reminders (In-App)

### Bell Icon (Header)
- Shows unread count badge (red, max "9+")
- Click → dropdown with last 10 notifications
- Each notification: icon + message + relative time + "Mark read" action

### In-App Banner (Exclusivity End)
```
┌─────────────────────────────────────────────────────────┐
│ ⚠️  Exclusivity with Nike ends in 3 days (Jun 10)       │
│     [View Deal]                              [Dismiss]   │
└─────────────────────────────────────────────────────────┘
```
Appears at top of pipeline board. Dismissible. Persists until dismissed or date passes.

### Overdue Deal Card Treatment
- Red left border on deal card
- Overdue label in red: "Payment 6 days overdue"
- Overdue deals bubble to top of their stage column

---

## Data Tables (Invoices, Brand List)

### Column Headers
- Sortable columns: show sort icon (chevron) on hover
- Current sort column: shows active direction (↑ or ↓)
- Non-sortable: no icon

### Rows
- Row height: `h-12` (48px)
- Hover state: `hover:bg-gray-50`
- Selected state: `bg-primary-50`
- Clickable rows have `cursor-pointer`

### Empty Table
- Centered message + CTA button, vertically centred in the table body
- Height: `min-h-[300px]` to not collapse oddly

---

## Error & Loading States

### Loading Skeleton
Use shimmer placeholders that match the shape of the content:
```tsx
// Deal card skeleton
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
  <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
  <div className="h-3 bg-gray-200 rounded w-1/3" />
</div>
```

### Error State (Page Level)
```
[Error icon]
Something went wrong
[Short description]
[Retry button]
```

### Error State (Empty / No Results)
Not an error — use empty state pattern (see Core UX Principle 4).

---

## Accessibility Minimum Requirements

- All form fields have associated `<label>` elements (not just placeholder)
- All icon-only buttons have `aria-label`
- All modal dialogs trap focus (use Radix Dialog — it handles this)
- All drag-and-drop interactions have keyboard alternatives
- Colour is never the only indicator of status (always pair with text or icon)
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text
