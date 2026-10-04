import { expect, test, type APIRequestContext, type BrowserContext, type Page } from "@playwright/test";

/*
 * H5 acceptance: the session proxy runs only on account, account API, and auth routes. Signed-in readers must keep
 * working sessions on prebuilt public pages (the browser client refreshes tokens), and server routes must still see
 * valid identity after expiry. Requires a local Supabase stack with a short JWT lifetime (longer than the 90-second supabase-js refresh margin, for example 180 seconds):
 * RUN_SUPABASE_E2E=1 SUPABASE_JWT_EXPIRY_SECONDS=180 SUPABASE_MAILPIT_URL=http://127.0.0.1:55324 PLAYWRIGHT_BASE_URL=...
 */
const mailpit = process.env.SUPABASE_MAILPIT_URL ?? "http://127.0.0.1:54324";
const jwtExpirySeconds = Number(process.env.SUPABASE_JWT_EXPIRY_SECONDS ?? "180");
const publicArticle = "/articles/registering-your-address-after-arrival";

test.describe("session scope with local Supabase", () => {
  test.skip(process.env.RUN_SUPABASE_E2E !== "1", "Requires a local Supabase and Mailpit stack.");
  test.describe.configure({ mode: "serial", timeout: (jwtExpirySeconds + 120) * 1000 });

  async function signIn(page: Page, request: APIRequestContext, email: string) {
    await page.goto("/account");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.getByRole("textbox", { name: "Email address" }).fill(email);
    await page.getByRole("button", { name: "Send account creation link" }).click();
    await expect(page.getByRole("status")).toContainText("Check your email");
    let link: string | undefined;
    await expect(async () => {
      const list = await (await request.get(`${mailpit}/api/v1/messages`)).json() as { messages: Array<{ ID: string; To: Array<{ Address: string }> }> };
      const message = list.messages.find(({ To }) => To.some(({ Address }) => Address === email));
      expect(message).toBeTruthy();
      const body = await (await request.get(`${mailpit}/api/v1/message/${message!.ID}`)).json() as { HTML?: string; Text?: string };
      link = `${body.HTML ?? ""} ${body.Text ?? ""}`.match(/https?:\/\/[^\s"<>]+/)?.[0];
      expect(link).toBeTruthy();
    }).toPass({ timeout: 15_000 });
    await page.goto(link!.replaceAll("&amp;", "&"));
    await expect(page).toHaveURL(/auth=success/);
    await expect(page.getByRole("heading", { name: "Account details" })).toBeVisible();
  }

  async function exportedEmail(page: Page) {
    const response = await page.request.get("/api/account/export");
    return response.ok() ? (await response.json() as { account: { email: string } }).account.email : response.status();
  }

  /** Close every page so no browser code can refresh the token, then wait past the access-token lifetime. */
  async function expireWithoutBrowserRefresh(context: BrowserContext) {
    for (const page of context.pages()) await page.close();
    await new Promise((resolve) => setTimeout(resolve, (jwtExpirySeconds + 5) * 1000));
    return context.newPage();
  }

  test("keeps the session through public browsing after the access token expires", async ({ context, page, request }) => {
    const email = `h5-public-${Date.now()}@example.test`;
    await signIn(page, request, email);
    await page.goto(publicArticle);
    await expect(page.getByRole("link", { name: "Login" })).toHaveCount(0);
    expect(await exportedEmail(page)).toBe(email);

    const returning = await expireWithoutBrowserRefresh(context);
    // Public pages are outside the proxy: the browser client refreshes the expired session and rewrites cookies.
    await returning.goto(publicArticle);
    await expect(returning.getByRole("link", { name: "Login" })).toHaveCount(0);
    await returning.waitForLoadState("networkidle");
    await returning.goto("/account");
    await expect(returning.getByRole("heading", { name: "Account details" })).toBeVisible();
    expect(await exportedEmail(returning)).toBe(email);
  });

  test("refreshes an expired session on direct account API and page requests", async ({ context, page, request }) => {
    const email = `h5-direct-${Date.now()}@example.test`;
    await signIn(page, request, email);
    const returning = await expireWithoutBrowserRefresh(context);
    // No public page first: the proxy on the matched API route must refresh the cookie-backed session itself.
    expect(await exportedEmail(returning)).toBe(email);
    await returning.goto("/account");
    await expect(returning.getByRole("heading", { name: "Account details" })).toBeVisible();
  });

  test("signs out from a public page and loses server authorization", async ({ page, request, browser }) => {
    const email = `h5-signout-${Date.now()}@example.test`;
    await signIn(page, request, email);
    await page.goto(publicArticle);
    await page.locator('button[aria-controls="desktop-account-navigation"]').click();
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page.getByRole("link", { name: "Login" }).first()).toBeVisible();
    expect(await exportedEmail(page)).toBe(401);
    await page.goto("/account");
    await expect(page.getByRole("heading", { name: "Sign in to your account" })).toBeVisible();

    const anonymous = await browser.newContext();
    try {
      const anonymousPage = await anonymous.newPage();
      expect(await exportedEmail(anonymousPage)).toBe(401);
      // Deletion rejects requests without a same-origin Origin header, then requires the typed confirmation, then a verified identity.
      expect((await anonymousPage.request.delete("/api/account")).status()).toBe(403);
      const origin = new URL(anonymousPage.url() === "about:blank" ? (process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000") : anonymousPage.url()).origin;
      expect((await anonymousPage.request.delete("/api/account", { headers: { origin }, data: { confirmation: "DELETE" } })).status()).toBe(401);
    } finally {
      await anonymous.close();
    }
  });

  test("switches accounts and serves only the current account", async ({ page, request }) => {
    const first = `h5-first-${Date.now()}@example.test`;
    const second = `h5-second-${Date.now()}@example.test`;
    await signIn(page, request, first);
    expect(await exportedEmail(page)).toBe(first);
    // Signing out from the account page returns to the home page.
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("link", { name: "Login" }).first()).toBeVisible();
    expect(await exportedEmail(page)).toBe(401);
    await signIn(page, request, second);
    expect(await exportedEmail(page)).toBe(second);
    await page.goto(publicArticle);
    await page.goto("/account");
    await expect(page.getByText(second)).toBeVisible();
    await expect(page.getByText(first)).toHaveCount(0);
  });
});
