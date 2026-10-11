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

test("Change route from My Journey also lands on the route choices", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("nihonest:anonymous-preferences:v2", JSON.stringify({ version: 2, journeyStage: "preparing", journeyId: "student-moving-to-japan", routeId: "student-status", onboardingCompleted: true })));
  await page.goto("/my-journey", { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Change route" }).click();

  await expect(page).toHaveURL(/changeRoute=1#choose-route$/);
  await expect(page.getByRole("heading", { name: "Choose your study route" })).toBeInViewport();
  await expect(page.getByRole("heading", { name: "Choose your study route" })).toBeFocused();
});
