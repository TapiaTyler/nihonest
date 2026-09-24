import { expect, test } from "@playwright/test";

test("reveals long official-source lists in batches of four", async ({ page }) => {
  await page.goto("/articles/documents-received-when-entering-japan");
  const sources = page.getByRole("region", { name: "Official sources" });
  await expect(sources.getByRole("listitem")).toHaveCount(4);
  await expect(sources.getByRole("button", { name: "Show 4 more" })).toBeVisible();
  await sources.getByRole("button", { name: "Show 4 more" }).click();
  await expect(sources.getByRole("listitem")).toHaveCount(8);
  await sources.getByRole("button", { name: "Show 2 more" }).click();
  await expect(sources.getByRole("listitem")).toHaveCount(10);
  await expect(sources.getByRole("button", { name: /Show .* more/ })).toHaveCount(0);
});
