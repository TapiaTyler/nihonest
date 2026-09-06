import { expect, test } from "@playwright/test";

test("loads the Nihonest homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Nihonest — Find your place in Japan");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Find your place in Japan.");
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
});

test("browses from Explore to a draft article", async ({ page }) => {
  await page.goto("/explore");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "A foundation for practical guidance.",
  );
  await page.getByRole("link", { name: "Finding official information" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Finding official information");
  await expect(page.getByRole("heading", { name: "Official sources" })).toBeVisible();
});
