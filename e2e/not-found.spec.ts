import { expect, test } from "@playwright/test";

test("an unknown address shows a branded not-found page with a way forward", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "We couldn't find that page." })).toBeVisible();
  await page.getByRole("link", { name: "Search the guides" }).click();
  await expect(page).toHaveURL(/\/explore$/);
});
