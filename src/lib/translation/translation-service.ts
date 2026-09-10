import { z } from "zod";
import { protectTranslationText, restoreTranslationText, type ProtectedTerm } from "@/domain/translation/protected-text";
import {
  canonicalizeLocale,
  isTranslationCurrent,
  translationArtifactSchema,
  translationCacheKey,
  type TranslationArtifact,
  type TranslationContentKind,
} from "@/domain/translation/translation";
import type { TranslationCache } from "./translation-cache";
import type { TranslationProvider, TranslationSegment } from "./translation-provider";

const revisionSchema = z.string().regex(/^[a-f0-9]{64}$/);
const fieldIdSchema = z.string().regex(/^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/);
const translatedSegmentsSchema = z.array(z.object({ id: fieldIdSchema, text: z.string() }));

export type TranslateContentRequest = Readonly<{
  contentKind: TranslationContentKind;
  contentId: string;
  sourceRevision: string;
  terminologyRevision: string;
  promptRevision: string;
  targetLocale: string;
  fields: Readonly<Record<string, string>>;
  protectedTerms: readonly ProtectedTerm[];
  generatedAt: string;
}>;

export type TranslationResult = Readonly<{
  artifact: TranslationArtifact;
  cacheStatus: "hit" | "miss";
}>;

/** Coordinates cache lookup and protected translation without exposing provider details to UI code. */
export async function translateContent(
  request: TranslateContentRequest,
  provider: TranslationProvider,
  cache: TranslationCache,
): Promise<TranslationResult> {
  const targetLocale = canonicalizeLocale(request.targetLocale);
  if (new Intl.Locale(targetLocale).language === "en") throw new Error("Canonical English content does not require translation.");
  const sourceRevision = revisionSchema.parse(request.sourceRevision);
  const terminologyRevision = revisionSchema.parse(request.terminologyRevision);
  const promptRevision = revisionSchema.parse(request.promptRevision);
  const identity = {
    contentKind: request.contentKind,
    contentId: request.contentId,
    targetLocale,
    sourceRevision,
    terminologyRevision,
    promptRevision,
    generatorId: provider.id,
    generatorModel: provider.model,
  } as const;
  const key = translationCacheKey(identity);
  const cached = await cache.get(key);
  if (cached && isTranslationCurrent(cached, identity)) return { artifact: cached, cacheStatus: "hit" };

  const protectedByField = new Map<string, ReturnType<typeof protectTranslationText>>();
  const validatedFields = z.record(fieldIdSchema, z.string())
    .refine((fields) => Object.keys(fields).length > 0, "At least one translatable field is required.")
    .parse(request.fields);
  const segments = Object.entries(validatedFields).map<TranslationSegment>(([id, text]) => {
    const protectedText = protectTranslationText(text, request.protectedTerms);
    protectedByField.set(id, protectedText);
    return { id, text: protectedText.text };
  });
  const translatedSegments = translatedSegmentsSchema.parse(
    await provider.translate({ sourceLocale: "en", targetLocale, segments }),
  );
  const translatedById = new Map(translatedSegments.map((segment) => [segment.id, segment.text]));
  if (translatedById.size !== segments.length || translatedSegments.length !== segments.length) {
    throw new Error("The translation provider returned missing, duplicate, or unexpected fields.");
  }

  const fields = Object.fromEntries(segments.map(({ id }) => {
    const translated = translatedById.get(id);
    const protectedText = protectedByField.get(id);
    if (translated === undefined || !protectedText) throw new Error("The translation provider returned an unexpected field set.");
    return [id, restoreTranslationText(translated, protectedText.occurrences)];
  }));
  const artifact = translationArtifactSchema.parse({
    schemaVersion: 1,
    contentKind: request.contentKind,
    contentId: request.contentId,
    sourceLocale: "en",
    targetLocale,
    sourceRevision,
    terminologyRevision,
    promptRevision,
    generator: { id: provider.id, model: provider.model },
    fields,
    reviewState: "machine-translated",
    generatedAt: request.generatedAt,
  });
  await cache.set(key, artifact);
  return { artifact, cacheStatus: "miss" };
}
