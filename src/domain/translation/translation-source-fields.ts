import type { Faq } from "@/domain/faq/faq";
import type { JapaneseTerm } from "@/domain/glossary/glossary";
import type { ResidenceStatus } from "@/domain/residence-status/residence-status";
import type { LocalGuidanceSupplement } from "@/domain/geography/local-guidance";
import type { AnnotatedDocumentFamily } from "@/domain/document/annotated-document";

type AnnotatedDocumentVersion = AnnotatedDocumentFamily["versions"][number];

function addAnnotatedDocumentVersion(fields: Record<string, string>, prefix: string, version: AnnotatedDocumentVersion) {
  fields[`${prefix}.label`] = version.label;
  fields[`${prefix}.notice`] = version.notice;
  for (const visual of version.officialVisuals) {
    fields[`${prefix}.visuals.${visual.id}.alt`] = visual.alt;
    fields[`${prefix}.visuals.${visual.id}.caption`] = visual.caption;
    if (visual.modificationNote) fields[`${prefix}.visuals.${visual.id}.modification-note`] = visual.modificationNote;
  }
  for (const section of version.sections) {
    fields[`${prefix}.sections.${section.id}.label`] = section.label;
    for (const field of section.fields) {
      const path = `${prefix}.sections.${section.id}.fields.${field.id}`;
      fields[`${path}.label`] = field.label;
      fields[`${path}.example-value`] = field.exampleValue;
      fields[`${path}.explanation`] = field.explanation;
      if (field.caution) fields[`${path}.caution`] = field.caution;
    }
  }
}

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
  /**
   * General local advice shown when no municipality supplement exists for an article ("Other" in the location
   * selector): `title` and `steps.<index>`, keyed by the article ID.
   */
  /**
   * An annotated document family, keyed by stable IDs rather than positions: `title`, `description`, `issuer`,
   * `jurisdiction`, then `versions.<id>.…` (or `variants.<id>.label|issuer|jurisdiction` and
   * `variants.<id>.versions.<id>.…`) with `label`, `notice`, `visuals.<id>.alt|caption|modification-note`,
   * `sections.<id>.label`, and `sections.<id>.fields.<id>.label|example-value|explanation|caution`.
   */
  "annotated-document": (family: AnnotatedDocumentFamily) => {
    const fields: Record<string, string> = { title: family.title, description: family.description, issuer: family.issuer, jurisdiction: family.jurisdiction };
    for (const version of family.versions) addAnnotatedDocumentVersion(fields, `versions.${version.id}`, version);
    for (const variant of family.jurisdictionVariants) {
      fields[`variants.${variant.id}.label`] = variant.label;
      fields[`variants.${variant.id}.issuer`] = variant.issuer;
      fields[`variants.${variant.id}.jurisdiction`] = variant.jurisdiction;
      for (const version of variant.versions) addAnnotatedDocumentVersion(fields, `variants.${variant.id}.versions.${version.id}`, version);
    }
    return fields;
  },
  "local-guidance-general-advice": (advice: Readonly<{ title: string; steps: readonly string[] }>) => {
    const fields: Record<string, string> = { title: advice.title };
    advice.steps.forEach((step, index) => { fields[`steps.${index}`] = step; });
    return fields;
  },
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
