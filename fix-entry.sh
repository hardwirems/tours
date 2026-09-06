#!/usr/bin/env bash
# Fix for the blank guanacaste-tours.pages.dev page.
#
# Root cause: package.json "main" is "index.ts", and index.ts does
#   import { ExpoRoot } from 'expo-router'
#   export default ExpoRoot
# which EXPORTS a component but never RENDERS one. Nothing calls
# renderRootComponent / AppRegistry.runApplication, so #root stays empty.
#
# Run from the repo root. Read it before running it.
set -euo pipefail

cd "$(dirname "$0")"
test -f package.json || { echo "run this from the repo root"; exit 1; }

echo "== before =="
node -e 'console.log("main:", require("./package.json").main)'
cat index.ts 2>/dev/null || echo "(no index.ts)"

# --- 1. Point the entry at expo-router's real bootstrap -----------------------
cat > index.ts <<'EOF'
// Expo Router's entry point. This registers the root component AND wires up
// the require.context over ./app that supplies the route tree.
// Do not replace this with `export default ExpoRoot` — that exports a
// component without ever rendering it, and the app boots to a blank page.
import 'expo-router/entry';
EOF

# --- 2. Remove the leftover blank-template root component --------------------
# Created by `create-expo-app --template blank-typescript`; unused under
# Expo Router and a standing source of entry-point confusion.
if [ -f App.tsx ]; then
  git rm --cached App.tsx >/dev/null 2>&1 || true
  mv App.tsx App.tsx.unused
  echo "moved App.tsx -> App.tsx.unused"
fi

echo "== after =="
cat index.ts

# --- 3. Build and prove the bundle actually mounts ----------------------------
rm -rf dist
npx expo export --platform web

BUNDLE=$(ls dist/_expo/static/js/web/*.js | head -1)
echo "bundle: $BUNDLE ($(wc -c < "$BUNDLE") bytes)"

echo "-- entry must contain a root-render call --"
grep -qE 'runApplication|registerRootComponent|renderRootComponent' "$BUNDLE" \
  && echo "PASS: root-render call present" \
  || { echo "FAIL: bundle still has no render call — entry is still wrong"; exit 1; }

echo "-- route context must be bundled (your app/ files) --"
grep -qE '"\./(_layout|index)\.(tsx|ts|jsx|js)"' "$BUNDLE" \
  && echo "PASS: app/ route context bundled" \
  || echo "WARN: no route context strings found — check babel-preset-expo / expo-router setup"

echo "-- Cloudflare Pages control files survived the export --"
for f in _routes.json _headers; do
  [ -f "dist/$f" ] && echo "PASS: dist/$f" || echo "WARN: dist/$f missing (keep the source copy in public/)"
done

# --- 4. Full smoke test against the local production output ------------------
node scripts/web-smoke.mjs

cat <<'EOF'

Local checks passed. Next, in order:

  # preview deploy (does NOT touch production)
  npx wrangler pages deploy dist/ --project-name guanacaste-tours \
    --branch fix-entry --commit-message "fix: use expo-router/entry as app entry"

  # verify the preview URL wrangler prints, then:
  BASE_URL=https://<preview-hash>.guanacaste-tours.pages.dev node scripts/web-smoke.mjs

  # production
  npx wrangler pages deploy dist/ --project-name guanacaste-tours \
    --branch main --commit-message "fix: use expo-router/entry as app entry"

Rollback: npx wrangler pages deployment list --project-name guanacaste-tours
then roll back to the prior deployment ID from the Cloudflare dashboard
(Workers & Pages > guanacaste-tours > Deployments > ... > Rollback).
EOF
