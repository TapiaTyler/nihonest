import { expect, test } from "@playwright/test";

const articleUrl = "/articles/understanding-japan-geography-government-and-language";

test("supports keyboard search and selection without changing saved local guidance", async ({ page }) => {
  await page.goto(articleUrl);
  await page.evaluate(() => localStorage.setItem("nihonest:local-guidance-location:v1", "nagoya"));

  const finder = page.getByRole("region", { name: "Guidance by location" });
  const search = finder.getByRole("searchbox", { name: "Search prefectures" });
  const select = finder.getByRole("combobox", { name: "Choose a prefecture" });
  await expect(search).toHaveAttribute("placeholder", "Tokyo, 東京都, or a five-digit prefecture code");
  // The finder no longer announces a match count; the filtered prefecture options show the same behavior.
  const prefectureOptions = select.locator("option:not([value=''])");
  await expect(prefectureOptions).toHaveCount(47);

  await search.focus();
  await page.keyboard.type("Tokyo");
  await expect(prefectureOptions).toHaveCount(1);
  await select.focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(select).toHaveValue("jp-13000");
  // Researched guidance appears only after a municipality or ward is chosen, and only for that area.
  await expect(finder.getByRole("heading", { name: "Researched local guidance" })).toHaveCount(0);
  await finder.getByRole("combobox", { name: "Choose a municipality or ward" }).selectOption("jp-13104");
  await expect(finder.getByText(/cover only Shinjuku City, not the entire prefecture/)).toBeVisible();
  await expect(finder.getByRole("link", { name: "Registering an address in Chiyoda" })).toHaveCount(0);

  await search.fill("no-such-prefecture");
  await expect(finder.getByRole("status")).toHaveText("No prefectures match this search. Clear the search to see all 47.");
  await expect(finder.getByText(/outside the current search results/)).toBeVisible();
  await finder.getByRole("button", { name: "Clear search" }).click();
  await expect(select).toHaveValue("jp-13000");
  await finder.getByRole("button", { name: "Clear selection" }).click();
  await expect(select).toHaveValue("");
  expect(await page.evaluate(() => localStorage.getItem("nihonest:local-guidance-location:v1"))).toBe("nagoya");
});

test("fits a narrow mobile viewport with usable controls", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(articleUrl);
  const finder = page.getByRole("region", { name: "Guidance by location" });
  await finder.scrollIntoViewIfNeeded();
  const search = finder.getByRole("searchbox", { name: "Search prefectures" });
  const select = finder.getByRole("combobox", { name: "Choose a prefecture" });
  await expect(search).toBeVisible();
  await expect(select).toBeVisible();
  for (const control of [search, select]) {
    const box = await control.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(375);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  await search.fill("東京都");
  await expect(select.locator("option:not([value=''])")).toHaveCount(1);
  await select.selectOption("jp-13000");
  await expect(finder.getByRole("combobox", { name: "Choose a municipality or ward" })).toBeVisible();
  expect(await finder.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
});

test("opens a local guide with the linked prefecture and municipality selected for that page", async ({ page }) => {
  await page.goto(articleUrl);
  await page.evaluate(() => localStorage.setItem("nihonest:local-guidance-location:v1", "nagoya"));
  const finder = page.getByRole("region", { name: "Guidance by location" });
  await finder.getByRole("combobox", { name: "Choose a prefecture" }).selectOption("jp-13000");
  await finder.getByRole("combobox", { name: "Choose a municipality or ward" }).selectOption("jp-13104");
  await finder.getByRole("link", { name: "Registering an address in Shinjuku" }).click();

  await expect(page).toHaveURL(/\/articles\/registering-your-address-after-arrival\?local=jp-13104#local-guidance-heading$/);
  const panel = page.getByRole("region", { name: "Local guidance" });
  await expect(panel.getByLabel("Prefecture")).toHaveValue("tokyo");
  await expect(panel.getByLabel("Municipality")).toHaveValue("shinjuku");
  await expect(panel.getByRole("heading", { name: "Registering an address in Shinjuku" })).toBeVisible();
  await expect(panel.getByText(/saved local guidance location has not changed/)).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("nihonest:local-guidance-location:v1"))).toBe("nagoya");
});

test("does not offer or link an unresearched ward as if it had local guidance", async ({ page }) => {
  // The finder lists only researched municipalities, and every listed one now covers all seven guides.
  // Municipal general-advice rendering stays covered by local-guidance-panel.test.tsx fixtures.
  await page.goto(articleUrl);
  const finder = page.getByRole("region", { name: "Guidance by location" });
  await finder.getByRole("combobox", { name: "Choose a prefecture" }).selectOption("jp-01000");
  await expect(finder.getByRole("combobox", { name: "Choose a municipality or ward" }).locator("option[value='jp-01101']")).toHaveCount(0);

  await page.goto("/articles/joining-national-health-insurance?local=jp-01101#local-guidance-heading");
  const panel = page.getByRole("region", { name: "Local guidance" });
  await expect(panel.getByLabel("Prefecture")).toHaveValue("");
  await expect(panel.getByText(/linked from the prefecture finder/)).toHaveCount(0);
});

test("opens general advice for a selected prefecture without claiming local research", async ({ page }) => {
  await page.goto(articleUrl);
  const finder = page.getByRole("region", { name: "Guidance by location" });
  await finder.getByRole("combobox", { name: "Choose a prefecture" }).selectOption("jp-01000");
  await finder.getByRole("link", { name: "Address registration" }).click();

  await expect(page).toHaveURL(/\/articles\/registering-your-address-after-arrival\?local=jp-01000#local-guidance-heading$/);
  const panel = page.getByRole("region", { name: "Local guidance" });
  await expect(panel.getByLabel("Prefecture")).toHaveValue("jp-01000");
  await expect(panel.getByLabel("Municipality")).toHaveValue("");
  await expect(panel.getByText(/Research for Hokkaido on this article has not been done yet/)).toBeVisible();
});

test("navigates between researched NHI wards", async ({ page }) => {
  await page.goto(articleUrl);
  const finder = page.getByRole("region", { name: "Guidance by location" });
  await finder.getByRole("combobox", { name: "Choose a prefecture" }).selectOption("jp-13000");
  await finder.getByRole("combobox", { name: "Choose a municipality or ward" }).selectOption("jp-13101");
  await finder.getByRole("link", { name: "National Health Insurance in Chiyoda" }).click();

  const panel = page.getByRole("region", { name: "Local guidance" });
  await expect(panel.getByLabel("Municipality")).toHaveValue("jp-13101");
  await expect(panel.getByRole("heading", { name: "National Health Insurance in Chiyoda" })).toBeVisible();

  await panel.getByLabel("Municipality").selectOption("jp-13123");
  await expect(panel.getByRole("heading", { name: "National Health Insurance in Edogawa" })).toBeVisible();
});

test("opens a newly researched Tokyo ward by canonical ID without replacing the saved location", async ({ page }) => {
  await page.goto(articleUrl);
  await page.evaluate(() => localStorage.setItem("nihonest:local-guidance-location:v1", "shinjuku"));
  const finder = page.getByRole("region", { name: "Guidance by location" });
  await finder.getByRole("combobox", { name: "Choose a prefecture" }).selectOption("jp-13000");
  await finder.getByRole("combobox", { name: "Choose a municipality or ward" }).selectOption("jp-13101");
  await finder.getByRole("link", { name: "Registering an address in Chiyoda" }).click();

  await expect(page).toHaveURL(/\/articles\/registering-your-address-after-arrival\?local=jp-13101#local-guidance-heading$/);
  const panel = page.getByRole("region", { name: "Local guidance" });
  await expect(panel.getByLabel("Prefecture")).toHaveValue("tokyo");
  await expect(panel.getByLabel("Municipality")).toHaveValue("jp-13101");
  await expect(panel.getByRole("heading", { name: "Registering an address in Chiyoda" })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("nihonest:local-guidance-location:v1"))).toBe("shinjuku");
});

