/**
 * Research and validation tooling for municipality-specific local guidance (the supplements in
 * src/data/local-guidance/). Works the same for any agent or person; see docs/LOCAL-GUIDANCE-WORKFLOW.md.
 *
 *   npm run local-guidance -- coverage
 *   npm run local-guidance -- worksheet --article joining-national-health-insurance --next 3
 *   npm run local-guidance -- worksheet --article joining-national-health-insurance --wards jp-13105,jp-13106
 *   npm run local-guidance -- fetch <url> [<url> ...] [--keywords 国民健康保険,国保] [--follow] [--out <dir>]
 *   npm run local-guidance -- check [--article <id>] [--only <id,id>] [--links] [--evidence]
 *   npm run local-guidance -- verify        (the whole batch verification: changed supplements + data tests)
 *
 * Output goes to .local-guidance/ (gitignored). Fetched pages are saved as compact Markdown text so a researcher
 * reads a few kilobytes per page instead of the full HTML.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import tls from "node:tls";
import { getAdministrativeGeography } from "@/data/geography";
import { localGuidanceSupplements, supportedGeographies } from "@/data/local-guidance";
import { generalLocalAdvice } from "@/data/local-guidance/general-advice";
import { sources } from "@/data/sources";
import { englishGeographyName } from "@/domain/geography/english-name";
import type { LocalGuidanceSupplement } from "@/domain/geography/local-guidance";
import { checkConcreteClaims, decodeHtml, htmlToText, matchingLinks, type PageText } from "@/lib/editorial/local-guidance-research";
import { hasFlag, readOption } from "./glossary-translation/cli-options";

const outputRoot = resolve(process.cwd(), ".local-guidance");
/** Repository-relative with forward slashes, so printed paths and commands paste into any shell. */
const shown = (path: string) => relative(process.cwd(), path).split("\\").join("/");
const today = new Date().toISOString().slice(0, 10);

/** Japanese search terms and the ID segment used for each guide that takes local supplements. */
const topics: Readonly<Record<string, { slug: string; keywords: readonly string[] }>> = {
  "registering-your-address-after-arrival": { slug: "address-registration", keywords: ["転入", "住民登録", "住民異動", "引っ越し", "引越し"] },
  "joining-national-health-insurance": { slug: "national-health-insurance", keywords: ["国民健康保険", "国保", "加入", "資格"] },
  "sorting-household-waste-and-arranging-disposal": { slug: "household-waste", keywords: ["ごみ", "資源", "分別", "粗大", "収集"] },
  "preparing-for-disasters-and-evacuation-in-japan": { slug: "disaster-preparation", keywords: ["防災", "避難", "ハザードマップ", "災害"] },
  "finding-japanese-language-and-local-support": { slug: "language-and-consultation", keywords: ["日本語", "外国人", "多言語", "相談", "国際交流"] },
  "income-and-resident-tax-after-moving-to-japan": { slug: "resident-tax", keywords: ["住民税", "区民税", "市民税", "特別区民税", "納税"] },
  "national-pension-after-moving-to-japan": { slug: "national-pension", keywords: ["国民年金", "年金"] },
};

// ---------------------------------------------------------------------------------------------- shared lookups

type Ward = Readonly<{ id: string; canonicalId: string; code: string; nameEn: string; nameJa: string; slug: string; supported: boolean }>;

function wardFor(id: string): Ward {
  const record = getAdministrativeGeography(id);
  if (!record) throw new Error(`Unknown geography "${id}".`);
  const supported = supportedGeographies.find((geography) => getAdministrativeGeography(geography.id)?.id === record.id);
  const parent = record.parentId ? getAdministrativeGeography(record.parentId) : undefined;
  const nameEn = supported?.name ?? englishGeographyName(record, parent);
  const slug = supported && !supported.id.startsWith("jp-") ? supported.id : nameEn.split(/[ ,]/)[0]!.toLowerCase();
  return { id: supported?.id ?? record.id, canonicalId: record.id, code: record.code, nameEn, nameJa: record.names.ja, slug, supported: Boolean(supported?.selectable) };
}

const selectableWards = () => supportedGeographies.filter(({ selectable }) => selectable).map(({ id }) => wardFor(id))
  .sort((left, right) => left.code.localeCompare(right.code));

const supplementsFor = (articleId: string) => localGuidanceSupplements.filter((supplement) => supplement.articleId === articleId);
const sourceById = new Map(sources.map((source) => [source.id, source]));

/** The official host a ward's existing sources use most, as the starting point for finding new pages. */
function officialHost(ward: Ward): string | undefined {
  const counts = new Map<string, number>();
  for (const supplement of localGuidanceSupplements.filter(({ geographyId }) => wardFor(geographyId).canonicalId === ward.canonicalId)) {
    for (const id of supplement.sourceIds) {
      const url = sourceById.get(id)?.url;
      if (url) counts.set(new URL(url).host, (counts.get(new URL(url).host) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0];
}

/** The organization-level domain, so a ward's separate official hosts compare equal (www.city.x.lg.jp, www.foreign.city.x.lg.jp). */
const officialDomain = (host: string) => host.split(".").slice(host.endsWith(".lg.jp") ? -4 : -3).join(".");

function requireTopic(articleId: string | undefined) {
  if (!articleId || !topics[articleId]) throw new Error(`Pass --article with one of: ${Object.keys(topics).join(", ")}`);
  return { articleId, ...topics[articleId]! };
}

// ---------------------------------------------------------------------------------------------- fetching

/** Link text that marks a municipal site's category pages, which `fetch --follow` opens to find procedure links. */
const categoryWords = ["くらし", "暮らし", "手続", "健康", "医療", "保険", "年金", "税", "防災", "ごみ", "環境", "外国", "国際", "生活"];

/**
 * Several municipal sites send incomplete certificate chains. Browsers complete them from the operating system's
 * store; Node's bundled store cannot, and fails with UNABLE_TO_VERIFY_LEAF_SIGNATURE. Trust the OS store as well,
 * so fetching works without NODE_USE_SYSTEM_CA in every environment. Verification stays on.
 */
function trustSystemCertificates(): void {
  try {
    tls.setDefaultCACertificates([...new Set([...tls.getCACertificates("default"), ...tls.getCACertificates("system")])]);
  } catch {
    // Older Node versions lack these APIs; set NODE_USE_SYSTEM_CA=1 instead.
  }
}

const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

type FetchedPage = Readonly<{ url: string; status: number; contentType: string; page?: PageText; error?: string }>;

/** Fetches once more after a network error: municipal sites occasionally time out, and one miss should not fail a check. */
async function fetchPage(url: string): Promise<FetchedPage> {
  const first = await fetchPageOnce(url);
  if (!first.error) return first;
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 1500));
  return fetchPageOnce(url);
}

async function fetchPageOnce(url: string): Promise<FetchedPage> {
  try {
    const response = await fetch(url, {
      headers: { "user-agent": userAgent, "accept-language": "ja,en;q=0.8" },
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });
    const contentType = response.headers.get("content-type") ?? "";
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (!/html|xml|text\/plain/i.test(contentType)) return { url: response.url, status: response.status, contentType };
    return { url: response.url, status: response.status, contentType, page: htmlToText(decodeHtml(bytes, contentType), response.url) };
  } catch (error) {
    const cause = error instanceof Error && "cause" in error ? String((error.cause as { code?: string })?.code ?? error.cause) : "";
    return { url, status: 0, contentType: "", error: `${error instanceof Error ? error.message : String(error)}${cause ? ` (${cause})` : ""}` };
  }
}

async function inBatches<T, R>(items: readonly T[], size: number, run: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  for (let index = 0; index < items.length; index += size) results.push(...await Promise.all(items.slice(index, index + size).map(run)));
  return results;
}

function pageFileName(url: string): string {
  const { host, pathname } = new URL(url);
  const readable = `${host}${pathname}`.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 80);
  return `${readable}-${createHash("sha1").update(url).digest("hex").slice(0, 6)}.md`;
}

async function fetchCommand(argv: readonly string[]): Promise<void> {
  const urls = argv.filter((value, index) => /^https?:\/\//.test(value) && !argv[index - 1]?.startsWith("--"));
  if (!urls.length) throw new Error("Pass one or more URLs to fetch.");
  const keywords = readOption(argv, "keywords")?.split(",").map((keyword) => keyword.trim()).filter(Boolean) ?? [];
  const outDirectory = resolve(readOption(argv, "out") ?? join(outputRoot, "pages"));
  await mkdir(outDirectory, { recursive: true });

  for (const fetched of await inBatches(urls, 4, fetchPage)) {
    const file = join(outDirectory, pageFileName(fetched.url));
    if (fetched.error || !fetched.page) {
      const reason = fetched.error ?? `${fetched.contentType || "unknown type"}; not extracted (open PDFs and files directly)`;
      console.log(`✗ ${fetched.status || "ERR"} ${fetched.url}\n  ${reason}`);
      process.exitCode = 1;
      continue;
    }
    const { page } = fetched;
    let links = keywords.length ? matchingLinks(page.links, keywords) : [];
    if (keywords.length && hasFlag(argv, "follow")) {
      // Home and portal pages usually link to category pages, not procedures; look one level down on the same site.
      const host = new URL(fetched.url).host;
      const categories = matchingLinks(page.links, categoryWords)
        .filter(({ href }) => new URL(href).host === host && href !== fetched.url)
        // Category links are short ("防災", "暮らし・手続き"); long texts are usually news items that mention a word.
        .sort((left, right) => left.text.length - right.text.length)
        .slice(0, 10);
      const followed = await inBatches(categories.map(({ href }) => href), 4, fetchPage);
      const found = followed.flatMap((child) => child.page ? matchingLinks(child.page.links, keywords) : []);
      links = matchingLinks([...links, ...found], keywords);
      console.log(`  followed ${categories.length} category page(s): ${categories.map(({ text }) => text).join(" · ")}`);
    }
    await writeFile(file, [
      `# ${page.title || fetched.url}`,
      "",
      `- URL: ${fetched.url}`,
      `- Fetched: ${new Date().toISOString()} (HTTP ${fetched.status})`,
      `- Page date: ${page.updated ?? "not stated"}`,
      ...(keywords.length ? ["", `## Links matching ${keywords.join(", ")}`, "", ...links.map(({ text, href }) => `- [${text}](${href})`)] : []),
      "",
      "## Page text",
      "",
      page.text,
      "",
    ].join("\n"));
    console.log(`✓ ${fetched.status} ${page.title}\n  ${fetched.url}\n  page date: ${page.updated ?? "not stated"} · ${page.text.length} chars → ${shown(file)}`);
    for (const { text, href } of links.slice(0, 15)) console.log(`    · ${text} → ${href}`);
    if (links.length > 15) console.log(`    · …${links.length - 15} more in the file`);
  }
}

// ---------------------------------------------------------------------------------------------- coverage

function coverageCommand(): void {
  const wards = selectableWards();
  const articleIds = [...new Set([...Object.keys(topics), ...localGuidanceSupplements.map(({ articleId }) => articleId)])];
  console.log(`Researched local guidance by guide (${wards.length} selectable locations).\n`);
  for (const articleId of articleIds) {
    const covered = new Set(supplementsFor(articleId).map(({ geographyId }) => wardFor(geographyId).canonicalId));
    const missing = wards.filter(({ canonicalId }) => !covered.has(canonicalId));
    const general = articleId in generalLocalAdvice ? "general advice as fallback" : "no general advice";
    console.log(`${articleId}: ${wards.length - missing.length}/${wards.length} (${general})`);
    if (missing.length) console.log(`  next in code order: ${missing.slice(0, 6).map(({ nameEn, id }) => `${nameEn} (${id})`).join(", ")}${missing.length > 6 ? `, …${missing.length - 6} more` : ""}`);
  }
}

// ---------------------------------------------------------------------------------------------- worksheet

function supplementSource(supplement: LocalGuidanceSupplement): string {
  const lines = [
    "  {",
    `    id: "${supplement.id}", articleId: "${supplement.articleId}", geographyId: "${supplement.geographyId}",`,
    `    title: ${JSON.stringify(supplement.title)}, summary: ${JSON.stringify(supplement.summary)},`,
    `    applicability: ${JSON.stringify(supplement.applicability)}, responsibleBody: ${JSON.stringify(supplement.responsibleBody)},${supplement.receivingOffice ? ` receivingOffice: ${JSON.stringify(supplement.receivingOffice)},` : ""}`,
    "    actions: [",
    ...supplement.actions.map((action) => `      { title: ${JSON.stringify(action.title)}, description: ${JSON.stringify(action.description)} },`),
    "    ],",
    `    sourceIds: ${JSON.stringify(supplement.sourceIds)},${supplement.sourceFormatNote ? ` sourceFormatNote: ${JSON.stringify(supplement.sourceFormatNote)},` : ""}`,
    "  },",
  ];
  return lines.join("\n");
}

async function worksheetCommand(argv: readonly string[]): Promise<void> {
  const topic = requireTopic(readOption(argv, "article"));
  const existing = supplementsFor(topic.articleId);
  const covered = new Set(existing.map(({ geographyId }) => wardFor(geographyId).canonicalId));
  const requested = readOption(argv, "wards")?.split(",").map((id) => wardFor(id.trim()));
  const next = Number(readOption(argv, "next") ?? 3);
  const targets = requested ?? selectableWards().filter(({ canonicalId }) => !covered.has(canonicalId)).slice(0, next);
  if (!targets.length) throw new Error(`Every selectable location already has a ${topic.articleId} supplement.`);

  const model = existing.find(({ geographyId }) => geographyId.startsWith("jp-13")) ?? existing[0];
  const batchName = `${topic.slug}-${targets.map(({ slug }) => slug).join("-")}`.slice(0, 80);
  const directory = join(outputRoot, batchName);
  await mkdir(directory, { recursive: true });

  const targetRows = targets.map((ward) => {
    const host = officialHost(ward);
    const reusable = localGuidanceSupplements
      .filter(({ geographyId }) => wardFor(geographyId).canonicalId === ward.canonicalId)
      .flatMap(({ sourceIds }) => sourceIds)
      .filter((id, index, all) => all.indexOf(id) === index)
      .map((id) => `\`${id}\``)
      .join(", ");
    return { ward, host, reusable };
  });

  const fetchCommands = targetRows.map(({ ward, host }) => host
    ? `npm run local-guidance -- fetch https://${host}/ --follow --keywords ${topic.keywords.join(",")} --out ${shown(join(directory, ward.slug))}`
    : `# ${ward.nameEn}: no official host on record yet. Find the ward's official site (…lg.jp or its city domain), then run fetch with --keywords ${topic.keywords.join(",")}`);

  const advice = generalLocalAdvice[topic.articleId as keyof typeof generalLocalAdvice];
  const worksheet = [
    `# Local guidance worksheet: ${topic.articleId}`,
    "",
    `Generated ${today}. Current coverage for this guide: ${existing.length} location(s). Batch: ${targets.map(({ nameEn }) => nameEn).join(", ")}.`,
    "",
    "## Targets",
    "",
    "| Location | ID | Japanese | Official host | Sources already used for this location |",
    "|---|---|---|---|---|",
    ...targetRows.map(({ ward, host, reusable }) => `| ${ward.nameEn} | \`${ward.id}\` | ${ward.nameJa} | ${host ?? "unknown"} | ${reusable || "none"} |`),
    ...targets.filter(({ supported }) => !supported).map((ward) => `\n> **${ward.nameEn} is not a selectable location yet.** Add \`{ id: "${ward.canonicalId}", name: "${ward.nameEn}", aliases: [...], selectable: true }\` to \`src/data/local-guidance/geographies.ts\` in code order before adding supplements.`),
    "",
    "## 1. Find the official pages",
    "",
    "Fetch each location's site and follow the matching links. Read the saved `.md` files instead of opening full pages:",
    "",
    "```bash",
    ...fetchCommands,
    "```",
    "",
    "Then fetch the procedure page(s) you choose, e.g. `npm run local-guidance -- fetch <url> --out <same folder>`. Prefer the current Japanese procedure page over older English overviews, note each page's date, and use only the location's own official pages (or national government pages) as sources.",
    "",
    "## 2. What the supplement must cover",
    "",
    `The national guide (\`content/articles/${topic.articleId}.mdx\`) owns eligibility and general rules. A supplement adds only what is local: the responsible office and counters, filing period, documents that differ from the national list, online/postal routes, and local exceptions. Do not reproduce premiums, fee tables, or schedules that change; link to them.`,
    ...(advice ? ["", "Locations without a supplement show this general advice instead, so a supplement must be more specific than:", "", ...advice.steps.map((step) => `- ${step}`)] : []),
    "",
    "## 3. Conventions",
    "",
    `- Supplement ID \`<location>-${topic.slug}\` (e.g. \`${targets[0]!.slug}-${topic.slug}\`); add records to \`src/data/local-guidance/${topic.slug}.ts\` in administrative code order.`,
    `- Source IDs \`<location>-${topic.slug}-<detail>\`, added to \`src/data/sources/municipal-identity.ts\` with \`authorityLevel: "municipal-government"\`, the page's \`language\`, and \`lastCheckedAt: "${today}"\`. Reuse an existing source ID when it is the same page.`,
    "- `responsibleBody` is the English location name (e.g. \"Chiyoda City\"). Titles follow the pattern of the model record.",
    "- Japanese-language sources need `sourceFormatNote` stating the summary is Nihonest guidance, not an official translation.",
    "- Every concrete deadline, time, or fee in the English must appear on a cited page (the `--evidence` check verifies this).",
    "- Records stay `needs-review`; the shared review state in `src/data/local-guidance/shared.ts` sets it. Update its date comment if this batch is checked on a new date.",
    "- Do not create or change Japanese translation artifacts.",
    "",
    "## 4. Model record (existing supplement for this guide)",
    "",
    "```ts",
    model ? supplementSource(model) : "// No supplement exists for this guide yet; follow the address-registration records' shape.",
    "```",
    "",
    "## 5. Record the batch",
    "",
    `Add \`docs/research/<AREA>-${topic.slug.toUpperCase()}-<n>.md\`: inspection date, the locations and IDs, and one table row per location with the official evidence (linked) and the claim boundary (what the supplement does not promise). Note the next locations in code order.`,
    "",
    "## 6. Verify",
    "",
    "```bash",
    "npm run local-guidance -- verify",
    "```",
    "",
    "That is the whole verification for a data-only batch: the link and evidence check on the supplements you changed, plus the data tests. **Do not run** the full test suite, `tsc`, lint, `architecture:check`, Playwright, or a build; supplement and source records cannot affect them. No test edits are needed for a new batch. Run those checks only if you changed code (the script, components, or schemas).",
    "",
  ].join("\n");

  const path = join(directory, "WORKSHEET.md");
  await writeFile(path, worksheet);
  console.log(`Worksheet for ${targets.map(({ nameEn }) => nameEn).join(", ")} → ${shown(path)}`);
  console.log(fetchCommands.join("\n"));
}

// ---------------------------------------------------------------------------------------------- check

async function checkCommand(argv: readonly string[]): Promise<void> {
  const articleId = readOption(argv, "article");
  const only = readOption(argv, "only")?.split(",").map((id) => id.trim()).filter(Boolean);
  const supplements = (articleId ? supplementsFor(articleId) : [...localGuidanceSupplements])
    .filter(({ id }) => !only || only.includes(id));
  const errors: string[] = [];
  const warnings: string[] = [];

  const pairs = new Set<string>();
  for (const supplement of supplements) {
    const ward = wardFor(supplement.geographyId);
    const pair = `${supplement.articleId}:${ward.canonicalId}`;
    if (pairs.has(pair)) errors.push(`${supplement.id}: a second supplement for ${ward.nameEn} on ${supplement.articleId}.`);
    pairs.add(pair);
    if (!ward.supported) errors.push(`${supplement.id}: ${ward.nameEn} is not a selectable location in geographies.ts.`);
    if (!supplement.responsibleBody.includes(ward.nameEn.replace(/ City$/, ""))) warnings.push(`${supplement.id}: responsibleBody "${supplement.responsibleBody}" differs from "${ward.nameEn}".`);
    const host = officialHost(ward);
    for (const id of supplement.sourceIds) {
      const source = sourceById.get(id);
      if (!source) {
        errors.push(`${supplement.id}: source "${id}" does not exist.`);
        continue;
      }
      if (!source.lastCheckedAt) warnings.push(`${id}: no lastCheckedAt date.`);
      const sourceHost = new URL(source.url).host;
      if (host && officialDomain(sourceHost) !== officialDomain(host) && !sourceHost.endsWith(".go.jp")) warnings.push(`${id}: host ${sourceHost} differs from ${ward.nameEn}'s usual ${host}; confirm it is official.`);
      if (source.language === "ja" && !supplement.sourceFormatNote) warnings.push(`${supplement.id}: cites Japanese source ${id} but has no sourceFormatNote.`);
    }
  }

  const citedIds = [...new Set(supplements.flatMap(({ sourceIds }) => sourceIds))].filter((id) => sourceById.has(id));
  const pageCache = new Map<string, FetchedPage>();
  if (hasFlag(argv, "links") || hasFlag(argv, "evidence")) {
    const urls = [...new Set(citedIds.map((id) => sourceById.get(id)!.url))];
    console.log(`Fetching ${urls.length} source page(s)…`);
    for (const fetched of await inBatches(urls, 4, fetchPage)) pageCache.set(fetched.url, fetched);
    for (const url of urls) {
      const fetched = pageCache.get(url) ?? [...pageCache.values()].find((page) => page.url === url);
      if (!fetched || fetched.error || fetched.status >= 400) errors.push(`${url}: ${fetched?.error ?? `HTTP ${fetched?.status}`}`);
    }
  }

  if (hasFlag(argv, "evidence")) {
    for (const supplement of supplements) {
      const texts = supplement.sourceIds.map((id) => {
        const url = sourceById.get(id)?.url;
        return url ? pageCache.get(url)?.page?.text ?? "" : "";
      }).join("\n");
      if (!texts.trim()) {
        warnings.push(`${supplement.id}: no source text could be read for the evidence check (PDF or unreachable).`);
        continue;
      }
      const english = [supplement.summary, supplement.receivingOffice ?? "", ...supplement.actions.map(({ description }) => description)].join(" ");
      const missing = checkConcreteClaims(english, texts).filter(({ found }) => !found).map(({ claim }) => claim);
      if (missing.length) warnings.push(`${supplement.id}: not found in its cited pages: ${missing.join(", ")}.`);
    }
  }

  console.log(`Checked ${supplements.length} supplement(s)${articleId ? ` for ${articleId}` : ""}.`);
  for (const error of errors) console.log(`ERROR ${error}`);
  for (const warning of new Set(warnings)) console.log(`warn  ${warning}`);
  if (!errors.length && !warnings.length) console.log("No findings.");
  if (errors.length) process.exitCode = 1;
}

// ---------------------------------------------------------------------------------------------- verify

/** The data tests a local-guidance batch can affect. Everything else is unaffected by supplement and source data. */
const dataTests = [
  "src/domain/geography/local-guidance.test.ts",
  "src/lib/content/prefecture-finder.test.ts",
  "src/data/sources.test.ts",
];

/** Supplement IDs whose records changed against HEAD, found by mapping diff hunks onto each record's lines. */
function changedSupplementIds(): string[] {
  const diff = execFileSync("git", ["diff", "-U0", "HEAD", "--", "src/data/local-guidance"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  const changedLines = new Map<string, number[]>();
  let file = "";
  for (const line of diff.split("\n")) {
    const header = line.match(/^\+\+\+ b\/(.+)$/);
    if (header) file = header[1]!;
    const hunk = line.match(/^@@ -\S+ \+(\d+)(?:,(\d+))? @@/);
    if (hunk && file) {
      const start = Number(hunk[1]);
      const count = hunk[2] === undefined ? 1 : Number(hunk[2]);
      changedLines.set(file, [...(changedLines.get(file) ?? []), ...Array.from({ length: count }, (_, offset) => start + offset)]);
    }
  }
  const ids = new Set<string>();
  for (const [path, lines] of changedLines) {
    const source = readFileSync(resolve(process.cwd(), path), "utf8").split("\n");
    const starts = source.flatMap((text, index) => {
      const id = text.match(/^\s*id: "([a-z0-9-]+)", articleId:/)?.[1];
      return id ? [{ line: index + 1, id }] : [];
    });
    for (const line of lines) {
      const record = starts.filter((start) => start.line <= line + 1).at(-1);
      if (record) ids.add(record.id);
    }
  }
  return [...ids].filter((id) => localGuidanceSupplements.some((supplement) => supplement.id === id));
}

/**
 * The whole verification for a research batch, with compact output: the link and evidence check on the
 * supplements changed since HEAD, then the data tests. Code changes (script, components, schemas) still need the
 * normal type, lint, architecture, and browser checks; data-only batches do not. See LOCAL-GUIDANCE-WORKFLOW.md.
 */
async function verifyCommand(): Promise<void> {
  const changed = changedSupplementIds();
  if (changed.length) {
    console.log(`Changed supplements: ${changed.join(", ")}`);
    await checkCommand(["--only", changed.join(","), "--links", "--evidence"]);
  } else {
    console.log("No supplement records changed since HEAD; skipping the link and evidence check.");
  }
  const tests = spawnSync(process.execPath, [resolve(process.cwd(), "node_modules/vitest/vitest.mjs"), "run", ...dataTests, "--reporter=dot"], { encoding: "utf8" });
  const output = `${tests.stdout}${tests.stderr}`;
  const summary = output.split("\n").filter((line) => /Test Files|Tests |FAIL|×|AssertionError|Error:/.test(line)).slice(0, 20);
  console.log(summary.join("\n"));
  if (tests.status !== 0) process.exitCode = 1;
  console.log(process.exitCode ? "verify: FAILED" : "verify: passed");
}

// ---------------------------------------------------------------------------------------------- entry

async function main(): Promise<void> {
  const [command, ...argv] = process.argv.slice(2);
  trustSystemCertificates();
  if (command === "coverage") return coverageCommand();
  if (command === "worksheet") return worksheetCommand(argv);
  if (command === "fetch") return fetchCommand(argv);
  if (command === "check") return checkCommand(argv);
  if (command === "verify") return verifyCommand();
  console.log(await readFile(resolve(process.cwd(), "scripts/local-guidance.ts"), "utf8").then((source) => source.match(/\/\*\*([\s\S]*?)\*\//)?.[1]?.replace(/^ \* ?/gm, "") ?? ""));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
