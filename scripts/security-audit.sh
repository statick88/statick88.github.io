#!/usr/bin/env bash
# scripts/security-audit.sh — Proactive credential scanning
#
# Scans the project for exposed credentials, secrets, and sensitive data.
# Run as part of pre-commit hook or CI pipeline.
#
# Usage:
#   ./scripts/security-audit.sh           # Scan src/ and config files
#   ./scripts/security-audit.sh --full    # Scan entire repo including git history
#   ./scripts/security-audit.sh --staged  # Scan only staged files (pre-commit)

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Directories to scan
SCAN_DIRS=("src" "scripts" "public")
SCAN_FILES=("*.ts" "*.tsx" "*.js" "*.jsx" "*.json" "*.md" "*.yml" "*.yaml" "*.toml" "*.env*")

# ── Patterns ──────────────────────────────────────────────────────

# High-severity patterns (will fail the audit)
HIGH_PATTERNS=(
  # API Keys
  '(api[_-]?key|apikey)\s*[:=]\s*['\''"][A-Za-z0-9_\-]{20,}['\''"]'
  # Secret keys
  '(secret[_-]?key|client[_-]?secret)\s*[:=]\s*['\''"][A-Za-z0-9_\-]{20,}['\''"]'
  # Passwords
  '(password|passwd|pwd)\s*[:=]\s*['\''"][^'\''"]{8,}['\''"]'
  # Tokens
  '(token|auth[_-]?token|access[_-]?token)\s*[:=]\s*['\''"][A-Za-z0-9_\-\.]{20,}['\''"]'
  # AWS
  '(AKIA|ASIA)[A-Z0-9]{16}'
  # Private keys
  '-----BEGIN\s+(RSA|EC|DSA|OPENSSH)\s+PRIVATE\s+KEY-----'
  # JWT
  'eyJ[A-Za-z0-9_\-]*\.eyJ[A-Za-z0-9_\-]*\.[A-Za-z0-9_\-]*'
)

# Medium-severity patterns (warnings)
MEDIUM_PATTERNS=(
  # Email addresses (may be intentional in CV)
  '[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}'
  # Phone numbers
  '\+[0-9]{1,3}\s*[0-9]{4,14}'
  # IP addresses
  '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}'
  # Hardcoded URLs with credentials
  'https?://[^:]+:[^@]+@'
  # Base64 encoded strings (potential secrets)
  '(secret|key|token|password)\s*[:=]\s*[A-Za-z0-9+/]{40,}={0,2}'
)

# ── Functions ─────────────────────────────────────────────────────

scan_file() {
  local file="$1"
  local severity="$2"
  local pattern="$3"
  
  local matches
  matches=$(grep -nE "$pattern" "$file" 2>/dev/null || true)
  
  if [[ -n "$matches" ]]; then
    if [[ "$severity" == "high" ]]; then
      echo -e "${RED}✗ HIGH: $file${NC}"
      echo "$matches" | head -3 | while read -r line; do
        echo "  $line"
      done
      ((ERRORS++)) || true
    else
      echo -e "${YELLOW}⚠ MEDIUM: $file${NC}"
      echo "$matches" | head -2 | while read -r line; do
        echo "  $line"
      done
      ((WARNINGS++)) || true
    fi
  fi
}

scan_directory() {
  local dir="$1"
  local pattern_type="$2"
  
  if [[ ! -d "$dir" ]]; then
    return
  fi
  
  if [[ "$pattern_type" == "high" ]]; then
    for pattern in "${HIGH_PATTERNS[@]}"; do
      find "$dir" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" -o -name "*.toml" \) ! -path "*/node_modules/*" ! -path "*/dist/*" ! -path "*/.git/*" -print0 | while IFS= read -r -d '' file; do
        scan_file "$file" "high" "$pattern"
      done
    done
  else
    for pattern in "${MEDIUM_PATTERNS[@]}"; do
      find "$dir" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" -o -name "*.toml" \) ! -path "*/node_modules/*" ! -path "*/dist/*" ! -path "*/.git/*" -print0 | while IFS= read -r -d '' file; do
        scan_file "$file" "medium" "$pattern"
      done
    done
  fi
}

# ── Main ──────────────────────────────────────────────────────────

echo "🔒 Security Audit — Scanning for credentials..."
echo ""

# Check for gitleaks (preferred)
if command -v gitleaks &>/dev/null; then
  echo "Using gitleaks for comprehensive scanning..."
  if gitleaks detect --source . --no-banner --verbose 2>/dev/null; then
    echo -e "${GREEN}✓ Gitleaks: No secrets found${NC}"
  else
    echo -e "${RED}✗ Gitleaks detected potential secrets${NC}"
    ((ERRORS++)) || true
  fi
  echo ""
fi

# Scan source directories
echo "Scanning source directories..."
for dir in "${SCAN_DIRS[@]}"; do
  if [[ -d "$dir" ]]; then
    scan_directory "$dir" "high"
    scan_directory "$dir" "medium"
  fi
done

# Scan config files in root
echo "Scanning config files..."
for file in *.config.* .env* wrangler.toml .eslintrc.cjs; do
  if [[ -f "$file" ]]; then
    for pattern in "${HIGH_PATTERNS[@]}"; do
      scan_file "$file" "high" "$pattern"
    done
  fi
done

# Check for .env files that shouldn't be committed
echo ""
echo "Checking for exposed .env files..."
if [[ -f ".env" ]]; then
  echo -e "${YELLOW}⚠ .env file exists in project root${NC}"
  ((WARNINGS++)) || true
fi

# Check git history (if --full flag)
if [[ "${1:-}" == "--full" ]]; then
  echo ""
  echo "Scanning git history..."
  if command -v git &>/dev/null; then
    # Check for secrets in recent commits
    git log --oneline -10 --diff-filter=A -- "*.env*" "*.key" "*.pem" 2>/dev/null | while read -r line; do
      echo -e "${YELLOW}⚠ Sensitive file in history: $line${NC}"
      ((WARNINGS++)) || true
    done
  fi
fi

# Check staged files (if --staged flag)
if [[ "${1:-}" == "--staged" ]]; then
  echo ""
  echo "Scanning staged files..."
  git diff --cached --name-only --diff-filter=ACM 2>/dev/null | while read -r file; do
    if [[ -f "$file" ]]; then
      for pattern in "${HIGH_PATTERNS[@]}"; do
        scan_file "$file" "high" "$pattern"
      done
    fi
  done
fi

# Summary
echo ""
echo "────────────────────────────────────────────────"
if [[ $ERRORS -gt 0 ]]; then
  echo -e "${RED}✗ Security audit FAILED: $ERRORS high-severity issues${NC}"
  if [[ $WARNINGS -gt 0 ]]; then
    echo -e "${YELLOW}  + $WARNINGS warnings${NC}"
  fi
  exit 1
elif [[ $WARNINGS -gt 0 ]]; then
  echo -e "${YELLOW}⚠ Security audit passed with $WARNINGS warnings${NC}"
  exit 0
else
  echo -e "${GREEN}✓ Security audit passed — no issues found${NC}"
  exit 0
fi
