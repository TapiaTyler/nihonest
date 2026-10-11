import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });

const mapSelector = 'svg[aria-label="Select a prefecture on the main Japan map"]';

async function swipeUp(page: import("@playwright/test").Page, x: number, y: number) {
  const session = await page.context().newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (let step = 1; step <= 12; step++) {
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - step * 14 }] });
    await page.waitForTimeout(16);
  }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await page.waitForTimeout(600);
}

test("the prefecture map does not trap a vertical swipe at rest but pans when zoomed in", async ({ page }) => {
  await page.goto("/articles/understanding-japan-geography-government-and-language", { waitUntil: "networkidle" });
  await page.getByText("Japan prefecture map", { exact: true }).click();
  const map = page.locator(mapSelector);
  const centre = async () => {
    await map.evaluate((element) => window.scrollTo(0, element.getBoundingClientRect().top + scrollY - 300));
    await page.waitForTimeout(300);
    const box = (await map.boundingBox())!;
    return { x: Math.round(box.x + box.width / 2), y: Math.round(box.y + box.height / 2) };
  };

  const rest = await centre();
  const before = await page.evaluate(() => scrollY);
  await swipeUp(page, rest.x, rest.y);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(before + 50);

  await page.locator("select").first().selectOption({ index: 14 });
  await expect(page.getByText(/Map zoom: [2-9]/)).toBeVisible();
  const zoomed = await centre();
  const zoomedBefore = await page.evaluate(() => scrollY);
  const viewBox = await map.getAttribute("viewBox");
  await swipeUp(page, zoomed.x, zoomed.y);
  expect(await page.evaluate(() => scrollY)).toBe(zoomedBefore);
  expect(await map.getAttribute("viewBox")).not.toBe(viewBox);
});
