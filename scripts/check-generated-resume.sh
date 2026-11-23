#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMP="$(mktemp -d)"
trap 'rm -rf "$TEMP"' EXIT

OUTPUT="$TEMP/generated.pdf" "$ROOT/scripts/generate-resume-pdf.sh"

pdftotext "$ROOT/assets/SarahElkinsResume.pdf" "$TEMP/committed-pdf.txt"
pdftotext "$TEMP/generated.pdf" "$TEMP/generated-pdf.txt"
diff -u "$TEMP/committed-pdf.txt" "$TEMP/generated-pdf.txt"

pdfinfo -url "$ROOT/assets/SarahElkinsResume.pdf" | awk '{$1=$2=""; sub(/^  */, ""); print}' | sort > "$TEMP/committed-links.txt"
pdfinfo -url "$TEMP/generated.pdf" | awk '{$1=$2=""; sub(/^  */, ""); print}' | sort > "$TEMP/generated-links.txt"
diff -u "$TEMP/committed-links.txt" "$TEMP/generated-links.txt"

pandoc "$ROOT/resume.html" --from=html --to=docx --output="$TEMP/generated.docx"
pandoc "$ROOT/documents/SarahElkinsResume.docx" --to=plain --wrap=none > "$TEMP/committed-docx.txt"
pandoc "$TEMP/generated.docx" --to=plain --wrap=none > "$TEMP/generated-docx.txt"
diff -u "$TEMP/committed-docx.txt" "$TEMP/generated-docx.txt"

echo "Generated PDF and DOCX content matches the committed resume assets."
