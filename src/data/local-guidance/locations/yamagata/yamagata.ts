import { defineLocationGuidance } from "@/data/local-guidance/define-location";

/** Yamagata City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-06201", name: "Yamagata City", aliases: ["Yamagata","Yamagata-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "yamagata-address-registration", title: "Moving to Yamagata City from another municipality or overseas", url: "https://www.city.yamagata-yamagata.lg.jp/kurashi/todokede/1006445/1004073.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamagata-national-health-insurance", title: "National Health Insurance enrollment and withdrawal filings", url: "https://www.city.yamagata-yamagata.lg.jp/kurashi/kokuho/1006489/1006491/1003899.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamagata-waste-sorting", title: "Household waste sorting and collection rules", url: "https://www.city.yamagata-yamagata.lg.jp/kurashi/gomi/1006506/1006508/1001857.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamagata-waste-schedule", title: "Neighborhood collection days", url: "https://www.city.yamagata-yamagata.lg.jp/kurashi/gomi/1006506/1006508/1001917.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamagata-bulky-waste", title: "Bulky waste eligibility and collection application", url: "https://www.city.yamagata-yamagata.lg.jp/kurashi/gomi/1006506/1006508/1001914.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamagata-resident-tax-filing", title: "FY2026 individual city and prefectural tax filing", url: "https://www.city.yamagata-yamagata.lg.jp/kurashi/zeikin/1006468/1017267.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamagata-resident-tax-departure", title: "Resident tax and departure from Japan", url: "https://www.city.yamagata-yamagata.lg.jp/kurashi/zeikin/1006468/1006474/1017660.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamagata-hazard-maps", title: "City hazard-map directory", url: "https://www.city.yamagata-yamagata.lg.jp/kurashi/bousai/1006395/1012705.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamagata-flood-map-revision", title: "2026 revision of the flood hazard map", url: "https://www.city.yamagata-yamagata.lg.jp/kurashi/bousai/1006404/1006408/1002193.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamagata-foreign-resident-consultation", title: "Foreign-resident general and specialist consultation", url: "https://www.city.yamagata-yamagata.lg.jp/shiseijoho/kokusai/1017767/1017606.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamagata-international-services", title: "International exchange, Japanese classes, and language support", url: "https://www.city.yamagata-yamagata.lg.jp/shiseijoho/kokusai/index.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamagata-national-pension", title: "National Pension filing procedures", url: "https://www.city.yamagata-yamagata.lg.jp/kurashi/kokuho/1006497/1006500/1004093.html", language: "ja", lastCheckedAt: "2026-09-26" },
  ],
  supplements: [
    {
      id: "yamagata-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Registering an address in Yamagata City", summary: "Yamagata City handles move-in notices at the main city office; overseas arrivals and foreign residents have additional document requirements.",
      applicability: "For people moving into Yamagata City from another municipality or overseas. Confirm the correct documents for each household member and any case-specific records before visiting.", responsibleBody: "Yamagata City", receivingOffice: "Citizens Division, resident registration counter on the first floor of city hall",
      actions: [
        { title: "File after moving in and bring each person's records", description: "Submit the move-in notice within 14 days after starting to live at the new address. For a domestic move, bring the transfer certificate unless the My Number Card special procedure means one was not issued, identification, and each mover's My Number Card if they have one. Foreign residents should bring a residence card or special permanent resident certificate." },
        { title: "Prepare overseas-move records and use an authorized filer", description: "For a move from overseas, the city asks for each mover's passport and current family-register and family-register-address records, except for people whose registered domicile is Yamagata City. The mover, household head, or a person in the same Yamagata household may file; another filer needs authorization. The city has announced a counter-hours change, so check its current page before visiting." },
      ],
      sourceIds: ["yamagata-address-registration"], sourceFormatNote: "Yamagata City's procedure page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "yamagata-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "National Health Insurance in Yamagata City", summary: "Yamagata City handles National Health Insurance enrollment and withdrawal at its dedicated city-hall counter and identifies records for common coverage changes.",
      applicability: "Use this local process only after checking that municipal National Health Insurance is the right coverage route for you. Required proof depends on why your coverage changed.", responsibleBody: "Yamagata City", receivingOffice: "National Health Insurance qualification counter, first floor of city hall",
      actions: [
        { title: "Report an enrollment or withdrawal reason with supporting records", description: "The city lists proof of the date employer coverage ended or began for employment-related changes, and its table distinguishes moves, births, public-assistance changes, and other cases. Bring identification and My Number information for the household head and each person covered by the filing. Check the current city list for the exact records for your reason." },
        { title: "Confirm the current counter process and any exception", description: "The city page gives a dedicated enrollment and withdrawal counter and describes an exception for some people moving to another municipality while in a long-term care facility. Procedures and required proof can depend on the coverage event, so confirm the right filing with the qualification team; check separately for premium rates or reductions." },
      ],
      sourceIds: ["yamagata-national-health-insurance"], sourceFormatNote: "Yamagata City's procedure page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "yamagata-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Household waste in Yamagata City", summary: "Collection days and stations are neighborhood-specific; oversized items need a separate advance collection request, with online and telephone routes available.",
      applicability: "Use your neighborhood's calendar and the collection station assigned by your local association or building. Check the current city instructions for items excluded from municipal collection.", responsibleBody: "Yamagata City", receivingOffice: "Circular Society Promotion Division; local association or building manager for the assigned collection station",
      actions: [
        { title: "Check your local collection days and station", description: "Yamagata City publishes neighborhood collection calendars and a searchable schedule. Put separated household waste at the assigned station on its collection day during the city's stated 6 a.m. to 8 a.m. window. Rules and approved stations can vary by neighborhood; ask your building manager or local association where your household should take items." },
        { title: "Apply separately for oversized waste", description: "Items over the city's size threshold are not collected from ordinary neighborhood stations. Yamagata City provides advance bulky-waste collection applications online or by telephone; the accepted size and weight, fee, collection date, and placement instructions depend on the item and application. Check the current page and application result before setting an item out." },
      ],
      sourceIds: ["yamagata-waste-sorting", "yamagata-waste-schedule", "yamagata-bulky-waste"], sourceFormatNote: "Yamagata City's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "yamagata-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Resident tax in Yamagata City", summary: "Yamagata City bases resident-tax handling on the January 1 address and publishes yearly filing routes, including electronic and postal options.",
      applicability: "Identify the municipality where you were registered on January 1 for the relevant year. Filing exemptions and payment responsibilities depend on your income, tax notice, and circumstances.", responsibleBody: "Yamagata City", receivingOffice: "Citizens Tax Division; annual in-person filing venues vary by district and year",
      actions: [
        { title: "Use the current year's declaration instructions", description: "The city provides an annual declaration guide and identifies electronic filing, online form preparation, postal filing, and in-person consultations. The required forms, supporting records, eligibility for exemptions, dates, and venues change by tax year; use the current year's instructions or contact the Citizens Tax Division." },
        { title: "Arrange payment and departure procedures before leaving Japan", description: "Yamagata City explains that an address registered in the city on January 1 can create resident-tax liability for the following tax year even if the person later moves or leaves Japan. Its foreign-worker guidance describes a tax representative procedure when a resident cannot complete tax matters before departure. Confirm your notice and personal filing or payment steps directly with the city." },
      ],
      sourceIds: ["yamagata-resident-tax-filing", "yamagata-resident-tax-departure"], sourceFormatNote: "Yamagata City's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "yamagata-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Hazard maps and disaster preparation in Yamagata City", summary: "Yamagata City publishes maps for flood, landslide, earthquake, volcanic mudflow, and reservoir hazards; its 2026 flood-map revision changed coverage and some evacuation locations.",
      applicability: "Check the current map for your exact address and relevant hazards. Map designations do not confirm which evacuation location is open during an incident.", responsibleBody: "Yamagata City", receivingOffice: "Disaster Prevention Division for maps and alerts; River Works Division for flood-map details",
      actions: [
        { title: "Check every relevant map for your address", description: "Use the city's hazard-map directory to find flood, landslide, earthquake, volcanic mudflow, and reservoir information for your home, work, or school. The city revised its flood hazard map in 2026, expanding mapped rivers and changing some evacuation locations, so use the current edition rather than an older printed map." },
        { title: "Follow current warnings and evacuation directions", description: "Identify the evacuation route and site shown for your location, then check current city alerts and instructions during an event. Confirm a site's availability and any changed access details before going; the city issues live disaster information separately from its planning maps." },
      ],
      sourceIds: ["yamagata-hazard-maps", "yamagata-flood-map-revision"], sourceFormatNote: "Yamagata City's hazard-map pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "yamagata-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Foreign-resident consultation and Japanese learning in Yamagata City", summary: "Yamagata City offers general and specialist foreign-resident consultation through its International Exchange Center and points residents to Japanese classes and interpretation services through the city international-exchange association.",
      applicability: "Confirm the center's current opening days, consultation languages, appointment arrangements, and class schedule before visiting or enrolling.", responsibleBody: "Yamagata City", receivingOffice: "International Exchange Center for consultation; Yamagata City International Exchange Association for language classes and interpreting information",
      actions: [
        { title: "Contact the foreign-resident consultation desk", description: "The city lists general help with city procedures, daily-life questions, parenting, and health, plus specialist consultation about matters such as residence status, marriage, inheritance, or bringing family to Japan. It identifies Japanese, English, Chinese, and Korean support and says other languages may be arranged by telephone reservation. Check the city's page for current hours and venue." },
        { title: "Ask about Japanese classes and interpreting support", description: "The city international-exchange directory links to its association for Japanese classes, exchange activities, and interpreting or translation services. Class schedules and service availability are managed by the provider; contact the association or center for current details and eligibility." },
      ],
      sourceIds: ["yamagata-foreign-resident-consultation", "yamagata-international-services"], sourceFormatNote: "Yamagata City's international-support pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "yamagata-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "National Pension procedures in Yamagata City", summary: "Yamagata City directs common enrollment, premium-relief, and student-payment-postponement filings to the city or Yamagata Pension Office, while other changes go through an employer or another office.",
      applicability: "Your route depends on your pension category and the event. Check whether you are covered through employment or a dependent spouse before contacting the municipal counter.", responsibleBody: "Yamagata City", receivingOffice: "Citizens Division National Pension Section or Yamagata Pension Office; an employer handles some dependent-category changes",
      actions: [
        { title: "Check whether a city filing is required after an employment change", description: "Yamagata City says enrollment at age 20 is automatic, while a person under 60 leaving a job generally needs to enroll through the city; a spouse who was dependent may also need a procedure. A person becoming a dependent spouse should contact that spouse's workplace instead. Confirm your category and required records with the responsible office." },
        { title: "Ask about premium relief or a student postponement", description: "The city directs applications for premium exemption or payment postponement, including the student system, to the city or Yamagata Pension Office. The records depend on your situation, so contact the relevant office before filing; do not treat a request as approved until you receive a decision." },
      ],
      sourceIds: ["yamagata-national-pension"], sourceFormatNote: "Yamagata City's pension page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
  ],
  recheck: [
    { kind: "dated", records: ["yamagata-address-registration"], from: "2026-11-02", change: "The city announced a change to its move-in counter hours beginning in November 2026.", action: "Confirm the current operating hours and any appointment or holiday arrangements after the announced change takes effect." },
    { kind: "dated", records: ["yamagata-household-waste"], from: "2026-03-01", change: "Online advance application for bulky-waste collection began in March 2026.", action: "Confirm online and telephone intake routes, item rules, payment, and collection instructions remain current." },
    { kind: "tax-year", records: ["yamagata-resident-tax"], statement: "Annual filing periods, exemptions, forms, required records, electronic and postal routes, and venues are tied to the tax year." },
    { kind: "dated", records: ["yamagata-disaster-preparation"], from: "2026-05-22", change: "The city published a revised flood hazard map in 2026, with expanded flood coverage and evacuation-location changes.", action: "Check the current address-level maps, evacuation locations, and live alert channels for later revisions." },
    { kind: "old-source", records: ["yamagata-language-and-consultation"], source: "yamagata-international-services", date: "not stated" },
    { kind: "gap", records: ["yamagata-language-and-consultation"], gap: "The city's directory links to a provider for Japanese classes and interpreting; current class dates, eligibility, and availability must be confirmed with that provider." },
    { kind: "gap", records: ["yamagata-national-pension"], gap: "The city page identifies filing routes but does not list all supporting records for each pension category and application; confirm the current checklist with the responsible office." },
  ],
});
