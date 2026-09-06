import { expect, test } from "@playwright/test";

test("loads the Nihonest homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Nihonest — Find your place in Japan");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Find your place in Japan.");
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
});

test("browses from Explore to a student journey article", async ({ page }) => {
  await page.goto("/explore");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Your student journey to Japan.",
  );
  await page.getByRole("link", { name: "Planning your studies in Japan" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Planning your studies in Japan");
  await expect(page.getByRole("heading", { name: "Official sources" })).toBeVisible();
});

test("filters and opens a residence status", async ({ page }) => {
  await page.goto("/residence-statuses");

  await page.getByRole("button", { name: "Study" }).click();
  await expect(page.getByText("Showing 1 of 3 sample statuses")).toBeVisible();
  await page.getByRole("link", { name: "Student" }).click();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Student");
  await expect(page.getByRole("heading", { name: "What to verify" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Official sources" })).toBeVisible();
});
