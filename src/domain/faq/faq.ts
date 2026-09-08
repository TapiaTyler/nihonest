import { z } from "zod";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const FAQ_BROWSE_GROUP_IDS = [
  "immigration-and-entry",
  "study",
  "arrival-and-daily-life",
  "work-and-business",
  "family-and-long-term-residence",
  "ongoing-responsibilities",
] as const;

export const faqBrowseGroupIdSchema = z.enum(FAQ_BROWSE_GROUP_IDS);
export type FaqBrowseGroupId = z.infer<typeof faqBrowseGroupIdSchema>;

export const faqBrowseGroupLabels: Record<FaqBrowseGroupId, string> = {
  "immigration-and-entry": "Immigration and entry",
  study: "Study in Japan",
  "arrival-and-daily-life": "Arrival and daily life",
  "work-and-business": "Work and business",
  "family-and-long-term-residence": "Family and long-term residence",
  "ongoing-responsibilities": "Ongoing resident responsibilities",
};

export const faqSchema = z.object({
  id: stableIdSchema,
  slug: stableIdSchema,
  question: z.string().min(1),
  summary: z.string().min(1).max(320),
  primaryBrowseGroupId: faqBrowseGroupIdSchema,
  searchTerms: z.array(z.string().min(1)).default([]),
  relatedArticleIds: z.array(stableIdSchema).default([]),
  relatedGroupIds: z.array(stableIdSchema).default([]),
  relatedJourneyIds: z.array(stableIdSchema).default([]),
  relatedGlossaryTermIds: z.array(stableIdSchema).default([]),
  relatedResidenceStatusIds: z.array(stableIdSchema).default([]),
  status: z.enum(["draft", "verified", "needs-review"]),
  createdAt: z.iso.date(),
  updatedAt: z.iso.date(),
}).superRefine((faq, context) => {
  const targetCount = faq.relatedArticleIds.length
    + faq.relatedGroupIds.length
    + faq.relatedJourneyIds.length
    + faq.relatedGlossaryTermIds.length
    + faq.relatedResidenceStatusIds.length;
  if (targetCount === 0) {
    context.addIssue({ code: "custom", message: "FAQ entries must point to at least one canonical resource." });
  }
});

export type Faq = z.infer<typeof faqSchema>;
export type FaqInput = z.input<typeof faqSchema>;

export const faqStatusLabels: Record<Faq["status"], string> = {
  draft: "Draft",
  verified: "Reviewed",
  "needs-review": "Editorial review",
};

type FaqTargetCatalog = Readonly<{
  articleIds: readonly string[];
  groupIds: readonly string[];
  journeyIds: readonly string[];
  glossaryTermIds: readonly string[];
  residenceStatusIds: readonly string[];
}>;

/** Validates FAQ-to-content links so a discovery question cannot silently lead to a removed resource. */
export function validateFaqCollection(faqs: readonly Faq[], targets: FaqTargetCatalog): void {
  const ids = new Set(faqs.map(({ id }) => id));
  const slugs = new Set(faqs.map(({ slug }) => slug));
  if (ids.size !== faqs.length) throw new Error("FAQ IDs must be unique.");
  if (slugs.size !== faqs.length) throw new Error("FAQ slugs must be unique.");

  const targetSets = {
    relatedArticleIds: new Set(targets.articleIds),
    relatedGroupIds: new Set(targets.groupIds),
    relatedJourneyIds: new Set(targets.journeyIds),
    relatedGlossaryTermIds: new Set(targets.glossaryTermIds),
    relatedResidenceStatusIds: new Set(targets.residenceStatusIds),
  } as const;

  for (const faq of faqs) {
    for (const [field, knownIds] of Object.entries(targetSets) as [keyof typeof targetSets, Set<string>][]) {
      for (const targetId of faq[field]) {
        if (!knownIds.has(targetId)) throw new Error(`FAQ "${faq.id}" references unknown target "${targetId}".`);
      }
    }
  }
}
