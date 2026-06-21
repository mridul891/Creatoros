# Brand Contacts Module

## Module Overview

The Brand Contacts module extends the existing Brands CRM so each brand can store and operate on real stakeholder records (partnership manager, marketing lead, founder, agency rep). A contact is always scoped to:

`Authenticated User` -> `Owned Brand` -> `Owned Contact`

The module is designed as a production-safe dependency for future deal execution workflows.

## Data Flow

1. User opens brand detail page.
2. Server page fetches:
   - brand metadata (`getBrandAction`)
   - active contacts list (`listContactsByBrandAction`)
3. `BrandContactsSection` handles interactive UX:
   - search/filter
   - create/edit modal submissions
   - archive confirmation
4. Client submits mutations through server actions:
   - `createContactAction`
   - `updateContactAction`
   - `archiveContactAction`
5. Server actions delegate to contact service layer (`contactService.ts`).
6. Service layer enforces:
   - ownership checks
   - duplicate protection
   - primary-contact invariant
   - brand primary-contact snapshot sync
7. Server action revalidates related paths and returns structured result payloads.

## Relationships

## Ownership Hierarchy

- `User` has many `Brand`
- `Brand` has many `Contact`
- `User` has many `Contact` (denormalized ownership key for fast authorization and RLS-friendly policy design)

## Contact Cardinality

- Each contact belongs to exactly one brand.
- A contact cannot exist without a brand.
- Contact operations require both `brandId` and ownership validation.

## Business Rules

1. Soft deletion only:
   - `status` = `Active | Archived`
   - `archivedAt` set when archived
2. Primary-contact invariant:
   - at most one active primary contact per brand
   - setting one primary unsets all other active primaries in the brand
3. Duplicate prevention per brand (active contacts):
   - same normalized name is blocked
   - same normalized email is blocked
4. Input hygiene:
   - trim whitespace
   - normalize case for duplicate checks
   - bounded field lengths
5. Security:
   - every read/write validates authenticated user and owned brand/contact scope
   - no client-provided ownership trust

## Architectural Decisions

## Schema

`Contact` model includes:

- `id`, `userId`, `brandId`
- `name`, `normalizedName`
- `email`, `normalizedEmail`
- `phoneNumber`, `jobTitle`, `notes`
- `isPrimary`, `status`, `archivedAt`
- `createdAt`, `updatedAt`

Indexes are optimized for:

- brand-level list queries (status + updatedAt)
- primary-contact lookups
- duplicate detection keys (normalized name/email)

## Layering

- Validation: `lib/crm/contacts/contactValidation.ts`
- Domain service: `lib/crm/contacts/contactService.ts`
- Transport/actions: `app/action/contactActions.ts`
- UI module: `components/modules/crm/contacts/*`
- Client state orchestration: `hooks/useBrandContacts.ts`

This keeps business rules centralized and prevents action-level logic duplication.

## UX Behavior

- Empty states for active/archive/search contexts
- Loading skeleton during list refresh
- Toast feedback for all mutations
- Archive confirmation dialog
- Optimistic archive UX with rollback on failure
- Responsive table container for narrow viewports

## Future Integrations

The contact record is intentionally shaped to connect to upcoming CRM entities without schema breakage:

- `Deal` (deal owner/contact person)
- `Email` (conversation history, outreach timeline)
- `Meeting` (scheduled calls and outcomes)
- `Activity Timeline` (mutations + communication events)
- `Notes` (future structured notes model)
- `Attachments` (business cards, contract owner docs)

Recommended future additions:

- `lastContactedAt`
- `source` (inbound, referral, manual)
- interaction counters
- preferred channel metadata
