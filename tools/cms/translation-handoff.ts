/** Read-only projection of translation work, composed from the CMS catalog selectors. */
import { readArticleCatalog, type ArticleFailure, type ArticleSummary } from "./catalog";
import { readStructuredCatalog, type StructuredKind, type StructuredRecord } from "./structured-catalog";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import type { Faq } from "@/domain/faq/faq";
import type { JapaneseTerm } from "@/domain/glossary/glossary";
import type { ResidenceStatus } from "@/domain/residence-status/residence-status";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision-core";
import { readLocalGuidanceCatalog, type LocalGuidanceDetail } from "./local-guidance-catalog";

export type TranslationHandoffKind = "article" | StructuredKind | "local-guidance-supplement";
export type TranslationHandoffState = "stale" | "missing";

export type TranslationHandoffItem = Readonly<{
  kind: TranslationHandoffKind;
  id: string;
  title: string;
  path: string;
  sourceRevision: string;
  state: TranslationHandoffState;
}>;

export type TranslationHandoffFailure = Readonly<{
  catalog: "articles" | "structured" | "local-guidance";
  path: string;
  error: string;
}>;

export type TranslationHandoffProjection = Readonly<{
  complete: boolean;
  items: readonly TranslationHandoffItem[];
  failures: readonly TranslationHandoffFailure[];
  exportText: string;
}>;

type HandoffInput = Readonly<{
  articles: readonly ArticleSummary[];
  structuredRecords: readonly StructuredRecord[];
  localGuidanceDetails: readonly LocalGuidanceDetail[];
  articleFailures: readonly ArticleFailure[];
  structuredFailures: readonly Readonly<{ path: string; error: string }>[];
  localGuidanceFailures: readonly Readonly<{ path: string; error: string }>[];
}>;

const kindOrder: Readonly<Record<TranslationHandoffKind, number>> = {
  article: 0,
  faq: 1,
  "residence-status": 2,
  "glossary-term": 3,
  "local-guidance-supplement": 4,
};

function translationRevision(record: StructuredRecord): string {
  const fields = record.kind === "faq" ? translationSourceFields.faq(record.value as Faq)
    : record.kind === "residence-status" ? translationSourceFields["residence-status"](record.value as ResidenceStatus)
      : translationSourceFields["glossary-term"](record.value as JapaneseTerm);
  return createTranslationSourceRevision(fields);
}

function localGuidanceTranslationRevision(detail: LocalGuidanceDetail): string {
  return createTranslationSourceRevision(translationSourceFields["local-guidance-supplement"](detail.value));
}

function safeLine(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

function exportHandoff(complete: boolean, items: readonly TranslationHandoffItem[], failures: readonly TranslationHandoffFailure[]) {
  const lines = [
    "Nihonest Japanese translation handoff",
    `Catalog coverage: ${complete ? "complete" : "INCOMPLETE — one or more catalogs could not be fully read"}`,
    `Items needing translation: ${items.length}`,
    "",
  ];
  for (const item of items) {
    lines.push(`- ${item.kind}:${item.id} [${item.state}]`);
    lines.push(`  Title: ${safeLine(item.title)}`);
    lines.push(`  Canonical file: ${item.path}`);
    lines.push(`  English source revision: ${item.sourceRevision}`);
  }
  if (failures.length) {
    lines.push("", "Catalog failures (coverage is incomplete):");
    for (const failure of failures) lines.push(`- ${failure.catalog} ${failure.path}: ${safeLine(failure.error)}`);
  }
  return `${lines.join("\n")}\n`;
}

/** Pure projection; inputs are the same selector results used by the CMS catalogs. */
export function buildTranslationHandoff(input: HandoffInput): TranslationHandoffProjection {
  const items: TranslationHandoffItem[] = [
    ...input.articles.flatMap((article) => article.translation === "current" ? [] : [{
      kind: "article" as const,
      id: article.id,
      title: article.title,
      path: article.path,
      sourceRevision: article.revision,
      state: article.translation,
    }]),
    ...input.structuredRecords.flatMap((record) => record.translation === "current" ? [] : [{
      kind: record.kind,
      id: record.id,
      title: record.title,
      path: record.source.path,
      sourceRevision: translationRevision(record),
      state: record.translation,
    }]),
    ...input.localGuidanceDetails.flatMap((detail) => detail.translation === "current" ? [] : [{
      kind: "local-guidance-supplement" as const,
      id: detail.id,
      title: detail.value.title,
      path: detail.source.path,
      sourceRevision: localGuidanceTranslationRevision(detail),
      state: detail.translation,
    }]),
  ].sort((a, b) => kindOrder[a.kind] - kindOrder[b.kind]
    || a.id.localeCompare(b.id, "en")
    || a.state.localeCompare(b.state, "en"));

  const failures: TranslationHandoffFailure[] = [
    ...input.articleFailures.map((failure) => ({ catalog: "articles" as const, ...failure })),
    ...input.structuredFailures.map((failure) => ({ catalog: "structured" as const, ...failure })),
    ...input.localGuidanceFailures.map((failure) => ({ catalog: "local-guidance" as const, ...failure })),
  ].sort((a, b) => a.catalog.localeCompare(b.catalog, "en")
    || a.path.localeCompare(b.path, "en") || a.error.localeCompare(b.error, "en"));
  const complete = failures.length === 0;
  return { complete, items, failures, exportText: exportHandoff(complete, items, failures) };
}

/** Reads each existing CMS selector once so malformed files remain visible as incomplete coverage. */
export async function readTranslationHandoff(projectRoot: string): Promise<TranslationHandoffProjection> {
  const [articles, structured, localGuidance] = await Promise.all([
    readArticleCatalog(projectRoot),
    readStructuredCatalog(projectRoot),
    readLocalGuidanceCatalog(projectRoot),
  ]);
  return buildTranslationHandoff({
    articles: articles.articles,
    structuredRecords: [...structured.records.values()],
    localGuidanceDetails: [...localGuidance.details.values()],
    articleFailures: articles.failures,
    structuredFailures: structured.failures,
    localGuidanceFailures: localGuidance.failures,
  });
}
