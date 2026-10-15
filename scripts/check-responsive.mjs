// Loads every page at phone, tablet and desktop widths and fails on sideways scrolling,
// small touch targets and form fields under 16px (which make iPhone Safari zoom in).
// Run after a build with: pnpm check:responsive
// Set CHROMIUM_PATH to use a browser that is already installed.
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = 3123;
const BASE = `http://localhost:${PORT}`;
const pages = [
  "/", "/funds", "/funds/senior-secured-mortgage-fund", "/funds/enhanced-yield-opportunity-mortgage-fund", "/funds/liquidity-fund",
  "/lending", "/settled-deals", "/private-equity", "/about", "/partners", "/insights", "/faqs", "/complaints",
  "/terms", "/privacy", "/contact", "/readiness-check",
];
const widths = [320, 375, 768, 1280];

const server = spawn("node_modules/.bin/next", ["start", "-p", String(PORT)], { stdio: "ignore" });
const stop = () => server.kill();
process.on("exit", stop);

async function waitUp() {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(BASE)).ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("server did not start");
}

const failures = [];
const fail = (msg) => failures.push(msg);

try {
  await waitUp();
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });

  // 1. Sideways scrolling. Plain viewports, because phone emulation can widen the layout and hide it.
  for (const w of widths) {
    const page = await (await browser.newContext({ viewport: { width: w, height: 800 } })).newPage();
    for (const u of pages) {
      await page.goto(BASE + u, { waitUntil: "networkidle" });
      const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (over > 0) fail(`overflow +${over}px at ${w}px on ${u}`);
    }
  }

  // 2. Touch targets and field sizes on touch screens.
  for (const w of [375, 768]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    for (const u of pages) {
      await page.goto(BASE + u, { waitUntil: "networkidle" });
      const found = await page.evaluate(() => {
        const out = { small: [], font: [] };
        const visible = (e) => {
          const r = e.getBoundingClientRect(), s = getComputedStyle(e);
          return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && !e.closest(".hp, .skip-link");
        };
        for (const e of document.querySelectorAll("a[href], button, select, textarea, input:not([type=hidden])")) {
          if (!visible(e)) continue;
          const type = e.getAttribute("type");
          const box = ["checkbox", "radio"].includes(type) ? (e.closest("label") ?? e) : e;
          if (type === "range") continue;
          const r = box.getBoundingClientRect();
          // Links inside a sentence are exempt, as in WCAG 2.2.
          if (e.tagName === "A" && getComputedStyle(e).display === "inline") continue;
          if (r.height < 43.5 || r.width < 43.5) out.small.push(`${e.tagName.toLowerCase()} "${(e.textContent || e.name || type || "").trim().slice(0, 24)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
          if (["INPUT", "SELECT", "TEXTAREA"].includes(e.tagName) && !["checkbox", "radio"].includes(type) && parseFloat(getComputedStyle(e).fontSize) < 16) {
            out.font.push(`${e.tagName.toLowerCase()} ${e.name || type} ${getComputedStyle(e).fontSize}`);
          }
        }
        return out;
      });
      for (const s of new Set(found.small)) fail(`small touch target at ${w}px on ${u}: ${s}`);
      for (const f of new Set(found.font)) fail(`field under 16px at ${w}px on ${u}: ${f}`);
    }
  }
  await browser.close();
} finally {
  stop();
}

if (failures.length) {
  console.error(failures.join("\n"));
  console.error(`\n${failures.length} responsive problem${failures.length === 1 ? "" : "s"}.`);
  process.exit(1);
}
console.log("Responsive check passed: no overflow, touch targets 44px or more, fields 16px or more.");
