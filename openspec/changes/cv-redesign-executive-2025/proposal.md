# Proposal: CV Redesign — Executive 2025

## Intent

Current CV portfolio consists of narrative-only Markdown profiles (cv-es.md, cv-en.md + 10 profile variants) that lack quantified business impact, structured data export for automation pipelines, GitHub collaboration evidence, and executive/CISO framing. Need a single authoritative digital CV that positions for CISO / VP Engineering / Principal roles with evidence-based security + dev dual expertise, ATS-compliant structured data, and bilingual executive layout.

## Scope

### In Scope
- Single-page React SPA with 2-column executive layout (30% left sidebar / 70% right content)
- Structured data layer: YAML/JSON source of truth → Markdown/HTML/PDF renders
- Executive profile: quantified impact metrics per role (revenue protected, team size, budget, CVSS findings, student outcomes)
- GitHub collaboration visualization: co-authored commits, PR reviews, shared architectures (Rust, Next.js, React, Tauri, Python)
- Experience timeline with business-outcome cards (not task lists)
- Projects section with security impact scoring (CVSS, business risk reduced)
- Certifications with verification links and expiry tracking
- Bilingual: Spanish primary, English secondary with language toggle
- Print CSS for PDF export (A4, @media print)
- Career-ops integration: structured JSON export for automated job applications
- Sanitized exploitarium content: category/impact only, no PoC details
- TDD with Vitest + Testing Library (91+ tests baseline)

### Out of Scope
- Multi-page routing (remains SPA)
- CMS/headless backend (static JSON/YAML source)
- Real-time GitHub API calls (build-time data only)
- Blog/content engine
- Dark/light theme toggle (glassmorphism/cyberpunk theme only)
- Internationalization beyond ES/EN

## Capabilities

### New Capabilities
- `executive-cv-layout`: 2-column responsive layout with print stylesheet
- `structured-cv-data`: YAML/JSON source schema with validation (Zod)
- `cv-export-pipeline`: Markdown + HTML + PDF generation from structured data
- `github-collab-viz`: Build-time GitHub stats aggregation (co-authors, PRs, shared repos)
- `impact-metrics-engine`: Quantified business outcomes per role/project
- `bilingual-cv-renderer`: ES/EN toggle with i18n namespace
- `career-ops-export`: JSON schema matching career-ops automation pipeline
- `security-content-sanitizer`: Exploitarium categorization without PoC disclosure

### Modified Capabilities
- `cv-portfolio-app`: Complete rewrite from narrative Markdown → structured SPA
- `cv-generation-scripts`: Replace generate-cv-markdown.js with structured data pipeline

## Approach

1. **Data Model First**: Define `cv-data.yaml` schema (Zod) covering profile, experience, education, projects, certifications, skills, metrics, GitHub stats, languages. Single source of truth.

2. **Build-Time GitHub Enrichment**: Node script using Octokit to fetch co-author stats, PR review counts, shared repos across statick88 org. Output `github-collab.json` consumed at build.

3. **Structured Data → Multiple Outputs**:
   - React components consume typed data (TypeScript interfaces from Zod)
   - `generate-cv-markdown.js` → legacy Markdown for compatibility
   - `generate-cv-html.js` → print-optimized HTML
   - `generate-cv-json.js` → career-ops automation payload

4. **Layout Architecture**:
   - Left column (30%): photo, contact, links, top skills (radar), languages, certifications summary
   - Right column (70%): executive summary, experience timeline (cards with metrics), education, projects (impact-scored), full certifications
   - CSS Grid + Tailwind, `@media print` stylesheet for PDF

5. **Security Content Sanitization**: Transform exploitarium repos into `{category: "IDOR|RCE|etc", impact: "CVSS 9.1", businessRisk: "data exposure", remediation: "implemented"}` — no payloads.

6. **Bilingual Strategy**: All user-facing strings in `cv-data.yaml` under `es`/`en` keys. React context for language toggle. Default ES.

7. **Testing**: Unit tests for data validation, component rendering (both languages), export scripts. Integration test for print CSS output.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/data/cv-data.yaml` | New | Single source of truth for all CV content |
| `src/data/github-collab.json` | New | Build-time GitHub collaboration stats |
| `src/lib/cv-schema.ts` | New | Zod schemas + TypeScript types |
| `src/components/layout/ExecutiveLayout.tsx` | New | 2-column grid with print styles |
| `src/components/sections/*` | New | Sidebar, Profile, Experience, Education, Projects, Certifications, Skills, Languages |
| `src/components/ui/*` | Modified | Reuse shadcn/ui patterns, adapt for glassmorphism |
| `scripts/generate-cv-data.mjs` | New | Build-time data validation + GitHub enrichment |
| `scripts/generate-cv-html.mjs` | New | HTML export with print CSS |
| `scripts/generate-cv-json.mjs` | New | career-ops JSON export |
| `scripts/generate-cv-markdown.js` | Modified | Legacy Markdown output from structured data |
| `index.html` | Modified | Meta tags, font preloads, CSP alignment |
| `tailwind.config.js` | Modified | Executive color tokens, print utilities |
| `vite.config.ts` | Modified | Build-time script integration |
| `wrangler.toml` | Modified | Cloudflare Pages headers for PDF/HTML |
| `package.json` | Modified | New scripts, Octokit, Zod dependencies |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| GitHub API rate limits during build | Medium | Cache results, use authenticated Octokit, fallback to cached data |
| Print CSS rendering differences across browsers | Medium | Test Chrome/Edge/Firefox print preview; use `@page` margins |
| Structured data schema drift over time | Low | Zod validation in CI, versioned schema in `cv-schema.ts` |
| Bilingual content sync divergence | Medium | Single YAML with `es`/`en` keys; lint rule for missing translations |
| Exploitarium sanitization misses sensitive detail | Low | Automated keyword scan (payload, exploit, shellcode) in CI |
| PDF export loses glassmorphism effects | Low | Medium | Acceptable — print stylesheet uses flat fallback |
| Career-ops JSON schema mismatch | Low | Co-develop schema with career-ops maintainer; contract test |

## Rollback Plan

1. Revert `src/data/` to previous Markdown-only approach
2. Restore `generate-cv-markdown.js` as primary generator
3. Remove new components, scripts, dependencies (Octokit, Zod)
4. Revert `tailwind.config.js`, `vite.config.ts`, `wrangler.toml`
5. Run `pnpm build && pnpm test` to verify baseline (91 tests pass)
6. Deploy to Cloudflare Pages via existing wrangler workflow

## Dependencies

- `@octokit/rest` (GitHub API for collaboration stats)
- `zod` (schema validation)
- `yaml` (YAML parsing)
- Existing: React 18, Vite 8, Tailwind 3.4, Framer Motion 11, Vitest

## Success Criteria

- [ ] Single `cv-data.yaml` validates against Zod schema with 100% ES/EN coverage
- [ ] Build-time GitHub enrichment produces `github-collab.json` with co-author count, PR review count, shared repo count
- [ ] Executive layout renders correctly at 1440px, 1024px, 768px, 375px
- [ ] Print CSS generates clean A4 PDF (Chrome print → Save as PDF)
- [ ] `pnpm generate:cvs` produces: `cv-executive-es.md`, `cv-executive-en.md`, `cv-executive.html`, `cv-executive.json`
- [ ] `cv-executive.json` passes career-ops schema validation
- [ ] All 91+ existing tests pass + 15+ new tests for data/schema/components
- [ ] Zero TypeScript errors, zero ESLint warnings
- [ ] CSP headers unchanged, Cloudflare Pages deploy succeeds
- [ ] Exploitarium repos appear only as sanitized impact cards (category, CVSS, business risk)
- [ ] LCP < 2.5s, CLS < 0.1, INP < 200ms (Web Vitals baseline maintained)

## Proposal Question Round

Before finalizing, please confirm:

1. **GitHub data scope**: Include only `statick88` org repos, or also personal `statick88` user repos? Include fork contributions?
2. **Metric granularity**: Per-role metrics (revenue, team size, budget) — do you have documented numbers, or should we use ranges (e.g., "team 5-10") with source citations?
3. **Print layout priority**: Single-page A4 (dense) or multi-page A4 (breathing room)? Executive CVs often run 2 pages.
4. **Sanitization rules**: Exact keyword blocklist for exploitarium (payload, shellcode, exploit, CVE-XXX PoC) — confirm or provide your list.
5. **Career-ops JSON contract**: Share target schema or confirm we co-design it in this change.
6. **Photo/avatar**: Use existing GitHub avatar, or new professional photo asset?
7. **Deployment timeline**: Phase this as single deploy, or split (data model → layout → exports → print)?

(End of file)