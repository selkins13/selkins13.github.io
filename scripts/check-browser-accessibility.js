#!/usr/bin/env node

const { execFileSync, spawn } = require("node:child_process");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");

const baseUrl = process.argv[2] || "http://127.0.0.1:4173";
const chromeCandidates = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
].filter(Boolean);

function findChrome() {
  for (const candidate of chromeCandidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  try {
    return execFileSync("which", ["google-chrome"], { encoding: "utf8" }).trim();
  } catch {
    throw new Error("Chrome was not found. Set CHROME_BIN to a Chrome executable.");
  }
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function reservePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function waitForDevTools(port, processHandle) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {
      // Chrome has not opened its debugging endpoint yet.
    }
    if (processHandle.exitCode !== null) throw new Error(`Chrome exited with code ${processHandle.exitCode}`);
    await wait(50);
  }
  throw new Error("Timed out waiting for Chrome DevTools");
}

class CdpClient {
  constructor(url) {
    this.url = url;
    this.nextId = 1;
    this.pending = new Map();
  }

  async connect() {
    this.socket = new WebSocket(this.url);
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !this.pending.has(message.id)) return;
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    };
    await new Promise((resolve, reject) => {
      this.socket.onopen = resolve;
      this.socket.onerror = () => reject(new Error("Unable to connect to Chrome DevTools"));
    });
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.socket.close();
  }
}

const auditExpression = `(() => {
  const failures = [];
  const isVisible = (element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
  };
  const parseColor = (value) => {
    const match = value.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
    return match ? [Number(match[1]), Number(match[2]), Number(match[3]), match[4] === undefined ? 1 : Number(match[4])] : null;
  };
  const backgroundFor = (element) => {
    for (let current = element; current; current = current.parentElement) {
      const style = getComputedStyle(current);
      if (style.backgroundImage !== "none") return null;
      const color = parseColor(style.backgroundColor);
      if (color && color[3] > 0.95) return color;
    }
    return [255, 255, 255, 1];
  };
  const luminance = ([red, green, blue]) => {
    const channels = [red, green, blue].map((channel) => {
      const normalized = channel / 255;
      return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const contrast = (foreground, background) => {
    const lighter = Math.max(luminance(foreground), luminance(background));
    const darker = Math.min(luminance(foreground), luminance(background));
    return (lighter + 0.05) / (darker + 0.05);
  };
  const accessibleName = (element) => {
    const labelledBy = element.getAttribute("aria-labelledby");
    if (labelledBy) {
      const text = labelledBy.split(/\\s+/).map((id) => document.getElementById(id)?.textContent || "").join(" ").trim();
      if (text) return text;
    }
    return (
      element.getAttribute("aria-label") ||
      element.labels?.[0]?.textContent ||
      element.getAttribute("alt") ||
      element.getAttribute("title") ||
      element.textContent ||
      element.value ||
      ""
    ).trim();
  };

  if ([...document.querySelectorAll("main")].filter(isVisible).length !== 1) failures.push("page must contain exactly one visible main landmark");
  if ([...document.querySelectorAll("h1")].filter(isVisible).length !== 1) failures.push("page must contain exactly one visible h1");
  if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) failures.push("page has horizontal overflow");

  const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter(isVisible);
  for (let index = 1; index < headings.length; index += 1) {
    const previous = Number(headings[index - 1].tagName.slice(1));
    const current = Number(headings[index].tagName.slice(1));
    if (current > previous + 1) failures.push(\`heading level jumps from \${headings[index - 1].tagName} to \${headings[index].tagName}\`);
  }

  const controls = [...document.querySelectorAll("a[href],button,input,select,textarea")].filter(isVisible);
  for (const control of controls) {
    if (!accessibleName(control)) failures.push(\`\${control.tagName.toLowerCase()} has no accessible name\`);
  }

  for (const image of [...document.images].filter(isVisible)) {
    if (!image.hasAttribute("alt")) failures.push(\`image \${image.src} has no alt attribute\`);
  }

  for (const table of document.querySelectorAll("table")) {
    if (!table.querySelector("caption")) failures.push("table has no caption");
    if ([...table.querySelectorAll("th")].some((header) => !header.hasAttribute("scope"))) failures.push("table header has no scope");
  }

  const textElements = [...document.querySelectorAll("p,h1,h2,h3,h4,a,button,label,li,td,th,select")].filter((element) => isVisible(element) && element.textContent.trim());
  for (const element of textElements) {
    const style = getComputedStyle(element);
    const foreground = parseColor(style.color);
    const background = backgroundFor(element);
    if (!foreground || !background || foreground[3] < 0.95) continue;
    const fontSize = Number.parseFloat(style.fontSize);
    const fontWeight = Number.parseInt(style.fontWeight, 10) || 400;
    const largeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
    const minimum = largeText ? 3 : 4.5;
    const ratio = contrast(foreground, background);
    if (ratio + 0.05 < minimum) failures.push(\`contrast \${ratio.toFixed(2)}:1 for "\${element.textContent.trim().slice(0, 60)}"\`);
  }

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const longAnimations = document.getAnimations().filter((animation) => {
      const duration = Number(animation.effect?.getTiming().duration);
      return Number.isFinite(duration) && duration > 100;
    });
    if (longAnimations.length) failures.push("reduced-motion mode retains long animations");
  }

  return {
    failures: [...new Set(failures)],
    colorScheme: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    title: document.title,
  };
})()`;

const profiles = [
  { name: "home desktop light", path: "/", width: 1440, height: 1000, scheme: "light", reducedMotion: false },
  { name: "home desktop dark", path: "/", width: 1440, height: 1000, scheme: "dark", reducedMotion: true },
  { name: "home mobile light", path: "/", width: 375, height: 812, scheme: "light", reducedMotion: false },
  { name: "home mobile dark", path: "/", width: 375, height: 812, scheme: "dark", reducedMotion: true },
  { name: "resume desktop light", path: "/resume.html", width: 1440, height: 1000, scheme: "light", reducedMotion: false },
  { name: "resume mobile dark", path: "/resume.html", width: 375, height: 812, scheme: "dark", reducedMotion: true },
  { name: "engagement desktop dark", path: "/?demo=engagement", width: 1440, height: 1000, scheme: "dark", reducedMotion: false },
  { name: "capacity mobile light", path: "/?demo=capacity", width: 375, height: 812, scheme: "light", reducedMotion: false },
  { name: "playbook mobile dark", path: "/?demo=playbook", width: 375, height: 812, scheme: "dark", reducedMotion: true },
];

async function main() {
  const chrome = findChrome();
  const userDataDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-chrome-"));
  const port = await reservePort();
  const chromeProcess = spawn(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--hide-scrollbars",
      "--remote-debugging-address=127.0.0.1",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDirectory}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  try {
    await waitForDevTools(port, chromeProcess);
    const failures = [];

    for (const profile of profiles) {
      const response = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(new URL(profile.path, baseUrl).href)}`, { method: "PUT" });
      const target = await response.json();
      const client = new CdpClient(target.webSocketDebuggerUrl);
      await client.connect();
      await client.send("Page.enable");
      await client.send("Runtime.enable");
      await client.send("Emulation.setDeviceMetricsOverride", {
        width: profile.width,
        height: profile.height,
        deviceScaleFactor: 1,
        mobile: profile.width < 600,
      });
      await client.send("Emulation.setEmulatedMedia", {
        media: "",
        features: [
          { name: "prefers-color-scheme", value: profile.scheme },
          { name: "prefers-reduced-motion", value: profile.reducedMotion ? "reduce" : "no-preference" },
        ],
      });
      await client.send("Page.navigate", { url: new URL(profile.path, baseUrl).href });

      for (let attempt = 0; attempt < 100; attempt += 1) {
        const ready = await client.send("Runtime.evaluate", { expression: "document.readyState", returnByValue: true });
        if (ready.result.value === "complete") break;
        await wait(50);
      }
      await wait(150);

      const audit = await client.send("Runtime.evaluate", {
        expression: auditExpression,
        returnByValue: true,
        awaitPromise: true,
      });
      const result = audit.result.value;
      if (result.colorScheme !== profile.scheme) failures.push(`${profile.name}: color scheme emulation failed`);
      if (result.reducedMotion !== profile.reducedMotion) failures.push(`${profile.name}: reduced-motion emulation failed`);
      result.failures.forEach((failure) => failures.push(`${profile.name}: ${failure}`));

      client.close();
      await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`);
    }

    if (failures.length) {
      console.error(`Browser accessibility audit failed (${failures.length}):`);
      failures.forEach((failure) => console.error(`- ${failure}`));
      process.exitCode = 1;
    } else {
      console.log(`Browser accessibility audit passed for ${profiles.length} desktop/mobile light/dark scenarios.`);
    }
  } finally {
    if (chromeProcess.exitCode === null) {
      chromeProcess.kill("SIGTERM");
      await Promise.race([
        new Promise((resolve) => chromeProcess.once("exit", resolve)),
        wait(2000),
      ]);
    }
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        fs.rmSync(userDataDirectory, { recursive: true, force: true });
        break;
      } catch (error) {
        if (error.code !== "ENOTEMPTY" || attempt === 4) throw error;
        await wait(100);
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
