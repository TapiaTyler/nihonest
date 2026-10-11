import { expect, test } from "@playwright/test";

const article = "/articles/choosing-a-training-or-workforce-development-route-in-japan";

test.describe("outline row (medium screens)", () => {
  test.use({ viewport: { width: 1000, height: 800 } });

  test("jumps from the collapsed row to the matching section", async ({ page }) => {
    await page.goto(article);
    const outline = page.getByRole("navigation", { name: "On this page" });
    await outline.getByText("On this page", { exact: true }).click();
    const target = outline.getByRole("link").nth(2);
    const heading = (await target.textContent())!.trim();
    await target.click();

    await expect(page).toHaveURL(/#.+/);
    await expect(page.getByRole("heading", { name: heading })).toBeInViewport();
  });
});

test.describe("outline rail (wide screens)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("stays beside the article, marks the current section and jumps on click", async ({ page }) => {
    await page.goto(article);
    const rail = page.getByRole("navigation", { name: "On this page" });
    await expect(rail).toBeVisible();
    const target = rail.getByRole("link").nth(3);
    const heading = (await target.textContent())!.trim();
    await target.click();

    await expect(page.getByRole("heading", { name: heading })).toBeInViewport();
    await expect(rail).toBeInViewport();
    await expect(rail.getByRole("link", { name: heading })).toHaveAttribute("aria-current", "location");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
});

test.describe("outline button (phones)", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });

  test("offers a floating button after the row scrolls away and opens the same list as a sheet", async ({ page }) => {
    await page.goto(article);
    const button = page.getByRole("button", { name: "On this page" });
    await expect(button).toHaveCount(0);

    await page.evaluate(() => window.scrollTo(0, 1600));
    await expect(button).toBeVisible();
    await button.click();
    const sheet = page.getByRole("dialog", { name: "On this page" });
    await expect(sheet).toBeVisible();
    const target = sheet.getByRole("link").nth(4);
    const heading = (await target.textContent())!.trim();
    await target.click();

    await expect(sheet).toBeHidden();
    await expect(page.getByRole("heading", { name: heading })).toBeInViewport();
  });
});
