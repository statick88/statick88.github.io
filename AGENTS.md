# AGENTS.md - CV Diego

Este proyecto sigue SDD (Spec-Driven Development) con gates de calidad.

## Subagentes

| Agente | Rol | Gate |
|--------|-----|------|
| `qa-engineer` | QA Engineer - Tests, linting, typecheck | QA Gate |
| `security-reviewer` | Security Review - OWASP, vulnerabilidades | SECURITY Gate |
| `design-reviewer` | Design Review - UI/UX, Apple HIG, glassmorphism | DESIGN Gate |

## Quality Gates Checklist

### QA Gate
- [ ] Unit tests passing
- [ ] Linting (ESLint) passed
- [ ] TypeScript strict passed

### Security Gate
- [ ] No secrets exposed
- [ ] No SQL injection vectors
- [ ] Dependencies scanned (no CVEs)
- [ ] Input validation working

### Design Gate
- [ ] Apple HIG compliance
- [ ] Glassmorphism correct
- [ ] SF Pro typography
- [ ] 8pt grid
- [ ] Dark mode support

## Workflow

```
main ──push──► [CI/CD Pipeline]
                  │
                  ├─► QA Gate (lint + typecheck)
                  │
                  ├─► Security Gate (audit + scan)
                  │
                  ├─► Design Gate (build verification)
                  │
                  └─► Deploy to GitHub Pages
```

## Commands

```bash
# Run QA locally
pnpm lint
pnpm typecheck
pnpm build

# Security check
pnpm audit
```

## Tech Stack

- React 18 + Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- pnpm