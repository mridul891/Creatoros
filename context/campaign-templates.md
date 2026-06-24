# Campaign Templates Architecture

## Goal

Apply reusable campaign plans to a Deal with one action.

## Data Model

- `CampaignTemplate`
- `CampaignTemplateTask`
- `CampaignTemplateDeliverable`

## Initial System Template

- Instagram Reel Campaign
  - Creates task checklist
  - Creates deliverable entries
  - Seeds a pinned kickoff note

## Runtime Layers

- Service: `lib/crm/templates/templateService.ts`
- Actions: `app/action/templateActions.ts`
- UI integration: `components/modules/crm/deals/workspace/DealTemplateQuickApply.tsx`

## Design Constraints

- Template application must be deal-scoped.
- Template operations enforce ownership.
- Template application logs activity as system-generated event.
