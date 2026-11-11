import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { randomUUID } from "node:crypto";

const base = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";
if (!["127.0.0.1", "localhost"].includes(new URL(base).hostname)) throw new Error("Stateful E2E tests require a disposable local deployment.");
const inquiry = (extra: Record<string, unknown> = {}) => ({
  fullName: "QA Example", email: `qa-${randomUUID()}@example.test`, company: "Example Test Company", website: "", country: "Pakistan", service: "website", budget: "45000-95000", timeline: "flexible", description: "A test project brief for a responsive business website. This is automated test data.", contactMethod: "email", consent: true, acknowledgmentConsent: false, websiteConfirmation: "", submissionId: randomUUID(), source: "services", ...extra,
});

test("services has factual offers, honest booking fallback and canonical metadata", async ({ page, request }) => {
  await page.goto("/services");
  await expect(page.locator("h1")).toContainText(/websites|software|automation/i);
  for (const price of [/45,000/, /95,000/, /175,000/]) await expect(page.getByText(price).first()).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://wajidali.dev/services");
  const consultation = page.getByRole("link", { name: /Request a Free 20-Minute Consultation/ }).first();
  await expect(consultation).toHaveAttribute("href", /#inquiry$/);
  await expect(page.getByText(/not commissioned|not endorsed|unofficial/i).first()).toBeAttached();
  await expect(page.locator('script[type="application/ld+json"]')).not.toHaveCount(0);
  const social = await page.locator('meta[property="og:image"]').getAttribute("content");
  const image = await request.get(new URL(social!).pathname);
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
});

test("form announces errors, accepts a qualified inquiry and prevents a second submit", async ({ page }) => {
  await page.goto("/services?service=saas#inquiry");
  await page.getByRole("button", { name: "Send my project inquiry" }).click();
  await expect(page.locator('[role="alert"][tabindex="-1"]')).toContainText("highlighted fields");
  await expect(page.locator('[role="alert"][tabindex="-1"]')).toBeFocused();
  await page.getByLabel("Full name", { exact: false }).fill("QA Browser Example");
  await page.getByLabel("Business email", { exact: false }).fill(`browser-${randomUUID()}@example.test`);
  await page.getByLabel("Company or project name", { exact: false }).fill("Automated Example");
  await page.getByLabel("Country", { exact: false }).fill("Pakistan");
  await expect(page.getByLabel("Service required", { exact: false })).toHaveValue("saas");
  await page.getByLabel("Estimated project budget", { exact: false }).selectOption("discuss");
  await page.getByLabel("Desired timeline", { exact: false }).selectOption("flexible");
  await page.getByLabel("What are you trying to achieve?", { exact: false }).fill("Build a scoped business portal with clear permissions and an accessible responsive interface.");
  await page.locator('input[name="consent"]').check();
  await page.getByRole("button", { name: "Send my project inquiry" }).click();
  await expect(page.getByRole("status")).toContainText("received", { timeout: 15000 });
  await expect(page.getByRole("button", { name: "Send my project inquiry" })).toHaveCount(0);
});

test("server rejects cross-site, invalid, oversized data and suppresses honeypot spam", async ({ request }) => {
  const origin = new URL(base).origin;
  expect((await request.post("/api/inquiries", { headers: { Origin: "https://attacker.test" }, data: inquiry() })).status()).toBe(403);
  expect((await request.post("/api/inquiries", { headers: { Origin: origin }, data: inquiry({ consent: false }) })).status()).toBe(422);
  expect((await request.post("/api/inquiries", { headers: { Origin: origin }, data: inquiry({ description: "x".repeat(17000) }) })).status()).toBe(413);
  expect((await request.post("/api/inquiries", { headers: { Origin: origin }, data: inquiry({ websiteConfirmation: "bot" }) })).status()).toBe(200);
});

test("persistent rate limits and idempotency hold through the real route", async ({ request }) => {
  const headers = { Origin: new URL(base).origin };
  const body = inquiry();
  expect((await request.post("/api/inquiries", { headers, data: body })).status()).toBe(200);
  expect((await request.post("/api/inquiries", { headers, data: body })).status()).toBe(200);
  expect((await request.post("/api/inquiries", { headers, data: { ...body, company: "Changed company" } })).status()).toBe(409);
  for (let i = 0; i < 4; i++) expect((await request.post("/api/inquiries", { headers, data: { ...body, submissionId: randomUUID() } })).status()).toBe(200);
  const limited = await request.post("/api/inquiries", { headers, data: { ...body, submissionId: randomUUID() } });
  expect(limited.status()).toBe(429);
  expect(limited.headers()["retry-after"]).toBeTruthy();
});

for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
  test(`responsive services layout and accessible form at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/services");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator("#inquiry").scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByLabel("Full name", { exact: false })).toBeVisible();
  });
}

test("WCAG axe audit, keyboard focus, theme and reduced-motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/services");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  const dark = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"]).analyze();
  expect(dark.violations).toEqual([]);
  await page.getByRole("switch", { name: "Day theme" }).click();
  const light = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"]).analyze();
  expect(light.violations).toEqual([]);
});

test("services is useful without JavaScript and existing home is intact", async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const nojs = await context.newPage();
  await nojs.goto(base + "/services");
  await expect(nojs.locator("h1")).toBeVisible();
  await expect(nojs.getByRole("button", { name: "Send my project inquiry" })).toBeDisabled();
  await expect(nojs.locator("form")).toHaveAttribute("method", "POST");
  await expect(nojs.locator("form")).toHaveAttribute("action", "/api/inquiries");
  await expect(nojs.getByRole("link", { name: "Email your project brief instead" })).toBeVisible();
  await context.close();
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("I turn complex ideas");
  await expect(page.getByRole("link", { name: "Explore services" })).toHaveAttribute("href", "/services");
});

test("standalone templates support editable calculations and PDF output", async ({ page }) => {
  for (const name of ["proposal", "invoice"]) {
    await page.goto(`/templates/${name}.html`);
    await expect(page.locator("h1")).toContainText(new RegExp(name, "i"));
    if (name === "invoice") {
      await page.getByLabel("Quantity 1", { exact: true }).fill("2.5");
      await page.getByLabel("Unit price 1", { exact: true }).fill("10.01");
      await expect(page.locator("#invoice-subtotal")).toHaveText("PKR 25.03");
      await page.getByLabel("Tax % (if applicable)", { exact: true }).fill("10");
      await expect(page.locator("#invoice-total")).toHaveText("PKR 27.53");
    }
    await page.emulateMedia({ media: "print" });
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    expect(pdf.length).toBeGreaterThan(5000);
  }
});

test("lead data stays private; owner can update, filter, export and delete a synthetic lead", async ({ page, request }) => {
  const body = inquiry({ fullName: `Admin QA ${randomUUID()}` });
  expect((await request.post("/api/inquiries", { headers: { Origin: new URL(base).origin }, data: body })).status()).toBe(200);
  const unauthorizedWrite = await request.post("/admin/leads/mutate", { headers: { Origin: new URL(base).origin }, form: { operation: "delete", id: randomUUID(), confirm: "delete" }, maxRedirects: 0 });
  expect(unauthorizedWrite.status()).toBe(303);
  expect(unauthorizedWrite.headers().location).toContain("/admin/login");
  const unauthenticated = await request.get("/admin/leads/export");
  expect(new URL(unauthenticated.url()).pathname).toBe("/admin/login");
  expect(await unauthenticated.text()).not.toContain(body.description);
  await page.goto("/admin/leads");
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.getByLabel("Password", { exact: true }).fill(process.env.ADMIN_PASSWORD ?? "local-ci-password-not-for-production");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/leads/);
  await page.getByLabel("Search name, email or company", { exact: true }).fill(body.email as string);
  await page.getByRole("button", { name: "Apply filters" }).click();
  const lead = page.locator("article").filter({ hasText: body.email as string });
  await expect(lead).toHaveCount(1);
  await lead.getByLabel("Lead status", { exact: true }).selectOption("qualified");
  await lead.getByLabel("Internal notes", { exact: true }).fill("Synthetic follow-up note for QA only.");
  await lead.getByLabel("Follow-up date (UTC)", { exact: true }).fill("2027-01-05");
  await lead.getByRole("button", { name: "Save lead", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Lead updated");
  await page.getByLabel("Search name, email or company", { exact: true }).fill(body.email as string);
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(lead.getByLabel("Lead status", { exact: true })).toHaveValue("qualified");
  await expect(lead.getByLabel("Internal notes", { exact: true })).toHaveValue("Synthetic follow-up note for QA only.");
  const exported = await page.request.get(`/admin/leads/export?q=${encodeURIComponent(body.email as string)}`);
  expect(exported.headers()["cache-control"]).toContain("no-store");
  expect(exported.headers()["content-type"]).toContain("text/csv");
  expect(await exported.text()).toContain(body.email);
  await lead.getByText("Privacy and retention controls", { exact: true }).click();
  await lead.getByLabel("Confirm permanent deletion", { exact: true }).check();
  await lead.getByRole("button", { name: "Delete lead", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Lead permanently deleted");
  await page.context().clearCookies();
  await page.goto("/admin/leads");
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("conversion event bridge emits allowlisted categories without form values", async ({ page }) => {
  test.skip(process.env.NEXT_PUBLIC_CONVERSION_EVENTS_ENABLED !== "true", "Build and run with the optional event bridge enabled to test emission.");
  await page.addInitScript(() => {
    const events: unknown[] = [];
    Object.assign(window, { conversionTestEvents: events });
    window.addEventListener("portfolio:conversion", (event) => events.push((event as CustomEvent).detail));
  });
  await page.goto("/services");
  await page.getByLabel("Full name", { exact: false }).fill("Do not send this name to analytics");
  const events = await page.evaluate(() => (window as unknown as { conversionTestEvents: { event: string; source: string }[] }).conversionTestEvents);
  expect(events.some(e => e.event === "services_page_viewed")).toBe(true);
  expect(events.some(e => e.event === "inquiry_started")).toBe(true);
  for (const event of events) expect(Object.keys(event).sort()).toEqual(["event", "source"]);
  expect(JSON.stringify(events)).not.toContain("Do not send");
});
