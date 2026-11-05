# CV — Diego Medardo Saavedra García

Interactive CV / Portfolio built with React + Vite + Tailwind CSS.  
Live: **https://statick88.github.io**

## Stack

| Layer | Tech |
|-------|------|
| UI | React 18, Framer Motion |
| Styling | Tailwind CSS, custom glassmorphism tokens |
| Data | YAML (`cv-data.yaml`) + Zod schemas |
| Build | Vite 8, TypeScript 5 |
| Deploy | GitHub Pages (Actions workflow) |

## Commands

```bash
pnpm dev            # Dev server
pnpm build          # Validate → Build → CSP → ATS exports
pnpm build:quick    # Build only (skip validate/export)
pnpm preview        # Preview production build
pnpm typecheck      # TypeScript strict check
pnpm lint           # ESLint
pnpm test           # Vitest
pnpm validate:cv    # Validate cv-data.yaml against Zod schemas
pnpm export:cv      # Export ATS-optimized JSON/YAML/MD
```

## Compact portfolio

The homepage blends the card-based presentation of the archived `statick/my_site:2.0` site with the current cyan/midnight palette. Each section starts with a brief preview; **+ More** opens its complete content, and **− Less** closes it. On small screens, only the **+ / −** symbols are displayed; accessible labels remain descriptive. Sections expand independently and fill the full available viewport width with readable gutters. Email links use `mailto:` and open the configured default mail handler (including a browser-based handler when registered). Navigation opens its destination before scrolling.

The interface supports Spanish and English, native keyboard-operable disclosures, and mobile layouts. Printing expands every disclosure and restores the previous state afterward. The PDF downloads and full ATS exports remain independent of these previews; no CV records are removed.

Legacy reference: [statick/my_site on Docker Hub](https://hub.docker.com/r/statick/my_site), public tag `2.0`, pushed December 8, 2023, digest `sha256:d908c1a67ead951f5e2013028cd44c844e0c373c337251270c382a5ad4d023c3`. Only its static HTML/CSS was inspected; old dependencies and biographical claims were not imported.

## Data Architecture

All CV data lives in **`src/data/cv-data.yaml`** — the single source of truth.

```
cv-data.yaml
  → Zod schemas (src/lib/schemas/cv-data.ts)
    → Adapter (src/lib/adapter.ts)
      → React components (src/components/)
        → ATS exports (dist/exports/)
```

### Key Files

| File | Purpose |
|------|---------|
| `src/data/cv-data.yaml` | Authoritative CV data (YAML) |
| `src/lib/schemas/cv-data.ts` | Zod validation schemas |
| `src/lib/schemas/ats-schema.ts` | ATS export schema |
| `src/lib/adapter.ts` | Old → new type bridge (9 adapters) |
| `src/lib/sanitize/index.ts` | Public-safe data sanitization |
| `src/lib/i18n/bilingual.ts` | Bilingual string utilities |
| `scripts/validate-cv.ts` | YAML validation script |
| `scripts/export-structured.ts` | ATS export generator |

### Exports (`pnpm export:cv`)

Generates ATS-optimized formats in `dist/exports/`:

- `cv-data.json` — keyword-rich JSON for ATS parsers
- `cv-data.yaml` — normalized YAML
- `cv-structured.md` — Markdown for human review
- `cv-career-ops.json` — CareerOps format
- `cv-ai-job-search.yaml` — AI job search format

## Architecture

```
src/
├── components/
│   ├── cv/              # 13 CV section components
│   │   ├── TwoColumnLayout.tsx
│   │   ├── HeaderSection.tsx
│   │   ├── SummarySection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── EducationSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── CertificationsSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── ResearchSection.tsx
│   │   ├── CoursesSection.tsx
│   │   ├── HireMeSection.tsx
│   │   ├── Timeline.tsx
│   │   └── Section.tsx
│   └── ui/              # Shared UI (LanguageToggle, etc.)
├── data/
│   └── cv-data.yaml     # Single source of truth
├── lib/
│   ├── schemas/         # Zod schemas
│   ├── i18n/            # Bilingual utilities
│   ├── adapter.ts       # Type bridge
│   └── sanitize/        # Data sanitization
├── hooks/               # Custom React hooks
├── types/               # Legacy TypeScript types
└── __tests__/           # Test files
```

## Quality Gates

| Gate | Tool | Status |
|------|------|--------|
| Type safety | TypeScript strict | ✅ |
| Linting | ESLint | ✅ |
| Validation | Zod schemas | ✅ |
| Security | CSP headers + audit | ✅ |
| Build | Vite production | ✅ |

## CI/CD

- **Deploy** (`.github/workflows/deploy.yml`): Typecheck → Lint → Build → Export → Deploy to GitHub Pages
- **Pipeline** (`.github/workflows/ci.yml`): Full SDD quality gates

## SDD Workflow

```
proposal → spec → design → tasks → apply → verify → archive
```
