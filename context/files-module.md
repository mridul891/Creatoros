# Files Module Architecture

## Purpose

Deal Files turn each Deal into a lightweight document workspace.

## Categories

- Contract
- CampaignBrief
- Asset
- RawMedia
- FinalDeliverable
- Invoice
- Reference

## Data Model

- Prisma model: `DealFile`
- Metadata:
  - `fileName`
  - `storagePath`
  - `mimeType`
  - `sizeBytes`
  - `category`
  - `status`
  - `metadata` JSON

## Runtime Layers

- Validation: `lib/crm/files/fileValidation.ts`
- Service: `lib/crm/files/fileService.ts`
- Actions: `app/action/fileActions.ts`
- Hooks: `hooks/useDealFiles.ts`, `hooks/useFileMutations.ts`
- UI: `components/modules/crm/files/DealFilesSection.tsx`

## Future Compatibility

- Folder hierarchy
- Version history
- Cloud storage adapters and signed URLs
