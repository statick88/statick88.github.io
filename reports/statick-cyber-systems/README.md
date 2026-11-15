# STATICK Cyber Systems — discovery and design proposal

**Status: baseline verified; production implementation blocked on content authority.** No production source files have been changed. The three pre-existing data/type/test edits remain owned by their original author. Branch: `feature/statick-cyber-systems`, based on `f6f5119`.

## 1. Measured current state

| Check | Result | Evidence |
| --- | --- | --- |
| Runtime guard | Node 22.23.5, pnpm 12.14.0; passed | `baseline/check:toolchain.log` |
| TypeScript | exit 0 | `baseline/typecheck.log` |
| ESLint | exit 0 | `baseline/lint.log` |
| Vitest | 27 files, 344 tests passed | `baseline/test.log` |
| Production build | exit 0; YAML valid; five ATS exports emitted | `baseline/build-corrected-runtime.log` |
| E2E | 22 passed; desktop Chromium and Pixel 5 | `baseline/test:e2e-corrected-runtime.log` |
| Dependency audit | exit 0 | `baseline/audit.log` |
| Desktop/mobile visual baseline | 1440×900 and 390×844; no horizontal document overflow observed | `baseline/desktop.png`, `baseline/mobile.png` |
| Browser structure | one h1; 15 navigation buttons; 15 native dialogs; zero images missing alt; zero `_blank` links missing noopener | local browser inspection; see below |
| SEO presence | title, description, canonical URL, viewport, one JSON-LD block, document language `es` | local browser inspection; semantic correctness not certified |
| Lighthouse / axe | not installed; not run | no scores or WCAG conformance claimed |

The initial `build`/`test:e2e` attempts exited 1 because nested `pnpm` calls resolved a mise shim unavailable to Node 22. Corrected runs inherited the existing Node 22 bin directory and actual pnpm executable. Both attempts are retained. No dependency installation, lockfile edit, runtime installation or environment configuration change was made. `fnm` is absent, so the documented invocation could not be followed literally; the existing Node 22 runtime and project guard were used instead.

Reproduction in this workstation:

```bash
mise exec node@22 -- bash -c '
  export PATH="$(dirname "$(command -v node)"):/home/statick/.local/share/mise/installs/node/latest/bin:$PATH"
  pnpm run check:toolchain
  pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm test:e2e
'
```

Browser measurements and screenshots used the local Vite development server on port 4175, not production or a deployed site. Existing E2E independently builds and serves `build:quick` on port 4173. No performance comparison should combine those two environments. E2E quick builds overwrite `dist`, so exported artifacts from an earlier full build must not be assumed to remain after E2E.

## 2. Evidence-backed findings

Severity describes preservation/accessibility/verification impact, not a vulnerability score.

| ID | Severity | Finding and evidence | Corrective proposal |
| --- | --- | --- | --- |
| F1 | High | React imports TypeScript data, not YAML (`src/lib/adapter.ts:7-17`). YAML validation succeeds independently. | Reconcile records with provenance, then generate a typed, Zod-validated UI artifact from YAML; no parallel editable authoritative mirrors. |
| F2 | High | TS has Spanish, English, Italian and Portuguese (`src/data/cv-data.ts:415`); YAML has only Spanish and English (`src/data/cv-data.yaml:513`). A direct switch loses visible CV records. | Human confirms whether TS-only records are valid and should be incorporated into YAML. Do not silently delete or invent them. |
| F3 | Medium | Fifteen primary-nav modal buttons, not the requested six page sections (`CvTopBar.tsx`, `navigation.ts`). | Add a six-anchor section layer while retaining all legacy modal IDs and open/close behavior. |
| F4 | Medium | ATS/no-JS prerender fallback is Spanish-only (`scripts/prerender-cv.ts:16-27`). | Keep current export paths; evaluate bilingual fallback without claiming React UI translation fixes SEO. |
| F5 | Medium | Build does not regenerate PDFs; that is a separate `generate:cvs` script (`package.json`). | Preserve published PDFs and verify their text separately; never claim a UI build validated PDF contents. |
| F6 | Medium | Existing tests cover focus, Escape, backdrop, theme, language and printing, but no automated WCAG/Lighthouse suite was found. | Add targeted integration and a11y checks; perform reproducible production Lighthouse runs and manual keyboard/zoom checks. |
| F7 | Low | AGENTS design gate says SF Pro/glassmorphism while current implementation and requested design use different typography. | Preserve platform readability and clarify the deliberate requested visual direction; do not mark the legacy font gate passed. |
| F8 | Medium | Adapter summary metrics are hardcoded (`adapter.ts:157-170`) despite YAML metrics. | Include metrics in provenance reconciliation; avoid new impact claims or fabricated business outcomes in case studies. |

Measured SEO description still contains marketing claims including repository count and education. Presence is verified; truth, freshness and consistency with ongoing studies require content provenance review. No broad security audit or WCAG certification was performed. Dependency audit success is not proof that all application behavior is secure.

## 3. Architecture proposal

Keep React, Vite, TypeScript, Tailwind, GitHub Pages, Zod and YAML. No router, modal library, animation library or font package is needed. Retain the existing single `SectionModalProvider`, native dialogs, print lifecycle, local language/theme state and download paths `/cv-es.pdf` and `/cv-en.pdf`.

Proposed data path, **not implemented**:

```text
cv-data.yaml → Zod validation → deterministic typed UI artifact
                           ├→ ATS exports
                           └→ bilingual CV generation/PDF verification
```

All consumers must be compared field-by-field before retiring editable mirrors. Retain source provenance for studies in progress, certification dates, skills and languages. Generated files must not become a second editable source.

Six section groups, with legacy details preserved:

| Primary navigation ES / EN | Existing content |
| --- | --- |
| Inicio / Home | identity, summary, services and skills |
| Trayectoria / Experience | experience, engagements, references and events |
| Proyectos / Projects | existing featured work, full projects, contributions and plugins |
| Exploitarium / Exploitarium | existing security research; no invented vulnerability claims |
| Academia / Learning | education, certifications, courses and research |
| Contacto / Contact | existing email/social links, ES/EN CV download |

Use ordinary fragment links for primary navigation. Arrow controls are explicit previous/next-section buttons with localized names and boundary states; do not register global arrow-key or wheel handlers. Move focus to section headings after deliberate arrow activation, respect reduced motion, and never steal focus on ordinary scrolling. Keep old section IDs reachable through modal triggers; preserve print order independently of visual grouping.

Project previews become compact case studies: existing description, existing stack, and existing public course/repository links. Label evidence as source material, not audited outcomes. Do not infer project ownership, deployment adoption, or quantified impact from a repository link.

## 4. STATICK Cyber Systems proposal

The current synchronized tokens in `design/system.md` remain the compatibility base. Artboards use those recorded colors and system font fallbacks; this proposal does not pretend that new fonts are installed.

| Role | Proposed usage |
| --- | --- |
| Midnight navy | existing dark base `#030a17` and panel `#071223` |
| Cyan | existing accent `#22d3ee`, strong emphasis `#67e8f9` |
| Security green | existing `ct-ok` `#4ac586`; accompanied by a text label, not an implied security certification |
| Body | existing Inter/system sans fallback; readable 16px direction |
| Display | Space Grotesk candidate, conditional on self-hosted subset/weight and measured budget; system fallback in prototypes |
| Technical labels | JetBrains Mono candidate; system monospace until payload is justified |
| Spacing | 8px rhythm: 8/16/24/32/48/64, allowing content-driven wrapping |
| Cards / dialogs | preserve existing 20px / 24px radii and semantic focus colors |
| Motion | no entrance-opacity dependency; optional short hover transitions only, reduced-motion override |

No new font network requests are proposed by default. Test contrast for both themes and all focus/control states; token pairs alone are not a WCAG 2.2 AA audit. Static cinematic lighting, large editorial hierarchy and asymmetric composition should establish the premium character without video, canvas or scroll hijacking.

Three alternatives are under `design/statick-cyber-systems/`. Browser structural checks on each found six sections, one h1, two disabled arrow boundaries and no horizontal overflow at 1440px or 390px. Six proposal screenshots are retained beside this report; these are not after-implementation evidence. Recommendation: **Systems Editorial**, balancing recruiter scanning and technical evidence. **Research Index** prioritizes dense evidence; **Human Signal** prioritizes identity/contact. They are proposals, not implemented UI.

## 5. Incremental plan and acceptance criteria

1. Reconcile data authority first. Preserve every valid record, compare YAML/UI/export semantics, test Zod rejection and unchanged stored source on failure. Obtain the content decision for F2 before migration.
2. Introduce the six-section shell with unchanged dialogs and all existing IDs. RED tests for ES/EN labels, anchor destinations, arrow boundaries/focus, unhandled native arrow keys and preserved downloads; then GREEN and existing suites.
3. Apply the chosen visual direction using semantic tokens. Verify both themes, 320/390/768/1440 widths, 200% zoom, keyboard focus visibility, modal scroll containment and print restoration. Keep no-animation content visible.
4. Expand existing project previews into source-backed case studies, without adding factual claims. Assert exact source URLs and ES/EN descriptions.
5. Normalize the production build; run QA/E2E/a11y checks, security scan and PDF/ATS proof. Compare screenshots against the retained baseline. Run native RDD assessment on each source work-unit candidate; request provider-owned consent only when the returned route requires review.

Lighthouse protocol when the tool is available: pin Lighthouse and Chromium versions; serve the full production build at the same loopback URL; fresh browser profile; mobile simulated throttling with recorded CPU/network configuration; three runs per candidate, report median and all raw JSON/HTML reports; use the same viewport, locale, cache state and content. Record LCP/CLS/TBT and all four category scores. Target >=90, but report actual results and technical constraints rather than waive failures silently. Do not compare a development screenshot server to production Lighthouse numbers.

## 6. Risk matrix and limits

| Risk | Impact | Mitigation / status |
| --- | --- | --- |
| Data migration drops TS-only CV facts | High | Blocked on content reconciliation; no source migration performed |
| Existing human edits are overwritten | High | Three original dirty files untouched; excluded from task commits |
| Navigation loses legacy modal entry points | Medium | Planned compatibility layer; production code unchanged |
| Theme/print regressions | Medium | 22 baseline E2E passed; post-change checks not yet applicable |
| Font and animation payload | Medium | No new dependency or font loaded |
| False accessibility/performance guarantee | High | No WCAG compliance or Lighthouse score claimed |
| Published site changes | High | No push, merge, deployment or production modification |

**Pending deliverables:** functional redesign, after screenshots, visual regression comparison, automated a11y audit, manual full WCAG evaluation, Lighthouse before/after, PDF regeneration/text proof and final native source-review evidence. Existing screenshots are before-only, not comparative results. Native RDD mode was read as enabled; no source candidate has been created or approved. Documentation/design proposals do not constitute a native review receipt. The required post-writer native assessment was attempted and returned `nativeRisk: unassessable` because untracked scope was not declared; its plan required writer self-verification and no independent verifier. No START, review consent, approval or authority acknowledgement occurred. The proposals received structural checks and browser renders, not native review.

## Decision needed

Should all current TypeScript CV records absent from YAML be treated as valid and migrated into YAML (including Italian and Portuguese), preserving their existing stated levels? Or should YAML alone define publishable facts, with TS-only records held aside for review rather than deleted? This is a content-authority decision; tests cannot establish the truth of language proficiency.
