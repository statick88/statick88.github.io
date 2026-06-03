# Tasks: 2026-06-03-vitest-cvdata-shape

## Task T1 — Add Vitest devDependencies
- [ ] Edit `package.json` — add `vitest: "^2.1.0"` and `@vitest/coverage-v8: "^2.1.0"` to `devDependencies`

## Task T2 — Add test scripts
- [ ] Edit `package.json` — add `"test"`, `"test:watch"`, `"test:coverage"` to `scripts`

## Task T3 — Create vitest config
- [ ] Create `vitest.config.js` at project root with `environment: 'node'`, `include: ['src/**/*.test.{js,jsx}']`, `globals: false`

## Task T4 — Write shape contract tests
- [ ] Create `src/data/cvData.test.js` with `describe` blocks for `profileData`, `cvData.work`, `cvData.education`, `cvData.metrics`
- [ ] Use `it.each` for per-profile and per-metric assertions
- [ ] Include helper `ISO_DATE` regex and `isISODate()` validator

## Task T5 — Wire test into CI
- [ ] Edit `.github/workflows/ci.yml` — add `Run shape tests` step AFTER `Install dependencies` and BEFORE `Lint` in the `qa-gate` job
- [ ] Use `pnpm test` (single-run, no watch)

## Task T6 — Regenerate lockfile
- [ ] Run `pnpm install` locally to update `pnpm-lock.yaml` with new devDeps
- [ ] Verify `package.json` and lockfile are in sync

## Task T7 — Local verification
- [ ] Run `pnpm test` — all assertions pass
- [ ] Run `pnpm run lint` — no errors
- [ ] Run `pnpm typecheck` — no errors (tsconfig has `allowJs: true`, so JS modules type-check)

## Task T8 — Work-unit commit
- [ ] `git add package.json vitest.config.js src/data/cvData.test.js pnpm-lock.yaml`
- [ ] `git commit -m "test: add Vitest shape contract tests for cvData"`
- [ ] `git push origin main`

## Task T9 — CI verification
- [ ] Wait for CI to complete on `main`
- [ ] Verify `qa-gate` job has ✅ Tests step
- [ ] Verify `qa-gate` job has ✅ Lint step (still passing)
- [ ] Verify `qa-gate` job has ✅ Build step (still passing)
- [ ] Verify `security-gate`, `design-gate`, `deploy` jobs all green

## Task T10 — Archive
- [ ] Write `.atl/changes/2026-06-03-vitest-cvdata-shape/archive.md` with:
  - Final score (QA + Security + Design gates)
  - Files changed
  - Test runtime
  - Any deviations from the plan

## Acceptance Criteria
- All 10 tasks completed
- CI is green on `main` after push
- Test runtime < 5s locally
- No source code changes to `cvData.js`
