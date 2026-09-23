import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { faqs } from "@/data/faqs";
import { createTranslationSourceRevision } from "@/lib/translation/source-revision";
import { japaneseFaqTranslations } from "./faq-translations";

vi.mock("server-only", () => ({}));

describe("Japanese FAQ translations", () => {
  it("publishes one current machine-translated artifact for the bounded FAQ batch", () => {
    expect(japaneseFaqTranslations).toHaveLength(104);
    expect(new Set(japaneseFaqTranslations.map(({ contentId }) => contentId)).size).toBe(104);
    expect(japaneseFaqTranslations.every(({ availability, reviewState }) => (
      availability === "active" && reviewState === "machine-translated"
    ))).toBe(true);
    expect(japaneseFaqTranslations.slice(20, 32).map(({ contentId }) => contentId)).toEqual([
      "renew-or-change-residence-status",
      "temporary-travel-and-reentry",
      "choose-school-in-japan",
      "stay-after-graduation-job-hunting",
      "garbage-rules-same-everywhere",
      "find-japanese-classes-and-local-support",
      "work-in-japan-without-japanese",
      "employer-duties-when-hiring-foreign-worker",
      "status-after-divorce-or-bereavement",
      "prepare-for-permanent-residence",
      "first-year-resident-tax",
      "foreign-employer-or-account-tax",
    ]);
    expect(japaneseFaqTranslations.slice(32, 44).map(({ contentId }) => contentId)).toEqual([
      "short-visit-visa-or-exemption",
      "temporary-visitor-paid-work",
      "school-support-for-student-coe",
      "dispose-oversized-waste-or-batteries",
      "internet-included-in-apartment",
      "consumer-problem-get-help",
      "software-developer-work-status",
      "english-teacher-work-status",
      "foreign-worker-minimum-wage",
      "bring-parent-partner-or-relative-to-japan",
      "employer-handles-all-taxes",
      "withholding-slip-after-changing-jobs",
    ]);
    expect(japaneseFaqTranslations.slice(44, 56).map(({ contentId }) => contentId)).toEqual([
      "foreign-license-valid-for-driving-in-japan",
      "evacuation-site-or-shelter",
      "consumer-contract-only-japanese",
      "employment-contract-only-in-japanese",
      "salary-includes-all-overtime",
      "employer-says-social-insurance-optional",
      "harassment-affects-residence-status",
      "choose-designated-activities-route",
      "diplomatic-passport-residence-status",
      "visa-decides-tax-residence",
      "tax-before-leaving-japan",
      "company-can-ban-side-jobs",
    ]);
    expect(japaneseFaqTranslations.slice(56, 68).map(({ contentId }) => contentId)).toEqual([
      "foreign-license-conversion-three-months",
      "handle-neighbor-or-building-problem",
      "neighborhood-association-mandatory",
      "j-find-eligible-university",
      "working-holiday-route",
      "medical-stay-over-ninety-days",
      "jlpt-n2-required-for-software-developer",
      "creative-media-work-status",
      "nurse-or-care-worker-status",
      "business-manager-startup-capital",
      "two-hundred-thousand-yen-tax-rule",
      "tax-treaty-183-day-rule",
    ]);
    expect(japaneseFaqTranslations.slice(68, 80).map(({ contentId }) => contentId)).toEqual([
      "digital-nomad-japanese-employer",
      "working-holiday-second-participation",
      "medical-stay-attendant-work",
      "compulsory-car-insurance-covers-damage",
      "bicycle-blue-ticket-rules",
      "specified-skilled-worker-japanese-test",
      "employment-skill-development-start-date",
      "employment-skill-development-transfer",
      "technical-intern-to-specified-skilled-worker",
      "dismissal-ends-residence-status",
      "side-work-business-or-miscellaneous-income",
      "invoice-registration-consumption-tax",
    ]);
    expect(japaneseFaqTranslations.slice(80, 92).map(({ contentId }) => contentId)).toEqual([
      "religious-worker-dispatch-to-japan",
      "skilled-labor-or-specified-skilled-worker",
      "foreign-chef-work-status",
      "experienced-tradesperson-skilled-labor",
      "choose-training-or-workforce-route",
      "technical-intern-program-ending",
      "notify-immigration-after-job-change",
      "fixed-term-five-year-conversion",
      "work-injury-employer-not-enrolled",
      "working-hours-across-two-jobs",
      "freelance-act-applies",
      "freelance-payment-sixty-days",
    ]);
    expect(japaneseFaqTranslations.slice(-11).map(({ contentId }) => contentId)).toEqual([
      "bicycle-on-sidewalk-in-japan",
      "cooling-off-every-contract",
      "long-stay-sightseeing-work-or-children",
      "jlpt-pass-guarantees-job",
      "native-level-english-teaching-requirement",
      "photographer-work-status",
      "freelance-artist-or-content-creator",
      "foreign-medical-license-in-japan",
      "care-worker-registration-pending",
      "foreign-lawyer-or-accountant-in-japan",
      "legal-or-accounting-office-support-work",
    ]);
    expect(japaneseFaqTranslations.slice(-1).map(({ contentId }) => contentId)).toEqual([
      "permanent-residence-maximum-period-2027",
    ]);
  });

  it("matches canonical FAQ and shared translation-input revisions", () => {
    const terminology = readFileSync(resolve(process.cwd(), "src/data/translations/ja/protected-terminology.ts"), "utf8");
    const prompt = readFileSync(resolve(process.cwd(), "content/translations/JAPANESE-STRUCTURED-CONTENT-PROMPT.md"), "utf8");
    const terminologyRevision = createTranslationSourceRevision({ source: terminology });
    const promptRevision = createTranslationSourceRevision({ source: prompt });
    const expectedSourceRevisions = Object.fromEntries(japaneseFaqTranslations.map(({ contentId }) => {
      const faq = faqs.find(({ id }) => id === contentId);
      expect(faq).toBeDefined();
      return [contentId, createTranslationSourceRevision({ question: faq!.question, summary: faq!.summary })];
    }));
    expect(Object.fromEntries(japaneseFaqTranslations.map(({ contentId, sourceRevision }) => [contentId, sourceRevision])))
      .toEqual(expectedSourceRevisions);

    for (const artifact of japaneseFaqTranslations) {
      const faq = faqs.find(({ id }) => id === artifact.contentId);
      expect(faq).toBeDefined();
      expect(artifact.terminologyRevision).toBe(terminologyRevision);
      expect(artifact.promptRevision).toBe(promptRevision);
    }
  });
});
