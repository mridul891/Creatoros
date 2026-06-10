# Designs

This folder contains design assets for DealFlow.

## Contents

- **Wireframes** — Low-fidelity screens for key flows
- **Mockups** — High-fidelity designs for pipeline board, deal card, invoice preview
- **Brand assets** — Logo, colour swatches, font samples

## Design References

For the design system tokens (colours, typography, spacing), see:
→ `context/ui-tokens.md`

For interaction rules and UX patterns, see:
→ `context/ui-rules.md`

For the component inventory, see:
→ `context/ui-registry.md`

## Key Screens to Design (Priority Order)

1. **Pipeline Board** — The homepage. 8-column Kanban with deal cards.
2. **Deal Detail Panel** — Slide-over with all deal fields, notes, files.
3. **Add Deal Form** — Slide-over form, required + optional sections.
4. **Invoice Preview** — Clean professional invoice layout.
5. **Earnings Dashboard** — Metric cards + revenue chart.
6. **Onboarding Flow** — 3 steps: platforms → first deal → set deadline.
7. **Settings Page** — Profile, notification preferences, billing.

## Design Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| — | Pipeline board is the default landing page | Core habit-forming feature; users should see it every login |
| — | Slide-overs instead of full-page forms | Keeps context visible; faster perceived navigation |
| — | No dark mode for MVP | Scope control; add in V2 |
