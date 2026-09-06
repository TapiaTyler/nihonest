import { expect, test } from "@playwright/test";

test("loads the Nihonest homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Nihonest — Find your place in Japan");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Find your place in Japan.");
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
});

test("browses a content group and opens one of its guides", async ({ page }) => {
  await page.goto("/explore");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Find the guidance that fits your situation.",
  );
  await expect(page.getByRole("link", { name: "Explore Study in Japan" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore Arrival essentials" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore Visas and residence" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Opening a bank account after moving to Japan" })).toHaveCount(0);

  await page.getByRole("link", { name: "Explore Arrival essentials" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Arrival essentials");
  await page.getByRole("link", { name: "Opening a bank account after moving to Japan" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Opening a bank account after moving to Japan",
  );
  await expect(page.getByRole("heading", { name: "Official sources" })).toBeVisible();
});

test("searches articles across groups without opening a group first", async ({ page }) => {
  await page.goto("/explore");

  await page.getByRole("searchbox", { name: "What do you need help with?" }).fill("Start-up Visa");
  await expect(page.getByRole("link", { name: "Explore Visas and residence" })).toBeVisible();
  await page.getByRole("link", { name: "Japan's Start-up Visa pathway" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Japan's Start-up Visa pathway");
  await expect(page.getByRole("heading", { name: "Official sources" })).toBeVisible();
});

test("searches glossary terms from Explore", async ({ page }) => {
  await page.goto("/explore");

  await page.getByRole("searchbox", { name: "What do you need help with?" }).fill("juminhyo");
  const glossaryCard = page.getByRole("article").filter({ hasText: "Certificate of Residence" });
  await expect(glossaryCard).toBeVisible();
  await glossaryCard.getByText("View term and context →").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("住民票");
});

test("combines filters and recovers from no results", async ({ page }) => {
  await page.goto("/explore");

  await page.getByRole("searchbox", { name: "What do you need help with?" }).fill("bank account");
  await page.getByText("More filters").click();
  await page.getByRole("combobox", { name: "Topic" }).selectOption("healthcare");
  await expect(page.getByRole("heading", { name: "No matching guidance found" })).toBeVisible();
  await page.getByRole("button", { name: "Browse all groups" }).click();
  await expect(page.getByRole("link", { name: "Explore Arrival essentials" })).toBeVisible();
});

test("opens the route-aware student journey from the homepage", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Start the student journey" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Student journey");
  await expect(page.getByText("Student status only").first()).toBeVisible();
  await expect(page.getByText("Resident registration required").first()).toBeVisible();
  await page.getByRole("link", { name: "Short-term study in Japan as a Temporary Visitor" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Short-term study in Japan as a Temporary Visitor",
  );
  await expect(page.getByText(/90 days is the maximum/)).toBeVisible();
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
