# Notes Module Architecture

## Purpose

Deal Notes provide campaign-level documentation with autosave, pinning, and search.

## Data Model

- Prisma model: `DealNote`
- Core fields:
  - `title`
  - `content`
  - `isPinned`
  - `status` (Active/Archived)
  - `createdAt`, `updatedAt`

## UX Model

- Left rail: searchable note list with pin indicator and version timestamps.
- Editor: title + content panel with debounced autosave.
- Archive and restore controls for cleanup.

## Runtime Layers

- Validation: `lib/crm/notes/noteValidation.ts`
- Service: `lib/crm/notes/noteService.ts`
- Actions: `app/action/noteActions.ts`
- Hooks: `hooks/useDealNotes.ts`, `hooks/useNoteMutations.ts`
- UI: `components/modules/crm/notes/DealNotesSection.tsx`

## Future Compatibility

- Comments per note
- Mentions and notifications
- AI summaries from note body and related files
