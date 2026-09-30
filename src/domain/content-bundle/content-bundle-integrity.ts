import { z } from "zod";
import { articleGroupSchema, guidedJourneySchema } from "@/domain/discovery/discovery";
import { faqSchema } from "@/domain/faq/faq";
import { japaneseTermSchema } from "@/domain/glossary/glossary";
import { residenceStatusSchema, validateResidenceStatusCollection } from "@/domain/residence-status/residence-status";
import { extractGuidanceText } from "@/domain/residence-status/guidance-text";
import { officialSourceSchema } from "@/domain/source/source";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import { translationArtifactSchema } from "@/domain/translation/translation";
import { localGuidanceSupplementSchema, supportedGeographySchema, validateLocalGuidanceCollection } from "@/domain/geography/local-guidance";
import { bundledGeneralLocalAdviceSchema, bundledLocalGuidanceTranslationSchema } from "./local-guidance-payloads";
import {
  bundledArticleSchema,
  bundledArticleTranslationSchema,
  contentBundleManifestSchema,
  type ContentBundleFile,
  type ContentBundleManifest,
} from "./content-bundle";
import { bundledCatalogTranslationSchema } from "./catalog-translations";
import { bundledStatusGuidanceTranslationSchema } from "./status-guidance-payload";

/** Format 4's supported files. New catalog families need an explicit contract here before export. */
export const contentBundlePayloadContracts = {
  "articles.en.json": { kind: "articles", locale: "en", schema: bundledArticleSchema.array() },
  "article-translations.ja.json": { kind: "article-translations", locale: "ja", schema: bundledArticleTranslationSchema.array() },
  "glossary.en.json": { kind: "catalog", locale: "en", schema: japaneseTermSchema.array() },
  "faqs.en.json": { kind: "catalog", locale: "en", schema: faqSchema.array() },
  "sources.en.json": { kind: "catalog", locale: "en", schema: officialSourceSchema.array() },
  "residence-statuses.en.json": { kind: "catalog", locale: "en", schema: residenceStatusSchema.array() },
  "article-groups.en.json": { kind: "catalog", locale: "en", schema: articleGroupSchema.array() },
  "journeys.en.json": { kind: "catalog", locale: "en", schema: guidedJourneySchema.array() },
  "faq-translations.ja.json": { kind: "catalog-translations", locale: "ja", schema: bundledCatalogTranslationSchema("faq").array() },
  "glossary-translations.ja.json": { kind: "catalog-translations", locale: "ja", schema: bundledCatalogTranslationSchema("glossary-term").array() },
  "residence-status-translations.ja.json": { kind: "catalog-translations", locale: "ja", schema: bundledCatalogTranslationSchema("residence-status").array() },
  "local-guidance.en.json": { kind: "catalog", locale: "en", schema: localGuidanceSupplementSchema.array() },
  "supported-geographies.en.json": { kind: "catalog", locale: "en", schema: supportedGeographySchema.array() },
  "general-local-advice.en.json": { kind: "catalog", locale: "en", schema: bundledGeneralLocalAdviceSchema.array() },
  "local-guidance-translations.ja.json": { kind: "catalog-translations", locale: "ja", schema: bundledLocalGuidanceTranslationSchema("local-guidance-supplement").array() },
  "general-local-advice-translations.ja.json": { kind: "catalog-translations", locale: "ja", schema: bundledLocalGuidanceTranslationSchema("local-guidance-general-advice").array() },
  "residence-status-guidance-translations.ja.json": { kind: "catalog-translations", locale: "ja", schema: bundledStatusGuidanceTranslationSchema.array() },
} as const satisfies Record<string, { kind: ContentBundleFile["kind"]; locale: ContentBundleFile["locale"]; schema: z.ZodType }>;

export function validateContentBundlePayload(file: Pick<ContentBundleFile, "path" | "kind" | "locale">, payload: unknown): readonly unknown[] {
  const contract = Object.prototype.hasOwnProperty.call(contentBundlePayloadContracts, file.path)
    ? contentBundlePayloadContracts[file.path as keyof typeof contentBundlePayloadContracts]
    : undefined;
  if (!contract || contract.kind !== file.kind || contract.locale !== file.locale) {
    throw new Error(`Unsupported content bundle file contract: ${file.path}`);
  }
  // Validate without replacing the payload: schema defaults/transforms must not rewrite canonical JSON.
  contract.schema.parse(payload);
  return payload as readonly unknown[];
}

/** Preserve the original ordering rule; generatedAt is deliberately excluded. */
export function contentBundleVersionInput(files: readonly Pick<ContentBundleFile, "path" | "checksum">[]): string {
  return files.map(({ path, checksum }) => `${path}:${checksum}`).join("\n");
}

/**
 * Validate a complete candidate before a client switches its active catalog. The caller supplies its platform's
 * SHA-256 over UTF-8 text; no filesystem, Node, browser, or database API is required by this contract.
 * Checksums establish integrity, not publisher authenticity. Return only after every file has passed.
 */
export function verifyContentBundle(
  manifestInput: unknown,
  files: ReadonlyMap<string, string>,
  sha256: (text: string) => string,
): ContentBundleManifest {
  const manifest = contentBundleManifestSchema.parse(manifestInput);
  const expectedPaths = Object.keys(contentBundlePayloadContracts);
  if (manifest.files.length !== expectedPaths.length || files.size !== expectedPaths.length
    || expectedPaths.some((path) => !files.has(path) || !manifest.files.some((file) => file.path === path))) {
    throw new Error("Content bundle must contain exactly the supported files.");
  }
  for (const file of manifest.files) {
    const json = files.get(file.path)!;
    if (sha256(json) !== file.checksum) throw new Error(`Content bundle checksum mismatch: ${file.path}`);
    const records = validateContentBundlePayload(file, JSON.parse(json));
    if (records.length !== file.records) throw new Error(`Content bundle record count mismatch: ${file.path}`);
    const ids = records.map((record) => {
      const value = record as { id?: string; articleId?: string; contentId?: string; metadata?: { id: string } };
      // The validated file contract determines identity; extra fields cannot override it.
      if (file.kind === "articles") return value.metadata!.id;
      if (file.kind === "article-translations") return value.articleId!;
      if (file.kind === "catalog-translations") return value.contentId!;
      return value.id!;
    });
    if (new Set(ids).size !== ids.length) throw new Error(`Content bundle record IDs must be unique: ${file.path}`);
  }
  if (sha256(contentBundleVersionInput(manifest.files)) !== manifest.catalogVersion) {
    throw new Error("Content bundle catalog version mismatch.");
  }
  // Match the repository's revision rule with the caller's portable digest implementation.
  const revision = (fields: Readonly<Record<string, string>>) => sha256(JSON.stringify(Object.fromEntries(
    Object.entries(fields).sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => [key, value.replace(/\r\n?/g, "\n")]),
  )));
  const revisionsByPath = {
    "faq-translations.ja.json": new Map(faqSchema.array().parse(JSON.parse(files.get("faqs.en.json")!))
      .map((record) => [record.id, revision(translationSourceFields.faq(record))])),
    "glossary-translations.ja.json": new Map(japaneseTermSchema.array().parse(JSON.parse(files.get("glossary.en.json")!))
      .map((record) => [record.id, revision(translationSourceFields["glossary-term"](record))])),
    "residence-status-translations.ja.json": new Map(residenceStatusSchema.array().parse(JSON.parse(files.get("residence-statuses.en.json")!))
      .map((record) => [record.id, revision(translationSourceFields["residence-status"](record))])),
    "local-guidance-translations.ja.json": new Map(localGuidanceSupplementSchema.array().parse(JSON.parse(files.get("local-guidance.en.json")!))
      .map((record) => [record.id, revision(translationSourceFields["local-guidance-supplement"](record))])),
    "general-local-advice-translations.ja.json": new Map(bundledGeneralLocalAdviceSchema.array().parse(JSON.parse(files.get("general-local-advice.en.json")!))
      .map((record) => [record.id, revision(translationSourceFields["local-guidance-general-advice"](record))])),
    "residence-status-guidance-translations.ja.json": new Map(residenceStatusSchema.array().parse(JSON.parse(files.get("residence-statuses.en.json")!))
      .flatMap((record) => record.structuredGuidance ? [[record.id, revision(extractGuidanceText(record.structuredGuidance))] as const] : [])),
  };
  for (const [path, revisions] of Object.entries(revisionsByPath)) {
    for (const artifact of translationArtifactSchema.array().parse(JSON.parse(files.get(path)!))) {
      if (revisions.get(artifact.contentId) !== artifact.sourceRevision) {
        throw new Error(`Content bundle translation target or revision mismatch: ${path}`);
      }
    }
  }
  const supplements = localGuidanceSupplementSchema.array().parse(JSON.parse(files.get("local-guidance.en.json")!));
  const geographies = supportedGeographySchema.array().parse(JSON.parse(files.get("supported-geographies.en.json")!));
  const articles = bundledArticleSchema.array().parse(JSON.parse(files.get("articles.en.json")!));
  const sources = officialSourceSchema.array().parse(JSON.parse(files.get("sources.en.json")!));
  const statuses = residenceStatusSchema.array().parse(JSON.parse(files.get("residence-statuses.en.json")!));
  const glossary = japaneseTermSchema.array().parse(JSON.parse(files.get("glossary.en.json")!));
  validateResidenceStatusCollection(statuses, sources, articles.map(({ metadata }) => metadata.id), glossary.map(({ id }) => id));
  validateLocalGuidanceCollection(geographies, supplements, articles.map(({ metadata }) => metadata.id), sources.map(({ id }) => id));
  const advice = bundledGeneralLocalAdviceSchema.array().parse(JSON.parse(files.get("general-local-advice.en.json")!));
  const knownArticles = new Set(articles.map(({ metadata }) => metadata.id));
  for (const record of advice) {
    if (!knownArticles.has(record.id)) throw new Error("General local advice references an unknown article.");
  }
  // Supplement/status guidance overlays fall back per field; general advice requires every title/step.
  const fieldsByTarget = {
    "local-guidance-translations.ja.json": new Map(supplements.map((record) => [record.id, translationSourceFields["local-guidance-supplement"](record)])),
    "general-local-advice-translations.ja.json": new Map(advice.map((record) => [record.id, translationSourceFields["local-guidance-general-advice"](record)])),
    "residence-status-guidance-translations.ja.json": new Map(statuses.flatMap((record) => record.structuredGuidance
      ? [[record.id, extractGuidanceText(record.structuredGuidance)] as const] : [])),
  };
  for (const [path, targets] of Object.entries(fieldsByTarget)) {
    for (const artifact of translationArtifactSchema.array().parse(JSON.parse(files.get(path)!))) {
      const canonicalFields = targets.get(artifact.contentId)!;
      if (Object.keys(artifact.fields).some((key) => !Object.prototype.hasOwnProperty.call(canonicalFields, key))) {
        throw new Error(`Unknown path-keyed translation field: ${path}`);
      }
      if (path === "general-local-advice-translations.ja.json"
        && Object.keys(canonicalFields).some((key) => !artifact.fields[key])) {
        throw new Error("General local advice translation must contain every title and step.");
      }
    }
  }
  return manifest;
}
