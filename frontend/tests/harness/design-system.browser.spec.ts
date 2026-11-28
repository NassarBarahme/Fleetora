import { expect, test } from "@playwright/test";
import path from "node:path";
import { contrastRatio } from "../ui-assertions";

for (const locale of ["en", "ar"] as const) for (const width of [1440, 390]) {
  test(`OD-22 shell palette, responsive RTL and screenshot evidence ${locale} ${width}`, async ({ page, context }) => {
    const user = { id: "d1-reader", name: "Design Reader", email: null, role: "COMPANY_ADMIN", orgId: "d1-company", company: { id: "d1-company", name: "Fixture company", currency: "ILS" } };
    await page.route("**/api/auth/session", route => route.fulfill({ json: { user } }));
    await context.addCookies([{ name: "fleetora_locale", value: locale, url: "http://localhost:3100" }]);
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/app/test-child");
    await expect(page.getByRole("heading", { name: "Nested protected content" })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    if (process.env.FLEETORA_SCREENSHOT_DIR) await page.screenshot({ path: path.join(process.env.FLEETORA_SCREENSHOT_DIR, `shell-${locale}-${width}.png`), fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (process.env.FLEETORA_BEFORE === "1") return;
    await expect(page.locator("header")).toHaveCSS("background-color", "rgb(11, 31, 51)");
    expect(await contrastRatio(page.locator("header h1"))).toBeGreaterThanOrEqual(4.5);
  });
}

test("OD-22 amber action uses navy text with AA contrast", async ({ page }) => {
  if (process.env.FLEETORA_BEFORE === "1") return;
  await page.goto("/test-ui");
  const action = page.getByRole("button", { name: "Save probe" });
  await expect(action).toHaveCSS("background-color", "rgb(245, 165, 36)");
  await expect(action).toHaveCSS("color", "rgb(11, 31, 51)");
  expect(await contrastRatio(action)).toBeGreaterThanOrEqual(4.5);
});

for (const locale of ["en", "ar"] as const) test(`OD-22 Select keyboard, tabs, destructive focus/escape and semantic AA contrast ${locale}`, async ({ page, context }) => {
  await context.addCookies([{ name: "fleetora_locale", value: locale, url: "http://localhost:3100" }]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/test-design");
  for (const badge of await page.locator("[data-tone]").all()) {
    const colors = await badge.evaluate(node => ({ status: node.getAttribute("data-status"), foreground: getComputedStyle(node).color, background: getComputedStyle(node).backgroundColor }));
    expect(await contrastRatio(badge), JSON.stringify(colors)).toBeGreaterThanOrEqual(4.5);
  }
  const select = page.getByRole("combobox", { name: "State", exact: true });
  await select.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("p");
  await expect(page.getByRole("option", { name: "Pending", exact: true })).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("Enter");
  await expect(select).toContainText("Pending");
  await page.getByRole("tab", { name: "First panel" }).focus();
  await page.keyboard.press(locale === "ar" ? "ArrowLeft" : "ArrowRight");
  await expect(page.getByRole("tab", { name: "Second panel" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("tabpanel", { name: "Second panel" })).toContainText("Second content");
  await expect(page.getByRole("tabpanel", { name: "First panel" })).not.toBeVisible();
  const trigger = page.getByRole("button", { name: "Delete record", exact: true });
  await trigger.click();
  await expect(page.getByRole("button", { name: "Keep record" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole("dialog").getByRole("combobox", { name: "Decision" }).click();
  await page.getByRole("option", { name: "Delete", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("combobox", { name: "Decision" })).toHaveText("Delete");
  await page.getByRole("dialog").getByRole("button", { name: "Delete record", exact: true }).click();
  await expect(page.getByText("Record deleted")).toBeVisible();
  if (process.env.FLEETORA_SCREENSHOT_DIR) await page.screenshot({ path: path.join(process.env.FLEETORA_SCREENSHOT_DIR, `primitives-${locale}-390.png`), fullPage: true });
});

test("OD-21 inputs display Latin dd/MM/yyyy and localized periods, validate and submit ISO", async ({ page, context }) => {
  for (const locale of ["en", "ar"]) {
    await context.addCookies([{ name: "fleetora_locale", value: locale, url: "http://localhost:3100" }]);
    await page.goto("/test-design");
    const date = page.getByLabel("Calendar date", { exact: true }), time = page.getByLabel("Appointment", { exact: true });
    await expect(date).toHaveValue("28/11/2026");
    await time.fill(`28/11/2026 1:05 ${locale === "ar" ? "م" : "PM"}`);
    await date.fill("31/02/2026");
    await date.press("Enter");
    await expect(page.getByLabel("Submitted values")).toHaveText("");
    await date.fill(locale === "ar" ? "٢٨/١١/٢٠٢٦" : "28/11/2026");
    await expect(date).toHaveValue("28/11/2026");
    await page.getByRole("button", { name: "Save values" }).click();
    await expect(page.getByLabel("Submitted values")).toHaveText("ACTIVE|2026-11-28|2026-11-28T13:05");
    await page.getByRole("button", { name: "Reset values" }).click();
    await expect(date).toHaveValue("28/11/2026");
    await expect(time).toHaveValue("");
  }
});
