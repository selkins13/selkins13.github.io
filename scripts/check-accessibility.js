const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const resumeHtml = fs.readFileSync(path.join(root, "resume.html"), "utf8");
const css = fs.readFileSync(path.join(root, "assets/css/portfolio.css"), "utf8");
const resumeCss = fs.readFileSync(path.join(root, "assets/css/resume.css"), "utf8");
const js = fs.readFileSync(path.join(root, "assets/js/portfolio.js"), "utf8");
const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function matches(source, pattern) {
  return [...source.matchAll(pattern)];
}

function pngDimensions(filePath) {
  const image = fs.readFileSync(filePath);
  return [image.readUInt32BE(16), image.readUInt32BE(20)];
}

expect(/<html\s+lang="en"/i.test(html), "Document must declare its language.");
expect(/class="skip-link"\s+href="#main"/i.test(html), "A skip link must target the main content.");
expect(/<main\s+id="main"/i.test(html), "The page must contain one addressable main landmark.");
expect(matches(html, /<main\b/gi).length === 1, "The page must contain exactly one main landmark.");
expect(/<nav[^>]+aria-label="Primary navigation"/i.test(html), "Primary navigation must have an accessible name.");
expect(matches(html, /<h1\b/gi).length === 1, "The page must contain exactly one h1.");
expect(!/\btabindex="[1-9]\d*"/i.test(html), "Positive tabindex values are not allowed.");

for (const [, attributes] of matches(html, /<button\b([^>]*)>/gi)) {
  expect(/\btype="button"/i.test(attributes), "Every non-submit button must declare type=\"button\".");
}

for (const [, attributes] of matches(html, /<img\b([^>]*)>/gi)) {
  expect(/\balt="[^"]*"/i.test(attributes), "Every image must include an alt attribute.");
}

for (const [, attributes] of matches(html, /<a\b([^>]*)>/gi)) {
  if (/\btarget="_blank"/i.test(attributes)) {
    expect(/\brel="[^"]*\bnoopener\b[^"]*"/i.test(attributes), "Links opening a new tab must use rel=\"noopener\".");
  }
}

expect(/class="table-wrap"[^>]+role="region"[^>]+tabindex="0"/i.test(html), "Scrollable data tables must be named keyboard-focusable regions.");
expect(/<caption\s+class="sr-only"/i.test(html), "Data tables must include a caption.");
expect(!/<th\b(?![^>]*\bscope=)/i.test(html), "Every table header must declare its scope.");
expect(/class="hero-visual"\s+role="img"\s+aria-label=/i.test(html), "The hero illustration must expose a concise text alternative.");
expect(/class="trend-chart"[^>]+role="img"[^>]+aria-label=/i.test(html), "The trend chart must expose a text alternative.");
expect(/class="pipeline-chart"[^>]+role="img"[^>]+aria-label=/i.test(html), "The lifecycle chart must expose a text alternative.");
expect(/class="capacity-legend"\s+role="group"\s+aria-label=/i.test(html), "The capacity legend must use a supported named role.");
expect(matches(html, /href="\?demo=(?:engagement|capacity|playbook)#[^"]+"/gi).length === 6, "Each case study must have clear card and in-context focused-demo links.");
expect(matches(html, /Open interactive demo/gi).length === 3, "Each selected-work card must include an explicit demo CTA.");

const controlCount = matches(html, /<(?:input|select)\b/gi).length;
const labelCount = matches(html, /<label\b/gi).length;
expect(labelCount >= controlCount, "Every static form control must have a visible or screen-reader label.");

expect(/:focus-visible\s*\{[^}]*outline:/s.test(css), "Visible focus styling must be defined.");
expect(/@media\s*\(prefers-color-scheme:\s*dark\)/i.test(css), "Dark mode must follow the browser color preference.");
expect(/@media\s*\(prefers-reduced-motion:\s*reduce\)/i.test(css), "Reduced-motion preferences must be respected.");
expect(!/outline\s*:\s*(?:0|none)/i.test(css), "Focus outlines must not be globally removed.");
expect(/\.person\s+\.avatar\s*\{\s*color:\s*var\(--white\)/s.test(css), "Avatar initials must retain sufficient foreground contrast.");

expect(/trend-chart"\)\.setAttribute\("aria-label"/.test(js), "Trend chart data must update its accessible description.");
expect(/pipeline-chart"\)\.setAttribute\("aria-label"/.test(js), "Lifecycle chart data must update its accessible description.");
expect(/aria-pressed="\$\{person\.name === selectedPerson\}"/.test(js), "Selected resources must expose their pressed state.");
expect(/aria-label="\$\{weekLabels\[index\]\}/.test(js), "Weekly utilization values must include their date and measure.");
expect(/function initFocusedDemo\(\)/.test(js) && /demo-explore-title/.test(js), "Focused demos must have a direct-link exploration mode with a page heading.");
expect(/<main\s+id="resume-main"/i.test(resumeHtml), "Resume page must include a main landmark.");
expect(matches(resumeHtml, /<h1\b/gi).length === 1, "Resume page must contain exactly one h1.");
for (const page of [html, resumeHtml]) {
  expect(/rel="icon"\s+href="\.\/assets\/favicon\.svg"\s+type="image\/svg\+xml"/i.test(page), "Each page must include the SVG favicon.");
  expect(/rel="icon"\s+href="\.\/assets\/favicon-32\.png"\s+type="image\/png"\s+sizes="32x32"/i.test(page), "Each page must include the 32px favicon.");
  expect(/rel="apple-touch-icon"\s+href="\.\/assets\/apple-touch-icon\.png"\s+sizes="180x180"/i.test(page), "Each page must include the Apple touch icon.");
}
expect(pngDimensions(path.join(root, "assets/favicon-32.png")).join("x") === "32x32", "The PNG favicon must be 32x32.");
expect(pngDimensions(path.join(root, "assets/apple-touch-icon.png")).join("x") === "180x180", "The Apple touch icon must be 180x180.");
expect(/href="\.\/assets\/SarahElkinsResume\.pdf"\s+download/i.test(resumeHtml), "Resume page must include a downloadable PDF link.");
expect(!/Print or save as PDF/i.test(resumeHtml), "Resume page must not include a redundant print CTA.");
expect(/@media\s+print/i.test(resumeCss), "Resume page must include print-specific styling.");
expect(matches(`${html}\n${resumeHtml}`, /https:\/\/www\.credly\.com\/badges\/fa92a33b-41d1-4094-aec3-d5c3608a0020\/linked_in_profile/gi).length === 2, "Portfolio and resume must include the verified Copilot credential link.");
expect(matches(`${html}\n${resumeHtml}`, /Microsoft Pro Badge: GitHub Copilot - Proficient/g).length === 2, "Portfolio and resume must preserve the exact certification name.");
expect(!/\b\d{3,5}\s+[A-Za-z][A-Za-z ]+\s+(?:Road|Street|Avenue|Lane|Drive)\b/i.test(`${html}\n${resumeHtml}`), "Published HTML must not include a street address.");
expect(!/\(\d{3}\)\s*\d{3}[-.\s]\d{4}/.test(`${html}\n${resumeHtml}`), "Published HTML must not include a phone number.");

if (failures.length) {
  console.error(`Accessibility regression check failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Accessibility regression checks passed.");
