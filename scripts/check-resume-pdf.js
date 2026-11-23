#!/usr/bin/env node

const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const pdfPath = path.resolve(process.argv[2] || "assets/SarahElkinsResume.pdf");

function run(command, args) {
  return execFileSync(command, args, { encoding: "utf8" });
}

function expect(condition, message) {
  if (!condition) {
    console.error(`PDF validation failed: ${message}`);
    process.exit(1);
  }
}

expect(fs.existsSync(pdfPath), `missing file ${pdfPath}`);

const info = run("pdfinfo", [pdfPath]);
expect(/^Pages:\s+2$/m.test(info), "resume must contain exactly two pages");
expect(/^Page size:\s+612 x 792 pts \(letter\)$/m.test(info), "resume must use US Letter pages");

const text = run("pdftotext", [pdfPath, "-"]);
const orderedMarkers = [
  "PROFESSIONAL SUMMARY",
  "LEADERSHIP COMPETENCIES",
  "TECHNICAL SKILLS",
  "CERTIFICATION",
  "EDUCATION",
  "PROFESSIONAL EXPERIENCE",
  "June 2023",
  "January 2022",
  "November 2019",
  "KPMG LLP",
  "Hewlett Packard Enterprise",
];

let previousIndex = -1;
for (const marker of orderedMarkers) {
  const markerIndex = text.indexOf(marker);
  expect(markerIndex > previousIndex, `text extraction order is incorrect near "${marker}"`);
  previousIndex = markerIndex;
}

const links = run("pdfinfo", ["-url", pdfPath]);
expect(
  links.includes("https://www.credly.com/badges/fa92a33b-41d1-4094-aec3-d5c3608a0020/linked_in_profile"),
  "credential verification link is missing",
);

const bboxPath = path.join(os.tmpdir(), `resume-bbox-${process.pid}.html`);
run("pdftotext", ["-bbox", pdfPath, bboxPath]);
const bbox = fs.readFileSync(bboxPath, "utf8");
fs.rmSync(bboxPath);

const pages = [...bbox.matchAll(/<page width="([^"]+)" height="([^"]+)">([\s\S]*?)<\/page>/g)];
expect(pages.length === 2, "geometry output must contain two pages");

for (const [pageIndex, pageMatch] of pages.entries()) {
  const width = Number(pageMatch[1]);
  const height = Number(pageMatch[2]);
  const words = [...pageMatch[3].matchAll(/<word xMin="([^"]+)" yMin="([^"]+)" xMax="([^"]+)" yMax="([^"]+)">([^<]*)<\/word>/g)].map((match) => ({
    xMin: Number(match[1]),
    yMin: Number(match[2]),
    xMax: Number(match[3]),
    yMax: Number(match[4]),
    text: match[5],
  }));

  expect(words.length > 0, `page ${pageIndex + 1} contains no text`);

  for (const word of words) {
    expect(
      word.xMin >= 20 && word.yMin >= 20 && word.xMax <= width - 20 && word.yMax <= height - 20,
      `text "${word.text}" falls outside safe page margins on page ${pageIndex + 1}`,
    );
  }

  for (let firstIndex = 0; firstIndex < words.length; firstIndex += 1) {
    const first = words[firstIndex];
    for (let secondIndex = firstIndex + 1; secondIndex < words.length; secondIndex += 1) {
      const second = words[secondIndex];
      const overlapWidth = Math.min(first.xMax, second.xMax) - Math.max(first.xMin, second.xMin);
      const overlapHeight = Math.min(first.yMax, second.yMax) - Math.max(first.yMin, second.yMin);
      if (overlapWidth <= 0.5 || overlapHeight <= 4) continue;

      const overlapArea = overlapWidth * overlapHeight;
      const firstArea = (first.xMax - first.xMin) * (first.yMax - first.yMin);
      const secondArea = (second.xMax - second.xMin) * (second.yMax - second.yMin);
      expect(
        overlapArea < Math.min(firstArea, secondArea) * 0.2,
        `overlapping text "${first.text}" and "${second.text}" on page ${pageIndex + 1}`,
      );
    }
  }
}

console.log("Resume PDF geometry, order, links, and page format checks passed.");
