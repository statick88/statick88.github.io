# Spec: CV Portfolio — Profile Consolidation

**Change ID:** `2026-06-02-profile-consolidation`
**Status:** Draft
**Parent:** [proposal.md](./proposal.md)

## Overview

Update the CV portfolio site (`statick88.github.io`, served from `~/dev/cv-diego/`) so all displayed data matches the **verified consolidated profile** in `~/Documents/job_applications/core/cv-consolidado.md`. Add a 4th profile (Curriculista), introduce a Metrics section with hard numbers, and harden the CI gates from ceremonial to blocking.

## Functional Requirements

### FR-1: Verified Work History

The `cvData.work` array MUST contain exactly these 6 entries, with dates and positions matching the verified PDF references:

| # | Institution | Position | Start | End | Reference PDF |
|---|-------------|----------|-------|-----|---------------|
| 1 | ABACOM (Loja) | Docente, Facilitador y Curriculista | 2021-12-01 | (present) | `Referencias_laborales_abacom.pdf` (Ing. Kelbi Ramírez Macas) |
| 2 | ESPE (Quito) | Docente Ocasional Tiempo Completo - DCC | 2023-04-01 | 2024-10-31 | Sin certificado laboral PDF disponible |
| 3 | APC - Antonio Peña Celi (Loja) | Profesor de Computación | 2013-09-01 | (present) | `Referencias_laborales_apc.pdf` (Ing. Rolando Marcelo Rojas Merchán) |
| 4 | Codings Academy (Guayaquil) | Facilitador de Bootcamps (Django + React) | 2024-02-01 | 2024-12-31 | `Referencias_laborales_codings.pdf` (Ing. Jyron Isai Cedeño Chavez, MSc) |
| 5 | IST Juan Montalvo (Loja) | Docente Titular Auxiliar - Carrera Ensamblaje y Mantenimiento de Equipos de Cómputo | 2020-10-01 | 2022-03-31 | `Referencias_laborales_ist_juan_montalvo.pdf` (Ing. Ana Gabriela Montalván Salcedo, Mba) |
| 6 | UIDE (Loja) | Docente Ocasional Tiempo Completo - TTI | 2022-10-01 | 2022-12-31 | Sin certificado laboral PDF disponible |

**Acceptance:**
- [ ] No entry has `name` containing `"Zulia"`, `"LUZ"`, or `"UIDEM"` (the latter only if unverified) — corrected: UIDE entry above IS kept with caveat "Sin certificado laboral PDF disponible".
- [ ] ISTJM position text is exactly `"Docente Titular Auxiliar - Carrera de Ensamblaje y Mantenimiento de Equipos de Cómputo"`.
- [ ] ISTJM dates are exactly `2020-10-01` to `2022-03-31`.

### FR-2: Verified Education

The `cvData.education` array MUST contain exactly these 3 entries:

| # | Institution | Area | Start | End | Status |
|---|-------------|------|-------|-----|--------|
| 1 | Universidad Complutense de Madrid | Máster en Ciberseguridad Defensiva y Ofensiva | 2026-02-01 | 2027-12-31 | En curso |
| 2 | Universidad Técnica Particular de Loja | Maestría en Ciencias y Tecnologías de la Computación | 2018-09-01 | 2021-02-28 | Completada |
| 3 | Universidad Nacional de Loja | Licenciatura en Informática Educativa | 2007-09-01 | 2011-02-28 | Completada |

**Acceptance:**
- [ ] No entry with `institution` containing `"UIDEM"` or `"Zulia"` in education.

### FR-3: Verified Skills

The `cvData.skills` array MUST contain the **full verified set**, with `level` field reflecting the user's actual mastery (master / advanced / intermediate). New skills added:

1. **Auditoría de Pentesting** (master, category: `security`) — IDOR enumeration, CVSS 3.1 scoring, OWASP methodology (verified via `informe-auditoria-campus-ucm.md`).
2. **Ingeniería Inversa y Explotación** (advanced, category: `security`) — Metasploit, ms08_067, ms17_010, malware reversing (verified via UCM RE coursework + `tarea-ingenieria-inversa`).
3. **Hardware Hacking (OpenWrt)** (advanced, category: `security`) — ramips-mt76x8 imagebuilder, firmware flashing, TFTP recovery (verified via `tarea_hardware` ISTJM project).
4. **NotebookLM Power-User** (master, category: `tools`) — v0.6.8, 55 notebooks, 898 sources (verified via `nlm --version` + local `notebooks` listing).
5. **OpenCode + MCP** (advanced, category: `tools`) — multi-agent orchestration, SDD workflow (verified by current session + project usage).
6. **SRI / XAdES (Facturación Electrónica)** (advanced, category: `backend`) — verified by `open-api-facturacion-sri` project.
7. **Diseño Curricular (ABP / ADDIE)** (master, category: `teaching`) — verified by ABACOM 200h docente role.

Plus the existing core skills (HTML, CSS, JS, TS, React, Next.js, Node.js, Python, Django, FastAPI, Flutter, Angular, Docker, Kubernetes, MySQL, MongoDB, NestJS, Vue, Svelte, AWS, Azure, PostgreSQL, Reverse Engineering).

**Acceptance:**
- [ ] `Reverse Engineering` and `Malware Analysis` appear exactly once each (currently duplicated in `hacker` profile).
- [ ] All 7 new skills present.
- [ ] No skill with `level: "master"` that is unverified.

### FR-4: Verified Projects

The `cvData.projects` array MUST contain **6 verifiable projects** (replacing the current 6, most of which are placeholders):

1. **`open-api-facturacion-sri`** — SRI Ecuador electronic invoicing API, TypeScript/Node.js, public on `github.com/statick88/open-api-facturacion-sri`.
2. **`multi-agent-system`** — Multi-agent orchestration, Python/FastAPI/OpenCode, used in UCM research.
3. **`material-educativo-unl`** — UNL educational material with Quarto/ABP methodology.
4. **`UCM-Moodle-Pentest`** — Moodle security audit with 5 findings (1 CRIT CVSS 9.1, 2 MED 5.3-6.8, 2 LOW).
5. **`OpenWrt-Hardware-Hacking`** — OpenWrt ramips-mt76x8 imagebuilder + TFTP recovery tutorial.
6. **`ms08-067-metasploit-demo`** — RE + exploitation demo (Metasploit + ms08_067 + ms17_010).

**Acceptance:**
- [ ] No project entry with `name: "Saavedra Construction"` unless `saavedra-construction.com` resolves to a real Diego-owned site (verify DNS; if not, remove).
- [ ] No project with `"5,000+ students"` or `"10,000+ downloads"` claims without verifiable evidence.
- [ ] No project with `"92% accuracy"` claim without model card.

### FR-5: 4-Profile Selector

The `ProfileSelector` MUST offer 4 profiles:

| ID | Label ES | Label EN | Icon | Color | Description |
|----|----------|----------|------|-------|-------------|
| `developer` | Full Stack | Full Stack | 💻 | `#3b82f6` | React/Node.js/Python |
| `hacker` | Ethical Hacker | Ethical Hacker | 🎯 | `#ef4444` | Pentest & RE |
| `research` | Investigador | Researcher | 🔬 | `#f59e0b` | MSc Ciberseguridad UCM |
| `curriculista` | Curriculista | Curriculum Designer | 📚 | `#10b981` | Docente + Diseño curricular |

**Acceptance:**
- [ ] All 4 profiles selectable from the dropdown.
- [ ] Default profile is `curriculista` (reflects 6+ años docente role).
- [ ] `getSummary()` in `App.jsx` returns the matching summary for each profile.
- [ ] PDF download link points to `cv-{id}-{lang}.pdf` (8 files exist: 4 profiles × 2 langs).

### FR-6: Metrics Section

A new `<Metrics />` component MUST render between the Hero and Summary sections, displaying 4 hard metrics:

| Metric | Value | Verified Source |
|--------|-------|-----------------|
| ABACOM Python cohort 2026 avg | 93.4 / 100 | `Docente Cuantitativa Evaluation.pdf` |
| Public GitHub repos | 100+ | `github.com/statick88` |
| NotebookLM notebooks / sources | 55 / 898 | `nlm --version` + `nlm list` |
| Categorized certifications | 134+ | `~/Documents/Certificados/` |

**Acceptance:**
- [ ] All 4 metrics render in ES and EN.
- [ ] Hover on each metric shows the verified source.
- [ ] No metric uses `~` or `+` that could mislead (use exact or clearly bounded like `100+`).

### FR-7: CI Gates Hardening

The `.github/workflows/ci.yml` MUST enforce real gates:

**Acceptance:**
- [ ] `pnpm run lint` runs WITHOUT `|| true` (line currently 32).
- [ ] `pnpm run typecheck` runs WITHOUT `|| true` (line currently 35).
- [ ] `pnpm audit --audit-level=moderate` replaces `npm audit || true` (line 67).
- [ ] `pnpm build` is the source of truth (already true on lines 38, 92, 130).
- [ ] Design-gate runs `node generate-profile-cvs.js` and `node generate-cv-markdown.js` to ensure generators work.
- [ ] At least one HEAD check verifies the 8 expected CV PDFs exist in the working tree (or `dist/` after build).

### FR-8: Security Headers

`vite.config.js` MUST set security headers in the dev server and produce a `_headers` file (or equivalent) for the GitHub Pages build.

**Acceptance:**
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: DENY`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy` minimal (no camera/mic/geolocation)

## Non-Functional Requirements

### NFR-1: Performance
- Initial JS bundle ≤ 250KB gzipped.
- Lighthouse Performance score ≥ 90.
- No render-blocking resources.

### NFR-2: Accessibility
- WCAG 2.1 AA compliance.
- All interactive elements have `aria-label`.
- Color contrast ≥ 4.5:1 for body text, 3:1 for large text.
- Keyboard navigation works (Tab, Enter, Esc).
- `prefers-reduced-motion` respected (already in `index.css`).

### NFR-3: Design System
- Glassmorphism: `backdrop-filter: blur(16px)` on `.glass`.
- 8pt grid: all spacing in multiples of 4 or 8 px.
- SF Pro fallback to Inter (already in `index.css`).
- Dark mode default; light mode toggle works.

### NFR-4: I18n
- All user-facing strings have `es` and `en` variants.
- Default language: `es` (Diego is in Ecuador).
- Language toggle persists in `localStorage` (optional, not in scope).

## Validation

After implementation, the following MUST hold:

```bash
# QA Gate
cd ~/dev/cv-diego
pnpm install
pnpm lint       # exit 0
pnpm typecheck  # exit 0
pnpm build      # exit 0, dist/ created

# Security Gate
pnpm audit --audit-level=moderate  # 0 vulnerabilities
grep -rE "(api[_-]?key|secret|token|password)" src/  # no matches in code

# Design Gate
node generate-profile-cvs.js
node generate-cv-markdown.js
ls -la cv-{developer,hacker,research,curriculista}-{es,en}.pdf  # 8 files
# Lighthouse manual check: a11y ≥ 90, contrast OK
```

## Dependencies

- None new. All work uses existing stack: React 18, Vite 5, Tailwind 3, Framer Motion 11.

## Risks

- **R1**: Some GitHub repos in `cv-consolidado.md` may be private. Mitigation: only link to public repos, use `github.com/statick88?tab=repositories&type=public`.
- **R2**: The 4th profile `curriculista` may add visual complexity. Mitigation: keep dropdown compact, use distinct color (#10b981) for differentiation.
- **R3**: Tightening CI may break the current main branch (since it currently passes with `|| true`). Mitigation: fix all lint/TS errors as part of this change before removing `|| true`.
- **R4**: ABACOM, UCM dates in education/work are still in progress or recently completed. The "en curso" / "(present)" pattern is already handled in `Timeline.jsx` (line 19-21).

## Out of Scope

- Adding Vitest/Jest tests (separate change).
- Migrating to Next.js App Router.
- Adding a blog or articles section.
- i18n beyond ES/EN.
