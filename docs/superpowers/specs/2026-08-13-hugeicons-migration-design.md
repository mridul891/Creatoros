# Hugeicons Migration Design

## Goal

Replace every `@phosphor-icons/react` usage in DealFlow components with the installed `@hugeicons/react` and `@hugeicons/core-free-icons` packages, then remove remaining Phosphor dependency records.

## Scope

- Migrate all Phosphor imports under `components/`.
- Preserve existing icon semantics, dimensions, colors, classes, accessibility attributes, and interaction behavior.
- Use the closest semantic icon in the free Hugeicons set when no exact equivalent exists.
- Update dynamic icon maps and icon-valued props to use Hugeicons icon data.
- Remove stale Phosphor records from tracked dependency lockfiles.
- Avoid unrelated component, styling, or behavior changes and preserve existing uncommitted work.

## Implementation Design

Each migrated file will import icon definitions from `@hugeicons/core-free-icons` and render them through `HugeiconsIcon` from `@hugeicons/react`:

```tsx
import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

<HugeiconsIcon icon={PlusSignIcon} size={15} />
```

Direct Phosphor component props will be translated as follows:

- `size`, `color`, `className`, ARIA attributes, and event props remain equivalent.
- `weight` is replaced with the closest available Hugeicons appearance, using `strokeWidth` only where necessary to retain emphasis.
- Filled or duotone Phosphor icons use the closest semantically equivalent free Hugeicon without introducing custom SVG assets.

The six configuration-driven icon maps currently typed with Phosphor's `Icon` type will store Hugeicons icon data and use `IconSvgElement` from `@hugeicons/react`. Their render sites will call `HugeiconsIcon` rather than instantiate an icon component dynamically.

No compatibility wrapper or alias layer will be introduced. This leaves the project on the same two-import Hugeicons pattern already used by existing components and keeps tree-shaking explicit.

## Dependency Cleanup

`package.json` and `pnpm-lock.yaml` already contain Hugeicons and do not declare Phosphor. The stale Phosphor entries in `package-lock.json` will be removed without changing unrelated dependency versions.

## Verification

The migration is complete when:

1. `pnpm typecheck` passes.
2. `pnpm lint` passes without migration-introduced errors.
3. `pnpm build` passes.
4. A repository search returns no `@phosphor-icons/react` imports or Phosphor type imports.
5. Dependency manifests and lockfiles contain no Phosphor package records.

Where existing unrelated failures prevent a clean check, the failure will be documented and migration-introduced failures will still be resolved.
