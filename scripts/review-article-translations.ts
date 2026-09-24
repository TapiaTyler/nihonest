/**
 * Tier-3 model review of Japanese article translations. One isolated Claude call per article pairs each English
 * H2 section with its Japanese section and returns findings only; nothing is applied. Claude (the agent) reviews
 * each finding before changing a translation. The system prompt is ARTICLE-REVIEW-PROMPT.md plus the recorded
 * decisions from CLAUDE-TRANSLATION-REPORT.md.
 *
 *   npm run localization:articles:review -- --ids medical-stay-visa,startup-visa
 *   npm run localization:articles:review -- --topic immigration --limit 10 [--concurrency 4] [--model sonnet]
 *   npm run localization:articles:review -- --all [--exclude a,b]
 */
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { z } from "zod";
import { glossaryTerms } from "@/data/glossary";
import { currentJapaneseArticleTranslations } from "@/data/translations/ja/article-translations";
import { defaultClaudeOptions, hasFlag, readOption, timestamp } from "./glossary-translation/cli-options";
import { draftRoot, runClaude, stripMetadata } from "./glossary-translation/glossary-draft";

const findingSchema = z.object({
  section: z.string(),
  quote: z.string(),
  english: z.string(),
  problem: z.string(),
  fix: z.string(),
  severity: z.enum(["error", "warning"]),
});
type ReviewFinding = z.infer<typeof findingSchema>;

type EnglishArticle = Readonly<{ body: string; topicIds: readonly string[] }>;

/** Splits a Markdown body at its H2 headings; the text before the first H2 is the intro. */
function sections(body: string): { heading: string; text: string }[] {
  const result: { heading: string; text: string }[] = [{ heading: "(intro)", text: "" }];
  for (const line of body.split("\n")) {
    if (/^##\s/.test(line)) result.push({ heading: line.replace(/^##\s+/, "").trim(), text: "" });
    result[result.length - 1].text += `${line}\n`;
  }
  return result.filter((section) => section.text.trim());
}

async function readEnglishArticles(): Promise<Map<string, EnglishArticle>> {
  const directory = resolve(process.cwd(), "content/articles");
  const articles = new Map<string, EnglishArticle>();
  for (const file of (await readdir(directory)).filter((name) => name.endsWith(".mdx"))) {
    const source = (await readFile(join(directory, file), "utf8")).replace(/\r\n?/g, "\n");
    const id = source.match(/\bid:\s*"([a-z0-9-]+)"/)?.[1];
    const topicIds = [...(source.match(/topicIds:\s*\[([^\]]*)\]/)?.[1] ?? "").matchAll(/"([a-z-]+)"/g)].map(([, topic]) => topic);
    if (id) articles.set(id, { body: stripMetadata(source).trim(), topicIds });
  }
  return articles;
}

function buildPrompt(id: string, english: string, japanese: string): string {
  const en = sections(english);
  const ja = sections(japanese);
  const slugs = new Set([...japanese.matchAll(/\]\(\/glossary\/([a-z0-9-]+)\)/g)].map(([, slug]) => slug));
  const glossary = glossaryTerms.filter((term) => slugs.has(term.slug)).map((term) => `- ${term.japanese} (${term.englishName})`).join("\n");
  const pairs = en.map((section, index) => `### English section: ${section.heading}\n${section.text.trim()}\n\n### Japanese section\n${ja[index]?.text.trim() ?? "(missing)"}`).join("\n\n---\n\n");
  const note = en.length === ja.length ? "" : `\nNote: the English has ${en.length} sections and the Japanese has ${ja.length}; pairs may be misaligned after a missing section.\n`;
  return `Article: ${id}\n\nGlossary headwords linked in this article:\n${glossary || "(none)"}\n${note}\n${pairs}\n\nReturn the JSON array of findings.`;
}

function parseFindings(raw: string): ReviewFinding[] {
  const envelope = JSON.parse(raw) as { result?: string };
  const text = envelope.result ?? "";
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start < 0 || end < start) throw new Error("No JSON array in the review output.");
  return z.array(findingSchema).parse(JSON.parse(text.slice(start, end + 1)));
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const ids = readOption(argv, "ids")?.split(",").map((id) => id.trim()).filter(Boolean);
  const topic = readOption(argv, "topic");
  const limit = Number(readOption(argv, "limit") ?? Infinity);
  const concurrency = Number(readOption(argv, "concurrency") ?? 4);
  const model = readOption(argv, "model") ?? defaultClaudeOptions.model;
  const all = hasFlag(argv, "all");
  const excluded = new Set(readOption(argv, "exclude")?.split(",").map((id) => id.trim()) ?? []);
  if (!ids && !topic && !all) throw new Error("Pass --ids a,b, --topic <topic> [--limit n], or --all [--exclude a,b].");

  const english = await readEnglishArticles();
  const selected = currentJapaneseArticleTranslations
    .filter((artifact) => !excluded.has(artifact.contentId))
    .filter((artifact) => all || (ids ? ids.includes(artifact.contentId) : english.get(artifact.contentId)?.topicIds.includes(topic ?? "")))
    .slice(0, limit);
  const unknown = ids?.filter((id) => !selected.some((artifact) => artifact.contentId === id)) ?? [];
  if (unknown.length) throw new Error(`No current Japanese translation for: ${unknown.join(", ")}`);

  const outputDirectory = join(draftRoot, `article-review-${timestamp()}`);
  await mkdir(outputDirectory, { recursive: true });
  const report = await readFile(resolve(process.cwd(), "content/translations/CLAUDE-TRANSLATION-REPORT.md"), "utf8");
  const decisions = report.slice(report.indexOf("## Decisions to preserve"), report.indexOf("\n## ", report.indexOf("## Decisions to preserve") + 3));
  const promptPath = join(outputDirectory, "system-prompt.md");
  await writeFile(promptPath, `${await readFile(resolve(process.cwd(), "content/translations/ARTICLE-REVIEW-PROMPT.md"), "utf8")}\n${decisions}\n`);

  let totalCost = 0;
  const results: Record<string, ReviewFinding[] | { error: string }> = {};
  const queue = [...selected];
  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    for (let artifact = queue.shift(); artifact; artifact = queue.shift()) {
      const id = artifact.contentId;
      try {
        const run = await runClaude(buildPrompt(id, english.get(id)?.body ?? "", artifact.fields.body ?? ""), { model, effort: defaultClaudeOptions.effort, budgetUsd: 1, systemPromptPath: promptPath, rawOnly: true });
        totalCost += run.costUsd;
        results[id] = parseFindings(run.raw);
        await writeFile(join(outputDirectory, `${id}.raw.json`), run.raw);
        console.log(`${id}: ${results[id].length} findings ($${run.costUsd.toFixed(3)})`);
      } catch (error) {
        results[id] = { error: error instanceof Error ? error.message : String(error) };
        console.log(`${id}: failed — ${results[id].error}`);
      }
    }
  }));

  await writeFile(join(outputDirectory, "findings.json"), `${JSON.stringify(results, null, 1)}\n`);
  console.log(`Reviewed ${selected.length} articles for $${totalCost.toFixed(2)}. Findings: ${join(outputDirectory, "findings.json")}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
