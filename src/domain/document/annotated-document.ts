import { z } from "zod";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const isoDateSchema = z.iso.date();

export const documentLifecycleSchema = z.enum(["current", "superseded", "future"]);
export const documentReviewStatusSchema = z.enum(["needs-review", "verified", "stale"]);

export const annotatedDocumentFieldSchema = z.object({
  id: stableIdSchema,
  number: z.number().int().positive(),
  label: z.string().min(1),
  japaneseLabel: z.string().min(1),
  exampleValue: z.string().min(1),
  explanation: z.string().min(1),
  caution: z.string().min(1).optional(),
});

export const annotatedDocumentSectionSchema = z.object({
  id: stableIdSchema,
  label: z.string().min(1),
  fields: z.array(annotatedDocumentFieldSchema).min(1),
});

export const officialDocumentVisualSchema = z.object({
  id: stableIdSchema,
  assetUrl: z.url({ protocol: /^https$/ }),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().min(1),
  caption: z.string().min(1),
  sourceId: stableIdSchema,
  rightsSourceId: stableIdSchema,
  presentation: z.enum(["unmodified", "adapted"]),
  modificationNote: z.string().min(1).optional(),
}).superRefine((visual, context) => {
  if (visual.presentation === "adapted" && !visual.modificationNote) {
    context.addIssue({ code: "custom", path: ["modificationNote"], message: "Adapted official visuals require a modification note." });
  }
});

export const annotatedDocumentVersionSchema = z.object({
  id: stableIdSchema,
  label: z.string().min(1),
  lifecycle: documentLifecycleSchema,
  validFrom: isoDateSchema.optional(),
  validThrough: isoDateSchema.optional(),
  reviewStatus: documentReviewStatusSchema,
  lastCheckedAt: isoDateSchema,
  notice: z.string().min(1),
  sourceIds: z.array(stableIdSchema).min(1),
  officialVisuals: z.array(officialDocumentVisualSchema).default([]),
  sections: z.array(annotatedDocumentSectionSchema).min(1),
});

export const documentJurisdictionVariantSchema = z.object({
  id: stableIdSchema,
  geographyId: stableIdSchema,
  label: z.string().min(1),
  issuer: z.string().min(1),
  jurisdiction: z.string().min(1),
  versions: z.array(annotatedDocumentVersionSchema).min(1),
});

export const annotatedDocumentFamilySchema = z.object({
  id: stableIdSchema,
  title: z.string().min(1),
  japaneseName: z.string().min(1),
  issuer: z.string().min(1),
  jurisdiction: z.string().min(1),
  articleId: stableIdSchema,
  glossaryTermIds: z.array(stableIdSchema).default([]),
  description: z.string().min(1),
  versions: z.array(annotatedDocumentVersionSchema).default([]),
  jurisdictionVariants: z.array(documentJurisdictionVariantSchema).default([]),
}).superRefine((family, context) => {
  const hasDirectVersions = family.versions.length > 0;
  const hasJurisdictionVariants = family.jurisdictionVariants.length > 0;
  if (hasDirectVersions === hasJurisdictionVariants) {
    context.addIssue({
      code: "custom",
      path: ["versions"],
      message: "A document family must define either direct versions or jurisdiction variants, but not both.",
    });
  }
});

export type AnnotatedDocumentFamily = z.infer<typeof annotatedDocumentFamilySchema>;

export function validateAnnotatedDocumentCollection(
  families: readonly AnnotatedDocumentFamily[],
  articleIds: readonly string[],
  glossaryTermIds: readonly string[],
  sourceIds: readonly string[],
  selectableGeographyIds: readonly string[],
): void {
  const familyIds = new Set<string>();
  const knownArticles = new Set(articleIds);
  const knownTerms = new Set(glossaryTermIds);
  const knownSources = new Set(sourceIds);
  const knownGeographies = new Set(selectableGeographyIds);

  for (const family of families) {
    if (familyIds.has(family.id)) throw new Error(`Duplicate document family "${family.id}".`);
    familyIds.add(family.id);
    if (!knownArticles.has(family.articleId)) throw new Error(`Document family "${family.id}" references an unknown article.`);
    for (const termId of family.glossaryTermIds) {
      if (!knownTerms.has(termId)) throw new Error(`Document family "${family.id}" references unknown glossary term "${termId}".`);
    }

    const variantIds = family.jurisdictionVariants.map(({ id }) => id);
    if (new Set(variantIds).size !== variantIds.length) {
      throw new Error(`Document family "${family.id}" has duplicate jurisdiction variants.`);
    }
    for (const variant of family.jurisdictionVariants) {
      if (!knownGeographies.has(variant.geographyId)) {
        throw new Error(`Document family "${family.id}" references unknown geography "${variant.geographyId}".`);
      }
    }

    const versionGroups = family.jurisdictionVariants.length > 0
      ? family.jurisdictionVariants.map(({ id, versions }) => ({ id, versions }))
      : [{ id: family.id, versions: family.versions }];

    for (const group of versionGroups) {
      const versionIds = new Set<string>();
      if (group.versions.filter(({ lifecycle }) => lifecycle === "current").length !== 1) {
        throw new Error(`Document family "${family.id}" group "${group.id}" must have exactly one current version.`);
      }
      for (const version of group.versions) {
        if (versionIds.has(version.id)) throw new Error(`Document family "${family.id}" group "${group.id}" has duplicate version "${version.id}".`);
        versionIds.add(version.id);
        for (const sourceId of version.sourceIds) {
          if (!knownSources.has(sourceId)) throw new Error(`Document version "${version.id}" references unknown source "${sourceId}".`);
        }
        for (const visual of version.officialVisuals) {
          if (!knownSources.has(visual.sourceId) || !knownSources.has(visual.rightsSourceId)) {
            throw new Error(`Official visual "${visual.id}" references an unknown source or rights record.`);
          }
          if (!version.sourceIds.includes(visual.sourceId) || !version.sourceIds.includes(visual.rightsSourceId)) {
            throw new Error(`Official visual "${visual.id}" sources must be included in its document version.`);
          }
        }
        const fields = version.sections.flatMap(({ fields }) => fields);
        if (new Set(fields.map(({ id }) => id)).size !== fields.length) throw new Error(`Document version "${version.id}" has duplicate field IDs.`);
        if (new Set(fields.map(({ number }) => number)).size !== fields.length) throw new Error(`Document version "${version.id}" has duplicate callout numbers.`);
      }
    }
  }
}
