# Future Module Readiness Roadmap

## Architectural Contracts Added

- Invoices and Payments schema placeholders
- Notifications schema placeholders
- Integration account schema placeholders (Instagram/YouTube)
- Future module TypeScript contracts in `types/futureModules.ts`

## Planned Modules (Not Fully Implemented)

- Calendar
- Notifications center
- Invoices and Payments workspace tabs
- Instagram and YouTube sync
- Media Kit
- AI Assistant

## No-Redesign Promise

Deal remains aggregate root for campaign workspace modules. New modules attach as deal-scoped entities or user-scoped support entities without replacing existing Deal/Task/Activity foundations.
