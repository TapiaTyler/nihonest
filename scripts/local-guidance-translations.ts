/**
 * Japanese translation workflow for municipality guidance. One file per location, so several agents can work on
 * different locations at the same time. See content/translations/LOCAL-GUIDANCE-TRANSLATION.md.
 *
 *   npm run local-guidance:ja -- sync                          create missing per-location files and regenerate indexes
 *   npm run local-guidance:ja -- status [--prefecture tokyo]   current, stale, missing, and unchecked counts per location
 *   npm run local-guidance:ja -- worksheet --location jp-11201 [--all]
 *   npm run local-guidance:ja -- draft --location jp-11201,tokyo/adachi | --prefecture saitama,chiba [--all] [--ids <supplementId>,...] [--model opus]
 *   npm run local-guidance:ja -- integrate <draft dir> --generator codex-drafted --model <model>
 *   npm run local-guidance:ja -- check [--location jp-11201]
 *   npm run local-guidance:ja -- review --location jp-11201 [--ids a,b]
 *   npm run local-guidance:ja -- compare <draft dir> | --location jp-11201   English and Japanese side by side for review
 */
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join, relative, resolve, sep } from "node:path";
import { localGuidanceLocations } from "@/data/local-guidance";
import { residenceStatuses } from "@/data/residence-statuses";
import { japaneseProtectedTerminology } from "@/data/translations/ja/protected-terminology";
import {
  japaneseLocalGuidancePromptRevisions, localGuidanceGenerators,
  type LocalGuidanceGenerator, type LocalGuidanceTranslationEntry, type LocationTranslations,
} from "@/data/translations/ja/local-guidance/define";
import type { LocalGuidanceSupplement } from "@/domain/geography/local-guidance";
import { checkLocalGuidanceTranslation } from "@/domain/translation/local-guidance-translation-checks";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision-core";
import { hasFlag, readOption, timestamp } from "./glossary-translation/cli-options";
import { runClaude } from "./glossary-translation/glossary-draft";

const root = resolve(import.meta.dirname, "..");
const englishRoot = join(root, "src/data/local-guidance/locations");
const japaneseRoot = join(root, "src/data/translations/ja/local-guidance");
const promptPath = join(root, "content/translations/JAPANESE-LOCAL-GUIDANCE-PROMPT.md");
const workRoot = join(root, ".local-guidance/translation");
const shown = (path: string) => relative(root, path).split("\\").join("/");

type LocationFile = Readonly<{ id: string; name: string; prefecture: string; city: string; japanesePath: string; supplements: readonly LocalGuidanceSupplement[] }>;

/** English location files, found by their `geography: { id }` line, joined with the loaded supplements. */
async function locationFiles(): Promise<LocationFile[]> {
  const files: LocationFile[] = [];
  for (const prefecture of (await readdir(englishRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()) {
    for (const file of (await readdir(join(englishRoot, prefecture))).filter((name) => name.endsWith(".ts") && name !== "index.ts").sort()) {
      const source = await readFile(join(englishRoot, prefecture, file), "utf8");
      const id = /geography: \{ id: "([^"]+)"/.exec(source)?.[1];
      if (!id) throw new Error(`No geography ID in ${prefecture}/${file}.`);
      const location = localGuidanceLocations.find(({ geography }) => geography.id === id);
      if (!location) throw new Error(`${prefecture}/${file} (${id}) is not registered; run the English add-location step first.`);
      const city = basename(file, ".ts");
      files.push({ id, name: location.geography.name, prefecture, city, japanesePath: join(japaneseRoot, prefecture, `${city}.ts`), supplements: location.supplements });
    }
  }
  return files;
}

const englishFields = (supplement: LocalGuidanceSupplement) => translationSourceFields["local-guidance-supplement"](supplement);
const sourceRevisionOf = (supplement: LocalGuidanceSupplement) => createTranslationSourceRevision(englishFields(supplement));
const promptRevisionOf = async () => createTranslationSourceRevision({ source: await readFile(promptPath, "utf8") });

async function currentPromptRevision(): Promise<string> {
  const revision = await promptRevisionOf();
  if (!(Object.values(japaneseLocalGuidancePromptRevisions) as string[]).includes(revision)) {
    throw new Error(`The prompt changed (revision ${revision}). Claude adds it to japaneseLocalGuidancePromptRevisions in define.ts before new drafts are integrated.`);
  }
  return revision;
}

// ---------- Generated files ----------

const q = (value: unknown) => JSON.stringify(value);

function locationSource(location: LocationFile, entries: readonly LocalGuidanceTranslationEntry[]): string {
  const order = new Map(location.supplements.map(({ id }, index) => [id, index]));
  const sorted = [...entries].sort((left, right) => (order.get(left.supplementId) ?? 999) - (order.get(right.supplementId) ?? 999));
  const body = sorted.map((entry) => [
    "  {",
    `    supplementId: ${q(entry.supplementId)},`,
    `    sourceRevision: ${q(entry.sourceRevision)},`,
    `    generator: ${q(entry.generator)},`,
    `    model: ${q(entry.model)},`,
    `    promptRevision: ${q(entry.promptRevision)},`,
    `    generatedAt: ${q(entry.generatedAt)},`,
    "    fields: {",
    ...Object.entries(entry.fields).map(([key, value]) => `      ${q(key)}: ${q(value)},`),
    "    },",
    "  },",
  ].join("\n"));
  return [
    'import { defineLocalGuidanceTranslations } from "../define";',
    "",
    `/** Japanese municipality guidance for ${location.name} (${location.id}). Workflow: content/translations/LOCAL-GUIDANCE-TRANSLATION.md. */`,
    `export const translations = defineLocalGuidanceTranslations(${q(location.id)}, [`,
    ...(body.length ? [body.join("\n")] : []),
    "]);",
    "",
  ].join("\n");
}

async function sync(): Promise<void> {
  const locations = await locationFiles();
  let created = 0;
  for (const location of locations) {
    if (existsSync(location.japanesePath)) continue;
    await mkdir(join(japaneseRoot, location.prefecture), { recursive: true });
    await writeFile(location.japanesePath, locationSource(location, []));
    created += 1;
  }
  const prefectures = [...new Set(locations.map(({ prefecture }) => prefecture))].sort();
  for (const prefecture of prefectures) {
    const cities = locations.filter((location) => location.prefecture === prefecture).map(({ city }) => city).sort();
    await writeFile(join(japaneseRoot, prefecture, "index.ts"), [
      ...cities.map((city) => `import { translations as ${city} } from "./${city}";`),
      "",
      "/** Generated by `npm run local-guidance:ja -- sync`; one line per location file. */",
      "export const prefectureTranslations = [",
      ...cities.map((city) => `  ${city},`),
      "] as const;",
      "",
    ].join("\n"));
  }
  await writeFile(join(japaneseRoot, "index.ts"), [
    'import type { LocationTranslations } from "./define";',
    ...prefectures.map((prefecture) => `import { prefectureTranslations as ${prefecture} } from "./${prefecture}";`),
    "",
    "/** Generated by `npm run local-guidance:ja -- sync`; one line per prefecture folder. */",
    "export const japaneseLocalGuidanceLocationTranslations: readonly LocationTranslations[] = [",
    ...prefectures.map((prefecture) => `  ...${prefecture},`),
    "];",
    "",
    "export const japaneseLocalGuidanceTranslations = japaneseLocalGuidanceLocationTranslations.flatMap(({ artifacts }) => artifacts);",
    "",
  ].join("\n"));
  const english = new Set(locations.map(({ japanesePath }) => japanesePath));
  const orphaned: string[] = [];
  for (const prefecture of (await readdir(japaneseRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory())) {
    for (const file of await readdir(join(japaneseRoot, prefecture.name))) {
      const path = join(japaneseRoot, prefecture.name, file);
      if (file !== "index.ts" && file.endsWith(".ts") && !english.has(path)) orphaned.push(shown(path));
    }
  }
  console.log(`Created ${created} location file(s); indexes cover ${locations.length} locations in ${prefectures.length} prefectures.`);
  if (orphaned.length) console.log(`No English location for (not deleted, check manually):\n${orphaned.map((path) => `  ${path}`).join("\n")}`);
}

// ---------- Loading current Japanese ----------

async function japaneseByLocation(): Promise<Map<string, LocationTranslations>> {
  const { japaneseLocalGuidanceLocationTranslations } = await import("@/data/translations/ja/local-guidance");
  return new Map(japaneseLocalGuidanceLocationTranslations.map((item) => [item.locationId, item]));
}

type SupplementState = "current" | "stale" | "missing";

function stateOf(supplement: LocalGuidanceSupplement, entry: LocalGuidanceTranslationEntry | undefined): SupplementState {
  if (!entry) return "missing";
  return entry.sourceRevision === sourceRevisionOf(supplement) ? "current" : "stale";
}

async function status(argv: readonly string[]): Promise<void> {
  const prefecture = readOption(argv, "prefecture");
  const japanese = await japaneseByLocation();
  const rows: string[] = [];
  const totals = { current: 0, stale: 0, missing: 0, unchecked: 0 };
  for (const location of (await locationFiles()).filter((item) => !prefecture || item.prefecture === prefecture)) {
    const entries = new Map((japanese.get(location.id)?.entries ?? []).map((entry) => [entry.supplementId, entry]));
    const counts = { current: 0, stale: 0, missing: 0, unchecked: 0 };
    for (const supplement of location.supplements) {
      const entry = entries.get(supplement.id);
      counts[stateOf(supplement, entry)] += 1;
      if (entry?.generator === "codex-drafted") counts.unchecked += 1;
    }
    for (const key of Object.keys(totals) as (keyof typeof totals)[]) totals[key] += counts[key];
    rows.push(`| ${location.id} | ${location.prefecture}/${location.city} | ${location.supplements.length} | ${counts.current} | ${counts.stale} | ${counts.missing} | ${counts.unchecked} |`);
  }
  console.log(["| Location | File | Guides | Current | Stale | Missing | Codex, unchecked |", "|---|---|---:|---:|---:|---:|---:|", ...rows].join("\n"));
  console.log(`\nTotal: ${totals.current} current, ${totals.stale} stale, ${totals.missing} missing; ${totals.unchecked} Codex drafts await Claude's check.`);
}

// ---------- Context for translators ----------

/** Cached official pages from `npm run local-guidance -- fetch`, keyed by URL. */
async function cachedPages(): Promise<Map<string, string>> {
  const pages = new Map<string, string>();
  const cacheRoot = join(root, ".local-guidance");
  if (!existsSync(cacheRoot)) return pages;
  // Research folders keep fetched pages at any depth (`adachi/p/…md`); translation work output is skipped.
  for (const entry of await readdir(cacheRoot, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const path = join(entry.parentPath, entry.name);
    if (relative(cacheRoot, path).split(sep)[0] === "translation") continue;
    const url = /^- URL: (\S+)/m.exec((await readFile(path, "utf8")).slice(0, 2000))?.[1];
    if (url) pages.set(url, path);
  }
  return pages;
}

function sourcesFor(sourceIds: LocalGuidanceSupplement["sourceIds"], locationSources: readonly { id: string; title: string; url: string }[]) {
  return sourceIds.flatMap((id) => locationSources.filter((source) => source.id === id));
}

function sharedTerms(): string {
  return [
    "## Official residence-status names",
    residenceStatuses.map(({ englishName, japaneseName }) => `${englishName} → 「${japaneseName}」`).join("\n"),
    "## Protected terminology",
    japaneseProtectedTerminology.map(({ value, replacement }) => `- ${value} → ${replacement ?? value}`).join("\n"),
  ].join("\n\n");
}

async function sameGuideExamples(articleId: string, exclude: string): Promise<string[]> {
  const japanese = await japaneseByLocation();
  const examples: string[] = [];
  for (const location of localGuidanceLocations) {
    if (location.geography.id === exclude) continue;
    const entries = japanese.get(location.geography.id)?.entries ?? [];
    for (const supplement of location.supplements.filter((item) => item.articleId === articleId)) {
      const entry = entries.find((item) => item.supplementId === supplement.id && item.generator !== "codex-drafted");
      if (entry && stateOf(supplement, entry) === "current") examples.push(`${supplement.title} → ${entry.fields.title}`);
    }
    if (examples.length >= 3) break;
  }
  return examples;
}

function selectLocations(all: readonly LocationFile[], argv: readonly string[]): LocationFile[] {
  const locationId = readOption(argv, "location");
  const prefecture = readOption(argv, "prefecture");
  if (!locationId && !prefecture) throw new Error("Pass --location <id> or --prefecture <folder>.");
  // Both options take a comma-separated list; a location is its ID (jp-13121) or its folder path (tokyo/adachi).
  const wanted = (locationId ?? prefecture)!.split(",").map((value) => value.trim()).filter(Boolean);
  const selected = wanted.flatMap((value) => {
    const matches = all.filter((item) => (locationId ? item.id === value || `${item.prefecture}/${item.city}` === value : item.prefecture === value));
    if (!matches.length) throw new Error(`No location matches ${value}.`);
    return matches;
  });
  return selected;
}

async function pendingSupplements(location: LocationFile, includeAll: boolean) {
  const entries = new Map(((await japaneseByLocation()).get(location.id)?.entries ?? []).map((entry) => [entry.supplementId, entry]));
  return location.supplements
    .map((supplement) => ({ supplement, entry: entries.get(supplement.id), state: stateOf(supplement, entries.get(supplement.id)) }))
    .filter(({ state }) => includeAll || state !== "current");
}

/** One worksheet per location; `--location` takes a comma-separated list for a regional batch. */
async function worksheet(argv: readonly string[]): Promise<void> {
  if (readOption(argv, "prefecture")) throw new Error("Worksheets are per location: pass --location <id>[,<id>...].");
  const pages = await cachedPages();
  for (const location of selectLocations(await locationFiles(), argv)) await worksheetFor(location, pages, argv);
}

async function worksheetFor(location: LocationFile, pages: Map<string, string>, argv: readonly string[]): Promise<void> {
  const localSources = localGuidanceLocations.find(({ geography }) => geography.id === location.id)!.sources;
  const draftDirectory = join(workRoot, location.id);
  await mkdir(draftDirectory, { recursive: true });
  const pending = await pendingSupplements(location, hasFlag(argv, "all"));
  const sections: string[] = [];
  for (const { supplement, entry, state } of pending) {
    const sources = sourcesFor(supplement.sourceIds, localSources);
    sections.push([
      `## ${supplement.id} (${state})`,
      `Guide: ${supplement.articleId}. Write \`${shown(join(draftDirectory, `${supplement.id}.json`))}\`.`,
      "",
      "Official sources (restore official Japanese names from these):",
      ...sources.map((source) => `- ${source.title}: ${source.url}${pages.has(source.url) ? ` (cached: \`${shown(pages.get(source.url)!)}\`)` : ""}`),
      "",
      ...(await sameGuideExamples(supplement.articleId, location.id)).map((example, index) => `${index ? "" : "Accepted titles for this guide elsewhere:\n"}- ${example}`),
      "",
      "English (canonical):",
      "```json",
      JSON.stringify(englishFields(supplement), null, 2),
      "```",
      ...(entry ? ["", `Current Japanese (${state}; update only what the English change requires):`, "```json", JSON.stringify(entry.fields, null, 2), "```"] : []),
    ].join("\n"));
  }
  const path = join(workRoot, `${location.id}.md`);
  await writeFile(path, [
    `# Japanese translation worksheet: ${location.name} (${location.id})`,
    "",
    `Target file: \`${shown(location.japanesePath)}\` (written by integrate; do not edit it by hand while drafting).`,
    "",
    "1. Follow `content/translations/JAPANESE-LOCAL-GUIDANCE-PROMPT.md` and the decisions in `content/translations/LOCAL-GUIDANCE-TRANSLATION.md`.",
    `2. For each section below, write \`<supplementId>.json\` in \`${shown(draftDirectory)}/\` as {"fields": {...same keys, Japanese values...}, "flags": ["...translation questions..."], "sourceNotes": ["...where the official page differs from the English..."]}.`,
    `3. Run \`npm run local-guidance:ja -- integrate ${shown(draftDirectory)} --generator codex-drafted --model <your model>\`, then \`npm run local-guidance:ja -- check --location ${location.id}\`.`,
    "4. Report the location and every flag to the user so Claude can check the drafts.",
    "",
    pending.length ? `${pending.length} guide(s) need work.` : "Every guide is current. Use --all to include current ones.",
    "",
    sharedTerms(),
    "",
    ...sections,
    "",
  ].join("\n"));
  console.log(`Wrote ${shown(path)} (${pending.length} guide(s)). Drafts go in ${shown(draftDirectory)}/.`);
}

// ---------- Claude pipeline ----------

async function pageExcerpts(urls: readonly string[], pages: Map<string, string>): Promise<string> {
  const excerpts: string[] = [];
  for (const url of urls) {
    const path = pages.get(url);
    if (!path) continue;
    const text = (await readFile(path, "utf8")).split("## Page text")[1] ?? "";
    excerpts.push(`### ${url}\n${text.trim().slice(0, 3500)}`);
  }
  return excerpts.length ? `## Official page excerpts (Japanese)\n\n${excerpts.join("\n\n")}` : "## Official page excerpts\n\nNone cached; flag any official name you are unsure of.";
}

function parseDraft(text: string): { fields: Record<string, string>; flags: string[]; sourceNotes: string[] } {
  const start = text.indexOf("{");
  let depth = 0;
  let end = -1;
  let inString = false;
  for (let index = start; index < text.length; index += 1) {
    const character = text[index]!;
    if (inString) {
      if (character === "\\") index += 1;
      else if (character === "\"") inString = false;
    } else if (character === "\"") inString = true;
    else if (character === "{") depth += 1;
    else if (character === "}" && (depth -= 1) === 0) { end = index; break; }
  }
  if (start < 0 || end < 0) throw new Error("No JSON object in the draft.");
  const fields = JSON.parse(text.slice(start, end + 1)) as Record<string, string>;
  const tail = text.slice(end + 1);
  const section = (pattern: RegExp) => {
    const body = pattern.exec(tail)?.[1]?.trim() ?? "";
    return body && !/^none\.?$/i.test(body) ? body.split("\n").map((line) => line.replace(/^[-*]\s*/, "").trim()).filter(Boolean) : [];
  };
  // Translation questions for the reviewer, then differences between the English and the official page.
  return { fields, flags: section(/FLAGS:\s*([\s\S]*?)(?=SOURCE NOTES:|$)/), sourceNotes: section(/SOURCE NOTES:\s*([\s\S]*)$/) };
}

async function draft(argv: readonly string[]): Promise<void> {
  await currentPromptRevision();
  const locations = selectLocations(await locationFiles(), argv);
  const pages = await cachedPages();
  const outputDirectory = join(workRoot, `claude-${timestamp()}`);
  await mkdir(outputDirectory, { recursive: true });
  const jobs: { location: LocationFile; supplement: LocalGuidanceSupplement; current?: Readonly<Record<string, string>> }[] = [];
  for (const location of locations) {
    for (const { supplement, entry } of await pendingSupplements(location, hasFlag(argv, "all"))) jobs.push({ location, supplement, current: entry?.fields });
  }
  // `--ids a,b` redrafts only those supplements, for example after missing pages were fetched.
  const ids = readOption(argv, "ids")?.split(",").map((id) => id.trim()).filter(Boolean);
  if (ids) jobs.splice(0, jobs.length, ...jobs.filter(({ supplement }) => ids.includes(supplement.id)));
  const model = readOption(argv, "model") ?? "opus";
  const problems: string[] = [];
  const flagged: string[] = [];
  const sourceNotes: string[] = [];
  let cost = 0;
  const queue = [...jobs];
  await Promise.all(Array.from({ length: 6 }, async () => {
    for (let job = queue.shift(); job; job = queue.shift()) {
      const { location, supplement, current } = job;
      try {
        const localSources = localGuidanceLocations.find(({ geography }) => geography.id === location.id)!.sources;
        const urls = sourcesFor(supplement.sourceIds, localSources).map(({ url }) => url);
        const examples = await sameGuideExamples(supplement.articleId, location.id);
        const prompt = [
          `Location: ${location.name} (${location.id}). Guide: ${supplement.articleId}.`,
          examples.length ? `Accepted titles for this guide elsewhere:\n${examples.map((example) => `- ${example}`).join("\n")}` : "",
          sharedTerms(),
          await pageExcerpts(urls, pages),
          current ? `## Previous Japanese (the English has changed; keep unchanged wording)\n${JSON.stringify(current, null, 1)}` : "",
          "## English to translate",
          JSON.stringify(englishFields(supplement), null, 1),
        ].filter(Boolean).join("\n\n");
        const run = await runClaude(prompt, { model, effort: "high", budgetUsd: 1, systemPromptPath: promptPath, rawOnly: true });
        cost += run.costUsd;
        const result = (JSON.parse(run.raw) as { result: string }).result;
        const parsed = parseDraft(result);
        const issues = checkLocalGuidanceTranslation(englishFields(supplement), parsed.fields);
        for (const issue of issues) problems.push(`${supplement.id} ${issue.key}: ${issue.message}`);
        for (const flag of parsed.flags) flagged.push(`${supplement.id}: ${flag}`);
        for (const note of parsed.sourceNotes) sourceNotes.push(`${supplement.id}: ${note}`);
        await writeFile(join(outputDirectory, `${supplement.id}.json`), `${JSON.stringify(parsed, null, 1)}\n`);
      } catch (error) {
        problems.push(`${supplement.id}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }));
  await writeFile(join(outputDirectory, "summary.md"), [
    `# Claude drafts (${jobs.length} guides, $${cost.toFixed(2)})`, "", "## Check problems", problems.join("\n") || "None.", "", "## Flags (translation questions)", flagged.join("\n") || "None.", "",
    "## Source notes (the official page differs from or adds to the English; the draft kept the English)", sourceNotes.join("\n") || "None.", "",
    `Review every draft against its English and official pages, fix it in place, then run:\n\nnpm run local-guidance:ja -- integrate ${shown(outputDirectory)} --generator claude-code-claude-reviewed --model ${model}`, "",
  ].join("\n"));
  console.log(`Drafted ${jobs.length} guide(s) · $${cost.toFixed(2)} · ${problems.length} problem(s) · ${flagged.length} flag(s)\nOutput: ${shown(outputDirectory)}`);
  if (problems.length) process.exitCode = 1;
  else if (flagged.length) process.exitCode = 2;
}

// ---------- Integration and checks ----------

async function writeLocation(location: LocationFile, entries: readonly LocalGuidanceTranslationEntry[]): Promise<void> {
  await writeFile(location.japanesePath, locationSource(location, entries));
}

async function integrate(argv: readonly string[]): Promise<void> {
  const directory = argv.find((argument, index) => index > 0 && !argument.startsWith("--") && !["--generator", "--model"].includes(argv[index - 1]!));
  const generator = readOption(argv, "generator") as LocalGuidanceGenerator | undefined;
  const model = readOption(argv, "model");
  if (!directory) throw new Error("Pass the draft directory.");
  if (!generator || !(generator in localGuidanceGenerators) || generator === "codex-drafted-claude-reviewed") {
    throw new Error("Pass --generator codex-drafted (Codex) or claude-code-claude-reviewed (Claude pipeline). Claude marks checked Codex drafts with `review`.");
  }
  if (!model) throw new Error("Pass --model with the model that drafted the text.");
  const promptRevision = await currentPromptRevision();
  const locations = await locationFiles();
  const japanese = await japaneseByLocation();
  const updates = new Map<string, Map<string, LocalGuidanceTranslationEntry>>();
  const failures: string[] = [];
  let integrated = 0;
  const files = (await readdir(resolve(root, directory))).filter((file) => file.endsWith(".json")).sort();
  for (const file of files) {
    const supplementId = basename(file, ".json");
    const location = locations.find((item) => item.supplements.some(({ id }) => id === supplementId));
    const supplement = location?.supplements.find(({ id }) => id === supplementId);
    if (!location || !supplement) { failures.push(`${file}: no English supplement with this ID.`); continue; }
    const raw = JSON.parse(await readFile(resolve(root, directory, file), "utf8")) as { fields?: Record<string, string> } & Record<string, unknown>;
    const fields = (raw.fields ?? raw) as Record<string, string>;
    const errors = checkLocalGuidanceTranslation(englishFields(supplement), fields).filter(({ level }) => level === "error");
    if (errors.length) { failures.push(...errors.map(({ key, message }) => `${supplementId} ${key}: ${message}`)); continue; }
    const entries = updates.get(location.id) ?? new Map((japanese.get(location.id)?.entries ?? []).map((entry) => [entry.supplementId, entry]));
    const english = englishFields(supplement);
    entries.set(supplementId, {
      supplementId, sourceRevision: sourceRevisionOf(supplement), generator, model, promptRevision,
      generatedAt: new Date().toISOString(),
      fields: Object.fromEntries(Object.keys(english).map((key) => [key, fields[key]!])),
    });
    updates.set(location.id, entries);
    integrated += 1;
  }
  for (const [locationId, entries] of updates) await writeLocation(locations.find(({ id }) => id === locationId)!, [...entries.values()]);
  console.log(`Integrated ${integrated} artifact(s) across ${updates.size} location file(s).`);
  if (failures.length) {
    console.log(`Not integrated (fix the draft and rerun):\n${failures.map((line) => `  ${line}`).join("\n")}`);
    process.exitCode = 1;
  }
}

async function check(argv: readonly string[]): Promise<void> {
  const locationId = readOption(argv, "location");
  const knownPrompts = new Set(Object.values(japaneseLocalGuidancePromptRevisions) as string[]);
  const japanese = await japaneseByLocation();
  const problems: string[] = [];
  let checked = 0;
  for (const location of (await locationFiles()).filter((item) => !locationId || item.id === locationId)) {
    if (!existsSync(location.japanesePath)) { problems.push(`${location.id}: no Japanese file; run sync.`); continue; }
    for (const entry of japanese.get(location.id)?.entries ?? []) {
      checked += 1;
      const supplement = location.supplements.find(({ id }) => id === entry.supplementId);
      if (!supplement) { problems.push(`${entry.supplementId}: not a supplement of ${location.id}.`); continue; }
      if (entry.sourceRevision !== sourceRevisionOf(supplement)) problems.push(`${entry.supplementId}: stale; the English changed after this translation.`);
      if (!knownPrompts.has(entry.promptRevision)) problems.push(`${entry.supplementId}: unknown prompt revision.`);
      for (const issue of checkLocalGuidanceTranslation(englishFields(supplement), entry.fields)) problems.push(`${entry.supplementId} ${issue.key}: ${issue.message}`);
    }
  }
  console.log(`Checked ${checked} artifact(s).${problems.length ? `\n${problems.join("\n")}` : " No problems."}`);
  if (problems.length) process.exitCode = 1;
}

async function review(argv: readonly string[]): Promise<void> {
  const [location] = selectLocations(await locationFiles(), argv);
  if (!location) return;
  const ids = readOption(argv, "ids")?.split(",").map((id) => id.trim()).filter(Boolean);
  const entries = (await japaneseByLocation()).get(location.id)?.entries ?? [];
  let marked = 0;
  const next = entries.map((entry) => {
    if (entry.generator !== "codex-drafted" || (ids && !ids.includes(entry.supplementId))) return entry;
    const supplement = location.supplements.find(({ id }) => id === entry.supplementId);
    const errors = supplement ? checkLocalGuidanceTranslation(englishFields(supplement), entry.fields).filter(({ level }) => level === "error") : [];
    if (!supplement || entry.sourceRevision !== sourceRevisionOf(supplement) || errors.length) {
      throw new Error(`${entry.supplementId} is stale or fails checks; fix it before marking it checked.`);
    }
    marked += 1;
    return { ...entry, generator: "codex-drafted-claude-reviewed" as const };
  });
  await writeLocation(location, next);
  console.log(`Marked ${marked} Codex draft(s) in ${location.id} as checked by Claude.`);
}

/** Prints each supplement's English and Japanese field by field, from a draft directory or a location's integrated file. */
async function compare(argv: readonly string[]): Promise<void> {
  const locations = await locationFiles();
  const pairs: { supplement: LocalGuidanceSupplement; japanese: Readonly<Record<string, string>> }[] = [];
  const locationId = readOption(argv, "location");
  if (locationId) {
    const location = locations.find(({ id }) => id === locationId);
    if (!location) throw new Error(`No location ${locationId}.`);
    const entries = (await japaneseByLocation()).get(location.id)?.entries ?? [];
    for (const entry of entries) pairs.push({ supplement: location.supplements.find(({ id }) => id === entry.supplementId)!, japanese: entry.fields });
  } else {
    const directory = argv[1];
    if (!directory) throw new Error("Pass a draft directory or --location <id>.");
    for (const file of (await readdir(resolve(root, directory))).filter((name) => name.endsWith(".json")).sort()) {
      const supplement = locations.flatMap((item) => item.supplements).find(({ id }) => `${id}.json` === file);
      if (!supplement) continue;
      const raw = JSON.parse(await readFile(resolve(root, directory, file), "utf8")) as { fields?: Record<string, string> };
      pairs.push({ supplement, japanese: raw.fields ?? (raw as Record<string, string>) });
    }
  }
  for (const { supplement, japanese } of pairs) {
    console.log(`
### ${supplement.id}`);
    for (const [key, english] of Object.entries(englishFields(supplement))) console.log(`[${key}] ${english}
  → ${japanese[key] ?? "(missing)"}`);
  }
}

async function main(): Promise<void> {
  const [command, ...rest] = process.argv.slice(2);
  const argv = [command ?? "", ...rest];
  if (command === "sync") return sync();
  if (command === "status") return status(argv);
  if (command === "worksheet") return worksheet(argv);
  if (command === "draft") return draft(argv);
  if (command === "integrate") return integrate(argv);
  if (command === "check") return check(argv);
  if (command === "review") return review(argv);
  if (command === "compare") return compare(argv);
  if (command === "prompt-revision") { console.log(await promptRevisionOf()); return; }
  throw new Error("Commands: sync, status, worksheet, draft, integrate, check, review, compare, prompt-revision.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
