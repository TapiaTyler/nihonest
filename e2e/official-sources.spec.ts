import { expect, test } from "@playwright/test";

// The guide lists more than four sources, so the list starts at four and reveals the rest in batches of up to four.
// The test follows the button's own label instead of a fixed total, so adding a source to the guide cannot break it.
test("reveals long official-source lists in batches of four", async ({ page }) => {
  await page.goto("/articles/documents-received-when-entering-japan");
  const sources = page.getByRole("region", { name: "Official sources" });
  const items = sources.getByRole("listitem");
  await expect(items).toHaveCount(4);
  await expect(sources.getByRole("button", { name: /^Show \d+ more/ })).toBeVisible();

  let shown = 4;
  let batches = 0;
  for (;;) {
    const more = sources.getByRole("button", { name: /^Show \d+ more/ });
    if (await more.count() === 0) break;
    const batch = Number(/Show (\d+) more/.exec((await more.textContent()) ?? "")?.[1]);
    expect(batch).toBeGreaterThan(0);
    expect(batch).toBeLessThanOrEqual(4);
    await more.click();
    shown += batch;
    batches += 1;
    await expect(items).toHaveCount(shown);
  }
  expect(batches).toBeGreaterThan(1);
  await expect(sources.getByRole("button", { name: /Show .* more/ })).toHaveCount(0);
});
