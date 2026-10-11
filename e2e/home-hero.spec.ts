import { expect, test } from "@playwright/test";

const card = (page: import("@playwright/test").Page) => page.locator("aside[aria-labelledby=foundation-status]");
const note = (page: import("@playwright/test").Page) => page.getByText("Every public guide is open without answering any questions.");

for (const [name, width] of [["desktop", 1280], ["the smallest two-column width", 1024]] as const) {
  test.describe(name, () => {
    test.use({ viewport: { width, height: 900 } });
    test(`shows the card beside the heading and no one-line note at ${width}px`, async ({ page }) => {
      await page.goto("/", { waitUntil: "networkidle" });
      await expect(card(page)).toBeVisible();
      await expect(card(page)).toContainText("Personalization is optional.");
      await expect(note(page)).toBeHidden();
    });
  });
}

for (const [name, width] of [["just below the two-column layout", 1023], ["tablet", 800], ["narrow tablet", 768]] as const) {
  test.describe(name, () => {
    test.use({ viewport: { width, height: 900 } });
    test(`uses the one-line note instead of a stacked card at ${width}px`, async ({ page }) => {
      await page.goto("/", { waitUntil: "networkidle" });
      await expect(card(page)).toBeHidden();
      await expect(note(page)).toBeVisible();
    });
  });
}

test.describe("phone", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });
  test("replaces the card with one quiet line so the stage section starts on the first screen", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(card(page)).toBeHidden();
    await expect(note(page)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Where are you right now?" })).toBeVisible();
  });
});
