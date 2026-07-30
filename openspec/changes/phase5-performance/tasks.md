# Tasks: Phase 5 — Performance Optimization

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 120–180 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | All performance optimizations | PR 1 | Single PR — under 200 lines, all changes are additive and independent |

## Phase 1: Dependencies & Build Config

- [ ] 1.1 Add `web-vitals` and `rollup-plugin-visualizer` to `package.json` (deps + devDep)
- [ ] 1.2 Add `"analyze": "vite build --mode analyze"` script to `package.json`
- [ ] 1.3 Gate `rollup-plugin-visualizer` in `vite.config.js` behind `mode === 'analyze'` (import only when mode matches)

## Phase 2: Core Implementation

- [ ] 2.1 Add `useEffect` to `AppLayoutInner` in `src/components/layout/AppLayout.tsx` — call `initPrefetching()` on mount, return cleanup function (~10 lines)
- [ ] 2.2 Add `fetchPriority="high"` and `loading="eager"` to hero `<img>` in `src/components/sections/HeroSection.tsx` (2 attrs on line 30)
- [ ] 2.3 Create `src/lib/web-vitals.ts` — import `onLCP`, `onCLS`, `onINP` from `web-vitals`, export `initWebVitals(config?)` that logs to console and optionally POSTs to endpoint (~35 lines)

## Phase 3: HTML & Headers

- [ ] 3.1 Modify `index.html`: replace render-blocking `<link href="fonts.googleapis.com/...">` with `<link rel="preload" as="style" onload="this.rel='stylesheet'">` + `<noscript>` fallback
- [ ] 3.2 Add `<link rel="modulepreload">` entries in `index.html` for critical entry chunks (main, React runtime)
- [ ] 3.3 Create `public/_headers` — set `Cache-Control: public, max-age=31536000, immutable` for hashed assets (`/_assets/*`), add `connect-src` for analytics endpoint in CSP

## Phase 4: Testing

- [ ] 4.1 RED: Write failing test for `src/lib/web-vitals.ts` — mock `web-vitals` package, verify `initWebVitals` wires LCP/CLS/INP callbacks (file: `src/__tests__/lib/web-vitals.test.ts`)
- [ ] 4.2 GREEN: Implement `initWebVitals` to pass the test — callback wiring + console logging + optional endpoint POST
- [ ] 4.3 Write test for AppLayout integration — render `AppLayoutInner`, mock `initPrefetching`, assert called on mount and cleanup on unmount
- [ ] 4.4 Run `pnpm test` — verify all 91+ tests pass, 0 TS errors
- [ ] 4.5 Run `pnpm build` — verify production build succeeds; run `pnpm analyze` — verify treemap output generated

## Phase 5: Cleanup

- [ ] 5.1 Verify `_headers` (root) and `public/_headers` CSP rules are aligned — remove any stale Google Analytics `connect-src` entries from root `_headers`
