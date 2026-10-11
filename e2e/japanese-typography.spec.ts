import { expect, test } from "@playwright/test";

test("Japanese pages are marked lang=ja and use phrase-aware line breaks", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("nihonest:content-locale:v1", "ja"));
  await page.goto("/roadmap", { waitUntil: "networkidle" });

  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveCSS("word-break", "auto-phrase");
  await expect(heading).toHaveCSS("letter-spacing", "normal");
  const leading = await page.locator("main p").first().evaluate((element) => parseFloat(getComputedStyle(element).lineHeight) / parseFloat(getComputedStyle(element).fontSize));
  expect(leading).toBeGreaterThan(1.8);
});

test("English pages keep the English document language and typography", async ({ page }) => {
  await page.goto("/roadmap", { waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).not.toHaveCSS("word-break", "auto-phrase");
});
