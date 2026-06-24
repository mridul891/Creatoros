# Activity Timeline Module

## Purpose

The Activity Timeline module is the platform audit stream for CreatorOS. It records meaningful system events automatically after successful mutations so users always have a trusted historical record without manual data entry.

The module is generic by design and supports current CRM entities (Brands, Contacts) while remaining extensible for future modules (Deals, Deliverables, Tasks, Invoices, Payments, Files, Notes).

## Business Rules

1. Activities are system-generated only. Users never create timeline entries manually.
2. Activities are written only after successful mutation operations.
3. Activity writes are atomic with mutation writes inside the same database transaction.
4. Ownership is always enforced by `userId` scoping and brand ownership validation for brand-level timelines.
5. Brand delete flow maps to MVP semantics as `BrandArchived` activity.

## Activity Types (MVP)

### Brand Events

- `BrandCreated`
- `BrandUpdated`
- `BrandArchived`

### Contact Events

- `ContactCreated`
- `ContactUpdated`
- `ContactArchived`
- `ContactPrimaryChanged`

## Data Flow

1. User submits mutation in existing module UI (Brand/Contact).
2. Server action validates auth/input and calls domain service.
3. Domain service validates ownership and business invariants.
4. Domain service performs mutation write.
5. Domain service calls `recordActivity(...)` in the same transaction.
6. Transaction commits; server action revalidates paths.
7. Brand detail page fetches `listBrandActivitiesAction(...)` and renders timeline.

## Architecture Decisions

1. **Centralized writer:** `lib/crm/activity/activityService.ts` is the single write/read abstraction for activity data.
2. **Generic activity shape:** Activity records store `type`, `entityType`, `entityId`, optional related IDs, title/description, and JSON metadata.
3. **Immutable event records:** Activity entries are append-only with `createdAt` sorting.
4. **Reusable timeline UI:** `components/modules/crm/activity/*` is entity-agnostic and can be reused by future detail pages.
5. **Pagination-ready read contract:** Activity list payload includes page metadata for scalable loading and future infinite scrolling migration.

## Future Integrations

New modules should only call `recordActivity(tx, input)` from their service layer after successful writes. No module should implement custom activity persistence.

Planned integrations:

- Deals
- Deliverables
- Tasks
- Files
- Notes
- Calendar
- Invoices
- Payments

## 2026-06 Activity Integration Update

Activity is now emitted for:

- DeliverableCreated / DeliverableUpdated / DeliverableSubmitted / DeliverableApproved / DeliverablePublished / DeliverableNeedsRevision
- NoteAdded / NotePinned
- FileUploaded / FileRenamed / FileArchived
- InvoiceGenerated / PaymentReceived (schema-level readiness)

## Performance Considerations

1. Queries use descending `createdAt` ordering with dedicated composite indexes.
2. Timeline reads are paginated (default page size 20, max 50).
3. Ownership-filtered query shape (`userId` + `brandId`) avoids broad scans.
4. Metadata payloads should remain concise to keep list reads lightweight.
5. Hook-driven pagination layer allows straightforward upgrade to infinite-scroll UX when needed.
