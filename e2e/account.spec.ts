import { expect, test } from "@playwright/test";

test.describe("local Supabase account lifecycle", () => {
  test.skip(process.env.RUN_SUPABASE_E2E !== "1", "Requires the repository's local Supabase and Mailpit stack.");

  test("signs in by email, imports preferences, exports data, and deletes the account", async ({ page, request }) => {
    const email = `phase8-${Date.now()}@example.test`;
    await page.goto("/onboarding");
    await page.getByRole("radio", { name: /Preparing/ }).check();
    await page.getByRole("button", { name: "Save my starting point" }).click();

    await page.goto("/account");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.getByRole("textbox", { name: "Email address" }).fill(email);
    await page.getByRole("button", { name: "Send account creation link" }).click();
    await expect(page.getByRole("status")).toContainText("Check your email");

    const listResponse = await request.get("http://127.0.0.1:54324/api/v1/messages");
    expect(listResponse.ok()).toBeTruthy();
    const list = await listResponse.json() as { messages: Array<{ ID: string; To: Array<{ Address: string }> }> };
    const message = list.messages.find(({ To }) => To.some(({ Address }) => Address === email));
    expect(message).toBeTruthy();

    const messageResponse = await request.get(`http://127.0.0.1:54324/api/v1/message/${message?.ID}`);
    const body = await messageResponse.json() as { HTML?: string; Text?: string };
    const match = `${body.HTML ?? ""} ${body.Text ?? ""}`.match(/https?:\/\/[^\s"<>]+/);
    expect(match).toBeTruthy();
    await page.goto(match?.[0].replaceAll("&amp;", "&") ?? "");

    await expect(page).toHaveURL(/auth=success/);
    await expect(page.getByRole("heading", { name: "Account details" })).toBeVisible();
    const importButton = page.getByRole("button", { name: "Import this device’s starting point" });
    await expect(importButton).toBeEnabled();
    await importButton.click();
    await expect(page.getByRole("status")).toContainText("saved to your account");
    await expect(page.getByText("preparing", { exact: true })).toBeVisible();

    const exportResponse = await page.request.get("/api/account/export");
    expect(exportResponse.ok()).toBeTruthy();
    const exported = await exportResponse.json() as { account: { email: string }; userOwnedData: { preferences: { journey_stage: string } } };
    expect(exported.account.email).toBe(email);
    expect(exported.userOwnedData.preferences.journey_stage).toBe("preparing");

    await page.getByRole("textbox", { name: "Type DELETE to confirm" }).fill("DELETE");
    await page.getByRole("button", { name: "Permanently delete account" }).click();
    await expect(page).toHaveURL(/account=deleted/);
    await expect(page.getByRole("heading", { name: "Sign in to your account" })).toBeVisible();
  });
});
