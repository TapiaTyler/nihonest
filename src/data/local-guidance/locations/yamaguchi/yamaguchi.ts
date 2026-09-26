import { defineLocationGuidance } from "@/data/local-guidance/define-location";

/** Yamaguchi City: researched local guidance. Workflow: docs/LOCAL-GUIDANCE-WORKFLOW.md. */
export const guidance = defineLocationGuidance({
  geography: { id: "jp-35203", name: "Yamaguchi City", aliases: ["Yamaguchi","Yamaguchi-shi"], planGroup: "prefectural-capital" },
  sources: [
    { id: "yamaguchi-address-registration", title: "Moving into Yamaguchi City from overseas or another municipality", url: "https://www.city.yamaguchi.lg.jp/site/shinsei/4855.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamaguchi-address-domestic-move", title: "Moving into Yamaguchi City from another municipality", url: "https://www.city.yamaguchi.lg.jp/site/shinsei/97805.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamaguchi-national-health-insurance", title: "Joining National Health Insurance after leaving employment or dependent coverage", url: "https://www.city.yamaguchi.lg.jp/soshiki/59/7152.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamaguchi-household-waste-rules", title: "Household waste set-out rules", url: "https://www.city.yamaguchi.lg.jp/site/gomisigen/161801.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamaguchi-household-waste-calendar", title: "FY2026 household waste calendars", url: "https://www.city.yamaguchi.lg.jp/site/gomisigen/188479.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamaguchi-resident-tax-filing", title: "FY2026 individual city and prefectural resident-tax filing", url: "https://www.city.yamaguchi.lg.jp/soshiki/10/51857.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamaguchi-resident-tax-overview", title: "Individual city and prefectural resident tax", url: "https://www.city.yamaguchi.lg.jp/soshiki/10/3171.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamaguchi-resident-tax-departure", title: "Resident tax payment when leaving Japan", url: "https://www.city.yamaguchi.lg.jp/soshiki/10/111373.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamaguchi-hazard-maps", title: "Yamaguchi City disaster guidebook and regional hazard maps", url: "https://www.city.yamaguchi.lg.jp/soshiki/4/83392.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamaguchi-shelters", title: "Shelter opening order and current site information", url: "https://www.city.yamaguchi.lg.jp/soshiki/4/106598.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamaguchi-japanese-classes", title: "Japanese classes for foreign residents", url: "https://www.city.yamaguchi.lg.jp/site/yasashiinihongo/5629.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamaguchi-foreign-consultation", title: "Foreign-resident consultation referral", url: "https://www.city.yamaguchi.lg.jp/site/yasashiinihongo/55646.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamaguchi-national-pension", title: "National Pension enrollment and withdrawal procedures", url: "https://www.city.yamaguchi.lg.jp/site/shinsei/7133.html", language: "ja", lastCheckedAt: "2026-09-26" },
    { id: "yamaguchi-pension-exemption", title: "National Pension exemption and payment postponement applications", url: "https://www.city.yamaguchi.lg.jp/site/shinsei/7197.html", language: "ja", lastCheckedAt: "2026-09-26" },
  ],
  supplements: [
    {
      id: "yamaguchi-address-registration", articleId: "registering-your-address-after-arrival", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Registering an address in Yamaguchi City", summary: "Yamaguchi City accepts address filings at the main General Counter Division, general branch service divisions, and selected community centers; foreign residents must use the main counter or a general branch.",
      applicability: "For people moving to Yamaguchi City. Choose the correct counter based on the move, residence status, and exact address.", responsibleBody: "Yamaguchi City", receivingOffice: "General Counter Division at City Hall, general branch service divisions, or an address-eligible community center",
      actions: [
        { title: "File after moving to your Yamaguchi address", description: "For a move from abroad, file within 14 days after the day you start living in Yamaguchi. Bring each person's passport if available; foreign residents should bring a residence card or Special Permanent Resident Certificate. The city lists original marriage or birth certificates with Japanese translations for certain family filings. For a domestic move, complete the former municipality's moving-out process first and bring its moving-out certificate unless using the My Number Card route." },
        { title: "Use the counter that accepts your filing", description: "Foreign residents must file at the main General Counter Division or a general branch service division. Other residents may use some community centers and additional local offices; the eligible locations depend on the address and filing. Ask the city about representative authority, household relationship documents, and the correct receiving counter before visiting." },
      ],
      sourceIds: ["yamaguchi-address-registration", "yamaguchi-address-domestic-move"], sourceFormatNote: "Yamaguchi City's procedure pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "yamaguchi-national-health-insurance", articleId: "joining-national-health-insurance", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "National Health Insurance in Yamaguchi City", summary: "Yamaguchi City lists a municipal counter network for joining National Health Insurance after employment or dependent coverage ends; check the current checklist because the detailed enrollment page is older.",
      applicability: "Use the municipal procedure after confirming National Health Insurance is the appropriate coverage option for your situation.", responsibleBody: "Yamaguchi City", receivingOffice: "Insurance and Pension Division, general branch service divisions, or eligible community centers and local offices",
      actions: [
        { title: "Bring proof of the previous insurance ending", description: "The city's procedure page for leaving employment or dependent coverage lists a certificate showing loss of health-insurance coverage, My Number records, and the visiting person's identity document. It says to apply within 14 days after the day following retirement. Ask the city whether this checklist or route has changed before filing." },
        { title: "Check your filing location and any representative filing", description: "The city lists the Insurance and Pension Division, general branch service divisions, selected community centers, branch facilities, and Omi General Center as counters. If you are filing during a move or on behalf of someone else, ask the city which records and location apply. The detailed enrollment information is dated 2018, so confirm current instructions directly." },
      ],
      sourceIds: ["yamaguchi-national-health-insurance"], sourceFormatNote: "Yamaguchi City's procedure page is in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "yamaguchi-household-waste", articleId: "sorting-household-waste-and-arranging-disposal", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Household waste in Yamaguchi City", summary: "Yamaguchi City uses shared collection stations rather than door-to-door collection, with district-specific calendars and some apartment-specific arrangements.",
      applicability: "Check the calendar and station rules for your address and ask the自治会 or building manager where your household may put waste.", responsibleBody: "Yamaguchi City", receivingOffice: "Resource Circulation Promotion Division for waste guidance; collection-station manager for the local drop-off point",
      actions: [
        { title: "Use the station and set-out time for your area", description: "The city says household waste is collected at designated stations, not individually. Ask the neighborhood association or apartment manager for permission and the correct station; do not use another association's station. Put items out by 8:30 a.m. on the calendar's collection day, or by 8:00 a.m. in Tokuchi and Ato. Some apartment buildings use private collection contracts and different rules." },
        { title: "Choose the right district guide and disposal route", description: "Use the current calendar and address-to-district chart; the city provides FY2026 calendars and multilingual sorting posters in English, Chinese, Korean, and Vietnamese. The city offers a sorting app and separate bulky-waste and facility-delivery procedures. Confirm the accepted item and current route in the city's guide before disposal." },
      ],
      sourceIds: ["yamaguchi-household-waste-rules", "yamaguchi-household-waste-calendar"], sourceFormatNote: "Yamaguchi City's waste pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "yamaguchi-resident-tax", articleId: "income-and-resident-tax-after-moving-to-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Resident tax in Yamaguchi City", summary: "Yamaguchi City bases individual resident tax on the January 1 address and provides tax-year-specific filing guidance and a procedure for arranging tax administration when leaving Japan.",
      applicability: "Check which municipality is responsible for the relevant tax year and confirm filing or payment steps from your notice and current city guidance.", responsibleBody: "Yamaguchi City", receivingOffice: "Individual Resident Tax Section, City Tax Division",
      actions: [
        { title: "Check the filing rules for your tax year", description: "Yamaguchi City says resident tax is based on the person's address on January 1 and the previous year's income. Its FY2026 filing page lists local filing venues, records, and exceptions; filing dates and locations vary by year and venue. Check the current-year page or ask the city which return and documents apply to you." },
        { title: "Arrange tax administration before leaving Japan", description: "The city says a taxpayer leaving Japan may need to appoint a tax administrator to receive notices and make payments on their behalf, unless notice receipt and payment can continue without one. Submit the city's tax-administrator form when needed and file the release form if returning to Japan. Confirm your individual notice, employer withholding, or payment arrangement with the city." },
      ],
      sourceIds: ["yamaguchi-resident-tax-filing", "yamaguchi-resident-tax-overview", "yamaguchi-resident-tax-departure"], sourceFormatNote: "Yamaguchi City's tax pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "yamaguchi-disaster-preparation", articleId: "preparing-for-disasters-and-evacuation-in-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Hazard maps and evacuation in Yamaguchi City", summary: "Yamaguchi City publishes regional hazard maps and current shelter information; which maps and facilities apply depends on the address and changing emergency conditions.",
      applicability: "Use the regional map for your address to plan ahead, then follow current city alerts and go only to a shelter the city has opened.", responsibleBody: "Yamaguchi City", receivingOffice: "Disaster Prevention and Crisis Management Division for city maps and emergency information",
      actions: [
        { title: "Open the map for your neighborhood", description: "The city's disaster guidebook groups maps by central, northern, eastern, western, Tokuchi, and Ato regions and links to web maps. Check the maps relevant to your exact home, work, and school addresses; a regional map does not replace current warnings or directions." },
        { title: "Check which evacuation shelter is open", description: "Yamaguchi City says regional exchange centers are generally opened first for voluntary evacuation in wind or flood events, followed by other facilities depending on local conditions and evacuee numbers. The opening order may change; check current city alerts and the latest shelter list before traveling when possible." },
      ],
      sourceIds: ["yamaguchi-hazard-maps", "yamaguchi-shelters"], sourceFormatNote: "Yamaguchi City's disaster pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "yamaguchi-language-and-consultation", articleId: "finding-japanese-language-and-local-support", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "Japanese classes and consultation for foreign residents in Yamaguchi City", summary: "Yamaguchi City posts seasonal Japanese classes for foreign residents and directs people seeking broader multilingual consultation to the Yamaguchi Prefecture International Association.",
      applicability: "Class dates and availability change by term. The consultation referral is to a prefectural provider, so confirm current languages, access, and services directly.", responsibleBody: "Yamaguchi City", receivingOffice: "International Exchange Division for Japanese class information; Yamaguchi Prefecture International Association for the multilingual consultation center",
      actions: [
        { title: "Check the current Japanese class term", description: "The city lists Japanese classes at Yamaguchi University and the Ajisu Community Exchange Center for foreign residents of Yamaguchi Prefecture. Terms, levels, schedules, fees, and textbooks differ by venue; check the current class notice and contact the city's International Exchange Division before applying." },
        { title: "Contact the referred multilingual consultation service", description: "The city links to the Yamaguchi Prefecture International Association's consultation service and provides its contact details. The city's referral page is dated 2023 and does not describe current language coverage, appointment rules, or scope. Confirm those details directly with the association before relying on the service." },
      ],
      sourceIds: ["yamaguchi-japanese-classes", "yamaguchi-foreign-consultation"], sourceFormatNote: "Yamaguchi City's foreign-resident pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
    {
      id: "yamaguchi-national-pension", articleId: "national-pension-after-moving-to-japan", lastCheckedAt: "2026-09-26", status: "needs-review",
      title: "National Pension procedures in Yamaguchi City", summary: "Yamaguchi City directs enrollment after leaving employee coverage and exemption or postponement applications to city counters, local branches, and the Yamaguchi Pension Office; some procedures also allow online filing.",
      applicability: "Check your pension category first. An employer or spouse's employer handles some category changes; municipal procedures apply only to the relevant circumstances.", responsibleBody: "Yamaguchi City", receivingOffice: "Insurance and Pension Division, eligible general branch and community-center counters, or Yamaguchi Pension Office",
      actions: [
        { title: "Report a change from employee coverage", description: "The city says a person leaving employee pension coverage needs to enroll in National Pension, and lists identity evidence, a Basic Pension Number record, and proof of the retirement date. A person becoming a dependent spouse applies through the spouse's employer. The city identifies municipal and pension-office counters and an online route for some filings; confirm the right process for your situation." },
        { title: "Ask about premium exemption or postponement", description: "Yamaguchi accepts exemption and payment-postponement requests at city and branch counters and the Yamaguchi Pension Office, and points to online filing. The city says applications generally cover a July-to-June year and are normally needed each year. The records depend on the reason; it lists identity and pension-number records and employment-loss evidence for unemployment cases. Approval comes after review." },
      ],
      sourceIds: ["yamaguchi-national-pension", "yamaguchi-pension-exemption"], sourceFormatNote: "Yamaguchi City's pension pages are in Japanese. This English summary is Nihonest guidance, not an official translation.",
    },
  ],
  recheck: [
    { kind: "old-source", records: ["yamaguchi-address-registration"], source: "yamaguchi-address-registration", date: "2025-04-01" },
    { kind: "old-source", records: ["yamaguchi-national-health-insurance"], source: "yamaguchi-national-health-insurance", date: "2018-02-22" },
    { kind: "dated", records: ["yamaguchi-household-waste"], from: "2026-07-16", change: "The city updated household waste set-out rules in July 2026.", action: "Recheck area collection times, stations, and apartment-specific arrangements against current instructions." },
    { kind: "dated", records: ["yamaguchi-household-waste"], from: "2026-01-27", change: "The FY2026 household calendar was corrected after an identified calendar error.", action: "Use the current corrected calendar and confirm the next fiscal-year district schedule." },
    { kind: "tax-year", records: ["yamaguchi-resident-tax"], statement: "Resident-tax filing dates, venues, records, and payment arrangements are tied to each tax year and the taxpayer's circumstances." },
    { kind: "dated", records: ["yamaguchi-disaster-preparation"], from: "2026-04-01", change: "The city's shelter opening-order information is dated and may change with conditions.", action: "Check current shelter lists, opening sequence, and live alerts before relying on a facility." },
    { kind: "old-source", records: ["yamaguchi-disaster-preparation"], source: "yamaguchi-hazard-maps", date: "2024-04-01" },
    { kind: "dated", records: ["yamaguchi-language-and-consultation"], from: "2026-03-02", change: "Japanese class schedules and terms are seasonal and the city updates course details.", action: "Check the current term, venue, fee, and enrollment instructions before attending." },
    { kind: "old-source", records: ["yamaguchi-language-and-consultation"], source: "yamaguchi-foreign-consultation", date: "2023-06-14" },
    { kind: "gap", records: ["yamaguchi-language-and-consultation"], gap: "The city referral page does not specify current languages, appointments, or scope for the prefectural consultation service; confirm with the provider." },
    { kind: "dated", records: ["yamaguchi-national-pension"], from: "2026-06-18", change: "The current pension exemption guidance is dated and annual application periods recur.", action: "Check current fiscal-period forms, evidence requirements, counters, and electronic application routes." },
  ],
});
