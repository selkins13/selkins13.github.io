#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT="${1:-$ROOT/_site}"

case "$OUTPUT" in
  /|"$HOME"|"$ROOT")
    echo "Refusing to replace unsafe output directory: $OUTPUT" >&2
    exit 1
    ;;
esac

rm -rf "$OUTPUT"
mkdir -p "$OUTPUT"

cp "$ROOT/index.html" "$ROOT/resume.html" "$ROOT/.nojekyll" "$OUTPUT/"
cp -R "$ROOT/assets" "$ROOT/documents" "$OUTPUT/"

echo "Built static site at $OUTPUT"
