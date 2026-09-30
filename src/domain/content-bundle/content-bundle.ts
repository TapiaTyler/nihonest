import { z } from "zod";
import { articleBlockSchema } from "@/domain/article/article-blocks";
import { articleMetadataSchema } from "@/domain/article/article";

/**
 * The versioned, platform-neutral public content bundle: the input to a native offline catalog (SQLite) and any
 * other client that cannot compile MDX. Each file is immutable JSON; the manifest lists every file with a SHA-256
 * checksum, and `catalogVersion` is derived from those checksums, so identical content yields the same version.
 * Clients verify checksums before switching versions atomically.
 */

export const contentBundleFormatVersion = 8;

const checksumSchema = z.string().regex(/^[0-9a-f]{64}$/);

export const bundledArticleSchema = z.object({
  metadata: articleMetadataSchema,
  blocks: z.array(articleBlockSchema).min(1),
});

/** A current Japanese translation of one article. Stale translations are excluded; clients fall back to English. */
export const bundledArticleTranslationSchema = z.object({
  articleId: z.string().min(1),
  sourceRevision: checksumSchema,
  reviewState: z.enum(["machine-translated", "human-reviewed"]),
  title: z.string().min(1),
  description: z.string().min(1),
  blocks: z.array(articleBlockSchema).min(1),
});

export const contentBundleFileSchema = z.object({
  path: z.string().regex(/^[a-z0-9-]+(?:\.[a-z]{2})?\.json$/),
  kind: z.enum(["articles", "article-translations", "catalog", "catalog-translations"]),
  locale: z.enum(["en", "ja"]),
  records: z.number().int().nonnegative(),
  checksum: checksumSchema,
});

export const contentBundleManifestSchema = z.object({
  formatVersion: z.literal(contentBundleFormatVersion),
  catalogVersion: checksumSchema,
  generatedAt: z.iso.datetime(),
  files: z.array(contentBundleFileSchema).min(1),
}).superRefine((manifest, context) => {
  const paths = manifest.files.map((file) => file.path);
  if (new Set(paths).size !== paths.length) context.addIssue({ code: "custom", message: "Bundle file paths must be unique." });
});

export type BundledArticle = z.infer<typeof bundledArticleSchema>;
export type BundledArticleTranslation = z.infer<typeof bundledArticleTranslationSchema>;
export type ContentBundleFile = z.infer<typeof contentBundleFileSchema>;
export type ContentBundleManifest = z.infer<typeof contentBundleManifestSchema>;
