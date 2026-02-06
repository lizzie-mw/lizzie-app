#!/bin/bash
set -euo pipefail

# ─────────────────────────────────────────────
# 꼬물톡 (Ggomul-Talk) Project Init Script
# ─────────────────────────────────────────────

cd "$(dirname "$0")/.."

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ─── 1. Prerequisites ───────────────────────

info "Checking prerequisites..."

if ! command -v bun &>/dev/null; then
  error "bun is not installed."
  echo "  Install: curl -fsSL https://bun.sh/install | bash"
  exit 1
fi
ok "bun $(bun --version)"

if ! command -v node &>/dev/null; then
  warn "node is not installed. Some Expo tools may require Node.js."
else
  ok "node $(node --version)"
fi

# ─── 2. Install Dependencies ────────────────

info "Installing dependencies..."
bun install
ok "Dependencies installed."

# ─── 3. Environment Setup ───────────────────

if [ -f .env.local ]; then
  ok ".env.local already exists. Skipping."
else
  if [ -f .env.example ]; then
    cp .env.example .env.local
    ok ".env.local created from .env.example"
    warn "Edit .env.local with your actual credentials:"
    echo "  EXPO_PUBLIC_API_URL"
    echo "  EXPO_PUBLIC_SUPABASE_URL"
    echo "  EXPO_PUBLIC_SUPABASE_ANON_KEY"
  else
    warn ".env.example not found. Skipping environment setup."
  fi
fi

# ─── 4. Expo Doctor ─────────────────────────

info "Running Expo compatibility check..."
if bunx expo-doctor@latest 2>/dev/null; then
  ok "Expo doctor passed."
else
  warn "Expo doctor found issues. Check output above."
fi

# ─── 5. Done ────────────────────────────────

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Project init complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Edit .env.local with your Supabase credentials"
echo "  2. Start dev server:  bun start"
echo "  3. (Optional) Generate API types:  bun run generate:api"
echo ""
