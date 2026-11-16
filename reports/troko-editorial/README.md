# STATICK editorial adaptation

Branch: `feature/troko-editorial`. Local feature work only: no publishing or deployment. Local commit identities are recorded in the feature log. The existing Cyber Systems worktree edits were preserved.

## Result

- Global cream/charcoal identity with olive/lime actions, stronger editorial typography, existing portrait and Diego / STATICK branding.
- Six primary anchor groups (Inicio, Trayectoria, Proyectos, Exploitarium, Academia, Contacto), explicit focus-moving up/down controls, and all 15 retained modal shortcuts. Standalone layouts opt out of primary anchors so they never point at missing groups.
- Responsive certificates/course manual: desktop contents and record leaves, mobile record, labeled index, previous/next controls, scoped keyboard shortcuts and complete-list mode.
- Existing course/repository links, certification sorting/status/counts/issuer/date/optional IDs, 15 section IDs, native dialogs, ES/EN, theme preferences, PDF paths, complete printing and ATS exports retained.
- No new dependencies, external fonts, robot branding, affiliation claims, certificate PDFs or verification links were introduced.
- Removed the certification preview's unsupported promise of verification links.

Reference evidence came from public HTML/CSS/JS at [Troko](https://trokotec.com/troko/) and [its manual](https://trokotec.com/manual/), not a claim of visual inspection of those external sites.

## Design artifacts

`design/system.md` and `design/system.html` were synchronized from `src/index.css`, `tailwind.config.js` and the manual component: 20 semantic colors per theme, sans/mono typography roles, existing spacing/radius conventions and portrait shadow.

| Artboard | Use / tradeoff |
| --- | --- |
| `design/troko-editorial/01-editorial-manual.html` | Chosen and implemented; focused reading with one record per page. |
| `design/troko-editorial/02-learning-library.html` | Alternative: compact hero and catalog-first hierarchy. |
| `design/troko-editorial/03-field-notes.html` | Alternative: document-first notebook, less promotional hierarchy. |

Self-check: artboards use only the synchronized semantic colors and system sans/mono font fallbacks. Responsive one-column rules apply at 820px, semantic landmarks and visible focus remain, and no external assets or animation dependencies are referenced. Production screenshots, not artboard renders, were inspected at desktop/mobile sizes.

## Verification evidence

Runtime: `fnm use`, Node 22.23.4, pnpm 12.14.0. Ambient Node 26 was not used for project checks.

| Check | Observed result |
| --- | --- |
| Palette RED | New palette assertion failed against old cyan tokens. |
| Palette GREEN + existing portfolio | 28 tests passed. |
| Manual RED | New manual test suite failed because LearningManual did not exist. |
| Focused final unit checks | 54 tests passed across tokens, manual, certificate preservation, modern portfolio and compact sections. |
| Full unit run | Final current-source run: 356 passed / 30 files, including the standalone compatibility regression (job-11). |
| Full browser regression | Latest navigation + manual suite: 32 passed, desktop + mobile Chromium (job-9), followed by full build. |
| Final manual browser check after visual/lint corrections | 6 passed, desktop + mobile; followed by successful full build. |
| Full production build | Final current-source build passed CV validation, Vite build, CSP validation, prerender and all structured exports (job-11). |
| Dependency audit | No known vulnerabilities. No dependency or lockfile changes. |
| Scoped lint / diff whitespace | Passed for all changed source and test files; `git diff --check` passed. |
| Full lint | Passed after fixing all seven pre-existing direct-node-access errors using accessible role queries. No lint rule was disabled. |
| Typecheck | Passed after safe pager destination handling; final standalone opt-in also passes. |
| Native ASSESS | `nativeRisk: unassessable` due undeclared untracked scope; item-3 escalation correctly requires independent verification for shared navigation/layout consumers. No native candidate/reviewDue/continuation or approval receipt. |
| Local preview | HTTP 200 at http://127.0.0.1:4186/. |

Browser checks cover exact theme colors, page boundaries, index jumps, preserved links, complete-list mode, mobile no-overflow, scoped keyboard behavior, focus restoration, ES/EN controls, complete print contents and restoration of the previous page. Existing modal/theme/download regressions also passed. Initial palette/manual screenshots were visually inspected; linked captures were then refreshed from the 32-test navigation run. This is not a WCAG or Lighthouse certification.

### Screenshots

- [Desktop light](desktop-light.png)
- [Desktop dark](desktop-dark.png)
- [Desktop manual](desktop-manual.png)
- [Mobile manual](mobile-manual.png)

Full command logs are session-local: `/tmp/gpcufnbD/gentle-jobs-cSjyDG/job-1.log` (baseline), `job-2.log` (28 E2E), `job-3.log` (full gates), `job-4.log` (build), `job-5.log` (audit), `job-6.log` (final 6 E2E + build).

## Independent verification — incomplete

User `procede` authorized completing the previous navigation work. Its four original failures, seven lint errors and pager type error are now corrected without disabling rules or removing tests. An intermediate full run timed out after 5s on repeated all-course link queries while browser tests ran concurrently; the test now queries each link collection once and asserts exact hrefs/text in both languages. No timeout was raised and no assertion was dropped. The next full run passed all 355 tests.

One independent verifier inspected S1–S4 and identified no product blocker. Its isolated focused run observed 72 passing tests / 8 files, but it used pnpm 12.21.0 rather than the required 12.14.0; therefore this is not accepted as compliant independent proof. Its typecheck exited2 because the parent-authored scratch allowlist omitted `scripts/export-structured`, which existing tests import. This is a recoverable harness setup failure, not an unavailable project runner or proven code defect.

The verifier also reported Corepack downloads, an external `/tmp/.pnpm-store/v11` cache and installation lifecycle activity through the `node_modules` symlink. No rollback/cleanup was attempted and no dependency state was claimed revalidated. A bounded parent incident diagnosis confirmed Node22.23.4, pnpm12.14.0 and no new source/lockfile changes in Git status. Existing unrelated data/type/drift-test/old-artboard edits remain preserved. Scratch identities: `/tmp/troko-verify-current.cdzWTH`, `/tmp/troko-verify-baseline.SBPGTp`.

Per the unavailable-verifier rule, the verifier was not retried/replaced. The user accepted this limitation with `procede`; no independent PASS is claimed. Only the previously pending parent final checks were resumed: all356tests, lint, typecheck, full build/CSP/ATS and audit passed with asserted pnpm12.14.0 / Node22.23.4 (job-11). Local commits keep the unchanged repository hooks. No push, merge or deployment occurred.

## Local work-unit delivery

The local feature-branch chain keeps identity, learning manual, primary navigation, chosen design and alternatives/evidence separate. No PR, push or merge was created. Identity: `aff5c3a` (168 authored changed lines). Manual: `0c8f74f` (374 lines). Navigation: `1385673` (509 lines); this is the smallest cohesive slice after one slicing pass because moving15 existing JSX panels accounts for227 additions/deletions, and its configuration, compatibility fix, tests and docs must travel together. No code, tests or whitespace were removed to meet a budget. The repository specifies no size-exception label policy. Chosen design/system: `0664781` (366 lines). Final alternatives/evidence slice identity is recorded in `odd/tasks/troko-editorial.md` (local ignored task log mirrored in memory).

The first four committed-range native assessments reported undeclared untracked scope even with `committedOnly:true`; no candidate/reviewDue route or receipt is returned. No native approval is claimed and no provider consent was invented. Existing unrelated work was deliberately left outside these commits.

## Accepted limitation

The user replied `procede` to the explicit incomplete-verification disposition. Independent verification remains incomplete, not approved or replaced; no fresh verifier run is proposed. This is not native review consent or approval. The earlier data-authority/migration tasks remain outside this adaptation.

Risk: item 3 — shared navigation/layout code also serves legacy modal and standalone/print consumers. Their functional preservation is covered by parent checks, but required independent proof remains incomplete. No CLI/options/parsers changed; a CLI differential check is not applicable.
