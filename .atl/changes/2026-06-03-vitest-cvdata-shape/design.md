# Design: 2026-06-03-vitest-cvdata-shape

## Architecture

```
~/dev/cv-diego/
├── package.json                  # +"test", "test:watch", "test:coverage" scripts
├── vitest.config.js              # NEW: config for Vitest
├── src/
│   └── data/
│       ├── cvData.js             # source of truth (unchanged)
│       └── cvData.test.js        # NEW: shape contract tests
├── .github/
│   └── workflows/
│       └── ci.yml                # +test step in qa-gate
```

## Component Design

### `vitest.config.js`

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.{js,jsx}'],
    globals: false,
    environment: 'node',
    reporters: process.env.CI ? ['default'] : ['default'],
  },
});
```

**Rationale:**
- `environment: 'node'` — no DOM needed (pure data shape tests).
- `include: ['src/**/*.test.{js,jsx}']` — convention over configuration.
- No `coverage` block here — enabled via CLI flag (`--coverage`).

### `src/data/cvData.test.js`

Structure (no code shown — high-level):

```
import { describe, it, expect } from 'vitest';
import { profileData, cvData } from './cvData.js';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_LEVELS = ['beginner', 'intermediate', 'advanced', 'master'];
const ALLOWED_CATEGORIES = [...12 categories...];
const EXPECTED_PROFILES = ['developer', 'hacker', 'research', 'curriculista'];
const EXPECTED_METRICS = ['abacomCohorte2026', 'githubRepos', 'nlmNotebooks', 'certificationsCount'];

describe('profileData', () => {
  it('has exactly 4 profiles');
  it.each(EXPECTED_PROFILES)('profile "%s" has bilingual label', (key) => {...});
  it.each(EXPECTED_PROFILES)('profile "%s" has non-empty skills array', (key) => {...});
  it.each(EXPECTED_PROFILES)('profile "%s" has non-empty certifications array', (key) => {...});
  it.each(EXPECTED_PROFILES)('profile "%s" has summary ≤ 350 chars in both langs', (key) => {...});
});

describe('cvData.work', () => {
  it('has exactly 6 entries');
  it('every entry has bilingual position and summary');
  it('every startDate and optional endDate matches YYYY-MM-DD');
  it('every optional url starts with https://');
});

describe('cvData.education', () => {
  it('has exactly 3 entries');
  it('every entry has bilingual area');
  it('studyType is one of Master, Bachelor, PhD, Diploma');
  it('every date matches YYYY-MM-DD');
});

describe('cvData.metrics', () => {
  it('has exactly 4 expected keys');
  it.each(EXPECTED_METRICS)('metric "%s" has value, label_es, label_en, source', (key) => {...});
  it('all sources are non-empty (transparency invariant)');
});
```

**Estimated line count:** 130-180 lines.

### `package.json` additions

```json
{
  "scripts": {
    ...,
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "devDependencies": {
    ...,
    "vitest": "^2.1.0",
    "@vitest/coverage-v8": "^2.1.0"
  }
}
```

**Rationale for `^2.1.0`:**
- Vitest 2.x is stable (released 2024-2025), ESM-native, integrates with Vite 6.x.
- Avoids Vitest 3.x (released 2026-Q1) to minimize peer-dep churn with `vite@6.4.3`.

### CI integration (`.github/workflows/ci.yml`)

Insert new step in `qa-gate` job, BEFORE `lint`:

```yaml
- name: Install dependencies
  run: pnpm install --frozen-lockfile

- name: Run shape tests
  run: pnpm test

- name: Lint
  run: pnpm run lint  # existing
```

**Rationale for test-before-lint:**
- Test failures are usually more informative than lint failures.
- If both fail, the user fixes the deeper issue (test) first.
- Total runtime impact: ~3-5s for the new step.

## Data Flow

```
cvData.js (ESM export)
   ↓ imported by
cvData.test.js (Vitest runner)
   ↓ runs all describe blocks
Test results → stdout + exit code
   ↓ consumed by
CI: pnpm test exit 0 → qa-gate green
```

No data is mutated. No side effects. No mocks. Pure assertions.

## Trade-offs Considered

### T1 — Vitest vs Jest
**Decision:** Vitest.
- **Pro:** ESM-native, no Babel config, integrates with Vite 6.4.3, fast.
- **Con:** Smaller ecosystem than Jest.
- **Rejection of Jest:** Requires babel-jest + transform config for ESM; redundant with Vite.

### T2 — Coverage threshold enforcement
**Decision:** Don't enforce thresholds, just generate report.
- **Pro:** Avoids blocking the change on coverage numbers.
- **Con:** Reports without enforcement are easily ignored.
- **Mitigation:** Add threshold enforcement in a follow-up change once we have component tests.

### T3 — Test file location: `src/data/cvData.test.js` vs `tests/cvData.test.js`
**Decision:** `src/data/cvData.test.js` (colocated).
- **Pro:** Discoverable, travels with the file under test.
- **Con:** Mixes test code with source code in tree.
- **Mitigation:** Use `.test.js` suffix — exclude from build via Vite's default `test: { exclude: ['**/*.test.js'] }` (or rely on Vite not bundling `.test.js`).

### T4 — Snapshot tests for cvData
**Decision:** Structural assertions only.
- **Pro:** Failures point to the exact missing/malformed field.
- **Con:** More verbose than `toMatchSnapshot()`.
- **Rejection of snapshots:** They hide the schema — defeats the purpose of a shape contract.

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Vitest peer-dep conflict with Vite 6.4.3 | Low | High | Pin `vitest@^2.1.0` (known compatible) |
| Lockfile churn breaks CI | Medium | High | Use `pnpm install --frozen-lockfile` in CI |
| Tests pass locally but fail in CI | Low | Medium | Run locally with `pnpm test` (same env) |
| Test runtime balloons | Low | Low | Limit to ~50 `it` blocks; 1 file only |

## Implementation Plan (preview — see tasks.md for actual)

1. Add devDeps to `package.json`
2. Create `vitest.config.js`
3. Create `src/data/cvData.test.js`
4. Add `test` scripts to `package.json`
5. Update `.github/workflows/ci.yml` with test step
6. Run `pnpm install` (regenerates lockfile)
7. Run `pnpm test` locally
8. Run `pnpm run lint` and `pnpm typecheck` (existing gates)
9. Commit + push
10. Verify CI green
