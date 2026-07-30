# Tasks: CV Portfolio — Profile Consolidation

**Change ID:** `2026-06-02-profile-consolidation`
**Status:** Ready
**Parent:** [design.md](./design.md)

## Task Decomposition

Tasks are ordered to enable incremental verification. Each task ends in a committable state.

### T1: Refactor `src/data/cvData.js` — verified data layer

**Scope:** Single file, full rewrite.
**Acceptance:**
- [ ] `cvData.basics` updated with new `label.es/en` (Magíster UTPL + MSc UCM en curso).
- [ ] `cvData.work` has exactly 6 entries: ABACOM, ESPE, APC, Codings, ISTJM, UIDE.
- [ ] ISTJM dates are `2020-10-01` to `2022-03-31`, position is `Docente Titular Auxiliar - Carrera de Ensamblaje y Mantenimiento de Equipos de Cómputo`.
- [ ] `cvData.education` has exactly 3 entries: UCM, UTPL, UNL.
- [ ] `cvData.skills` has the full 50+ verified skills, no duplicates.
- [ ] `cvData.projects` has 6 verified projects (open-api-sri, multi-agent-system, material-educativo-unl, UCM-Moodle, OpenWrt-HW, ms08-067).
- [ ] `cvData.certifications` has 12 verified entries (top 12 from the 134+).
- [ ] `cvData.metrics` is new and has 4 hard numbers.
- [ ] `profileData` has 4 profiles (developer, hacker, research, curriculista).
- [ ] No entry contains `"Zulia"`, `"LUZ"`, or `"OSCP"`.
- [ ] No "Reverse Engineering" or "Malware Analysis" duplicate in any profile.
- [ ] All 7 new skills present: `Auditoría de Pentesting`, `Ingeniería Inversa y Explotación`, `Hardware Hacking (OpenWrt)`, `NotebookLM Power-User`, `OpenCode + MCP`, `SRI / XAdES`, `Diseño Curricular (ABP / ADDIE)`.

**Work unit:** 1 file, ~470 LOC after rewrite.
**Commit:** `feat(data): consolidate verified CV profile in cvData.js`

### T2: Add `Metrics.jsx` component

**Scope:** NEW file `src/components/Metrics.jsx`.
**Acceptance:**
- [ ] Renders 4 metrics in a responsive grid (2 cols mobile, 4 cols desktop).
- [ ] Each metric has value, unit, label (es/en), and tooltip with source.
- [ ] Hover effect (scale 1.03 + translate -2px).
- [ ] `aria-label` on the section.
- [ ] Glassmorphism style consistent with existing components.

**Work unit:** 1 NEW file, ~45 LOC.
**Commit:** `feat(components): add Metrics section with 4 verified hard numbers`

### T3: Update `ProfileSelector.jsx` — add 4th profile

**Scope:** Single file, 1 line + label change.
**Acceptance:**
- [ ] `profiles` array has 4 entries: developer, hacker, research, curriculista.
- [ ] Each has distinct color and icon.
- [ ] Dropdown renders correctly with 4 items.

**Work unit:** 1 file, +1 / -0 LOC.
**Commit:** `feat(components): add 4th curriculista profile to ProfileSelector`

### T4: Update `App.jsx` — wire Metrics, default profile, summaries

**Scope:** Single file, multiple changes.
**Acceptance:**
- [ ] Default `activeProfile` is `curriculista`.
- [ ] `getSummary()` returns 4 summaries (one per profile).
- [ ] `<Metrics metrics={cvData.metrics} t={t} />` rendered between Hero and Summary.
- [ ] PDF download link template updated to `/cv-{id}-{lang}.pdf`.
- [ ] No `console.error` in browser console.

**Work unit:** 1 file, +60 / -20 LOC.
**Commit:** `feat(app): wire Metrics, default curriculista profile, and 4 summaries`

### T5: Refactor `generate-profile-cvs.js` — 4 profiles, deduplicated

**Scope:** Single file, generator update.
**Acceptance:**
- [ ] Loops over `Object.keys(profileData)` (4 entries now).
- [ ] Outputs `cv-{developer,hacker,research,curriculista}-{es,en}.md` (8 files).
- [ ] Skills list has no duplicates within any profile.
- [ ] Each variant includes: header, summary, skills grouped, top-5 certs.

**Work unit:** 1 file, +15 / -10 LOC.
**Commit:** `feat(generators): add curriculista profile to generate-profile-cvs.js`

### T6: Update `generate-cv-markdown.js` — include metrics

**Scope:** Single file, generator update.
**Acceptance:**
- [ ] Outputs `cv-es.md` and `cv-en.md` with consolidated data.
- [ ] Includes a "Métricas" section with the 4 hard numbers.
- [ ] All 6 projects rendered.
- [ ] All 12 certifications rendered.
- [ ] Full 6-job work history.
- [ ] Full 3-entry education.

**Work unit:** 1 file, +25 / -10 LOC.
**Commit:** `feat(generators): include verified metrics in main CV markdown`

### T7: Harden CI gates — remove `|| true`, add verifications

**Scope:** `.github/workflows/ci.yml`.
**Acceptance:**
- [ ] Line 32: `pnpm run lint` (no `|| true`).
- [ ] Line 35: `pnpm run typecheck` (no `|| true`).
- [ ] Line 67: `pnpm audit --audit-level=moderate` (no `|| true`, no `|| true` after).
- [ ] `design-gate` runs `node generate-profile-cvs.js` and `node generate-cv-markdown.js`.
- [ ] `design-gate` verifies all 8 `cv-{profile}-{lang}.pdf` files exist.
- [ ] `design-gate` checks bundle size (warn if > 250KB).
- [ ] `security-gate` runs a basic secret scan.

**Work unit:** 1 file, +25 / -10 LOC.
**Commit:** `ci: harden gates — remove || true, add CV verification, secret scan`

### T8: Add security headers to `vite.config.js` and `index.html`

**Scope:** 2 files, minor changes.
**Acceptance:**
- [ ] `vite.config.js` has `server.headers` with `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.
- [ ] `index.html` has `<meta http-equiv="X-Content-Type-Options" content="nosniff">` and `<meta http-equiv="X-Frame-Options" content="DENY">` (for GitHub Pages fallback).
- [ ] Build still succeeds.

**Work unit:** 2 files, +12 / 0 LOC.
**Commit:** `feat(security): add security headers to dev server and index.html`

### T9: Run all 3 gates locally and fix any failures

**Scope:** No file changes; run commands and fix issues.
**Acceptance:**
- [ ] `pnpm install` clean.
- [ ] `pnpm lint` exit 0.
- [ ] `pnpm typecheck` exit 0.
- [ ] `pnpm build` succeeds, dist/ created.
- [ ] `pnpm audit --audit-level=moderate` 0 vulnerabilities.
- [ ] `node generate-profile-cvs.js` produces 8 .md files.
- [ ] `node generate-cv-markdown.js` produces 2 .md files.
- [ ] All 8 .pdf files exist in working tree (after `pandoc` render).

**Work unit:** N/A.
**Commit:** N/A (or `chore: verify local gates pass` if fixes were needed).

### T10: Visual validation in browser

**Scope:** Manual `pnpm preview` + browser check.
**Acceptance:**
- [ ] Default profile is `curriculista` on load.
- [ ] Metrics section visible with 4 numbers.
- [ ] ProfileSelector dropdown shows 4 options.
- [ ] Switching profiles updates summary, PDF download link, and section content.
- [ ] ES/EN toggle translates all user-facing strings.
- [ ] Dark/Light toggle works.
- [ ] Mobile (375px), Tablet (768px), Desktop (1440px) layouts look clean.
- [ ] No console errors or warnings.

**Work unit:** N/A.

### T11: Commit and push

**Scope:** Git operations.
**Acceptance:**
- [ ] `git add` all changed files.
- [ ] `git commit` with conventional commit message (multi-line for 4+ task changes).
- [ ] `git push origin develop` (current branch).
- [ ] CI passes (lint, typecheck, build, audit, CV verify).
- [ ] PR opened to `main` (optional, for the user to merge).

**Work unit:** 1 commit, 1 push.
**Commit:** chore: archive change 2026-06-02-profile-consolidation with [summary of gates passed]

## Task Dependencies

```
T1 ──┐
     ├──► T4 ──► T9 ──► T10 ──► T11
T2 ──┤
T3 ──┘
T5 ──► T9
T6 ──► T9
T7 (parallel, can be done after T6)
T8 (parallel, can be done after T1)
```

## Estimated Effort

| Task | LOC | Complexity | Wall Time |
|------|-----|-----------|-----------|
| T1 (cvData.js rewrite) | +200/-100 | Medium | 15 min |
| T2 (Metrics.jsx) | +45 | Low | 5 min |
| T3 (ProfileSelector) | +1 | Trivial | 1 min |
| T4 (App.jsx) | +60/-20 | Medium | 10 min |
| T5 (generate-profile-cvs) | +15/-10 | Low | 5 min |
| T6 (generate-cv-markdown) | +25/-10 | Low | 5 min |
| T7 (CI gates) | +25/-10 | Medium | 10 min |
| T8 (vite.config + index.html) | +12 | Low | 3 min |
| T9 (local gates) | N/A | Low | 5 min |
| T10 (visual check) | N/A | Low | 5 min |
| T11 (commit + push) | N/A | Trivial | 2 min |
| **Total** | **~480 LOC** | | **~70 min** |

## Risks Specific to Tasks

- **T1** (highest risk): The 470-LOC rewrite can break the SPA if imports fail. Mitigation: re-run `pnpm typecheck` after T1.
- **T7**: Removing `|| true` may expose latent lint/TS errors not in the current set. Mitigation: run `pnpm lint` and `pnpm typecheck` before T7 to identify; fix any issues as part of T7.

## Out-of-Task Items (Parked for Future)

- Add Vitest tests for `cvData` shape (FR-9 in a future change).
- Add 3D avatar / WebGL hero (cosmetic, separate change).
- Add blog / articles section (separate change).
- Add i18n with i18next (separate change).
