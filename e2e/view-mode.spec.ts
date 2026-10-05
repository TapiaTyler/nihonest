import { expect, test } from "@playwright/test";

test("remembers the list view separately for Residence Statuses and Explore", async ({ page }) => {
  await page.goto("/residence-statuses");
  const statusToggle = page.getByRole("group", { name: "Display as" });
  await expect(statusToggle.getByRole("button", { name: "Cards" })).toHaveAttribute("aria-pressed", "true");
  await statusToggle.getByRole("button", { name: "List" }).click();
  await expect(page.getByRole("link", { name: "Artist" }).locator("xpath=ancestor::li")).toHaveCount(1);

  // The prebuilt page starts as cards; the remembered list applies after hydration on every visit.
  await page.reload();
  await expect(page.getByRole("group", { name: "Display as" }).getByRole("button", { name: "List" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("link", { name: "Artist" }).locator("xpath=ancestor::li")).toHaveCount(1);

  // Explore keeps its own choice.
  await page.goto("/explore");
  const exploreToggle = page.getByRole("group", { name: "Display as" });
  await expect(exploreToggle.getByRole("button", { name: "Cards" })).toHaveAttribute("aria-pressed", "true");
  await exploreToggle.getByRole("button", { name: "List" }).click();
  await expect(page.getByRole("link", { name: "Explore Arrival essentials" }).locator("xpath=ancestor::li")).toHaveCount(1);

  await page.getByRole("searchbox", { name: "What do you need help with?" }).fill("residence card");
  await expect(page).toHaveURL(/q=residence\+card/);
  const guides = page.locator("#result-guides");
  await expect(guides.getByRole("link", { name: "Documents you receive when entering Japan" }).locator("xpath=ancestor::li")).toHaveCount(1);
});
