# Spec: 2026-06-03-vitest-cvdata-shape

## Functional Requirements

### FR1 — Vitest installed and configured
- `vitest@^2.0.0` added to `devDependencies` in `package.json`
- `vitest.config.js` at project root with:
  - `environment: 'node'` (default — sufficient for data-shape tests)
  - `include: ['src/**/*.test.{js,jsx}']`
  - `globals: false` (explicit imports for clarity)
- `@vitest/coverage-v8` as optional devDep (for `test:coverage` script only)

### FR2 — Test file `src/data/cvData.test.js`
The test file MUST assert the following invariants on `src/data/cvData.js`:

#### FR2.1 — `profileData` shape
- `profileData` is an `object`
- Has exactly 4 keys: `developer`, `hacker`, `research`, `curriculista`
- Each profile has:
  - `label: { es: string, en: string }`
  - `skills: Array<{ name: string, level: string, category: string }>` with `level ∈ {beginner, intermediate, advanced, master}` and `category ∈ {frontend-fundamentals, frontend-frameworks, backend, mobile, mobile-native, devops, databases, architecture, security, ai, methodology, data, research}`
  - `certifications: Array<{ name: string, issuer: string, status: 'active' | 'expired' }>` — non-empty
  - `summary: { es: string ≤ 350 chars, en: string ≤ 350 chars }` (CV display constraint)

#### FR2.2 — `cvData.work` shape
- `cvData.work` is an `Array` of length exactly 6
- Each entry has:
  - `name: string` (non-empty)
  - `position: { es: string, en: string }` (both non-empty)
  - `url: string` (optional but should start with `https://`)
  - `startDate: string` matching `YYYY-MM-DD`
  - `endDate: string` matching `YYYY-MM-DD` (optional; absence means "present")
  - `summary: { es: string, en: string }` (both non-empty)

#### FR2.3 — `cvData.education` shape
- `cvData.education` is an `Array` of length exactly 3
- Each entry has:
  - `institution: string` (non-empty)
  - `area: { es: string, en: string }`
  - `url: string` starting with `https://`
  - `startDate`, `endDate` matching `YYYY-MM-DD`
  - `studyType: 'Master' | 'Bachelor' | 'PhD' | 'Diploma'`
  - `score: string` (non-empty)

#### FR2.4 — `cvData.metrics` shape
- `cvData.metrics` is an `object` with exactly 4 keys:
  - `abacomCohorte2026`
  - `githubRepos`
  - `nlmNotebooks`
  - `certificationsCount`
- Each has:
  - `value: string` (non-empty, the displayed metric, e.g. `"93.4"`, `"100+"`, `"55 / 898"`, `"134+"`)
  - `unit: string` (may be empty)
  - `label_es: string`, `label_en: string` (both non-empty)
  - `source: string` (non-empty — this is a transparency requirement)

#### FR2.5 — Bilingual coverage
- Every `summary: { es, en }` and `area: { es, en }` MUST have both languages non-empty.
- Every `label: { es, en }` MUST have both languages non-empty.

### FR3 — `pnpm` scripts
- `"test": "vitest run"` — single-run, non-watch
- `"test:watch": "vitest"` — watch mode
- `"test:coverage": "vitest run --coverage"` — coverage report

### FR4 — CI integration
- The **QA gate** in `.github/workflows/ci.yml` MUST include a `test` step BEFORE the `lint` step.
- The test step uses `pnpm install --frozen-lockfile` followed by `pnpm test`.
- If `pnpm test` exits non-zero, the QA gate fails.

## Non-Functional Requirements

### NFR1 — Performance
- `pnpm test` MUST complete in < 5 seconds on CI.
- Total QA gate runtime increase < 10s.

### NFR2 — Reliability
- Tests use `describe` + `it` blocks (not `test()` shorthand) for grep-ability in CI logs.
- All assertions use `expect().toBe()` / `.toEqual()` / `.toMatch()` — no snapshots.

### NFR3 — Maintainability
- `src/data/cvData.test.js` follows the same comment style as `src/data/cvData.js`.
- Each `describe` block is named after the export it tests.
- Helper validators (e.g. `isISODate(str)`) are defined at the top of the file.

### NFR4 — Compatibility
- Vitest version MUST be compatible with `vite@6.4.3` (peer dep tree).
- ESM imports only — no CommonJS.

## Out of Scope

- Component tests (React component rendering) — separate change
- E2E tests (Playwright) — separate change
- Mutation testing (Stryker) — separate change
- Source code changes to `src/data/cvData.js` (the data is already correct)

## Acceptance Criteria

1. `pnpm install` succeeds with the new devDeps.
2. `pnpm test` exits 0 with all assertions passing.
3. `pnpm test:coverage` produces an HTML report under `coverage/`.
4. Locally, the test file `src/data/cvData.test.js` exists and is < 200 lines.
5. CI QA gate step `test` appears in `.github/workflows/ci.yml`.
6. CI run on `main` shows `✅ Tests` step passing.
