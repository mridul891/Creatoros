# DealFlow (NotYetLaunched) — Design System

## Overview

DealFlow's surfaces are quietly electric. The base atmosphere is a pure white canvas, near-black ink type, soft gray hairlines, and a single blue-violet CTA — nothing fights for attention until a section needs to. The brand voltage doesn't come from accent walls or multi-color washes; it comes from **one color used with discipline**: `{colors.primary}`, a blue-violet that appears as the italic word inside every headline, the fill of every primary button, and the one full inversion on the page — the footer CTA block. Between those violet moments, the page reads like a clean SaaS editorial: an eyebrow, a headline, supporting copy, a product visual, then a hairline rule and breathing room.

Type voice is split-brain: **Space Grotesk** owns h1s, buttons, inputs, nav, and stat numbers (it is the `html` default via `--font-sans`), while **DM Sans** owns body copy and section headings (`p`, `h2`–`h6` are explicitly remapped to `--font-body`). Display headlines never go bolder than 500–600 — emphasis comes from *italic + violet*, not weight jumps. The house signature is **negative letter-spacing everywhere**, from `-0.015em` on body to `-0.045em` on display type; positive tracking appears only on uppercase eyebrows.

The system runs three dialects of one language. The **marketing system** is airy and editorial — full-width bands divided by hairlines at a uniform vertical cadence. The **app/dashboard system** is compact and utilitarian — 32px-tall shadcn controls, dense cards, and a sidebar whose active state is a hard black/white inversion rather than brand violet. The **public media kit** is a third sub-dialect: white-on-violet hero, translucent glassy whites, and its own CSS variable layer (`--mk-*`) aliased from the core tokens.

**Key Characteristics:**
- Primary CTA is `{colors.primary}` (blue-violet) with white text, a `{rounded.lg}` (16px) corner, and a soft drop shadow — it reads as energetic and modern, never corporate-blue-flat.
- Secondary CTA is a `{colors.background}` button with ink text and a hairline outline that fills `{colors.muted}` on press. The two together form DealFlow's signature button pair.
- Hero atmosphere comes from exactly one decorative device: a **radial blue glow** (`rgba(32,97,238,0.06)`) anchored top-center and fading out by 65%. It is atmosphere, not a gradient wall.
- Every major headline carries an ***italic* `{colors.primary}` accent phrase** — the strongest and most repeatable brand signal in the system.
- Section rhythm: white canvas → hairline rule → white band → hairline rule → … → inverted violet footer-CTA block. The canvas never changes color between sections; only full-width `border-t` rules break the scroll.
- Card groups use the **gap-px hairline trick**: `grid gap-px bg-border rounded-xl border` with white cells — perfect 1px internal dividers with no double borders.
- The dashboard sidebar marks the active item with **hard black/white inversion** (`bg-black text-white`), deliberately not violet — navigation emphasis and brand emphasis are kept in separate channels.
- Border radius is hierarchical and derived from one base: `--radius: 1rem`. Buttons and cards sit at `{rounded.lg}` (16px), large feature panels climb to `{rounded.xl}`–`{rounded.4xl}` (22–42px), nav pills tighten to 7px. Nothing is pill-shaped.
- Vertical rhythm is `py-16 sm:py-20 lg:py-24` (64/80/96px) between major bands — universal across every marketing page.

## Colors

### Brand & Accent
- **Primary** (`{colors.primary}` — `oklch(0.538 0.177 264.05)`): The dominant — and only — brand color. Used for the primary CTA background, italic headline accents, eyebrow labels, links, focus rings, and the `{component.footer-cta-block}` inversion. There is no secondary accent anywhere in the UI.
- **On Primary** (`{colors.on-primary}` — `oklch(0.985 0 0)`): Text and icons on primary surfaces.
- **Destructive** (`{colors.destructive}` — `oklch(0.577 0.245 27.325)`): Error states and the live pulse-dot on the hero announcement badge. Always used tinted (`bg-destructive/10 text-destructive`), never as a solid fill.

### Surface
- **Background** (`{colors.background}` — `oklch(1 0 0)`): Pure white; the floor of every marketing band and app screen.
- **Card** (`{colors.card}` — `oklch(0.995 0 0)`): Near-white card surface, one deliberate step off the canvas so cards read against it without borders.
- **Muted** (`{colors.muted}` — `oklch(0.95 0 0)`): Hover fills, secondary-button hover state, quiet inset panels, card footers (`bg-muted/50`). Frequently used at reduced alpha (`bg-muted/30`).
- **Border** (`{colors.border}` — `oklch(0.922 0 0)`): The universal hairline — section dividers, card rings, input outlines, and the gap-px grid trick. One gray does all divider work in the system.

### Text
- **Foreground** (`{colors.foreground}` — `oklch(0.145 0 0)`): The strongest text — headlines, stat numbers, primary labels.
- **Muted Foreground** (`{colors.muted-foreground}` — `oklch(0.556 0 0)`): The workhorse text color — all body copy, descriptions, nav links, captions. Most running text on the site is this gray, not black.

### Signature Atmosphere
These are the only non-token colors permitted, and they exist solely as light effects — never as fills on elements:
- **Hero Glow** (`rgba(32,97,238,0.06)` → transparent at 65%): Radial ellipse behind every hero. Subpage heroes run slightly hotter at `0.08`.
- **Sweep Shimmer** (`rgba(32,97,238,0.12)`): Linear-gradient sheen crossing the `{component.wide-cta-band}`.
- **Pricing Halo** (`var(--primary)` at 10% opacity, blurred): Radial circle bleeding above the featured pricing tier — the only signal marking "Most Popular".

### Chart Ramp
Five blue-violet steps (`{colors.chart-1}` → `{colors.chart-5}`, hue 252→266, lightness descending 0.81→0.42). A monochromatic family for data visualization — never multi-hue.

### Dark Mode
Dark overrides exist in `_variables.scss` (grays, borders, shadows) and the sidebar carries `dark:` variants, but the shadcn token layer currently ships **light-only values**. Treat dark mode as partially wired: do not design new components dark-first until the token layer is completed.

## Typography

### Font Family
The system runs two Google fonts loaded in `src/app/layout.tsx`. **Space Grotesk** (300–700) is bound to `--font-sans` and applied to `<html>` — making it the default voice for anything not explicitly remapped: h1s, buttons, inputs, nav items, stat numbers, badges. **DM Sans** (400–700) is bound to `--font-body` and explicitly applied to `p, h2, h3, h4, h5, h6` — owning body copy and all section headings below h1. **Geist Mono** is available as `--font-mono` for code and numeric contexts. The fallback stacks walk through `ui-sans-serif, sans-serif, system-ui`.

The split is intentional rhythm alternation: grotesque personality at display and action layers, humanist readability in running text. The public media kit runs its own alias (`--font-heading` → Space Grotesk) inside `media-kit-preview.css`.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-hero}` | clamp(30px, 8vw, 60px) | 500 | 1.02 | -0.045em | Marketing h1 hero, max-w 820px |
| `{typography.display-section}` | clamp(26px, 3.5vw, 36–40px) | 600 | 1.15 | -0.035em | Section h2s (DM Sans) |
| `{typography.display-cta}` | clamp(36px, 5.5vw, 60px) | 600 | 1.05 | -0.045em | Footer-CTA headline |
| `{typography.stat-number}` | clamp(36px, 4.5vw, 48px) | 600 | 1.1 | -0.045em | Stats-section figures |
| `{typography.title-app}` | 24px | 700 | 1.3 | -0.03em | Dashboard page headings |
| `{typography.card-title}` | 16px | 500 | 1.35 | -0.01em | shadcn Card titles |
| `{typography.body-lg}` | 16–17px | 400 | 1.65 | -0.015em | Lead paragraphs under heroes |
| `{typography.body-md}` | 14px | 400 | 1.55 | -0.01em | Standard body, card descriptions |
| `{typography.body-sm}` | 13px | 400 | 1.5 | -0.01em | Dense UI copy, nav links |
| `{typography.eyebrow}` | 11px | 600 | 1.4 | +0.12em uppercase | Section eyebrows, `text-primary` |
| `{typography.button-marketing}` | 14px | 600 | 1 | 0 | Hand-rolled marketing CTAs |
| `{typography.button-app}` | 14px (xs: 12.8px) | 500 | 1 | 0 | shadcn Button labels |

### Principles
Negative tracking is the house voice — display type goes as tight as -0.045em and even body sits slightly negative; positive tracking is reserved exclusively for uppercase eyebrows. Emphasis inside headlines comes from **italic plus color**, never weight jumps: an h1 stays at 500 while its accent phrase shifts to italic violet. Where the system does want weight it pivots modestly — 500 for card titles and app buttons, 600 for section heads and stat numbers, 700 only in the dashboard's page headings. Hero h1s read in Space Grotesk automatically (h1 is not remapped); section h2s read in DM Sans — don't fight this split, it is load-bearing rhythm.

### Note on Font Substitutes
If Space Grotesk is unavailable, **Chivo Mono-adjacent grotesques** or **Archivo** are the closest open substitutes — nudge tracking looser by ~0.01em to compensate for Archivo's wider set. If DM Sans is unavailable, **Inter** is a near-drop-in replacement. On macOS/iOS, `system-ui` is a usable but flatter fallback; the negative tracking survives either substitution unchanged.

## Layout

### Spacing System
- **Base unit:** 4px (`--spacing: 0.25rem`; all spacing snaps to 4-multiples).
- **Section padding (vertical):** `py-16 sm:py-20 lg:py-24` (64/80/96px) is the universal rhythm constant — every major marketing band uses it. The footer CTA scales larger: `py-20 sm:py-24 lg:py-[120px]`.
- **Marketing container:** `mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-7` (1200px at lg) — defined once as `WRAP_CLASS` in `src/components/marketing/constants.ts` and consumed by every band. Never re-specify container widths inline.
- **Content column caps:** hero copy `max-w-[560px]`–`[820px]`; pricing intro `max-w-[760px]`; footer CTA `max-w-[640px]`.
- **App containers:** invoice workspace `max-w-[880px] px-4 py-7 sm:px-6 lg:px-8`; public media kit `max-w-3xl`.
- **Gutters:** split sections use `md:grid-cols-2 gap-[72px]`; pricing tiers use `gap-4`; stats figures use `gap-x-12`.

### Grid & Container
- **Hairline card grids:** `grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3` with each cell `bg-card` — the preferred construction for any bordered card group.
- **Stats layout:** left narrative column beside a right-hand `lg:grid-cols-3 gap-x-12` figure grid.
- **Pricing:** 4 tier cards at xl, stacking below.
- **Nav:** fixed bar at `h-14 sm:h-16`; hero starts at `pt-24 sm:pt-28 lg:pt-32` to clear it.

### Whitespace Philosophy
Whitespace does the framing; the radial glow adds atmosphere without density. Bands are separated by full-width `border-t` hairlines rather than alternating background colors — the canvas never changes, only the rules between sections break the scroll. There is no mesh, no aurora, no multi-stop backdrop anywhere in the system. The single background inversion is reserved for the footer CTA block, which is why it lands with force.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, hairline `border-border` | Section dividers, most marketing blocks, footer |
| Hairline ring | `ring-1 ring-foreground/10` | shadcn Cards |
| Soft shadow | `shadow-sm` / `shadow-md` (10% black) | Nav CTAs, marketing primary buttons at rest |
| Elevated | `shadow-lg` on hover | Marketing primary buttons |
| Glow | Blurred radial at ≤12% alpha | Hero backdrops, pricing halo |

The elevation philosophy is **hairline first, shadow sparingly, glow only as atmosphere**. Base shadows run at `--shadow-opacity: 0.1`; nothing in the system uses heavy elevation. Depth on cards comes from the ring plus the near-white surface shift (`{colors.card}` against `{colors.background}`), not drop shadows.

### Decorative Depth
- **Radial hero glow** — the system-wide atmospheric signature, always top-center, always ≤8% alpha.
- **ASCII network pattern** (`NetworkAsciiPattern`) — a monospace network texture used as a flat decorative band element. Decorative only; never place live text over it.
- **Sweep shimmer** — a single linear-gradient pass across the wide CTA band; motion-as-depth rather than stacked effects.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.sm}` | calc(var(--radius) × 0.6) ≈ 9.6px | Inputs, small controls |
| `{rounded.md}` | calc(var(--radius) × 0.8) ≈ 12.8px | Mid-size controls, xs/sm buttons |
| `{rounded.lg}` | var(--radius) = 16px | All buttons, cards, standard surfaces |
| `{rounded.xl}` | calc(var(--radius) × 1.4) ≈ 22.4px | Cards, split-section media frames, hairline grids |
| `{rounded.2xl}` – `{rounded.4xl}` | ×1.8 / ×2.2 / ×2.6 (28.8–41.6px) | Large feature panels, footer-CTA block, media-kit blocks |
| `{rounded.nav-pill}` | 7px | Nav links and nav CTAs — deliberately tighter than buttons |

The base `--radius: 1rem` makes this a **soft-rounded system**: everything is noticeably curved, nothing is pill-shaped except circular icon buttons. The 7px nav pill is a sub-dialect signal — "navigation is quieter than actions."

### Media Geometry
Split-section illustrations crop into `{rounded.xl}` frames. Product screenshots fit their containers rather than scaling up. The ASCII pattern renders edge-to-edge with no rounding. Media-kit avatars and profile imagery use generous rounding consistent with the `{rounded.2xl}`+ range.

## Components

> **Two button dialects, never mixed.** Marketing pages use hand-rolled anchor buttons (`button-marketing-*`); the app uses the compact shadcn family (`button-app`). Crossing them is the most common drift error.

**`marketing-nav`** — Fixed top bar, `h-14 sm:h-16`, `bg-background/80 backdrop-blur-xl`, bottom hairline. Logo sits left; centered link row renders in `{typography.body-sm}` `text-muted-foreground` with `rounded-[7px] px-[13px]` hover pills; right cluster carries a login link and a solid-primary signup CTA. The nav stays light over every section — it never inverts.

**`app-sidebar`** — Dashboard rail on the near-white sidebar surface. Active item uses hard inversion: `data-[active=true]:bg-black data-[active=true]:text-white` (flipped in dark mode). Brand violet is never used for nav-active.

### Buttons

**`button-marketing-primary`** — The signature CTA. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button-marketing}`, padding ~12px × 20–24px, rounded `{rounded.lg}`, `shadow-md` at rest. Hover deepens to `bg-primary/90` and lifts to `shadow-lg`. Carries a trailing Hugeicons arrow (`ArrowRight02Icon`, 15px). Used sparingly — one per viewport section.

**`button-marketing-secondary`** — White outline button. Background `{colors.background}`, ink text, same padding and radius as primary, 1px `{colors.border}` outline. Fills `{colors.muted}` on hover. Always pairs with `{component.button-marketing-primary}` as the less-committed choice.

**`button-app`** — The shadcn app dialect. Base: `h-8 px-2.5 rounded-lg text-sm font-medium` with `active:translate-y-px` press feedback and `focus-visible:ring-3 ring-ring/50`. Variants: `default` (primary fill), `outline`, `secondary`, `ghost`, `destructive` (tinted `bg-destructive/10 text-destructive` — soft, never solid), `link`. Sizes: `xs` (24px) → `lg` (36px), plus icon equivalents. App-only.

**`text-link`** — Inline links inherit `{colors.primary}`; the `link` button variant adds underline on hover with 4px offset.

### Cards & Containers

**`hero-band`** — White canvas, radial glow backdrop, centered stack: announcement badge (destructive pulse dot + muted pill), `{typography.display-hero}` h1 with italic violet accent phrase, lead paragraph in `{typography.body-lg}` `text-muted-foreground`, primary + secondary button pair, product visual below. Top padding clears the fixed nav.

**`split-section`** — Two-column `md:grid-cols-2 gap-[72px]` band: copy column (eyebrow, `{typography.display-section}` h2, body, optional CTA) beside a `{rounded.xl}` illustration frame. Direction alternates down the page.

**`stats-section`** — Narrative column + 3-up figure grid. Each stat is `{typography.stat-number}` in foreground over a small muted caption. Numbers do the talking — no icons, no decoration.

**`value-pillar-grid`** — The gap-px hairline grid (see Layout). Cells are plain `bg-card` with icon, title in `{typography.card-title}`, body in `{typography.body-md}`.

**`wide-cta-band`** — Full-width conversion band crossed by the sweep-shimmer gradient; carries `{component.button-marketing-primary}`.

**`footer-cta-block`** — The system's single inversion: `rounded-2xl bg-primary` block with white type at `{typography.display-cta}`, supporting copy in `text-white/70–80`, hairlines in `border-white/20`, and a giant decorative watermark headline at `text-white/15`. Ends every marketing page.

**`pricing-tier-card`** — White card, ring hairline, plan name, price block, feature checklist, CTA. No badges, no ribbons.

**`pricing-tier-card-featured`** — The "Most Popular" tier. Marked solely by the blurred violet halo bleeding above it plus elevated treatment — the background stays white; the glow is the badge.

**`ascii-network-pattern`** — Monospace ASCII texture band. Decorative-only signature component; do not promote it to a content surface.

### Motion Primitives
Built on `motion`: `text-blur` (blur-in headline reveal), `shimmer-text` (gradient sweep across text), `particle` (ambient dots). Shared durations/easings live in `animation-variants.ts`. Motion is reveal-oriented — fade/blur/slide-up on scroll-into-view. The shimmer sweep and the hero pulse dot are the only loops.

### Inputs & Forms
App inputs follow the shadcn token layer: `{colors.background}` field, ink text, `{typography.body-sm}`, rounded `{rounded.sm}`, 1px `{colors.border}` outline, focus ring in `ring-ring/50`. Validation states beyond focus are not yet formalized (see Known Gaps).

### Media Kit Sub-System
The public media kit (`media-kit-preview.css`) aliases core tokens into its own namespace (`--mk-kit: var(--primary)`) and runs a distinct look: white-on-primary hero with translucent whites (`rgb(255 255 255 / 18–35%)`) for dividers and chips, hardcoded `#fff` rate cards, `{rounded.2xl}`+ blocks, content capped at `max-w-3xl`. Treat it as a framed sub-system: keep its `--mk-*` variables pointing at core tokens so a brand-color change propagates.

## Do's and Don'ts

### Do
- Put an *italic* `{colors.primary}` phrase inside every major headline. It is the brand's signature move.
- Keep letter-spacing negative on display and body type; reserve positive tracking for uppercase eyebrows only.
- Use the gap-px hairline grid for bordered card groups instead of per-card borders.
- Keep the two button dialects separate: `button-marketing-*` on marketing pages, `button-app` inside the product.
- Keep nav-active as black/white inversion. Violet is for actions and accents, not location.
- Anchor every band with the shared `WRAP_CLASS` container and the `py-16 sm:py-20 lg:py-24` rhythm.
- End marketing pages with the inverted `{component.footer-cta-block}`.
- Extend the chart ramp or darken/lighten `{colors.primary}` when you need more color — within the violet family.

### Don't
- Don't introduce a second accent color. Violet + grayscale + semantic red is the entire palette.
- Don't hardcode hexes in components. The only sanctioned raw colors are the documented glow/shimmer alphas of `#2061EE`.
- Don't use solid destructive fills; destructive styling is always tinted at `/10`.
- Don't apply DM Sans to h1s or Space Grotesk to long body paragraphs — the font mapping is structural.
- Don't add pill-shaped (9999px) buttons; this system is rounded-rectangle, not pill.
- Don't stack multiple glow effects in one viewport, and never place live text over the ASCII pattern.
- Don't design dark-mode-first; the token layer is light-complete only.
- Don't re-specify container widths inline — consume `WRAP_CLASS`.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Single column; nav collapses; hero h1 at clamp floor (30px); sections at `py-16`; split sections stack |
| Sm | ≥ 640px | Nav grows to h-16; horizontal padding steps up |
| Lg | ≥ 1024px | Container widens to 1200px; splits become 2-col with 72px gap; stats figure grid 3-up; sections hit `py-24` |
| Xl | ≥ 1280px | Pricing renders 4-across; outer breathing room increases without scaling type |

All display sizes scale via `clamp()`, so type never jumps abruptly between breakpoints.

### Touch Targets
- `{component.button-marketing-primary}` and siblings render ~44–48px tall (12px padding + line-height) — comfortably above WCAG's 44px recommendation.
- `{component.button-app}` tops out at 36px (`lg`). This is a deliberate density trade-off for pointer-first desktop use; if an app control becomes a primary mobile target, wrap it in a taller hit area rather than inflating the visual size.
- Icon buttons follow the same 24–36px scale (`icon-xs` → `icon-lg`).

### Collapsing Strategy
- Grids reduce column count rather than shrinking cards (3-up → 1-up; pricing 4-up → stacked).
- Split sections restack copy above media on mobile.
- The fixed nav condenses height (h-14 → h-16 at sm) before collapsing its link row.

### Image Behavior
- Illustrations and screenshots crop to fit their containers, never scale up past native resolution.
- Split-section media keeps its `{rounded.xl}` frame at every breakpoint.
- Hero visuals bleed to container width, losing horizontal margin on small screens.

## Iteration Guide

1. Focus on ONE component at a time. Reference its key directly (`{component.button-marketing-primary}`, `{component.footer-cta-block}`).
2. When adding a new component, decide first which dialect it belongs to: marketing (hand-rolled, airy, 44px targets) or app (shadcn, compact, 32px controls).
3. Variants of an existing component (`-hover`, `-active`, `-disabled`, `-focus`) live as separate entries — never nested state objects.
4. Use `{token.refs}` everywhere prose mentions a color, radius, typography role, or spacing value. Values appear at most once next to the reference.
5. New marketing components must consume `WRAP_CLASS` and the section-rhythm paddings; new app components must build on shadcn primitives.
6. When in doubt about emphasis: italic violet before extra weight, hairline before shadow, whitespace before decoration.
7. Run `pnpm lint && pnpm typecheck` after edits — Biome flags class/style drift and broken types automatically.

## Known Gaps

- **Dark mode is half-wired:** `_variables.scss` ships `.dark` overrides and the sidebar has `dark:` variants, but the shadcn token block in `globals.css` defines light values only. Completing dark tokens is a prerequisite for shipping a theme toggle.
- Form validation states (error/success on inputs) are not extracted — only the focus ring is documented.
- Chart tokens (`{colors.chart-1..5}`) are defined but no chart component consumes them yet.
- The amber star color (`#F59E0B`) exists only in commented-out testimonial code — do not treat it as part of the palette.
- Motion timings beyond the shared `animation-variants.ts` constants are not tokenized.
- The exact rendered hex of `{colors.primary}` varies by display pipeline (oklch gamut mapping); the oklch value is canonical — do not substitute a sRGB approximation in code.
