import { expect, test } from "@playwright/test";

test("loads the Nihonest homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Nihonest — Find your place in Japan");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Find your place in Japan.");
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
});

test("keeps accounts optional without blocking the public knowledgebase", async ({ page }) => {
  await page.goto("/account");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Keep useful preferences, not unnecessary personal data.");
  await expect(page.getByText("Every public guide, journey, FAQ, status, and glossary entry remains available without signing in.")).toBeVisible();
  await page.getByRole("link", { name: "Explore" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Find the guidance that fits your situation.");
});

test("browses a content group and opens one of its guides", async ({ page }) => {
  await page.goto("/explore");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Find the guidance that fits your situation.",
  );
  await expect(page.getByRole("link", { name: "Explore Study in Japan" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore Arrival essentials" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore Professional work" })).toBeVisible();
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
  await expect(page.getByRole("link", { name: "Explore Business and high-skill" })).toBeVisible();
  await expect(page.getByRole("link", { name: /^Groups \(/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /^Guides \(/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /^Glossary terms \(/ })).toHaveCount(0);
  await page.getByRole("link", { name: /^Groups \(/ }).click();
  await expect(page).toHaveURL(/#result-groups$/);
  await page.getByRole("link", { name: "Japan's Start-up Visa pathway", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Japan's Start-up Visa pathway");
  await expect(page.getByRole("heading", { name: "Official sources" })).toBeVisible();
  await page.getByRole("link", { name: "Back to Explore" }).click();
  await expect(page.getByRole("searchbox", { name: "What do you need help with?" })).toHaveValue("Start-up Visa");
});

test("carries an unsuccessful Explore query into FAQ search", async ({ page }) => {
  await page.goto("/explore");
  await page.getByRole("searchbox", { name: "What do you need help with?" }).fill("software developer");
  await page.getByText("More filters").click();
  await page.getByRole("combobox", { name: "Topic" }).selectOption("healthcare");

  await expect(page.getByRole("heading", { name: "No matching guidance found" })).toBeVisible();
  await page.getByRole("link", { name: "Search FAQs for this question →" }).click();
  await expect(page).toHaveURL(/\/faq\?q=software\+developer$/);
  await expect(page.getByRole("searchbox", { name: "What would you like to understand?" })).toHaveValue("software developer");
  await expect(page.getByRole("heading", { name: "Which Japanese work status is commonly relevant to software developers and software engineers?" })).toBeVisible();
});

test("carries an unsuccessful FAQ query into the complete Explore search", async ({ page }) => {
  await page.goto("/faq?q=teacher");

  await expect(page.getByRole("heading", { name: "No matching FAQ found" })).toBeVisible();
  await page.getByRole("link", { name: "Search all guidance for this question →" }).click();
  await expect(page).toHaveURL(/\/explore\?q=teacher$/);
  await expect(page.getByRole("searchbox", { name: "What do you need help with?" })).toHaveValue("teacher");
  await expect(page.getByRole("link", { name: "Instructor" })).toBeVisible();
});

test("resolves one professional route without treating alternatives as later steps", async ({ page }) => {
  await page.goto("/explore/journeys/professional-worker-moving-to-japan");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Professional worker journey");
  await expect(page.getByRole("link", { name: /Legal \/ Accounting Services/ })).toBeVisible();
  await page.getByRole("link", { name: /Legal \/ Accounting Services/ }).click();
  await expect(page).toHaveURL(/route=legal-accounting-services$/);
  await expect(page.getByRole("link", { name: "Legal/Accounting Services work visa and status of residence" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Medical Services work visa and status of residence" })).toHaveCount(0);

  await page.getByRole("link", { name: "Legal/Accounting Services work visa and status of residence" }).click();
  const journeyContext = page.getByRole("region", { name: "Professional worker journey" });
  const nextGuide = journeyContext.getByRole("link", { name: "Preparing for long-term entry to Japan →" });
  await expect(nextGuide).toHaveAttribute("href", /journey=professional-worker-moving-to-japan&route=legal-accounting-services/);
  await expect(journeyContext.getByText(/Medical Services/)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Continue exploring" })).toBeVisible();

  await page.goto("/articles/legal-accounting-services-status");
  await expect(page.getByRole("region", { name: "Professional worker journey" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Continue exploring" })).toBeVisible();
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

test("selects and remembers an anonymous journey stage", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Find my starting point" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Where are you in your Japan journey?",
  );
  await page.getByRole("radio", { name: /Recently arrived/ }).check();
  await page.getByRole("button", { name: "Save my starting point" }).click();

  await expect(page.getByRole("heading", { name: "Useful while recently arrived" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Documents you receive when entering Japan" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("link", { name: "Explore guidance for recently arrived" })).toBeVisible();
  await page.getByRole("link", { name: "Explore guidance for recently arrived" }).click();
  await expect(page).toHaveURL(/\/explore\?stage=recently-arrived$/);
  await page.getByText("More filters", { exact: true }).click();
  await expect(page.getByRole("combobox", { name: "Journey stage" })).toHaveValue("recently-arrived");
});

test("warns before leaving onboarding with unsaved starting-point changes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Find my starting point" }).click();
  await page.getByRole("radio", { name: /Recently arrived/ }).check();

  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm");
    expect(dialog.message()).toContain("unsaved changes");
    await dialog.dismiss();
  });
  await page.getByRole("link", { name: "Back to Home" }).click();
  await expect(page).toHaveURL(/\/onboarding$/);

  page.once("dialog", async (dialog) => dialog.accept());
  await page.evaluate(() => window.history.back());
  await expect(page).toHaveURL(/\/$/);
});

test("keeps personalization optional and remembers a skipped onboarding", async ({ page }) => {
  await page.goto("/onboarding");

  await page.getByRole("button", { name: "Skip and browse everything" }).click();
  await expect(page).toHaveURL(/\/explore$/);
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Find my starting point" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore all guidance" })).toHaveCount(0);
});

test("searches, saves, and clears a specific journey route", async ({ page }) => {
  await page.goto("/onboarding");

  await page.getByRole("radio", { name: /Planning/ }).check();
  await page.getByRole("searchbox", { name: "Search journeys and routes" }).fill("Business Manager");
  await expect(page.getByText("1 journey shown")).toBeVisible();
  await page.getByRole("radio", { name: /Founder and highly skilled journey/ }).check();
  const routeChoices = page.getByRole("group", { name: "3. Narrow the route, if you know it" });
  await expect(routeChoices.getByRole("radio", { name: /Business Manager/ })).toBeChecked();
  await page.getByRole("button", { name: "Save my starting point" }).click();

  await expect(page.getByRole("link", { name: "Continue my journey" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Founder and highly skilled journey starting points" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Focused route: Business Manager visa and status of residence/ })).toBeVisible();
  await page.reload();
  await page.getByRole("link", { name: "Continue my journey" }).click();
  await expect(page).toHaveURL(/route=business-manager$/);
  await page.getByRole("link", { name: "Change route" }).click();
  await page.getByRole("link", { name: /Choose this route Highly Skilled Professional/ }).click();
  await expect(page).toHaveURL(/route=highly-skilled-professional$/);
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Focused route: Highly Skilled Professional/ })).toBeVisible();

  await page.getByRole("link", { name: "Adjust my starting point" }).first().click();
  await page.getByRole("button", { name: "Remove personalization" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("link", { name: "Find my starting point" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore all guidance" })).toHaveCount(0);
});

test("saves a specialized focused guide within its expanded journey", async ({ page }) => {
  await page.goto("/onboarding");

  await page.getByRole("radio", { name: /Planning/ }).check();
  await page.getByRole("searchbox", { name: "Search journeys and routes" }).fill("Diplomatic visa");
  await expect(page.getByText("1 journey shown")).toBeVisible();
  await page.getByRole("button", { name: /Diplomatic visa/ }).click();
  await page.getByRole("button", { name: "Save my starting point" }).click();

  await expect(page.getByRole("link", { name: "Continue my journey" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Diplomatic and official assignment journey starting points" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Focused route: Diplomatic visa and Diplomat status/ })).toBeVisible();
});

test("opens the route-aware student journey", async ({ page }) => {
  await page.goto("/explore/journeys/student-moving-to-japan");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Student journey");
  await page.getByRole("link", { name: /Short-term study as a Temporary Visitor/ }).click();
  await expect(page).toHaveURL(/route=temporary-visitor-study$/);
  await expect(page.getByRole("link", { name: "Registering your address after arrival" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Student visa and Certificate of Eligibility" })).toHaveCount(0);
  await page.getByRole("link", { name: "Short-term study in Japan as a Temporary Visitor" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Short-term study in Japan as a Temporary Visitor",
  );
  await expect(page.getByText(/90 days is the maximum/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Student journey" })).toBeVisible();
});

test("searches the glossary and follows a term to its guide", async ({ page }) => {
  await page.goto("/glossary");

  await page.getByRole("searchbox", { name: "Search Japanese or English" }).fill("juminhyo");
  await expect(page.getByText("Showing 1 of 67 terms")).toBeVisible();
  const glossaryCard = page.getByRole("article").filter({ hasText: "Certificate of Residence" });
  const glossaryCta = glossaryCard.getByText("View term and context →");
  await expect(glossaryCta).toHaveCSS("cursor", "pointer");
  await glossaryCta.click();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("住民票");
  await expect(page.locator("p").filter({ hasText: "じゅうみんひょう · jūminhyō" })).toBeVisible();
  await page.getByRole("link", { name: "Back to Glossary" }).click();
  await expect(page.getByRole("searchbox", { name: "Search Japanese or English" })).toHaveValue(
    "juminhyo",
  );
  await expect(page.getByText("Showing 1 of 67 terms")).toBeVisible();
  await page.getByRole("link", { name: "Certificate of Residence" }).click();
  await page.getByRole("link", { name: "Registering your address after arrival" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Registering your address after arrival");
  await expect(page.getByRole("heading", { name: "Key Japanese terminology" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Report where you live" })).toBeVisible();
  const articleHeadings = await page.locator("h2").allTextContents();
  expect(articleHeadings.indexOf("Report where you live")).toBeLessThan(
    articleHeadings.indexOf("Key Japanese terminology"),
  );
});

test("filters and opens a residence status", async ({ page }) => {
  await page.goto("/residence-statuses");

  await page.getByRole("button", { name: "Study, culture, and training" }).click();
  await expect(page.getByText("Showing 3 of 29 draft statuses")).toBeVisible();
  const statusCard = page.getByRole("article").filter({ hasText: "Student" });
  const statusCta = statusCard.getByText("View status and related guidance →");
  await expect(statusCta).toHaveCSS("cursor", "pointer");
  await statusCta.click();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Student");
  await expect(page.getByRole("paragraph").filter({ hasText: /^りゅうがく · ryūgaku$/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "留学" })).toHaveAttribute("href", "/glossary/ryugaku");
  await expect(page.getByRole("heading", { name: "What to verify" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Study in Japan →" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Student journey →" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Official sources" })).toBeVisible();
});
