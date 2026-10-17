/**
 * Automated accessibility audit of the local CMS. Starts a private CMS instance on a spare loopback port, opens every
 * page, a record of each editable kind, a municipality guide, and each reference kind in Chrome, visits every tab, and
 * runs axe-core at desktop and phone widths. Read-only: it never saves, changes status, or approves.
 *
 *   npm run cms:a11y
 *
 * Needs Google Chrome (the same browser channel as the Playwright end-to-end tests). An automated pass does not replace
 * a keyboard and screen-reader walkthrough; see tools/cms/README.md.
 */
import { createRequire } from "node:module";
import type { AddressInfo } from "node:net";
import { resolve } from "node:path";
import { chromium, type Page } from "@playwright/test";
import { startGitSession } from "../tools/cms/git-session";
import { createCmsServer } from "../tools/cms/server";

type Finding = { id: string; impact: string; where: string; targets: string[] };

const projectRoot = resolve(import.meta.dirname, "..");
const axePath = createRequire(import.meta.url).resolve("axe-core/axe.min.js");
const widths = [1280, 375];

// Runs in the page. Kept as plain JavaScript text: the TypeScript loader adds helpers to compiled functions that do not
// exist in the browser.
const auditInPage = `(async (label) => {
  const run = async (suffix) => (await window.axe.run(document, { resultTypes: ["violations"] })).violations
    .map((violation) => ({ id: violation.id, impact: violation.impact, where: label + suffix, targets: violation.nodes.slice(0, 3).map((node) => node.target.join(" ")) }));
  const findings = await run("");
  // Hidden tab panels are skipped by axe, so open each tab of the visible record or guide in turn.
  for (const tab of document.querySelectorAll("main > .page:not([hidden]) [role='tab']")) {
    tab.click();
    await new Promise((done) => setTimeout(done, 250));
    findings.push(...await run(" › " + tab.textContent));
  }
  return findings;
})`;

async function audit(page: Page, where: string): Promise<Finding[]> {
  return page.evaluate(`${auditInPage}(${JSON.stringify(where)})`) as Promise<Finding[]>;
}

async function visit(page: Page, route: string, ready: string) {
  await page.evaluate((hash) => { window.location.hash = hash; }, `#/${route}`);
  await page.waitForSelector(ready, { timeout: 15_000 });
  await page.waitForTimeout(300);
}

async function main() {
  const server = createCmsServer(projectRoot);
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  await startGitSession(projectRoot);
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/`;
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const findings: Finding[] = [];
  const keyboardProblems: string[] = [];
  try {
    // The CMS forbids injected scripts; bypassing its policy is limited to this audit browser.
    const context = await browser.newContext({ bypassCSP: true });
    const page = await context.newPage();
    const api = async <T>(path: string): Promise<T> => (await context.request.get(new URL(path, base).href)).json() as Promise<T>;
    const [articles, records, guidance, references] = await Promise.all([
      api<{ articles: { id: string }[] }>("/api/articles"),
      api<{ records: { kind: string; id: string }[] }>("/api/records"),
      api<{ locations: { supplements: { id: string }[] }[] }>("/api/local-guidance"),
      api<{ records: { kind: string; id: string }[] }>("/api/reference"),
    ]);
    const recordRoutes = [
      ...(articles.articles[0] ? [`content/article/${encodeURIComponent(articles.articles[0].id)}`] : []),
      ...["faq", "residence-status", "glossary-term"].flatMap((kind) => {
        const record = records.records.find((item) => item.kind === kind);
        return record ? [`content/${kind}/${encodeURIComponent(record.id)}`] : [];
      }),
    ];
    const guide = guidance.locations.find((location) => location.supplements.length)?.supplements[0];
    const referenceKinds = [...new Set(references.records.map((record) => record.kind))];

    // Every page is audited in both themes; the dark theme redefines every colour role.
    for (const scheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme: scheme });
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(base);
        await page.waitForSelector("#article-list li", { state: "attached", timeout: 60_000 });
        await page.addScriptTag({ path: axePath });
        for (const name of ["overview", "content", "guidance", "sources", "translations", "checks", "changes", "activity"]) {
          await visit(page, name, `main > .page[data-page='${name}']:not([hidden])`);
          findings.push(...await audit(page, `${scheme} ${width}px ${name}`));
        }
        await page.keyboard.press("Control+k");
        await page.waitForSelector("#palette[open]");
        findings.push(...await audit(page, `${scheme} ${width}px Go to palette`));
        await page.keyboard.press("Escape");
        for (const route of recordRoutes) {
          await visit(page, route, "#article-detail .record-header");
          findings.push(...await audit(page, `${scheme} ${width}px ${route}`));
        }
        for (const route of ["content/new/article", "content/new/faq", "content/new/glossary-term", "sources/new/source"]) {
          await visit(page, route, `main > .page[data-page='${route.split("/")[0]}'] .create-record .create-form`);
          const kind = route.split("/").at(-1)!;
          const heading = { article: "Create an article", faq: "Create a FAQ", "glossary-term": "Create a glossary term", source: "Create an official source" }[kind];
          await page.waitForFunction(({ kind, heading }) => {
            const workspace = [...document.querySelectorAll<HTMLElement>(".create-record")].find((element) => !element.closest("[hidden]"));
            return workspace?.dataset.createKind === kind && workspace.querySelector("h3")?.textContent === heading;
          }, { kind, heading }, { timeout: 15_000 });
          findings.push(...await audit(page, `${scheme} ${width}px ${route}`));
        }
        if (guide) {
          await visit(page, `guidance/${encodeURIComponent(guide.id)}`, "#local-guidance-detail .record-header");
          findings.push(...await audit(page, `${scheme} ${width}px guidance/${guide.id}`));
        }
        await visit(page, "sources", "main > .page[data-page='sources']:not([hidden])");
        for (const kind of referenceKinds) {
          await page.selectOption("#reference-kind", kind);
          await page.click("#reference-list button");
          await page.waitForSelector("#reference-detail h4", { timeout: 15_000 });
          findings.push(...await audit(page, `${scheme} ${width}px reference ${kind}`));
        }
      }
    }
    await page.emulateMedia({ colorScheme: "light" });
    // Keyboard walkthrough of the core flow: skip link, page navigation, opening a record, and moving between tabs.
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(base);
    await page.waitForSelector("#article-list li", { state: "attached", timeout: 60_000 });
    const focused = () => page.evaluate("document.activeElement && (document.activeElement.id || document.activeElement.getAttribute('data-page-link') || document.activeElement.className || document.activeElement.tagName)");
    const expectFocus = async (step: string, expected: string) => {
      const actual = await focused();
      if (actual !== expected) keyboardProblems.push(`${step}: focus is on ${String(actual)}, expected ${expected}`);
    };
    await page.keyboard.press("Tab");
    await expectFocus("First Tab", "skip-link");
    await page.keyboard.press("Enter");
    await expectFocus("Skip link", "page-heading");
    await page.focus("[data-page-link='content']");
    await page.keyboard.press("Enter");
    await page.waitForSelector("main > .page[data-page='content']:not([hidden])");
    await expectFocus("Content link", "page-heading");
    await page.focus("#article-list button");
    await page.keyboard.press("Enter");
    await page.waitForSelector("#article-detail .record-header");
    await page.focus("#article-detail [role='tab']");
    await page.keyboard.press("ArrowRight");
    const selectedTab = await page.evaluate("document.activeElement.getAttribute('aria-selected') + ' ' + document.activeElement.textContent");
    if (selectedTab !== "true Review & approve") keyboardProblems.push(`ArrowRight on the first record tab selected "${String(selectedTab)}", expected Review & approve`);
    const outline = await page.evaluate("getComputedStyle(document.activeElement).outlineStyle");
    if (outline === "none") keyboardProblems.push("The focused record tab has no visible focus outline");
  } finally {
    await browser.close();
    server.close();
  }

  for (const problem of keyboardProblems) console.error(`keyboard: ${problem}`);
  if (keyboardProblems.length) process.exitCode = 1;
  if (findings.length) {
    for (const finding of findings) console.error(`${finding.impact}: ${finding.id} at ${finding.where}\n  ${finding.targets.join("\n  ")}`);
    console.error(`\n${findings.length} accessibility violation(s).`);
    process.exitCode = 1;
  } else if (!keyboardProblems.length) {
    console.log(`No axe violations in light and dark themes on ${widths.length} widths, including the Go to palette, across every page, a record of each editable kind, every creation form, a municipality guide, and each reference kind, with every tab opened. Keyboard walkthrough passed.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
