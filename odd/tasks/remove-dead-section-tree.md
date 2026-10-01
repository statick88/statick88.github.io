# Remove prefetched-but-never-rendered section tree

## Objective

Delete the section/component tree that is downloaded on every visit but never rendered, and fix the one live code smell. Closes all 11 SonarQube findings without suppressing a single rule.

## Problem

`src/lib/prefetch.ts` holds a `sectionImporters` map that lazily imports nine `sections/*` modules. `AppLayout` calls `initPrefetching()`, so those chunks are fetched and evaluated on every page load. But nothing ever mounts them: the component that would render them, `SectionRenderer`, is unreachable from `src/main.jsx`.

The prefetch code says so itself (`src/lib/prefetch.ts:30-31`):

> Resolves the dynamic import so the chunk is downloaded and cached.

So this is not harmless dead weight. It is bundle size, download time and module evaluation spent on UI that cannot appear. `App.old.jsx`, the 571-line monolith that `App.tsx` replaced, imports the same legacy components.

## Evidence

A forward reachability walk from `src/main.jsx` (resolving the `@/*` tsconfig alias) reaches 64 files. The dead cluster hangs off `SectionRenderer`:

- `src/App.old.jsx` — unreachable, zero inbound references outside itself
- `src/components/layout/SectionRenderer.tsx` — named only in comments in `src/config/navigation.ts:4`
- `src/components/sections/*.tsx` — imported only by `SectionRenderer` and by `prefetch.ts`
- `src/components/{HireMe,Timeline,Projects,Skills,Certifications,Courses,Research,Metrics}.jsx` — imported only by the sections above and by `App.old.jsx`

Verified safe to remove: no test file imports any of them, and no script under `scripts/`, `vite.config.*` or the root `generate-*.js` references them. `src/hooks/useNavItems.ts` only produces nav items and imports no section. The `SectionRenderer` mention in `src/config/navigation.ts:4` is a comment.

## Scope

### In

1. Delete `src/App.old.jsx`.
2. Delete `src/components/layout/SectionRenderer.tsx`.
3. Delete `src/components/Section.jsx`.
4. Delete all eleven files in `src/components/sections/` (ten listed plus `MetricsSection.tsx`).
5. Delete the eight legacy cards listed above.
6. `src/lib/prefetch.ts` — **BLOCKED, see Open questions.** It has two live consumers and one test that asserts its behaviour, so removing it cascades beyond this doc.
7. `src/index.css` — merge the two `*` selector blocks. DONE: single `*` rule at line 112 carrying the reset plus the Firefox scrollbar properties.

### Out

- Every rule suppression, gate threshold change, hotspot `Safe` marking, and test deletion. All forbidden; see `references/quality-gate-loop.md`.
- `src/components/Reveal.tsx`, `src/lib/color.ts`, and the design tokens. Those are live.
- `src/config/security.ts`, `src/lib/schemas/ats-schema.ts`, `src/data/cvData.js`, `src/workers/`, `src/services/` — unreachable from `main.jsx` but referenced by tests, build scripts or ambient types. Not this task.

## Acceptance criteria

1. `src/main.jsx` still boots and renders the two-column CV layout.
2. `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all pass; 210 tests stay green.
3. SonarQube reports zero code smells, with no rule suppressed and no threshold changed.
4. No file in the deleted set is referenced anywhere in the repository.
5. The bundle shrinks: no chunk for the removed sections remains in `dist/`.

## Checks

```
pnpm typecheck
pnpm lint
pnpm test
pnpm build
scripts/sonar-gate.sh --project-key cv-diego --json
```

## Progress

T1 reachability verified [x] / T2 this doc [x] / T3 delete tree + rewire prefetch [ ] / T4 merge CSS selector [ ] / T5 verify + re-scan [ ] / T6 commit [ ]

## Next step

Apply T3 and T4 in one bounded change, then re-run the gate.

## Open questions

### BLOCKED: removing `prefetch.ts` cascades past this document

A first implementation attempt stopped without changing anything. `prefetch.ts` is not self-contained:

- `src/components/layout/ScrollNavBar.tsx:13` and `src/components/layout/MobileDrawer.tsx:12` both import `prefetchSection`. Both components render from `src/App.tsx:103` and `:108`, so they are live. Removing the module requires removing their hover handlers too — and hover-prefetching a section that can never render is itself dead behaviour.
- `src/__tests__/components/AppLayout.test.tsx` does `vi.mock('@/lib/prefetch')` at L15-17 and asserts in two tests that `initPrefetching` is called on mount and its cleanup on unmount. Deleting the module, or the call, breaks both.

The claim in this document that "no test file imports any of them" is true but does not support the conclusion: no test imports the *files being deleted*, but one test depends on the *module* item 6 wants removed.

Three ways forward, all requiring a human decision:

1. **Remove the prefetch machinery completely.** Delete `prefetch.ts`, drop the hover handlers from `ScrollNavBar` and `MobileDrawer`, and retarget the two `AppLayout` tests onto `initWebVitalsForProject`, which AppLayout still calls, so the effect set-up and tear-down intent survives. Touches two live components and rewrites two tests.
2. **Keep `prefetch.ts` as a no-op stub.** Clears the finding without touching components or tests, but leaves a module whose only purpose is to do nothing.
3. **Ship only the CSS merge.** Done; the other ten findings stay open.

Option 1 is the correct end state. Option 3 is already complete.

### Other dead code, out of scope

`src/services/`, `src/workers/`, `src/types/{features,forensic}.ts`, `src/context/FeatureFlagsContext.tsx`, `src/lib/schemas/ats-schema.ts` and `src/data/cvData.js` are unreachable from `main.jsx` but referenced by tests, build scripts or ambient types. They need their own analysis.