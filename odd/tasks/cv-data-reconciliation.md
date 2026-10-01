# CV data reconciliation against verified sources

## Objective

Reconcile `src/data/cv-data.yaml` (and the adapter that renders it) so every published claim is either backed by a verifiable source or removed. Add the verified security work that the site currently omits entirely.

## Problem

The site carries numbers and entries with no source, while omitting the strongest verifiable work. A local audit (`~/Documents/job_applications/VERIFICATION_REPORT.md`, 2026-09-09) graded the CVs as "significant fabricated content" and listed 8 required corrections — none were applied. Separately, `src/lib/adapter.ts` renders hardcoded metrics that contradict the YAML, so the live site shows different numbers than the SSOT.

## Why

A CV is a set of claims. A claim without a traceable source is a liability in an interview, not an asset. The integrity rule is strict: no source means the figure is removed, not estimated.

## Evidence base (all verified, do not re-litigate)

### GitHub API ground truth for `statick88`, checked 2026-10-01
- **400** public repos total: **266** non-fork, **134** forks.
- Public (HTTP 200): `MindLedger`, `jarvis-os`, `kali-i3`, `pentest-methodology`, `course-of-cybersecurity`, `open-api-facturacion-sri`, `dockerlabs-writeups`, `lab_fundamentos_cyber`, `cyber-guardians`, `abc-cyb-101-labs`, `exploitarium`, `cybervault`.
- Not public (HTTP 404) but **exist locally** in `~/Security`: `jarvis`, `cyber-author`, `pentesting_ai`, `explotar`, `pentest`, `inmotion-agosto`. Describe them; never link them.
- **HTTP 404 on both local and remote**: `go-snake`, `sdd-docker`.

### The local audit is unreliable on repo counts
`VERIFICATION_REPORT.md:61` claims ~80-90 total / ~30-40 original. That is off by roughly 7x against the API. Do not use its repo counts. Its finding that "5 repos do not exist" is also imprecise: those repos exist locally, they are just not public.

### Verified engagements in `~/Security`
- Red team on vLLM 0.19.0 API: 10 confirmed findings, mean CVSS 8.2, executable PoCs. `explotar/REPORTE_EJECUTIVO.md:1-22`
- Pentest + red team on whoami-labs.com: 9 vulnerabilities (2 critical, 2 high), 205 records exfiltrated, 0 false positives, declared `Status: COMPLETE`. `whoami-labs/REPORT-FINAL-V2-CONSOLIDATED.md:1-27`
- Signed authorized engagement: authorization letters (PDF+TXT), deliverable report dated 2026-09-16, PoC bundle with `SHASUM256_DELIVERABLES.txt`. `pentest/alerta/`
- `pentest-methodology`: 116 findings mapped to MITRE ATT&CK (28/53 techniques), NIST CSF 2.0, OWASP Top 10 (35 findings).
- DockerLabs corpus: **59** writeups counted by glob. `corpus/INDEX.md:1` — the README's own "52" and "27" are inconsistent, so use 59.
- Teaching material: `lab_fundamentos_cyber` (26 units, 243 challenges), `CyberGuardians` (7 module data files, Next.js + Vitest).
- Android reversing: `movil/` guides dated 2025-07-24 (Ghidra + apktool + Frida); `xuper/ahtd_poc` declared `Development Status :: 3 - Alpha`.

### Material that must NEVER be claimed as personal work
`aportes/` (17 open-source clones), `books/` (Telegram downloader), `natas/` (one-line hint per level, not 35 solved labs), `tareas/forense/tools/volatility3` (Volatility clone), `cyber-author` (adaptation of Clo-Author by Gentleman Programming), `pentesting_ai` (third-party submodule `S1N6H/pentest-harness`), `course/cybersec-lessons` ("faithful replica" of a BigDataStack course), `prueba/` (duplicates).

### State terminology is binding
`jarvis` README says "Phase 1: scaffolding complete / Phase 2 in progress" and `pyproject.toml` says Alpha. `pentesting_ai` spec says v0.1.0. `red/netmon` is v0.1.0. Any listing must carry the project's own status wording. Never present scaffolding as production.

### Certificates are NOT verifiable
`~/Documents/Certificados/` holds ~88 PDFs but they are image scans with no text layer (`pdftotext` returns empty). Issuer and date cannot be verified without OCR. **Do not modify `certifications[]`.** Report only.

### User-confirmed facts (2026-10-01)
- UCM cybersecurity master's: **in progress, started 2026-02**. No thesis, no completion certificate on disk.
- **13 years** of verifiable teaching.
- English **B2**. Other languages **A2**.

## Scope

### In

**1. `src/data/cv-data.yaml` metrics**
| Metric | Current | Action |
|---|---|---|
| `githubPublicRepos` | 379 | 400 |
| `yearsTeaching` | 6 | 13 |
| `languagesSpoken` | 2 | 4 |
| `publicReposAudited` | 130 | **delete** (no source) |
| `totalProjectsAudited` | 64 | **delete** (no source) |
| `yearsExperience` | 10 | keep |
| `apcYearsService` | 9 | keep |
| `averageCohortScore` | 93.4 | keep |
| `totalHoursTeaching` | 200 | keep |
| `lastVerified` | 2026-06-01 | 2026-10-01 |
| `metadata.dataSources` | cites `cv-consolidado.md` | that file does not exist; correct the reference |

**2. `profile.summary`** — "6+ como docente universitario" → 13.

**3. UCM education entry** — keep `startDate: 2026-02-01`, keep `in-progress`, **delete `endDate: 2027-12-31`** (invented, no source).

**4. `languages[]`** — four entries: Spanish native, English B2, Italian A2, Portuguese A2. Remove any "Intermediate (B1+)" claim for English.

**5. `projects[]`**
- Delete `go-snake` and `sdd-docker` (no local or remote basis).
- Keep `exploitarium` and `cybervault` (both HTTP 200).
- Add the verified public repos with working links: `pentest-methodology`, `dockerlabs-writeups`, `kali-i3`, `lab_fundamentos_cyber`, `cyber-guardians`, `course-of-cybersecurity`, `MindLedger`, `jarvis-os`, `open-api-facturacion-sri`, `abc-cyb-101-labs`.
- Do **not** link `jarvis`, `cyber-author`, `pentesting_ai`, `explotar`, `pentest`. If described, use the project's own status wording and no URL.
- Remove the unsourced `stars`/`forks`/`issues` numbers rather than refreshing them; they were never sourced.

**6. Client engagements** — describe the authorized engagements **without naming the client and without a link**. Signed engagement letters may carry confidentiality terms, and client attribution is the user's call, not an inference. Record them as verifiable capability (findings count, severity mix, methodology coverage) under the security experience, not as portfolio projects.

**7. `src/lib/adapter.ts`** — `getDefaultMetrics()` is hardcoded and contradicts the YAML. It already imports `metrics` and never uses it. Wire it to the YAML metrics. This is the reason the live site currently renders stale numbers.

### Out

- `certifications[]` (unverifiable).
- Any change to `services[]`, `softSkills[]`, `experience[]`, `skills[]`.
- WebMCP tooling, CSP, adapters other than metrics.
- Creating `config/profile.yml` (it does not exist; that is a separate decision).

## Constraints

- `tsconfig`: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`.
- Do not touch CSP files (`scripts/generate-csp.mjs`, `src/config/security.ts`, `_headers`).
- Do not touch `src/webmcp/**` or `src/hooks/useWebMcpTools.ts`.
- `.atl/.skill-registry.cache.json` and `.atl/skill-registry.md` are tooling noise — leave them uncommitted.
- Regenerate the markdown CVs via `pnpm generate:cvs` if the project convention requires it; verify the diff before keeping it.

## Acceptance criteria

1. No metric in the rendered site disagrees with the YAML.
2. `publicReposAudited` and `totalProjectsAudited` are gone.
3. No project links to a repo that returns 404.
4. No invented `endDate` on the UCM entry.
5. Every added number carries a traceable source noted in a comment or the feature doc.
6. No third-party material listed as personal work.
7. `pnpm validate:cv`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all pass.

## Checks

```
pnpm validate:cv
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Progress

T1 map sources [x] / T2 verify GitHub API [x] / T3 confirm facts with user [x] / T4 this doc [x] / T5 apply changes [ ] / T6 verify [ ] / T7 commit [ ]

## Next step

Apply T5 via one delegated writer, then verify.

## Open questions

- Client engagement attribution: deferred to the user. Implemented conservatively (no names, no links).
- Whether `profile.yml` should be created as a real SSOT. Deferred.
- `~/.security/phishing/` caches SharePoint HTML containing a signed `DownloadCode` share token. Not an attack; a captured share link that is no longer confidential.