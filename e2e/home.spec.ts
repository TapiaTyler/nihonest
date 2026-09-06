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
  const articleCard = page.getByRole("article").filter({
    hasText: "Short-term study in Japan as a Temporary Visitor",
  });
  const articleCta = articleCard.getByText("Read guide →");
  await expect(articleCta).toHaveCSS("cursor", "pointer");
  await articleCta.click();
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

test("searches the glossary and follows a term to its guide", async ({ page }) => {
  await page.goto("/glossary");

  await page.getByRole("searchbox", { name: "Search Japanese or English" }).fill("juminhyo");
  await expect(page.getByText("Showing 1 of 12 terms")).toBeVisible();
  const glossaryCard = page.getByRole("article").filter({ hasText: "Certificate of Residence" });
  const glossaryCta = glossaryCard.getByText("View term and context →");
  await expect(glossaryCta).toHaveCSS("cursor", "pointer");
  await glossaryCta.click();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("住民票");
  await expect(page.locator("p").filter({ hasText: "じゅうみんひょう · jūminhyō" })).toBeVisible();
  await page.getByRole("link", { name: "Registering your address after arrival" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Registering your address after arrival");
  await expect(page.getByRole("heading", { name: "Japanese terms in this guide" })).toBeVisible();
});

test("filters and opens a residence status", async ({ page }) => {
  await page.goto("/residence-statuses");

  await page.getByRole("button", { name: "Study" }).click();
  await expect(page.getByText("Showing 1 of 3 sample statuses")).toBeVisible();
  const statusCard = page.getByRole("article").filter({ hasText: "Student" });
  const statusCta = statusCard.getByText("View status details →");
  await expect(statusCta).toHaveCSS("cursor", "pointer");
  await statusCta.click();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Student");
  await expect(page.getByRole("heading", { name: "What to verify" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Official sources" })).toBeVisible();
});
