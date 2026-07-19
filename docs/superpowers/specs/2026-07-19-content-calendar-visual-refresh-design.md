# Content Calendar Visual Refresh

## Goal

Improve the existing `/dashboard/calendar` surface so the calendar uses the full available dashboard width, remains readable at smaller viewport sizes, and follows DealFlow's restrained blue product palette.

## Scope

- Restyle `components/modules/dashboard/CalendarPage.tsx` and its calendar-specific presentation components only where needed.
- Preserve current post data, filtering, month navigation, selection, create, edit, delete, and status-change behavior.
- Do not change backend, authentication, routing, or database behavior.

## Visual Direction

Use the existing DealFlow product tokens. Blue is reserved for the primary action, active filters, keyboard focus, and the current day. Published, scheduled, and draft posts use accessible semantic green, amber, and neutral treatments. Platform identity remains visible through icons but does not dominate the calendar.

The interface should feel operational and easy to scan: neutral surfaces, clear borders, compact typography, and no decorative gradients, glass effects, or unnecessary motion.

## Layout

- Remove the page-level maximum-width constraint so the content fills the dashboard's available width.
- Use standard responsive page padding.
- Allow the header, statistics, navigation, and filter controls to wrap without overlap.
- Make the calendar container `w-full`.
- Keep seven useful day columns on narrow screens through a horizontally scrollable calendar viewport with a sensible minimum grid width.
- Use consistent day-cell heights and improve weekend, hover, and current-day differentiation.

## Components and States

- Header: clear title/subtitle hierarchy and one primary “New Post” action.
- Statistics: compact responsive summary items with semantic icons and readable labels.
- Toolbar: grouped month navigation and segmented platform/status filters with visible hover, active, and focus states.
- Calendar cells: full-cell add affordance on hover/focus, readable date marker, and compact post chips.
- Upcoming list: align its status and action styling with the calendar's semantic vocabulary.
- Existing dialogs and post actions remain unchanged unless a small style adjustment is required for consistency.

## Accessibility and Responsive Behavior

- Maintain at least 4.5:1 contrast for normal text.
- Add visible `focus-visible` states to interactive controls.
- Keep touch targets practical on mobile.
- Do not rely on hover for the only way to add a post; the primary action remains available and cell actions remain keyboard reachable.
- Use short 150–200 ms state transitions and honor reduced-motion preferences through existing global behavior or nonessential instant transitions.

## Verification

- Run lint/type checks relevant to changed files.
- Verify `/dashboard/calendar` at desktop width and around 390 px mobile width.
- Confirm the calendar fills the available dashboard content box on desktop.
- Smoke-test month navigation, filters, opening a post, creating a post, and editing a post.

## Out of Scope

- Persisting seed posts to the backend.
- Drag-and-drop scheduling.
- Week or agenda views.
- Changes to the dashboard shell or sidebar.
