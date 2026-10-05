import { z } from "zod";
import { residenceApplicationFeePeriodIds, type ResidenceApplicationFeeData } from "./residence-application-fees";

/**
 * English-only v2 copy for the residence application fee section. Every amount and date comes from the numeric fee
 * record through named `{placeholders}`, so translated copy can change word order but never restate a number.
 * Period labels are keyed by the fee record's period IDs. Formatting rules are explicit and locale-specific.
 */
export const residenceApplicationFeeCopyIds = [
  "heading", "previous-schedule", "current-schedule", "caption",
  "header-period", "header-counter", "header-online-base", "header-online-total",
  ...residenceApplicationFeePeriodIds.map((periodId) => `period-${periodId}` as const),
  "processing", "schedule-rule", "fraud-label", "fraud-body",
] as const;

export type ResidenceApplicationFeeCopyId = (typeof residenceApplicationFeeCopyIds)[number];

export const residenceApplicationFeeTemplateNames = [
  "previousFrom", "previousThrough", "previousCounter", "previousOnline", "currentFrom",
  "processingUnderThree", "processingThreeOrMore", "reducedFee", "emailDomain",
] as const;

export type ResidenceApplicationFeeTemplateName = (typeof residenceApplicationFeeTemplateNames)[number];

/** Placeholder names in a template, using the interface-message grammar (`{name}`, word characters only). */
export function residenceApplicationFeePlaceholders(text: string): Set<string> {
  return new Set(Array.from(text.matchAll(/\{(\w+)\}/g), (match) => match[1]!));
}

const knownNames = new Set<string>(residenceApplicationFeeTemplateNames);

export const residenceApplicationFeeCopySchema = z.object({
  schemaVersion: z.literal(2),
  kind: z.literal("residence-application-fees"),
  messages: z.array(z.object({
    id: z.enum(residenceApplicationFeeCopyIds),
    text: z.string().refine((value) => value.trim().length > 0, "Fee copy cannot be blank."),
  }).strict()).length(residenceApplicationFeeCopyIds.length),
}).strict().superRefine((copy, context) => {
  copy.messages.forEach((message, index) => {
    if (message.id !== residenceApplicationFeeCopyIds[index]) {
      context.addIssue({ code: "custom", path: ["messages", index, "id"], message: "Fee copy must list every message once in canonical order." });
    }
    for (const name of residenceApplicationFeePlaceholders(message.text)) {
      if (!knownNames.has(name)) context.addIssue({ code: "custom", path: ["messages", index, "text"], message: `Unknown fee placeholder {${name}}.` });
    }
  });
});

export type ResidenceApplicationFeeCopy = z.infer<typeof residenceApplicationFeeCopySchema>;
type Locale = "en" | "ja";

export function formatResidenceApplicationFeeYen(amount: number, locale: Locale): string {
  const formatted = new Intl.NumberFormat("en-US").format(amount);
  return locale === "ja" ? `${formatted}円` : `JPY ${formatted}`;
}

export function formatResidenceApplicationFeeDate(date: string, locale: Locale): string {
  const [year, month, day] = date.split("-").map(Number) as [number, number, number];
  return locale === "ja"
    ? `${year}年${month}月${day}日`
    : new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)));
}

/** The formatted values for every placeholder, in the language of the copy being filled. */
export function residenceApplicationFeeTemplateValues(fees: ResidenceApplicationFeeData, locale: Locale): Readonly<Record<ResidenceApplicationFeeTemplateName, string>> {
  const { previousSchedule, currentSchedule } = fees;
  const yen = (amount: number) => formatResidenceApplicationFeeYen(amount, locale);
  const date = (value: string) => formatResidenceApplicationFeeDate(value, locale);
  return {
    previousFrom: date(previousSchedule.acceptedFrom),
    previousThrough: date(previousSchedule.acceptedThrough),
    previousCounter: yen(previousSchedule.counterYen),
    previousOnline: yen(previousSchedule.onlineYen),
    currentFrom: date(currentSchedule.acceptedFrom),
    processingUnderThree: yen(currentSchedule.processingYen.underThreeYears),
    processingThreeOrMore: yen(currentSchedule.processingYen.threeYearsOrMore),
    reducedFee: yen(fees.qualifyingReducedFeeYen),
    emailDomain: fees.onlinePaymentEmailDomain,
  };
}

/** Fills known placeholders; an unknown name is left as written (validation rejects it before rendering). */
export function fillResidenceApplicationFeeTemplate(text: string, values: Readonly<Record<string, string>>): string {
  return text.replace(/\{(\w+)\}/g, (placeholder, name: string) => Object.hasOwn(values, name) ? values[name]! : placeholder);
}
