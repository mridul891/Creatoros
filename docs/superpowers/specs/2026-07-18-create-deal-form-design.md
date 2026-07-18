# Create Deal Form Redesign

## Goal

Replace the cramped Create Deal modal with a premium, task-focused CRM form that is easier to scan, navigate, and complete. The redesign belongs to Slice S1.1 (deal pipeline) and preserves the current deal data contract.

## Scope

- Redesign `DealForm` and the shared `CrmFormDialog` layout it uses.
- Preserve all existing deal fields and server action contracts.
- Keep the existing priority values: Low, Medium, and High. No schema changes.
- Reuse existing Dialog, Button, Field, Input, Select, Textarea, Calendar, and Badge primitives.
- Add local client-side readiness checks using the existing deal validation helper; server validation remains authoritative.

## Layout and hierarchy

- The dialog is 720–800px wide on desktop, with a viewport-safe mobile width and a maximum height of 92vh.
- It has a 24px mobile / 32px desktop content gutter, a 12–16px dialog radius, subtle border, and soft shadow.
- Header and footer remain visible while the form body scrolls.
- The body is organized into five named sections separated by restrained dividers:
  1. Campaign Details — Campaign Name, Brand, Contact
  2. Deal Information — Deal Value, Currency, Stage, Priority
  3. Timeline — Start Date, Due Date, Payment Due
  4. Payment — Payment Terms
  5. Additional Information — Campaign Description, Internal Notes
- Each section uses a small, clear heading and, where useful, one short description. Sections do not use nested card containers.
- Fields use a single column on mobile and a two-column grid from the small breakpoint upward. Campaign Description and Internal Notes always span the full section width.

## Controls

- Every field retains a visible label above its control. Placeholders supplement labels only with useful examples.
- Inputs and select triggers are 44–48px high, use the existing design tokens, transition in 150–200ms, and expose the shared focus ring.
- Brand and Contact use a keyboard-accessible searchable selection control:
  - Brand filters the supplied brand options.
  - Changing Brand clears Contact.
  - Contact is disabled until a Brand is selected, then filters the contacts already passed into `DealForm`.
  - Contact remains optional and has a “No contact” choice.
- Stage remains a select; each option and the selected value include the corresponding existing semantic stage badge.
- Priority becomes a three-option segmented pill selector using the existing Low/Medium/High semantic colors. It remains keyboard-operable and has an explicit accessible label.
- Deal Value accepts numeric input and displays the selected currency symbol/prefix while storing the existing unformatted numeric string.
- The three timeline fields use calendar popovers built with the existing Calendar primitive. They continue to store `YYYY-MM-DD` strings, so no server or database contract changes.
- Payment Terms is a full-width multiline input. Campaign Description and Internal Notes are full-width multiline inputs, with notes explicitly labeled as internal.

## Validation and feedback

- Required client-side readiness fields are Brand, Campaign Name, Deal Value, Currency, Stage, and Priority; these match the server validation requirements.
- The Create Deal button remains disabled until those required values are locally valid. Optional date relationships and server validation remain available on submit.
- Inline field errors retain the existing server messages and reserve consistent space to avoid layout jumps.
- A form-level error remains inline above the footer. No browser alerts are introduced.
- The existing success toast and close/reset flow are retained after a successful creation.
- The primary action shows a spinner and “Creating…” while the existing mutation is running; all submit/cancel actions observe the submitting state.

## Accessibility and keyboard behavior

- The existing Radix Dialog preserves Escape-to-close, focus trapping, and normal Tab navigation.
- The form is a semantic `<form>` so Enter-based assistive technology behavior and native submit semantics work consistently.
- Cmd+Enter on macOS and Ctrl+Enter on other platforms invoke submission when the form is valid and not submitting.
- Search, calendar, stage, and priority controls must expose labels, selected states, focus indicators, and keyboard navigation.
- Disabled contact and submit states communicate why they are unavailable.

## Responsive and motion behavior

- Desktop uses a two-column grid; narrow viewports stack all fields without clipping.
- Dialog content may scroll while its header/footer remain accessible.
- The dialog and popovers use the existing Radix portal behavior so menus and calendars are not clipped by the scrolling body.
- State transitions use 150–200ms color, opacity, and transform animations only. Reduced-motion preferences remove nonessential motion.

## Files and tests

- Modify `components/modules/crm/deals/DealForm.tsx`.
- Modify `components/modules/crm/shared/CrmFormDialog.tsx` only to add the form-aware structure and larger responsive dialog shell needed by this form.
- Add reusable CRM-local helpers only when an existing primitive cannot provide the required searchable select or date picker behavior.
- Add tests before implementation for form readiness and any extracted value/date formatting helper.
- Verify with typecheck, lint, and targeted tests; then smoke-test keyboard submit, responsive layout, inline validation, and success/error states.
