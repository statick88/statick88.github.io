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

## Toolchain (pnpm + fnm) — MANDATORY

- **fnm** gestiona la versión de Node: este proyecto fija **Node 22** (`.node-version`) y el CI usa `node-version: '22'` en todos sus jobs. Antes de ejecutar nada, el runtime local debe coincidir: `fnm use` (lee `.node-version`).
- **pnpm** es el gestor de paquetes: `pnpm install --frozen-lockfile`, `pnpm test`, `pnpm typecheck`, `pnpm build`. Nunca npm ni yarn, y nunca `pnpm install` sin `--frozen-lockfile` (el lockfile no se toca).
- **El Node ambiental no es el runtime del proyecto.** Si `node -v` no coincide con `.node-version`, los gates que corres en local **no son** los que corre el CI: el resultado no es evidencia. Compruébalo con `fnm exec --using=22 node -v` antes de dar por buena una verificación.
- Instalación del toolchain en una máquina nueva (usuario, sin sudo):
  `curl -fsSL https://fnm.vercel.app/install | bash -s -- --install-dir "$HOME/.local/share/fnm" --skip-shell` y luego `eval "$(fnm env --use-on-cd --shell bash)"` en el rc del shell, más `fnm install 22`.
