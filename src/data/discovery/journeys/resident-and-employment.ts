import { guidedJourneySchema } from "@/domain/discovery/discovery";
import { articleStep, conditionalStep } from "@/data/discovery/journey-steps";

/** Guided journeys owned by the resident-and-employment family. */
export const ongoingResidentResponsibilitiesJourney = guidedJourneySchema.parse({
    id: "ongoing-resident-responsibilities", groupId: "taxes-and-resident-responsibilities", title: "Ongoing resident responsibilities journey",
    description: "Keep tax, immigration, and eventual departure obligations visible after initial arrival.",
    introduction: "These responsibilities apply differently based on employment, income, status, municipality, and future plans.",
    phases: [
      { id: "tax", title: "Maintain tax records", steps: [articleStep("tax-residence-and-taxable-income-in-japan"), articleStep("income-and-resident-tax-after-moving-to-japan"), conditionalStep("payroll-withholding-and-year-end-adjustment", "If you receive salary through Japanese payroll"), conditionalStep("foreign-income-tax-treaties-and-foreign-tax-credits", "If you receive foreign-connected income, paid foreign tax, or may claim treaty relief"), conditionalStep("tax-for-side-work-and-sole-proprietors", "If you earn outside ordinary salary or operate independently"), conditionalStep("consumption-tax-and-the-invoice-system", "If independent activity, taxable sales, an election, or invoice registration may apply"), conditionalStep("filing-a-japanese-income-tax-return", "If your income, deductions, or filing circumstances require or support a final return")] },
      { id: "work-changes", title: "Handle work changes", steps: [conditionalStep("side-work-and-freelancing-on-a-work-status", "If you plan additional paid work"), conditionalStep("notifying-immigration-about-work-contract-changes", "If a covered contract or organization changes")] },
      { id: "immigration", title: "Maintain immigration permission", steps: [articleStep("renewing-or-changing-your-status-of-residence")] },
      { id: "temporary-travel", title: "Prepare for temporary travel", steps: [conditionalStep("reentry-permission-and-temporary-travel", "When you plan to leave Japan temporarily and return under the current residence permission")] },
      { id: "departure", title: "Close out residence", steps: [conditionalStep("tax-procedures-before-leaving-japan", "When ending Japanese tax residence or leaving unresolved national or local tax matters"), conditionalStep("leaving-japan-and-closing-out-procedures", "When you prepare to leave Japan and end residence")] },
    ],
  });

export const employmentLifecycleInJapanJourney = guidedJourneySchema.parse({
    id: "employment-lifecycle-in-japan", groupId: "working-in-japan", title: "Employment lifecycle journey",
    description: "Review the employment relationship and working conditions, understand pay and time, then handle optional changes or an eventual employment ending.",
    introduction: "Employment rights, immigration permission, insurance, and tax use separate rules. This journey connects them without treating one as proof of another.",
    phases: [
      { id: "start", title: "Understand the employment arrangement", steps: [articleStep("understanding-your-employment-contract-and-working-conditions")] },
      { id: "work", title: "Check pay, time, and leave", steps: [articleStep("wages-working-hours-overtime-and-paid-leave")] },
      { id: "coverage", title: "Confirm coverage and safety", steps: [articleStep("employment-insurance-social-insurance-and-work-injury"), conditionalStep("workplace-harassment-safety-and-getting-help", "If the workplace is unsafe, harassment occurs, or another problem requires help")] },
      { id: "changes", title: "Handle additional work", steps: [conditionalStep("side-work-and-freelancing-on-a-work-status", "If you plan a second job, freelance project, or other paid activity"), conditionalStep("side-jobs-and-multiple-employers-in-japan", "If the additional activity is another employed role"), conditionalStep("freelance-contracts-and-client-obligations-in-japan", "If a business commissions you as an independent freelancer")] },
      { id: "ending", title: "Handle an employment ending", steps: [conditionalStep("resigning-dismissal-and-fixed-term-contract-endings", "When employment may end or a fixed-term renewal is uncertain"), conditionalStep("notifying-immigration-about-work-contract-changes", "If the ending or new contract creates a covered immigration notification"), conditionalStep("payroll-withholding-and-year-end-adjustment", "When collecting tax records or moving to another employer during the year")] },
    ],
  });
