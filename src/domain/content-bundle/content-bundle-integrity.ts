import { z } from "zod";
import { articleGroupSchema, guidedJourneySchema } from "@/domain/discovery/discovery";
import { faqSchema } from "@/domain/faq/faq";
import { japaneseTermSchema } from "@/domain/glossary/glossary";
import { residenceStatusSchema } from "@/domain/residence-status/residence-status";
import { officialSourceSchema } from "@/domain/source/source";
import {
  bundledArticleSchema,
  bundledArticleTranslationSchema,
  contentBundleManifestSchema,
  type ContentBundleFile,
  type ContentBundleManifest,
} from "./content-bundle";

/** Format 1's supported files. New catalog families need an explicit contract here before export. */
export const contentBundlePayloadContracts = {
  "articles.en.json": { kind: "articles", locale: "en", schema: bundledArticleSchema.array() },
  "article-translations.ja.json": { kind: "article-translations", locale: "ja", schema: bundledArticleTranslationSchema.array() },
  "glossary.en.json": { kind: "catalog", locale: "en", schema: japaneseTermSchema.array() },
  "faqs.en.json": { kind: "catalog", locale: "en", schema: faqSchema.array() },
  "sources.en.json": { kind: "catalog", locale: "en", schema: officialSourceSchema.array() },
  "residence-statuses.en.json": { kind: "catalog", locale: "en", schema: residenceStatusSchema.array() },
  "article-groups.en.json": { kind: "catalog", locale: "en", schema: articleGroupSchema.array() },
  "journeys.en.json": { kind: "catalog", locale: "en", schema: guidedJourneySchema.array() },
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

/** Preserve the format-1 ordering rule; generatedAt is deliberately excluded. */
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
      const value = record as { id?: string; articleId?: string; metadata?: { id: string } };
      // The validated file contract determines identity; extra fields cannot override it.
      if (file.kind === "articles") return value.metadata!.id;
      if (file.kind === "article-translations") return value.articleId!;
      return value.id!;
    });
    if (new Set(ids).size !== ids.length) throw new Error(`Content bundle record IDs must be unique: ${file.path}`);
  }
  if (sha256(contentBundleVersionInput(manifest.files)) !== manifest.catalogVersion) {
    throw new Error("Content bundle catalog version mismatch.");
  }
  return manifest;
}
