import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const widths = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
const homeHeadline = "I turn complex ideas into exceptional digital products.";

// These checks are read-only. Stateful inquiry, provider-mock and owner-admin
// coverage remains in services.spec.ts and the existing integration tests.
test("homepage communicates business value with honest project and recruiter paths", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText(homeHeadline);
  await expect(page.locator("main")).toContainText("Software Engineer & Product Builder");
  await expect(page.getByRole("link", { name: "Start a Project", exact: true }).first()).toHaveAttribute("href", /\/services.*#inquiry$/);
  await expect(page.getByRole("link", { name: "Explore My Work", exact: true })).toHaveAttribute("href", /#work$|\/work$/);
  await expect(page.locator("main")).toContainText(/full-time|contract engineering|recruiter/i);
  await expect(page.locator("#work img").first()).toBeVisible();
  await expect(page.locator("main")).not.toContainText(/99\.98|40×|Available from Sept|three SaaS products from prototype to paying/i);
  await expect(page.locator('a[download][href*="resume"], a[href$="resume.pdf"]')).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://wajidali.dev");
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(schemas.length).toBeGreaterThan(0);
  for (const schema of schemas) expect(() => JSON.parse(schema)).not.toThrow();
  expect(pageErrors).toEqual([]);
});

test("primary desktop navigation reaches services, work and about", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const header = page.locator("header");
  for (const name of ["Home", "Services", "Work", "About", "Contact"]) {
    await expect(header.getByRole("link", { name, exact: true }).first()).toBeVisible();
  }
  await header.getByRole("link", { name: "Work", exact: true }).first().click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.locator("h1")).toBeVisible();
  await header.getByRole("link", { name: "About", exact: true }).first().click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator("h1")).toBeVisible();
  await header.getByRole("link", { name: "Services", exact: true }).first().click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.locator("#inquiry")).toBeAttached();
  expect(errors).toEqual([]);
});

test("mobile navigation contains focus, closes on Escape and restores its trigger", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.locator("header").getByRole("button", { name: /menu|navigation/i });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const focusIsInDialog = () => dialog.evaluate(node => node.contains(document.activeElement));
  expect(await focusIsInDialog()).toBe(true);
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    expect(await focusIsInDialog()).toBe(true);
  }
  await page.keyboard.press("Shift+Tab");
  expect(await focusIsInDialog()).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("link", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(dialog).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});

test("theme persists across route changes and reloads", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("switch", { name: "Day theme" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.goto("/services");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("switch", { name: "Day theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

for (const theme of ["dark", "light"] as const) {
  for (const width of widths) {
    test(`public layouts fit ${width}px in ${theme} theme`, async ({ page }) => {
      await page.addInitScript(value => localStorage.setItem("theme", value), theme);
      await page.setViewportSize({ width, height: 1000 });
      for (const route of ["/", "/work", "/about", "/services", "/work/hrms"]) {
        await page.goto(route);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} should fit ${width}px`).toBe(true);
        await expect(page.locator("h1")).toBeVisible();
        await page.locator("footer").scrollIntoViewIfNeeded();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} footer should fit ${width}px`).toBe(true);
      }
    });
  }
  for (const route of ["/", "/work", "/about", "/services"]) {
    test(`WCAG AA audit for ${route} in ${theme} theme`, async ({ page }) => {
      await page.addInitScript(value => localStorage.setItem("theme", value), theme);
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
}

test("project case studies resolve with factual context and independent-redesign disclosures", async ({ page, request }) => {
  await page.goto("/work");
  const caseLinks = page.locator('main a[href^="/work/"]');
  const hrefs = [...new Set(await caseLinks.evaluateAll(nodes => nodes.map(node => node.getAttribute("href")!)))];
  expect(hrefs.length).toBeGreaterThanOrEqual(3);
  for (const href of hrefs) {
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
    await page.goto(href);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://wajidali.dev${href}`);
    const schema = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(schema.some(value => /CreativeWork/.test(value))).toBe(true);
    if (/knowledgecity|cloudcard/.test(href)) {
      await expect(page.locator("main")).toContainText(/unofficial|independent|not commissioned|not endorsed/i);
    }
    await expect(page.locator('main a[href*="/services"]').first()).toHaveAttribute("href", /\/services/);
  }
});

test("reduced-motion and no-JavaScript visitors receive visible useful content", async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText(homeHeadline);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
  await expect(page.locator("#work")).toBeAttached();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const nojs = await context.newPage();
  const base = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";
  await nojs.goto(base);
  await expect(nojs.locator("h1")).toHaveText(homeHeadline);
  await expect(nojs.locator("#work img").first()).toBeAttached();
  await expect(nojs.locator('a[href="/services#inquiry"]').first()).toBeVisible();
  await context.close();
});

test("desktop and mobile screenshot evidence captures key public pages", async ({ page }, testInfo) => {
  for (const [name, width] of [["desktop", 1440], ["mobile", 390]] as const) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["/", "/work", "/about"]) {
      await page.goto(route);
      const screenshot = await page.screenshot({ fullPage: true });
      await testInfo.attach(`${route === "/" ? "home" : route.slice(1)}-${name}`, { body: screenshot, contentType: "image/png" });
    }
  }
});

// Intentionally small, stable first-viewport baselines. Full-page documentation
// captures above remain review evidence without brittle offscreen pixel matching.
for (const theme of ["dark", "light"] as const) {
  for (const [device, width, height] of [["desktop", 1440, 1000], ["mobile", 390, 844]] as const) {
    test(`homepage visual regression ${device} ${theme}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(value => localStorage.setItem("theme", value), theme);
      await page.setViewportSize({ width, height });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const heroImage = page.locator("main img").first();
      await expect(heroImage).toBeVisible();
      await expect.poll(() => heroImage.evaluate(node => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0)).toBe(true);
      await expect(page).toHaveScreenshot(`home-${device}-${theme}.png`, {
        animations: "disabled",
        fullPage: false,
        maxDiffPixelRatio: 0.02,
      });
    });
  }
}

test("public routes have no browser errors and new pages are discoverable in the sitemap", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  const routes = ["/", "/work", "/about", "/services", "/work/hrms", "/work/knowledgecity", "/work/mortgage", "/work/cloudcard"];
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  }
  expect(errors).toEqual([]);
  expect((await request.get("/work/no-such-project")).status()).toBe(404);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const route of routes.slice(1)) expect(xml).toContain(`<loc>https://wajidali.dev${route}</loc>`);
});

test("hero and project conversion events contain only allowlisted categories", async ({ page }) => {
  test.skip(process.env.NEXT_PUBLIC_CONVERSION_EVENTS_ENABLED !== "true", "Enable the optional event bridge at build and test time.");
  await page.addInitScript(() => {
    const events: unknown[] = [];
    Object.assign(window, { atelierConversionEvents: events });
    window.addEventListener("portfolio:conversion", event => events.push((event as CustomEvent).detail));
  });
  const events = () => page.evaluate(() => (window as unknown as { atelierConversionEvents: { event: string; source: string }[] }).atelierConversionEvents);
  const observed: { event: string; source: string }[] = [];
  await page.goto("/");
  await page.locator('[data-conversion="hero_primary_cta_clicked"]').click();
  await expect(page).toHaveURL(/\/services#inquiry$/);
  const heroEvents = await events();
  expect(heroEvents).toContainEqual({ event: "hero_primary_cta_clicked", source: "hero" });
  observed.push(...heroEvents);
  await page.goto("/");
  await page.locator('#work [data-conversion="project_case_study_clicked"]').first().click();
  await expect(page).toHaveURL(/\/work\/hrms$/);
  const homeProjectEvents = await events();
  expect(homeProjectEvents).toContainEqual({ event: "project_case_study_clicked", source: "home" });
  observed.push(...homeProjectEvents);
  await page.goto("/work");
  await page.locator('main [data-conversion="project_case_study_clicked"]').first().click();
  await expect(page).toHaveURL(/\/work\/hrms$/);
  const workProjectEvents = await events();
  expect(workProjectEvents).toContainEqual({ event: "project_case_study_clicked", source: "work" });
  observed.push(...workProjectEvents);
  const allowedEvents = ["hero_primary_cta_clicked", "project_case_study_clicked", "services_page_viewed"];
  const allowedSources = ["hero", "home", "work", "services"];
  for (const event of observed) {
    expect(Object.keys(event).sort()).toEqual(["event", "source"]);
    expect(allowedEvents).toContain(event.event);
    expect(allowedSources).toContain(event.source);
  }
  expect(JSON.stringify(observed)).not.toContain("@");
});
