# CV - Diego Medardo Saavedra García

Portfolio profesional desenvolvido com React + Vite + Tailwind CSS.

## Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Animações**: Framer Motion
- **Deploy**: GitHub Pages

## Comandos

```bash
# Desenvolvimento
pnpm dev

# Build produção
pnpm build

# Preview build
pnpm preview

# Lint
pnpm lint

# TypeScript check
pnpm typecheck
```

## Qualidade

### Gates CI/CD

| Gate | Ferramenta | Status |
|------|------------|--------|
| QA | ESLint + TypeScript | ✅ |
| Security | pnpm audit | ✅ |
| Design | Build verification | ✅ |
| GGA | Guardian Angel | ✅ |

### Padrões

- TypeScript strict mode
- ESLint com React hooks
- Convenções Conventional Commits

## Deploy

Deploy automático para GitHub Pages ao fazer push para `main`:

```
https://statick88.github.io
```

## Branches

- `main` - Produção (deploy automático)
- `develop` - Desenvolvimento

## SDD Workflow

```
proposal → spec → design → [HITL] → tasks → apply → GGA → verify → [QA+SECURITY] → archive
```