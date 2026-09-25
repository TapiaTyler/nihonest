/**
 * FAQ coverage report (no model calls): FAQs per browse group, articles no FAQ links to, likely duplicate questions,
 * search terms shared across FAQs, summaries near the 320-character limit, and FAQs without a current Japanese
 * translation. Findings are signals for editorial judgment, not errors.
 *
 *   npm run faq:coverage
 *   npm run faq:coverage -- --importance critical,important   # limit the unlinked-article list
 *   npm run faq:coverage -- --json                            # also write .glossary-drafts/faq-coverage.json
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { faqs } from "@/data/faqs";
import { japaneseFaqTranslations } from "@/data/translations/ja/faq-translations";
import { FAQ_BROWSE_GROUP_IDS, type Faq } from "@/domain/faq/faq";
import { IMPORTANCE_IDS } from "@/domain/taxonomy/taxonomy";
import { loadArticleSourceMetadata } from "@/lib/source-monitoring/article-source-metadata";
import { hasFlag, readOption } from "./glossary-translation/cli-options";
import { draftRoot } from "./glossary-translation/glossary-draft";
import { overlaySourceRevision } from "./glossary-translation/overlay-pipeline";

const duplicateThreshold = 0.5;
const summaryWarningLength = 300;
const stopWords = new Set(("a an and are as at be by can do does for from get how i if in is it japan japanese my of on or "
  + "should the to what when where which who will with you your after before need have has").split(" "));

const tokens = (text: string) => new Set(text.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/)
  .map((word) => word.replace(/(?:ies)$/, "y").replace(/(?<!s)s$/, ""))
  .filter((word) => word.length > 1 && !stopWords.has(word)));
const jaccard = (left: Set<string>, right: Set<string>) => {
  const shared = [...left].filter((word) => right.has(word)).length;
  return shared / (left.size + right.size - shared || 1);
};

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const importanceFilter = readOption(argv, "importance")?.split(",");
  const articles = await loadArticleSourceMetadata(resolve(process.cwd(), "content/articles"));

  // Browse groups.
  const groups = FAQ_BROWSE_GROUP_IDS.map((group) => {
    const entries = faqs.filter(({ primaryBrowseGroupId }) => primaryBrowseGroupId === group);
    const statuses = Object.entries(Object.groupBy(entries, ({ status }) => status)).map(([status, list]) => `${status} ${list!.length}`).join(", ");
    return { group, count: entries.length, statuses };
  });

  // Articles no FAQ links to, most important first.
  const linkCounts = new Map<string, number>();
  for (const faq of faqs) for (const id of faq.relatedArticleIds) linkCounts.set(id, (linkCounts.get(id) ?? 0) + 1);
  const rank = (importance: string) => IMPORTANCE_IDS.length - IMPORTANCE_IDS.indexOf(importance as (typeof IMPORTANCE_IDS)[number]);
  const unlinked = articles
    .filter(({ id, importance }) => !linkCounts.has(id) && (!importanceFilter || importanceFilter.includes(importance)))
    .sort((left, right) => rank(left.importance) - rank(right.importance) || left.id.localeCompare(right.id))
    .map(({ id, title, importance, topicIds }) => ({ id, title, importance, topicIds }));

  // Likely duplicates by question wording.
  const questionTokens = faqs.map((faq) => ({ faq, words: tokens(faq.question) }));
  const duplicates: { left: string; right: string; similarity: number }[] = [];
  for (let left = 0; left < questionTokens.length; left += 1) {
    for (let right = left + 1; right < questionTokens.length; right += 1) {
      const similarity = jaccard(questionTokens[left]!.words, questionTokens[right]!.words);
      if (similarity >= duplicateThreshold) duplicates.push({ left: questionTokens[left]!.faq.id, right: questionTokens[right]!.faq.id, similarity: Number(similarity.toFixed(2)) });
    }
  }
  duplicates.sort((left, right) => right.similarity - left.similarity);

  // Search terms used by more than one FAQ.
  const termOwners = new Map<string, string[]>();
  for (const faq of faqs) for (const term of new Set(faq.searchTerms.map((value) => value.toLowerCase().trim()))) termOwners.set(term, [...termOwners.get(term) ?? [], faq.id]);
  const sharedTerms = [...termOwners].filter(([, owners]) => owners.length > 1).map(([term, owners]) => ({ term, faqIds: owners }));

  const longSummaries = faqs.filter(({ summary }) => summary.length >= summaryWarningLength).map(({ id, summary }) => ({ id, length: summary.length }));

  // Japanese coverage uses the same revision as the FAQ translation test.
  const translations = new Map(japaneseFaqTranslations.map(({ contentId, sourceRevision }) => [contentId, sourceRevision]));
  const revision = (faq: Faq) => overlaySourceRevision({ question: faq.question, summary: faq.summary });
  const untranslated = faqs.filter((faq) => !translations.has(faq.id)).map(({ id }) => id);
  const staleTranslations = faqs.filter((faq) => translations.has(faq.id) && translations.get(faq.id) !== revision(faq)).map(({ id }) => id);

  console.log(`FAQs: ${faqs.length} · articles: ${articles.length} (${articles.filter(({ id }) => linkCounts.has(id)).length} linked from at least one FAQ)\n`);
  console.log("## FAQs per browse group");
  for (const { group, count, statuses } of groups) console.log(`  ${group.padEnd(32)} ${String(count).padStart(3)}  (${statuses || "none"})`);
  console.log(`\n## Articles no FAQ links to${importanceFilter ? ` (${importanceFilter.join(", ")})` : ""}: ${unlinked.length}`);
  for (const article of unlinked) console.log(`  [${article.importance}] ${article.id} — ${article.title} (${article.topicIds.join(", ")})`);
  console.log(`\n## Possible duplicate questions (word overlap ≥ ${duplicateThreshold}): ${duplicates.length}`);
  for (const { left, right, similarity } of duplicates) console.log(`  ${similarity}  ${left}  ↔  ${right}`);
  console.log(`\n## Search terms shared by several FAQs: ${sharedTerms.length}`);
  for (const { term, faqIds } of sharedTerms) console.log(`  "${term}": ${faqIds.join(", ")}`);
  console.log(`\n## Summaries of ${summaryWarningLength}+ characters (limit 320): ${longSummaries.length}`);
  for (const { id, length } of longSummaries) console.log(`  ${id} (${length})`);
  console.log(`\n## Japanese: ${untranslated.length} untranslated, ${staleTranslations.length} outdated (run npm run faq:draft)`);
  for (const id of untranslated) console.log(`  missing  ${id}`);
  for (const id of staleTranslations) console.log(`  outdated ${id}`);

  if (hasFlag(argv, "json")) {
    await mkdir(draftRoot, { recursive: true });
    const path = join(draftRoot, "faq-coverage.json");
    await writeFile(path, `${JSON.stringify({ groups, unlinked, duplicates, sharedTerms, longSummaries, untranslated, staleTranslations }, null, 1)}\n`);
    console.log(`\nFull report: ${path}`);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
