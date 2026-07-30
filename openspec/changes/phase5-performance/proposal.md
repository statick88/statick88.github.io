# Proposal: Phase 5 — Performance Optimization

## Intent

The CV portfolio loads all section chunks on-demand (good) but lacks prefetching, has render-blocking fonts, and no performance monitoring. Users on slow connections experience waterfalls between sections. No visibility into Core Web Vitals.

## Scope

### In Scope
- Wire `initPrefetching()` into `AppLayout` (app mount)
- Add `fetchPriority="high"` + `loading="eager"` to hero LCP image
- Optimize Google Fonts loading (inline critical CSS, preload font stylesheet)
- Create `src/lib/web-vitals.ts` for LCP/CLS/INP reporting
- Add `rollup-plugin-visualizer` + `analyze` npm script
- Align `_headers` and `wrangler.toml` CSP (Phase 4 alignment)

### Out of Scope
- Image format conversion (PNG→WebP) — image is 120x120, negligible gain
- CDN-level optimizations (Cloudflare handles this)
- Speculation Rules API (low browser support, future work)
- Full Lighthouse CI pipeline (separate change)

## Capabilities

### New Capabilities
- `performance-monitoring`: Web Vitals console reporting and bundle analysis tooling
- `prefetch-strategy`: Section prefetching on hover/scroll proximity

### Modified Capabilities
None — no existing specs to modify.

## Approach

1. **Prefetch wiring**: Call `initPrefetching()` in `AppLayoutInner` useEffect. Already imported in ScrollNavBar and MobileDrawer — just needs the mount hook.
2. **LCP optimization**: Add `fetchPriority="high"` to `<img>` in HeroSection. Inline critical font CSS in `<head>` to eliminate render-blocking request.
3. **Web Vitals**: New `src/lib/web-vitals.ts` using `web-vitals` npm package. Report to console in dev, structured logging in prod.
4. **Bundle analysis**: Add `rollup-plugin-visualizer` to vite.config.js. New `"analyze": "vite build --mode analyze"` script.
5. **Cache alignment**: Verify `_headers` CSP matches `wrangler.toml`. Both already aligned — confirm no drift.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/layout/AppLayout.tsx` | Modified | Add `initPrefetching()` useEffect |
| `src/components/sections/HeroSection.tsx` | Modified | Add `fetchPriority="high"` to img |
| `src/lib/web-vitals.ts` | New | Web Vitals reporting module |
| `vite.config.js` | Modified | Add visualizer plugin |
| `package.json` | Modified | Add web-vitals + visualizer deps, analyze script |
| `index.html` | Modified | Inline critical font CSS, preload hints |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Font inlining increases HTML size | Low | Critical CSS is <2KB; non-critical remains async |
| web-vitals adds bundle weight | Low | Tree-shakeable; ~1KB gzipped |
| Prefetch wastes bandwidth on slow connections | Low | Only prefetch on user intent (hover/scroll proximity) |

## Rollback Plan

1. Remove `initPrefetching()` call from AppLayout
2. Revert `fetchPriority` addition in HeroSection
3. Delete `src/lib/web-vitals.ts` and remove import
4. Remove `rollup-plugin-visualizer` from vite.config.js and package.json
5. Revert `index.html` font changes
6. Run `pnpm build && pnpm test` to verify

## Dependencies

- `web-vitals` npm package (new)
- `rollup-plugin-visualizer` npm package (new, devDep)

## Success Criteria

- [ ] `initPrefetching()` called on app mount, prefetch works on nav hover
- [ ] Hero image has `fetchPriority="high"`
- [ ] Google Fonts CSS no longer render-blocking (inlined or preloaded)
- [ ] Web Vitals report to console (LCP, CLS, INP)
- [ ] `pnpm analyze` generates bundle treemap
- [ ] All 91 tests pass, 0 TS errors
- [ ] CSP headers unchanged from Phase 4

## Proposal question round

Before finalizing, please confirm:

1. **Font strategy**: Inline the full Google Fonts CSS in `<head>`, or use `<link rel="preload">` + `onload` swap? Inline is simpler but adds ~3KB to HTML.
2. **Web Vitals destination**: Console only, or also send to a lightweight analytics endpoint (e.g., Cloudflare Analytics)?
3. **Scope boundary**: Should we add `<link rel="modulepreload">` for critical chunks in `index.html`, or keep this as future work?
