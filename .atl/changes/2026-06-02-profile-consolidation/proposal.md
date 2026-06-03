# Proposal: CV Portfolio — Profile Consolidation

**Change ID:** `2026-06-02-profile-consolidation`
**Status:** Proposed
**Author:** statick (orchestrator)
**Date:** 2026-06-02

## Why

The `cv-diego` portfolio site (deployed at `statick88.github.io`) currently serves CV data with **inaccuracies vs. the consolidated profile** in `~/Documents/job_applications/core/cv-consolidado.md` (the single source of truth, verified through a 130+ PDF audit + NLM + GitHub + 3 directory audits on 2026-06-01).

Examples of drift:
- `cvData.js` lists `Universidad de Zulia` (LUZ) and `Universidad UIDEM` — **neither verified** as work experience with PDF reference. These appear to be placeholder/legacy entries from before the consolidation.
- `cvData.js` lists IST Juan Montalvo as "2019-10-31 → 2022-10-31" with position "Docente Ocasional Tiempo Completo" — but the verified PDF `Referencias_laborales_ist_juan_montalvo.pdf` (ref Ing. Ana Gabriela Montalván Salcedo, Mba, CI 1103882955) states: **"Docente Titular Auxiliar - Carrera de Ensamblaje y Mantenimiento de Equipos de Cómputo"** from **"octubre 2020 a marzo 2022"**.
- `cvData.js` lists a certification `"Título de Maestría en Ciberseguridad"` by UCM as `status: "active"` — this is the **MSc in progress (2026–2027)**, not a completed cert.
- `cvData.js` lists `OSCP` as `in-progress` — no evidence Diego is enrolled/has taken it. Should be removed unless verifiable.
- `cvData.js` lists APC (Antonio Peña Celi) as a profile data point but does NOT include it in `work` array, despite having a PDF ref (Ing. Rolando Marcelo Rojas Merchán, since 01/09/2013).
- `cvData.js` lists `Universidad ESPE` dates as `2023-04-26 → 2024-10-31` — needs verification (likely correct but worth double-checking).
- `cvData.js` lists `Universidad de Zulia` for AI Diploma (2024-10-19 → 2024-12-15) — **not verified** in any reference PDF; should be removed or replaced with a verified entry.
- Skills miss 7 verified skills: Auditoría Pentest/IDOR/CVSS, RE/Exploiting, Hardware Hacking (OpenWrt ramips-mt76x8), NotebookLM Power-User, OpenCode+MCP, SRI/XAdES, Diseño Curricular.
- 6 projects listed but only 1 is verifiable (`saavedra-construction.com` is real, others may be placeholders).

Additionally, the **CI gates in `.github/workflows/ci.yml` are weak**:
- `pnpm run lint || true` — passes on lint failure
- `pnpm run typecheck || true` — passes on TS error
- `npm audit --audit-level=moderate || true` — passes on security issue

This means the QA and Security gates are **ceremonial, not blocking**. SDD demands real fail-fast gates.

## What Changes

1. **Data layer (`src/data/cvData.js`)**: complete refactor to reflect the verified profile:
   - Add `APC - Antonio Peña Celi` (Loja, Profesor Computación, 2013-09-01 → present, ref Ing. Rolando Marcelo Rojas Merchán).
   - Fix `ISTJM` dates to `2020-10-01 → 2022-03-31` and position to `"Docente Titular Auxiliar - Carrera de Ensamblaje y Mantenimiento de Equipos de Cómputo"`.
   - Remove `Universidad de Zulia` and `Universidad UIDEM` (unverified).
   - Add `Universidad Técnica Particular de Loja` (UTPL) as Educación (Maestría en Cs. y Tec. de la Computación 2018-09 → 2021-02, COMPLETADA, no longer active).
   - Keep `UCM` (2026-02 → 2027-12, en curso).
   - Move `Título de Maestría en Ciberseguridad` (UCM) OUT of `certifications` (it's the in-progress MSc, lives in `education`).
   - Remove `OSCP` (no evidence of enrollment).
   - Replace 6 projects with **6 verifiable projects**:
     - `open-api-facturacion-sri` (PyPI-style public repo) — SRI electronic invoicing API, TypeScript/Node.js
     - `multi-agent-system` — multi-agent orchestration, Python/FastAPI/OpenCode
     - `material-educativo-unl` — UNL educational material authoring (Quarto/ABP)
     - `UCM-Moodle-audit` — Moodle pentest, 5 findings (1 CRIT CVSS 9.1, 2 MED, 2 LOW)
     - `hardware-hacking-OpenWrt` — OpenWrt ramips-mt76x8 imagebuilder, TFTP recovery
     - `ms08_067-exploit` — RE demo with Metasploit + ms08_067 + ms17_010
   - Add 7 verified skills: `Auditoría Pentest (IDOR/CVSS)`, `RE/Exploiting (ms08_067, ms17_010)`, `Hardware Hacking (OpenWrt)`, `NotebookLM Power-User`, `OpenCode + MCP`, `SRI / XAdES`, `Diseño Curricular`.
   - Update `label.es/en` to reflect `Magíster en Cs. y Tec. de la Computación` (UTPL) + `MSc Ciberseguridad (en curso, UCM)`.

2. **Profile layer**: add 4th profile `curriculista` (curriculum designer + facilitator) reflecting Diego's 6+ years of teaching + curriculum design at ABACOM (Loja). The current 3 profiles (developer / hacker / research) are kept; `curriculista` joins them.

3. **UI (`src/components/ProfileSelector.jsx` + `src/App.jsx`)**:
   - Add `curriculista` profile to selector.
   - Add new `Metrics` section with **verifiable metrics**:
     - 93.4/100 — ABACOM Python cohort 2026 average score (verified from `Docente Cuantitativa Evaluation.pdf`)
     - 100+ — public GitHub repositories (`github.com/statick88`)
     - 55 / 898 — NotebookLM notebooks / sources (power user, v0.6.8)
     - 134+ — categorized certifications in `~/Documents/Certificados/`
     - 6+ años — teaching experience (ABACOM since 2021 + APC since 2013 + ISTJM 2020-2022)
   - Update `getSummary()` to align with the 4 profiles (currently has 6 mismatched entries).
   - PDF download links updated to match new profile set: `cv-{developer,hacker,research,curriculista}-{es,en}.pdf` (8 variants).

4. **Generators (`generate-cv-markdown.js` + `generate-profile-cvs.js`)**:
   - Use new data structure (4 profiles).
   - Output 8 variants: `cv-{developer,hacker,research,curriculista}-{es,en}.md` + matching PDFs.
   - Deduplicate `Reverse Engineering` / `Malware Analysis` entries in `hacker` profile.
   - Include metrics block in main CV markdown.

5. **CI gates (`.github/workflows/ci.yml`)**:
   - Remove `|| true` from `pnpm run lint`, `pnpm run typecheck`, `npm audit --audit-level=moderate`.
   - Add `pnpm audit` (in addition to `npm audit`).
   - Add `vite build` size check (warn if > 500KB gzipped).
   - Add explicit `pnpm generate:cvs` step in design-gate to ensure generators work.

6. **vite.config.js**:
   - Add security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy) via `server.headers` and a `headers` plugin for `build`.

## Impact

- **Trust**: postulations will no longer carry stale/incorrect data.
- **Coverage**: 4th profile `curriculista` enables targeting the Centro Capacitación Cuenca-style postulations (Docente / Curriculista).
- **Gates**: real fail-fast — pushes can't merge with lint/TS/audit failures.
- **Metrics**: portfolio site now has hard numbers (ABACOM 93.4/100, 100+ repos, NLM 55/898).
- **Size**: data file grows ~30% (verified content); no new runtime deps.

## Out of Scope

- Migrating to Next.js or any framework change.
- Adding a backend or API.
- I18n beyond current ES/EN (no new languages).
- Adding tests (no test infra currently; would be a separate change).
