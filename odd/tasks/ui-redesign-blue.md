# UI redesign: token consolidation, blue palette, hero and sections

## Objective

Rebuild the CV's visual system on a single source of truth, replacing the neon cyan/green identity with a controlled deep blue, and adopting the strongest layout and motion patterns from the Gentleman Programming reference site — without copying its brand.

## Problem

The design system is fiction. Four sources declare the same tokens, and the one that actually drives the UI is not among them:

| Source | State |
|---|---|
| `tailwind.config.js` → `cyber.*` | 3 usages only, decorative |
| `styles.css` (repo root) | **orphan — nothing loads it**, yet it declares `--color-primary` 12 times |
| `src/index.css` | the only stylesheet `main.jsx` imports |
| `src/config/security.ts` → CSP | separate concern, must not drift from `generate-csp.mjs` |

Meanwhile `src/` contains **61 hardcoded hex values**. Changing a token does nothing to them, which is why the palette has drifted.

Motion is also heavier than it needs to be: `pulse-slow`, `float` and `glow` run permanently, with a neon box-shadow glow that competes with content.

## Why

A recruiter spends seconds on this page. Neon-on-black reads as a template and undercuts the seniority the CV is claiming. The reference site proves the opposite: a dark, restrained surface with one accent, fluid type, and restrained motion reads far more professional — and costs less GPU.

## Reference patterns adopted (measured from the live site)

Only these four, all verified in its CSS:

1. **Scroll reveal with stagger** — `[data-reveal]` opacity 0→1, `translateY(18px)`→none, `.64s cubic-bezier(.2,.7,.2,1)`, `transition-delay: calc(var(--reveal-step,0) * 90ms)`, with `@media (prefers-reduced-motion: reduce)` collapsing it to `opacity:1; transition:none; transform:none`.
2. **Fluid type** — `clamp()` for hero and section titles; balanced headings, pretty paragraphs.
3. **Shape scale** — 8/12/16px radii plus a 999px pill, named as tokens.
4. **Section rhythm** — `96px` vertical padding, alternating bands with 1px top/bottom borders, `1120px` max container, `repeat(auto-fit, minmax(300px,1fr))` card grids.

## Explicitly rejected from the reference

- Its rose/mauve palette — that is its brand, not ours.
- `body { overflow: hidden }` — it uses an app shell with sidebar and fixed tabbar. Our page scrolls. Copying this breaks it.
- `font-size: 13px` on body — unacceptable for a document meant to be read by a recruiter.
- The install-terminal chrome — belongs to a product install flow.

## Palette (user-selected, 2026-10-01)

Deep controlled blue. Preserve the dark base and contrast.

| Token | Value | Use |
|---|---|---|
| `--color-primary` | `#3b82f6` | primary accent, links, active states |
| `--color-primary-hover` | `#60a5fa` | hover |
| `--color-primary-dim` | `#1e40af` | pressed, subtle fills |
| `--color-secondary` | `#38bdf8` | secondary accent |
| `--color-success` | `#34d399` | verified / success only |
| `--color-warning` | `#fbbf24` | warning |
| `--color-danger` | `#f87171` | error |
| `--color-bg` | `#0a0a0f` | base (keep) |
| `--color-bg-alt` | `#12121a` | alternate surface (keep) |
| `--color-text` | `#f8fafc` | primary text |
| `--color-text-light` | `#cbd5e1` | body text |
| `--color-text-muted` | `#94a3b8` | muted |

Retire `#00ffff`, `#00cc33`, `#00b4e6`, `#9333ea`.

## Scope

### In

1. **Single token source.** `src/index.css` owns every design token. Delete the orphan `styles.css` after confirming nothing references it. Reduce `tailwind.config.js` `cyber.*` to map onto the CSS variables (or remove it if nothing depends on it) — do not leave a third palette.
2. **Tokenize the 61 hardcoded hexes** in `src/` so the palette actually governs the UI. This is the substantive part of the change; skipping it makes the rest cosmetic.
3. **Palette swap** to the table above.
4. **Motion**: add the `data-reveal` pattern with `prefers-reduced-motion` support; retire `glow` and `pulse-slow`. The project already depends on `framer-motion` — prefer it over hand-rolled observers if it gives the same accessibility guarantees, but the reduced-motion path is mandatory either way.
5. **Typography**: `clamp()` scale for hero and section titles; `text-wrap: balance` on headings, `pretty` on paragraphs; remove the dated `border-bottom` on `h1`.
6. **Shape scale**: 8/12/16 + pill as tokens; apply consistently.
7. **Hero**: radial blurred glow gradients, two-column `1.05fr 1fr` grid on wide viewports collapsing to one column, gradient-clipped title.
8. **Sections**: `96px` rhythm, alternating bands, `1120px` max container, auto-fit card grids at `minmax(300px,1fr)`.

### Out

- CSP files (`scripts/generate-csp.mjs`, `src/config/security.ts`, `_headers`, `public/_headers`).
- `src/webmcp/**`, `src/hooks/useWebMcpTools.ts`.
- `src/data/**` — data reconciliation is already committed.
- Copying the reference brand.
- Light mode.

## Constraints

- CSP hashes `script-src` with **no `unsafe-inline`**. All new code must live in `src/` and be bundled by Vite. `style-src` does allow inline styles.
- `tsconfig`: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`.
- Tests: 210 passing must stay green.
- Accessibility is not optional: `prefers-reduced-motion` must be honoured, and text contrast must meet WCAG AA against `#0a0a0f` and `#12121a`.
- Dark mode only.

## Acceptance criteria

1. No hardcoded neon hex remains in `src/`; all colour comes from tokens.
2. `styles.css` orphan is deleted and nothing references it.
3. `tailwind.config.js` declares no independent palette.
4. Scroll reveal works and fully collapses under `prefers-reduced-motion: reduce`.
5. Headings render fluidly between mobile and desktop without overflow.
6. Contrast of body text and primary accent against both backgrounds meets WCAG AA.
7. Hero and sections follow the new rhythm at 1440px, 768px and 375px.
8. `pnpm validate:cv`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all pass.

## Checks

```
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```
Plus a contrast audit of the new palette against both surfaces, and screenshots at 1440 / 768 / 375 before and after.

## Progress

T1 analysis of reference [x] / T2 palette selected [x] / T3 this doc [x] / T4 implementation [ ] / T5 visual verification [ ] / T6 commit [ ]

## Next step

Implement via one delegated writer, then verify visually.

## Open questions

- `exploitarium` fork attribution is still undecided from the previous work and remains a data concern, not a UI one.
- A native RDD review transaction (`review-2fffc5f4f7fab4da`) was started and left in `reviewing` state; it still needs to be abandoned or resumed.