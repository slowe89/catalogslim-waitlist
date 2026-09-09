import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.QA_BASE || "http://127.0.0.1:5173";
const OUT = path.resolve("docs/polish-qa");

const KEYS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10"];
const BANDS = [
  [0, "Baseline not established"],
  [30, "Baseline not established"],
  [40, "Some checks covered"],
  [60, "Some checks covered"],
  [70, "Most checks covered"],
  [80, "Most checks covered"],
  [90, "Checklist largely covered"],
  [100, "Checklist largely covered"],
];

function yesCountForTotal(total) {
  return total / 10;
}

async function setScore(page, yesCount) {
  for (let i = 0; i < KEYS.length; i += 1) {
    const value = i < yesCount ? "Y" : "N";
    await page.locator(`input[name="maturity-${KEYS[i]}"][value="${value}"]`).check();
  }
}

async function fillForm(page) {
  await page.locator("#email").fill("qa@example.com");
  await page.locator("#q1").fill("About 40 tools across 3 MCP servers.");
  await page.locator("#q2").fill("Fewer wrong-tool calls on our labeled set.");
  await page.locator("#q3").fill("Tool search is on; siblings still collide.");
  await page.locator("#q4").fill("Roughly four to eight thousand if it works.");
  await page.locator("#q5").fill("Nothing else");
  await page.locator('input[name="budget_band"][value="Not sure yet"]').check();
}

const failures = [];
function check(name, ok, detail = "") {
  if (ok) {
    console.log(`PASS  ${name}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/usr/local/bin/google-chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

await mkdir(OUT, { recursive: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto(BASE, { waitUntil: "networkidle" });

const formVisible = await page.locator("#priestley-form").isVisible();
const successHidden = await page.locator("#form-success").isHidden();
check("initial form visible, success hidden", formVisible && successHidden);

await page.goto(`${BASE}/?submitted=1`, { waitUntil: "networkidle" });
check(
  "?submitted does not fabricate success",
  (await page.locator("#priestley-form").isVisible()) &&
    (await page.locator("#form-success").isHidden()),
);

await page.goto(BASE, { waitUntil: "networkidle" });
await page.screenshot({ path: path.join(OUT, "hero-desktop.png"), fullPage: false });

const heroBox = await page.locator(".hero").boundingBox();
const ctaBox = await page.locator(".cta-row .btn.primary").boundingBox();
check(
  "desktop promise + primary CTA above the fold",
  Boolean(heroBox && ctaBox && ctaBox.y + 20 < 800),
  `cta y=${ctaBox?.y}`,
);

const h1 = await page.locator("h1").innerText();
check("H1 is new promise", h1.includes("Help your agents choose the right tool"));

const version = await page.locator("#meta-score-version").inputValue();
check("scorecard version marker", version === "catalogslim-polish-2026-09-09");

const action = await page.locator("#priestley-form").getAttribute("action");
check("FormSubmit recipient", action === "https://formsubmit.co/thespencerlowe@gmail.com");

const subject = await page.locator('input[name="_subject"]').inputValue();
check("subject CatalogSlim waitlist", subject === "CatalogSlim waitlist");

check(
  "no .success{display:none} conflict",
  await page.evaluate(() => {
    const sheet = [...document.styleSheets].flatMap((s) => {
      try {
        return [...s.cssRules];
      } catch {
        return [];
      }
    });
    return !sheet.some((rule) => rule.selectorText === ".success" && /display:\s*none/.test(rule.cssText));
  }),
);

check(
  "[hidden] uses !important none",
  await page.evaluate(() => {
    const el = document.createElement("div");
    el.hidden = true;
    el.className = "priestley success";
    document.body.append(el);
    const display = getComputedStyle(el).display;
    el.remove();
    return display === "none";
  }),
);

await page.evaluate(() => document.getElementById("scorecard").scrollIntoView());
const progress0 = await page.locator("#score-progress").innerText();
const total0 = await page.locator("#score-total").innerText();
check("empty score state", progress0.includes("0 / 10") && total0.includes("—"));

await page.locator('input[name="maturity-q1"][value="Y"]').check();
check(
  "partial does not name a completed band",
  (await page.locator("#score-band").innerText()).toLowerCase().includes("partial"),
);

await page.locator('input[name="maturity-q1"][value="N"]').check();
await setScore(page, 0);
check(
  "all No = 0 Baseline not established",
  (await page.locator("#score-total").innerText()).includes("0 / 100") &&
    (await page.locator("#score-band").innerText()).includes("Baseline not established"),
);

for (const [total, band] of BANDS) {
  await setScore(page, yesCountForTotal(total));
  const shownTotal = await page.locator("#score-total").innerText();
  const shownBand = await page.locator("#score-band").innerText();
  check(`boundary ${total} → ${band}`, shownTotal.includes(`${total} / 100`) && shownBand.includes(band));
}

await setScore(page, 7);
await page.locator('input[name="maturity-q7"][value="N"]').check();
check(
  "edit after completion updates 60 / Some checks covered",
  (await page.locator("#score-total").innerText()).includes("60 / 100") &&
    (await page.locator("#score-band").innerText()).includes("Some checks covered"),
);

await setScore(page, 8);
await page.locator("#scorecard").scrollIntoViewIfNeeded();
await page.waitForTimeout(150);
await page.screenshot({
  path: path.join(OUT, "scorecard-completed.png"),
  fullPage: false,
});

const radioMetrics = await page.evaluate(() => {
  const radio = document.querySelector('#score-items input[type="radio"]');
  const label = radio.closest("label");
  const text = label.querySelector("span");
  const r = radio.getBoundingClientRect();
  const l = label.getBoundingClientRect();
  const t = text.getBoundingClientRect();
  return {
    w: Math.round(r.width),
    h: Math.round(r.height),
    labelH: Math.round(l.height),
    textGap: Math.round(t.left - r.right),
  };
});
check(
  "radios 18px and labels ≥44px",
  radioMetrics.w === 18 && radioMetrics.h === 18 && radioMetrics.labelH >= 44,
  JSON.stringify(radioMetrics),
);
check(
  "radio sits 8px from Yes/No text",
  radioMetrics.textGap >= 6 && radioMetrics.textGap <= 12,
  JSON.stringify(radioMetrics),
);

await page.setViewportSize({ width: 1280, height: 800 });
await page.goto(`${BASE}/#waitlist`, { waitUntil: "networkidle" });
await page.locator("#priestley-form").scrollIntoViewIfNeeded();
await page.waitForTimeout(150);
await page.screenshot({ path: path.join(OUT, "form.png"), fullPage: false });

const requiredFields = ["#email", "#q1", "#q2", "#q3", "#q4", "#q5"];
for (const sel of requiredFields) {
  check(`${sel} required`, await page.locator(sel).getAttribute("required") !== null);
}
check(
  "six budget bands",
  (await page.locator('input[name="budget_band"]').count()) === 6,
);

await fillForm(page);

let posts = 0;
await page.route("https://formsubmit.co/**", async (route) => {
  posts += 1;
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ success: "false", message: "Activation required (mocked)." }),
  });
});
await page.locator("#submit-btn").click();
await page.waitForTimeout(300);
check("body-level rejection keeps form + answers", await page.locator("#priestley-form").isVisible());
check("body-level rejection shows error", (await page.locator("#form-error").innerText()).length > 0);
check("email preserved after rejection", (await page.locator("#email").inputValue()) === "qa@example.com");
check("q1 preserved after rejection", (await page.locator("#q1").inputValue()).includes("40 tools"));
const afterRejectPosts = posts;

await page.unroute("https://formsubmit.co/**");
await page.route("https://formsubmit.co/**", async (route) => {
  posts += 1;
  await route.fulfill({
    status: 500,
    contentType: "application/json",
    body: JSON.stringify({ success: "false", message: "HTTP error (mocked)." }),
  });
});
await page.locator("#submit-btn").click();
await page.waitForTimeout(300);
check("HTTP error keeps answers", (await page.locator("#email").inputValue()) === "qa@example.com");
check("HTTP error visible", await page.locator("#form-error").isVisible());

await page.unroute("https://formsubmit.co/**");
await page.route("https://formsubmit.co/**", async (route) => {
  posts += 1;
  await route.abort("failed");
});
await page.locator("#submit-btn").click();
await page.waitForTimeout(300);
check("network failure keeps answers", (await page.locator("#q5").inputValue()).includes("Nothing else"));
check(
  "network failure copy",
  (await page.locator("#form-error").innerText()).toLowerCase().includes("connection"),
);

await page.unroute("https://formsubmit.co/**");
let captured;
await page.route("https://formsubmit.co/**", async (route) => {
  posts += 1;
  captured = {
    url: route.request().url(),
    postData: route.request().postData() || "",
  };
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ success: "true" }),
  });
});
await page.locator("#submit-btn").click();
await page.waitForTimeout(200);
await page.locator("#submit-btn").click({ force: true }).catch(() => {});
await page.waitForTimeout(400);
check("confirmed success hides form", await page.locator("#priestley-form").isHidden());
check("confirmed success shows #form-success", await page.locator("#form-success").isVisible());
const active = await page.evaluate(() => document.activeElement?.id);
check("focus moves to success", active === "form-success", `active=${active}`);
check("success POST used ajax endpoint", Boolean(captured?.url.includes("/ajax/")));
check("honeypot preserved in payload", Boolean(captured?.postData.includes("_honey")));
check("scorecard_version in payload", Boolean(captured?.postData.includes("catalogslim-polish-2026-09-09")));
check("subject in payload", Boolean(captured?.postData.includes("CatalogSlim waitlist")));
check("no extra POST after success click", posts === afterRejectPosts + 3, `posts=${posts} afterReject=${afterRejectPosts}`);

await page.locator("#form-success").scrollIntoViewIfNeeded();
await page.waitForTimeout(150);
await page.screenshot({ path: path.join(OUT, "success-state.png"), fullPage: false });

const viewports = [
  [1440, 900, "hero-1440.png"],
  [768, 1024, "hero-768.png"],
  [390, 844, "hero-mobile.png"],
  [360, 800, "hero-360.png"],
  [320, 568, "hero-320.png"],
];

for (const [w, h, file] of viewports) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(BASE, { waitUntil: "networkidle" });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  check(`no horizontal overflow ${w}x${h}`, !overflow, `scrollWidth overflow`);
  if (file === "hero-mobile.png") {
    await page.screenshot({ path: path.join(OUT, file), fullPage: false });
    const cta = await page.locator(".cta-row .btn.primary").boundingBox();
    check("mobile primary CTA in first screen", Boolean(cta && cta.y < 844));
  }
}

await page.setViewportSize({ width: 390, height: 844 });
await page.locator("#ranges").scrollIntoViewIfNeeded();
await page.waitForTimeout(150);
await page.screenshot({ path: path.join(OUT, "pricing-mobile.png"), fullPage: false });
const pricingOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
check("mobile pricing no document overflow", !pricingOverflow);

await page.locator("#scorecard").scrollIntoViewIfNeeded();
await page.waitForTimeout(150);
await page.screenshot({ path: path.join(OUT, "scorecard-mobile.png"), fullPage: false });

await page.setViewportSize({ width: 1280, height: 800 });
await page.goto(BASE, { waitUntil: "networkidle" });
await page.locator("#ranges").scrollIntoViewIfNeeded();
await page.waitForTimeout(150);
await page.screenshot({ path: path.join(OUT, "pricing-desktop.png"), fullPage: false });

await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} failing checks`);
  for (const item of failures) console.error(` - ${item}`);
  process.exit(1);
}

console.log("\nAll automated polish checks passed.");
