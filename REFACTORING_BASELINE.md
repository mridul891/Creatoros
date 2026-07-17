# Refactoring Baseline Snapshot

Captured: 2026-07-16

## Current tracked repo metrics

- Tracked TypeScript/TSX files: 288
- Components over 250 lines: 14
- Hooks over 200 lines: 0
- Console/debugger hits in tracked TS/TSX files: 62

## Verification

- `pnpm typecheck` passes.
- `pnpm lint` reports pre-existing warnings in `.claude/skills/...` scripts unrelated to the app refactor.

## Notes

- The sidebar mobile breakpoint hook now delegates to a reusable media-query hook.
- The legacy `hooks/use-mobile.ts` file remains as a compatibility shim.
