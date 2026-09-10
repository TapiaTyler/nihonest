import { z } from "zod";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const revisionSchema = z.string().regex(/^[a-f0-9]{64}$/);
const fieldIdSchema = z.string().regex(/^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/);

export const contentLocaleSchema = z.string().trim().min(2).max(35).refine((locale) => {
  try {
    new Intl.Locale(locale);
    return true;
  } catch {
    return false;
  }
}, "Use a valid BCP 47 locale.");

export const translationArtifactSchema = z.object({
  schemaVersion: z.literal(1),
  contentKind: z.enum(["article", "article-group", "faq", "glossary-term", "interface"]),
  contentId: stableIdSchema,
  sourceLocale: z.literal("en"),
  targetLocale: contentLocaleSchema,
  sourceRevision: revisionSchema,
  terminologyRevision: revisionSchema,
  promptRevision: revisionSchema,
  generator: z.object({ id: stableIdSchema, model: z.string().trim().min(1).max(100) }),
  fields: z.record(fieldIdSchema, z.string()),
  reviewState: z.enum(["machine-translated", "human-reviewed"]),
  generatedAt: z.iso.datetime(),
  reviewedAt: z.iso.datetime().optional(),
}).superRefine((artifact, context) => {
  if (new Intl.Locale(artifact.targetLocale).language === "en") {
    context.addIssue({ code: "custom", path: ["targetLocale"], message: "English remains canonical and is not stored as a translation." });
  }
  if ((artifact.reviewState === "human-reviewed") !== Boolean(artifact.reviewedAt)) {
    context.addIssue({ code: "custom", path: ["reviewedAt"], message: "Only human-reviewed translations require a review timestamp." });
  }
});

export type TranslationArtifact = z.infer<typeof translationArtifactSchema>;
export type TranslationContentKind = TranslationArtifact["contentKind"];

export type TranslationIdentity = Readonly<{
  contentKind: TranslationContentKind;
  contentId: string;
  targetLocale: string;
  sourceRevision: string;
  terminologyRevision: string;
  promptRevision: string;
  generatorId: string;
  generatorModel: string;
}>;

const translationIdentitySchema = z.object({
  contentKind: translationArtifactSchema.shape.contentKind,
  contentId: stableIdSchema,
  targetLocale: contentLocaleSchema,
  sourceRevision: revisionSchema,
  terminologyRevision: revisionSchema,
  promptRevision: revisionSchema,
  generatorId: stableIdSchema,
  generatorModel: z.string().trim().min(1).max(100),
});

export function canonicalizeLocale(locale: string): string {
  return new Intl.Locale(contentLocaleSchema.parse(locale)).toString();
}

/** The key retains every input that can change a generated translation. */
export function translationCacheKey(identity: TranslationIdentity): string {
  const parsed = translationIdentitySchema.parse(identity);
  return [
    "translation-v1",
    parsed.contentKind,
    parsed.contentId,
    canonicalizeLocale(parsed.targetLocale),
    parsed.sourceRevision,
    parsed.terminologyRevision,
    parsed.promptRevision,
    parsed.generatorId,
    encodeURIComponent(parsed.generatorModel),
  ].join(":");
}

export function isTranslationCurrent(artifactInput: unknown, identity: TranslationIdentity): boolean {
  const parsed = translationArtifactSchema.safeParse(artifactInput);
  const parsedIdentity = translationIdentitySchema.safeParse(identity);
  if (!parsed.success || !parsedIdentity.success) return false;
  const artifact = parsed.data;
  return artifact.contentKind === parsedIdentity.data.contentKind
    && artifact.contentId === parsedIdentity.data.contentId
    && canonicalizeLocale(artifact.targetLocale) === canonicalizeLocale(parsedIdentity.data.targetLocale)
    && artifact.sourceRevision === parsedIdentity.data.sourceRevision
    && artifact.terminologyRevision === parsedIdentity.data.terminologyRevision
    && artifact.promptRevision === parsedIdentity.data.promptRevision
    && artifact.generator.id === parsedIdentity.data.generatorId
    && artifact.generator.model === parsedIdentity.data.generatorModel;
}
