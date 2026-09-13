import { articleGroupSchema, guidedJourneySchema } from "@/domain/discovery/discovery";

const articleStep = (articleId: string, routeIds?: readonly string[]) => ({
  id: articleId,
  type: "article" as const,
  articleId,
  ...(routeIds ? { routeIds: [...routeIds] } : {}),
});

const conditionalStep = (articleId: string, conditionLabel: string, routeIds?: readonly string[]) => ({
  id: articleId,
  type: "article" as const,
  articleId,
  requiredness: "conditional" as const,
  conditionLabel,
  ...(routeIds ? { routeIds: [...routeIds] } : {}),
});

const routeChoice = { id: "select-route", type: "route-choice" as const };

function settlementSteps(registeredRouteIds?: readonly string[]) {
  return [
    articleStep("finding-housing-and-moving-in"),
    articleStep("documents-received-when-entering-japan"),
    articleStep("registering-your-address-after-arrival", registeredRouteIds),
    articleStep("understanding-my-number", registeredRouteIds),
    conditionalStep("joining-national-health-insurance", "If you are not enrolled through another qualifying health-insurance route", registeredRouteIds),
    conditionalStep("national-pension-after-moving-to-japan", "If your age and coverage place you in the National Pension system", registeredRouteIds),
    articleStep("getting-a-phone-number-in-japan"),
    articleStep("opening-a-bank-account-after-moving-to-japan", registeredRouteIds),
  ];
}

const professionalRoutes = [
  { id: "professor", title: "Professor", description: "University and equivalent academic teaching or research route.", articleId: "professor-status" },
  { id: "artist", title: "Artist", description: "Qualifying income-producing artistic activity route.", articleId: "artist-status" },
  { id: "religious-activities", title: "Religious Activities", description: "Religious work dispatched by a foreign religious organization.", articleId: "religious-activities-status" },
  { id: "journalist", title: "Journalist", description: "Covered journalistic activity under contract with a foreign media organization.", articleId: "journalist-status" },
  { id: "legal-accounting-services", title: "Legal / Accounting Services", description: "Regulated legal or accounting work requiring the applicable Japanese qualification.", articleId: "legal-accounting-services-status" },
  { id: "medical-services", title: "Medical Services", description: "Regulated medical work under an accepted Japanese professional qualification.", articleId: "medical-services-status" },
  { id: "researcher", title: "Researcher", description: "Research activity under a qualifying contract with an organization in Japan.", articleId: "researcher-status" },
  { id: "instructor", title: "Instructor", description: "Language or other education at covered schools and institutions.", articleId: "instructor-status" },
  { id: "engineer-humanities-international-services", title: "Engineer / Humanities / International Services", description: "Qualifying technical, humanities, or international-services work.", articleId: "engineer-specialist-humanities-international-services-status" },
  { id: "intra-company-transferee", title: "Intra-company Transferee", description: "A qualifying transfer from an overseas office to a related office in Japan.", articleId: "intra-company-transferee-status" },
  { id: "nursing-care", title: "Nursing Care", description: "Covered care work using the required Japanese qualification.", articleId: "nursing-care-status" },
] as const;

export const articleGroups = [
  articleGroupSchema.parse({ id: "study-in-japan", title: "Study in Japan", description: "School planning, Student status, institutional onboarding, and guidance for students and the education providers accepting them.", articleIds: ["planning-your-studies-in-japan", "choosing-a-school-and-understanding-admission-requirements", "short-term-study-in-japan", "student-visa-and-certificate-of-eligibility", "preparing-to-enter-japan", "completing-school-arrival-procedures", "working-part-time-on-student-status", "continued-job-hunting-after-study", "accepting-international-students-and-supporting-coe-applications"] }),
  articleGroupSchema.parse({ id: "arrival-essentials", title: "Arrival essentials", description: "Shared early-settlement guidance whose applicability depends on residence, registration, age, and coverage—not one visa label.", articleIds: ["documents-received-when-entering-japan", "registering-your-address-after-arrival", "understanding-my-number", "joining-national-health-insurance", "national-pension-after-moving-to-japan", "finding-housing-and-moving-in", "getting-a-phone-number-in-japan", "opening-a-bank-account-after-moving-to-japan"] }),
  articleGroupSchema.parse({ id: "professional-work", title: "Professional work", description: "Individual work statuses and guidance for academic, creative, religious, media, regulated, research, teaching, technical, transfer, care, and employer-supported routes.", articleIds: ["visa-and-status-of-residence-explained", "choosing-a-work-status-and-coe", "choosing-a-residence-status-for-teaching-in-japan", "choosing-a-residence-status-for-creative-and-media-work", "choosing-a-status-for-medical-and-care-work-in-japan", "accepting-foreign-workers-and-supporting-coe-applications", "preparing-for-long-term-entry-to-japan", "professor-status", "artist-status", "religious-activities-status", "journalist-status", "legal-accounting-services-status", "medical-services-status", "researcher-status", "instructor-status", "engineer-specialist-humanities-international-services-status", "intra-company-transferee-status", "nursing-care-status", "side-work-and-freelancing-on-a-work-status", "notifying-immigration-about-work-contract-changes"] }),
  articleGroupSchema.parse({ id: "business-and-high-skill", title: "Business and high-skill", description: "Highly Skilled Professional, Business Manager, and supported Start-up pathways for specialists, executives, and founders.", articleIds: ["visa-and-status-of-residence-explained", "choosing-a-work-status-and-coe", "preparing-for-long-term-entry-to-japan", "highly-skilled-professional-status", "business-manager-status", "startup-visa"] }),
  articleGroupSchema.parse({ id: "skilled-and-sector-work", title: "Skilled and sector-based work", description: "Entertainment, specialized skilled occupations, and direct Specified Skilled Worker routes, kept separate from development programs.", articleIds: ["visa-and-status-of-residence-explained", "choosing-a-work-status-and-coe", "choosing-a-residence-status-for-creative-and-media-work", "preparing-for-long-term-entry-to-japan", "entertainer-status", "skilled-labor-status", "specified-skilled-worker-status"] }),
  articleGroupSchema.parse({ id: "family-and-long-term-residence", title: "Family and long-term residence", description: "Compare family and personal-status routes by the exact relationship or position supporting residence, then prepare for entry or permanent residence.", articleIds: ["visa-and-status-of-residence-explained", "choosing-a-family-or-personal-status-in-japan", "preparing-for-long-term-entry-to-japan", "dependent-family-stay-visa", "spouse-or-child-of-japanese-national", "spouse-or-child-of-permanent-resident", "long-term-resident-status", "permanent-residence-in-japan"] }),
  articleGroupSchema.parse({ id: "culture-and-training", title: "Culture and training", description: "Non-remunerative Cultural Activities and Trainee routes, kept separate from Student and employment-based training.", articleIds: ["visa-and-status-of-residence-explained", "preparing-for-long-term-entry-to-japan", "cultural-activities-visa", "training-visa"] }),
  articleGroupSchema.parse({ id: "workforce-development-programs", title: "Workforce development programs", description: "Compare the legacy Technical Intern Training program, the Employment for Skill Development successor, and direct Specified Skilled Worker employment.", articleIds: ["choosing-a-training-or-workforce-development-route-in-japan", "technical-intern-training-status", "employment-for-skill-development-system", "specified-skilled-worker-status", "accepting-foreign-workers-and-supporting-coe-applications"] }),
  articleGroupSchema.parse({ id: "designated-activities", title: "Designated Activities", description: "An umbrella status containing distinct programs such as working holiday, J-Find, long-stay tourism, digital nomad, and graduate job hunting.", articleIds: ["visa-and-status-of-residence-explained", "designated-activities-status", "working-holiday-in-japan", "long-stay-sightseeing-designated-activities", "future-creation-j-find", "digital-nomad-designated-activities", "continued-job-hunting-after-study", "startup-visa"] }),
  articleGroupSchema.parse({ id: "short-stay-and-medical", title: "Short stay and medical visits", description: "Temporary Visitor, short-stay visa, and medical-stay guidance for people who are visiting rather than relocating under an ordinary residence route.", articleIds: ["visa-and-status-of-residence-explained", "temporary-visitor-and-short-stay", "medical-stay-visa", "short-term-study-in-japan"] }),
  articleGroupSchema.parse({ id: "diplomatic-and-official", title: "Diplomatic and official", description: "Special-purpose routes for recognized diplomatic and official government or international-organization activity.", articleIds: ["visa-and-status-of-residence-explained", "diplomatic-visa", "official-visa"] }),
  articleGroupSchema.parse({ id: "taxes-and-resident-responsibilities", title: "Taxes and resident responsibilities", description: "Ongoing obligations after arrival: income and resident tax, side work, immigration notifications, status renewal or change, temporary travel, and departure.", articleIds: ["income-and-resident-tax-after-moving-to-japan", "filing-a-japanese-income-tax-return", "side-work-and-freelancing-on-a-work-status", "notifying-immigration-about-work-contract-changes", "renewing-or-changing-your-status-of-residence", "reentry-permission-and-temporary-travel", "leaving-japan-and-closing-out-procedures"] }),
] as const;

export const guidedJourneys = [
  guidedJourneySchema.parse({
    id: "student-moving-to-japan", groupId: "study-in-japan", title: "Student journey",
    description: "Choose short-term study or Student status, then follow only the preparation and arrival steps relevant to that route.",
    introduction: "First identify whether you will enter as a Temporary Visitor or under Student status. Selecting a route produces a focused sequence.",
    routes: [
      { id: "temporary-visitor-study", title: "Short-term study as a Temporary Visitor", description: "A short course completed within the admitted visitor stay without paid work.", articleId: "short-term-study-in-japan" },
      { id: "student-status", title: "Long-term study under Student status", description: "The residence route for qualifying study that requires school and immigration preparation.", articleId: "student-visa-and-certificate-of-eligibility" },
    ],
    phases: [
      { id: "plan", title: "Plan your studies", steps: [articleStep("planning-your-studies-in-japan"), articleStep("choosing-a-school-and-understanding-admission-requirements")] },
      { id: "choose-route", title: "Choose your study route", steps: [routeChoice] },
      { id: "prepare", title: "Prepare to enter", steps: [articleStep("preparing-to-enter-japan", ["student-status"])] },
      { id: "settle", title: "Arrive and settle", steps: [...settlementSteps(["student-status"]), articleStep("completing-school-arrival-procedures")] },
      { id: "work-and-transition", title: "Work, travel, and later transitions", steps: [conditionalStep("working-part-time-on-student-status", "If you plan to undertake paid work", ["student-status"]), conditionalStep("reentry-permission-and-temporary-travel", "If you will leave Japan temporarily and return during your period of stay", ["student-status"]), conditionalStep("continued-job-hunting-after-study", "If you graduate and qualify to continue job hunting", ["student-status"])] },
    ],
  }),
  guidedJourneySchema.parse({
    id: "accepting-international-students", groupId: "study-in-japan", title: "International student acceptance journey",
    description: "Plan a defensible admission, COE-support, arrival, enrollment, and ongoing-support workflow for an education provider.",
    introduction: "The school supports admission and evidence, but ISA issues the COE. This journey keeps institutional actions separate from the student's own duties.",
    phases: [
      { id: "understand", title: "Understand the student's route", steps: [articleStep("choosing-a-school-and-understanding-admission-requirements"), articleStep("student-visa-and-certificate-of-eligibility")] },
      { id: "accept-and-support", title: "Accept the student and support the application", steps: [articleStep("accepting-international-students-and-supporting-coe-applications")] },
      { id: "receive-and-support", title: "Receive and support the student", steps: [articleStep("completing-school-arrival-procedures"), conditionalStep("working-part-time-on-student-status", "When explaining optional paid work and outside-activity permission")] },
    ],
  }),
  guidedJourneySchema.parse({
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
  }),
  guidedJourneySchema.parse({
    id: "accepting-foreign-workers", groupId: "professional-work", title: "Foreign worker acceptance journey",
    description: "Define a lawful role, select the activity-based route to examine, support the application, onboard the worker, and manage later reports and changes.",
    introduction: "The employer supports a truthful role and evidence, but government authorities decide the COE, visa, landing, change, and extension. Select the worker's proposed professional route without treating the selection as an eligibility result.",
    routes: professionalRoutes,
    phases: [
      { id: "design-role", title: "Define the role and examine a status", steps: [articleStep("choosing-a-work-status-and-coe"), routeChoice] },
      { id: "recruit-and-apply", title: "Recruit lawfully and support the application", steps: [articleStep("accepting-foreign-workers-and-supporting-coe-applications")] },
      { id: "manage-changes", title: "Manage contracts and later changes", steps: [articleStep("notifying-immigration-about-work-contract-changes")] },
    ],
  }),
  guidedJourneySchema.parse({
    id: "founder-or-highly-skilled-moving-to-japan", groupId: "business-and-high-skill", title: "Founder and highly skilled journey",
    description: "Choose a high-skill, supported start-up, or established business route before following shared entry and settlement steps.",
    introduction: "These alternatives have different eligibility tests. Select the route you can document now and treat later transitions separately.",
    routes: [
      { id: "highly-skilled-professional", title: "Highly Skilled Professional", description: "Points-based route for a qualifying highly skilled activity.", articleId: "highly-skilled-professional-status" },
      { id: "startup-pathway", title: "Start-up pathway", description: "Supported preparation route available through participating programs.", articleId: "startup-visa" },
      { id: "business-manager", title: "Business Manager", description: "Route for operating or managing a qualifying established business.", articleId: "business-manager-status" },
    ],
    phases: [
      { id: "understand", title: "Understand the alternatives", steps: [articleStep("visa-and-status-of-residence-explained"), articleStep("choosing-a-work-status-and-coe")] },
      { id: "choose-route", title: "Choose your business or high-skill route", steps: [routeChoice] },
      { id: "prepare", title: "Prepare for entry", steps: [articleStep("preparing-for-long-term-entry-to-japan")] },
      { id: "settle", title: "Arrive and settle", steps: settlementSteps() },
    ],
  }),
  guidedJourneySchema.parse({
    id: "skilled-or-sector-worker-moving-to-japan", groupId: "skilled-and-sector-work", title: "Skilled and sector worker journey",
    description: "Choose the relevant skilled or direct sector-work route, then follow its focused employment, entry, and settlement sequence.",
    introduction: "Entertainer, Skilled Labor, and Specified Skilled Worker are alternatives rather than consecutive steps. Development programs use a separate journey.",
    routes: [
      { id: "entertainer", title: "Entertainer", description: "Qualifying performance, entertainment, or professional-sports activity.", articleId: "entertainer-status" },
      { id: "skilled-labor", title: "Skilled Labor", description: "Specified occupations requiring specialized industrial skills.", articleId: "skilled-labor-status" },
      { id: "specified-skilled-worker", title: "Specified Skilled Worker", description: "Covered work in a designated industrial field.", articleId: "specified-skilled-worker-status" },
    ],
    phases: [
      { id: "understand", title: "Understand work-status residence", steps: [articleStep("visa-and-status-of-residence-explained"), articleStep("choosing-a-work-status-and-coe")] },
      { id: "choose-route", title: "Choose your skilled or sector route", steps: [routeChoice] },
      { id: "prepare", title: "Prepare for entry", steps: [articleStep("preparing-for-long-term-entry-to-japan")] },
      { id: "settle", title: "Arrive and settle", steps: settlementSteps() },
    ],
  }),
  guidedJourneySchema.parse({
    id: "workforce-development-in-japan", groupId: "workforce-development-programs", title: "Workforce development journey",
    description: "Distinguish a current legacy plan, the successor program beginning in April 2027, and direct Specified Skilled Worker employment.",
    introduction: "Program name, start date, approved plan, field, work category, skills and Japanese level, and prior participation determine the route. These options do not automatically convert into one another.",
    routes: [
      { id: "technical-intern-training", title: "Technical Intern Training", description: "A current or transition-protected legacy plan under the regulated technical-intern framework.", articleId: "technical-intern-training-status" },
      { id: "employment-for-skill-development", title: "Employment for Skill Development", description: "The employment-based successor program beginning April 1, 2027.", articleId: "employment-for-skill-development-system" },
      { id: "specified-skilled-worker", title: "Specified Skilled Worker", description: "Direct field-based employment for a person who can meet the applicable SSW requirements.", articleId: "specified-skilled-worker-status" },
    ],
    phases: [
      { id: "compare", title: "Compare training and workforce routes", steps: [articleStep("choosing-a-training-or-workforce-development-route-in-japan")] },
      { id: "choose-route", title: "Choose the program matching your dates and facts", steps: [routeChoice] },
      { id: "prepare", title: "Prepare for entry", steps: [articleStep("preparing-for-long-term-entry-to-japan")] },
      { id: "settle", title: "Arrive and settle", steps: settlementSteps() },
      { id: "travel", title: "Plan temporary travel", steps: [conditionalStep("reentry-permission-and-temporary-travel", "If you will leave Japan temporarily and return during your period of stay")] },
    ],
  }),
  guidedJourneySchema.parse({
    id: "joining-family-in-japan", groupId: "family-and-long-term-residence", title: "Joining family in Japan journey",
    description: "Choose the relationship or personal-position route that actually applies, then follow one focused family-entry path.",
    introduction: "Dependent, spouse or child, and Long-Term Resident routes are not interchangeable. Select the documented basis for residence.",
    routes: [
      { id: "dependent", title: "Dependent", description: "Eligible dependent spouse or child of a qualifying foreign resident.", articleId: "dependent-family-stay-visa" },
      { id: "spouse-child-japanese", title: "Spouse or child of a Japanese national", description: "Route based on the covered relationship to a Japanese national.", articleId: "spouse-or-child-of-japanese-national" },
      { id: "spouse-child-permanent-resident", title: "Spouse or child of a Permanent Resident", description: "Route based on the covered relationship to a Permanent Resident.", articleId: "spouse-or-child-of-permanent-resident" },
      { id: "long-term-resident", title: "Long-Term Resident", description: "A separately designated personal-position route for qualifying circumstances.", articleId: "long-term-resident-status" },
    ],
    phases: [
      { id: "understand", title: "Understand and compare family routes", steps: [articleStep("visa-and-status-of-residence-explained"), articleStep("choosing-a-family-or-personal-status-in-japan")] },
      { id: "choose-route", title: "Choose the applicable family or personal route", steps: [routeChoice] },
      { id: "prepare", title: "Prepare for entry", steps: [articleStep("preparing-for-long-term-entry-to-japan")] },
      { id: "settle", title: "Arrive and settle", steps: settlementSteps() },
      { id: "maintain", title: "Maintain your residence", steps: [conditionalStep("renewing-or-changing-your-status-of-residence", "Before the family member's period expires or the relationship, support, or principal status changes"), conditionalStep("reentry-permission-and-temporary-travel", "If you will leave Japan temporarily and return during your period of stay")] },
    ],
  }),
  guidedJourneySchema.parse({
    id: "cultural-activities-or-training-in-japan", groupId: "culture-and-training", title: "Culture and training journey",
    description: "Choose unpaid cultural study or a covered training arrangement, then follow the relevant long-term entry sequence.",
    introduction: "Cultural Activities and Trainee are alternatives with different authorized activities.",
    routes: [
      { id: "cultural-activities", title: "Cultural Activities", description: "Qualifying unpaid cultural or academic activity.", articleId: "cultural-activities-visa" },
      { id: "trainee", title: "Trainee", description: "A covered training arrangement distinct from ordinary employment.", articleId: "training-visa" },
    ],
    phases: [
      { id: "understand", title: "Understand the residence framework", steps: [articleStep("visa-and-status-of-residence-explained")] },
      { id: "choose-route", title: "Choose culture or training", steps: [routeChoice] },
      { id: "prepare", title: "Prepare for entry", steps: [articleStep("preparing-for-long-term-entry-to-japan")] },
      { id: "settle", title: "Arrive and settle", steps: settlementSteps() },
    ],
  }),
  guidedJourneySchema.parse({
    id: "working-holiday-in-japan", groupId: "designated-activities", title: "Working holiday journey",
    description: "Check bilateral eligibility, prepare the holiday-first application, and complete the settlement and departure tasks that apply.",
    introduction: "Working Holiday is one Designated Activities program. Country-specific conditions control eligibility and incidental work.",
    phases: [
      { id: "understand", title: "Understand the program", steps: [articleStep("designated-activities-status"), articleStep("working-holiday-in-japan")] },
      { id: "prepare", title: "Prepare for entry", steps: [articleStep("preparing-for-long-term-entry-to-japan")] },
      { id: "settle", title: "Arrive and settle", steps: settlementSteps() },
      { id: "maintain-and-leave", title: "Manage tax and departure", steps: [conditionalStep("income-and-resident-tax-after-moving-to-japan", "If you receive taxable income or need to establish your tax treatment"), articleStep("leaving-japan-and-closing-out-procedures")] },
    ],
  }),
  guidedJourneySchema.parse({
    id: "side-work-or-freelancing-while-employed", groupId: "professional-work", title: "Side work while employed journey",
    description: "Identify your current professional status, then check permission, contracts, notifications, and tax duties for additional work.",
    introduction: "Selecting the current work status keeps its scope visible without presenting unrelated professional statuses as later steps.",
    routes: professionalRoutes,
    phases: [
      { id: "current-status", title: "Identify your current work status", steps: [routeChoice] },
      { id: "assess-side-work", title: "Assess the proposed side work", steps: [articleStep("side-work-and-freelancing-on-a-work-status"), conditionalStep("notifying-immigration-about-work-contract-changes", "If a covered contract or affiliated organization changes")] },
      { id: "handle-tax", title: "Handle tax records and filing", steps: [articleStep("income-and-resident-tax-after-moving-to-japan"), conditionalStep("filing-a-japanese-income-tax-return", "If your income and filing circumstances require a final return")] },
      { id: "maintain-status", title: "Maintain the underlying status", steps: [articleStep("renewing-or-changing-your-status-of-residence")] },
    ],
  }),
  guidedJourneySchema.parse({
    id: "ongoing-resident-responsibilities", groupId: "taxes-and-resident-responsibilities", title: "Ongoing resident responsibilities journey",
    description: "Keep tax, immigration, and eventual departure obligations visible after initial arrival.",
    introduction: "These responsibilities apply differently based on employment, income, status, municipality, and future plans.",
    phases: [
      { id: "tax", title: "Maintain tax records", steps: [articleStep("income-and-resident-tax-after-moving-to-japan"), conditionalStep("filing-a-japanese-income-tax-return", "If your income and filing circumstances require a final return")] },
      { id: "work-changes", title: "Handle work changes", steps: [conditionalStep("side-work-and-freelancing-on-a-work-status", "If you plan additional paid work"), conditionalStep("notifying-immigration-about-work-contract-changes", "If a covered contract or organization changes")] },
      { id: "immigration", title: "Maintain immigration permission", steps: [articleStep("renewing-or-changing-your-status-of-residence")] },
      { id: "temporary-travel", title: "Prepare for temporary travel", steps: [conditionalStep("reentry-permission-and-temporary-travel", "When you plan to leave Japan temporarily and return under the current residence permission")] },
      { id: "departure", title: "Close out residence", steps: [conditionalStep("leaving-japan-and-closing-out-procedures", "When you prepare to leave Japan and end residence")] },
    ],
  }),
  guidedJourneySchema.parse({
    id: "digital-nomad-in-japan", groupId: "designated-activities", title: "Digital nomad journey",
    description: "Assess Japan's limited Digital Nomad route, remote-work boundaries, tax questions, and departure planning.",
    introduction: "This time-limited Designated Activities route is not a general local-employment or relocation route.",
    phases: [
      { id: "understand", title: "Understand the route", steps: [articleStep("visa-and-status-of-residence-explained"), articleStep("designated-activities-status"), articleStep("digital-nomad-designated-activities")] },
      { id: "tax", title: "Check tax treatment", steps: [conditionalStep("income-and-resident-tax-after-moving-to-japan", "If your work or stay creates a Japanese tax question")] },
      { id: "departure", title: "Prepare to leave", steps: [conditionalStep("leaving-japan-and-closing-out-procedures", "If you established accounts or obligations that require closure")] },
    ],
  }),
  guidedJourneySchema.parse({
    id: "j-find-future-creation", groupId: "designated-activities", title: "J-Find future-creation journey",
    description: "Check recent-graduate eligibility, prepare the permitted future-creation activity, and manage longer-stay responsibilities.",
    introduction: "Verify the current eligible institutions, graduation timing, finances, activity, and family conditions.",
    phases: [
      { id: "understand", title: "Understand the route", steps: [articleStep("visa-and-status-of-residence-explained"), articleStep("designated-activities-status"), articleStep("future-creation-j-find")] },
      { id: "prepare", title: "Prepare for entry", steps: [articleStep("preparing-for-long-term-entry-to-japan")] },
      { id: "settle", title: "Arrive and settle", steps: settlementSteps() },
      { id: "maintain", title: "Manage ongoing responsibilities", steps: [conditionalStep("income-and-resident-tax-after-moving-to-japan", "If income or activity creates a Japanese tax obligation"), conditionalStep("renewing-or-changing-your-status-of-residence", "If extending the stay or moving to another activity") ] },
    ],
  }),
  guidedJourneySchema.parse({
    id: "long-stay-sightseeing-in-japan", groupId: "designated-activities", title: "Long-stay sightseeing journey",
    description: "Check the long-stay sightseeing route while keeping its financial, insurance, no-work, and departure boundaries visible.",
    introduction: "This route supports qualifying sightseeing and recreation, not employment or freelancing.",
    phases: [
      { id: "understand", title: "Understand the route", steps: [articleStep("visa-and-status-of-residence-explained"), articleStep("designated-activities-status"), articleStep("long-stay-sightseeing-designated-activities")] },
      { id: "departure", title: "Prepare to leave", steps: [conditionalStep("leaving-japan-and-closing-out-procedures", "If you established accounts or obligations that require closure")] },
    ],
  }),
  guidedJourneySchema.parse({
    id: "short-visit-to-japan", groupId: "short-stay-and-medical", title: "Short visit journey",
    description: "Plan a Temporary Visitor stay without relying on long-term resident or work guidance.",
    introduction: "Visa requirements depend on nationality and circumstances. Temporary Visitor does not authorize paid work or ordinary resident settlement.",
    phases: [
      { id: "plan", title: "Plan the visit", steps: [articleStep("visa-and-status-of-residence-explained"), articleStep("temporary-visitor-and-short-stay"), conditionalStep("short-term-study-in-japan", "If the visit includes a short course")] },
      { id: "enter", title: "Understand entry records", steps: [articleStep("documents-received-when-entering-japan")] },
    ],
  }),
  guidedJourneySchema.parse({
    id: "medical-visit-to-japan", groupId: "short-stay-and-medical", title: "Medical stay journey",
    description: "Choose the medical-stay or ordinary short-visit route matching the planned treatment and length of stay.",
    introduction: "The alternatives have different evidence and duration considerations. Select the route that matches the actual visit.",
    routes: [
      { id: "medical-stay", title: "Medical Stay", description: "The specific visa route for planned treatment and related arrangements.", articleId: "medical-stay-visa" },
      { id: "temporary-visitor", title: "Ordinary short visit", description: "A short visit where the ordinary Temporary Visitor framework is appropriate.", articleId: "temporary-visitor-and-short-stay" },
    ],
    phases: [
      { id: "understand", title: "Understand visit permission", steps: [articleStep("visa-and-status-of-residence-explained")] },
      { id: "choose-route", title: "Choose the visit route", steps: [routeChoice] },
      { id: "enter", title: "Understand entry records", steps: [articleStep("documents-received-when-entering-japan")] },
    ],
  }),
  guidedJourneySchema.parse({
    id: "diplomatic-or-official-assignment", groupId: "diplomatic-and-official", title: "Diplomatic and official assignment journey",
    description: "Choose the recognized Diplomatic or Official route and follow the assignment-specific process.",
    introduction: "Ordinary work-status and settlement assumptions may not apply to these officially coordinated assignments.",
    routes: [
      { id: "diplomatic", title: "Diplomatic", description: "Recognized diplomatic activity and qualifying household members.", articleId: "diplomatic-visa" },
      { id: "official", title: "Official", description: "Recognized official governmental or international-organization activity.", articleId: "official-visa" },
    ],
    phases: [
      { id: "understand", title: "Understand the residence framework", steps: [articleStep("visa-and-status-of-residence-explained")] },
      { id: "choose-route", title: "Choose the assignment route", steps: [routeChoice] },
      { id: "enter", title: "Understand entry records", steps: [conditionalStep("documents-received-when-entering-japan", "If the general entry-document guidance applies to the assignment")] },
    ],
  }),
  guidedJourneySchema.parse({
    id: "preparing-for-permanent-residence", groupId: "family-and-long-term-residence", title: "Permanent residence preparation journey",
    description: "Organize the ongoing immigration and tax record supporting a future permanent-residence application.",
    introduction: "Eligibility depends on the applicable route and current criteria. This path supports preparation rather than predicting eligibility.",
    phases: [
      { id: "understand", title: "Understand the residence framework", steps: [articleStep("visa-and-status-of-residence-explained")] },
      { id: "maintain", title: "Maintain your record", steps: [articleStep("income-and-resident-tax-after-moving-to-japan"), articleStep("renewing-or-changing-your-status-of-residence")] },
      { id: "apply", title: "Prepare the application", steps: [articleStep("permanent-residence-in-japan")] },
    ],
  }),
] as const;
