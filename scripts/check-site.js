#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(process.env.SITE_ROOT || path.join(__dirname, ".."));
const htmlFiles = ["index.html", "resume.html"];
const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function normalizeInternalPath(rawValue, sourceFile) {
  if (
    !rawValue ||
    rawValue.startsWith("#") ||
    /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(rawValue)
  ) {
    return null;
  }

  const [withoutFragment] = rawValue.split("#");
  const [withoutQuery] = withoutFragment.split("?");
  const sourceDirectory = path.dirname(sourceFile);
  const candidate = withoutQuery || sourceFile;
  const resolved = candidate === "/" || candidate === "./"
    ? "index.html"
    : path.normalize(path.join(sourceDirectory, candidate.replace(/^\.?\//, "")));

  return resolved.endsWith(path.sep) ? path.join(resolved, "index.html") : resolved;
}

const idsByFile = new Map();

for (const file of htmlFiles) {
  const filePath = path.join(root, file);
  expect(fs.existsSync(filePath), `${file} must exist in the built site`);
  if (!fs.existsSync(filePath)) continue;

  const html = fs.readFileSync(filePath, "utf8");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  expect(duplicateIds.length === 0, `${file} contains duplicate IDs: ${[...new Set(duplicateIds)].join(", ")}`);
  idsByFile.set(file, new Set(ids));
}

for (const file of htmlFiles) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) continue;

  const html = fs.readFileSync(filePath, "utf8");
  const references = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);

  for (const reference of references) {
    const targetPath = normalizeInternalPath(reference, file);
    if (targetPath) {
      expect(fs.existsSync(path.join(root, targetPath)), `${file} references missing file ${reference}`);
    }

    const fragment = reference.includes("#") ? reference.split("#").at(-1) : "";
    if (!fragment || /^(?:https?:|mailto:|tel:)/i.test(reference)) continue;

    const fragmentFile = targetPath && targetPath.endsWith(".html") ? targetPath : file;
    const targetIds = idsByFile.get(fragmentFile);
    expect(targetIds?.has(fragment), `${file} references missing fragment #${fragment} in ${fragmentFile}`);
  }
}

const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const demo of ["engagement", "capacity", "playbook"]) {
  expect(index.includes(`?demo=${demo}#${demo}-demo`), `Focused ${demo} demo route must remain linked`);
}

expect(!fs.existsSync(path.join(root, "documents/SarahElkinsReferences.docx")), "Private references document must not be published");

if (failures.length) {
  console.error(`Static site validation failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Static site links, fragments, IDs, and published files passed for ${root}.`);
