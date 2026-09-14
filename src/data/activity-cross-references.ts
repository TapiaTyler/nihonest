import { activityCrossReferenceSchema, type ActivityCrossReference } from "@/domain/activity-cross-reference/activity-cross-reference";

function defineActivity(input: unknown): ActivityCrossReference {
  return activityCrossReferenceSchema.parse(input);
}

const currentPositionQuestion = {
  id: "current-position",
  label: "Current position",
  prompt: "What best describes your position now?",
  choices: [
    { id: "outside-japan", label: "Outside Japan" },
    { id: "work-status", label: "Living in Japan with a work status" },
    { id: "student-or-dependent", label: "Living in Japan as a student or dependent" },
    { id: "unrestricted-status", label: "Permanent Resident or another status without an immigration work restriction" },
    { id: "designated-or-other", label: "Designated Activities or another route" },
    { id: "not-sure", label: "I am not sure" },
  ],
} as const;

const activityRoleQuestion = {
  id: "activity-role",
  label: "Role in your stay",
  prompt: "How does this activity relate to your main reason for being in Japan?",
  choices: [
    { id: "principal", label: "It would be my principal activity" },
    { id: "secondary", label: "It would be secondary to my current activity" },
    { id: "not-sure", label: "I am not sure" },
  ],
} as const;

const licensingQuestion = {
  id: "professional-license",
  label: "Professional regulation",
  prompt: "Could the work require a Japanese professional licence or registration?",
  choices: [
    { id: "yes", label: "Yes" },
    { id: "no", label: "No" },
    { id: "not-sure", label: "I am not sure" },
  ],
} as const;

const researched = "researched" as const;

export const activityCrossReferences = [
  defineActivity({
    id: "take-or-change-work",
    label: "Take a job or change my work",
    shortLabel: "Take or change work",
    description: "Examine a new employer, changed duties, or a different principal occupation without relying on the job title alone.",
    mode: "guided",
    searchTerms: ["change jobs", "new employer", "change duties", "switch company", "start a job", "do I need to change my visa", "work visa", "teacher", "teaching", "developer", "software engineer", "designer", "photographer"],
    questions: [
      currentPositionQuestion,
      {
        id: "work-change",
        label: "What is changing",
        prompt: "What change are you considering?",
        choices: [
          { id: "first-job", label: "Starting work in Japan" },
          { id: "new-employer-same-duties", label: "A new employer with similar duties" },
          { id: "new-duties", label: "Materially different duties or occupation" },
          { id: "several-employers", label: "Working for more than one employer" },
          { id: "not-sure", label: "I am not sure" },
        ],
      },
      licensingQuestion,
    ],
    rules: [
      {
        id: "compare-activity-and-status",
        layer: "immigration",
        title: "Compare the actual duties with the residence route",
        orientation: "A similar title or industry does not settle whether the new principal duties fit the current status or require a different route.",
        verify: ["Principal and supporting duties", "Every employer or contracting organization", "Current status or exact designation", "Start date and current period of stay"],
        links: [
          { kind: "article", id: "choosing-a-work-status-and-coe", label: "Choosing a work status and COE", href: "/articles/choosing-a-work-status-and-coe" },
          { kind: "article", id: "renewing-or-changing-your-status-of-residence", label: "Renewing or changing status", href: "/articles/renewing-or-changing-your-status-of-residence" },
        ],
        assertion: { statement: "A materially different principal activity can require a change of status before it begins.", editorialState: researched, sourceIds: ["isa-change-status-application", "isa-extension-change-guidance"] },
      },
      {
        id: "separate-notification-from-permission",
        layer: "immigration",
        title: "Keep notifications separate from permission",
        orientation: "A resident or employer notification records a covered event; it does not by itself approve new duties or replace a required application.",
        verify: ["Whether the resident has a notification duty", "Whether the employer has a separate report", "Whether a change or other application is needed"],
        when: [{ questionId: "work-change", choiceIds: ["new-employer-same-duties", "new-duties", "several-employers"] }],
        links: [{ kind: "article", id: "notifying-immigration-about-work-contract-changes", label: "Notifying immigration about work contract changes", href: "/articles/notifying-immigration-about-work-contract-changes" }],
        assertion: { statement: "Covered organization or contract changes can create notification duties distinct from activity authorization.", editorialState: researched, sourceIds: ["isa-affiliated-organization-notification", "isa-affiliated-organization-faq"] },
      },
      {
        id: "review-employment-terms",
        layer: "employment-contract",
        title: "Review the employment and contract layer",
        orientation: "Immigration status does not decide working conditions, side-job rules, confidentiality, conflicts, intellectual property, or whether each relationship is employment or contracting.",
        verify: ["Written duties and workplace", "Working conditions and work rules", "Concurrent-work disclosure or consent", "Contract classification and responsibility"],
        links: [{ kind: "article", id: "understanding-your-employment-contract-and-working-conditions", label: "Employment contracts and working conditions", href: "/articles/understanding-your-employment-contract-and-working-conditions" }],
      },
      {
        id: "check-work-license",
        layer: "professional-licensing",
        title: "Confirm any Japanese professional authorization",
        orientation: "Immigration permission and a professional licence answer different questions. Check the regulator for the exact occupation and duties.",
        verify: ["Reserved activities", "Japanese licence or registration", "Foreign-credential recognition", "Supervision and workplace conditions"],
        when: [{ questionId: "professional-license", choiceIds: ["yes", "not-sure"] }],
        links: [{ kind: "article", id: "choosing-a-status-for-medical-and-care-work-in-japan", label: "Medical and care work routes", href: "/articles/choosing-a-status-for-medical-and-care-work-in-japan" }],
      },
    ],
  }),
  defineActivity({
    id: "add-side-work-or-freelancing",
    label: "Add side work or freelance work",
    shortLabel: "Side work or freelancing",
    description: "Separate immigration scope, outside-activity permission, employer rules, contracts, tax, and professional licensing.",
    mode: "guided",
    searchTerms: ["side hustle", "freelance", "second job", "remote overseas client", "part-time work", "work outside visa"],
    questions: [
      currentPositionQuestion,
      activityRoleQuestion,
      {
        id: "work-relationship",
        label: "Work arrangement",
        prompt: "How would the additional activity be arranged?",
        choices: [
          { id: "employee", label: "Employment with another organization" },
          { id: "client-contract", label: "Freelance or client contract" },
          { id: "own-business", label: "My own business or income-producing activity" },
          { id: "overseas-remote", label: "Remote work for an overseas employer or client" },
          { id: "not-sure", label: "I am not sure" },
        ],
      },
      licensingQuestion,
    ],
    rules: [
      {
        id: "check-current-work-scope",
        layer: "immigration",
        title: "Check the current status and exact additional activity",
        orientation: "Secondary, online, overseas-paid, or freelance work is not automatically inside or outside Japanese immigration rules.",
        verify: ["Current status and any individual designation", "Exact duties and payer", "Hours, frequency, worksite, and start date", "Existing outside-activity permission and its wording"],
        links: [
          { kind: "article", id: "side-work-and-freelancing-on-a-work-status", label: "Side work and freelancing on a work status", href: "/articles/side-work-and-freelancing-on-a-work-status" },
          { kind: "residence-status", id: "designated-activities", label: "Designated Activities", href: "/residence-statuses/designated-activities" },
        ],
        assertion: { statement: "Paid activity outside the current status scope can require prior outside-activity permission or a different status analysis.", editorialState: researched, sourceIds: ["isa-outside-activity-rules"] },
      },
      {
        id: "individual-permission-pattern",
        layer: "immigration",
        title: "Do not assume the ordinary blanket permission applies",
        orientation: "Freelance, sole-proprietor, difficult-to-measure, and cross-status activities can require an individual review rather than a general hours-only answer.",
        verify: ["Blanket or individual permission", "Whether hours can be objectively confirmed", "Whether the principal activity continues", "Excluded or prohibited business settings"],
        when: [{ questionId: "work-relationship", choiceIds: ["client-contract", "own-business", "overseas-remote", "not-sure"] }],
        links: [{ kind: "article", id: "side-work-and-freelancing-on-a-work-status", label: "Outside-activity permission and freelance work", href: "/articles/side-work-and-freelancing-on-a-work-status" }],
        assertion: { statement: "ISA identifies sole-proprietor and objectively difficult-to-measure work among individual-permission examples.", editorialState: researched, sourceIds: ["isa-outside-activity-rules"] },
      },
      {
        id: "employer-and-contract-check",
        layer: "employment-contract",
        title: "Check employer and contract restrictions separately",
        orientation: "Immigration permission does not waive work rules, consent requirements, working-time concerns, confidentiality, conflicts, or intellectual-property terms.",
        verify: ["Primary-employer work rules", "Disclosure or consent process", "Combined working time and health", "Confidentiality, conflicts, and ownership of work"],
        links: [{ kind: "article", id: "side-work-and-freelancing-on-a-work-status", label: "Employer and contract boundaries for side work", href: "/articles/side-work-and-freelancing-on-a-work-status" }],
        assertion: { statement: "Employment-side guidance treats concurrent work, working time, and health management as separate considerations.", editorialState: researched, sourceIds: ["mhlw-side-jobs"] },
      },
      {
        id: "side-income-tax",
        layer: "tax",
        title: "Trace the income and tax consequences",
        orientation: "Who pays, where they are located, and where money arrives do not by themselves answer Japanese income classification, withholding, bookkeeping, or filing questions.",
        verify: ["Tax residence", "Income category and source", "Withholding and records", "National and resident-tax filing", "Consumption-tax or invoice-system implications"],
        links: [{ kind: "article", id: "tax-for-side-work-and-sole-proprietors", label: "Tax for side work and sole proprietors", href: "/articles/tax-for-side-work-and-sole-proprietors" }],
        assertion: { statement: "A final-return obligation depends on tax facts separate from immigration authorization.", editorialState: researched, sourceIds: ["nta-final-tax-return", "nta-income-categories"] },
      },
      {
        id: "side-work-license",
        layer: "professional-licensing",
        title: "Confirm whether the service is professionally regulated",
        orientation: "A client contract and immigration permission do not authorize reserved professional services.",
        verify: ["Exact service offered", "Japanese professional licence or registration", "Advertising and title restrictions", "Responsible regulator"],
        when: [{ questionId: "professional-license", choiceIds: ["yes", "not-sure"] }],
        links: [{ kind: "article", id: "legal-accounting-services-status", label: "Legal and accounting services", href: "/articles/legal-accounting-services-status" }],
      },
    ],
  }),
  defineActivity({
    id: "study-or-train-while-resident",
    label: "Study, train, or complete an internship",
    shortLabel: "Study or train",
    description: "Check whether study remains secondary, whether practical activity is paid, and whether the institution or program changes the route.",
    mode: "guided",
    searchTerms: ["study on work visa", "internship", "night school", "language school while working", "training program"],
    questions: [
      currentPositionQuestion,
      activityRoleQuestion,
      {
        id: "study-activity",
        label: "Study arrangement",
        prompt: "What does the program include?",
        choices: [
          { id: "classroom-only", label: "Classes or study without paid practical work" },
          { id: "paid-internship", label: "A paid internship or practical activity" },
          { id: "unpaid-practical", label: "An unpaid internship or practical activity" },
          { id: "full-time-program", label: "A full-time program that may become my principal activity" },
          { id: "not-sure", label: "I am not sure" },
        ],
      },
    ],
    rules: [
      {
        id: "study-route-and-principal-activity",
        layer: "immigration",
        title: "Separate incidental study from a new principal activity",
        orientation: "A class taken alongside an existing authorized activity and a full-time program that becomes the purpose of residence can require different analysis.",
        verify: ["Program type and institution", "Schedule and duration", "Principal versus secondary activity", "Current status and attendance obligations"],
        links: [
          { kind: "article", id: "choosing-a-school-and-understanding-admission-requirements", label: "School and admission requirements", href: "/articles/choosing-a-school-and-understanding-admission-requirements" },
          { kind: "residence-status", id: "student", label: "Student status", href: "/residence-statuses/student" },
        ],
      },
      {
        id: "internship-work-analysis",
        layer: "immigration",
        title: "Examine practical activity and compensation",
        orientation: "Calling an arrangement an internship or unpaid does not settle whether the practical activity fits the current status or needs permission.",
        verify: ["Actual practical duties", "Compensation, benefits, or expense payments", "Hours and supervision", "Host organization and academic relationship"],
        when: [{ questionId: "study-activity", choiceIds: ["paid-internship", "unpaid-practical", "not-sure"] }],
        links: [{ kind: "article", id: "working-part-time-on-student-status", label: "Working while studying", href: "/articles/working-part-time-on-student-status" }],
        assertion: { statement: "A paid internship outside the current activity can require permission tailored to the arrangement.", editorialState: researched, sourceIds: ["isa-outside-activity-rules"] },
      },
      {
        id: "program-contracts-and-rights",
        layer: "employment-contract",
        title: "Identify whether the arrangement creates employment or another contract",
        orientation: "The program label does not determine pay, workplace protections, insurance, intellectual property, or responsibility for an injury.",
        verify: ["Written program and work terms", "Employee or trainee classification", "Pay and expenses", "Insurance, safety, and intellectual property"],
        when: [{ questionId: "study-activity", choiceIds: ["paid-internship", "unpaid-practical", "not-sure"] }],
        links: [{ kind: "article", id: "understanding-your-employment-contract-and-working-conditions", label: "Employment contracts and working conditions", href: "/articles/understanding-your-employment-contract-and-working-conditions" }],
      },
    ],
  }),
  defineActivity({
    id: "start-or-manage-business",
    label: "Start, own, or manage a business",
    shortLabel: "Start or manage a business",
    description: "Distinguish investing or owning shares from personally operating, managing, or working for a business.",
    mode: "guided",
    searchTerms: ["start a company", "open business", "business owner", "manage company", "founder visa", "sole proprietor"],
    questions: [
      currentPositionQuestion,
      activityRoleQuestion,
      {
        id: "business-role",
        label: "Your role",
        prompt: "What would you personally do?",
        choices: [
          { id: "invest-only", label: "Invest or own shares without operating the business" },
          { id: "operate", label: "Operate the business or deliver its services" },
          { id: "manage", label: "Manage the organization or a substantial division" },
          { id: "sole-proprietor", label: "Work independently as a sole proprietor" },
          { id: "not-sure", label: "I am not sure" },
        ],
      },
      licensingQuestion,
    ],
    rules: [
      {
        id: "business-activity-role",
        layer: "immigration",
        title: "Define the activity, not only the ownership",
        orientation: "Investment, ownership, operating services, management, and independent work are different activities. Founder or owner is not an immigration classification by itself.",
        verify: ["Daily operating and management duties", "Principal versus secondary activity", "Company, office, capital, employees, and contracts", "Current status and intended start date"],
        links: [
          { kind: "article", id: "business-manager-status", label: "Business Manager status", href: "/articles/business-manager-status" },
          { kind: "article", id: "startup-visa", label: "Start-up visa programs", href: "/articles/startup-visa" },
        ],
      },
      {
        id: "secondary-business-permission",
        layer: "immigration",
        title: "Check whether secondary operation needs separate permission",
        orientation: "Running an income-producing activity alongside a current status needs its own scope analysis; incorporation alone does not answer it.",
        verify: ["Current authorized principal activity", "Time and operational responsibility", "Clients, employees, and remuneration", "Outside-activity or change-of-status route"],
        when: [
          { questionId: "activity-role", choiceIds: ["secondary", "not-sure"] },
          { questionId: "business-role", choiceIds: ["operate", "manage", "sole-proprietor", "not-sure"] }
        ],
        links: [{ kind: "article", id: "side-work-and-freelancing-on-a-work-status", label: "Side work and freelancing", href: "/articles/side-work-and-freelancing-on-a-work-status" }],
        assertion: { statement: "Income-producing activity outside the current status scope can require an individual permission or change analysis.", editorialState: researched, sourceIds: ["isa-outside-activity-rules", "isa-change-status-application"] },
      },
      {
        id: "business-tax-and-records",
        layer: "tax",
        title: "Plan tax and recordkeeping separately",
        orientation: "Immigration, company formation, income tax, resident tax, bookkeeping, payroll, consumption tax, and invoice-system questions have separate triggers.",
        verify: ["Individual or company structure", "Income and expense records", "Payroll and withholding", "National and resident tax", "Consumption-tax and invoice registration"],
        links: [
          { kind: "article", id: "tax-for-side-work-and-sole-proprietors", label: "Tax for side work and sole proprietors", href: "/articles/tax-for-side-work-and-sole-proprietors" },
          { kind: "article", id: "consumption-tax-and-the-invoice-system", label: "Consumption tax and the invoice system", href: "/articles/consumption-tax-and-the-invoice-system" },
        ],
        assertion: { statement: "Business and filing obligations must be assessed separately from immigration permission.", editorialState: researched, sourceIds: ["nta-final-tax-return", "nta-starting-individual-business", "nta-consumption-tax-basics"] },
      },
      {
        id: "business-professional-license",
        layer: "professional-licensing",
        title: "Check regulated services and business licences",
        orientation: "A company or immigration status does not authorize reserved professional services or replace sector permits.",
        verify: ["Services actually offered", "Professional title and reserved activity", "National, prefectural, or municipal permit", "Responsible person and regulator"],
        when: [{ questionId: "professional-license", choiceIds: ["yes", "not-sure"] }],
        links: [{ kind: "article", id: "business-manager-status", label: "Business Manager boundaries", href: "/articles/business-manager-status" }],
      },
    ],
  }),
  defineActivity({
    id: "join-or-support-family",
    label: "Join family or support a family member",
    shortLabel: "Family in Japan",
    description: "Start with the exact relationship, sponsor route, dependency, and intended activity.",
    mode: "handoff",
    searchTerms: ["bring spouse", "bring child", "family visa", "dependent", "spouse work"],
    questions: [],
    rules: [{ id: "family-route-handoff", layer: "immigration", title: "Use the relationship-first family comparison", orientation: "Family routes and work consequences depend on the exact relationship and sponsor position.", verify: ["Relationship", "Sponsor status", "Dependency and intended activity"], links: [{ kind: "article", id: "choosing-a-family-or-personal-status-in-japan", label: "Choosing a family or personal status", href: "/articles/choosing-a-family-or-personal-status-in-japan" }] }],
  }),
  defineActivity({
    id: "perform-regulated-profession",
    label: "Work in a regulated profession",
    shortLabel: "Regulated profession",
    description: "Check Japanese professional authorization independently from immigration work permission.",
    mode: "handoff",
    searchTerms: ["professional license", "doctor", "nurse", "lawyer", "accountant", "regulated job"],
    questions: [],
    rules: [{ id: "regulated-profession-handoff", layer: "professional-licensing", title: "Identify the profession and responsible regulator", orientation: "A foreign credential or unrestricted immigration work status may not authorize reserved practice in Japan.", verify: ["Exact profession", "Japanese licence or registration", "Immigration route"], links: [{ kind: "article", id: "choosing-a-status-for-medical-and-care-work-in-japan", label: "Medical and care work comparison", href: "/articles/choosing-a-status-for-medical-and-care-work-in-japan" }, { kind: "article", id: "legal-accounting-services-status", label: "Legal and accounting services", href: "/articles/legal-accounting-services-status" }] }],
  }),
  defineActivity({
    id: "leave-and-return-to-japan",
    label: "Leave Japan temporarily and return",
    shortLabel: "Temporary travel and re-entry",
    description: "Keep the passport, status, period of stay, residence card, and re-entry route distinct.",
    mode: "handoff",
    searchTerms: ["travel while resident", "re-entry permit", "leave Japan vacation", "return to Japan", "status expires abroad"],
    questions: [],
    rules: [{ id: "reentry-handoff", layer: "immigration", title: "Use the temporary-travel and re-entry guide", orientation: "A valid card or old visa sticker alone does not answer whether and when a resident may return under the same status.", verify: ["Passport", "Current period of stay", "Re-entry procedure", "Return date"], links: [{ kind: "article", id: "reentry-permission-and-temporary-travel", label: "Re-entry permission and temporary travel", href: "/articles/reentry-permission-and-temporary-travel" }] }],
  }),
  defineActivity({
    id: "receive-or-report-income",
    label: "Receive income or understand tax reporting",
    shortLabel: "Income and tax",
    description: "Start with tax residence, income type, source, withholding, and filing—not only where payment arrives.",
    mode: "handoff",
    searchTerms: ["pay taxes", "foreign income", "side income", "tax return", "resident tax", "overseas client"],
    questions: [],
    rules: [{ id: "tax-handoff", layer: "tax", title: "Use the tax-residence and income guides", orientation: "Immigration status, payer location, and bank-account location do not by themselves determine Japanese tax treatment.", verify: ["Tax residence", "Income type and source", "Withholding", "National and resident-tax filing"], links: [{ kind: "article", id: "tax-residence-and-taxable-income-in-japan", label: "Tax residence and taxable income", href: "/articles/tax-residence-and-taxable-income-in-japan" }, { kind: "article", id: "filing-a-japanese-income-tax-return", label: "Filing an income-tax return", href: "/articles/filing-a-japanese-income-tax-return" }] }],
  }),
] as const;

export function getActivityCrossReference(id: string) {
  return activityCrossReferences.find((activity) => activity.id === id);
}
