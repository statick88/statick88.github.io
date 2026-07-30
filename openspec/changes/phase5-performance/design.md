# Design: Phase 5 — Performance Optimization

## Technical Approach

Layer performance optimizations onto the existing React 18 + Vite 8 portfolio without changing component architecture. Prefetch wiring completes the existing `prefetch.ts` module (mount init was the missing piece). Font loading shifts from render-blocking `<link rel="stylesheet">` to preload+swap. Web Vitals adds ~1KB gzipped via `web-vitals` package. Bundle analysis uses build-time plugin gated by mode flag.

## Architecture Decisions

| Decision | Options | Tradeoff | Choice |
|----------|---------|----------|--------|
| Font loading | Inline CSS vs preload+swap | Inline adds ~3KB HTML; preload+swap is lighter but needs JS | **Preload+swap** per user decision |
| Web Vitals endpoint | Console-only vs console+endpoint | Endpoint adds CSP `connect-src` requirement | **Console+endpoint** per user decision |
| Modulepreload | Build-time injection vs runtime | Runtime needs manifest; build-time is static | **Build-time in index.html** per user decision |
| Bundle visualizer | Always-on vs mode-gated | Always-on bloats prod build | **Mode-gated** (`--mode analyze`) |
| Cache headers | wrangler.toml vs `_headers` | Two sources risk drift | **Single source: `public/_headers`** for Cloudflare Pages |

## Data Flow

```
index.html
  ├─ <link rel="preload" as="style"> ──onload──► rel="stylesheet" (fonts)
  ├─ <link rel="modulepreload"> ──► critical JS chunks
  └─ <script type="module"> ──► src/main.jsx
        └─ AppLayout (mount)
             └─ useEffect → initPrefetching()
                  ├─ prefetchCriticalSections() → summary chunk
                  └─ scroll listener → prefetchHeavySectionsIfNear()
                       └─ research, hire chunks (at >70%)

HeroSection <img> → fetchPriority="high" loading="eager"

web-vitals.ts → onLCP/onCLS/onINP → console + endpoint
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/layout/AppLayout.tsx` | Modify | Add useEffect calling `initPrefetching()`, return cleanup |
| `src/components/sections/HeroSection.tsx` | Modify | Add `fetchPriority="high"` and `loading="eager"` to `<img>` |
| `src/lib/web-vitals.ts` | Create | Web Vitals reporting: LCP, CLS, INP → console + endpoint |
| `index.html` | Modify | Font preload+swap, modulepreload for critical chunks |
| `vite.config.js` | Modify | Add `rollup-plugin-visualizer` in analyze mode |
| `package.json` | Modify | Add `web-vitals`, `rollup-plugin-visualizer` deps + `analyze` script |
| `public/_headers` | Modify | Align CSP with root `_headers`, add `connect-src` for analytics endpoint |
| `_headers` | Modify | Remove Google Analytics domains (unused), align cache rules |

## Interfaces / Contracts

```typescript
// src/lib/web-vitals.ts
import type { Metric } from 'web-vitals'

type ReportFn = (metric: Metric) => void

interface WebVitalsConfig {
  endpoint?: string    // analytics endpoint URL
  debug?: boolean      // force console logging
}

export function initWebVitals(config?: WebVitalsConfig): void
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `prefetch.ts` functions (already tested) | Existing vitest suite |
| Unit | `web-vitals.ts` config logic | Mock `web-vitals` package, verify callback wiring |
| Integration | AppLayout calls `initPrefetching` on mount | Render test, mock `initPrefetching`, assert called |
| Build | Visualizer only activates in analyze mode | `vite build` (no flag) produces no stats; `vite build --mode analyze` produces treemap |

## Migration / Rollout

No data migration. Changes are additive:
1. Install deps (`web-vitals`, `rollup-plugin-visualizer`)
2. Add code (AppLayout useEffect, HeroSection attrs, web-vitals.ts)
3. Modify index.html (font preload, modulepreload)
4. Align `_headers` files
5. Verify: `pnpm build && pnpm test` passes

## Open Questions

None — all resolved by user decisions (font preload+swap, console+endpoint, modulepreload included).
