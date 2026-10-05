import { expect, test } from "@playwright/test";

/*
 * Detail pages are prebuilt without query context (H2); client boundaries apply `journey`, `route`, `local`,
 * and `returnTo` after hydration. These checks cover direct visits, refresh, client navigation, Back, shared
 * links, invalid values, and Japanese presentation. Run them against a production server
 * (PLAYWRIGHT_BASE_URL=http://127.0.0.1:3199 after `npm run build && npx next start -p 3199`).
 */

const journeyArticle = "/articles/legal-accounting-services-status?journey=professional-worker-moving-to-japan&route=legal-accounting-services";
const linkedNote = "Showing the municipality linked from the prefecture finder for this page only.";

test("keeps journey context through direct visits, refresh, client navigation, and Back", async ({ page }) => {
  await page.goto(journeyArticle);
  const context = page.getByRole("region", { name: "Professional worker journey" });
  await expect(context).toBeVisible();
  await expect(page.getByRole("link", { name: "← Back to Professional worker journey" })).toHaveAttribute("href", "/explore/journeys/professional-worker-moving-to-japan?route=legal-accounting-services");

  await page.reload();
  await expect(context).toBeVisible();

  const nextGuide = context.getByRole("link", { name: /Preparing for long-term entry to Japan/ });
  await expect(nextGuide).toHaveAttribute("href", /journey=professional-worker-moving-to-japan&route=legal-accounting-services/);
  await nextGuide.click();
  await expect(page).toHaveURL(/\/articles\/preparing-for-long-term-entry-to-japan\?journey=professional-worker-moving-to-japan&route=legal-accounting-services/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/long-term entry/i);
  await expect(page.getByRole("region", { name: "Professional worker journey" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Professional worker journey" }).getByRole("link", { name: /Legal\/Accounting Services/ })).toHaveAttribute("href", /route=legal-accounting-services/);

  await page.goBack();
  await expect(page).toHaveURL(journeyArticle);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Legal\/Accounting Services/);
  await expect(page.getByRole("region", { name: "Professional worker journey" })).toBeVisible();

  // The related-journey card keeps the contextual route.
  await expect(page.getByRole("link", { name: /Guided journey\s*Professional worker journey/ })).toHaveAttribute("href", "/explore/journeys/professional-worker-moving-to-japan?route=legal-accounting-services");
});

test("ignores unknown or unrelated journey context and keeps the default page", async ({ page }) => {
  for (const url of [
    "/articles/legal-accounting-services-status?journey=not-a-journey",
    "/articles/legal-accounting-services-status?journey=professional-worker-moving-to-japan&route=not-a-route",
    "/articles/legal-accounting-services-status?journey=student-moving-to-japan",
    "/articles/legal-accounting-services-status?journey=professional-worker-moving-to-japan&journey=student-moving-to-japan",
  ]) {
    await page.goto(url);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Legal\/Accounting Services/);
    await expect(page.getByRole("region", { name: /journey/i })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "← Back to Explore" })).toBeVisible();
  }
});

test("validates article and status return destinations", async ({ page }) => {
  await page.goto("/articles/registering-your-address-after-arrival?returnTo=/roadmap");
  await expect(page.getByRole("link", { name: "← Back to Roadmap" })).toHaveAttribute("href", "/roadmap");
  await page.goto("/articles/registering-your-address-after-arrival?returnTo=https://example.com");
  await expect(page.getByRole("link", { name: "← Back to Explore" })).toHaveAttribute("href", "/explore");

  await page.goto("/residence-statuses/student?returnTo=/saved");
  await expect(page.getByRole("link", { name: "← Back to Saved" })).toHaveAttribute("href", "/saved");
  await page.goto("/residence-statuses/student?returnTo=/residence-statuses?category=study");
  await expect(page.getByRole("link", { name: "← Back to residence statuses" })).toHaveAttribute("href", "/residence-statuses?category=study");
  for (const unsafe of ["//example.com", "https://example.com", "/residence-statuses-evil"]) {
    await page.goto(`/residence-statuses/student?returnTo=${encodeURIComponent(unsafe)}`);
    await expect(page.getByRole("link", { name: "← Back to residence statuses" })).toHaveAttribute("href", "/residence-statuses");
  }
});

test("applies municipality deep links, including legacy IDs, without changing saved guidance", async ({ page }) => {
  // The canonical code and the legacy ID select the same location (whose own ID is the legacy "shinjuku").
  const selected: string[] = [];
  for (const local of ["jp-13104", "shinjuku"]) {
    await page.goto(`/articles/registering-your-address-after-arrival?local=${local}#local-guidance-heading`);
    await expect(page.getByText(linkedNote)).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Municipality" }).locator("option:checked")).toHaveText(/Shinjuku/);
    selected.push(await page.getByRole("combobox", { name: "Municipality" }).inputValue());
  }
  expect(selected[0]).toBe(selected[1]);
  await page.reload();
  await expect(page.getByText(linkedNote)).toBeVisible();

  await page.goto("/articles/registering-your-address-after-arrival?local=not-a-place");
  await expect(page.getByRole("heading", { name: "Local guidance" })).toBeVisible();
  await expect(page.getByText(linkedNote)).toHaveCount(0);

  // A deep link does not replace the saved location.
  await page.goto("/articles/registering-your-address-after-arrival");
  await expect(page.getByText(linkedNote)).toHaveCount(0);
});

test("resolves journey routes from shared links and reports unknown routes", async ({ page }) => {
  await page.goto("/explore/journeys/student-moving-to-japan?route=temporary-visitor-study");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Student journey");
  await expect(page.getByRole("link", { name: "Short-term study in Japan and the correct entry route" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Student visa and Certificate of Eligibility" })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("link", { name: "Short-term study in Japan and the correct entry route" }).first()).toBeVisible();

  await page.goto("/explore/journeys/student-moving-to-japan?route=not-a-route");
  await expect(page.getByText("That route is not part of this journey. Choose one of the available routes below.")).toBeVisible();
});

test("presents Japanese journey context on a prebuilt page", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem("nihonest:content-locale:v1", "ja"));
  await page.goto(journeyArticle);
  const context = page.getByRole("region").filter({ has: page.locator("#your-journey-heading") });
  await expect(context).toBeVisible();
  await expect(context.getByText("あなたのジャーニー")).toBeVisible();
  await expect(page.locator("div[lang='ja']").first()).toBeVisible();
});

test("keeps unknown slugs as not found", async ({ page }) => {
  for (const path of ["/articles/not-a-real-guide?journey=x", "/residence-statuses/not-a-status?returnTo=/saved", "/explore/journeys/not-a-journey?route=x"]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
  }
});
