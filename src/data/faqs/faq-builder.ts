import { faqSchema, type Faq, type FaqBrowseGroupId, type FaqInput } from "@/domain/faq/faq";

export const defaultFaqDates = { createdAt: "2026-09-06", updatedAt: "2026-09-06", status: "draft" as const };

/** Browse-group ownership is supplied by the module rather than repeated in every FAQ record. */
export function defineFaq(primaryBrowseGroupId: FaqBrowseGroupId, faq: Omit<FaqInput, "primaryBrowseGroupId">): Faq {
  return faqSchema.parse({ ...faq, primaryBrowseGroupId });
}
