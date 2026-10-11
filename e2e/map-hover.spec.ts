import { expect, test, type Page } from "@playwright/test";

const article = "/articles/understanding-japan-geography-government-and-language";
const mapSelector = 'svg[aria-label="Select a prefecture on the main Japan map"]';

async function openMap(page: Page) {
  await page.goto(article, { waitUntil: "networkidle" });
  await page.getByText(/^(Japan prefecture map|日本の都道府県地図)$/).click();
  await page.waitForTimeout(300);
}

/** A screen point inside the prefecture's real outline (its bounding box centre can fall outside the shape). */
async function pointOnPrefecture(page: Page, name: string) {
  return page.evaluate((prefectureName) => {
    const svg = [...document.querySelectorAll('svg[role="group"]')].find((element) => element.querySelectorAll('g[role="button"]').length > 40)!;
    const group = [...svg.querySelectorAll('g[role="button"]')].find((element) => element.getAttribute("aria-label")?.includes(prefectureName))!;
    group.scrollIntoView({ block: "center", behavior: "instant" });
    const path = group.querySelector("path")!;
    const box = path.getBBox();
    const matrix = (svg as SVGSVGElement).getScreenCTM()!;
    for (let row = 0; row < 80; row++) for (let column = 0; column < 80; column++) {
      const point = (svg as SVGSVGElement).createSVGPoint();
      point.x = box.x + (box.width * (column + 0.5)) / 80;
      point.y = box.y + (box.height * (row + 0.5)) / 80;
      if (path.isPointInFill(point)) { const screen = point.matrixTransform(matrix); return { x: screen.x, y: screen.y }; }
    }
    throw new Error("no point found");
  }, name);
}

test("hovering a prefecture names it in English and Japanese", async ({ page }) => {
  await openMap(page);
  const label = page.locator("[data-map-hover-label]");
  await expect(label).toHaveCount(0);

  const point = await pointOnPrefecture(page, "Kyoto");
  await page.mouse.move(point.x, point.y);
  await expect(label).toBeVisible();
  await expect(label).toHaveText("Kyoto · 京都府");
  await expect(label).toHaveAttribute("aria-hidden", "true");

  await page.mouse.move(2, 2);
  await expect(label).toHaveCount(0);
});

test("the label is Japanese only when Japanese is selected", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("nihonest:content-locale:v1", "ja"));
  await openMap(page);
  const point = await pointOnPrefecture(page, "京都府");
  await page.mouse.move(point.x, point.y);
  await expect(page.locator("[data-map-hover-label]")).toHaveText("京都府");
});

test("keyboard focus shows the same label", async ({ page }) => {
  await openMap(page);
  await page.locator(mapSelector).focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("[data-map-hover-label]")).toBeVisible();
  await expect(page.locator("[data-map-hover-label]")).toContainText("·");
});

test("touch pointers never produce a hover label, mouse pointers do", async ({ page }) => {
  await openMap(page);
  const point = await pointOnPrefecture(page, "Kyoto");
  const send = (pointerType: string) => page.evaluate(({ x, y, pointerType: type }) => {
    const group = [...document.querySelectorAll('svg[aria-label="Select a prefecture on the main Japan map"] g[role="button"]')].find((element) => element.getAttribute("aria-label")?.includes("Kyoto"))!;
    group.dispatchEvent(new PointerEvent("pointerover", { pointerType: type, clientX: x, clientY: y, bubbles: true }));
  }, { ...point, pointerType });

  await send("touch");
  await expect(page.locator("[data-map-hover-label]")).toHaveCount(0);
  await send("mouse");
  await expect(page.locator("[data-map-hover-label]")).toHaveText("Kyoto · 京都府");
});
