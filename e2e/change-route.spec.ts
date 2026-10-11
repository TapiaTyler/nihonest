import { expect, test } from "@playwright/test";

test("Change route scrolls to the route choices and focuses their heading", async ({ page }) => {
  await page.goto("/explore/journeys/student-moving-to-japan?route=student-status", { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Change route" }).click();

  const section = page.locator("[data-route-choice]");
  await expect(page).toHaveURL(/#choose-route$/);
  await expect(page.getByRole("heading", { name: "Choose your study route" })).toBeInViewport();
  await expect(page.getByRole("heading", { name: "Choose your study route" })).toBeFocused();
  await expect(section.getByRole("link", { name: /Long-term study under Student status/ })).toBeVisible();
});

test("Change route scrolls smoothly instead of jumping", async ({ page }) => {
  await page.goto("/explore/journeys/student-moving-to-japan?route=student-status", { waitUntil: "networkidle" });
  const start = await page.evaluate(() => scrollY);
  await page.getByRole("link", { name: "Change route" }).click();
  const samples: number[] = [];
  for (let i = 0; i < 40; i++) { samples.push(await page.evaluate(() => scrollY)); await page.waitForTimeout(40); }
  const end = samples.at(-1)!;
  expect(end).toBeGreaterThan(start + 200);
  // A jump goes from the start to the end in one step; a smooth scroll passes through several positions on the way.
  const between = new Set(samples.filter((y) => y > start + 20 && y < end - 20));
  expect(between.size).toBeGreaterThanOrEqual(3);
});

test("Change route from My Journey also lands on the route choices", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("nihonest:anonymous-preferences:v2", JSON.stringify({ version: 2, journeyStage: "preparing", journeyId: "student-moving-to-japan", routeId: "student-status", onboardingCompleted: true })));
  await page.goto("/my-journey", { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Change route" }).click();

  await expect(page).toHaveURL(/changeRoute=1#choose-route$/);
  await expect(page.getByRole("heading", { name: "Choose your study route" })).toBeInViewport();
  await expect(page.getByRole("heading", { name: "Choose your study route" })).toBeFocused();
});
