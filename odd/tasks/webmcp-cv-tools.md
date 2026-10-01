# WebMCP CV Tools

## Objective

Expose the CV as typed, agent-discoverable tools via the WebMCP API, so an AI agent can query structured CV data (skills, experience, projects, certifications, education) instead of scraping the DOM.

## Problem

The CV is a static React SPA. An agent visiting the page must parse rendered DOM to extract skills or experience — brittle, lossy, and ambiguous (bilingual text flattened into prose). WebMCP lets the page declare typed tools with JSON Schemas so the browser mediates calls and the agent gets structured results.

## Why

- Typed JSON Schemas remove hallucination risk from agent parsing.
- Tools read the SSOT (`cv-data.yaml`) rather than scraped markup, so results match what the site renders.
- Zero backend: the page *is* the provider; the browser is the security mediator.

## Scope

### In

- `document.modelContext` feature detection (draft API: currently `registerTool`/`unregisterTool`/`getTools`).
- Six read-only tools sourced from `@/data/cv-data`:
  - `get_cv_summary`
  - `search_skills`
  - `get_experience`
  - `get_projects`
  - `get_certifications`
  - `get_education`
- TypeScript augmentation for `Document.modelContext` (absent from TS 5.4 `lib.dom.d.ts`).
- StrictMode-safe registration hook with real deregistration.
- Vitest coverage: detection, schema shape, tool behaviour, and contact-leak prevention.

### Out

- **Contact data**: `email`, `phone`, `whatsapp`, `calendar`, `location`, and social profile URLs (`linkedin`, `github`, `portfolio`) are excluded from all tool output. Rationale: schemas make PII trivially harvestable by any agent; the promise to the user was skills/experience/projects/certifications only.
- CDN or remote polyfill. Blocked by the CSP (`default-src 'self'`, `script-src` with hashes, no `unsafe-inline`). Would require weakening the security posture.
- `@mcp-b` bridge dependency. Not added — see Open Questions.
- The `public/_headers` CSP drift (`'unsafe-inline'` in `script-src`) is a **pre-existing** defect, out of scope here, but it means CI currently fails that grep assertion.

## Constraints

- CSP allow-list with per-build SHA-256 hashes. All new code must live under `src/` and be bundled by Vite. **CSP files must not be modified.**
- `tsconfig`: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`. Note `Record<string, Metric>` indexing yields `Metric | undefined`.
- React 18 `StrictMode` is mounted (`src/main.jsx:8`): effects run mount→unmount→remount in dev. Registration must be idempotent and fully reversible.
- WebMCP is a **W3C CG-DRAFT**, not a standard. The API moved from `navigator.modelContext` to `document.modelContext`; method names have churned. Code must feature-detect defensively and degrade to a no-op.
- Data source is `@/data/cv-data` (runtime YAML parser). `src/data/cvData.js` is hand-written and only used by Node scripts — **not** the runtime source, and must not be edited here.
- Data is bilingual (`{ es, en }`). Tools accept an optional `lang` param defaulting to `'en'`.

## Design

New module `src/webmcp/`, consumed by one hook mounted in `App.tsx`:

- `src/webmcp/types.ts` — `WebMcpTool` descriptor types + `declare global` augmentation for `Document.modelContext`.
- `src/webmcp/tools.ts` — pure tool definitions: name, description, `inputSchema`, `execute`. Depends only on `@/data/cv-data`.
- `src/webmcp/registerTools.ts` — registration/deregistration. Checks `document.modelContext`, dedupes by tool name, returns a symmetric cleanup.
- `src/webmcp/index.ts` — barrel.
- `src/hooks/useWebMcpTools.ts` — `useEffect(() => registerTools(...), [])`, cleanup returned.

`execute` returns `JSON.stringify(...)` because the spec resolves with a stringified DOMString. Results are length-capped so a tool call cannot ship unbounded payload to an agent.

## Tasks

- [x] T1 Map data/types/CSP/test surfaces — delegated `explore`
- [x] T2 Create feature doc + Engram mirror
- [ ] T3 Add `src/webmcp/types.ts` with `Document.modelContext` augmentation
- [ ] T4 Add `src/webmcp/tools.ts` with 6 read-only tools (contact-free)
- [ ] T5 Add `src/webmcp/registerTools.ts` with idempotent register + cleanup
- [ ] T6 Add `src/hooks/useWebMcpTools.ts` and mount in `App.tsx`
- [ ] T7 Add `src/webmcp/__tests__/webmcp-tools.test.ts`
- [ ] T8 Verify: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`
- [ ] T9 Work-unit commit on `feat/webmcp-cv-tools`; run native RDD assessment

## Route declaration

| Task | Route | Trigger evidence |
|---|---|---|
| T1 | delegated `explore` | 4+ files required (data, types, schemas, CSP, tests, hooks) |
| T3–T7 | delegated writer | 6 non-trivial new files + 1 edit to `App.tsx` |
| T8 | fresh per-action worker | build/test action |
| T9 | inline | git state |

## Acceptance criteria

1. `document.modelContext` absent → registration is a silent no-op, no throw, no console error.
2. Six tools registered, each with a non-empty `description` and a valid JSON Schema `inputSchema`.
3. All tools annotated read-only (`annotations.readOnlyHint`).
4. No tool output contains `email`, `phone`, `whatsapp`, `calendar`, `linkedin`, `github`, or `portfolio` values.
5. StrictMode double-mount does not produce duplicate tools.
6. Cleanup deregisters every tool it registered.
7. `lang` param switches bilingual output; defaults to `'en'`.
8. `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` all pass.

## Checks

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Progress

Current: T3–T7 pending implementation.

## Next step

Implement T3–T7 via one delegated writer, then verify.

## Open questions

- Native browser support for WebMCP is effectively absent (Chrome Early Preview only). Without a bridge, external MCP clients cannot see these tools. `@mcp-b` is the bridge option but is experimental and would add a dependency. Deferred pending a deliberate decision.
- Zod schemas already exist in `src/lib/schemas/cv-data.ts` but run only at build time, not runtime. Tools consume `@/data/cv-data` directly (already asserts shape at import), so they do not depend on the zod path.