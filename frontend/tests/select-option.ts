import type { Locator } from "@playwright/test";
/** Select a short enum through the accessible popup, preserving the existing value assertion. */
export async function chooseSelect(trigger: Locator, value: string) {
  await trigger.click();
  await trigger.page().locator('[role="option"]').and(trigger.page().locator(`[data-value=${JSON.stringify(value)}]`)).click();
}
