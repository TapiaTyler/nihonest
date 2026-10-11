import { expect, test } from "@playwright/test";

// A Suspense boundary that hydrates after the locale has switched must still match the server HTML.
for (const path of ["/articles/artist-status", "/", "/explore?stage=planning"]) {
  test(`hydrates ${path} without mismatches when Japanese is selected`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("nihonest:content-locale:v1", "ja"));
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message.slice(0, 200)));
    page.on("console", (message) => { if (message.type() === "error" && /hydrat/i.test(message.text())) errors.push(message.text().slice(0, 200)); });

    await page.goto(path, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    expect(errors).toEqual([]);
  });
}
