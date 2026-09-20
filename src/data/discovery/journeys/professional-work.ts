import { guidedJourneySchema } from "@/domain/discovery/discovery";
import { articleStep, conditionalStep, routeChoice, settlementSteps } from "@/data/discovery/journey-steps";
import { professionalRoutes } from "@/data/discovery/professional-routes";

/** Guided journeys owned by the professional-work family. */
export const professionalWorkerMovingToJapanJourney = guidedJourneySchema.parse({
    id: "professional-worker-moving-to-japan", groupId: "professional-work", title: "Professional worker journey",
    description: "Choose the status matching the real professional activity, then follow one focused sponsorship, entry, and settlement path.",
    introduction: "The work statuses are alternatives. Once one is selected, other professional-status guides are removed from the sequence.",
    routes: professionalRoutes,
    phases: [
      { id: "understand", title: "Understand work-status residence", steps: [articleStep("visa-and-status-of-residence-explained"), articleStep("choosing-a-work-status-and-coe")] },
      { id: "choose-route", title: "Choose the status matching your work", steps: [routeChoice] },
      { id: "prepare", title: "Prepare for entry", steps: [articleStep("preparing-for-long-term-entry-to-japan")] },
      { id: "settle", title: "Arrive and settle", steps: settlementSteps() },
    ],
  });

export const acceptingForeignWorkersJourney = guidedJourneySchema.parse({
    id: "accepting-foreign-workers", groupId: "professional-work", title: "Foreign worker acceptance journey",
    description: "Define a lawful role, select the activity-based route to examine, support the application, onboard the worker, and manage later reports and changes.",
    introduction: "The employer supports a truthful role and evidence, but government authorities decide the COE, visa, landing, change, and extension. Select the worker's proposed professional route without treating the selection as an eligibility result.",
    routes: professionalRoutes,
    phases: [
      { id: "design-role", title: "Define the role and examine a status", steps: [articleStep("choosing-a-work-status-and-coe"), routeChoice] },
      { id: "recruit-and-apply", title: "Recruit lawfully and support the application", steps: [articleStep("accepting-foreign-workers-and-supporting-coe-applications")] },
      { id: "manage-changes", title: "Manage contracts and later changes", steps: [articleStep("notifying-immigration-about-work-contract-changes")] },
    ],
  });

export const sideWorkOrFreelancingWhileEmployedJourney = guidedJourneySchema.parse({
    id: "side-work-or-freelancing-while-employed", groupId: "professional-work", title: "Side work while employed journey",
    description: "Identify your current professional status, then check permission, contracts, notifications, and tax duties for additional work.",
    introduction: "Selecting the current work status keeps its scope visible without presenting unrelated professional statuses as later steps.",
    routes: professionalRoutes,
    phases: [
      { id: "current-status", title: "Identify your current work status", steps: [routeChoice] },
      { id: "assess-side-work", title: "Assess the proposed side work", steps: [articleStep("side-work-and-freelancing-on-a-work-status"), conditionalStep("side-jobs-and-multiple-employers-in-japan", "If the additional activity is employment with another employer"), conditionalStep("freelance-contracts-and-client-obligations-in-japan", "If a business will commission you as an independent freelancer"), conditionalStep("notifying-immigration-about-work-contract-changes", "If a covered contract or affiliated organization changes")] },
      { id: "handle-coverage", title: "Check coverage and working time", steps: [conditionalStep("employment-insurance-social-insurance-and-work-injury", "If employment coverage changes, you have multiple workplaces, or a work or commuting injury occurs"), conditionalStep("workplace-harassment-safety-and-getting-help", "If work becomes unsafe or a workplace problem requires help")] },
      { id: "handle-tax", title: "Handle tax records and filing", steps: [articleStep("tax-residence-and-taxable-income-in-japan"), articleStep("income-and-resident-tax-after-moving-to-japan"), conditionalStep("payroll-withholding-and-year-end-adjustment", "If you receive salary through Japanese payroll"), articleStep("tax-for-side-work-and-sole-proprietors"), conditionalStep("consumption-tax-and-the-invoice-system", "If taxable sales, an election, or invoice registration may apply"), conditionalStep("filing-a-japanese-income-tax-return", "If your income, deductions, or filing circumstances require or support a final return")] },
      { id: "maintain-status", title: "Maintain the underlying status", steps: [articleStep("renewing-or-changing-your-status-of-residence")] },
    ],
  });
