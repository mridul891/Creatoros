# Deliverables Module Architecture

## Purpose

Deliverables model brand-facing campaign obligations inside the Deal Workspace.

## Boundaries

- Deliverables are external outputs expected by the brand.
- Tasks remain internal execution steps.
- A deliverable can be fulfilled by one or more tasks over time.

## Data Model

- Prisma model: `Deliverable`
- Ownership: `userId` + `dealId`
- Workflow fields:
  - `status`: Draft, Ready, Submitted, NeedsRevision, Approved, Published
  - `approvalStatus`: NotSubmitted, Pending, ChangesRequested, Approved
  - `submissionUrl`, `publishedUrl`, `revisionCount`

## Runtime Layers

- Validation: `lib/crm/deliverables/deliverableValidation.ts`
- Service: `lib/crm/deliverables/deliverableService.ts`
- Actions: `app/action/deliverableActions.ts`
- Hooks: `hooks/useDealDeliverables.ts`, `hooks/useDeliverableMutations.ts`
- UI: `components/modules/crm/deliverables/DealDeliverablesSection.tsx`

## Activity Events

- DeliverableCreated
- DeliverableUpdated
- DeliverableSubmitted
- DeliverableApproved
- DeliverablePublished
- DeliverableNeedsRevision
