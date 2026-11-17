#!/usr/bin/env bash
# Publish the download site to the Aliyun server.
#
#   SITE_HOST=root@dl.example.com \
#   SITE_BASE_URL=https://dl.example.com \
#   ./site/deploy.sh
#
# Options (environment variables):
#   SITE_HOST       ssh target, e.g. root@1.2.3.4          (required)
#   SITE_BASE_URL   public origin written into the catalog (https://…)
#   SITE_PATH       folder on the server  (default /var/www/neotodo-downloads)
#   SITE_RELEASES   local folder with installers (default site/releases)
#   SITE_NO_BUILD=1 reuse the existing site/dist instead of rebuilding
#   SITE_NO_RELOAD=1 upload only, do not test/reload nginx
#   DRY_RUN=1       print the rsync command and exit
set -euo pipefail

SITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SITE_DIR/.." && pwd)"
HOST="${SITE_HOST:-}"
TARGET="${SITE_PATH:-/var/www/neotodo-downloads}"
BASE_URL="${SITE_BASE_URL:-}"
RELEASES="${SITE_RELEASES:-$SITE_DIR/releases}"
DIST="$SITE_DIR/dist"

if [[ -z "$HOST" ]]; then  cat >&2 <<'USAGE'
error: set SITE_HOST to the ssh target first, for example:

  SITE_HOST=root@1.2.3.4 SITE_BASE_URL=https://dl.example.com ./site/deploy.sh

See site/README.md for the full Aliyun setup.
USAGE
  exit 1
fi

if [[ "$TARGET" == "/" || -z "$TARGET" || "$TARGET" != */* ]]; then
  echo "error: refusing to rsync --delete into '$TARGET'; set SITE_PATH to a real folder" >&2
  exit 1
fi

for tool in rsync ssh; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "error: $tool is not installed" >&2
    exit 1
  fi
done

if [[ "${SITE_NO_BUILD:-0}" != "1" ]]; then
  if [[ -z "$BASE_URL" ]]; then
    echo "error: SITE_BASE_URL is required for a deploy build (https://…)" >&2
    exit 1
  fi
  python3 "$SITE_DIR/build.py" --base-url "$BASE_URL" --releases "$RELEASES"
elif [[ ! -f "$DIST/index.html" ]]; then
  echo "error: SITE_NO_BUILD=1 but $DIST does not exist; run site/build.py first" >&2
  exit 1
fi

RSYNC=(rsync -az --delete --human-readable --itemize-changes "$DIST/" "$HOST:$TARGET/")

if [[ "${DRY_RUN:-0}" == "1" ]]; then
  printf '%q ' "${RSYNC[@]}"
  printf '\n'
  exit 0
fi

echo "→ uploading $(du -sh "$DIST" | cut -f1) to $HOST:$TARGET"
"${RSYNC[@]}"

if [[ "${SITE_NO_RELOAD:-0}" == "1" ]]; then
  echo "→ uploaded; nginx was not reloaded (SITE_NO_RELOAD=1)"
  exit 0
fi

echo "→ checking nginx on $HOST"
ssh "$HOST" "sudo nginx -t && sudo systemctl reload nginx"

echo
echo "done. smoke test:"
echo "  curl -fsS ${BASE_URL:-https://your-domain}/healthz"
echo "  curl -fsS ${BASE_URL:-https://your-domain}/plugins/catalog.json | head"
echo "  curl -fsSI ${BASE_URL:-https://your-domain}/downloads.json | head -1"
echo
echo "point the app at it:"
echo "  NEOTODO_PLUGIN_CATALOG=${BASE_URL:-https://your-domain}/plugins/catalog.json ./run.sh"
