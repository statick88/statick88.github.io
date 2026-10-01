# Cleanup plan — everything outstanding

## Objective

Close every outstanding item from the WebMCP, data-reconciliation, UI-redesign and SonarQube work, in dependency order, without suppressing a metric or weakening a check.

## Current state

| Metric | Value |
| --- | --- |
| Commits on `feat/webmcp-cv-tools` | 10, HEAD `afacb81`, **nothing pushed** |
| Tests | 209 passing, 11 files |
| Typecheck / lint | clean / 0 errors, 36 warnings (all pre-existing) |
| SonarQube gate | `OK` |
| SonarQube bugs / vulnerabilities / code smells | 0 / 0 / 0 |
| SonarQube hotspots | **8, unresolved** |
| SonarQube coverage | **0.0%** — reporting artifact, see W2 |
| Files unreachable from `main.jsx` | 17, all referenced by tests or scripts |

---

## Wave 0 — Decisions only, no code

These cannot be executed without the user. They block or shape later waves.

| # | Decision | Why it needs a human |
| --- | --- | --- |
| D1 | **`exploitarium` is a fork of `bikini/exploitarium`** (verified via GitHub API). Keep, attribute to upstream, or remove? | It is a claim about authorship on a public CV. Not mine to assert. |
| D2 | **Mark the 8 `Math.random()` hotspots Safe?** They are decorative canvas particles in `Particles.jsx`. Doing so moves Security Review E→A. | A security judgement. An automated loop doing it turns the review into theatre. |
| D3 | **Delete the test-only modules in W3?** Some encode real capability (a forensic worker, a task queue, a session-store manager). | "Only tests use it" is not the same as "it is worthless". |
| D4 | **Push and open the PR?** | Delivery is the user's decision under ordinary repository policy. |

---

## Wave 1 — Measurement integrity

Nothing else is trustworthy until the numbers mean what they appear to mean.

### W1.1 Make coverage real
`pnpm test:coverage` reports 93.8% statements, but Vitest's default reporters are `text`, `html`, `clover`, `json` — **no lcov**, so SonarQube has always read `0.0%`.
Add `coverage: { reporter: ['text', 'lcov'] }` to `vitest.config.js`.
Verify: gate reports a non-zero coverage figure and `coverage/lcov.info` exists.
Forbidden: touching a test to move the number.

### W1.2 Widen the quality gate
The default "Sonar way" gate evaluates **ratings on new code only**. It reported `OK` while 11 code smells existed on the existing code. A green gate did not mean a clean codebase.
Add explicit conditions so the gate can express what the project actually cares about: a ceiling on code smells, and a minimum coverage on new code.
Verify: deliberately introduce a smell, confirm the gate goes red, then revert.

---

## Wave 2 — Correctness of published content

### W2.1 Migrate the CV generators off the legacy module
`generate-cv-markdown.js` and `generate-profile-cvs.js` import `src/data/cvData.js`, **not** `cv-data.yaml`. Running `pnpm generate:cvs` today reintroduces `379` repos, the invented `2026-2027` range, and four certifications absent from the SSOT — it would revert the entire reconciliation.
Point both at `@/data/cv-data`, then regenerate `cv-*.md` and review the diff before keeping it.
Verify: `pnpm generate:cvs` produces no change that contradicts `cv-data.yaml`.

### W2.2 Remove the duplicated `softSkills` and `services`
Both blocks now live in `cv-data.yaml` **and** in `cvData.js`. Once W2.1 lands, `cvData.js` has no consumer and the duplication is a trap for the next person to edit the wrong file.
Delete both blocks, then delete the file if nothing references it.

### W2.3 Heading hierarchy
The page has `h1` (the name) and then jumps to `h3` for every section heading — `h2` is skipped entirely. Screen readers announce a broken outline.
Either demote the card headings to `h2`, or promote the name to `h1` and restructure. Verify with an accessibility snapshot, not by reading the JSX.

### W2.4 Concurrency safety in `cv-data.ts`
Not yet inspected. The module asserts its own shape at import time. Confirm nothing mutates the exported collections at runtime.

---

## Wave 3 — Dead code, individually

17 files are unreachable from `main.jsx`. **None is a true orphan** — every one is referenced by a test, a build script, or an ambient type. So none can be bulk-deleted; each needs its own verdict.

| Group | Files | Recommended action |
| --- | --- | --- |
| Test infrastructure | `src/test/setup.ts`, `src/vite-env.d.ts` | **Keep.** Required by vitest and TypeScript respectively. Not dead. |
| Build/security | `src/config/security.ts`, `src/lib/schemas/ats-schema.ts` | **Keep.** Gate the CSP; validate the CV in `validate:cv`. |
| Legacy data | `src/data/cvData.js`, `src/data/courses.js` | `cvData.js` dies with W2.2. `courses.js` — decide separately. |
| Feature surface | `src/context/FeatureFlagsContext.tsx`, `src/types/features.ts`, `src/types/forensic.ts`, `src/lib/i18n/bilingual.ts`, `src/lib/sanitize/index.ts`, `src/hooks/usePerformanceMetrics.ts` | Per-file decision. Several may represent unbuilt features rather than dead code. |
| Services and workers | `src/services/{IntelService,SessionStorageManager,TaskQueue}.ts`, `src/workers/forensic.worker.ts` | **Escalate to D3.** These look like capability, not cruft. |

Rule for this wave: a file is deletable only when nothing references it **including tests**, or when its removal leaves the suite meaningfully weaker. "Nothing renders it" was not sufficient for W3 — the prefetch case proved that.

---

## Wave 4 — Enforcement and environment hygiene

### W4.1 Resolve the dangling native review
A review transaction (`review-2fffc5f4f7fab4da`) was started, consent was granted, and it was abandoned mid-collect. Its authority is still in `reviewing` state and must be released with `gentle-ai review abandon`, or deliberately resumed. Leaving it dangling can corrupt future candidate detection.

### W4.2 Upgrade SonarQube
Running **9.9.8**, which the server itself flags as no longer supported. Plan a container image bump and re-run the gate to confirm nothing regressed.

### W4.3 Turn the 5 skill copies into symlinks
`branch-pr` exists as five independent real files. Copies are how the drift happened; syncing them by hand will fail again. Replace with symlinks to one canonical directory.

### W4.4 Resolve the ineffective `.atl/` ignore
`.atl/` is in `.gitignore`, but its files are already tracked, so the rule does nothing. Either `git rm --cached -r .atl/` or commit the refreshed registry deliberately. Pick one and make it consistent.

### W4.5 CSP console errors
The built page logs errors from hashed sources with `=` padding, `frame-ancestors` delivered via `<meta>` (which that directive ignores), and an inline `onload` in `index.html:73` against a `script-src` without `'unsafe-inline'`. Pre-existing. Clean them so a real CSP violation is not lost in the noise.

---

## Wave 5 — Blocked on external input

| # | Item | Blocker |
| --- | --- | --- |
| W5.1 | Verify the ~88 certificates in `~/Documents/Certificados` | They are image scans with no text layer. Needs OCR before issuer and date can be trusted. `certifications[]` stays untouched until then. |
| W5.2 | Resolve the DockerLabs writeup count | Four figures in circulation: 59 by glob, 52 and 27 in the README, 45 in the GitHub description. 59 is currently used. |
| W5.3 | Audit the remaining CV claims | `~/Documents/job_applications/VERIFICATION_REPORT.md` is unreliable on repo counts (off by ~7x). It cannot be the arbiter. |
| W5.4 | Publish | Depends on D4. |

---

## Sequencing

```
D1..D4  ──▶  W1.1, W1.2  ──▶  W2.1 ──▶ W2.2  ──▶  W3  ──▶  W4  ──▶  W5
           (measurements)   (SSOT)     (dedupe)   (dead)  (ops)
```

W1 precedes W2 because a gate that under-measures makes every later verification unreliable. W2.1 precedes W2.2 because the legacy module cannot be edited safely until nothing generates from it. W3 follows W2 because deletion decisions depend on which module is the live source.

## Verification after every wave

```
pnpm validate:cv && pnpm typecheck && pnpm lint && pnpm test && pnpm build
scripts/sonar-gate.sh --project-key cv-diego --json
```

Never assert a gate passed without having run it in that wave.

## Rules for this whole plan

1. No rule suppression, no threshold changes, no hotspot marking, no test weakening.
2. No deletion based on "nothing renders it" — see the prefetch case.
3. One work unit per commit, each independently green.
4. Every metric reported as measured, never as remembered.