#!/usr/bin/env bash
set -euo pipefail

canonical_path() {
  python3 - "$1" <<'PY'
import os
import sys

print(os.path.realpath(os.path.abspath(sys.argv[1])))
PY
}

ROOT="$(canonical_path "$(dirname "${BASH_SOURCE[0]}")/..")"
HOME_PATH="$(canonical_path "$HOME")"
OUTPUT="$(canonical_path "${1:-$ROOT/_site}")"

for protected_path in / "$HOME_PATH" "$ROOT"; do
  if [[ "$protected_path" == "$OUTPUT" || "$protected_path" == "$OUTPUT/"* ]]; then
    echo "Refusing to replace unsafe output directory: $OUTPUT" >&2
    exit 1
  fi
done

rm -rf "$OUTPUT"
mkdir -p "$OUTPUT"

cp "$ROOT/index.html" "$ROOT/resume.html" "$ROOT/.nojekyll" "$OUTPUT/"
cp -R "$ROOT/assets" "$ROOT/documents" "$OUTPUT/"

echo "Built static site at $OUTPUT"
