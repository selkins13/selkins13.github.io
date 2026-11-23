#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
TEMP_DIRECTORY="$(mktemp -d)"
trap 'rm -rf "$TEMP_DIRECTORY"' EXIT

expect_rejected() {
  local output="$1"
  if "$ROOT/scripts/build-static-site.sh" "$output" >/dev/null 2>&1; then
    echo "Unsafe build output was accepted: $output" >&2
    exit 1
  fi
}

expect_rejected "$ROOT/"
expect_rejected "$ROOT/.."
expect_rejected "$HOME"
expect_rejected /

ln -s "$ROOT" "$TEMP_DIRECTORY/repository-link"
expect_rejected "$TEMP_DIRECTORY/repository-link"

"$ROOT/scripts/build-static-site.sh" "$TEMP_DIRECTORY/site" >/dev/null
test -f "$TEMP_DIRECTORY/site/index.html"
test -f "$TEMP_DIRECTORY/site/resume.html"

echo "Static build output safety checks passed."
