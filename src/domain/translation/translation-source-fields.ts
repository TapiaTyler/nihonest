import type { Faq } from "@/domain/faq/faq";
import type { JapaneseTerm } from "@/domain/glossary/glossary";
import type { ResidenceStatus } from "@/domain/residence-status/residence-status";

/**
 * The English fields each structured translation artifact is revision-addressed to. A Japanese artifact is current
 * when its `sourceRevision` equals `createTranslationSourceRevision` over these fields.
 */
export const translationSourceFields = {
  faq: (faq: Pick<Faq, "question" | "summary">) => ({ question: faq.question, summary: faq.summary }),
  "glossary-term": (term: Pick<JapaneseTerm, "shortDefinition" | "detailedExplanation" | "commonContext">) => ({
    shortDefinition: term.shortDefinition,
    detailedExplanation: term.detailedExplanation,
    commonContext: term.commonContext,
  }),
  "residence-status": (status: Pick<ResidenceStatus, "summary" | "purpose" | "typicalActivities" | "examples" | "considerations">) => ({
    summary: status.summary,
    purpose: status.purpose,
    typicalActivities: JSON.stringify(status.typicalActivities),
    examples: JSON.stringify(status.examples),
    considerations: JSON.stringify(status.considerations),
  }),
} as const;
