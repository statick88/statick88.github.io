#!/usr/bin/env bash
# setup.sh — Bootstrap dev environment for cv-diego
# Non-interactive, idempotent, CI-compatible
set -euo pipefail

EXPECTED_NODE=$(cat .node-version 2>/dev/null || echo "22")
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✓${NC} $1"; }
fail() { echo -e "${RED}✗${NC} $1"; exit 1; }

# ── 1. fnm ────────────────────────────────────────────────────────
if ! command -v fnm &>/dev/null; then
  echo "Installing fnm..."
  curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell
  export PATH="$HOME/.local/share/fnm:$PATH"
  eval "$(fnm env)"
fi
ok "fnm $(fnm --version)"

# ── 2. Node.js ────────────────────────────────────────────────────
fnm install "$EXPECTED_NODE"
fnm use "$EXPECTED_NODE"
ACTUAL_NODE=$(node -v | sed 's/v//' | cut -d. -f1)
[[ "$ACTUAL_NODE" == "$EXPECTED_NODE" ]] || fail "Node version mismatch: expected $EXPECTED_NODE, got $ACTUAL_NODE"
ok "Node $(node -v)"

# ── 3. pnpm ───────────────────────────────────────────────────────
if ! command -v pnpm &>/dev/null; then
  echo "Enabling corepack for pnpm..."
  corepack enable
  corepack prepare pnpm@latest --activate 2>/dev/null || npm install -g pnpm
fi
ok "pnpm $(pnpm --version)"

# ── 4. Install dependencies ──────────────────────────────────────
pnpm install --frozen-lockfile 2>/dev/null || pnpm install
ok "Dependencies installed"

# ── 5. Verify ─────────────────────────────────────────────────────
echo ""
echo "Environment ready:"
echo "  Node:  $(node -v)"
echo "  pnpm:  $(pnpm --version)"
echo "  npmrc: $(test -f .npmrc && echo 'present' || echo 'MISSING')"
