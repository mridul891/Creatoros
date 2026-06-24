# Dashboard Command Center Architecture

## Vision

Dashboard is the daily operating surface for campaign execution.

## Sections

- Today’s Tasks
- Today’s Deliverables
- Deals Waiting For Response
- Deals Near Deadline
- Payments Expected
- Overdue Payments
- Quick Actions
- Recent Activity

## Runtime Layers

- Action: `app/action/dashboardActions.ts`
- Service: `lib/crm/dashboard/commandCenterService.ts`
- UI: `components/modules/dashboard/CommandCenterPage.tsx`
- Route: `app/dashboard/page.tsx`

## Performance Strategy

- Server-side aggregation queries
- Parallel query execution
- Small payload summary cards + paged activity list for larger data
