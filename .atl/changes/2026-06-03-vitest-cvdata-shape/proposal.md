# Proposal: 2026-06-03-vitest-cvdata-shape

## Why

The 2026-06-02-profile-consolidation change introduced a single source of truth (`src/data/cvData.js`) that is now consumed by:
- The React UI (`src/App.jsx` via `profileData`)
- The site generator (`generate-cv-markdown.js`)
- The 8-variant generator (`generate-profile-cvs.js`)
- The Design gate in CI (which fails if the 8 expected `.md` files don't exist)

If someone renames a profile, removes a work entry, or changes the `Metrics` shape, the failure surface is unclear:
- React app: silent UI bugs (e.g., undefined `summary`)
- Generators: silent file-name mismatches
- CI design-gate: catches only the 8 .md files, not shape

We need **shape contract tests** that fail fast on data corruption, so that `cvData.js` is treated as a typed schema, not a JS blob.

## What Changes

- Add **Vitest** as devDependency (lightweight, ESM-native, used by Vite by default)
- Add `vitest.config.js` with the JSDOM environment for any future component tests
- Add `src/data/cvData.test.js` with shape assertions:
  - `profileData` has exactly 4 profiles (developer, hacker, research, curriculista)
  - Each profile has `id`, `label`, `icon`, `color`, `desc`, `summary` (string)
  - `cvData.metrics` has 4 entries with `value`, `label`, `source`
  - `cvData.work` has 6 entries with `company`, `position`, `startDate`, `description`, and (where present) `endDate`, `website`
  - All dates are valid `YYYY-MM-DD` strings
  - `summary` ≤ 350 chars (CV display constraint)
  - No empty `description` fields
- Add `pnpm run test` script
- Add `pnpm run test:watch` script
- Add `pnpm run test:coverage` script (with v8 provider)
- Wire `test` into the **QA gate** in `.github/workflows/ci.yml`
- No source code changes to `cvData.js` (the data is already correct)

## Scope

- **In:** Vitest setup, 1 test file (~120 lines), CI integration
- **Out:** Component tests (separate change), E2E (Playwright, separate change), mutation testing

## Risk Assessment

- **R1 (CI slows down):** Vitest on 1 file = ~500ms. Negligible.
- **R2 (false positives on date format):** Mitigated by using `matcher` patterns, not Date parsing.
- **R3 (snapshot brittleness):** Using structural assertions, not snapshots.

## Success Criteria

- `pnpm run test` exits 0 with all assertions passing
- `pnpm run test:watch` is functional
- CI QA gate now includes `test` step and runs it before lint
- Total CI runtime increase: <5s
