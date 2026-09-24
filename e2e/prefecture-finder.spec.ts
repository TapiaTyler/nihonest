import { expect, test } from "@playwright/test";

const articleUrl = "/articles/understanding-japan-geography-government-and-language";

test("supports keyboard search and selection without changing saved local guidance", async ({ page }) => {
  await page.goto(articleUrl);
  await page.evaluate(() => localStorage.setItem("nihonest:local-guidance-location:v1", "nagoya"));

  const finder = page.getByRole("region", { name: "Find a prefecture" });
  const search = finder.getByRole("searchbox", { name: "Search prefectures" });
  const select = finder.getByRole("combobox", { name: "Choose a prefecture" });
  await expect(search).toHaveAttribute("placeholder", "Tokyo, 東京都, or a five-digit prefecture code");
  await expect(finder.getByRole("status")).toHaveText("47 prefectures found");

  await search.focus();
  await page.keyboard.type("Tokyo");
  await expect(finder.getByRole("status")).toHaveText("1 prefecture found");
  await select.focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(select).toHaveValue("jp-13000");
  // Researched guidance appears only after a municipality or ward is chosen, and only for that area.
  await expect(finder.getByRole("heading", { name: "Researched local guidance" })).toHaveCount(0);
  await finder.getByRole("combobox", { name: "Choose a mapped municipality or ward" }).selectOption("jp-13104");
  await expect(finder.getByText(/cover only Shinjuku City, not the entire prefecture/)).toBeVisible();
  await expect(finder.getByRole("link", { name: "Registering an address in Chiyoda" })).toHaveCount(0);

  await search.fill("no-such-prefecture");
  await expect(finder.getByRole("status")).toHaveText("0 prefectures found");
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
  const finder = page.getByRole("region", { name: "Find a prefecture" });
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
  await expect(finder.getByRole("status")).toHaveText("1 prefecture found");
  await select.selectOption("jp-13000");
  await expect(finder.getByRole("combobox", { name: "Choose a mapped municipality or ward" })).toBeVisible();
  expect(await finder.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
});

test("opens a local guide with the linked prefecture and municipality selected for that page", async ({ page }) => {
  await page.goto(articleUrl);
  await page.evaluate(() => localStorage.setItem("nihonest:local-guidance-location:v1", "nagoya"));
  const finder = page.getByRole("region", { name: "Find a prefecture" });
  await finder.getByRole("combobox", { name: "Choose a prefecture" }).selectOption("jp-13000");
  await finder.getByRole("combobox", { name: "Choose a mapped municipality or ward" }).selectOption("jp-13104");
  await finder.getByRole("link", { name: "Registering an address in Shinjuku" }).click();

  await expect(page).toHaveURL(/\/articles\/registering-your-address-after-arrival\?local=jp-13104#local-guidance-heading$/);
  const panel = page.getByRole("region", { name: "Local guidance" });
  await expect(panel.getByLabel("Prefecture")).toHaveValue("tokyo");
  await expect(panel.getByLabel("Municipality")).toHaveValue("shinjuku");
  await expect(panel.getByRole("heading", { name: "Registering an address in Shinjuku" })).toBeVisible();
  await expect(panel.getByText(/saved local guidance location has not changed/)).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("nihonest:local-guidance-location:v1"))).toBe("nagoya");
});

test("opens general advice for a mapped ward without article-specific research", async ({ page }) => {
  await page.goto(articleUrl);
  const finder = page.getByRole("region", { name: "Find a prefecture" });
  await finder.getByRole("combobox", { name: "Choose a prefecture" }).selectOption("jp-01000");
  await finder.getByRole("combobox", { name: "Choose a mapped municipality or ward" }).selectOption("jp-01101");
  await finder.getByRole("link", { name: "National Health Insurance" }).first().click();

  await expect(page).toHaveURL(/\/articles\/joining-national-health-insurance\?local=jp-01101#local-guidance-heading$/);
  const panel = page.getByRole("region", { name: "Local guidance" });
  await expect(panel.getByLabel("Prefecture")).toHaveValue("jp-01000");
  await expect(panel.getByLabel("Municipality")).toHaveValue("jp-01101");
  await expect(panel.getByText(/Research for Chuo Ward, Sapporo on this article has not been done yet/)).toBeVisible();
});

test("opens general advice for a selected prefecture without claiming local research", async ({ page }) => {
  await page.goto(articleUrl);
  const finder = page.getByRole("region", { name: "Find a prefecture" });
  await finder.getByRole("combobox", { name: "Choose a prefecture" }).selectOption("jp-01000");
  await finder.getByRole("link", { name: "Address registration" }).click();

  await expect(page).toHaveURL(/\/articles\/registering-your-address-after-arrival\?local=jp-01000#local-guidance-heading$/);
  const panel = page.getByRole("region", { name: "Local guidance" });
  await expect(panel.getByLabel("Prefecture")).toHaveValue("jp-01000");
  await expect(panel.getByLabel("Municipality")).toHaveValue("");
  await expect(panel.getByText(/Research for Hokkaido on this article has not been done yet/)).toBeVisible();
});

test("opens a newly researched Tokyo ward by canonical ID without replacing the saved location", async ({ page }) => {
  await page.goto(articleUrl);
  await page.evaluate(() => localStorage.setItem("nihonest:local-guidance-location:v1", "shinjuku"));
  const finder = page.getByRole("region", { name: "Find a prefecture" });
  await finder.getByRole("combobox", { name: "Choose a prefecture" }).selectOption("jp-13000");
  await finder.getByRole("combobox", { name: "Choose a mapped municipality or ward" }).selectOption("jp-13101");
  await finder.getByRole("link", { name: "Registering an address in Chiyoda" }).click();

  await expect(page).toHaveURL(/\/articles\/registering-your-address-after-arrival\?local=jp-13101#local-guidance-heading$/);
  const panel = page.getByRole("region", { name: "Local guidance" });
  await expect(panel.getByLabel("Prefecture")).toHaveValue("tokyo");
  await expect(panel.getByLabel("Municipality")).toHaveValue("jp-13101");
  await expect(panel.getByRole("heading", { name: "Registering an address in Chiyoda" })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("nihonest:local-guidance-location:v1"))).toBe("shinjuku");
});

test("opens a C2 ward with its own address-registration guidance", async ({ page }) => {
  await page.goto(articleUrl);
  const finder = page.getByRole("region", { name: "Find a prefecture" });
  await finder.getByRole("combobox", { name: "Choose a prefecture" }).selectOption("jp-13000");
  await finder.getByRole("combobox", { name: "Choose a mapped municipality or ward" }).selectOption("jp-13107");
  await finder.getByRole("link", { name: "Registering an address in Sumida" }).click();

  await expect(page).toHaveURL(/\/articles\/registering-your-address-after-arrival\?local=jp-13107#local-guidance-heading$/);
  const panel = page.getByRole("region", { name: "Local guidance" });
  await expect(panel.getByLabel("Municipality")).toHaveValue("jp-13107");
  await expect(panel.getByRole("heading", { name: "Registering an address in Sumida" })).toBeVisible();
  await expect(panel.getByText(/main Ward Office, on weekdays from 9 a\.m\. to 4:30 p\.m\./)).toBeVisible();
});

test("opens a C3 ward with the matching address-registration guidance", async ({ page }) => {
  await page.goto(articleUrl);
  const finder = page.getByRole("region", { name: "Find a prefecture" });
  await finder.getByRole("combobox", { name: "Choose a prefecture" }).selectOption("jp-13000");
  await finder.getByRole("combobox", { name: "Choose a mapped municipality or ward" }).selectOption("jp-13108");
  await finder.getByRole("link", { name: "Registering an address in Koto" }).click();

  await expect(page).toHaveURL(/\/articles\/registering-your-address-after-arrival\?local=jp-13108#local-guidance-heading$/);
  const panel = page.getByRole("region", { name: "Local guidance" });
  await expect(panel.getByLabel("Municipality")).toHaveValue("jp-13108");
  await expect(panel.getByRole("heading", { name: "Registering an address in Koto" })).toBeVisible();
  await expect(panel.getByText(/not Toyosu or another branch/)).toBeVisible();
});

test("opens a C4 ward with its overseas counter restriction", async ({ page }) => {
  await page.goto(articleUrl);
  const finder = page.getByRole("region", { name: "Find a prefecture" });
  await finder.getByRole("combobox", { name: "Choose a prefecture" }).selectOption("jp-13000");
  await finder.getByRole("combobox", { name: "Choose a mapped municipality or ward" }).selectOption("jp-13111");
  await finder.getByRole("link", { name: "Registering an address in Ota" }).click();

  await expect(page).toHaveURL(/\/articles\/registering-your-address-after-arrival\?local=jp-13111#local-guidance-heading$/);
  const panel = page.getByRole("region", { name: "Local guidance" });
  await expect(panel.getByLabel("Municipality")).toHaveValue("jp-13111");
  await expect(panel.getByRole("heading", { name: "Registering an address in Ota" })).toBeVisible();
  await expect(panel.getByText(/a person whose passport says a residence card will be issued later must use City Hall/)).toBeVisible();
});

test("opens a C5 ward with its own overseas counter hours", async ({ page }) => {
  await page.goto(articleUrl);
  const finder = page.getByRole("region", { name: "Find a prefecture" });
  await finder.getByRole("combobox", { name: "Choose a prefecture" }).selectOption("jp-13000");
  await finder.getByRole("combobox", { name: "Choose a mapped municipality or ward" }).selectOption("jp-13116");
  await finder.getByRole("link", { name: "Registering an address in Toshima" }).click();

  await expect(page).toHaveURL(/\/articles\/registering-your-address-after-arrival\?local=jp-13116#local-guidance-heading$/);
  const panel = page.getByRole("region", { name: "Local guidance" });
  await expect(panel.getByLabel("Municipality")).toHaveValue("jp-13116");
  await expect(panel.getByRole("heading", { name: "Registering an address in Toshima" })).toBeVisible();
  await expect(panel.getByText(/weekdays from 8:30 a\.m\. to 4 p\.m\./)).toBeVisible();
});

test("opens a C6 ward with its overseas main-counter route", async ({ page }) => {
  await page.goto(articleUrl);
  const finder = page.getByRole("region", { name: "Find a prefecture" });
  await finder.getByRole("combobox", { name: "Choose a prefecture" }).selectOption("jp-13000");
  await finder.getByRole("combobox", { name: "Choose a mapped municipality or ward" }).selectOption("jp-13118");
  await finder.getByRole("link", { name: "Registering an address in Arakawa" }).click();

  await expect(page).toHaveURL(/\/articles\/registering-your-address-after-arrival\?local=jp-13118#local-guidance-heading$/);
  const panel = page.getByRole("region", { name: "Local guidance" });
  await expect(panel.getByLabel("Municipality")).toHaveValue("jp-13118");
  await expect(panel.getByRole("heading", { name: "Registering an address in Arakawa" })).toBeVisible();
  await expect(panel.getByText(/must use the Ward Office Resident Records Section rather than a branch/)).toBeVisible();
});

test("opens the final Tokyo ward with its own address-registration guidance", async ({ page }) => {
  await page.goto(articleUrl);
  const finder = page.getByRole("region", { name: "Find a prefecture" });
  await finder.getByRole("combobox", { name: "Choose a prefecture" }).selectOption("jp-13000");
  await finder.getByRole("combobox", { name: "Choose a mapped municipality or ward" }).selectOption("jp-13123");
  await finder.getByRole("link", { name: "Registering an address in Edogawa" }).click();

  await expect(page).toHaveURL(/\/articles\/registering-your-address-after-arrival\?local=jp-13123#local-guidance-heading$/);
  const panel = page.getByRole("region", { name: "Local guidance" });
  await expect(panel.getByLabel("Municipality")).toHaveValue("jp-13123");
  await expect(panel.getByRole("heading", { name: "Registering an address in Edogawa" })).toBeVisible();
  await expect(panel.getByText(/if an automated gate left no entry stamp/)).toBeVisible();
});
