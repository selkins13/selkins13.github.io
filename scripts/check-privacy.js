#!/usr/bin/env node

const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const failures = [];
const textPaths = [
  "index.html",
  "resume.html",
  "documents/resume.md",
  "assets/css/portfolio.css",
  "assets/css/resume.css",
  "assets/js/portfolio.js",
];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function inspect(label, content) {
  const forbidden = [
    [/\b340\+\b/g, "exact engagement count"],
    [/\b47,000\+\b/g, "exact delivery-hour count"],
    [/\$19M\+\b/g, "exact portfolio value"],
    [/\b(?:\+?1[-.\s]?)?(?:\(\d{3}\)|\d{3})[-.\s]\d{3}[-.\s]\d{4}\b/g, "phone number"],
    [/\b\d{1,5}\s+(?:[A-Z][A-Za-z.'-]*\s+){1,5}(?:Street|St\.|Road|Rd\.|Avenue|Ave\.|Drive|Dr\.|Lane|Ln\.)\b/g, "street address"],
    [/57f3074f-7b6e-46e3-8d21-be6cd83a21a1/g, "private attachment identifier"],
  ];

  for (const [pattern, description] of forbidden) {
    pattern.lastIndex = 0;
    expect(!pattern.test(content), `${label} contains a ${description}`);
  }
}

for (const relativePath of textPaths) {
  inspect(relativePath, fs.readFileSync(path.join(root, relativePath), "utf8"));
}

const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-privacy-"));
try {
  const pdfText = path.join(temporaryDirectory, "resume-pdf.txt");
  execFileSync("pdftotext", [path.join(root, "assets/SarahElkinsResume.pdf"), pdfText]);
  inspect("assets/SarahElkinsResume.pdf", fs.readFileSync(pdfText, "utf8"));

  const docxText = execFileSync(
    "pandoc",
    [path.join(root, "documents/SarahElkinsResume.docx"), "--to=plain", "--wrap=none"],
    { encoding: "utf8" },
  );
  inspect("documents/SarahElkinsResume.docx", docxText);
} finally {
  fs.rmSync(temporaryDirectory, { recursive: true, force: true });
}

expect(!fs.existsSync(path.join(root, "documents/SarahElkinsReferences.docx")), "Private references document must remain removed");

if (failures.length) {
  console.error(`Privacy validation failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Public portfolio and resume privacy checks passed.");
