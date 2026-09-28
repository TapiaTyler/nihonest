import type { Faq } from "@/domain/faq/faq";
import type { JapaneseTerm } from "@/domain/glossary/glossary";
import type { ResidenceStatus } from "@/domain/residence-status/residence-status";
import type { LocalGuidanceSupplement } from "@/domain/geography/local-guidance";

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
  /**
   * Municipality guidance is path-keyed so each field falls back to English on its own: `title`, `summary`,
   * `applicability`, `responsible-body`, optional `receiving-office` and `source-format-note`, and
   * `actions.<index>.title` / `actions.<index>.description`. Source titles, URLs, and dates stay canonical.
   */
  "local-guidance-supplement": (supplement: Pick<LocalGuidanceSupplement,
    "title" | "summary" | "applicability" | "responsibleBody" | "receivingOffice" | "actions" | "sourceFormatNote">) => {
    const fields: Record<string, string> = {
      title: supplement.title,
      summary: supplement.summary,
      applicability: supplement.applicability,
      "responsible-body": supplement.responsibleBody,
    };
    if (supplement.receivingOffice) fields["receiving-office"] = supplement.receivingOffice;
    supplement.actions.forEach((action, index) => {
      fields[`actions.${index}.title`] = action.title;
      fields[`actions.${index}.description`] = action.description;
    });
    if (supplement.sourceFormatNote) fields["source-format-note"] = supplement.sourceFormatNote;
    return fields;
  },
} as const;
