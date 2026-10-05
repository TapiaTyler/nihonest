/**
 * Japanese titles for Japanese-language official sources (src/data/sources/japanese-source-titles.ts).
 *
 *   npm run sources:titles                 list Japanese-language sources without a Japanese title
 *   npm run sources:titles -- --fetch      also fetch those pages and propose titles (site name removed)
 *   npm run sources:titles -- --fetch --write   add the proposed titles to the catalog
 *   npm run sources:titles -- --ids a,b --fetch  limit to specific sources
 *
 * Pages are fetched through `npm run local-guidance -- fetch`, which caches them under .local-guidance/pages.
 * PDFs, images, failed fetches, and pages whose title is only the site name get no proposal; they keep their
 * English title, marked as English, as the catalog documents. Review proposals before committing.
 */
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { sources } from "@/data/sources";
import { japaneseOrganizationNames } from "@/data/sources/japanese-organization-names";
import { japaneseSourceTitles } from "@/data/sources/japanese-source-titles";
import { cleanSourceTitle, errorPageTitle } from "@/lib/sources/source-title";
import { hasFlag, readOption } from "./glossary-translation/cli-options";

const catalogPath = resolve("src/data/sources/japanese-source-titles.ts");
const fileUrl = /\.(?:pdf|jpe?g|png|gif|docx?|xlsx?|zip)(?:[?#]|$)/i;

function main() {
  const argv = process.argv.slice(2);
  const ids = readOption(argv, "ids")?.split(",").map((id) => id.trim()).filter(Boolean);
  const missing = sources.filter((source) => source.language === "ja" && !Object.hasOwn(japaneseSourceTitles, source.id)
    && (!ids || ids.includes(source.id)));
  const files = missing.filter(({ url }) => fileUrl.test(url));
  const pages = missing.filter(({ url }) => !fileUrl.test(url));

  console.log(`${missing.length} Japanese-language source(s) without a Japanese title: ${pages.length} page(s), ${files.length} file(s).`);
  for (const source of missing) console.log(`  ${source.id}  ${source.url}${fileUrl.test(source.url) ? "  (file: keeps English title)" : ""}`);
  if (!hasFlag(argv, "fetch") || !pages.length) return;

  // No shell, so URLs containing "&" or "?" reach the fetcher intact.
  const run = spawnSync(process.execPath, ["--import", "tsx", "scripts/local-guidance.ts", "fetch", ...pages.map(({ url }) => url)], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const lines = `${run.stdout}\n${run.stderr}`.split("\n");
  const titlesByUrl = new Map<string, string>();
  lines.forEach((line, index) => {
    const ok = line.match(/^✓ \d+ (.+)$/);
    const url = lines[index + 1]?.trim();
    if (ok && url) titlesByUrl.set(url, ok[1]!);
  });

  const proposals: [string, string][] = [];
  console.log("\nProposed titles:");
  for (const source of pages) {
    const raw = titlesByUrl.get(source.url);
    const siteNames = [source.organization, japaneseOrganizationNames[source.organization] ?? ""].filter(Boolean);
    const title = raw ? cleanSourceTitle(raw, siteNames) : undefined;
    if (title) proposals.push([source.id, title]);
    const reason = !raw ? "fetch failed" : errorPageTitle.test(raw) ? `error page, check the source link: ${JSON.stringify(raw)}` : `no usable Japanese title: ${JSON.stringify(raw)}`;
    console.log(`  ${source.id}: ${title ? JSON.stringify(title) : `skipped (${reason})`}`);
  }
  if (!hasFlag(argv, "write") || !proposals.length) return;

  const catalog = readFileSync(catalogPath, "utf8");
  const end = catalog.lastIndexOf("};");
  const added = proposals.map(([id, title]) => `  ${JSON.stringify(id)}: ${JSON.stringify(title)},\n`).join("");
  writeFileSync(catalogPath, catalog.slice(0, end) + added + catalog.slice(end));
  console.log(`\nAdded ${proposals.length} title(s) to ${catalogPath}. Review them, then run npx vitest run src/data/sources/japanese-names.test.ts.`);
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("scripts/source-titles.ts")) main();
