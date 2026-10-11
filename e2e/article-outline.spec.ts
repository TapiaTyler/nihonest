import { expect, test } from "@playwright/test";

test("jumps from the article outline to the matching section", async ({ page }) => {
  await page.goto("/articles/choosing-a-training-or-workforce-development-route-in-japan");

  const outline = page.getByRole("navigation", { name: "On this page" });
  await outline.getByText("On this page", { exact: true }).click();
  const links = outline.getByRole("link");
  const target = links.nth(2);
  const heading = (await target.textContent())!.trim();
  await target.click();

  await expect(page).toHaveURL(new RegExp(`#.+`));
  await expect(page.getByRole("heading", { name: heading })).toBeInViewport();
});
