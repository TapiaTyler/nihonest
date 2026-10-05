import { expect, test } from "@playwright/test";

// Prebuilt pages show working controls before their JavaScript loads. A choice made in that window must be kept
// once the page hydrates, not silently ignored. Each test acts as soon as the HTML arrives.

test("keeps a finder prefecture chosen while the page loads", async ({ page }) => {
  await page.goto("/articles/understanding-japan-geography-government-and-language", { waitUntil: "commit" });
  const finder = page.getByRole("region", { name: "Guidance by location" });
  await finder.getByRole("combobox", { name: "Choose a prefecture" }).selectOption("jp-13000");
  await expect(finder.getByRole("combobox", { name: "Choose a municipality or ward" })).toBeVisible();
});

test("keeps a local guidance prefecture chosen while the page loads", async ({ page }) => {
  await page.goto("/articles/joining-national-health-insurance", { waitUntil: "commit" });
  const panel = page.getByRole("region", { name: "Local guidance" });
  await panel.getByLabel("Prefecture").selectOption("tokyo");
  await expect(panel.getByLabel("Municipality")).toBeEnabled();
  expect(await page.evaluate(() => localStorage.getItem("nihonest:local-guidance-location:v1"))).toBe("tokyo");
});

test("keeps Explore search text and a filter entered while the page loads", async ({ page }) => {
  await page.goto("/explore", { waitUntil: "commit" });
  await page.getByRole("searchbox", { name: "What do you need help with?" }).fill("bank account");
  await page.getByText("More filters").click();
  await page.getByRole("combobox", { name: "Topic" }).selectOption("healthcare");
  await expect(page.getByRole("heading", { name: "No matching guidance found" })).toBeVisible();
  await expect(page).toHaveURL(/q=bank\+account/);
});
