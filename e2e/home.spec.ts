import { expect, test } from "@playwright/test";

test("loads the Nihonest homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Nihonest — Find your place in Japan");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Find your place in Japan.");
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
});

test("distinguishes and opens the short-term student route", async ({ page }) => {
  await page.goto("/explore");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Practical guidance for moving to Japan.",
  );
  await expect(page.getByText("Student status only").first()).toBeVisible();
  await expect(page.getByText("Resident registration required").first()).toBeVisible();
  await page.getByRole("link", { name: "Short-term study in Japan as a Temporary Visitor" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Short-term study in Japan as a Temporary Visitor",
  );
  await expect(page.getByText(/90 days is the maximum/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Official sources" })).toBeVisible();
});

test("groups and opens visa guidance", async ({ page }) => {
  await page.goto("/explore");

  await expect(page.getByRole("heading", { name: "Visa and residence guidance" })).toBeVisible();
  await page.getByRole("link", { name: "Japan's Start-up Visa pathway" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Japan's Start-up Visa pathway");
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
