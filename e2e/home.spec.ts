import { expect, test } from "@playwright/test";

test("loads the Nihonest homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Nihonest — Find your place in Japan");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Find your place in Japan.");
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
});
