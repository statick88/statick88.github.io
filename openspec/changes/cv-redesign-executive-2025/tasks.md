# Implementation Tasks: cv-redesign-executive-2025

## Overview
Transform narrative-only CV into executive-level digital portfolio with quantified metrics, GitHub collaboration evidence, structured data exports, and bilingual 2-column layout.

---

## Phase 1: Data Layer Foundation

### T-001: Zod Schema Library (`src/lib/schemas/cv-data.ts`)
**Specs:** data-models, structured-cv-data
**Acceptance Criteria:**
- All 9 schemas defined: BilingualString, ContactInfo, ExecutiveProfile, ExperienceEntry, EducationEntry, ProjectEntry, CertificationEntry, SkillEntry, LanguageEntry
- Root CVDataSchema with version, lastUpdated, profile, experience, education, projects, certifications, skills, languages, exploitarium (optional), metadata
- TypeScript types exported via `z.infer<>` for all schemas
- `validateCVData(data: unknown): CVData` function exported
- ZodError includes path and formatted message on validation failure

**Test Strategy:** Unit tests for each schema (valid/invalid inputs), integration test for validateCVData

**Dependencies:** None

**Effort:** 3h

---

### T-002: Bilingual String Utilities (`src/lib/i18n/bilingual.ts`)
**Specs:** bilingual-content, bilingual-renderer
**Acceptance Criteria:**
- `BilingualString` type alias exported
- `getText(bilingual: BilingualString, locale: 'es' | 'en'): string` helper
- `createBilingual(es: string, en: string): BilingualString` factory
- `mergeBilingual(partial: Partial<BilingualString>, fallback: BilingualString): BilingualString`
- Type-safe locale switching

**Test Strategy:** Unit tests for all helpers

**Dependencies:** T-001

**Effort:** 1h

---

### T-003: Authoritative CV Data (`src/data/cv-data.yaml`)
**Specs:** structured-cv-data, quantified-metrics, impact-metrics, executive-layout, certifications, projects-security-scoring, sanitization
**Acceptance Criteria:**
- Complete bilingual data for all 6 experience entries (ABACOM, ESPE, APC, Codings Academy, ISTJM, UIDE)
- 3 education entries (UTPL Master's, UCM MSc in progress, UNL Bachelor's)
- 15+ projects with GitHub URLs, tech stacks, impact scores, sensitivity levels
- 20+ certifications categorized (security-leadership, technical-security, cloud-architecture, governance-risk, software-engineering, leadership-management, academic)
- 25+ skills with categories, proficiency, yearsExperience, featured flags
- 4 languages (es/en/it/pt) with proficiency and certifications
- Executive profile with vision, headline, summary, photoUrl
- Contact info with all links
- exploitarium summary (64 PoCs by category/severity, no exploit code)
- All metrics ≥2 per experience entry (quantified)

**Test Strategy:** Validation script (T-004) passes, manual review for accuracy

**Dependencies:** T-001

**Effort:** 5h

---

### T-004: Validation Script (`scripts/validate-cv.ts`)
**Specs:** data-models, structured-cv-data
**Acceptance Criteria:**
- Loads cv-data.yaml, parses with js-yaml
- Runs validateCVData()
- Exits 0 on success, 1 on failure with formatted ZodError
- Integrated into `pnpm validate:cv` script
- Runs in CI before build

**Test Strategy:** Unit test with valid/invalid YAML fixtures

**Dependencies:** T-001, T-003

**Effort:** 1h

---

## Phase 2: GitHub Enrichment

### T-005: GitHub Enrichment Script (`scripts/enrich-github.ts`)
**Specs:** github-enrichment
**Acceptance Criteria:**
- Uses Octokit with `GITHUB_TOKEN` env var
- Reads project githubRepo fields from cv-data.yaml
- Fetches for each repo: stars, forks, contributors, lastCommit, languages, totalCommits, firstCommit, lastCommit
- Computes coAuthors from commit trailers (`Co-authored-by:`)
- Computes prReviewsGiven, prReviewsReceived, sharedRepos, topCollaborators
- Identifies sharedArchitectures from repo topics, README, directory structure
- Exponential backoff on 403/rate-limit
- Caches results in `.github-enrichment-cache.json` (24h TTL)
- Graceful degradation: rate limit → cached data + warning, private repo → error object
- Outputs `dist/data/github-enrichment.json`

**Test Strategy:** Unit tests with mocked Octokit, integration test with real token (manual)

**Dependencies:** T-003, T-004

**Effort:** 4h

---

### T-006: Enrichment Build Integration
**Specs:** github-enrichment
**Acceptance Criteria:**
- `pnpm enrich:github` script runs enrichment script
- `pnpm build` runs enrichment before Vite build
- Enrichment failure (non-rate-limit) fails build
- Cache directory `.github-enrichment-cache.json` gitignored
- Progress logging per repository

**Test Strategy:** Integration test in CI

**Dependencies:** T-005

**Effort:** 1h

---

## Phase 3: Sanitization & Security

### T-007: Sanitization Library (`src/lib/sanitize/index.ts`)
**Specs:** sanitization, projects-security-scoring
**Acceptance Criteria:**
- `sanitizeForPublic(cvData: CVData): PublicCVData` - removes restricted/classified entries
- `sanitizeExploitarium(exploitarium: ExploitariumEntry[]): PublicExploitariumEntry[]` - keeps category, severity, count, impact; removes exploit code, PoC details
- Sensitivity gate: `public` → included, `restricted` → summary only, `classified` → excluded
- `filterProjectsByVisibility(projects: ProjectEntry[], visibility: 'public' | 'all'): ProjectEntry[]`
- Type-safe: `PublicCVData` type excludes sensitive fields

**Test Strategy:** Unit tests for each filter function, edge cases (empty arrays, mixed sensitivities)

**Dependencies:** T-001

**Effort:** 2h

---

### T-008: Exploitarium Summary Component Data
**Specs:** projects-security-scoring, executive-cv-layout
**Acceptance Criteria:**
- Transforms 64 PoC directories into aggregated stats by:
  - Severity (critical/high/medium/low/informational)
  - Category (RCE, IDOR, SSRF, XSS, SQLi, etc.)
  - Technology (Linux, Windows, Web, Mobile, Cloud, Container)
  - Year
- No individual exploit details in public output
- Used by ExploitariumSummary component (T-018)

**Test Strategy:** Unit test with fixture data

**Dependencies:** T-003, T-007

**Effort:** 1h

---

## Phase 4: Component Architecture (2-Column Layout)

### T-009: TwoColumnLayout Component (`src/components/layout/TwoColumnLayout.tsx`)
**Specs:** executive-layout, executive-cv-layout
**Acceptance Criteria:**
- CSS Grid: `grid-template-columns: 30% 70%`
- Responsive: <1024px → single column (left content first)
- <640px → mobile stack with preserved order
- Equal height columns (stretch)
- Props: `left: ReactNode`, `right: ReactNode`
- Semantic HTML: `<aside>` left, `<main>` right
- 8pt baseline grid compliance
- Print styles: both columns visible, no break inside cards

**Test Strategy:** Component tests with RTL at 3 breakpoints, visual regression

**Dependencies:** T-001, T-002

**Effort:** 2h

---

### T-010: Left Column - PhotoCard (`src/components/left-column/PhotoCard.tsx`)
**Specs:** executive-layout
**Acceptance Criteria:**
- Avatar image (photoUrl from profile), alt text bilingual
- Print fallback: initials in circle if image fails
- Rounded, border, shadow per design system
- Responsive sizing (max-w-xs on mobile)
- WCAG AA contrast for border

**Test Strategy:** Component test, visual regression

**Dependencies:** T-009

**Effort:** 1h

---

### T-011: Left Column - ContactCard (`src/components/left-column/ContactCard.tsx`)
**Specs:** executive-layout
**Acceptance Criteria:**
- Email (mailto:), phone (tel:), location
- Icons + bilingual labels
- Copy-to-clipboard for email/phone
- Print: plain text, no icons

**Test Strategy:** Component test, interaction test

**Dependencies:** T-009

**Effort:** 1h

---

### T-012: Left Column - LinksCard (`src/components/left-column/LinksCard.tsx`)
**Specs:** executive-layout
**Acceptance Criteria:**
- GitHub, LinkedIn, Portfolio links with icons
- External link indicators, rel="noopener noreferrer"
- Bilingual labels
- Print: URLs in parentheses after labels

**Test Strategy:** Component test

**Dependencies:** T-009

**Effort:** 1h

---

### T-013: Left Column - SkillsCard (`src/components/left-column/SkillsCard.tsx`)
**Specs:** executive-layout, quantified-metrics
**Acceptance Criteria:**
- Skills grouped by category (security-offensive, security-defensive, etc.)
- Proficiency badges: Expert/Advanced/Intermediate/Learning
- Featured skills highlighted (star icon)
- Years experience shown when available
- Collapsible groups on mobile
- 8pt grid spacing

**Test Strategy:** Component test with grouped data

**Dependencies:** T-009, T-003

**Effort:** 2h

---

### T-014: Left Column - LanguagesCard (`src/components/left-column/LanguagesCard.tsx`)
**Specs:** executive-layout, bilingual-content
**Acceptance Criteria:**
- ISO 639-1 codes with flag emoji
- Proficiency badges (Native/Fluent/Professional/Conversational/Basic)
- Certification badges when certified
- Bilingual names (Español/Spanish)
- Print: compact single line per language

**Test Strategy:** Component test

**Dependencies:** T-009

**Effort:** 1h

---

### T-015: Left Column - CertificationsSummaryCard (`src/components/left-column/CertificationsSummaryCard.tsx`)
**Specs:** executive-layout, certifications
**Acceptance Criteria:**
- Count by category with category badges
- Active/expired/renewing status indicators
- Link to full list (anchor to right column)
- Compact display for sidebar

**Test Strategy:** Component test

**Dependencies:** T-009

**Effort:** 1h

---

### T-016: Right Column - ProfileCard (`src/components/right-column/ProfileCard.tsx`)
**Specs:** executive-layout, bilingual-renderer, impact-metrics
**Acceptance Criteria:**
- Executive headline, vision statement, summary
- Language toggle integration (bilingual content)
- Photo (optional, from profile)
- Metrics highlight: 3-4 key KPIs (cohort avg, repos, certs, years exp)
- SF Pro typography, 8pt rhythm

**Test Strategy:** Component test with bilingual content, visual regression

**Dependencies:** T-009, T-002

**Effort:** 2h

---

### T-017: Right Column - ExperienceTimeline (`src/components/right-column/ExperienceTimeline.tsx`)
**Specs:** executive-layout, quantified-metrics, impact-metrics
**Acceptance Criteria:**
- Vertical timeline with dots/connectors
- Each entry: role, company, dates, location, description
- **≥2 metric chips per entry** (value + label + category icon)
- Tech stack tags (clickable filter for projects)
- Achievements as bullet list (bilingual)
- Current role indicator
- Print: compact, no animations

**Test Strategy:** Component test with metric validation (≥2 per entry)

**Dependencies:** T-009, T-003

**Effort:** 3h

---

### T-018: Right Column - ProjectsGrid (`src/components/right-column/ProjectsGrid.tsx`)
**Specs:** executive-layout, projects-security-scoring, github-enrichment
**Acceptance Criteria:**
- Filterable by project type (vulnerability-research, security-tool, etc.)
- Cards show: name, description, type badge, impact score (CVSS + business risk), tech stack
- GitHub link with enrichment data: stars, forks, contributors, last commit
- Co-authors display (avatars + count)
- Shared architecture badge when applicable
- Sanitized: restricted/classified handled per T-007
- Exploitarium summary card (from T-008)
- Responsive grid: 1 col mobile, 2 tablet, 3 desktop

**Test Strategy:** Component test with enrichment mock data, filter tests

**Dependencies:** T-009, T-005, T-007

**Effort:** 4h

---

### T-019: Right Column - EducationCard (`src/components/right-column/EducationCard.tsx`)
**Specs:** executive-layout
**Acceptance Criteria:**
- Degree, institution, field, location, dates
- Honors, GPA, verification URL
- Current/in-progress badge (UCM MSc)
- Bilingual degree/field names
- Print: compact list

**Test Strategy:** Component test

**Dependencies:** T-009

**Effort:** 1h

---

### T-020: Right Column - CertificationsList (`src/components/right-column/CertificationsList.tsx`)
**Specs:** executive-layout, certifications
**Acceptance Criteria:**
- Grouped by category (7 categories)
- Sortable: date (newest first), status (active first), category
- Each: name, issuer, date, status badge, verification link
- Credential ID display
- Expired/renewing visual distinction
- Search/filter by name/issuer
- Print: full list, grouped

**Test Strategy:** Component test with full dataset

**Dependencies:** T-009, T-003

**Effort:** 2h

---

### T-021: Right Column - ExploitariumSummary (`src/components/right-column/ExploitariumSummary.tsx`)
**Specs:** executive-cv-layout, projects-security-scoring
**Acceptance Criteria:**
- Stats cards: Total PoCs, Critical, High, Medium, Low, Informational
- Category breakdown chart (simple bar, CSS-only)
- Technology distribution
- Year trend
- "64 PoCs across 12 categories, 6 severity levels" headline
- No exploit details

**Test Strategy:** Component test with aggregated data

**Dependencies:** T-008, T-009

**Effort:** 2h

---

## Phase 5: Bilingual & Print

### T-022: I18n Context & Language Toggle (`src/context/I18nContext.tsx`, `src/components/ui/LanguageToggle.tsx`)
**Specs:** bilingual-content, bilingual-renderer
**Acceptance Criteria:**
- React Context with `locale: 'es' | 'en'`, `toggleLocale()`
- Persists to localStorage
- LanguageToggle in header: ES/EN buttons, active state
- No layout shift on toggle (content same structure)
- Default: 'es' (Spanish primary)
- Provider wraps App

**Test Strategy:** Context test, toggle interaction test, persistence test

**Dependencies:** T-002

**Effort:** 2h

---

### T-023: Print Stylesheet (`public/print.css`)
**Specs:** print-export, executive-layout
**Acceptance Criteria:**
- `@media print` only
- A4 page size, margins 20mm
- `@page` rules: no backgrounds, controlled breaks
- Hide: LanguageToggle, animations, hover states, shadows
- Font: system stack, 11pt body, 14pt headings
- Two-column layout preserved in print (CSS Grid works in print)
- Page breaks: avoid inside cards, break before major sections
- Links: show URLs in parentheses
- Colors: grayscale, high contrast

**Test Strategy:** Visual regression (Playwright PDF), manual print preview in Chrome/Firefox/Safari

**Dependencies:** T-009

**Effort:** 3h

---

### T-024: PDF Export Test (`tests/e2e/pdf-export.spec.ts`)
**Specs:** print-export
**Acceptance Criteria:**
- Playwright test: navigate to CV, generate PDF via `page.pdf()`
- Assert: 2 pages ±1, no cut-off content, all sections present
- Run in CI (headless Chromium)
- Screenshot comparison for visual regression

**Test Strategy:** E2E test with Playwright

**Dependencies:** T-023, T-009

**Effort:** 2h

---

## Phase 6: Structured Exports (career-ops / ai-job-search)

### T-025: Export Script (`scripts/export-structured.ts`)
**Specs:** structured-exports, structured-cv-data
**Acceptance Criteria:**
- Reads validated cv-data.yaml
- Applies sanitization (T-007)
- Outputs to `dist/exports/`:
  - `cv-data.json` - flat ATS-optimized structure
  - `cv-data.yaml` - authoritative copy
  - `cv-structured.md` - human-readable sections
  - `cv-career-ops.json` - career-ops schema compatible
  - `cv-ai-job-search.yaml` - ai-job-search schema compatible
- JSON: no circular refs, dates as ISO strings, enums as strings
- Markdown: executive summary, experience (with metrics), education, projects, certifications, skills, languages
- Schema validation on output

**Test Strategy:** Unit test with fixture, schema validation on outputs, diff against expected structure

**Dependencies:** T-003, T-004, T-007

**Effort:** 3h

---

### T-026: ATS Optimization JSON Schema (`src/lib/schemas/ats-schema.ts`)
**Specs:** structured-exports
**Acceptance Criteria:**
- Flat structure for ATS parsers:
  - `personal`: name, email, phone, location, links
  - `summary`: executive summary
  - `experience[]`: company, title, dates, bullets (metrics as separate field), skills
  - `education[]`: institution, degree, dates, honors
  - `certifications[]`: name, issuer, date, status
  - `skills[]`: name, category, proficiency
  - `projects[]`: name, description, tech, impact, url
  - `languages[]`: language, proficiency
- Keywords extracted from all fields for matching
- No nested objects beyond one level

**Test Strategy:** Unit test with sample data, validate against known ATS parser requirements

**Dependencies:** T-001

**Effort:** 1h

---

### T-027: Career-ops / AI-Job-Search Compatibility
**Specs:** structured-exports
**Acceptance Criteria:**
- `cv-career-ops.json` matches career-ops expected schema (research required)
- `cv-ai-job-search.yaml` matches ai-job-search expected schema (research required)
- Document mapping in README
- Test with actual tools if available

**Test Strategy:** Integration test with tools (manual)

**Dependencies:** T-025, T-026

**Effort:** 2h

---

## Phase 7: Integration & Polish

### T-028: App Integration (`src/App.tsx`, `src/main.tsx`)
**Specs:** executive-layout, bilingual-renderer, executive-cv-layout
**Acceptance Criteria:**
- App uses TwoColumnLayout with left/right column components
- I18nProvider wraps App
- Data loaded from cv-data.yaml (via import or fetch)
- Enrichment data merged at build time (import from dist/data/github-enrichment.json)
- LanguageToggle in header (fixed position)
- Error boundary for data loading
- SEO meta tags from profile data

**Test Strategy:** Integration test, visual regression

**Dependencies:** T-009 through T-022

**Effort:** 3h

---

### T-029: Vite Config & Build Pipeline (`vite.config.ts`, `package.json`)
**Specs:** github-enrichment, print-export, structured-exports
**Acceptance Criteria:**
- `pnpm validate:cv` runs T-004
- `pnpm enrich:github` runs T-005
- `pnpm export:structured` runs T-025
- `pnpm build` runs validate → enrich → vite build → export
- `public/print.css` copied to dist
- YAML loader for cv-data.yaml (vite-plugin-yaml or import)
- Environment variables: GITHUB_TOKEN for enrichment
- Build time < 30s (with cache)

**Test Strategy:** CI pipeline test

**Dependencies:** T-004, T-006, T-025

**Effort:** 2h

---

### T-030: GitHub Actions CI/CD (`.github/workflows/ci.yml`)
**Specs:** All
**Acceptance Criteria:**
- Jobs: validate → enrich → build → test → export → deploy
- Matrix: Node 20, pnpm 9
- Cache: node_modules, .github-enrichment-cache.json
- Artifacts: dist, exports, pdf (from Playwright)
- Deploy to Cloudflare Pages (wrangler) on main branch
- Lighthouse CI step (performance > 90)
- Accessibility audit (axe-core)

**Test Strategy:** Push to test branch, verify pipeline

**Dependencies:** T-029, T-024

**Effort:** 2h

---

### T-031: Storybook Stories (`stories/*.stories.tsx`)
**Specs:** executive-layout, print-export
**Acceptance Criteria:**
- Stories for all 13 components
- Print preview story with `@media print` simulation
- Bilingual toggle in story controls
- Viewport addon for responsive testing
- Chromatic integration for visual regression

**Test Strategy:** Visual regression via Chromatic

**Dependencies:** T-009 through T-021

**Effort:** 3h

---

### T-032: Documentation & README Updates
**Specs:** All
**Acceptance Criteria:**
- README: project overview, data structure, enrichment, exports, deployment
- CONTRIBUTING: data editing guide, adding metrics, certification taxonomy
- ARCHITECTURE.md: data flow, component hierarchy, build pipeline
- Schema documentation (TypeDoc or markdown)
- Example cv-data.yaml with comments

**Test Strategy:** Manual review

**Dependencies:** All

**Effort:** 2h

---

## Summary

| Phase | Tasks | Est. Effort |
|-------|-------|-------------|
| 1: Data Layer | 4 | 10h |
| 2: GitHub Enrichment | 2 | 5h |
| 3: Sanitization | 2 | 3h |
| 4: Components | 13 | 25h |
| 5: Bilingual & Print | 3 | 7h |
| 6: Structured Exports | 3 | 6h |
| 7: Integration | 5 | 12h |
| **Total** | **32** | **68h** |

---

## Critical Path
T-001 → T-003 → T-004 → T-005 → T-009 → T-016/T-017/T-018 → T-028 → T-029 → T-030

## Parallelizable Groups
- T-010 through T-015 (left column) can parallelize after T-009
- T-016 through T-021 (right column) can parallelize after T-009
- T-022, T-023, T-025 can parallelize after dependencies
- T-031 after components complete