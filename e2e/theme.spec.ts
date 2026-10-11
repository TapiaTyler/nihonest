import { expect, test } from "@playwright/test";

/** Average of the page background's RGB channels (0 to 255); the browser reports Tailwind's colours as lab(), so it is converted through a canvas. */
const brightness = (page: import("@playwright/test").Page) => page.evaluate(() => {
  const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
  context.fillStyle = getComputedStyle(document.body).backgroundColor;
  context.fillRect(0, 0, 1, 1);
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
  return (r + g + b) / 3;
});
const isDark = (value: number) => value < 60;

async function chooseTheme(page: import("@playwright/test").Page, label: string) {
  await page.getByRole("button", { name: /^Theme:/ }).click();
  await page.getByRole("radio", { name: label }).click();
}

test.describe("light device", () => {
  test.use({ colorScheme: "light", viewport: { width: 1280, height: 800 } });

  test("follows the device by default and a manual choice overrides it and survives a reload", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
    expect(isDark(await brightness(page))).toBe(false);

    await chooseTheme(page, "Dark");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(isDark(await brightness(page))).toBe(true);
    await expect(page.getByRole("button", { name: "Theme: Dark" })).toBeVisible();

    // The saved choice is applied before the first paint, so it is already on <html> when parsing finishes.
    await page.reload({ waitUntil: "commit" });
    await page.waitForLoadState("domcontentloaded");
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe("dark");

    await page.waitForLoadState("networkidle");
    await chooseTheme(page, "System");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
    expect(isDark(await brightness(page))).toBe(false);
  });

  test("the browser bar colour follows a manual choice and goes back with System", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const colours = () => page.evaluate(() => [...document.querySelectorAll('meta[name="theme-color"]')].map((meta) => (meta as HTMLMetaElement).content));
    const original = await colours();
    expect(original).toEqual(expect.arrayContaining(["#ffffff", "#020618"]));

    await chooseTheme(page, "Dark");
    expect(await colours()).toEqual(["#020618", "#020618"]);
    await chooseTheme(page, "System");
    expect(await colours()).toEqual(original);
  });

  test("hydrates without mismatches when a theme is saved", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("nihonest:theme:v1", "dark"));
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message.slice(0, 160)));
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });
});

test.describe("dark device", () => {
  test.use({ colorScheme: "dark", viewport: { width: 1280, height: 800 } });

  test("is dark with no setting saved, and Light overrides the device", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    expect(isDark(await brightness(page))).toBe(true);
    await expect(page.getByRole("button", { name: "Theme: System" })).toBeVisible();

    await chooseTheme(page, "Light");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(isDark(await brightness(page))).toBe(false);
  });
});

test.describe("phones", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });

  test("the navigation drawer has the same three choices", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const group = page.getByRole("radiogroup", { name: "Theme" });
    await expect(group).toBeVisible();
    await group.getByRole("radio", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(group.getByRole("radio", { name: "Dark" })).toBeChecked();
  });
});
