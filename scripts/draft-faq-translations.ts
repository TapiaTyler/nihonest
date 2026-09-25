/**
 * Claude drafts of Japanese FAQ question and summary pairs, one isolated call per FAQ.
 *
 *   npm run faq:draft                                   # every FAQ without a current translation (new or changed English)
 *   npm run faq:draft -- --ids what-is-a-prefecture
 *   npm run faq:draft -- --integrate .glossary-drafts/faq-<run>
 *
 * Review each draft against its English FAQ and linked guides before integrating. Integration replaces an FAQ's
 * existing catalog line in place (so outdated translations are refreshed without reordering) and appends new FAQs.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { z } from "zod";
import { faqs } from "@/data/faqs";
import { glossaryTerms } from "@/data/glossary";
import { japaneseFaqTranslations } from "@/data/translations/ja/faq-translations";
import type { Faq } from "@/domain/faq/faq";
import { readOption } from "./glossary-translation/cli-options";
import { draftOverlays, overlaySourceRevision, type OverlayItem } from "./glossary-translation/overlay-pipeline";

const catalogPath = resolve(process.cwd(), "src/data/translations/ja/faq-translations.ts");
const generatorConstant = `/** FAQs drafted with \`npm run faq:draft\` and reviewed by Claude. */
const claudeGenerator = { id: "claude-code-claude-reviewed", model: "claude-opus-5-5" } as const;
`;

const english = (faq: Faq) => ({ question: faq.question, summary: faq.summary });

function items(): OverlayItem[] {
  const translations = new Map(japaneseFaqTranslations.map((artifact) => [artifact.contentId, artifact]));
  return faqs.map((faq) => {
    const terms = glossaryTerms.filter(({ id }) => faq.relatedGlossaryTermIds.includes(id));
    // Accepted translations from the same browse group keep tone and phrasing consistent across batches.
    const examples = faqs
      .filter((other) => other.id !== faq.id && other.primaryBrowseGroupId === faq.primaryBrowseGroupId && translations.has(other.id))
      .slice(0, 3)
      .map((other) => `- ${other.question} → ${translations.get(other.id)!.fields.question}\n  ${translations.get(other.id)!.fields.summary}`);
    return {
      id: faq.id,
      english: english(faq),
      context: [
        "Translate one Nihonest FAQ into Japanese. `question` is the reader's question, written as a natural Japanese question ending in ですか／ますか or similar. `summary` is a short, cautious answer that points the reader to the linked guides; keep its scope, uncertainty, and every qualification, and do not add facts, dates, amounts, or advice.",
        "In Japanese, write residence statuses with their official names in 「」, for example 「短期滞在」 for Temporary Visitor.",
        terms.length ? `## Glossary terms this FAQ links to (use these Japanese headwords)\n${terms.map(({ englishName, japanese }) => `- ${englishName} → ${japanese}`).join("\n")}` : "",
        examples.length ? `## Accepted FAQ translations from the same section (match their style)\n${examples.join("\n")}` : "",
      ].filter(Boolean).join("\n\n"),
    };
  });
}

async function integrate(directory: string, all: readonly OverlayItem[]): Promise<void> {
  const q = (value: string) => JSON.stringify(value);
  const generatedAt = `${new Date().toISOString().slice(0, 19)}.000Z`;
  let source = (await readFile(catalogPath, "utf8")).replace(/\r\n?/g, "\n");
  if (!source.includes("const claudeGenerator")) {
    source = source.replace(/(const generator = [^\n]+\n)/, `$1${generatorConstant}`);
  }
  const files = (await readdir(directory)).filter((file) => file.endsWith(".json")).sort();
  let replaced = 0;
  let added = 0;
  for (const file of files) {
    const item = all.find(({ id }) => `${id}.json` === file);
    if (!item) throw new Error(`No current FAQ for ${file}`);
    const draft = z.object({ question: z.string().min(1), summary: z.string().min(1) }).parse(JSON.parse(await readFile(join(directory, file), "utf8")));
    const line = `  defineFaqTranslation(${q(item.id)}, ${q(overlaySourceRevision(item.english))}, ${q(draft.question)}, ${q(draft.summary)}, ${q(generatedAt)}, claudeGenerator),`;
    const existing = new RegExp(`^  defineFaqTranslation\\(${q(item.id).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")},.*$`, "m");
    if (existing.test(source)) {
      source = source.replace(existing, () => line);
      replaced += 1;
    } else {
      source = source.replace(/\n\] as const;\n/, () => `\n${line}\n] as const;\n`);
      added += 1;
    }
  }
  await writeFile(catalogPath, source);
  console.log(`Integrated ${files.length} FAQ translations into ${catalogPath}: ${added} added, ${replaced} refreshed.`);
  console.log("Next: run npx vitest run src/data/translations/ja/faq-translations.test.ts and npm run faq:coverage.");
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const all = items();
  const integrateDirectory = readOption(argv, "integrate");
  if (integrateDirectory) return integrate(integrateDirectory, all);
  const current = new Set(japaneseFaqTranslations.map(({ contentId, sourceRevision }) => `${contentId}:${sourceRevision}`));
  const ids = readOption(argv, "ids")?.split(",");
  const selected = all.filter((item) => ids ? ids.includes(item.id) : !current.has(`${item.id}:${overlaySourceRevision(item.english)}`));
  if (!selected.length) {
    console.log("Every FAQ has a current Japanese translation.");
    return;
  }
  await draftOverlays("faq", selected);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
