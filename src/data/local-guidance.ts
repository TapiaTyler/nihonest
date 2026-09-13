import {
  localGuidanceSupplementSchema,
  supportedGeographySchema,
} from "@/domain/geography/local-guidance";

export const supportedGeographies = [
  { id: "tokyo", name: "Tokyo Metropolis", type: "metropolis", aliases: ["Tokyo"], selectable: false },
  { id: "aichi", name: "Aichi Prefecture", type: "prefecture", aliases: ["Aichi"], selectable: false },
  { id: "shinjuku", name: "Shinjuku City", type: "special-ward", parentId: "tokyo", aliases: ["Shinjuku", "Shinjuku Ward", "Shinjuku-ku"], selectable: true },
  { id: "nagoya", name: "Nagoya City", type: "designated-city", parentId: "aichi", aliases: ["Nagoya", "Nagoya-shi"], selectable: true },
].map((record) => supportedGeographySchema.parse(record));

const shared = { lastCheckedAt: "2026-09-13", status: "needs-review" } as const;

export const localGuidanceSupplements = [
  {
    ...shared, id: "shinjuku-address-registration", articleId: "registering-your-address-after-arrival", geographyId: "shinjuku",
    title: "Registering an address in Shinjuku", summary: "Shinjuku City handles moving notifications for residents of the special ward.",
    applicability: "Use this route only when your actual registered home is in Shinjuku City.", responsibleBody: "Shinjuku City", receivingOffice: "Shinjuku City Office or an eligible special branch office",
    actions: [{ title: "Confirm the correct notification and documents", description: "Choose the moving-in, moving-out, or within-city route on Shinjuku's current page. Family relationship records in another language may require a Japanese translation identifying the translator." }],
    sourceIds: ["shinjuku-address-changes"],
  },
  {
    ...shared, id: "nagoya-address-registration", articleId: "registering-your-address-after-arrival", geographyId: "nagoya",
    title: "Registering an address in Nagoya", summary: "Nagoya routes resident moving procedures through the ward office for the new address.",
    applicability: "Use this route for an address within Nagoya City; the service ward is part of Nagoya, not a separate municipality.", responsibleBody: "Nagoya City", receivingOffice: "Resident registration counter at the relevant ward office or branch",
    actions: [{ title: "Use the route for your kind of move", description: "Nagoya distinguishes arrival from outside the city from a move within Nagoya. Confirm the office for your new address and the current document list before visiting." }],
    sourceIds: ["nagoya-moving-procedures"], sourceFormatNote: "The linked city page is written in Easy Japanese. This summary is Nihonest guidance, not an official translation.",
  },
  {
    ...shared, id: "shinjuku-national-health-insurance", articleId: "joining-national-health-insurance", geographyId: "shinjuku",
    title: "National Health Insurance in Shinjuku", summary: "Shinjuku receives enrollment and withdrawal notifications from eligible residents and households.",
    applicability: "Confirm first that you are not covered through an employer or another excluded insurance route.", responsibleBody: "Shinjuku City", receivingOffice: "The National Health Insurance counter listed by Shinjuku City",
    actions: [{ title: "Check eligibility and notify the city promptly", description: "Use Shinjuku's current enrollment or withdrawal instructions and bring the records for your triggering event. Household notification responsibility and retroactive coverage can affect the procedure." }],
    sourceIds: ["shinjuku-national-health-insurance"],
  },
  {
    ...shared, id: "nagoya-national-health-insurance", articleId: "joining-national-health-insurance", geographyId: "nagoya",
    title: "National Health Insurance in Nagoya", summary: "Nagoya publishes current eligibility, exception, ward-office, and electronic routes.",
    applicability: "The local filing route applies only after national and employment-based coverage rules place you in municipal National Health Insurance.", responsibleBody: "Nagoya City", receivingOffice: "Insurance counter at the ward office for your address, or an eligible electronic route",
    actions: [{ title: "Match the event to Nagoya's procedure", description: "Check whether you are enrolling, withdrawing, or reporting another change, then use the city's current route and document instructions." }],
    sourceIds: ["nagoya-national-health-insurance"], sourceFormatNote: "The controlling city page is in Japanese. This English summary is not an official translation.",
  },
  {
    ...shared, id: "shinjuku-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "shinjuku",
    title: "Sorting and disposing of waste in Shinjuku", summary: "Shinjuku defines local separation, collection, and oversized-waste routes.",
    applicability: "Rules and collection points apply to addresses in Shinjuku; an exact collection day can vary by area.", responsibleBody: "Shinjuku City",
    actions: [{ title: "Identify the item before choosing a collection route", description: "Use Shinjuku's multilingual material for ordinary resources and garbage. Follow its separate current procedure for oversized items, regulated appliances, batteries, or business waste." }],
    sourceIds: ["shinjuku-waste-disposal"],
  },
  {
    ...shared, id: "nagoya-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", geographyId: "nagoya",
    title: "Sorting and disposing of waste in Nagoya", summary: "Nagoya provides multilingual sorting material and an address-specific collection-day lookup.",
    applicability: "Use the lookup for the exact Nagoya address rather than assuming one citywide schedule.", responsibleBody: "Nagoya City",
    actions: [{ title: "Check the category and your address", description: "Open the current multilingual guide, classify the item, and then confirm the collection day and point for your address. Use the city's separate route when the item is not ordinary household collection." }],
    sourceIds: ["nagoya-waste-guide"], sourceFormatNote: "The landing page is in Japanese and links multilingual resources. Nihonest does not reproduce an official translation.",
  },
  {
    ...shared, id: "shinjuku-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "shinjuku",
    title: "Resident tax in Shinjuku", summary: "Shinjuku explains local resident-tax reporting, payment, certificates, and departure procedures.",
    applicability: "The responsible municipality generally follows the registered address on January 1; moving later does not automatically move that year's bill.", responsibleBody: "Shinjuku City", receivingOffice: "Shinjuku City Tax Affairs Division for city resident-tax matters",
    actions: [{ title: "Confirm who has already reported your income", description: "Check whether an income-tax return or employer salary report means no separate resident-tax report is needed. Before leaving Japan, review payment or tax-agent steps for any remaining liability." }],
    sourceIds: ["shinjuku-resident-tax"],
  },
  {
    ...shared, id: "nagoya-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", geographyId: "nagoya",
    title: "Resident tax in Nagoya", summary: "Nagoya's foreign-resident tax guide covers personal resident tax, payment, certificates, and departure-related questions.",
    applicability: "Use Nagoya's route when Nagoya is the municipality responsible for the relevant resident-tax year.", responsibleBody: "Nagoya City", receivingOffice: "The responsible municipal tax office identified by Nagoya City",
    actions: [{ title: "Use the current tax guide for the relevant year", description: "Confirm the applicable tax year, January 1 address, collection method, outstanding notices, and any steps required before leaving Japan." }],
    sourceIds: ["nagoya-personal-tax-guide"], sourceFormatNote: "The city landing page is in Japanese and links a dated foreign-resident guide. This summary is not an official translation.",
  },
  {
    ...shared, id: "shinjuku-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "shinjuku",
    title: "Hazard information for Shinjuku", summary: "Shinjuku publishes a local flood hazard map to combine with live warnings and building-specific planning.",
    applicability: "A modeled hazard map does not predict a live event or establish the safest route from every building.", responsibleBody: "Shinjuku City",
    actions: [{ title: "Check your exact address before an emergency", description: "Review the current local hazard map, identify nearby designated locations and more than one route, and rely on live official instructions during an event." }],
    sourceIds: ["shinjuku-flood-hazard-map"],
  },
  {
    ...shared, id: "nagoya-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", geographyId: "nagoya",
    title: "Disaster information for Nagoya", summary: "Nagoya's foreign-resident portal points to multilingual preparedness and emergency information.",
    applicability: "Use local maps for the exact address and live official information for the current event.", responsibleBody: "Nagoya City",
    actions: [{ title: "Build a local information plan", description: "Use Nagoya's current portal to find hazard information, preparedness resources, and multilingual support; verify your building, designated locations, and accessible routes separately." }],
    sourceIds: ["nagoya-disaster-information", "nagoya-international-center"], sourceFormatNote: "Some city resources are in Japanese or linked documents. Nihonest's summary is not an official translation.",
  },
  {
    ...shared, id: "shinjuku-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "shinjuku",
    title: "Language learning and consultation in Shinjuku", summary: "Shinjuku provides foreign-resident consultation and multiple local Japanese-learning routes.",
    applicability: "Eligibility, languages, availability, schedules, and fees can change; confirm them on the current service page.", responsibleBody: "Shinjuku City and named local service providers", receivingOffice: "Foreign Resident Advisory Corner or the provider named for a class",
    actions: [{ title: "Choose help by purpose", description: "Use the consultation route for daily-life questions and the language-learning directory for classes. Check the current language, age, residency-priority, registration, and availability rules before attending." }],
    sourceIds: ["shinjuku-foreign-resident-consultation", "shinjuku-japanese-language-classes"],
  },
  {
    ...shared, id: "nagoya-language-and-consultation", articleId: "finding-japanese-language-and-local-support", geographyId: "nagoya",
    title: "Language and consultation support in Nagoya", summary: "Nagoya International Center provides multilingual living information, consultation, referrals, and local support resources.",
    applicability: "The Center is a public institution linked to local support, but it does not replace the ward office or decide another authority's case.", responsibleBody: "Nagoya International Center",
    actions: [{ title: "Start with the service directory", description: "Choose the service matching your language and question, then confirm current hours, appointment requirements, and whether the Center provides information, interpretation, referral, or professional consultation." }],
    sourceIds: ["nagoya-international-center"],
  },
].map((record) => localGuidanceSupplementSchema.parse(record));
